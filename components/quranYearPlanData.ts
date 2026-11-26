export type PlanQuarter = 1 | 2 | 3 | 4;

export type LearningLevel = 'beginner' | 'intermediate' | 'advanced';

export type PlanCategory = 'foundations' | 'stories_wisdom' | 'spiritual_light' | 'mastery_khatam';

export interface DailyVocabulary {
  word: string;
  arabic: string;
  root: string;
  transliteration: string;
  meaning: {
    en: string;
    ar: string;
    am: string;
    har: string;
  };
  occurrencesInQuran: number;
}

import quranVersesDbRaw from './quranYearPlanVersesData.json';

export interface AyahDetail {
  ayahNumber: number;
  arabic: string;
  transliteration: string;
  translation: string;
}

const QURAN_VERSES_DB = quranVersesDbRaw as Record<string, {
  dayNumber: number;
  surahNumber: number;
  surahName: { en: string; ar: string; am: string };
  verseRange: string;
  verseNumbers: number[];
  arabicText: string;
  transliteration: string;
  translationEn: string;
  ayahs: AyahDetail[];
}>;

export interface TajweedRuleFocus {
  ruleName: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  exampleVerseKey: string;
  audioExampleWord?: string;
  practicalTip: {
    en: string;
    ar: string;
  };
}

export interface DayLesson {
  dayNumber: number; // 1 to 365
  weekNumber: number; // 1 to 52
  quarter: PlanQuarter;
  category: PlanCategory;
  surahNumber: number;
  surahName: {
    en: string;
    ar: string;
    am: string;
  };
  verseRange: string; // e.g. "1-7"
  verseNumbers: number[];
  title: {
    en: string;
    ar: string;
    am: string;
    har: string;
  };
  subtitle: {
    en: string;
    ar: string;
  };
  // 5 Min: Recitation
  recitation: {
    arabicText: string;
    transliteration: string;
    audioUrl?: string;
    recommendedReciterId: string;
    tajweedFocus: TajweedRuleFocus;
    ayahs?: AyahDetail[];
  };
  // 10 Min: Understanding, Vocabulary & Tafsir
  understanding: {
    translation: {
      en: string;
      ar: string;
      am: string;
      har: string;
    };
    vocabulary: DailyVocabulary[];
    tafsirSummary: {
      en: string;
      ar: string;
    };
    thematicContext: {
      en: string;
      ar: string;
    };
  };
  // 5 Min: Tadabbur, Practical Action & Dua
  reflection: {
    reflectionPrompt: {
      en: string;
      ar: string;
      am: string;
    };
    dailyActionCommitment: {
      en: string;
      ar: string;
    };
    quranicDua: {
      arabic: string;
      transliteration: string;
      translation: {
        en: string;
        ar: string;
      };
      reference: string;
    };
    retentionQuiz: {
      question: {
        en: string;
        ar: string;
      };
      options: {
        text: { en: string; ar: string };
        isCorrect: boolean;
        explanation: { en: string; ar: string };
      }[];
    };
  };
}

export interface WeekOverview {
  weekNumber: number;
  quarter: PlanQuarter;
  category: PlanCategory;
  title: {
    en: string;
    ar: string;
    am: string;
  };
  surahFocus: string;
  keyThemes: string[];
  days: number[]; // e.g. [1, 2, 3, 4, 5, 6, 7]
}

export interface QuarterOverview {
  quarter: PlanQuarter;
  title: {
    en: string;
    ar: string;
    am: string;
    har: string;
  };
  subtitle: {
    en: string;
    ar: string;
  };
  dateRangeDesc: string;
  weekRange: string;
  dayCount: number;
  coreSurahs: string[];
  color: string;
}

export const QUARTER_ROADMAP: QuarterOverview[] = [
  {
    quarter: 1,
    title: {
      en: "Quarter 1: Foundations & The Essential Protections",
      ar: "الربع الأول: الأصول والتحصينات العظيمة",
      am: "ሩብ 1፡ መሰረቶች እና ታላላቅ ጥበቃዎች",
      har: "ሩብ 1፡ መሰረቶቹዋ ታላቅ ጥበቆች"
    },
    subtitle: {
      en: "Weeks 1–13 • Days 1–91 • Surah Al-Fatiha, Juz 30 (An-Nas to An-Naba), Ayatul Kursi",
      ar: "الأسابيع 1–13 • الأيام 1–91 • الفاتحة، جزء عم كاملاً، آية الكرسي وخواتيم البقرة"
    },
    dateRangeDesc: "Month 1 to 3",
    weekRange: "Weeks 1–13",
    dayCount: 91,
    coreSurahs: ["Al-Fatiha", "An-Nas to Al-Ikhlas", "Al-Falaq", "Al-Mulk", "An-Naba", "Al-Baqarah (Ayatul Kursi)"],
    color: "from-emerald-600 to-teal-700"
  },
  {
    quarter: 2,
    title: {
      en: "Quarter 2: Prophetic Wisdom & The Blessed Friday Traditions",
      ar: "الربع الثاني: الحكمة النبوية وسنن يوم الجمعة المباركة",
      am: "ሩብ 2፡ የነቢያዊ ጥበብ እና የተባረከው የጁሙዓህ ሱናዎች",
      har: "ሩብ 2፡ የነቢያዊ ጥበብዋ የጁሙዓህ በረከቶች"
    },
    subtitle: {
      en: "Weeks 14–26 • Days 92–182 • Surah Al-Kahf, Yaseen, Ar-Rahman, Al-Waqi'ah, Al-Hadeed",
      ar: "الأسابيع 14–26 • الأيام 92–182 • سورة الكهف، يس، الرحمن، الواقعة، والحديد"
    },
    dateRangeDesc: "Month 4 to 6",
    weekRange: "Weeks 14–26",
    dayCount: 91,
    coreSurahs: ["Al-Kahf", "Yaseen", "Ar-Rahman", "Al-Waqi'ah", "Al-Mulk", "Al-Hashr"],
    color: "from-amber-600 to-amber-700"
  },
  {
    quarter: 3,
    title: {
      en: "Quarter 3: Spiritual Illumination & Moral Character",
      ar: "الربع الثالث: النور الروحي والأخلاق القرآنية الرفيعة",
      am: "ሩብ 3፡ መንፈሳዊ ብርሃን እና የላቀ ስነ-ምግባር",
      har: "ሩብ 3፡ ሩሓኒ ኑርዋ የቁርአን አደቦች"
    },
    subtitle: {
      en: "Weeks 27–39 • Days 183–273 • Surah Maryam, Ta-Ha, An-Nur, Al-Furqan, Luqman, Al-Hujurat",
      ar: "الأسابيع 27–39 • الأيام 183–273 • مريم، طه، النور، الفرقان، لقمان، والحجرات"
    },
    dateRangeDesc: "Month 7 to 9",
    weekRange: "Weeks 27–39",
    dayCount: 91,
    coreSurahs: ["Maryam", "Ta-Ha", "An-Nur", "Al-Furqan", "Luqman", "Al-Hujurat"],
    color: "from-sky-600 to-blue-700"
  },
  {
    quarter: 4,
    title: {
      en: "Quarter 4: Comprehensive Mastery & Grand Khatam",
      ar: "الربع الرابع: الإتقان الشامل وختم القرآن المجيد",
      am: "ሩብ 4፡ አጠቃላይ እውቀት እና ታላቁ የቁርአን ማጠናቀቂያ",
      har: "ሩብ 4፡ ሙሉ እውቀትዋ የቁርአን ኻቲማህ"
    },
    subtitle: {
      en: "Weeks 40–52 • Days 274–365 • Major Medinan Codices (Al-Baqarah, Ali 'Imran) & Khatm",
      ar: "الأسابيع 40–52 • الأيام 274–365 • مدنيات كبرى، آيات التشريع والإيمان، وختم القرآن"
    },
    dateRangeDesc: "Month 10 to 12",
    weekRange: "Weeks 40–52",
    dayCount: 92,
    coreSurahs: ["Al-Baqarah (Selected Passages)", "Ali 'Imran", "An-Nisa'", "Al-Ma'idah", "Khatam-ul-Quran"],
    color: "from-purple-600 to-indigo-800"
  }
];

