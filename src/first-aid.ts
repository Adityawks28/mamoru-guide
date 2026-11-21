import { currentLang } from './lang';

interface FirstAidStep {
  instruction_en: string;
  instruction_ja: string;
  instruction_id: string;
  warning_en?: string;
  warning_ja?: string;
  warning_id?: string;
  timer_seconds?: number;
  claimId: string;
}

interface FirstAidCategory {
  id: string;
  icon: string;
  title_en: string;
  title_ja: string;
  title_id: string;
  steps: FirstAidStep[];
}

// Each step is checked against official guidance. Status and source per step: CLAIMS in src/data/sources.ts.
// Table: docs/superpowers/specs/2026-11-21-medical-verification.md
export const categories: FirstAidCategory[] = [
  {
    id: 'bleeding', icon: '🩸',
    title_en: 'Bleeding Control', title_ja: '血を止める', title_id: 'Menghentikan Pendarahan',
    steps: [
      { instruction_en: 'Put on gloves. If you have no gloves, use a plastic bag.', instruction_ja: '手袋をしてください。手袋がないときは、ビニール袋を手にかぶせてください。', instruction_id: 'Pakai sarung tangan. Jika kamu tidak punya sarung tangan, pakai kantong plastik di tanganmu.', claimId: 'fa-bleeding-1' },
      { instruction_en: 'Press firmly on the wound with a clean cloth. Keep pressing until paramedics arrive.', instruction_ja: 'きれいな布で、傷口を強く押さえてください。救急隊が来るまで、押さえつづけてください。', instruction_id: 'Tekan luka dengan kuat memakai kain bersih. Terus tekan sampai paramedis datang.', claimId: 'fa-bleeding-2' },
      { instruction_en: 'If blood comes through the cloth, do NOT remove the cloth. Put more cloth on top.', instruction_ja: '布に血がしみても、布を外さないでください。上に布を重ねてください。', instruction_id: 'Jika darah tembus ke kain, JANGAN lepas kainnya. Tambahkan kain lagi di atasnya.', warning_en: 'If you stop the pressure, the bleeding starts again.', warning_ja: '押さえるのをやめると、また血が出ます。', warning_id: 'Jika tekanan dilepas, darah akan keluar lagi.', claimId: 'fa-bleeding-3' },
      { instruction_en: 'If the bleeding does not stop, press harder with both hands. Keep pressing until paramedics arrive.', instruction_ja: '血が止まらないときは、両手でもっと強く押さえてください。救急隊が来るまで、押さえつづけてください。', instruction_id: 'Jika darah tidak berhenti, tekan lebih kuat dengan kedua tangan. Terus tekan sampai paramedis datang.', warning_en: 'Use a tourniquet (a tight band) only if you have training. Do not tie the arm or leg with thin string or wire.', warning_ja: '止血帯（しけつたい：きつくしめるバンド）は、訓練を受けた人だけが使ってください。細いひもや針金で、腕や足をしばらないでください。', warning_id: 'Pakai torniket (ikatan kencang) hanya jika kamu sudah dilatih. Jangan ikat lengan atau kaki dengan tali tipis atau kawat.', claimId: 'fa-bleeding-5' },
    ],
  },
  {
    id: 'burns', icon: '🔥',
    title_en: 'Burns', title_ja: 'やけど', title_id: 'Luka Bakar',
    steps: [
      { instruction_en: 'Cool the burn at once under running tap water for 10 to 20 minutes. Do not use ice or ice water.', instruction_ja: 'すぐに、水道の流れる水で、やけどを10〜20分冷やしてください。氷や氷水は使わないでください。', instruction_id: 'Segera dinginkan luka bakar di bawah air keran yang mengalir selama 10 sampai 20 menit. Jangan pakai es atau air es.', warning_en: 'If the burn is large, do not cool it for a long time. The person can become too cold.', warning_ja: 'やけどが広いときは、長い時間冷やさないでください。体が冷えすぎることがあります。', warning_id: 'Jika luka bakarnya luas, jangan dinginkan terlalu lama. Tubuhnya bisa menjadi terlalu dingin.', timer_seconds: 600, claimId: 'fa-burns-1' },
      { instruction_en: 'If clothes cover the burn, cool the burn through the clothes.', instruction_ja: 'やけどが服の下にあるときは、服を着たまま、服の上から冷やしてください。', instruction_id: 'Jika pakaian menutupi luka bakar, dinginkan luka itu dari atas pakaian.', claimId: 'fa-burns-2' },
      { instruction_en: 'Do NOT remove clothing that is stuck to the burn. Do NOT break blisters.', instruction_ja: 'やけどにくっついた服は、はがさないでください。水ぶくれは、つぶさないでください。', instruction_id: 'JANGAN lepas pakaian yang menempel di luka. JANGAN pecahkan lepuh.', warning_en: 'Never use ice, butter, or toothpaste on a burn.', warning_ja: '氷、バター、歯みがき粉を、やけどに使わないでください。', warning_id: 'Jangan pakai es, mentega, atau pasta gigi pada luka bakar.', claimId: 'fa-burns-3' },
      { instruction_en: 'Cover the burn loosely with a clean cloth.', instruction_ja: 'きれいな布で、やけどをゆるく覆（おお）ってください。', instruction_id: 'Tutup luka bakar dengan longgar memakai kain bersih.', claimId: 'fa-burns-4' },
      { instruction_en: 'See a doctor if the burn has blisters and is bigger than a fingertip. Get medical help at once if a towel cannot cover the burn, or if the face is burned.', instruction_ja: '水ぶくれがあって、指先より大きいやけどは、医師に診（み）てもらってください。タオルで覆（おお）えない広いやけどは、すぐに医療（いりょう）を受けてください。顔をやけどしたときも、すぐに医療を受けてください。', instruction_id: 'Temui dokter jika luka bakar melepuh dan lebih besar dari ujung jari. Segera cari bantuan medis jika luka tidak bisa ditutup dengan handuk, atau jika wajah terbakar.', claimId: 'fa-burns-5' },
    ],
  },
  {
    id: 'fractures', icon: '🦴',
    title_en: 'Fractures & Sprains', title_ja: '骨折・捻挫', title_id: 'Patah Tulang & Keseleo',
    steps: [
      { instruction_en: 'Do NOT move the injured arm or leg. Keep the person still.', instruction_ja: 'けがをした手や足を動かさないでください。けがをした人が動かないようにしてください。', instruction_id: 'JANGAN gerakkan lengan atau kaki yang cedera. Jaga agar orang itu tetap diam.', claimId: 'fa-fractures-1' },
      { instruction_en: 'Use a splint (a stiff support) to hold the injured area still. Make it from magazines, cardboard, or other stiff material. Use a splint long enough to reach the joints above and below the injury.', instruction_ja: '副木（そえぎ：かたい支え）で、けがをした所を固定してください。雑誌、段ボール、かたい物で作れます。副木は、けがをした所の上と下の関節（かんせつ）までとどく長さにしてください。', instruction_id: 'Pakai bidai (penyangga kaku) agar bagian yang cedera tidak bergerak. Buat bidai dari majalah, kardus, atau bahan kaku lain. Pakai bidai yang cukup panjang sampai ke sendi di atas dan di bawah bagian yang cedera.', claimId: 'fa-fractures-2' },
      { instruction_en: 'Tie the splint above and below the injury.', instruction_ja: 'けがをした所より上と下で、副木（そえぎ）を結んでください。', instruction_id: 'Ikat bidai di atas dan di bawah bagian yang cedera.', claimId: 'fa-fractures-3' },
      { instruction_en: 'Cool the injury with an ice pack in a thin cloth. Do not cool it for more than 20 minutes at a time.', instruction_ja: '氷や保冷剤（ほれいざい）を薄い布で包んで、けがをした所を冷やしてください。1回に20分より長く冷やさないでください。', instruction_id: 'Dinginkan bagian yang cedera dengan kompres es yang dibungkus kain tipis. Jangan dinginkan lebih dari 20 menit setiap kali.', claimId: 'fa-fractures-4' },
      { instruction_en: 'Check the blood flow below the injury. The fingers or toes should be warm and not pale.', instruction_ja: 'けがをした所より先の血の流れを確認してください。指先が温かく、色が悪くないかを見ます。', instruction_id: 'Periksa aliran darah di bawah cedera. Jari tangan atau kaki harus hangat dan tidak pucat.', claimId: 'fa-fractures-5' },
    ],
  },
  {
    id: 'crush', icon: '⚠️',
    title_en: 'Crush Syndrome', title_ja: '圧挫症候群', title_id: 'Sindrom Crush',
    steps: [
      { instruction_en: 'Call 119. Tell them that a person is trapped. Make sure that the place is safe for you. Free the person slowly and carefully. Do not pull them out by force.', instruction_ja: '119に電話して、人がはさまれていると伝えてください。その場所が、あなたにとって安全か確かめてください。ゆっくり、注意して助け出してください。無理に引っぱり出さないでください。', instruction_id: 'Hubungi 119. Katakan bahwa ada orang yang terjepit. Pastikan tempat itu aman untukmu. Keluarkan orang itu pelan-pelan dan hati-hati. Jangan tarik dia dengan paksa.', warning_en: 'A person who was trapped for a long time can suddenly become very ill after rescue. Get a doctor, even if they look well.', warning_ja: '長い時間はさまれていた人は、助け出したあとで、急に具合が悪くなることがあります。元気に見えても、医師に診（み）てもらってください。', warning_id: 'Orang yang lama terjepit bisa tiba-tiba sakit parah setelah diselamatkan. Bawa dia ke dokter, walaupun dia terlihat baik-baik saja.', claimId: 'fa-crush-1' },
      { instruction_en: 'Tell the 119 operator that it can be crush syndrome (圧挫症候群 / あつざしょうこうぐん).', instruction_ja: '「圧挫症候群（あつざしょうこうぐん）かもしれません」と119に伝えてください。', instruction_id: 'Katakan ke petugas 119 bahwa ini bisa sindrom crush (圧挫症候群 / atsuza shoukougun).', claimId: 'fa-crush-2' },
      { instruction_en: 'Keep the person warm with a blanket. Look for dark red urine, swelling, or numbness. If you see these, tell a doctor at once.', instruction_ja: '毛布で体を温めてください。おしっこが赤黒い、はれている、さわっても感じない、などがないか見てください。あれば、すぐに医師に伝えてください。', instruction_id: 'Jaga orang itu tetap hangat dengan selimut. Perhatikan apakah air seninya berwarna merah gelap, ada bengkak, atau mati rasa. Jika ada, segera beri tahu dokter.', claimId: 'fa-crush-4' },
      { instruction_en: 'Write down the time they were trapped. This information is important for paramedics.', instruction_ja: 'はさまれていた時間をメモしてください。救急隊にとって大切な情報です。', instruction_id: 'Catat waktu korban terjebak. Informasi ini penting untuk paramedis.', claimId: 'fa-crush-5' },
    ],
  },
  {
    id: 'cpr', icon: '💓',
    title_en: 'CPR Basics', title_ja: '心肺蘇生法', title_id: 'Dasar CPR',
    steps: [
      { instruction_en: 'Check if the person responds. Tap their shoulders and shout "Are you OK?"', instruction_ja: '反応があるか確認してください。肩をたたいて「大丈夫ですか？」と大きな声で呼びかけます。', instruction_id: 'Periksa apakah orang itu merespons. Tepuk bahunya dan teriakkan "Apakah Anda baik-baik saja?"', claimId: 'fa-cpr-1' },
      { instruction_en: 'Call 119, or ask a person near you to call. Ask someone to bring an AED (a machine that gives the heart an electric shock).', instruction_ja: '119に電話してください。または、近くの人に電話をたのんでください。AED（心臓に電気ショックをあたえる機械）を持ってきてもらってください。', instruction_id: 'Hubungi 119, atau minta orang di dekat Anda untuk menelepon. Minta seseorang membawa AED (alat kejut jantung).', claimId: 'fa-cpr-2' },
      { instruction_en: 'Check if the person breathes normally. Look at the chest and belly for up to 10 seconds. If the breathing is not normal, or you are not sure, start chest pushes. If the person breathes normally, stay with them and watch the breathing.', instruction_ja: 'ふだんどおりの息をしているか、確認してください。胸とおなかの動きを、10秒以内で見てください。ふだんどおりの息でないときや、よくわからないときは、胸を押しはじめてください。ふだんどおりの息をしているときは、そばにいて、息をよく見ていてください。', instruction_id: 'Periksa apakah orang itu bernapas normal. Lihat gerakan dada dan perutnya paling lama 10 detik. Jika napasnya tidak normal, atau kamu tidak yakin, mulai tekan dada. Jika dia bernapas normal, tetap di dekatnya dan perhatikan napasnya.', claimId: 'fa-cpr-6' },
      { instruction_en: 'Put the heel of one hand (the base of your palm) on the center of the chest. Put your other hand on top. For a baby, use the heel of one hand only.', instruction_ja: '片方の手のひらの付け根を、胸の真ん中に置いてください。もう片方の手を上に重ねてください。赤ちゃんのときは、片手の手のひらの付け根だけを使ってください。', instruction_id: 'Letakkan pangkal telapak tangan di tengah dada. Letakkan tangan lainnya di atasnya. Untuk bayi, pakai pangkal satu telapak tangan saja.', claimId: 'fa-cpr-3' },
      { instruction_en: 'Push hard and fast, 100 to 120 times each minute. Adults: push about 5 cm deep. Children and babies: push about one third of the chest depth. Babies: push with the heel of one hand. Let the chest come fully back up after each push.', instruction_ja: '強く、速く押してください。1分間に100〜120回です。大人：約5cmの深さまで押します。子どもと赤ちゃん：胸の厚さの約3分の1まで押します。赤ちゃん：片手の手のひらの付け根で押します。押したあと、胸を完全に元にもどしてください。', instruction_id: 'Tekan dengan kuat dan cepat, 100 sampai 120 kali per menit. Dewasa: tekan sedalam sekitar 5 cm. Anak dan bayi: tekan sekitar 1/3 tebal dada. Bayi: tekan dengan pangkal satu telapak tangan. Biarkan dada kembali naik sepenuhnya setiap selesai menekan.', claimId: 'fa-cpr-4' },
      { instruction_en: 'Do not stop chest pushes until paramedics take over, or the person breathes normally or moves on purpose. When the AED arrives, turn it on. Keep pushing while someone puts on the pads. Do not touch the person while the AED checks the heart. After the shock, or if no shock is needed, start pushing again at once.', instruction_ja: '救急隊と交代するまで、胸を押すのをやめないでください。ふだんどおりの息や、目的（もくてき）のある動きがもどったら、やめてもいいです。AEDが来たら、電源を入れてください。だれかがパッドをはるあいだも、胸を押しつづけてください。AEDが心臓を調べているあいだは、その人にさわらないでください。電気ショックのあとや、ショックがいらないときは、すぐにまた胸を押してください。', instruction_id: 'Jangan berhenti menekan dada sampai paramedis mengambil alih, atau orang itu bernapas normal atau bergerak dengan sengaja. Saat AED datang, nyalakan AED. Terus tekan dada saat seseorang memasang bantalan (pad) AED. Jangan sentuh orang itu saat AED memeriksa jantung. Setelah kejutan listrik, atau jika kejutan tidak diperlukan, segera tekan dada lagi.', warning_en: 'Many stations, schools, and some convenience stores have an AED. Look for the AED sign.', warning_ja: '多くの駅や学校、一部のコンビニに、AEDがあります。AEDのマークをさがしてください。', warning_id: 'Banyak stasiun, sekolah, dan sebagian minimarket punya AED. Cari tanda AED.', claimId: 'fa-cpr-5' },
    ],
  },
  {
    id: 'shock', icon: '😰',
    title_en: 'Shock Management', title_ja: 'ショックへの対応', title_id: 'Penanganan Syok',
    steps: [
      { instruction_en: 'Look for these signs: pale, cold, or damp skin; fast breathing; confusion; weakness. If you see these signs, call 119 at once.', instruction_ja: '次のような様子がないか見てください：青白く、冷たく、しめった肌。速い呼吸。混乱。力が入らない。このような様子があれば、すぐに119に電話してください。', instruction_id: 'Cari tanda-tanda ini: kulit pucat, dingin, atau berkeringat; napas cepat; bingung; lemas. Jika kamu melihat tanda-tanda ini, segera hubungi 119.', claimId: 'fa-shock-1' },
      { instruction_en: 'Lay the person flat on their back. If the person has trouble breathing, let them take the position that is easiest. If the person vomits, turn them on their side.', instruction_ja: 'あおむけに寝かせてください。息が苦しいときは、その人がいちばん楽な姿勢（しせい）にしてください。吐いたときは、体を横向きにしてください。', instruction_id: 'Baringkan orang itu telentang. Jika dia sesak napas, biarkan dia memilih posisi yang paling nyaman. Jika dia muntah, miringkan badannya ke samping.', claimId: 'fa-shock-2' },
      { instruction_en: 'Cover the person with a blanket or jacket to keep them warm. Do not let the cold ground take their body heat.', instruction_ja: '毛布やジャケットをかけて、体を温めてください。冷たい地面で体が冷えないようにしてください。', instruction_id: 'Selimuti dengan selimut atau jaket agar tetap hangat. Jangan biarkan tanah yang dingin menyerap panas tubuhnya.', claimId: 'fa-shock-3' },
      { instruction_en: 'Stay with the person. Talk to them calmly. Watch their breathing until help arrives.', instruction_ja: 'そばにいてください。落ち着いて話しかけてください。助けが来るまで、呼吸をよく見ていてください。', instruction_id: 'Tetap di dekatnya. Bicara dengan tenang. Perhatikan napasnya sampai bantuan datang.', claimId: 'fa-shock-5' },
    ],
  },
  {
    id: 'smoke', icon: '💨',
    title_en: 'Breathing Smoke', title_ja: '煙を吸ったとき', title_id: 'Menghirup Asap',
    steps: [
      { instruction_en: 'Keep your body low. Crawl on your hands and knees. Smoke goes up, so the air near the floor is cleaner.', instruction_ja: '体を低くしてください。手とひざをついて進んでください。煙は上に行くので、床の近くの空気のほうがきれいです。', instruction_id: 'Rendahkan badan. Merangkak dengan tangan dan lutut. Asap naik ke atas, jadi udara di dekat lantai lebih bersih.', claimId: 'fa-smoke-1' },
      { instruction_en: 'Cover your nose and mouth with a cloth. Do not lose time to make it wet.', instruction_ja: '布で鼻と口を覆（おお）ってください。布をぬらすために、時間を使わないでください。', instruction_id: 'Tutup hidung dan mulut dengan kain. Jangan buang waktu untuk membasahinya.', claimId: 'fa-smoke-2' },
      { instruction_en: 'Before you open a door, feel the door and the handle.', instruction_ja: 'ドアを開ける前に、ドアとドアノブにさわって、熱くないか確かめてください。', instruction_id: 'Sebelum membuka pintu, raba pintu dan gagangnya.', warning_en: 'If the door is hot, keep it closed. Use another way out.', warning_ja: 'ドアが熱いときは、開けないでください。ほかの出口から逃げてください。', warning_id: 'Jika pintunya panas, biarkan tetap tertutup. Pakai jalan keluar lain.', claimId: 'fa-smoke-3' },
      { instruction_en: 'Go to the nearest exit. Follow the emergency exit signs (they are green in Japan).', instruction_ja: 'いちばん近い出口に向かってください。非常口のマーク（日本では緑色）に従ってください。', instruction_id: 'Pergi ke pintu keluar terdekat. Ikuti tanda pintu darurat (warnanya hijau di Jepang).', claimId: 'fa-smoke-4' },
      { instruction_en: 'If a person breathed in smoke, move them to fresh air. Do not let them walk. Loosen their clothes. Keep them warm. Call 119, even if they feel better.', instruction_ja: '煙を吸った人がいたら、空気のきれいな所に運んでください。その人を歩かせないでください。服をゆるめて、体を温めてください。具合がよくなったようでも、119に電話してください。', instruction_id: 'Jika ada orang yang menghirup asap, bawa dia ke tempat dengan udara segar. Jangan biarkan dia berjalan. Longgarkan pakaiannya. Jaga tubuhnya tetap hangat. Hubungi 119, walaupun dia merasa lebih baik.', claimId: 'fa-smoke-5' },
    ],
  },
  {
    id: 'psychological', icon: '🧠',
    title_en: 'Psychological First Aid', title_ja: '心のケア', title_id: 'Pertolongan Psikologis',
    steps: [
      { instruction_en: 'Go to the person calmly. Say: "I am here to help." If the person is safe now, tell them so.', instruction_ja: '落ち着いて近づいてください。「助けに来ました」と言ってください。その人が今、安全な所にいるときは、そのことを伝えてください。', instruction_id: 'Dekati dengan tenang. Katakan: "Saya di sini untuk membantu." Jika dia sudah aman sekarang, beri tahu dia.', claimId: 'fa-psychological-1' },
      { instruction_en: 'If the person breathes too fast, speak in a calm voice. Ask them to breathe slowly. Help them sit in a comfortable position. Loosen tight clothes.', instruction_ja: '息が速すぎるときは、落ち着いた声で話してください。ゆっくり息をするように伝えてください。楽な姿勢（しせい）ですわれるように、手伝ってください。きつい服をゆるめてください。', instruction_id: 'Jika napasnya terlalu cepat, bicaralah dengan suara tenang. Minta dia bernapas pelan-pelan. Bantu dia duduk dengan posisi yang nyaman. Longgarkan pakaian yang ketat.', claimId: 'fa-psychological-2' },
      { instruction_en: 'If the person feels unreal or far away, ask them to feel their feet on the floor. Ask them to tell you what they can see and hear.', instruction_ja: 'まわりが遠く感じたり、本当ではないように感じたりする人もいます。その人には、床についている足を感じてもらってください。何が見えるか、何が聞こえるか、教えてもらってください。', instruction_id: 'Jika dia merasa semuanya tidak nyata atau terasa jauh, minta dia merasakan kakinya di lantai. Minta dia menyebutkan apa yang bisa dia lihat dan dengar.', claimId: 'fa-psychological-3' },
      { instruction_en: 'Listen without judging. Let them talk or cry. Do not say "Calm down." Say "I understand."', instruction_ja: '相手を否定しないで、話を聞いてください。話したり泣いたりさせてあげてください。「落ち着いて」とは言わないでください。「わかります」と言ってください。', instruction_id: 'Dengarkan tanpa menghakimi. Biarkan dia bicara atau menangis. Jangan bilang "Tenang." Katakan "Saya mengerti."', claimId: 'fa-psychological-4' },
      { instruction_en: 'Help with practical needs, like water, a blanket, or contacting their family. Small actions help them feel safe.', instruction_ja: '水、毛布、家族への連絡など、すぐに必要なことを手伝ってください。小さな手助けで、人は安心できます。', instruction_id: 'Bantu kebutuhan praktis, seperti air, selimut, atau menghubungi keluarga. Bantuan kecil membuat orang merasa aman.', claimId: 'fa-psychological-5' },
    ],
  },
];

