# Speak for me: device check

## Purpose

Check that a phone speaks Japanese with no network (C-1).
Check that the app picks a voice that works offline (P-2).
Task 2 starts only after this check passes on iPhone and Android.

## How to open the page

Use the preview fallback now. The PRs are not merged yet.

1. On the computer, run `npm run build && npx vite preview --host`.
2. Find the computer LAN IP address.
3. Connect the phone to the same Wi-Fi.
4. On the phone, open `http://<computer-LAN-IP>:4173/mamoru-guide/#/voice-check`.

A plain-http LAN address is not a secure context.
Safari on iPhone and Chrome on Android do not register a service worker there.
In airplane mode the phone cannot reach the computer.
So steps 3 and 8 of the owner checklist work only on the https live URL, after the PR merges.

Use these short steps for a preview run:

1. Open the page from the phone while online.
2. Do not reload the page.
3. Turn on airplane mode. Check that Wi-Fi and mobile data are both off.
4. Tap Check voices. Copy every row into the result table.
5. Tap Speak on each Japanese row. Write if you hear 「けがをしました」.
6. Write "preview, no reload" in the Notes column.

This still answers the go/no-go question: does a local Japanese voice speak with no network?

After the merge, use the live URL (P-8):
`https://adityawks28.github.io/mamoru-guide/#/voice-check`

## Owner checklist

Do this once on an iPhone (Safari) and once on an Android phone (Chrome).
Use it on the https live URL only.

1. Open the page online once. Then reload it once, so the service worker caches the app.
2. Turn on airplane mode. Check that Wi-Fi and mobile data are both off.
3. Reload the page. It must load from the cache.
4. Tap Check voices. Copy every row into the result table.
5. Tap Speak on each Japanese row. Write if you hear 「けがをしました」.
6. If no Japanese row exists, go online and install a Japanese voice.
   - iPhone: Settings > Accessibility > Spoken Content > Voices > Japanese.
   - Android: Settings > Google Text-to-speech > Install voice data > Japanese.
   - Then repeat steps 2 to 5. Write "No" in Pre-installed.
7. iPhone: repeat step 5 with the silent switch on.
8. If the app is on the home screen, repeat steps 3 to 5 in it.

## Results

| Platform | OS version | Browser or home-screen app | Voice name | lang | localService | Pre-installed? | Spoke in airplane mode? | App picked it? | Silent switch on: sound? | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |

## Decision rules

- A row spoke offline, `localService` is true, and "App picked it" is yes: go for that platform.
- No local Japanese voice: the button stays hidden on that platform (C-1). Ship anyway.
- Stop and tell the controller in two cases:
  - A voice spoke offline with `localService` false. The filter hides a working voice.
  - The picked voice did not speak offline. The filter is unsafe.