export const WEEKS_SYLLABUS: WeekOverview[] = [
  // Quarter 1: Foundations
  {
    weekNumber: 1,
    quarter: 1,
    category: 'foundations',
    title: {
      en: "Week 1: Surah Al-Fatiha — The Foundation of Daily Prayer",
      ar: "الأسبوع 1: سورة الفاتحة — أم الكتاب وأساس الصلاة",
      am: "ሳምንት 1፡ ሱረቱል ፋቲሃ — የሶላት መሰረት"
    },
    surahFocus: "Surah Al-Fatiha (1:1–7)",
    keyThemes: ["Praise & Lordship (Rububiyyah)", "Divine Mercy", "Seeking Guidance (Sirat al-Mustaqim)"],
    days: [1, 2, 3, 4, 5, 6, 7]
  },
  {
    weekNumber: 2,
    quarter: 1,
    category: 'foundations',
    title: {
      en: "Week 2: The Three Quls — Absolute Tawheed & Divine Sanctuary",
      ar: "الأسبوع 2: المعوذات والإخلاص — كمال التوحيد والتحصين",
      am: "ሳምንት 2፡ ሙዐዊዛት — የተውሂድ ጥራት እና ጥበቃ"
    },
    surahFocus: "Al-Ikhlas (112), Al-Falaq (113), An-Nas (114)",
    keyThemes: ["Purity of Monotheism (As-Samad)", "Protection from Outer Darkness", "Protection from Whispers (Waswas)"],
    days: [8, 9, 10, 11, 12, 13, 14]
  },
  {
    weekNumber: 3,
    quarter: 1,
    category: 'foundations',
    title: {
      en: "Week 3: Daily Generosity & Sincerity — Al-Kawthar & Al-Ma'un",
      ar: "الأسبوع 3: الكوثر والماعون — العطاء والإخلاص وخدمة الخلق",
      am: "ሳምንት 3፡ አል-ከውሰር እና አል-ማዑን — ልግስና እና ቅንነት"
    },
    surahFocus: "Al-Kawthar (108), Al-Ma'un (107), Quraysh (106), Al-Fil (105)",
    keyThemes: ["Abundance in Prophethood", "True Religion vs Hypocrisy", "Safety & Divine Provision"],
    days: [15, 16, 17, 18, 19, 20, 21]
  },
  {
    weekNumber: 4,
    quarter: 1,
    category: 'foundations',
    title: {
      en: "Week 4: The Value of Time & Human Destiny — Al-Asr & Al-Humazah",
      ar: "الأسبوع 4: سورة العصر والهمزة — قيمة الوقت ومصير الإنسان",
      am: "ሳምንት 4፡ ሱረቱል ዓስር እና ሁመዛህ — የጊዜ ዋጋ"
    },
    surahFocus: "Al-Asr (103), Al-Humazah (104), At-Takathur (102), Al-Qari'ah (101)",
    keyThemes: ["The 4 Pillars of Success", "Dangers of Material Rivalry", "The Striking Hour"],
    days: [22, 23, 24, 25, 26, 27, 28]
  },
  {
    weekNumber: 5,
    quarter: 1,
    category: 'foundations',
    title: {
      en: "Week 5: Night of Decree & Solace — Al-Qadr, Al-Bayyinah, & Ash-Sharh",
      ar: "الأسبوع 5: ليلة القدر وانشراح الصدر — سورة القدر والبيّنة والشرح",
      am: "ሳምንት 5፡ ለይለቱል ቀድር እና የልብ መስፋት"
    },
    surahFocus: "Al-Qadr (97), Al-Bayyinah (98), Ash-Sharh (94), Ad-Duha (93)",
    keyThemes: ["Descent of the Quran", "Ease after Hardship", "Divine Comfort in Despair"],
    days: [29, 30, 31, 32, 33, 34, 35]
  },
  {
    weekNumber: 6,
    quarter: 1,
    category: 'foundations',
    title: {
      en: "Week 6: Human Dignity & The Sacred Mountain — At-Teen, Al-Alaq, & Al-Balad",
      ar: "الأسبوع 6: التين والعلق والبلد — تكريم الإنسان وأول الوحي",
      am: "ሳምንት 6፡ አት-ቲን እና አል-ዐለቅ — የሰው ልጅ ክብር"
    },
    surahFocus: "At-Teen (95), Al-Alaq (96), Al-Balad (90)",
    keyThemes: ["Created in the Best Mold", "Read in the Name of your Lord", "Overcoming the Steep Ascent"],
    days: [36, 37, 38, 39, 40, 41, 42]
  },
  {
    weekNumber: 7,
    quarter: 1,
    category: 'foundations',
    title: {
      en: "Week 7: The Sun, The Night & Purification — Ash-Shams & Al-Layl",
      ar: "الأسبوع 7: الشمس والليل — تزكية النفس وتبديد الظلمات",
      am: "ሳምንት 7፡ አሽ-ሸምስ እና አል-ለይል — የነፍስ ማጥራት"
    },
    surahFocus: "Ash-Shams (91), Al-Layl (92), Ad-Duha (93)",
    keyThemes: ["Purification of the Soul (Tazkiyah)", "Divergent Human Efforts", "The Splendor of Morning Light"],
    days: [43, 44, 45, 46, 47, 48, 49]
  },
  {
    weekNumber: 8,
    quarter: 1,
    category: 'foundations',
    title: {
      en: "Week 8: Glorification of the Most High — Al-A'la & Al-Ghashiyah",
      ar: "الأسبوع 8: الأعلى والغاشية — تسبيح الرب الأعلى واليوم الآخر",
      am: "ሳምንት 8፡ አል-አዕላ እና አል-ጋሺያህ — የአላህ ቅድስና"
    },
    surahFocus: "Al-A'la (87), Al-Ghashiyah (88), Al-Fajr (89)",
    keyThemes: ["Remembering the Name of Allah", "Contemplation of the Heavens", "The Ten Blessed Nights of Fajr"],
    days: [50, 51, 52, 53, 54, 55, 56]
  },
  {
    weekNumber: 9,
    quarter: 1,
    category: 'foundations',
    title: {
      en: "Week 9: Cosmic Rhythms & Celestial Signs — Al-Buruj, At-Tariq, & Al-Inshiqaq",
      ar: "الأسبوع 9: البروج والطارق والانشقاق — آيات الكون وحفظ النفس",
      am: "ሳምንት 9፡ አል-ቡሩጅ እና አጥ-ጣሪቅ — የሰማያት ምልክቶች"
    },
    surahFocus: "Al-Buruj (85), At-Tariq (86), Al-Inshiqaq (84)",
    keyThemes: ["Firmness in Faith", "The Piercing Star & Guarded Soul", "Surrender of the Heavens"],
    days: [57, 58, 59, 60, 61, 62, 63]
  },
  {
    weekNumber: 10,
    quarter: 1,
    category: 'foundations',
    title: {
      en: "Week 10: Justice & Transgression — Al-Mutaffifin & Al-Infitar",
      ar: "الأسبوع 10: المطففون والانفطار — ميزان العدل ويوم الجزاء",
      am: "ሳምንት 10፡ አል-ሙጠፊፊን — ፍትህና ሚዛን"
    },
    surahFocus: "Al-Mutaffifin (83), Al-Infitar (82), At-Takwir (81)",
    keyThemes: ["Integrity in Commerce", "The Record of the Righteous (Illiyyun)", "When the Sun is Wrapped in Darkness"],
    days: [64, 65, 66, 67, 68, 69, 70]
  },
  {
    weekNumber: 11,
    quarter: 1,
    category: 'foundations',
    title: {
      en: "Week 11: The Great Announcement — Surah An-Naba & An-Nazi'at",
      ar: "الأسبوع 11: النبأ والنازعات — النبأ العظيم ويوم القيامة",
      am: "ሳምንት 11፡ አን-ነበእ እና አን-ናዚዓት — ታላቁ ዜና"
    },
    surahFocus: "An-Naba (78), An-Nazi'at (79), Abasa (80)",
    keyThemes: ["The Resurrection & Recompense", "Humility before Divine Admonition", "The Grand Day of Standing"],
    days: [71, 72, 73, 74, 75, 76, 77]
  },
  {
    weekNumber: 12,
    quarter: 1,
    category: 'foundations',
    title: {
      en: "Week 12: Sovereign Dominion — Surah Al-Mulk (The Protector from Grave)",
      ar: "الأسبوع 12: سورة الملك — المانعة من عذاب القبر والتأمل في الخلق",
      am: "ሳምንት 12፡ ሱረቱል ሙልክ — የቀብር ቅጣት መከላከያ"
    },
    surahFocus: "Surah Al-Mulk (67:1–30)",
    keyThemes: ["Creation of Life & Death", "Flawless Heavens", "Reliance on Ar-Rahman"],
    days: [78, 79, 80, 81, 82, 83, 84]
  },
  {
    weekNumber: 13,
    quarter: 1,
    category: 'foundations',
    title: {
      en: "Week 13: Ayatul Kursi & The Sovereign Throne of Allah",
      ar: "الأسبوع 13: آية الكرسي وخواتيم البقرة — أعظم آية في كتاب الله",
      am: "ሳምንት 13፡ አያተል ኩርሲይ — ታላቋ የቁርአን አንቀጽ"
    },
    surahFocus: "Al-Baqarah (2:255 & 2:284–286)",
    keyThemes: ["The Living, Self-Sustaining King", "Comprehensive Protection", "Closing Supplications of Forgiveness"],
    days: [85, 86, 87, 88, 89, 90, 91]
  },

  // Quarter 2: Prophetic Wisdom & Key Friday Surahs
  {
    weekNumber: 14,
    quarter: 2,
    category: 'stories_wisdom',
    title: {
      en: "Week 14: Surah Al-Kahf — The Companions of the Cave (Trial of Faith)",
      ar: "الأسبوع 14: سورة الكهف — فتية الكهف وفتنة الدين والاعتصام بالله",
      am: "ሳምንት 14፡ ሱረቱል ከህፍ — የዋሻው ባልደረቦች"
    },
    surahFocus: "Surah Al-Kahf (18:1–26)",
    keyThemes: ["Preservation of Iman under Tyranny", "Divine Shelter in the Cave", "Trusting Allah's Timing"],
    days: [92, 93, 94, 95, 96, 97, 98]
  },
  {
    weekNumber: 15,
    quarter: 2,
    category: 'stories_wisdom',
    title: {
      en: "Week 15: Surah Al-Kahf — The Two Gardens (Trial of Wealth & Gratitude)",
      ar: "الأسبوع 15: سورة الكهف — صاحب الجنتين وفتنة المال والغرور",
      am: "ሳምንት 15፡ ሱረቱል ከህፍ — የሁለቱ እርሻዎች ባለቤት"
    },
    surahFocus: "Surah Al-Kahf (18:27–49)",
    keyThemes: ["The Illusion of Worldly Splendor", "Saying 'Ma Sha Allah La Quwwata illa Billah'", "The Day of Display"],
    days: [99, 100, 101, 102, 103, 104, 105]
  },
  {
    weekNumber: 16,
    quarter: 2,
    category: 'stories_wisdom',
    title: {
      en: "Week 16: Surah Al-Kahf — Musa & Al-Khidr (Trial of Knowledge)",
      ar: "الأسبوع 16: سورة الكهف — موسى والخضر وفتنة العلم والحكمة الخفية",
      am: "ሳምንት 16፡ ሱረቱል ከህፍ — ሙሳ እና ኺድር"
    },
    surahFocus: "Surah Al-Kahf (18:50–82)",
    keyThemes: ["Patience in Learning", "Unseen Divine Wisdom behind Calamities", "Protecting the Orphans' Treasure"],
    days: [106, 107, 108, 109, 110, 111, 112]
  },
  {
    weekNumber: 17,
    quarter: 2,
    category: 'stories_wisdom',
    title: {
      en: "Week 17: Surah Al-Kahf — Dhul-Qarnayn (Trial of Power & Justice)",
      ar: "الأسبوع 17: سورة الكهف — ذو القرنين وفتنة السلطان وخواتيم الكهف",
      am: "ሳምንት 17፡ ሱረቱል ከህፍ — ዙል-ቀርነይን"
    },
    surahFocus: "Surah Al-Kahf (18:83–110)",
    keyThemes: ["Justice & Using Strength for the Weak", "Gog and Magog (Ya'juj & Ma'juj)", "The Ocean as Ink for Allah's Words"],
    days: [113, 114, 115, 116, 117, 118, 119]
  },
  {
    weekNumber: 18,
    quarter: 2,
    category: 'stories_wisdom',
    title: {
      en: "Week 18: Surah Yaseen — The Heart of the Quran (Part 1)",
      ar: "الأسبوع 18: سورة يس — قلب القرآن: الرسالة وقصة القرية",
      am: "ሳምንት 18፡ ሱረቱ ያሲን — የቁርአን ልብ (ክፍል 1)"
    },
    surahFocus: "Surah Yaseen (36:1–32)",
    keyThemes: ["Oath by the Wise Quran", "The Believer from the Outskirts (Habib an-Najjar)", "Sacrifice for the Truth"],
    days: [120, 121, 122, 123, 124, 125, 126]
  },
  {
    weekNumber: 19,
    quarter: 2,
    category: 'stories_wisdom',
    title: {
      en: "Week 19: Surah Yaseen — Cosmic Signs & The Creator's Power (Part 2)",
      ar: "الأسبوع 19: سورة يس — آيات الكون وإحياء الموتى وسيد الخلق",
      am: "ሳምንት 19፡ ሱረቱ ያሲን — የፍጥረት ምልክቶች (ክፍል 2)"
    },
    surahFocus: "Surah Yaseen (36:33–83)",
    keyThemes: ["The Sun and Moon in Orbits", "Revival of Dry Earth", "Kun fa-Yakun (Be, and it is)"],
    days: [127, 128, 129, 130, 131, 132, 133]
  },
  {
    weekNumber: 20,
    quarter: 2,
    category: 'stories_wisdom',
    title: {
      en: "Week 20: Surah Ar-Rahman — Which Favors of your Lord will you Deny?",
      ar: "الأسبوع 20: سورة الرحمن — فبأي آلاء ربكما تكذبان وإبداع الصنع",
      am: "ሳምንት 20፡ ሱረቱ አር-ራሕማን — የጌታችሁን ጸጋዎች በየትኛው ታስተባብላላችሁ?"
    },
    surahFocus: "Surah Ar-Rahman (55:1–78)",
    keyThemes: ["Teaching the Quran", "The Balance in Creation", "The Gardens of Jannat"],
    days: [134, 135, 136, 137, 138, 139, 140]
  },
  {
    weekNumber: 21,
    quarter: 2,
    category: 'stories_wisdom',
    title: {
      en: "Week 21: Surah Al-Waqi'ah — The Inevitable Day & Three Categories of Humanity",
      ar: "الأسبوع 21: سورة الواقعة — أصناف الناس الثلاثة وجزاء السابقين",
      am: "ሳምንት 21፡ ሱረቱል ዋቂዓህ — የማይቀረው ቀን"
    },
    surahFocus: "Surah Al-Waqi'ah (56:1–96)",
    keyThemes: ["As-Sabiqun (The Foremost)", "Ashab al-Yamin (Companions of the Right)", "Reflection on Water, Seed & Fire"],
    days: [141, 142, 143, 144, 145, 146, 147]
  },
  {
    weekNumber: 22,
    quarter: 2,
    category: 'stories_wisdom',
    title: {
      en: "Week 22: Surah Al-Hadeed — Iron, Sacrifice & Light in the Darkness",
      ar: "الأسبوع 22: سورة الحديد — إنفاق المال والنور بين يدي المؤمنين",
      am: "ሳምንት 22፡ ሱረቱል ሀዲድ — ብረት እና የብርሃን ጉዞ"
    },
    surahFocus: "Surah Al-Hadeed (57:1–29)",
    keyThemes: ["The Light of the Believers on Sirat", "Has the Time not come for Hearts to Soften?", "Divine Decree"],
    days: [148, 149, 150, 151, 152, 153, 154]
  },
  {
    weekNumber: 23,
    quarter: 2,
    category: 'stories_wisdom',
    title: {
      en: "Week 23: Surah Al-Hashr — The Names of Allah & Mountain Humility",
      ar: "الأسبوع 23: سورة الحشر — أسماء الله الحسنى وخشوع الجبال",
      am: "ሳምንት 23፡ ሱረቱል ሐሽር — የአላህ ውብ ስሞች"
    },
    surahFocus: "Surah Al-Hashr (59:1–24)",
    keyThemes: ["If We had sent down this Quran upon a Mountain", "The Sovereign, The Pure, The Granter of Security", "Taqwa"],
    days: [155, 156, 157, 158, 159, 160, 161]
  },
  {
    weekNumber: 24,
    quarter: 2,
    category: 'stories_wisdom',
    title: {
      en: "Week 24: Surah Al-Jumu'ah & Al-Munafiqun — The Friday Call & Sincerity",
      ar: "الأسبوع 24: الجمعة والمنافقون — نداء صلاة الجمعة والتحذير من النفاق",
      am: "ሳምንት 24፡ ሱረቱል ጁሙዓህ እና ሙናፊቁን — የጁሙዓህ ጥሪ"
    },
    surahFocus: "Surah Al-Jumu'ah (62) & Al-Munafiqun (63)",
    keyThemes: ["Leaving Trade for the Remembrance of Allah", "Do not let Wealth & Children Distract", "Purifying Intention"],
    days: [162, 163, 164, 165, 166, 167, 168]
  },
  {
    weekNumber: 25,
    quarter: 2,
    category: 'stories_wisdom',
    title: {
      en: "Week 25: Surah As-Sajdah & Al-Insan — Prostration & Gratitude",
      ar: "الأسبوع 25: السجدة والإنسان — فضل صلاة الفجر وسجود التلاوة وجزاء الأبرار",
      am: "ሳምንት 25፡ ሱረቱ ሰጅዳህ እና ኢንሳን — ስግደት እና ምስጋና"
    },
    surahFocus: "Surah As-Sajdah (32) & Al-Insan (76)",
    keyThemes: ["Sunnah of Friday Fajr Recitation", "Their sides forsake their beds in prayer", "Feeding the needy for Allah's Love"],
    days: [169, 170, 171, 172, 173, 174, 175]
  },
  {
    weekNumber: 26,
    quarter: 2,
    category: 'stories_wisdom',
    title: {
      en: "Week 26: Surah At-Tahrim & At-Talaq — Family Sanctity & Trust in Allah",
      ar: "الأسبوع 26: التحريم والطلاق — التوكل على الله وحفظ البيوت والتوبة النصوح",
      am: "ሳምንት 26፡ ሱረቱ ተሕሪም እና ጠላቅ — በቤተሰብ ውስጥ አላህን መፍራት"
    },
    surahFocus: "Surah At-Tahrim (66) & At-Talaq (65)",
    keyThemes: ["Whoever fears Allah, He makes a way out", "Sincere Repentance (Tawbatan Nasuha)", "The Exemplary Faith of Asiya"],
    days: [176, 177, 178, 179, 180, 181, 182]
  },

  // Quarter 3: Spiritual Light & Character
  {
    weekNumber: 27,
    quarter: 3,
    category: 'spiritual_light',
    title: {
      en: "Week 27: Surah Maryam — Whispered Dua & Miraculous Mercy (Part 1)",
      ar: "الأسبوع 27: سورة مريم — دعاء الخفاء ورحمة زكريا ومولد عيسى",
      am: "ሳምንት 27፡ ሱረቱ መርየም — የዘከሪያ ዱዓእ እና የዒሳ ልደት"
    },
    surahFocus: "Surah Maryam (19:1–40)",
    keyThemes: ["Calling the Lord in secret softness", "Chastity of Maryam", "Isa ibn Maryam as a Sign of Mercy"],
    days: [183, 184, 185, 186, 187, 188, 189]
  },
  {
    weekNumber: 28,
    quarter: 3,
    category: 'spiritual_light',
    title: {
      en: "Week 28: Surah Maryam — Ibrahim's Gentle Da'wah & Prophetic Heritage (Part 2)",
      ar: "الأسبوع 28: سورة مريم — بر إبراهيم بأبيه وميراث النبوة وسجود البكاء",
      am: "ሳምንት 28፡ ሱረቱ መርየም — የኢብራሂም ጥሪ"
    },
    surahFocus: "Surah Maryam (19:41–98)",
    keyThemes: ["Gentleness with Parents", "When Verses were recited they fell weeping in Sajdah", "Ar-Rahman will grant Love"],
    days: [190, 191, 192, 193, 194, 195, 196]
  },
  {
    weekNumber: 29,
    quarter: 3,
    category: 'spiritual_light',
    title: {
      en: "Week 29: Surah Ta-Ha — The Sacred Valley of Tuwa & Musa's Staff",
      ar: "الأسبوع 29: سورة طه — الوادي المقدس طوى ورسالة موسى: رب اشرح لي صدري",
      am: "ሳምንት 29፡ ሱረቱ ጣሀ — የተቀደሰው የጡዋ ሸለቆ"
    },
    surahFocus: "Surah Ta-Ha (20:1–76)",
    keyThemes: ["We did not send down the Quran that you be distressed", "Rabbi Ishrah li Sadri", "Facing Pharaoh without fear"],
    days: [197, 198, 199, 200, 201, 202, 203]
  },
  {
    weekNumber: 30,
    quarter: 3,
    category: 'spiritual_light',
    title: {
      en: "Week 30: Surah Ta-Ha — The Grace of Remembrance & The Golden Calf",
      ar: "الأسبوع 30: سورة طه — ذكر الله وعاقبة الإعراض عن الذكر",
      am: "ሳምንት 30፡ ሱረቱ ጣሀ — የአላህ ዝክር ዋጋ"
    },
    surahFocus: "Surah Ta-Ha (20:77–135)",
    keyThemes: ["Whoever turns away from My Remembrance will have a depressed life", "Enjoining prayer on family", "Patience at dawn and dusk"],
    days: [204, 205, 206, 207, 208, 209, 210]
  },
  {
    weekNumber: 31,
    quarter: 3,
    category: 'spiritual_light',
    title: {
      en: "Week 31: Surah Al-Anbiya — Duas of the Prophets in Extreme Hardship",
      ar: "الأسبوع 31: سورة الأنبياء — دعوات الأنبياء في الشدائد: أيوب، يونس، وزكريا",
      am: "ሳምንት 31፡ ሱረቱል አንቢያእ — በችግር ጊዜ የነቢያት ዱዓዎች"
    },
    surahFocus: "Surah Al-Anbiya (21:51–112)",
    keyThemes: ["La ilaha illa Anta Subhanaka (Yunus in the Whale)", "Ayyub's Patience in Illness", "Sent only as a Mercy to the Worlds"],
    days: [211, 212, 213, 214, 215, 216, 217]
  },
  {
    weekNumber: 32,
    quarter: 3,
    category: 'spiritual_light',
    title: {
      en: "Week 32: Surah An-Nur — The Verse of Light (Ayatun Nur)",
      ar: "الأسبوع 32: سورة النور — آية النور: الله نور السماوات والأرض وعمارة المساجد",
      am: "ሳምንት 32፡ ሱረቱ አን-ኑር — የብርሃን አንቀጽ"
    },
    surahFocus: "Surah An-Nur (24:35–46)",
    keyThemes: ["The Similitude of His Light as a Niche with a Lamp", "Men who are not distracted by commerce from Dhikr", "Deep Sea Darkness vs Light"],
    days: [218, 219, 220, 221, 222, 223, 224]
  },
  {
    weekNumber: 33,
    quarter: 3,
    category: 'spiritual_light',
    title: {
      en: "Week 33: Surah An-Nur — Modesty, Social Ethics & Chastity",
      ar: "الأسبوع 33: سورة النور — غض البصر، حفظ الفروج، وبر الحجاب والبيوت",
      am: "ሳምንት 33፡ ሱረቱ አን-ኑር — አይንን መከልከል እና ስነ-ምግባር"
    },
    surahFocus: "Surah An-Nur (24:1–34)",
    keyThemes: ["Lowering the Gaze", "Etiquette of Entering Homes", "Purity of Heart and Speech"],
    days: [225, 226, 227, 228, 229, 230, 231]
  },
  {
    weekNumber: 34,
    quarter: 3,
    category: 'spiritual_light',
    title: {
      en: "Week 34: Surah Al-Furqan — The Qualities of the Servants of Ar-Rahman",
      ar: "الأسبوع 34: سورة الفرقان — صفات عباد الرحمن الذين يمشون على الأرض هوناً",
      am: "ሳምንት 34፡ ሱረቱል ፉርቃን — የኢባዱር-ራሕማን ባህሪያት"
    },
    surahFocus: "Surah Al-Furqan (25:63–77)",
    keyThemes: ["Walking upon the earth with humility", "Spending nights in prostration and standing", "Supplication for Righteous Families"],
    days: [232, 233, 234, 235, 236, 237, 238]
  },
  {
    weekNumber: 35,
    quarter: 3,
    category: 'spiritual_light',
    title: {
      en: "Week 35: Surah Luqman — Fatherly Wisdom & Gratitude",
      ar: "الأسبوع 35: سورة لقمان — وصايا لقمان لابنه في التوحيد والأخلاق وبر الوالدين",
      am: "ሳምንት 35፡ ሱረቱ ሉቅማን — የአባት ምክር"
    },
    surahFocus: "Surah Luqman (31:12–19)",
    keyThemes: ["Do not associate partners with Allah", "Kindness to Mother and Father", "Establishing Prayer, Commanding Good, Lowering Voice"],
    days: [239, 240, 241, 242, 243, 244, 245]
  },
  {
    weekNumber: 36,
    quarter: 3,
    category: 'spiritual_light',
    title: {
      en: "Week 36: Surah Al-Hujurat — The Code of Islamic Brotherhood & Manners",
      ar: "الأسبوع 36: سورة الحجرات — ميثاق الأخوة والآداب الرفيعة: يا أيها الذين آمنوا",
      am: "ሳምንት 36፡ ሱረቱል ሁጁራት — የወንድማማችነት መመሪያ"
    },
    surahFocus: "Surah Al-Hujurat (49:1–18)",
    keyThemes: ["Verification of News", "Reconciliation between Brothers", "Prohibition of Backbiting, Sarcasm, and Suspicion"],
    days: [246, 247, 248, 249, 250, 251, 252]
  },
  {
    weekNumber: 37,
    quarter: 3,
    category: 'spiritual_light',
    title: {
      en: "Week 37: Surah Qaf — The Closeness of Allah to Human Soul",
      ar: "الأسبوع 37: سورة ق — قرب الله من العبد: أقرب إليه من حبل الوريد",
      am: "ሳምንት 37፡ ሱረቱ ቃፍ — የአላህ ቅርበት"
    },
    surahFocus: "Surah Qaf (50:1–45)",
    keyThemes: ["We are closer to him than his jugular vein", "The Recording Angels on Right and Left", "Glorification before Sunrise and Sunset"],
    days: [253, 254, 255, 256, 257, 258, 259]
  },
  {
    weekNumber: 38,
    quarter: 3,
    category: 'spiritual_light',
    title: {
      en: "Week 38: Surah Adh-Dhariyat & At-Tur — The Purpose of Creation",
      ar: "الأسبوع 38: الذاريات والطور — وما خلقت الجن والإنس إلا ليعبدون وسحر الفجر",
      am: "ሳምንት 38፡ ዛሪያት እና ጡር — የፍጥረት ዓላማ"
    },
    surahFocus: "Surah Adh-Dhariyat (51) & At-Tur (52)",
    keyThemes: ["I did not create Jinn and Mankind except to Worship Me", "Seeking Forgiveness at Dawn (Sahar)", "Divine Assurance"],
    days: [260, 261, 262, 263, 264, 265, 266]
  },
  {
    weekNumber: 39,
    quarter: 3,
    category: 'spiritual_light',
    title: {
      en: "Week 39: Surah An-Najm — The Ascension & Vision of Sidrat al-Muntaha",
      ar: "الأسبوع 39: سورة النجم — المعراج وسدرة المنتهى ومقام القرب",
      am: "ሳምንት 39፡ ሱረቱ አን-ነጅም — ሚዕራጅ እና ሲድረቱል ሙንተሃ"
    },
    surahFocus: "Surah An-Najm (53:1–62)",
    keyThemes: ["He does not speak of his own desire", "The Lote Tree of the Utmost Boundary", "And to your Lord is the final return"],
    days: [267, 268, 269, 270, 271, 272, 273]
  },

  // Quarter 4: Comprehensive Mastery & Khatam
  {
    weekNumber: 40,
    quarter: 4,
    category: 'mastery_khatam',
    title: {
      en: "Week 40: Surah Al-Baqarah — The Guidance for the Muttaqeen (Part 1)",
      ar: "الأسبوع 40: سورة البقرة — هدى للمتقين ومثل الإيمان والنفاق",
      am: "ሳምንት 40፡ ሱረቱል በቀራህ — ለፈሪዎች መመሪያ (ክፍል 1)"
    },
    surahFocus: "Surah Al-Baqarah (2:1–39)",
    keyThemes: ["Belief in the Unseen (Ghayb)", "Story of Adam and the Angels", "Call to Worship the Creator"],
    days: [274, 275, 276, 277, 278, 279, 280]
  },
  {
    weekNumber: 41,
    quarter: 4,
    category: 'mastery_khatam',
    title: {
      en: "Week 41: Surah Al-Baqarah — Ibrahim & The Building of the Ka'bah (Part 2)",
      ar: "الأسبوع 41: سورة البقرة — إبراهيم وإسماعيل ورفع قواعد البيت الحرام",
      am: "ሳምንት 41፡ ሱረቱል በቀራህ — ካዕባን መገንባት"
    },
    surahFocus: "Surah Al-Baqarah (2:124–152)",
    keyThemes: ["Rabbana Taqabbal Minna", "The Middle Nation (Ummatan Wasatan)", "Turn your face toward the Sacred Mosque"],
    days: [281, 282, 283, 284, 285, 286, 287]
  },
  {
    weekNumber: 42,
    quarter: 4,
    category: 'mastery_khatam',
    title: {
      en: "Week 42: Surah Al-Baqarah — Ramadan, Fasting & Closeness in Dua (Part 3)",
      ar: "الأسبوع 42: سورة البقرة — آيات الصيام وشهر رمضان: وإذا سألك عبادي عني",
      am: "ሳምንት 42፡ ሱረቱል በቀራህ — የረመዳን ጾም እና ዱዓእ"
    },
    surahFocus: "Surah Al-Baqarah (2:183–187)",
    keyThemes: ["Prescription of Sawm", "When My servants ask you concerning Me, I am near", "Seeking the Month of Quran"],
    days: [288, 289, 290, 291, 292, 293, 294]
  },
  {
    weekNumber: 43,
    quarter: 4,
    category: 'mastery_khatam',
    title: {
      en: "Week 43: Surah Al-Baqarah — Charity, Financial Ethics & Riba (Part 4)",
      ar: "الأسبوع 43: سورة البقرة — آيات الإنفاق ومثل حبة القمح وتحريم الربا",
      am: "ሳምንት 43፡ ሱረቱል በቀራህ — ሰደቃ እና የገንዘብ ስነ-ምግባር"
    },
    surahFocus: "Surah Al-Baqarah (2:261–283)",
    keyThemes: ["Parable of the Grain growing seven ears", "Destroying Riba & Blessing Sadaqah", "The Longest Verse: The Debt Contract (Ayat ad-Dayn)"],
    days: [295, 296, 297, 298, 299, 300, 301]
  },
  {
    weekNumber: 44,
    quarter: 4,
    category: 'mastery_khatam',
    title: {
      en: "Week 44: Surah Ali 'Imran — Steadfastness & The Family of 'Imran (Part 1)",
      ar: "الأسبوع 44: سورة آل عمران — الثبات على الحق ودعاء الراسخين في العلم",
      am: "ሳምንት 44፡ ሱረቱ አሊ-ዒምራን — በእውነት ላይ መጽናት"
    },
    surahFocus: "Surah Ali 'Imran (3:1–32)",
    keyThemes: ["Rabbana La Tuzigh Qulubana (Do not let our hearts deviate)", "Devotion of the Mother of Maryam", "Love of Allah by following the Prophet ﷺ"],
    days: [302, 303, 304, 305, 306, 307, 308]
  },
  {
    weekNumber: 45,
    quarter: 4,
    category: 'mastery_khatam',
    title: {
      en: "Week 45: Surah Ali 'Imran — Holding Fast to the Rope of Allah (Part 2)",
      ar: "الأسبوع 45: سورة آل عمران — واعتصموا بحبل الله جميعاً وكنتم خير أمة",
      am: "ሳምንት 45፡ ሱረቱ አሊ-ዒምራን — የአላህን ገመድ አጥብቆ መያዝ"
    },
    surahFocus: "Surah Ali 'Imran (3:102–144)",
    keyThemes: ["Unity around the Quran", "Enjoining Good and Forbidding Evil", "Lessons of Uhud & Reliance on Allah"],
    days: [309, 310, 311, 312, 313, 314, 315]
  },
  {
    weekNumber: 46,
    quarter: 4,
    category: 'mastery_khatam',
    title: {
      en: "Week 46: Surah Ali 'Imran — Deep Night Reflection of Ulul Albab (Part 3)",
      ar: "الأسبوع 46: سورة آل عمران — تفكر أولي الألباب في خلق السماوات والأرض",
      am: "ሳምንት 46፡ ሱረቱ አሊ-ዒምራን — የማስተዋል ባለቤቶች ማሰላሰል"
    },
    surahFocus: "Surah Ali 'Imran (3:190–200)",
    keyThemes: ["Rabbana Ma Khalaqta Hadha Batila", "The Prophet's Night Tears over these 10 Verses", "Patience and Guarding the Frontiers (Rabitū)"],
    days: [316, 317, 318, 319, 320, 321, 322]
  },
  {
    weekNumber: 47,
    quarter: 4,
    category: 'mastery_khatam',
    title: {
      en: "Week 47: Surah An-Nisa' — Justice, The Rights of Orphans & The Weak",
      ar: "الأسبوع 47: سورة النساء — ميزان العدالة ورعاية اليتامى والمستضعفين",
      am: "ሳምንት 47፡ ሱረቱ አን-ኒሳእ — ፍትህ እና የደካሞች መብት"
    },
    surahFocus: "Surah An-Nisa' (4:1–36)",
    keyThemes: ["Fear Allah through whom you demand mutual rights", "Custodianship of Orphan Wealth", "Fair Treatment in Marriage"],
    days: [323, 324, 325, 326, 327, 328, 329]
  },
  {
    weekNumber: 48,
    quarter: 4,
    category: 'mastery_khatam',
    title: {
      en: "Week 48: Surah An-Nisa' — Stand Firm for Absolute Justice",
      ar: "الأسبوع 48: سورة النساء — كونوا قوامين بالقسط شهداء لله ولو على أنفسكم",
      am: "ሳምንት 48፡ ሱረቱ አን-ኒሳእ — በፍትህ ላይ መቆም"
    },
    surahFocus: "Surah An-Nisa' (4:135–176)",
    keyThemes: ["Stand firmly for justice even against yourselves or parents", "Proof and Clear Light sent by Allah", "Pardon and Mercy"],
    days: [330, 331, 332, 333, 334, 335, 336]
  },
  {
    weekNumber: 49,
    quarter: 4,
    category: 'mastery_khatam',
    title: {
      en: "Week 49: Surah Al-Ma'idah — Fulfilling Covenants & Perfection of Religion",
      ar: "الأسبوع 49: سورة المائدة — الوفاء بالعقود: اليوم أكملت لكم دينكم",
      am: "ሳምንት 49፡ ሱረቱል ማኢዳህ — ቃል ኪዳንን ማሟላት"
    },
    surahFocus: "Surah Al-Ma'idah (5:1–48)",
    keyThemes: ["Cooperate in Righteousness & Taqwa", "This day I have perfected for you your religion", "Judging by what Allah has revealed"],
    days: [337, 338, 339, 340, 341, 342, 343]
  },
  {
    weekNumber: 50,
    quarter: 4,
    category: 'mastery_khatam',
    title: {
      en: "Week 50: Surah Al-An'am — Monotheism, Signs of Nature & The Sacred Ten Commandments",
      ar: "الأسبوع 50: سورة الأنعام — التوحيد الخالص والوصايا العشر المحكمات",
      am: "ሳምንት 50፡ ሱረቱል አንዓም — ተውሂድ እና 10ቱ ታላላቅ ትዕዛዛት"
    },
    surahFocus: "Surah Al-An'am (6:151–165)",
    keyThemes: ["Say: Come, I will recite what your Lord has forbidden to you", "My Prayer, my Sacrifice, my Life and my Death belong to Allah", "The Straight Path"],
    days: [344, 345, 346, 347, 348, 349, 350]
  },
  {
    weekNumber: 51,
    quarter: 4,
    category: 'mastery_khatam',
    title: {
      en: "Week 51: Surah At-Tawbah & An-Nasr — The Grand Repentance & Divine Triumph",
      ar: "الأسبوع 51: سورة التوبة والنصر — التوبة النصوح، لقد جاءكم رسول من أنفسكم",
      am: "ሳምንት 51፡ ተውባህ እና ነስር — ታላቁ ንስሃ እና ድል"
    },
    surahFocus: "Surah At-Tawbah (9:128–129) & Surah An-Nasr (110)",
    keyThemes: ["There has come to you a Messenger from among yourselves", "Hasbiyallahu la ilaha illa Huwa", "Praising Allah and seeking Forgiveness in Victory"],
    days: [351, 352, 353, 354, 355, 356, 357]
  },
  {
    weekNumber: 52,
    quarter: 4,
    category: 'mastery_khatam',
    title: {
      en: "Week 52: Grand Khatam-ul-Quran Synthesis & Life-Long Covenant",
      ar: "الأسبوع 52: الختم المبارك لكتاب الله والعهد مع القرآن مدى الحياة",
      am: "ሳምንት 52፡ ታላቁ የቁርአን ኻቲማህ — የህይወት ዘመን ቃል ኪዳን"
    },
    surahFocus: "Khatam-ul-Quran • Duas of Completion • Synthesis of 30 Juz",
    keyThemes: ["Supplication of Quran Completion", "Illumination of Heart, Light of Grave, Guide to Jannah", "Committing to the Second Year of Mastery"],
    days: [358, 359, 360, 361, 362, 363, 364, 365]
  }
];

