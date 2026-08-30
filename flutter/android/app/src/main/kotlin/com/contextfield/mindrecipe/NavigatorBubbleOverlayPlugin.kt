package com.contextfield.mindrecipe

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.graphics.PixelFormat
import android.net.Uri
import android.os.Build
import android.provider.Settings
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import io.flutter.embedding.engine.plugins.FlutterPlugin
import io.flutter.embedding.engine.plugins.activity.ActivityAware
import io.flutter.embedding.engine.plugins.activity.ActivityPluginBinding
import io.flutter.plugin.common.MethodCall
import io.flutter.plugin.common.MethodChannel
import io.flutter.plugin.common.PluginRegistry

/** System overlay for Navigator chat bubble — stays on home screen / other apps when granted. */
class NavigatorBubbleOverlayPlugin : FlutterPlugin, MethodChannel.MethodCallHandler, ActivityAware,
    PluginRegistry.ActivityResultListener {

    private lateinit var channel: MethodChannel
    private var context: Context? = null
    private var activity: Activity? = null
    private var windowManager: WindowManager? = null
    private var bubbleView: View? = null
    private var overlayPermissionResult: MethodChannel.Result? = null
    private val overlayRequestCode = 9912

    override fun onAttachedToEngine(binding: FlutterPlugin.FlutterPluginBinding) {
        context = binding.applicationContext
        windowManager = binding.applicationContext.getSystemService(Context.WINDOW_SERVICE) as WindowManager
        channel = MethodChannel(binding.binaryMessenger, "contextfield.mindrecipe/bubble_overlay")
        channel.setMethodCallHandler(this)
    }

    override fun onDetachedFromEngine(binding: FlutterPlugin.FlutterPluginBinding) {
        hideBubble()
        channel.setMethodCallHandler(null)
        context = null
        windowManager = null
    }

    override fun onMethodCall(call: MethodCall, result: MethodChannel.Result) {
        when (call.method) {
            "hasOverlayPermission" -> {
                val ctx = context
                if (ctx == null) { result.success(false); return }
                result.success(Settings.canDrawOverlays(ctx))
            }
            "requestOverlayPermission" -> {
                val act = activity
                val ctx = context
                if (act == null || ctx == null) { result.error("NO_ACTIVITY", "No activity", null); return }
                if (Settings.canDrawOverlays(ctx)) { result.success(true); return }
                overlayPermissionResult = result
                try {
                    val intent = Intent(
                        Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:${ctx.packageName}")
                    )
                    act.startActivityForResult(intent, overlayRequestCode)
                } catch (e: Exception) {
                    overlayPermissionResult = null
                    result.error("INTENT_FAILED", e.message, null)
                }
            }
            "showBubble" -> {
                val text = call.argument<String>("text") ?: ""
                val isSpeaking = call.argument<Boolean>("isSpeaking") ?: false
                val isListening = call.argument<Boolean>("isListening") ?: false
                val snippet = call.argument<String>("snippet")
                val success = showBubble(snippet ?: text, isSpeaking, isListening)
                result.success(success)
            }
            "hideBubble" -> {
                hideBubble()
                result.success(true)
            }
            "isShowing" -> result.success(bubbleView != null)
            else -> result.notImplemented()
        }
    }

    private fun showBubble(text: String, isSpeaking: Boolean, isListening: Boolean): Boolean {
        val ctx = context ?: return false
        if (!Settings.canDrawOverlays(ctx)) return false
        val wm = windowManager ?: return false
        // Remove existing first
        hideBubble()

        val density = ctx.resources.displayMetrics.density

        // Container
        val container = LinearLayout(ctx).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding((14*density).toInt(), (10*density).toInt(), (10*density).toInt(), (10*density).toInt())
            // Background with rounded corners via drawable
            background = android.graphics.drawable.GradientDrawable().apply {
                shape = android.graphics.drawable.GradientDrawable.RECTANGLE
                cornerRadius = 22 * density
                setColor(android.graphics.Color.parseColor("#F2E7FFFB")) // primaryContainer-like
                setStroke((1*density).toInt(), android.graphics.Color.parseColor("#3300E5CC"))
            }
            elevation = 12 * density
        }

        // Orb badge (simple colored circle)
        val orb = View(ctx).apply {
            layoutParams = LinearLayout.LayoutParams((26*density).toInt(), (26*density).toInt()).apply {
                marginEnd = (10*density).toInt()
            }
            background = android.graphics.drawable.GradientDrawable().apply {
                shape = android.graphics.drawable.GradientDrawable.OVAL
                colors = intArrayOf(
                    android.graphics.Color.parseColor("#FF00E5CC"),
                    android.graphics.Color.parseColor("#FF7C3AED")
                )
                gradientType = android.graphics.drawable.GradientDrawable.RADIAL_GRADIENT
                gradientRadius = 26 * density
            }
        }

        val textContainer = LinearLayout(ctx).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f)
        }

        val titleText = when {
            isSpeaking -> "Navigator is speaking…"
            isListening -> "Navigator is listening…"
            else -> "Navigator replied — tap to view"
        }
        val title = TextView(ctx).apply {
            setText(titleText)
            setTextColor(android.graphics.Color.parseColor("#FF1A1A1A"))
            textSize = 13f
            setTypeface(null, android.graphics.Typeface.BOLD)
        }
        val snippetView = TextView(ctx).apply {
            val display = if (text.length > 92) text.take(92) + "…" else text
            setText(if (display.isBlank()) "Tap to return to chat" else display)
            setTextColor(android.graphics.Color.parseColor("#FF333333"))
            textSize = 11f
            maxLines = 2
            ellipsize = android.text.TextUtils.TruncateAt.END
        }
        textContainer.addView(title)
        textContainer.addView(snippetView)

        val closeBtn = TextView(ctx).apply {
            setText("✕")
            textSize = 16f
            setTextColor(android.graphics.Color.parseColor("#FF555555"))
            setPadding((8*density).toInt(), (4*density).toInt(), (4*density).toInt(), (4*density).toInt())
            isClickable = true
            isFocusable = true
            setOnClickListener { hideBubble() }
        }
        val chevron = TextView(ctx).apply {
            setText("›")
            textSize = 18f
            setTextColor(android.graphics.Color.parseColor("#FF555555"))
            setPadding((4*density).toInt(), 0, 0, 0)
        }

        container.addView(orb)
        container.addView(textContainer)
        container.addView(closeBtn)
        container.addView(chevron)

        // Tap to open app
        container.isClickable = true
        container.isFocusable = true
        container.setOnClickListener {
            val launchIntent = ctx.packageManager.getLaunchIntentForPackage(ctx.packageName)?.apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP
            }
            if (launchIntent != null) ctx.startActivity(launchIntent)
        }

        // Drag handling
        val params = WindowManager.LayoutParams(
            (WindowManager.LayoutParams.MATCH_PARENT),
            WindowManager.LayoutParams.WRAP_CONTENT,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY else @Suppress("DEPRECATION") WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS or WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL or WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
            y = (24 * density).toInt()
            x = 0
        }

        var initialX = 0
        var initialY = 0
        var initialTouchX = 0f
        var initialTouchY = 0f
        var isDragging = false

        container.setOnTouchListener { _, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    initialX = params.x
                    initialY = params.y
                    initialTouchX = event.rawX
                    initialTouchY = event.rawY
                    isDragging = false
                    false
                }
                MotionEvent.ACTION_MOVE -> {
                    val dx = (event.rawX - initialTouchX).toInt()
                    val dy = (initialTouchY - event.rawY).toInt() // invert for bottom gravity
                    if (kotlin.math.abs(dx) > 8 || kotlin.math.abs(dy) > 8) isDragging = true
                    params.x = initialX + dx
                    params.y = initialY + dy
                    try { wm.updateViewLayout(container, params) } catch (_: Exception) {}
                    true
                }
                MotionEvent.ACTION_UP -> {
                    if (isDragging) true else false
                }
                else -> false
            }
        }

        try {
            wm.addView(container, params)
            bubbleView = container
            return true
        } catch (e: Exception) {
            return false
        }
    }

    private fun hideBubble() {
        val wm = windowManager
        val v = bubbleView
        if (wm != null && v != null) {
            try { wm.removeViewImmediate(v) } catch (_: Exception) {
                try { wm.removeView(v) } catch (_: Exception) {}
            }
        }
        bubbleView = null
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?): Boolean {
        if (requestCode == overlayRequestCode) {
            val ctx = context
            val granted = ctx != null && Settings.canDrawOverlays(ctx)
            overlayPermissionResult?.success(granted)
            overlayPermissionResult = null
            return true
        }
        return false
    }

    override fun onAttachedToActivity(binding: ActivityPluginBinding) {
        activity = binding.activity
        binding.addActivityResultListener(this)
    }
    override fun onDetachedFromActivityForConfigChanges() { activity = null }
    override fun onReattachedToActivityForConfigChanges(binding: ActivityPluginBinding) { activity = binding.activity; binding.addActivityResultListener(this) }
    override fun onDetachedFromActivity() { activity = null; hideBubble() }
}
