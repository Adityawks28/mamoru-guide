import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { initVoiceCheck } from '../voice-check';
import { t } from '../i18n';
import { GOOGLE_JA, KYOKO, SAMANTHA, installFakeSpeech, removeFakeSpeech } from './helpers/fake-speech';

let root: HTMLElement;
beforeEach(() => {
  document.body.innerHTML = '<div id="voiceCheckContainer"></div>';
  root = document.getElementById('voiceCheckContainer')!;
});
afterEach(() => removeFakeSpeech());

const click = async (sel: string, scope: ParentNode = root): Promise<void> => {
  scope.querySelector<HTMLElement>(sel)!.click();
  await new Promise(r => setTimeout(r, 0));
};

describe('voice check page', () => {
  it('lists only Japanese voices with their localService flag', async () => {
    installFakeSpeech([SAMANTHA, GOOGLE_JA, KYOKO]);
    initVoiceCheck(root);
    await click('.vc-check');
    const rows = root.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(2);
    const cells = [...root.querySelectorAll('tbody td')].map(c => c.textContent);
    expect(cells).toContain('false');
    expect(cells).toContain('true');
    expect(root.querySelector('.vc-selected')!.textContent).toContain('Kyoko');
  });

  it('speaks the test phrase with the row voice', async () => {
    const synth = installFakeSpeech([SAMANTHA, GOOGLE_JA, KYOKO]);
    initVoiceCheck(root);
    await click('.vc-check');
    const row = [...root.querySelectorAll('tbody tr')].find(r => r.textContent!.includes('Kyoko'))!;
    await click('.vc-speak', row);
    const u = synth.speak.mock.calls[synth.speak.mock.calls.length - 1][0];
    expect(u.text).toBe('けがをしました');
    expect(u.lang).toBe('ja-JP');
    expect(u.voice).toBe(KYOKO);
    expect(u.rate).toBe(0.8);
    expect(synth.cancel.mock.invocationCallOrder[0]).toBeLessThan(synth.speak.mock.invocationCallOrder[0]);
  });

  it('shows the missing message without speechSynthesis', async () => {
    removeFakeSpeech();
    initVoiceCheck(root);
    await click('.vc-check');
    expect(root.querySelector('.vc-output')!.textContent).toBe(t('vc.missing'));
  });

  it('is not linked from any menu', () => {
    expect(readFileSync('index.html', 'utf8')).not.toContain('href="#/voice-check"');
  });
});
