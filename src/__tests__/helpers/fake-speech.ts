import { vi, type Mock } from 'vitest';

const voice = (name: string, lang: string, localService: boolean, isDefault = false): SpeechSynthesisVoice =>
  ({ name, lang, localService, default: isDefault, voiceURI: name }) as SpeechSynthesisVoice;

export const KYOKO = voice('Kyoko', 'ja-JP', true);
export const GOOGLE_JA = voice('Google 日本語', 'ja-JP', false);
export const ANDROID_JA = voice('Japanese', 'ja_JP', true);
export const SAMANTHA = voice('Samantha', 'en-US', true, true);

export type FakeSynth = SpeechSynthesis & {
  speak: Mock;
  cancel: Mock;
  setVoices(v: SpeechSynthesisVoice[]): void;
  fire(type: string): void;
};

class FakeUtterance {
  text: string;
  lang = '';
  voice: SpeechSynthesisVoice | null = null;
  rate = 1;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(text = '') { this.text = text; }
}

export function installFakeSpeech(voices: SpeechSynthesisVoice[]): FakeSynth {
  let current = voices;
  const listeners = new Map<string, Array<() => void>>();
  const synth = {
    speak: vi.fn(),
    cancel: vi.fn(),
    getVoices: () => current,
    addEventListener: (type: string, fn: () => void) => { listeners.set(type, [...(listeners.get(type) ?? []), fn]); },
    removeEventListener: (type: string, fn: () => void) => { listeners.set(type, (listeners.get(type) ?? []).filter(f => f !== fn)); },
    setVoices: (v: SpeechSynthesisVoice[]) => { current = v; },
    fire: (type: string) => { (listeners.get(type) ?? []).forEach(fn => fn()); },
  } as unknown as FakeSynth;
  Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true, writable: true });
  Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: FakeUtterance, configurable: true, writable: true });
  return synth;
}

export function removeFakeSpeech(): void {
  Reflect.deleteProperty(window, 'speechSynthesis');
  Reflect.deleteProperty(window, 'SpeechSynthesisUtterance');
}
