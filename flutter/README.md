# Mind Recipe Flutter app

Run with a verified booking URL only:

```bash
flutter run --dart-define=BOOKING_URL=https://your-approved-scheduler.example
```

Do not add provider keys to Dart defines or source control. The upcoming secure
BYOK layer must use Keychain/Keystore-backed storage and the approved API.
