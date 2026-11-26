import { Verse } from './ibtihalLaylData';

export interface FajrChapterMeta {
  chapter: number;
  timestamp: string;
  startTimeSeconds: number;
  title: {
    en: string;
    ar: string;
    am: string;
    har: string;
  };
  summary: {
    en: string;
    ar: string;
  };
}

export const fajrSecretsChapters: FajrChapterMeta[] = [
  {
    chapter: 1,
    timestamp: '00:00',
    startTimeSeconds: 0,
    title: {
      en: 'The Secrets of Fajr & the Time Before Sunrise',
      ar: 'أسرار الفجر ووقت السحر قبل الشروق',
      am: 'የፈጅርና ከፀሐይ መውጣት በፊት ያለው ጊዜ ምስጢራት',
      har: 'የፈጅርና የሰሐር ወቅቲ ሚስጢራት'
    },
    summary: {
      en: 'Exploring the mysterious spiritual atmosphere of Sahar — the final hours before dawn when the believers seek forgiveness while the world sleeps.',
      ar: 'استكشاف العالم الروحاني المهيب لوقت السحر؛ الساعات الأخيرة قبل الفجر حيث يستغفر المؤمنون ربهم بينما يغط العالم في النوم.'
    }
  },
  {
    chapter: 2,
    timestamp: '01:13',
    startTimeSeconds: 73,
    title: {
      en: 'Why Is Fajr Salah So Important?',
      ar: 'لماذا تُعد صلاة الفجر بهذه الأهمية العظيمة؟',
      am: 'የፈጅር ሶላት ለምን ይህን ያህል ታላቅ ሆነ?',
      har: 'የሱብሒ ሰላት ለምን ታላቅ ሆነ?'
    },
    summary: {
      en: 'The Quranic testimony of dawn ("Indeed, the recitation of dawn is ever witnessed") and why the two Sunnah rak\'ahs of Fajr surpass the entire world and all it contains.',
      ar: 'شهادة القرآن الكريم لقرآن الفجر المشهود، ولماذا كانت ركعتا الفجر خيراً من الدنيا وما فيها.'
    }
  },
  {
    chapter: 3,
    timestamp: '04:59',
    startTimeSeconds: 299,
    title: {
      en: 'The Hidden Wisdom Behind the Exact Time of Fajr',
      ar: 'الحكمة الخفية وراء التوقيت الدقيق لصلاة الفجر',
      am: 'ከፈጅር ትክክለኛ ወቅት በስተጀርባ ያለው ድብቅ ጥበብ',
      har: 'የፈጅር ወቅቲ ጥበብ'
    },
    summary: {
      en: 'Allah swears by the break of dawn (Wal-Fajr) as darkness transitions into light, placing whoever prays Fajr under the direct covenant and protection of Almighty Allah.',
      ar: 'قسم الله عز وجل بالفجر عند انشقاق الظلمة عن النور، ودخول مصلي الفجر في ذمة الله وحفظه وأمانه.'
    }
  },
  {
    chapter: 4,
    timestamp: '08:30',
    startTimeSeconds: 510,
    title: {
      en: 'Fajr, Sleep & the Human Biological Clock',
      ar: 'صلاة الفجر، النوم، والساعة البيولوجية للإنسان',
      am: 'ፈጅር፣ እንቅልፍና የተፈጥሮ የሰውነት ሰዓት',
      har: 'ፈጅር፣ መኝታና የሰውነት ሰዓት'
    },
    summary: {
      en: 'How rising at dawn harmonizes the pineal gland, cortisol-melatonin transition, cardiovascular vitality, and deep focus of the heart and tongue.',
      ar: 'التناغم الإعجازي بين الاستيقاظ للفجر والساعة البيولوجية للجسم، وصفاء الذهن والقلب واللسان في ناشئة الليل.'
    }
  },
  {
    chapter: 5,
    timestamp: '16:40',
    startTimeSeconds: 1000,
    title: {
      en: 'Rizq, Barakah & the Secrets of the Morning Hours',
      ar: 'الرزق والبركة وأسرار ساعات البكور الأولى',
      am: 'ሲሳይ (ሪዝቅ)፣ በረከትና የማለዳ ሰዓታት ምስጢር',
      har: 'ሪዝቅ፣ በረከትና የማለዳ ሚስጢር'
    },
    summary: {
      en: 'Why sustenance (Rizq) and divine blessing (Barakah) are distributed at dawn, anchored in the Prophetic prayer: "O Allah, bless my Ummah in their early mornings."',
      ar: 'سر ارتباط تقسيم الأرزاق والبركة بساعات الصباح الأولى، واستجابة دعاء النبي ﷺ: «اللهم بارك لأمتي في بكورها».'
    }
  },
  {
    chapter: 6,
    timestamp: '20:47',
    startTimeSeconds: 1247,
    title: {
      en: '7 Things to Do After Fajr Salah',
      ar: 'سبعة أعمال نبوية عظيمة بعد صلاة الفجر',
      am: 'ከፈጅር ሶላት በኋላ የሚከናወኑ 7 ታላላቅ ተግባራት',
      har: 'ከሱብሒ ሶላት በኋላ 7 ሱንናዎች'
    },
    summary: {
      en: 'Remaining seated in remembrance of Allah, Quran recitation, morning Adhkar, and praying two rak\'ahs after sunrise to earn the complete reward of Hajj and Umrah.',
      ar: 'المكث في المصلى لذكر الله وتلاوة القرآن وأذكار الصباح حتى تطلع الشمس ثم صلاة ركعتين لنيل أجر حجة وعمرة تامة تامة تامة.'
    }
  },
  {
    chapter: 7,
    timestamp: '24:44',
    startTimeSeconds: 1484,
    title: {
      en: 'Tahajjud & the Secrets of the Last Third of the Night',
      ar: 'قيام الليل (التهجد) وأسرار الثلث الأخير من الليل',
      am: 'ተሀጁድ እና የሌሊቱ የመጨረሻ ሶስተኛ ክፍል ምስጢራት',
      har: 'ተሀጁድ እና የሌይቲ መጨረሻ ክፍል'
    },
    summary: {
      en: 'The sacred hour when our Lord descends to the lowest heaven asking: "Who is calling upon Me that I may answer him? Who is seeking forgiveness that I may forgive him?"',
      ar: 'التنزل الإلهي في الثلث الأخير من كل ليلة حيث ينادي الملك سبحانه: «من يدعوني فأستجيب له؟ من يسألني فأعطيه؟ من يستغفرني فأغفر له؟».'
    }
  },
  {
    chapter: 8,
    timestamp: '29:02',
    startTimeSeconds: 1742,
    title: {
      en: 'What If You Miss Fajr Salah?',
      ar: 'ماذا لو فاتتك صلاة الفجر؟ التحذير والعلاج الروحي',
      am: 'የፈጅር ሶላት ቢያመልጥዎትስ? መንፈሳዊ መፍትሔ',
      har: 'የሱብሒ ሰላት ቢያመልጥ ምን ይደረጋል?'
    },
    summary: {
      en: 'Understanding the spiritual gravity of missing Fajr, the promise of Paradise for guarding the two cool prayers (Al-Bardayn), and immediate sincere rectification.',
      ar: 'إدراك خطورة التهاون بصلاة الفجر، وبشارة الجنة لمن صلى البردين (الفجر والعصر)، وكيفية تدارك الفائت بالتوبة الصادقة والعزم.'
    }
  },
  {
    chapter: 9,
    timestamp: '34:08',
    startTimeSeconds: 2048,
    title: {
      en: 'Shaitan’s Trap: “Just 10 More Minutes”',
      ar: 'فخ الشيطان وعقده الثلاث: «عشر دقائق أخرى فقط»',
      am: 'የሸይጣን ወጥመድና ሶስቱ ቋጠሮዎች፡ «ለ10 ደቂቃ ብቻ ልተኛ»',
      har: 'የሸይጣን ሶስት ቋጠሮዎች'
    },
    summary: {
      en: 'How Satan ties three knots at the back of the head whispering "You have a long night ahead, so sleep," and how Dhikr, Wudhu, and Salah untie every knot.',
      ar: 'كيف يعقد الشيطان على قافية رأس النائم ثلاث عقد يضرب على كل عقدة «عليك ليل طويل فارقد»، وكيف تنحل العقد بالذكر والوضوء والصلاة.'
    }
  },
  {
    chapter: 10,
    timestamp: '38:05',
    startTimeSeconds: 2285,
    title: {
      en: 'The Prophet Muhammad’s ﷺ Morning Routine',
      ar: 'الهدي النبوي الشريف ونظام الصباح للنبي محمد ﷺ',
      am: 'የነቢዩ ሙሐመድ ﷺ የማለዳ ልምድና ሱንና',
      har: 'የነቢዩ ﷺ የማለዳ ሱንና'
    },
    summary: {
      en: 'From sleeping early after Isha and waking with the Siwak, to gazing at the sky reciting the closing verses of Surah Aal-Imran and praying with serene devotion.',
      ar: 'من النوم مبكراً بعد العشاء، والاستيقاظ بالسواك وذكر الله، وتأمل السماء بتلاوة خواتيم سورة آل عمران، إلى صلاة الليل والفجر بخشوع.'
    }
  },
  {
    chapter: 11,
    timestamp: '42:13',
    startTimeSeconds: 2533,
    title: {
      en: 'Why Fajr Makes Your Day Feel Longer',
      ar: 'لماذا تجعل صلاة الفجر يومك أطول وأكثر بركة وإنجازاً؟',
      am: 'ፈጅር ቀንዎን እንዴት ረጅምና የተባረከ ያደርገዋል?',
      har: 'ፈጅር መዓልትን እንዴት ይባርካል?'
    },
    summary: {
      en: 'Unlocking supernatural time expansion (Barakah fi al-Waqt) by starting the day with beneficial knowledge, pure provision, and accepted deeds.',
      ar: 'سر بركة الوقت واتساع الساعات لمن افتتح يومه بصلاة الفجر وسأل الله علماً نافعاً ورزقاً طيباً وعملاً متقبلاً.'
    }
  },
  {
    chapter: 12,
    timestamp: '45:36',
    startTimeSeconds: 2736,
    title: {
      en: 'Powerful Duas & Dhikr After Fajr',
      ar: 'أقوى الأدعية والأذكار المأثورة بعد صلاة الفجر',
      am: 'ከፈጅር ሶላት በኋላ የሚደረጉ ኃይለኛ ዱዓዎችና አዝካሮች',
      har: 'ከሱብሒ በኋላ የሚደረጉ ዱዓዎች'
    },
    summary: {
      en: 'Fortifying the heart and body with the comprehensive Prophetic remembrances of Tawheed and multiplied Tasbih after the dawn prayer.',
      ar: 'تحصين القلب والروح والجسد بأعظم أذكار التوحيد والتسبيح المضاعف التي علمنا إياها النبي ﷺ عقب صلاة الصبح.'
    }
  },
  {
    chapter: 13,
    timestamp: '49:49',
    startTimeSeconds: 2989,
    title: {
      en: 'What Happens in the World of Angels at Fajr',
      ar: 'ماذا يحدث في عالم الملائكة وقت صلاة الفجر؟',
      am: 'በፈጅር ወቅት በመላእክት ዓለም ውስጥ ምን ይከናወናል?',
      har: 'በፈጅር ወቅቲ የመላእክት ዓለም'
    },
    summary: {
      en: 'The cosmic gathering of the angels of the night and the angels of the day at Fajr, ascending to Allah with the testimony: "We left them while they were praying!"',
      ar: 'الاجتماع المهيب لملائكة الليل وملائكة النهار في صلاة الفجر، وصعودهم إلى الله بشهادة الشرف: «أتيناهم وهم يصلون وتركناهم وهم يصلون».'
    }
  },
  {
    chapter: 14,
    timestamp: '52:58',
    startTimeSeconds: 3178,
    title: {
      en: 'The Secret of Nur: How Fajr Changes the Face',
      ar: 'سر النور الإلهي: كيف تغير صلاة الفجر الوجه والقلب؟',
      am: 'የኑር (ብርሃን) ምስጢር፡ ፈጅር ፊትንና ልብን እንዴት ያበራል?',
      har: 'የኑር ሚስጢር፡ ፈጅር ፊትንና ልብን እንዴት ያበራል?'
    },
    summary: {
      en: 'How walking in darkness to Fajr bestows radiant spiritual light (Nur) upon the believer\'s face and heart in this world and complete Light on the Day of Judgment.',
      ar: 'كيف تمنح المحافظة على الفجر والمشي إليها في الظلم نوراً ساطعاً في الوجه والقلب في الدنيا، والنور التام يوم القيامة.'
    }
  }
];

