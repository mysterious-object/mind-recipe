package com.contextfield.mindrecipe

import android.content.Intent
import android.provider.CalendarContract
import android.provider.AlarmClock
import android.util.Log
import io.flutter.embedding.engine.plugins.FlutterPlugin
import io.flutter.plugin.common.MethodCall
import io.flutter.plugin.common.MethodChannel

/**
 * Mind Recipe Mobile Automation — Android side of
 * `contextfield.mindrecipe/mobile_automation`
 *
 * Branded from mobilerun's intent-driven patterns but intentionally
 * lightweight: uses ACTION_INSERT / AlarmClock intents so no
 * WRITE_CALENDAR permission is required. The system UI must be confirmed.
 *
 * Wire in MainActivity.kt:
 *   flutterEngine.plugins.add(MindRecipeMobileAutomationPlugin())
 *
 * Manifest additions (android/app/src/main/AndroidManifest.xml):
 * <queries>
 *   <intent><action android:name="android.intent.action.INSERT" /><data android:mimeType="vnd.android.cursor.dir/event" /></intent>
 *   <intent><action android:name="android.intent.action.SET_ALARM" /></intent>
 * </queries>
 */
class MindRecipeMobileAutomationPlugin : FlutterPlugin, MethodChannel.MethodCallHandler {
    private lateinit var channel: MethodChannel
    private var context: android.content.Context? = null

    override fun onAttachedToEngine(binding: FlutterPlugin.FlutterPluginBinding) {
        context = binding.applicationContext
        channel = MethodChannel(binding.binaryMessenger, "contextfield.mindrecipe/mobile_automation")
        channel.setMethodCallHandler(this)
    }

    override fun onMethodCall(call: MethodCall, result: MethodChannel.Result) {
        Log.d("MindRecipeAutomation", "request: ${call.method} args=${call.arguments}")
        val ctx = context
        if (ctx == null) {
            result.error("no_context", "Application context unavailable", null)
            return
        }
        try {
            when (call.method) {
                "capabilities" -> {
                    result.success(mapOf(
                        "platform" to "android",
                        "canInsertCalendarEvent" to true,
                        "canSetAlarm" to true,
                        "canAddReminder" to true,
                        "canOpenCalendar" to true,
                        "canInvokeShortcuts" to false,
                        "details" to mapOf("channel" to "contextfield.mindrecipe/mobile_automation")
                    ))
                }
                "setAppointment", "createCalendarEvent" -> handleSetAppointment(call, result, ctx)
                "openCalendar" -> handleOpenCalendar(call, result, ctx)
                "setReminder" -> handleSetReminder(call, result, ctx)
                "openReminders" -> handleOpenReminders(result, ctx)
                "setAlarm" -> handleSetAlarm(call, result, ctx)
                "invokeShortcut" -> handleInvokeShortcut(call, result, ctx)
                else -> result.notImplemented()
            }
        } catch (e: Exception) {
            Log.e("MindRecipeAutomation", "error in ${call.method}", e)
            result.error("exception", e.message, null)
        }
    }

