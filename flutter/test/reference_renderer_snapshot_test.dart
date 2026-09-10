import 'dart:convert';
import 'dart:io';

import 'package:crypto/crypto.dart';
import 'package:flutter_test/flutter_test.dart';

const _root = 'assets/familiar/chimera-fx/';

// Digests of the reviewed renderer snapshot after the two required mobile
// packaging transforms: local/offline Three.js imports and product-language
// neutralization. Any source edit must be reviewed explicitly instead of
// silently drifting into another approximation.
const _digests = <String, String>{
  'chimera-fx-bundle.js':
      'f33870ee31716e56d0edaa5271e1581de5cabf402eeb1db18cb50e757048b48d',
  'core/AmbientColors.js':
      'd1d263e165694f390c20abd8717eea267e4f2b4df33defce20230bc36206c703',
  'core/Engine.js':
      'bed3d701a797e65456020a17399f647b81f051e1a8e14198d803fc54475d74b8',
  'core/ShapableMatter.js':
      'e226db0e8b0e2c526da118f9951223c6bb461fd184ca1e3da1463c4cd9a2636c',
  'core/StateMachine.js':
      'c6bf670a2a36b053fa0d689fd5115680707b4613e30505356ac6819263292c9c',
  'components/DataRivers.js':
      'c0ce68650f252148e438908f4a82283a561682ab51d20be8ae1390ad52c14550',
  'components/EnergyBeams.js':
      '1a02cf47814dc1bc47112eaac2e91207a92b6f7c6231c8630ac8420e7b9c11cb',
  'components/EnergyTendrils.js':
      '3a5fef5030108d26fbb48f4a2d552ecc6f9e7755a69341b4fad67b05bee6a0b5',
  'components/HoloHUD.js':
      '4491aee834eed0d8150b9c195d4575539c92c782e116b1ef18a7a25aeb1f1505',
  'components/IridescentOrb.js':
      '2d31ea0c2c9510c601e861285242f36717561ea4b1c17aba096adc1f3ccd0646',
  'components/LiquidMetal.js':
      'bf3f83664d7ca70df1c2f4d5665bd04fbde6ea0a5dc0e4e147a9bbf15a6aca3e',
  'components/ParticleNebula.js':
      'fcf0d080c5b0c853f76db6941a35291f594207c908fcf1b0d629804d18ff2809',
  'components/ReactionDiffusion.js':
      '3f5e8b79d874611b8bc516cc42c8fc8ef2b6312e32a804bfea1a49eeb0ff9ee0',
  'components/VolumetricLight.js':
      '131695abd0dea3dd79b8770966fb7da3be1c1a8f030a6f02592ead6d62f6e295',
  'components/VoronoiShatter.js':
      '4e2fb14ffa7df48471cbdb16a069b75240435c669e0b7aeb173cbd8b20363671',
  'postfx/ChromaticAberrationShader.js':
      'a69468900bf8bd3e46af667987ac54ee207ab448883720d0f2c58a6ac2dd0497',
  'postfx/FilmGrainShader.js':
      'b3c8db2f3fc65bf4713e5599b140de32ac6c244a4b3269d90d92638baca5f087',
  'postfx/GlitchShader.js':
      'ed770fe14063b2d76a742086f4633500eb54c54cfb99f0c5dfb2d7719805e609',
  'themes/aurora-borealis.js':
      '5a707a16bd6e8107e39ae664c8a159041b5f309b05042dfef4423acfb4d6e7eb',
  'themes/chimera-native.js':
      '86bf16fa7d7d453b5e37992a6d15592549f3d1aac34ff461ee94e22702863f0d',
  'themes/crystal-matrix.js':
      '4ace61a9c83d5aaae62232dfb4f4aa3e59b07cc71a3341030ccb131453b893a7',
  'themes/cyberpunk-neon.js':
      '601b0675af241fcd9a21277690c32cf6cf0d3cadb32c17d815376c24b95eface',
  'themes/deep-ocean.js':
      '0243af1a3ab03b31e13cb3bdd0a411e365de3ae951d245ec9f41732b2951fdf6',
  'themes/holographic-matrix.js':
      'e73c89ac76761203e00ad8c9751947b0f1fa5a794a04e95061c0985635ca3f92',
  'themes/midnight-trading.js':
      'd7672fffa6ec63943c45e90d702f9d2752f1dba8848e7ce410a051ca0ca7cc18',
  'themes/neon-samurai.js':
      '0e24c1e60745dc321c0230a76b110611096fe1a664aa44ac9ce5059ce64fdff8',
  'themes/obsidian-forge.js':
      'dbe04487b466abfb853e6226127b18c91d21a40a9162159dd93c4146758e2e2f',
  'themes/orchid-vapor.js':
      'e89c5402ac85b30fbd796ecfaa970909cd668fc1984c09de155b45719d0e1d0a',
  'themes/organic-bioluminescent.js':
      'b3aebadf622a4180e72be2e40616a7cb23cd376686e061c2e4f4d3841c96cd49',
  'themes/quantum-void.js':
      '78b0a71987bd754d35869085c7c7d486b098049c6cfb742f6c3649dac1269286',
  'themes/solar-flare.js':
      '7baf0db20cc66d8b38a3fa863128df25c1c195fc23be50d7f9a8565d488d0158',
  'themes/tidal-glass.js':
      '2652d19ea3752284464383366109960d5a7570da12cee8a911c4cbffee3b80d3',
  'themes/void-walker.js':
      '4a8ea15bda7b3d55145419e2a3f97b132aa20e7f6e277e12af9791e179342b86',
};

void main() {
  test('packaged renderer is the approved 33-file source snapshot', () {
    expect(_digests, hasLength(33));
    for (final entry in _digests.entries) {
      final bytes = File('$_root${entry.key}').readAsBytesSync();
      expect(
        sha256.convert(bytes).toString(),
        entry.value,
        reason: '${entry.key} diverged from the approved renderer snapshot.',
      );
      expect(utf8.decode(bytes), isNotEmpty);
    }
  });
}
