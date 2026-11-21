// English locale
export const en: Record<string, string> = {

  // Navbar
  'nav.emergency': '🚨 Emergency',
  'nav.prepare':   'Prepare',
  'nav.learn':     'Learn',
  'nav.shelter':   'Evacuation Site',
  'nav.plan':      'My Plan',

  // Hero
  'hero.subtitle': 'A disaster preparedness guide for international students in Japan',

  // Mascot fact bubble
  'mascot.aria': 'Tap Mamoru for the next disaster fact',
  'mascot.tag':  'DID YOU KNOW?',
  'mascot.cta':  '→ TAP FOR NEXT',
  'mascot.hint': '▼ TAP FOR NEXT FACT ▼',

  // Arcade labels: hero eyebrow, hero buttons, section eyebrows
  'hero.eyebrow':    '▶ INSERT COIN · 100 ¥ · PRESS START ◀',
  'hero.start':      '▶ PRESS START',
  'hero.makePlan':   '⊞ MAKE PLAN',
  'label.intensity': 'SEISMIC INTENSITY',
  'label.vocab':     'EMERGENCY VOCABULARY',
  'label.showThis':  'SHOW THIS',
  'label.bag':       'EMERGENCY BAG',
  'label.alerts':    'ALERT SYSTEM',
  'label.typhoon':   'TYPHOON',
  'label.firstAid':  'FIRST AID',
  'label.shelter':   'EVACUATION SITE FINDER',
  'label.drill':     'EARTHQUAKE DRILL',
  'label.quiz':      'QUIZ',
  'label.about':     'ABOUT',
  'label.contacts':  'CONTACTS',
  'label.plan':      'MY PLAN',

  // Scene and game badges
  'bag.packed':  '✓ PACKED',
  'scene.avoid': 'AVOID',

  // Bag game score (game feedback only)
  'bag.result.expert.title': '🏆 Expert Packer!',
  'bag.result.expert.msg': 'You chose the most important items. Your bag is ready for an emergency.',
  'bag.result.good.title': '👍 Well Prepared!',
  'bag.result.good.msg': 'Good choices. Replace low priority items with the important items you missed.',
  'bag.result.improve.title': '🤔 Needs Improvement',
  'bag.result.improve.msg': 'You have some basic items, but important items are missing. Pack water, food, and medical supplies first.',
  'bag.result.notReady.title': '⚠ Not Ready',
  'bag.result.notReady.msg': 'Your bag does not have the items you need to survive. Pack these first: water, food, first aid kit, medicines, and documents.',

  // Mode selector
  'mode.emergency.title':   'Emergency',
  'mode.emergency.desc':    'I need help right now',
  'mode.prepare.title':     'Prepare',
  'mode.prepare.desc':      'Make a plan. Find an evacuation site.',
  'mode.learn.title':       'Learn',
  'mode.learn.desc':        'Drills, words, quizzes',

  // Emergency mode (4-action layout)
  'em.title':       '🚨 EMERGENCY',
  'em.subtitle':    'Stay calm. Breathe slowly. Tap an action.',
  'em.back':        '← Back',
  'em.call.title':  'Call 119',
  'em.call.desc':   'Fire / Ambulance',
  'em.show.title':  'Show This Card',
  'em.show.desc':   'Japanese phrases for helpers',
  'em.shelter.title': 'Find an Evacuation Site',
  'em.shelter.desc':  'Nearest evacuation site',
  'em.alerts.title':  'Alert Info',
  'em.alerts.desc':   'What the warnings mean',

  // Section chip-nav (Prepare / Learn jump-nav)
  'chip.earthquake': '🏚 Earthquake',
  'chip.alerts':     '📡 Alerts',
  'chip.typhoon':    '🌀 Typhoon',
  'chip.vocab':      '🗣 Words',
  'chip.showthis':   '💬 Card',
  'chip.bag':        '🎒 Bag',
  'chip.firstaid':   '🩹 First Aid',
  'chip.contacts':   '📞 Contacts',
  'chip.drill':      '🎮 Drill',
  'chip.quiz':       '📝 Quiz',
  'chip.about':      'ℹ About',

  // Earthquake section
  'eq.title':    "Japan's Seismic Intensity Scale (震度 Shindo)",
  'eq.subtitle': 'Shindo (seismic intensity) is the strength of the shaking at a place. Magnitude is the size of the earthquake itself. Tap a row to feel the shaking.',
  'eq.do':       '✓ DO',
  'eq.dont':     '✗ DON\'T',

  // Vocab section
  'vocab.title': 'Important Words (言葉 Kotoba)',
  'vocab.tab.danger': 'Danger',
  'vocab.tab.action': 'Action',
  'vocab.tab.places': 'Places',
  'vocab.tab.help':   'Help',

  // Show This section
  'showthis.title':    'Show This Card 見せるカード',
  'showthis.subtitle': 'If you cannot speak Japanese, show these cards to people near you. The Japanese text is large, so people can read it easily. Swipe or tap the arrows to see more phrases.',

  // Bag game section
  'bag.title':    '🎒 非常袋 Hijou-bukuro · Pack Your Bag',
  'bag.subtitle': 'In this game, your bag can hold <strong>10 kg at most</strong>. This is a game rule. Osaka Prefecture gives a guide: about 15 kg for men and 10 kg for women. Each weight is an estimate. Mamoru feels every kilogram. You cannot take everything. Tap an item to put it in the bag or take it out.',
  'bag.stat.items':  'ITEMS',
  'bag.stat.score':  'SCORE',
  'bag.stat.weight': 'WEIGHT',
  'bag.best':        'Personal Best:',
  'bag.btn.reset':   '🔄 Try Again',
  'bag.btn.check':   '📋 Check Score',

  // Contacts section
  'contacts.title':    'Emergency Contacts',
  'contacts.subtitle': 'Tap a contact to call the number. Save these numbers now, before an emergency. In an emergency, phone networks quickly become too busy.',
  'contacts.filter.all':     'All',
  'contacts.filter.emerg':   'Emergency',
  'contacts.filter.medical': 'Medical',
  'contacts.filter.support': 'Support',
  'contacts.filter.embassy': 'Embassy',
  'contacts.filter.mental':  'Mental Health',

  // Plan section
  'plan.title':    'My Emergency Card and Preparation',
  'plan.subtitle': 'Fill in your profile and your plan. The labels are in English and Japanese. Rescuers, doctors, and police can read your information, even if you cannot speak. Print it. Keep a copy in your wallet, in your bag, and at home.',
  'plan.btn.save':  '💾 Save Plan',
  'plan.btn.print': '🖨️ Print Worksheet',
  'plan.print.fullIds': 'Print the full ID numbers (residence card, insurance). If this is off, only the last 4 characters print.',
  'plan.btn.show':  '🆘 Show My Plan',
  'plan.btn.clear': '🗑️ Clear',
  'plan.btn.next':  'Next →',
  'plan.btn.prev':  '← Back',
  'plan.show.title':    '🆘 Emergency Info · 緊急情報',
  'plan.show.subtitle': 'Please help / 助けてください',
  'plan.show.close':    'Close',
  'plan.show.empty':    'Your plan is empty. First, fill in the plan form. Then your information shows here.',

  // About section
  'about.title': 'About This Guide',

  // Drill section
  'drill.title':    'Earthquake Drill',
  'drill.subtitle': 'Try a practice earthquake. Make decisions quickly. Learn the correct actions step by step.',
  'drill.btn.start': '🚨 Start Drill',

  // Quiz section
  'quiz.title':    'Disaster Drill Quiz',
  'quiz.subtitle': 'Test what you know about disaster preparedness. Answer 10 questions about disaster situations. They cover earthquakes, typhoons, tsunamis, and emergency steps.',
  'quiz.btn.start': '🎯 Start Quiz',

  // Footer
  'footer.copy': 'Mamoru Guide 守る · Made by Aditya.',

  // FAB labels
  'fab.firstaid': 'First Aid Guide',
  'fab.shelter':  'Find an Evacuation Site',
  'fab.showthis': 'Show This Card',

  // Common
  'common.copy': '📋 Copy',

  // Footer emergency numbers
  'footer.emergency.title': 'Emergency Numbers',
  'footer.emergency.fire':  'Fire / Ambulance',
  'footer.emergency.police': 'Police',
  'footer.emergency.coast':  'Coast Guard',
};
