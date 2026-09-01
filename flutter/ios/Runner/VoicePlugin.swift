import Flutter
import AVFoundation
import Speech

/// Mirrors the Android bridge: calls complete with a final transcript or
/// playback result, rather than asking Flutter to infer completion from events.
class VoicePlugin: NSObject, FlutterPlugin, FlutterStreamHandler, SFSpeechRecognizerDelegate, AVSpeechSynthesizerDelegate, AVAudioPlayerDelegate {
    private var speechRecognizer: SFSpeechRecognizer?
    private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recognitionTask: SFSpeechRecognitionTask?
    private let audioEngine = AVAudioEngine()
    private var eventSink: FlutterEventSink?
    private let tts = AVSpeechSynthesizer()
    private var audioPlayer: AVAudioPlayer?
    private var listeningResult: FlutterResult?
    private var ttsResult: FlutterResult?
    private var audioResult: FlutterResult?
    private var latestTranscript: String?
    private var listeningTimer: Timer?
    private var hasInputTap = false

    public static func register(with registrar: FlutterPluginRegistrar) {
        let methodChannel = FlutterMethodChannel(name: "contextfield.mindrecipe/voice", binaryMessenger: registrar.messenger())
        let eventChannel = FlutterEventChannel(name: "contextfield.mindrecipe/voice_stream", binaryMessenger: registrar.messenger())
        let instance = VoicePlugin()
        instance.tts.delegate = instance
        registrar.addMethodCallDelegate(instance, channel: methodChannel)
        eventChannel.setStreamHandler(instance)
    }

