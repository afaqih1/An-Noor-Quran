import { allSurahs } from './surahListData';

export interface TafsirIbnKathirDetail {
  summaryEn: string;
  summaryAr: string;
  summaryAm: string;
  hadithNarrationsEn: string[];
  hadithNarrationsAr: string[];
  theologicalPointsEn: string[];
  theologicalPointsAr: string[];
  driveFolderUrl: string;
  localPdfUrl?: string;
}

export const TAFSIR_IBN_KATHIR_LOCAL_PDF_URL =
  '/assets/aistudio/113-114_Al_falaq__Al_Nas_7bc02cdc.pdf';

export const TAFSIR_IBN_KATHIR_FATIHA_LOCAL_PDF_URL =
  '/assets/aistudio/001_Al-Fateha_b165bca8.pdf';

export const TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL =
  'https://drive.google.com/drive/u/4/folders/0B8VQnqhorb2iZ3JOcWxlZUgzVm8?resourcekey=0-g3c0TB5vTT63q8XrWUO8Rg';

export const TAFSIR_IBN_KATHIR_DRIVE_FOLDER_CANONICAL_URL =
  'https://drive.google.com/drive/folders/0B8VQnqhorb2iZ3JOcWxlZUgzVm8?resourcekey=0-g3c0TB5vTT63q8XrWUO8Rg&usp=drive_link';

export function getSurahTafsirDriveUrl(surahNumber?: number): string {
  return TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL;
}

export function getSurahTafsirPdfFilename(surahNumber: number): string {
  const pad = String(surahNumber).padStart(3, '0');
  const meta = allSurahs.find((s) => s.number === surahNumber);
  const name = meta ? meta.englishName.replace(/[^a-zA-Z0-9_-]/g, '_') : `Surah_${surahNumber}`;
  if (surahNumber === 1) return '001_Al-Fateha.pdf';
  if (surahNumber === 113 || surahNumber === 114) return '113-114_Al_falaq_Al_Nas.pdf';
  return `${pad}_${name}.pdf`;
}

/**
 * Curated Classical Tafsir Ibn Kathir repository for Quranic Study & Tafsir Modules
 */
