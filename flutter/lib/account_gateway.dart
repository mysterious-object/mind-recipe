import 'package:flutter/material.dart';

import 'app_services.dart';
import 'three_background.dart';
import 'three_brand_mark.dart';
import 'visual_theme.dart';

class AccountGateway extends StatefulWidget {
  const AccountGateway({super.key, required this.api, required this.appState});
  final MindRecipeApiClient api;
  final SecureAppState appState;

  @override
  State<AccountGateway> createState() => _AccountGatewayState();
}

class _AccountGatewayState extends State<AccountGateway> {
  final name = TextEditingController();
  final email = TextEditingController();
  final password = TextEditingController();
  final confirmPassword = TextEditingController();
  final resetToken = TextEditingController();
  bool creating = false;
  bool resetting = false;
  bool resetTokenStage = false;
  bool busy = false;
  bool obscure = true;
  bool acceptedTerms = false;
  String? error;
  String? info;

  @override
  void initState() {
    super.initState();
  }

  String? _validationError() {
    final normalizedEmail = email.text.trim();
    if (resetting) {
      if (!normalizedEmail.contains('@') || !normalizedEmail.contains('.')) {
        return 'Enter a valid email address.';
      }
      if (!resetTokenStage) return null;
      if (resetToken.text.trim().length < 16) {
        return 'Paste the reset code from the link or support message.';
      }
      if (password.text.length < 10) {
        return 'New password must contain at least 10 characters.';
      }
      if (password.text != confirmPassword.text) {
        return 'Passwords do not match.';
      }
      return null;
    }
    if (creating && name.text.trim().length < 2) {
      return 'Enter the name you want MindRecipe to use.';
    }
    if (!normalizedEmail.contains('@') || !normalizedEmail.contains('.')) {
      return 'Enter a valid email address.';
    }
    if (password.text.length < 10) {
      return 'Password must contain at least 10 characters.';
    }
    if (creating && password.text != confirmPassword.text) {
      return 'Passwords do not match.';
    }
    if (creating && !acceptedTerms) {
      return 'Review and accept the privacy and wellness terms to continue.';
    }
    return null;
  }

  @override
  void dispose() {
    name.dispose();
    email.dispose();
    password.dispose();
    confirmPassword.dispose();
    resetToken.dispose();
    super.dispose();
  }

  Future<void> submitReset() async {
    final validation = _validationError();
    if (validation != null) {
      setState(() => error = validation);
      return;
    }
    setState(() {
      busy = true;
      error = null;
    });
    try {
      if (!resetTokenStage) {
        final token = await widget.api.requestPasswordReset(
          email: email.text.trim(),
        );
        if (!mounted) return;
        setState(() {
          resetTokenStage = true;
          info = token != null
              ? 'Staging reset code ready — it has been filled in for you. Choose a new password below.'
              : 'If that email has an account, a reset code is on its way. Paste it below with your new password.';
        });
        if (token != null && mounted) resetToken.text = token;
      } else {
        final session = await widget.api.confirmPasswordReset(
          email: email.text.trim(),
          token: resetToken.text.trim(),
          newPassword: password.text,
        );
        await widget.appState.setSession(session);
      }
    } on ApiException catch (exception) {
      if (mounted) setState(() => error = exception.message);
    } catch (_) {
      if (mounted) {
        setState(
          () => error = 'MindRecipe could not reach the account service. Check your connection and try again.',
        );
      }
    } finally {
      if (mounted) setState(() => busy = false);
    }
  }

