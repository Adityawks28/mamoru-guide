export const SPEECH_LANG = 'ja-JP';
export const SPEECH_RATE = 0.8;

export function getSynth(): SpeechSynthesis | undefined {
  return typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : undefined;
}

// Android Chrome reports ja_JP, so accept both separators.
export function isJapaneseVoice(v: SpeechSynthesisVoice): boolean {
  return /^ja([-_]|$)/i.test(v.lang);
}

// Only on-device voices: a network voice is silent offline.
export function findJapaneseVoice(voices: readonly SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const local = voices.filter(v => isJapaneseVoice(v) && v.localService);
  return local.find(v => v.default) ?? local[0] ?? null;
}

// Safari and Chrome fill the voice list late, so wait for voiceschanged with a timeout.
export function loadVoices(synth: SpeechSynthesis | undefined, timeoutMs = 2000): Promise<SpeechSynthesisVoice[]> {
  if (!synth) return Promise.resolve([]);
  const now = synth.getVoices();
  if (now.length > 0) return Promise.resolve(now);
  return new Promise(resolve => {
    const finish = (): void => {
      clearTimeout(timer);
      synth.removeEventListener('voiceschanged', onChange);
      resolve(synth.getVoices());
    };
    const onChange = (): void => { if (synth.getVoices().length > 0) finish(); };
    const timer = setTimeout(finish, timeoutMs);
    synth.addEventListener('voiceschanged', onChange);
  });
}
