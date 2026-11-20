// ============================================================
//  Sai Path — content about Sai Baba of Shirdi (c. 1838–1918)
//  kind: 'hist' = documented / broadly agreed by historians
//        'trad' = told in devotional tradition (mainly the Shri Sai Satcharitra)
// ============================================================

const TIMELINE = [
  { id: 't-birth', year: 'c. 1838', sort: 1838, kind: 'trad', title: 'Birth — a mystery',
    text: 'His birth date, birthplace, parents and religion of birth are unknown. Sai Baba himself never revealed them. Some later accounts name Pathri in Maharashtra, but this is not certain.' },
  { id: 't-first', year: 'c. 1854', sort: 1854, kind: 'trad', title: 'A young ascetic under the neem tree',
    text: 'A young man of about 16 appears in the village of Shirdi, sitting in meditation under a neem tree, unmoved by heat or cold. He stays a while, then disappears.' },
  { id: 't-return', year: 'c. 1858', sort: 1858, kind: 'trad', title: 'Return with a wedding party',
    text: 'He returns to Shirdi with the wedding procession of Chand Patil. Near the Khandoba temple the priest Mhalsapati greets him: "Ya Sai!" ("Welcome, Sai!"). The name sticks.' },
  { id: 't-masjid', year: 'from c. 1858', sort: 1859, kind: 'hist', title: 'Home in an old mosque',
    text: 'After living outdoors he settles in a small, crumbling mosque that he calls Dwarkamai. He keeps a sacred fire (dhuni) burning there and lives there for the rest of his life.' },
  { id: 't-1886', year: '1886', sort: 1886, kind: 'trad', title: 'Three days of samadhi',
    text: 'Sai Baba tells Mhalsapati he is leaving his body for three days and asks him to guard it. Officials want to bury the body; Mhalsapati refuses. On the third day Baba revives.' },
  { id: 't-urs', year: '1897', sort: 1897, kind: 'trad', title: 'The first fair (Urs)',
    text: 'A devotee, Gopalrao Gund, starts an annual fair at Shirdi with Baba\'s consent. It becomes a gathering for Hindus and Muslims alike.' },
  { id: 't-chavadi', year: '1909', sort: 1909, kind: 'trad', title: 'The Chavadi procession begins',
    text: 'Baba begins sleeping at the village Chavadi on alternate nights. Devotees accompany him with music, lamps and flags — a procession still re-enacted on Thursdays in Shirdi.' },
  { id: 't-fire', year: '1910', sort: 1910, kind: 'trad', title: 'The hand in the fire',
    text: 'On Dhanteras (just before Diwali) Baba suddenly thrusts his arm into the dhuni. He explains that he was pulling a blacksmith\'s child out of a forge fire far away. His burned hand is dressed daily by Bhagoji Shinde.' },
  { id: 't-hemad', year: '1910', sort: 1910.5, kind: 'hist', title: 'Hemadpant arrives',
    text: 'Govind R. Dabholkar, later called "Hemadpant", first visits Shirdi. He later asks permission to record Baba\'s life and stories — the start of the Shri Sai Satcharitra.' },
  { id: 't-ramnavami', year: '1911', sort: 1911, kind: 'trad', title: 'Ram Navami and Urs together',
    text: 'The Hindu festival of Ram Navami begins to be celebrated together with the Muslim Urs — a living picture of Baba\'s message that one God is master of all.' },
  { id: 't-samadhi', year: '15 Oct 1918', sort: 1918, kind: 'hist', title: 'Mahasamadhi',
    text: 'Sai Baba passes away at Dwarkamai on Vijayadashami (Dussehra). His body is laid to rest in Buti Wada, a stone building a devotee had been constructing — today the Samadhi Mandir.' },
  { id: 't-sansthan', year: '1922', sort: 1922, kind: 'hist', title: 'The Sansthan is formed',
    text: 'The Shri Saibaba Sansthan trust is set up to manage the shrine, the daily worship, and the growing number of pilgrims.' },
  { id: 't-book', year: '1930', sort: 1930, kind: 'hist', title: 'The Satcharitra is published',
    text: 'Hemadpant\'s Marathi poem, the Shri Sai Satcharitra, is published after his death. It becomes the main source for Sai Baba\'s life and is read by devotees worldwide.' },
  { id: 't-statue', year: '1954', sort: 1954, kind: 'hist', title: 'The marble murti',
    text: 'The famous life-size Italian-marble statue of Sai Baba, made by sculptor Balaji Vasant Talim, is installed in the Samadhi Mandir.' },
];