// High-fidelity specific curated lessons for key anchor days
export const ANCHOR_DAY_LESSONS: Record<number, DayLesson> = {
  1: {
    dayNumber: 1,
    weekNumber: 1,
    quarter: 1,
    category: 'foundations',
    surahNumber: 1,
    surahName: {
      en: "Al-Fatiha",
      ar: "الفاتحة",
      am: "አል-ፋቲሃ"
    },
    verseRange: "1–4",
    verseNumbers: [1, 2, 3, 4],
    title: {
      en: "Day 1: The Gates of Praise & Divine Mercy",
      ar: "اليوم 1: مفاتيح الحمد والرحمة الإلهية",
      am: "ቀን 1፡ የምስጋና እና የአላህ እዝነት መክፈቻ",
      har: "ቀን 1፡ የምስጋናዋ የረሕመት መክፈቻ"
    },
    subtitle: {
      en: "Surah Al-Fatiha 1:1–4 • 5 Min Recitation | 10 Min Vocabulary & Tafsir | 5 Min Reflection",
      ar: "الفاتحة 1:1–4 • ٥ د تلاوة | ١٠ د فهم ومفردات | ٥ د تدبر ودعاء"
    },
    recitation: {
      arabicText: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ۝١ ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ ۝٢ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ۝٣ مَـٰلِكِ يَوْمِ ٱلدِّينِ ۝٤",
      transliteration: "Bismillaahir-Rahmaanir-Raheem (1) Al-hamdu lillaahi Rabbil-'aalameen (2) Ar-Rahmaanir-Raheem (3) Maaliki Yawmid-Deen (4)",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001001.mp3",
      recommendedReciterId: "mishary",
      tajweedFocus: {
        ruleName: {
          en: "Madd 'Arid Lis-Sukoon (Temporary Lengthening)",
          ar: "المد العارض للسكون"
        },
        description: {
          en: "When a vowel letter is followed by a letter made silent due to stopping at the end of an Ayah (e.g. Ar-Raheem, Al-'Aalameen), prolong 2, 4, or 6 vowel counts.",
          ar: "هو أن يقع بعد حرف المد حرف ساكن سكوناً عارضاً لأجل الوقف، ويجوز فيه القصر (حركتان)، والتوسط (٤ حركات)، والإشباع (٦ حركات)."
        },
        exampleVerseKey: "الرَّحِيمِ / الْعَالَمِينَ",
        audioExampleWord: "الرَّحِيمِ",
        practicalTip: {
          en: "Keep your stopping length consistent throughout your recitation for maximum melodic beauty.",
          ar: "احرص على توحيد مقدار المد العارض في جميع نهايات الآيات عند القراءة لتحقيق الاتساق الصوتي."
        }
      }
    },
    understanding: {
      translation: {
        en: "In the Name of Allah, the Entirely Merciful, the Especially Merciful. [All] praise is [due] to Allah, Lord of the worlds. The Entirely Merciful, the Especially Merciful. Sovereign of the Day of Recompense.",
        ar: "بسم الله الرحمن الرحيم. الحمد لله رب العالمين. الرحمن الرحيم. مالك يوم الدين.",
        am: "በአላህ ስም እጅግ በጣም ሩኅሩህ በጣም አዛኝ በሆነው። ምስጋና ለአላህ ይገባው የዓለማት ጌታ ለሆነው። እጅግ በጣም ሩኅሩህ በጣም አዛኝ ለሆነው። የፍርዱ ቀን ባለቤት ለሆነው።",
        har: "በአላህ ስም እጅግ ሩሕሩሕ በጣም አዛኝ በሆነው። ምስጋና ሁሉ ለአላህ ይገባል የዓለማት ጌታ። እጅግ ሩሕሩሕ በጣም አዛኝ። የፍርድ ቀን ባለቤት።"
      },
      vocabulary: [
        {
          word: "Al-Hamd",
          arabic: "الْحَمْدُ",
          root: "ح-م-د (H-M-D)",
          transliteration: "Al-Hamd",
          meaning: {
            en: "Comprehensive praise with love, reverence, and utmost gratitude for both His intrinsic perfection and His blessings.",
            ar: "الثناء بالجميل على وجه التعظيم والمحبة مع استحقاق المحمود لكافة الكمالات والإنعام.",
            am: "ፍጹም የሆነ ምስጋና በፍቅርና በክብር",
            har: "ምስጋና በሙሉ ፍቅርና ክብር"
          },
          occurrencesInQuran: 68
        },
        {
          word: "Rabb",
          arabic: "رَبِّ",
          root: "ر-ب-ب (R-B-B)",
          transliteration: "Rabb",
          meaning: {
            en: "The Master, Creator, Nurturer, Sustainer, and Caregiver who guides all creation step-by-step toward completion.",
            ar: "السيد المالك، الخالق المربي لعباده بنعمه، المصلح لأحوالهم خطوة بخطوة.",
            am: "ጌታ፣ አስተዳዳሪ፣ አሳዳጊ እና ጠባቂ",
            har: "ጌታ፣ አሳዳጊዋ ጠባቂ"
          },
          occurrencesInQuran: 975
        },
        {
          word: "Ar-Rahman",
          arabic: "الرَّحْمَٰنِ",
          root: "ر-ح-م (R-H-M)",
          transliteration: "Ar-Rahmaan",
          meaning: {
            en: "The Possessor of Vast, Universal Mercy encompassing every creature in the universe.",
            ar: "ذو الرحمة الواسعة الشاملة لجميع الخلائق في الدنيا.",
            am: "እጅግ ሰፊ እዝነት ያለው",
            har: "ሰፊ ራሕማት ያለው"
          },
          occurrencesInQuran: 57
        },
        {
          word: "Malik",
          arabic: "مَالِكِ",
          root: "م-ل-ك (M-L-K)",
          transliteration: "Maalik",
          meaning: {
            en: "The Absolute Sovereign and Supreme Master on the Day when all worldly illusions of ownership vanish.",
            ar: "المالك المتصرف المطلق يوم ينادي: لمن الملك اليوم؟ لله الواحد القهار.",
            am: "ፍጹም ባለቤት እና ገዢ",
            har: "ፍጹም ንጉስዋ ባለቤት"
          },
          occurrencesInQuran: 13
        }
      ],
      tafsirSummary: {
        en: "Al-Fatiha opens with the profound pairing of Absolute Praise (Al-Hamd) and Universal Nurturing (Rububiyyah). Allah reassures our hearts immediately: the Sovereign Master of all cosmic existence is, first and foremost, Ar-Rahman and Ar-Raheem (Boundless in Mercy). When we remember that this loving Creator also holds the Day of Recompense, our hearts balance healthy reverence with tranquil hope.",
        ar: "تبدأ فاتحة الكتاب بإثبات الحمد المطلق لله مقروناً بربوبيته الشاملة لكافة الأكوان، ثم يعقبها بالصفتين العظيمتين: الرحمن الرحيم، ليعلم العبد أن سيده ومربيه رحيم ودود، فإذا تذكر أنه مالك يوم الدين اجتمع في قلبه جناحان متوازنان: الرجاء في رحمته والخوف من حسابه."
      },
      thematicContext: {
        en: "Revealed in Makkah as a complete foundation of theology (Aqeedah), worship ('Ibadah), and world view. In authentic Hadith Qudsi, Allah says: 'I have divided the prayer between Myself and My servant into two halves... When he says: Alhamdu lillahi Rabbil-Alameen, Allah says: My servant has praised Me.'",
        ar: "مكية، وتسمى أم القرآن والسبع المثاني. وفي الحديث القدسي الصحيح: «قسمت الصلاة بيني وبين عبدي نصفين ولعبدي ما سأل، فإذا قال العبد: الحمد لله رب العالمين، قال الله: حمدني عبدي...»."
      }
    },
    reflection: {
      reflectionPrompt: {
        en: "How does knowing that Allah is 'Ar-Rahman' (All-Merciful) BEFORE being 'Malik Yawm ad-Deen' (Master of the Day of Judgment) change your inner posture when you make mistakes?",
        ar: "كيف يؤثر تقديم صفتي 'الرحمن الرحيم' قبل 'مالك يوم الدين' على حال قلبك ويقينك برحمة ربك حين تزل قدمك؟",
        am: "አላህ የፍርድ ቀን ባለቤት ከመሆኑ በፊት እጅግ በጣም አዛኝ መሆኑን ማወቅ ስህተት ስንሰራ ውስጣችንን እንዴት ያረጋጋዋል?"
      },
      dailyActionCommitment: {
        en: "Pause intentionally during the opening recitation of Al-Fatiha in your upcoming prayer, feeling each sentence answered by Allah.",
        ar: "التوقف بخشوع وتأنٍ عند قراءة كل آية من الفاتحة في صلاتك القادمة واستشعار جواب الله تعالى لك في الحديث القدسي."
      },
      quranicDua: {
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        transliteration: "Rabbana aatina fid-dunya hasanatan wa fil-aakhirati hasanatan wa qina 'adhaban-nar",
        translation: {
          en: "Our Lord, give us in this world that which is good and in the Hereafter that which is good and protect us from the punishment of the Fire.",
          ar: "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار (البقرة ٢٠١)."
        },
        reference: "Surah Al-Baqarah 2:201"
      },
      retentionQuiz: {
        question: {
          en: "What is the primary spiritual meaning of 'Rabbil-'Aalameen'?",
          ar: "ما هو المعنى الإيماني الأعمق لقوله تعالى 'رَبِّ الْعَالَمِينَ'؟"
        },
        options: [
          {
            text: {
              en: "The Nurturer, Sustainer, and Caregiver who guides all creation step-by-step toward perfection",
              ar: "المربي لخلقه بنعمه والمدبر لأمورهم والمصلح لأحوالهم خطوة بخطوة"
            },
            isCorrect: true,
            explanation: {
              en: "Correct! The root R-B-B conveys gradual, loving nurture and complete sovereignty.",
              ar: "إجابة صحيحة! فالرب مشتق من التربية، وهو الذي يربي عباده بلطفه وعطاياه."
            }
          },
          {
            text: {
              en: "Only the King of angels",
              ar: "ملك الملائكة فقط"
            },
            isCorrect: false,
            explanation: {
              en: "'Al-Aalameen' includes all worlds of creation — mankind, jinn, angels, nature, and the cosmos.",
              ar: "العالمين تشمل كل العوالم من إنس وجن وملائكة وأكوان."
            }
          },
          {
            text: {
              en: "A judge who only punishes",
              ar: "حاكم يعاقب فقط"
            },
            isCorrect: false,
            explanation: {
              en: "Incorrect; Allah pairs Rububiyyah immediately with Rahman and Raheem.",
              ar: "غير صحيح؛ فالله أتبع الربوبية بصفتي الرحمن الرحيم إعلاماً بسعة رحمته."
            }
          }
        ]
      }
    }
  },

  2: {
    dayNumber: 2,
    weekNumber: 1,
    quarter: 1,
    category: 'foundations',
    surahNumber: 1,
    surahName: {
      en: "Al-Fatiha",
      ar: "الفاتحة",
      am: "አል-ፋቲሃ"
    },
    verseRange: "5–7",
    verseNumbers: [5, 6, 7],
    title: {
      en: "Day 2: The Core Covenant — Exclusive Worship & The Straight Path",
      ar: "اليوم 2: عهد التوحيد والصراط المستقيم",
      am: "ቀን 2፡ የተውሂድ ቃል ኪዳን እና ቀጥተኛው መንገድ",
      har: "ቀን 2፡ የተውሂድ ቃልዋ ቀጥተኛው መንገድ"
    },
    subtitle: {
      en: "Surah Al-Fatiha 1:5–7 • 5 Min Recitation | 10 Min Vocabulary & Tafsir | 5 Min Reflection",
      ar: "الفاتحة 1:5–7 • ٥ د تلاوة | ١٠ د فهم ومفردات | ٥ د تدبر ودعاء"
    },
    recitation: {
      arabicText: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝٥ ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ ۝٦ صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ ۝٧",
      transliteration: "Iyyaaka na'budu wa iyyaaka nasta'een (5) Ihdinas-Siraatal-Mustaqeem (6) Siraatal-ladheena an'amta 'alayhim ghayril-maghdoobi 'alayhim wa lad-daaaalleen (7)",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001005.mp3",
      recommendedReciterId: "mishary",
      tajweedFocus: {
        ruleName: {
          en: "Madd Lazim Kalimi Muthaqqal (Compulsory Heavy Lengthening)",
          ar: "المد اللازم الكلمي المثقل"
        },
        description: {
          en: "In the word 'Ad-Daaalleen' (الضَّالِّينَ), the vowel Alif is followed by a shaddah on Lam. It MUST be prolonged for exactly 6 counts with a slight press (nabr).",
          ar: "هو أن يأتي بعد حرف المد حرف مشدد في كلمة واحدة، ومقداره ٦ حركات وجوباً، مع نبر على الحرف المشدد لتبيينه."
        },
        exampleVerseKey: "وَلَا الضَّالِّينَ",
        audioExampleWord: "الضَّالِّينَ",
        practicalTip: {
          en: "Count 6 steady beats on your fingers when reciting 'Ad-Daaalleen' to ensure full measure before resolving into the Lam.",
          ar: "اضبط مد كلمة 'الضَّالِّينَ' بست حركات تامة ثم ادخل في اللام المشددة بقوة ووضوح."
        }
      }
    },
    understanding: {
      translation: {
        en: "It is You we worship and You we ask for help. Guide us to the straight path - The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.",
        ar: "إياك نعبد وإياك نستعين. اهدنا الصراط المستقيم. صراط الذين أنعمت عليهم غير المغضوب عليهم ولا الضالين.",
        am: "አንተን ብቻ እንገዛለን፤ አንተንም ብቻ እርዳታን እንለምናለን። ቀጥተኛውን መንገድ ምራን። የእነዚያን በእነርሱ ላይ በጎ የዋልክላቸውን ሰዎች መንገድ፤ በእነርሱ ላይ የተቆጣህባቸው ያልሆኑትንና ያልተሳሳቱትንም።",
        har: "አንተን ብቻ እንገዛለን አንተንም ብቻ እርዳታ እንጠይቃለን። ቀጥተኛውን መንገድ ምራን። በእነርሱ ላይ ጸጋህን የለገስክላቸውን መንገድ።"
      },
      vocabulary: [
        {
          word: "Iyyaka",
          arabic: "إِيَّاكَ",
          root: "أ-ي-ي (Pronoun of Exclusivity)",
          transliteration: "Iyyaaka",
          meaning: {
            en: "To You ALONE — grammatically fronted to declare exclusivity: no one else shares this dedication.",
            ar: "ضمير نصب منفصل يفيد الحصر والقصر: أي لا نعبد غيرك ولا نستعين بسواك.",
            am: "ላንተ ብቻ (ልዩ የማድረጊያ ቃል)",
            har: "ላንተ ብቻ"
          },
          occurrencesInQuran: 2
        },
        {
          word: "Ihdina",
          arabic: "اهْدِنَا",
          root: "ه-د-ي (H-D-Y)",
          transliteration: "Ihdina",
          meaning: {
            en: "Guide us, show us, grant us clarity, keep us firm, and increase our navigation along the straight way.",
            ar: "أرشدنا، ووفقنا، وثبتنا، وزدنا هداية على صراطك الواضح المستقيم.",
            am: "ቀጥተኛውን መንገድ ምራን እና አጽናን",
            har: "ቀጥተኛውን መንገድ አሳየን"
          },
          occurrencesInQuran: 32
        },
        {
          word: "As-Sirat Al-Mustaqeem",
          arabic: "الصِّرَاطَ الْمُسْتَقِيمَ",
          root: "ص-ر-ط / ق-و-م",
          transliteration: "As-Siraat Al-Mustaqeem",
          meaning: {
            en: "The broad, level, unobstructed Highway of Truth without deviations, leading straight to Allah's Pleasure.",
            ar: "الطريق الواسع الواضح الذي لا اعوجاج فيه، الموصل إلى رضوان الله وجنته.",
            am: "ግልጽ እና ቀጥተኛ የሆነው የእውነት መንገድ",
            har: "ቀጥተኛው መንገድ"
          },
          occurrencesInQuran: 33
        }
      ],
      tafsirSummary: {
        en: "Ibn al-Qayyim wrote a 3-volume masterpiece ('Madarij as-Salikeen') entirely on 'Iyyaka Na'budu wa Iyyaka Nasta'een'. The first phrase cures ostentation (Riya') by purifying worship for Allah alone; the second phrase cures arrogance ('Ujb) by confessing that without Allah's aid, we cannot take a single breath or perform a single good deed. Then follows the greatest prayer in existence: guidance.",
        ar: "قال ابن القيم رحمه الله: أنزل الله مئة وأربعة كتب، جمع معانيها في التوراة والإنجيل والقرآن، وجمع معاني القرآن في المفصل، وجمع معاني المفصل في الفاتحة، وجمع معاني الفاتحة في 'إياك نعبد وإياك نستعين'. فالأولى تبرؤ من الشرك، والثانية تبرؤ من الحول والقوة."
      },
      thematicContext: {
        en: "Notice that 'Ihdina' is in the plural: 'Guide US'. A Muslim never walks this path in selfish isolation; we pray for our families, community, and the global Ummah to walk together upon the footsteps of the Prophets, truthful ones, martyrs, and the righteous.",
        ar: "صيغة الجمع 'اهدنا' تعلمنا روح الجماعة والأخوة الإيمانية، فأنت لا تسأل الهداية لنفسك وحدك بل لأسرتك وإخوانك وأمتك، لتسيروا جميعاً على درب الأنبياء والصديقين والشهداء والصالحين."
      }
    },
    reflection: {
      reflectionPrompt: {
        en: "When you face a challenging task today, do you rely first on your intellect and skills, or do you whisper 'Iyyaka Nasta'een' (In You alone we seek aid)?",
        ar: "حين تواجه صعوبة أو تحدياً اليوم، هل تهرع أولاً إلى حيلتك وقوتك، أم تهمس بقلبك: 'إياك نستعين' مستجلباً عون الله ومعيته؟",
        am: "አስቸጋሪ ጉዳይ ሲገጥመን መጀመሪያ የምንተማመነው በችሎታችን ነው ወይስ 'አንተን ብቻ እርዳታ እንለምናለን' በሚለው?"
      },
      dailyActionCommitment: {
        en: "Say 'La hawla wa la quwwata illa billah' 10 times with conscious realization of 'Iyyaka Nasta'een'.",
        ar: "ترديد 'لا حول ولا قوة إلا بالله' عشر مرات مع استشعار التبرؤ التام من حولك وقوتك إلى حول الله وقوته."
      },
      quranicDua: {
        arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ الْوَهَّابُ",
        transliteration: "Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana min ladunka rahmah, innaka antal-Wahhab",
        translation: {
          en: "Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy. Indeed, You are the Bestower.",
          ar: "ربنا لا تزغ قلوبنا بعد إذ هديتنا وهب لنا من لدنك رحمة إنك أنت الوهاب (آل عمران ٨)."
        },
        reference: "Surah Ali 'Imran 3:8"
      },
      retentionQuiz: {
        question: {
          en: "Why is 'Iyyaka' mentioned before the verb 'Na'budu'?",
          ar: "لماذا قُدّم المعمول 'إِيَّاكَ' على الفعل 'نَعْبُدُ'؟"
        },
        options: [
          {
            text: {
              en: "To denote strict exclusivity: 'You ALONE we worship'",
              ar: "لإفادة الحصر والقصر: أي نعبدك وحدك ولا نعبد سواك"
            },
            isCorrect: true,
            explanation: {
              en: "In Arabic grammar, fronting the object indicates Taqdeem lil-Hasr (exclusivity and primacy).",
              ar: "تقديم ما حقه التأخير يفيد الاهتمام والحصر، فلا يشرك مع الله أحد في العبادة."
            }
          },
          {
            text: {
              en: "Just for poetic rhyme",
              ar: "للسجع والقافية فقط"
            },
            isCorrect: false,
            explanation: {
              en: "Every letter in the Quran carries theological weight; it is not mere rhyme.",
              ar: "القرآن منزه عن مجرد السجع العفوي، وله دلالات عقدية وبلاغية رفيعة."
            }
          }
        ]
      }
    }
  },

  8: {
    dayNumber: 8,
    weekNumber: 2,
    quarter: 1,
    category: 'foundations',
    surahNumber: 112,
    surahName: {
      en: "Al-Ikhlas",
      ar: "الإخلاص",
      am: "አል-ኢኽላስ"
    },
    verseRange: "1–4",
    verseNumbers: [1, 2, 3, 4],
    title: {
      en: "Day 8: Surah Al-Ikhlas — One Third of the Quran",
      ar: "اليوم 8: سورة الإخلاص — ثلث القرآن وكمال التوحيد",
      am: "ቀን 8፡ ሱረቱል ኢኽላስ — የቁርአን አንድ ሦስተኛ",
      har: "ቀን 8፡ ሱረቱል ኢኽላስ — የተውሂድ ቁንጮ"
    },
    subtitle: {
      en: "Surah Al-Ikhlas 112:1–4 • 5 Min Recitation | 10 Min Vocabulary & Tafsir | 5 Min Reflection",
      ar: "الإخلاص 112:1–4 • ٥ د تلاوة | ١٠ د فهم ومفردات | ٥ د تدبر ودعاء"
    },
    recitation: {
      arabicText: "قُلْ هُوَ ٱللَّهُ أَحَدٌ ۝١ ٱللَّهُ ٱلصَّمَدُ ۝٢ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝٣ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ ۢ ۝٤",
      transliteration: "Qul Huwal-laahu Ahad (1) Allaahus-Samad (2) Lam yalid wa lam yoolad (3) Wa lam yakun lahoo kufuwan ahad (4)",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112001.mp3",
      recommendedReciterId: "mishary",
      tajweedFocus: {
        ruleName: {
          en: "Qalqalah Kubra (Major Echoing Bounce upon Stopping)",
          ar: "القلقلة الكبرى عند الوقف"
        },
        description: {
          en: "The letter Dal (د) is one of the 5 Qalqalah letters (ق، ط، ب، ج، د). When stopping at the end of every Ayah ('Ahad', 'As-Samad', 'Lam Yoolad', 'Ahad'), release the sound with a crisp, resonant bounce without adding a vowel.",
          ar: "حرف الدال من حروف 'قطب جد'. عند الوقف على رؤوس آيات الإخلاص يجب إبراز القلقلة باهتزاز مخرج الحرف بوضوح وجلاء."
        },
        exampleVerseKey: "أَحَدٌ / الصَّمَدُ",
        audioExampleWord: "أَحَدٌ",
        practicalTip: {
          en: "Never swallow the Dal at the end of the verse. Let it ring like a pure bell strike.",
          ar: "لا تكتم صوت الدال عند الوقف، بل دعه يرتد ارتداداً رناناً لطيفاً."
        }
      }
    },
    understanding: {
      translation: {
        en: "Say, 'He is Allah, [who is] One. Allah, the Eternal Refuge. He neither begets nor is born, Nor is there to Him any equivalent.'",
        ar: "قل هو الله أحد. الله الصمد. لم يلد ولم يولد. ولم يكن له كفوا أحد.",
        am: "በል፡- «እርሱ አላህ አንድ ነው፤ አላህ (የሁሉ) መጠጊያ ነው፤ አልወለደም፤ አልተወለደምም፤ ለእርሱም አንድም አምሳያ የለውም።»",
        har: "በል፡- እርሱ አላህ አንድ ነው። አላህ የሁሉ መጠጊያ ነው። አልወለደም አልተወለደምም። ለእርሱም አምሳያ የለውም።"
      },
      vocabulary: [
        {
          word: "Ahad",
          arabic: "أَحَدٌ",
          root: "أ-ح-د (A-H-D)",
          transliteration: "Ahad",
          meaning: {
            en: "Indivisible, peerless Singular One who has no second, no parts, and no parallel.",
            ar: "الواحد الأحد الذي لا يتجزأ ولا شبيه له ولا نظير في ذاته وصفاته وأفعاله.",
            am: "አንድና አቻ የሌለው ብቸኛ",
            har: "አንድና አቻ የሌለው"
          },
          occurrencesInQuran: 85
        },
        {
          word: "As-Samad",
          arabic: "الصَّمَدُ",
          root: "ص-م-د (S-M-D)",
          transliteration: "As-Samad",
          meaning: {
            en: "The Self-Sufficient Master to whom all creation turns in times of need, while He needs nothing and no one.",
            ar: "السيد الذي تصمد إليه الخلائق في حوائجها ورغائبها، الغني عن كل ما سواه.",
            am: "የሁሉ ፍጥረት መጠጊያ፣ በምንም የማይፈልግ",
            har: "የሁሉ መጠጊያ"
          },
          occurrencesInQuran: 1
        },
        {
          word: "Kufuwan",
          arabic: "كُفُوًا",
          root: "ك-ف-أ (K-F-A)",
          transliteration: "Kufuwan",
          meaning: {
            en: "Equal, peer, counterpart, match, or co-equal in any dimension.",
            ar: "المكافئ والند والنظير والمثيل.",
            am: "አምሳያ፣ እኩያ፣ ተፎካካሪ",
            har: "አምሳያ"
          },
          occurrencesInQuran: 1
        }
      ],
      tafsirSummary: {
        en: "The Prophet ﷺ equated Surah Al-Ikhlas to one-third of the entire Quran because the Quran addresses three grand subjects: Divine Theology (Tawheed), Stories & History, and Legal Commandments (Ahkam). Al-Ikhlas is the absolute distillation of Pure Monotheism. When you love Al-Ikhlas, as the Sahabi said in Quba, 'Your love for it will admit you into Paradise.'",
        ar: "تعدل ثلث القرآن لأن القرآن نزل على ثلاثة أقسام: توحيد وأحكام وقصص، وهذه السورة تمحضت للتوحيد وتنزيه الله عن النقص والصاحبة والولد والشريك. وفي الحديث: «حبك إياها أدخلك الجنة»."
      },
      thematicContext: {
        en: "The polytheists came to the Prophet ﷺ asking: 'Describe your Lord's lineage to us!' In response, Allah revealed this 4-verse monument, shattering every form of anthropomorphism, idolatry, and theological deviation.",
        ar: "سبب نزولها أن المشركين قالوا لرسول الله ﷺ: انسب لنا ربك! فأنزل الله هذه السورة الحاسمة التي قطعت دابر كل تشبيه أو تجسيم أو شرك."
      }
    },
    reflection: {
      reflectionPrompt: {
        en: "When difficulties press on your life, do you direct your heartfelt distress first to people (who are fragile), or do you remember that Allah is 'As-Samad' — the One to whom all hearts must turn?",
        ar: "إذا نزلت بك حاجة، هل تبدأ بالشكوى للمخلوقين الضعفاء، أم تفزع إلى 'الصمد' الذي تصمد إليه القلوب وتقصده الكائنات في كل أمر؟",
        am: "ችግር ሲገጥመን መጀመሪያ የምንማፀነው ደካማ ሰዎችን ነው ወይስ የሁሉ ፍጥረት መጠጊያ የሆነውን 'አስ-ሰመድ'?"
      },
      dailyActionCommitment: {
        en: "Recite Surah Al-Ikhlas, Al-Falaq, and An-Nas three times before sleeping, blowing into your hands and wiping your head and body.",
        ar: "تطبيق سنة النبي ﷺ قبل النوم بقراءة المعوذات والإخلاص ثلاثاً والنفث في الكفين ومسح ما استطعت من جسدك."
      },
      quranicDua: {
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ بِأَنِّي أَشْهَدُ أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ الْأَحَدُ الصَّمَدُ الَّذِي لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
        transliteration: "Allahumma inni as'aluka bi-anni ash-hadu annaka Antallah, la ilaha illa Anta, Al-Ahadus-Samad, alladhi lam yalid wa lam yoolad, wa lam yakun lahu kufuwan ahad",
        translation: {
          en: "O Allah, I ask You by my testimony that You are Allah, there is no deity except You, the One, the Eternal Refuge, who neither begets nor is born, and to whom there is no equal.",
          ar: "دعاء الاسم الأعظم المأثور عن النبي ﷺ الذي إذا دُعي به أجاب وإذا سُئل به أعطى."
        },
        reference: "Sunan Abi Dawud & Tirmidhi (Authentic)"
      },
      retentionQuiz: {
        question: {
          en: "Why is Surah Al-Ikhlas equivalent to one-third of the Quran?",
          ar: "لماذا تعدل سورة الإخلاص ثلث القرآن الكريم؟"
        },
        options: [
          {
            text: {
              en: "Because the Quran is divided into 3 pillars (Tawheed, Laws, Stories) and this Surah encapsulates Tawheed",
              ar: "لأن القرآن ينقسم إلى توحيد وأحكام وقصص، وقد استوعبت السورة عقيدة التوحيد كاملة"
            },
            isCorrect: true,
            explanation: {
              en: "Classical scholars, including Al-Ghazali and Ibn Taymiyyah, noted this 3-fold thematic balance.",
              ar: "بين أئمة الإسلام أن هذا التفضيل يعود إلى استيعابها التام لمبحث التوحيد والصفات الإلهية."
            }
          },
          {
            text: {
              en: "Because it has one third of the words of Al-Fatiha",
              ar: "لأن عدد كلماتها ثلث الفاتحة"
            },
            isCorrect: false,
            explanation: {
              en: "It is based on meaning and thematic magnitude, not word count.",
              ar: "الفضل راجع إلى موضوعها الإيماني العظيم وليس لعدد الكلمات."
            }
          }
        ]
      }
    }
  },

  92: {
    dayNumber: 92,
    weekNumber: 14,
    quarter: 2,
    category: 'stories_wisdom',
    surahNumber: 18,
    surahName: {
      en: "Al-Kahf",
      ar: "الكهف",
      am: "አል-ከህፍ"
    },
    verseRange: "1–10",
    verseNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    title: {
      en: "Day 92: The Light of Friday — Seeking Sanctuary in the Cave",
      ar: "اليوم 92: نور الجمعة — الاعتصام بكهف الإيمان",
      am: "ቀን 92፡ የጁሙዓህ ብርሃን — በእምነት ዋሻ ውስጥ መጠለል",
      har: "ቀን 92፡ የጁሙዓህ ኑር — በእምነት ዋሻ ውስጥ መጠለል"
    },
    subtitle: {
      en: "Surah Al-Kahf 18:1–10 • 5 Min Recitation | 10 Min Vocabulary & Tafsir | 5 Min Reflection",
      ar: "الكهف 18:1–10 • ٥ د تلاوة | ١٠ د فهم ومفردات | ٥ د تدبر ودعاء"
    },
    recitation: {
      arabicText: "ٱلْحَمْدُ لِلَّهِ ٱلَّذِىٓ أَنزَلَ عَلَىٰ عَبْدِهِ ٱلْكِتَـٰبَ وَلَمْ يَجْعَل لَّهُۥ عِوَجَا ۜ ۝١ قَيِّمًۭا لِّيُنذِرَ بَأْسًۭا شَدِيدًۭا مِّن لَّدُنْهُ وَيُبَشِّرَ ٱلْمُؤْمِنِينَ ٱلَّذِينَ يَعْمَلُونَ ٱلصَّـٰلِحَـٰتِ أَنَّ لَهُمْ أَجْرًا حَسَنًۭا ۝٢ مَّـٰكِثِينَ فِيهِ أَبَدًۭا ۝٣ ... إِذْ أَوَى ٱلْفِتْيَةُ إِلَى ٱلْكَهْفِ فَقَالُوا۟ رَبَّنَآ ءَاتِنَا مِن لَّدُنكَ رَحْمَةًۭ وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًۭا ۝١٠",
      transliteration: "Al-hamdu lillaahil-ladheee anzala 'alaa 'abdihil-kitaaba wa lam yaj'al lahoo 'iwajaa (1) Qayyimal-liyunzhira ba'san shadeedam-mil-ladunhu wa yubash-shiral-mu'mineenal-ladheena ya'maloonas-saalihaati anna lahum ajran hasanaa (2) ... Idh awal-fityatu ilal-kahfi fa-qaaloo Rabbanaaa aatinaa mil-ladunka rahmataw-wa hayyi' lanaa min amrinaa rashadaa (10)",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/018001.mp3",
      recommendedReciterId: "mishary",
      tajweedFocus: {
        ruleName: {
          en: "Saktah Latifah (Subtle Breathless Pause) on 'Iwajaa'",
          ar: "السكتة اللطيفة عند 'عِوَجَا'"
        },
        description: {
          en: "In Hafs 'an 'Asim, there is a subtle pause (sakt) on 'عِوَجَا' without taking a new breath, before continuing with 'قَيِّمًا', preventing the misunderstanding that 'qayyiman' contradicts the absence of crookedness.",
          ar: "سكتة لطيفة بدون تنفس بمقدار حركتين على ألف 'عِوَجَا' للفصل بين نفي العوج وإثبات الاستقامة 'قَيِّمًا'."
        },
        exampleVerseKey: "عِوَجَا ۜ قَيِّمًا",
        audioExampleWord: "عِوَجَا",
        practicalTip: {
          en: "Stop your voice for about one second while holding your breath, then pronounce 'Qayyiman' with clarity.",
          ar: "احبس صوتك لثانية يسيرة دون استنشاق هواء جديد ثم انطق 'قيماً' باعتدال."
        }
      }
    },
    understanding: {
      translation: {
        en: "[All] praise is [due] to Allah, who has sent down upon His Servant the Book and has not made therein any deviance. [He has made it] straight, to warn of severe punishment from Him and to give good tidings to the believers... When the youths retreated to the cave and said, 'Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance.'",
        ar: "الحمد لله الذي أنزل على عبده الكتاب ولم يجعل له عوجا. قيما لينذر بأسا شديدا... إذ أوى الفتية إلى الكهف فقالوا ربنا آتنا من لدنك رحمة وهيئ لنا من أمرنا رشدا.",
        am: "ምስጋና ለአላህ ይገባው ያ በባሪያው ላይ መጽሐፉን ላወረደው በውስጡም ምንም መጣመም ላላደረገበት። ቀጥተኛ ሲሆን ከእርሱ ዘንድ የሆነን ብርቱ ቅጣት ሊያስጠነቅቅ... ወጣቶቹ ወደ ዋሻው በተጠጉና «ጌታችን ሆይ! ከአንተ ዘንድ የሆነን እዝነት ስጠን፤ ከነገራችንም ቅንነትን አዘጋጅልን» ባሉ ጊዜ።",
        har: "ምስጋና ለአላህ ይገባል በባሪያው ላይ መጽሐፉን ላወረደው። ቀጥተኛ አድርጎ ላወረደው። ወጣቶቹ ወደ ዋሻው በተጠጉ ጊዜ፡- ጌታችን ሆይ ከአንተ ዘንድ ራሕማትን ስጠን ባሉ ጊዜ።"
      },
      vocabulary: [
        {
          word: "'Iwajaa",
          arabic: "عِوَجَا",
          root: "ع-و-ج ('-W-J)",
          transliteration: "'Iwajaa",
          meaning: {
            en: "Crookedness, internal inconsistency, moral ambiguity, or deviation from truth.",
            ar: "الميل والاعوجاج والاضطراب والاختلاف.",
            am: "መጣመም፣ መዛባት",
            har: "መጣመም"
          },
          occurrencesInQuran: 9
        },
        {
          word: "Al-Fityah",
          arabic: "الْفِتْيَةُ",
          root: "ف-ت-ي (F-T-Y)",
          transliteration: "Al-Fityah",
          meaning: {
            en: "The brave, sincere youths whose hearts were awakened with passionate, uncompromising faith.",
            ar: "الشبان الأقوياء في إيمانهم، الفاعلون للخير بصدق وجرأة.",
            am: "ወጣቶች (በእምነታቸው የጸኑ)",
            har: "ወጣቶች"
          },
          occurrencesInQuran: 2
        },
        {
          word: "Rashada",
          arabic: "رَشَدًا",
          root: "ر-ش-د (R-Sh-D)",
          transliteration: "Rashada",
          meaning: {
            en: "Wise guidance, right course of action, discernment, and spiritual maturity.",
            ar: "الاهتداء إلى الصواب والسبيل الأقوم في تدبير الأمر.",
            am: "ቅንነት፣ ጥበብ እና ትክክለኛ ምሪት",
            har: "ትክክለኛ ምሪት"
          },
          occurrencesInQuran: 5
        }
      ],
      tafsirSummary: {
        en: "Surah Al-Kahf provides four spiritual anchors against the four great trials (fitnah) that deceive humanity: the trial of Faith (Companions of the Cave), the trial of Wealth (Owner of the Two Gardens), the trial of Knowledge (Musa & Al-Khidr), and the trial of Power (Dhul-Qarnayn). The first ten verses serve as a shield against the ultimate tribulation of the Dajjal.",
        ar: "تشتمل سورة الكهف على أربع قصص تمثل النجاة من الفتن الأربع: فتنة الدين (الفتية)، فتنة المال (صاحب الجنتين)، فتنة العلم (موسى والخضر)، وفتنة السلطان (ذو القرنين). وحفظ أول عشر آيات منها يعصم بإذن الله من فتنة الدجال."
      },
      thematicContext: {
        en: "The Prophet ﷺ said: 'Whoever reads Surah Al-Kahf on Friday, a light will illuminate for him between the two Fridays.' It resets our spiritual clarity every single week.",
        ar: "حديث أبي سعيد الخدري رضي الله عنه: «من قرأ سورة الكهف في يوم الجمعة أضاء له من النور ما بين الجمعتين» (رواه الحاكم وصححه الألباني)."
      }
    },
    reflection: {
      reflectionPrompt: {
        en: "The young men in Al-Kahf had no political army; their first weapon was making dua for 'Rahmah' (mercy) and 'Rashad' (discernment). When navigating modern cultural pressures, what is your spiritual cave?",
        ar: "لم يكن لفتية الكهف جيش ولا سلطة، بل كان سلاحهم الأول هو الضراعة: 'ربنا آتنا من لدنك رحمة وهيئ لنا من أمرنا رشدا'. ما هو 'كهفك' الروحي اليوم الذي تعتصم به من فتن العصر؟",
        am: "የዋሻው ወጣቶች ምንም ሃይል አልነበራቸውም፤ የመጀመሪያ መሳሪያቸው ከአላህ እዝነትንና ቅንነትን መለመን ነበር። በእኛ ዘመን መንፈሳዊ ዋሻችን ምንድን ነው?"
      },
      dailyActionCommitment: {
        en: "Memorize verse 18:10 today and recite it three times whenever you face a difficult decision.",
        ar: "حفظ الآية الكريمة (رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا) وترديدها عند كل أمر تشعر فيه بالحيرة."
      },
      quranicDua: {
        arabic: "رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا",
        transliteration: "Rabbana aatina mil-ladunka rahmataw-wa hayyi' lana min amrina rashada",
        translation: {
          en: "Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance.",
          ar: "ربنا آتنا من لدنك رحمة وهيئ لنا من أمرنا رشدا (الكهف ١٠)."
        },
        reference: "Surah Al-Kahf 18:10"
      },
      retentionQuiz: {
        question: {
          en: "What prophetic protection is granted by the first 10 verses of Surah Al-Kahf?",
          ar: "ما هو الفضل الخاص لحفظ أو قراءة أول عشر آيات من سورة الكهف؟"
        },
        options: [
          {
            text: {
              en: "Protection from the trial of the False Messiah (Dajjal)",
              ar: "العصمة من فتنة المسيح الدجال"
            },
            isCorrect: true,
            explanation: {
              en: "The Prophet ﷺ said in Sahih Muslim: 'Whoever commits to memory the first ten verses of Surah Al-Kahf will be protected from the Dajjal.'",
              ar: "في صحيح مسلم: «من حفظ عشر آيات من أول سورة الكهف عُصم من الدجال»."
            }
          },
          {
            text: {
              en: "Guarantee of physical wealth",
              ar: "ضمان الغنى المالي الفوري"
            },
            isCorrect: false,
            explanation: {
              en: "The protection is spiritual resilience against the greatest deceptive trials.",
              ar: "الحفظ هنا هو عصمة روحية وعقدية من أعظم الفتن في تاريخ البشرية."
            }
          }
        ]
      }
    }
  },

  365: {
    dayNumber: 365,
    weekNumber: 52,
    quarter: 4,
    category: 'mastery_khatam',
    surahNumber: 114,
    surahName: {
      en: "Khatam-ul-Quran & An-Nas",
      ar: "ختم القرآن وسورة الناس",
      am: "የቁርአን ማጠናቀቂያ እና አን-ናስ"
    },
    verseRange: "Full Synthesis",
    verseNumbers: [1, 2, 3, 4, 5, 6],
    title: {
      en: "Day 365: The Grand Khatam — The Crown of Completion & The Eternal Covenant",
      ar: "اليوم 365: الختم المبارك وتتويج العام — ميثاق القرآن الخالد",
      am: "ቀን 365፡ ታላቁ የቁርአን ማጠናቀቂያ — የዘላለም ቃል ኪዳን",
      har: "ቀን 365፡ ታላቁ የቁርአን ኻቲማህ — የዘላለም ቃል ኪዳን"
    },
    subtitle: {
      en: "Day 365 of 365 • 5 Min Khatam Recitation | 10 Min Synthesis | 5 Min Grand Supplication",
      ar: "اليوم ٣٦٥ من ٣٦٥ • ٥ د تلاوة الختم | ١٠ د تدبر الحصاد | ٥ د دعاء ختم القرآن"
    },
    recitation: {
      arabicText: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ ۝١ مَلِكِ ٱلنَّاسِ ۝٢ إِلَـٰهِ ٱلنَّاسِ ۝٣ مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ ۝٤ ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ ۝٥ مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ ۝٦",
      transliteration: "Qul a'oodhu bi-Rabbin-naas (1) Malikin-naas (2) Ilaahin-naas (3) Min sharril-waswaasil-khannaas (4) Alladhee yuwaswisu fee sudoorin-naas (5) Minal-jinnati wan-naas (6)",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114001.mp3",
      recommendedReciterId: "mishary",
      tajweedFocus: {
        ruleName: {
          en: "Ghunnah in Noon Mushaddadah (Nasalization on 'An-Nas')",
          ar: "الغنة الكاملة في النون المشددة"
        },
        description: {
          en: "Every instance of 'An-Nas' has a Noon with Shaddah (نّ). Hold the melodic nasal resonance (Ghunnah) for 2 complete counts.",
          ar: "النون المشددة في كلمة 'النَّاسِ' يجب إظهار غنتها بمقدار حركتين تامتن."
        },
        exampleVerseKey: "بِرَبِّ النَّاسِ",
        audioExampleWord: "النَّاسِ",
        practicalTip: {
          en: "Feel the vibration in your nasal cavity to give this concluding surah its full soothing majesty.",
          ar: "أخرج الغنة صافية من الخيشوم دون تكلف لتملأ قلبك طمأنينة وسكينة."
        }
      }
    },
    understanding: {
      translation: {
        en: "Say, 'I seek refuge in the Lord of mankind, The Sovereign of mankind, The God of mankind, From the evil of the retreating whisperer - Who whispers into the breasts of mankind - From among the jinn and mankind.'",
        ar: "قل أعوذ برب الناس. ملك الناس. إله الناس. من شر الوسواس الخناس. الذي يوسوس في صدور الناس. من الجنة والناس.",
        am: "በል፡- «በሰዎች ጌታ እጠበቃለሁ። በሰዎች ንጉሥ። በሰዎች አምላክ። ከሸሸጊው ጎትጓች ክፋት። ከዚያ በሰዎች ልቦች ውስጥ ከሚጎተጉተው። ከጋኔንም ከሰውም (ከሆነው)።»",
        har: "በል፡- በሰዎች ጌታ እጠበቃለሁ። በሰዎች ንጉስ። በሰዎች አምላክ። ከሸሸጊው አሳሳች ክፋት።"
      },
      vocabulary: [
        {
          word: "Al-Khannas",
          arabic: "الْخَنَّاسِ",
          root: "خ-ن-س (Kh-N-S)",
          transliteration: "Al-Khannaas",
          meaning: {
            en: "The one who shrinks, retreats, and flees instantly whenever the Name of Allah is remembered.",
            ar: "الشيطان الذي ينقبض ويختفي ويفر بمجرد ذكر الله تعالى.",
            am: "የአላህ ስም ሲወሳ የሚሸሽ እና የሚደበቅ አሳሳች",
            har: "የአላህ ስም ሲወሳ የሚሸሽ"
          },
          occurrencesInQuran: 1
        },
        {
          word: "Al-Waswas",
          arabic: "الْوَسْوَاسِ",
          root: "و-س-و-س",
          transliteration: "Al-Waswaas",
          meaning: {
            en: "The persistent, subtle whisperer who casts negative suggestions into human chests.",
            ar: "كثير الوسوسة والإلقاء الخفي في الصدور.",
            am: "በልብ ውስጥ ክፉን የሚያንሾካሹክ",
            har: "አሳሳች"
          },
          occurrencesInQuran: 1
        }
      ],
      tafsirSummary: {
        en: "Notice how the Quran begins and concludes. It begins with 'Rabbil-'Aalameen' (Lord of all creation) in Surah Al-Fatiha, and concludes with 'Rabbin-Nas' (Lord of mankind) in Surah An-Nas. The journey comes full circle: the Creator of the cosmos draws tenderly near to the human chest, offering eternal refuge from every whisper and shadow.",
        ar: "انظر إلى الإعجاز في مطالع القرآن وخواتيمه: افتتح الله كتابه بـ 'الحمد لله رب العالمين' (رب الأكوان كلها) في الفاتحة، واختتمه بـ 'قل أعوذ برب الناس' في سورة الناس، ليربط بداية الرحلة بنهايتها: فالرب العظيم المحمود هو ملاذك وملاذ كل قلب بشري من كيد الوسواس."
      },
      thematicContext: {
        en: "Tradition of Al-Hal wal-Murtahal: When a Muslim completes the Quran, the Prophet ﷺ encouraged immediately starting Surah Al-Fatiha and the first 5 verses of Al-Baqarah, symbolizing that the Quran is a continuous, living journey without end.",
        ar: "سنة 'الحالّ المرتحل': كان السلف إذا ختموا القرآن شرعوا فوراً في قراءة الفاتحة وأول خمس آيات من البقرة، إعلاناً بأن صلة المؤمن بالقرآن رحلة مستمرة لا تنتهي أبداً."
      }
    },
    reflection: {
      reflectionPrompt: {
        en: "Alhamdulillah! You have completed 365 Days and 7,300 minutes with the Quran. Look back at your soul today compared to Day 1: How has the Light of the Quran transformed your thoughts, speech, and peace of heart?",
        ar: "الحمد لله الذي بنعمته تتم الصالحات! أتممت ٣٦٥ يوماً وأكثر من ٧٣٠٠ دقيقة في رحاب كتاب الله. تأمل كيف تبدل قلبك، وطهر لسانك، وسكنت روحك بهذا النور المبين؟",
        am: "አልሐምዱሊላህ! 365 ቀናት እና ከ7,300 ደቂቃዎች በላይ ከቁርአን ጋር አሳልፈዋል። በ1ኛው ቀን ከነበረው ውስጣዊ ስሜትዎ ዛሬ ምን ያህል ተቀይሯል?"
      },
      dailyActionCommitment: {
        en: "Make the grand Khatam Dua with tears of gratitude, gift this milestone as Sadaqah Jariyah for your parents, and commit to the Year 2 Advanced Journey.",
        ar: "قراءة دعاء ختم القرآن بخشوع وتضرع، وإهداء ثواب هذا الاجتهاد صدقة جارية لوالديك، وتجديد النية لبدء دورة العام الثاني بإذن الله."
      },
      quranicDua: {
        arabic: "اللَّهُمَّ ارْحَمْنَا بِالقُرْآنِ، وَاجْعَلْهُ لَنَا إِمَاماً وَنُوراً وَهُدًى وَرَحْمَةً، اللَّهُمَّ ذَكِّرْنَا مِنْهُ مَا نَسِينَا، وَعَلِّمْنَا مِنْهُ مَا جَهِلْنَا، وَارْزُقْنَا تِلاَوَتَهُ آنَاءَ اللَّيْلِ وَأَطْرَافَ النَّهَارِ، وَاجْعَلْهُ لَنَا حُجَّةً يَا رَبَّ العَالَمِينَ",
        transliteration: "Allahummar-hamna bil-Qur'an, waj'al-hu lana imaman wa nooran wa hudan wa rahmah. Allahumma dhakkirna minhu ma naseena, wa 'allimna minhu ma jahilna, war-zuqna tilawatahu aana'al-layli wa atraafan-nahar, waj'al-hu lana hujjatan ya Rabbal-'Alameen",
        translation: {
          en: "O Allah, have mercy on us through the Quran, and make it for us a leader, a light, a guide, and a mercy. O Allah, remind us from it what we have forgotten, teach us from it what we did not know, and bestow upon us its recitation during the hours of the night and the edges of the day, and make it for us a supporting proof, O Lord of the Worlds.",
          ar: "دعاء ختم القرآن المبارك المتوارث عن الأئمة الكرام."
        },
        reference: "Dua Khatmul Quran"
      },
      retentionQuiz: {
        question: {
          en: "What is the beautiful Sunnah of 'Al-Hal wal-Murtahal' upon completing the Quran?",
          ar: "ما هي سنة 'الحال المرتحل' المستحبة عند ختم القرآن الكريم؟"
        },
        options: [
          {
            text: {
              en: "To immediately begin reciting Surah Al-Fatiha and the start of Al-Baqarah, continuing the journey",
              ar: "أن يشرع فور الختم في قراءة الفاتحة ومطلع سورة البقرة ليبدأ ختمة جديدة دون انقطاع"
            },
            isCorrect: true,
            explanation: {
              en: "The Prophet ﷺ praised the reader who arrives at the end and immediately journeys again.",
              ar: "سُئل النبي ﷺ: أي الأعمال أحب إلى الله؟ قال: الحالّ المرتحل، الذي يضرب من أول القرآن إلى آخره، كلما حلّ ارتحل."
            }
          },
          {
            text: {
              en: "To close the Mushaf and not read for 40 days",
              ar: "إغلاق المصحف والتوقف عن القراءة أربعين يوماً"
            },
            isCorrect: false,
            explanation: {
              en: "A believer never abandons the Quran; every ending is a new beginning.",
              ar: "المؤمن لا يهجر القرآن أبداً، بل كل ختمة هي بداية لرحلة أعمق وأسمى."
            }
          }
        ]
      }
    }
  }
};

