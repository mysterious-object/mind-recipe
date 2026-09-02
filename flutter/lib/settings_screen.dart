import 'package:flutter/material.dart';

import 'app_services.dart';
import 'design_tokens.dart';
import 'on_device_inference.dart';

/// Settings screen — model selection, theme selection, and visual styling.
class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key, required this.appState});
  final SecureAppState appState;

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  late String _selectedModel;
  ThemeMode _themeMode = ThemeMode.system;
  bool _visualMotionEnabled = true;
  double _fxIntensity = 0.7;
  LocalInferenceSnapshot _privateModel = const LocalInferenceSnapshot(
    OnDeviceStatus.checking,
  );
  bool _modelActionInProgress = false;

  @override
  void initState() {
    super.initState();
    _selectedModel = widget.appState.selectedCloudModel;
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
      // Preserve the safe failure detail from OnDeviceInference below.
      if (mounted) setState(() => _privateModel = OnDeviceInference().snapshot);
    } finally {
      if (installed) await _refreshPrivateModel();
      if (mounted) setState(() => _modelActionInProgress = false);
    }
  }

  static const _models = [
    {
      'id': 'anthropic/claude-sonnet-5',
      'name': 'Claude Sonnet 5',
      'provider': 'openrouter',
    },
    {
      'id': 'anthropic/claude-opus-5',
      'name': 'Claude Opus 5',
      'provider': 'openrouter',
    },
    {
      'id': 'openai/gpt-5.6-sol',
      'name': 'GPT-5.6 Sol',
      'provider': 'openrouter',
    },
    {
      'id': 'google/gemini-3.1-pro-preview',
      'name': 'Gemini 3.1 Pro',
      'provider': 'openrouter',
    },
    {
      'id': 'openrouter/free',
      'name': 'OpenRouter Free Router',
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

        // ── Theme Selection ───────────────────────────────────────
        _buildSectionHeader('Theme'),
        _buildThemeSelector(),
        const SizedBox(height: 20),

        // ── Visual styling ─────────────────────────────────────────
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
                ),
                const SizedBox(height: 8),
                Text(
                  'Mind Recipe by Context Field',
                  style: MindRecipeTokens.title(context),
                  textAlign: TextAlign.center,
                ),
                Text(
                  'Version 1.0.0',
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
    final downloading =
        status == OnDeviceStatus.downloading ||
        status == OnDeviceStatus.verifying ||
        status == OnDeviceStatus.initializing ||
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
              onChanged: (v) async {
                if (v == null) return;
                setState(() => _selectedModel = v);
                await widget.appState.setSelectedCloudModel(v);
              },
              activeColor: MindRecipeTokens.primary,
            ),
          )
          .toList(),
    ),
  );

  Widget _buildThemeSelector() => Card(
    child: Column(
      children: [
        RadioListTile<ThemeMode>(
          title: const Text('System default'),
          subtitle: const Text('Follow your device settings'),
          value: ThemeMode.system,
          groupValue: _themeMode,
          onChanged: (v) => setState(() => _themeMode = v!),
          activeColor: MindRecipeTokens.primary,
        ),
        RadioListTile<ThemeMode>(
          title: const Text('Light mode'),
          value: ThemeMode.light,
          groupValue: _themeMode,
          onChanged: (v) => setState(() => _themeMode = v!),
          activeColor: MindRecipeTokens.primary,
        ),
        RadioListTile<ThemeMode>(
          title: const Text('Dark mode'),
          value: ThemeMode.dark,
          groupValue: _themeMode,
          onChanged: (v) => setState(() => _themeMode = v!),
          activeColor: MindRecipeTokens.primary,
        ),
      ],
    ),
  );

  Widget _buildVisualMotionControls() => Card(
    child: Column(
      children: [
        SwitchListTile(
          title: const Text('Cinematic visual motion'),
          subtitle: const Text('Animated visual effects during conversations'),
          value: _visualMotionEnabled,
          onChanged: (v) => setState(() => _visualMotionEnabled = v),
          activeColor: MindRecipeTokens.primary,
        ),
        if (_visualMotionEnabled) ...[
          const Divider(height: 1),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('FX Intensity: ${(_fxIntensity * 100).round()}%'),
                Slider(
                  value: _fxIntensity,
                  onChanged: (v) => setState(() => _fxIntensity = v),
                  activeColor: MindRecipeTokens.primary,
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  children: [
                    _buildFxPreset('Minimal', 0.3),
                    _buildFxPreset('Normal', 0.7),
                    _buildFxPreset('Intense', 1.0),
                  ],
                ),
              ],
            ),
          ),
        ],
      ],
    ),
  );

  Widget _buildFxPreset(String label, double intensity) => ActionChip(
    label: Text(label),
    onPressed: () => setState(() => _fxIntensity = intensity),
    backgroundColor: MindRecipeTokens.primary.withAlpha(40),
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