const PEOPLE = [
  { id: 'p-mhalsa', icon: '🛕', name: 'Mhalsapati', role: 'Priest who named him "Sai"',
    text: 'Priest of the local Khandoba temple. He greeted the young fakir with "Ya Sai!" and became one of his closest devotees, often spending nights with Baba at Dwarkamai.' },
  { id: 'p-shama', icon: '📚', name: 'Madhavrao Deshpande ("Shama")', role: 'Close companion',
    text: 'A schoolteacher whose school was next to the mosque. Baba affectionately called him Shama. He often acted as a go-between for visitors.' },
  { id: 'p-bayaja', icon: '🍲', name: 'Bayajabai', role: 'Fed him in the early years',
    text: 'In Baba\'s early days she would carry food into the forest to find him and feed him. Baba never forgot her kindness.' },
  { id: 'p-tatya', icon: '🧑‍🌾', name: 'Tatya Kote Patil', role: 'Bayajabai\'s son',
    text: 'Baba treated him like family and called him his nephew. Tradition says Baba\'s own passing came instead of Tatya\'s, who was gravely ill in 1918.' },
  { id: 'p-lakshmi', icon: '🪙', name: 'Lakshmibai Shinde', role: 'Received nine coins',
    text: 'A devoted woman who served Baba bread. Shortly before his passing he gave her nine coins — often explained as the nine forms of devotion (navavidha bhakti).' },
  { id: 'p-nana', icon: '🎩', name: 'Nanasaheb Chandorkar', role: 'Government official & devotee',
    text: 'A well-placed official whose devotion helped make Baba known among educated people. Several Satcharitra stories feature him.' },
  { id: 'p-dasganu', icon: '🎶', name: 'Das Ganu Maharaj', role: 'Spread Baba\'s fame through song',
    text: 'A former police constable who became a kirtan (devotional song and story) performer. His kirtans across Maharashtra spread Sai Baba\'s name widely.' },
  { id: 'p-hemad', icon: '✍️', name: 'Hemadpant (G. R. Dabholkar)', role: 'Author of the Satcharitra',
    text: 'A magistrate who recorded the life and teachings of Sai Baba in the Marathi poem Shri Sai Satcharitra — the most important source about him.' },
  { id: 'p-buti', icon: '🏛️', name: 'Gopalrao Buti', role: 'Built Buti Wada',
    text: 'A wealthy devotee from Nagpur who built a stone mansion (wada) in Shirdi. Baba was laid to rest there; it became the Samadhi Mandir.' },
  { id: 'p-abdul', icon: '🪔', name: 'Abdul Baba', role: 'Attendant',
    text: 'A Muslim devotee who served Baba for many years, tending the lamps and cleaning, and later kept caring for the shrine.' },
  { id: 'p-bhagoji', icon: '🩹', name: 'Bhagoji Shinde', role: 'Dressed Baba\'s burned hand',
    text: 'A man suffering from leprosy whom others avoided. Baba allowed him — and only him — to dress his burned hand every day, showing that no one is untouchable.' },
  { id: 'p-dixit', icon: '🏠', name: 'Kakasaheb Dixit', role: 'Lawyer & devotee',
    text: 'A Mumbai lawyer who became a devoted follower and built Dixit Wada, a guesthouse for pilgrims in Shirdi.' },
];

