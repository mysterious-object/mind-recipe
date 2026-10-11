import Flutter
import UIKit
import EventKit
import EventKitUI

/// MindRecipe native actions. Calendar uses the OS editor; Reminders saves
/// only after the in-app review and permission grant. Unsupported adapters
/// fail explicitly, without running guessed user shortcuts.

public class MindRecipeMobileAutomationPlugin: NSObject, FlutterPlugin, EKEventEditViewDelegate {
    private let eventStore = EKEventStore()
    private var pendingCalendarResult: FlutterResult?
    private static func isFullAccess(_ status: EKAuthorizationStatus) -> Bool {
        if #available(iOS 17.0, *) {
            return status == .fullAccess
        }
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
                "canSetAlarm": false, // No supported alarm adapter in this build.
                "canAddReminder": true,
                "canOpenCalendar": UIApplication.shared.canOpenURL(URL(string: "calshow:")!),
                "canInvokeShortcuts": false,
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
            result(["success": false, "code": "unsupported", "message": "This build cannot set an iPhone alarm. Set it in Clock; no alarm was created."])
        case "invokeShortcut":
            result(["success": false, "code": "unsupported", "message": "This shortcut is not in the supported app catalog."])
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
        guard end > start else {
            result(FlutterError(code: "validation", message: "The end must be after the start.", details: nil))
            return
        }
        let description = args["description"] as? String
        let location = args["location"] as? String
        let allDay = args["allDay"] as? Bool ?? false
        let alarmMinutes = args["alarmMinutesBefore"] as? NSNumber

        // iOS 17+ allows the native editor without broad calendar access.
        if #available(iOS 17.0, *) {
            presentEventEditor(title: title, start: start, end: end, description: description, location: location, allDay: allDay, alarmMinutes: alarmMinutes?.intValue, result: result)
            return
        }
        let status = EKEventStore.authorizationStatus(for: .event)
        if status == .notDetermined {
            eventStore.requestAccess(to: .event) { granted, _ in
                DispatchQueue.main.async {
                    if granted { self.presentEventEditor(title: title, start: start, end: end, description: description, location: location, allDay: allDay, alarmMinutes: alarmMinutes?.intValue, result: result) }
                    else { result(["success": false, "code": "permission_denied", "message": "Calendar access was not granted. No event was created."]) }
                }
            }
            return
        } else if status == .authorized || Self.isFullAccess(status) {
            presentEventEditor(title: title, start: start, end: end, description: description, location: location, allDay: allDay, alarmMinutes: alarmMinutes?.intValue, result: result)
            return
        } else {
            result(["success": false, "code": "permission_denied", "message": "Calendar access was not granted. No event was created."])
        }
    }

    private func presentEventEditor(title: String, start: Date, end: Date, description: String?, location: String?, allDay: Bool, alarmMinutes: Int?, result: @escaping FlutterResult) {
        guard pendingCalendarResult == nil else {
            result(["success": false, "code": "busy", "message": "Finish the open calendar review first."])
            return
        }
        let scenes = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }
        guard let root = scenes.filter({ $0.activationState == .foregroundActive })
            .flatMap({ $0.windows }).first(where: { $0.isKeyWindow })?.rootViewController else {
            result(["success": false, "code": "unavailable", "message": "Open MindRecipe before reviewing the event."])
            return
        }
        var presenter = root
        while let presented = presenter.presentedViewController { presenter = presented }
        let event = EKEvent(eventStore: eventStore)
        event.title = title
        event.startDate = start
        event.endDate = end
        event.notes = description
        event.location = location
        event.isAllDay = allDay
        if let mins = alarmMinutes {
            // EKAlarm relativeOffset is negative seconds before start
            event.addAlarm(EKAlarm(relativeOffset: TimeInterval(-mins * 60)))
        }
        let editor = EKEventEditViewController()
        editor.eventStore = eventStore
        editor.event = event
        editor.editViewDelegate = self
        editor.isModalInPresentation = true
        pendingCalendarResult = result
        presenter.present(editor, animated: true)
    }

    public func eventEditViewController(_ controller: EKEventEditViewController, didCompleteWith action: EKEventEditViewAction) {
        let callback = pendingCalendarResult
        pendingCalendarResult = nil
        controller.dismiss(animated: true) {
            let saved = action == .saved
            callback?(["success": saved, "code": saved ? "eventkit_saved" : "cancelled", "message": saved ? "Calendar confirmed the event was saved." : "Calendar review cancelled. No new event was saved."])
        }
    }

    private func fallbackOpenCalendar(date: Date, payload: [String: Any], result: @escaping FlutterResult) {
        let epochSec = Int(date.timeIntervalSinceReferenceDate)
        let urls = [
            URL(string: "calshow:\(epochSec)"),
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
                        else { result(["success": false, "code": "permission_denied", "message": "Reminders access was not granted. No reminder was created."]) }
                    }
                }
            } else {
                eventStore.requestAccess(to: .reminder) { granted, _ in
                    DispatchQueue.main.async {
                        if granted { self.insertReminder(title: title, dueDate: dueDate, notes: notes, alarmMinutes: alarmMinutes?.intValue, result: result) }
                        else { result(["success": false, "code": "permission_denied", "message": "Reminders access was not granted. No reminder was created."]) }
                    }
                }
            }
            return
        } else if status == .authorized || Self.isFullAccess(status) {
            insertReminder(title: title, dueDate: dueDate, notes: notes, alarmMinutes: alarmMinutes?.intValue, result: result)
        } else {
            result(["success": false, "code": "permission_denied", "message": "Reminders access was not granted. No reminder was created."])
        }
    }

    private func insertReminder(title: String, dueDate: Date?, notes: String?, alarmMinutes: Int?, result: @escaping FlutterResult) {
        let reminder = EKReminder(eventStore: eventStore)
        reminder.title = title
        reminder.notes = notes
        guard let calendar = eventStore.defaultCalendarForNewReminders() else {
            result(["success": false, "code": "unavailable", "message": "No writable Reminders list is available. No reminder was created."])
            return
        }
        reminder.calendar = calendar
        if let d = dueDate {
            reminder.dueDateComponents = Calendar.current.dateComponents([.year,.month,.day,.hour,.minute], from: d)
            reminder.dueDateComponents?.timeZone = TimeZone.current
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
            result(["success": false, "code": "save_failed", "message": "Reminders could not save this item. Please retry."])
        }
    }

    private func handleOpenReminders(result: @escaping FlutterResult) {
        fallbackOpenReminders(payload: [:], result: result)
    }

    private func fallbackOpenReminders(payload: [String: Any], result: @escaping FlutterResult) {
        let urls = [
            URL(string: "x-apple-reminderkit://"),
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

}