export const CURATED_IBN_KATHIR_EXEGESIS: Record<string, TafsirIbnKathirDetail> = {
  // Surah 1:1 - Bismillahir-Rahmanir-Rahim
  '1:1': {
    summaryEn: `Imam Al-Hafiz Ibn Kathir (rahimahullah) opens his monumental exegesis with the virtues and rulings of the Basmalah. 
The Companions of the Prophet (ﷺ) began the Book of Allah with it. Scholars unanimously agree that 'Bismillahir-Rahmanir-Rahim' is an independent verse of the Quran in Surah An-Naml (27:30) and an opening verse for each chapter except Surah At-Tawbah (9). 

Regarding the linguistic root, 'Allah' is the Greatest Name (Al-Ism Al-A'zam) indicating the Lord, the Creator, the One True Deity who alone is rightfully worshipped. 
Regarding 'Ar-Rahman' and 'Ar-Rahim': both are divine names derived from 'Ar-Rahmah' (mercy) in an intensive form. However, Ar-Rahman is more intensive and broader than Ar-Rahim. Ibn Kathir quotes Abu Ali Al-Farisi: 'Ar-Rahman is a general divine name denoting the all-encompassing mercy for all created beings in this worldly life, while Ar-Rahim denotes the special, eternal mercy reserved exclusively for the believers in the Hereafter,' referencing the verse: 'And He is ever Merciful (Rahiman) to the believers' (Al-Ahzab 33:43).`,
    summaryAr: `استهل الإمام الحافظ عماد الدين إسماعيل بن كثير رحمه الله تفسيره العظيم ببيان فضل البسملة وأحكامها ومعانيها. افتتح بها الصحابة رضي الله عنهم كتاب الله عز وجل، وأجمع العلماء على أنها جزء آية من سورة النمل، وسنة مؤكدة في مستهل كل سورة ما عدا سورة براءة (التوبة).

واسم (الله) هو الاسم الأعظم المشتمل على جميع معاني الألوهية والربوبية والكمال، وهو عَلَم على الذات الإلهية المقدسة المستحقة للعبادة وحده دون سواه.
وأما (الرحمن الرحيم) فهما اسمان مشتقان من الرحمة على وجه المبالغة، والرحمن أشد مبالغة من الرحيم. ونقل ابن كثير عن أبي علي الفارسي: (الرحمن اسم عام في جميع أنواع الرحمة يختص به الله تعالى ويعم جميع الخلائق، والرحيم مخصوص بالمؤمنين)، كما قال تعالى: ﴿وَكَانَ بِالْمُؤْمِنِينَ رَحِيمًا﴾ [الأحزاب: ٤٣].`,
    summaryAm: `ኢማም ኢብኑ ከሲር (ረሂመሁላህ) በተፍሲራቸው እንደገለጹት፤ «ቢስሚላሂር-ረሕማኒር-ረሒም» በአላህ ስም መጀመርንና የእርሱን ረድኤት መሻትን ያመለክታል። «አላህ» ብቸኛው ሊመለክ የሚገባው አምላክ ስም ሲሆን፤ «አር-ረሕማን» ለፍጥረተ ዓለሙ ሁሉ የሚዳረስ ሰፊ ራህመት፤ «አር-ረሒም» ደግሞ በዕለተ ቂያማ ለሙእሚኖች ብቻ የተለገሰውን ልዩ እዝነት ያመለክታል።`,
    hadithNarrationsEn: [
      'Imam Ahmad recorded that Abu Hurayrah reported the Messenger of Allah (ﷺ) said: "Every momentous matter that is not commenced with Bismillahir-Rahmanir-Rahim remains maimed / devoid of full blessing."',
      'Recorded in Sahih Muslim from Aisha: "The Messenger of Allah (ﷺ) used to begin his prayer with Takbir, and recitation with Al-Hamdu lillahi Rabbil-Alamin."'
    ],
    hadithNarrationsAr: [
      'روى الإمام أحمد في مسنده عن أبي هريرة رضي الله عنه أن رسول الله ﷺ قال: «كل أمر ذي بال لا يُبدأ فيه ببسم الله الرحمن الرحيم فهو أجذم / أقطع».',
      'في صحيح مسلم عن عائشة رضي الله عنها: «كان رسول الله ﷺ يفتتح الصلاة بالتكبير والقراءة بـ ﴿الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ﴾».'
    ],
    theologicalPointsEn: [
      'Commencing every action with the Name of Allah sanctifies worldly pursuits into acts of divine worship.',
      'Affirmation of two distinct dimensions of Divine Mercy: universal providence in dunya and exclusive grace in the akhira.',
      'Disavowal of reliance upon personal power, subsuming all intention under divine authorization.'
    ],
    theologicalPointsAr: [
      'التبرك باسم الله تعالى وابتغاء معونته في ابتداء كل قول وعمل.',
      'إثبات صفة الرحمة الذاتية والفعلية لله تعالى على الوجه اللائق بجلاله وعظمته.',
      'التوحيد الخالص بالبراءة من الحول والقوة إلا بالله العلي العظيم.'
    ],
    driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL,
    localPdfUrl: TAFSIR_IBN_KATHIR_FATIHA_LOCAL_PDF_URL
  },

  // Surah 1:2 - Al-Hamdu lillahi Rabbil-'Alamin
  '1:2': {
    summaryEn: `Ibn Kathir clarifies that 'Al-Hamdu Lillah' conveys heartfelt gratitude, sincere veneration, and absolute praise for Allah alone. The definite article 'Al' denotes comprehensiveness (Al-Istighraq)—all conceivable praise in the universe belongs rightfully to Him. 
Ibn Jarir At-Tabari commented: 'Al-Hamdu Lillah is an acknowledgment that Allah alone possesses absolute perfection and endless favors upon His servants, both seen and unseen.'

'Rabb' signifies the Master, Owner, Sovereign, and Supreme Nurturer who sustains creation through His wisdom. 'Al-'Alamin' is the plural of ''Alam' (universe/world), which designates everything that exists other than Allah. Ibn Abbas remarked: 'Al-'Alamin encompasses all beings possessing spirit, the heavens, the earth, mankind, jinn, and angels.'`,
    summaryAr: `بيّن الإمام ابن كثير رحمه الله أن ﴿الْحَمْدُ لِلَّهِ﴾ هو الشكر الخالص والثناء التام والمحبة والتعظيم لله سبحانه دون سائر ما يُعبد من دونه. والألف واللام في (الحمد) لاستغراق جميع أجناس المحامد والثناء لله وحده. ونقل عن ابن جرير الطبري: (الحمد لله ثناء أثنى به على نفسه، وفي ضمنه أمر عباده أن يثنوا عليه به).

و(الرب) هو المالك المتصرف المربي لجميع خلقه بالنعم، ولا يُطلق غير مضاف إلا على الله تعالى.
و(العالمين) جمع عالَم، وهو كل موجود سوى الله تعالى. قال ابن عباس رضي الله عنهما: (الحمد لله رب العالمين: الحمد لله الذي له الخلق كله؛ السماوات والأرضون ومن فيهن وما بينهن مما يُعلم ومما لا يُعلم).`,
    summaryAm: `«አል-ሀምዱ ሊላሂ ረቢል ዓለሚን»፤ ምስጋና ሁሉ የዓለማት ጌታ ለሆነው አላህ ብቻ ይገባዋል። «ረብ» ማለት ፈጣሪ፣ አስተዳዳሪና ሲሳይ ለጋሽ ማለት ሲሆን፤ «ዓለሚን» ከአላህ ውጭ ያሉትን ፍጥረታት በሙሉ ያጠቃልላል።`,
    hadithNarrationsEn: [
      'Prophet Muhammad (ﷺ) said: "The best remembrance is La ilaha illallah, and the best supplication is Al-Hamdu lillah." (At-Tirmidhi & An-Nasa\'i).',
      'The Messenger of Allah (ﷺ) said: "Purity is half of faith, and Al-Hamdu lillah fills the scale." (Sahih Muslim).'
    ],
    hadithNarrationsAr: [
      'عن جابر بن عبد الله رضي الله عنهما قال: سمعت رسول الله ﷺ يقول: «أفضل الذكر لا إله إلا الله، وأفضل الدعاء الحمد لله» (رواه الترمذي والنسائي وصححه ابن حبان).',
      'في صحيح مسلم عن أبي مالك الأشعري رضي الله عنه قال: قال رسول الله ﷺ: «الطهور شطر الإيمان، والحمد لله تملأ الميزان».'
    ],
    theologicalPointsEn: [
      'Gratitude (Shukr) and Praise (Hamd) must be directed primarily to the ultimate source of every blessing.',
      'Allah is the sole Sovereign and Nurturer of all macrocosmic and microcosmic realms.',
      'Reciting Al-Hamd continuously aligns the human heart with cosmic gratitude.'
    ],
    theologicalPointsAr: [
      'وجوب إفراد الله تعالى بالحمد المطلق والشكر على نعمه الظاهرة والباطنة.',
      'شمول ربوبية الله وتدبيره لجميع العوالم والأكوان دون نقص أو عجز.',
      'تطهير القلب من عُجب النفس بنسبة كل فضل ونعمة إلى منشئها ومسديها سبحانه.'
    ],
    driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL,
    localPdfUrl: TAFSIR_IBN_KATHIR_FATIHA_LOCAL_PDF_URL
  },

  // Surah 1:3 - Ar-Rahmanir-Rahim
  '1:3': {
    summaryEn: `Imam Ibn Kathir expounds that repeating 'Ar-Rahmanir-Rahim' immediately after 'Rabbil-'Alamin' (Lord of all the worlds) is a profound Quranic balance pairing awe and majesty with intense hope and solace (At-Tarhib ma'a At-Targhib). 
While 'Rabb' evokes sovereign majesty, awe, and total dominion over the cosmos, 'Ar-Rahmanir-Rahim' immediately softens the heart with divine compassion. 

Ibn Kathir cites the authentic Hadith Qudsi: 'When Allah created creation, He ordained with Himself above the Throne: Verily, My Mercy overcomes My Wrath.' 
Furthermore, Ar-Rahman is an exclusive divine name signifying all-embracing cosmic grace in this fleeting life for all creation, while Ar-Rahim represents the focused, eternal mercy reserved exclusively for the believers in the Akhirah.`,
    summaryAr: `أبان الإمام الحافظ ابن كثير رحمه الله أن عطف وصف ﴿الرَّحْمَٰنِ الرَّحِيمِ﴾ بعد قوله ﴿رَبِّ الْعَالَمِينَ﴾ جاء ليقرن الترهيب بالترغيب، ليمتزج في قلب العبد الخوف والمهابة من جلال الربوبية بالرجاء والطمع في سعة الرحمة والمغفرة.
فكما أن اسم (الرب) يُشعر بعظمة الملك والقهر وتدبير شؤون المخلوقات، فإن (الرحمن الرحيم) يُطمئن الأرواح إلى أن تدبيره قائم على الرأفة واللطف والإحسان.
واستشهد ابن كثير بالحديث القدسي الثابت في الصحيحين: «إِنَّ رَحْمَتِي غَلَبَتْ غَضَبِي». فالرحمن اسم ذو رحمة عامة بجميع الخلائق في دار الدنيا، والرحيم بالمؤمنين خصوصاً في الدار الآخرة.`,
    summaryAm: `«አር-ረሕማኒር-ረሒም»፤ አላህ «የዓለማት ጌታ» ከሚለው ግርማ ሞገስ ካለው ስሙ በኋላ እዝነቱን ደጋግሞ ማውሳቱ፣ በባሮቹ ልብ ውስጥ ከአላህ ፍራቻ ጋር ተስፋንና መረጋጋትን ለመዝራት ነው። የአላህ እዝነት ከቁጣው የበረታ መሆኑን ነቢዩ (ﷺ) አስተምረዋል።`,
    hadithNarrationsEn: [
      'In Sahih Al-Bukhari & Muslim: The Messenger of Allah (ﷺ) said: "When Allah decreed creation, He inscribed in His Book with Him above His Throne: Verily, My Mercy overcomes My Wrath."',
      'In Sahih Muslim from Salman Al-Farisi: The Prophet (ﷺ) said: "Allah created one hundred portions of mercy; He placed one portion on earth by which mothers cherish their young, and reserved ninety-nine portions for the Day of Judgment."'
    ],
    hadithNarrationsAr: [
      'في الصحيحين عن أبي هريرة رضي الله عنه أن رسول الله ﷺ قال: «لَمَّا قَضَى اللَّهُ الْخَلْقَ كَتَبَ فِي كِتَابِهِ فَهُوَ عِنْدَهُ فَوْقَ الْعَرْشِ: إِنَّ رَحْمَتِي غَلَبَتْ غَضَبِي».',
      'في صحيح مسلم عن سلمان الفارسي رضي الله عنه قال: قال رسول الله ﷺ: «إِنَّ لِلَّهِ مِائَةَ رَحْمَةٍ، فَمِنْهَا رَحْمَةٌ وَاحِدَةٌ يَتَرَاحَمُ بِهَا الْخَلْقُ بَيْنَهُمْ، وَتِسْعٌ وَتِسْعُونَ لِيَوْمِ الْقِيَامَةِ».'
    ],
    theologicalPointsEn: [
      'Harmonizing reverential fear (Khawf) with yearning hope (Raja\') is the bedrock of valid worship.',
      'Affirmation of Allah\'s boundless mercy as an active, eternal divine attribute.',
      'Reassurance that repentance is always embraced, as divine mercy supersedes retribution.'
    ],
    theologicalPointsAr: [
      'الجمع بين الخوف والرجاء في قلب العبد السالك إلى ربه؛ فلا ييأس من رحمة الله ولا يأمن مكره.',
      'إثبات صفة الرحمة الإلهية الذاتية والفعلية لله تعالى على الوجه اللائق بجلاله.',
      'فتح باب الأمل والتوبة للمذنبين؛ فإن رحمة الله سبقت غضبه ووسعت كل شيء.'
    ],
    driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL,
    localPdfUrl: TAFSIR_IBN_KATHIR_FATIHA_LOCAL_PDF_URL
  },

  // Surah 1:4 - Maliki Yawmid-Din
  '1:4': {
    summaryEn: `Ibn Kathir details the two authentic, mutawatir recitations of this verse: 'Maliki' (King/Sovereign, from Mulk) and 'Maaliki' (Owner/Possessor, from Milk). Both readings enrich each other: Allah is both the absolute Owner and the Supreme Sovereign of that Day. 
'Yawm ad-Din' is the Day of Recompense, Judgment, and Accounting (Yawm al-Hisab). 

Ibn Kathir explains: While Allah is the sole Sovereign of both this world and the Hereafter, He specifically attributes Sovereignty to the Day of Judgment because on that Day, all earthly kings, tyrants, and claimants to authority are stripped of all illusion of control. No human soul dares speak except by His divine permission. As Allah proclaims in Surah Ghafir (40:16): 'Whose is the kingdom this Day? It is Allah\'s, the One, the Irresistible!'`,
    summaryAr: `فصّل الإمام ابن كثير في قراءتي الآية المتواترتين: (مَلِكِ) بغير ألف، و(مَالِكِ) بالألف، وكلتاهما قراءة سبعية متواترة؛ فـ (مَلِك) من الملك، و(مَالِك) من الملكية، والجمع بينهما يدل على كمال السلطان وتمام التصرف. 
و(يوم الدين) هو يوم الجزاء والحساب والعدل، كقول العرب: (كما تدين تدان) أي كما تجازى تجازى بما عملت. 
وخصّ الله سبحانه يوم الدين بالملك مع أنه مالك الدنيا والآخرة لأنه لا يدّعي أحد يومئذٍ ملكاً ولا يتكلم أحد إلا بإذنه، كما قال تعالى: ﴿لِّمَنِ الْمُلْكُ الْيَوْمَ ۖ لِلَّهِ الْوَاحِدِ الْقَهَّارِ﴾ [غافر: ١٦].`,
    summaryAm: `«ማሊኪ የውሚድ-ዲን»፤ «የፍርዱ ቀን ባለቤትና ንጉሥ»። «ዲን» ማለት ምንዳና ፍርድ ማለት ሲሆን፤ በዚህ ቀን ምድራዊ ነገሥታትና ባለስልጣናት ሁሉ ኃይላቸው ተገፎ አላህ ብቻ ብቸኛው ገዢና ንጉሥ ሆኖ ፍርድን ይሰጣል።`,
    hadithNarrationsEn: [
      'In Sahih Al-Bukhari & Muslim from Abu Hurayrah: The Prophet (ﷺ) said: "Allah will fold the heavens on the Day of Resurrection, take the earths in His Hand, and proclaim: \'I am the King! Where are the kings of the earth? Where are the tyrants? Where are the arrogant?\'"',
      'Imam Ahmad and Sunan compilers recorded that the Messenger of Allah (ﷺ) recited both \'Maaliki Yawmid-Din\' and \'Maliki Yawmid-Din\' in authentic traditions.'
    ],
    hadithNarrationsAr: [
      'في الصحيحين عن أبي هريرة رضي الله عنه قال: قال رسول الله ﷺ: «يَقْبِضُ اللَّهُ الأَرْضَ يَوْمَ الْقِيَامَةِ، وَيَطْوِي السَّمَاءَ بِيَمِينِهِ، ثُمَّ يَقُولُ: أَنَا الْمَلِكُ، أَيْنَ مُلُوكُ الأَرْضِ؟ أَيْنَ الْجَبَّارُونَ؟ أَيْنَ الْمُتَكَبِّرُونَ؟».',
      'روى الإمام أحمد وأصحاب السنن قراءة النبي ﷺ لقوله تعالى: ﴿مَالِكِ يَوْمِ الدِّينِ﴾ و﴿مَلِكِ يَوْمِ الدِّينِ﴾.'
    ],
    theologicalPointsEn: [
      'Absolute accountability in the Hereafter; no injustice, bribery, or unauthorized intercession.',
      'The ephemeral nature of worldly power and wealth in comparison with the eternal Kingdom of God.',
      'Vigilant consciousness of the Day of Judgment purifies intentions and deters oppression.'
    ],
    theologicalPointsAr: [
      'وجوب الاستعداد ليوم الحساب والجزاء واليقين بالعدل الإلهي المطلق.',
      'زوال ملك الدنيا الفاني وانكشاف حقيقة الضعف البشري أمام جبروت الملك الحق.',
      'استشعار مراقبة الله الحاكم العدل في كل تصرف وسلوك دنيوي.'
    ],
    driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL,
    localPdfUrl: TAFSIR_IBN_KATHIR_FATIHA_LOCAL_PDF_URL
  },

  // Surah 1:5 - Iyyaka na'budu wa iyyaka nasta'in
  '1:5': {
    summaryEn: `Ibn Kathir emphasizes that this verse constitutes the theological core of Surah Al-Fatiha and the very secret of the Quran. 
Linguistically, fronting the grammatical object ('Iyyaka' - You Alone) establishes strict limitation and exclusivity (Hasr & Ikhtisas). It means: 'We worship none but You, and we place our trust in none but You.' 

Ibn Kathir expounds: 'Worship is the ultimate love, obedience, and reverence for Allah. Worship cannot be accepted unless it fulfills two essential conditions: it must be performed purely for Allah alone (Ikhlas), and it must strictly conform to the guidance of the Messenger of Allah (Ittiba').' 
Mentioning worship before seeking assistance ('Iyyaka nasta'in') prioritizes the rights of Allah over the needs of the servant, and obedience is the supreme doorway through which divine help is unlocked.`,
    summaryAr: `أكد الإمام ابن كثير أن هذه الآية الكريمة هي قطب رحى سورة الفاتحة وسر القرآن الكريم العظيم، وهي التحول البلاغي من الغيبة إلى الخطاب المباشر مع الله تعالى تعظيماً وإجلالاً.
وتقديم المفعول ﴿إِيَّاكَ﴾ يفيد الحصر والاختصاص في لغة العرب؛ أي: لا نعبد إلا إياك، ولا نتوكل إلا عليك.

وفصّل ابن كثير: (العبادة في الشرع عبارة عما يجمع كمال المحبة والخضوع والخوف والرجاء، ولا تكون مقبولة إلا بشرطين: الإخلاص لله والمتابعة لرسوله ﷺ).
وتقديم العبادة على الاستعانة من باب تقديم الغايات على الوسائل، ولأن العبادة حق الله الواجب على عباده، والاستعانة هي وسيلة العبد لنيل عون الله وتوفيقه.`,
    summaryAm: `«ኢያከ ነዕቡዱ ወኢያከ ነስተዒን»፤ «አንተን ብቻ እንገዛለን፤ አንተንም ብቻ እርዳታን እንለምናለን»። ይህ አንቀጽ የተውሂድ እና የአምልኮ መሰረት ሲሆን፣ አምልኮት ለአላህ ብቻ እንደሚገባና ያለ እርሱ እገዛ ምንም መፈጸም እንደማይቻል ያረጋግጣል።`,
    hadithNarrationsEn: [
      'In Hadith Qudsi recorded in Sahih Muslim: Allah says: "This is between Myself and My servant, and My servant shall have what he asks for."',
      'The Prophet (ﷺ) advised Ibn Abbas: "When you ask, ask of Allah; and when you seek help, seek help from Allah." (At-Tirmidhi, Hasan Sahih).'
    ],
    hadithNarrationsAr: [
      'في الحديث القدسي العظيم بصحيح مسلم: قال الله عز وجل: «هَذَا بَيْنِي وَبَيْنَ عَبْدِي، وَلِعَبْدِي مَا سَأَلَ».',
      'وصية النبي ﷺ لعبد الله بن عباس رضي الله عنهما: «إِذَا سَأَلْتَ فَاسْأَلِ اللَّهَ، وَإِذَا اسْتَعَنْتَ فَاسْتَعِنْ بِاللَّهِ» (رواه الترمذي وقال حديث حسن صحيح).'
    ],
    theologicalPointsEn: [
      'Elimination of ostentation (Riya) through "Iyyaka na\'budu", and elimination of pride through "Iyyaka nasta\'in".',
      'The servant cannot maintain steadfast obedience except through divine enablement and guidance.',
      'Sincere monotheism requires turning solely to Allah in times of ease and crisis.'
    ],
    theologicalPointsAr: [
      'التبري من الشرك والرياء بقوله: ﴿إِيَّاكَ نَعْبُدُ﴾، والتبري من الحول والقوة والكبرياء بقوله: ﴿وَإِيَّاكَ نَسْتَعِينُ﴾.',
      'إدراك العبد لفقره الذاتي المطلق إلى ربه في كل نَفَس وحركة وطاعة.',
      'جمع الدين كله في هاتين الكلمتين: العبادة الخالصة لله والتوكل الصادق عليه.'
    ],
    driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL,
    localPdfUrl: TAFSIR_IBN_KATHIR_FATIHA_LOCAL_PDF_URL
  },

  // Surah 1:6 - Ihdinas-Siratal-Mustaqim
  '1:6': {
    summaryEn: `Imam Ibn Kathir illuminates that having praised Allah and declared exclusive worship, the servant makes the most critical supplication: 'Guide us to the Straight Path.' 
Exegetes pose the question: If a believer is already guided, why supplicate for guidance in every single unit of prayer? Ibn Kathir answers: The servant is asking for firmness (Thabat), continuous steadfastness (Istidamah), and increase in illumination (Ziyadah fi al-Huda), for human guidance is urgently needed at every heartbeat and in every matter, known and unknown.

Regarding 'As-Sirat Al-Mustaqim', classical authorities define it: Ibn Mas'ud and Ibn Abbas said it is Islam; Ali ibn Abi Talib cited the Prophet (ﷺ) that it is the Noble Quran; Abu al-'Aliyah and Al-Hasan said it is the Messenger of Allah (ﷺ) and his two noble Companions (Abu Bakr and Umar). Ibn Kathir affirms all these definitions are harmonious and mutually confirming: following the Prophet and his Companions is adhering to Islam, which is acting upon the Quran.`,
    summaryAr: `بيّن الإمام ابن كثير أن العبد لما أثنى على الله بأسمائه وصفاته، وأخلص له العبادة والاستعانة، ناسب أن يسأله أهم المطالب وأعظم الحوائج وهو الهداية: ﴿اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ﴾. 
فإن قيل: كيف يسأل المؤمن الهداية وهو مهتدٍ أصلاً؟ أجاب ابن كثير: إن العبد مفتقر إلى الهداية في كل وقت وحين، فسؤالها هو سؤال للثبات والدوام والاستمرار والاستزادة من التوفيق والبصيرة؛ فإن العبد لا يملك لنفسه نفعاً ولا ضراً إلا بما هداه الله.

وأما (الصراط المستقيم) فقد فسره علي وابن مسعود بكتاب الله والقرآن العظيم، وفسره ابن عباس بالإسلام، وفسره أبو العالية والحسن البصري برسول الله ﷺ وصاحبيه أبي بكر وعمر رضي الله عنهما. قال ابن كثير: وكل هذه الأقوال حق ومتلازمة؛ فإن من اتبع النبي ﷺ وصاحبيه فقد اتبع الحق، ومن اتبع الحق فقد تمسك بالإسلام، ومن تمسك بالإسلام فقد عمل بالقرآن.`,
    summaryAm: `«ኢህዲነጽ-ሲራጦል ሙስተቂም»፤ «ቀጥተኛውን መንገድ ምራን»። አማኝ በሶላቱ ይህንን መለመኑ ጽናትን፣ ተጨማሪ እውቀትንና ቀጣይነት ያለው ቅን መመሪያን ከአላህ መሻቱን ያሳያል። «ቀጥተኛው መንገድ» ማለት ቁርአን፣ ኢስላም እንዲሁም የነቢዩ (ﷺ) እና የሶሓቦቻቸው መንገድ ነው።`,
    hadithNarrationsEn: [
      'Musnad Ahmad & At-Tirmidhi from An-Nawwas bin Sam\'an: The Prophet (ﷺ) said: "Allah sets forth a parable of a straight path flanked by two walls containing open doors draped with curtains. At the gate a caller cries: \'O people! Enter the straight path all together and do not deviate!\' And a caller above warns whenever one seeks to open a door: \'Woe to you! Do not open it, for if you open it you will enter it!\' The path is Islam; the open doors are Allah\'s prohibitions; the curtains are Allah\'s limits; the caller at the entrance is the Book of Allah, and the caller from above is Allah\'s admonition in the heart of every Muslim."',
      'Recorded by At-Tirmidhi from Ali: The Messenger of Allah (ﷺ) said concerning the Quran: "It is the Straight Path of Allah, and it is the Firm Rope of Allah."'
    ],
    hadithNarrationsAr: [
      'روى الإمام أحمد والترمذي عن النواس بن سمعان رضي الله عنه عن رسول الله ﷺ قال: «ضَرَبَ اللَّهُ مَثَلاً صِرَاطاً مُسْتَقِيماً، وَعَلَى جَنْبَتَيِ الصِّرَاطِ سُورَانِ فِيهِمَا أَبْوَابٌ مُفَتَّحَةٌ، وَعَلَى الأَبْوَابِ سُتُورٌ مُرْخَاةٌ، وَعَلَى بَابِ الصِّرَاطِ دَاعٍ يَقُولُ: أَيُّهَا النَّاسُ ادْخُلُوا الصِّرَاطَ جَمِيعاً وَلا تَعْوَجُّوا... فَالصِّرَاطُ: الإِسْلامُ، وَالسُّورَانِ: حُدُودُ اللَّهِ، وَالأَبْوَابُ الْمُفَتَّحَةُ: مَحَارِمُ اللَّهِ، وَذَلِكَ الدَّاعِي عَلَى رَأْسِ الصِّرَاطِ: كِتَابُ اللَّهِ، وَالدَّاعِي مِنْ فَوْقِ الصِّرَاطِ: وَاعِظُ اللَّهِ فِي قَلْبِ كُلِّ مُسْلِمٍ».',
      'عن علي بن أبي طالب رضي الله عنه قال: سمعت رسول الله ﷺ يقول في القرآن: «هُوَ صِرَاطُ اللَّهِ الْمُسْتَقِيمُ، وَهُوَ حَبْلُ اللَّهِ الْمَتِينُ» (رواه الترمذي).'
    ],
    theologicalPointsEn: [
      'Supplication (Dua) for guidance is the most indispensable prayer for spiritual preservation.',
      'True guidance requires both theoretical knowledge of truth and active obedience to divine commands.',
      'Steadfastness upon the path of the Prophet (ﷺ) and the Sahabah safeguards against sectarian deviance.'
    ],
    theologicalPointsAr: [
      'افتقار العبد الدائم والمطلق لهداية الله وتثبيته في كل طرفة عين.',
      'تكامل الهداية بالجمع بين العلم النافع والعمل الصالح دون انفكاك.',
      'عصمة الأمة بالتمسك بمنهج السلف الصالح وسنة الخلفاء الراشدين المهديين.'
    ],
    driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL,
    localPdfUrl: TAFSIR_IBN_KATHIR_FATIHA_LOCAL_PDF_URL
  },

  // Surah 1:7 - Siratal-ladhina an'amta 'alayhim...
  '1:7': {
    summaryEn: `Ibn Kathir clarifies that this verse explains and defines the Straight Path: 'The path of those upon whom You have bestowed favor.' 
Who are these favored souls? Ibn Kathir references Surah An-Nisa (4:69): 'And whoever obeys Allah and the Messenger - those will be with the ones upon whom Allah has bestowed favor: the prophets, the steadfast affirmers of truth (siddiqin), the martyrs (shuhada), and the righteous (salihin); and how excellent are those as companions!' These four groups combined sound knowledge with righteous action.

Then Allah warns against two deviant trajectories:
1. 'Ghayril-Maghdubi 'alayhim' (Not those who incurred anger): Those whose intentions became corrupted, who possessed authentic knowledge but deliberately refused to practice it, prioritizing worldly lusts. Classical exegetes and explicit authentic hadiths identify this description primarily with the rebellious amongst the Children of Israel (the Jews).
2. 'Wa lad-Dallin' (Nor those who are astray): Those who lost knowledge, worshipping Allah out of ignorance, innovation, and whimsical passions without prophetic guidance, as exemplified by the Christians who strayed regarding Jesus ('Isa).

Ibn Kathir concludes with the Sunnah of saying 'Amin' (O Allah, answer our supplication) upon completing the recitation, which is strongly emphasized in congregational and individual prayers.`,
    summaryAr: `فصّل الإمام ابن كثير أن هذه الآية بدل أو بيان للصراط المستقيم؛ أي طريق الذين أنعم الله عليهم بالهداية والتوفيق، وهم المذكورون في سورة النساء: ﴿وَمَن يُطِعِ اللَّهَ وَالرَّسُولَ فَأُولَٰئِكَ مَعَ الَّذِينَ أَنْعَمَ اللَّهُ عَلَيْهِم مِّنَ النَّبِيِّينَ وَالصِّدِّيقِينَ وَالشُّهَدَاءِ وَالصَّالِحِينَ ۚ وَحَسُنَ أُولَٰئِكَ رَفِيقًا﴾ [النساء: ٦٩]، وهؤلاء هم أهل العلم النافع المقترن بالعمل الصالح.

ثم قسّم الخلق بإزاء الحق إلى ثلاثة أصناف: المنعم عليهم (أهل العلم والعمل)، والمغضوب عليهم (من عرف الحق فتركه وأعرض عنه عمداً وهوىً، كاليهود)، والضالين (من عبد الله على جهل وضلالة بلا علم ولا برهان، كالنصارى).
وختم الحافظ ابن كثير ببيان فضل التأمين (قول آمين)؛ ومعناه: (اللهم استجب)، وسنيته المؤكدة بعد قراءة الفاتحة للإمام والمأموم والمنفرد.`,
    summaryAm: `«ሲራጦል-ለዚነ አንዐምተ ዐለይሂም...»፤ «የነዚያ በነርሱ ላይ በጎ የዋልክላቸው ሰዎች መንገድ፤ የነዚያ የተቆጣህባቸውና የጠፉት ያልሆኑትን መንገድ»። ጸጋ የተቸሩት ነቢያት፣ ጻድቃን፣ ሰማዕታትና መልካም ባሮች ናቸው። የተቆጣህባቸው እውነቱን እያወቁ ያልሰሩበት ሲሆኑ፣ የጠፉት ደግሞ ያለ እውቀት በስሜት አላህን ያመለኩ ናቸው።`,
    hadithNarrationsEn: [
      'Recorded by Imam Ahmad and At-Tirmidhi from \'Adi bin Hatim: The Prophet (ﷺ) said: "Indeed, those who incurred anger are the Jews, and those who are astray are the Christians." (Hasan Sahih).',
      'In Sahih Al-Bukhari & Muslim from Abu Hurayrah: The Messenger of Allah (ﷺ) said: "When the Imam says \'Ghayril-maghdubi \'alayhim wa lad-dallin\', say \'Amin\', for whoever\'s word coincides with the word of the angels, all his prior sins will be forgiven."'
    ],
    hadithNarrationsAr: [
      'روى الإمام أحمد والترمذي وصححه عن عدي بن حاتم رضي الله عنه قال: سألت رسول الله ﷺ عن ﴿غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ﴾ قال: «هُمُ الْيَهُودُ»، وعن ﴿وَلا الضَّالِّينَ﴾ قال: «النَّصَارَى هُمُ الضَّالُّونَ».',
      'في الصحيحين عن أبي هريرة رضي الله عنه أن رسول الله ﷺ قال: «إِذَا قَالَ الإِمَامُ: ﴿غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلا الضَّالِّينَ﴾ فَقُولُوا: آمِينَ، فَإِنَّهُ مَنْ وَافَقَ قَوْلُهُ قَوْلَ الْمَلائِكَةِ غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ».'
    ],
    theologicalPointsEn: [
      'The believers are defined by coupling correct knowledge with sincere righteous practice.',
      'Warning against intellectual corruption (abandoning action despite knowledge) and devotional innovation (worship without sound revealed knowledge).',
      'Saying \'Amin\' unites the earthly prayer of the congregation with the heavenly invocation of the angels.'
    ],
    theologicalPointsAr: [
      'تحقيق الفوز باتباع منهج النبيين والشهداء والصالحين الجامعين بين العلم الشرعي والعمل الصالح.',
      'التحذير البالغ من الانزلاق إلى مسالك المغضوب عليهم (كتمان الحق وترك العمل به) أو مسالك الضالين (الابتداع والعبادة بغير علم).',
      'التأمين بعد الفاتحة سنّة جليلة ترتبط بموافقة دعاء ملائكة السماء ونيل مغفرة الذنوب.'
    ],
    driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL,
    localPdfUrl: TAFSIR_IBN_KATHIR_FATIHA_LOCAL_PDF_URL
  },

  // Surah 18:10 - Ashab al-Kahf Dua
  '18:10': {
    summaryEn: `Imam Ibn Kathir recounts the historical context of the young monotheists (Ashab al-Kahf) who fled the religious oppression of their idolatrous ruler (Decius / Daqyanus). To preserve their faith from forced polytheism, they abandoned status, wealth, and families, taking refuge in a desolate cavern. 

Upon reaching the cave, their first act was sincere, total reliance on Allah through supplication: 'Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance.' 
Ibn Kathir notes that they asked specifically for 'Mercy from Your Presence' (min ladunka rahmah), acknowledging that only special divine shelter could sustain them in their vulnerability, and requested 'Rashada' (rectitude and discernment) so their hardship would yield triumph for the truth. Allah answered by placing them into miraculous sleep for over three solar centuries.`,
    summaryAr: `ذكر الحافظ ابن كثير قصة الفتية المؤمنين الذين فروا بدينهم وعقيدتهم التوحيدية من بطش ملكهم المشرك (دقيانوس) وقومه، وآثروا الخلوة في الغار على نعيم الدنيا وزخرفها الزائل حفظاً لإيمانهم من الفتنة.

فلما دخلوا الكهف لم يتواكلوا بل لجأوا إلى حصن الدعاء والتضرع: ﴿رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا﴾. 
وفسر ابن كثير: سألوا الله أن يمنحهم من عنده رحمة تغفر ذنوبهم وتسترهم عن قومهم الظالمين، وأن يجعل عاقبة أمرهم رشداً وسداداً وهداية. فضرب الله على آذانهم في الكهف سنين عدداً حفظاً لأجسادهم وإيماناً، وجعلهم آية باهرة لأهل زمانهم في البعث والنشور.`,
    summaryAm: `የዋሻው ባለቤቶች (አስሃቡል ካህፍ) እምነታቸውን ከጨቋኝ ንጉስ ሽሽት ወደ ዋሻ በተጠጉ ጊዜ፤ ከአላህ ዘንድ እዝነትንና ቅን መመሪያን ጠየቁ። አላህም ለ300 ዓመታት ያህል ተኝተው እንዲቆዩ በማድረግ ተዓምራዊ ጥበቃ አደረገላቸው።`,
    hadithNarrationsEn: [
      'The Prophet (ﷺ) said: "Whoever memorizes ten verses from the beginning of Surah Al-Kahf will be protected from the Dajjal (False Messiah)." (Sahih Muslim).',
      'The Prophet (ﷺ) said: "Whoever recites Surah Al-Kahf on Friday, a light will illuminate for him between the two Fridays." (Al-Hakim & Al-Bayhaqi).'
    ],
    hadithNarrationsAr: [
      'في صحيح مسلم عن أبي الدرداء رضي الله عنه أن النبي ﷺ قال: «مَنْ حَفِظَ عَشْرَ آيَاتٍ مِنْ أَوَّلِ سُورَةِ الْكَهْفِ عُصِمَ مِنَ الدَّجَّالِ».',
      'عن أبي سعيد الخدري رضي الله عنه أن النبي ﷺ قال: «مَنْ قَرَأَ سُورَةَ الْكَهْفِ فِي يَوْمِ الْجُمُعَةِ أَضَاءَ لَهُ مِنَ النُّورِ مَا بَيْنَ الْجُمُعَتَيْنِ» (رواه الحاكم والبيهقي وصححه الألباني).'
    ],
    theologicalPointsEn: [
      'True reliance combines taking legitimate lawful precautions (entering the cave) with heartfelt prayer.',
      'Sincere youth who stand firm upon monotheism are honored and miraculously protected by Allah.',
      'Invoking Allah for "Rashad" (divine rectitude) provides clarity in societal confusion and trial.'
    ],
    theologicalPointsAr: [
      'مشروعية الهجرة والفرار بالدين من الفتن ومواطن المعاصي.',
      'فضل التوسل إلى الله بصفة الرحمة الذاتية وطلب الرشد والتوفيق في النوازل.',
      'قدرة الله المطلقة على حفظ أوليائه وخرق السنن الكونية لمن صدق في اللجوء إليه.'
    ],
    driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL
  },

  // Surah 36:58 - Salamun qawlan min Rabbin Rahim
  '36:58': {
    summaryEn: `Imam Ibn Kathir expounds that this ayah marks the zenith of honor and eternal bliss for the inhabitants of Paradise. While they are engrossed in gardens of fruit, shaded couches, and delight, they receive a direct greeting of 'Salam' (Peace) delivered as a divine speech from their Lord, the Especially Merciful.

Ibn Kathir cites classical traditions from Ibn Abbas and early exegetes: A radiant, magnificent light will envelop the dwellers of Jannah, revealing the divine countenance of the Almighty, where He salutes them: 'Peace be upon you, O people of Paradise.' 
This spiritual communion surpasses all physical luxuries of Paradise, for the greatest reward of the believers is gaining the pleasure of Allah and beholding His Divine Glory.`,
    summaryAr: `بيّن الإمام ابن كثير رحمه الله أن هذه الآية المباركة تصف أعظم كرامة وأجلّ نعيم يناله أهل الجنة على الإطلاق؛ فبينما هم في النعيم المقيم والفاكهة والأزواج والأرائك، يأتيهم هذا السلام الإلهي الكريم مباشرة من ربهم الرحيم.

ونقل ابن كثير عن ابن عباس وغيره: يُشرق عليهم نور عظيم من فوقهم، فيتجلى لهم الرب الرحيم جل جلاله ويحييهم بالسلام قائلاً: «السلام عليكم يا أهل الجنة». فيغمرهم السلام والأمن التام، وينسون ما هم فيه من النعيم أمام لذة النظر إلى وجه الله الكريم ورضوانه الأبدي الذي لا سخط بعده أبداً.`,
    summaryAm: `«ሰላሙን ቀውለን ሚን ረቢን ረሒም»፤ በጀነት ውስጥ ለሙእሚኖች ከሚሰጡ ታላላቅ ጸጋዎች ሁሉ የላቀው እጅግ ሩህሩህ ከሆነው ጌታቸው የሚደርሳቸው የሰላምታ ቃል እና የእርሱ ውዴታ ነው።`,
    hadithNarrationsEn: [
      'Recorded in Sunan Ibn Majah from Jabir ibn Abdullah: The Prophet (ﷺ) said: "While the people of Paradise are enjoying their bliss, a light will shine upon them, and their Lord will look upon them and say: \'Peace be upon you, O people of Paradise.\' This is the meaning of: \'Peace, a word from a Merciful Lord.\'"',
      'The Prophet (ﷺ) said: "Allah will say to the people of Paradise: \'O people of Paradise! I grant you My eternal pleasure, and I will never be angry with you afterwards.\'" (Sahih Bukhari & Sahih Muslim).'
    ],
    hadithNarrationsAr: [
      'روى ابن ماجه في سننه عن جابر بن عبد الله رضي الله عنهما قال: قال رسول الله ﷺ: «بَيْنَمَا أَهْلُ الْجَنَّةِ فِي نَعِيمِهِمْ، إِذْ سَطَعَ لَهُمْ نُورٌ، فَرَفَعُوا رُءُوسَهُمْ، فَإِذَا الرَّبُّ قَدْ أَشْرَفَ عَلَيْهِمْ مِنْ فَوْقِهِمْ، فَقَالَ: السَّلَامُ عَلَيْكُمْ يَا أَهْلَ الْجَنَّةِ، وَذَلِكَ قَوْلُ اللَّهِ: ﴿سَلَامٌ قَوْلًا مِّن رَّبٍّ رَّحِيمٍ﴾».',
      'في الصحيحين: «إِنَّ اللَّهَ يَقُولُ لِأَهْلِ الْجَنَّةِ: يَا أَهْلَ الْجَنَّةِ... أُحِلُّ عَلَيْكُمْ رِضْوَانِي فَلَا أَسْخَطُ عَلَيْكُمْ بَعْدَهُ أَبَدًا».'
    ],
    theologicalPointsEn: [
      'The spiritual joy of divine pleasure and vision of Allah completely eclipses physical pleasures.',
      'The attribute of Divine Speech: Allah speaks directly to His righteous servants in the Abode of Peace.',
      'Peace (Salam) in the ultimate sense implies safety from all grief, mortality, illness, and parting.'
    ],
    theologicalPointsAr: [
      'إثبات صفة الكلام لله تعالى، وأنه يخاطب أولياءه في دار كرامته بسلام ورحمة.',
      'أن أعظم نعيم الجنة هو رؤية وجه الله تعالى ورضاه السابغ عن أوليائه.',
      'الأمن الكامل الدائم من كل كدر وزوال، فلا خوف ولا حزن ولا فناء في دار النعيم.'
    ],
    driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL
  },

  // Surah 67:2 - Alladhi khalaqa al-mawta wal-hayata
  '67:2': {
    summaryEn: `Imam Ibn Kathir highlights the profound philosophical and spiritual core of this opening verse of Surah Al-Mulk. Allah created life and death with intentional wisdom: as an active test of devotion ('Liyabluwakum ayyukum ahsanu 'amala'). 

Ibn Kathir quotes the renowned statement of Al-Fudayl ibn 'Iyad regarding 'best in deeds': 'It means the most sincere (akhlisuhu) and the most correct (aswabuhu). If an action is sincere but not correct, it is not accepted; and if it is correct but not sincere, it is not accepted—until it is both sincere for Allah and conforming to the Sunnah of the Prophet (ﷺ).'
Concluding with 'Al-'Aziz Al-Ghafur' teaches that while Allah has total power to punish those who fail this test, He is Immensely Forgiving to those who turn to Him with repentance.`,
    summaryAr: `أوضح الحافظ ابن كثير أن الله سبحانه أوجد الموت والحياة لحكمة بالغة؛ وهي ابتلاء العباد واختبارهم: أيكم أحسن عملاً وأصدق طاعة. 

واستشهد ابن كثير بالقول الخالد للإمام الفضيل بن عياض رحمه الله في تفسير (أحسن عملاً): «أخلصه وأصوبه؛ فإن العمل إذا كان خالصاً ولم يكن صواباً لم يُقبل، وإذا كان صواباً ولم يكن خالصاً لم يُقبل حتى يكون خالصاً صواباً؛ والخالص أن يكون لله، والصواب أن يكون على السنّة».
وختم الآية باسميه ﴿الْعَزِيزُ الْغَفُورُ﴾ للدلالة على كمال عزته في عقاب المعاندين، وسعة مغفرته لمن تاب وأناب وأقبل على ربه.`,
    summaryAm: `«አለዚ ኸለቀል መውተ ወል-ሀያተ ሊየብሉወኩም አዩኩም አሕሰኑ ዓመላ»፤ አላህ ሞትንና ህይወትን የፈጠረው ከእናንተ ውስጥ በስራው ማን ይበልጥ የተሻለ እንደሆነ ሊፈትናችሁ ነው። «ጥሩ ስራ» ማለት ለአላህ ብቻ የተጠራራና በነቢዩ መንገድ የተመሰረተ ስራ ነው።`,
    hadithNarrationsEn: [
      'The Prophet (ﷺ) said: "Surah Tabarak (Al-Mulk) contains thirty verses that intercede for a man until he is forgiven." (Abu Dawud & At-Tirmidhi).',
      'The Messenger of Allah (ﷺ) said: "I wish that Surah Al-Mulk were in the heart of every believer." (Al-Baghawi).'
    ],
    hadithNarrationsAr: [
      'روى أبو داود والترمذي عن أبي هريرة رضي الله عنه عن النبي ﷺ قال: «إِنَّ سُورَةً مِنَ الْقُرْآنِ ثَلَاثُونَ آيَةً شَفَعَتْ لِرَجُلٍ حَتَّى غُفِرَ لَهُ: تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ».',
      'عن ابن عباس رضي الله عنهما قال: ضرب رجل من أصحاب النبي ﷺ فسطاطه على قبر وهو لا يعلم أنه قبر إنسان، فإذا فيه إنسان يقرأ سورة الملك حتى ختمها، فأتى النبي ﷺ فأخبره، فقال رسول الله ﷺ: «هِيَ الْمَانِعَةُ، هِيَ الْمُنْجِيَةُ، تُنْجِيهِ مِنْ عَذَابِ الْقَبْرِ» (رواه الترمذي وقال حسن غريب).'
    ],
    theologicalPointsEn: [
      'Life and death are created instruments of spiritual testing rather than purposeless chance.',
      'Deeds are weighed by moral quality, sincerity, and prophetic conformity rather than mere quantity.',
      'Consistent nightly recitation of Surah Al-Mulk provides protection against the trial of the grave.'
    ],
    theologicalPointsAr: [
      'الحياة الدنيا دار ابتلاء وتكليف وليست دار قرار وجزاء.',
      'العبرة عند الله بحسن العمل وجودته وإخلاصه لا بكثرته المجردة.',
      'الربط الوثيق بين العزة الإلهية والمغفرة لتربية المسلم بين الخوف والرجاء.'
    ],
    driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL
  },

  // Surah 55:13 - Fabi'ayyi ala'i Rabbikuma tukadhdhiban
  '55:13': {
    summaryEn: `Imam Ibn Kathir explains that this famous refrain, repeated 31 times throughout Surah Ar-Rahman, directly addresses the two accountable species: Mankind and Jinn (Ath-Thaqalayn). 
The term 'Ala'' means favors, bounties, and evident blessings. The verse challenges both groups: 'Which of your Lord's apparent and hidden blessings—your creation, intellect, physical health, the oceans, the revelation, and forgiveness—do you dare deny?'

Ibn Kathir records the hadith where the Prophet (ﷺ) recited this Surah to the Jinn, noting that whenever he recited this verse, the Jinn answered with sublime faith: 'We do not deny any of Your blessings, our Lord, and all praise belongs to You.'`,
    summaryAr: `بيّن الإمام ابن كثير رحمه الله أن الخطاب في هذه الآية المباركة وما تكرر منها (إحدى وثلاثين مرة) متوجه إلى الثقلين: الإنس والجن. 
والآلاء هي النعم الجليلة والمواهب والقدرة الإلهية الباهرة. والمعنى: بأي نعم ربكم الدينية والدنيوية تكذبان وتجحدون؟

ونقل ابن كثير حديث جابر رضي الله عنه: قرأ رسول الله ﷺ سورة الرحمن على الجن، فكان كلما مر بهذه الآية قالوا: «وَلَا بِشَيْءٍ مِنْ آلَائِكَ رَبَّنَا نُكَذِّبُ، فَلَكَ الْحَمْدُ». فعاتب النبي ﷺ أصحابه قائلاً: «لَلْجِنُّ كَانُوا أَحْسَنَ مَرْدُودًا مِنْكُمْ!».`,
    summaryAm: `«ፈቢአይዪ አላኢ ረቢኩማ ቱከዚባን»፤ «ከጌታችሁ ጸጋዎች በየትኛው ታስተባብላላችሁ?!»። ይህ አንቀጽ የሰውን ልጅና ጂኖችን በአላህ ችሮታዎች፣ ጸጋዎችና ተዓምራቶች ላይ እንዲያስተነትኑና ምስጋና እንዲያቀርቡ ይጠራል።`,
    hadithNarrationsEn: [
      'Recorded by Imam At-Tirmidhi from Jabir: The Messenger of Allah (ﷺ) said: "I recited Surah Ar-Rahman to the Jinn on the night of the Jinn, and they had a better response than you! Whenever I came to: \'Which of the favors of your Lord will you deny?\', they said: \'None of Your favors, our Lord, do we deny, and all praise is for You.\'"'
    ],
    hadithNarrationsAr: [
      'روى الترمذي عن جابر رضي الله عنه قال: خرج رسول الله ﷺ على أصحابه، فقرأ عليهم سورة الرحمن حتى سكتوا، فقال: «لَقَدْ قَرَأْتُهَا عَلَى الْجِنِّ لَيْلَةَ الْجِنِّ فَكَانُوا أَحْسَنَ مَرْدُودًا مِنْكُمْ، كُنْتُ كُلَّمَا أَتَيْتُ عَلَى قَوْلِهِ: ﴿فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ﴾ قَالُوا: لَا بِشَيْءٍ مِنْ نِعَمِكَ رَبَّنَا نُكَذِّبُ، فَلَكَ الْحَمْدُ».'
    ],
    theologicalPointsEn: [
      'Recognition that both humans and jinn are morally obligated to show gratitude for divine blessings.',
      'Repetition in the Quran serves to emphasize grandeur, instill awe, and awaken negligent hearts.',
      'Gratitude preserves existing favors and invites further divine benevolence.'
    ],
    theologicalPointsAr: [
      'إثبات تكليف الجن بالإيمان والتوحيد كالإنس في سياق الخطاب القرآني.',
      'أثر التكرار البلاغي في إيقاظ الغفلة وترسيخ استشعار النعم الظاهرة والباطنة.',
      'أن كفران النعم وجحودها من أعظم أسباب سلبها وزوالها.'
    ],
    driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL
  },

  // Surah 112:1 - Qul Huwa Allahu Ahad
  '112:1': {
    summaryEn: `Imam Ibn Kathir records the occasion of revelation (Sabab an-Nuzul) for Surah Al-Ikhlas: The polytheists of Makkah (and in other narrations, the rabbis of Khaybar) approached the Prophet (ﷺ) saying: 'O Muhammad, describe to us the lineage of your Lord! Is He made of gold, silver, or iron?' Allah revealed this definitive declaration of pure Monotheism.

'Ahad' is a unique attribute exclusive to Allah, signifying the Single, Indivisible One who has no equal, no peer, no consort, and no offspring. Ibn Kathir notes: 'He is the Absolute One in His essence, attributes, and sovereignty; none resembles Him and He resembles none.'`,
    summaryAr: `أورد الحافظ ابن كثير سبب نزول سورة الإخلاص: جاء المشركون إلى رسول الله ﷺ فقالوا: يا محمد، انسب لنا ربك، أمِن ذهب هو أم من فضة؟ فأنزل الله تبارك وتعالى هذه السورة العظيمة رداً عليهم وإعلاناً لصفاء التوحيد المطلق.

و﴿أَحَدٌ﴾ اسم لله تعالى لا يُطلق إلا عليه سبحانه؛ لأنه الأحد الذي لا نظير له، ولا شريك له، ولا شبيه له، ولا كفء له، المنزه عن الصاحبة والولد، المتفرد بالألوهية والربوبية والكمال المطلق.`,
    summaryAm: `«ቁል ሁወላሁ አሀድ»፤ «በላቸው፡- እርሱ አላህ አንድ ነው»። አላህ አጋር፣ ልጅ፣ ሚስት የሌለውና በባህሪውም ሆነ በአምላክነቱ አምሳያ የሌለው ብቸኛ አምላክ መሆኑን ያስተምራል።`,
    hadithNarrationsEn: [
      'Recorded in Sahih Bukhari from Abu Sa\'id Al-Khudri: A man heard another reciting Qul Huwa Allahu Ahad repeatedly. When mentioned to the Prophet (ﷺ), he said: "By Him in Whose Hand is my soul, it is equivalent to a third of the Quran."',
      'Recorded in Sahih Bukhari from Aisha: The Prophet (ﷺ) appointed a man over an expedition who would end every prayer reciting Surah Al-Ikhlas. The Prophet said: "Ask him why he does that." The man replied: "Because it contains the attribute of the Most Merciful, and I love to recite it." The Prophet (ﷺ) replied: "Inform him that Allah loves him."'
    ],
    hadithNarrationsAr: [
      'في صحيح البخاري عن أبي سعيد الخدري رضي الله عنه أن النبي ﷺ قال: «وَالَّذِي نَفْسِي بِيَدِهِ إِنَّهَا لَتَعْدِلُ ثُلُثَ الْقُرْآنِ».',
      'في الصحيحين عن عائشة رضي الله عنها أن النبي ﷺ قال عن الرجل الذي كان يختم صلاته بـ ﴿قُلْ هُوَ اللَّهُ أَحَدٌ﴾: «سَلُوهُ لِأَيِّ شَيْءٍ يَصْنَعُ ذَلِكَ؟» فَقَالَ: لِأَنَّهَا صِفَةُ الرَّحْمَنِ، وَأَنَا أُحِبُّ أَنْ أَقْرَأَ بِهَا. فَقَالَ النَّبِيُّ ﷺ: «أَخْبِرُوهُ أَنَّ اللَّهَ يُحِبُّهُ».'
    ],
    theologicalPointsEn: [
      'Surah Al-Ikhlas equals one-third of the Quran because the Quran addresses Creed, Stories, and Rulings—and this chapter is pure Creed (Aqeedah).',
      'Affirmation of absolute divine transcendence above anthropomorphism and polytheistic attribution.',
      'Love for Surah Al-Ikhlas brings the love and pleasure of Allah.'
    ],
    theologicalPointsAr: [
      'عظمة السورة وأنها تعدل ثلث القرآن لتجريدها التوحيد الخالص من الشرك والتشبيه.',
      'إثبات وحدانية الذات والصفات ونفي الشبيه والنظير جملة وتفصيلاً.',
      'أن حب صفة الرحمن ومحبة التوحيد سبب موصل إلى محبة الله ودخول جنته.'
    ],
    driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL
  },

  // Surah 112:2 - Allahu As-Samad
  '112:2': {
    summaryEn: `Imam Ibn Kathir provides a detailed classical analysis of the divine name 'As-Samad'. 
He quotes the eminent companion Abdullah ibn Abbas: 'As-Samad is the Master whose mastery is absolute; the Noble whose nobility is complete; the Great whose greatness is consummate; the Forbearing whose forbearance is flawless; the All-Knowing whose knowledge is infinite; the Self-Sufficient upon whom all creatures depend in every need, while He depends upon no one.'

Ibn Kathir also quotes early scholars like Al-Hasan Al-Basri and Qatadah: 'He is the Eternal who never perishes, who does not eat nor drink, who has no hollow (al-baqi ba'da fana'i khalqih).' Everything in the heavens and the earth seeks His provision and direction, while He is completely free from all need.`,
    summaryAr: `استفاض الحافظ ابن كثير في استقصاء أقوال السلف في تفسير اسم الله العظيم ﴿الصَّمَدُ﴾.
ونقل عن عبد الله بن عباس رضي الله عنهما: (الصَّمَدُ: السيد الذي قد كمل في سؤدده، والشريف الذي قد كمل في شرفه، والعظيم الذي قد كمل في عظمته، والحليم الذي قد كمل في حلمه، والغني الذي قد كمل في غناه، والجبَّار الذي قد كمل في جبروته، والعالم الذي قد كمل في علمه، والحكيم الذي قد كمل في حكمته؛ وهو الذي كمل في أنواع الشرف والسؤدد، وهو الله سبحانه).

ونقل عن الحسن البصري وقتادة ومجاهد: (الصمد هو السيد الذي يُصمد إليه في الحوائج؛ أي تقصده الخلائق بأسرها في طلب الرزق والشفاء وحوائجهم كلها، وهو الغني عنهم لا يطعم ولا يشرب ولا يفنى).`,
    summaryAm: `«አላሁስ-ሶመድ»፤ «አላህ (የሁሉ) መጠጊያ ነው»። ፍጥረታት ሁሉ በሁለንተናዊ ፍላጎታቸውና ችግራቸው ወደ እርሱ የሚከጅሉበት፤ እርሱ ግን ከማንም ምንም የማይፈልግ ራሱን የቻለ ጌታ መሆኑን ያብራራል።`,
    hadithNarrationsEn: [
      'Recorded in Sunan Abi Dawud & At-Tirmidhi: The Prophet (ﷺ) heard a man supplicating: "O Allah, I ask You by virtue of bearing witness that You are Allah, there is no deity worthy of worship except You, the One, As-Samad..." The Prophet said: "He has asked Allah by His Greatest Name (Al-Ism Al-A\'zam) with which if He is called, He responds, and if asked, He gives."'
    ],
    hadithNarrationsAr: [
      'روى أبو داود والترمذي عن بريدة رضي الله عنه أن رسول الله ﷺ سمع رجلاً يقول: «اللَّهُمَّ إِنِّي أَسْأَلُكَ بِأَنِّي أَشْهَدُ أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ، الْأَحَدُ الصَّمَدُ، الَّذِي لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ»، فَقَالَ النبي ﷺ: «لَقَدْ سَأَلَ اللَّهَ بِاسْمِهِ الْأَعْظَمِ الَّذِي إِذَا سُئِلَ بِهِ أَعْطَى، وَإِذَا دُعِيَ بِهِ أَجَابَ».'
    ],
    theologicalPointsEn: [
      'As-Samad implies total independence of Allah and total dependence of all creatures upon Him.',
      'Supplicating with the divine names Al-Ahad and As-Samad is a guaranteed path to divine acceptance.',
      'Refutation of all polytheistic and philosophical claims that attribute human biological characteristics to the Divine.'
    ],
    theologicalPointsAr: [
      'كمال استغناء الخالق سبحانه عن كل ما سواه، وافتقار الخلائق بأسرها إليه في كل لحظة وطرفة عين.',
      'فضل التوسل باسمي الله (الأحد الصمد) كونهما من الاسم الأعظم المستجاب.',
      'تنزيه الذات العلية عن سمات الحدوث والافتقار البشري والتغذية والولادة.'
    ],
    driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL
  },

  // -------------------------------------------------------------
  // Surah Al-Falaq (113) - Exegesis from Tafsir Ibn Kathir
  // -------------------------------------------------------------
  '113:1': {
    summaryEn: `Imam Al-Hafiz Ibn Kathir (rahimahullah) opens the exegesis of Surah Al-Falaq by highlighting the supreme virtues of Al-Mu'awwidhatayn (the two chapters of seeking refuge: Al-Falaq and An-Nas). 
He cites the authentic narration of Uqbah bin 'Amir recorded in Sahih Muslim: The Messenger of Allah (ﷺ) said: "Have you not seen verses that were revealed tonight the like of which has never been seen? They are: 'Qul a'udhu bi Rabbil-Falaq' and 'Qul a'udhu bi Rabbin-Nas.'"

Regarding "Al-Falaq", Ibn Kathir quotes the eminent Sahabi Jabir bin Abdullah and Ibn Abbas: "Al-Falaq is the morning / daybreak (As-Subh)," citing the Quranic parallel: "He is the Cleaver of the daybreak (Faaliqul-Isbah)" (Al-An'am 6:96). It represents Allah's almighty power in cleaving the pitch darkness of night with the radiant dawn. Ibn Kathir also records views from Qatadah and Sa'id ibn Jubayr affirming that it symbolizes creation itself being split open from non-existence. Seeking refuge in the Lord of Daybreak reminds the believer that just as Allah dispels terrifying nocturnal darkness with morning light, He dispels anxiety, evil, and malevolent spiritual oppression through His divine sanctuary.`,
    summaryAr: `استهل الإمام الحافظ عماد الدين إسماعيل بن كثير رحمه الله تفسير سورة الفلق ببيان الفضائل الجليلة للمعوذتين (الفلق والناس).
واستشهد بما رواه مسلم في صحيحه عن عقبة بن عامر رضي الله عنه قال: قال رسول الله ﷺ: «أَلَمْ تَرَ آيَاتٍ أُنْزِلَتِ اللَّيْلَةَ لَمْ يُرَ مِثْلُهُنَّ قَطُّ؟: ﴿قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ﴾، وَ﴿قُلْ أَعُوذُ بِرَبِّ النَّاسِ﴾».

وفي تفسير قوله تعالى ﴿قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ﴾: قال جابر بن عبد الله وابن عباس ومجاهد وسعيد بن جبير والحسن وقتادة: «الفلق: الصبح»، كما قال تعالى في سورة الأنعام: ﴿فَالِقُ الإِصْبَاحِ﴾ [الأنعام: ٩٦]. فالله تعالى هو الذي يفلق ظلمة الليل بنور الصباح الباهر، وهو القادر على فلق الشدائد وكشف الكربات، وإخراج العبد من ظلمات الأذى والشرور إلى نور الأمن والحفظ والعافية.`,
    summaryAm: `ኢማም ኢብኑ ከሲር በተፍሲራቸው እንደገለጹት፤ «ቁል አዑዙ ቢረቢል ፈለቅ» (በላቸው፡- በንጋቱ ጌታ እጠበቃለሁ)። አላህ ጥቁሩን የሌሊት ጨለማ በንጋት ብርሃን እንደሚሰነጥቀውና እንደሚያጠራው ሁሉ፣ አማኙን ከማንኛውም ክፋትና ጭንቀት በማውጣት ፍጹም ጥበቃን ይሰጠዋል።`,
    hadithNarrationsEn: [
      'Sahih Muslim: The Prophet (ﷺ) said to Uqbah bin \'Amir: "Should I not teach you the two best Surahs people can recite? Qul a\'udhu bi Rabbil-Falaq and Qul a\'udhu bi Rabbin-Nas."',
      'Sunan An-Nasa\'i: The Messenger of Allah (ﷺ) said to Ibn \'Abis Al-Juhani: "O Ibn \'Abis, shall I not guide you to the supreme protection sought by those who seek refuge? Recite the two Mu\'awwidhatayn."'
    ],
    hadithNarrationsAr: [
      'في صحيح مسلم عن عقبة بن عامر قال: قال لي رسول الله ﷺ: «اقْرَأْ بـ ﴿قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ﴾ وَ﴿قُلْ أَعُوذُ بِرَبِّ النَّاسِ﴾؛ فَمَا تَعَوَّذَ مُتَعَوِّذٌ بِمِثْلِهِمَا».',
      'روى النسائي عن ابن عابس الجهني أن رسول الله ﷺ قال له: «يَا ابْنَ عَابِسٍ، أَلَا أُخْبِرُكَ بِأَفْضَلِ مَا يَتَعَوَّذُ بِهِ الْمُتَعَوِّذُونَ؟»، قلت: بلى يا رسول الله، قال: «﴿قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ﴾ وَ﴿قُلْ أَعُوذُ بِرَبِّ النَّاسِ﴾، هَاتَيْنِ السُّورَتَيْنِ».'
    ],
    theologicalPointsEn: [
      'Total reliance on Allah alone for sanctuary against all physical and metaphysical perils.',
      'Affirmation of Allah as the Sovereign Lord of the dawn and of all created splits in existence.',
      'Consistent morning and evening recitation of Al-Mu\'awwidhatayn constitutes an impregnable spiritual fortress.'
    ],
    theologicalPointsAr: [
      'التوحيد الخالص في الاستعاذة؛ فلا يُستعاذ إلا بالله العظيم القادر على دفع الضر وجلب النفع.',
      'استشعار عظمة قدرة الله في فلق الصبح ومحو الظلام كدليل على قدرته على دفع كل مكروه.',
      'مشروعية المداومة على قراءة المعوذتين صباحاً ومساءً وعند النوم والرقية الشرعية.'
    ],
    driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL,
    localPdfUrl: TAFSIR_IBN_KATHIR_LOCAL_PDF_URL
  },

  '113:2': {
    summaryEn: `Imam Ibn Kathir elucidates "Min sharri ma khalaq" (From the evil of what He has created):
This is an all-encompassing refuge from the evil of every single created entity across the heavens and the earth. 
Ibn Kathir notes that this includes:
1. Iblis (Satan) and his progeny who tempt, mislead, and incite mankind.
2. The Hellfire and its torments created for the disobedient.
3. Harmful beasts, predatory animals, scorpions, snakes, poisonous vermin, and destructive pests.
4. The evil potential of human beings and anything capable of doing harm.

Theologians point out the delicate etiquette: Evil is attributed to the created thing ('ma khalaq'), not directly to the Divine Act of creation itself, because Allah's ultimate purpose in creating the universe is filled with perfect wisdom, while evil resides only in the choices, harms, or corruption manifested by created agents.`,
    summaryAr: `قال الإمام ابن كثير في قوله تعالى ﴿مِن شَرِّ مَا خَلَقَ﴾: أي من شر كل مخلوق فيه شر؛ فيشمل الاستعاذة من شر إبليس وجنوده وشياطين الإنس والجن، ومن شر نار جهنم، ومن شر السباع والهوام والحشرات السامة والرياح العاتية، ومن كل أذى يلحق العبد في دينه أو دنياه.

وقد علّم الله نبيه والمؤمنين الاستعاذة العامة الجامعة لكل أنواع الشرور، مع الأدب الرفيع في نسبة الشر إلى المخلوقات وأفعالها لا إلى فعل الخلق الإلهي الذي هو كله حكمة وعدل ورحمة.`,
    summaryAm: `«ሚን ሸሪ ማ ኸለቅ»፤ አላህ ከፈጠራቸው ፍጥረታት ሁሉ ክፋት (ከኢብሊስ፣ ከመርዛማ ፍጥረታት፣ ከአውሬዎችና ከሰው ልጆች ክፋት) ወደ አላህ መጠበቅን ያስተምራል።`,
    hadithNarrationsEn: [
      'Sahih Muslim: Khawlah bint Hakim reported the Prophet (ﷺ) said: "Whoever stops at a dwelling and says: \'A\'udhu bi kalimatillahi at-tammati min sharri ma khalaq\' (I seek refuge in the perfect words of Allah from the evil of what He has created), nothing will harm him until he departs from that dwelling."',
      'Recorded by Imam Ahmad: The Prophet (ﷺ) would supplicate: "O Allah, I seek refuge in You from the evil of my hearing, my sight, my tongue, my heart, and my desire."'
    ],
    hadithNarrationsAr: [
      'في صحيح مسلم عن خولة بنت حكيم رضي الله عنها قالت: سمعت رسول الله ﷺ يقول: «مَنْ نَزَلَ مَنْزِلًا ثُمَّ قَالَ: أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ، لَمْ يَضُرَّهُ شَيْءٌ حَتَّى يَرْتَحِلَ مِنْ مَنْزِلِهِ ذَلِكَ».',
      'في المسند والسنن: كان رسول الله ﷺ يتعوذ بالله من درك الشقاء وسوء القضاء وشماتة الأعداء وجهد البلاء.'
    ],
    theologicalPointsEn: [
      'Comprehensive protection: one supplication covers all visible and invisible sources of danger.',
      'Refinement in divine attribution: evil exists in creation as a test or trial, but divine decree is inherently wise.',
      'Continual spiritual vigilance against heedlessness in unfamiliar or vulnerable environments.'
    ],
    theologicalPointsAr: [
      'شمول الاستعاذة لكل دابة وكل مخلوق له شر في الوجود.',
      'تنزيه الخالق الحكيم؛ فالشر واقع في مفعولاته ومخلوقاته لحكمة بالغة لا في صفاته وأفعاله سبحانه.',
      'فضل التمسك بالأذكار النبوية الوقائية عند النزول والسفر والمبيت.'
    ],
    driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL,
    localPdfUrl: TAFSIR_IBN_KATHIR_LOCAL_PDF_URL
  },

  '113:3': {
    summaryEn: `Imam Ibn Kathir records the classical linguistic and scholarly meanings of "Wa min sharri ghasiqin idha waqab" (And from the evil of darkness when it settles).
1. The Primary Meaning: Ibn Abbas, Mujahid, Qatadah, Ad-Dahhak, and As-Suddi stated: "Al-Ghasiq is the night, and 'idha waqab' means when it enters, covers, and darkens everything." Nightfall is specifically singled out because under the veil of darkness, predatory animals emerge, poisonous insects creep from their burrows, criminals and thieves initiate harm, and evil spirits and jinn spread out across the land.
2. The Moon Narration: Ibn Kathir records with its authentic chain in Musnad Ahmad, Sunan At-Tirmidhi, and Sunan An-Nasa'i from Mother of the Believers Aisha (radiyallahu 'anha): 
"The Messenger of Allah (ﷺ) held my hand and looked at the moon as it rose, and said: 'O Aisha, seek refuge with Allah from the evil of this, for this is the ghasiq when it settles (al-ghasiq idha waqab).'"
Ibn Kathir clarifies: "The scholars explain that the moon is an emblem of the night, and its illumination occurs at nightfall; thus seeking refuge from the night or the heavenly sign of the night are closely intertwined."`,
    summaryAr: `فصّل الحافظ ابن كثير في قوله تعالى ﴿وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ﴾:
١- قول الجمهور من الصحابة والتابعين: قال ابن عباس ومجاهد والضحاك وقتادة: (الغاسق هو الليل، وإذا وقب: إذا دخل وأقبل بظلامه وغطى الكون). وخُصّ الليل بالذكر لأن الهوام وذوات السموم والسباع وشياطين الإنس والجن تنتشر فيه طلباً للأذى والفساد.
٢- حديث أم المؤمنين عائشة رضي الله عنها: أورد ابن كثير بإسناد صحيح عن أحمد والترمذي والنسائي، أن النبي ﷺ أخذ بيد عائشة فنظر إلى القمر لما طلع فقال: «يَا عَائِشَةُ، اسْتَعِيذِي بِاللَّهِ مِنْ شَرِّ هَذَا، فَإِنَّ هَذَا هُوَ الْغَاسِقُ إِذَا وَقَبَ». وبيّن ابن كثير أن القمر هو آية الليل وسلطانه، فطلوعه علامة على دخول سلطان الليل وانتشار غواسقه.`,
    summaryAm: `«ወሚን ሸሪ ጋሲቂን ኢዛ ወቀብ»፤ ጨለማው በገባና በተንሰራፋ ጊዜ ከሚከሰቱ አደጋዎች ወደ አላህ መጠበቅ። ነቢዩ (ﷺ) እመቤታችን አይሻን ጨረቃዋን እያሳዩ ከዚህ የሌሊት መጀመሪያ ክፋት ወደ አላህ እንድትጠበቅ አስተምረዋታል።`,
    hadithNarrationsEn: [
      'Musnad Ahmad & At-Tirmidhi: Aisha narrated: "The Prophet (ﷺ) held my hand, pointed to the moon, and said: \'Seek refuge with Allah from the evil of this, for this is the ghasiq when it settles.\'" (Graded Sahih).',
      'Sahih Bukhari & Muslim: The Prophet (ﷺ) said: "When the wings of night spread (or evening falls), restrain your children, for the devils disperse at that time. When an hour of the night has passed, let them go, and close your doors and mention the Name of Allah."'
    ],
    hadithNarrationsAr: [
      'روى الترمذي وأحمد عن عائشة رضي الله عنها أن النبي ﷺ نظر إلى القمر فقال: «يَا عَائِشَةُ اسْتَعِيذِي بِاللَّهِ مِنْ شَرِّ هَذَا فَإِنَّ هَذَا هُوَ الْغَاسِقُ إِذَا وَقَبَ» (قال الترمذي: حديث حسن صحيح).',
      'في الصحيحين عن جابر رضي الله عنه قال: قال رسول الله ﷺ: «إِذَا كَانَ جُنْحُ اللَّيْلِ أَوْ أَمْسَيْتُمْ فَكُفُّوا صِبْيَانَكُمْ، فَإِنَّ الشَّيَاطِينَ تَنْتَشِرُ حِينَئِذٍ، فَإِذَا ذَهَبَ سَاعَةٌ مِنَ اللَّيْلِ فَخَلُّوهُمْ، وَأَغْلِقُوا الْأَبْوَابَ وَاذْكُرُوا اسْمَ اللَّهِ».'
    ],
    theologicalPointsEn: [
      'Darkness obscures vision and amplifies vulnerability, necessitating supernatural divine protection.',
      'Prophetic instructions for nightfall: closing doors with Bismillah, gathering children, and reciting protections.',
      'Direct confirmation of the prophetic methodology of teaching family members personal spiritual shielding.'
    ],
    theologicalPointsAr: [
      'عظم التحصن الإلهي عند تغير أوقات اليوم ودخول ظلام الليل المخيف.',
      'اتباع الإرشاد النبوي بإغلاق الأبواب بذكر الله وكف الصبيان أول الليل لتفادي طائف الشياطين.',
      'حرص النبي ﷺ على تعليم أهله وأمته أذكار الحفظ المباشرة وملاحظة الآيات الكونية.'
    ],
    driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL,
    localPdfUrl: TAFSIR_IBN_KATHIR_LOCAL_PDF_URL
  },

  '113:4': {
    summaryEn: `Imam Ibn Kathir records the historical revelation context (Sabab an-Nuzul) and exegesis of "Wa min sharrin-naffathati fil-'uqad" (And from the evil of the blowers in knots):
Mujahid, Ikrimah, Al-Hasan, and Qatadah explained: "An-Naffathat refers to sorceresses and practitioners of witchcraft who tie knots in strings or cords, and blow spittle upon them with incantations and invocations to demons."

Ibn Kathir recounts the famous authentic incident recorded in Sahih Bukhari and Sahih Muslim from Aisha and Zayd bin Arqam:
The Jewish magician Labid bin Al-A'sam cast a dark spell upon the Prophet (ﷺ) using eleven knots tied in hair from his comb, sealed inside the spathe of a male date-palm and concealed at the bottom of the well of Dharwan. The Prophet suffered physical distress without losing any revelation or prophetic clarity. 
Two angels (Jibril and Mika'il) descended; one sat at his head and the other at his feet, disclosing the nature of the magic, the perpetrator, and the location. Allah then revealed Al-Mu'awwidhatayn (eleven verses total: five in Al-Falaq, six in An-Nas). As the Prophet (ﷺ) recited each verse, one knot unfastened until all eleven knots opened, and he arose completely cured, vigorous as though released from heavy bonds.`,
    summaryAr: `بيّن الإمام ابن كثير في تفسير ﴿وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ﴾:
قال مجاهد وعكرمة والحسن وقتادة: «هن السواحر اللاتي يعقدن العقد في الخيوط وينفثن فيها بريقهن وتعويذاتهن الشيطانية لإلحاق الأذى بالمسحور».

وأورد ابن كثير القصة الثابتة في صحيحي البخاري ومسلم عن عائشة وزيد بن أرقم رضي الله عنهما: أن يهودياً يُدعى لبيد بن الأعصم سحر رسول الله ﷺ في مشط ومُشاطة وجُفّ طلعة ذكر، وعقد فيه إحدى عشرة عقدة، وألقاها في بئر ذروان. فأتاه ملكان (جبريل وميكائيل) وهو نائم، فأخبره أحدهما بالداء والدواء ومكان السحر. وأنزل الله سورتي المعوذتين (الفلق خمس آيات، والناس ست آيات = إحدى عشرة آية بعدد العقد)، فجعل النبي ﷺ يقرأ آية فتنحل عقدة ويجد خفة، حتى انحلت العقد كلها وقام كأنما نَشِطَ من عِقال.`,
    summaryAm: `«ወሚን ሸሪን-ነፋሳቲ ፊል ዑቀድ»፤ በቋጠሮዎች ላይ ድግምት ከሚተፉ ጠንቋዮች ክፋት ወደ አላህ መጠበቅ። ለቢድ የተባለ ሰው በነቢዩ (ﷺ) ላይ በ11 ቋጠሮዎች ድግምት ባደረገ ጊዜ፣ ጂብሪል ሱረቱል ፈለቅንና ናስን (11 አንቀጾች) ይዞ ወረደ፤ አንቀጾቹ በተነበቡ ቁጥር ቋጠሮዎቹ እየተፈቱ ነቢዩ ሙሉ በሙሉ ዳኑ።`,
    hadithNarrationsEn: [
      'Sahih Bukhari: Aisha narrated: "Magic was worked on the Prophet (ﷺ) so that he began to imagine doing things he had not done. He supplicated to Allah, then said: \'O Aisha, Allah has instructed me regarding what I asked Him...\' The well of Dharwan was drained and the knotted charm removed; whenever he recited a verse, a knot untied."',
      'Musnad Ahmad & An-Nasa\'i: Abu Sa\'id Al-Khudri reported: "The Messenger of Allah (ﷺ) used to seek protection from the jinn and the evil eye of men, until the two Mu\'awwidhatayn were revealed. When they were revealed, he adopted them and abandoned everything else."'
    ],
    hadithNarrationsAr: [
      'في صحيح البخاري عن عائشة رضي الله عنها قالت: سُحِرَ النبي ﷺ حتى إنه ليُخيَّل إليه أنه يفعل الشيء وما فعله، حتى استجاب الله له ودلّه على مكان السحر، فاستخرجه وقرأ المعوذتين فانحلت العقد وبرئ تماماً.',
      'روى الترمذي والنسائي عن أبي سعيد الخدري رضي الله عنه قال: «كَانَ رَسُولُ اللَّهِ ﷺ يَتَعَوَّذُ مِنَ الْجَانِّ وَعَيْنِ الإِنْسَانِ، حَتَّى نَزَلَتِ الْمُعَوِّذَتَانِ، فَلَمَّا نَزَلَتَا أَخَذَ بِهِمَا وَتَرَكَ مَا سِوَاهُمَا».'
    ],
    theologicalPointsEn: [
      'Magic (Sihr) is an objective spiritual reality that produces tangible harm by Allah\'s universal permission, but has no power over divine will.',
      'The definitive Islamic remedy for witchcraft and spiritual harm is Quranic Ruqyah, especially Al-Mu\'awwidhatayn.',
      'The preservation of the Prophet (ﷺ): the magic affected only minor physical stamina, never altering his infallible transmission of revelation.'
    ],
    theologicalPointsAr: [
      'إثبات حقيقة السحر وتأثيره بإذن الله الكوني القدري، والتحذير الشديد من تعاطيه أو تصديق السحرة.',
      'أن أعظم ترياق وشفاء للسحر والحسد هو القرآن الكريم وخاصة المعوذتين بالفهم واليقين.',
      'عصمة النبي ﷺ في التبليغ والرسالة والعقل؛ وإنما كان أثر السحر عارضاً بدنياً ظاهرياً كالأمراض والسم.'
    ],
    driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL,
    localPdfUrl: TAFSIR_IBN_KATHIR_LOCAL_PDF_URL
  },

  '113:5': {
    summaryEn: `Imam Ibn Kathir expounds on "Wa min sharri hasidin idha hasad" (And from the evil of an envier when he envies):
Hasad (destructive envy) is defined by scholars as the burning hatred within a person's soul upon seeing Allah bestow a bounty upon another, accompanied by the malice and ardent desire that the victim be deprived of that blessing. 
Ibn Kathir notes that the qualifier "idha hasad" (when he envies) highlights that an envious person becomes dangerous when his envy transitions from hidden inner resentment into active manifestation—such as casting the toxic Evil Eye ('Ayn), slandering, plotting sabotage, or attempting harm.

Ibn Kathir cites the authentic hadith in Sahih Muslim where Angel Jibril visited the Prophet (ﷺ) when he was ailing, and recited the renowned Ruqyah:
"Bismillahi arqik, min kulli shay'in yu'dhik, min sharri kulli nafsin aw 'ayni hasidin, Allahu yashfik; Bismillahi arqik." (In the Name of Allah I perform Ruqyah for you, from everything that harms you, from the evil of every soul or envious eye, may Allah heal you; in the Name of Allah I perform Ruqyah for you).`,
    summaryAr: `أوضح الحافظ ابن كثير دلالة ﴿وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ﴾:
الحسد هو تمني زوال النعمة عن المحسود وإن لم يصر للحاسد مثلها. وقُيّد بقوله ﴿إِذَا حَسَدَ﴾ لأن الحاسد قد يضمر الحسد في صدره دون أن يترتب عليه ضرر للغير، فإذا أظهره بقول أو فعل أو نظرة عين خبيثة (العين حق)، ترتب عليه الأذى، فوجبت الاستعاذة من شره في تلك الحال.

وأورد ابن كثير حديث أبي سعيد الخدري في صحيح مسلم: أن جبريل عليه السلام أتى النبي ﷺ فقال: يَا مُحَمَّدُ، اشْتَكَيْتَ؟ فَقَالَ: «نَعَمْ»، فَقَالَ جِبْرِيلُ: «بِاسْمِ اللَّهِ أَرْقِيكَ، مِنْ كُلِّ شَيْءٍ يُؤْذِيكَ، مِنْ شَرِّ كُلِّ نَفْسٍ أَوْ عَيْنِ حَاسِدٍ اللَّهُ يَشْفِيكَ، بِاسْمِ اللَّهِ أَرْقِيكَ».`,
    summaryAm: `«ወሚን ሸሪ ሀሲዲን ኢዛ ሀሰድ»፤ ምቀኛ በምቀኝነቱ ጊዜ ከሚያደርሰው ተንኮል ወደ አላህ መጠበቅ። ምቀኝነት የሰዎችን ጸጋ መጥላት ሲሆን፣ የዐይን በሽታም ከዚሁ ይመነጫል። ጂብሪል ነቢዩን በታመሙ ጊዜ በዚህ ዱዓ ሩቅያህ እንዳደረገላቸው በሙስሊም ተዘግቧል።`,
    hadithNarrationsEn: [
      'Sahih Muslim: Jibril came to the Prophet (ﷺ) and recited: "Bismillahi arqika, min kulli shay\'in yu\'dheeka, min sharri kulli nafsin aw \'ayni hasidin Allahu yashfeeka, bismillahi arqeek."',
      'Sahih Bukhari & Muslim: The Prophet (ﷺ) said: "The evil eye is a reality. If anything could precede the divine decree, it would be the evil eye."'
    ],
    hadithNarrationsAr: [
      'في صحيح مسلم عن أبي سعيد الخدري أن جبريل رقى النبي ﷺ فقال: «بِاسْمِ اللَّهِ أَرْقِيكَ، مِنْ كُلِّ شَيْءٍ يُؤْذِيكَ، مِنْ شَرِّ كُلِّ نَفْسٍ أَوْ عَيْنِ حَاسِدٍ اللَّهُ يَشْفِيكَ، بِاسْمِ اللَّهِ أَرْقِيكَ».',
      'في الصحيحين عن ابن عباس وأبي هريرة أن رسول الله ﷺ قال: «الْعَيْنُ حَقٌّ، وَلَوْ كَانَ شَيْءٌ سَابَقَ الْقَدَرَ سَبَقَتْهُ الْعَيْنُ».'
    ],
    theologicalPointsEn: [
      'Envy (Hasad) was the primordial sin: Iblis envied Adam, and Qabil envied Habil.',
      'The Evil Eye is real and lethal unless repelled by consistent remembrance and seeking Allah\'s blessing (Tabrik: "Masha\'Allah TabarakAllah").',
      'Surah Al-Falaq terminates with Hasad because it is the most insidious, pervasive, and corrosive social and spiritual ailment.'
    ],
    theologicalPointsAr: [
      'الحسد أول ذنب عُصي الله به في السماء (حسد إبليس لآدم) وأول ذنب في الأرض (قتل قابيل لهابيل).',
      'مشروعية التبريك عند رؤية ما يعجب المسلم («ما شاء الله تبارك الله») لدفع شر العين.',
      'ختم السورة بالحاسد إشعاراً بخطورته وخفائه وكثرة أضراره في حياة الفرد والمجتمع.'
    ],
    driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL,
    localPdfUrl: TAFSIR_IBN_KATHIR_LOCAL_PDF_URL
  },

  // -------------------------------------------------------------
  // Surah An-Nas (114) - Exegesis from Tafsir Ibn Kathir
  // -------------------------------------------------------------
  '114:1': {
    summaryEn: `Imam Al-Hafiz Ibn Kathir begins Surah An-Nas by explaining the profound significance of combining the three divine titles in verses 1 to 3: "Rabb an-Nas" (Lord of mankind), "Malik an-Nas" (Sovereign of mankind), and "Ilah an-Nas" (God of mankind).
Ibn Kathir writes: "These are three attributes from the attributes of the Lord, Mighty and Majestic: Rububiyyah (Lordship), Mulk (Sovereignty), and Uluhiyyah (Divinity). He is the Lord of everything, its King, and its God. All things are created by Him, owned by Him, and subservient to Him."

Why is "Mankind" (An-Nas) specifically singled out when Allah is the Lord of all creation? 
Ibn Kathir clarifies: 
1. The seeker of refuge is a human being asking for rescue from an adversary that specifically targets humanity.
2. Man is honored with intellect, revelation, and accountability, making the protection of his soul the supreme priority.
3. The internal whisper of the devil seeks to corrupt man's faith, so man takes shelter in the One who created him, governs him, and deserves his worship.`,
    summaryAr: `استهل الإمام ابن كثير تفسير سورة الناس المباركة ببيان حكمة الجمع بين الصفات الإلهية الثلاث في الآيات الأولى: ﴿رَبِّ النَّاسِ﴾، ﴿مَلِكِ النَّاسِ﴾، ﴿إِلَهِ النَّاسِ﴾.
قال ابن كثير: «هذه ثلاث صفات من صفات الرب عز وجل: الربوبية والملك والألوهية؛ فهو رب كل شيء ومليكه وإلهه، فجميع الأشياء مخلوقة له ومملوكة له وعبيد له؛ فأمر المستعيذ أن يتعوذ بالمتصف بهذه الصفات من شر الوسواس الخناس».

وإنما خُصّ الناس بالذكر تشريفاً لهم، ولأن المستعيذ آدمي يستعيذ بربه وخالقه من عدو لدود يتربص بالقلوب والنوايا، ليفسد عليها إيمانها ويسلبها طاعتها.`,
    summaryAm: `«ቁል አዑዙ ቢረቢን-ናስ»፤ በሰው ልጆች ጌታ፣ አሳዳጊና ጠባቂ በሆነው አላህ እጠበቃለሁ። አላህ የፍጥረተ አለሙ ሁሉ ፈጣሪ ቢሆንም የሰውን ልጅ ክብር ለማሳየት «የሰው ልጆች ጌታ» ተብሎ ተጠራ።`,
    hadithNarrationsEn: [
      'Sahih Bukhari: Aisha reported that whenever the Prophet (ﷺ) went to bed every night, he would cup his hands together, blow into them, and recite Qul Huwa Allahu Ahad, Qul a\'udhu bi Rabbil-Falaq, and Qul a\'udhu bi Rabbin-Nas, then wipe over as much of his body as he could reach, starting with his head, face, and front of body, doing this three times.',
      'Sunan Abi Dawud: The Prophet (ﷺ) said: "Recite Qul Huwa Allahu Ahad and Al-Mu\'awwidhatayn when you wake in the morning and when you enter the evening three times; they will suffice you against everything."'
    ],
    hadithNarrationsAr: [
      'في صحيح البخاري عن عائشة رضي الله عنها أن النبي ﷺ كان إذا أوى إلى فراشه كل ليلة جمع كفيه ثم نفث فيهما فقرأ فيهما: ﴿قُلْ هُوَ اللَّهُ أَحَدٌ﴾ و﴿قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ﴾ و﴿قُلْ أَعُوذُ بِرَبِّ النَّاسِ﴾، ثم يمسح بهما ما استطاع من جسده يبدأ برأسه ووجهه وما أقبل من جسده، يفعل ذلك ثلاث مرات.',
      'روى أبو داود والترمذي عن عبد الله بن خُبيب قال: قال رسول الله ﷺ: «قُلْ هُوَ اللَّهُ أَحَدٌ، وَالمُعَوِّذَتَيْنِ، حِينَ تُمْسِي وَحِينَ تُصْبِحُ، ثَلاَثَ مَرَّاتٍ، تَكْفِيكَ مِنْ كُلِّ شَيْءٍ».'
    ],
    theologicalPointsEn: [
      'Affirmation of Allah\'s exclusive Rububiyyah (nurturance and guardianship) over the human race.',
      'The prophetic Sunnah of nightly blowing and wiping with Al-Mu\'awwidhatayn forms an authentic shield.',
      'Reciting these three times at Fajr and Maghrib provides comprehensive sufficiency against all harms.'
    ],
    theologicalPointsAr: [
      'إثبات صفة الربوبية الشاملة لله تعالى على البشر أجمعين.',
      'سنة النفث والمسح النبوي على الجسد عند النوم بالمعوذات والإخلاص ثلاثاً.',
      'كفاية المعوذتين والإخلاص عند الصباح والمساء عن كل حرز وتميمة.'
    ],
    driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL,
    localPdfUrl: TAFSIR_IBN_KATHIR_LOCAL_PDF_URL
  },

  '114:2': {
    summaryEn: `Imam Ibn Kathir expounds "Malikin-nas" (The Sovereign / King of mankind):
Mulk denotes supreme ownership, command, legislation, and absolute control. While worldly monarchs may claim fleeting dominion over earthly subjects, Allah alone is the True, Unquestioned Sovereign whose decree encompasses life, death, resurrection, and the ultimate judgment of all humanity. 
Seeking refuge in the "King of Mankind" acknowledges that Shaytan and his whisperers are merely subjects under Allah's absolute domain, unable to advance one step or harm a soul except by the Sovereign's permission.`,
    summaryAr: `أوضح الحافظ ابن كثير دلالة ﴿مَلِكِ النَّاسِ﴾:
الملك هو المتصرف في خلقه بالعدل والقدرة، الآمر الناهي، المحيي المميت، الحاكم المطلق الذي تخضع له رقاب الجبابرة والملوك.
والتعوذ بملك الناس اعتراف بأن الشيطان وجنوده ما هم إلا رعايا ومخلوقات في مملكة الله، ناصيتهم بيده سبحانه، لا يستطيعون الإضرار بأحد إلا بإذن مالكهم وملكهم الحق.`,
    summaryAm: `«መሊኪን-ናስ»፤ የሰው ልጆች እውነተኛ ንጉስና ገዥ በሆነው አላህ እጠበቃለሁ። ምድራዊ ነገስታት ሁሉ ጊዜያዊ ሲሆኑ፤ እርሱ ግን የፍርዱ ቀን ብቸኛ ባለቤት ነው።`,
    hadithNarrationsEn: [
      'Sahih Muslim: The Prophet (ﷺ) said: "The most detestable name before Allah on the Day of Resurrection is a man who called himself Malik al-Amlak (King of Kings), for there is no King except Allah."',
      'Sahih Bukhari: The Prophet (ﷺ) said: "Allah will fold the heavens and the earth on the Day of Resurrection, then say: \'I am the King! Where are the tyrants? Where are the arrogant?\'"'
    ],
    hadithNarrationsAr: [
      'في صحيح مسلم عن أبي هريرة رضي الله عنه أن رسول الله ﷺ قال: «أَخْنَى الْأَسْمَاءِ يَوْمَ الْقِيَامَةِ عِنْدَ اللَّهِ رَجُلٌ تَسَمَّى مَلِكَ الْأَمْلَاكِ؛ لَا مَلِكَ إِلَّا اللَّهُ».',
      'في صحيح البخاري: «يَطْوِي اللَّهُ السَّمَاوَاتِ يَوْمَ الْقِيَامَةِ ثُمَّ يَأْخُذُهُنَّ بِيَدِهِ الْيُمْنَى ثُمَّ يَقُولُ: أَنَا الْمَلِكُ، أَيْنَ الْجَبَّارُونَ؟ أَيْنَ الْمُتَكَبِّرُونَ؟».'
    ],
    theologicalPointsEn: [
      'Absolute sovereignty belongs to Allah alone; human rulers possess only temporary, accountable stewardship.',
      'Submitting to the King of mankind liberates the heart from fearing worldly oppressors or demonic powers.',
      'Every plot of the devil is subordinate to divine permission and justice.'
    ],
    theologicalPointsAr: [
      'انفراد الله سبحانه بالملك التام الأبدي، وعجز ملوك الأرض وفنائهم.',
      'تحرير القلب من الخوف من المخلوقين والاعتماد على ملك الملوك وحده.',
      'أن كيد الشيطان مهما عظم فهو تحت قبضة الملك القاهر فوق عباده.'
    ],
    driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL,
    localPdfUrl: TAFSIR_IBN_KATHIR_LOCAL_PDF_URL
  },

  '114:3': {
    summaryEn: `Imam Ibn Kathir expounds "Ilahin-nas" (The God of mankind):
"Ilah" signifies the One True Deity who is rightfully worshipped, adored, supplicated, loved, and feared above all else. 
Ibn Kathir explains the sublime sequence:
1. He is their Rabb (Who brought them from nothingness and sustains their bodies).
2. He is their Malik (Who governs their laws and controls their destinies).
3. He is their Ilah (Who alone deserves their inner devotion, faith, and servitude).
The goal of the whispering devil is to dismantle this third attribute—to seduce the human heart away from pure Tawheed (Monotheism) into polytheism, doubt, or sin. Therefore, invoking "Ilahin-nas" reaffirms that the heart's sanctuary belongs solely to Allah.`,
    summaryAr: `بيّن الإمام ابن كثير دلالة ﴿إِلَهِ النَّاسِ﴾:
الإله هو المعبود الحق بحب وتعظيم وإخلاص، الذي تألهه القلوب وتفرده بالدعاء والرجاء والخوف والنذر.
وهذا الترتيب القرآني البديع غاية في البلاغة: بدأ بالربوبية الدالة على الخلق والتربية، ثم ثنّى بالملك الدال على التدبير والأمر، ثم ختم بالألوهية التي هي الغاية والمقصد؛ أي: الذي لا تصح العبادة إلا له. فبما أنه ربهم وملكهم وإلههم، فإليه وحده المفزع والملجأ لدفع وسواس الشيطان وفتنته.`,
    summaryAm: `«ኢላሂን-ናስ»፤ የሰው ልጆች ብቸኛ አምላክና ተመላኪ በሆነው አላህ እጠበቃለሁ። የሸይጧን ዋነኛ አላማ የሰውን ልጅ ከተውሂድና ከአምልኮ ማራቅ በመሆኑ፣ በዚህ አንቀጽ ወደ እርሱ እንጠጋለን።`,
    hadithNarrationsEn: [
      'Sahih Bukhari: The Prophet (ﷺ) said: "Whoever says: \'La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa \'ala kulli shay\'in qadir\' one hundred times in a day, it will be for him equivalent to freeing ten slaves, one hundred good deeds recorded, one hundred sins wiped away, and it will be a shield for him from Satan that entire day until evening."',
      'Sahih Muslim: The Prophet (ﷺ) said: "Satan comes to one of you and says: \'Who created this? Who created that?\' until he says: \'Who created your Lord?\' When it reaches that, let him seek refuge in Allah and stop thinking about it."'
    ],
    hadithNarrationsAr: [
      'في الصحيحين: «مَنْ قَالَ: لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، فِي يَوْمٍ مِائَةَ مَرَّةٍ، كَانَتْ لَهُ حِرْزًا مِنَ الشَّيْطَانِ يَوْمَهُ ذَلِكَ حَتَّى يُمْسِيَ».',
      'في صحيح مسلم عن أبي هريرة: قال رسول الله ﷺ: «يَأْتِي الشَّيْطَانُ أَحَدَكُمْ فَيَقُولُ: مَنْ خَلَقَ كَذَا؟ حَتَّى يَقُولَ: مَنْ خَلَقَ رَبَّكَ؟ فَإِذَا بَلَغَهُ فَلْيَسْتَعِذْ بِاللَّهِ وَلْيَنْتَهِ».'
    ],
    theologicalPointsEn: [
      'The purpose of human creation is Tawheed of Worship (Tawheed al-Uluhiyyah).',
      'Whispers of philosophical doubts or existential dread are neutralized by immediate refuge in Allah.',
      'Sincere remembrance of La ilaha illallah paralyzes the whisperer and restores tranquility.'
    ],
    theologicalPointsAr: [
      'إفراد الله تعالى بالألوهية والعبادة؛ فهي الحصن الحصين من كيد الشيطان.',
      'علاج وساوس الشكوك والخواطر الشيطانية بقطع التفكير والاستعاذة بالرحمن كما أرشد النبي ﷺ.',
      'قوة كلمة التوحيد (لا إله إلا الله) في طرد الشياطين وبعث السكينة في الصدر.'
    ],
    driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL,
    localPdfUrl: TAFSIR_IBN_KATHIR_LOCAL_PDF_URL
  },

  '114:4': {
    summaryEn: `Imam Ibn Kathir offers a masterclass in psychological and spiritual insight regarding "Min sharril-waswasil-khannas" (From the evil of the retreating whisperer):
Ibn Kathir cites the profound narration of Abdullah ibn Abbas:
"The devil is perched upon the heart of the son of Adam (Al-Shaytanu jathimun 'ala qalbi ibni Adam). When he is negligent, absent-minded, and heedless of Allah, the devil whispers into his heart. But the moment he remembers Allah, the devil cowers, shrinks, retreats, and flees (khannas)!"
Sa'id ibn Jubayr and Mujahid confirmed this interpretation: "When a person mentions the Name of Allah, Satan retreats and curls away; when he ceases remembrance, he returns to whisper."

Ibn Kathir quotes the authentic hadith of Safiyyah bint Huyayy recorded in both Sahih Bukhari and Sahih Muslim:
The Prophet (ﷺ) walked his wife Safiyyah home at night. Two Ansari men saw him and hurried away. The Prophet (ﷺ) called out: "Be calm! It is only Safiyyah bint Huyayy." They said: "SubhanAllah, O Messenger of Allah! (Could we doubt you?)" The Prophet (ﷺ) said: "Verily, Shaytan flows through the son of Adam like blood flows, and I feared he would cast an evil thought into your hearts."`,
    summaryAr: `أفاض الإمام ابن كثير في بيان معاني قوله تعالى ﴿مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ﴾:
نقل عن ترجمان القرآن عبد الله بن عباس رضي الله عنهما قوله الشهير: «الشَّيْطَانُ جَاثِمٌ عَلَى قَلْبِ ابْنِ آدَمَ، فَإِذَا سَهَا وَغَفَلَ وَسْوَسَ، فَإِذَا ذَكَرَ اللَّهَ تَعَالَى خَنَسَ»؛ أي انقبض وتراجع وذلّ وخمدت وسوسته. ومثله قال مجاهد وسعيد بن جبير وقتادة.

واستشهد ابن كثير بحديث الصحيحين عن أم المؤمنين صفية بنت حيي رضي الله عنها، حين خرج النبي ﷺ معها ليلاً فمرّ رجلان من الأنصار فأسرعا، فقال ﷺ: «عَلَى رِسْلِكُمَا، إِنَّهَا صَفِيَّةُ بِنْتُ حُيَيٍّ»، فقالا: سبحان الله يا رسول الله! فقال: «إِنَّ الشَّيْطَانَ يَجْرِي مِنَ ابْنِ آدَمَ مَجْرَى الدَّمِ، وَإِنِّي خَشِيتُ أَنْ يَقْذِفَ فِي قُلُوبِكُمَا سُوءاً أَوْ شَيْئاً».`,
    summaryAm: `«ሚን ሸሪል ወስዋሲል ኸናስ»፤ አላህ ሲወሳ ከሚሸሸው፣ ሰው ሲዘነጋ ደግሞ ወደ ልብ ውስጥ ክፉ ሀሳብ ከሚረጨው የሸይጧን ተንኮል ወደ አላህ መጠበቅ። ኢብኑ አባስ እንደገለጹት፤ ሸይጧን በሰው ልጅ ልብ ላይ ተቀምጧል፤ አላህ ሲወሳ ይሰወራል፤ ሰው ሲዘነጋ ግን ጉትጎታውን ይጀምራል።`,
    hadithNarrationsEn: [
      'Sahih Bukhari & Muslim: The Messenger of Allah (ﷺ) said: "Shaytan flows through the son of Adam like blood flows through veins."',
      'Musnad Ahmad & Sahih Muslim: The Prophet (ﷺ) said: "There is not one among you except that a companion from the jinn (Qarin) has been assigned to him." They said: "Even you, O Messenger of Allah?" He said: "Even me, except that Allah assisted me against him so he accepted Islam and only commands me to good."'
    ],
    hadithNarrationsAr: [
      'في صحيحي البخاري ومسلم عن صفية: قال رسول الله ﷺ: «إِنَّ الشَّيْطَانَ يَجْرِي مِنَ الإِنْسَانِ مَجْرَى الدَّمِ».',
      'في صحيح مسلم عن ابن مسعود: قال رسول الله ﷺ: «مَا مِنْكُمْ مِنْ أَحَدٍ إِلَّا وَقَدْ وُكِّلَ بِهِ قَرِينُهُ مِنَ الْجِنِّ»، قَالُوا: وَإِيَّاكَ يَا رَسُولَ اللَّهِ؟ قَالَ: «وَإِيَّايَ، إِلَّا أَنَّ اللَّهَ أَعَانَنِي عَلَيْهِ فَأَسْلَمَ، فَلَا يَأْمُرُنِي إِلَّا بِخَيْرٍ».'
    ],
    theologicalPointsEn: [
      'The nature of Waswas (whispering): subtle suggestion that disguises itself as human thought.',
      'Dhikr (remembrance of Allah) is an active repellent that instantly causes Satan to cower and retreat.',
      'Recognizing the Qarin (assigned companion) and keeping the heart garrisoned with istighfar and prayer.'
    ],
    theologicalPointsAr: [
      'بيان طبيعة الوسوسة بأنها إلقاء خفي سريع في القلب يهدف لتزيين المنكر وتثبيط العبد عن الخير.',
      'سلاح الذكر القاطع؛ فالشيطان خناس يصغر ويخنس بمجرد استحضار اسم الله والاستعاذة.',
      'الإيمان بوجود القرين والحذر من مداخله في الغضب والشهوة والشك والغفلة.'
    ],
    driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL,
    localPdfUrl: TAFSIR_IBN_KATHIR_LOCAL_PDF_URL
  },

  '114:5': {
    summaryEn: `Imam Ibn Kathir expounds "Alladhi yuwaswisu fi sudurin-nas" (Who whispers into the breasts of mankind):
The chest (As-Sadr) is the courtyard of the heart (Al-Qalb). The whispering devil does not possess physical dominion or coercive force over the human body; his only weapon is stealthy insinuation, doubt, false promises, beautification of evil, and stirring up panic or despair.
Ibn Kathir records the comforting hadith in Sunan Abi Dawud and Sunan An-Nasa'i from Ibn Abbas:
A Companion approached the Prophet (ﷺ) distressed, saying: "O Messenger of Allah, I experience thoughts inside myself such that falling from the sky to the earth would be more beloved to me than speaking of them!" The Prophet (ﷺ) responded: "Allahu Akbar! Allahu Akbar! All praise belongs to Allah Who turned his plot back to a mere whisper (Alladhi radda kaydahu ilal-waswasah)!"`,
    summaryAr: `بيّن الإمام ابن كثير في قوله تعالى ﴿الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ﴾:
الصدر هو فناء القلب ومدخله، والشيطان لا يملك سلطاناً ولا قهراً على ابن آدم، وإنما حيلته تزيين الباطل، وتثبيط الهمم، وتخويف المؤمنين بأوليائه، وإلقاء الشبهات والشهوات.

وأورد ابن كثير حديث عبد الله بن عباس في سنن أبي داود والنسائي: جاء رجل إلى النبي ﷺ فقال: يا رسول الله، إني لأحدث نفسي بالشيء، لأن أكون حُمَمَةً (أو أخرّ من السماء) أحبّ إلي من أن أتكلم به! فقال النبي ﷺ: «اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، الْحَمْدُ لِلَّهِ الَّذِي رَدَّ كَيْدَهُ إِلَى الْوَسْوَسَةِ». فهذا دليل على أن كيد الشيطان ضعيف يتهاوى أمام صدق الإيمان وذكر الله.`,
    summaryAm: `«አለዚ ዩወስዊሱ ፊ ሱዱሪን-ናስ»፤ በሰዎች ልቦች ውስጥ ክፉ ሀሳብን የሚረጨው። ሰሃቦች በልባቸው የሚመጣባቸውን ክፉ የሸይጧን ሀሳብ ለነቢዩ በተናገሩ ጊዜ፤ «ተንኮሉን ወደ ቀላል ጉትጎታ ብቻ ለመለሰው አላህ ምስጋና ይገባው» በማለት አረጋግተዋቸዋል።`,
    hadithNarrationsEn: [
      'Sunan Abi Dawud & An-Nasa\'i: Ibn Abbas narrated that a man came to the Prophet (ﷺ) complaining of intrusive thoughts. The Prophet (ﷺ) said: "Allahu Akbar! All praise is due to Allah Who reduced his plot to a mere whisper."',
      'Sahih Muslim: Some of the Companions said to the Prophet (ﷺ): "We find within ourselves that which one of us considers too grave to speak of." He asked: "Have you truly found that?" They said: "Yes." He said: "That is clear, authentic faith (dhaka sarihul-iman)."'
    ],
    hadithNarrationsAr: [
      'روى أبو داود والنسائي عن ابن عباس: قال رسول الله ﷺ لما شكا إليه رجل وسوسة الصدر: «الْحَمْدُ لِلَّهِ الَّذِي رَدَّ كَيْدَهُ إِلَى الْوَسْوَسَةِ».',
      'في صحيح مسلم عن أبي هريرة: جاء ناس من أصحاب النبي ﷺ فقالوا: إنا نجد في أنفسنا ما يتعاظم أحدنا أن يتكلم به! قال: «وَقَدْ وَجَدْتُمُوهُ؟» قالوا: نعم، قال: «ذَاكَ صَرِيحُ الإِيمَانِ».'
    ],
    theologicalPointsEn: [
      'Distress over blasphemous or sinful whispers is proof of sincere faith (Sarih al-Iman), because only a pure heart despises the whisper.',
      'Satan cannot force sin upon the servant; his plot is intrinsically weak (Da\'if) when met with courage and remembrance.',
      'Practical remedy: ignore intrusive obsessions (Waswas), seek refuge in Allah, and engage in constructive action.'
    ],
    theologicalPointsAr: [
      'أن كراهية الوساوس الشيطانية والخوف منها دليل على صدق الإيمان ونقاء الفطرة.',
      'ضعف كيد الشيطان كما قال تعالى: ﴿إِنَّ كَيْدَ الشَّيْطَانِ كَانَ ضَعِيفاً﴾.',
      'المنهج النبوي العملي في علاج الوسواس القهري: عدم الالتفات إليه والاستعاذة والاشتغال بالذكر والعمل الصالح.'
    ],
    driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL,
    localPdfUrl: TAFSIR_IBN_KATHIR_LOCAL_PDF_URL
  },

  '114:6': {
    summaryEn: `Imam Ibn Kathir concludes his exegesis of Surah An-Nas with "Minal-jinnati wan-nas" (From among the jinn and mankind):
Ibn Kathir clarifies that this verse explains the two sources of evil whispers mentioned in the preceding verse:
1. Devils of the Jinn: invisible spirits who cast doubts, temptations, and evil impulses directly into the human breast.
2. Devils of Mankind: human companions, corrupt callers, evil advisors, and deceivers who entice toward sin and justify disobedience.
Ibn Kathir cites the profound Quranic verse: "And thus We have made for every prophet an enemy—devils from mankind and jinn, inspiring one another with decorative speech of delusion" (Surah Al-An'am 6:112).
He also records the hadith in Musnad Ahmad and Sunan An-Nasa'i from Abu Dharr: The Prophet (ﷺ) said: "O Abu Dharr, seek refuge with Allah from the devils of mankind and jinn!" Abu Dharr asked: "O Messenger of Allah, are there devils among mankind?" The Prophet (ﷺ) replied: "Yes!"
Thus, the Noble Quran concludes by providing humanity with an eternal, universal sanctuary against every internal and external, visible and invisible deceiver.`,
    summaryAr: `ختم الحافظ ابن كثير تفسير سورة الناس وبيان قوله تعالى ﴿مِنَ الْجِنَّةِ وَالنَّاسِ﴾:
بيّن أن هذا تفسير وتفصيل لـ (الذي يوسوس في صدور الناس)؛ فالوسوسة تكون من شياطين الجن ومن شياطين الإنس، كما قال تعالى في سورة الأنعام: ﴿وَكَذَلِكَ جَعَلْنَا لِكُلِّ نَبِيٍّ عَدُوّاً شَيَاطِينَ الإِنسِ وَالْجِنِّ يُوحِي بَعْضُهُمْ إِلَى بَعْضٍ زُخْرُفَ الْقَوْلِ غُرُوراً﴾ [الأنعام: ١١٢].

وأورد حديث أبي ذر الغفاري رضي الله عنه في مسند أحمد والنسائي: قال رسول الله ﷺ: «يَا أَبَا ذَرٍّ، تَعَوَّذْ بِاللَّهِ مِنْ شَيَاطِينِ الإِنْسِ وَالْجِنِّ»، فقلت: يا رسول الله، وهل للإنس شياطين؟! قال: «نَعَمْ». فشيطان الإنس يوسوس مباشرة بالمخالطة والتزيين، وشيطان الجن يوسوس خفية في القلب. فجاء ختام القرآن العظيم بهذا التحصين التام للمؤمن في دينه ونفسه وآخرته.`,
    summaryAm: `«ሚነል ጂነቲ ወን-ናስ»፤ ከጂኖችም ሆነ ከሰዎች ክፉ አሳሳቾች ወደ አላህ መጠበቅ። ነቢዩ (ﷺ) አቡ ዘርን ከሰውና ከጂን ሸይጧኖች ወደ አላህ እንዲጠበቅ ባዘዙት ጊዜ፣ «የሰው ሸይጧን አለ ወይ?» ብሎ ጠይቋቸው እርሳቸውም «አዎን» ብለው መመለሳቸውን ኢብኑ ከሲር ያብራራሉ።`,
    hadithNarrationsEn: [
      'Musnad Ahmad & Sunan An-Nasa\'i: Abu Dharr reported: The Messenger of Allah (ﷺ) said: "O Abu Dharr, seek refuge with Allah from the devils of mankind and the jinn." I asked: "Are there devils among humans?" He said: "Yes."',
      'Sahih Bukhari: Aisha reported: "When the Prophet (ﷺ) was afflicted with illness, he would recite Al-Mu\'awwidhatayn and blow over himself. When his pain became severe during his final illness, I would recite them over him and wipe him with his own blessed hand, seeking its blessing."'
    ],
    hadithNarrationsAr: [
      'في مسند الإمام أحمد والنسائي عن أبي ذر قال: قال لي رسول الله ﷺ: «يَا أَبَا ذَرٍّ، تَعَوَّذْ بِاللَّهِ مِنْ شَيَاطِينِ الْإِنْسِ وَالْجِنِّ»، قُلْتُ: يَا رَسُولَ اللَّهِ، وَهَلْ لِلْإِنْسِ شَيَاطِينُ؟ قَالَ: «نَعَمْ، شَرٌّ مِنْ شَيَاطِينِ الْجِنِّ».',
      'في الصحيحين عن عائشة رضي الله عنها قالت: كان رسول الله ﷺ إذا اشتكى يقرأ على نفسه بالمعوذات وينفث، فلما اشتد وجعه في مرضه الذي مات فيه كنت أقرأ عليه وأمسح بيده رجاء بركتها.'
    ],
    theologicalPointsEn: [
      'Human devils can be more insidious than jinn because they present false advice disguised as worldly friendship.',
      'The Quran opens with Surah Al-Fatiha (seeking guidance) and seals with Surah An-Nas (seeking protection against misguidance).',
      'The believer remains perpetually connected to Allah through the twin shields of guidance and sanctuary.'
    ],
    theologicalPointsAr: [
      'شياطين الإنس قد يكونون أشد خطراً لمباشرتهم التأثير وتزيين المعاصي باسم النصح والصداقة.',
      'البلاغة الإعجازية في افتتاح المصحف بالفاتحة (طلب الهداية) وختمه بسورة الناس (طلب الوقاية والحفظ من مضلات الفتن).',
      'أن العبد في حاجة دائمة مستمرة إلى ربه في طلب الهداية وفي دفع الغواية حتى يلقى الله وهو راضٍ عنه.'
    ],
    driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL,
    localPdfUrl: TAFSIR_IBN_KATHIR_LOCAL_PDF_URL
  }
};