const PLACES = [
  { id: 'pl-shirdi', icon: '🏘️', name: 'Shirdi', text: 'A small village in Ahmednagar (now Ahilyanagar) district, Maharashtra, India. Today it is one of India\'s most visited pilgrimage towns.' },
  { id: 'pl-guru', icon: '🌳', name: 'Gurusthan', text: 'The spot under the neem tree where the young Sai Baba first sat in meditation. Tradition says the bitter neem leaves on that branch tasted sweet.' },
  { id: 'pl-dwarka', icon: '🕌', name: 'Dwarkamai', text: 'The old mosque where Baba lived for about 60 years. He gave it a Hindu name — Dwarkamai. His dhuni (sacred fire) still burns there, along with his grinding stone.' },
  { id: 'pl-chavadi', icon: '🏚️', name: 'Chavadi', text: 'The village meeting house where Baba slept on alternate nights from 1909. The night procession to it is re-enacted every Thursday.' },
  { id: 'pl-samadhi', icon: '🛕', name: 'Samadhi Mandir', text: 'Originally Buti Wada, the building where Sai Baba was laid to rest in 1918. It houses his tomb and the marble murti.' },
  { id: 'pl-lendi', icon: '🌼', name: 'Lendi Baug', text: 'A garden Baba planted and watered himself, walking there every day. A lamp he kept lit there is still maintained.' },
  { id: 'pl-khandoba', icon: '⛩️', name: 'Khandoba Temple', text: 'The temple near where the wedding party stopped in 1858 and Mhalsapati said "Ya Sai!"' },
];

const TERMS = [
  { id: 'k-fakir', term: 'Fakir', def: 'A wandering holy man who lives simply on alms. Sai Baba called himself a fakir.' },
  { id: 'k-sai', term: 'Sai', def: 'A Persian-origin word for a holy person or saint. "Baba" means father — so "Sai Baba" is like "holy father".' },
  { id: 'k-dhuni', term: 'Dhuni', def: 'The sacred fire Baba kept burning in Dwarkamai. It has been kept alight ever since.' },
  { id: 'k-udi', term: 'Udi', def: 'Sacred ash from the dhuni. Baba gave it to visitors as a blessing and remedy; it reminds us that the body is temporary, like ash.' },
  { id: 'k-kafni', term: 'Kafni', def: 'The long, simple robe Baba wore, with a cloth tied around his head.' },
  { id: 'k-shraddha', term: 'Shraddha', def: 'Faith — complete trust in the guru and in God.' },
  { id: 'k-saburi', term: 'Saburi', def: 'Patience — calm, cheerful perseverance, especially in hard times.' },
  { id: 'k-dakshina', term: 'Dakshina', def: 'An offering given to a guru. Baba often asked for small sums of dakshina and gave most of it away the same day.' },
  { id: 'k-seva', term: 'Seva', def: 'Selfless service to others, done without expecting a reward.' },
  { id: 'k-arati', term: 'Arati', def: 'Worship with lamps and song. In Shirdi it happens four times a day: Kakad (dawn), Madhyan (noon), Dhoop (sunset) and Shej (night).' },
  { id: 'k-mahasamadhi', term: 'Mahasamadhi', def: 'The "great samadhi" — the term devotees use for a saint\'s passing from the body.' },
  { id: 'k-satcharitra', term: 'Shri Sai Satcharitra', def: 'The Marathi verse biography of Sai Baba by Hemadpant, published 1930 and translated into many languages.' },
  { id: 'k-urs', term: 'Urs', def: 'A Muslim festival commemorating a saint. In Shirdi it was celebrated together with Ram Navami from 1911.' },
  { id: 'k-parayan', term: 'Parayan', def: 'Reading a sacred book from start to finish over a set period, often a week — commonly done with the Satcharitra.' },
  { id: 'k-guru', term: 'Guru', def: 'A spiritual teacher who guides a student toward truth.' },
  { id: 'k-sansthan', term: 'Sansthan', def: 'A trust or institution. The Shri Saibaba Sansthan (est. 1922) manages the Shirdi shrine.' },
];

