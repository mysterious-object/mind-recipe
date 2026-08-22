package io.mindnav.mind_nav

import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.media.MediaPlayer
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.os.SystemClock
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.util.Log
import io.flutter.embedding.engine.plugins.FlutterPlugin
import java.util.Locale
import java.util.UUID
import io.flutter.embedding.engine.plugins.activity.ActivityAware
import io.flutter.embedding.engine.plugins.activity.ActivityPluginBinding
import io.flutter.plugin.common.EventChannel
import io.flutter.plugin.common.MethodCall
import io.flutter.plugin.common.MethodChannel
import io.flutter.plugin.common.MethodChannel.MethodCallHandler
import io.flutter.plugin.common.MethodChannel.Result
import io.flutter.plugin.common.PluginRegistry
import java.io.File

/** Native voice bridge with explicit microphone permission and one-shot turns. */
class VoicePlugin : FlutterPlugin, MethodCallHandler, EventChannel.StreamHandler,
    ActivityAware, PluginRegistry.RequestPermissionsResultListener {
    companion object {
        private const val RECORD_AUDIO_REQUEST = 4407
        private const val LOG_TAG = "MindNavVoice"
    }

    private lateinit var methodChannel: MethodChannel
    private lateinit var eventChannel: EventChannel
    private var context: Context? = null
    private var activity: Activity? = null
    private var activityBinding: ActivityPluginBinding? = null
    private var speechRecognizer: SpeechRecognizer? = null
    private var mediaPlayer: MediaPlayer? = null
    private var pendingAudioResult: Result? = null
    private var textToSpeech: TextToSpeech? = null
    private var pendingTtsResult: Result? = null
    private var ttsReady = false
    private var eventSink: EventChannel.EventSink? = null
    private var listeningResult: Result? = null
    private var pendingLanguage = "en-US"
    private var pendingSilenceTimeoutMs = 2500
    private var latestTranscript: String? = null
    private var recognitionRetries = 0
    private var recognitionRetryPending = false
    private var speechStartedAtMs = 0L
    private val voiceHandler = Handler(Looper.getMainLooper())
    private val finishAfterPause = Runnable {
        if (!latestTranscript.isNullOrBlank()) {
            Log.i(LOG_TAG, "listening finalized after pause")
            completeListening(latestTranscript)
        }
    }
    private val finishAtTurnLimit = Runnable {
        Log.i(LOG_TAG, "listening reached turn limit transcript=${!latestTranscript.isNullOrBlank()}")
        completeListening(latestTranscript)
    }

    override fun onAttachedToEngine(binding: FlutterPlugin.FlutterPluginBinding) {
        context = binding.applicationContext
        methodChannel = MethodChannel(binding.binaryMessenger, "mindnav.dev/voice")
        eventChannel = EventChannel(binding.binaryMessenger, "mindnav.dev/voice_stream")
        methodChannel.setMethodCallHandler(this)
        eventChannel.setStreamHandler(this)
        textToSpeech = TextToSpeech(binding.applicationContext) { status ->
            ttsReady = status == TextToSpeech.SUCCESS
            if (ttsReady) {
                textToSpeech?.language = Locale.US
                textToSpeech?.setSpeechRate(0.95f)
                Log.i(LOG_TAG, "system TTS ready")
            } else {
                Log.w(LOG_TAG, "system TTS not ready status=$status")
            }
        }
    }

    override fun onMethodCall(call: MethodCall, result: Result) {
        when (call.method) {
            "isAvailable" -> result.success(
                context?.let { SpeechRecognizer.isRecognitionAvailable(it) } == true
            )
            "startListening" -> {
                if (listeningResult != null) {
                    result.error("ALREADY_LISTENING", "Mind Nav is already listening.", null)
                    return
                }
                listeningResult = result
                pendingLanguage = call.argument<String>("language") ?: "en-US"
                pendingSilenceTimeoutMs =
                    (call.argument<Int>("silenceTimeoutMs") ?: 3000).coerceIn(1800, 8_000)
                recognitionRetries = 0
                recognitionRetryPending = false
                requestPermissionThenListen()
            }
            "stopListening" -> {
                completeListening(latestTranscript)
                result.success(true)
            }
            "stopSpeaking" -> {
                stopAudioPlayback()
                stopTtsPlayback()
                result.success(true)
            }
            "playAudio" -> playAudio(call.argument<String>("path") ?: "", false, result)
            "playAudioAndWait" -> playAudio(call.argument<String>("path") ?: "", true, result)
            "speakWithSystemTts" -> speakWithSystemTts(
                call.argument<String>("text") ?: "",
                call.argument<Double>("rate")?.toFloat() ?: 0.95f,
                result
            )
            "speakWithSystemTtsAndWait" -> speakWithSystemTts(
                call.argument<String>("text") ?: "",
                call.argument<Double>("rate")?.toFloat() ?: 0.95f,
                result
            )
            "getLanguages" -> result.success(listOf("en-US", "en-GB", "es-ES", "fr-FR", "de-DE"))
            else -> result.notImplemented()
        }
    }

    private fun hasRecordPermission(): Boolean =
        Build.VERSION.SDK_INT < Build.VERSION_CODES.M ||
            activity?.checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED

    private fun requestPermissionThenListen() {
        if (context == null || !SpeechRecognizer.isRecognitionAvailable(context!!)) {
            completeListening(null)
            return
        }
        if (hasRecordPermission()) {
            beginListening()
            return
        }
        val host = activity
        if (host == null) {
            completeListening(null)
            return
        }
        host.requestPermissions(arrayOf(Manifest.permission.RECORD_AUDIO), RECORD_AUDIO_REQUEST)
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray,
    ): Boolean {
        if (requestCode != RECORD_AUDIO_REQUEST) return false
        if (grantResults.firstOrNull() == PackageManager.PERMISSION_GRANTED) {
            beginListening()
        } else {
            completeListening(null)
        }
        return true
    }

    private fun beginListening() {
        releaseRecognizer()
        latestTranscript = null
        Log.i(LOG_TAG, "using system recognizer")
        val recognizer = SpeechRecognizer.createSpeechRecognizer(context)
        speechRecognizer = recognizer
        recognizer.setRecognitionListener(object : RecognitionListener {
            override fun onReadyForSpeech(params: Bundle?) {
                Log.i(LOG_TAG, "listening ready")
                eventSink?.success(mapOf("state" to "ready"))
            }
            override fun onBeginningOfSpeech() {
                voiceHandler.removeCallbacks(finishAfterPause)
                speechStartedAtMs = SystemClock.elapsedRealtime()
                Log.i(LOG_TAG, "speech detected")
                eventSink?.success(mapOf("state" to "hearing"))
            }
            override fun onRmsChanged(rmsdB: Float) {}
            override fun onBufferReceived(buffer: ByteArray?) {}
            override fun onEndOfSpeech() {
                eventSink?.success(mapOf("state" to "processing"))
                voiceHandler.removeCallbacks(finishAfterPause)
                val speechDuration = SystemClock.elapsedRealtime() - speechStartedAtMs
                if (speechDuration >= 500) {
                    // onEndOfSpeech means the recognition service already owns
                    // the captured audio and is preparing onResults. Calling
                    // stopListening here can cancel that final transcript on
                    // some Samsung/Google service combinations.
                    Log.i(LOG_TAG, "speech ended; awaiting final transcript")
                    // Results normally arrive immediately.  A short safety
                    // completion keeps the turn responsive on recognizers
                    // that occasionally never send a final callback.
                    voiceHandler.postDelayed(finishAfterPause, 1500)
                }
            }
            override fun onError(error: Int) {
                if (recognitionRetryPending) return
                // Android frequently reports NO_MATCH/TIMEOUT before the member
                // has had a comfortable chance to respond. Preserve partial
                // speech and retry one fresh local recognition turn.
                if (latestTranscript.isNullOrBlank() &&
                    recognitionRetries < 1 &&
                    (error == SpeechRecognizer.ERROR_NO_MATCH ||
                        error == SpeechRecognizer.ERROR_SPEECH_TIMEOUT ||
                        error == SpeechRecognizer.ERROR_NETWORK_TIMEOUT)
                ) {
                    recognitionRetries += 1
                    recognitionRetryPending = true
                    Log.i(LOG_TAG, "listening retry after error=$error")
                    eventSink?.success(mapOf("state" to "retrying"))
                    speechRecognizer?.destroy()
                    speechRecognizer = null
                    Handler(Looper.getMainLooper()).postDelayed({
                        recognitionRetryPending = false
                        beginListening()
                    }, 450)
                } else {
                    Log.i(
                        LOG_TAG,
                        "listening completed error=$error transcript=${!latestTranscript.isNullOrBlank()}",
                    )
                    completeListening(latestTranscript)
                }
            }
            override fun onResults(results: Bundle?) {
                val transcript = bestTranscript(results)
                Log.i(LOG_TAG, "listening completed transcript=${!transcript.isNullOrBlank()}")
                completeListening(transcript)
            }
            override fun onPartialResults(partialResults: Bundle?) {
                latestTranscript = bestTranscript(partialResults) ?: latestTranscript
                latestTranscript?.let { eventSink?.success(mapOf("state" to "partial", "text" to it)) }
            }
            override fun onEvent(eventType: Int, params: Bundle?) {}
        })
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, pendingLanguage)
            putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
            putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3)
            putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS, 1200L)
            putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS, pendingSilenceTimeoutMs)
            putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS, pendingSilenceTimeoutMs)
        }
        recognizer.startListening(intent)
        voiceHandler.removeCallbacks(finishAtTurnLimit)
        voiceHandler.postDelayed(finishAtTurnLimit, 12_000)
    }

    private fun bestTranscript(results: Bundle?): String? =
        results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
            ?.firstOrNull()
            ?.trim()
            ?.takeIf { it.isNotEmpty() }

    private fun completeListening(transcript: String?) {
        val result = listeningResult ?: return
        listeningResult = null
        recognitionRetryPending = false
        voiceHandler.removeCallbacks(finishAfterPause)
        voiceHandler.removeCallbacks(finishAtTurnLimit)
        releaseRecognizer()
        result.success(transcript)
    }

    private fun releaseRecognizer() {
        speechRecognizer?.cancel()
        speechRecognizer?.destroy()
        speechRecognizer = null
    }

    private fun playAudio(path: String, wait: Boolean, result: Result) {
        try {
            val file = File(path)
            if (!file.exists()) {
                result.error("FILE_NOT_FOUND", "Audio file not found", null)
                return
            }
            stopAudioPlayback()
            if (wait) pendingAudioResult = result
            mediaPlayer = MediaPlayer().apply {
                setDataSource(path)
                setOnPreparedListener { it.start() }
                setOnCompletionListener {
                    completeAudioPlayback(true)
                }
                setOnErrorListener { _, _, _ ->
                    completeAudioPlayback(false)
                    true
                }
                prepareAsync()
            }
            if (!wait) result.success(true)
        } catch (error: Exception) {
            if (wait && pendingAudioResult != null) {
                completeAudioPlayback(false)
            } else {
                result.error("PLAY_ERROR", error.message ?: "Audio playback failed", null)
            }
        }
    }

    private fun completeAudioPlayback(completed: Boolean) {
        val result = pendingAudioResult
        pendingAudioResult = null
        result?.success(completed)
        mediaPlayer?.release()
        mediaPlayer = null
    }

    private fun stopAudioPlayback() {
        try {
            mediaPlayer?.stop()
        } catch (_: IllegalStateException) {
            // A preparing or already completed player can be safely released.
        }
        completeAudioPlayback(false)
    }

    private fun speakWithSystemTts(text: String, rate: Float, result: Result) {
        if (text.isBlank()) {
            result.error("EMPTY_TEXT", "No text to speak", null)
            return
        }
        val tts = textToSpeech
        if (tts == null || !ttsReady) {
            Log.w(LOG_TAG, "system TTS not ready, cannot speak offline")
            result.error("TTS_NOT_READY", "System TTS not ready", null)
            return
        }
        try {
            stopAudioPlayback()
            stopTtsPlayback()
            val utteranceId = UUID.randomUUID().toString()
            pendingTtsResult = result
            tts.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                override fun onStart(utteranceId: String?) {}
                override fun onDone(doneId: String?) {
                    if (doneId == utteranceId) completeTtsPlayback(true)
                }
                @Deprecated("Deprecated in Java")
                override fun onError(failedId: String?) {
                    if (failedId == utteranceId) completeTtsPlayback(false)
                }
                override fun onError(failedId: String?, errorCode: Int) {
                    if (failedId == utteranceId) completeTtsPlayback(false)
                }
            })
            tts.setSpeechRate(rate.coerceIn(0.5f, 2.0f))
            tts.language = Locale.US
            val speakResult = tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, utteranceId)
            if (speakResult == TextToSpeech.ERROR) {
                completeTtsPlayback(false)
            }
            // For non-wait callers, we already set pending, but if they used
            // speakWithSystemTts (without wait) we still wait for completion
            // to keep epoch handling consistent.
        } catch (e: Exception) {
            Log.e(LOG_TAG, "system TTS speak failed: ${e.message}")
            completeTtsPlayback(false)
        }
    }

    private fun completeTtsPlayback(completed: Boolean) {
        val result = pendingTtsResult ?: return
        pendingTtsResult = null
        voiceHandler.post { result.success(completed) }
    }

    private fun stopTtsPlayback() {
        try {
            textToSpeech?.stop()
        } catch (_: Exception) {}
        // If a TTS utterance was pending, complete it as cancelled
        if (pendingTtsResult != null) completeTtsPlayback(false)
    }

    override fun onListen(arguments: Any?, events: EventChannel.EventSink?) { eventSink = events }
    override fun onCancel(arguments: Any?) { eventSink = null }

    override fun onAttachedToActivity(binding: ActivityPluginBinding) {
        activity = binding.activity
        activityBinding = binding
        binding.addRequestPermissionsResultListener(this)
    }
    override fun onDetachedFromActivityForConfigChanges() { detachActivity() }
    override fun onReattachedToActivityForConfigChanges(binding: ActivityPluginBinding) { onAttachedToActivity(binding) }
    override fun onDetachedFromActivity() { detachActivity() }

    private fun detachActivity() {
        activityBinding?.removeRequestPermissionsResultListener(this)
        activityBinding = null
        activity = null
        completeListening(null)
    }

    override fun onDetachedFromEngine(binding: FlutterPlugin.FlutterPluginBinding) {
        detachActivity()
        releaseRecognizer()
        stopAudioPlayback()
        stopTtsPlayback()
        textToSpeech?.shutdown()
        textToSpeech = null
        ttsReady = false
        methodChannel.setMethodCallHandler(null)
        eventChannel.setStreamHandler(null)
        context = null
    }
}