// Decision D-4: no medical professional has reviewed these steps, so every card says so.
const REVIEW_NOTE = `
  <p class="firstaid-review-note">
    <span data-lang="en">A medical professional has not checked these steps yet. The steps come from official guidance.</span>
    <span data-lang="ja">医師などの専門家は、このステップをまだ確認していません。ステップは、公式の情報をもとにしています。</span>
    <span data-lang="id">Tenaga medis profesional belum memeriksa langkah-langkah ini. Langkah-langkah ini berasal dari panduan resmi.</span>
  </p>
`;

let currentCategory: number | null = null;
let currentStep = 0;
let timerInterval: ReturnType<typeof setInterval> | null = null;
let timerRemaining = 0;

function getLangText(en: string, ja: string, id: string): string {
  if (currentLang === 'ja') return ja;
  if (currentLang === 'id') return id;
  return en;
}

function reapplyLang(): void {
  document.body.classList.remove('lang-en', 'lang-ja', 'lang-id');
  document.body.classList.add('lang-' + currentLang);
}

function stopTimer(): void {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function renderCategories(): void {
  const container = document.getElementById('firstAidContainer');
  if (!container) return;
  stopTimer();

  container.innerHTML = `
    <div class="firstaid-grid">
      ${categories.map((cat, i) => `
        <button class="firstaid-card" data-idx="${i}">
          <div class="firstaid-card-icon">${cat.icon}</div>
          <div class="firstaid-card-title">
            <span data-lang="en">${cat.title_en}</span>
            <span data-lang="ja">${cat.title_ja}</span>
            <span data-lang="id">${cat.title_id}</span>
          </div>
          <div class="firstaid-card-count">
            <span data-lang="en">${cat.steps.length} steps</span>
            <span data-lang="ja">${cat.steps.length}ステップ</span>
            <span data-lang="id">${cat.steps.length} langkah</span>
          </div>
        </button>
      `).join('')}
    </div>
    ${REVIEW_NOTE}
  `;

  container.querySelectorAll<HTMLButtonElement>('.firstaid-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.idx;
      if (idx === undefined) return;
      currentCategory = parseInt(idx, 10);
      currentStep = 0;
      renderSteps();
      document.dispatchEvent(new CustomEvent('mamoru:firstaid-step', {
        detail: { step: categories[currentCategory].id },
      }));
    });
  });

  reapplyLang();
}

