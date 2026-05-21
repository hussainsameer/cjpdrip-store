export type NewsItem = {
  id: string;
  date: string; // ISO date
  source: string;
  sourceType: 'press' | 'movement' | 'drop' | 'social';
  title: string;
  blurb: string;
  url: string;
  external?: boolean;
};

export const NEWS_ITEMS: NewsItem[] = [
  // === International press ===
  {
    id: 'cnn-viral',
    date: '2026-05-21',
    source: 'CNN',
    sourceType: 'press',
    title: "India's 'cockroach' party goes viral",
    blurb: 'CNN covers how a satirical political party born from a Chief Justice\'s offhand comment is overtaking the ruling BJP on Instagram in days.',
    url: 'https://edition.cnn.com/2026/05/21/world/video/india-chief-justice-cockroach-janta-party-mogul-vrtc',
    external: true,
  },
  {
    id: 'wapo-youth-anger',
    date: '2026-05-21',
    source: 'The Washington Post',
    sourceType: 'press',
    title: "A parody 'cockroach' party in India becomes major outlet for youth anger and protest",
    blurb: 'The Washington Post on how the CJP movement is channelling Gen Z frustration over unemployment, inflation, and political dysfunction.',
    url: 'https://www.washingtonpost.com/business/2026/05/21/india-cockroach-janta-party/8c066a10-5514-11f1-9c40-7a0a12d9e745_story.html',
    external: true,
  },
  {
    id: 'aljazeera-cji',
    date: '2026-05-20',
    source: 'Al Jazeera',
    sourceType: 'press',
    title: "Cockroach Janta Party: Top Indian judge's comment sparks satire, protest",
    blurb: "Al Jazeera traces the movement back to Chief Justice Surya Kant's 'cockroaches' remark — and the meme storm that followed.",
    url: 'https://www.aljazeera.com/features/2026/5/20/cockroach-janata-party-top-indian-judges-comment-sparks-satire-protest',
    external: true,
  },
  {
    id: 'dna-trademark',
    date: '2026-05-21',
    source: 'DNA India',
    sourceType: 'press',
    title: "Who is the real 'cockroach'? CJP moves beyond memes as 3 trademark filings surface",
    blurb: 'Three separate trademark applications have been filed for the phrase "Cockroach Janta Party". The race for ownership has begun.',
    url: 'https://www.dnaindia.com/india/report-who-is-the-real-cockroach-cockroach-janta-party-moves-beyond-memes-as-3-trademark-filings-surface-3211126',
    external: true,
  },
  {
    id: 'theprint-founder',
    date: '2026-05-21',
    source: 'The Print',
    sourceType: 'press',
    title: 'CJP Dalit founder Abhijeet Dipke faces caste attacks on X',
    blurb: 'The Print on the targeted attacks against founder Abhijeet Dipke and the ugly side of going viral in Indian internet politics.',
    url: 'https://theprint.in/feature/cockroach-janta-party-dalit-abhijeet-dipke-caste-attacks/2937920/',
    external: true,
  },
  {
    id: 'sundayguardian-founder',
    date: '2026-05-21',
    source: 'Sunday Guardian',
    sourceType: 'press',
    title: 'Who is Abhijeet Dipke? The 30-year-old Boston University student behind CJP',
    blurb: 'A full profile of the political communications strategist who founded CJP on May 16 — caste, qualifications, and links explored.',
    url: 'https://sundayguardianlive.com/trending/who-is-abhijeet-dipke-check-cockroach-janata-party-founders-caste-qualification-age-link-with-aap-linkedin-instagram-x-account-and-more-195055/',
    external: true,
  },
  {
    id: 'wikipedia',
    date: '2026-05-20',
    source: 'Wikipedia',
    sourceType: 'press',
    title: 'Cockroach Janta Party — Wikipedia article goes live',
    blurb: 'The movement officially crosses the threshold into encyclopaedic record. Read the live, evolving entry.',
    url: 'https://en.wikipedia.org/wiki/Cockroach_Janta_Party',
    external: true,
  },

  // === Movement milestones ===
  {
    id: 'milestone-15m',
    date: '2026-05-21',
    source: 'CJP Tracker',
    sourceType: 'movement',
    title: 'CJP crosses 15 million Instagram followers — overtakes BJP',
    blurb: 'In under a week, the parody account has surpassed the ruling Bharatiya Janata Party\'s 8.8M followers. Place your bet on Sunday\'s number.',
    url: '/predict',
  },
  {
    id: 'milestone-10m',
    date: '2026-05-20',
    source: 'CJP Tracker',
    sourceType: 'movement',
    title: '10 million followers in 5 days',
    blurb: 'After hitting 3M in 78 hours, the swarm doubled-and-then-some. The Indian internet has spoken.',
    url: 'https://www.instagram.com/cockroachjantaparty/',
    external: true,
  },
  {
    id: 'milestone-3m',
    date: '2026-05-18',
    source: 'CJP Tracker',
    sourceType: 'movement',
    title: '3 million followers in 78 hours',
    blurb: 'The first major milestone. A satirical movement turns into actual political signal.',
    url: 'https://www.instagram.com/cockroachjantaparty/',
    external: true,
  },
  {
    id: 'founding',
    date: '2026-05-16',
    source: 'The Founding',
    sourceType: 'movement',
    title: 'Cockroach Janta Party founded',
    blurb: 'Abhijeet Dipke launches CJP as a satirical response to CJI Surya Kant\'s "cockroaches" remark in an open court hearing.',
    url: 'https://cockroachjantaparty.org/',
    external: true,
  },
  {
    id: 'the-quote',
    date: '2026-05-15',
    source: 'The Spark',
    sourceType: 'movement',
    title: 'The quote that started it all',
    blurb: '"There are youngsters like cockroaches, who don\'t get any employment or have any place in the profession…" — CJI Surya Kant, in open court.',
    url: 'https://www.aljazeera.com/features/2026/5/20/cockroach-janata-party-top-indian-judges-comment-sparks-satire-protest',
    external: true,
  },

  // === CJP Drip drops ===
  {
    id: 'drop-stickers',
    date: '2026-05-22',
    source: 'CJP Drip',
    sourceType: 'drop',
    title: 'Sticker drop announced — Drop No. 002',
    blurb: 'Five vinyl sticker designs, kiss-cut, waterproof. From ₹79. The first sticker drop is now live for pre-order.',
    url: '/stickers',
  },
  {
    id: 'drop-mugs',
    date: '2026-05-21',
    source: 'CJP Drip',
    sourceType: 'drop',
    title: 'Mug drop — five ceramic mugs join the catalogue',
    blurb: 'For the chai before the interview. Five mug designs from the tee collection, ₹349 each.',
    url: '/',
  },
  {
    id: 'drop-001',
    date: '2026-05-21',
    source: 'CJP Drip',
    sourceType: 'drop',
    title: 'Drop No. 001 live — 19 tees, the founding collection',
    blurb: 'The Black Protest Tee, the Manifesto, the Parasite, the Cockroach in Chief — the first 19 designs are live.',
    url: '/',
  },
];
