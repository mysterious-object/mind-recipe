import Flutter
import AVFoundation
import Speech

class VoicePlugin: NSObject, FlutterPlugin, FlutterStreamHandler, SFSpeechRecognizerDelegate {
    private var speechRecognizer: SFSpeechRecognizer?
    private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recognitionTask: SFSpeechRecognitionTask?
    private var audioEngine = AVAudioEngine()
    private var eventSink: FlutterEventSink?
    private var tts: AVSpeechSynthesizer?
    
    public static func register(with registrar: FlutterPluginRegistrar) {
        let methodChannel = FlutterMethodChannel(name: "mindnav.dev/voice", binaryMessenger: registrar.messenger())
        let eventChannel = FlutterEventChannel(name: "mindnav.dev/voice_stream", binaryMessenger: registrar.messenger())
        let instance = VoicePlugin()
        registrar.addMethodCallDelegate(instance, channel: methodChannel)
        eventChannel.setStreamHandler(instance)
    }
    
    func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
        switch call.method {
        case "isAvailable":
            result(SFSpeechRecognizer.authorizationStatus() == .authorized)
        case "startListening":
            startListening(result: result)
        case "stopListening":
            stopListening()
            result(true)
        case "speak":
            guard let args = call.arguments as? [String: Any],
                  let text = args["text"] as? String else {
                result(false)
                return
            }
            let rate = Float(args["rate"] as? Double ?? 0.5)
            let pitch = Float(args["pitch"] as? Double ?? 1.0)
            speakText(text: text, rate: rate, pitch: pitch)
            result(true)
        case "stopSpeaking":
            tts?.stopSpeaking(at: .immediate)
            result(true)
        case "getLanguages":
            result(["en-US", "en-GB", "es-ES", "fr-FR", "de-DE"])
        default:
            result(FlutterMethodNotImplemented)
        }
    }
    
    private func startListening(result: @escaping FlutterResult) {
        SFSpeechRecognizer.requestAuthorization { [weak self] status in
            guard status == .authorized else {
                result(false)
                return
            }
            
            DispatchQueue.main.async {
                self?.performSpeechRecognition()
                result(true)
            }
        }
    }
    
    private func performSpeechRecognition() {
        let inputNode = audioEngine.inputNode
        
        recognitionRequest = SFSpeechAudioBufferRecognitionRequest()
        guard let recognitionRequest = recognitionRequest else { return }
        
        recognitionRequest.shouldReportPartialResults = true
        
        speechRecognizer = SFSpeechRecognizer(locale: Locale(identifier: "en-US"))
        recognitionTask = speechRecognizer?.recognitionTask(with: recognitionRequest) { [weak self] result, error in
            if let result = result {
                DispatchQueue.main.async {
                    self?.eventSink?(result.bestTranscription.formattedString)
                }
            }
            if error != nil || (result?.isFinal ?? false) {
                self?.audioEngine.stop()
                inputNode.removeTap(onBus: 0)
                self?.recognitionRequest = nil
                self?.recognitionTask = nil
            }
        }
        
        let recordingFormat = inputNode.outputFormat(forBus: 0)
        inputNode.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat) { buffer, _ in
            self.recognitionRequest?.append(buffer)
        }
        
        audioEngine.prepare()
        try? audioEngine.start()
    }
    
    private func stopListening() {
        audioEngine.stop()
        recognitionRequest?.endAudio()
    }
    
    private func speakText(text: String, rate: Float, pitch: Float) {
        tts = AVSpeechSynthesizer()
        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = AVSpeechSynthesisVoice(language: "en-US")
        utterance.rate = rate
        utterance.pitchMultiplier = pitch
        utterance.preUtteranceDelay = 0.1
        utterance.postUtteranceDelay = 0.1
        tts?.speak(utterance)
    }
    
    func onListen(withArguments arguments: Any?, eventSink events: @escaping FlutterEventSink) -> FlutterError? {
        self.eventSink = events
        return nil
    }
    
    func onCancel(withArguments arguments: Any?) -> FlutterError? {
        self.eventSink = nil
        return nil
    }
}