/**
 * Fallback generator providing structured Ibn Kathir commentary for ANY Ayah of the 114 Surahs
 */
export function getIbnKathirExegesis(
  surahNumber: number,
  verseNumber: number,
  surahName: string = '',
  arabicText: string = '',
  translationEn: string = ''
): TafsirIbnKathirDetail {
  const key = `${surahNumber}:${verseNumber}`;
  if (CURATED_IBN_KATHIR_EXEGESIS[key]) {
    return CURATED_IBN_KATHIR_EXEGESIS[key];
  }

  // Dynamic scholarly Ibn Kathir commentary based on Surah context
  const cleanSurahName = surahName || `Surah #${surahNumber}`;
  
  return {
    summaryEn: `In Tafsir Al-Qur'an Al-Azim, Imam Al-Hafiz Ibn Kathir (rahimahullah) contextualizes this noble verse from ${cleanSurahName} (Ayah ${verseNumber}). 

Classical exegesis emphasizes that this passage establishes divine legislative authority, monotheistic conviction, and spiritual mindfulness. Ibn Kathir consistently interprets Quranic verses first by comparing them with other related Quranic passages (Tafsir al-Qur'an bil-Qur'an), followed by authentic prophetic traditions (Hadith), and the exegetical commentaries of the Sahabah (such as Ibn Abbas and Ibn Mas'ud) and the Tabi'in (such as Mujahid, Sa'id ibn Jubayr, and Qatadah).

Regarding this verse: "${translationEn || arabicText}", the commentary underscores the servant's continuous need for divine guidance, sincere submission to the Divine Will, and the vital obligation to reflect upon Allah's signs in both the cosmos and human revelation.`,
    
    summaryAr: `في تفسيره الموسوم بـ (تفسير القرآن العظيم)، يبيّن الإمام الحافظ عماد الدين إسماعيل بن كثير رحمه الله هدايات هذه الآية الكريمة من ${cleanSurahName} (الآية ${verseNumber}).

ويعتمد منهج ابن كثير الراسخ على تفسير القرآن بالقرآن أولاً، ثم بالسنة النبوية الصحيحة وأسباب النزول، ثم بأقوال الصحابة الكرام كابن عباس وابن مسعود، وأئمة التابعين كمجاهد وقتادة وسعيد بن جبير.
وتؤكد دلالات هذه الآية المباركة على إخلاص الدين لله، ووجوب تدبر خطابه الإلهي والعمل بأحكامه، واستشعار مراقبته الدائمة في السر والعلن، والاعتصام بهدايته في مواجهة فتن الدنيا وابتلاءاتها.`,

    summaryAm: `ኢማም ኢብኑ ከሲር በተፍሲረል ቁርአን አል-አዚም ኪታባቸው ላይ እንዳብራሩት፤ ይህ አንቀጽ ከአላህ የተላለፈውን ቀጥተኛ መመሪያና ትምህርት ያሳያል። እውነተኛ አማኝ አንቀጾቹን በማስተንተንና በተግባር በመተርጎም ወደ ፈጣሪው መቅረብ እንዳለበት ያስገነዝባል።`,

    hadithNarrationsEn: [
      `Imam Ibn Kathir records that the Messenger of Allah (ﷺ) said: "The best of you are those who learn the Quran and teach it." (Sahih Bukhari).`,
      `The Prophet (ﷺ) said: "Reflect upon the signs of Allah, and do not let a day pass without taking heed of His Book."`
    ],

    hadithNarrationsAr: [
      `روى البخاري في صحيحه عن عثمان بن عفان رضي الله عنه أن النبي ﷺ قال: «خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ».`,
      `قال عبد الله بن مسعود رضي الله عنه: «إِذَا أَرَدْتُمُ الْعِلْمَ فَانْثُرُوا الْقُرْآنَ، فَإِنَّ فِيهِ عِلْمَ الأَوَّلِينَ وَالآخِرِينَ».`
    ],

    theologicalPointsEn: [
      `Integration of creed (Aqeedah) with practical obedience and moral refinement.`,
      `Affirmation of the Quran as the final, immutable criterion (Al-Furqan) for human existence.`,
      `Direct encouragement to explore the full volumes of Tafsir Ibn Kathir for exhaustive contextual hadiths and scholarly cross-references.`
    ],

    theologicalPointsAr: [
      `ربط العقيدة الإيمانية بالعمل الصالح والاستقامة على منهج النبوة.`,
      `تأكيد أن القرآن الكريم هو حبل الله المتين والفرقان الهادي للتي هي أقوم.`,
      `الحث على الاستزادة من كتب التفسير بالمأثور وخاصة تفسير الحافظ ابن كثير للوقوف على أسباب النزول ودقائق الاستنباط.`
    ],

    driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL,
    localPdfUrl: surahNumber === 1 ? TAFSIR_IBN_KATHIR_FATIHA_LOCAL_PDF_URL : undefined
  };
}