    func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
        switch call.method {
        case "isAvailable":
            // Permission is requested by startListening. Returning false here
            // would prevent Flutter from ever reaching that first prompt.
            result(SFSpeechRecognizer(locale: Locale(identifier: "en-US")) != nil)
        case "startListening":
            let args = call.arguments as? [String: Any]
            startListening(language: args?["language"] as? String ?? "en-US", result: result)
        case "stopListening":
            completeListening(latestTranscript)
            result(true)
        case "playAudio", "playAudioAndWait":
            let path = (call.arguments as? [String: Any])?["path"] as? String ?? ""
            playAudio(path: path, wait: call.method == "playAudioAndWait", result: result)
        case "speakWithSystemTts", "speakWithSystemTtsAndWait", "speak":
            let args = call.arguments as? [String: Any]
            speakText(text: args?["text"] as? String ?? "", rate: Float(args?["rate"] as? Double ?? 0.5), language: args?["language"] as? String ?? "en-GB", result: result)
        case "stopSpeaking":
            tts.stopSpeaking(at: .immediate)
            stopAudioPlayback()
            result(true)
        case "getLanguages": result(["en-US", "en-GB", "es-ES", "fr-FR", "de-DE"])
        default: result(FlutterMethodNotImplemented)
        }
    }

    private func startListening(language: String, result: @escaping FlutterResult) {
        guard listeningResult == nil else { result(FlutterError(code: "ALREADY_LISTENING", message: "MindRecipe is already listening.", details: nil)); return }
        let requestMicrophone: () -> Void = { [weak self] in
            AVAudioSession.sharedInstance().requestRecordPermission { granted in
                DispatchQueue.main.async {
                    if granted {
                        self?.beginRecognition(language: language, result: result)
                    } else {
                        result(nil)
                    }
                }
            }
        }
        if SFSpeechRecognizer.authorizationStatus() == .authorized { requestMicrophone(); return }
        SFSpeechRecognizer.requestAuthorization { status in
            DispatchQueue.main.async {
                if status == .authorized {
                    requestMicrophone()
                } else {
                    result(nil)
                }
            }
        }
    }

    private func beginRecognition(language: String, result: @escaping FlutterResult) {
        stopRecognitionEngine()
        listeningResult = result
        latestTranscript = nil
        speechRecognizer = SFSpeechRecognizer(locale: Locale(identifier: language))
        guard let recognizer = speechRecognizer, recognizer.isAvailable else { completeListening(nil); return }
        let request = SFSpeechAudioBufferRecognitionRequest()
        request.shouldReportPartialResults = true
        recognitionRequest = request
        let inputNode = audioEngine.inputNode
        recognitionTask = recognizer.recognitionTask(with: request) { [weak self] recognition, error in
            guard let self else { return }
            if let text = recognition?.bestTranscription.formattedString, !text.isEmpty {
                self.latestTranscript = text
                self.eventSink?(["state": recognition?.isFinal == true ? "processing" : "partial", "text": text])
            }
            if error != nil || recognition?.isFinal == true { self.completeListening(self.latestTranscript) }
        }
        let format = inputNode.outputFormat(forBus: 0)
        inputNode.installTap(onBus: 0, bufferSize: 1024, format: format) { [weak self] buffer, _ in self?.recognitionRequest?.append(buffer) }
        hasInputTap = true
        do {
            try AVAudioSession.sharedInstance().setCategory(.record, mode: .measurement, options: .duckOthers)
            try AVAudioSession.sharedInstance().setActive(true, options: .notifyOthersOnDeactivation)
            audioEngine.prepare()
            try audioEngine.start()
            eventSink?(["state": "ready"])
            listeningTimer?.invalidate()
            listeningTimer = Timer.scheduledTimer(withTimeInterval: 15, repeats: false) { [weak self] _ in
                self?.completeListening(self?.latestTranscript)
            }
        } catch { completeListening(nil) }
    }

    private func completeListening(_ transcript: String?) {
        guard let callback = listeningResult else { return }
        listeningResult = nil
        stopRecognitionEngine()
        callback(transcript)
    }

    private func stopRecognitionEngine() {
        listeningTimer?.invalidate()
        listeningTimer = nil
        recognitionRequest?.endAudio()
        audioEngine.stop()
        if hasInputTap {
            audioEngine.inputNode.removeTap(onBus: 0)
            hasInputTap = false
        }
        recognitionTask?.cancel()
        recognitionTask = nil
        recognitionRequest = nil
    }

    private func playAudio(path: String, wait: Bool, result: @escaping FlutterResult) {
        guard FileManager.default.fileExists(atPath: path) else { result(FlutterError(code: "FILE_NOT_FOUND", message: "Audio file not found", details: nil)); return }
        stopAudioPlayback()
        do {
            try preparePlaybackSession()
            let player = try AVAudioPlayer(contentsOf: URL(fileURLWithPath: path))
            audioPlayer = player
            player.delegate = self
            if wait { audioResult = result }
            player.prepareToPlay()
            player.play()
            if !wait { result(true) }
        } catch { result(FlutterError(code: "PLAY_ERROR", message: error.localizedDescription, details: nil)) }
    }

    private func stopAudioPlayback() {
        audioPlayer?.stop()
        audioPlayer = nil
        if let callback = audioResult { audioResult = nil; callback(false) }
    }

    func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        audioPlayer = nil
        if let callback = audioResult { audioResult = nil; callback(flag) }
    }

    private func speakText(text: String, rate: Float, language: String, result: @escaping FlutterResult) {
        guard !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { result(FlutterError(code: "EMPTY_TEXT", message: "No text to speak", details: nil)); return }
        tts.stopSpeaking(at: .immediate)
        if let callback = ttsResult { ttsResult = nil; callback(false) }
        do {
            try preparePlaybackSession()
        } catch {
            result(FlutterError(code: "AUDIO_SESSION", message: error.localizedDescription, details: nil))
            return
        }
        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = AVSpeechSynthesisVoice(language: language) ?? AVSpeechSynthesisVoice(language: "en-GB")
        // Flutter uses a cross-platform multiplier around 1.0. AVFoundation's
        // useful spoken-word range is much lower and otherwise sounds rushed.
        utterance.rate = min(max(rate * AVSpeechUtteranceDefaultSpeechRate, 0.35), 0.58)
        ttsResult = result
        tts.speak(utterance)
    }

    private func preparePlaybackSession() throws {
        stopRecognitionEngine()
        let session = AVAudioSession.sharedInstance()
        try session.setCategory(.playback, mode: .spokenAudio, options: [.duckOthers])
        try session.setActive(true, options: .notifyOthersOnDeactivation)
    }

    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance) { if let callback = ttsResult { ttsResult = nil; callback(true) } }
    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didCancel utterance: AVSpeechUtterance) { if let callback = ttsResult { ttsResult = nil; callback(false) } }
    func onListen(withArguments arguments: Any?, eventSink events: @escaping FlutterEventSink) -> FlutterError? { eventSink = events; return nil }
    func onCancel(withArguments arguments: Any?) -> FlutterError? { eventSink = nil; return nil }
}
