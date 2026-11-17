// Quiet, locally synthesized ambience; no streaming or microphone access.
export function playSoundscape(seconds = 8): () => void {
  const context = new AudioContext();
  const gain = context.createGain();
  gain.gain.setValueAtTime(0, context.currentTime);
  gain.gain.linearRampToValueAtTime(0.035, context.currentTime + 1);
  gain.connect(context.destination);
  const tones = [174.61, 261.63, 349.23].map(frequency => {
    const tone = context.createOscillator();
    tone.frequency.value = frequency; tone.connect(gain); tone.start();
    return tone;
  });
  void context.resume();
  let stopped = false;
  const stop = () => { if (stopped) return; stopped = true; clearTimeout(timer); tones.forEach(tone => tone.stop()); void context.close(); };
  const timer = setTimeout(stop, seconds * 1000);
  return stop;
}