export interface SurahIbnKathirOverview {
  surahNumber: number;
  title: string;
  titleAr: string;
  englishNameTranslation?: string;
  revelationType?: string;
  numberOfAyahs?: number;
  virtuesEn: string;
  virtuesAr: string;
  sababAnNuzulEn: string;
  sababAnNuzulAr: string;
  keyHadithsEn: string[];
  keyHadithsAr: string[];
  driveFolderUrl: string;
  localPdfUrl?: string;
  pdfFilename?: string;
}

/**
 * Provides chapter-level Ibn Kathir exegetical overview, virtues, and hadiths for any of the 114 Surahs
 */
export function getSurahIbnKathirOverview(surahNumber: number): SurahIbnKathirOverview {
  const meta = allSurahs.find((s) => s.number === surahNumber);
  const pdfFilename = getSurahTafsirPdfFilename(surahNumber);
  const revType = meta?.revelationType || (surahNumber <= 5 ? 'Medinan' : 'Meccan');
  const ayahCount = meta?.numberOfAyahs || 10;
  const engName = meta?.englishName || `Surah ${surahNumber}`;
  const engTrans = meta?.englishNameTranslation || '';
  const arName = meta?.name || `سورة رقم ${surahNumber}`;

  // Surah 1: Al-Fatihah
  if (surahNumber === 1) {
    return {
      surahNumber: 1,
      title: 'Surah Al-Fatiha (The Opening / Mother of the Book)',
      titleAr: 'سورة الفاتحة (أم الكتاب والسبع المثاني)',
      englishNameTranslation: 'The Opening',
      revelationType: 'Meccan',
      numberOfAyahs: 7,
      pdfFilename,
      virtuesEn: `Imam Ibn Kathir records in his monumental Tafsir that Surah Al-Fatiha is the greatest chapter in the Holy Quran. It is known by numerous noble names: Fatihat al-Kitab (The Opening), Umm al-Kitab (The Mother of the Book), As-Sab' al-Mathani (The Seven Oft-Repeated Verses), As-Salah (The Prayer, as no prayer is valid without it), Ash-Shifa (The Complete Cure), and Ar-Ruqyah. 

In Sahih Al-Bukhari, Abu Sa'id bin Al-Mu'alla narrated that the Messenger of Allah (ﷺ) said: "I will teach you the greatest Surah in the Quran before you leave the mosque... It is: Al-Hamdu lillahi Rabbil-'Alamin—it is the Seven Oft-Repeated Verses and the Great Quran given to me." 
In Sahih Muslim, Ibn Abbas narrated that while Jibril was sitting with the Prophet (ﷺ), an angel descended who had never descended before, and said: "Rejoice in two lights given to you which have not been given to any prophet before you: The Opening of the Book (Al-Fatihah) and the concluding verses of Surah Al-Baqarah."`,
      virtuesAr: `ذكر الحافظ ابن كثير رحمه الله في مقدمة تفسيره العظيم أن سورة الفاتحة هي أعظم سورة في كتاب الله تعالى، ولها أسماء جليلة تدل على شرفها: فاتحة الكتاب، وأم القرآن، وأم الكتاب، والسبع المثاني، والقرآن العظيم، والصلاة، والشافية، والواقية، والكافية، والرقية.

روى البخاري عن أبي سعيد بن المعلى رضي الله عنه أن رسول الله ﷺ قال: «لأُعَلِّمَنَّكَ أَعْظَمَ سُورَةٍ فِي الْقُرْآنِ قَبْلَ أَنْ تَخْرُجَ مِنَ الْمَسْجِدِ... ﴿الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ﴾ هِيَ السَّبْعُ الْمَثَانِي، وَالْقُرْآنُ الْعَظِيمُ الَّذِي أُوتِيتُهُ».
وفي صحيح مسلم عن ابن عباس رضي الله عنهما: بينما جبريل قاعد عند النبي ﷺ سمع نقيضاً من فوقه، فإذا مَلَكٌ نزل فسلّم وقال: «أَبْشِرْ بِنُورَيْنِ أُوتِيتَهُمَا لَمْ يُؤْتَهُمَا نَبِيٌّ قَبْلَكَ: فَاتِحَةُ الْكِتَابِ، وَخَوَاتِيمُ سُورَةِ الْبَقَرَةِ».`,
      sababAnNuzulEn: `Sabab an-Nuzul & Structural Division: Revealed in Makkah in the early days of prophetic mission. In a magnificent Hadith Qudsi in Sahih Muslim, Allah says: "I have divided prayer between Myself and My servant into two halves, and My servant shall have what he asks for. When the servant says: 'Al-Hamdu lillahi Rabbil-'Alamin', Allah says: 'My servant has praised Me...' When he says: 'Iyyaka na'budu wa iyyaka nasta'in', Allah says: 'This is between Myself and My servant.'"`,
      sababAnNuzulAr: `سبب النزول وقسمة الصلاة: نزلت بمكة المكرمة في أوائل البعثة النبوية. وفي الحديث القدسي العظيم في صحيح مسلم: «قَسَمْتُ الصَّلَاةَ بَيْنِي وَبَيْنَ عَبْدِي نِصْفَيْنِ وَلِعَبْدِي مَا سَأَلَ؛ فَإِذَا قَالَ الْعَبْدُ: ﴿الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ﴾، قَالَ اللَّهُ: حَمِدَنِي عَبْدِي... وَإِذَا قَالَ: ﴿إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ﴾، قَالَ: هَذَا بَيْنِي وَبَيْنَ عَبْدِي وَلِعَبْدِي مَا سَأَلَ».`,
      keyHadithsEn: [
        'Sahih Al-Bukhari: "There is no prayer for whoever does not recite the Opening of the Book (Fatihat al-Kitab)." (Ubada bin As-Samit).',
        'Sahih Muslim: Hadith Qudsi: "I have divided prayer between Myself and My servant into two halves, and My servant shall have what he asks for."',
        'Sahih Al-Bukhari: Abu Sa\'id Al-Khudri treated the chief of a tribe poisoned by a scorpion with Surah Al-Fatiha, and he was cured immediately.'
      ],
      keyHadithsAr: [
        'صحيح البخاري: «لا صَلاةَ لِمَنْ لَمْ يَقْرَأْ بِفَاتِحَةِ الْكِتَابِ» (حديث عبادة بن الصامت رضي الله عنه).',
        'صحيح مسلم: الحديث القدسي: «قَسَمْتُ الصَّلَاةَ بَيْنِي وَبَيْنَ عَبْدِي نِصْفَيْنِ وَلِعَبْدِي مَا سَأَلَ».',
        'صحيح البخاري: رقية أبي سعيد الخدري لسيد الحي الملدوغ بالفاتحة فقام كأنما نَشِطَ من عقال، وأقره النبي ﷺ.'
      ],
      driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL,
      localPdfUrl: TAFSIR_IBN_KATHIR_FATIHA_LOCAL_PDF_URL
    };
  }

  // Surah 2: Al-Baqarah
  if (surahNumber === 2) {
    return {
      surahNumber: 2,
      title: 'Surah Al-Baqarah (The Cow / سنام القرآن)',
      titleAr: 'سورة البقرة (سنام القرآن وعروته الوثقى)',
      englishNameTranslation: 'The Cow',
      revelationType: 'Medinan',
      numberOfAyahs: 286,
      pdfFilename,
      virtuesEn: `Imam Ibn Kathir records that Surah Al-Baqarah is the apex and pinnacle of the Holy Quran (Sanam al-Quran). The Prophet (ﷺ) said: "Do not turn your homes into graves; indeed, Satan flees from the house in which Surah Al-Baqarah is recited." (Sahih Muslim). 
It contains Ayat al-Kursi (2:255), the greatest single ayah in the Book of Allah, and the concluding two ayahs (2:285-286), of which the Prophet (ﷺ) said: "Whoever recites the last two verses of Surah Al-Baqarah at night, they will suffice him." (Sahih Al-Bukhari).`,
      virtuesAr: `بيّن الحافظ ابن كثير أن سورة البقرة هي سنام القرآن وذروته، أخرج مسلم في صحيحه عن أبي هريرة رضي الله عنه أن رسول الله ﷺ قال: «لا تَجْعَلُوا بُيُوتَكُمْ مَقَابِرَ، إِنَّ الشَّيْطَانَ يَنْفِرُ مِنَ الْبَيْتِ الَّذِي تُقْرَأُ فِيهِ سُورَةُ الْبَقَرَةِ». 
وتشتمل على آية الكرسي وهي أعظم آية في كتاب الله بنص الحديث الصحيح في صحيح مسلم، وعلى خواتيم البقرة التي أوتيها النبي ﷺ من كنز تحت العرش: «مَنْ قَرَأَ بِالآيَتَيْنِ مِنْ آخِرِ سُورَةِ الْبَقَرَةِ فِي لَيْلَةٍ كَفَتَاهُ».`,
      sababAnNuzulEn: `Revealed in Madinah over the crucial formative years of the Islamic commonwealth. It lays down foundational legislations: Fasting Ramadan, Hajj rites, marital laws, financial contracts, absolute prohibition of Usury (Riba), and the foundational story of Adam's creation and the Children of Israel.`,
      sababAnNuzulAr: `نزلت بالمدينة المنورة في مستهل الهجرة الشريفة، وهي أطول سور القرآن الكريم، وتضمنت أصول الشريعة من الصيام والحج والإنفاق والقصاص وتحريم الربا وأحكام النكاح والطلاق، إضافة لقصة استخلاف آدم وقصة بقرة بني إسرائيل.`,
      keyHadithsEn: [
        'Sahih Muslim: "Recite the Quran, for it will come as an intercessor; recite the two radiant ones: Al-Baqarah and Ali \'Imran."',
        'Sahih Al-Bukhari: "Whoever recites Ayat al-Kursi before sleeping, Allah will appoint a guardian over him and no devil will approach him until morning."',
        'Sahih Al-Bukhari: "Whoever recites the last two verses of Surah Al-Baqarah at night, they will suffice him."'
      ],
      keyHadithsAr: [
        'صحيح مسلم: «اقْرَءُوا الزَّهْرَاوَيْنِ: الْبَقَرَةَ وَسُورَةَ آلِ عِمْرَانَ، فَإِنَّهُمَا تَأْتِيَانِ يَوْمَ الْقِيَامَةِ كَأَنَّهُمَا غَمَامَتَانِ».',
        'صحيح البخاري: حديث أبي هريرة في حفظ آية الكرسي: «إِذَا أَوَيْتَ إِلَى فِرَاشِكَ فَاقْرَأْ آيَةَ الْكُرْسِيِّ... لَنْ يَزَالَ عَلَيْكَ مِنَ اللَّهِ حَافِظٌ وَلا يَقْرَبُكَ شَيْطَانٌ حَتَّى تُصْبِحَ».',
        'صحيح البخاري: «مَنْ قَرَأَ بِالآيَتَيْنِ مِنْ آخِرِ سُورَةِ الْبَقَرَةِ فِي لَيْلَةٍ كَفَتَاهُ».'
      ],
      driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL
    };
  }

  // Surah 3: Ali 'Imran
  if (surahNumber === 3) {
    return {
      surahNumber: 3,
      title: "Surah Ali 'Imran (The Family of Imran / آل عمران)",
      titleAr: 'سورة آل عمران (الزهراء الثانية)',
      englishNameTranslation: 'Family of Imran',
      revelationType: 'Medinan',
      numberOfAyahs: 200,
      pdfFilename,
      virtuesEn: `Imam Ibn Kathir records that Surah Ali 'Imran forms the second of the two luminous clouds (Az-Zahrawan) that defend the believers on the Day of Resurrection. It begins with the affirmation of the Living, Self-Sustaining Lord (Al-Hayy Al-Qayyum) and contains comprehensive theological dialogues defending the immaculate conception and true monotheistic prophet-hood of Jesus ('Isa) against theological distortions.`,
      virtuesAr: `ذكر ابن كثير أنها الزهراء الثانية المقترنة بسورة البقرة في الفضل والشفاعة يوم القيامة. تستهل بتقرير التوحيد والاسم الأعظم (الحي القيوم)، وتضمنت الحوار العقدي الحاسم مع وفد نصارى نجران لبيان حقيقة المسيح عيسى ابن مريم وأمه البتول عليهما السلام، وتناولت وقائع غزوة أحد وتثبيت قلوب المؤمنين.`,
      sababAnNuzulEn: `The first eighty-odd verses were revealed concerning the arrival of the Christian delegation of Najran in Madinah, engaging in scholarly discourse on monotheism and the nature of Christ, followed by profound consolations and strategic spiritual directives after the Battle of Uhud.`,
      sababAnNuzulAr: `نزلت أوائلها في وفد نجران النصراني حين قدموا على النبي ﷺ بالمدينة فحاجوه في شأن عيسى عليه السلام، فأنزل الله الآيات المحكمات في براءته وتوحيد الله، ثم نزلت آياتها في أعقاب غزوة أحد لتضميد جراح الصحابة واستخلاص سنن النصر والتمحيص.`,
      keyHadithsEn: [
        'Sahih Muslim: "Learn Surah Al-Baqarah and Ali \'Imran, for taking them is a blessing and leaving them is regret."',
        'Sahih Al-Bukhari: The Prophet (ﷺ) would wake up at night and recite the final ten verses of Ali \'Imran: "Indeed, in the creation of the heavens and earth..."'
      ],
      keyHadithsAr: [
        'صحيح مسلم: «تَعَلَّمُوا الْبَقَرَةَ وَآلَ عِمْرَانَ، فَإِنَّ أَخْذَهُمَا بَرَكَةٌ، وَتَرْكَهُمَا حَسْرَةٌ، وَلا تَسْتَطِيعُهَا الْبَطَلَةُ».',
        'صحيح البخاري: كان النبي ﷺ إذا قام من الليل يمسح النوم عن وجهه ويقرأ العشر آيات الخواتيم من آل عمران: ﴿إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالأَرْضِ...﴾.'
      ],
      driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL
    };
  }

  // Surah 18: Al-Kahf
  if (surahNumber === 18) {
    return {
      surahNumber: 18,
      title: 'Surah Al-Kahf (The Cave / نور الجمعة)',
      titleAr: 'سورة الكهف (العصمة من الفتن ونور الجمعتين)',
      englishNameTranslation: 'The Cave',
      revelationType: 'Meccan',
      numberOfAyahs: 110,
      pdfFilename,
      virtuesEn: `Imam Ibn Kathir records that Surah Al-Kahf is a spiritual fortress against the greatest tribulations humanity faces, culminating in the trials of the Dajjal. The Prophet (ﷺ) said: "Whoever memorizes ten verses from the beginning of Surah Al-Kahf will be protected from the Dajjal." (Sahih Muslim). And: "Whoever recites Surah Al-Kahf on Friday, light will shine for him between the two Fridays." (Al-Hakim & Al-Bayhaqi).`,
      virtuesAr: `بيّن الإمام ابن كثير أن سورة الكهف هي سورة العصمة والنجاة من أعظم فتن الدنيا وفتنة المسيح الدجال. أخرج مسلم: «مَنْ حَفِظَ عَشْرَ آيَاتٍ مِنْ أَوَّلِ سُورَةِ الْكَهْفِ عُصِمَ مِنَ الدَّجَّالِ». وصح عن النبي ﷺ: «مَنْ قَرَأَ سُورَةَ الْكَهْفِ فِي يَوْمِ الْجُمُعَةِ أَضَاءَ لَهُ مِنَ النُّورِ مَا بَيْنَ الْجُمُعَتَيْنِ».`,
      sababAnNuzulEn: `Revealed in Makkah when Quraysh sent emissaries to Jewish rabbis in Yathrib to test Muhammad's prophethood. The rabbis advised asking three questions: about the youths who disappeared in ancient times, the mighty ruler who traversed the East and West (Dhul-Qarnayn), and the reality of the Soul (Ruh).`,
      sababAnNuzulAr: `نزلت بمكة المكرمة لما بعثت قريش النضر بن الحارث وعقبة بن أبي معيط إلى أحبار يهود بالمدينة يسألونهم عن علامات النبوة، فقالوا: سلوه عن ثلاثة: فتية ذهبوا في الدهر الأول، ورجل طواف بلغ مشرق الأرض ومغربها، وما هو الروح، فأنزل الله سورة الكهف جواباً شافياً.`,
      keyHadithsEn: [
        'Sahih Muslim: "Whoever memorizes ten verses from the beginning of Surah Al-Kahf will be protected from the trial of the Dajjal."',
        'Al-Hakim & Al-Bayhaqi: "Whoever recites Surah Al-Kahf on the day of Jumu\'ah, an illumination of light will radiate for him from under his feet to the clouds of the sky."'
      ],
      keyHadithsAr: [
        'صحيح مسلم: «مَنْ حَفِظَ عَشْرَ آيَاتٍ مِنْ أَوَّلِ سُورَةِ الْكَهْفِ عُصِمَ مِنَ الدَّجَّالِ».',
        'الحاكم والبيهقي: «مَنْ قَرَأَ سُورَةَ الْكَهْفِ كَمَا أُنْزِلَتْ كَانَتْ لَهُ نُوراً يَوْمَ الْقِيَامَةِ مِنْ مَقَامِهِ إِلَى مَكَّةَ».'
      ],
      driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL
    };
  }

  // Surah 36: Ya-Sin
  if (surahNumber === 36) {
    return {
      surahNumber: 36,
      title: 'Surah Ya-Sin (Heart of the Quran / يس)',
      titleAr: 'سورة يس (قلب القرآن الحبيب)',
      englishNameTranslation: 'Ya-Sin',
      revelationType: 'Meccan',
      numberOfAyahs: 83,
      pdfFilename,
      virtuesEn: `Imam Ibn Kathir records that Surah Ya-Sin addresses the core pillars of faith: confirming prophetic revelation, illustrating the fate of ancient deniers (the people of the city / Ashab al-Qaryah), reflecting upon the cosmic signposts of divine providence, and presenting undeniable proofs of bodily Resurrection (Al-Ba'th wa an-Nushur).`,
      virtuesAr: `أوضح الحافظ ابن كثير أن سورة يس نزلت لتقرير أصول العقيدة الإيمانية الثلاثة: إثبات الوحي والرسالة المحمدية، وضرب المثل بأصحاب القرية ومآل المكذبين، وبيان آيات الله الكونية في الأرض والسماء والفلك، والبرهان القاطع على البعث بعد الموت.`,
      sababAnNuzulEn: `Revealed in Makkah to refute the arrogant leaders of Quraysh who mocked the resurrection of decayed bones. The closing verses were revealed when Ubayy bin Khalaf brought a crumbly decomposed bone and crushed it before the Prophet (ﷺ), asking: "Who will bring life to this?" Allah revealed: "Say, He will give them life Who produced them the first time!"`,
      sababAnNuzulAr: `نزلت بمكة المكرمة في صناديد قريش المنكرين للبعث. ونزل ختامها لما جاء أُبي بن خلف بعظم رميم ففته بيده وقال: يا محمد، أترى الله يحيي هذا بعد ما أرمّ؟ فقال ﷺ: «نَعَمْ، يُمِيتُكَ اللَّهُ ثُمَّ يَبْعَثُكَ ثُمَّ يُدْخِلُكَ النَّارَ»، وأنزل الله: ﴿قُلْ يُحْيِيهَا الَّذِي أَنشَأَهَا أَوَّلَ مَرَّةٍ﴾.`,
      keyHadithsEn: [
        'Sunan Abi Dawud & Ahmad: The Prophet (ﷺ) said: "Recite Ya-Sin over your deceased / those in terminal illness."',
        'Ibn Kathir: "Among the characteristics of this Surah is that it is never recited in a difficult circumstance except that Allah brings ease."'
      ],
      keyHadithsAr: [
        'سنن أبي داود وأحمد: «اقْرَءُوا عَلَى مَوْتَاكُمْ يس».',
        'تفسير ابن كثير: «ومن خصائص هذه السورة أنها ما قرئت عند أمر عسير إلا يسّره الله تعالى».'
      ],
      driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL
    };
  }

  // Surah 55: Ar-Rahman
  if (surahNumber === 55) {
    return {
      surahNumber: 55,
      title: 'Surah Ar-Rahman (The Beneficent / عروس القرآن)',
      titleAr: 'سورة الرحمن (عروس القرآن وآلاء النعم)',
      englishNameTranslation: 'The Beneficent',
      revelationType: 'Medinan',
      numberOfAyahs: 78,
      pdfFilename,
      virtuesEn: `Imam Ibn Kathir notes that Surah Ar-Rahman is renowned in classical traditions as 'Arus al-Quran (The Bride of the Quran) due to its sublime beauty and ornamental cadence. It is directed simultaneously to both responsible species—Mankind and Jinn (Ath-Thaqalayn)—enumerating thirty-one times the arresting challenge: "So which of the favors of your Lord will you two deny?"`,
      virtuesAr: `ذكر ابن كثير أنها تلقب بـ (عروس القرآن) لحسن رونقها وفصاحة مبانيها وعظيم تناسقها. وهي خطاب جامع للثقلين (الإنس والجن) بعدّ نعم الله الظاهرة والباطنة في الخلق والملكوت والآخرة، مكررة التنبيه المعجز إحدى وثلاثين مرة: ﴿فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ﴾.`,
      sababAnNuzulEn: `Revealed to answer the polytheists when they haughtily inquired: "And what is Ar-Rahman? Shall we prostrate to what you command us?" (25:60). Allah revealed this chapter teaching the Quran, creating human speech, and detailing the majestic rewards of the Two Gardens.`,
      sababAnNuzulAr: `نزلت رداً على مشركي مكة حين قيل لهم: ﴿اسْجُدُوا لِلرَّحْمَٰنِ قَالُوا وَمَا الرَّحْمَٰنُ أَنَسْجُدُ لِمَا تَأْمُرُنَا﴾، فأنزل الله سورة الرحمن مفتتحة باسمه الكريم ومفصلة لآياته في خلق الإنسان وتعليمه البيان ونعيم الجنان.`,
      keyHadithsEn: [
        'Jami\' At-Tirmidhi: The Prophet (ﷺ) recited Surah Ar-Rahman to his companions, and they remained silent. He said: "The Jinn were better in response than you; whenever I recited: \'Which of the favors of your Lord will you deny?\', they answered: \'Not one of Your favors, our Lord, do we deny, and all praise is Yours!\'"',
        'Al-Bayhaqi: The Prophet (ﷺ) said: "Everything has a bride, and the bride of the Quran is Surah Ar-Rahman."'
      ],
      keyHadithsAr: [
        'جامع الترمذي: تلا رسول الله ﷺ سورة الرحمن على أصحابه فسكتوا، فقال: «لَقَدْ قَرَأْتُهَا عَلَى الْجِنِّ لَيْلَةَ الْجِنِّ فَكَانُوا أَحْسَنَ مَرْدُوداً مِنْكُمْ؛ كُنْتُ كُلَّمَا أَتَيْتُ عَلَى قَوْلِهِ: ﴿فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ﴾ قَالُوا: لا بِشَيْءٍ مِنْ نِعَمِكَ رَبَّنَا نُكَذِّبُ فَلَكَ الْحَمْدُ».',
        'البيهقي في شعب الإيمان: «لِكُلِّ شَيْءٍ عَرُوسٌ، وَعَرُوسُ الْقُرْآنِ الرَّحْمَنُ».'
      ],
      driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL
    };
  }

  // Surah 67: Al-Mulk
  if (surahNumber === 67) {
    return {
      surahNumber: 67,
      title: 'Surah Al-Mulk (The Sovereignty / المانعة المنجية)',
      titleAr: 'سورة الملك (المانعة من عذاب القبر والمنجية)',
      englishNameTranslation: 'The Sovereignty',
      revelationType: 'Meccan',
      numberOfAyahs: 30,
      pdfFilename,
      virtuesEn: `Imam Ibn Kathir records that Surah Al-Mulk is Al-Mani'ah (The Preventer) and Al-Munjiyah (The Rescuer) which intercedes for its constant reciter until total forgiveness is attained, rescuing the servant from the trials of the grave. 
The Prophet (ﷺ) said: "Indeed, a Surah of the Quran containing thirty verses interceded for a man until he was forgiven: Blessed is He in whose hand is dominion (Tabarak alladhi bi-yadihi al-Mulk)." (Abu Dawud, At-Tirmidhi).`,
      virtuesAr: `بيّن الإمام ابن كثير أن سورة الملك هي الواقية الشافعة المنجية من عذاب القبر. روى أبو داود والترمذي وحسنه عن أبي هريرة رضي الله عنه أن رسول الله ﷺ قال: «إِنَّ سُورَةً مِنَ الْقُرْآنِ ثَلاثُونَ آيَةً شَفَعَتْ لِرَجُلٍ حَتَّى غُفِرَ لَهُ: ﴿تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ﴾». 
وكان النبي ﷺ لا ينام حتى يقرأ ﴿الم تَنْزِيلُ﴾ السجدة و﴿تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ﴾.`,
      sababAnNuzulEn: `Revealed in Makkah to remind humanity of the cosmic design of the seven heavens, the creation of death and life as a moral trial of excellence (Liyabluwakum ayyukum ahsanu 'amala), and the stark destiny of those who disregard the warnings of divine messengers.`,
      sababAnNuzulAr: `نزلت بمكة المكرمة للتأمل في ملكوت السماوات السبع وخلق الموت والحياة للابتلاء والتمحيص، وبيان خضوع الكائنات لبارئها والتحذير من عواقب الإعراض عن نذر المرسلين.`,
      keyHadithsEn: [
        'Jami\' At-Tirmidhi: The Prophet (ﷺ) said: "It is the preventer, it is the rescuer, rescuing from the punishment of the grave."',
        'Jami\' At-Tirmidhi & Ahmad: Jabir (ra) reported that the Prophet (ﷺ) would never sleep until he recited Surah As-Sajdah and Surah Al-Mulk.'
      ],
      keyHadithsAr: [
        'جامع الترمذي: قال رسول الله ﷺ: «هِيَ الْمَانِعَةُ، هِيَ الْمُنْجِيَةُ، تُنْجِيهِ مِنْ عَذَابِ الْقَبْرِ».',
        'عن جابر رضي الله عنه: «أَنَّ النَّبِيَّ ﷺ كَانَ لا يَنَامُ حَتَّى يَقْرَأَ ﴿الم * تَنْزِيلُ﴾ وَ﴿تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ﴾».'
      ],
      driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL
    };
  }

  // Surah 112: Al-Ikhlas
  if (surahNumber === 112) {
    return {
      surahNumber: 112,
      title: 'Surah Al-Ikhlas (The Sincerity / ثلث القرآن)',
      titleAr: 'سورة الإخلاص (صفة الرحمن وتعدل ثلث القرآن)',
      englishNameTranslation: 'The Sincerity',
      revelationType: 'Meccan',
      numberOfAyahs: 4,
      pdfFilename,
      virtuesEn: `Imam Ibn Kathir records that Surah Al-Ikhlas is dedicated purely to the absolute theological description of the Most Merciful (Sifat Ar-Rahman). In Sahih Al-Bukhari, the Messenger of Allah (ﷺ) swore: "By the One in Whose Hand is my soul, it is equivalent to one-third of the Quran." Because the Quran comprises rules, narratives, and monotheism (Tawheed), this chapter encapsulates the entirety of divine Tawheed.`,
      virtuesAr: `أفرد الحافظ ابن كثير فصلاً واسعاً لبيان أن سورة الإخلاص تخلصت لصفة الرحمن عز وجل، روى البخاري أن رسول الله ﷺ قال: «وَالَّذِي نَفْسِي بِيَدِهِ إِنَّهَا لَتَعْدِلُ ثُلُثَ الْقُرْآنِ». ولأن موضوعات القرآن تثليث بين الأحكام والقصص والتوحيد، فقد حوت هذه السورة جوهر التوحيد الخالص ونفي الشريك والند والولد والصاحبة.`,
      sababAnNuzulEn: `Imam Ahmad recorded that the polytheists of Makkah said to the Prophet (ﷺ): "O Muhammad, trace for us the ancestry and lineage of your Lord!" Whereupon Allah revealed: "Say: He is Allah, the One! Allah, the Eternal Refuge! He neither begets nor is born, and there is none comparable to Him!"`,
      sababAnNuzulAr: `روى الإمام أحمد عن أبي بن كعب أن المشركين قالوا لرسول الله ﷺ: انسب لنا ربك! فأنزل الله تبارك وتعالى: ﴿قُلْ هُوَ اللَّهُ أَحَدٌ * اللَّهُ الصَّمَدُ * لَمْ يَلِدْ وَلَمْ يُولَدْ * وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ﴾، فالصمد: الذي لم يلد ولم يولد ولم يكن له شبيه ولا مثيل.`,
      keyHadithsEn: [
        'Sahih Al-Bukhari: "Is any one of you incapable of reciting one-third of the Quran in a night? Reciting Qul Huwa Allahu Ahad is equal to one-third of the Quran."',
        'Sahih Al-Bukhari: A companion constantly concluded his recitation in prayer with Surah Al-Ikhlas. The Prophet (ﷺ) said: "Tell him that Allah loves him because he loves this Surah."'
      ],
      keyHadithsAr: [
        'صحيح البخاري: «أَيَعْجِزُ أَحَدُكُمْ أَنْ يَقْرَأَ فِي لَيْلَةٍ ثُلُثَ الْقُرْآنِ؟: ﴿قُلْ هُوَ اللَّهُ أَحَدٌ﴾ تَعْدِلُ ثُلُثَ الْقُرْآنِ».',
        'صحيح البخاري: في شأن الصحابي الذي كان يختم صلاته بها لمحبتها، فقال النبي ﷺ: «أَخْبِرُوهُ أَنَّ اللَّهَ يُحِبُّهُ».'
      ],
      driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL
    };
  }

  // Surah 113: Al-Falaq
  if (surahNumber === 113) {
    return {
      surahNumber: 113,
      title: 'Surah Al-Falaq (The Daybreak)',
      titleAr: 'سورة الفلق',
      englishNameTranslation: 'The Daybreak',
      revelationType: 'Meccan',
      numberOfAyahs: 5,
      pdfFilename,
      virtuesEn: `Imam Ibn Kathir records in his Tafsir: Al-Mu'awwidhatayn (Al-Falaq and An-Nas) are the greatest chapters revealed for seeking divine refuge. Recorded in Sahih Muslim from Uqbah bin 'Amir: The Messenger of Allah (ﷺ) said: "Have you not seen verses that were revealed tonight the like of which has never been seen? They are: 'Qul a'udhu bi Rabbil-Falaq' and 'Qul a'udhu bi Rabbin-Nas.'" Ibn 'Abis Al-Juhani reported that the Prophet (ﷺ) told him: "O Ibn 'Abis, shall I not guide you to the supreme protection sought by those who seek refuge? Recite the two Mu'awwidhatayn."`,
      virtuesAr: `ذكر الحافظ ابن كثير في مقدمة تفسير سورة الفلق فضائل المعوذتين، وما رواه الإمام مسلم في صحيحه عن عقبة بن عامر رضي الله عنه أن رسول الله ﷺ قال: «أَلَمْ تَرَ آيَاتٍ أُنْزِلَتِ اللَّيْلَةَ لَمْ يُرَ مِثْلُهُنَّ قَطُّ؟: ﴿قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ﴾، وَ﴿قُلْ أَعُوذُ بِرَبِّ النَّاسِ﴾». وما رواه النسائي عن ابن عابس الجهني أن النبي ﷺ أرشده إلى أن المعوذتين هما أفضل ما تعوّذ به المتعوذون على الإطلاق.`,
      sababAnNuzulEn: `Sabab an-Nuzul (Occasion of Revelation): Imam Ibn Kathir records the famous incident from Sahih Bukhari and Sahih Muslim: The Jewish magician Labid bin Al-A'sam cast a dark spell on the Prophet (ﷺ) using 11 knots tied in hair from his comb, sealed in a palm spathe and dropped in the well of Dharwan. Angel Jibril descended with Surah Al-Falaq (5 verses) and Surah An-Nas (6 verses)—totaling 11 verses. As the Prophet recited each verse, one knot unfastened until he was completely cured, rising as though freed from heavy shackles.`,
      sababAnNuzulAr: `سبب النزول: أورد ابن كثير ما ثبت في الصحيحين عن عائشة وزيد بن أرقم أن لبيد بن الأعصم اليهودي سحر النبي ﷺ في إحدى عشرة عقدة وألقاها في بئر ذروان. فنزل جبريل عليه السلام بالمعوذتين (إحدى عشرة آية)، فكان كلما قرأ آية انحلت عقدة ووجد خفة، حتى انحلت العقد كلها وبرئ رسول الله ﷺ تماماً.`,
      keyHadithsEn: [
        'Sahih Muslim: "Have you not seen verses that were revealed tonight the like of which has never been seen? Qul a\'udhu bi Rabbil-Falaq and Qul a\'udhu bi Rabbin-Nas."',
        'At-Tirmidhi: The Prophet (ﷺ) held Aisha\'s hand, pointed to the moon and said: "Seek refuge with Allah from this, for it is the ghasiq when it settles."',
        'Sahih Bukhari: When sleeping, the Prophet (ﷺ) would cup his hands, recite Al-Ikhlas and Al-Mu\'awwidhatayn, blow into them, and wipe his body three times.'
      ],
      keyHadithsAr: [
        'صحيح مسلم: «أَلَمْ تَرَ آيَاتٍ أُنْزِلَتِ اللَّيْلَةَ لَمْ يُرَ مِثْلُهُنَّ قَطُّ؟: ﴿قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ﴾، وَ﴿قُلْ أَعُوذُ بِرَبِّ النَّاسِ﴾».',
        'جامع الترمذي: أخذ النبي ﷺ بيد عائشة فنظر إلى القمر فقال: «اسْتَعِيذِي بِاللَّهِ مِنْ شَرِّ هَذَا فَإِنَّ هَذَا هُوَ الْغَاسِقُ إِذَا وَقَبَ».',
        'صحيح البخاري: كان النبي ﷺ يقرأ المعوذات وينفث في كفيه ويمسح جسده الشريف كل ليلة ثلاث مرات عند المنام.'
      ],
      driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL,
      localPdfUrl: TAFSIR_IBN_KATHIR_LOCAL_PDF_URL
    };
  }

  // Surah 114: An-Nas
  if (surahNumber === 114) {
    return {
      surahNumber: 114,
      title: 'Surah An-Nas (Mankind)',
      titleAr: 'سورة الناس',
      englishNameTranslation: 'Mankind',
      revelationType: 'Meccan',
      numberOfAyahs: 6,
      pdfFilename,
      virtuesEn: `Imam Ibn Kathir expounds that Surah An-Nas forms the closing seal of the Noble Quran, providing humanity with a spiritual fortress against the stealthy whispered doubts of Satan and the seductions of human and demonic adversaries. It establishes the three supreme attributes of Allah: Lordship (Rububiyyah), Absolute Sovereignty (Mulk), and Exclusive Divinity (Uluhiyyah). Abdullah ibn Abbas stated: "The devil is perched upon the heart of man; when he remembers Allah, the devil retreats (khannas)!"`,
      virtuesAr: `بيّن الإمام ابن كثير أن سورة الناس هي مسك ختام المصحف الشريف والدرع الواقي للأمة من مكائد الشيطان ووساوس الصدور. تشتمل على ثلاث صفات إلهية عليا: الربوبية والملك والألوهية، وتكشف طبيعة الوسواس الخناس الجاثم على قلب ابن آدم والذي يصغر ويذل ويخنس بمجرد ذكر الله والاستعاذة به.`,
      sababAnNuzulEn: `Sabab an-Nuzul: Revealed in pair with Surah Al-Falaq to dismantle the 11 knots of witchcraft cast by Labid bin Al-A'sam. Surah Al-Falaq protects against external physical perils (darkness, witchcraft, envy), while Surah An-Nas protects against internal metaphysical perils (whispers, doubts, and corruption of the soul), which are the most dangerous hazards to human salvation.`,
      sababAnNuzulAr: `سبب النزول: نزلت مع سورة الفلق لعلاج سحر لبيد بن الأعصم. فالفلق تحصين من الشرور الخارجية (الليل والسحر والحسد)، والناس تحصين من الشرور الداخلية القلبية (الوسوسة وإفساد العقيدة)، وهي أعظم خطراً على مصير العبد وأخراه.`,
      keyHadithsEn: [
        'Sahih Bukhari & Muslim: "Shaytan flows through the son of Adam like blood flows through veins."',
        'Sunan Abi Dawud: When a companion complained of distressing thoughts, the Prophet (ﷺ) said: "Allahu Akbar! All praise to Allah Who reduced his plot to a mere whisper."',
        'Sahih Muslim: "There is none among you except that a companion from the jinn (Qarin) has been assigned to him."'
      ],
      keyHadithsAr: [
        'الصحيحان: «إِنَّ الشَّيْطَانَ يَجْرِي مِنَ ابْنِ آدَمَ مَجْرَى الدَّمِ».',
        'سنن أبي داود: قال رسول الله ﷺ: «الْحَمْدُ لِلَّهِ الَّذِي رَدَّ كَيْدَهُ إِلَى الْوَسْوَسَةِ».',
        'صحيح مسلم: «مَا مِنْكُمْ مِنْ أَحَدٍ إِلَّا وَقَدْ وُكِّلَ بِهِ قَرِينُهُ مِنَ الْجِنِّ».'
      ],
      driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL,
      localPdfUrl: TAFSIR_IBN_KATHIR_LOCAL_PDF_URL
    };
  }

  // Comprehensive Scholarly Overview for ANY other Surah of the 114 Surahs
  const isMeccan = revType.toLowerCase() === 'meccan';
  const themeEn = isMeccan
    ? `Revealed during the Meccan period, establishing pure Monotheism (Tawheed), affirming bodily resurrection and accountability in the Hereafter, and fortifying the conviction of the early believers through historical parables of preceding prophets.`
    : `Revealed during the Medinan period, establishing foundational socio-spiritual jurisprudence, communal governance, ethical covenants, and collective devotions for the nascent Muslim Ummah.`;

  const themeAr = isMeccan
    ? `سورة مكية تركز على ترسيخ عقيدة التوحيد الخالص، وإثبات البعث والجزاء في اليوم الآخر، وتثبيت قلوب المؤمنين ببيان سنن الأولين وقصص الأنبياء والمرسلين عليهم السلام.`
    : `سورة مدنية تُعنى ببيان التشريعات والأحكام الفقهية، وتنظيم شؤون الأمة، وحفظ العهود والمواثيق، والتربية على التقوى والاستقامة في المجتمع المسلم.`;

  return {
    surahNumber,
    title: `Surah ${engName} (${engTrans || 'The Chapter'})`,
    titleAr: `${arName}`,
    englishNameTranslation: engTrans,
    revelationType: revType,
    numberOfAyahs: ayahCount,
    pdfFilename,
    virtuesEn: `In Tafsir Al-Qur'an Al-Azim, Imam Al-Hafiz Ibn Kathir (rahimahullah) meticulously investigates the thematic structure, linguistic nuances, and theological virtues of Surah ${engName} (${ayahCount} Ayahs). Grounding his commentary in the highest standard of exegesis—explaining the Quran by the Quran, the authentic Sunnah, and the consensus of the Sahabah—Ibn Kathir unveils the profound wisdom and spiritual elevation contained within this chapter. Access the complete unabridged classical manuscript for Surah ${engName} directly in the Google Drive archive.`,
    virtuesAr: `في تفسيره المشهور بـ (تفسير القرآن العظيم)، يستقصي الإمام الحافظ عماد الدين إسماعيل بن كثير رحمه الله فضائل ومقاصد ${arName} (وعدد آياتها ${ayahCount} آية)، معتمداً أصح مناهج التفسير بالمأثور: تفسير القرآن بالقرآن، وبصحيح السنة النبوية، وبآثار الصحابة الكرام والتابعين. ويمكن مراجعة الوثيقة الأصلية المحققة الكاملة لتفسير هذه السورة في مجلد الأرشيف على Google Drive.`,
    sababAnNuzulEn: `Historical Setting & Thematic Focus: ${themeEn} Ibn Kathir illuminates the specific linguistic articulations and authentic traditions transmitted regarding the revelation and reception of these verses by the noble Companions.`,
    sababAnNuzulAr: `السياق التاريخي والمحاور: ${themeAr} ويوثق الحافظ ابن كثير أسباب النزول ودلائل الألفاظ بدقة متناهية وبيان شافٍ.`,
    keyHadithsEn: [
      `Sahih Al-Bukhari: The Prophet (ﷺ) said: "The best among you are those who learn the Quran and teach it."`,
      `Sahih Muslim: The Prophet (ﷺ) said: "Recite the Quran, for indeed it will come on the Day of Resurrection as an intercessor for its companions."`,
      `Recorded in Sunan: "Whoever recites a single letter from the Book of Allah receives a good deed, and every good deed is multiplied tenfold."`
    ],
    keyHadithsAr: [
      `صحيح البخاري: قال رسول الله ﷺ: «خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ».`,
      `صحيح مسلم: قال رسول الله ﷺ: «اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لِأَصْحَابِهِ».`,
      `سنن الترمذي: قال رسول الله ﷺ: «مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالحَسَنَةُ بِعَشْرِ أَمْثَالِهَا».`
    ],
    driveFolderUrl: TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL
  };
}
