import { describe, it, expect, afterEach, vi } from 'vitest';
import { findJapaneseVoice, isJapaneseVoice, loadVoices } from '../speech';
import { ANDROID_JA, GOOGLE_JA, KYOKO, SAMANTHA, installFakeSpeech, removeFakeSpeech } from './helpers/fake-speech';

afterEach(() => { vi.useRealTimers(); removeFakeSpeech(); });

describe('voice selection', () => {
  it('picks the local Japanese voice', () => expect(findJapaneseVoice([SAMANTHA, KYOKO])).toBe(KYOKO));
  it('skips a network-only Japanese voice', () => {
    expect(findJapaneseVoice([GOOGLE_JA, SAMANTHA])).toBeNull();
    expect(findJapaneseVoice([GOOGLE_JA, KYOKO])).toBe(KYOKO);
  });
  it('accepts ja_JP and ja', () => {
    expect(findJapaneseVoice([ANDROID_JA])).toBe(ANDROID_JA);
    expect(isJapaneseVoice({ ...KYOKO, lang: 'ja' })).toBe(true);
  });
  it('prefers the default local Japanese voice', () => {
    const def = { ...ANDROID_JA, default: true };
    expect(findJapaneseVoice([KYOKO, def])).toBe(def);
  });
  it('returns null for no voices', () => expect(findJapaneseVoice([])).toBeNull());
  it('resolves at once when voices exist', async () => expect(await loadVoices(installFakeSpeech([KYOKO]))).toEqual([KYOKO]));
  it('waits for voiceschanged', async () => {
    const s = installFakeSpeech([]); const p = loadVoices(s); s.setVoices([KYOKO]); s.fire('voiceschanged');
    expect(await p).toEqual([KYOKO]);
  });
  it('resolves empty after the timeout', async () => {
    vi.useFakeTimers(); const p = loadVoices(installFakeSpeech([])); await vi.advanceTimersByTimeAsync(2000);
    expect(await p).toEqual([]);
  });
  it('resolves empty without speechSynthesis', async () => expect(await loadVoices(undefined)).toEqual([]));
});
