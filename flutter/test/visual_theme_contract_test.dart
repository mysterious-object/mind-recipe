import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:mind_recipe/visual_theme.dart';

const _expectedThemes = <String, (String, String)>{
  'mindrecipe-core': ('MindRecipe Core', 'mindrecipe-core'),
  'neon-circuit': ('Neon Circuit', 'cyberpunk-neon'),
  'bioluminescent': ('Bioluminescent', 'organic-bioluminescent'),
  'quantum-void': ('Quantum Void', 'quantum-void'),
  'holographic-matrix': ('Holographic Matrix', 'holographic-matrix'),
  'midnight-signal': ('Midnight Signal', 'midnight-trading'),
  'neon-ronin': ('Neon Ronin', 'neon-samurai'),
  'abyssal-current': ('Abyssal Current', 'deep-ocean'),
  'solar-flare': ('Solar Flare', 'solar-flare'),
  'void-walker': ('Void Walker', 'void-walker'),
  'crystal-matrix': ('Crystal Matrix', 'crystal-matrix'),
  'aurora': ('Aurora', 'aurora-borealis'),
  'obsidian-forge': ('Obsidian Forge', 'obsidian-forge'),
  'orchid-vapor': ('Orchid Vapor', 'orchid-vapor'),
  'tidal-glass': ('Tidal Glass', 'tidal-glass'),
};

const _themeModules = <String, String>{
  'mindrecipe-core': 'chimera-native.js',
  'cyberpunk-neon': 'cyberpunk-neon.js',
  'organic-bioluminescent': 'organic-bioluminescent.js',
  'quantum-void': 'quantum-void.js',
  'holographic-matrix': 'holographic-matrix.js',
  'midnight-trading': 'midnight-trading.js',
  'neon-samurai': 'neon-samurai.js',
  'deep-ocean': 'deep-ocean.js',
  'solar-flare': 'solar-flare.js',
  'void-walker': 'void-walker.js',
  'crystal-matrix': 'crystal-matrix.js',
  'aurora-borealis': 'aurora-borealis.js',
  'obsidian-forge': 'obsidian-forge.js',
  'orchid-vapor': 'orchid-vapor.js',
  'tidal-glass': 'tidal-glass.js',
};

