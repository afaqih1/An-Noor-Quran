import { TafsirIbnKathirDetail, CURATED_IBN_KATHIR_EXEGESIS } from './tafsirIbnKathirData';

export interface VerseKeyword {
  id: string;
  word: string;
  arabic: string;
  root: string;
  rootTransliteration: string;
  morphology: {
    en: string;
    ar: string;
  };
  meaning: {
    en: string;
    ar: string;
    am: string;
  };
  expansions: string[];
}

export interface QuranSegment {
  id: string;
  moduleId: string;
  label: string;
  labelAr: string;
  surahNumber: number;
  verseNumber: number;
  arabicText: string;
  transliteration: string;
  translation: {
    en: string;
    ar: string;
    am: string;
  };
  explanation: {
    en: string;
    ar: string;
    am: string;
  };
  tafsirIbnKathir?: TafsirIbnKathirDetail;
  audioUrl: string;
  keywords: VerseKeyword[];
}

export interface ThematicPillar {
  id: string;
  titleEn: string;
  titleAr: string;
  titleAm: string;
  descriptionEn: string;
  descriptionAr: string;
  descriptionAm: string;
}

export interface QuranModule {
  id: string;
  title: string;
  titleAr: string;
  titleAm: string;
  subtitle: string;
  subtitleAr: string;
  subtitleAm: string;
  orderIndex: number;
  surahNumber: number;
  revelationType: 'Meccan' | 'Medinan';
  totalVerses: number;
  themeColor: 'emerald' | 'amber' | 'blue' | 'purple' | 'rose' | 'teal';
  description: string;
  descriptionAr: string;
  descriptionAm: string;
  thematicPillars: ThematicPillar[];
  studyObjectives: {
    en: string;
    ar: string;
    am: string;
  }[];
  curatedAiAnalysis: {
    overviewEn: string;
    overviewAr: string;
    overviewAm: string;
    linguisticEloquenceEn: string;
    linguisticEloquenceAr: string;
    linguisticEloquenceAm: string;
    practicalApplicationEn: string;
    practicalApplicationAr: string;
    practicalApplicationAm: string;
  };
  segments: QuranSegment[];
}