    private fun handleSetAppointment(call: MethodCall, result: MethodChannel.Result, ctx: android.content.Context) {
        val title = call.argument<String>("title")?.trim().orEmpty()
        val description = call.argument<String>("description")
        val location = call.argument<String>("location")
        val begin = call.argument<Long>("beginMillis") ?: call.argument<Int>("beginMillis")?.toLong()
        val end = call.argument<Long>("endMillis") ?: call.argument<Int>("endMillis")?.toLong()
        val allDay = call.argument<Boolean>("allDay") ?: false
        val attendees = call.argument<List<String>>("attendees")

        if (title.isEmpty() || begin == null || end == null) {
            result.error("validation", "title/beginMillis/endMillis required", null)
            return
        }

        val intent = Intent(Intent.ACTION_INSERT).apply {
            data = CalendarContract.Events.CONTENT_URI
            putExtra(CalendarContract.Events.TITLE, title)
            if (!description.isNullOrBlank()) putExtra(CalendarContract.Events.DESCRIPTION, description)
            if (!location.isNullOrBlank()) putExtra(CalendarContract.Events.EVENT_LOCATION, location)
            putExtra(CalendarContract.EXTRA_EVENT_BEGIN_TIME, begin)
            putExtra(CalendarContract.EXTRA_EVENT_END_TIME, end)
            putExtra(CalendarContract.EXTRA_EVENT_ALL_DAY, allDay)
            putExtra(CalendarContract.Events.AVAILABILITY, CalendarContract.Events.AVAILABILITY_BUSY)
            if (!attendees.isNullOrEmpty()) putExtra(Intent.EXTRA_EMAIL, attendees.toTypedArray())
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }

        // Alarm minutes before: CalendarContract.EXTRA_EVENT_* doesn't support direct reminder;
        // For INSERT we can hint via CalendarContract.Reminders after insert would require WRITE_CALENDAR.
        // Keep intent minimal; the AlarmClock/reminder is separate method.

        ctx.startActivity(intent)
        result.success(mapOf(
            "success" to true,
            "code" to "intent_launched",
            "message" to "Opened calendar to save \"$title\" — confirm in the sheet.",
            "payload" to mapOf("title" to title, "beginMillis" to begin, "endMillis" to end)
        ))
    }

