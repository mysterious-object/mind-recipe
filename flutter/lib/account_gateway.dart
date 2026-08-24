import 'package:flutter/material.dart';

import 'app_services.dart';
import 'mind_recipe_fx.dart';

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
  bool creating = false;
  bool busy = false;
  bool obscure = true;
  bool acceptedTerms = false;
  String? error;

  String? _validationError() {
    final normalizedEmail = email.text.trim();
    if (creating && name.text.trim().length < 2) {
      return 'Enter the name you want Mind Recipe to use.';
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
    super.dispose();
  }

  Future<void> submit() async {
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
          () => error = 'Mind Recipe could not reach the account service. Check your connection and try again.',
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
        const Positioned.fill(child: MindRecipeGpuField(progress: 0.16)),
        const Positioned.fill(child: MindRecipeFxBackdrop(progress: 0.16)),
        SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 460),
                child: Card(
                  color: Theme.of(context).colorScheme.surface
                      .withValues(alpha: 0.92),
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Center(
                          child: Image.asset(
                            'assets/branding/mind-recipe-mark.png',
                            height: 92,
                            fit: BoxFit.contain,
                          ),
                        ),
                        const SizedBox(height: 18),
                        Text(
                          'MIND RECIPE',
                          textAlign: TextAlign.center,
                          style: Theme.of(context).textTheme.labelLarge
                              ?.copyWith(
                                letterSpacing: 3,
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
                          creating
                              ? 'Create your private space'
                              : 'Welcome back, navigator',
                          textAlign: TextAlign.center,
                          style: Theme.of(context).textTheme.headlineSmall
                              ?.copyWith(fontWeight: FontWeight.w800),
                        ),
                        const SizedBox(height: 24),
                        if (creating)
                          TextField(
                            controller: name,
                            textInputAction: TextInputAction.next,
                            decoration: const InputDecoration(
                              labelText: 'Name',
                              prefixIcon: Icon(Icons.person_outline),
                              border: OutlineInputBorder(),
                            ),
                          ),
                        if (creating) const SizedBox(height: 12),
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
                        TextField(
                          controller: password,
                          obscureText: obscure,
                          onSubmitted: (_) => busy ? null : submit(),
                          decoration: InputDecoration(
                            labelText: 'Password',
                            helperText: creating
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
                        if (creating) const SizedBox(height: 12),
                        if (creating)
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
                        if (creating)
                          CheckboxListTile(
                            contentPadding: EdgeInsets.zero,
                            value: acceptedTerms,
                            onChanged: busy
                                ? null
                                : (value) => setState(
                                    () => acceptedTerms = value ?? false,
                                  ),
                            title: const Text(
                              'I understand Mind Recipe is a wellness tool, not therapy or emergency care.',
                            ),
                            subtitle: const Text(
                              'I agree to the Privacy Notice and Terms.',
                            ),
                            controlAffinity: ListTileControlAffinity.leading,
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
                                : creating
                                ? 'Create account'
                                : 'Sign in',
                          ),
                        ),
                        TextButton(
                          onPressed: busy
                              ? null
                              : () => setState(() {
                                  creating = !creating;
                                  error = null;
                                }),
                          child: Text(
                            creating
                                ? 'I already have an account'
                                : 'Create a new account',
                          ),
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
