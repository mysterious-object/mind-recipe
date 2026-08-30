import 'package:flutter/material.dart';
import 'package:package_info_plus/package_info_plus.dart';

import 'app_services.dart';
import 'design_tokens.dart';
import 'familiar_3d.dart';
import 'on_device_inference.dart';

/// Settings screen — model selection, theme selection, and visual styling.
/// Restored for build 2090: full Chimera FX theme parity (15 themes), color
/// palettes, VFX variants, and 3D Familiar controls were missing in 2089.
class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key, required this.appState});
  final SecureAppState appState;

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  String _selectedModel = 'openrouter/free';
  LocalInferenceSnapshot _privateModel = const LocalInferenceSnapshot(
    OnDeviceStatus.checking,
  );
  bool _modelActionInProgress = false;
  late double _chimeraFxIntensity;

  @override
  void initState() {
    super.initState();
    _chimeraFxIntensity = widget.appState.chimeraFxIntensity;
    _refreshPrivateModel();
  }

  Future<void> _refreshPrivateModel() async {
    final snapshot = await OnDeviceInference().refreshStatus();
    if (mounted) setState(() => _privateModel = snapshot);
  }

  Future<void> _installPrivateModel() async {
    setState(() => _modelActionInProgress = true);
    var installed = false;
    try {
      await OnDeviceInference().installModel();
      installed = true;
    } catch (_) {
      if (mounted) setState(() => _privateModel = OnDeviceInference().snapshot);
    } finally {
      if (installed) await _refreshPrivateModel();
      if (mounted) setState(() => _modelActionInProgress = false);
    }
  }

  static const _models = [
    {
      'id': 'openrouter/free',
      'name': 'OpenRouter Free Router',
      'provider': 'openrouter',
    },
    {
      'id': 'claude-sonnet-4-20250514',
      'name': 'Claude Sonnet 4',
      'provider': 'anthropic',
    },
    {
      'id': 'gemini-2.0-flash',
      'name': 'Gemini 2.0 Flash',
      'provider': 'google',
    },
    {
      'id': 'meta-llama/llama-3.2-3b-instruct:free',
      'name': 'Llama 3.2 3B (Free)',
      'provider': 'openrouter',
    },
    {
      'id': 'google/gemma-4-26b-a4b-it:free',
      'name': 'Gemma 4 26B (Free)',
      'provider': 'openrouter',
    },
    {
      'id': 'nvidia/nemotron-3-nano-30b-a3b:free',
      'name': 'Nemotron 3 Nano (Free)',
      'provider': 'openrouter',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Text('Settings', style: MindRecipeTokens.displayMedium(context)),
        const SizedBox(height: 24),

        // ── AI Model Selection ────────────────────────────────────
        _buildSectionHeader('AI Model'),
        _buildPrivateModelCard(),
        const SizedBox(height: 12),
        _buildModelSelector(),
        const SizedBox(height: 20),

        // ── Appearance & VFX Themes (restored 2090) ───────────────
        _buildSectionHeader('Appearance'),
        _buildAppearanceCard(),
        const SizedBox(height: 20),

        // ── Visual motion (Chimera FX) ─────────────────────────────
        _buildSectionHeader('Visual motion'),
        _buildVisualMotionControls(),
        const SizedBox(height: 20),

        // ── Voice & TTS ───────────────────────────────────────────
        _buildSectionHeader('Voice conversation'),
        _buildVoiceControls(),
        const SizedBox(height: 20),

        // ── Privacy & Data ────────────────────────────────────────
        _buildSectionHeader('Privacy & Data'),
        Card(
          child: Column(
            children: [
              SwitchListTile(
                title: const Text('Cloud AI processing'),
                subtitle: const Text('Send conversations to cloud AI provider'),
                value: true,
                onChanged: (v) {},
              ),
              const Divider(height: 1),
              SwitchListTile(
                title: const Text('Usage analytics'),
                subtitle: const Text(
                  'Help improve Mind Recipe (no personal data)',
                ),
                value: false,
                onChanged: (v) {},
              ),
              const Divider(height: 1),
              ListTile(
                title: const Text('Export my data'),
                subtitle: const Text('Download all your wellness data'),
                trailing: const Icon(Icons.download),
                onTap: () {},
              ),
              const Divider(height: 1),
              ListTile(
                title: const Text('Delete account'),
                subtitle: const Text('Permanently remove all data'),
                trailing: const Icon(Icons.delete_forever, color: Colors.red),
                onTap: () {},
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Image.asset(
                  'assets/branding/context-field-wordmark.png',
                  height: 58,
                  fit: BoxFit.contain,
                  errorBuilder: (_, _, _) =>
                      const Icon(Icons.auto_awesome_rounded, size: 36),
                ),
                const SizedBox(height: 8),
                Text(
                  'Mind Recipe by Context Field',
                  style: MindRecipeTokens.title(context),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 2),
                FutureBuilder<PackageInfo>(
                  future: PackageInfo.fromPlatform(),
                  builder: (context, snap) => Text(
                    'Version ${snap.data?.version ?? '1.0.0'}+${snap.data?.buildNumber ?? '2090'}',
                    style: MindRecipeTokens.bodySmall(context),
                    textAlign: TextAlign.center,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'VFX themes · color palettes · 3D Familiar · Navigator bubble fixed',
                  style: MindRecipeTokens.bodySmall(context),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSectionHeader(String title) => Padding(
        padding: const EdgeInsets.only(bottom: 8),
        child: Text(title, style: MindRecipeTokens.headlineMedium(context)),
      );

  Widget _buildPrivateModelCard() {
    final status = _privateModel.status;
    final ready = _privateModel.isReady;
    final downloading = status == OnDeviceStatus.downloading ||
        status == OnDeviceStatus.verifying ||
        status == OnDeviceStatus.checking;
    final detail = ready
        ? 'Ready for private, on-device guidance. Nothing from this route is sent to a cloud provider.'
        : _privateModel.detail ??
            'Install a one-time 1.2 GB private reasoning model. Keep at least 2.5 GB free so it can run reliably. It is verified before use and can be removed whenever you like.';
    return Card(
      child: Column(
        children: [
          ListTile(
            leading: Icon(
              ready ? Icons.verified_user_rounded : Icons.phone_android_rounded,
              color: ready ? MindRecipeTokens.primary : null,
            ),
            title: const Text('Private on-device AI'),
            subtitle: Text(detail),
          ),
          if (_modelActionInProgress || downloading)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 14),
              child: LinearProgressIndicator(
                value: status == OnDeviceStatus.downloading
                    ? OnDeviceInference().downloadProgress
                    : null,
              ),
            ),
          const Divider(height: 1),
          ButtonBar(
            children: [
              if (ready)
                TextButton.icon(
                  onPressed: _modelActionInProgress
                      ? null
                      : () async {
                          setState(() => _modelActionInProgress = true);
                          await OnDeviceInference().removeModel();
                          await _refreshPrivateModel();
                          if (mounted) {
                            setState(() => _modelActionInProgress = false);
                          }
                        },
                  icon: const Icon(Icons.delete_outline_rounded),
                  label: const Text('Remove model'),
                )
              else
                FilledButton.icon(
                  onPressed: downloading || _modelActionInProgress
                      ? null
                      : _installPrivateModel,
                  icon: const Icon(Icons.download_rounded),
                  label: const Text('Install private model'),
                ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildModelSelector() => Card(
        child: Column(
          children: _models
              .map(
                (m) => RadioListTile<String>(
                  title: Text(m['name']!),
                  subtitle: Text(m['provider']!.toUpperCase()),
                  value: m['id']!,
                  groupValue: _selectedModel,
                  onChanged: (v) => setState(() => _selectedModel = v!),
                  activeColor: MindRecipeTokens.primary,
                ),
              )
              .toList(),
        ),
      );

  /// Restored chimera theme selector with color palettes — was missing in 2089.
  Widget _buildAppearanceCard() => Card(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const ListTile(
              leading: Icon(Icons.auto_awesome_rounded),
              title: Text('Chimera FX appearance'),
              subtitle: Text(
                'Choose the app theme and control the animated visual atmosphere.',
              ),
            ),
            const Divider(height: 1),
            RadioListTile<String>(
              title: const Text('Follow device theme'),
              value: 'system',
              groupValue: widget.appState.appearanceMode,
              onChanged: (value) => widget.appState.setAppearanceMode(value!),
            ),
            RadioListTile<String>(
              title: const Text('Light'),
              value: 'light',
              groupValue: widget.appState.appearanceMode,
              onChanged: (value) => widget.appState.setAppearanceMode(value!),
            ),
            RadioListTile<String>(
              title: const Text('Dark'),
              value: 'dark',
              groupValue: widget.appState.appearanceMode,
              onChanged: (value) => widget.appState.setAppearanceMode(value!),
            ),
            const Divider(height: 1),
            const Padding(
              padding: EdgeInsets.fromLTRB(16, 14, 16, 6),
              child: Text(
                'COLOR THEME',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1.1,
                ),
              ),
            ),
            for (final theme in const [
              (
                id: 'chimera-native',
                name: 'DarkStar Core',
                description: 'Teal + violet — original chimera signal',
                colors: [Color(0xff00e5cc), Color(0xff7c3aed)],
              ),
              (
                id: 'verdant',
                name: 'Verdant Signal',
                description: 'Signature teal, green, and violet (legacy)',
                colors: [Color(0xff007d71), Color(0xff7c3aed)],
              ),
              (
                id: 'cyberpunk-neon',
                name: 'Neon Circuit',
                description: 'Magenta + cyan — cyberpunk pulse',
                colors: [Color(0xffff2daf), Color(0xff00e5ff)],
              ),
              (
                id: 'organic-bioluminescent',
                name: 'Bioluminescent',
                description: 'Neon green + sky — living glow',
                colors: [Color(0xff00e68a), Color(0xff7defff)],
              ),
              (
                id: 'quantum-void',
                name: 'Quantum Void',
                description: 'Violet void + deep ink',
                colors: [Color(0xff7c3aed), Color(0xff111827)],
              ),
              (
                id: 'holographic-matrix',
                name: 'Holographic Matrix',
                description: 'Ice cyan + teal holo',
                colors: [Color(0xff7defff), Color(0xff00e5cc)],
              ),
              (
                id: 'midnight-trading',
                name: 'Midnight Signal',
                description: 'Electric blue + neon green',
                colors: [Color(0xff2563eb), Color(0xff00e68a)],
              ),
              (
                id: 'neon-samurai',
                name: 'Neon Ronin',
                description: 'Crimson + violet — neon blade',
                colors: [Color(0xffff3b5c), Color(0xff7c3aed)],
              ),
              (
                id: 'deep-ocean',
                name: 'Abyssal Current',
                description: 'Ocean deep + teal undertow',
                colors: [Color(0xff0066ff), Color(0xff00e5cc)],
              ),
              (
                id: 'ocean',
                name: 'Deep Ocean (legacy)',
                description: 'Cool blue, cyan, and indigo',
                colors: [Color(0xff006d91), Color(0xff315da8)],
              ),
              (
                id: 'solar-flare',
                name: 'Solar Flare',
                description: 'Solar orange + light gold',
                colors: [Color(0xffff7a00), Color(0xffffd166)],
              ),
              (
                id: 'void-walker',
                name: 'Void Walker',
                description: 'Violet ash + void black',
                colors: [Color(0xff8b5cf6), Color(0xff020203)],
              ),
              (
                id: 'crystal-matrix',
                name: 'Crystal Matrix',
                description: 'Ice + crystal white',
                colors: [Color(0xff7defff), Color(0xffe7fffb)],
              ),
              (
                id: 'aurora',
                name: 'Aurora (legacy)',
                description: 'Violet, turquoise, and orchid',
                colors: [Color(0xff6750a4), Color(0xff008f83)],
              ),
              (
                id: 'aurora-borealis',
                name: 'Aurora Borealis',
                description: 'Aurora green + violet veil',
                colors: [Color(0xff00e68a), Color(0xff7c3aed)],
              ),
              (
                id: 'obsidian-forge',
                name: 'Obsidian Forge',
                description: 'Forge orange + obsidian ink',
                colors: [Color(0xffff6b35), Color(0xff111827)],
              ),
              (
                id: 'orchid-vapor',
                name: 'Orchid Vapor',
                description: 'Orchid + ice haze',
                colors: [Color(0xffd946ef), Color(0xff7defff)],
              ),
              (
                id: 'tidal-glass',
                name: 'Tidal Glass',
                description: 'Tidal cyan + crystal frost',
                colors: [Color(0xff06b6d4), Color(0xffe7fffb)],
              ),
              (
                id: 'ember',
                name: 'Warm Ember (legacy)',
                description: 'Grounded copper, amber, and berry',
                colors: [Color(0xffa34213), Color(0xffc26a00)],
              ),
              (
                id: 'twilight',
                name: 'Twilight (legacy)',
                description: 'Indigo, purple, and dusk blue',
                colors: [Color(0xff4648a3), Color(0xff7651a8)],
              ),
            ])
              RadioListTile<String>(
                title: Text(theme.name),
                subtitle: Text(theme.description),
                value: theme.id,
                groupValue: widget.appState.chimeraTheme,
                onChanged: (value) => widget.appState.setChimeraTheme(value!),
                secondary: SizedBox(
                  width: 42,
                  child: Stack(
                    children: [
                      CircleAvatar(
                        radius: 13,
                        backgroundColor: theme.colors.first,
                      ),
                      Positioned(
                        left: 16,
                        top: 8,
                        child: CircleAvatar(
                          radius: 13,
                          backgroundColor: theme.colors.last,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      );

  Widget _buildVisualMotionControls() => Card(
        child: Column(
          children: [
            SwitchListTile(
              title: const Text('Chimera FX motion'),
              subtitle: const Text(
                'Show animated fields and reactive background effects.',
              ),
              value: widget.appState.chimeraFxEnabled,
              onChanged: widget.appState.setChimeraFxEnabled,
              activeColor: MindRecipeTokens.primary,
            ),
            if (widget.appState.chimeraFxEnabled)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 4, 16, 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'FX intensity · ${(_chimeraFxIntensity * 100).round()}%',
                    ),
                    Slider(
                      value: _chimeraFxIntensity,
                      min: 0.2,
                      max: 1,
                      divisions: 8,
                      label: '${(_chimeraFxIntensity * 100).round()}%',
                      onChanged: (value) =>
                          setState(() => _chimeraFxIntensity = value),
                      onChangeEnd: widget.appState.setChimeraFxIntensity,
                    ),
                    Wrap(
                      spacing: 8,
                      children: [
                        for (final preset in const [
                          ('Calm', 0.3),
                          ('Balanced', 0.7),
                          ('Vivid', 1.0),
                        ])
                          ActionChip(
                            label: Text(preset.$1),
                            onPressed: () {
                              setState(() => _chimeraFxIntensity = preset.$2);
                              widget.appState.setChimeraFxIntensity(preset.$2);
                            },
                          ),
                      ],
                    ),
                  ],
                ),
              ),
            if (widget.appState.chimeraFxEnabled) const Divider(height: 1),
            if (widget.appState.chimeraFxEnabled)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 14, 16, 6),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'BACKGROUND VFX',
                      style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 1.1),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '12 animated backgrounds — subtle, reactive to swipes and movement.',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                    const SizedBox(height: 10),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        for (final v in const [
                          ('field', 'Field Flux', Icons.gradient_rounded),
                          ('nebula', 'Nebula Drift', Icons.blur_on_rounded),
                          ('rivers', 'Data Rivers', Icons.water_rounded),
                          ('tendrils', 'Energy Tendrils', Icons.bolt_rounded),
                          ('orbs', 'Orb Glow', Icons.circle_outlined),
                          ('lattice', 'Lattice Mesh', Icons.grid_on_rounded),
                          ('void', 'Void Minimal', Icons.nights_stay_rounded),
                          ('prism', 'Prism Burst', Icons.auto_awesome_rounded),
                          ('aurora', 'Aurora Bloom', Icons.wb_twilight_rounded),
                          ('ember', 'Ember Warm',
                              Icons.local_fire_department_rounded),
                          ('ocean', 'Ocean Depth', Icons.waves_rounded),
                          ('twilight', 'Twilight Veil', Icons.nightlight_rounded),
                        ])
                          ChoiceChip(
                            label: Text(v.$2),
                            avatar: Icon(v.$3, size: 18),
                            selected:
                                widget.appState.chimeraFxVariant == v.$1,
                            onSelected: (_) => setState(() {
                              widget.appState.setChimeraFxVariant(v.$1);
                            }),
                          ),
                      ],
                    ),
                  ],
                ),
              ),
            const Divider(height: 1),
            SwitchListTile(
              title: const Text('3D Familiar companion'),
              subtitle: const Text(
                  'Show the iridescent orb familiar that reacts to voice and follows your theme.'),
              value: widget.appState.familiarEnabled,
              onChanged: widget.appState.setFamiliarEnabled,
              secondary: const Icon(Icons.bubble_chart_rounded),
            ),
            if (widget.appState.familiarEnabled)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
                child: Row(
                  children: [
                    const FamiliarOrb3D(
                        size: 54, isSpeaking: false, isListening: false),
                    const SizedBox(width: 12),
                    const Expanded(
                        child: Text(
                            'Your familiar floats, glows with voice, and tilts with movement. Tap it to return to Navigator.',
                            style: TextStyle(fontSize: 12))),
                  ],
                ),
              ),
          ],
        ),
      );

  Widget _buildVoiceControls() => Card(
        child: const ListTile(
          leading: Icon(Icons.mic_none_rounded),
          title: Text('Natural turn-taking'),
          subtitle: Text(
            'Mind Recipe reads its reply, then reopens the microphone. Tap the microphone while it is speaking to interrupt and answer immediately.',
          ),
        ),
      );
}