    private fun handleOpenCalendar(call: MethodCall, result: MethodChannel.Result, ctx: android.content.Context) {
        val epoch = call.argument<Long>("epochMillis") ?: System.currentTimeMillis()
        val uri = android.net.Uri.parse("content://com.android.calendar/time/$epoch")
        val intent = Intent(Intent.ACTION_VIEW).apply {
            data = uri
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        try {
            ctx.startActivity(intent)
            result.success(mapOf("success" to true, "code" to "intent_launched", "message" to "Opened calendar."))
        } catch (e: Exception) {
            // Fallback: generic calendar view
            val fallback = Intent(Intent.ACTION_VIEW).apply {
                data = CalendarContract.CONTENT_URI.buildUpon().appendPath("time").appendPath(epoch.toString()).build()
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            ctx.startActivity(fallback)
            result.success(mapOf("success" to true, "code" to "fallback_url", "message" to "Opened calendar (fallback)."))
        }
    }

    private fun handleSetReminder(call: MethodCall, result: MethodChannel.Result, ctx: android.content.Context) {
        // Android has no dedicated Reminders Intent; we reuse Calendar event with calendar-style reminder
        // or fall back to generic insert.
        val title = call.argument<String>("title")?.trim().orEmpty()
        val notes = call.argument<String>("notes")
        val dueMillis = call.argument<Long>("dueMillis") ?: call.argument<Int>("dueMillis")?.toLong()

        if (title.isEmpty()) {
            result.error("validation", "title required", null)
            return
        }

        val begin = dueMillis ?: System.currentTimeMillis()
        val end = begin + 3600_000L // +1h default

        val intent = Intent(Intent.ACTION_INSERT).apply {
            data = CalendarContract.Events.CONTENT_URI
            putExtra(CalendarContract.Events.TITLE, title)
            if (!notes.isNullOrBlank()) putExtra(CalendarContract.Events.DESCRIPTION, notes)
            putExtra(CalendarContract.EXTRA_EVENT_BEGIN_TIME, begin)
            putExtra(CalendarContract.EXTRA_EVENT_END_TIME, end)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        ctx.startActivity(intent)
        result.success(mapOf(
            "success" to true,
            "code" to "intent_launched",
            "message" to "Opened calendar to save reminder \"$title\" — confirm in the sheet.",
            "payload" to mapOf("title" to title, "dueMillis" to dueMillis)
        ))
    }

    private fun handleOpenReminders(result: MethodChannel.Result, ctx: android.content.Context) {
        // Try Google Tasks / Keep / Calendar — fall back to Play Store search if none
        val intents = listOf(
            Intent(Intent.ACTION_VIEW).apply { data = android.net.Uri.parse("content://com.android.calendar/time/${System.currentTimeMillis()}"); addFlags(Intent.FLAG_ACTIVITY_NEW_TASK) },
        )
        for (intent in intents) {
            try { ctx.startActivity(intent); result.success(mapOf("success" to true, "code" to "intent_launched", "message" to "Opened calendar/reminders.")); return } catch (_: Exception) {}
        }
        result.error("unavailable", "No reminders app found", null)
    }

    private fun handleSetAlarm(call: MethodCall, result: MethodChannel.Result, ctx: android.content.Context) {
        val hour = call.argument<Int>("hour") ?: return result.error("validation","hour required",null)
        val minute = call.argument<Int>("minute") ?: 0
        val label = call.argument<String>("label")
        val skipUi = call.argument<Boolean>("skipUi") ?: false
        val days = call.argument<List<Int>>("daysOfWeek")

        if (hour !in 0..23 || minute !in 0..59) {
            result.error("validation", "hour 0-23 minute 0-59", null); return
        }

        val intent = Intent(AlarmClock.ACTION_SET_ALARM).apply {
            putExtra(AlarmClock.EXTRA_HOUR, hour)
            putExtra(AlarmClock.EXTRA_MINUTES, minute)
            if (!label.isNullOrBlank()) putExtra(AlarmClock.EXTRA_MESSAGE, label)
            putExtra(AlarmClock.EXTRA_SKIP_UI, skipUi)
            putExtra(AlarmClock.EXTRA_VIBRATE, call.argument<Boolean>("vibrate") ?: true)
            if (!days.isNullOrEmpty()) {
                // AlarmClock.EXTRA_DAYS expects ArrayList<Integer> of Calendar constants
                // Convert 1=Mon..7=Sun → Calendar.MONDAY=2..SUNDAY=1
                val calDays = ArrayList(days.map { d ->
                    when (d) {
                        1 -> java.util.Calendar.MONDAY
                        2 -> java.util.Calendar.TUESDAY
                        3 -> java.util.Calendar.WEDNESDAY
                        4 -> java.util.Calendar.THURSDAY
                        5 -> java.util.Calendar.FRIDAY
                        6 -> java.util.Calendar.SATURDAY
                        7 -> java.util.Calendar.SUNDAY
                        else -> d
                    }
                })
                putExtra(AlarmClock.EXTRA_DAYS, calDays)
            }
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }

        // Verify at least one alarm app can handle it
        if (intent.resolveActivity(ctx.packageManager) == null) {
            result.error("unavailable", "No alarm app handles ACTION_SET_ALARM", null); return
        }
        ctx.startActivity(intent)
        result.success(mapOf(
            "success" to true,
            "code" to "intent_launched",
            "message" to "Opened Clock to set alarm ${"%02d:%02d".format(hour, minute)}${if (label != null) " — $label" else ""} — confirm in the sheet.",
            "payload" to mapOf("hour" to hour, "minute" to minute, "label" to label)
        ))
    }

    private fun handleInvokeShortcut(call: MethodCall, result: MethodChannel.Result, ctx: android.content.Context) {
        val name = call.argument<String>("name")?.trim().orEmpty()
        if (name.isEmpty()) { result.error("validation","name required",null); return }
        // Generic: broadcast or implicit intent with action name
        val intent = Intent(name).apply {
            // Pass input map as extras if provided
            val input = call.argument<Map<String, Any>>("input")
            input?.forEach { (k,v) -> putExtra(k, v.toString()) }
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        try {
            if (intent.resolveActivity(ctx.packageManager) != null) {
                ctx.startActivity(intent)
                result.success(mapOf("success" to true, "code" to "intent_launched", "message" to "Opened shortcut \"$name\"."))
            } else {
                // Try broadcast
                ctx.sendBroadcast(intent)
                result.success(mapOf("success" to true, "code" to "broadcast", "message" to "Broadcast shortcut \"$name\"."))
            }
        } catch (e: Exception) {
            result.error("unavailable", "Shortcut \"$name\" not found: ${e.message}", null)
        }
    }

    override fun onDetachedFromEngine(binding: FlutterPlugin.FlutterPluginBinding) {
        channel.setMethodCallHandler(null)
        context = null
    }
}
