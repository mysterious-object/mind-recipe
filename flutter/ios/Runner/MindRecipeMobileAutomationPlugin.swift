import Flutter
import UIKit
import EventKit

/// Mind Recipe Mobile Automation — iOS side of
/// `contextfield.mindrecipe/mobile_automation`
///
/// Two paths:
///  A) EventKit (when authorized) — direct EKEvent/EKReminder creation with reminder alert.
///  B) URL scheme fallback — no permission needed, opens Calendar/Shortcuts app for member to confirm.
///
/// Branded from mobilerun's portal patterns but adapted for iOS sandbox:
/// iOS has no public alarm API; alarm requests route to Shortcuts `Create Alarm` or Clock.
///
/// Wiring:
///   1. Copy this file to ios/Runner/MindRecipeMobileAutomationPlugin.swift
///   2. Register in AppDelegate.swift:
///        GeneratedPluginRegistrant.register(with: self)
///        MindRecipeMobileAutomationPlugin.register(with: registrar(forPlugin: "mind_recipe_mobile_automation"))
///      Or add via FlutterPluginRegistrant if using Swift AppDelegate.
///   3. Add Info.plist keys from Info.plist.additions.xml
///   4. `LSApplicationQueriesSchemes` for shortcuts:// etc.

public class MindRecipeMobileAutomationPlugin: NSObject, FlutterPlugin {
    private let eventStore = EKEventStore()
    private static var fullAccessAvailable: Bool {
        if #available(iOS 17.0, *) { return true }
        return false
    }

    private static let channelName = "contextfield.mindrecipe/mobile_automation"

    public static func register(with registrar: FlutterPluginRegistrar) {
        let channel = FlutterMethodChannel(name: channelName, binaryMessenger: registrar.messenger())
        let instance = MindRecipeMobileAutomationPlugin()
        registrar.addMethodCallDelegate(instance, channel: channel)
    }

