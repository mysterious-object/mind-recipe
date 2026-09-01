import 'package:flutter/material.dart';

/// A single visual choice drives both the native material palette and the
/// locally bundled Three.js scene. Keeping this catalog in one place prevents
/// a page colour and its live background from drifting apart.
class VisualThemeDefinition {
  const VisualThemeDefinition({
    required this.id,
    required this.name,
    required this.description,
    required this.primary,
    required this.secondary,
    required this.tertiary,
    required this.background,
    required this.engineTheme,
    required this.composition,
  });

  final String id;
  final String name;
  final String description;
  final Color primary;
  final Color secondary;
  final Color tertiary;
  final Color background;
  final String engineTheme;
  final String composition;
}

const visualThemes = <VisualThemeDefinition>[
  VisualThemeDefinition(
    id: 'mindrecipe-core',
    name: 'MindRecipe Core',
    description: 'Restorative teal, violet, and warm focus gold.',
    primary: Color(0xff00d9c0),
    secondary: Color(0xff8b5cf6),
    tertiary: Color(0xfff5b942),
    background: Color(0xff06151b),
    engineTheme: 'mindrecipe-core',
    composition: 'full',
  ),
  VisualThemeDefinition(
    id: 'neon-circuit',
    name: 'Neon Circuit',
    description: 'Hot pink, electric cyan, and charged green.',
    primary: Color(0xffff0066),
    secondary: Color(0xff00ffff),
    tertiary: Color(0xff39ff14),
    background: Color(0xff160414),
    engineTheme: 'cyberpunk-neon',
    composition: 'holographic',
  ),
  VisualThemeDefinition(
    id: 'bioluminescent',
    name: 'Bioluminescent',
    description: 'Deep blue, phosphor green, and amber.',
    primary: Color(0xff00e5ff),
    secondary: Color(0xff76ff03),
    tertiary: Color(0xffffab00),
    background: Color(0xff061a19),
    engineTheme: 'organic-bioluminescent',
    composition: 'cinematic',
  ),
  VisualThemeDefinition(
    id: 'quantum-void',
    name: 'Quantum Void',
    description: 'Ultraviolet, quantum blue, and photon orange.',
    primary: Color(0xff7c4dff),
    secondary: Color(0xff448aff),
    tertiary: Color(0xffff6e40),
    background: Color(0xff090614),
    engineTheme: 'quantum-void',
    composition: 'minimal',
  ),
  VisualThemeDefinition(
    id: 'holographic-matrix',
    name: 'Holographic Matrix',
    description: 'Matrix green, hologram cyan, and magenta.',
    primary: Color(0xff00ff41),
    secondary: Color(0xff00bcd4),
    tertiary: Color(0xffff4081),
    background: Color(0xff06130d),
    engineTheme: 'holographic-matrix',
    composition: 'trading',
  ),
  VisualThemeDefinition(
    id: 'midnight-signal',
    name: 'Midnight Signal',
    description: 'Electric blue, signal mint, and midnight glass.',
    primary: Color(0xff147bff),
    secondary: Color(0xff00edac),
    tertiary: Color(0xffa98cff),
    background: Color(0xff020719),
    engineTheme: 'midnight-signal',
    composition: 'trading',
  ),
  VisualThemeDefinition(
    id: 'neon-ronin',
    name: 'Neon Ronin',
    description: 'Crimson, violet, and electric haze.',
    primary: Color(0xffee2c74),
    secondary: Color(0xff7038ff),
    tertiary: Color(0xff4fdfff),
    background: Color(0xff160414),
    engineTheme: 'neon-ronin',
    composition: 'holographic',
  ),
  VisualThemeDefinition(
    id: 'abyssal-current',
    name: 'Abyssal Current',
    description: 'Abyss blue, cyan current, and sea glass.',
    primary: Color(0xff0077ff),
    secondary: Color(0xff00e3d2),
    tertiary: Color(0xff75ffd9),
    background: Color(0xff000f25),
    engineTheme: 'abyssal-current',
    composition: 'cinematic',
  ),
  VisualThemeDefinition(
    id: 'solar-flare',
    name: 'Solar Flare',
    description: 'Solar gold, ember orange, and charcoal.',
    primary: Color(0xffff9d00),
    secondary: Color(0xffffcf5c),
    tertiary: Color(0xffff4d23),
    background: Color(0xff1a0c02),
    engineTheme: 'solar-flare',
    composition: 'cinematic',
  ),
  VisualThemeDefinition(
    id: 'void-walker',
    name: 'Void Walker',
    description: 'Dark indigo, ultraviolet, and soft silver.',
    primary: Color(0xff4630b5),
    secondary: Color(0xff9d72ff),
    tertiary: Color(0xffc5b3ff),
    background: Color(0xff05020f),
    engineTheme: 'void-walker',
    composition: 'minimal',
  ),
  VisualThemeDefinition(
    id: 'crystal-matrix',
    name: 'Crystal Matrix',
    description: 'Ice crystal, cyan light, and slate.',
    primary: Color(0xff75f7ff),
    secondary: Color(0xffe9feff),
    tertiary: Color(0xff5ba8c9),
    background: Color(0xff07151b),
    engineTheme: 'crystal-matrix',
    composition: 'lite',
  ),
  VisualThemeDefinition(
    id: 'aurora',
    name: 'Aurora',
    description: 'Aurora mint, spectral violet, and rose plasma.',
    primary: Color(0xff23edab),
    secondary: Color(0xff9a56ff),
    tertiary: Color(0xffff74b8),
    background: Color(0xff07111d),
    engineTheme: 'aurora',
    composition: 'full',
  ),
  VisualThemeDefinition(
    id: 'obsidian-forge',
    name: 'Obsidian Forge',
    description: 'Forged copper, ember, and obsidian.',
    primary: Color(0xffef6736),
    secondary: Color(0xffffb04b),
    tertiary: Color(0xff873b2f),
    background: Color(0xff140909),
    engineTheme: 'obsidian-forge',
    composition: 'cinematic',
  ),
  VisualThemeDefinition(
    id: 'orchid-vapor',
    name: 'Orchid Vapor',
    description: 'Orchid, vapor blue, and soft lavender.',
    primary: Color(0xffdb54e8),
    secondary: Color(0xff7ee9ff),
    tertiary: Color(0xffc5a0ff),
    background: Color(0xff160b20),
    engineTheme: 'orchid-vapor',
    composition: 'holographic',
  ),
  VisualThemeDefinition(
    id: 'tidal-glass',
    name: 'Tidal Glass',
    description: 'Tidal cyan, seafoam, and glass white.',
    primary: Color(0xff00c6dc),
    secondary: Color(0xffe3ffff),
    tertiary: Color(0xff45dcb4),
    background: Color(0xff031d25),
    engineTheme: 'tidal-glass',
    composition: 'trading',
  ),
];

VisualThemeDefinition visualThemeFor(String? id) => visualThemes.firstWhere(
  (theme) => theme.id == id,
  orElse: () => visualThemes.first,
);

String migrateVisualTheme(String? value) {
  if (visualThemes.any((theme) => theme.id == value)) return value!;
  const legacy = <String, String>{
    'mind-recipe-orbit': 'mindrecipe-core',
    'chimera-native': 'mindrecipe-core',
    'cyberpunk-neon': 'neon-circuit',
    'organic-bioluminescent': 'bioluminescent',
    'quantum-void': 'quantum-void',
    'holographic-matrix': 'holographic-matrix',
    'oceanic-cyan': 'tidal-glass',
    'solar-ember': 'solar-flare',
    'deep-ocean': 'abyssal-current',
    'aurora-spectrum': 'aurora',
    'crimson-pulse': 'neon-ronin',
    'monochrome-glass': 'crystal-matrix',
    'ultraviolet-bloom': 'orchid-vapor',
  };
  return legacy[value] ?? visualThemes.first.id;
}