// Sayings: wording is paraphrased from translations of the Satcharitra and devotee accounts.
const SAYINGS = [
  { id: 's-malik', text: 'Sabka Malik Ek.', meaning: 'One God is the master of all.', note: 'His best-known saying, embraced by Hindus and Muslims alike.' },
  { id: 's-allah', text: 'Allah Malik.', meaning: 'God alone is the Lord.', note: 'A phrase Baba repeated constantly.' },
  { id: 's-sraddha', text: 'Shraddha and Saburi.', meaning: 'Have faith and patience.', note: 'The two "coins" he said his own guru asked of him.' },
  { id: 's-fear', text: 'Why fear when I am here?', meaning: 'Trust and let go of anxiety.', note: 'Popular devotional saying associated with Baba.' },
  { id: 's-look', text: 'If you look to me, I look to you.', meaning: 'Turn your attention to the divine and you will be cared for.', note: 'One of the eleven assurances.' },
  { id: 's-hungry', text: 'Whoever feeds the hungry feeds me.', meaning: 'God lives in every being; serving others is worship.', note: 'From the story of Mrs. Tarkhad and the hungry dog.' },
  { id: 's-burden', text: 'Cast your burden on me and I shall bear it.', meaning: 'Surrender your worries.', note: 'One of the eleven assurances.' },
  { id: 's-anger', text: 'Do not argue or quarrel. If others speak ill of you, let it pass.', meaning: 'Practice patience and peace with others.', note: 'Paraphrased from his advice in the Satcharitra.' },
  { id: 's-welcome', text: 'Do not turn away anyone who comes to your door — person or animal. Treat them kindly.', meaning: 'Hospitality and kindness to all beings.', note: 'Paraphrased from his advice to devotees.' },
];

// The eleven assurances (paraphrased; exact wording varies by translation)
const ASSURANCES = [
  'Whoever sets foot on the soil of Shirdi, their suffering will come to an end.',
  'The unhappy and troubled will find joy as soon as they climb the steps of Dwarkamai.',
  'I will remain active and alive even after leaving this body.',
  'My tomb will bless my devotees and fulfil their needs.',
  'I will be active and vigorous even from my tomb.',
  'My remains will speak from my tomb.',
  'I am always living to help and guide all who come to me and take refuge in me.',
  'If you look to me, I look to you.',
  'If you cast your burden on me, I will surely bear it.',
  'If you seek my help and guidance, it will be given at once.',
  'There will be no want in the house of my devotee.',
];

