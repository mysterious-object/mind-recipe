package com.contextfield.mindrecipe

import android.os.Bundle
import android.webkit.WebView
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine

class MainActivity : FlutterActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        if (applicationContext.packageName.endsWith(".livecheck")) {
            WebView.setWebContentsDebuggingEnabled(true)
        }
        super.onCreate(savedInstanceState)
    }

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        flutterEngine.plugins.add(VoicePlugin())
        flutterEngine.plugins.add(MindRecipeDeviceHarnessPlugin())
        flutterEngine.plugins.add(MindRecipeMobileAutomationPlugin())
    }
}