export const fajrSecretsVerses: Verse[] = [
  {
    number: 1,
    arabic: "الصَّابِرِينَ وَالصَّادِقِينَ وَالْقَانِتِينَ وَالْمُنْفِقِينَ وَالْمُسْتَغْفِرِينَ بِالْأَسْحَارِ ... كَانُوا قَلِيلًا مِنَ اللَّيْلِ مَا يَهْجَعُونَ ۝ وَبِالْأَسْحَارِ هُمْ يَسْتَغْفِرُونَ\nيَا نَسْمَةَ الفَجْرِ هُبِّي بِالهُدَى العَطِرِ ... وَأَيْقِظِي القَلْبَ فِي السَّاعَاتِ وَالسَّحَرِ",
    transliteration: "Aṣ-ṣābirīna wa-ṣ-ṣādiqīna wa-l-qānitīna wa-l-munfiqīna wa-l-mustaghfirīna bi-l-asḥār ... Kānū qalīlan mina l-layli mā yahja'ūn, wa-bi-l-asḥāri hum yastaghfirūn\nYā nasmata l-fajri hubbī bi-l-hudā l-'aṭiri ... Wa-ayqiẓī l-qalba fī s-sā'āti wa-s-saḥari",
    translation: {
      en: "[00:00 — Chapter 1: The Secrets of Fajr & the Time Before Sunrise]\n\"The patient, the true, the devoutly obedient, those who spend in charity, and those who seek forgiveness in the hours before dawn (Al-Ashar).\" (Quran 3:17) • \"They used to sleep but little of the night, and in the hours before dawn they would ask forgiveness.\" (Quran 51:17-18)\nReflection: O breeze of dawn, blow forth with fragrant guidance, and awaken the heart during the sacred hours of Sahar while the heedless world sleeps!",
      ar: "[٠٠:٠٠ — الفصل الأول: أسرار الفجر ووقت السحر قبل الشروق]\nقال الله تعالى: ﴿الصَّابِرِينَ وَالصَّادِقِينَ وَالْقَانِتِينَ وَالْمُنْفِقِينَ وَالْمُسْتَغْفِرِينَ بِالْأَسْحَارِ﴾ [آل عمران: ١٧]، وقال سبحانه: ﴿كَانُوا قَلِيلًا مِّنَ اللَّيْلِ مَا يَهْجَعُونَ ۝ وَبِالْأَسْحَارِ هُمْ يَسْتَغْفِرُونَ﴾ [الذاريات: ١٧-١٨].\nوقفة تدبرية: في ساعات السحر الأخيرة قبل الفجر، يهدأ ضجيج الدنيا وتُفتح أبواب السماء للمستغفرين والصادقين.",
      am: "[00:00 — ምዕራፍ 1፡ የፈጅርና ከፀሐይ መውጣት በፊት ያለው ጊዜ (ሰሐር) ምስጢራት]\n«ታጋሾቹ፣ እውነተኞቹ፣ ታዛዦቹ፣ ለጋሾቹና በንጋት ሰዓታት (በአስሐር) ምሕረትን ለማኞቹ ናቸው።» (آل عمران 3:17) • «ከሌሊቱ ጥቂትን ብቻ ይተኙ ነበር፤ በንጋት ሰዓታትም እነርሱ ምሕረትን ይለምኑ ነበር።» (አዝ-ዛሪያት 51:17-18)",
      har: "[00:00 — ምዕራፍ 1፡ የፈጅርና የሰሐር ወቅቲ ሚስጢራት]\n«ታጋሾቹ፣ እውነተኞቹ፣ ታዛዦቹ፣ ለጋሾቹና በንጋት ሰዓታት (በአስሐር) ምሕረትን ለማኞቹ ናቸው።» (አል-ዒምራን 3:17) • በሰሐር ሰዓታት ዓለም ሲተኛ ምእመናን ወደ ጌታቸው ይመለሳሉ።"
    }
  },
  {
    number: 2,
    arabic: "أَقِمِ الصَّلَاةَ لِدُلُوكِ الشَّمْسِ إِلَىٰ غَسَقِ اللَّيْلِ وَقُرْآنَ الْفَجْرِ ۖ إِنَّ قُرْآنَ الْفَجْرِ كَانَ مَشْهُودًا\nرَكْعَتَا الْفَجْرِ خَيْرٌ مِنَ الدُّنْيَا وَمَا فِيهَا",
    transliteration: "Aqimi ṣ-ṣalāta li-dulūki sh-shamsi ilā ghasaqi l-layli wa-qur'āna l-fajri, inna qur'āna l-fajri kāna mashhūdā\nRak'atā l-fajri khayrun mina d-dunyā wa-mā fīhā",
    translation: {
      en: "[01:13 — Chapter 2: Why Is Fajr Salah So Important?]\n\"Establish prayer at the decline of the sun until the darkness of the night and [especially] the Qur'an of dawn. Indeed, the recitation of dawn is ever witnessed.\" (Quran 17:78)\nProphetic Hadith: The Messenger of Allah ﷺ said: \"The two [Sunnah] rak'ahs of Fajr are better than the world and everything in it.\" (Sahih Muslim 725). If the voluntary prelude to Fajr outweighs the entire earthly realm, imagine the immeasurable station of the obligatory Fajr prayer itself!",
      ar: "[٠١:١٣ — الفصل الثاني: لماذا تُعد صلاة الفجر بهذه الأهمية العظيمة؟]\nقال الله تعالى: ﴿أَقِمِ الصَّلَاةَ لِدُلُوكِ الشَّمْسِ إِلَىٰ غَسَقِ اللَّيْلِ وَقُرْآنَ الْفَجْرِ ۖ إِنَّ قُرْآنَ الْفَجْرِ كَانَ مَشْهُودًا﴾ [الإسراء: ٧٨].\nوقال النبي ﷺ: «رَكْعَتَا الْفَجْرِ خَيْرٌ مِنَ الدُّنْيَا وَمَا فِيهَا» (رواه مسلم). فإذا كانت سنة الفجر القبلية خيراً من الدنيا بأسرها، فكيف بفرضيّة الفجر التي تشهدها ملائكة الليل والنهار!",
      am: "[01:13 — ምዕራፍ 2፡ የፈጅር ሶላት ለምን ይህን ያህል ታላቅ ሆነ?]\n«ሶላትን ከፀሐይ መዘንበል እስከ ሌሊት ጨለማ ድረስ ስገድ፤ የጎህንም ቁርአን (የፈጅርን ሶላት) አድርስ፤ የጎህ ቁርአን (በመላእክት) የሚመሰከርበት ነውና።» (አል-ኢስራእ 17:78)\nነቢዩ ﷺ እንዲህ ብለዋል፡- «የፈጅር ሁለት ረከዓ (ሱንና) ከዱንያና በውስጧ ካለው ሁሉ ይበልጣሉ።» (ሰሒሕ ሙስሊም)",
      har: "[01:13 — ምዕራፍ 2፡ የሱብሒ ሰላት ለምን ታላቅ ሆነ?]\n«የጎህ ቁርአን (የፈጅር ሶላት) በመላእክት የሚመሰከርበት ነውና።» (አል-ኢስራእ 17:78) • ነቢዩ ﷺ፡ «የፈጅር ሁለት ረከዓ ከዱንያና በውስጧ ካለው ሁሉ ይበልጣሉ» ብለዋል።"
    }
  },
  {
    number: 3,
    arabic: "وَالْفَجْرِ ۝ وَلَيَالٍ عَشْرٍ ... وَالصُّبْحِ إِذَا تَنَفَّسَ\nمَنْ صَلَّى الصُّبْحَ فَهُوَ فِي ذِمَّةِ اللَّهِ ... فَلَا يَطْلُبَنَّكُمُ اللَّهُ مِنْ ذِمَّتِهِ بِشَيْءٍ",
    transliteration: "Wa-l-fajri, wa-layālin 'ashr ... Wa-ṣ-ṣubḥi idhā tanaffas\nMan ṣallā ṣ-ṣubḥa fa-huwa fī dhimmati Llāhi ... Fa-lā yaṭlubannakumu Llāhu min dhimmatihi bi-shay'",
    translation: {
      en: "[04:59 — Chapter 3: The Hidden Wisdom Behind the Exact Time of Fajr]\n\"By the dawn, and by the ten nights\" (Quran 89:1-2) • \"And by the morning as it breathes forth!\" (Quran 81:18)\nProphetic Hadith: \"Whoever prays the dawn prayer (Al-Subh), he is under the covenant and protection (Dhimmah) of Allah; so let not Allah call you to account for violating His protection in any way.\" (Sahih Muslim 657). At the exact moment dawn breathes life into the horizon, the believer enters a divine fortress of safety.",
      ar: "[٠٤:٥٩ — الفصل الثالث: الحكمة الخفية وراء التوقيت الدقيق لصلاة الفجر]\nقال تعالى: ﴿وَالْفَجْرِ ۝ وَلَيَالٍ عَشْرٍ﴾ [الفجر: ١-٢]، وقال سبحانه: ﴿وَالصُّبْحِ إِذَا تَنَفَّسَ﴾ [التكوير: ١٨].\nوقال رسول الله ﷺ: «مَنْ صَلَّى الصُّبْحَ فَهُوَ فِي ذِمَّةِ اللَّهِ» (رواه مسلم). ففي اللحظة التي يتنفس فيها الصبح وينشق النور من قلب الظلام، يدخل المصلي في عهد الله وحفظه وأمانه.",
      am: "[04:59 — ምዕራፍ 3፡ ከፈጅር ትክክለኛ ወቅት በስተጀርባ ያለው ድብቅ ጥበብ]\n«በጎህ እምላለሁ፤ በአሥሩ ሌሊቶችም» (አል-ፈጅር 89:1-2) • «በንጋቱም በተነፈሰ (ብርሃኑን ባወጣ) ጊዜ!» (አት-ተክዊር 81:18)\nነቢዩ ﷺ እንዲህ ብለዋል፡- «የሱብሒን ሶላት የሰገደ ሰው በአላህ ጥበቃና ቃል ኪዳን ውስጥ ነው።» (ሰሒሕ ሙስሊም)",
      har: "[04:59 — ምዕራፍ 3፡ የፈጅር ወቅቲ ጥበብ]\n«በጎህ እምላለሁ... በንጋቱም በተነፈሰ ጊዜ!» • ነቢዩ ﷺ፡ «የሱብሒን ሶላት የሰገደ ሰው በአላህ ጥበቃና ቃል ኪዳን (ዚምማህ) ውስጥ ነው» ብለዋል።"
    }
  },
  {
    number: 4,
    arabic: "إِنَّ نَاشِئَةَ اللَّيْلِ هِيَ أَشَدُّ وَطْئًا وَأَقْوَمُ قِيلًا\nوَجَعَلْنَا نَوْمَكُمْ سُبَاتًا ۝ وَجَعَلْنَا اللَّيْلَ لِبَاسًا ۝ وَجَعَلْنَا النَّهَارَ مَعَاشًا",
    transliteration: "Inna nāshi'ata l-layli hiya ashaddu waṭ'an wa-aqwamu qīlā\nWa-ja'alnā nawmakum subātan, wa-ja'alna l-layla libāsan, wa-ja'alna n-nahāra ma'āshā",
    translation: {
      en: "[08:30 — Chapter 4: Fajr, Sleep & the Human Biological Clock]\n\"Indeed, the rising by night (and before dawn) is more potent for governing the soul and more upright for speech and comprehension.\" (Quran 73:6) • \"And We made your sleep a means for rest, and made the night as a covering, and made the day for livelihood.\" (Quran 78:9-11)\nScientific & Spiritual Insight: Waking at the break of dawn aligns perfectly with the human circadian rhythm—optimizing hormonal balance, heart health, nitric oxide circulation, and crystal-clear mental tranquility.",
      ar: "[٠٨:٣٠ — الفصل الرابع: صلاة الفجر، النوم، والساعة البيولوجية للإنسان]\nقال تعالى: ﴿إِنَّ نَاشِئَةَ اللَّيْلِ هِيَ أَشَدُّ وَطْئًا وَأَقْوَمُ قِيلًا﴾ [المزمل: ٦]، وقال سبحانه: ﴿وَجَعَلْنَا نَوْمَكُمْ سُبَاتًا ۝ وَجَعَلْنَا اللَّيْلَ لِبَاسًا ۝ وَجَعَلْنَا النَّهَارَ مَعَاشًا﴾ [النبأ: ٩-١١].\nحقيقة علمية وروحية: الاستيقاظ وقت السحر والفجر يضبط الساعة البيولوجية للإنسان، وينظم إفراز الميلاتونين والكورتيزول، ويمنح القلب والدماغ أعلى درجات الصفاء والتركيز.",
      am: "[08:30 — ምዕራፍ 4፡ ፈጅር፣ እንቅልፍና የተፈጥሮ የሰውነት ሰዓት]\n«የሌሊት መነሳት (ለعبادة) ነፍስን ለመግዛት የበረታች፣ ለንግግርም (ለቁርአን ንባብ) ይበልጥ የቀናች ናት።» (አል-ሙዘሚል 73:6) • በማለዳ መነሳት የሰውነትን ተፈጥሯዊ ሰዓት (Circadian Rhythm)፣ የልብና የአእምሮ ጤንነትን በሚገርም ሁኔታ ያስተካክላል።",
      har: "[08:30 — ምዕራፍ 4፡ ፈጅር፣ መኝታና የሰውነት ሰዓት]\n«የሌሊት መነሳት ለልብና ለንግግር ይበልጥ የቀናች ናት።» (አል-ሙዘሚል 73:6) • በፈጅር ወቅት መነሳት ለአእምሮና ለአካል ጤንነት ታላቅ ጥቅም አለው።"
    }
  },
  {
    number: 5,
    arabic: "اللَّهُمَّ بَارِكْ لِأُمَّتِي فِي بُكُورِهَا\nبَاكِرُوا طَلَبَ الرِّزْقِ وَالحَوَائِجِ ... فَإِنَّ الغُدُوَّ بَرَكَةٌ وَنَجَاحُ",
    transliteration: "Allāhumma bārik li-ummatī fī bukūrihā\nBākirū ṭalaba r-rizqi wa-l-ḥawā'iji ... Fa-inna l-ghuduwwa barakatun wa-najāḥu",
    translation: {
      en: "[16:40 — Chapter 5: Rizq, Barakah & the Secrets of the Morning Hours]\nProphetic Supplication: Sakhr al-Ghamidi narrated that the Prophet ﷺ prayed: \"O Allah, bless my Ummah in their early mornings (Bukoor)!\" And whenever he dispatched an expedition or army, he would send them at the beginning of the day. Sakhr was a merchant who always sent his trade caravans at the break of dawn, and his wealth grew abundantly. (Sunan Abi Dawud 2606, Jami' at-Tirmidhi 1212).\nThe early morning hours are when divine sustenance, creative inspiration, and blessed provision are decreed.",
      ar: "[١٦:٤٠ — الفصل الخامس: الرزق والبركة وأسرار ساعات البكور الأولى]\nعن صخر الغامدي رضي الله عنه أن النبي ﷺ قال: «اللَّهُمَّ بَارِكْ لِأُمَّتِي فِي بُكُورِهَا»، وكان إذا بعث سريّة أو جيشاً بعثهم من أول النهار، وكان صخر رجلاً تاجراً فكان يبعث تجارته من أول النهار فأثرى وكثر ماله (رواه أبو داود والترمذي).\nساعات البكور هي خزائن الأرزاق ومواسم البركة والتوفيق لمن استفتح يومه بطاعة الله.",
      am: "[16:40 — ምዕራፍ 5፡ ሲሳይ (ሪዝቅ)፣ በረከትና የማለዳ ሰዓታት ምስጢር]\nነቢዩ ﷺ እንዲህ ሲሉ ዱዓ አድርገዋል፡- «አላህ ሆይ! ለህዝቦቼ (ለኡመቴ) በማለዳቸው ላይ በረከትን አድርግላቸው!» (አቡ ዳውድና ቲርሚዚ)። የማለዳ ሰዓታት ሲሳይ (ሪዝቅ) እና በረከት የሚከፋፈሉበት ልዩ ወቅት ናቸው።",
      har: "[16:40 — ምዕራፍ 5፡ ሪዝቅ፣ በረከትና የማለዳ ሚስጢር]\nነቢዩ ﷺ፡ «አላህ ሆይ! ለኡመቴ በማለዳቸው ላይ በረከትን አድርግላቸው!» ብለው ዱዓ አድርገዋል። ማለዳ የሪዝቅና የስኬት ወቅት ነው።"
    }
  },
  {
    number: 6,
    arabic: "مَنْ صَلَّى الغَدَاةَ فِي جَمَاعَةٍ ثُمَّ قَعَدَ يَذْكُرُ اللَّهَ حَتَّى تَطْلُعَ الشَّمْسُ ... ثُمَّ صَلَّى رَكْعَتَيْنِ كَانَتْ لَهُ كَأَجْرِ حَجَّةٍ وَعُمْرَةٍ تَامَّةٍ تَامَّةٍ تَامَّةٍ\nوَسَبِّحْ بِحَمْدِ رَبِّكَ قَبْلَ طُلُوعِ الشَّمْسِ وَقَبْلَ غُرُوبِهَا",
    transliteration: "Man ṣallā l-ghadāta fī jamā'atin thumma qa'ada yadhkuru Llāha ḥattā taṭlu'a sh-shamsu ... Thumma ṣallā rak'atayni kānat lahu ka-ajri ḥajjatin wa-'umratin tāmmah tāmmah tāmmah\nWa-sabbiḥ bi-ḥamdi Rabbika qabla ṭulū'i sh-shamsi wa-qabla ghurūbihā",
    translation: {
      en: "[20:47 — Chapter 6: 7 Things to Do After Fajr Salah]\nProphetic Hadith: \"Whoever prays Fajr in congregation, then sits remembering Allah until the sun rises, then prays two rak'ahs [of Ishraq/Duha], will have a reward like that of a Hajj and Umrah—complete, complete, complete!\" (Jami' at-Tirmidhi 586) • \"And glorify the praise of your Lord before the rising of the sun and before its setting.\" (Quran 50:39)\nThe 7 Post-Fajr Deeds: (1) Post-Salah Istighfar & Adhkar, (2) Morning Adhkar protection, (3) Quran recitation, (4) Seeking beneficial knowledge, (5) Supplicating for Rizq & guidance, (6) Avoiding immediate return to heedless sleep, (7) Praying 2 rak'ahs of Ishraq after sunrise.",
      ar: "[٢٠:٤٧ — الفصل السادس: سبعة أعمال نبوية عظيمة بعد صلاة الفجر]\nقال رسول الله ﷺ: «مَنْ صَلَّى الغَدَاةَ فِي جَمَاعَةٍ ثُمَّ قَعَدَ يَذْكُرُ اللَّهَ حَتَّى تَطْلُعَ الشَّمْسُ، ثُمَّ صَلَّى رَكْعَتَيْنِ كَانَتْ لَهُ كَأَجْرِ حَجَّةٍ وَعُمْرَةٍ، تَامَّةٍ تَامَّةٍ تَامَّةٍ» (رواه الترمذي). وقال تعالى: ﴿وَسَبِّحْ بِحَمْدِ رَبِّكَ قَبْلَ طُلُوعِ الشَّمْسِ وَقَبْلَ غُرُوبِهَا﴾ [ق: ٣٩].\nالسباعية الذهبية بعد الفجر: أذكار ما بعد الصلاة، أذكار الصباح، ورد القرآن، الدعاء والتسبيح، طلب العلم النافع، التخطيط ليوم مبارك، وصلاة ركعتي الإشراق.",
      am: "[20:47 — ምዕራፍ 6፡ ከፈጅር ሶላት በኋላ የሚከናወኑ 7 ታላላቅ ተግባራት]\nነቢዩ ﷺ እንዲህ ብለዋል፡- «የፈጅርን ሶላት በጀማዓ የሰገደ፣ ከዚያም ፀሐይ እስክትወጣ ድረስ አላህን እያወሳ የተቀመጠ፣ ከዚያም ሁለት ረከዓ የሰገደ ሰው፣ ሙሉ፣ ሙሉ፣ ሙሉ የሆነ የሐጅና የዑምራ ምንዳ ያገኛል!» (ቲርሚዚ 586)",
      har: "[20:47 — ምዕራፍ 6፡ ከሱብሒ ሶላት በኋላ 7 ሱንናዎች]\nከሱብሒ በኋላ አላህን እያወሱ ቆይቶ ፀሐይ ከወጣች በኋላ ሁለት ረከዓ (ኢሽራቅ) መስገድ የሙሉ ሐጅና ዑምራ ምንዳ ያስገኛል።"
    }
  },
  {
    number: 7,
    arabic: "يَنْزِلُ رَبُّنَا تَبَارَكَ وَتَعَالَى كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا حِينَ يَبْقَى ثُلُثُ اللَّيْلِ الآخِرُ\nيَقُولُ مَنْ يَدْعُونِي فَأَسْتَجِيبَ لَهُ ... مَنْ يَسْأَلُنِي فَأُعْطِيَهُ مَنْ يَسْتَغْفِرُنِي فَأَغْفِرَ لَهُ",
    transliteration: "Yanzilu Rabbunā tabāraka wa-ta'ālā kulla laylatin ilā s-samā'i d-dunyā ḥīna yabqā thuluthu l-layli l-ākhiru\nYaqūlu man yad'ūnī fa-astajība lahu ... Man yas'alunī fa-u'ṭiyahu, man yastaghfirunī fa-aghfira lahu",
    translation: {
      en: "[24:44 — Chapter 7: Tahajjud & the Secrets of the Last Third of the Night]\nProphetic Hadith: \"Our Lord, the Blessed and Exalted, descends every night to the lowest heaven when the last third of the night remains, saying: 'Who is calling upon Me that I may answer him? Who is asking of Me that I may give him? Who is seeking My forgiveness that I may forgive him?'\" (Sahih al-Bukhari 1145, Sahih Muslim 758).\nThe arrows of Tahajjud shot in the stillness of the night never miss their target.",
      ar: "[٢٤:٤٤ — الفصل السابع: قيام الليل (التهجد) وأسرار الثلث الأخير من الليل]\nقال رسول الله ﷺ: «يَنْزِلُ رَبُّنَا تَبَارَكَ وَتَعَالَى كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا حِينَ يَبْقَى ثُلُثُ اللَّيْلِ الآخِرُ، يَقُولُ: مَنْ يَدْعُونِي فَأَسْتَجِيبَ لَهُ، مَنْ يَسْأَلُنِي فَأُعْطِيَهُ، مَنْ يَسْتَغْفِرُنِي فَأَغْفِرَ لَهُ» (متفق عليه).\nسهام الليل في جوف السحر لا تخطئ، وهي شرف المؤمن ومعدن الأنس بالله.",
      am: "[24:44 — ምዕራፍ 7፡ ተሀጁድ እና የሌሊቱ የመጨረሻ ሶስተኛ ክፍል ምስጢራት]\nነቢዩ ﷺ እንዲህ ብለዋል፡- «ጌታችን (ሱ.ወ) በየሌሊቱ የሌሊቱ የመጨረሻ ሶስተኛ ክፍል ሲቀር ወደ ቅርቢቱ ሰማይ ይወርዳል፤ እንዲህም ይላል፡- 'የሚጠራኝ ማን ነው ልቀበለው? የሚለምነኝ ማን ነው ልሰጠው? ምሕረትን የሚጠይቀኝ ማን ነው ይቅር ልለው?'» (ቡኻሪና ሙስሊም)",
      har: "[24:44 — ምዕራፍ 7፡ ተሀጁድ እና የሌይቲ መጨረሻ ክፍል]\nበሌሊቱ የመጨረሻ ሶስተኛ ክፍል ጌታችን፡ «የሚጠራኝ ማን ነው ልቀበለው? ምሕረት የሚጠይቀኝ ማን ነው ይቅር ልለው?» ይላል።"
    }
  },
  {
    number: 8,
    arabic: "مَنْ صَلَّى البَرْدَيْنِ دَخَلَ الجَنَّةَ ... وَلَنْ يَلِجَ النَّارَ أَحَدٌ صَلَّى قَبْلَ طُلُوعِ الشَّمْسِ وَقَبْلَ غُرُوبِهَا\nحَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ وَقُومُوا لِلَّهِ قَانِتِينَ",
    transliteration: "Man ṣallā l-bardayni dakhala l-jannah ... Wa-lan yalija n-nāra aḥadun ṣallā qabla ṭulū'i sh-shamsi wa-qabla ghurūbihā\nḤāfiẓū 'alā ṣ-ṣalawāti wa-ṣ-ṣalāti l-wusṭā wa-qūmū li-llāhi qānitīn",
    translation: {
      en: "[29:02 — Chapter 8: What If You Miss Fajr Salah?]\nProphetic Hadith: \"Whoever prays the two cool prayers (Al-Bardayn: Fajr and Asr) will enter Paradise.\" (Sahih al-Bukhari 574) • \"No one will enter the Fire who prays before the rising of the sun (Fajr) and before its setting (Asr).\" (Sahih Muslim 634).\nIf one oversleeps unintentionally, the Prophet ﷺ taught to pray it immediately upon waking and strengthen one's evening resolve, sleep early, and seek Allah's help to never miss the dawn covenant.",
      ar: "[٢٩:٠٢ — الفصل الثامن: ماذا لو فاتتك صلاة الفجر؟ التحذير والعلاج الروحي]\nقال رسول الله ﷺ: «مَنْ صَلَّى البَرْدَيْنِ دَخَلَ الجَنَّةَ» (رواه البخاري)، وقال ﷺ: «لَنْ يَلِجَ النَّارَ أَحَدٌ صَلَّى قَبْلَ طُلُوعِ الشَّمْسِ وَقَبْلَ غُرُوبِهَا» (رواه مسلم). وقال تعالى: ﴿حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ وَقُومُوا لِلَّهِ قَانِتِينَ﴾ [البقرة: ٢٣٨].\nمن نام عن صلاة الفجر من غير تفريط فليصلها فور استيقاظه، وليبادر بالتوبة والأخذ بأسباب اليقظة والنوم المبكر وصدق العزيمة مع الله.",
      am: "[29:02 — ምዕራፍ 8፡ የፈጅር ሶላት ቢያመልጥዎትስ? መንፈሳዊ መፍትሔ]\nነቢዩ ﷺ እንዲህ ብለዋል፡- «ሁለቱን ቀዝቃዛ ሶላቶች (ፈጅርና ዐስርን) የሰገደ ሰው ጀነት ይገባል።» (ቡኻሪ 574) • በእንቅልፍ ምክንያት ፈጅር ያመለጠው ሰው እንደነቃ ወዲያውኑ ይስገድ፤ ወደፊትም በጊዜ በመተኛትና በዱዓ ይጠንቀቅ።",
      har: "[29:02 — ምዕራፍ 8፡ የሱብሒ ሰላት ቢያመልጥ ምን ይደረጋል?]\nነቢዩ ﷺ፡ «ፈጅርና ዐስርን የሰገደ ጀነት ይገባል» ብለዋል። በእንቅልፍ ያመለጠው ሰው ልክ እንደነቃ ወዲያውኑ ይስገድ።"
    }
  },
  {
    number: 9,
    arabic: "يَعْقِدُ الشَّيْطَانُ عَلَى قَافِيَةِ رَأْسِ أَحَدِكُمْ إِذَا هُوَ نَامَ ثَلَاثَ عُقَدٍ ... يَضْرِبُ كُلَّ عُقْدَةٍ عَلَيْكَ لَيْلٌ طَوِيلٌ فَارْقُدْ\nفَإِنِ اسْتَيْقَظَ فَذَكَرَ اللَّهَ انْحَلَّتْ عُقْدَةٌ ... فَإِنْ تَوَضَّأَ انْحَلَّتْ عُقْدَةٌ فَإِنْ صَلَّى انْحَلَّتْ عُقْدَةٌ فَأَصْبَحَ نَشِيطًا طَيِّبَ النَّفْسِ",
    transliteration: "Ya'qidu sh-shayṭānu 'alā qāfiyati ra'si aḥadikum idhā huwa nāma thalātha 'uqadin ... Yaḍribu kulla 'uqdatin 'alayka laylun ṭawīlun fa-rqud\nFa-ini stayqaẓa fa-dhakara Llāha nḥallat 'uqdatun ... Fa-in tawaḍḍa'a nḥallat 'uqdatun fa-in ṣallā nḥallat 'uqdatun fa-aṣbaḥa nashīṭan ṭayyiba n-nafsi",
    translation: {
      en: "[34:08 — Chapter 9: Shaitan’s Trap: “Just 10 More Minutes”]\nProphetic Hadith: \"Satan ties three knots at the back of the head of any of you when he goes to sleep, striking each knot and whispering: 'You have a long night ahead, so sleep on!' If he wakes up and remembers Allah, one knot is untied; if he performs Wudhu (ablution), a second knot is untied; and if he prays, all knots are untied, and he enters the morning energetic and cheerful of soul. Otherwise, he wakes up sluggish and heavy of spirit.\" (Sahih al-Bukhari 1142, Sahih Muslim 776).",
      ar: "[٣٤:٠٨ — الفصل التاسع: فخ الشيطان وعقده الثلاث: «عشر دقائق أخرى فقط»]\nقال رسول الله ﷺ: «يَعْقِدُ الشَّيْطَانُ عَلَى قَافِيَةِ رَأْسِ أَحَدِكُمْ إِذَا هُوَ نَامَ ثَلَاثَ عُقَدٍ، يَضْرِبُ كُلَّ عُقْدَةٍ: عَلَيْكَ لَيْلٌ طَوِيلٌ فَارْقُدْ. فَإِنِ اسْتَيْقَظَ فَذَكَرَ اللَّهَ انْحَلَّتْ عُقْدَةٌ، فَإِنْ تَوَضَّأَ انْحَلَّتْ عُقْدَةٌ، فَإِنْ صَلَّى انْحَلَّتْ عُقْدَةٌ، فَأَصْبَحَ نَشِيطًا طَيِّبَ النَّفْسِ، وَإِلَّا أَصْبَحَ خَبِيثَ النَّفْسِ كَسْلَانَ» (متفق عليه).",
      am: "[34:08 — ምዕራፍ 9፡ የሸይጣን ወጥመድና ሶስቱ ቋጠሮዎች፡ «ለ10 ደቂቃ ብቻ ልተኛ»]\nነቢዩ ﷺ እንዲህ ብለዋል፡- «አንዳችሁ ሲተኛ ሸይጣን በጭንቅላቱ ጀርባ ላይ ሶስት ቋጠሮዎችን ይቋጥራል፤ በእያንዳንዱም ላይ 'ረጅም ሌሊት አለህና ተኛ' ይላል። ነቅቶ አላህን ካወሳ አንዱ ቋጠሮ ይፈታል፤ ውዱእ ካደረገ ሁለተኛው ይፈታል፤ ከሰገደ ደግሞ ሁሉም ቋጠሮዎች ይፈቱና ንቁና ደስተኛ ሆኖ ያነጋል።» (ቡኻሪና ሙስሊም)",
      har: "[34:08 — ምዕራፍ 9፡ የሸይጣን ሶስት ቋጠሮዎች]\nሲነቁ አላህን በማውሳት፣ ውዱእ በማድረግና በመስገድ የሸይጣን ሶስቱ ቋጠሮዎች ይፈታሉ፤ ሰውየውም ንቁና ደስተኛ ሆኖ ያነጋል።"
    }
  },
  {
    number: 10,
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ\nإِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ وَاخْتِلَافِ اللَّيْلِ وَالنَّهَارِ لَآيَاتٍ لِأُولِي الْأَلْبَابِ ۝ الَّذِينَ يَذْكُرُونَ اللَّهَ قِيَامًا وَقُعُودًا وَعَلَىٰ جُنُوبِهِمْ",
    transliteration: "Al-ḥamdu li-llāhi lladhī aḥyānā ba'da mā amātanā wa-ilayhi n-nushūr\nInna fī khalqi s-samāwāti wa-l-arḍi wa-khtilāfi l-layli wa-n-nahāri la-āyātin li-ulī l-albāb, alladhīna yadhkurūna Llāha qiyāman wa-qu'ūdan wa-'alā junūbihim",
    translation: {
      en: "[38:05 — Chapter 10: The Prophet Muhammad’s ﷺ Morning Routine]\nUpon waking, the Prophet ﷺ would praise Allah: \"All praise is for Allah Who gave us life after having taken it from us, and unto Him is the resurrection,\" cleanse his mouth with the Siwak, gaze at the heavens while reciting the final ten verses of Surah Aal-Imran (3:190-200), perform Wudhu, pray Tahajjud and Witr, and then pray the two Sunnah rak'ahs of Fajr before leading the dawn congregation in tranquil contemplation. (Sahih al-Bukhari 183, 6312).",
      ar: "[٣٨:٠٥ — الفصل العاشر: الهدي النبوي الشريف ونظام الصباح للنبي محمد ﷺ]\nكان النبي ﷺ يكره النوم قبل العشاء والحديث بعدها، فإذا استيقظ في السحر مسح النوم عن وجهه، وقال: «الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور»، ونظر إلى السماء وتلا العشر الآيات الخواتيم من سورة آل عمران: ﴿إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ...﴾، ثم استاك وتوضأ وصلى قيام الليل وركعتي الفجر ثم خرج لصلاة الصبح.",
      am: "[38:05 — ምዕራፍ 10፡ የነቢዩ ሙሐመድ ﷺ የማለዳ ልምድና ሱንና]\nነቢዩ ﷺ ከእንቅልፋቸው ሲነቁ «ለሞት ካደረሰን በኋላ ሕያው ላደረገን አላህ ምስጋና ይገባው» ይሉ፣ ሲዋክ ይጠቀሙ፣ የሱረቱ አል-ዒምራንን የመጨረሻ አሥር አንቀጾች ያነቡ፣ ውዱእ አድርገው ተሀጁድና የፈጅርን ሶላት በታላቅ ተመስጦ ይሰግዱ ነበር። (ቡኻሪ)",
      har: "[38:05 — ምዕራፍ 10፡ የነቢዩ ﷺ የማለዳ ሱንና]\nነቢዩ ﷺ ሲነቁ አላህን ያመሰግኑ፣ ሲዋክ ይጠቀሙ፣ የአል-ዒምራንን የመጨረሻ አንቀጾች ይቀሩና ተሀጁድና ሱብሒን ይሰግዱ ነበር።"
    }
  },
  {
    number: 11,
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا ... وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا\nأَصْبَحْنَا وَأَصْبَحَ المُلْكُ لِلَّهِ رَبِّ العَالَمِينَ ... اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا اليَوْمِ فَتْحَهُ وَنَصْرَهُ وَنُورَهُ وَبَرَكَتَهُ وَهُدَاهُ",
    transliteration: "Allāhumma innī as'aluka 'ilman nāfi'an ... Wa-rizqan ṭayyiban wa-'amalan mutaqabbalā\nAṣbaḥnā wa-aṣbaḥa l-mulku li-llāhi Rabbi l-'ālamīn ... Allāhumma innī as'aluka khayra hādhā l-yawmi fatḥahu wa-naṣrahu wa-nūrahu wa-barakatahu wa-hudāhu",
    translation: {
      en: "[42:13 — Chapter 11: Why Fajr Makes Your Day Feel Longer]\nProphetic Supplication After Fajr: Umm Salamah narrated that the Prophet ﷺ used to say after the salam of Fajr prayer: \"O Allah, I ask You for beneficial knowledge, pure provision, and accepted deeds!\" (Sunan Ibn Majah 925) and \"O Allah, I ask You for the goodness of this day: its opening (victory), its support, its light, its blessing (Barakah), and its guidance.\" (Sunan Abi Dawud 5084).\nStarting at dawn grants supernatural Barakah in time—accomplishing in a few blessed morning hours what others struggle to finish in an entire week.",
      ar: "[٤٢:١٣ — الفصل الحادي عشر: لماذا تجعل صلاة الفجر يومك أطول وأكثر بركة وإنجازاً؟]\nكان النبي ﷺ يقول إذا صلى الصبح حين يسلم: «اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا» (رواه ابن ماجه وأحمد). ومن دعاء الصباح: «اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا اليَوْمِ: فَتْحَهُ، وَنَصْرَهُ، وَنُورَهُ، وَبَرَكَتَهُ، وَهُدَاهُ» (رواه أبو داود).\nصلاة الفجر تمنح المؤمن بركة مضاعفة في الوقت والجهد، فينجز في ساعات الصباح ما يعجز عنه غيره في أيام.",
      am: "[42:13 — ምዕራፍ 11፡ ፈጅር ቀንዎን እንዴት ረጅምና የተባረከ ያደርገዋል?]\nነቢዩ ﷺ ከፈጅር ሶላት በኋላ እንዲህ ይሉ ነበር፡- «አላህ ሆይ! ጠቃሚ እውቀትን፣ ንጹህ ሲሳይንና ተቀባይነት ያለው መልካም ስራን እለምንሃለሁ!» (ኢብኑ ማجه 925)። በፈጅር የሚጀመር ቀን በጊዜው ላይ ታላቅ በረከትና ስኬት ይኖረዋል።",
      har: "[42:13 — ምዕራፍ 11፡ ፈጅር መዓልትን እንዴት ይባርካል?]\n«አላህ ሆይ! ጠቃሚ እውቀትን፣ ንጹህ ሪዝቅንና ተቀባይነት ያለው ስራን እለምንሃለሁ!» • በሱብሒ የሚጀመር መዓልት ሰዓቱ የተባረከ ይሆናል።"
    }
  },
  {
    number: 12,
    arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ المُلْكُ وَلَهُ الحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ\nسُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ ... وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ",
    transliteration: "Lā ilāha illā Llāhu waḥdahu lā sharīka lahu, lahu l-mulku wa-lahu l-ḥamdu yuḥyī wa-yumītu wa-huwa 'alā kulli shay'in qadīr\nSubḥāna Llāhi wa-bi-ḥamdihi 'adada khalqihi ... Wa-riḍā nafsihi wa-zinata 'arshihi wa-midāda kalimātihi",
    translation: {
      en: "[45:36 — Chapter 12: Powerful Duas & Dhikr After Fajr]\nProphetic Dhikr After Fajr: (1) Reciting 10 times immediately after Fajr: \"There is no deity worthy of worship except Allah alone, with no partner; to Him belongs the dominion and praise, He gives life and causes death, and He is over all things Omnipotent\" writes 10 good deeds, erases 10 sins, raises 10 degrees, and shields from Satan all day (Tirmidhi 3474).\n(2) Reciting 3 times: \"Glory and praise be to Allah, as many times as the number of His creation, as much as pleases Him, as heavy as the weight of His Throne, and as boundless as the ink of His words.\" (Sahih Muslim 2726).",
      ar: "[٤٥:٣٦ — الفصل الثاني عشر: أقوى الأدعية والأذكار المأثورة بعد صلاة الفجر]\nمن أعظم أذكار ما بعد صلاة الفجر:\n١- قول: «لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ» (عشر مرات بعد الفجر)؛ يُكتب له عشر حسنات، وتُمحى عشر سيئات، ويُرفع عشر درجات، ويكون في حرز من كل مكروه ومن الشيطان.\n٢- قول: «سُبْحَانَ اللَّهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ» (ثلاث مرات - رواه مسلم).",
      am: "[45:36 — ምዕራፍ 12፡ ከፈጅር ሶላት በኋላ የሚደረጉ ኃይለኛ ዱዓዎችና አዝካሮች]\nከፈጅር ሶላት በኋላ 10 ጊዜ «ላ ኢላሀ ኢለላህ ወሕደሁ ላ ሸሪከ ለሁ፣ ለሁል ሙልኩ ወለሁል ሐምዱ...» ማለት ከክፉ ነገርና ከሸይጣን ሙሉ ቀን ጥበቃ ይሆናል። እንዲሁም 3 ጊዜ «ሱብሓነላሂ ወቢሐምዲሂ ዐደደ ኸልቂሂ፣ ወሪዷ ነፍሲሂ፣ ወዚነተ ዐርሺሂ፣ ወሚዳደ ከሊማቲሂ» ማለት ከብዙ ሰዓታት ዝክር ይበልጣል! (ሰሒሕ ሙስሊም)",
      har: "[45:36 — ምዕራፍ 12፡ ከሱብሒ በኋላ የሚደረጉ ዱዓዎች]\n«ሱብሓነላሂ ወቢሐምዲሂ ዐደደ ኸልቂሂ፣ ወሪዷ ነፍሲሂ፣ ወዚነተ ዐርሺሂ፣ ወሚዳደ ከሊማቲሂ» (3 ጊዜ) እና የማለዳ ተውሒድ አዝካሮች ታላቅ ምንዳና ጥበቃ ያስገኛሉ።"
    }
  },
  {
    number: 13,
    arabic: "يَتَعَاقَبُونَ فِيكُمْ مَلَائِكَةٌ بِاللَّيْلِ وَمَلَائِكَةٌ بِالنَّهَارِ ... وَيَجْتَمِعُونَ فِي صَلَاةِ الفَجْرِ وَصَلَاةِ العَصْرِ\nثُمَّ يَعْرُجُ الَّذِينَ بَاتُوا فِيكُمْ فَيَسْأَلُهُمْ وَهُوَ أَعْلَمُ بِهِمْ كَيْفَ تَرَكْتُمْ عِبَادِي ... فَيَقُولُونَ تَرَكْنَاهُمْ وَهُمْ يُصَلُّونَ وَأَتَيْنَاهُمْ وَهُمْ يُصَلُّونَ",
    transliteration: "Yata'āqabūna fīkum malā'ikatun bi-l-layli wa-malā'ikatun bi-n-nahār ... Wa-yajtami'ūna fī ṣalāti l-fajri wa-ṣalāti l-'aṣr\nThumma ya'ruju lladhīna bātū fīkum fa-yas'aluhum wa-huwa a'lamu bihim: Kayfa taraktum 'ibādī? ... Fa-yaqūlūna taraknāhum wa-hum yuṣallūna wa-ataynāhum wa-hum yuṣallūn",
    translation: {
      en: "[49:49 — Chapter 13: What Happens in the World of Angels at Fajr]\nProphetic Hadith: \"Angels take turns among you by night and by day, and they assemble at the Fajr (dawn) prayer and the Asr (afternoon) prayer. Then those who spent the night among you ascend, and their Lord asks them—though He knows best about them—'How did you leave My servants?' They reply: 'We left them while they were praying, and we came to them while they were praying!'\" (Sahih al-Bukhari 555, Sahih Muslim 632).\nEvery Fajr prayer is a cosmic shift-change where your name is mentioned before the Throne of Allah.",
      ar: "[٤٩:٤٩ — الفصل الثالث عشر: ماذا يحدث في عالم الملائكة وقت صلاة الفجر؟]\nقال رسول الله ﷺ: «يَتَعَاقَبُونَ فِيكُمْ مَلَائِكَةٌ بِاللَّيْلِ وَمَلَائِكَةٌ بِالنَّهَارِ، وَيَجْتَمِعُونَ فِي صَلَاةِ الفَجْرِ وَصَلَاةِ العَصْرِ، ثُمَّ يَعْرُجُ الَّذِينَ بَاتُوا فِيكُمْ فَيَسْأَلُهُمْ رَبُّهُمْ وَهُوَ أَعْلَمُ بِهِمْ: كَيْفَ تَرَكْتُمْ عِبَادِي؟ فَيَقُولُونَ: تَرَكْنَاهُمْ وَهُمْ يُصَلُّونَ، وَأَتَيْنَاهُمْ وَهُمْ يُصَلُّونَ» (متفق عليه).\nمشهد ملكوتي عظيم يتكرر كل فجر، تُرفع فيه أسماء المصلين بشهادة الملائكة الكرام عند رب العالمين.",
      am: "[49:49 — ምዕራፍ 13፡ በፈጅር ወቅት በመላእክት ዓለም ውስጥ ምን ይከናወናል?]\nነቢዩ ﷺ እንዲህ ብለዋል፡- «የሌሊት መላእክትና የቀን መላእክት በእናንተ ላይ ይፈራረቃሉ፤ በፈጅር ሶላትና በዐስር ሶላት ላይም ይሰባሰባሉ። ከእናንተ ጋር ያደሩት መላእክት ወደ ላይ ይወጣሉ፤ ጌታቸውም እርሱ ሁሉን አዋቂ ሆኖ ሳለ፡- 'ባሮቼን እንዴት ተዋችኋቸው?' ብሎ ይጠይቃቸዋል። እነርሱም፡- 'እየሰገዱ አገኘናቸው፣ እየሰገዱም ተውናቸው!' ይላሉ።» (ቡኻሪና ሙስሊም)",
      har: "[49:49 — ምዕራፍ 13፡ በፈጅር ወቅቲ የመላእክት ዓለም]\nበፈጅር ሶላት ላይ የሌሊትና የቀን መላእክት ይሰባሰባሉ፤ ወደ አላህም ወጥተው፡ «ባሮችህን እየሰገዱ አገኘናቸው፣ እየሰገዱም ተውናቸው!» ብለው ይመሰክራሉ።"
    }
  },
  {
    number: 14,
    arabic: "بَشِّرِ المَشَّائِينَ فِي الظُّلَمِ إِلَى المَسَاجِدِ بِالنُّورِ التَّامِّ يَوْمَ القِيَامَةِ\nاللَّهُمَّ اجْعَلْ فِي قَلْبِي نُورًا وَفِي لِسَانِي نُورًا وَفِي سَمْعِي نُورًا وَفِي بَصَرِي نُورًا ... وَاجْعَلْ فِي وَجْهِي نُورًا وَأَعْظِمْ لِي نُورًا",
    transliteration: "Bashshiri l-mashshā'īna fī ẓ-ẓulami ilā l-masājidi bi-n-nūri t-tāmmi yawma l-qiyāmah\nAllāhumma j'al fī qalbī nūran wa-fī lisānī nūran wa-fī sam'ī nūran wa-fī baṣarī nūran ... Wa-j'al fī wajhī nūran wa-a'ẓim lī nūrā",
    translation: {
      en: "[52:58 — Chapter 14: The Secret of Nur: How Fajr Changes the Face]\nProphetic Glad Tidings: \"Give glad tidings to those who walk to the mosques in the darkness [of Fajr and Isha] of complete, radiant Light (Al-Nur Al-Tamm) on the Day of Resurrection!\" (Sunan Abi Dawud 561, Jami' at-Tirmidhi 223).\nAnd the Prophet ﷺ prayed when going out to Fajr prayer: \"O Allah, place light in my heart, light upon my tongue, light in my hearing, light in my sight... place light upon my face, and magnify light for me!\" (Sahih Muslim 763). Guarding Fajr clothes the believer's face with serene luminosity (Nur), dignity, and inner peace.",
      ar: "[٥٢:٥٨ — الفصل الرابع عشر: سر النور الإلهي: كيف تغير صلاة الفجر الوجه والقلب؟]\nقال رسول الله ﷺ: «بَشِّرِ المَشَّائِينَ فِي الظُّلَمِ إِلَى المَسَاجِدِ بِالنُّورِ التَّامِّ يَوْمَ القِيَامَةِ» (رواه أبو داود والترمذي).\nوكان من دعائه ﷺ عند خروجه لصلاة الفجر: «اللَّهُمَّ اجْعَلْ فِي قَلْبِي نُورًا، وَفِي لِسَانِي نُورًا، وَفِي سَمْعِي نُورًا، وَفِي بَصَرِي نُورًا... وَاجْعَلْ فِي وَجْهِي نُورًا، وَأَعْظِمْ لِي نُورًا» (رواه مسلم). فالمحافظة على الفجر تكسو الوجه بهاءً ونوراً وسكينة في الدنيا، وتمنح صاحبها النور التام يوم القيامة.",
      am: "[52:58 — ምዕራፍ 14፡ የኑር (ብርሃን) ምስጢር፡ ፈጅር ፊትንና ልብን እንዴት ያበራል?]\nነቢዩ ﷺ እንዲህ ብለዋል፡- «በጨለማ ወደ መስጂዶች ለሚጓዙት በትንሣኤ ቀን ሙሉ ብርሃን (ኑር) እንደሚኖራቸው አብስሯቸው!» (አቡ ዳውድና ቲርሚዚ)። ወደ ፈጅር ሶላት ሲወጡም፡- «አላህ ሆይ! በልቤ ውስጥ ብርሃንን፣ በምላሴም ብርሃንን፣ በፊቴም ላይ ብርሃንን አድርግልኝ፣ ብርሃንንም አብዛልኝ!» ይሉ ነበር። (ሰሒሕ ሙስሊም)",
      har: "[52:58 — ምዕራፍ 14፡ የኑር ሚስጢር፡ ፈጅር ፊትንና ልብን እንዴት ያበራል?]\nነቢዩ ﷺ፡ «በጨለማ ወደ መስጂዶች ለሚጓዙት በትንሣኤ ቀን ሙሉ ብርሃን (ኑር) አብስሯቸው!» ብለዋል። የሱብሒ ሰላት በፊትና በልብ ላይ ኑርና ሰላም ያጎናጽፋል።"
    }
  }
];
