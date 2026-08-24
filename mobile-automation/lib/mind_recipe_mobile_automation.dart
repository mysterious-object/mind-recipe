// Re-export shim — the canonical implementation lives at
// /tmp/mind-recipe/flutter/lib/mobile_automation.dart
//
// This file exists so `mobile-automation/` is a self-contained branded fork
// folder (mirrors /tmp/mobilerun structure) while the Flutter app imports
// from its own lib/. CI can copy or symlink if needed.
//
// Usage from Flutter:  import 'mobile_automation.dart';
// Usage from fork:     import 'lib/mind_recipe_mobile_automation.dart';

export '../../flutter/lib/mobile_automation.dart';