// Complete 52-week day-by-day curriculum mapping for all 365 days
interface WeekCurriculumSpec {
  defaultSurah: number;
  surahName: { en: string; ar: string; am: string };
  dayPartitions: Record<number, {
    surahNumber?: number;
    surahName?: { en: string; ar: string; am: string };
    verseNumbers: number[];
    verseRange: string;
    subtopic: { en: string; ar: string };
    arabicText: string;
    transliteration: string;
    translationEn: string;
    tajweedRule?: { en: string; ar: string; tip: string };
    vocabulary?: { word: string; arabic: string; root: string; meaning: string };
  }>;
}

export const WEEK_SYLLABUS_SPECS: Record<number, WeekCurriculumSpec> = {
  1: {
    defaultSurah: 1,
    surahName: { en: "Al-Fatiha", ar: "الفاتحة", am: "አል-ፋቲሃ" },
    dayPartitions: {
      1: {
        verseNumbers: [1, 2],
        verseRange: "1–2",
        subtopic: { en: "Praise & Universal Lordship", ar: "الحمد والربوبية الشاملة" },
        arabicText: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ۝١ ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ ۝٢",
        transliteration: "Bismillaahir-Rahmaanir-Raheem (1) Al-hamdu lillaahi Rabbil-'aalameen (2)",
        translationEn: "In the Name of Allah, the Entirely Merciful, the Especially Merciful. [All] praise is [due] to Allah, Lord of the worlds."
      },
      2: {
        verseNumbers: [3, 4],
        verseRange: "3–4",
        subtopic: { en: "Mercy and the Day of Recompense", ar: "الرحمة والملك في يوم الدين" },
        arabicText: "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ۝٣ مَـٰلِكِ يَوْمِ ٱلدِّينِ ۝٤",
        transliteration: "Ar-Rahmaanir-Raheem (3) Maaliki Yawmid-Deen (4)",
        translationEn: "The Entirely Merciful, the Especially Merciful. Sovereign of the Day of Recompense."
      },
      3: {
        verseNumbers: [5],
        verseRange: "5",
        subtopic: { en: "Sole Worship & Seeking Divine Aid", ar: "إفراد العبادة والاستعانة بالله" },
        arabicText: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝٥",
        transliteration: "Iyyaaka na'budu wa iyyaaka nasta'een (5)",
        translationEn: "It is You we worship and You we ask for help."
      },
      4: {
        verseNumbers: [6],
        verseRange: "6",
        subtopic: { en: "The Supplication for the Straight Path", ar: "دعاء الهداية إلى الصراط المستقيم" },
        arabicText: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ ۝٦",
        transliteration: "Ihdinas-Siraatal-Mustaqeem (6)",
        translationEn: "Guide us to the straight path."
      },
      5: {
        verseNumbers: [7],
        verseRange: "7",
        subtopic: { en: "The Path of Grace & Sanctuary from Error", ar: "صراط أهل النعمة والبراءة من الضلال" },
        arabicText: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ ۝٧",
        transliteration: "Siraatal-ladheena an'amta 'alayhim ghayril-maghdoobi 'alayhim wa lad-daaaalleen (7)",
        translationEn: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray."
      },
      6: {
        verseNumbers: [1, 2, 3, 4],
        verseRange: "1–4",
        subtopic: { en: "Synthesis: The Opening Praise", ar: "مراجعة: مفاتيح الحمد والرحمة" },
        arabicText: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ۝١ ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ ۝٢ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ۝٣ مَـٰلِكِ يَوْمِ ٱلدِّينِ ۝٤",
        transliteration: "Bismillaahir-Rahmaanir-Raheem (1) Al-hamdu lillaahi Rabbil-'aalameen (2) Ar-Rahmaanir-Raheem (3) Maaliki Yawmid-Deen (4)",
        translationEn: "In the Name of Allah, the Entirely Merciful, the Especially Merciful. [All] praise is [due] to Allah, Lord of the worlds. The Entirely Merciful, the Especially Merciful. Sovereign of the Day of Recompense."
      },
      7: {
        verseNumbers: [1, 2, 3, 4, 5, 6, 7],
        verseRange: "1–7",
        subtopic: { en: "Full Surah Al-Fatiha Khatam & Mastery", ar: "سورة الفاتحة كاملة — أم الكتاب" },
        arabicText: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ۝١ ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ ۝٢ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ۝٣ مَـٰلِكِ يَوْمِ ٱلدِّينِ ۝٤ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝٥ ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ ۝٦ صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ ۝٧",
        transliteration: "Bismillaahir-Rahmaanir-Raheem (1) Al-hamdu lillaahi Rabbil-'aalameen (2) Ar-Rahmaanir-Raheem (3) Maaliki Yawmid-Deen (4) Iyyaaka na'budu wa iyyaaka nasta'een (5) Ihdinas-Siraatal-Mustaqeem (6) Siraatal-ladheena an'amta 'alayhim ghayril-maghdoobi 'alayhim wa lad-daaaalleen (7)",
        translationEn: "In the Name of Allah, the Entirely Merciful, the Especially Merciful. [All] praise is [due] to Allah, Lord of the worlds. The Entirely Merciful, the Especially Merciful. Sovereign of the Day of Recompense. It is You we worship and You we ask for help. Guide us to the straight path - The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray."
      }
    }
  },
  2: {
    defaultSurah: 112,
    surahName: { en: "The Three Quls", ar: "المعوذات والإخلاص", am: "ሙዐዊዛት" },
    dayPartitions: {
      1: {
        surahNumber: 112,
        surahName: { en: "Al-Ikhlas", ar: "الإخلاص", am: "አል-ኢኽላስ" },
        verseNumbers: [1, 2, 3, 4],
        verseRange: "1–4",
        subtopic: { en: "Surah Al-Ikhlas: Absolute Tawheed", ar: "سورة الإخلاص: كمال التوحيد والصمدية" },
        arabicText: "قُلْ هُوَ ٱللَّهُ أَحَدٌ ۝١ ٱللَّهُ ٱلصَّمَدُ ۝٢ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝٣ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ ۢ ۝٤",
        transliteration: "Qul Huwal-laahu Ahad (1) Allaahus-Samad (2) Lam yalid wa lam yoolad (3) Wa lam yakun lahoo kufuwan ahad (4)",
        translationEn: "Say, 'He is Allah, [who is] One, Allah, the Eternal Refuge. He neither begets nor is born, Nor is there to Him any equivalent.'"
      },
      2: {
        surahNumber: 113,
        surahName: { en: "Al-Falaq", ar: "الفلق", am: "አል-ፋላቅ" },
        verseNumbers: [1, 2, 3],
        verseRange: "1–3",
        subtopic: { en: "Surah Al-Falaq: Seeking Dawn's Refuge", ar: "سورة الفلق: الاستعاذة برب الفلق" },
        arabicText: "قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ ۝١ مِن شَرِّ مَا خَلَقَ ۝٢ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝٣",
        transliteration: "Qul a'oozhu bi Rabbil-falaq (1) Min sharri maa khalaq (2) Wa min sharri ghaasiqin izaa waqab (3)",
        translationEn: "Say, 'I seek refuge in the Lord of daybreak, From the evil of that which He created, And from the evil of darkness when it settles.'"
      },
      3: {
        surahNumber: 113,
        surahName: { en: "Al-Falaq", ar: "الفلق", am: "አል-ፋላቅ" },
        verseNumbers: [4, 5],
        verseRange: "4–5",
        subtopic: { en: "Protection from Envy & Secret Harm", ar: "التحصين من النفاثات في العقد وحسد الحاسد" },
        arabicText: "وَمِن شَرِّ ٱلنَّفَّـٰثَـٰتِ فِى ٱلْعُقَدِ ۝٤ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ۝٥",
        transliteration: "Wa min sharrin-naffaathaati fil-'uqad (4) Wa min sharri haasidin izaa hasad (5)",
        translationEn: "And from the evil of the blowers in knots, And from the evil of an envier when he envies."
      },
      4: {
        surahNumber: 114,
        surahName: { en: "An-Nas", ar: "الناس", am: "አን-ናስ" },
        verseNumbers: [1, 2, 3],
        verseRange: "1–3",
        subtopic: { en: "Surah An-Nas: Lord, Sovereign & God of Humanity", ar: "سورة الناس: رب الناس وملك الناس وإله الناس" },
        arabicText: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ ۝١ مَلِكِ ٱلنَّاسِ ۝٢ إِلَـٰهِ ٱلنَّاسِ ۝٣",
        transliteration: "Qul a'oozhu bi Rabbin-naas (1) Malikin-naas (2) Ilaahin-naas (3)",
        translationEn: "Say, 'I seek refuge in the Lord of mankind, The Sovereign of mankind, The God of mankind.'"
      },
      5: {
        surahNumber: 114,
        surahName: { en: "An-Nas", ar: "الناس", am: "አን-ናስ" },
        verseNumbers: [4, 5, 6],
        verseRange: "4–6",
        subtopic: { en: "Sanctuary from the Retreating Whisperer", ar: "الحفظ من وسواس الصدور من الجنة والناس" },
        arabicText: "مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ ۝٤ ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ ۝٥ مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ ۝٦",
        transliteration: "Min sharril-waswaasil-khannaas (4) Allazhee yuwaswisu fee sudoorin-naas (5) Minal-jinnati wannaas (6)",
        translationEn: "From the evil of the retreating whisperer - Who whispers [evil] into the breasts of mankind - From among the jinn and mankind."
      },
      6: {
        surahNumber: 112,
        surahName: { en: "Al-Ikhlas & Al-Falaq", ar: "الإخلاص والفلق", am: "ኢኽላስ እና ፋላቅ" },
        verseNumbers: [1, 2, 3, 4],
        verseRange: "112:1–4",
        subtopic: { en: "The Fortress of Sincerity & Dawn", ar: "حصن الإخلاص والفلق" },
        arabicText: "قُلْ هُوَ ٱللَّهُ أَحَدٌ ۝١ ٱللَّهُ ٱلصَّمَدُ ۝٢ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝٣ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ ۢ ۝٤",
        transliteration: "Qul Huwal-laahu Ahad (1) Allaahus-Samad (2) Lam yalid wa lam yoolad (3) Wa lam yakun lahoo kufuwan ahad (4)",
        translationEn: "Say, 'He is Allah, [who is] One, Allah, the Eternal Refuge. He neither begets nor is born, Nor is there to Him any equivalent.'"
      },
      7: {
        surahNumber: 114,
        surahName: { en: "The Three Quls Synthesis", ar: "المعوذات الثلاث كاملة", am: "ሙዐዊዛት ሙላት" },
        verseNumbers: [1, 2, 3, 4, 5, 6],
        verseRange: "114:1–6",
        subtopic: { en: "Mastery of the Daily Protections", ar: "إتقان التحصينات النبوية الثلاث" },
        arabicText: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ ۝١ مَلِكِ ٱلنَّاسِ ۝٢ إِلَـٰهِ ٱلنَّاسِ ۝٣ مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ ۝٤ ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ ۝٥ مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ ۝٦",
        transliteration: "Qul a'oozhu bi Rabbin-naas (1) Malikin-naas (2) Ilaahin-naas (3) Min sharril-waswaasil-khannaas (4) Allazhee yuwaswisu fee sudoorin-naas (5) Minal-jinnati wannaas (6)",
        translationEn: "Say, 'I seek refuge in the Lord of mankind, The Sovereign of mankind, The God of mankind, From the evil of the retreating whisperer - Who whispers into the breasts of mankind - From among the jinn and mankind.'"
      }
    }
  },
  3: {
    defaultSurah: 108,
    surahName: { en: "Al-Kawthar & Al-Ma'un", ar: "الكوثر والماعون", am: "አል-ከውሰር እና አል-ማዑን" },
    dayPartitions: {
      1: {
        surahNumber: 108,
        surahName: { en: "Al-Kawthar", ar: "الكوثر", am: "አል-ከውሰር" },
        verseNumbers: [1, 2, 3],
        verseRange: "1–3",
        subtopic: { en: "Surah Al-Kawthar: Abundant Grace & Gratitude", ar: "سورة الكوثر: نهر النبوة وشكر النعمة" },
        arabicText: "إِنَّآ أَعْطَيْنَـٰكَ ٱلْكَوْثَرَ ۝١ فَصَلِّ لِرَبِّكَ وَٱنْحَرْ ۝٢ إِنَّ شَانِئَكَ هُوَ ٱلْأَبْتَرُ ۝٣",
        transliteration: "Innaaa a'tainaakal-kawthar (1) Fa-salli li-Rabbika wanhar (2) Inna shaani'aka huwal-abtar (3)",
        translationEn: "Indeed, We have granted you, [O Muhammad], al-Kawthar. So pray to your Lord and sacrifice [to Him alone]. Indeed, your enemy is the one cut off."
      },
      2: {
        surahNumber: 107,
        surahName: { en: "Al-Ma'un", ar: "الماعون", am: "አል-ማዑን" },
        verseNumbers: [1, 2, 3],
        verseRange: "1–3",
        subtopic: { en: "Surah Al-Ma'un: Faith vs Hypocrisy", ar: "سورة الماعون: إكرام اليتيم وإطعام المسكين" },
        arabicText: "أَرَءَيْتَ ٱلَّذِى يُكَذِّبُ بِٱلدِّينِ ۝١ فَذَٰلِكَ ٱلَّذِى يَدُعُّ ٱلْيَتِيمَ ۝٢ وَلَا يَحُضُّ عَلَىٰ طَعَامِ ٱلْمِسْكِينِ ۝٣",
        transliteration: "Ara'aytal-lazhee yukazzhibu bid-deen (1) Fazhaalikal-lazhee yadu''ul-yateem (2) Wa laa yahuddu 'alaa ta'aamil-miskeen (3)",
        translationEn: "Have you seen the one who denies the Recompense? For that is the one who drives away the orphan, And does not encourage the feeding of the poor."
      },
      3: {
        surahNumber: 107,
        surahName: { en: "Al-Ma'un", ar: "الماعون", am: "አል-ማዑን" },
        verseNumbers: [4, 5, 6, 7],
        verseRange: "4–7",
        subtopic: { en: "Sincere Prayer & Acts of Kindness", ar: "الإخلاص في الصلاة وبذل الماعون" },
        arabicText: "فَوَيْلٌۭ لِّلْمُصَلِّينَ ۝٤ ٱلَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ ۝٥ ٱلَّذِينَ هُمْ يُرَآءُونَ ۝٦ وَيَمْنَعُونَ ٱلْمَاعُونَ ۝٧",
        transliteration: "Fa-waylul-lil-musalleen (4) Allazeena hum 'an salaatihim saahoon (5) Allazeena hum yuraaa'oon (6) Wa yamna'oonal-maa'oon (7)",
        translationEn: "So woe to those who pray [but] who are heedless of their prayer - Those who make a show [of their deeds] and withhold simple assistance."
      },
      4: {
        surahNumber: 106,
        surahName: { en: "Quraysh", ar: "قريش", am: "ቁረይሽ" },
        verseNumbers: [1, 2, 3, 4],
        verseRange: "1–4",
        subtopic: { en: "Surah Quraysh: Security & Sustenance", ar: "سورة قريش: نعمة الأمن والإطعام من جوع" },
        arabicText: "لِإِيلَـٰفِ قُرَيْشٍ ۝١ إِۦلَـٰفِهِمْ رِحْلَةَ ٱلشِّتَآءِ وَٱلصَّيْفِ ۝٢ فَلْيَعْبُدُوا۟ رَبَّ هَـٰذَا ٱلْبَيْتِ ۝٣ ٱلَّذِىٓ أَطْعَمَهُم مِّن جُوعٍۢ وَءَامَنَهُم مِّنْ خَوْفٍۭ ۝٤",
        transliteration: "Li-eelaafi Quraysh (1) Eelaafihim rihlatash-shitaaa'i was-sayf (2) Fal-ya'budoo Rabba haazhal-bayt (3) Allazheee at'amahum min joo'inw-wa aamanahum min khawf (4)",
        translationEn: "For the accustomed security of the Quraysh - Their accustomed security in the caravan of winter and summer - Let them worship the Lord of this House, Who has fed them, [saving them] from hunger and made them safe, [saving them] from fear."
      },
      5: {
        surahNumber: 105,
        surahName: { en: "Al-Fil", ar: "الفيل", am: "አል-ፊል" },
        verseNumbers: [1, 2, 3, 4, 5],
        verseRange: "1–5",
        subtopic: { en: "Surah Al-Fil: The Divine Defense of the Sanctuary", ar: "سورة الفيل: حفظ البيت وهلاك الظالمين" },
        arabicText: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَـٰبِ ٱلْفِيلِ ۝١ أَلَمْ يَجْعَلْ كَيْدَهُمْ فِى تَضْلِيلٍۢ ۝٢ وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ ۝٣ تَرْمِيهِم بِحِجَارَةٍۢ مِّن سِجِّيلٍۢ ۝٤ فَجَعَلَهُمْ كَعَصْفٍۢ مَّأْكُولٍۭ ۝٥",
        transliteration: "Alam tara kayfa fa'ala Rabbuka bi-as-haabil-feel (1) Alam yaj'al kaydahum fee tadleel (2) Wa arsala 'alayhim tayran abaabeel (3) Tarmeehim bi-hijaaratim-min sijjeel (4) Fa-ja'alahum ka-'asfim-ma'kool (5)",
        translationEn: "Have you not considered, [O Muhammad], how your Lord dealt with the companions of the elephant? Did He not make their plan into misguidance? And He sent against them birds in flocks, Striking them with stones of hard clay, And He made them like eaten straw."
      },
      6: {
        surahNumber: 109,
        surahName: { en: "Al-Kafirun", ar: "الكافرون", am: "አል-ካፊሩን" },
        verseNumbers: [1, 2, 3, 4, 5, 6],
        verseRange: "1–6",
        subtopic: { en: "Surah Al-Kafirun: Purity of Worship", ar: "سورة الكافرون: البراءة التامة من الشرك" },
        arabicText: "قُلْ يَـٰٓأَيُّهَا ٱلْكَـٰفِرُونَ ۝١ لَآ أَعْبُدُ مَا تَعْبُدُونَ ۝٢ وَلَآ أَنتُمْ عَـٰبِدُونَ مَآ أَعْبُدُ ۝٣ وَلَآ أَنَا۠ عَابِدٌۭ مَّا عَبَدتُّمْ ۝٤ وَلَآ أَنتُمْ عَـٰبِدُونَ مَآ أَعْبُدُ ۝٥ لَكُمْ دِينُكُمْ وَلِىَ دِينِ ۝٦",
        transliteration: "Qul yaaa-ayyuhal-kaafiroon (1) Laaa a'budu maa ta'budoon (2) Wa laaa antum 'aabidoona maaa a'bud (3) Wa laaa ana 'aabidum-maa 'abattum (4) Wa laaa antum 'aabidoona maaa a'bud (5) Lakum deenukum wa liya deen (6)",
        translationEn: "Say, 'O disbelievers, I do not worship what you worship. Nor are you worshippers of what I worship. Nor will I be a worshipper of what you worship. Nor will you be worshippers of what I worship. For you is your religion, and for me is my religion.'"
      },
      7: {
        surahNumber: 110,
        surahName: { en: "An-Nasr", ar: "النصر", am: "አን-ነስር" },
        verseNumbers: [1, 2, 3],
        verseRange: "1–3",
        subtopic: { en: "Surah An-Nasr: Divine Victory & Glorification", ar: "سورة النصر: إذا جاء نصر الله والتسبيح بحمده" },
        arabicText: "إِذَا جَآءَ نَصْرُ ٱللَّهِ وَٱلْفَتْحُ ۝١ وَرَأَيْتَ ٱلنَّاسَ يَدْخُلُونَ فِى دِينِ ٱللَّهِ أَفْوَاجًۭا ۝٢ فَسَبِّحْ بِحَمْدِ رَبِّكَ وَٱسْتَغْفِرْهُ ۚ إِنَّهُۥ كَانَ تَوَّابًۢا ۝٣",
        transliteration: "Izaa jaaa'a nasrul-laahi wal-fath (1) Wa ra'aytan-naasa yadkhuloona fee deenil-laahi afwaajaa (2) Fa-sabbih bi-hamdi Rabbika wastaghfirh, innahoo kaana Tawwaabaa (3)",
        translationEn: "When the victory of Allah has come and the conquest, And you see the people entering into the religion of Allah in multitudes, Then exalt [Him] with praise of your Lord and ask forgiveness of Him. Indeed, He is ever Accepting of repentance."
      }
    }
  },
  4: {
    defaultSurah: 103,
    surahName: { en: "Al-Asr & Al-Humazah", ar: "العصر والهمزة", am: "አል-ዐስር እና ሁመዛህ" },
    dayPartitions: {
      1: {
        surahNumber: 103,
        surahName: { en: "Al-Asr", ar: "العصر", am: "አል-ዐስር" },
        verseNumbers: [1, 2, 3],
        verseRange: "1–3",
        subtopic: { en: "Surah Al-Asr: The Four Pillars of Salvation", ar: "سورة العصر: أركان النجاة الأربعة" },
        arabicText: "وَٱلْعَصْرِ ۝١ إِنَّ ٱلْإِنسَـٰنَ لَفِى خُسْرٍ ۝٢ إِلَّا ٱلَّذِينَ ءَامَنُوا۟ وَعَمِلُوا۟ ٱلصَّـٰلِحَـٰتِ وَتَوَاصَوْا۟ بِٱلْحَقِّ وَتَوَاصَوْا۟ بِٱلصَّبْرِ ۝٣",
        transliteration: "Wal-'asr (1) Innal-insaana lafee khusr (2) Illal-lazheena aamanoo wa 'amilus-saalihaati wa tawaasaw bil-haqqi wa tawaasaw bis-sabr (3)",
        translationEn: "By time, Indeed, mankind is in loss, Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience."
      },
      2: {
        surahNumber: 104,
        surahName: { en: "Al-Humazah", ar: "الهمزة", am: "አል-ሁመዛህ" },
        verseNumbers: [1, 2, 3, 4],
        verseRange: "1–4",
        subtopic: { en: "Surah Al-Humazah: Warning Against Slander & Greed", ar: "سورة الهمزة: التحذير من الهمز واللمز واكتناز المال" },
        arabicText: "وَيْلٌۭ لِّكُلِّ هُمَزَةٍۢ لُّمَزَةٍ ۝١ ٱلَّذِى جَمَعَ مَالًۭا وَعَدَّدَهُۥ ۝٢ يَحْسَبُ أَنَّ مَالَهُۥٓ أَخْلَدَهُۥ ۝٣ كَلَّا ۖ لَيُنبَذَنَّ فِى ٱلْحُطَمَةِ ۝٤",
        transliteration: "Waylul-likulli humazatil-lumazah (1) Allazhee jama'a maalanw-wa 'addadah (2) Yahsabu anna maalahooo akhladah (3) Kallaa layumbazhanna fil-hutamah (4)",
        translationEn: "Woe to every scorner and mocker who collects wealth and [continuously] counts it. He thinks that his wealth will make him immortal. No! He will surely be thrown into the Crusher."
      },
      3: {
        surahNumber: 104,
        surahName: { en: "Al-Humazah", ar: "الهمزة", am: "አል-ሁመዛህ" },
        verseNumbers: [5, 6, 7, 8, 9],
        verseRange: "5–9",
        subtopic: { en: "The Nature of Al-Hutamah", ar: "وصف الحطمة ونار الله الموقدة" },
        arabicText: "وَمَآ أَدْرَىٰكَ مَا ٱلْحُطَمَةُ ۝٥ نَارُ ٱللَّهِ ٱلْمُوقَدَةُ ۝٦ ٱلَّتِى تَطَّلِعُ عَلَى ٱلْأَفْـِٔدَةِ ۝٧ إِنَّهَا عَلَيْهِم مُّؤْصَدَةٌۭ ۝٨ فِى عَمَدٍۢ مُّمَدَّدَةٍۭ ۝٩",
        transliteration: "Wa maaa adraaka mal-hutamah (5) Naarul-laahil-mooqadah (6) Allatee tattali'u 'alal-af'idah (7) Innahaa 'alayhim mu'sadah (8) Fee 'amadim-mumaddadah (9)",
        translationEn: "And what can make you know what is the Crusher? It is the fire of Allah, [eternally] fueled, which mounts directed at the hearts. Indeed, Hellfire will be closed down upon them In extended columns."
      },
      4: {
        surahNumber: 102,
        surahName: { en: "At-Takathur", ar: "التكاثر", am: "አት-ተካሱር" },
        verseNumbers: [1, 2, 3, 4],
        verseRange: "1–4",
        subtopic: { en: "Surah At-Takathur: The Illusion of Rivalry", ar: "سورة التكاثر: التلهي بالأموال حتى زيارة المقابر" },
        arabicText: "أَلْهَىٰكُمُ ٱلتَّكَاثُرُ ۝١ حَتَّىٰ زُرْتُمُ ٱلْمَقَابِرَ ۝٢ كَلَّا سَوْفَ تَعْلَمُونَ ۝٣ ثُمَّ كَلَّا سَوْفَ تَعْلَمُونَ ۝٤",
        transliteration: "Alhaakumut-takaathur (1) Hattaa zurtumul-maqaabir (2) Kallaa sawfa ta'lamoon (3) Thumma kallaa sawfa ta'lamoon (4)",
        translationEn: "Competition in [worldly] increase diverts you until you visit the graveyards. No! You are going to know. Then no! You are going to know."
      },
      5: {
        surahNumber: 102,
        surahName: { en: "At-Takathur", ar: "التكاثر", am: "አት-ተካሱር" },
        verseNumbers: [5, 6, 7, 8],
        verseRange: "5–8",
        subtopic: { en: "Certainty & Questioning on Blessings", ar: "علم اليقين والسؤال عن النعيم" },
        arabicText: "كَلَّا لَوْ تَعْلَمُونَ عِلْمَ ٱلْيَقِينِ ۝٥ لَتَرَوُنَّ ٱلْجَحِيمَ ۝٦ ثُمَّ لَتَرَوُنَّهَا عَيْنَ ٱلْيَقِينِ ۝٧ ثُمَّ لَتُسْـَٔلُنَّ يَوْمَئِذٍ عَنِ ٱلنَّعِيمِ ۝٨",
        transliteration: "Kallaa law ta'lamoona 'ilmal-yaqeen (5) Latarawunnal-jaheem (6) Thumma latarawunnahaa 'aynal-yaqeen (7) Thumma latus'alunna yawma'izhin 'anin-na'eem (8)",
        translationEn: "No! If you only knew with knowledge of certainty... You will surely see the Hellfire. Then you will surely see it with the eye of certainty. Then you will surely be asked that Day about pleasure."
      },
      6: {
        surahNumber: 101,
        surahName: { en: "Al-Qari'ah", ar: "القارعة", am: "አል-ቃሪዐህ" },
        verseNumbers: [1, 2, 3, 4, 5],
        verseRange: "1–5",
        subtopic: { en: "Surah Al-Qari'ah: The Striking Calamity", ar: "سورة القارعة: مشهد يوم القيامة والناس كالفراش" },
        arabicText: "ٱلْقَارِعَةُ ۝١ مَا ٱلْقَارِعَةُ ۝٢ وَمَآ أَدْرَىٰكَ مَا ٱلْقَارِعَةُ ۝٣ يَوْمَ يَكُونُ ٱلنَّاسُ كَٱلْفَرَاشِ ٱلْمَبْثُوثِ ۝٤ وَتَكُونُ ٱلْجِبَالُ كَٱلْعِهْنِ ٱلْمَنفُوشِ ۝٥",
        transliteration: "Al-qaari'ah (1) Mal-qaari'ah (2) Wa maaa adraaka mal-qaari'ah (3) Yawma yakoonun-naasu kal-faraashil-mabthooth (4) Wa takoonul-jibaalu kal-'ihnil-manfoosh (5)",
        translationEn: "The Striking Calamity - What is the Striking Calamity? And what can make you know what is the Striking Calamity? It is the Day when people will be like moths dispersed, And the mountains will be like wool, fluffed up."
      },
      7: {
        surahNumber: 101,
        surahName: { en: "Al-Qari'ah", ar: "القارعة", am: "አል-ቃሪዐህ" },
        verseNumbers: [6, 7, 8, 9, 10, 11],
        verseRange: "6–11",
        subtopic: { en: "The Scales of Deeds & Eternity", ar: "موازين الأعمال والعيشة الراضية أو الهاوية" },
        arabicText: "فَأَمَّا مَن ثَقُلَتْ مَوَٰزِينُهُۥ ۝٦ فَهُوَ فِى عِيشَةٍۢ رَّاضِيَةٍۢ ۝٧ وَأَمَّا مَنْ خَفَّتْ مَوَٰزِينُهُۥ ۝٨ فَأُمُّهُۥ هَاوِيَةٌۭ ۝٩ وَمَآ أَدْرَىٰكَ مَا هِيَهْ ۝١٠ نَارٌ حَامِيَةٌۢ ۝١١",
        transliteration: "Fa-ammaa man thaqulat mawaazeenuh (6) Fahuwa fee 'eeshatir-raadiyah (7) Wa ammaa man khaffat mawaazeenuh (8) Fa-ummuhoo haawiyah (9) Wa maaa adraaka maa hiyah (10) Naarun haamiyah (11)",
        translationEn: "Then as for one whose scales are heavy [with good deeds], He will be in a pleasant life. But as for one whose scales are light, His refuge will be an abyss. And what can make you know what that is? It is a Fire, intensely hot."
      }
    }
  },
  5: {
    defaultSurah: 97,
    surahName: { en: "Al-Qadr & Ash-Sharh", ar: "القدر والشرح", am: "አል-ቀድር እና አሽ-ሸርሕ" },
    dayPartitions: {
      1: {
        surahNumber: 97,
        surahName: { en: "Al-Qadr", ar: "القدر", am: "አል-ቀድር" },
        verseNumbers: [1, 2, 3, 4, 5],
        verseRange: "1–5",
        subtopic: { en: "Surah Al-Qadr: The Night of Decree", ar: "سورة القدر: نزول القرآن وفضل ليلة القدر" },
        arabicText: "إِنَّآ أَنزَلْنَـٰهُ فِى لَيْلَةِ ٱلْقَدْرِ ۝١ وَمَآ أَدْرَىٰكَ مَا لَيْلَةُ ٱلْقَدْرِ ۝٢ لَيْلَةُ ٱلْقَدْرِ خَيْرٌۭ مِّنْ أَلْفِ شَهْرٍۢ ۝٣ تَنَزَّلُ ٱلْمَلَـٰٓئِكَةُ وَٱلرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍۢ ۝٤ سَلَـٰمٌ هِىَ حَتَّىٰ مَطْلَعِ ٱلْفَجْرِ ۝٥",
        transliteration: "Innaaa anzalnaahu fee laylatil-qadr (1) Wa maaa adraaka maa laylatul-qadr (2) Laylatul-qadri khayrum-min alfi shahr (3) Tanazzalul-malaaa'ikatu war-roohu feehaa bi-izhni Rabbihim-min kulli amr (4) Salaamun hiya hattaa matla'il-fajr (5)",
        translationEn: "Indeed, We sent the Quran down during the Night of Decree. And what can make you know what is the Night of Decree? The Night of Decree is better than a thousand months. The angels and the Spirit descend therein by permission of their Lord for every matter. Peace it is until the emergence of dawn."
      },
      2: {
        surahNumber: 94,
        surahName: { en: "Ash-Sharh", ar: "الشرح", am: "አሽ-ሸርሕ" },
        verseNumbers: [1, 2, 3, 4],
        verseRange: "1–4",
        subtopic: { en: "Surah Ash-Sharh: Expansion of the Chest", ar: "سورة الشرح: انشراح الصدر ووضع الوزر" },
        arabicText: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ۝١ وَوَضَعْنَا عَنكَ وِزْرَكَ ۝٢ ٱلَّذِىٓ أَنقَضَ ظَهْرَكَ ۝٣ وَرَفَعْنَا لَكَ ذِكْرَكَ ۝٤",
        transliteration: "Alam nashrah laka sadrak (1) Wa wada'naa 'anka wizrak (2) Allazheee anqada zahrak (3) Wa rafa'naa laka zhikrak (4)",
        translationEn: "Did We not expand for you, [O Muhammad], your breast? And We removed from you your burden which had weighed upon your back, And raised high for you your repute."
      },
      3: {
        surahNumber: 94,
        surahName: { en: "Ash-Sharh", ar: "الشرح", am: "አሽ-ሸርሕ" },
        verseNumbers: [5, 6, 7, 8],
        verseRange: "5–8",
        subtopic: { en: "Ease with Hardship & Continual Devotion", ar: "إن مع العسر يسراً والتوجه إلى الرب" },
        arabicText: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا ۝٥ إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا ۝٦ فَإِذَا فَرَغْتَ فَٱنصَبْ ۝٧ وَإِلَىٰ رَبِّكَ فَٱرْغَب ۝٨",
        transliteration: "Fa-inna ma'al-'usri yusraa (5) Inna ma'al-'usri yusraa (6) Fa-izhaa faraghta fansab (7) Wa ilaa Rabbika farghab (8)",
        translationEn: "For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease. So when you have finished [your duties], then stand up [for worship], And to your Lord direct [your] longing."
      },
      4: {
        surahNumber: 93,
        surahName: { en: "Ad-Duha", ar: "الضحى", am: "አድ-ዱሓ" },
        verseNumbers: [1, 2, 3, 4, 5],
        verseRange: "1–5",
        subtopic: { en: "Surah Ad-Duha: Divine Solace & The Promise", ar: "سورة الضحى: ما ودعك ربك وما قلى وللآخرة خير لك" },
        arabicText: "وَٱلضُّحَىٰ ۝١ وَٱلَّيْلِ إِذَا سَجَىٰ ۝٢ مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ ۝٣ وَلَلْـَٔاخِرَةُ خَيْرٌۭ لَّكَ مِنَ ٱلْأُولَىٰ ۝٤ وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ ۝٥",
        transliteration: "Wad-duhaa (1) Wal-layli izhaa sajaa (2) Maa wadda'aka Rabbuka wa maa qalaa (3) Wa lal-aakhiratu khayrul-laka minal-oolaa (4) Wa lasawfa yu'teeka Rabbuka fatardaa (5)",
        translationEn: "By the morning brightness And [by] the night when it covers with darkness, Your Lord has not taken leave of you, [O Muhammad], nor has He detested [you]. And the Hereafter is better for you than the first [life]. And your Lord is going to give you, and you will be satisfied."
      },
      5: {
        surahNumber: 93,
        surahName: { en: "Ad-Duha", ar: "الضحى", am: "አድ-ዱሓ" },
        verseNumbers: [6, 7, 8, 9, 10, 11],
        verseRange: "6–11",
        subtopic: { en: "Remembering Favors & Compassion", ar: "ألم يجدك يتيماً فآوى والتحدث بنعمة الرب" },
        arabicText: "أَلَمْ يَجِدْكَ يَتِيمًۭا فَـَٔاوَىٰ ۝٦ وَوَجَدَكَ ضَآلًّۭا فَهَدَىٰ ۝٧ وَوَجَدَكَ عَآئِلًۭا فَأَغْنَىٰ ۝٨ فَأَمَّا ٱلْيَتِيمَ فَلَا تَقْهَرْ ۝٩ وَأَمَّا ٱلسَّآئِلَ فَلَا تَنْهَرْ ۝١٠ وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ ۝١١",
        transliteration: "Alam yajidka yateeman fa-aawaa (6) Wa wajadaka daaallan fa-hadaa (7) Wa wajadaka 'aaa'ilan fa-aghnaa (8) Fa-ammal-yateema falaa taqhar (9) Wa ammas-saaa'ila falaa tanhar (10) Wa ammaa bi-ni'mati Rabbika fahaddith (11)",
        translationEn: "Did He not find you an orphan and give [you] refuge? And He found you lost and guided [you], And He found you poor and made [you] self-sufficient. So as for the orphan, do not oppress [him]. And as for the petitioner, do not repel [him]. But as for the favor of your Lord, report [it]."
      },
      6: {
        surahNumber: 98,
        surahName: { en: "Al-Bayyinah", ar: "البينة", am: "አል-በይናህ" },
        verseNumbers: [1, 2, 3, 4, 5],
        verseRange: "1–5",
        subtopic: { en: "Surah Al-Bayyinah: The Clear Evidence & Sincere Religion", ar: "سورة البينة: الإخلاص لله وإقام الصلاة" },
        arabicText: "لَمْ يَكُنِ ٱلَّذِينَ كَفَرُوا۟ مِنْ أَهْلِ ٱلْكِتَـٰبِ وَٱلْمُشْرِكِينَ مُنفَكِّينَ حَتَّىٰ تَأْتِيَهُمُ ٱلْبَيِّنَةُ ۝١ رَسُولٌۭ مِّنَ ٱللَّهِ يَتْلُوا۟ صُحُفًۭا مُّطَهَّرَةًۭ ۝٢ فِيهَا كُتُبٌۭ قَيِّمَةٌۭ ۝٣ وَمَا تَفَرَّقَ ٱلَّذِينَ أُوتُوا۟ ٱلْكِتَـٰبَ إِلَّا مِنۢ بَعْدِ مَا جَآءَتْهُمُ ٱلْبَيِّنَةُ ۝٤ وَمَآ أُمِرُوٓا۟ إِلَّا لِيَعْبُدُوا۟ ٱللَّهَ مُخْلِصِينَ لَهُ ٱلدِّينَ حُنَفَآءَ وَيُقِيمُوا۟ ٱلصَّلَوٰةَ وَيُؤْتُوا۟ ٱلزَّكَوٰةَ ۚ وَذَٰلِكَ دِينُ ٱلْقَيِّمَةِ ۝٥",
        transliteration: "Lam yakunil-lazheena kafaroo min ahlil-kitaabi wal-mushrikeena munfakkeena hattaa ta'tiyahumul-bayyinah (1) Rasoolum-minal-laahi yatloo suhufam-mutahharah (2) Feehaa kutubun qayyimah (3) Wa maa tafarraqal-lazheena ootul-kitaaba illaa mim-ba'di maa jaaa'athumul-bayyinah (4) Wa maaa umirooo illaa liya'budul-laaha mukhliseena lahud-deena hunafaaa'a wa yuqeemus-salaata wa yu'tuz-zakaata wa zhaalika deenul-qayyimah (5)",
        translationEn: "Those who disbelieved among the People of the Scripture and the polytheists were not to be parted [from misbelief] until there came to them clear evidence - A Messenger from Allah, reciting purified scriptures Within which are correct writings. And they were not commanded except to worship Allah, [being] sincere to Him in religion, inclining to truth, and to establish prayer and to give zakah. And that is the correct religion."
      },
      7: {
        surahNumber: 97,
        surahName: { en: "Al-Qadr Review", ar: "مراجعة سورة القدر", am: "አል-ቀድር ክለሳ" },
        verseNumbers: [1, 2, 3, 4, 5],
        verseRange: "1–5",
        subtopic: { en: "Reciting Al-Qadr with Presence of Heart", ar: "تلاوة القدر وتدبر أنوارها" },
        arabicText: "إِنَّآ أَنزَلْنَـٰهُ فِى لَيْلَةِ ٱلْقَدْرِ ۝١ وَمَآ أَدْرَىٰكَ مَا لَيْلَةُ ٱلْقَدْرِ ۝٢ لَيْلَةُ ٱلْقَدْرِ خَيْرٌۭ مِّنْ أَلْفِ شَهْرٍۢ ۝٣ تَنَزَّلُ ٱلْمَلَـٰٓئِكَةُ وَٱلرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍۢ ۝٤ سَلَـٰمٌ هِىَ حَتَّىٰ مَطْلَعِ ٱلْفَجْرِ ۝٥",
        transliteration: "Innaaa anzalnaahu fee laylatil-qadr (1) Wa maaa adraaka maa laylatul-qadr (2) Laylatul-qadri khayrum-min alfi shahr (3) Tanazzalul-malaaa'ikatu war-roohu feehaa bi-izhni Rabbihim-min kulli amr (4) Salaamun hiya hattaa matla'il-fajr (5)",
        translationEn: "Indeed, We sent the Quran down during the Night of Decree. And what can make you know what is the Night of Decree? The Night of Decree is better than a thousand months. The angels and the Spirit descend therein by permission of their Lord for every matter. Peace it is until the emergence of dawn."
      }
    }
  },
  12: {
    defaultSurah: 67,
    surahName: { en: "Al-Mulk", ar: "الملك", am: "አል-ሙልክ" },
    dayPartitions: {
      1: {
        verseNumbers: [1, 2, 3, 4],
        verseRange: "1–4",
        subtopic: { en: "Dominion, Life, Death & Cosmic Flawlessness", ar: "تبارك الذي بيده الملك وخلق الموت والحياة" },
        arabicText: "تَبَـٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرٌ ۝١ ٱلَّذِى خَلَقَ ٱلْمَوْتَ وَٱلْحَيَوٰةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًۭا ۚ وَهُوَ ٱلْعَزِيزُ ٱلْغَفُورُ ۝٢ ٱلَّذِى خَلَقَ سَبْعَ سَمَـٰوَٰتٍۢ طِبَاقًۭا ۖ مَّا تَرَىٰ فِى خَلْقِ ٱلرَّحْمَـٰنِ مِن تَفَـٰوُتٍۢ ۖ فَٱرْجِعِ ٱلْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍۢ ۝٣ ثُمَّ ٱرْجِعِ ٱلْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ ٱلْبَصَرُ خَاسِئًۭا وَهُوَ حَسِيرٌۭ ۝٤",
        transliteration: "Tabaarakal-lazhee biyadihil-mulku wa Huwa 'alaa kulli shay'in Qadeer (1) Allazhee khalaqal-mawta wal-hayaata liyabluwakum ayyukum ahsanu 'amalaa; wa Huwal-'Azeezul-Ghafoor (2) Allazhee khalaqa sab'a samaawaatin tibaaqaa; maa taraa fee khalqir-Rahmaani min tafaawut; farji'il-basara hal taraa min futoor (3) Thummarji'il-basara karratayni yanqalib ilaykal-basaru khaasi'anw-wa huwa haseer (4)",
        translationEn: "Blessed is He in whose hand is dominion, and He is over all things competent - [He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving - [And] who created seven heavens in layers. You do not see in the creation of the Most Merciful any inconsistency. So return [your] vision [to the sky]; do you see any breaks? Then return [your] vision twice again. [Your] vision will return to you humbled while it is fatigued."
      },
      2: {
        verseNumbers: [5, 6, 7, 8, 9],
        verseRange: "5–9",
        subtopic: { en: "Lamps of Heaven & The Warning", ar: "مصابيح السماء والتحذير من عذاب السعير" },
        arabicText: "وَلَقَدْ زَيَّنَّا ٱلسَّمَآءَ ٱلدُّنْيَا بِمَصَـٰبِيحَ وَجَعَلْنَـٰهَا رُجُومًۭا لِّلشَّيَـٰطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ ٱلسَّعِيرِ ۝٥ وَلِلَّذِينَ كَفَرُوا۟ بِرَبِّهِمْ عَذَابُ جَهَنَّمَ ۖ وَبِئْسَ ٱلْمَصِيرُ ۝٦ إِذَآ أُلْقُوا۟ فِيهَا سَمِعُوا۟ لَهَا شَهِيقًۭا وَهِىَ تَفُورُ ۝٧ تَكَادُ تَمَيَّزُ مِنَ ٱلْغَيْظِ ۖ كُلَّمَآ أُلْقِىَ فِيهَا فَوْجٌۭ سَأَلَهُمْ خَزَنَتُهَآ أَلَمْ يَأْتِكُمْ نَذِيرٌۭ ۝٨ قَالُوا۟ بَلَىٰ قَدْ جَآءَنَا نَذِيرٌۭ فَكَذَّبْنَا وَقُلْنَا مَا نَزَّلَ ٱللَّهُ مِن شَىْءٍ إِنْ أَنتُمْ إِلَّا فِى ضَلَـٰلٍۢ كَبِيرٍۢ ۝٩",
        transliteration: "Wa laqad zayyannas-samaaa'ad-dunyaa bi-masaabeeha wa ja'alnaahaa rujoomal-lish-shayaateen (5) Wa lillazheena kafaroo bi-Rabbihim 'azhaabu jahannam (6) Izhaaa ulqoo feehaa sami'oo lahaa shaheeqanw-wa hiya tafoor (7) Takaadu tamayyazu minal-ghayz (8) Qaaloo balaa qad jaaa'anaa nazeerun fa-kazzhabnaa (9)",
        translationEn: "And We have certainly beautified the nearest heaven with lamps and have made [from] them what is thrown at the devils and have prepared for them the punishment of the Blaze. And for those who disbelieved in their Lord is the punishment of Hell, and wretched is the destination."
      },
      3: {
        verseNumbers: [10, 11, 12, 13, 14],
        verseRange: "10–14",
        subtopic: { en: "Listening, Reason & The Subtly Aware Creator", ar: "لو كنا نسمع أو نعقل وأسروا قولكم إنه عليم بذات الصدور" },
        arabicText: "وَقَالُوا۟ لَوْ كُنَّا نَسْمَعُ أَوْ نَعْقِلُ مَا كُنَّا فِىٓ أَصْحَـٰبِ ٱلسَّعِيرِ ۝١٠ فَٱعْتَرَفُوا۟ بِذَنۢبِهِمْ فَسُحْقًۭا لِّأَصْحَـٰبِ ٱلسَّعِيرِ ۝١١ إِنَّ ٱلَّذِينَ يَخْشَوْنَ رَبَّهُم بِٱلْغَيْبِ لَهُم مَّغْفِرَةٌۭ وَأَجْرٌۭ كَبِيرٌۭ ۝١٢ وَأَسِرُّوا۟ قَوْلَكُمْ أَوِ ٱجْهَرُوا۟ بِهِۦٓ ۖ إِنَّهُۥ عَلِيمٌۢ بِذَاتِ ٱلصُّدُورِ ۝١٣ أَلَا يَعْلَمُ مَنْ خَلَقَ وَهُوَ ٱللَّطِيفُ ٱلْخَبِيرُ ۝١٤",
        transliteration: "Wa qaaloo law kunnaa nasma'u aw na'qilu maa kunnaa feee as-haabis-sa'eer (10) Fa'tarafoo bi-zambihim fasuhqal-li-as-haabis-sa'eer (11) Innal-lazheena yakhshawna Rabbahum bil-ghaybi lahum maghfiratunw-wa ajrun kabeer (12) Wa asirroo qawlakum awijharoo bih; innahoo 'Aleemum bi-zhaatis-sudoor (13) Alaa ya'lamu man khalaqa wa Huwal-Lateeful-Khabeer (14)",
        translationEn: "And they will say, 'If only we had been listening or reasoning, we would not be among the companions of the Blaze.' And they will admit their sin, so [it is] alienation for the companions of the Blaze. Indeed, those who fear their Lord unseen will have forgiveness and great reward. And conceal your speech or publicize it; indeed, He is Knowing of that within the breasts. Does He who created not know, while He is the Subtle, the Acquainted?"
      },
      4: {
        verseNumbers: [15, 16, 17, 18, 19],
        verseRange: "15–19",
        subtopic: { en: "Walking the Earth & Birds Sustained in Air", ar: "هو الذي جعل لكم الأرض ذلولاً والطيور صافات ويقبضن" },
        arabicText: "هُوَ ٱلَّذِى جَعَلَ لَكُمُ ٱلْأَرْضَ ذَلُولًۭا فَٱمْشُوا۟ فِى مَنَاكِبِهَا وَكُلُوا۟ مِن رِّزْقِهِۦ ۖ وَإِلَيْهِ ٱلنُّشُورُ ۝١٥ ءَأَمِنتُم مَّن فِى ٱلسَّمَآءِ أَن يَخْسِفَ بِكُمُ ٱلْأَرْضَ فَإِذَا هِىَ تَمُورُ ۝١٦ أَمْ أَمِنتُم مَّن فِى ٱلسَّمَآءِ أَن يُرْسِلَ عَلَيْكُمْ حَاصِبًۭا ۖ فَسَتَعْلَمُونَ كَيْفَ نَذِيرِ ۝١٧ وَلَقَدْ كَذَّبَ ٱلَّذِينَ مِن قَبْلِهِمْ فَكَيْفَ كَانَ نَكِيرِ ۝١٨ أَوَلَمْ يَرَوْا۟ إِلَى ٱلطَّيْرِ فَوْقَهُمْ صَـٰٓفَّـٰتٍۢ وَيَقْبِضْنَ ۚ مَا يُمْسِكُهُنَّ إِلَّا ٱلرَّحْمَـٰنُ ۚ إِنَّهُۥ بِكُلِّ شَىْءٍۭ بَصِيرٌ ۝١٩",
        transliteration: "Huwal-lazhee ja'ala lakumul-arda zhaloolan famshoo fee manaakibihaa wa kuloo mir-rizqih; wa ilayhin-nushoor (15) A-amintum man fis-samaaa'i any-yakhsifa bikumul-arda fa-izhaa hiya tamoor (16) Am amintum man fis-samaaa'i any-yursila 'alaykum haasibaa (17) Wa laqad kazzhabal-lazheena min qablihim (18) Awalam yaraw ilat-tayri fawqahum saaaffaaatinw-wa yaqbidn; maa yumsikuhunna illar-Rahmaan; innahoo bi-kulli shay'im Baseer (19)",
        translationEn: "It is He who made the earth tame for you - so walk among its slopes and eat of His provision - and to Him is the resurrection. Do you feel secure that He who [holds authority] in the heaven would not cause the earth to swallow you and suddenly it would sway? ... Do they not see the birds above them with wings outspread and [sometimes] folded in? None holds them [aloft] except the Most Merciful. Indeed, He is of all things Seeing."
      },
      5: {
        verseNumbers: [20, 21, 22, 23, 24],
        verseRange: "20–24",
        subtopic: { en: "Who Can Provide for You? The Upright Walker", ar: "أمن هذا الذي هو جند لكم ومن يمشي مكباً على وجهه" },
        arabicText: "أَمَّنْ هَـٰذَا ٱلَّذِى هُوَ جُندٌۭ لَّكُمْ يَنصُرُكُم مِّن دُونِ ٱلرَّحْمَـٰنِ ۚ إِنِ ٱلْكَـٰفِرُونَ إِلَّا فِى غُرُورٍ ۝٢٠ أَمَّنْ هَـٰذَا ٱلَّذِى يَرْزُقُكُمْ إِنْ أَمْسَكَ رِزْقَهُۥ ۚ بَل لَّجُّوا۟ فِى عُتُوٍّۢ وَنُفُورٍ ۝٢١ أَفَمَن يَمْشِى مُكِبًّا عَلَىٰ وَجْهِهِۦٓ أَهْدَىٰٓ أَمَّن يَمْشِى سَوِيًّا عَلَىٰ صِرَٰطٍۢ مُّسْتَقِيمٍۢ ۝٢٢ قُلْ هُوَ ٱلَّذِىٓ أَنشَأَكُمْ وَجَعَلَ لَكُمُ ٱلسَّمْعَ وَٱلْأَبْصَـٰرَ وَٱلْأَفْـِٔدَةَ ۖ قَلِيلًۭا مَّا تَشْكُرُونَ ۝٢٣ قُلْ هُوَ ٱلَّذِى ذَرَأَكُمْ فِى ٱلْأَرْضِ وَإِلَيْهِ تُحْشَرُونَ ۝٢٤",
        transliteration: "Amman haazhal-lazhee huwa jundul-lakum yansurukum min doonir-Rahmaan (20) Amman haazhal-lazhee yarzuqukum in amsaka rizqah (21) Afamany-yamshee mukibban 'alaa wajhiheee ahdaaa ammany-yamshee sawiyyan 'alaa Siraatim-Mustaqeem (22) Qul Huwal-lazheee ansha'akum wa ja'ala lakumus-sam'a wal-absaara wal-af'idah; qaleelam-maa tashkuroon (23) Qul Huwal-lazhee zhara'akum fil-ardi wa ilayhi tuhsharoon (24)",
        translationEn: "Or who is it that could be an army for you to aid you other than the Most Merciful? The disbelievers are not but in delusion. Or who is it that could provide for you if He withheld His provision? Rather, they have persisted in insolence and aversion. Then is one who walks fallen on his face better guided or one who walks erect on a straight path?"
      },
      6: {
        verseNumbers: [25, 26, 27, 28, 29, 30],
        verseRange: "25–30",
        subtopic: { en: "The Promised Water & Complete Trust", ar: "قل هو الرحمن آمنا به وعليه توكلنا ومن يأتيكم بماء معين" },
        arabicText: "وَيَقُولُونَ مَتَىٰ هَـٰذَا ٱلْوَعْدُ إِن كُنتُمْ صَـٰدِقِينَ ۝٢٥ قُلْ إِنَّمَا ٱلْعِلْمُ عِندَ ٱللَّهِ وَإِنَّمَآ أَنَا۠ نَذِيرٌۭ مُّبِينٌۭ ۝٢٦ فَلَمَّا رَأَوْهُ زُلْفَةًۭ سِيٓـَٔتْ وُجُوهُ ٱلَّذِينَ كَفَرُوا۟ وَقِيلَ هَـٰذَا ٱلَّذِى كُنتُم بِهِۦ تَدَّعُونَ ۝٢٧ قُلْ أَرَءَيْتُمْ إِنْ أَهْلَكَنِىَ ٱللَّهُ وَمَن مَّعِىَ أَوْ رَحِمَنَا فَمَن يُجِيرُ ٱلْكَـٰفِرِينَ مِنْ عَذَابٍ أَلِيمٍۢ ۝٢٨ قُلْ هُوَ ٱلرَّحْمَـٰنُ ءَامَنَّا بِهِۦ وَعَلَيْهِ تَوَكَّلْنَا ۖ فَسَتَعْلَمُونَ مَنْ هُوَ فِى ضَلَـٰلٍۢ مُّبِينٍۢ ۝٢٩ قُلْ أَرَءَيْتُمْ إِنْ أَصْبَحَ مَآؤُكُمْ غَوْرًۭا فَمَن يَأْتِيكُم بِمَآءٍۢ مَّعِينٍۭ ۝٣٠",
        transliteration: "Wa yaqooloona mataa haazhal-wa'du in kuntum saadiqeen (25) Qul innamal-'ilmu 'indal-laahi wa innamaaa ana nazeerum-mubeen (26) Falammaa ra-awhu zulfatan seee'at wujoohul-lazheena kafaroo (27) Qul ara'aytum in ahlakaniyal-laahu wa mam-ma'iya aw rahimanaa (28) Qul Huwar-Rahmaanu aamannaa bihee wa 'alayhi tawakkalnaa (29) Qul ara'aytum in asbaha maaa'ukum ghawran famany-ya'teekum bi-maaa'im-ma'een (30)",
        translationEn: "Say, 'He is the Most Merciful; we have believed in Him, and upon Him we have relied. And you will know who it is that is in clear error.' Say, 'Have you considered: if your water was to become sunken [into the earth], then who could bring you flowing water?'"
      },
      7: {
        verseNumbers: [1, 2, 3, 4],
        verseRange: "1–4",
        subtopic: { en: "Surah Al-Mulk Mastery & Grave Protection", ar: "إتقان تلاوة سورة الملك المنجية من عذاب القبر" },
        arabicText: "تَبَـٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرٌ ۝١ ٱلَّذِى خَلَقَ ٱلْمَوْتَ وَٱلْحَيَوٰةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًۭا ۚ وَهُوَ ٱلْعَزِيزُ ٱلْغَفُورُ ۝٢ ٱلَّذِى خَلَقَ سَبْعَ سَمَـٰوَٰتٍۢ طِبَاقًۭا ۖ مَّا تَرَىٰ فِى خَلْقِ ٱلرَّحْمَـٰنِ مِن تَفَـٰوُتٍۢ ۖ فَٱرْجِعِ ٱلْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍۢ ۝٣ ثُمَّ ٱرْجِعِ ٱلْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ ٱلْبَصَرُ خَاسِئًۭا وَهُوَ حَسِيرٌۭ ۝٤",
        transliteration: "Tabaarakal-lazhee biyadihil-mulku wa Huwa 'alaa kulli shay'in Qadeer (1) Allazhee khalaqal-mawta wal-hayaata liyabluwakum ayyukum ahsanu 'amalaa (2)",
        translationEn: "Blessed is He in whose hand is dominion, and He is over all things competent - [He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving."
      }
    }
  },
  13: {
    defaultSurah: 2,
    surahName: { en: "Al-Baqarah", ar: "البقرة", am: "አል-በቀራህ" },
    dayPartitions: {
      1: {
        verseNumbers: [255],
        verseRange: "255",
        subtopic: { en: "Ayatul Kursi: The Greatest Verse in the Quran", ar: "آية الكرسي: أعظم آية في كتاب الله" },
        arabicText: "ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ ۚ لَّهُۥ مَا فِى ٱلسَّمَـٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍۢ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ ۝٢٥٥",
        transliteration: "Allaahu laaa ilaaha illaa Huwal-Hayyul-Qayyoom; laa ta'khuzuhu sinatunw-wa laa nawm; lahoo maa fis-samaawaati wa maa fil-ard; man zhal-lazhee yashfa'u 'indahooo illaa bi-izhnih; ya'lamu maa bayna aydeehim wa maa khalfahum; wa laa yuheetoona bi-shay'im-min 'ilmiheee illaa bimaa shaaa'; wasi'a Kursiyyuhus-samaawaati wal-ard; wa laa ya'ooduhoo hifzuhumaa; wa Huwal-'Aliyyul-'Azeem (255)",
        translationEn: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great."
      },
      2: {
        verseNumbers: [256],
        verseRange: "256",
        subtopic: { en: "No Compulsion in Religion & The Trustworthy Handhold", ar: "لا إكراه في الدين والعروة الوثقى" },
        arabicText: "لَآ إِكْرَاهَ فِى ٱلدِّينِ ۖ قَد تَّبَيَّنَ ٱلرُّشْدُ مِنَ ٱلْغَىِّ ۚ فَمَن يَكْفُرْ بِٱلطَّـٰغُوتِ وَيُؤْمِنۢ بِٱللَّهِ فَقَدِ ٱسْتَمْسَكَ بِٱلْعُرْوَةِ ٱلْوُثْقَىٰ لَا ٱنفِصَامَ لَهَا ۗ وَٱللَّهُ سَمِيعٌ عَلِيمٌ ۝٢٥٦",
        transliteration: "Laaa ikraaha fid-deeni qat-tabayyanar-rushdu minal-ghayy; famany-yakfur bit-Taaghooti wa yu'mim-billaahi faqadistamsaka bil-'urwatil-wuthqaa lanfisaama lahaa; wallaahu Samee'un 'Aleem (256)",
        translationEn: "There shall be no compulsion in [acceptance of] the religion. The right course has become distinct from the wrong. So whoever disbelieves in Taghut and believes in Allah has grasped the most trustworthy handhold with no break in it. And Allah is Hearing and Knowing."
      },
      3: {
        verseNumbers: [257],
        verseRange: "257",
        subtopic: { en: "Allah is the Protector: From Darkness into Light", ar: "الله ولي الذين آمنوا يخرجهم من الظلمات إلى النور" },
        arabicText: "ٱللَّهُ وَلِىُّ ٱلَّذِينَ ءَامَنُوا۟ يُخْرِجُهُم مِّنَ ٱلظُّلُمَـٰتِ إِلَى ٱلنُّورِ ۖ وَٱلَّذِينَ كَفَرُوٓا۟ أَوْلِيَآؤُهُمُ ٱلطَّـٰغُوتُ يُخْرِجُونَهُم مِّنَ ٱلنُّورِ إِلَى ٱلظُّلُمَـٰتِ ۗ أُو۟لَـٰٓئِكَ أَصْحَـٰبُ ٱلنَّارِ ۖ هُمْ فِيهَا خَـٰلِدُونَ ۝٢٥٧",
        transliteration: "Allaahu Waliyyul-lazheena aamanoo yukhrijuhum-minaz-zulumaati ilan-noor; wallazheena kafarooo awliyaaa'uhumut-Taaghootu yukhrijoonahum-minan-noori ilaz-zulumaat; ulaaa'ika As-haabun-naari hum feehaa khaalidoon (257)",
        translationEn: "Allah is the ally of those who believe. He brings them out from darknesses into the light. And those who disbelieve - their allies are Taghut. They take them out of the light into darknesses. Those are the companions of the Fire; they will abide eternally therein."
      },
      4: {
        verseNumbers: [284],
        verseRange: "284",
        subtopic: { en: "Divine Accountability & Sovereign Forgiveness", ar: "لله ما في السماوات وما في الأرض ومحاسبة النفوس" },
        arabicText: "لِّلَّهِ مَا فِى ٱلسَّمَـٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ وَإِن تُبْدُوا۟ مَا فِىٓ أَنفُسِكُمْ أَوْ تُخْفُوهُ يُحَاسِبْكُم بِهِ ٱللَّهُ ۖ فَيَغْفِرُ لِمَن يَشَآءُ وَيُعَذِّبُ مَن يَشَآءُ ۗ وَٱللَّهُ عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرٌ ۝٢٨٤",
        transliteration: "Lillaahi maa fis-samaawaati wa maa fil-ard; wa in tubdoo maa feee anfusikum aw tukhfoohu yuhaasibkum bihil-laah; fayaghfiru limany-yashaaa'u wa yu'azzhibu many-yashaaa'; wallaahu 'alaa kulli shay'in Qadeer (284)",
        translationEn: "To Allah belongs whatever is in the heavens and whatever is in the earth. Whether you show what is within yourselves or conceal it, Allah will bring you to account for it. Then He will forgive whom He wills and punish whom He wills, and Allah is over all things competent."
      },
      5: {
        verseNumbers: [285],
        verseRange: "285",
        subtopic: { en: "Amanar-Rasool: The Creed of the Believers", ar: "آمن الرسول بما أنزل إليه من ربه والمؤمنون" },
        arabicText: "ءَامَنَ ٱلرَّسُولُ بِمَآ أُنزِلَ إِلَيْهِ مِن رَّبِّهِۦ وَٱلْمُؤْمِنُونَ ۚ كُلٌّ ءَامَنَ بِٱللَّهِ وَمَلَـٰٓئِكَتِهِۦ وَكُتُبِهِۦ وَرُسُلِهِۦ لَا نُفَرِّقُ بَيْنَ أَحَدٍۢ مِّن رُّسُلِهِۦ ۚ وَقَالُوا۟ سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ ٱلْمَصِيرُ ۝٢٨٥",
        transliteration: "Aamanar-Rasoolu bimaaa unzila ilayhi mir-Rabbihee wal-mu'minoon; kullun aamana billaahi wa malaaa'ikatihee wa Kutubihee wa Rusulih; laa nufarriqu bayna ahadim-mir-Rusulih; wa qaaloo sami'naa wa ata'naa ghufraanaka Rabbanaa wa ilaykal-maseer (285)",
        translationEn: "The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers. All of them have believed in Allah and His angels and His books and His messengers, [saying], 'We make no distinction between any of His messengers.' And they say, 'We hear and we obey. [We seek] Your forgiveness, our Lord, and to You is the [final] destination.'"
      },
      6: {
        verseNumbers: [286],
        verseRange: "286",
        subtopic: { en: "La Yukalliful-lah: The Greatest Dua of Relief", ar: "لا يكلف الله نفساً إلا وسعها — دعاء الفرج والرحمة" },
        arabicText: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا ٱكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَآ إِن نَّسِينَآ أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَآ إِصْرًۭا كَمَا حَمَلْتَهُۥ عَلَى ٱلَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِۦ ۖ وَٱعْفُ عَنَّا وَٱغْفِرْ لَنَا وَٱرْحَمْنَآ ۚ أَنتَ مَوْلَىٰنَا فَٱنصُرْنَا عَلَى ٱلْقَوْمِ ٱلْكَـٰفِرِينَ ۝٢٨٦",
        transliteration: "Laa yukalliful-laahu nafsan illaa wus'ahaa; lahaa maa kasabat wa 'alayhaa maktasabat; Rabbanaa laa tu'aakhizhnaaa in naseenaaa aw akhta'naa; Rabbanaa wa laa tahmil 'alaynaaa isran kamaa hamaltahoo 'alal-lazheena min qablinaa; Rabbanaa wa laa tuhammilnaa maa laa taaqata lanaa bih; wa'fu 'annaa waghfir lanaa warhamnaaa; Anta Mawlaanaa fansurnaa 'alal-qawmil-kaafireen (286)",
        translationEn: "Allah does not charge a soul except [with that within] its capacity. It will have [the consequence of] what [good] it has gained, and it will bear [the consequence of] what [evil] it has earned. 'Our Lord, do not impose blame upon us if we have forgotten or erred. Our Lord, and lay not upon us a burden like that which You laid upon those before us. Our Lord, and burden us not with that which we have no ability to bear. And pardon us; and forgive us; and have mercy upon us. You are our protector, so give us victory over the disbelieving people.'"
      },
      7: {
        verseNumbers: [284, 285, 286],
        verseRange: "284–286",
        subtopic: { en: "Khawateem Al-Baqarah: Night Sufficiency", ar: "خواتيم سورة البقرة كاملة — من قرأهما في ليلة كفتاه" },
        arabicText: "ءَامَنَ ٱلرَّسُولُ بِمَآ أُنزِلَ إِلَيْهِ مِن رَّبِّهِۦ وَٱلْمُؤْمِنُونَ ۚ كُلٌّ ءَامَنَ بِٱللَّهِ وَمَلَـٰٓئِكَتِهِۦ وَكُتُبِهِۦ وَرُسُلِهِۦ لَا نُفَرِّقُ بَيْنَ أَحَدٍۢ مِّن رُّسُلِهِۦ ۚ وَقَالُوا۟ سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ ٱلْمَصِيرُ ۝٢٨٥ لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا ٱكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَآ إِن نَّسِينَآ أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَآ إِصْرًۭا كَمَا حَمَلْتَهُۥ عَلَى ٱلَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِۦ ۖ وَٱعْفُ عَنَّا وَٱغْفِرْ لَنَا وَٱرْحَمْنَآ ۚ أَنتَ مَوْلَىٰنَا فَٱنصُرْنَا عَلَى ٱلْقَوْمِ ٱلْكَـٰفِرِينَ ۝٢٨٦",
        transliteration: "Aamanar-Rasoolu bimaaa unzila ilayhi mir-Rabbihee wal-mu'minoon... Laa yukalliful-laahu nafsan illaa wus'ahaa... wa'fu 'annaa waghfir lanaa warhamnaaa; Anta Mawlaanaa fansurnaa 'alal-qawmil-kaafireen",
        translationEn: "The final two verses of Surah Al-Baqarah: 'Whoever recites them at night, they will suffice him.' (Bukhari & Muslim)"
      }
    }
  }
};

