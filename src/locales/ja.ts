// Japanese locale
export const ja: Record<string, string> = {

  // Navbar
  'nav.emergency': '🚨 緊急',
  'nav.prepare':   '準備',
  'nav.learn':     '学ぶ',
  'nav.shelter':   '避難所',
  'nav.plan':      'マイプラン',

  // Hero
  'hero.subtitle': '日本にいる留学生のための防災ガイド',

  // Mode selector
  'mode.emergency.title':   '緊急',
  'mode.emergency.desc':    '今すぐ助けが必要です',
  'mode.prepare.title':     '準備する',
  'mode.prepare.desc':      '計画を立て、避難所を探す',
  'mode.learn.title':       '学ぶ',
  'mode.learn.desc':        '訓練・ことば・クイズ',

  // Emergency mode
  'em.title':       '🚨 緊急',
  'em.subtitle':    '落ち着いてください。ゆっくり息をしてください。したいことをタップしてください。',
  'em.back':        '← 戻る',
  'em.call.title':  '119に電話',
  'em.call.desc':   '消防・救急',
  'em.show.title':  'カードを見せる',
  'em.show.desc':   '助けてくれる人に見せる日本語',
  'em.shelter.title': '避難所を探す',
  'em.shelter.desc':  'いちばん近い避難場所',
  'em.alerts.title':  '警報情報',
  'em.alerts.desc':   '警報の意味',

  // Section chip-nav
  'chip.earthquake': '🏚 地震',
  'chip.alerts':     '📡 警報',
  'chip.typhoon':    '🌀 台風',
  'chip.vocab':      '🗣 言葉',
  'chip.showthis':   '💬 カード',
  'chip.bag':        '🎒 防災袋',
  'chip.firstaid':   '🩹 応急手当',
  'chip.contacts':   '📞 連絡先',
  'chip.drill':      '🎮 訓練',
  'chip.quiz':       '📝 クイズ',
  'chip.about':      'ℹ 紹介',

  // Earthquake section
  'eq.title':    '日本の震度（ゆれの強さ）',
  'eq.subtitle': '震度は、あなたが感じるゆれの強さです。地震のエネルギーではありません。行をタップすると、ゆれを体験できます。',
  'eq.do':       '✓ すること',
  'eq.dont':     '✗ しないこと',

  // Vocab section
  'vocab.title': '大切な言葉（ことば）',
  'vocab.tab.danger': '危険',
  'vocab.tab.action': '行動',
  'vocab.tab.places': '場所',
  'vocab.tab.help':   '助け',

  // Show This section
  'showthis.title':    '見せるカード Show This Card',
  'showthis.subtitle': '日本語が話せないときは、このカードを近くの人に見せてください。日本語の文字が大きいので、相手がすぐに読めます。スワイプするか、矢印をタップすると、ほかの文が見られます。',

  // Bag game section
  'bag.title':    '🎒 非常袋（ひじょうぶくろ）· バッグをつめよう',
  'bag.subtitle': 'バッグに入れられるのは<strong>10kgまで</strong>です。日本の市のガイドには、女性はだいたい10kg、男性はだいたい15kgと書いてあります。この重さなら、走ってにげられます。物の重さは、本物のふつうの重さです。マモルは、1kg重くなるたびに、それを感じます。全部は入りません。物をタップすると、入れたり出したりできます。',
  'bag.stat.items':  'アイテム',
  'bag.stat.score':  'スコア',
  'bag.stat.weight': '重さ',
  'bag.best':        '自己ベスト:',
  'bag.btn.reset':   '🔄 もう一度',
  'bag.btn.check':   '📋 スコアを見る',

  // Contacts section
  'contacts.title':    '緊急連絡先',
  'contacts.subtitle': '連絡先をタップすると、電話をかけられます。緊急のことが起きる前に、この番号を保存してください。緊急のときは、電話がすぐにつながりにくくなります。',
  'contacts.filter.all':     'すべて',
  'contacts.filter.emerg':   '緊急',
  'contacts.filter.medical': '医療',
  'contacts.filter.support': 'サポート',
  'contacts.filter.embassy': '大使館',
  'contacts.filter.mental':  'こころの健康',

  // Plan section
  'plan.title':    '緊急カード＆防災準備',
  'plan.subtitle': 'プロフィールと計画を書いてください。項目の名前は、英語と日本語で書いてあります。あなたが話せないときも、救助する人・医者・警察があなたの情報を読めます。印刷して、財布とカバンに入れてください。家にも1枚置いてください。',
  'plan.btn.save':  '💾 保存',
  'plan.btn.print': '🖨️ ワークシートを印刷',
  'plan.print.fullIds': '在留カードと保険証の番号を全部印刷します。オフのときは、最後の4文字だけ印刷します。',
  'plan.btn.show':  '🆘 プランを見せる',
  'plan.btn.clear': '🗑️ 消す',
  'plan.btn.next':  '次へ →',
  'plan.btn.prev':  '← 戻る',
  'plan.show.title':    '🆘 緊急情報 · Emergency Info',
  'plan.show.subtitle': '助けてください / Please help',
  'plan.show.close':    '閉じる',
  'plan.show.empty':    'プランに何も書いてありません。先にプランのフォームに書いてください。そのあと、ここにあなたの情報が出ます。',

  // About section
  'about.title': 'このガイドについて',

  // Drill section
  'drill.title':    '地震訓練',
  'drill.subtitle': '地震が起きたときのことを、練習で体験します。急いで決めてください。正しい行動を1つずつ学びます。',
  'drill.btn.start': '🚨 訓練開始',

  // Quiz section
  'quiz.title':    '防災クイズ',
  'quiz.subtitle': '防災の知識をテストします。問題は10問で、いろいろな場面を見て答えます。地震、台風、津波、緊急のときにすることについての問題です。',
  'quiz.btn.start': '🎯 クイズ開始',

  // Footer
  'footer.copy': '守るガイド · 神戸の立ち直る力から学びました。PPI Kobeといっしょに作りました。',

  // FAB labels
  'fab.firstaid': '応急手当',
  'fab.shelter':  '避難所を探す',
  'fab.showthis': '見せるカード',

  // Common
  'common.copy': '📋 コピー',

  // Footer emergency numbers
  'footer.emergency.title': '緊急番号',
  'footer.emergency.fire':  '消防・救急',
  'footer.emergency.police': '警察',
  'footer.emergency.coast':  '海上保安庁',
};
