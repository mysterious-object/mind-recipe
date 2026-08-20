import Flutter
import UIKit

final class MindNavDeviceHarnessPlugin: NSObject, FlutterPlugin {
  static func register(with registrar: FlutterPluginRegistrar) {
    let channel = FlutterMethodChannel(
      name: "mindnav.dev/device_harness",
      binaryMessenger: registrar.messenger()
    )
    registrar.addMethodCallDelegate(MindNavDeviceHarnessPlugin(), channel: channel)
  }

  func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
    switch call.method {
    case "capabilities":
      result([
        "hapticsAvailable": true,
        "platform": "ios",
        "totalMemoryMiB": Int(ProcessInfo.processInfo.physicalMemory / (1024 * 1024)),
      ])
    case "acknowledgeTurn":
      let feedback = UIImpactFeedbackGenerator(style: .soft)
      feedback.prepare()
      feedback.impactOccurred(intensity: 0.35)
      result(nil)
    default:
      result(FlutterMethodNotImplemented)
    }
  }
}