function renderSteps(): void {
  if (currentCategory === null) return;
  const container = document.getElementById('firstAidContainer');
  if (!container) return;
  stopTimer();

  const cat = categories[currentCategory];
  const step = cat.steps[currentStep];

  let timerHtml = '';
  if (step.timer_seconds) {
    timerRemaining = step.timer_seconds;
    timerHtml = `
      <div class="firstaid-timer" id="firstaidTimer">
        <div class="firstaid-timer-display">${formatTime(step.timer_seconds)}</div>
        <button class="firstaid-timer-btn" id="firstaidTimerBtn">
          <span data-lang="en">▶ Start Timer</span>
          <span data-lang="ja">▶ タイマー開始</span>
          <span data-lang="id">▶ Mulai Timer</span>
        </button>
      </div>
    `;
  }

  let warningHtml = '';
  if (step.warning_en) {
    warningHtml = `
      <div class="firstaid-warning">
        <strong>⚠️</strong>
        <span data-lang="en">${step.warning_en}</span>
        <span data-lang="ja">${step.warning_ja}</span>
        <span data-lang="id">${step.warning_id}</span>
      </div>
    `;
  }

  container.innerHTML = `
    <button class="firstaid-back" id="firstaidBack">
      ← <span data-lang="en">Back to categories</span><span data-lang="ja">カテゴリに戻る</span><span data-lang="id">Kembali ke kategori</span>
    </button>
    <div class="firstaid-header">
      <span class="firstaid-header-icon">${cat.icon}</span>
      <span class="firstaid-header-title">
        <span data-lang="en">${cat.title_en}</span>
        <span data-lang="ja">${cat.title_ja}</span>
        <span data-lang="id">${cat.title_id}</span>
      </span>
    </div>
    ${REVIEW_NOTE}
    <div class="firstaid-progress">
      ${getLangText('Step', 'ステップ', 'Langkah')} ${currentStep + 1} / ${cat.steps.length}
    </div>
    <div class="firstaid-step-content">
      <div class="firstaid-step-number">${currentStep + 1}</div>
      <div class="firstaid-step-text">
        <span data-lang="en">${step.instruction_en}</span>
        <span data-lang="ja">${step.instruction_ja}</span>
        <span data-lang="id">${step.instruction_id}</span>
      </div>
    </div>
    ${warningHtml}
    ${timerHtml}
    <div class="firstaid-nav">
      ${currentStep > 0 ? `<button class="firstaid-nav-btn" id="firstaidPrev"><span data-lang="en">← Previous</span><span data-lang="ja">← 前へ</span><span data-lang="id">← Sebelumnya</span></button>` : '<div></div>'}
      ${currentStep < cat.steps.length - 1 ? `<button class="firstaid-nav-btn primary" id="firstaidNext"><span data-lang="en">Next →</span><span data-lang="ja">次へ →</span><span data-lang="id">Berikutnya →</span></button>` : `<button class="firstaid-nav-btn primary" id="firstaidDone"><span data-lang="en">✓ Done</span><span data-lang="ja">✓ 完了</span><span data-lang="id">✓ Selesai</span></button>`}
    </div>
    <div class="firstaid-dots">
      ${cat.steps.map((_, i) => `<span class="firstaid-dot${i === currentStep ? ' active' : ''}${i < currentStep ? ' completed' : ''}"></span>`).join('')}
    </div>
  `;

  document.getElementById('firstaidBack')?.addEventListener('click', () => {
    currentCategory = null;
    document.dispatchEvent(new CustomEvent('mamoru:firstaid-step', { detail: { step: null } }));
    renderCategories();
  });

  document.getElementById('firstaidPrev')?.addEventListener('click', () => {
    if (currentStep > 0) { currentStep--; renderSteps(); }
  });

  document.getElementById('firstaidNext')?.addEventListener('click', () => {
    if (currentCategory !== null && currentStep < categories[currentCategory].steps.length - 1) {
      currentStep++;
      renderSteps();
    }
  });

  document.getElementById('firstaidDone')?.addEventListener('click', () => {
    currentCategory = null;
    document.dispatchEvent(new CustomEvent('mamoru:firstaid-step', { detail: { step: null } }));
    renderCategories();
  });

  // Timer logic
  const timerBtn = document.getElementById('firstaidTimerBtn');
  if (timerBtn && step.timer_seconds) {
    timerBtn.addEventListener('click', () => {
      const display = document.querySelector('.firstaid-timer-display');
      const timer = document.getElementById('firstaidTimer');
      if (!display || !timer) return;

      if (timerInterval) {
        stopTimer();
        timerBtn.innerHTML = `<span data-lang="en">▶ Start Timer</span><span data-lang="ja">▶ タイマー開始</span><span data-lang="id">▶ Mulai Timer</span>`;
        timer.classList.remove('running');
        reapplyLang();
        return;
      }

      timer.classList.add('running');
      timerBtn.innerHTML = `<span data-lang="en">⏸ Pause</span><span data-lang="ja">⏸ 一時停止</span><span data-lang="id">⏸ Jeda</span>`;
      reapplyLang();

      stopTimer();
      timerInterval = setInterval(() => {
        timerRemaining--;
        display.textContent = formatTime(timerRemaining);
        if (timerRemaining <= 0) {
          stopTimer();
          timer.classList.remove('running');
          timer.classList.add('done');
          display.textContent = getLangText('Time is up', '時間です', 'Waktu habis');
          timerBtn.innerHTML = `<span data-lang="en">✓ Complete</span><span data-lang="ja">✓ 完了</span><span data-lang="id">✓ Selesai</span>`;
          (timerBtn as HTMLButtonElement).disabled = true;
          reapplyLang();
        }
      }, 1000);
    });
  }

  reapplyLang();
}

export function initFirstAid(): void {
  const container = document.getElementById('firstAidContainer');
  if (!container) return;
  renderCategories();
}