const STORIES = {
  lamps: { title: 'Lamps lit with water', icon: '🪔', kind: 'trad', text: `<p>Sai Baba loved to keep lamps burning in the mosque and at the temples. He used to ask the village shopkeepers for a little oil each evening.</p>
    <p>One Diwali the shopkeepers decided to refuse him, saying they had none. Baba quietly returned to Dwarkamai, poured some water into his tin pot, drank from it, and poured it into the lamps. The lamps lit — and burned all through the night.</p>
    <p>The shopkeepers, who had followed to watch, were ashamed and asked his forgiveness. Baba told them simply not to lie again.</p>`,
    lesson: 'Honesty matters, and true generosity is never wasted.' },
  wheat: { title: 'Grinding the wheat', icon: '🌾', kind: 'trad', text: `<p>Hemadpant\'s very first story: one morning he saw Baba sitting at a hand-mill, grinding wheat. Puzzled villagers wondered why a man with no family needed flour.</p>
    <p>Four women took over the grinding and then began dividing the flour among themselves. Baba scolded them and told them to spread the flour along the village boundary. At that time cholera was spreading — and tradition says the epidemic left Shirdi soon after.</p>
    <p>Hemadpant later saw a deeper meaning: grinding away our past karma and ego with the stones of effort and devotion.</p>`,
    lesson: 'Spiritual work is like grinding grain — steady effort transforms what is rough into nourishment.' },
  fire: { title: 'The hand in the fire', icon: '🔥', kind: 'trad', text: `<p>On Dhanteras in 1910, while sitting by the dhuni, Baba suddenly pushed his arm deep into the fire. Devotees pulled him back — his hand was badly burned.</p>
    <p>He explained that, far away, a blacksmith\'s wife had been working the bellows with her child on her lap. Startled, she let the child slip toward the forge — and Baba had pulled the child out.</p>
    <p>He refused doctors and let only Bhagoji Shinde, a man with leprosy whom others shunned, bandage the hand every day.</p>`,
    lesson: 'Compassion acts immediately — and no person is beneath our care.' },
  dog: { title: 'The hungry dog', icon: '🐕', kind: 'trad', text: `<p>Mrs. Tarkhad was about to eat lunch in Shirdi when a hungry dog appeared. She gave it a piece of bread.</p>
    <p>That afternoon Baba told her, "You fed me today and I am fully satisfied." Surprised, she said she hadn\'t. Baba replied that the dog was one with him: "I roam in the forms of dogs, cats and pigs. Whoever sees me in all beings is dear to me."</p>`,
    lesson: 'Serving any living being is serving God.' },
  coins: { title: 'Two coins: faith and patience', icon: '🪙', kind: 'trad', text: `<p>An elderly woman, Radhabai Deshmukh, came to Shirdi wanting Baba to give her a secret mantra. When he didn\'t, she began a fast, determined to continue until he did.</p>
    <p>Baba called her and told her about his own guru. His guru, he said, never whispered a mantra in his ear. He asked only for two coins: <b>Shraddha</b> (faith) and <b>Saburi</b> (patience). With those, the guru took care of everything.</p>
    <p>She ended her fast, understanding that the "secret" was not a word but a way of being.</p>`,
    lesson: 'There is no shortcut — faith and patience are the whole practice.' },
};

