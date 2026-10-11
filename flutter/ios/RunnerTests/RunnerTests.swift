import Flutter
import UIKit
import XCTest
@testable import Runner

class RunnerTests: XCTestCase {

  func testUnsupportedAlarmDoesNotClaimItWasScheduled() {
    let plugin = MindRecipeMobileAutomationPlugin()
    var reply: [String: Any]?
    plugin.handle(FlutterMethodCall(methodName: "setAlarm", arguments: ["hour": 8, "minute": 30])) {
      reply = $0 as? [String: Any]
    }
    XCTAssertEqual(reply?["success"] as? Bool, false)
    XCTAssertEqual(reply?["code"] as? String, "unsupported")
  }

  func testUnregisteredShortcutCannotExecute() {
    let plugin = MindRecipeMobileAutomationPlugin()
    var reply: [String: Any]?
    plugin.handle(FlutterMethodCall(methodName: "invokeShortcut", arguments: ["name": "Unreviewed"])) {
      reply = $0 as? [String: Any]
    }
    XCTAssertEqual(reply?["success"] as? Bool, false)
    XCTAssertEqual(reply?["code"] as? String, "unsupported")
  }

  func testInvalidCalendarRangeFailsBeforePermissionOrPresentation() {
    let plugin = MindRecipeMobileAutomationPlugin()
    var failure: FlutterError?
    plugin.handle(FlutterMethodCall(methodName: "createCalendarEvent", arguments: [
      "title": "Test", "beginMillis": 2000, "endMillis": 1000
    ])) { failure = $0 as? FlutterError }
    XCTAssertEqual(failure?.code, "validation")
  }

}