void main() {
  group('visual theme release contract', () {
    test('exposes exactly the approved 15 names and renderer mappings', () {
      expect(visualThemes, hasLength(_expectedThemes.length));
      expect(
        visualThemes.map((theme) => theme.id).toList(),
        orderedEquals(_expectedThemes.keys),
      );

      for (final theme in visualThemes) {
        final expected = _expectedThemes[theme.id];
        expect(expected, isNotNull, reason: 'Unexpected theme ${theme.id}');
        expect(theme.name, expected!.$1, reason: theme.id);
        expect(theme.engineTheme, expected.$2, reason: theme.id);
      }

      expect(
        visualThemes.map((theme) => theme.id).toSet(),
        hasLength(visualThemes.length),
      );
      expect(
        visualThemes.map((theme) => theme.engineTheme).toSet(),
        hasLength(visualThemes.length),
        reason: 'Every picker entry must select a distinct renderer theme.',
      );
      expect(
        visualThemes.map((theme) => theme.composition).toSet(),
        hasLength(visualThemes.length),
        reason: 'Every picker entry must select a distinct live composition.',
      );
    });

    test('bundles and registers every approved source theme module', () {
      final source = File('assets/familiar/chimera-fx/chimera-fx-bundle.js')
          .readAsStringSync();

      for (final entry in _themeModules.entries) {
        expect(
          source,
          contains("from './themes/${entry.value}'"),
          reason: '${entry.key} must come from its real theme module.',
        );
        expect(
          source,
          contains("'${entry.key}':"),
          reason: '${entry.key} must be registered in the renderer catalog.',
        );
      }
    });

    test('mobile scene does not synthesize themes from a base recolor', () {
      final source = File('assets/familiar/chimera-fx/mobile-scene.js')
          .readAsStringSync();

      expect(source, isNot(contains('visualThemeSpecs')));
      expect(source, isNot(contains('Object.entries(visualThemeSpecs)')));
      expect(source, isNot(contains('ChimeraFX.registerTheme(name')));
    });

    test(
      'background runs the source ChimeraFX stack without a parallel shader',
      () {
        final scene = File('assets/familiar/chimera-fx/theme-scene.js')
            .readAsStringSync();
        final engine = File('assets/familiar/chimera-fx/core/Engine.js')
            .readAsStringSync();
        final matter = File('assets/familiar/chimera-fx/core/ShapableMatter.js')
            .readAsStringSync();
        final ambient = File('assets/familiar/chimera-fx/core/AmbientColors.js')
            .readAsStringSync();
        final page = File('assets/familiar/background.html').readAsStringSync();

        expect(
          scene,
          contains("import ChimeraFX from './chimera-fx-bundle.js'"),
        );
        expect(scene, contains("preset: 'lite'"));
        expect(scene, isNot(contains('field:')));
        expect(scene, isNot(contains('MatterVFX')));
        expect(page, contains('theme-scene.js'));
        expect(page, isNot(contains('mind-recipe-vfx-engine.js')));
        expect(engine, contains('EffectComposer'));
        expect(engine, contains('UnrealBloomPass'));
        expect(
          matter,
          contains('Unified particle engine with 11 swappable matter modes'),
        );
        expect(matter, contains("photonic"));
        expect(ambient, contains('class AmbientColors'));
        expect(
          File('assets/familiar/chimera-fx/mind-recipe-vfx-engine.js')
              .existsSync(),
          isFalse,
          reason: 'The synthetic parallel renderer must not ship.',
        );
      },
    );

    test('user-visible source strings contain no retired product language', () {
      const banned = <String>[
        'darkstar',
        'mind recipe',
        'living vfx',
        'vfx composition',
      ];
      final violations = <String>[];

      for (final file in _visibleSourceFiles()) {
        final source = file.readAsStringSync();
        final visibleText =
            file.path.endsWith('.dart') || file.path.endsWith('.js')
            ? _stringLiterals(source)
            : source;
        final lower = visibleText.toLowerCase();
        for (final phrase in banned) {
          if (lower.contains(phrase)) {
            violations.add('${file.path}: "$phrase"');
          }
        }
      }

      expect(
        violations,
        isEmpty,
        reason:
            'Retired words must not reach UI, accessibility, bridge, or '
            'packaged runtime strings:\n${violations.join('\n')}',
      );
    });
  });
}

Iterable<File> _visibleSourceFiles() sync* {
  for (final root in const [
    'lib',
    'assets/familiar',
    'android/app/src/main',
    'ios/Runner',
  ]) {
    final directory = Directory(root);
    if (!directory.existsSync()) continue;
    for (final entity in directory.listSync(recursive: true)) {
      if (entity is! File) continue;
      if (entity.path.endsWith('.bundle.js')) continue;
      if (entity.path.endsWith('.dart') ||
          entity.path.endsWith('.js') ||
          entity.path.endsWith('.html') ||
          entity.path.endsWith('.xml') ||
          entity.path.endsWith('.plist')) {
        yield entity;
      }
    }
  }
}

/// Extracts quoted runtime text while omitting comments and identifiers. This
/// keeps the branding check focused on strings that can reach the application.
String _stringLiterals(String source) {
  final output = StringBuffer();
  var index = 0;
  while (index < source.length) {
    if (source.startsWith('//', index)) {
      final newline = source.indexOf('\n', index + 2);
      index = newline < 0 ? source.length : newline + 1;
      continue;
    }
    if (source.startsWith('/*', index)) {
      final end = source.indexOf('*/', index + 2);
      index = end < 0 ? source.length : end + 2;
      continue;
    }

    final quote = source.codeUnitAt(index);
    if (quote != 0x27 && quote != 0x22) {
      index++;
      continue;
    }
    final character = String.fromCharCode(quote);
    final triple = source.startsWith(character * 3, index);
    final delimiter = triple ? character * 3 : character;
    index += delimiter.length;
    while (index < source.length && !source.startsWith(delimiter, index)) {
      if (source.codeUnitAt(index) == 0x5c && index + 1 < source.length) {
        output.writeCharCode(source.codeUnitAt(index + 1));
        index += 2;
      } else {
        output.writeCharCode(source.codeUnitAt(index));
        index++;
      }
    }
    output.writeln();
    if (index < source.length) index += delimiter.length;
  }
  return output.toString();
}