// Generative resolution function that ensures accurate Surah and Ayah mapping for any day of the 365 days
export function getDayLesson(dayNum: number): DayLesson {
  const day = Math.max(1, Math.min(365, dayNum));
  const dbEntry = QURAN_VERSES_DB[String(day)];

  if (ANCHOR_DAY_LESSONS[day]) {
    const anchor = ANCHOR_DAY_LESSONS[day];
    return {
      ...anchor,
      surahNumber: dbEntry ? dbEntry.surahNumber : anchor.surahNumber,
      verseRange: dbEntry ? dbEntry.verseRange : anchor.verseRange,
      verseNumbers: dbEntry ? dbEntry.verseNumbers : anchor.verseNumbers,
      recitation: {
        ...anchor.recitation,
        arabicText: dbEntry ? dbEntry.arabicText : anchor.recitation.arabicText,
        transliteration: dbEntry ? dbEntry.transliteration : anchor.recitation.transliteration,
        ayahs: dbEntry?.ayahs || anchor.recitation.ayahs || []
      }
    };
  }

  // Calculate week and quarter
  const weekNumber = Math.min(52, Math.floor((day - 1) / 7) + 1);
  const quarter: PlanQuarter = day <= 91 ? 1 : day <= 182 ? 2 : day <= 273 ? 3 : 4;
  const weekMeta = WEEKS_SYLLABUS.find(w => w.weekNumber === weekNumber) || WEEKS_SYLLABUS[0];
  const dayInWeek = ((day - 1) % 7) + 1;

  const category: PlanCategory = weekMeta.category;
  const weekSpec = WEEK_SYLLABUS_SPECS[weekNumber];

  if (weekSpec && weekSpec.dayPartitions[dayInWeek]) {
    const partition = weekSpec.dayPartitions[dayInWeek];
    const surahNum = dbEntry ? dbEntry.surahNumber : (partition.surahNumber || weekSpec.defaultSurah);
    const surahName = dbEntry ? {
      en: dbEntry.surahName.en,
      ar: dbEntry.surahName.ar,
      am: dbEntry.surahName.am
    } : (partition.surahName || weekSpec.surahName);
    const calculatedVerseRange = dbEntry ? dbEntry.verseRange : partition.verseRange;
    const calculatedVerseNumbers = dbEntry ? dbEntry.verseNumbers : partition.verseNumbers;
    const firstVerse = calculatedVerseNumbers[0] || 1;

    return {
      dayNumber: day,
      weekNumber,
      quarter,
      category,
      surahNumber: surahNum,
      surahName,
      verseRange: calculatedVerseRange,
      verseNumbers: calculatedVerseNumbers,
      title: {
        en: `Day ${day}: ${partition.subtopic.en}`,
        ar: `اليوم ${day}: ${partition.subtopic.ar}`,
        am: `ቀን ${day}: ${partition.subtopic.en}`,
        har: `ቀን ${day}: ${partition.subtopic.en}`
      },
      subtitle: {
        en: `${surahName.en} ${calculatedVerseRange} • Day ${day} of 365 • 20 Min Daily Routine`,
        ar: `${surahName.ar} الآيات ${calculatedVerseRange} • اليوم ${day} من ٣٦٥ • ٢٠ دقيقة يومياً`
      },
      recitation: {
        arabicText: dbEntry ? dbEntry.arabicText : partition.arabicText,
        transliteration: dbEntry ? dbEntry.transliteration : partition.transliteration,
        audioUrl: getEveryAyahUrl(surahNum, firstVerse, 'Alafasy_128kbps'),
        recommendedReciterId: "mishary",
        ayahs: dbEntry?.ayahs || [],
        tajweedFocus: {
          ruleName: {
            en: partition.tajweedRule?.en || "Tajweed Articulation & Precise Stopping",
            ar: partition.tajweedRule?.ar || "مخارج الحروف والوقف التام"
          },
          description: {
            en: "Recite with tartil, giving each letter its right of elongation and clarity at the end of each Ayah.",
            ar: "القراءة بترتيل مع توفية الحروف حقها ومستحقها ومراعاة الوقف عند رؤوس الآيات."
          },
          exampleVerseKey: `${surahName.en} (${partition.verseRange})`,
          practicalTip: {
            en: partition.tajweedRule?.tip || "Keep your breath steady and observe the natural vowel lengths.",
            ar: "حافظ على توازن النفس والمدود الطبيعية دون تكلف."
          }
        }
      },
      understanding: {
        translation: {
          en: partition.translationEn,
          ar: partition.arabicText,
          am: partition.translationEn,
          har: partition.translationEn
        },
        vocabulary: partition.vocabulary ? [
          {
            word: partition.vocabulary.word,
            arabic: partition.vocabulary.arabic,
            root: partition.vocabulary.root,
            transliteration: partition.vocabulary.word,
            meaning: {
              en: partition.vocabulary.meaning,
              ar: partition.vocabulary.meaning,
              am: partition.vocabulary.meaning,
              har: partition.vocabulary.meaning
            },
            occurrencesInQuran: 10
          }
        ] : [
          {
            word: "Huda",
            arabic: "هُدًى",
            root: "ه-د-ي (H-D-Y)",
            transliteration: "Hudaa",
            meaning: {
              en: "Divine guidance that illuminates the heart and clarifies life's highest purpose.",
              ar: "البيان والدلالة والتوفيق إلى الصراط المستقيم.",
              am: "ቀጥተኛ መመሪያ",
              har: "ቀጥተኛ መመሪያ"
            },
            occurrencesInQuran: 85
          }
        ],
        tafsirSummary: {
          en: `In Day ${day} of your Quran mastery journey, you reflect upon ${surahName.en} (${partition.verseRange}). This passage instills spiritual awareness, clarity of faith, and moral fortitude.`,
          ar: `في اليوم ${day} من رحلتك القرآنية، تتمحور التلاوة حول ${surahName.ar} (الآيات ${partition.verseRange}). تجسد هذه الآيات معاني الإيمان واليقين وخشوع القلب.`
        },
        thematicContext: {
          en: `Week ${weekNumber} (${weekMeta.weekNumber}/52). Core themes: ${weekMeta.keyThemes.join(', ')}.`,
          ar: `الأسبوع ${weekNumber} من السنة الدراسية. المحاور: ${weekMeta.keyThemes.join('، ')}.`
        }
      },
      reflection: {
        reflectionPrompt: {
          en: `Reflecting on Day ${day} (${surahName.en} ${partition.verseRange}): How do these sacred words guide your actions, speech, and intentions today?`,
          ar: `تأمل يومك الـ ${day} (${surahName.ar}): كيف تنعكس معاني هذه الآيات المباركة على تعاملك وقراراتك اليوم؟`,
          am: `በቀን ${day} ላይ በማሰላሰል፡ የዛሬው የቁርአን ክፍል በዕለት ተዕለት ሕይወትዎ ውስጥ ምን ትምህርት ይሰጥዎታል?`
        },
        dailyActionCommitment: {
          en: `Put the teaching of ${surahName.en} into practice through heartfelt prayer and helping someone around you.`,
          ar: `تطبيق هدايات ${surahName.ar} بالإحسان والذكر والدعاء الصادق.`
        },
        quranicDua: {
          arabic: "رَبَّنَا تَقَبَّلْ مِنَّا ۖ إِنَّكَ أَنتَ ٱلسَّمِيعُ ٱلْعَلِيمُ وَتُبْ عَلَيْنَآ ۖ إِنَّكَ أَنتَ ٱلتَّوَّابُ ٱلرَّحِيمُ",
          transliteration: "Rabbanaa taqabbal minnaa innaka Antas-Samee'ul-'Aleem, wa tub 'alaynaaa innaka Antat-Tawwaabur-Raheem",
          translation: {
            en: "Our Lord, accept [this] from us. Indeed You are the Hearing, the Knowing. And accept our repentance. Indeed You are the Accepting of repentance, the Merciful.",
            ar: "ربنا تقبل منا إنك أنت السميع العليم وتب علينا إنك أنت التواب الرحيم (البقرة ١٢٧–١٢٨)."
          },
          reference: "Surah Al-Baqarah (2:127–128)"
        },
        retentionQuiz: {
          question: {
            en: `What is the central theme of ${surahName.en} (${partition.verseRange})?`,
            ar: `ما هو المحور الأساسي لآيات اليوم من ${surahName.ar}؟`
          },
          options: [
            {
              text: {
                en: partition.subtopic.en,
                ar: partition.subtopic.ar
              },
              isCorrect: true,
              explanation: {
                en: "These verses illuminate this profound guidance.",
                ar: "هذا هو المعنى البياني الجوهري للآيات المباركة."
              }
            },
            {
              text: {
                en: "Unrelated philosophical debate",
                ar: "جدال نظري لا يرتبط بالعمل"
              },
              isCorrect: false,
              explanation: {
                en: "The Quran is practical divine guidance for heart and action.",
                ar: "القرآن كتاب هداية وعمل وتزكية."
              }
            }
          ]
        }
      }
    };
  }

  // Authentic resolution from 365-day Quran verses database
  const matchedSurahNum = dbEntry ? dbEntry.surahNumber : 1;
  const surahDisplayName = dbEntry ? {
    en: dbEntry.surahName.en,
    ar: dbEntry.surahName.ar,
    am: dbEntry.surahName.am
  } : {
    en: weekMeta.surahFocus.split('(')[0].trim(),
    ar: weekMeta.title.ar.split('—')[0].trim().replace(/^سورة\s+/, ''),
    am: weekMeta.title.am.split('—')[0].trim()
  };

  const calculatedVerseRange = dbEntry ? dbEntry.verseRange : "1";
  const assignedVerseNumbers = dbEntry ? dbEntry.verseNumbers : [1];
  const realArabicText = dbEntry ? dbEntry.arabicText : "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
  const realTransliteration = dbEntry ? dbEntry.transliteration : `Surah ${surahDisplayName.en} • Verses ${calculatedVerseRange}`;
  const realTranslation = dbEntry ? dbEntry.translationEn : `Daily Quran study for ${surahDisplayName.en} (${calculatedVerseRange}).`;
  const realAyahs = dbEntry ? dbEntry.ayahs : [];

  return {
    dayNumber: day,
    weekNumber,
    quarter,
    category,
    surahNumber: matchedSurahNum,
    surahName: surahDisplayName,
    verseRange: calculatedVerseRange,
    verseNumbers: assignedVerseNumbers,
    title: {
      en: `Day ${day}: ${surahDisplayName.en} (${calculatedVerseRange})`,
      ar: `اليوم ${day}: ${surahDisplayName.ar} (الآيات ${calculatedVerseRange})`,
      am: `ቀን ${day}: ${surahDisplayName.am} (${calculatedVerseRange})`,
      har: `ቀን ${day}: ${surahDisplayName.am} (${calculatedVerseRange})`
    },
    subtitle: {
      en: `${surahDisplayName.en} ${calculatedVerseRange} • Day ${day} of 365 • 20 Min Daily Routine`,
      ar: `${surahDisplayName.ar} الآيات ${calculatedVerseRange} • اليوم ${day} من ٣٦٥ • ٢٠ دقيقة يومياً`
    },
    recitation: {
      arabicText: realArabicText,
      transliteration: realTransliteration,
      audioUrl: getEveryAyahUrl(matchedSurahNum, assignedVerseNumbers[0] || 1, 'Alafasy_128kbps'),
      recommendedReciterId: "mishary",
      ayahs: realAyahs,
      tajweedFocus: {
        ruleName: {
          en: "Tartil & Clear Articulation",
          ar: "الترتيل ومخارج الحروف الصحيحة"
        },
        description: {
          en: "Recite at a calm, deliberate pace, honoring each letter's qualities and observing pause signs.",
          ar: "القراءة بتمهل وتؤدة مع إعطاء كل حرف حقه ومستحقه ومراعاة علامات الوقف."
        },
        exampleVerseKey: `${surahDisplayName.en} (${calculatedVerseRange})`,
        practicalTip: {
          en: "Pronounce throat letters with relaxation and avoid rushing between words.",
          ar: "أخرج حروف الحلق براحة وسلاسة دون شدة مفرطة."
        }
      }
    },
    understanding: {
      translation: {
        en: realTranslation,
        ar: realArabicText,
        am: realTranslation,
        har: realTranslation
      },
      vocabulary: [
        {
          word: "Al-Haqq",
          arabic: "الْحَقُّ",
          root: "ح-ق-ق (H-Q-Q)",
          transliteration: "Al-Haqq",
          meaning: {
            en: "The Absolute Truth, enduring reality, and justice that never wavers.",
            ar: "الحق الثابت الذي لا ريب فيه ولا زوال له.",
            am: "እውነተኛ",
            har: "እውነተኛ"
          },
          occurrencesInQuran: 227
        }
      ],
      tafsirSummary: {
        en: `In Day ${day} of your Quran journey, study focuses on ${surahDisplayName.en} (${calculatedVerseRange}). Cultivate deep reflection upon the divine message.`,
        ar: `في اليوم ${day} من السنة المباركة، يتمحور الدرس حول سورة ${surahDisplayName.ar} (الآيات ${calculatedVerseRange}).`
      },
      thematicContext: {
        en: `Part of Week ${weekNumber} (${weekMeta.weekNumber}/52). Core topics: ${weekMeta.keyThemes.join(', ')}.`,
        ar: `ضمن الأسبوع ${weekNumber} من السنة الدراسية. المحاور الرئيسية: ${weekMeta.keyThemes.join('، ')}.`
      }
    },
    reflection: {
      reflectionPrompt: {
        en: `Reflecting on Day ${day} (${surahDisplayName.en} ${calculatedVerseRange}): How can you apply the timeless values of these verses to your current life?`,
        ar: `تأمل يومك الـ ${day} (${surahDisplayName.ar}): كيف تطبق معاني هذه الآيات في حياتك اليومية؟`,
        am: `በቀን ${day} ላይ በማሰላሰል፡ የዛሬውን ትምህርት በህይወትዎ ውስጥ እንዴት ተግባራዊ ያደርጉታል?`
      },
      dailyActionCommitment: {
        en: `Share one meaningful insight from ${surahDisplayName.en} with someone or apply it in your deeds today.`,
        ar: `تطبيق هداية واحدة من آيات اليوم في عمل صالح أو صلة رحم.`
      },
      quranicDua: {
        arabic: "رَبِّ زِدْنِى عِلْمًۭا",
        transliteration: "Rabbi zidnee 'ilmaa",
        translation: {
          en: "My Lord, increase me in knowledge.",
          ar: "رب زدني علماً (طه ١١٤)."
        },
        reference: "Surah Ta-Ha (20:114)"
      },
      retentionQuiz: {
        question: {
          en: `Which Surah is the focus of Day ${day} of your learning voyage?`,
          ar: `ما هي السورة التي يرتكز عليها درس اليوم ${day}؟`
        },
        options: [
          {
            text: {
              en: `Surah ${surahDisplayName.en} (${calculatedVerseRange})`,
              ar: `سورة ${surahDisplayName.ar} (الآيات ${calculatedVerseRange})`
            },
            isCorrect: true,
            explanation: {
              en: `Today's portion is specifically dedicated to ${surahDisplayName.en}.`,
              ar: `درس اليوم مخصص لتلاوة وتدبر هذه الآيات المباركة.`
            }
          },
          {
            text: {
              en: "Random historical study",
              ar: "دراسة تاريخية عشوائية"
            },
            isCorrect: false,
            explanation: {
              en: "The curriculum follows a systematic weekly progression.",
              ar: "المنهج مبني على تتابع أسبوعي منتظم ومتقن."
            }
          }
        ]
      }
    }
  };
}

