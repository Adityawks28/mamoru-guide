# Roadmap

Ideas for future work, written down on 2026-10-24. Nothing here is planned in detail yet. Pick one item, plan it on its own, then build it.

## Who it is for

International students and residents in Japan who find it hard to get disaster information, mostly because of the language barrier. Not only Indonesians.

## What it must do

- Help people learn and prepare. This is the main job.
- Keep a few key tools working during an emergency, so the language barrier does not cause a misunderstanding.

## What success looks like

- More people use it.
- People trust what it says.
- It shows technical skill, cross cultural understanding, and awareness.

## What must never happen

- It costs money.
- It needs an account.
- Private data leaks.
- Any racism or stereotypes.

## Ideas

### 1. The language gap in an emergency (start here)

- **Speak for me.** Pick a phrase such as "I am hurt" or "Where is the shelter?". The phone shows it in large Japanese and reads it aloud. A reply card lets the other person point to yes or no, numbers, or directions. Builds on the Show This cards. Check first: do phone voices work offline?
- **My needs card.** Allergies, medicines, food needs (halal, vegetarian, no pork), language spoken, and an emergency contact, shown in Japanese. Stored on the phone only. Builds on Show My Plan.

### 2. Learning to read Japan's warnings

- **Warning words.** Learn the words seen on TV, alerts, and signs, for example 避難指示, 津波警報, and the difference between 避難場所 and 避難所.
- **Furigana switch.** Show the reading above every kanji in the Japanese text.

### 3. Life in an evacuation shelter

- What daily life in a 避難所 is like, the unwritten rules, how to ask for food that fits your needs, and where to get help in your language.

### 4. Reaching more people

- **More languages.** Check which foreign resident groups are largest first. Each language needs a native speaker to check it, for example volunteers from a partner university. This is the biggest job: today the text is written inline in English, Japanese, and Indonesian.
- **Shelters for all of Japan.** Extend `scripts/build-shelter-data.mjs` and load one prefecture at a time.
- **One page of official help.** Links to the multilingual help that already exists, sorted by city.

### 5. Trust and partners

- **Sources and Review page.** For each fact: the source, the date it was last checked, and who reviewed it.
- **Orientation pack** for schools and companies: a poster with a QR code, the worksheet, and short workshop slides.
- **More diverse characters**, for example a hijab option, different skin tones, and a wheelchair user.

## Open decisions (from PR #23)

- Crush injury advice ("do not free them after 15 minutes") and two finger CPR for babies. Both need a medical reviewer.
- The alert section still uses the JMA warning names from before May 2026 (for example レベル3大雨警報 and the new 危険警報).
- The About page says "Last updated March 2026, reviewed against the latest guidelines". Keep or change it.