// ---------------- Lessons ----------------
const LESSONS = [
  { id: 'who', unit: 'Unit 1 · Meet Sai Baba', title: 'Who was Sai Baba?', icon: '🙏',
    summary: 'A fakir of Shirdi revered by Hindus and Muslims.',
    sections: [
      { type: 'text', html: `<p><b>Sai Baba of Shirdi</b> (c. 1838 – 1918) was a spiritual teacher who lived as a simple fakir in the small village of <b>Shirdi</b>, Maharashtra, India.</p>
        <p>He owned almost nothing, lived in an old mosque, and taught through stories, short sayings, and his own example. Today millions of people of many faiths — Hindus, Muslims, Sikhs, Christians, and others — honor him as a saint or guru.</p>` },
      { type: 'tip', html: `<b>Not to be confused with:</b> Sathya Sai Baba (1926–2011) of Puttaparthi, a different teacher who said he was Shirdi Sai Baba reborn. This app is about the original Sai Baba of Shirdi.` },
      { type: 'text', html: `<h4>How we know about him</h4><p>Most of what we know comes from the <b>Shri Sai Satcharitra</b>, a Marathi poem by his devotee <b>Hemadpant</b>, plus memories of other devotees and a few records and photographs.</p>
        <p>Throughout this app you\'ll see two labels:</p>
        <p><span class="pill badge-hist">History</span> facts broadly agreed by historians &nbsp; <span class="pill badge-trad">Tradition</span> stories told by devotees</p>
        <p>Both are worth knowing — they just answer different questions.</p>` },
    ],
    quiz: [
      { q: 'In which village did Sai Baba live?', opts: ['Shirdi', 'Puttaparthi', 'Pune', 'Varanasi'], a: 0 },
      { q: 'Roughly when did Sai Baba live?', opts: ['c. 1838–1918', '1926–2011', '1600s', '1500s'], a: 0 },
      { q: 'What is the main written source about his life?', opts: ['Shri Sai Satcharitra', 'Bhagavad Gita', 'Quran', 'Ramayana'], a: 0 },
      { q: 'Which communities revere Sai Baba?', opts: ['People of many faiths', 'Only Hindus', 'Only Muslims', 'Only Sikhs'], a: 0 },
    ] },
  { id: 'arrival', unit: 'Unit 1 · Meet Sai Baba', title: 'A Mysterious Arrival', icon: '🌳',
    summary: 'The neem tree, the wedding party, and "Ya Sai!"',
    sections: [
      { type: 'text', html: `<p>No one knows where Sai Baba was born or who his parents were. When asked, he gave puzzling answers — he wanted people to focus on his teaching, not his background.</p>
        <p>Around <b>1854</b> a young man of about sixteen was seen in Shirdi, meditating day and night under a <b>neem tree</b>. The spot is now called <b>Gurusthan</b>. Then he vanished.</p>
        <p>Around <b>1858</b> he returned with the wedding party of a man named <b>Chand Patil</b>. As the group stopped near the Khandoba temple, the priest <b>Mhalsapati</b> greeted him: <b>"Ya Sai!"</b> — "Welcome, Sai!" The name stayed with him for life.</p>` },
      { type: 'tip', html: `<b>Name meaning:</b> "Sai" means holy one or saint; "Baba" means father. Together: something like "holy father".` },
    ],
    quiz: 'ids:t-first,t-return,p-mhalsa,pl-guru,pl-khandoba,k-sai' },
  { id: 'dwarkamai', unit: 'Unit 1 · Meet Sai Baba', title: 'Life at Dwarkamai', icon: '🕌',
    summary: 'A mosque with a Hindu name and a fire that never goes out.',
    sections: [
      { type: 'text', html: `<p>Baba settled in a small, run-down <b>mosque</b>. He named it <b>Dwarkamai</b> — after Dwarka, the city of Krishna. A mosque with a Hindu name sums up his whole message.</p>
        <p>There he kept a sacred fire, the <b>dhuni</b>, always burning. He gave its ash — <b>udi</b> — to visitors as a blessing. He wore a simple <b>kafni</b> (robe) and a head cloth.</p>
        <p>Each day he begged for food from a few village homes, then shared it — with people, dogs, birds, anyone. Sometimes he cooked huge pots of food and served everyone himself.</p>
        <p>From <b>1909</b> he slept on alternate nights at the village <b>Chavadi</b>, and devotees escorted him there in a festive procession.</p>` },
      { type: 'tip', html: `Dwarkamai, the dhuni, and his grinding stone can still be seen in Shirdi today. The Chavadi procession is re-enacted every Thursday.` },
    ],
    quiz: 'ids:pl-dwarka,pl-chavadi,k-dhuni,k-udi,k-kafni,k-fakir,t-masjid,t-chavadi' },
  { id: 'faith', unit: 'Unit 2 · Teachings', title: 'Shraddha & Saburi', icon: '🪙',
    summary: 'Faith and patience — the heart of his teaching.',
    sections: [
      { type: 'story', id: 'coins' },
      { type: 'text', html: `<p><b>Shraddha</b> — faith — means steady trust, not blind belief. <b>Saburi</b> — patience — means cheerful perseverance, waiting without anxiety.</p>
        <p>Baba taught that these two qualities matter more than rituals, scriptures, or special techniques.</p>` },
    ],
    quiz: 'ids:k-shraddha,k-saburi,s-sraddha,k-guru' },
  { id: 'unity', unit: 'Unit 2 · Teachings', title: 'Sabka Malik Ek', icon: '🤝',
    summary: 'One God is master of all.',
    sections: [
      { type: 'text', html: `<p>Sai Baba constantly said <b>"Allah Malik"</b> (God is the Lord) and taught <b>"Sabka Malik Ek"</b> — one God is the master of all.</p>
        <p>He lived in a mosque but kept a sacred fire. He celebrated both Hindu and Muslim festivals — from <b>1911</b>, Ram Navami and the Muslim Urs were celebrated together in Shirdi. His followers included Hindus, Muslims, Parsis and more, and he never asked anyone to change their religion.</p>` },
      { type: 'tip', html: `<b>Think about it:</b> instead of debating which path is "right", Baba pointed to what paths share — love of God, kindness, honesty and service.` },
    ],
    quiz: 'ids:s-malik,s-allah,t-ramnavami,t-urs,k-urs' },
  { id: 'seva', unit: 'Unit 2 · Teachings', title: 'Seeing God in All Beings', icon: '🐕',
    summary: 'Service, kindness and feeding the hungry.',
    sections: [ { type: 'story', id: 'dog' },
      { type: 'text', html: `<p>Baba taught that God lives in every creature. Feeding the hungry, welcoming guests, and caring for animals were, for him, real worship. This is called <b>seva</b> — selfless service.</p>` } ],
    quiz: 'ids:s-hungry,s-welcome,k-seva,k-dakshina,s-anger' },
  { id: 'lamps', unit: 'Unit 3 · Famous Stories', title: 'Lamps Lit With Water', icon: '🪔',
    summary: 'A Diwali story about honesty.',
    sections: [ { type: 'story', id: 'lamps' } ],
    quiz: [
      { q: 'Why did the lamps have no oil?', opts: ['The shopkeepers refused to give oil', 'It was raining', 'Baba forgot to buy it', 'The oil was stolen'], a: 0 },
      { q: 'What did Baba pour into the lamps?', opts: ['Water', 'Milk', 'Ghee', 'Sand'], a: 0 },
      { q: 'What did Baba ask of the shopkeepers afterwards?', opts: ['Not to lie again', 'To pay a fine', 'To leave Shirdi', 'To build a temple'], a: 0 },
      { q: 'During which festival did this happen?', opts: ['Diwali', 'Holi', 'Eid', 'Ram Navami'], a: 0 },
    ] },
  { id: 'wheat', unit: 'Unit 3 · Famous Stories', title: 'Grinding the Wheat', icon: '🌾',
    summary: 'The very first story in the Satcharitra.',
    sections: [ { type: 'story', id: 'wheat' } ],
    quiz: [
      { q: 'What illness was spreading in the region?', opts: ['Cholera', 'Malaria', 'Smallpox', 'Plague'], a: 0 },
      { q: 'Where was the flour spread?', opts: ['Along the village boundary', 'In the river', 'In the mosque', 'In the fields'], a: 0 },
      { q: 'Who recorded this story as the first in his book?', opts: ['Hemadpant', 'Mhalsapati', 'Das Ganu', 'Shama'], a: 0 },
      { q: 'What deeper meaning did Hemadpant see in it?', opts: ['Grinding away ego and karma', 'Saving money', 'Farming tips', 'Cooking skills'], a: 0 },
    ] },
  { id: 'fire', unit: 'Unit 3 · Famous Stories', title: 'The Hand in the Fire', icon: '🔥',
    summary: 'Compassion that crosses distance.',
    sections: [ { type: 'story', id: 'fire' } ],
    quiz: 'ids:t-fire,p-bhagoji,k-dhuni' },
  { id: 'samadhi', unit: 'Unit 4 · Legacy', title: 'The Mahasamadhi', icon: '🕊️',
    summary: 'October 1918, nine coins, and Buti Wada.',
    sections: [
      { type: 'text', html: `<p>Sai Baba passed away on <b>15 October 1918</b>, the day of <b>Vijayadashami</b> (Dussehra), at Dwarkamai. Devotees call this his <b>Mahasamadhi</b>.</p>
        <p>Shortly before, he gave <b>nine coins</b> to <b>Lakshmibai Shinde</b>, a devotee who served him bread — often explained as the nine forms of devotion.</p>
        <p>His body was laid to rest in <b>Buti Wada</b>, a stone building a devotee named <b>Gopalrao Buti</b> was constructing. It became the <b>Samadhi Mandir</b>, the heart of Shirdi today.</p>` },
      { type: 'tip', html: `Tradition says that years earlier Baba had promised that his tomb would "speak" to devotees — see the Eleven Assurances in the Teachings tab.` },
    ],
    quiz: 'ids:t-samadhi,p-lakshmi,p-buti,pl-samadhi,k-mahasamadhi' },
  { id: 'devotees', unit: 'Unit 4 · Legacy', title: 'The Devotees', icon: '👥',
    summary: 'The people who knew him and spread his message.',
    sections: [ { type: 'people' } ],
    quiz: 'people' },
  { id: 'today', unit: 'Unit 4 · Legacy', title: 'Shirdi Today', icon: '🛕',
    summary: 'Arati, Thursdays, festivals, and the Satcharitra.',
    sections: [
      { type: 'text', html: `<p>After 1918 Shirdi grew from a village into one of India\'s busiest pilgrimage towns. The <b>Shri Saibaba Sansthan</b> (founded <b>1922</b>) manages the shrine.</p>
        <h4>Daily arati</h4><p>Four times a day: <b>Kakad</b> (dawn), <b>Madhyan</b> (noon), <b>Dhoop</b> (sunset), <b>Shej</b> (night).</p>
        <h4>Special days</h4><p><b>Thursday</b> is considered Baba\'s day. The big festivals are <b>Ram Navami</b>, <b>Guru Purnima</b>, and <b>Vijayadashami</b> (the anniversary of his Mahasamadhi).</p>
        <h4>Practice</h4><p>Many devotees read the <b>Satcharitra</b> as a <b>parayan</b> (cover to cover, often in a week), keep udi at home, and try to live by shraddha, saburi and seva.</p>` },
    ],
    quiz: 'ids:k-arati,k-parayan,k-sansthan,t-sansthan,t-book,k-satcharitra,t-statue' },
];