export interface UserPlanState {
  currentDay: number;
  completedDays: number[]; // e.g. [1, 2, 3]
  streak: number;
  lastCompletedDate: string;
  totalMinutesLearned: number;
  level: LearningLevel;
  primaryGoal: 'fluency_tajweed' | 'vocabulary_tafsir' | 'memorization' | 'spiritual_habit';
  dailyReminderTime: 'fajr' | 'dhuhr' | 'asr_maghrib' | 'isha';
  hasCompletedOnboarding: boolean;
  notesByDay: Record<number, string>;
  bookmarks: number[];
}

export const DEFAULT_USER_PLAN_STATE: UserPlanState = {
  currentDay: 1,
  completedDays: [],
  streak: 0,
  lastCompletedDate: '',
  totalMinutesLearned: 0,
  level: 'intermediate',
  primaryGoal: 'vocabulary_tafsir',
  dailyReminderTime: 'fajr',
  hasCompletedOnboarding: false,
  notesByDay: {},
  bookmarks: []
};

export interface QuranReciterOption {
  id: string;
  name: string;
  arabicName: string;
  style: string;
}

export const QURAN_RECITERS: QuranReciterOption[] = [
  { id: 'Alafasy_128kbps', name: 'Mishary Rashid Alafasy', arabicName: 'مشاري راشد العفاسي', style: 'Clear & Melodious' },
  { id: 'Minshawy_Murattal_128kbps', name: 'Mohamed Siddiq Al-Minshawi', arabicName: 'محمد صديق المنشاوي', style: 'Classic Tartil & Tajweed' },
  { id: 'Husary_128kbps', name: 'Mahmoud Khalil Al-Husary', arabicName: 'محمود خليل الحصري', style: 'Master of Articulation' },
  { id: 'Abdul_Basit_Murattal_192kbps', name: 'Abdul Basit Abdul Samad', arabicName: 'عبد الباسط عبد الصمد', style: 'Iconic Reverence' },
  { id: 'Maher_AlMuaiqly_64kbps', name: 'Maher Al-Muaiqly', arabicName: 'ماهر المعيقلي', style: 'Imam of Haram Makkah' },
  { id: 'Abu_Bakr_Ash-Shaatree_128kbps', name: 'Abu Bakr Al-Shatri', arabicName: 'أبو بكر الشاطري', style: 'Warm & Calming' }
];

export function getEveryAyahUrl(surahNum: number, verseNum: number, reciterId: string = 'Alafasy_128kbps'): string {
  const s = String(surahNum || 1).padStart(3, '0');
  const v = String(verseNum || 1).padStart(3, '0');
  return `https://everyayah.com/data/${reciterId}/${s}${v}.mp3`;
}
