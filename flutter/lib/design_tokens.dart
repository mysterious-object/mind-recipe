/// Design tokens for Mind Nav wellness platform.
/// 
/// These replace hardcoded colors, sizes, and typography throughout the app.
/// All components should reference these tokens rather than using Material defaults.

import 'package:flutter/material.dart';

class MindNavTokens {
  MindNavTokens._();

  // ── Color Palette ────────────────────────────────────────────────

  /// Primary teal — used for primary actions, active states, navigation
  static const Color primary = Color(0xff007d71);
  static const Color primaryLight = Color(0xff009688);
  static const Color primaryDark = Color(0xff006b60);

  /// Secondary accent — used for highlights, secondary actions
  static const Color secondary = Color(0xff2f6cfa);
  static const Color secondaryLight = Color(0xff5c8aff);
  static const Color secondaryDark = Color(0xff1a4db8);

  /// Tertiary green — used for positive states, "green zone" indicators
  static const Color tertiary = Color(0xff007a4d);
  static const Color tertiaryLight = Color(0xff33a070);
  static const Color tertiaryDark = Color(0xff005c3a);

  /// Surface colors
  static const Color surfaceWhite = Color(0xfffbfaff);
  static const Color surfaceBlack = Color(0xff1a1a2e);
  static const Color voidBlack = Color(0xff0d0d1a);

  /// Status colors
  static const Color success = Color(0xff2e7d32);
  static const Color warning = Color(0xffed6c02);
  static const Color error = Color(0xffd32f2f);
  static const Color info = Color(0xff0288d1);

  /// Neutral grays
  static const Color gray50 = Color(0xfff5f5f5);
  static const Color gray100 = Color(0xffeeeeee);
  static const Color gray200 = Color(0xffe0e0e0);
  static const Color gray300 = Color(0xffbdbdbd);
  static const Color gray400 = Color(0xff9e9e9e);
  static const Color gray500 = Color(0xff757575);
  static const Color gray600 = Color(0xff616161);
  static const Color gray700 = Color(0xff424242);
  static const Color gray800 = Color(0xff303030);
  static const Color gray900 = Color(0xff212121);

  // ── Typography (dynamic-type aware) ──────────────────────────────

  /// Base text scale factor — multiplied by MediaQuery.textScaler
  static const double baseTextScaleFactor = 1.0;

  /// Display large — onboarding headlines
  static TextStyle displayLarge(BuildContext context) =>
      Theme.of(context).textTheme.displayLarge!
          .copyWith(color: _textColorForBrightness(context), fontSize: 32 * baseTextScaleFactor);

  /// Display medium — section headers
  static TextStyle displayMedium(BuildContext context) =>
      Theme.of(context).textTheme.displayMedium!
          .copyWith(color: _textColorForBrightness(context), fontSize: 28 * baseTextScaleFactor);

  /// Headline large — tab titles, card headers
  static TextStyle headlineLarge(BuildContext context) =>
      Theme.of(context).textTheme.headlineLarge!
          .copyWith(color: _textColorForBrightness(context), fontSize: 24 * baseTextScaleFactor);

  /// Headline medium — sub-section headers
  static TextStyle headlineMedium(BuildContext context) =>
      Theme.of(context).textTheme.headlineMedium!
          .copyWith(color: _textColorForBrightness(context), fontSize: 20 * baseTextScaleFactor);

  /// Title — card titles, list item titles
  static TextStyle title(BuildContext context) =>
      Theme.of(context).textTheme.titleLarge!
          .copyWith(color: _textColorForBrightness(context), fontSize: 18 * baseTextScaleFactor);

  /// Body large — main content text
  static TextStyle bodyLarge(BuildContext context) =>
      Theme.of(context).textTheme.bodyLarge!
          .copyWith(color: _textColorForBrightness(context), fontSize: 16 * baseTextScaleFactor);

  /// Body medium — standard body text
  static TextStyle bodyMedium(BuildContext context) =>
      Theme.of(context).textTheme.bodyMedium!
          .copyWith(color: _textColorForBrightness(context), fontSize: 14 * baseTextScaleFactor);

  /// Body small — captions, labels
  static TextStyle bodySmall(BuildContext context) =>
      Theme.of(context).textTheme.bodySmall!
          .copyWith(color: _textColorForBrightness(context).withAlpha(190), fontSize: 12 * baseTextScaleFactor);

  /// Label — button text, form labels
  static TextStyle label(BuildContext context) =>
      Theme.of(context).textTheme.labelLarge!
          .copyWith(color: _textColorForBrightness(context), fontSize: 14 * baseTextScaleFactor);

  /// Overline — uppercase labels, badges
  static TextStyle overline(BuildContext context) =>
      Theme.of(context).textTheme.labelSmall!
          .copyWith(fontSize: 10 * baseTextScaleFactor, letterSpacing: 1.2, fontWeight: FontWeight.w600);

  static Color _textColorForBrightness(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    if (brightness == Brightness.dark) return Colors.white;
    return const Color(0xff212121);
  }

  // ── Spacing ──────────────────────────────────────────────────────

  static const double spacingXs = 4.0;
  static const double spacingSm = 8.0;
  static const double spacingMd = 16.0;
  static const double spacingLg = 24.0;
  static const double spacingXl = 32.0;
  static const double spacingXxl = 48.0;

  // ── Border Radius ────────────────────────────────────────────────

  static const double radiusSm = 8.0;
  static const double radiusMd = 12.0;
  static const double radiusLg = 16.0;
  static const double radiusXl = 22.0;
  static const double radiusFull = 999.0;

  // ── Shadows ──────────────────────────────────────────────────────

  static BoxShadow shadowSm(BuildContext context) => BoxShadow(
        color: (_shadowColor(context)).withAlpha(20),
        blurRadius: 8,
        offset: const Offset(0, 2),
      );

  static BoxShadow shadowMd(BuildContext context) => BoxShadow(
        color: (_shadowColor(context)).withAlpha(30),
        blurRadius: 16,
        offset: const Offset(0, 4),
      );

  static BoxShadow shadowLg(BuildContext context) => BoxShadow(
        color: (_shadowColor(context)).withAlpha(40),
        blurRadius: 26,
        offset: const Offset(0, 7),
        spreadRadius: 1,
      );

  static Color _shadowColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? Colors.black
        : const Color(0xff000000);
  }

  // ── Animation Durations ──────────────────────────────────────────

  static const Duration animationFast = Duration(milliseconds: 200);
  static const Duration animationNormal = Duration(milliseconds: 360);
  static const Duration animationSlow = Duration(milliseconds: 460);

  // ── Breakpoints ──────────────────────────────────────────────────

  /// Mobile breakpoint — phones
  static const double mobileMaxWidth = 600.0;

  /// Tablet breakpoint — tablets
  static const double tabletMinWidth = 601.0;
  static const double tabletMaxWidth = 1024.0;

  /// Desktop breakpoint — larger screens
  static const double desktopMinWidth = 1025.0;

  /// Check if current screen is tablet or wider
  static bool isTabletOrWider(BuildContext context) {
    return MediaQuery.sizeOf(context).width >= tabletMinWidth;
  }

  /// Check if current screen is desktop or wider
  static bool isDesktop(BuildContext context) {
    return MediaQuery.sizeOf(context).width >= desktopMinWidth;
  }
}