export const QURAN_STUDY_MODULES: QuranModule[] = [
  {
    id: 'mod-fatiha',
    title: 'Surah Al-Fatiha (The Opening)',
    titleAr: 'سورة الفاتحة (أم الكتاب)',
    titleAm: 'ሱረቱል ፋቲሃ (የቁርአን መክፈቻ)',
    subtitle: 'The Mother of the Quran & Foundation of Daily Prayer',
    subtitleAr: 'أم القرآن وأساس الصلاة والإيمان والتوحيد',
    subtitleAm: 'የቁርአን እናት እና የዕለት ተዕለት ሶላት መሰረት',
    orderIndex: 1,
    surahNumber: 1,
    revelationType: 'Meccan',
    totalVerses: 7,
    themeColor: 'emerald',
    description: 'Al-Fatiha is the quintessential summary of the Quran, recited at least 17 times daily in obligatory prayers. It establishes the foundational covenant between mankind and the Almighty: recognizing God as the sole Sovereign and Merciful Creator, and supplicating for guidance along the Straight Path.',
    descriptionAr: 'الفاتحة هي ملخص القرآن الكريم وأعظم سورة فيه، تُقرأ في كل ركعة من الصلاة. تؤسس العهد بين العبد وربه: الاعتراف بربوبية الله ورحمته، وإفراده بالعبادة والاستعانة، وطلب الهداية للصراط المستقيم.',
    descriptionAm: 'ሱረቱል ፋቲሃ የቁርአን አጠቃላይ ማጠቃለያ ሲሆን በቀን ቢያንስ 17 ጊዜ በሶላት ውስጥ ይነበባል። በአላህና በባሪያው መካከል ያለውን ቃል ኪዳን ያስቀምጣል።',
    thematicPillars: [
      {
        id: 'tp-1-1',
        titleEn: 'Tawheed & Divine Praise (Al-Hamd)',
        titleAr: 'التوحيد والحمد لله رب العالمين',
        titleAm: 'ተውሂድ እና ለአላህ ምስጋና ማቅረብ',
        descriptionEn: 'All intrinsic praise and gratitude belongs exclusively to Allah, Lord and Sustainer of all realms of existence.',
        descriptionAr: 'الحمد والثناء المطلق لله وحده، الخالق المدبر لجميع العوالم والمخلوقات.',
        descriptionAm: 'ምስጋና ሁሉ ለአለማት ጌታና ፈጣሪ ለሆነው አላህ ብቻ የተገባ ነው።'
      },
      {
        id: 'tp-1-2',
        titleEn: 'All-Encompassing Mercy & Justice',
        titleAr: 'الرحمة الشاملة والعدل الإلهي',
        titleAm: 'የአላህ እዝነት እና ፍትህ',
        descriptionEn: 'Balanced affirmation of God as both the Most Merciful in this world and the Sovereign Judge on the Day of Recompense.',
        descriptionAr: 'الجمع بين الرحمة الواسعة في الدنيا والآخرة والعدل المطلق يوم الدين والحساب.',
        descriptionAm: 'አላህ በአኺራ የፍርድ ቀን ንጉስና በዱንያም እጅግ ሩህሩህ መሆኑን ማረጋገጥ።'
      },
      {
        id: 'tp-1-3',
        titleEn: 'Exclusive Worship & Guidance',
        titleAr: 'إفراد العبادة وطلب الهداية للصراط المستقيم',
        titleAm: 'አላህን ብቻ ማምለክ እና ቅን መንገድን መለመን',
        descriptionEn: 'Directing all acts of worship and reliance solely to Allah, while requesting guidance along the unwavering path of truth.',
        descriptionAr: 'تخصيص العبادة والاستعانة بالله وحده، والتضرع بالهداية لطريق الصالحين المنعم عليهم.',
        descriptionAm: 'አምልኮን ለአላህ ብቻ ማድረግ እና ወደ ቀጥተኛው መንገድ እንዲመራን መለመን።'
      }
    ],
    studyObjectives: [
      {
        en: 'Understand the linguistic difference between Al-Rahman (universal mercy) and Al-Raheem (special mercy).',
        ar: 'فهم الفرق اللغوي والدلالي بين اسمي الله (الرحمن) ذي الرحمة العامة و(الرحيم) ذي الرحمة الخاصة.',
        am: 'በአር-ረህማን (አጠቃላይ እዝነት) እና በአር-ረሂም (ልዩ እዝነት) መካከል ያለውን ልዩነት መረዳት።'
      },
      {
        en: 'Master the correct Tajweed articulation of the opening verses and their pauses.',
        ar: 'إتقان النطق الصحيح وأحكام التجويد ومواضع الوقف في قراءة سورة الفاتحة.',
        am: 'የፋቲሃን አንቀጾች ትክክለኛ የተጅዊድ አነባበብ ማወቅ።'
      },
      {
        en: 'Examine how Al-Fatiha encapsulates every theological theme of the Holy Quran.',
        ar: 'دراسة كيف تجمع سورة الفاتحة جميع مقاصد ومحاور القرآن الكريم العقدية والأخلاقية.',
        am: 'ሱረቱል ፋቲሃ የቁርአንን ዋና ዋና አስተምህሮቶች እንዴት እንደሚያጠቃልል መገንዘብ።'
      }
    ],
    curatedAiAnalysis: {
      overviewEn: 'Surah Al-Fatiha represents a structured divine dialogue. In an authentic Hadith Qudsi, Allah states: "I have divided prayer between Myself and My servant into two halves." The first three verses glorify Allah, verse 4 represents mutual covenant, and verses 5-7 express the servant\'s supplication.',
      overviewAr: 'تمثل سورة الفاتحة حواراً ربانياً منظماً. في الحديث القدسي: (قسمت الصلاة بيني وبين عبدي نصفين)، حيث تمجد الآيات الثلاث الأولى الخالق، وتمثل الآية الرابعة ميثاق العبودية، والآيات الأخيرة دعاء العبد بالهداية.',
      overviewAm: 'ሱረቱል ፋቲሃ በአላህና በባሪያው መካከል ያለውን ንግግር ያሳያል። የመጀመሪያዎቹ አንቀጾች አላህን ያወድሳሉ፣ ቀጣዮቹ ደግሞ የባሪያውን ጸሎት ያቀርባሉ።',
      linguisticEloquenceEn: 'The choice of noun phrase "Al-Hamdu Lillah" rather than a verb phrase conveys permanence and eternality—praise is established for Allah regardless of whether a creation exists to praise Him.',
      linguisticEloquenceAr: 'اختيار الجملة الاسمية (الحمد لله) بدلاً من الفعلية يفيد الثبات والدوام والاستمرار، فالحمد ثابت لله تعالى أزلاً وأبداً بغض النظر عن وجود الحامدين.',
      linguisticEloquenceAm: 'አል-ሀምዱ ሊላህ የሚለው ቃል ዘላለማዊ ምስጋናን ያመለክታል።',
      practicalApplicationEn: 'When reciting in prayer, pause briefly after each verse to experience the conscious reality that Allah is responding to your praise and supplication.',
      practicalApplicationAr: 'عند تلاوتها في الصلاة، يُستحب الوقوف عند رأس كل آية لاستشعار إجابة الله تعالى للعبد ومناجاته.',
      practicalApplicationAm: 'በሶላት ውስጥ ሲያነቡ እያንዳንዱን አንቀጽ ካነበቡ በኋላ አላህ መልስ እየሰጠዎት መሆኑን ያስታውሱ።'
    },
    segments: [
      {
        id: 'seg-1-1',
        moduleId: 'mod-fatiha',
        label: 'Ayah 1 • Basmalah',
        labelAr: 'الآية ١ • البسملة',
        surahNumber: 1,
        verseNumber: 1,
        arabicText: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
        transliteration: 'Bismillaahir Rahmaanir Raheem',
        translation: {
          en: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
          ar: 'أبتدئ قراءتي باسم الله، الرحمن الذي وسعت رحمته كل شيء، الرحيم بالمؤمنين.',
          am: 'በአላህ ስም እጅግ በጣም ሩህሩህ በጣም አዛኝ በሆነው።'
        },
        explanation: {
          en: CURATED_IBN_KATHIR_EXEGESIS['1:1'].summaryEn,
          ar: CURATED_IBN_KATHIR_EXEGESIS['1:1'].summaryAr,
          am: CURATED_IBN_KATHIR_EXEGESIS['1:1'].summaryAm
        },
        tafsirIbnKathir: CURATED_IBN_KATHIR_EXEGESIS['1:1'],
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3',
        keywords: [
          {
            id: 'kw-1-1-1',
            word: 'Bismi',
            arabic: 'بِسْمِ',
            root: 'س-م-و',
            rootTransliteration: 'S-M-W',
            morphology: {
              en: 'Preposition + Noun (In the name of)',
              ar: 'حرف جر + اسم مجرور (باسم)'
            },
            meaning: {
              en: 'In the name of / By the authority of',
              ar: 'باسم / مستعيناً باسم',
              am: 'በስም'
            },
            expansions: [
              'Ism (name): Derived from sumuw (elevation/height), designating an elevated identity.',
              'The letter Ba indicates seeking help and blessings (Istiaanah).'
            ]
          },
          {
            id: 'kw-1-1-2',
            word: 'Allah',
            arabic: 'ٱللَّهِ',
            root: 'أ-ل-ه',
            rootTransliteration: 'A-L-H',
            morphology: {
              en: 'Proper Divine Name (Al-Ism Al-A\'zam)',
              ar: 'لفظ الجلالة (الاسم الأعظم)'
            },
            meaning: {
              en: 'The One True God',
              ar: 'الله المعبود بحق وحده',
              am: 'አላህ (እውነተኛው አምላክ)'
            },
            expansions: [
              'The Supreme Name to which all other divine attributes belong.',
              'Root A-L-H signifies one who is adored and worshipped with love and reverence.'
            ]
          },
          {
            id: 'kw-1-1-3',
            word: 'Ar-Rahman',
            arabic: 'ٱلرَّحْمَٰنِ',
            root: 'ر-ح-م',
            rootTransliteration: 'R-H-M',
            morphology: {
              en: 'Intensive Adjective (Fa\'laan pattern)',
              ar: 'صيغة مبالغة على وزن (فَعْلَان)'
            },
            meaning: {
              en: 'The Entirely / All-Encompassing Merciful',
              ar: 'الذي وسعت رحمته جميع المخلوقات',
              am: 'አር-ረህማን (እጅግ ሩህሩህ)'
            },
            expansions: [
              'Pattern Fa\'laan indicates fullness and overflow—mercy that covers every creature in the universe.',
              'Root R-H-M denotes warmth, protection, and unconditional maternal care.'
            ]
          },
          {
            id: 'kw-1-1-4',
            word: 'Ar-Raheem',
            arabic: 'ٱلرَّحِيمِ',
            root: 'ر-ح-م',
            rootTransliteration: 'R-H-M',
            morphology: {
              en: 'Constant Attribute (Fa\'eel pattern)',
              ar: 'صفة مشبهة على وزن (فَعِيل)'
            },
            meaning: {
              en: 'The Especially / Constantly Merciful',
              ar: 'الرحيم بالمؤمنين في الدنيا والآخرة',
              am: 'አር-ረሂም (በጣም አዛኝ)'
            },
            expansions: [
              'Pattern Fa\'eel indicates continuous, lasting quality—the enduring mercy bestowed upon the righteous.'
            ]
          }
        ]
      },
      {
        id: 'seg-1-2',
        moduleId: 'mod-fatiha',
        label: 'Ayah 2 • Universal Praise',
        labelAr: 'الآية ٢ • الحمد المطلق',
        surahNumber: 1,
        verseNumber: 2,
        arabicText: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ',
        transliteration: 'Alhamdu lillaahi Rabbil \'aalameen',
        translation: {
          en: '[All] praise is [due] to Allah, Lord of the worlds -',
          ar: 'الجميل من الثناء والحمد المطلق لله وحده، خالق العوالم كلها ومربيها بنعمه.',
          am: 'ምስጋና ሁሉ ለአለማት ጌታ ለአላህ የተገባ ነው።'
        },
        explanation: {
          en: CURATED_IBN_KATHIR_EXEGESIS['1:2'].summaryEn,
          ar: CURATED_IBN_KATHIR_EXEGESIS['1:2'].summaryAr,
          am: CURATED_IBN_KATHIR_EXEGESIS['1:2'].summaryAm
        },
        tafsirIbnKathir: CURATED_IBN_KATHIR_EXEGESIS['1:2'],
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3',
        keywords: [
          {
            id: 'kw-1-2-1',
            word: 'Al-Hamdu',
            arabic: 'ٱلْحَمْدُ',
            root: 'ح-م-د',
            rootTransliteration: 'H-M-D',
            morphology: {
              en: 'Definite Verbal Noun (Al-Hamd)',
              ar: 'اسم مصدر معرف بأل الاستغراقية'
            },
            meaning: {
              en: 'All praise and gratitude',
              ar: 'الثناء والحمد الخالص المطلق',
              am: 'ምስጋና ሁሉ'
            },
            expansions: [
              'Hamd encompasses both praise for intrinsic perfection and gratitude for bestowed favors.',
              'The prefix "Al-" signifies totality: all conceivable praise belongs to God.'
            ]
          },
          {
            id: 'kw-1-2-2',
            word: 'Rabb',
            arabic: 'رَبِّ',
            root: 'ر-ب-ب',
            rootTransliteration: 'R-B-B',
            morphology: {
              en: 'Noun / Title of Mastery',
              ar: 'اسم دال على التربية والسيادة'
            },
            meaning: {
              en: 'Lord / Nurturer / Sustainer',
              ar: 'الرب المربي والمالك والمدبر',
              am: 'ጌታ / አስተዳዳሪ'
            },
            expansions: [
              'Rabb means the Lord who creates, nourishes, governs, and brings creation stage by stage to maturity.'
            ]
          },
          {
            id: 'kw-1-2-3',
            word: 'Al-Aalameen',
            arabic: 'ٱلْعَٰلَمِينَ',
            root: 'ع-ل-م',
            rootTransliteration: '\'-L-M',
            morphology: {
              en: 'Masculine Plural Noun',
              ar: 'جمع سالم (العوالم)'
            },
            meaning: {
              en: 'The worlds / All realms of existence',
              ar: 'جميع الخلق والعوالم (الإنس والجن والملائكة والكون)',
              am: 'አለማት (ፍጥረታት ሁሉ)'
            },
            expansions: [
              'Derived from Alahmah (sign/marker), because every realm of creation is a sign pointing to its Creator.'
            ]
          }
        ]
      },
      {
        id: 'seg-1-3',
        moduleId: 'mod-fatiha',
        label: 'Ayah 3 • The All-Merciful, The Especially Merciful',
        labelAr: 'الآية ٣ • الرحمن الرحيم',
        surahNumber: 1,
        verseNumber: 3,
        arabicText: 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
        transliteration: 'Ar-Rahmaanir-Raheem',
        translation: {
          en: 'The Entirely Merciful, the Especially Merciful,',
          ar: 'الرحمن الذي وسعت رحمته جميع خلقه، الرحيم بالمؤمنين خصوصاً في الآخرة.',
          am: 'እጅግ በጣም ሩህሩህ በጣም አዛኝ በሆነው።'
        },
        explanation: {
          en: CURATED_IBN_KATHIR_EXEGESIS['1:3'].summaryEn,
          ar: CURATED_IBN_KATHIR_EXEGESIS['1:3'].summaryAr,
          am: CURATED_IBN_KATHIR_EXEGESIS['1:3'].summaryAm
        },
        tafsirIbnKathir: CURATED_IBN_KATHIR_EXEGESIS['1:3'],
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/3.mp3',
        keywords: [
          {
            id: 'kw-1-3-1',
            word: 'Ar-Rahman',
            arabic: 'ٱلرَّحْمَٰنِ',
            root: 'ر-ح-م',
            rootTransliteration: 'R-H-M',
            morphology: {
              en: 'Intensive Adjective (Fa\'laan)',
              ar: 'صيغة مبالغة على وزن فَعْلان'
            },
            meaning: {
              en: 'The Entirely Merciful (Universal Grace)',
              ar: 'الواسع الرحمة لجميع الخلائق في دار الدنيا',
              am: 'እጅግ ሩህሩህ (ለሁሉም ፍጡር)'
            },
            expansions: [
              'Pattern Fa\'laan indicates boundless expanse and immense fullness of divine benevolence in dunya.',
              'Reassures hearts of divine compassion immediately after establishing supreme Lordship.'
            ]
          },
          {
            id: 'kw-1-3-2',
            word: 'Ar-Raheem',
            arabic: 'ٱلرَّحِيمِ',
            root: 'ر-ح-م',
            rootTransliteration: 'R-H-M',
            morphology: {
              en: 'Constant Attribute (Fa\'eel)',
              ar: 'صفة مشبهة تدل على الثبوت والدوام'
            },
            meaning: {
              en: 'The Especially Merciful (Perpetual Grace)',
              ar: 'الموصل رحمته للمؤمنين في الآخرة',
              am: 'በጣም አዛኝ (ለአማኞች ብቻ)'
            },
            expansions: [
              'Pattern Fa\'eel indicates constant, enduring mercy reserved for the righteous believers.',
              'Affirms the divine promise in 33:43: "And He is ever Merciful (Rahiman) to the believers."'
            ]
          }
        ]
      },
      {
        id: 'seg-1-4',
        moduleId: 'mod-fatiha',
        label: 'Ayah 4 • Sovereign of the Day of Judgment',
        labelAr: 'الآية ٤ • مالك يوم الدين',
        surahNumber: 1,
        verseNumber: 4,
        arabicText: 'مَٰلِكِ يَوْمِ ٱلدِّينِ',
        transliteration: 'Maaliki Yawmid-Deen',
        translation: {
          en: 'Sovereign of the Day of Recompense.',
          ar: 'المالك المتصرف وحده بيوم الجزاء والحساب والعدل.',
          am: 'የፍርዱ ቀን ባለቤትና ንጉሥ ለሆነው።'
        },
        explanation: {
          en: CURATED_IBN_KATHIR_EXEGESIS['1:4'].summaryEn,
          ar: CURATED_IBN_KATHIR_EXEGESIS['1:4'].summaryAr,
          am: CURATED_IBN_KATHIR_EXEGESIS['1:4'].summaryAm
        },
        tafsirIbnKathir: CURATED_IBN_KATHIR_EXEGESIS['1:4'],
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4.mp3',
        keywords: [
          {
            id: 'kw-1-4-1',
            word: 'Maaliki / Maliki',
            arabic: 'مَٰلِكِ',
            root: 'م-ل-ك',
            rootTransliteration: 'M-L-K',
            morphology: {
              en: 'Noun of Agency / King or Owner',
              ar: 'اسم فاعل / صفة مشبهة (الملك والمالك)'
            },
            meaning: {
              en: 'Sovereign King / Supreme Owner',
              ar: 'الملك المتصرف والمالك المطلق',
              am: 'ንጉሥ / ባለቤት'
            },
            expansions: [
              'Both mutawatir readings "Maalik" (Owner) and "Malik" (King) affirm total authority and possession.',
              'On that Day, all earthly claims of dominance vanish before the Divine Throne.'
            ]
          },
          {
            id: 'kw-1-4-2',
            word: 'Yawm',
            arabic: 'يَوْمِ',
            root: 'ي-و-م',
            rootTransliteration: 'Y-W-M',
            morphology: {
              en: 'Time Noun / Day of Resurrection',
              ar: 'اسم زمان مضاف'
            },
            meaning: {
              en: 'The Day of Resurrection',
              ar: 'يوم القيامة والبعث والنشور',
              am: 'ቀን'
            },
            expansions: [
              'Singular designation for the catastrophic culmination of the universe and final resurrection.'
            ]
          },
          {
            id: 'kw-1-4-3',
            word: 'Ad-Deen',
            arabic: 'ٱلدِّينِ',
            root: 'د-ي-ن',
            rootTransliteration: 'D-Y-N',
            morphology: {
              en: 'Definite Verbal Noun (Recompense)',
              ar: 'اسم مصدر دال على الجزاء والحساب'
            },
            meaning: {
              en: 'The Recompense / Judgment',
              ar: 'الحساب والجزاء العادل',
              am: 'ፍርድ / ምንዳ'
            },
            expansions: [
              'Deen here means exact accountability: "As you judge, so shall you be judged" (Kama tadinu tudan).'
            ]
          }
        ]
      },
      {
        id: 'seg-1-5',
        moduleId: 'mod-fatiha',
        label: 'Ayah 5 • The Covenant of Worship',
        labelAr: 'الآية ٥ • ميثاق العبودية والاستعانة',
        surahNumber: 1,
        verseNumber: 5,
        arabicText: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        transliteration: 'Iyyaaka na\'budu wa iyyaaka nasta\'een',
        translation: {
          en: 'It is You we worship and You we ask for help.',
          ar: 'نخصك وحدك بالعبادة والطاعة، ونستعين بك وحدك في جميع أمورنا.',
          am: 'አንተን ብቻ እናመልካለን፤ አንተንም ብቻ እርዳታን እንለምናለን።'
        },
        explanation: {
          en: CURATED_IBN_KATHIR_EXEGESIS['1:5'].summaryEn,
          ar: CURATED_IBN_KATHIR_EXEGESIS['1:5'].summaryAr,
          am: CURATED_IBN_KATHIR_EXEGESIS['1:5'].summaryAm
        },
        tafsirIbnKathir: CURATED_IBN_KATHIR_EXEGESIS['1:5'],
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5.mp3',
        keywords: [
          {
            id: 'kw-1-5-1',
            word: 'Iyyaaka',
            arabic: 'إِيَّاكَ',
            root: 'إ-ي-ا',
            rootTransliteration: 'I-Y-A',
            morphology: {
              en: 'Detached Accusative Pronoun (Fronted for exclusivity)',
              ar: 'ضمير نصب منفصل مقدم للحصر والاختصاص'
            },
            meaning: {
              en: 'You alone / Only You',
              ar: 'إياك وحدك لا شريك لك',
              am: 'አንተን ብቻ'
            },
            expansions: [
              'Placing the object "Iyyaaka" before the verb conveys strict exclusivity (Hasr): You and no one else.'
            ]
          },
          {
            id: 'kw-1-5-2',
            word: 'Na\'budu',
            arabic: 'نَعْبُدُ',
            root: 'ع-ب-د',
            rootTransliteration: '\'-B-D',
            morphology: {
              en: '1st Person Plural Present Verb',
              ar: 'فعل مضارع مرفوع (نحن نعبد)'
            },
            meaning: {
              en: 'We worship / We enslave ourselves in devotion',
              ar: 'نعبد ونخضع ونطيع بحب وذل',
              am: 'እናመልካለን'
            },
            expansions: [
              'Root \'-B-D means submissiveness and softness; in worship it denotes devotion out of love and awe.'
            ]
          },
          {
            id: 'kw-1-5-3',
            word: 'Nasta\'een',
            arabic: 'نَسْتَعِينُ',
            root: 'ع-و-ن',
            rootTransliteration: '\'-W-N',
            morphology: {
              en: 'Form X Present Verb (Seeking aid)',
              ar: 'فعل مضارع باب الاستفعال (طلب العون)'
            },
            meaning: {
              en: 'We ask for help / We seek divine assistance',
              ar: 'نطلب العون والتوفيق في عبادتنا وشؤوننا',
              am: 'እርዳታን እንለምናለን'
            },
            expansions: [
              'Form X (Istif\'aal) signifies actively requesting or soliciting help from the primary source.'
            ]
          }
        ]
      },
      {
        id: 'seg-1-6',
        moduleId: 'mod-fatiha',
        label: 'Ayah 6 • Supplication for the Straight Path',
        labelAr: 'الآية ٦ • سؤال الهداية للصراط المستقيم',
        surahNumber: 1,
        verseNumber: 6,
        arabicText: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ',
        transliteration: 'Ihdinas-Siraatal-Mustaqeem',
        translation: {
          en: 'Guide us to the straight path -',
          ar: 'وفقنا وثبتنا وأرشدنا إلى الطريق الواضح الذي لا اعوجاج فيه، وهو دين الإسلام.',
          am: 'ቀጥተኛውን መንገድ ምራን።'
        },
        explanation: {
          en: CURATED_IBN_KATHIR_EXEGESIS['1:6'].summaryEn,
          ar: CURATED_IBN_KATHIR_EXEGESIS['1:6'].summaryAr,
          am: CURATED_IBN_KATHIR_EXEGESIS['1:6'].summaryAm
        },
        tafsirIbnKathir: CURATED_IBN_KATHIR_EXEGESIS['1:6'],
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6.mp3',
        keywords: [
          {
            id: 'kw-1-6-1',
            word: 'Ihdina',
            arabic: 'ٱهْدِنَا',
            root: 'ه-د-ي',
            rootTransliteration: 'H-D-Y',
            morphology: {
              en: 'Imperative Verb (Supplication) + 1st Plural Pronoun',
              ar: 'فعل دعاء بصيغة الأمر + ضمير متصل نا'
            },
            meaning: {
              en: 'Guide us / Make us steadfast',
              ar: 'أرشدنا وثبتنا وزدنا توفيقاً',
              am: 'ምራን / አቅናን'
            },
            expansions: [
              'Supplication for Hidayat al-Irshad (clarity) and Hidayat at-Tawfeeq (enablement and steadfast endurance).'
            ]
          },
          {
            id: 'kw-1-6-2',
            word: 'As-Sirat',
            arabic: 'ٱلصِّرَٰطَ',
            root: 'ص-ر-ط',
            rootTransliteration: 'S-R-T',
            morphology: {
              en: 'Definite Accusative Noun',
              ar: 'اسم مفعول به منصوب (الطريق الواضح)'
            },
            meaning: {
              en: 'The Path / Highway',
              ar: 'الطريق الواسع الواضح المسلوك',
              am: 'መንገድ'
            },
            expansions: [
              'A wide, illuminated highway that leads straight to salvation without treacherous forks or dead ends.'
            ]
          },
          {
            id: 'kw-1-6-3',
            word: 'Al-Mustaqim',
            arabic: 'ٱلْمُسْتَقِيمَ',
            root: 'ق-و-م',
            rootTransliteration: 'Q-W-M',
            morphology: {
              en: 'Active Participle Form X',
              ar: 'اسم فاعل من استقام (المستوي الذي لا عوج فيه)'
            },
            meaning: {
              en: 'The Straight / Level without curves',
              ar: 'القويم السوي الذي لا عوج فيه ولا انحراف',
              am: 'ቀጥተኛው'
            },
            expansions: [
              'Form X participle indicating unwavering rectitude, balance, and freedom from dangerous extremes.'
            ]
          }
        ]
      },
      {
        id: 'seg-1-7',
        moduleId: 'mod-fatiha',
        label: 'Ayah 7 • The Favored, The Wrathful & The Astray',
        labelAr: 'الآية ٧ • المنعم عليهم والمغضوب عليهم والضالين',
        surahNumber: 1,
        verseNumber: 7,
        arabicText: 'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ',
        transliteration: 'Siraatal-ladheena an\'amta \'alayhim ghayril-maghdoobi \'alayhim wa lad-daalleen',
        translation: {
          en: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
          ar: 'طريق الذين أنعمت عليهم بالتوفيق من النبيين والصديقين والشهداء والصالحين، غير طريق المغضوب عليهم الذين عرفوا الحق وتركوه، ولا طريق التائهين الضالين عن الهدى.',
          am: 'የነዚያ በነርሱ ላይ በጎ የዋልክላቸው ሰዎች መንገድ፤ የነዚያ የተቆጣህባቸውና የጠፉት ያልሆኑትን መንገድ።'
        },
        explanation: {
          en: CURATED_IBN_KATHIR_EXEGESIS['1:7'].summaryEn,
          ar: CURATED_IBN_KATHIR_EXEGESIS['1:7'].summaryAr,
          am: CURATED_IBN_KATHIR_EXEGESIS['1:7'].summaryAm
        },
        tafsirIbnKathir: CURATED_IBN_KATHIR_EXEGESIS['1:7'],
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/7.mp3',
        keywords: [
          {
            id: 'kw-1-7-1',
            word: 'An\'amta',
            arabic: 'أَنْعَمْتَ',
            root: 'ن-ع-م',
            rootTransliteration: 'N-\'-M',
            morphology: {
              en: 'Form IV Past Verb + 2nd Person Pronoun',
              ar: 'فعل ماضٍ من أنعم + تاء الخطاب'
            },
            meaning: {
              en: 'You bestowed favor',
              ar: 'تفضلت عليهم بالهداية والإيمان والعمل الصالح',
              am: 'ጸጋን የዋልክላቸው'
            },
            expansions: [
              'Direct attribution of bounty to Allah alone: spiritual guidance and salvation are pure divine grace.'
            ]
          },
          {
            id: 'kw-1-7-2',
            word: 'Al-Maghdubi',
            arabic: 'ٱلْمَغْضُوبِ',
            root: 'غ-ض-ب',
            rootTransliteration: 'Gh-D-B',
            morphology: {
              en: 'Passive Participle',
              ar: 'اسم مفعول من الغضب'
            },
            meaning: {
              en: 'Those who incurred wrath',
              ar: 'المستحقون لغضب الله لعلمهم بالحق وتركه عمداً',
              am: 'የተቆጣህባቸው'
            },
            expansions: [
              'Those who acquired divine truth but maliciously cast it aside in pursuit of worldly desires.'
            ]
          },
          {
            id: 'kw-1-7-3',
            word: 'Ad-Dalleen',
            arabic: 'ٱلضَّآلِّينَ',
            root: 'ض-ل-ل',
            rootTransliteration: 'D-L-L',
            morphology: {
              en: 'Plural Active Participle with Madd Lazim',
              ar: 'اسم فاعل جمع مذكر سالم مع مد لازم كلمي مثقل'
            },
            meaning: {
              en: 'Those who are astray',
              ar: 'الحائرون التائهون عن طريق الحق لجهلهم واتباع أهوائهم',
              am: 'የጠፉት'
            },
            expansions: [
              'Those who lost authentic revealed knowledge and introduced religious innovations without guidance.'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'mod-kahf',
    title: 'Surah Al-Kahf (The Cave)',
    titleAr: 'سورة الكهف (نور الجمعة)',
    titleAm: 'ሱረቱል ከህፍ (የዋሻው ሱራ)',
    subtitle: 'Protection from Tribulations & Four Essential Parables of Faith',
    subtitleAr: 'العصمة من الفتن والقصص الأربع العظمى في القرآن',
    subtitleAm: 'ከፈተናዎች መጠበቂያ እና አራቱ ታላላቅ የቁርአን ታሪኮች',
    orderIndex: 2,
    surahNumber: 18,
    revelationType: 'Meccan',
    totalVerses: 110,
    themeColor: 'amber',
    description: 'Surah Al-Kahf is the blessed Friday lamp that illuminates the believer\'s week and protects against the four major trials of human existence: the trial of Faith (People of the Cave), Wealth (Owner of Two Gardens), Knowledge (Musa & Khidr), and Power (Dhul-Qarnayn).',
    descriptionAr: 'سورة الكهف هي نور يوم الجمعة والحصن الواقي من الفتن الأربع التي تواجه البشرية: فتنة الدين (أصحاب الكهف)، وفتنة المال (صاحب الجنتين)، وفتنة العلم (موسى والخضر)، وفتنة السلطان (ذو القرنين).',
    descriptionAm: 'ሱረቱል ከህፍ የጁምአ ብርሃን እና ከአራቱ ታላላቅ የሰው ልጅ ፈተናዎች (የእምነት፣ የሀብት፣ የእውቀት እና የስልጣን ፈተናዎች) መከላከያ ነው።',
    thematicPillars: [
      {
        id: 'tp-2-1',
        titleEn: 'Trial of Faith • The Sleepers of Ephesus',
        titleAr: 'فتنة الدين • أصحاب الكهف',
        titleAm: 'የእምነት ፈተና • የአስሀቡል ከህፍ ታሪክ',
        descriptionEn: 'Young believers who sought refuge in a cave to protect their faith from a tyrannical society, demonstrating sincere trust in Allah.',
        descriptionAr: 'فتية آمنوا بربهم واعتزلوا قومهم في الكهف حماية لدينهم، فأيدهم الله بآية عظيمة.',
        descriptionAm: 'እምነታቸውን ከክህደት ለማዳን ወደ ዋሻ የሸሹ ወጣቶች ታሪክ።'
      },
      {
        id: 'tp-2-2',
        titleEn: 'Trial of Wealth • The Two Gardens',
        titleAr: 'فتنة المال • صاحب الجنتين',
        titleAm: 'የሀብት ፈተና • የሁለቱ የአትክልት ስፍራዎች ባለቤት',
        descriptionEn: 'The contrast between arrogant material pride and humble recognition that all prosperity is temporary and dependent on Allah\'s will (Masha\'Allah).',
        descriptionAr: 'مقارنة بين الاغترار بالنعمة والمال وبين التواضع والاعتراف بفضل الله (ما شاء الله لا قوة إلا بالله).',
        descriptionAm: 'በሀብቱ የተመካ ሰው እና ሁሉንም ከአላህ ያገኘ መሆኑን ያመነ ሰው ንጽጽር።'
      },
      {
        id: 'tp-2-3',
        titleEn: 'Trial of Knowledge • Musa & Al-Khidr',
        titleAr: 'فتنة العلم • موسى والخضر عليهما السلام',
        titleAm: 'የእውቀት ፈተና • ነቢዩ ሙሳ እና ኸድር',
        descriptionEn: 'Humility in seeking knowledge and accepting that divine wisdom often transcends apparent surface-level events.',
        descriptionAr: 'أدب طلب العلم والتسليم بحكمة الله الخفية التي قد تخالف الظاهر.',
        descriptionAm: 'የአላህ ጥበብ ከሰው ልጅ እውቀት በላይ መሆኑን የሚያሳይ ታሪክ።'
      }
    ],
    studyObjectives: [
      {
        en: 'Memorize the first and last 10 verses as an authentic shield against Dajjal (tribulations).',
        ar: 'حفظ العشر الآيات الأولى والأخيرة كحصن نبوي ثابت من فتنة الدجال.',
        am: 'የመጀመሪያዎቹን እና የመጨረሻዎቹን 10 አንቀጾች መሸምደድ።'
      },
      {
        en: 'Analyze the recurrence of the root W-L-Y (protection/alliance) throughout the four stories.',
        ar: 'تحليل تكرار مادة (و ل ي) والولاية الحق في القصص الأربع.',
        am: 'በአራቱም ታሪኮች ውስጥ የአላህ ጥበቃ እንዴት እንደተገለጸ ማስተዋል።'
      }
    ],
    curatedAiAnalysis: {
      overviewEn: 'Surah Al-Kahf answers three challenging questions posed by the Rabbis of Madinah to test Prophetic authenticity: the sleepers of the cave, the traveler who reached the ends of the earth, and the nature of the soul. It binds these narratives with a unified theme of divine protection.',
      overviewAr: 'نزلت سورة الكهف إجابة عن أسئلة أحبار اليهود لاختبار نبوة محمد ﷺ: عن الفتية، وعن الرجل الطواف، وعن الروح. وتربط هذه القصص برابط الولاية الإلهية والحفظ.',
      overviewAm: 'ሱረቱል ከህፍ የነቢዩን እውነትነት ለመፈተሽ ለተጠየቁ ሶስት ታላላቅ ጥያቄዎች መልስ ይዟል።',
      linguisticEloquenceEn: 'Notice the precision of verse 10: "Rabbana aatina min ladunka rahmah"—using "Ladunka" (from Your immediate presence) rather than just "minka", expressing urgency and intimacy in their prayer inside the cave.',
      linguisticEloquenceAr: 'تأمل دقة التعبير في قوله تعالى (من لدنك رحمة)، فكلمة (لدن) أخص وأقرب من (عند)، مما يجسد شدة افتقار الفتية وقرب الرحمة الربانية منهم في الغار.',
      linguisticEloquenceAm: 'ሚን ለዱንከ የሚለው ቃል ከአላህ ዘንድ ያለውን ልዩ እዝነት ያሳያል።',
      practicalApplicationEn: 'When facing complex worldly decisions or apparent setbacks, recall the boat of Khidr: what appears as a loss today may be God\'s hidden protection from a greater tyranny tomorrow.',
      practicalApplicationAr: 'عند التعرض لموقف ظاهر الخسارة في الدنيا، تذكر خرق السفينة في قصة الخضر: فقد يكون المنع الإلهي حماية لك من غصب أكبر وسوء أشد.',
      practicalApplicationAm: 'በህይወት ውስጥ የሚደርስብን ችግር ለበለጠ በጎ ነገር ምክንያት ሊሆን እንደሚችል ያስታውሱ።'
    },
    segments: [
      {
        id: 'seg-18-10',
        moduleId: 'mod-kahf',
        label: 'Ayah 10 • Prayer of the Cave Sleepers',
        labelAr: 'الآية ١٠ • دعاء أصحاب الكهف',
        surahNumber: 18,
        verseNumber: 10,
        arabicText: 'إِذْ أَوَى ٱلْفِتْيَةُ إِلَى ٱلْكَهْفِ فَقَالُوا۟ رَبَّنَآ ءَاتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا',
        transliteration: 'Iz awal fityatu ilal kahfi faqaaloo Rabbanaaa aatinaa min ladunka rahmatanw wa hayyi\' lanaa min amrinaa rashadaa',
        translation: {
          en: '[Mention] when the youths retreated to the cave and said, "Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance."',
          ar: 'اذكر حين لجأ الشبان المؤمنون إلى الكهف فراراً بدينهم، فدعوا: ربنا أعطنا من عندك رحمة واسعة، ويسر لنا طريق الصواب والرشاد.',
          am: 'ወጣቶቹ ወደ ዋሻው በተጠጉ ጊዜ «ጌታችን ሆይ! ከአንተ ዘንድ እዝነትን ስጠን፤ ከነገራችንም ቅንን መንገድ አዘጋጅልን» ያሉትን አውሳ።'
        },
        explanation: {
          en: CURATED_IBN_KATHIR_EXEGESIS['18:10'].summaryEn,
          ar: CURATED_IBN_KATHIR_EXEGESIS['18:10'].summaryAr,
          am: CURATED_IBN_KATHIR_EXEGESIS['18:10'].summaryAm
        },
        tafsirIbnKathir: CURATED_IBN_KATHIR_EXEGESIS['18:10'],
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2150.mp3',
        keywords: [
          {
            id: 'kw-18-10-1',
            word: 'Al-Fityatu',
            arabic: 'ٱلْفِتْيَةُ',
            root: 'ف-ت-ي',
            rootTransliteration: 'F-T-Y',
            morphology: {
              en: 'Plural Noun (Youths / Young men of valor)',
              ar: 'جمع تكسير للقلة (فتى - شباب)'
            },
            meaning: {
              en: 'The young believers',
              ar: 'الشباب المؤمنون أصحاب الهمة',
              am: 'ወጣቶቹ'
            },
            expansions: [
              'Fata denotes youth characterized by courage, integrity, and spiritual resilience.'
            ]
          },
          {
            id: 'kw-18-10-2',
            word: 'Ladunka',
            arabic: 'لَّدُنكَ',
            root: 'ل-د-ن',
            rootTransliteration: 'L-D-N',
            morphology: {
              en: 'Locative Adverb + Pronoun (From Your immediate presence)',
              ar: 'ظرف مكان مختص بالقرب الشديد + كاف الخطاب'
            },
            meaning: {
              en: 'From Your immediate presence',
              ar: 'من عندك مباشرة ومن خزائن رحمتك',
              am: 'ከአንተ ዘንድ'
            },
            expansions: [
              'Ladun indicates proximity closer and more intimate than the preposition \'Inda (with/from).'
            ]
          },
          {
            id: 'kw-18-10-3',
            word: 'Rashadaa',
            arabic: 'رَشَدًا',
            root: 'ر-ش-د',
            rootTransliteration: 'R-SH-D',
            morphology: {
              en: 'Verbal Noun (Right guidance / Rectitude)',
              ar: 'اسم مصدر منصوب (الرشاد والصواب)'
            },
            meaning: {
              en: 'Right guidance / Correct course',
              ar: 'الهداية والصواب وحسن العاقبة',
              am: 'ቅን መንገድ'
            },
            expansions: [
              'Rushd is wisdom in action—making decisions that lead directly to safety and truth.'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'mod-yaseen',
    title: 'Surah Yaseen (The Heart of the Quran)',
    titleAr: 'سورة يس (قلب القرآن)',
    titleAm: 'ሱረቱ ያሲን (የቁርአን ልብ)',
    subtitle: 'Resurrection, Divine Prophethood & Cosmic Signs',
    subtitleAr: 'تثبيت النبوة ودلائل القدرة الكونية وإحياء الموتى',
    subtitleAm: 'የቁርአን ልብ፡ የነቢይነት ማረጋገጫ እና የፍጥረት ምልክቶች',
    orderIndex: 3,
    surahNumber: 36,
    revelationType: 'Meccan',
    totalVerses: 83,
    themeColor: 'blue',
    description: 'Known in Prophetic tradition as "The Heart of the Quran," Surah Yaseen revives spiritual conviction by establishing three immovable truths: the veracity of the Prophet Muhammad ﷺ, the overwhelming signs of God\'s power in nature and astronomy, and the certainty of bodily resurrection.',
    descriptionAr: 'تسمى يس قلب القرآن لما فيها من ترسيخ العقيدة وإحياء القلوب بالبراهين الثلاثة: صدق النبوة والرسالة، ودلائل القدرة في الكون والفلك والنبات، والبعث والنشور وحساب الآخرة.',
    descriptionAm: 'ሱረቱ ያሲን "የቁርአን ልብ" በመባል ይታወቃል። የነቢዩን መልእክተኛነት፣ በአለም ላይ ያሉ የአላህን ምልክቶች እና የትንሳኤን እውነት ያስተምራል።',
    thematicPillars: [
      {
        id: 'tp-3-1',
        titleEn: 'Affirmation of the Quran & Prophethood',
        titleAr: 'القسم بالقرآن الحكيم وصدق المرسل',
        titleAm: 'የቁርአን እና የነቢይነት ማረጋገጫ',
        descriptionEn: 'Allah swears by the Wise Quran that Muhammad ﷺ is indeed among the divine Messengers on a Straight Path.',
        descriptionAr: 'قسم إلهي بالقرآن المحكم على أن الرسول محمد ﷺ من المرسلين على صراط مستقيم.',
        descriptionAm: 'አላህ በጥበበኛው ቁርአን በመማል ነቢዩ ሙሀመድ ከእውነተኛ መልእክተኞች መሆናቸውን ያረጋግጣል።'
      },
      {
        id: 'tp-3-2',
        titleEn: 'Cosmic & Astronomical Signs',
        titleAr: 'آيات الكون: الليل والنهار والشمس والقمر',
        titleAm: 'የፀሀይ፣ የጨረቃ እና የሌሊትና ቀን ምልክቶች',
        descriptionEn: 'The flawless orbit of celestial bodies and the revival of dead earth as physical proofs of the Almighty Creator.',
        descriptionAr: 'جريان الشمس في مستقرها وتقدير منازل القمر وإحياء الأرض الميتة براهين ناصعة على الخالق.',
        descriptionAm: 'የፀሀይና ጨረቃ ጉዞ እንዲሁም የሞተች መሬት በመስኖ መነሳት የአላህን ቻይነት ያሳያል።'
      }
    ],
    studyObjectives: [
      {
        en: 'Reflect on why the Prophet ﷺ referred to Yaseen as the "Heart of the Quran".',
        ar: 'تأمل الحكمة في تسمية النبي ﷺ لسورة يس بـ(قلب القرآن) لتكثيفها أصول العقيدة.',
        am: 'ነቢዩ ለምን ያሲንን የቁርአን ልብ እንዳሉት ማስተዋል።'
      }
    ],
    curatedAiAnalysis: {
      overviewEn: 'Surah Yaseen progresses through three acts: Act I defends the Messenger against skeptical resistance; Act II displays cosmological marvels (sun, moon, orbital physics); Act III depicts the sudden Trumpet blast and the Judgment Assembly.',
      overviewAr: 'تتدرج سورة يس في ثلاثة محاور: الدفاع عن النبي والرسالة، وعرض آيات الفلك والكون الدقيقة، ومشهد نفخة الصور والبعث السريع لحساب الخلائق.',
      overviewAm: 'ሱረቱ ያሲን በሶስት ዋና ዋና ክፍሎች የተዋቀረ ነው፡ የነቢዩን ክብር መከላከል፣ የአለምን ተአምራት ማሳየት እና የትንሳኤን ቀን ማስታወስ።',
      linguisticEloquenceEn: 'In verse 38, "Wa ash-shamsu tajree li-mustaqarrin lahaa"—the word "Mustaqarr" conveys both spatial orbit destination and temporal duration until Doomsday.',
      linguisticEloquenceAr: 'في قوله (والشمس تجري لمستقر لها)، كلمة (مستقر) تجمع بين الاستقرار المكاني في مدارها والاستقرار الزماني لغاية يوم القيامة.',
      linguisticEloquenceAm: 'ሙስተቀር የሚለው ቃል የፀሀይን ምህዋር እና ጊዜያዊ ገደብ ያሳያል።',
      practicalApplicationEn: 'Recite Surah Yaseen in moments of spiritual dryness or distress to reignite certainty in the afterlife and divine mercy.',
      practicalApplicationAr: 'تُقرأ سورة يس لإحياء اليقين في القلب وعند الشدائد وتذكر الآخرة ورحمة الغفور الرحيم.',
      practicalApplicationAm: 'በመንፈሳዊ ድካም ወቅት ያሲንን ማንበብ ልብን ያነቃቃል።'
    },
    segments: [
      {
        id: 'seg-36-58',
        moduleId: 'mod-yaseen',
        label: 'Ayah 58 • The Ultimate Divine Greeting',
        labelAr: 'الآية ٥٨ • سلام رب العالمين لأهل الجنة',
        surahNumber: 36,
        verseNumber: 58,
        arabicText: 'سَلَٰمٌ قَوْلًا مِّن رَّبٍّ رَّحِيمٍ',
        transliteration: 'Salaamun qawlam mir Rabbir Raheem',
        translation: {
          en: '"Peace," a word from a Merciful Lord.',
          ar: 'تحية وسلامٌ يُقال لهم قولاً من ربٍّ رحيم بهم، وذلك غاية الإكرام والأمان في الجنة.',
          am: '«ሰላም» ከአዛኙ ጌታ የሚባል ቃል ነው።'
        },
        explanation: {
          en: CURATED_IBN_KATHIR_EXEGESIS['36:58'].summaryEn,
          ar: CURATED_IBN_KATHIR_EXEGESIS['36:58'].summaryAr,
          am: CURATED_IBN_KATHIR_EXEGESIS['36:58'].summaryAm
        },
        tafsirIbnKathir: CURATED_IBN_KATHIR_EXEGESIS['36:58'],
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/3763.mp3',
        keywords: [
          {
            id: 'kw-36-58-1',
            word: 'Salaamun',
            arabic: 'سَلَٰمٌ',
            root: 'س-ل-م',
            rootTransliteration: 'S-L-M',
            morphology: {
              en: 'Indefinite Verbal Noun (Peace / Unconditional Safety)',
              ar: 'اسم مصدر نكرة للتعظيم (سلام كامل وشامل)'
            },
            meaning: {
              en: 'Peace / Security / Tranquility',
              ar: 'الأمان والسلامة التامة من كل كدر وخوف',
              am: 'ሰላም / ደህንነት'
            },
            expansions: [
              'Root S-L-M signifies wholeness, safety, and freedom from any defect or sorrow.'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'mod-mulk',
    title: 'Surah Al-Mulk (The Sovereignty)',
    titleAr: 'سورة الملك (المنجية والواقية)',
    titleAm: 'ሱረቱል ሙልክ (የአላህ ንግስና)',
    subtitle: 'The Protector from the Grave & Perfection of Creation',
    subtitleAr: 'المنجية من عذاب القبر والتفكر في إتقان الخلق',
    subtitleAm: 'ከቀብር ቅጣት መከላከያ እና የፍጥረት ጥበብ',
    orderIndex: 4,
    surahNumber: 67,
    revelationType: 'Meccan',
    totalVerses: 30,
    themeColor: 'purple',
    description: 'Recited nightly by the Prophet ﷺ, Surah Al-Mulk is celebrated as Al-Manjiya (The Rescuer). It invites humanity to observe the flawless architecture of the universe, reminds us that life and death are moral tests, and inspires awe in the Absolute Sovereignty of Allah.',
    descriptionAr: 'كان النبي ﷺ لا ينام حتى يقرأ سورة الملك، وهي (المنجية) والمجادلة عن صاحبها. تدعو للتفكر في إحكام خلق السماوات، وتبين أن الحياة والموت اختبار للعمل الأحسن.',
    descriptionAm: 'ነቢዩ ማታ ማታ ሳያነቡት የማይተኙት ሱራ ነው። ከቀብር ቅጣት የሚከላከል እና የአላህን ፍጹም ቻይነት የሚያሳይ ነው።',
    thematicPillars: [
      {
        id: 'tp-4-1',
        titleEn: 'Life & Death as an Ethical Test',
        titleAr: 'الحياة والموت ابتلاء لأحسن العمل',
        titleAm: 'ህይወትና ሞት ለፈተና የተፈጠሩ መሆናቸው',
        descriptionEn: 'Allah created the cycle of mortality not as vanity, but to reveal who excels in righteous deeds.',
        descriptionAr: 'خلق الله الموت والحياة ليختبر الخلائق أيهم أخلص وأصوب عملاً.',
        descriptionAm: 'አላህ ሞትንና ህይወትን የፈጠረው ማን መልካም ስራ እንደሚሰራ ለመፈተሽ ነው።'
      },
      {
        id: 'tp-4-2',
        titleEn: 'Flawless Cosmic Symmetry',
        titleAr: 'إتقان خلق السماوات السبع دون تفاوت',
        titleAm: 'የሰማያት ፍጹም አፈጣጠር',
        descriptionEn: 'An open invitation to inspect the skies repeatedly—you will find no rift, flaw, or incoherence in God\'s design.',
        descriptionAr: 'دعوة للبصر والعقل لتأمل السماوات؛ فلن تجد فيها أي صدع أو خلل أو تفاوت.',
        descriptionAm: 'በሰማያት አፈጣጠር ውስጥ ምንም አይነት እንከን አለመኖሩን መመርመር።'
      }
    ],
    studyObjectives: [
      {
        en: 'Understand the meaning of "Ahsanu Amala" (best in deed) according to early scholarly consensus: most sincere and most correct.',
        ar: 'فهم معنى (أحسن عملاً): أخلصه لله وأصوبه على هدي النبي ﷺ.',
        am: 'አህሰኑ አመላ ማለት በጣም ቅን እና ትክክለኛ ስራ ማለት መሆኑን ማወቅ።'
      }
    ],
    curatedAiAnalysis: {
      overviewEn: 'Surah Al-Mulk opens with an exclamation of divine blessing ("Tabaaraka") and proceeds to demonstrate Allah\'s control over every dimension: the heavens above, the earth beneath our feet, and the birds suspended in mid-air.',
      overviewAr: 'تبدأ السورة بتمجيد البركة الإلهية (تبارك)، ثم تعرض دلائل الملك المطلق: في السماوات العلا، والأرض الذلول، والطير الصافات في جو السماء.',
      overviewAm: 'ሱረቱል ሙልክ የአላህን በረከት በማወደስ ይጀምራል፤ በሰማይ፣ በምድር እና በአየር ላይ ያለውን የአላህን ቁጥጥር ያሳያል።',
      linguisticEloquenceEn: 'The verb "Tabaaraka" is in the reflexive-intensive Form VI, used only for Allah, denoting an inexhaustible, self-sustaining abundance of blessing and sovereignty.',
      linguisticEloquenceAr: 'الفعل (تبارك) لا يُطلق إلا على الله تعالى، ويدل على تكاثر الخير والبركة ودوام الملك وعظمته.',
      linguisticEloquenceAm: 'ተባረከ የሚለው ቃል ለአላህ ብቻ የሚገባ የላቀ በረከትን ያሳያል።',
      practicalApplicationEn: 'Make reciting Surah Al-Mulk a consistent bedtime habit to secure spiritual peace and intercession.',
      practicalApplicationAr: 'المحافظة على قراءة سورة الملك كل ليلة قبل النوم لنيل شفاعتها والأمان في القبر.',
      practicalApplicationAm: 'ማታ ከመተኛትዎ በፊት ሱረቱል ሙልክን ማንበብ ልማድ ያድርጉ።'
    },
    segments: [
      {
        id: 'seg-67-2',
        moduleId: 'mod-mulk',
        label: 'Ayah 2 • The Test of Best Deeds',
        labelAr: 'الآية ٢ • الغاية من الحياة والموت',
        surahNumber: 67,
        verseNumber: 2,
        arabicText: 'ٱلَّذِى خَلَقَ ٱلْمَوْتَ وَٱلْحَيَوٰةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا وَهُوَ ٱلْعَزِيزُ ٱلْغَفُورُ',
        transliteration: 'Allazee khalaqal mawta walhayaata liyabluwakum ayyukum ahsanu \'amalaa; wa huwal \'azeezul ghafoor',
        translation: {
          en: '[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving.',
          ar: 'الذي أوجد الموت والحياة ليختبركم أيكُم أخلص وأصوب عملاً، وهو العزيز في انتقامه، الغفور للتائبين.',
          am: 'ያ ሞትንና ሕይወትን የፈጠረ ነው፤ ማንኛችሁ በሥራ ይበልጥ ያማረ እንደኾነ ሊሞክራችሁ፤ እርሱም አሸናፊው መሓሪው ነው።'
        },
        explanation: {
          en: CURATED_IBN_KATHIR_EXEGESIS['67:2'].summaryEn,
          ar: CURATED_IBN_KATHIR_EXEGESIS['67:2'].summaryAr,
          am: CURATED_IBN_KATHIR_EXEGESIS['67:2'].summaryAm
        },
        tafsirIbnKathir: CURATED_IBN_KATHIR_EXEGESIS['67:2'],
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5243.mp3',
        keywords: [
          {
            id: 'kw-67-2-1',
            word: 'Liyabluwakum',
            arabic: 'لِيَبْلُوَكُمْ',
            root: 'ب-ل-و',
            rootTransliteration: 'B-L-W',
            morphology: {
              en: 'Verb with Pronoun (In order to test/try you)',
              ar: 'لام التعليل + فعل مضارع منصوب (ليختبركم)'
            },
            meaning: {
              en: 'To test you / To reveal your true mettle',
              ar: 'ليختبركم ويظهر معادنكم في العمل',
              am: 'ሊሞክራችሁ / ሊፈትናችሁ'
            },
            expansions: [
              'Balaa in Quranic usage means drawing out what is hidden inside a person through practical trials.'
            ]
          },
          {
            id: 'kw-67-2-2',
            word: 'Ahsanu',
            arabic: 'أَحْسَنُ',
            root: 'ح-س-ن',
            rootTransliteration: 'H-S-N',
            morphology: {
              en: 'Elative Adjective (Best / Most excellent)',
              ar: 'اسم تفضيل (أحسن وأكمل وأصوب)'
            },
            meaning: {
              en: 'Best in quality and sincerity',
              ar: 'أجود وأخلص وأصوب',
              am: 'ይበልጥ ያማረ'
            },
            expansions: [
              'Al-Fudayl ibn \'Iyad explained: Ahsanu \'Amala means the most sincere (for Allah) and the most correct (according to the Sunnah).'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'mod-rahman',
    title: 'Surah Ar-Rahman (The Most Merciful)',
    titleAr: 'سورة الرحمن (عروس القرآن)',
    titleAm: 'ሱረቱ አር-ረህማን (የቁርአን ሙሽራ)',
    subtitle: 'The Symphony of Divine Blessings & Dual Accountability',
    subtitleAr: 'سيف النعم الإلهية وخطاب الثقلين الإنس والجن',
    subtitleAm: 'የአላህ ጸጋዎች እና የሰውና ጂን ጥሪ',
    orderIndex: 5,
    surahNumber: 55,
    revelationType: 'Medinan',
    totalVerses: 78,
    themeColor: 'teal',
    description: 'Surah Ar-Rahman is renowned as the "Bride of the Quran" for its rhythmic beauty and poetic symmetry. It addresses both humanity and Jinn with the stirring refrain repeated 31 times: "So which of the favors of your Lord would you deny?"',
    descriptionAr: 'سورة الرحمن هي (عروس القرآن) لما فيها من جمال النظم وتناسق الإيقاع. تخاطب الثقلين (الإنس والجن) بالسؤال المتكرر ٣١ مرة: (فبأي آلاء ربكما تكذبان؟).',
    descriptionAm: 'ሱረቱ አር-ረህማን "የቁርአን ሙሽራ" በመባል ይታወቃል። "ከጌታችሁ ጸጋዎች በየትኛው ታስተባብላላችሁ?" የሚለው ጥያቄ 31 ጊዜ ይደጋገማል።',
    thematicPillars: [
      {
        id: 'tp-5-1',
        titleEn: 'The Gift of Quranic Expression',
        titleAr: 'نعمة تعليم القرآن والبيان',
        titleAm: 'የቁርአን ትምህርት እና የመናገር ችሎታ ጸጋ',
        descriptionEn: 'The greatest mercy of Allah is teaching the Quran, followed by creating humanity and gifting us articulate speech.',
        descriptionAr: 'أعظم نعم الرحمن هي تعليم القرآن الكريم، ثم خلق الإنسان وتعليمه النطق والبيان.',
        descriptionAm: 'የአላህ ታላቅ ጸጋ ቁርአንን ማስተማር ነው።'
      },
      {
        id: 'tp-5-2',
        titleEn: 'The Universal Balance (Mizan)',
        titleAr: 'رفع السماء ووضع الميزان والعدل',
        titleAm: 'የሰማያት ሚዛን እና ፍትህ',
        descriptionEn: 'Allah established the cosmos upon absolute equilibrium and justice, warning humanity never to transgress the balance.',
        descriptionAr: 'إقامة الكون على العدل والميزان الدقيق، والأمر بالعدل وعدم التطفيف والظلم.',
        descriptionAm: 'አላህ ሰማይንና ምድርን በሚዛናዊነት ፈጥሮ ፍትህን አዟል።'
      }
    ],
    studyObjectives: [
      {
        en: 'Examine why the refrain "Fabi\'ayyi aalaaa\'i Rabbikumaa tukazzibaan" is repeated exactly 31 times.',
        ar: 'دراسة دلالة تكرار آية (فبأي آلاء ربكما تكذبان) ٣١ مرة لتقرير الشكر ونفي الجحود.',
        am: 'የአንቀጹን 31 ጊዜ መደጋገም ምስጢር መረዳት።'
      }
    ],
    curatedAiAnalysis: {
      overviewEn: 'Surah Ar-Rahman is unique in Quranic architecture: it begins with a divine proper noun ("Ar-Rahman") as a single-word verse, establishing that every subsequent verse is an outflow of divine mercy.',
      overviewAr: 'تتفرد سورة الرحمن ببدئها باسم الله (الرحمن) كآية مستقلة، لتدل على أن جميع النعم الكونية والدينية هي فيض من رحمته الواسعة.',
      overviewAm: 'ሱረቱ አር-ረህማን "አር-ረህማን" በሚለው የአላህ ስም ይጀምራል፤ ይህም ሁሉም ነገር ከእዝነቱ የመጣ መሆኑን ያሳያል።',
      linguisticEloquenceEn: 'The dual suffix "-kumaa" (you two) consistently addresses humankind and Jinn together, binding both sentient creations in moral obligation.',
      linguisticEloquenceAr: 'استخدام كاف الخطاب للمثنى في (ربكما) و(تكذبان) يوجه الخطاب للثقلين معاً (الإنس والجن) في تكليف موحد.',
      linguisticEloquenceAm: 'ረብቢኩማ የሚለው ቃል ሰዎችን እና ጂኖችን በአንድ ላይ ይናገራል።',
      practicalApplicationEn: 'When hearing "So which of the favors of your Lord would you deny?", reply as the Prophet\'s companions did: "None of Your blessings do we deny, our Lord, and to You belongs all praise."',
      practicalApplicationAr: 'يُستحب للسامع أن يردد مع كل آية: (لا بشيء من نعمك ربنا نكذب فلك الحمد).',
      practicalApplicationAm: 'አንቀጹን ሲሰሙ "ከጌታችን ጸጋ በአንዱም አናስተባብልም፤ ምስጋናም ለአንተ ይሁን" ይበሉ።'
    },
    segments: [
      {
        id: 'seg-55-13',
        moduleId: 'mod-rahman',
        label: 'Ayah 13 • The Universal Refrain',
        labelAr: 'الآية ١٣ • الخطاب المتكرر للثقلين',
        surahNumber: 55,
        verseNumber: 13,
        arabicText: 'فَبِأَىِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ',
        transliteration: 'Fabi\'ayyi aalaaa\'i Rabbikumaa tukazzibaan',
        translation: {
          en: 'So which of the favors of your Lord would you deny?',
          ar: 'فبأي نعم ربكما الكثيرة الظاهرة والباطنة يا معشر الإنس والجن تكذبان وتجحدان؟',
          am: 'ከጌታችሁም ጸጋዎች በየትኛው ታስተባብላላችሁ?'
        },
        explanation: {
          en: CURATED_IBN_KATHIR_EXEGESIS['55:13'].summaryEn,
          ar: CURATED_IBN_KATHIR_EXEGESIS['55:13'].summaryAr,
          am: CURATED_IBN_KATHIR_EXEGESIS['55:13'].summaryAm
        },
        tafsirIbnKathir: CURATED_IBN_KATHIR_EXEGESIS['55:13'],
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4914.mp3',
        keywords: [
          {
            id: 'kw-55-13-1',
            word: 'Aalaaa\'i',
            arabic: 'ءَالَآءِ',
            root: 'أ-ل-و',
            rootTransliteration: 'A-L-W',
            morphology: {
              en: 'Plural Noun (Favors / Blessings / Marvels)',
              ar: 'جمع تكسير (أَلْي وِإلْي: النعم الجليلة)'
            },
            meaning: {
              en: 'Favors / Bounties / Marvels',
              ar: 'النعم العظيمة الجليلة والآيات الباهرة',
              am: 'ጸጋዎች / ስጦታዎች'
            },
            expansions: [
              'Aalaa refers to grand, multi-layered divine bounties that sustain physical and spiritual existence.'
            ]
          },
          {
            id: 'kw-55-13-2',
            word: 'Tukazzibaan',
            arabic: 'تُكَذِّبَانِ',
            root: 'ك-ذ-ب',
            rootTransliteration: 'K-Z-B',
            morphology: {
              en: 'Form II Dual Present Verb (You both deny)',
              ar: 'فعل مضارع مرفوع بثبوت النون للمثنى (تكذبان)'
            },
            meaning: {
              en: 'Would you two deny / reject as false',
              ar: 'تجحدان وتكذبان بها يا معشر الإنس والجن',
              am: 'ታስተባብላላችሁ / ትክዳላችሁ'
            },
            expansions: [
              'Form II (Takzeeb) implies willful rejection of self-evident truth.'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'mod-ikhlas',
    title: 'Surah Al-Ikhlas (The Purity of Faith)',
    titleAr: 'سورة الإخلاص (التوحيد الخالص)',
    titleAm: 'ሱረቱል ኢኽላስ (የእምነት ንፅህና)',
    subtitle: 'Equal to One-Third of the Quran & Absolute Monotheism',
    subtitleAr: 'تعدل ثلث القرآن وعقيدة التوحيد الصافي',
    subtitleAm: 'ከሶስተኛው የቁርአን ክፍል ጋር የሚተካከል ታላቅ ሱራ',
    orderIndex: 6,
    surahNumber: 112,
    revelationType: 'Meccan',
    totalVerses: 4,
    themeColor: 'rose',
    description: 'Surah Al-Ikhlas is the absolute creedal declaration of Tawheed (Pure Monotheism). The Prophet ﷺ affirmed that reading this concise four-verse surah is equivalent in reward and theological weight to one-third of the entire Quran.',
    descriptionAr: 'سورة الإخلاص هي جوهر عقيدة التوحيد ونفي الشريك والمثيل عن الله تعالى. أخبر النبي ﷺ أنها تعدل ثلث القرآن الكريم في الأجر والمعنى.',
    descriptionAm: 'ሱረቱል ኢኽላስ የአላህን አንድነትና ወደር አልባነት የሚያስተምር ሱራ ነው። ነቢዩ ይህ ሱራ ከቁርአን አንድ ሶስተኛ ጋር እንደሚተካከል ገልጸዋል።',
    thematicPillars: [
      {
        id: 'tp-6-1',
        titleEn: 'Absolute Divine Oneness (Ahad)',
        titleAr: 'الوحدانية المطلقة لله (أحد)',
        titleAm: 'የአላህ ፍጹም አንድነት (አሀድ)',
        descriptionEn: 'Allah is Unique and Indivisible, without equal, partner, or secondary manifestation.',
        descriptionAr: 'الله واحد أحد لا شريك له في ذاته ولا في صفاته ولا في أفعاله.',
        descriptionAm: 'አላህ አንድ እና ወደር የሌለው አምላክ ነው።'
      },
      {
        id: 'tp-6-2',
        titleEn: 'Self-Sufficient Master (As-Samad)',
        titleAr: 'الصمدية والاستغناء المطلق (الصمد)',
        titleAm: 'ሁሉ የሚመካበት ጌታ (አስ-ሰመድ)',
        descriptionEn: 'Allah is the Self-Sufficient Refuge upon whom all creation depends, while He depends on no one.',
        descriptionAr: 'السيد الكامل الذي تصمد إليه الخلائق في حوائجها وهو غني عن العالمين.',
        descriptionAm: 'ፍጥረታት ሁሉ የሚፈልጉት፣ እርሱ ግን ማንም የማይፈልግ ጌታ ነው።'
      }
    ],
    studyObjectives: [
      {
        en: 'Analyze why the divine name "As-Samad" appears nowhere else in the Quran except in Surah Al-Ikhlas.',
        ar: 'تحليل دلالة ورود اسم الله (الصمد) مرة واحدة فقط في القرآن الكريم في هذه السورة.',
        am: 'አስ-ሰመድ የሚለው ስም በቁርአን ውስጥ እዚህ ሱራ ላይ ብቻ ለምን እንደተወሳ ማስተዋል።'
      }
    ],
    curatedAiAnalysis: {
      overviewEn: 'Surah Al-Ikhlas was revealed when people asked the Prophet ﷺ: "Describe for us the lineage of your Lord." It answers with four concise, mutually reinforcing propositions of pure transcendental monotheism.',
      overviewAr: 'نزلت سورة الإخلاص جواباً لمن سألوا النبي ﷺ: (انسب لنا ربك)، فأجابت بأربع جمل قاطعة تنفي الشريك والولد والوالد والمكافئ.',
      overviewAm: 'ሱረቱል ኢኽላስ የወረደው ሰዎች "የጌታህን ማንነት ግለጽልን" ብለው ለጠየቁት ጥያቄ መልስ በመሆን ነው።',
      linguisticEloquenceEn: 'The word "Ahad" is stronger than "Wahid"—denoting an absolute, uncompounded oneness that cannot be divided or enumerated.',
      linguisticEloquenceAr: 'كلمة (أحد) أبلغ وأعمق من (واحد)، فهي تدل على الوحدانية المطلقة المنزهة عن التجزئة والعدد والشريك.',
      linguisticEloquenceAm: 'አሀድ የሚለው ቃል የማይከፋፈል ፍጹም አንድነትን ያመለክታል።',
      practicalApplicationEn: 'Recite Surah Al-Ikhlas three times every morning and evening along with Al-Falaq and An-Nas for complete spiritual protection.',
      practicalApplicationAr: 'قراءة سورة الإخلاص والمعوذتين ثلاث مرات صباحاً ومساءً تكفيك من كل سوء.',
      practicalApplicationAm: 'ይህንን ሱራ ጠዋትና ማታ ሶስት ሶስት ጊዜ ማንበብ ከማንኛውም ክፉ ነገር ይጠብቃል።'
    },
    segments: [
      {
        id: 'seg-112-1',
        moduleId: 'mod-ikhlas',
        label: 'Ayah 1 • Declaration of Oneness',
        labelAr: 'الآية ١ • إعلان الوحدانية المطلقة',
        surahNumber: 112,
        verseNumber: 1,
        arabicText: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
        transliteration: 'Qul huwal laahu ahad',
        translation: {
          en: 'Say, "He is Allah, [who is] One,"',
          ar: 'قل جزماً ويقيناً: الله واحد أحد متفرد بالربوبية والألوهية والأسماء والصفات.',
          am: 'በል «እርሱ አላህ አንድ ነው።»'
        },
        explanation: {
          en: CURATED_IBN_KATHIR_EXEGESIS['112:1'].summaryEn,
          ar: CURATED_IBN_KATHIR_EXEGESIS['112:1'].summaryAr,
          am: CURATED_IBN_KATHIR_EXEGESIS['112:1'].summaryAm
        },
        tafsirIbnKathir: CURATED_IBN_KATHIR_EXEGESIS['112:1'],
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6222.mp3',
        keywords: [
          {
            id: 'kw-112-1-1',
            word: 'Ahad',
            arabic: 'أَحَدٌ',
            root: 'أ-ح-د',
            rootTransliteration: 'A-H-D',
            morphology: {
              en: 'Proper Adjective of Absolute Singularity',
              ar: 'صفة مشبهة تفيد الوحدانية المطلقة (أحد)'
            },
            meaning: {
              en: 'The Unique One / Indivisible',
              ar: 'الواحد الأحد المنفرد بالكمال المطلق',
              am: 'አንድ / ወደር የሌለው'
            },
            expansions: [
              'Ahad means One who has no second, no parts, no equal, and no likeness in essence or attribute.'
            ]
          }
        ]
      },
      {
        id: 'seg-112-2',
        moduleId: 'mod-ikhlas',
        label: 'Ayah 2 • The Self-Sufficient Master',
        labelAr: 'الآية ٢ • الصمد المفتقر إليه كل شيء',
        surahNumber: 112,
        verseNumber: 2,
        arabicText: 'ٱللَّهُ ٱلصَّمَدُ',
        transliteration: 'Allaa hus-Samad',
        translation: {
          en: 'Allah, the Eternal Refuge.',
          ar: 'الله السيد الكامل الذي تصمد إليه الخلائق في حوائجها ورغائبها وهو غني عن العالمين.',
          am: '«አላህ የሁሉ መጠጊያ (አስ-ሰመድ) ነው።»'
        },
        explanation: {
          en: CURATED_IBN_KATHIR_EXEGESIS['112:2'].summaryEn,
          ar: CURATED_IBN_KATHIR_EXEGESIS['112:2'].summaryAr,
          am: CURATED_IBN_KATHIR_EXEGESIS['112:2'].summaryAm
        },
        tafsirIbnKathir: CURATED_IBN_KATHIR_EXEGESIS['112:2'],
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6223.mp3',
        keywords: [
          {
            id: 'kw-112-2-1',
            word: 'As-Samad',
            arabic: 'ٱلصَّمَدُ',
            root: 'ص-م-د',
            rootTransliteration: 'S-M-D',
            morphology: {
              en: 'Definite Noun of Ultimate Sovereignty',
              ar: 'اسم علم وصفة معرفة (الصمد)'
            },
            meaning: {
              en: 'The Eternal Refuge / The Self-Sufficient Master',
              ar: 'السيد الكامل الذي يقصده الخلائق في الحوائج',
              am: 'የሁሉ መጠጊያ'
            },
            expansions: [
              'Samad in Classical Arabic denotes the chieftain toward whom everyone turns in times of need, while he himself requires no food, aid, or sustenance.'
            ]
          }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // MODULE 7: SURAH AL-FALAQ (113) - Al-Mu'awwidhatayn Part 1
  // -------------------------------------------------------------
  {
    id: 'mod-falaq',
    title: 'Surah Al-Falaq (The Daybreak)',
    titleAr: 'سورة الفلق',
    titleAm: 'ሱረቱል ፈለቅ (የንጋት ጎህ)',
    subtitle: 'Al-Mu\'awwidhatayn • Divine Shield Against Creation, Darkness, Sorcery & Envy',
    subtitleAr: 'المعوذة الأولى • التحصين الإلهي العظيم من غواسق الليل والنفاثات في العقد وحسد الحاسدين',
    subtitleAm: 'አል-ሙዐዊዘተይን • ከጨለማ፣ ከድግምትና ከምቀኞች ተንኮል መሸሸጊያ ታላቅ ሱራህ',
    orderIndex: 7,
    surahNumber: 113,
    revelationType: 'Meccan',
    totalVerses: 5,
    themeColor: 'teal',
    description: `Surah Al-Falaq is the first of the twin protective surahs (Al-Mu'awwidhatayn) revealed to shield the believer from all physical and metaphysical evils in the created universe. Imam Ibn Kathir records in his monumental Tafsir that the Prophet (ﷺ) praised these two chapters as having no equal in the entire Quran for protection. It commands the believer to flee to the Creator of the Daybreak from four specific hazards: the general evil of creation, the creeping dangers of nightfall, the knots of sorcerers, and the poison of envious souls.`,
    descriptionAr: `سورة الفلق هي أولى المعوذتين وإحدى أعظم سور التحصين في القرآن العظيم؛ أنزلها الله تعالى لتكون حصناً منيعاً للمؤمن من كل شرور الوجود. وقد أورد الإمام ابن كثير في تفسيره حديث النبي ﷺ لعقبة بن عامر: «ألم تر آيات أنزلت الليلة لم ير مثلهن قط؟: قل أعوذ برب الفلق، وقل أعوذ برب الناس». تبتدئ باللجوء إلى فالق الإصباح، وتفصل الاستعاذة من أربعة شرور خطيرة: شر المخلوقات عامة، وظلمة الليل إذا دخلت، والسواحر اللاتي ينفثن في العقد، وعين الحاسد إذا حسد.`,
    descriptionAm: `ሱረቱል ፈለቅ ከሁለቱ ታላላቅ የመጠበቂያ ሱራዎች (ሙዐዊዘተይን) የመጀመሪያዋ ስትሆን፤ አማኝ ከማንኛውም የሚታይና የማይታይ ፍጥረታዊ አደጋዎች በአላህ እንዲጠበቅ ታዛለች። ኢማም ኢብኑ ከሲር በተፍሲራቸው እንዳብራሩት፤ ነቢዩ (ﷺ) እነዚህን ሁለት ሱራዎች ወደር የሌላቸው የመከላከያ ጸጋዎች መሆናቸውን አስተምረዋል።`,
    thematicPillars: [
      {
        id: 'tp-falaq-1',
        titleEn: 'The Lord of Daybreak & Splitting of Darkness',
        titleAr: 'رب الفلق وفلق ظلمة الشدائد',
        titleAm: 'የንጋቱ ጌታና ጨለማን የመበተን ሃይል',
        descriptionEn: 'Recognizing Allah as the Sovereign who tears open the veil of night with morning light, capable of dispelling any hardship, disease, or fear.',
        descriptionAr: 'استشعار قدرة الله المطلقة في فلق الصبح ومحو الظلام، وأنه وحده القادر على كشف الكربات وإزالة المخاوف.',
        descriptionAm: 'አላህ የሌሊትን ጨለማ በንጋት ብርሃን እንደሚሰነጥቀው ሁሉ ማንኛውንም ጭንቀትና አደጋ የማስወገድ ብቸኛ ሃይል መሆኑን ማመን።'
      },
      {
        id: 'tp-falaq-2',
        titleEn: 'Neutralizing Sorcery & Occult Harms (An-Naffathat)',
        titleAr: 'إبطال كيد السحر والنفاثات في العقد',
        titleAm: 'ድግምትና የቋጠሮ ክፋቶችን በቁርአን ማክሸፍ',
        descriptionEn: 'The historical occasion of revelation regarding Labid bin Al-A\'sam\'s 11 knots, demonstrating that the Quran is the supreme, infallible healing remedy (Ruqyah).',
        descriptionAr: 'بيان سبب النزول في إبطال سحر لبيد بن الأعصم وإذابة العقد الإحدى عشرة بالمعوذتين، والتأكيد على أن القرآن هو الشفاء الرباني القاطع.',
        descriptionAm: 'በ11 ቋጠሮዎች የተሰራውን ድግምት ነቢዩ (ﷺ) በሁለቱ ሱራዎች አማካኝነት እንደፈቱትና ቁርአን ፍቱን መድኃኒት መሆኑን ማሳየት።'
      },
      {
        id: 'tp-falaq-3',
        titleEn: 'The Spiritual & Social Poison of Envy (Hasad)',
        titleAr: 'علاج الحسد والعين بحصن التوكل',
        titleAm: 'የምቀኝነትና የዐይን በሽታ መከላከያ',
        descriptionEn: 'Shielding oneself and family from active envy and the Evil Eye through heartfelt istiadha, humility, and seeking Allah\'s blessing (Tabrik).',
        descriptionAr: 'التحصن من شرور الحساد وسموم أعينهم بالاستعاذة الصادقة وذكر الله والتبريك المستمر.',
        descriptionAm: 'በአላህ መጠበቅና ዚክር በማድረግ ራስንም ሆነ ቤተሰብን ከምቀኞችና ከክፉ ዓይን መጠበቅ።'
      }
    ],
    studyObjectives: [
      {
        en: 'Master the correct pronunciation, articulation, and tajweed of Surah Al-Falaq.',
        ar: 'إتقان تلاوة سورة الفلق وتطبيق أحكام القلقلة ومخارج الحروف.',
        am: 'የሱረቱል ፈለቅን ትክክለኛ የቁርአን አነባበብና ተጅዊድ መቆጣጠር።'
      },
      {
        en: 'Internalize the authentic Tafsir Ibn Kathir analysis for each of the five verses.',
        ar: 'فهم واستيعاب تفسير الحافظ ابن كثير التحليلي لآيات السورة الخمس.',
        am: 'የአምስቱን አንቀጾች ትርጓሜ ከኢብኑ ከሲር ተፍሲር ጥልቅ ትንታኔ መረዳት።'
      },
      {
        en: 'Establish the prophetic routine of morning, evening, and bedtime recitation.',
        ar: 'المواظبة على السُنّة النبوية بقراءة المعوذتين صباحاً ومساءً وعند المنام.',
        am: 'ሱረቱን በጠዋት፣ በማታና በመኝታ ወቅት የማንበብ ነቢያዊ ሱናን ማዳበር።'
      }
    ],
    curatedAiAnalysis: {
      overviewEn: 'Surah Al-Falaq provides a holistic defensive perimeter around the believer\'s external reality. Where other systems resort to amulets, charms, or superstitions, Islam roots absolute defense in pure Monotheistic reliance upon the Lord of Daybreak.',
      overviewAr: 'تقدم سورة الفلق منظومة وقائية متكاملة لبيئة المؤمن الخارجية، فتقطع كل تعلق بالتمائم والخرافات وتغرس اليقين الراسخ في كفاية رب الفلق.',
      overviewAm: 'ሱረቱል ፈለቅ አማኙን ከአጉል እምነቶችና ክታቦች በማውጣት ሙሉ ጥበቃን ከአላህ ብቻ እንዲሻ የሚያስተምር ታላቅ ሱራህ ነው።',
      linguisticEloquenceEn: 'The phonetic rhyme of Qaf and Dal with the Qalqalah echo creates a sharp, cutting resonance that cuts through fear and spells just as the dawn cuts through nocturnal darkness.',
      linguisticEloquenceAr: 'الإيقاع الصوتي في فواصل الآيات المقلقلة (الفلق، خَلَق، وَقَب، العُقَد، حَسَد) يعطي جرساً قاطعاً يبدد أوهام الخوف كما يقطع الفلق حجب الظلام.',
      linguisticEloquenceAm: 'በአንቀጾቹ መጨረሻ ላይ ያለው የቃላት ዜማና የቀልቀላህ ድምፅ ልብን የሚያረጋጋና ጨለማን የሚገፍ ልዩ ሃይል አለው።',
      practicalApplicationEn: 'Recite Surah Al-Falaq together with Al-Ikhlas and An-Nas three times every morning and evening and before sleeping to form an impenetrable spiritual shield.',
      practicalApplicationAr: 'المحافظة على قراءة الفلق والإخلاص والناس ثلاثاً في الصباح والمساء والنفث في الكفين عند النوم ومسح الجسد.',
      practicalApplicationAm: 'ሱረቱል ፈለቅን ከኢኽላስና ናስ ጋር በጠዋት፣ በማታና ከመኝታ በፊት ሶስት ጊዜ ማንበብ ከአደጋዎች ሁሉ ጥበቃን ይሰጣል።'
    },
    segments: [
      {
        id: 'seg-113-1',
        moduleId: 'mod-falaq',
        label: 'Ayah 1 • Seeking Refuge in the Lord of Daybreak',
        labelAr: 'الآية ١ • الاستعاذة برب الفلق والصبح',
        surahNumber: 113,
        verseNumber: 1,
        arabicText: 'قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ',
        transliteration: 'Qul a\'oozhu bi Rabbil-falaq',
        translation: {
          en: 'Say, "I seek refuge in the Lord of daybreak,"',
          ar: 'قل يا محمد: ألتجئ وأعتصم برب الصبح وفالق الإصباح جل جلاله.',
          am: '«በላቸው፡- በንጋቱ ጌታ እጠበቃለሁ።»'
        },
        explanation: {
          en: CURATED_IBN_KATHIR_EXEGESIS['113:1'].summaryEn,
          ar: CURATED_IBN_KATHIR_EXEGESIS['113:1'].summaryAr,
          am: CURATED_IBN_KATHIR_EXEGESIS['113:1'].summaryAm
        },
        tafsirIbnKathir: CURATED_IBN_KATHIR_EXEGESIS['113:1'],
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6227.mp3',
        keywords: [
          {
            id: 'kw-113-1-1',
            word: 'A\'udhu',
            arabic: 'أَعُوذُ',
            root: 'ع-و-ذ',
            rootTransliteration: '\'A-W-DH',
            morphology: {
              en: 'First-Person Present/Future Verb',
              ar: 'فعل مضارع مرفوع يفيد اللجوء والاعتصام'
            },
            meaning: {
              en: 'I seek refuge / I take sanctuary',
              ar: 'ألتجئ وأتحصن وأعتصم',
              am: 'እጠበቃለሁ / እሸሸጋለሁ'
            },
            expansions: [
              'Al-\'Iyadha is turning to Allah for protection against evil, whereas Al-Liyadha is turning to Him for gaining good.'
            ]
          },
          {
            id: 'kw-113-1-2',
            word: 'Al-Falaq',
            arabic: 'ٱلْفَلَقِ',
            root: 'ف-ل-ق',
            rootTransliteration: 'F-L-Q',
            morphology: {
              en: 'Definite Verbal Noun / Cleavage',
              ar: 'اسم دال على الصبح المشقوق نوره من ظلمة الليل'
            },
            meaning: {
              en: 'The Daybreak / The Cleaver of Dawn',
              ar: 'الصبح وفالق النور',
              am: 'የንጋት ጎህ'
            },
            expansions: [
              'Falaq denotes splitting something open. Ibn Abbas explained: "Falaq is the morning which splits through the darkness."'
            ]
          }
        ]
      },
      {
        id: 'seg-113-2',
        moduleId: 'mod-falaq',
        label: 'Ayah 2 • Sanctuary from Creation\'s Harm',
        labelAr: 'الآية ٢ • الاستعاذة من شر ما خلق',
        surahNumber: 113,
        verseNumber: 2,
        arabicText: 'مِن شَرِّ مَا خَلَقَ',
        transliteration: 'Min sharri maa khalaq',
        translation: {
          en: 'From the evil of that which He created,',
          ar: 'من شر جميع المخلوقات المؤذية من الإنس والجن والسباع وهوام الأرض وجهنم.',
          am: '«ከፈጠረው ፍጡር ሁሉ ክፋት፤»'
        },
        explanation: {
          en: CURATED_IBN_KATHIR_EXEGESIS['113:2'].summaryEn,
          ar: CURATED_IBN_KATHIR_EXEGESIS['113:2'].summaryAr,
          am: CURATED_IBN_KATHIR_EXEGESIS['113:2'].summaryAm
        },
        tafsirIbnKathir: CURATED_IBN_KATHIR_EXEGESIS['113:2'],
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6228.mp3',
        keywords: [
          {
            id: 'kw-113-2-1',
            word: 'Sharri',
            arabic: 'شَرِّ',
            root: 'ش-ر-ر',
            rootTransliteration: 'SH-R-R',
            morphology: {
              en: 'Noun in Genitive Case',
              ar: 'اسم مجرور بحرف الجر (من)'
            },
            meaning: {
              en: 'Evil / Harm / Malice',
              ar: 'الأذى والفساد والمكروه',
              am: 'ክፋት / ተንኮል'
            },
            expansions: [
              'Shar encompasses both worldly physical harm and spiritual corruption that distances one from paradise.'
            ]
          }
        ]
      },
      {
        id: 'seg-113-3',
        moduleId: 'mod-falaq',
        label: 'Ayah 3 • The Peril of Settling Darkness',
        labelAr: 'الآية ٣ • الاستعاذة من غاسق الليل إذا وقب',
        surahNumber: 113,
        verseNumber: 3,
        arabicText: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
        transliteration: 'Wa min sharri ghaasiqin izaa waqab',
        translation: {
          en: 'And from the evil of darkness when it settles,',
          ar: 'ومن شر الليل إذا أقبل بظلامه، ومن شر القمر حين يغيب وتنتشر الشياطين والسباع.',
          am: '«ከጨለማም ክፋት፤ በገባ ጊዜ፤»'
        },
        explanation: {
          en: CURATED_IBN_KATHIR_EXEGESIS['113:3'].summaryEn,
          ar: CURATED_IBN_KATHIR_EXEGESIS['113:3'].summaryAr,
          am: CURATED_IBN_KATHIR_EXEGESIS['113:3'].summaryAm
        },
        tafsirIbnKathir: CURATED_IBN_KATHIR_EXEGESIS['113:3'],
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6229.mp3',
        keywords: [
          {
            id: 'kw-113-3-1',
            word: 'Ghasiq',
            arabic: 'غَاسِقٍ',
            root: 'غ-س-ق',
            rootTransliteration: 'GH-S-Q',
            morphology: {
              en: 'Active Participle / Total Darkness',
              ar: 'اسم فاعل دال على اشتداد الظلمة أو الليل'
            },
            meaning: {
              en: 'Darkness / The Night / The Moon',
              ar: 'الليل البهيم أو القمر إذا غاب أو طلع',
              am: 'ጨለማ / ሌሊት'
            },
            expansions: [
              'Ghasaq is the onset of intense night darkness. The Prophet (ﷺ) pointed to the moon and called it the ghasiq.'
            ]
          },
          {
            id: 'kw-113-3-2',
            word: 'Waqab',
            arabic: 'وَقَبَ',
            root: 'و-ق-ب',
            rootTransliteration: 'W-Q-B',
            morphology: {
              en: 'Past Tense Verb',
              ar: 'فعل ماضٍ يفيد الدخول والحلول'
            },
            meaning: {
              en: 'Settled / Entered / Enveloped',
              ar: 'دخل وأقبل بظلامه وغطى الكون',
              am: 'በገባና በተንሰራፋ ጊዜ'
            },
            expansions: [
              'Waqaba implies sinking into darkness or entering deeply so that danger is hidden.'
            ]
          }
        ]
      },
      {
        id: 'seg-113-4',
        moduleId: 'mod-falaq',
        label: 'Ayah 4 • The Blowers in Knots (Witchcraft)',
        labelAr: 'الآية ٤ • الاستعاذة من النفاثات في العقد',
        surahNumber: 113,
        verseNumber: 4,
        arabicText: 'وَمِن شَرِّ ٱلنَّفَّـٰثَـٰتِ فِى ٱلْعُقَدِ',
        transliteration: 'Wa min sharrin-naffaathaati fil-\'uqad',
        translation: {
          en: 'And from the evil of the blowers in knots,',
          ar: 'ومن شر السواحر اللاتي يعقدن العقد وينفثن فيها بريقهن لإلحاق الضرر.',
          am: '«በቋጠሮዎችም ተፊዎች (ጠንቋዮች) ክፋት፤»'
        },
        explanation: {
          en: CURATED_IBN_KATHIR_EXEGESIS['113:4'].summaryEn,
          ar: CURATED_IBN_KATHIR_EXEGESIS['113:4'].summaryAr,
          am: CURATED_IBN_KATHIR_EXEGESIS['113:4'].summaryAm
        },
        tafsirIbnKathir: CURATED_IBN_KATHIR_EXEGESIS['113:4'],
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6230.mp3',
        keywords: [
          {
            id: 'kw-113-4-1',
            word: 'An-Naffathat',
            arabic: 'ٱلنَّفَّـٰثَـٰتِ',
            root: 'ن-ف-ث',
            rootTransliteration: 'N-F-TH',
            morphology: {
              en: 'Feminine Plural Intensive Participle',
              ar: 'صيغة مبالغة لجمع المؤنث من النفث (النفث مع الريق الخفيف)'
            },
            meaning: {
              en: 'The Blowers / Sorceresses',
              ar: 'الساحرات النافثات في خيوط السحر',
              am: 'በድግምት የሚተፉ ጠንቋዮች'
            },
            expansions: [
              'Nafath is blowing with light moisture or spittle. In witchcraft, it accompanies demonic incantations.'
            ]
          },
          {
            id: 'kw-113-4-2',
            word: 'Al-\'Uqad',
            arabic: 'ٱلْعُقَدِ',
            root: 'ع-ق-د',
            rootTransliteration: '\'A-Q-D',
            morphology: {
              en: 'Plural of \'Uqdah (Knot)',
              ar: 'جمع عُقدة'
            },
            meaning: {
              en: 'The Knots / Cord Bindings',
              ar: 'العقد التي يعقدها السحرة في الخيوط',
              am: 'ቋጠሮዎች'
            },
            expansions: [
              'Labid bin A\'sam tied 11 knots in the Prophet\'s comb hair; reciting these surahs dissolved each knot completely.'
            ]
          }
        ]
      },
      {
        id: 'seg-113-5',
        moduleId: 'mod-falaq',
        label: 'Ayah 5 • The Toxic Eye of the Envier',
        labelAr: 'الآية ٥ • الاستعاذة من حسد الحاسد وعينه',
        surahNumber: 113,
        verseNumber: 5,
        arabicText: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        transliteration: 'Wa min sharri haasidin izaa hasad',
        translation: {
          en: 'And from the evil of an envier when he envies.',
          ar: 'ومن شر حاسد يبغض نعم الله على عباده إذا أظهر حسده وعمل بمقتضاه.',
          am: '«ከምቀኛም ክፋት፤ በምቀኘ ጊዜ።»'
        },
        explanation: {
          en: CURATED_IBN_KATHIR_EXEGESIS['113:5'].summaryEn,
          ar: CURATED_IBN_KATHIR_EXEGESIS['113:5'].summaryAr,
          am: CURATED_IBN_KATHIR_EXEGESIS['113:5'].summaryAm
        },
        tafsirIbnKathir: CURATED_IBN_KATHIR_EXEGESIS['113:5'],
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6231.mp3',
        keywords: [
          {
            id: 'kw-113-5-1',
            word: 'Hasid',
            arabic: 'حَاسِدٍ',
            root: 'ح-س-د',
            rootTransliteration: 'H-S-D',
            morphology: {
              en: 'Active Participle / Envious One',
              ar: 'اسم فاعل يدل على المتمني زوال نعمة غيره'
            },
            meaning: {
              en: 'An Envier / Malicious Observer',
              ar: 'المحسد المتمني زوال النعمة عن غيره',
              am: 'ምቀኛ ሰው'
            },
            expansions: [
              'Hasad is the resentment of another\'s blessings. The Evil Eye is a lethal manifestation of unleashed envy.'
            ]
          }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // MODULE 8: SURAH AN-NAS (114) - Al-Mu'awwidhatayn Part 2
  // -------------------------------------------------------------
  {
    id: 'mod-nas',
    title: 'Surah An-Nas (Mankind)',
    titleAr: 'سورة الناس',
    titleAm: 'ሱረቱል ናስ (የሰዎች ጌታ)',
    subtitle: 'Al-Mu\'awwidhatayn • Lord, Sovereign & God of Humanity against the Whispering Retreat',
    subtitleAr: 'المعوذة الثانية • مسك ختام القرآن العظيم وحصن الصدور من كيد الوسواس الخناس',
    subtitleAm: 'አል-ሙዐዊዘተይን • የቁርአን መደምደሚያና ከሸይጧን የልብ ጉትጎታ መከላከያ ታላቅ ሱራህ',
    orderIndex: 8,
    surahNumber: 114,
    revelationType: 'Meccan',
    totalVerses: 6,
    themeColor: 'emerald',
    description: `Surah An-Nas forms the closing seal and grand finale of the Noble Quran. While Surah Al-Falaq shields against external and physical afflictions, Surah An-Nas addresses the far more dangerous threat: internal corruption of the heart, faith, and conscience. Imam Ibn Kathir illuminates that this surah invokes three supreme divine titles: Lordship (Rububiyyah), Absolute Royalty (Mulk), and Divine Worship (Uluhiyyah), turning to the Master of humanity against the stealthy, retreating whisperer (Al-Waswas Al-Khannas).`,
    descriptionAr: `سورة الناس هي خاتمة المصحف الشريف ومسك ختام التنزيل الإلهي الحكيم؛ خصها الله بحماية القلوب والأرواح من أعظم فتن الوجود: وسوسة الشياطين وإفساد العقائد. وبيّن الإمام ابن كثير في تفسيره أنها جمعت بين توحيد الربوبية والملك والألوهية للاستعاذة بالمتصف بهذه الكمالات من شر الوسواس الخناس الذي يجري من ابن آدم مجرى الدم، والذي يخنس ويذل بذكر الله.`,
    descriptionAm: `ሱረቱል ናስ የተከበረው ቁርአን መደምደሚያ ናት። ሱረቱል ፈለቅ ከውጫዊ አደጋዎች ሲጠብቅ፤ ሱረቱል ናስ ደግሞ እጅግ አደገኛ ከሆነው ውስጣዊ የልብና የእምነት መበላሸት ይጠብቃል። አላህ የሰው ልጆች ጌታ፣ ንጉስና ብቸኛ አምላክ መሆኑን በማስታወስ ከሸይጧን ተንኮል መሸሸጊያ እንዲሆነን ታዛለች።`,
    thematicPillars: [
      {
        id: 'tp-nas-1',
        titleEn: 'The Triple Divine Hierarchy (Rububiyyah, Mulk, Uluhiyyah)',
        titleAr: 'مراتب التوحيد الثلاث: الربوبية والملك والألوهية',
        titleAm: 'ሶስቱ የፈጣሪ መገለጫዎች (ረብ፣ መሊክ፣ ኢላህ)',
        descriptionEn: 'Recognizing Allah first as the Nurturer (Rabb), then as Sovereign King (Malik), and ultimately as the sole Deity worshipped (Ilah).',
        descriptionAr: 'التدرج البلاغي المعجز من إثبات الربوبية العامة إلى إثبات الملك القاهر ثم إفراد الألوهية بالعبادة الخالصة.',
        descriptionAm: 'አላህ አስገኚ፣ ገዢና ብቸኛ ተመላኪ መሆኑን በቅደም ተከተል በማረጋገጥ ልብን ለእርሱ ብቻ ማስገዛት።'
      },
      {
        id: 'tp-nas-2',
        titleEn: 'The Retreating Whisperer (Al-Waswas Al-Khannas)',
        titleAr: 'طبيعة الشيطان الخناس وسلاح الذكر القاطع',
        titleAm: 'አላህ ሲወሳ የሚሸሸው ሸይጧንና የዚክር ሃይል',
        descriptionEn: 'The psychological reality of Satan perched upon the heart: he whispers when man is heedless, but instantly cowers and flees when Allah is remembered.',
        descriptionAr: 'حقيقة جثوم الشيطان على قلب ابن آدم؛ يوسوس في الغفلة ويخنس ويصغر عند استحضار ذكر الله والاستعاذة.',
        descriptionAm: 'ሸይጧን በሰው ልብ ላይ አድብቶ እንደሚኖርና ሰው ሲዘነጋ ክፉ ሀሳብ እንደሚዘራ፤ አላህ ሲወሳ ግን ወዲያው እንደሚሸሽ መገንዘብ።'
      },
      {
        id: 'tp-nas-3',
        titleEn: 'Human and Jinn Adversaries (Minal-Jinnati Wan-Nas)',
        titleAr: 'الحذر من شياطين الإنس وشياطين الجن',
        titleAm: 'የሰውና የጂን አሳሳቾች ጥንቃቄ',
        descriptionEn: 'Awareness that evil suggestions emerge not only from unseen demons, but also from corrupt human associates, persuasive media, and toxic companions.',
        descriptionAr: 'إدراك أن الإغواء يكون من قرناء السوء ومضللي البشر تماماً كما يكون من وساوس إبليس الخفية.',
        descriptionAm: 'የክፋት ጉትጎታ ከማይታዩ ጂኖች ብቻ ሳይሆን ከመጥፎ ጓደኞችና አሳሳች ሰዎችም እንደሚመጣ አውቆ መጠንቀቅ።'
      }
    ],
    studyObjectives: [
      {
        en: 'Recite Surah An-Nas with pristine tajweed, rhythm, and clarity.',
        ar: 'إتقان تلاوة سورة الناس ترتيلاً وتجويداً وتدبراً.',
        am: 'ሱረቱል ናስን በትክክለኛ ተጅዊድና ውብ ድምፅ ማንበብ።'
      },
      {
        en: 'Master the classical commentary of Ibn Kathir on the nature of Waswasah and its spiritual antidote.',
        ar: 'فهم دقائق تفسير ابن كثير في كشف مكائد الوسواس الخناس وعلاجه النبوي.',
        am: 'የኢብኑ ከሲርን ተፍሲር በመማር የሸይጧንን ተንኮሎች እንዴት ማክሸፍ እንደሚቻል መረዳት።'
      },
      {
        en: 'Reflect upon how the Quran begins with seeking guidance (Al-Fatiha) and concludes with seeking protection (An-Nas).',
        ar: 'استشعار حكمة افتتاح المصحف بطلب الهداية (الفاتحة) وختمه بطلب الحماية (الناس).',
        am: 'ቁርአን በቅን መመሪያ ልመና (በፋቲሃ) ተጀምሮ በጥበቃ ልመና (በናስ) የመጠናቀቁን ጥበብ ማስተንተን።'
      }
    ],
    curatedAiAnalysis: {
      overviewEn: 'Surah An-Nas anchors human sanity and spiritual integrity. By connecting the heart to the True Sovereign, it neutralizes existential dread, intrusive blasphemies, and chronic anxiety.',
      overviewAr: 'تمثل سورة الناس الحصن النفسي والروحي الأعظم للإنسان؛ فتحمي العقل والقلب من الشكوك والخواطر الهدامة وتمنح السكينة التامة.',
      overviewAm: 'ሱረቱል ናስ የሰውን ልጅ ልብና አእምሮ ከጭንቀት፣ ከጥርጣሬና ከመጥፎ ሀሳቦች በማጽዳት ውስጣዊ ሰላምን ያጎናጽፋል።',
      linguisticEloquenceEn: 'The gradual repetition of the sibilant "seen" sound (Nas, Waswas, Khannas, Sudur) acoustically mirrors the subtle, stealthy whispering of thoughts into the soul, while the divine names Rabb, Malik, and Ilah stand as towering granite bastions.',
      linguisticEloquenceAr: 'تكرار حرف السين الصفييري (الناس، الوسواس، الخناس، الصدور) يحاكي صوت الوسوسة الخفي الذي يتردد في النفس، بينما تصدع أسماء الرب والملك والإله كأركان منيعة تطرد كل وسواس.',
      linguisticEloquenceAm: 'የ "ስ" ድምፅ መደጋገም በልብ ውስጥ የሚጎተጉተውን የሸይጧን ድምፅ የሚወክል ሲሆን፤ የአላህ ታላላቅ ስሞች ደግሞ እርሱን የሚያባርሩ ኃያል ምሽጎች ናቸው።',
      practicalApplicationEn: 'Whenever intrusive blasphemous or anxious whispers arise, immediately stop ruminating, say "Amantu billahi wa rusulih" (I believe in Allah and His Messengers), recite Surah An-Nas, and engage in dhikr.',
      practicalApplicationAr: 'عند هجوم وساوس الشك أو الحزن والهم؛ اقطع التفكير مباشرة واستعذ بالله وقل: «آمنت بالله ورسله» واقرأ سورة الناس واشتغل بذكر الله والعمل الصالح.',
      practicalApplicationAm: 'መጥፎ ወይም አስጨናቂ ሀሳቦች ሲመጡ፤ ወዲያውኑ ማሰብን በማቆም «አመንቱ ቢላሂ ወሩሱሊህ» በማለት ሱረቱል ናስን ማንበብና ወደ ዚክር መመለስ።'
    },
    segments: [
      {
        id: 'seg-114-1',
        moduleId: 'mod-nas',
        label: 'Ayah 1 • Refuge in the Lord of Mankind',
        labelAr: 'الآية ١ • الاستعاذة برب الناس وخالقهم',
        surahNumber: 114,
        verseNumber: 1,
        arabicText: 'قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ',
        transliteration: 'Qul a\'oozhu bi Rabbin-naas',
        translation: {
          en: 'Say, "I seek refuge in the Lord of mankind,"',
          ar: 'قل يا محمد: أعتصم وألتجئ برب البشر وخالقهم ومدبر أمورهم ومربيهم بالنعم.',
          am: '«በላቸው፡- በሰዎች ጌታ እጠበቃለሁ፤»'
        },
        explanation: {
          en: CURATED_IBN_KATHIR_EXEGESIS['114:1'].summaryEn,
          ar: CURATED_IBN_KATHIR_EXEGESIS['114:1'].summaryAr,
          am: CURATED_IBN_KATHIR_EXEGESIS['114:1'].summaryAm
        },
        tafsirIbnKathir: CURATED_IBN_KATHIR_EXEGESIS['114:1'],
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6232.mp3',
        keywords: [
          {
            id: 'kw-114-1-1',
            word: 'Rabbi',
            arabic: 'رَبِّ',
            root: 'ر-ب-ب',
            rootTransliteration: 'R-B-B',
            morphology: {
              en: 'Noun in Genitive Case / Master & Nurturer',
              ar: 'اسم مجرور مضاف يفيد الخلق والتربية والسيادة'
            },
            meaning: {
              en: 'Lord / Sustainer / Guardian',
              ar: 'الخالق المربي والمالك المتصرف',
              am: 'ጌታ / አሳዳጊ / ጠባቂ'
            },
            expansions: [
              'Rabb indicates upbringing and nurturing stage by stage until perfection.'
            ]
          },
          {
            id: 'kw-114-1-2',
            word: 'An-Nas',
            arabic: 'ٱلنَّاسِ',
            root: 'ن-و-س',
            rootTransliteration: 'N-W-S',
            morphology: {
              en: 'Definite Plural Noun / Humanity',
              ar: 'اسم جمع معرف دال على جنس البشر'
            },
            meaning: {
              en: 'Mankind / Humanity',
              ar: 'البشر أجمعين',
              am: 'የሰው ልጆች'
            },
            expansions: [
              'An-Nas is mentioned five times in this surah, honoring humanity while emphasizing their complete need for divine protection.'
            ]
          }
        ]
      },
      {
        id: 'seg-114-2',
        moduleId: 'mod-nas',
        label: 'Ayah 2 • The Sovereign of Mankind',
        labelAr: 'الآية ٢ • ملك الناس والمتصرف فيهم',
        surahNumber: 114,
        verseNumber: 2,
        arabicText: 'مَلِكِ ٱلنَّاسِ',
        transliteration: 'Malikin-naas',
        translation: {
          en: 'The Sovereign of mankind,',
          ar: 'ملكهم الحق والآمر الناهي فيهم الذي دانت له الرقاب.',
          am: '«በሰዎች ንጉስ፤»'
        },
        explanation: {
          en: CURATED_IBN_KATHIR_EXEGESIS['114:2'].summaryEn,
          ar: CURATED_IBN_KATHIR_EXEGESIS['114:2'].summaryAr,
          am: CURATED_IBN_KATHIR_EXEGESIS['114:2'].summaryAm
        },
        tafsirIbnKathir: CURATED_IBN_KATHIR_EXEGESIS['114:2'],
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6233.mp3',
        keywords: [
          {
            id: 'kw-114-2-1',
            word: 'Malik',
            arabic: 'مَلِكِ',
            root: 'م-ل-ك',
            rootTransliteration: 'M-L-K',
            morphology: {
              en: 'Proper Noun of Supreme Royalty',
              ar: 'صفة مشبهة واسم فاعل يفيد كمال السلطان ونفاذ الأمر'
            },
            meaning: {
              en: 'The Sovereign / King of Kings',
              ar: 'الملك الحق المتصرف المطلق',
              am: 'እውነተኛ ንጉስ'
            },
            expansions: [
              'Malik possesses power to command, execute, pardon, and judge without challenge.'
            ]
          }
        ]
      },
      {
        id: 'seg-114-3',
        moduleId: 'mod-nas',
        label: 'Ayah 3 • The God of Mankind',
        labelAr: 'الآية ٣ • إله الناس ومعبودهم بحق',
        surahNumber: 114,
        verseNumber: 3,
        arabicText: 'إِلَـٰهِ ٱلنَّاسِ',
        transliteration: 'Ilaahin-naas',
        translation: {
          en: 'The God of mankind,',
          ar: 'معبودهم بالحق الذي لا يستحق الألوهية والعبادة سواه.',
          am: '«በሰዎች አምላክ፤»'
        },
        explanation: {
          en: CURATED_IBN_KATHIR_EXEGESIS['114:3'].summaryEn,
          ar: CURATED_IBN_KATHIR_EXEGESIS['114:3'].summaryAr,
          am: CURATED_IBN_KATHIR_EXEGESIS['114:3'].summaryAm
        },
        tafsirIbnKathir: CURATED_IBN_KATHIR_EXEGESIS['114:3'],
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6234.mp3',
        keywords: [
          {
            id: 'kw-114-3-1',
            word: 'Ilah',
            arabic: 'إِلَـٰهِ',
            root: 'أ-ل-ه',
            rootTransliteration: 'A-L-H',
            morphology: {
              en: 'Noun of Worship in Genitive',
              ar: 'اسم علم دال على المعبود بحق'
            },
            meaning: {
              en: 'The Deity / The God Worshipped',
              ar: 'المعبود بحق ومحبة وتعظيم',
              am: 'ብቸኛ አምላክ'
            },
            expansions: [
              'Al-Ilah is the One towards whom hearts turn in veneration, longing, repentance, and fear.'
            ]
          }
        ]
      },
      {
        id: 'seg-114-4',
        moduleId: 'mod-nas',
        label: 'Ayah 4 • The Retreating Whisperer',
        labelAr: 'الآية ٤ • من شر الوسواس الخناس الجاثم على القلوب',
        surahNumber: 114,
        verseNumber: 4,
        arabicText: 'مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ',
        transliteration: 'Min sharril-waswaasil-khannaas',
        translation: {
          en: 'From the evil of the retreating whisperer -',
          ar: 'من شر الشيطان الذي يلقي الوساوس في الصدور، فإذا ذُكر الله خنس وتراجع وتوارى ذليلاً.',
          am: '«አላህ ሲወሳ ከሚሸሸው፣ አሳሳች ከሆነው (ሸይጧን) ክፋት፤»'
        },
        explanation: {
          en: CURATED_IBN_KATHIR_EXEGESIS['114:4'].summaryEn,
          ar: CURATED_IBN_KATHIR_EXEGESIS['114:4'].summaryAr,
          am: CURATED_IBN_KATHIR_EXEGESIS['114:4'].summaryAm
        },
        tafsirIbnKathir: CURATED_IBN_KATHIR_EXEGESIS['114:4'],
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6235.mp3',
        keywords: [
          {
            id: 'kw-114-4-1',
            word: 'Al-Waswas',
            arabic: 'ٱلْوَسْوَاسِ',
            root: 'و-س-و-س',
            rootTransliteration: 'W-S-W-S',
            morphology: {
              en: 'Reduplicated Noun of Sound / Subtle Whisper',
              ar: 'اسم فاعل ومصدر ميمي يفيد الصوت الخفي الخبيث'
            },
            meaning: {
              en: 'The Persistent Whisperer',
              ar: 'الملقي للخواطر الرديئة في الخفاء',
              am: 'አሳሳች / የልብ ክፉ ጉትጎታ'
            },
            expansions: [
              'Waswasah is a hidden inner voice that incites toward vice while masking its malice as benefit.'
            ]
          },
          {
            id: 'kw-114-4-2',
            word: 'Al-Khannas',
            arabic: 'ٱلْخَنَّاسِ',
            root: 'خ-ن-س',
            rootTransliteration: 'KH-N-S',
            morphology: {
              en: 'Intensive Adjective / Habitual Retreater',
              ar: 'صيغة مبالغة تفيد سرعة التراجع والتواري'
            },
            meaning: {
              en: 'The Retreating One / The Cowardly Shadow',
              ar: 'المنقبض المتواري عند ذكر الله',
              am: 'አላህ ሲወሳ ወዲያው የሚሸሽ'
            },
            expansions: [
              'Khannas signifies shrinking into hiding. When Allah\'s name is spoken, the devil collapses and disappears.'
            ]
          }
        ]
      },
      {
        id: 'seg-114-5',
        moduleId: 'mod-nas',
        label: 'Ayah 5 • Whispering into Breasts',
        labelAr: 'الآية ٥ • الذي يوسوس في صدور الناس',
        surahNumber: 114,
        verseNumber: 5,
        arabicText: 'ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ',
        transliteration: 'Allazhee yuwaswisu fee sudoorin-naas',
        translation: {
          en: 'Who whispers [evil] into the breasts of mankind -',
          ar: 'الذي يبث الشكوك والخواطر الفاسدة ويزين الشهوات في قلوب بني آدم.',
          am: '«ያ በሰዎች ልቦች ውስጥ የሚጎተጉተው፤»'
        },
        explanation: {
          en: CURATED_IBN_KATHIR_EXEGESIS['114:5'].summaryEn,
          ar: CURATED_IBN_KATHIR_EXEGESIS['114:5'].summaryAr,
          am: CURATED_IBN_KATHIR_EXEGESIS['114:5'].summaryAm
        },
        tafsirIbnKathir: CURATED_IBN_KATHIR_EXEGESIS['114:5'],
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6236.mp3',
        keywords: [
          {
            id: 'kw-114-5-1',
            word: 'Sudur',
            arabic: 'صُدُورِ',
            root: 'ص-د-ر',
            rootTransliteration: 'S-D-R',
            morphology: {
              en: 'Plural Noun in Genitive (Chest / Breasts)',
              ar: 'جمع صَدْر، وهو موطن القلب ومدخله'
            },
            meaning: {
              en: 'Breasts / Hearts / Inner Consicousness',
              ar: 'الصدور والقلوب وبواطن النفوس',
              am: 'ልቦች / ደረቶች'
            },
            expansions: [
              'The chest is the outer perimeter of the heart; when filled with light through prayer, waswas cannot enter.'
            ]
          }
        ]
      },
      {
        id: 'seg-114-6',
        moduleId: 'mod-nas',
        label: 'Ayah 6 • From Among Jinn and Mankind',
        labelAr: 'الآية ٦ • شياطين الإنس وشياطين الجن',
        surahNumber: 114,
        verseNumber: 6,
        arabicText: 'مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ',
        transliteration: 'Minal-jinnati wannaas',
        translation: {
          en: 'From among the jinn and mankind.',
          ar: 'سواء كان المضل موسوساً من شياطين الجن أو من دعاة الضلالة من شياطين الإنس.',
          am: '«ከጋኔኖችም ከሰዎችም የሆነው።»'
        },
        explanation: {
          en: CURATED_IBN_KATHIR_EXEGESIS['114:6'].summaryEn,
          ar: CURATED_IBN_KATHIR_EXEGESIS['114:6'].summaryAr,
          am: CURATED_IBN_KATHIR_EXEGESIS['114:6'].summaryAm
        },
        tafsirIbnKathir: CURATED_IBN_KATHIR_EXEGESIS['114:6'],
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6237.mp3',
        keywords: [
          {
            id: 'kw-114-6-1',
            word: 'Al-Jinnah',
            arabic: 'ٱلْجِنَّةِ',
            root: 'ج-ن-ن',
            rootTransliteration: 'J-N-N',
            morphology: {
              en: 'Collective Noun / The Jinn',
              ar: 'اسم جمع دال على عالم الجن المستترين عن الأبصار'
            },
            meaning: {
              en: 'The Jinn / Unseen Spirits',
              ar: 'عالم الجن والشياطين الخفية',
              am: 'ጂኖች / የማይታዩ ፍጥረታት'
            },
            expansions: [
              'Jinn originates from janna meaning hidden or concealed from physical human eyesight.'
            ]
          }
        ]
      }
    ]
  }
];
