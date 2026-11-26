export interface SurahEntry {
  id: number;
  time: string;
  name: string;
  chapter: number;
  level: string;
  audioUrl: string;
  description?: string;
  pageNumber?: number;
}

export interface Theme {
  title: string;
  description: string;
  fullStory?: string;
}

const getAudioUrl = (chapter: number) => `https://server8.mp3quran.net/afs/${String(chapter).padStart(3, '0')}.mp3`;

export const surahTableData: SurahEntry[] = [
  { id: 1, time: 'Anytime (Day/Eve)', name: 'Al-Kahf', chapter: 18, level: 'Strong Sunnah', audioUrl: getAudioUrl(18) },
  { id: 2, time: 'Friday Fajr', name: 'As-Sajdah', chapter: 32, level: 'Strong Sunnah', audioUrl: getAudioUrl(32) },
  { id: 3, time: 'Thursday Night', name: 'Yasin', chapter: 36, level: 'Popular (Weak Hadith)', audioUrl: getAudioUrl(36) },
  { id: 4, time: 'Thursday Night', name: 'Ad-Dukhan', chapter: 44, level: 'Popular (Weak Hadith)', audioUrl: getAudioUrl(44) },
  { id: 5, time: "Jumu'ah", name: 'Al-Rahman', chapter: 55, level: 'General', audioUrl: getAudioUrl(55) },
  { id: 6, time: "Jumu'ah", name: 'Al-Waqiah', chapter: 56, level: 'Nightly', audioUrl: getAudioUrl(56) },
  { id: 7, time: "Jumu'ah Prayer", name: "Al-Jumu'ah", chapter: 62, level: 'Strong Sunnah', audioUrl: getAudioUrl(62) },
  { id: 8, time: "Jumu'ah Prayer", name: 'Al-Munafiqun', chapter: 63, level: 'Strong Sunnah', audioUrl: getAudioUrl(63) },
  { id: 9, time: "Jumu'ah", name: 'Al-Mulk', chapter: 67, level: 'Every Night (Authentic)', audioUrl: getAudioUrl(67) },
  { id: 10, time: 'Friday Fajr', name: 'Al-Insan', chapter: 76, level: 'Strong Sunnah', audioUrl: getAudioUrl(76) },
  { id: 11, time: "Jumu'ah Prayer", name: "Al-A'la", chapter: 87, level: 'Strong Sunnah', audioUrl: getAudioUrl(87) },
  { id: 12, time: "Jumu'ah Prayer", name: 'Al-Ghashiyah', chapter: 88, level: 'Strong Sunnah', audioUrl: getAudioUrl(88) },
  { id: 13, time: "Jumu'ah", name: 'Al-Ikhlas', chapter: 112, level: 'Morning/Evening/Sleep', audioUrl: getAudioUrl(112) },
  { id: 14, time: "Jumu'ah", name: 'Al-Falaq', chapter: 113, level: 'Morning/Evening/Sleep', audioUrl: getAudioUrl(113) },
  { id: 15, time: "Jumu'ah", name: 'An-Nas', chapter: 114, level: 'Morning/Evening/Sleep', audioUrl: getAudioUrl(114) },
  { id: 16, time: "Jumu'ah", name: 'Al-Fatiha', chapter: 1, level: 'Core Remembrance', audioUrl: getAudioUrl(1), description: 'The Opening chapter, foundational to every prayer and daily life.' },
  { id: 17, time: "Jumu'ah", name: 'Second Page of Quran', chapter: 2, level: 'Recommended Reading', audioUrl: getAudioUrl(2), description: 'The beginning of Surah Al-Baqarah (verses 1-5), outlining the traits of the believers.', pageNumber: 2 },
];

export const alKahfThemes: Theme[] = [
  {
    title: 'The People of the Cave',
    description: 'A story of young men who retreated to a cave to protect their faith from persecution, teaching resilience and trust in Allah.',
    fullStory: 'This story is about a group of young men who believed in one God but lived in a society of idol worshippers. Fearing persecution for their faith, they fled to a cave. Allah caused them to sleep for 309 years. When they woke up, they thought they had only slept for a day or part of a day. This miracle preserved their faith and serves as a reminder of Allah\'s protection for those who rely on Him.'
  },
  {
    title: 'The Man with Two Gardens',
    description: 'A parable contrasting a wealthy, arrogant man with a humble believer, highlighting the dangers of materialism and ungratefulness.',
    fullStory: 'A parable of a wealthy man who possessed two beautiful gardens abundant with fruit. He became arrogant, doubting the afterlife and claiming his wealth would last forever. His poor but faithful companion reminded him to be grateful to Allah. Eventually, a storm destroyed the gardens, leaving the arrogant man in regret. This teaches that wealth is a test and arrogance leads to loss.'
  },
  {
    title: 'Prophet Musa and Khidr',
    description: 'A journey seeking knowledge that teaches that human understanding is limited and patience is required to understand Allah’s wisdom.',
    fullStory: 'Prophet Musa (Moses) traveled to meet Khidr, a servant of Allah endowed with special knowledge. Musa asked to follow him to learn. Khidr agreed on the condition that Musa remains patient and asks no questions. Khidr performed seemingly strange acts: damaging a boat, killing a boy, and rebuilding a wall for inhospitable villagers. Musa questioned each act. Finally, Khidr explained the hidden wisdom behind each event, teaching that human knowledge is limited compared to Allah\'s wisdom.'
  },
  {
    title: 'Dhul-Qarnayn',
    description: 'The story of a righteous ruler who traveled the earth, using his power to establish justice and protect the weak against corruption.',
    fullStory: 'Dhul-Qarnayn was a righteous and powerful king who traveled to the East and West. He met people who were being terrorized by the tribes of Ya\'juj and Ma\'juj (Gog and Magog). Instead of seeking tribute, he helped them build a massive iron and copper barrier to contain the threat. His story exemplifies just leadership, using power to protect the weak and serving Allah rather than seeking personal glory.'
  }
];

export const alKahfBenefits = [
  {
    title: 'Spiritual Light (Nur)',
    content: 'It is said to provide a spiritual "light" that shines for the believer between the two Fridays.'
  },
  {
    title: 'Protection from Dajjal',
    content: 'Memorizing the first ten verses (or the last ten) is believed to offer protection from the trials of the Dajjal (Antichrist).'
  },
  {
    title: 'Timing',
    content: 'You can read it anytime from Thursday evening (after Maghrib) until Friday evening (before Maghrib).'
  }
];