    public func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
        switch call.method {
        case "capabilities":
            result([
                "platform": "ios",
                "canInsertCalendarEvent": true,
                "canSetAlarm": false, // no public API; via Shortcuts only
                "canAddReminder": true,
                "canOpenCalendar": true,
                "canInvokeShortcuts": true,
                "details": ["channel": Self.channelName]
            ])
        case "setAppointment", "createCalendarEvent":
            handleSetAppointment(call: call, result: result)
        case "openCalendar":
            handleOpenCalendar(call: call, result: result)
        case "setReminder":
            handleSetReminder(call: call, result: result)
        case "openReminders":
            handleOpenReminders(result: result)
        case "setAlarm":
            handleSetAlarm(call: call, result: result)
        case "invokeShortcut":
            handleInvokeShortcut(call: call, result: result)
        default:
            result(FlutterMethodNotImplemented)
        }
    }

    // MARK: - Calendar / appointment

    private func handleSetAppointment(call: FlutterMethodCall, result: @escaping FlutterResult) {
        guard let args = call.arguments as? [String: Any],
              let title = args["title"] as? String, !title.trimmingCharacters(in: .whitespaces).isEmpty,
              let beginMillis = args["beginMillis"] as? NSNumber,
              let endMillis = args["endMillis"] as? NSNumber else {
            result(FlutterError(code: "validation", message: "title/beginMillis/endMillis required", details: nil))
            return
        }
        let start = Date(timeIntervalSince1970: beginMillis.doubleValue / 1000.0)
        let end = Date(timeIntervalSince1970: endMillis.doubleValue / 1000.0)
        let description = args["description"] as? String
        let location = args["location"] as? String
        let allDay = args["allDay"] as? Bool ?? false
        let alarmMinutes = args["alarmMinutesBefore"] as? NSNumber

        // Try EventKit if we can get access; else fall back to URL
        let status = EKEventStore.authorizationStatus(for: .event)
        if status == .notDetermined {
            if #available(iOS 17.0, *) {
                eventStore.requestFullAccessToEvents { granted, error in
                    DispatchQueue.main.async {
                        if granted { self.insertEvent(title: title, start: start, end: end, description: description, location: location, allDay: allDay, alarmMinutes: alarmMinutes?.intValue, result: result) }
                        else { self.fallbackOpenCalendar(date: start, payload: args, result: result) }
                    }
                }
            } else {
                eventStore.requestAccess(to: .event) { granted, error in
                    DispatchQueue.main.async {
                        if granted { self.insertEvent(title: title, start: start, end: end, description: description, location: location, allDay: allDay, alarmMinutes: alarmMinutes?.intValue, result: result) }
                        else { self.fallbackOpenCalendar(date: start, payload: args, result: result) }
                    }
                }
            }
            return
        } else if status == .authorized || (status == .fullAccess && Self.fullAccessAvailable) {
            insertEvent(title: title, start: start, end: end, description: description, location: location, allDay: allDay, alarmMinutes: alarmMinutes?.intValue, result: result)
            return
        } else {
            // denied / restricted → URL fallback, no permission prompt
            fallbackOpenCalendar(date: start, payload: args, result: result)
        }
    }

    private func insertEvent(title: String, start: Date, end: Date, description: String?, location: String?, allDay: Bool, alarmMinutes: Int?, result: @escaping FlutterResult) {
        let event = EKEvent(eventStore: eventStore)
        event.title = title
        event.startDate = start
        event.endDate = end
        event.notes = description
        event.location = location
        event.isAllDay = allDay
        event.calendar = eventStore.defaultCalendarForNewEvents
        if let mins = alarmMinutes {
            // EKAlarm relativeOffset is negative seconds before start
            event.addAlarm(EKAlarm(relativeOffset: TimeInterval(-mins * 60)))
        }
        do {
            try eventStore.save(event, span: .thisEvent, commit: true)
            result(["success": true, "code": "eventkit_inserted", "message": "Added \"\(title)\" to Calendar.", "payload": ["title": title]])
        } catch {
            // On failure, fall back to opening Calendar so member can add manually
            fallbackOpenCalendar(date: start, payload: ["title": title], result: result)
        }
    }

    private func fallbackOpenCalendar(date: Date, payload: [String: Any], result: @escaping FlutterResult) {
        // Try calshow: (seconds since reference? Apple uses unix time for calshow:)
        let epochSec = Int(date.timeIntervalSince1970)
        let urls = [
            URL(string: "calshow:\(epochSec)"),
            URL(string: "x-apple-calevent://"),
            URL(string: "shortcuts://run-shortcut?name=AddCalendarEvent&input=\(titleEncoded(payload))"),
        ].compactMap { $0 }

        for url in urls {
            if UIApplication.shared.canOpenURL(url) {
                UIApplication.shared.open(url, options: [:]) { ok in
                    result(["success": ok, "code": ok ? "fallback_url" : "unavailable", "message": ok ? "Opened Calendar so you can add it manually." : "Could not open Calendar.", "payload": payload])
                }
                return
            }
        }
        result(["success": false, "code": "unavailable", "message": "Calendar permission denied. Open Calendar manually to add \"\(payload["title"] ?? "event")\".", "payload": payload])
    }

    private func titleEncoded(_ payload: [String: Any]) -> String {
        let t = (payload["title"] as? String) ?? "Mind Recipe"
        return t.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "Mind%20Recipe"
    }

    private func handleOpenCalendar(call: FlutterMethodCall, result: @escaping FlutterResult) {
        let args = call.arguments as? [String: Any]
        let epochMillis = args?["epochMillis"] as? NSNumber
        let date = epochMillis.map { Date(timeIntervalSince1970: $0.doubleValue/1000) } ?? Date()
        fallbackOpenCalendar(date: date, payload: [:], result: result)
    }

    // MARK: - Reminders

    private func handleSetReminder(call: FlutterMethodCall, result: @escaping FlutterResult) {
        guard let args = call.arguments as? [String: Any],
              let title = args["title"] as? String, !title.trimmingCharacters(in: .whitespaces).isEmpty else {
            result(FlutterError(code: "validation", message: "title required", details: nil)); return
        }
        let dueMillis = args["dueMillis"] as? NSNumber
        let dueDate = dueMillis.map { Date(timeIntervalSince1970: $0.doubleValue/1000) }
        let notes = args["notes"] as? String
        let alarmMinutes = args["alarmMinutesBefore"] as? NSNumber

        let status = EKEventStore.authorizationStatus(for: .reminder)
        if status == .notDetermined {
            if #available(iOS 17.0, *) {
                eventStore.requestFullAccessToReminders { granted, _ in
                    DispatchQueue.main.async {
                        if granted { self.insertReminder(title: title, dueDate: dueDate, notes: notes, alarmMinutes: alarmMinutes?.intValue, result: result) }
                        else { self.fallbackOpenReminders(payload: args, result: result) }
                    }
                }
            } else {
                eventStore.requestAccess(to: .reminder) { granted, _ in
                    DispatchQueue.main.async {
                        if granted { self.insertReminder(title: title, dueDate: dueDate, notes: notes, alarmMinutes: alarmMinutes?.intValue, result: result) }
                        else { self.fallbackOpenReminders(payload: args, result: result) }
                    }
                }
            }
            return
        } else if status == .authorized || (status == .fullAccess && Self.fullAccessAvailable) {
            insertReminder(title: title, dueDate: dueDate, notes: notes, alarmMinutes: alarmMinutes?.intValue, result: result)
        } else {
            fallbackOpenReminders(payload: args, result: result)
        }
    }

    private func insertReminder(title: String, dueDate: Date?, notes: String?, alarmMinutes: Int?, result: @escaping FlutterResult) {
        let reminder = EKReminder(eventStore: eventStore)
        reminder.title = title
        reminder.notes = notes
        reminder.calendar = eventStore.defaultCalendarForNewReminders()
        if let d = dueDate {
            reminder.dueDateComponents = Calendar.current.dateComponents([.year,.month,.day,.hour,.minute], from: d)
            if let mins = alarmMinutes {
                reminder.addAlarm(EKAlarm(absoluteDate: d.addingTimeInterval(TimeInterval(-mins*60))))
            } else {
                reminder.addAlarm(EKAlarm(absoluteDate: d))
            }
        }
        do {
            try eventStore.save(reminder, commit: true)
            result(["success": true, "code": "eventkit_inserted", "message": "Added reminder \"\(title)\".", "payload": ["title": title]])
        } catch {
            fallbackOpenReminders(payload: ["title": title], result: result)
        }
    }

    private func handleOpenReminders(result: @escaping FlutterResult) {
        fallbackOpenReminders(payload: [:], result: result)
    }

    private func fallbackOpenReminders(payload: [String: Any], result: @escaping FlutterResult) {
        let urls = [
            URL(string: "x-apple-reminderkit://"),
            URL(string: "shortcuts://run-shortcut?name=AddReminder"),
        ].compactMap { $0 }
        for url in urls {
            if UIApplication.shared.canOpenURL(url) {
                UIApplication.shared.open(url, options: [:]) { ok in
                    result(["success": ok, "code": ok ? "fallback_url" : "unavailable", "message": ok ? "Opened Reminders so you can add it manually." : "Could not open Reminders.", "payload": payload])
                }
                return
            }
        }
        result(["success": false, "code": "unavailable", "message": "Reminders permission denied. Open Reminders manually.", "payload": payload])
    }

    // MARK: - Alarm (no public API)

    private func handleSetAlarm(call: FlutterMethodCall, result: @escaping FlutterResult) {
        let args = call.arguments as? [String: Any] ?? [:]
        let label = args["label"] as? String ?? "Mind Recipe"
        // Best effort: Shortcuts "Create Alarm" — user must have that shortcut installed.
        let encoded = label.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "Mind%20Recipe"
        let candidates = [
            URL(string: "shortcuts://run-shortcut?name=Create%20Alarm&input=\(encoded)"),
            URL(string: "shortcuts://run-shortcut?name=CreateAlarm&input=\(encoded)"),
            URL(string: "clock-alarm://"),
        ].compactMap { $0 }

        for url in candidates {
            if UIApplication.shared.canOpenURL(url) {
                UIApplication.shared.open(url, options: [:]) { ok in
                    result(["success": ok, "code": ok ? "fallback_url" : "unavailable", "message": ok ? "Opened Shortcuts to create an alarm for \"\(label)\" — confirm there." : "Could not open Shortcuts.", "payload": args])
                }
                return
            }
        }
        result(["success": false, "code": "unavailable", "message": "iOS cannot set alarms silently. Create a Shortcuts automation named \"Create Alarm\" or set it in Clock.", "payload": args])
    }

    // MARK: - Shortcuts escape hatch

    private func handleInvokeShortcut(call: FlutterMethodCall, result: @escaping FlutterResult) {
        guard let args = call.arguments as? [String: Any], let name = args["name"] as? String, !name.isEmpty else {
            result(FlutterError(code: "validation", message: "name required", details: nil)); return
        }
        let encoded = name.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? name
        let url = URL(string: "shortcuts://run-shortcut?name=\(encoded)")!
        if UIApplication.shared.canOpenURL(url) {
            UIApplication.shared.open(url, options: [:]) { ok in
                result(["success": ok, "code": ok ? "fallback_url" : "unavailable", "message": ok ? "Opened Shortcut \"\(name)\"." : "Could not open Shortcuts.", "payload": args])
            }
        } else {
            result(["success": false, "code": "unavailable", "message": "Shortcuts app not available.", "payload": args])
        }
    }
}