  Future<void> submit() async {
    if (resetting) {
      await submitReset();
      return;
    }
    final validation = _validationError();
    if (validation != null) {
      setState(() => error = validation);
      return;
    }
    setState(() {
      busy = true;
      error = null;
    });
    try {
      final session = creating
          ? await widget.api.register(
              name: name.text.trim(),
              email: email.text.trim(),
              password: password.text,
            )
          : await widget.api.login(
              email: email.text.trim(),
              password: password.text,
            );
      await widget.appState.setSession(session);
    } on ApiException catch (exception) {
      setState(() => error = exception.message);
    } catch (_) {
      if (mounted) {
        setState(
          () => error = 'MindRecipe could not reach the account service. Check your connection and try again.',
        );
      }
    } finally {
      if (mounted) setState(() => busy = false);
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: Stack(
      children: [
        Positioned.fill(
          child: ThreeBackground(
            variant: visualThemeFor(widget.appState.visualThemeId).composition,
            progress: creating
                ? .34
                : resetting
                ? .67
                : .16,
            intensity: .78,
            theme: visualThemeFor(widget.appState.visualThemeId).engineTheme,
          ),
        ),
        SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 460),
                child: Card(
                  color: Theme.of(context).colorScheme.surface
                      .withValues(alpha: 0.82),
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        SizedBox(
                          height: 196,
                          child: ThreeBrandMark(
                            variant: creating
                                ? 4
                                : resetting
                                ? 8
                                : 1,
                          ),
                        ),
                        const SizedBox(height: 18),
                        Text(
                          'MindRecipe',
                          textAlign: TextAlign.center,
                          style: Theme.of(context).textTheme.labelLarge
                              ?.copyWith(
                                letterSpacing: 0,
                                fontWeight: FontWeight.w900,
                              ),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          'by Context Field',
                          textAlign: TextAlign.center,
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          resetting
                              ? (resetTokenStage
                                    ? 'Choose a new password'
                                    : 'Reset your password')
                              : creating
                              ? 'Create your private space'
                              : 'Welcome back, navigator',
                          textAlign: TextAlign.center,
                          style: Theme.of(context).textTheme.headlineSmall
                              ?.copyWith(fontWeight: FontWeight.w800),
                        ),
                        const SizedBox(height: 24),
                        if (creating && !resetting)
                          TextField(
                            controller: name,
                            textInputAction: TextInputAction.next,
                            decoration: const InputDecoration(
                              labelText: 'Name',
                              prefixIcon: Icon(Icons.person_outline),
                              border: OutlineInputBorder(),
                            ),
                          ),
                        if (creating && !resetting) const SizedBox(height: 12),
                        TextField(
                          controller: email,
                          keyboardType: TextInputType.emailAddress,
                          textInputAction: TextInputAction.next,
                          autocorrect: false,
                          decoration: const InputDecoration(
                            labelText: 'Email',
                            prefixIcon: Icon(Icons.alternate_email),
                            border: OutlineInputBorder(),
                          ),
                        ),
                        const SizedBox(height: 12),
                        if (resetting && resetTokenStage)
                          TextField(
                            controller: resetToken,
                            textInputAction: TextInputAction.next,
                            autocorrect: false,
                            decoration: const InputDecoration(
                              labelText: 'Reset code',
                              helperText:
                                  'From the reset link or support message',
                              prefixIcon: Icon(Icons.vpn_key_outlined),
                              border: OutlineInputBorder(),
                            ),
                          ),
                        if (resetting && resetTokenStage)
                          const SizedBox(height: 12),
                        if (!resetting || resetTokenStage)
                          TextField(
                            controller: password,
                            obscureText: obscure,
                            onSubmitted: (_) => busy ? null : submit(),
                            decoration: InputDecoration(
                              labelText: resetting
                                  ? 'New password'
                                  : 'Password',
                              helperText:
                                  (!resetting && creating) ||
                                      (resetting && resetTokenStage)
                                  ? '10 characters minimum'
                                  : null,
                              prefixIcon: const Icon(Icons.lock_outline),
                              border: const OutlineInputBorder(),
                              suffixIcon: IconButton(
                                onPressed: () =>
                                    setState(() => obscure = !obscure),
                                icon: Icon(
                                  obscure
                                      ? Icons.visibility_outlined
                                      : Icons.visibility_off_outlined,
                                ),
                              ),
                            ),
                          ),
                        if (creating || (resetting && resetTokenStage))
                          const SizedBox(height: 12),
                        if (creating || (resetting && resetTokenStage))
                          TextField(
                            controller: confirmPassword,
                            obscureText: obscure,
                            onSubmitted: (_) => busy ? null : submit(),
                            decoration: const InputDecoration(
                              labelText: 'Confirm password',
                              prefixIcon: Icon(Icons.lock_reset_rounded),
                              border: OutlineInputBorder(),
                            ),
                          ),
                        if (creating && !resetting)
                          CheckboxListTile(
                            contentPadding: EdgeInsets.zero,
                            value: acceptedTerms,
                            onChanged: busy
                                ? null
                                : (value) => setState(
                                    () => acceptedTerms = value ?? false,
                                  ),
                            title: const Text(
                              'I understand MindRecipe is a wellness tool, not therapy or emergency care.',
                            ),
                            subtitle: const Text(
                              'I agree to the Privacy Notice and Terms.',
                            ),
                            controlAffinity: ListTileControlAffinity.leading,
                          ),
                        if (info != null)
                          Padding(
                            padding: const EdgeInsets.only(top: 12),
                            child: Text(
                              info!,
                              style: TextStyle(
                                color: Theme.of(context).colorScheme.primary,
                              ),
                            ),
                          ),
                        if (error != null)
                          Padding(
                            padding: const EdgeInsets.only(top: 12),
                            child: Text(
                              error!,
                              style: TextStyle(
                                color: Theme.of(context).colorScheme.error,
                              ),
                            ),
                          ),
                        const SizedBox(height: 18),
                        FilledButton(
                          onPressed: busy ? null : submit,
                          child: Text(
                            busy
                                ? 'Connecting…'
                                : resetting
                                ? (resetTokenStage
                                      ? 'Set new password'
                                      : 'Send reset code')
                                : creating
                                ? 'Create account'
                                : 'Sign in',
                          ),
                        ),
                        TextButton(
                          onPressed: busy
                              ? null
                              : () => setState(() {
                                  if (resetting) {
                                    // Leaving reset flow back to sign in
                                    resetting = false;
                                    resetTokenStage = false;
                                  } else if (creating) {
                                    creating = false;
                                  } else {
                                    creating = true;
                                  }
                                  error = null;
                                  info = null;
                                }),
                          child: Text(
                            resetting
                                ? 'Back to sign in'
                                : creating
                                ? 'I already have an account'
                                : 'Create a new account',
                          ),
                        ),
                        if (!creating && !resetting)
                          TextButton(
                            onPressed: busy
                                ? null
                                : () => setState(() {
                                    resetting = true;
                                    resetTokenStage = false;
                                    error = null;
                                    info = null;
                                  }),
                            child: const Text('Forgot password?'),
                          ),
                        const SizedBox(height: 4),
                        const Text(
                          'Your account keeps Recipes progress available across your devices.',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    ),
  );
}