// ---------------- Reflection prompts ----------------
const PROMPTS = [
  { theme: 'Shraddha', q: 'What is something in your life you trust completely? What makes that trust possible?' },
  { theme: 'Saburi', q: 'Think of something you are waiting for. How could you wait with more calm and less worry?' },
  { theme: 'Seva', q: 'Who could you help today without expecting anything back? What small act could you do?' },
  { theme: 'Unity', q: '"Sabka Malik Ek." Where do you see something shared between people who seem very different?' },
  { theme: 'Honesty', q: 'The shopkeepers in the lamp story lied to avoid giving. When is it hardest for you to be honest?' },
  { theme: 'Compassion', q: 'Baba let a man everyone avoided care for him. Is there someone you overlook? How could you include them?' },
  { theme: 'Simplicity', q: 'Baba owned almost nothing. What is one thing you could let go of — an object, habit or worry?' },
  { theme: 'Ego', q: 'Hemadpant saw grinding wheat as grinding the ego. What is one habit of pride or anger you\'d like to "grind away"?' },
  { theme: 'Kindness to all beings', q: 'How do you treat animals and the natural world? Is there a way to show more care?' },
  { theme: 'Surrender', q: '"Cast your burden on me." What burden are you carrying that you could set down, even for today?' },
  { theme: 'Gratitude', q: 'Bayajabai fed Baba in hard times and he never forgot. Who has helped you that you could thank?' },
  { theme: 'Patience with others', q: '"If others speak ill of you, let it pass." Recall a time someone upset you — what would letting it pass look like?' },
];

// lookup for quiz/flashcard items
const ITEMS = {};
TIMELINE.forEach(t => ITEMS[t.id] = { type: 'timeline', ...t });
PEOPLE.forEach(p => ITEMS[p.id] = { type: 'person', ...p });
PLACES.forEach(p => ITEMS[p.id] = { type: 'place', ...p });
TERMS.forEach(t => ITEMS[t.id] = { type: 'term', ...t });
SAYINGS.forEach(s => ITEMS[s.id] = { type: 'saying', ...s });
