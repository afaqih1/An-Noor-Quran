// Authentic Adhkar & Supplications for Every Position in Salat (Prayer)
// Grounded in Sahih al-Bukhari, Sahih Muslim, Sunan Abi Dawud, Jami' at-Tirmidhi, and Sunan an-Nasa'i

export type PositionId = 
  | 'takbir_ihram'
  | 'istiftah_subhanak'
  | 'istiftah_baid'
  | 'istiftah_wajjahtu'
  | 'taawwudh_basmalah'
  | 'surah_fatiha'
  | 'surah_recitation'
  | 'takbir_ruku'
  | 'ruku_tasbeeh_essential'
  | 'ruku_tasbeeh_subhanak'
  | 'ruku_tasbeeh_subbooh'
  | 'rising_samiallah'
  | 'standing_rabbana_lakal_hamd'
  | 'standing_tahmeed_extended'
  | 'takbir_sujud'
  | 'sujud_tasbeeh_essential'
  | 'sujud_tasbeeh_subhanak'
  | 'sujud_tasbeeh_subbooh'
  | 'sujud_dua_dhanbi'
  | 'sitting_rabbi_ghfir_li'
  | 'sitting_allahumma_ghfir_li'
  | 'second_sujud'
  | 'first_tashahhud'
  | 'salat_ibrahimiyyah'
  | 'dua_four_trials'
  | 'dua_abu_bakr'
  | 'dua_muadh_dhikr'
  | 'dua_rabbana_atina'
  | 'tasleem_right_left'
  | 'post_salat_astaghfirullah'
  | 'post_salat_allahumma_antas_salam'
  | 'post_salat_tahlil'
  | 'post_salat_ayat_kursi'
  | 'post_salat_tasbeeh';

export type PositionCategory = 
  | 'standing_opening'
  | 'standing_qiraah'
  | 'ruku'
  | 'rising'
  | 'sujud'
  | 'sitting_between'
  | 'tashahhud'
  | 'ibrahimiyyah'
  | 'pre_salam'
  | 'tasleem'
  | 'post_salat';

export type RulingLevel = 'pillar' | 'obligatory' | 'sunnah';

export interface SalatRecitation {
  id: PositionId;
  positionNumber: number;
  positionCategory: PositionCategory;
  positionNameEn: string;
  positionNameAr: string;
  positionNameAm: string;
  postureDescriptionEn: string;
  postureDescriptionAr: string;
  ruling: RulingLevel;
  rulingLabelEn: string;
  rulingLabelAr: string;
  repeatCount: number;
  repeatNoteEn?: string;
  repeatNoteAr?: string;
  titleEn: string;
  titleAr: string;
  arabicText: string;
  transliteration: string;
  translationEn: string;
  translationAm?: string;
  explanationEn: string;
  explanationAr: string;
  hadithReference: string;
  authenticityGrade: string;
  isEssential: boolean; // true if standard/obligatory in every prayer
}

export interface SalatPositionCategoryMeta {
  category: PositionCategory;
  nameEn: string;
  nameAr: string;
  nameAm: string;
  order: number;
  iconName: string;
  briefPostureEn: string;
  briefPostureAr: string;
  image3dUrl: string;
}

export const SALAT_3D_POSTURE_IMAGES: Record<PositionCategory, string> = {
  standing_opening: '/src/assets/images/salat_3d_qiyam_1793534882759.jpg',
  standing_qiraah: '/src/assets/images/salat_3d_qiyam_1793534882759.jpg',
  ruku: '/src/assets/images/salat_3d_ruku_1793534883379.jpg',
  rising: '/src/assets/images/salat_3d_qiyam_1793534882759.jpg',
  sujud: '/src/assets/images/salat_3d_sujud_1793534882752.jpg',
  sitting_between: '/src/assets/images/salat_3d_sitting_1793534884265.jpg',
  tashahhud: '/src/assets/images/salat_3d_sitting_1793534884265.jpg',
  ibrahimiyyah: '/src/assets/images/salat_3d_sitting_1793534884265.jpg',
  pre_salam: '/src/assets/images/salat_3d_sitting_1793534884265.jpg',
  tasleem: '/src/assets/images/salat_3d_tasleem_1793534884917.jpg',
  post_salat: '/src/assets/images/salat_3d_sitting_1793534884265.jpg',
};

export function getSalat3DImage(category: PositionCategory): string {
  return SALAT_3D_POSTURE_IMAGES[category] || '/src/assets/images/salat_3d_qiyam_1793534882759.jpg';
}

export const SALAT_POSITION_CATEGORIES: SalatPositionCategoryMeta[] = [
  {
    category: 'standing_opening',
    nameEn: 'Opening & Standing (Takbir & Istiftah)',
    nameAr: 'القيام وتكبيرة الإحرام والاستفتاح',
    nameAm: 'መቆምና የመክፈቻ ተክቢራ እንዲሁም ዱዓእ',
    order: 1,
    iconName: 'UserCheck',
    briefPostureEn: 'Stand upright facing the Qibla, feet parallel, raise hands to shoulders or ears.',
    briefPostureAr: 'الوقوف معتدلاً مستقبلاً القبلة ورفع اليدين حذو المنكبين أو الأذنين عند التكبير.',
    image3dUrl: '/src/assets/images/salat_3d_qiyam_1793534882759.jpg'
  },
  {
    category: 'standing_qiraah',
    nameEn: 'Recitation of Al-Fatiha & Quran',
    nameAr: 'الاستعاذة والبسملة وتلاوة الفاتحة وسورة',
    nameAm: 'አል-ፋቲሓና ተጨማሪ የቁርአን አንቀጾች ንባብ',
    order: 2,
    iconName: 'BookOpen',
    briefPostureEn: 'Hands folded right over left on chest or upper torso, gaze focused on spot of Sujud.',
    briefPostureAr: 'وضع اليد اليمنى فوق كف اليسرى على الصدر أو فوق السرة، والبصر إلى موضع السجود.',
    image3dUrl: '/src/assets/images/salat_3d_qiyam_1793534882759.jpg'
  },
  {
    category: 'ruku',
    nameEn: 'Bowing (Ruku\')',
    nameAr: 'الركوع وتعظيم الرب جل وعلا',
    nameAm: 'ሩኩዕ (ማጎንበስና አላህን ማላቅ)',
    order: 3,
    iconName: 'CornerDownRight',
    briefPostureEn: 'Back flat horizontal, hands grasping knees with fingers spread, elbows outward.',
    briefPostureAr: 'انحناء الظهر مستوياً بحيث لو صب عليه ماء لاستقر، وقبض الركبتين بالأصابع مفرجة.',
    image3dUrl: '/src/assets/images/salat_3d_ruku_1793534883379.jpg'
  },
  {
    category: 'rising',
    nameEn: 'Rising & Standing Straight (I\'tidal)',
    nameAr: 'الرفع من الركوع والاعتدال والحمد',
    nameAm: 'ከሩኩዕ መነሳትና ቀጥ ብሎ መቆም',
    order: 4,
    iconName: 'ArrowUp',
    briefPostureEn: 'Stand completely upright, hands raised to shoulders/ears then relaxed or folded, spine calm.',
    briefPostureAr: 'الاستواء قائماً حتى يرجع كل عظم ومفصل إلى موضعه مع الطمأنينة.',
    image3dUrl: '/src/assets/images/salat_3d_qiyam_1793534882759.jpg'
  },
  {
    category: 'sujud',
    nameEn: 'Prostration (Sujud)',
    nameAr: 'السجود وغاية الخضوع والقرب',
    nameAm: 'ሱጁድ (ግምባርን መሬት ላይ ማሳረፍ)',
    order: 5,
    iconName: 'Sparkles',
    briefPostureEn: 'Prostrate on 7 limbs: forehead with nose, two palms, two knees, tips of two feet tucked forward.',
    briefPostureAr: 'السجود على سبعة أعظم: الجبهة والأنف، الكفان، الركبتان، وأطراف أصابع القدمين مستقبلاً القبلة.',
    image3dUrl: '/src/assets/images/salat_3d_sujud_1793534882752.jpg'
  },
  {
    category: 'sitting_between',
    nameEn: 'Sitting Between Prostrations',
    nameAr: 'الجلوس بين السجدتين والاستغفار',
    nameAm: 'በሁለቱ ሱጁዶች መካከል መቀመጥ',
    order: 6,
    iconName: 'AlignVerticalDistributeCenter',
    briefPostureEn: 'Sit calmly (Iftirash) on left foot laid flat, right foot upright on toes, hands on thighs.',
    briefPostureAr: 'الافتراش: الجلوس على باطن الرجل اليسرى ونصب الرجل اليمنى مستقبلاً بأصابعها القبلة.',
    image3dUrl: '/src/assets/images/salat_3d_sitting_1793534884265.jpg'
  },
  {
    category: 'tashahhud',
    nameEn: 'The Tashahhud (Attahiyyat)',
    nameAr: 'التشهد الأول والأخير وتحية الله',
    nameAm: 'ተሸሁድ (አተሒያቱ)',
    order: 7,
    iconName: 'ShieldCheck',
    briefPostureEn: 'Sitting posture, left hand open on left thigh, right hand with index finger pointed raising in Shahadah.',
    briefPostureAr: 'الجلوس واليد اليسرى مبسوطة على الفخذ اليسرى، واليمنى مقبوضة مع الإشارة بالسبابة وتحريكها في الدعاء.',
    image3dUrl: '/src/assets/images/salat_3d_sitting_1793534884265.jpg'
  },
  {
    category: 'ibrahimiyyah',
    nameEn: 'As-Salat Al-Ibrahimiyyah (Blessings)',
    nameAr: 'الصلاة الإبراهيمية على النبي وآله',
    nameAm: 'ኢብራሂሚያ ሰለዋት በነቢዩ ﷺ ላይ',
    order: 8,
    iconName: 'Heart',
    briefPostureEn: 'In final sitting position (Tawarruk in 3 or 4-rak\'ah prayers), continuing index finger pointing.',
    briefPostureAr: 'التورك في التشهد الأخير من الصلاة الثلاثية والرباعية مع استمرار الإشارة بالسبابة.',
    image3dUrl: '/src/assets/images/salat_3d_sitting_1793534884265.jpg'
  },
  {
    category: 'pre_salam',
    nameEn: 'Supplications Before Salam',
    nameAr: 'الدعاء المستجاب قبل التسليم',
    nameAm: 'ከማሰላመት በፊት የሚደረግ ዱዓእ',
    order: 9,
    iconName: 'ShieldAlert',
    briefPostureEn: 'Still seated before turning head, supplicating for protection from trials and for forgiveness.',
    briefPostureAr: 'الاستمرار في الجلوس والتضرع بالدعاء والاستعاذة من الفتن الأربع قبل السلام.',
    image3dUrl: '/src/assets/images/salat_3d_sitting_1793534884265.jpg'
  },
  {
    category: 'tasleem',
    nameEn: 'The Concluding Salam (Tasleem)',
    nameAr: 'التسليم ختام الصلاة',
    nameAm: 'ሰላምታ ማውረድ (ተስሊም)',
    order: 10,
    iconName: 'CheckCircle2',
    briefPostureEn: 'Turn head slowly to the right until cheek is visible behind, then turn to the left.',
    briefPostureAr: 'الالتفات يميناً حتى يرى بياض الخد الأيمن ثم الالتفات يساراً حتى يرى بياض الخد الأيسر.',
    image3dUrl: '/src/assets/images/salat_3d_tasleem_1793534884917.jpg'
  },
  {
    category: 'post_salat',
    nameEn: 'Post-Prayer Sunnah Adhkar',
    nameAr: 'أذكار ما بعد السلام المأثورة',
    nameAm: 'ከሶላት በኋላ የሚባሉ ዚክሮች',
    order: 11,
    iconName: 'Sun',
    briefPostureEn: 'Remaining in place after Tasleem reciting the authentic morning/evening prayer completions.',
    briefPostureAr: 'البقاء في موضع الصلاة والاستغفار والتسبيح وقراءة آية الكرسي والمعوذات.',
    image3dUrl: '/src/assets/images/salat_3d_sitting_1793534884265.jpg'
  }
];

export const SALAT_RECITATIONS: SalatRecitation[] = [
  // 1. TAKBIRAT AL-IHRAM
  {
    id: 'takbir_ihram',
    positionNumber: 1,
    positionCategory: 'standing_opening',
    positionNameEn: 'Standing (Qiyam) • Opening Takbir',
    positionNameAr: 'القيام • تكبيرة الإحرام',
    positionNameAm: 'መቆም • የመክፈቻ ተክቢራ',
    postureDescriptionEn: 'Stand facing the Ka\'bah, raise hands with palms forward to shoulders or earlobes, and proclaim the Takbir.',
    postureDescriptionAr: 'الوقوف مستقبلاً القبلة ورفع اليدين حذو المنكبين أو فروع الأذنين ممدودة الأصابع غير مفرجة.',
    ruling: 'pillar',
    rulingLabelEn: 'Pillar (Rukun - Mandatory for validity)',
    rulingLabelAr: 'ركن لا تصح الصلاة إلا به',
    repeatCount: 1,
    repeatNoteEn: 'Proclaim aloud or audibly to self at the very start of prayer.',
    repeatNoteAr: 'يجهر بها الإمام ويسمع بها المنفرد والمأموم نفسه.',
    titleEn: 'Takbirat al-Ihram (The Sanctifying Takbir)',
    titleAr: 'تكبيرة الإحرام',
    arabicText: 'اللهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    translationEn: 'Allah is the Greatest [above all creation, worldly affairs, and imagination].',
    translationAm: 'አላህ ከሁሉ በላይ ታላቅ ነው (ከፍጡራኑ፣ ከዓለም ጉዳዮችና ከምናብ ሁሉ በላይ)።',
    explanationEn: 'The entry gateway into prayer. The Prophet ﷺ said: "The key to prayer is purification, its sanctification (making forbidden worldly talk) is Takbir, and its conclusion is Taslim." [Abu Dawud, Tirmidhi]. Raising the hands signifies casting all worldly matters behind.',
    explanationAr: 'مفتاح الصلاة وتحريمها. قال النبي ﷺ: «مِفْتَاحُ الصَّلَاةِ الطُّهُورُ، وَتَحْرِيمُهَا التَّكْبِيرُ، وَتَحْلِيلُهَا التَّسْلِيمُ». برفع اليدين يلقي المسلم الدنيا خلف ظهره مقبلاً بكليته على ربه.',
    hadithReference: 'Sahih al-Bukhari 735, Sunan Abi Dawud 61',
    authenticityGrade: 'Muttafaqun \'Alayh (Highest Authenticity)',
    isEssential: true
  },

  // 2. OPENING SUPPLICATION (DUA AL-ISTIFTAH) - Option 1 (Most Celebrated)
  {
    id: 'istiftah_subhanak',
    positionNumber: 2,
    positionCategory: 'standing_opening',
    positionNameEn: 'Standing • Du\'a al-Istiftah (Option 1 - Most Famous)',
    positionNameAr: 'القيام • دعاء الاستفتاح (الصيغة الأشهر عند السلف)',
    positionNameAm: 'መቆም • የመክፈቻ ዱዓእ (አማራጭ 1 - በጣም ዝነኛው)',
    postureDescriptionEn: 'Place right hand firmly over left wrist and forearm on the chest, gaze lowered upon the place of Sujud.',
    postureDescriptionAr: 'وضع اليد اليمنى على اليسرى على الصدر، وخفض البصر لموضع السجود، وقراءة الدعاء سراً.',
    ruling: 'sunnah',
    rulingLabelEn: 'Sunnah (Recommended in 1st Rak\'ah)',
    rulingLabelAr: 'سنة مستحبة في الركعة الأولى',
    repeatCount: 1,
    repeatNoteEn: 'Recited silently after the opening Takbir before Surah Al-Fatiha in the first Rak\'ah only.',
    repeatNoteAr: 'يقال سراً بعد تكبيرة الإحرام وقبل الفاتحة في الركعة الأولى فقط.',
    titleEn: 'Opening Supplication: Subhanak Allahumma (Praise & Magnification)',
    titleAr: 'دعاء الاستفتاح: سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ',
    arabicText: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ.',
    transliteration: 'Subḥānak Allāhumma wa bi-ḥamdika, wa tabāraka-smuka, wa ta‘ālā jadduka, wa lā ilāha ghayruk.',
    translationEn: 'Glory is to You, O Allah, and with Your praise. Blessed is Your Name, exalted is Your Majesty, and there is no deity worthy of worship besides You.',
    translationAm: 'አላህ ሆይ! ጥራት ይገባህ፤ ምስጋናም ላንተ ይሁን፤ ስምህ ተባረከ፤ ግርማህም ከፍ አለ፤ ከአንተ ሌላ በእውነት የሚመለክ አምላክ የለም።',
    explanationEn: 'This invocation was favored by Umar ibn al-Khattab and recited by the Prophet ﷺ. It contains the four pillars of monotheistic glorification: Tasbeeh (declaring Allah free of imperfection), Tahmeed (attributing all perfection), Tabaruk (blessing in His name), and Tawheed (affirming absolute oneness).',
    explanationAr: 'كان عمر بن الخطاب رضي الله عنه يستفتح به جهراً ليعلمه الناس، وهو مروي عن عائشة وأبي سعيد. يجمع بين تنزيه الله وحمده وإثبات بركة اسمه وعلو عظمته وإفراده بالألوهية وحدها.',
    hadithReference: 'Sunan Abi Dawud 775, Jami\' at-Tirmidhi 242, Sahih Muslim 399',
    authenticityGrade: 'Sahih (Authentic)',
    isEssential: true
  },

  // 3. OPENING SUPPLICATION (DUA AL-ISTIFTAH) - Option 2 (Bukhari & Muslim)
  {
    id: 'istiftah_baid',
    positionNumber: 3,
    positionCategory: 'standing_opening',
    positionNameEn: 'Standing • Du\'a al-Istiftah (Option 2 - Bukhari & Muslim)',
    positionNameAr: 'القيام • دعاء الاستفتاح (صيغة أبي هريرة المتفق عليها)',
    positionNameAm: 'መቆም • የመክፈቻ ዱዓእ (አማራጭ 2 - ቡኻሪና ሙስሊም)',
    postureDescriptionEn: 'Hands folded right over left on chest, recited silently during the brief pause after Takbir.',
    postureDescriptionAr: 'يقال سراً في السكتة بين التكبير والقراءة كما في حديث أبي هريرة رضي الله عنه.',
    ruling: 'sunnah',
    rulingLabelEn: 'Sunnah (Strongly Authentic Alternate)',
    rulingLabelAr: 'سنة ثابتة في الصحيحين',
    repeatCount: 1,
    titleEn: 'Opening Supplication: Distance Me from My Sins',
    titleAr: 'دعاء الاستفتاح: اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ',
    arabicText: 'اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ، اللَّهُمَّ نَقِّنِي مِنْ خَطَايَايَ كَمَا يُنَقَّى الثَّوْبُ الْأَبْيَضُ مِنَ الدَّنَسِ، اللَّهُمَّ اغْسِلْنِي مِنْ خَطَايَايَ بِالثَّلْجِ وَالْمَاءِ وَالْبَرَدِ.',
    transliteration: 'Allāhumma bā‘id baynī wa bayna khaṭāyāya kamā bā‘adta bayna-l-mashriqi wa-l-maghrib, Allāhumma naqqinī min khaṭāyāya kamā yunaqqā-th-thawbu-l-abyaḍu mina-d-danas, Allāhumma-ghsilnī min khaṭāyāya bi-th-thalji wa-l-mā’i wa-l-barad.',
    translationEn: 'O Allah, distance me from my sins as You have distanced the East from the West. O Allah, purify me of my sins as a white garment is cleansed of dirt. O Allah, wash away my sins with snow, water, and hail.',
    translationAm: 'አላህ ሆይ! በምስራቅና በምዕራብ መካከል እንዳራራቅክ በእኔና በሀጢአቶቼ መካከል አራርቅ። አላህ ሆይ! ነጭ ልብስ ከቆሻሻ እንደሚጠራ ሁሉ ከሀጢአቶቼ አጥራኝ። አላህ ሆይ! ሀጢአቶቼን በበረዶ፣ በውሃና በውርጭ እጠብልኝ።',
    explanationEn: 'Abu Hurairah reported: "When the Messenger of Allah ﷺ stood for prayer, he would remain silent for a short while before reciting. I asked: \'May my father and mother be sacrificed for you, what do you say during this silence?\' He said: \'I say: Allahumma ba\'id bayni...\'" [Bukhari & Muslim]. Mentioning water, snow, and hail indicates complete cleansing, cooling the heat of sins.',
    explanationAr: 'حديث متفق عليه عند الشيخين. جمع بين المباعدة عن الذنوب قبل وقوعها، والتنقية منها بعد وقوعها، والغسل التام الحاسم بحرارة الذنوب وبرودة ماء التوبة والثلج والبرد.',
    hadithReference: 'Sahih al-Bukhari 744, Sahih Muslim 598',
    authenticityGrade: 'Muttafaqun \'Alayh (Agreed Upon)',
    isEssential: false
  },

  // 4. SEEKING REFUGE & BASMALAH (ISTI'ADHAH & BASMALAH)
  {
    id: 'taawwudh_basmalah',
    positionNumber: 4,
    positionCategory: 'standing_qiraah',
    positionNameEn: 'Standing • Seeking Refuge (Isti\'adhah) & Basmalah',
    positionNameAr: 'القيام • الاستعاذة والبسملة قبل الفاتحة',
    positionNameAm: 'መቆም • ኢስቲዓዛህና ቢስሚላህ',
    postureDescriptionEn: 'Hands remaining on chest, heart mindful of seeking divine shielding from Satanic whispers.',
    postureDescriptionAr: 'الاستعاذة سراً لدفع وسوسة الشيطان، ثم البسملة سراً عند جمهور العلماء.',
    ruling: 'sunnah',
    rulingLabelEn: 'Sunnah (Recited Silently)',
    rulingLabelAr: 'سنة تقرأ سراً',
    repeatCount: 1,
    titleEn: 'Seeking Refuge in Allah from the Accursed Satan & Basmalah',
    titleAr: 'الاستعاذة بالله من الشيطان الرجيم والبسملة',
    arabicText: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ. بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ.',
    transliteration: 'A‘ūdhu bi-llāhi mina-sh-shayṭāni-r-rajīm. Bismi-llāhi-r-Raḥmāni-r-Raḥīm.',
    translationEn: 'I seek refuge in Allah from Satan the outcast and rejected. In the name of Allah, the Most Gracious, the Most Merciful.',
    translationAm: 'ከተረገመው ሰይጣን በአላህ እጠበቃለሁ። በአላህ ስም እጅግ በጣም ሩኅሩህ በጣም አዛኝ በሆነው።',
    explanationEn: 'Allah commands: "So when you recite the Quran, seek refuge in Allah from Satan, the expelled" (Surah An-Nahl 16:98). The Sunnah is to recite Isti\'adhah and Basmalah silently before Surah Al-Fatiha in every Rak\'ah.',
    explanationAr: 'عملاً بقوله تعالى: ﴿فَإِذَا قَرَأْتَ الْقُرْآنَ فَاسْتَعِذْ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ﴾. والبسملة آية مباركة تفتتح بها القراءة وتصرف وساوس النفس.',
    hadithReference: 'Sunan Abi Dawud 775, Sahih Muslim 399',
    authenticityGrade: 'Sahih (Authentic)',
    isEssential: true
  },

  // 5. SURAH AL-FATIHA & AMEEN
  {
    id: 'surah_fatiha',
    positionNumber: 5,
    positionCategory: 'standing_qiraah',
    positionNameEn: 'Standing • Surah Al-Fatiha (The Mother of the Book) & Ameen',
    positionNameAr: 'القيام • سورة الفاتحة (أم الكتاب) والتأمين',
    positionNameAm: 'መቆም • ሱረቱል ፋቲሓና አሚን ማለት',
    postureDescriptionEn: 'Reciting slowly with deliberate pauses at the end of each verse. Saying "Ameen" aloud in vocal prayers.',
    postureDescriptionAr: 'قراءة مترسلة مع الوقوف عند رأس كل آية، ومد الصوت بـ (آمين) جهراً في الصلاة الجهرية.',
    ruling: 'pillar',
    rulingLabelEn: 'Pillar (Rukun in Every Single Rak\'ah)',
    rulingLabelAr: 'ركن في كل ركعة للمنفرد والإمام والمأموم',
    repeatCount: 1,
    repeatNoteEn: 'Obligatory in every Rak\'ah of obligatory and voluntary prayers alike.',
    repeatNoteAr: 'لا تصح ركعة بدونها لقول النبي ﷺ: «لا صَلَاةَ لِمَنْ لَمْ يَقْرَأْ بِفَاتِحَةِ الْكِتَابِ».',
    titleEn: 'Surah Al-Fatiha with the Ameen Seal',
    titleAr: 'سورة الفاتحة مع التأمين',
    arabicText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ۝ آمِينَ.',
    transliteration: 'Bismi-llāhi-r-Raḥmāni-r-Raḥīm. Al-ḥamdu li-llāhi Rabbi-l-‘ālamīn. Ar-Raḥmāni-r-Raḥīm. Māliki yawmi-d-dīn. Iyyāka na‘budu wa iyyāka nasta‘īn. Ihdina-ṣ-ṣirāṭa-l-mustaqīm. Ṣirāṭa-lladhīna an‘amta ‘alayhim, ghayri-l-maghḍūbi ‘alayhim wa la-ḍ-ḍāllīn. Āmīn.',
    translationEn: 'In the name of Allah, the Entirely Merciful, the Especially Merciful. All praise is due to Allah, Lord of the worlds. The Entirely Merciful, the Especially Merciful. Sovereign of the Day of Recompense. It is You we worship and You we ask for help. Guide us to the straight path. The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray. Ameen [O Allah, accept and answer our prayer].',
    translationAm: 'በአላህ ስም እጅግ በጣም ሩኅሩህ በጣም አዛኝ በሆነው። ምስጋና ለአላህ ይገባው የዓለማት ጌታ ለሆነው። እጅግ በጣም ሩኅሩህ በጣም አዛኝ። የፍርዱ ቀን ባለቤት ለሆነው። አንተን ብቻ እናመልካለን፤ አንተንም ብቻ እርዳታን እንለምናለን። ቀጥተኛውን መንገድ ምራን። የእነዚያን በነሱ ላይ በጎ የዋልክላቸውን መንገድ፤ በእነሱ ላይ ቁጣ ያልወረደባቸውንና ያልተሳሳቱትን መንገድ። አሚን (አላህ ሆይ ዱዓችንን ተቀበለን)።',
    explanationEn: 'The Prophet ﷺ stated: "Whoever offers a prayer in which he does not recite the Mother of the Book, it is deficient, incomplete" [Sahih Muslim]. Saying "Ameen" means "O Allah, answer!" When the Imam says Ameen, say Ameen, for whoever\'s Ameen coincides with the Ameen of the angels has their past sins forgiven [Bukhari & Muslim].',
    explanationAr: 'أعظم سورة في كتاب الله وقسمها الله تعالى بينه وبين عبده نصفين. والتأمين بعدها سنة مؤكدة، قال ﷺ: «إِذَا أَمَّنَ الْإِمَامُ فَأَمِّنُوا، فَإِنَّهُ مَنْ وَافَقَ تَأْمِينُهُ تَأْمِينَ الْمَلَائِكَةِ غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ».',
    hadithReference: 'Sahih al-Bukhari 756, Sahih Muslim 394 & 410',
    authenticityGrade: 'Muttafaqun \'Alayh (Highest Authenticity)',
    isEssential: true
  },

  // 6. RECITATION OF A SURAH AFTER AL-FATIHA
  {
    id: 'surah_recitation',
    positionNumber: 6,
    positionCategory: 'standing_qiraah',
    positionNameEn: 'Standing • Recitation of a Surah/Verses',
    positionNameAr: 'القيام • قراءة ما تيسر من السور أو الآيات',
    positionNameAm: 'መቆም • ተጨማሪ የቁርአን ሱራህ ወይም አንቀጾች ንባብ',
    postureDescriptionEn: 'Standing firmly, reciting from memory or following the Imam in silent/audible prayer.',
    postureDescriptionAr: 'الاستمرار في القيام وقراءة سورة كاملة أو آيات بينات في الركعتين الأوليين.',
    ruling: 'sunnah',
    rulingLabelEn: 'Sunnah (In the 1st and 2nd Rak\'ahs)',
    rulingLabelAr: 'سنة في الركعتين الأوليين',
    repeatCount: 1,
    repeatNoteEn: 'Sunnah in the first two Rak\'ahs of Fajr, Dhuhr, Asr, Maghrib, and Isha.',
    repeatNoteAr: 'تسن قراءة سورة بعد الفاتحة في الركعتين الأوليين من الصلوات الخمس وسائر النوافل.',
    titleEn: 'Reciting Additional Quran (Example: Surah Al-Ikhlas)',
    titleAr: 'قراءة سورة بعد الفاتحة (مثال: سورة الإخلاص)',
    arabicText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ.',
    transliteration: 'Bismi-llāhi-r-Raḥmāni-r-Raḥīm. Qul Huwa-llāhu Aḥad. Allāhu-ṣ-Ṣamad. Lam yalid wa lam yūlad. Wa lam yakun lahū kufuwan aḥad.',
    translationEn: 'Say: He is Allah, [who is] One. Allah, the Eternal Refuge [Absolute, Self-Sufficient]. He neither begets nor is born, nor is there to Him any equivalent.',
    translationAm: 'በል፡- እርሱ አላህ አንድ ነው። አላህ የሁሉ መጠጊያ ነው። አልወለደም፤ አልተወለደምም፤ ለእርሱም አንድም ቢጤ የለውም።',
    explanationEn: 'The Prophet ﷺ would recite a Surah after Al-Fatiha in the first two Rak\'ahs of every prayer. Surah Al-Ikhlas equals one-third of the Quran in reward. In the 3rd and 4th Rak\'ahs, Al-Fatiha alone is sufficient.',
    explanationAr: 'كان النبي ﷺ يقرأ بعد الفاتحة سورة في الركعتين الأوليين من صلاة الظهر والعصر والمغرب والعشاء والصبح، ويقتصر على الفاتحة في الثالثة والرابعة غالباً.',
    hadithReference: 'Sahih al-Bukhari 776, Sahih Muslim 451',
    authenticityGrade: 'Muttafaqun \'Alayh (Agreed Upon)',
    isEssential: false
  },

  // 7. TAKBIR FOR RUKU'
  {
    id: 'takbir_ruku',
    positionNumber: 7,
    positionCategory: 'ruku',
    positionNameEn: 'Bowing • Takbir for Ruku\' & Hand Raising',
    positionNameAr: 'الانتقال إلى الركوع • تكبيرة الركوع ورفع اليدين',
    positionNameAm: 'ወደ ሩኩዕ መሸጋገር • ተክቢራና እጅ ማንሳት',
    postureDescriptionEn: 'Raise hands to shoulders/ears saying Allahu Akbar, then bend forward into Ruku\'.',
    postureDescriptionAr: 'رفع اليدين حذو المنكبين مع التكبير، ثم الهوي للركوع واضعاً اليدين على الركبتين.',
    ruling: 'obligatory',
    rulingLabelEn: 'Obligatory (Wajib Takbir, Sunnah Hand Raising)',
    rulingLabelAr: 'واجب التكبير للانتقال وسنة رفع اليدين',
    repeatCount: 1,
    titleEn: 'Takbir of Transition into Ruku\'',
    titleAr: 'تكبير الهوي إلى الركوع',
    arabicText: 'اللهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    translationEn: 'Allah is the Greatest.',
    translationAm: 'አላህ ከሁሉ በላይ ታላቅ ነው።',
    explanationEn: 'The Prophet ﷺ would say Takbir whenever he bent down, raised his head, stood up, or prostrated [Bukhari]. Raising the hands before Ruku\' is an authentic confirmed Sunnah (Raf\' al-Yadayn).',
    explanationAr: 'تكبيرة الانتقال واجبة عند جمع من المحققين. ورفع اليدين عند الركوع متواتر عن النبي ﷺ من رواية ابن عمر وأبي هريرة ومالك بن الحويرث.',
    hadithReference: 'Sahih al-Bukhari 735, Sahih Muslim 390',
    authenticityGrade: 'Muttafaqun \'Alayh (Highest Authenticity)',
    isEssential: true
  },

  // 8. RUKU' TASBEEH - Essential (3 times minimum)
  {
    id: 'ruku_tasbeeh_essential',
    positionNumber: 8,
    positionCategory: 'ruku',
    positionNameEn: 'Bowing (Ruku\') • Essential Tasbeeh (Glory to my Lord the Almighty)',
    positionNameAr: 'الركوع • التسبيح الواجب (سُبْحَانَ رَبِّيَ الْعَظِيمِ)',
    positionNameAm: 'ሩኩዕ • ዋናው ተስቢሕ (ሱብሓነ ረቢየል አዚም)',
    postureDescriptionEn: 'Back horizontal straight, head in line with spine (not drooping or tilted up), hands firmly grasping knees with spread fingers.',
    postureDescriptionAr: 'استواء الظهر مع العنق، واليدان قابضتان على الركبتين كأنهما قابضتان عليهما مع تفريج الأصابع والتجافي.',
    ruling: 'obligatory',
    rulingLabelEn: 'Obligatory (Wajib - 1x Obligatory, 3x Sunnah Perfection)',
    rulingLabelAr: 'واجب مرة واحدة، والمستحب ثلاثاً أو أكثر وتراً',
    repeatCount: 3,
    repeatNoteEn: 'Recite at least 3 times calmly with tranquility (Tum\'anīnah).',
    repeatNoteAr: 'يقال ثلاث مرات على الأقل بطمأنينة وخشوع وتدبر لعظمة الخالق.',
    titleEn: 'Essential Bowing Tasbeeh: Glory be to my Lord, the Almighty',
    titleAr: 'تسبيح الركوع: سُبْحَانَ رَبِّيَ الْعَظِيمِ',
    arabicText: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ.',
    transliteration: 'Subḥāna Rabbiya-l-‘Aẓīm.',
    translationEn: 'Glory be to my Lord, the Almighty [exalted above any flaw or weakness].',
    translationAm: 'ታላቁ ጌታዬ ጥራት ይገባው (ከማንኛውም እንከንና ድካም ሁሉ የጠራ ነው)።',
    explanationEn: 'When the verse was revealed: "So glorify the name of your Lord, the Most Great" (Surah Al-Waqi\'ah 56:96), the Prophet ﷺ said: "Place this in your Ruku\'" [Abu Dawud, Ibn Majah]. The Prophet ﷺ instructed: "As for Ruku\', magnify therein your Lord" [Sahih Muslim].',
    explanationAr: 'لما نزلت: ﴿فَسَبِّحْ بِاسْمِ رَبِّكَ الْعَظِيمِ﴾، قال النبي ﷺ: «اجْعَلُوهَا فِي رُكُوعِكُمْ». وقال ﷺ: «فَأَمَّا الرُّكُوعُ فَعَظِّمُوا فِيهِ الرَّبَّ».',
    hadithReference: 'Sunan Abi Dawud 869, Sahih Muslim 479, Sunan Ibn Majah 887',
    authenticityGrade: 'Sahih (Authentic)',
    isEssential: true
  },

  // 9. RUKU' TASBEEH - Prophetic Addition (Subhanak Allahumma)
  {
    id: 'ruku_tasbeeh_subhanak',
    positionNumber: 9,
    positionCategory: 'ruku',
    positionNameEn: 'Bowing • Sunnah Du\'a (Subhanak Allahumma Rabbana)',
    positionNameAr: 'الركوع • دعاء جامع من هدي النبي ﷺ في الركوع والسجود',
    positionNameAm: 'ሩኩዕ • የሱናህ ዱዓእ (ሱብሓነከል-ሏሁመ ረበና)',
    postureDescriptionEn: 'Maintaining steady calm posture in Ruku\', adding this supplication.',
    postureDescriptionAr: 'يقال بعد تسبيح الركوع، جمعاً بين التعظيم وطلب المغفرة.',
    ruling: 'sunnah',
    rulingLabelEn: 'Sunnah (Confirmed Prophetic Practice in Bukhari & Muslim)',
    rulingLabelAr: 'سنة مؤكدة في الصحيحين',
    repeatCount: 1,
    titleEn: 'Sunnah Bowing Du\'a: O Allah Forgive Me',
    titleAr: 'دعاء الركوع: سُبْحَانَكَ اللَّهُمَّ رَبَّنَا وَبِحَمْدِكَ',
    arabicText: 'سُبْحَانَكَ اللَّهُمَّ رَبَّنَا وَبِحَمْدِكَ، اللَّهُمَّ اغْفِرْ لِي.',
    transliteration: 'Subḥānak Allāhumma Rabbanā wa bi-ḥamdika, Allāhumma-ghfir lī.',
    translationEn: 'Glory is to You, O Allah our Lord, and praise is Yours. O Allah, forgive me.',
    translationAm: 'አላህ ጌታችን ሆይ! ጥራት ይገባህ፤ ምስጋናም ላንተ ይሁን፤ አላህ ሆይ! ምህረትህን ለግሰኝ።',
    explanationEn: 'Aisha (may Allah be pleased with her) narrated: "The Messenger of Allah ﷺ used to say frequently in his bowing and prostration: \'Subhanaka Allahumma Rabbana wa bihamdika, Allahumma-ghfir li,\' acting upon the command in the Quran (Surah An-Nasr 110:3)" [Bukhari & Muslim].',
    explanationAr: 'عن عائشة رضي الله عنها قالت: كان النبي ﷺ يكثر أن يقول في ركوعه وسجوده: «سُبْحَانَكَ اللَّهُمَّ رَبَّنَا وَبِحَمْدِكَ اللَّهُمَّ اغْفِرْ لِي»، يتأول القرآن.',
    hadithReference: 'Sahih al-Bukhari 792, Sahih Muslim 484',
    authenticityGrade: 'Muttafaqun \'Alayh (Agreed Upon)',
    isEssential: false
  },

  // 10. RUKU' TASBEEH - Subboohun Quddoos
  {
    id: 'ruku_tasbeeh_subbooh',
    positionNumber: 10,
    positionCategory: 'ruku',
    positionNameEn: 'Bowing • Sunnah Tasbeeh (Subboohun Quddoos)',
    positionNameAr: 'الركوع • تسبيح الملائكة والروح (سُبُّوحٌ قُدُّوسٌ)',
    positionNameAm: 'ሩኩዕ • የሱናህ ተስቢሕ (ሱቡሑን ቁዱስ)',
    postureDescriptionEn: 'Recited with devotion, praising the Holy Lord of the angels and the Spirit.',
    postureDescriptionAr: 'يقال في الركوع أو السجود لتعظيم قداسة الخالق وملكوته.',
    ruling: 'sunnah',
    rulingLabelEn: 'Sunnah (Sahih Muslim)',
    rulingLabelAr: 'سنة مأثورة في صحيح مسلم',
    repeatCount: 1,
    titleEn: 'Angelic Glorification: Perfect and Holy Lord',
    titleAr: 'تسبيح: سُبُّوحٌ قُدُّوسٌ رَبُّ الْمَلَائِكَةِ وَالرُّوحِ',
    arabicText: 'سُبُّوحٌ قُدُّوسٌ، رَبُّ الْمَلَائِكَةِ وَالرُّوحِ.',
    transliteration: 'Subbūḥun Quddūs, Rabbu-l-malā’ikati wa-r-Rūḥ.',
    translationEn: 'Most Perfect, All-Holy, Lord of the angels and the Spirit [Jibril / Gabriel].',
    translationAm: 'እንከን የሌለው ቅዱስ ጌታ፤ የመላእክትና የሩሕ (ጅብሪል) ጌታ የሆነው።',
    explanationEn: 'The Prophet ﷺ used to say this in his bowing and prostration. "Subbooh" means the One thoroughly purified from any defect; "Quddoos" means the Blessed and Sacred; "Ar-Rooh" refers to the noble angel Jibril (Gabriel) [Sahih Muslim].',
    explanationAr: 'روى مسلم في صحيحه عن عائشة أن رسول الله ﷺ كان يقول في ركوعه وسجوده: «سُبُّوحٌ قُدُّوسٌ رَبُّ الْمَلَائِكَةِ وَالرُّوحِ». والروح هو جبريل عليه السلام خص بالذكر لشرفه وعظمته.',
    hadithReference: 'Sahih Muslim 487',
    authenticityGrade: 'Sahih (Authentic)',
    isEssential: false
  },

  // 11. RISING FROM RUKU' (SAMI' ALLAHU LIMAN HAMIDAH)
  {
    id: 'rising_samiallah',
    positionNumber: 11,
    positionCategory: 'rising',
    positionNameEn: 'Rising from Bowing • Sami\' Allahu Liman Hamidah',
    positionNameAr: 'الرفع من الركوع • التسميع (سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ)',
    positionNameAm: 'ከሩኩዕ መነሳት • ተስሚዕ (ሰሚዐላሁ ሊመን ሓሚዳህ)',
    postureDescriptionEn: 'Straighten back from bowing, raising hands to shoulders or ears while speaking.',
    postureDescriptionAr: 'رفع الرأس والظهر من الركوع مع رفع اليدين حذو المنكبين وقول الذكر في أثناء الرفع.',
    ruling: 'obligatory',
    rulingLabelEn: 'Obligatory (Wajib upon Imam and Individual worshipper)',
    rulingLabelAr: 'واجب على الإمام والمنفرد في أثناء الرفع',
    repeatCount: 1,
    repeatNoteEn: 'Pronounced while rising between the bending position and the upright stand.',
    repeatNoteAr: 'يقال أثناء الانتقال من الركوع إلى القيام التام.',
    titleEn: 'Rising Tasmee\': Allah Hears the One Who Praises Him',
    titleAr: 'تسميع الاعتدال: سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ',
    arabicText: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ.',
    transliteration: 'Sami‘a-llāhu liman ḥamidah.',
    translationEn: 'Allah hears [and answers] whoever praises Him.',
    translationAm: 'አላህ ያመሰገነውን ሰው ምስጋና ሰማ (ተቀበለ)።',
    explanationEn: 'The Imam and the individual recite this while rising. The Prophet ﷺ said: "When the Imam says \'Sami\' Allahu liman hamidah\', then say \'Rabbana wa lakal-hamd\', for if one\'s words coincide with the words of the angels, his past sins will be forgiven" [Bukhari & Muslim].',
    explanationAr: 'معناه: استجاب الله لمن حمده وتقبل منه. يشرع للإمام والمنفرد، بينما المأموم يقتصر على التحميد عند جمهور أهل العلم أو يجمع بينهما.',
    hadithReference: 'Sahih al-Bukhari 796, Sahih Muslim 409',
    authenticityGrade: 'Muttafaqun \'Alayh (Highest Authenticity)',
    isEssential: true
  },

  // 12. STANDING STRAIGHT (TAHMEED) - Rabbana wa lakal-hamd
  {
    id: 'standing_rabbana_lakal_hamd',
    positionNumber: 12,
    positionCategory: 'rising',
    positionNameEn: 'Standing Straight (I\'tidal) • Tahmeed (Our Lord, to You is Praise)',
    positionNameAr: 'الاعتدال قائماً • التحميد (رَبَّنَا وَلَكَ الْحَمْدُ حَمْدًا كَثِيرًا)',
    positionNameAm: 'ቀጥ ብሎ መቆም • ተሕሚድ (ረበና ወለከል ሓምድ)',
    postureDescriptionEn: 'Stand perfectly straight with every vertebra settled in place with calm tranquility (Tum\'anīnah).',
    postureDescriptionAr: 'الوقوف معتدلاً مطمئناً حتى يعود كل فقار إلى موضعه.',
    ruling: 'pillar',
    rulingLabelEn: 'Obligatory Tahmeed & Pillar of Tranquility (Tum\'anīnah)',
    rulingLabelAr: 'واجب التحميد وركن الطمأنينة في الاعتدال',
    repeatCount: 1,
    titleEn: 'Standing Tahmeed: Abundant, Pure, Blessed Praise',
    titleAr: 'تحميد الاعتدال: رَبَّنَا وَلَكَ الْحَمْدُ، حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ',
    arabicText: 'رَبَّنَا وَلَكَ الْحَمْدُ، حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ.',
    transliteration: 'Rabbanā wa laka-l-ḥamd, ḥamdan kathīran ṭayyiban mubārakan fīh.',
    translationEn: 'Our Lord, and to You belongs all praise — an abundant, beautiful, blessed praise [fitting Your greatness].',
    translationAm: 'ጌታችን ሆይ! ምስጋና ሁሉ ላንተ ይሁን፤ የተትረፈረፈ፣ ያማረ፣ የተባረከበት የሆነ ምስጋና።',
    explanationEn: 'Rifa\'ah ibn Rafi\' narrated: We were praying behind the Prophet ﷺ. When he raised his head from Ruku\' and said \'Sami\' Allahu liman hamidah\', a man behind him said: \'Rabbana wa lakal-hamd, hamdan katheeran tayyiban mubarakan feeh\'. When the prayer ended, the Prophet asked: \'Who spoke those words?\' The man replied: \'I did, O Messenger of Allah.\' The Prophet ﷺ said: \'I saw over thirty angels racing to write it down first!\' [Sahih al-Bukhari].',
    explanationAr: 'حديث عظيم في صحيح البخاري. قال النبي ﷺ: «رَأَيْتُ بِضْعَةً وَثَلَاثِينَ مَلَكًا يَبْتَدِرُونَهَا أَيُّهُمْ يَكْتُبُهَا أَوَّلُ». جمع بين الحمد الدائم والبركة والطيب الخالص لله.',
    hadithReference: 'Sahih al-Bukhari 799, Sahih Muslim 477',
    authenticityGrade: 'Muttafaqun \'Alayh (Agreed Upon)',
    isEssential: true
  },

  // 13. STANDING STRAIGHT - Extended Tahmeed (Prophetic Sunnah)
  {
    id: 'standing_tahmeed_extended',
    positionNumber: 13,
    positionCategory: 'rising',
    positionNameEn: 'Standing Straight • Extended Heavenly Tahmeed',
    positionNameAr: 'الاعتدال قائماً • التحميد النبوي العظيم (مِلْءَ السَّمَاوَاتِ)',
    positionNameAm: 'ቀጥ ብሎ መቆም • ሰማያትና ምድርን የሞላ ምስጋና',
    postureDescriptionEn: 'Standing in deep gratitude and reflection before descending to prostration.',
    postureDescriptionAr: 'يقال بعد رَبَّنَا وَلَكَ الْحَمْدُ استزادة في الثناء على الله تعالى.',
    ruling: 'sunnah',
    rulingLabelEn: 'Sunnah (Sahih Muslim)',
    rulingLabelAr: 'سنة نبوية جليلة في صحيح مسلم',
    repeatCount: 1,
    titleEn: 'Extended Praise Filling the Heavens & Earth',
    titleAr: 'تحميد: مِلْءَ السَّمَاوَاتِ وَمِلْءَ الْأَرْضِ',
    arabicText: 'مِلْءَ السَّمَاوَاتِ وَمِلْءَ الْأَرْضِ، وَمِلْءَ مَا بَيْنَهُمَا، وَمِلْءَ مَا شِئْتَ مِنْ شَيْءٍ بَعْدُ، أَهْلَ الثَّنَاءِ وَالْمَجْدِ، أَحَقُّ مَا قَالَ الْعَبْدُ، وَكُلُّنَا لَكَ عَبْدٌ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ.',
    transliteration: 'Mil’a-s-samāwāti wa mil’a-l-arḍ, wa mil’a mā baynahumā, wa mil’a mā shi’ta min shay’in ba‘d. Ahla-th-thanā’i wa-l-majd, aḥaqqu mā qāla-l-‘abd, wa kullunā laka ‘abd. Allāhumma lā māni‘a limā a‘ṭayt, wa lā mu‘ṭiya limā mana‘t, wa lā yanfa‘u dha-l-jaddi minka-l-jadd.',
    translationEn: '[Praise] filling the heavens and filling the earth, filling whatever is between them, and filling whatever else You will thereafter. O Possessor of all praise and glory! The truest words a servant can utter — and all of us are Your servants: O Allah, none can withhold what You have granted, none can grant what You have withheld, and no worldly fortune can profit the wealthy against You [for all greatness is from You].',
    translationAm: 'ሰማያትንና ምድርን የሞላ፣ በመካከላቸው ያለውን የሞላ፣ ከዚያም በኋላ አንተ የሻኸውን ነገር ሁሉ የሞላ ምስጋና። የምስጋናና የክብር ባለቤት ሆይ! አንድ ባሪያ ከተናገረው ሁሉ እጅግ እውነተኛው ቃል (ሁላችንም ያንተ ባሪያዎች ነን)፡ አላህ ሆይ! የሰጠኸውን ከልካይ የለም፤ የከለከልከውንም ሰጪ የለም፤ ባለጸጋንም ሀብቱ ከአንተ ዘንድ ምንም አይጠቅመውም።',
    explanationEn: 'Narrated by Abu Sa\'id al-Khudri and Ibn Abbas in Sahih Muslim. The Prophet ﷺ would lengthen his standing after Ruku\' reciting this comprehensive praise that glorifies divine decree and sovereignty.',
    explanationAr: 'كان رسول الله ﷺ إذا رفع رأسه من الركوع قال هذا الدعاء الجليل. فيه الإقرار بملء الكون حمداً وتسبيحاً، والإذعان بأن الملك والعطاء والمنع بيد الله وحده لا شريك له.',
    hadithReference: 'Sahih Muslim 477, Sahih al-Bukhari 844',
    authenticityGrade: 'Sahih Muslim (Authentic)',
    isEssential: false
  },

  // 14. TAKBIR FOR SUJUD
  {
    id: 'takbir_sujud',
    positionNumber: 14,
    positionCategory: 'sujud',
    positionNameEn: 'Prostration • Takbir for Descending into Sujud',
    positionNameAr: 'الهوي إلى السجود • تكبيرة الانتقال',
    positionNameAm: 'ወደ ሱጁድ መውረድ • ተክቢራ',
    postureDescriptionEn: 'Descend smoothly onto knees or hands, saying Allahu Akbar without raising hands.',
    postureDescriptionAr: 'الهوي للسجود بالتكبير ووضع الركبتين ثم اليدين أو العكس بخشوع.',
    ruling: 'obligatory',
    rulingLabelEn: 'Obligatory Transition Takbir',
    rulingLabelAr: 'واجب تكبير الانتقال',
    repeatCount: 1,
    titleEn: 'Takbir of Transition into Prostration',
    titleAr: 'تكبيرة الهوي إلى السجود',
    arabicText: 'اللهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    translationEn: 'Allah is the Greatest.',
    translationAm: 'አላህ ከሁሉ በላይ ታላቅ ነው።',
    explanationEn: 'The Prophet ﷺ would utter the Takbir when descending into prostration, submitting the highest part of his body (forehead) onto the ground in utmost humility to the Creator.',
    explanationAr: 'تكبيرة الانتقال تعلن انتقال العبد من ركن القيام إلى قمة الخضوع والتذلل في السجود.',
    hadithReference: 'Sahih al-Bukhari 789, Sahih Muslim 392',
    authenticityGrade: 'Muttafaqun \'Alayh (Highest Authenticity)',
    isEssential: true
  },

  // 15. SUJUD TASBEEH - Essential (Subhana Rabbiya al-A'la)
  {
    id: 'sujud_tasbeeh_essential',
    positionNumber: 15,
    positionCategory: 'sujud',
    positionNameEn: 'Prostration (Sujud) • Essential Tasbeeh (Glory to my Lord the Most High)',
    positionNameAr: 'السجود • التسبيح الواجب (سُبْحَانَ رَبِّيَ الْأَعْلَى)',
    positionNameAm: 'ሱጁድ • ዋናው ተስቢሕ (ሱብሓነ ረቢየል አዕላ)',
    postureDescriptionEn: 'Prostrating on seven limbs: forehead firmly touching ground along with nose, two palms flat pointing towards Qibla, two knees, and tips of toes curled forward facing Qibla. Forearms raised off ground.',
    postureDescriptionAr: 'السجود على سبعة أعظم: الجبهة والأنف، والكفين مبسوطتين مضمومتي الأصابع حذو المنكبين، والركبتين، وأطراف أصابع القدمين مستقبلاً القبلة مع رفع الذراعين عن الأرض.',
    ruling: 'obligatory',
    rulingLabelEn: 'Obligatory (1x Obligatory, 3x Sunnah Perfection)',
    rulingLabelAr: 'واجب مرة واحدة، وأدنى الكمال ثلاث مرات',
    repeatCount: 3,
    repeatNoteEn: 'Recited at least 3 times calmly. Increase as desired.',
    repeatNoteAr: 'يقال ثلاث مرات على الأقل مع الطمأنينة ويستحب الزيادة في صلاة الليل والمنفرد.',
    titleEn: 'Essential Prostration Tasbeeh: Glory be to my Lord, the Most High',
    titleAr: 'تسبيح السجود: سُبْحَانَ رَبِّيَ الْأَعْلَى',
    arabicText: 'سُبْحَانَ رَبِّيَ الْأَعْلَى.',
    transliteration: 'Subḥāna Rabbiya-l-A‘lā.',
    translationEn: 'Glory be to my Lord, the Most High [above all things, supreme in status, power, and essence].',
    translationAm: 'ከሁሉ በላይ የበላይ የሆነው ጌታዬ ጥራት ይገባው።',
    explanationEn: 'When the verse was revealed: "Glorify the name of your Lord, the Most High" (Surah Al-A\'la 87:1), the Prophet ﷺ said: "Place this in your Sujud" [Abu Dawud]. Sujud is the absolute pinnacle of humility: placing one\'s face upon the dust while glorifying the Most High.',
    explanationAr: 'لما نزلت: ﴿سَبِّحِ اسْمَ رَبِّكَ الْأَعْلَى﴾، قال النبي ﷺ: «اجْعَلُوهَا فِي سُجُودِكُمْ». ويجتمع في السجود غاية التواضع بوضع الوجه في التراب مع غاية التعظيم بوصف الرب بالعلو المطلق.',
    hadithReference: 'Sunan Abi Dawud 869, Sahih Muslim 772',
    authenticityGrade: 'Sahih (Authentic)',
    isEssential: true
  },

  // 16. SUJUD TASBEEH - Prophetic Subhanak Allahumma
  {
    id: 'sujud_tasbeeh_subhanak',
    positionNumber: 16,
    positionCategory: 'sujud',
    positionNameEn: 'Prostration • Sunnah Du\'a (Subhanak Allahumma Rabbana)',
    positionNameAr: 'السجود • سنة نبوية جامعة (سُبْحَانَكَ اللَّهُمَّ رَبَّنَا وَبِحَمْدِكَ)',
    positionNameAm: 'ሱጁድ • የሱናህ ዱዓእ (ሱብሓነከል-ሏሁመ ረበና)',
    postureDescriptionEn: 'Recited in Sujud alongside essential Tasbeeh.',
    postureDescriptionAr: 'يقال بعد تسبيح السجود، استجابة لأمر الله في سورة النصر.',
    ruling: 'sunnah',
    rulingLabelEn: 'Sunnah (Bukhari & Muslim)',
    rulingLabelAr: 'سنة مؤكدة في الصحيحين',
    repeatCount: 1,
    titleEn: 'Sunnah Prostration Du\'a: Glory to You O Allah & Forgive Me',
    titleAr: 'دعاء السجود: سُبْحَانَكَ اللَّهُمَّ رَبَّنَا وَبِحَمْدِكَ، اللَّهُمَّ اغْفِرْ لِي',
    arabicText: 'سُبْحَانَكَ اللَّهُمَّ رَبَّنَا وَبِحَمْدِكَ، اللَّهُمَّ اغْفِرْ لِي.',
    transliteration: 'Subḥānak Allāhumma Rabbanā wa bi-ḥamdika, Allāhumma-ghfir lī.',
    translationEn: 'Glory is to You, O Allah our Lord, and praise is Yours. O Allah, forgive me.',
    translationAm: 'አላህ ጌታችን ሆይ! ጥራት ይገባህ፤ ምስጋናም ላንተ ይሁን፤ አላህ ሆይ! ምህረትህን ለግሰኝ።',
    explanationEn: 'Aisha reported that the Prophet ﷺ frequently recited this in his prostrations in his final months following the revelation of Surat an-Nasr (110:3): "Then exalt [Him] with praise of your Lord and ask forgiveness of Him. Indeed, He is ever Accepting of repentance."',
    explanationAr: 'كان النبي ﷺ يكثر من هذا الدعاء في ركوعه وسجوده امتثالاً لقول الله تعالى: ﴿فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا﴾.',
    hadithReference: 'Sahih al-Bukhari 817, Sahih Muslim 484',
    authenticityGrade: 'Muttafaqun \'Alayh (Agreed Upon)',
    isEssential: false
  },

  // 17. SUJUD TASBEEH - Forgiveness for All Sins
  {
    id: 'sujud_dua_dhanbi',
    positionNumber: 17,
    positionCategory: 'sujud',
    positionNameEn: 'Prostration • Comprehensive Du\'a for All Sins',
    positionNameAr: 'السجود • دعاء المغفرة الشاملة لجميع الذنوب',
    positionNameAm: 'ሱጁድ • ሁሉን አቀፍ የሀጢአት ምህረት ዱዓእ',
    postureDescriptionEn: 'Supplicating while closest to the Divine Throne in the prostrating state.',
    postureDescriptionAr: 'التضرع بخشوع في موضع القرب الإلهي.',
    ruling: 'sunnah',
    rulingLabelEn: 'Sunnah (Sahih Muslim - Stressed)',
    rulingLabelAr: 'سنة جليلة في صحيح مسلم',
    repeatCount: 1,
    titleEn: 'Comprehensive Forgiveness: Minor & Major, Open & Secret Sins',
    titleAr: 'دعاء المغفرة: اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ',
    arabicText: 'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلَانِيَتَهُ وَسِرَّهُ.',
    transliteration: 'Allāhumma-ghfir lī dhanbī kullah, diqqahū wa jillah, wa awwalahū wa ākhirah, wa ‘alāniyatahū wa sirrah.',
    translationEn: 'O Allah, forgive me all my sins: the small and the great, the first and the last, the open and the secret.',
    translationAm: 'አላህ ሆይ! ሀጢአቴን በሙሉ ማረኝ፤ ትንሹንም ትልቁንም፣ የመጀመሪያውንም የመጨረሻውንም፣ ግልጹንም ድብቁንም ሁሉ።',
    explanationEn: 'Abu Hurairah reported that the Messenger of Allah ﷺ used to say this in his Sujud [Sahih Muslim]. The Prophet ﷺ also stated: "The closest a servant is to his Lord is when he is in prostration, so increase your supplications therein!" [Sahih Muslim 482].',
    explanationAr: 'عن أبي هريرة رضي الله عنه أن رسول الله ﷺ كان يقول في سجوده: «اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ...». وقال ﷺ: «أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ فَأَكْثِرُوا الدُّعَاءَ».',
    hadithReference: 'Sahih Muslim 483',
    authenticityGrade: 'Sahih Muslim (Authentic)',
    isEssential: false
  },

  // 18. SITTING BETWEEN PROSTRATIONS - Rabbi-ghfir li
  {
    id: 'sitting_rabbi_ghfir_li',
    positionNumber: 18,
    positionCategory: 'sitting_between',
    positionNameEn: 'Sitting Between Prostrations • Essential Du\'a (My Lord Forgive Me)',
    positionNameAr: 'الجلوس بين السجدتين • الاستغفار الواجب (رَبِّ اغْفِرْ لِي)',
    positionNameAm: 'በሁለቱ ሱጁዶች መካከል መቀመጥ • ጌታዬ ሆይ ማረኝ',
    postureDescriptionEn: 'Rise saying Allahu Akbar, sit calmly (Iftirash) on left foot laid flat, right foot upright on toes, hands rested on knees/thighs.',
    postureDescriptionAr: 'الرفع بالتكبير والافتراش: الجلوس على الرجل اليسرى ونصب اليمنى مع وضع اليدين على الفخذين والطمأنينة التامة.',
    ruling: 'obligatory',
    rulingLabelEn: 'Obligatory (Wajib - Said at least once, Sunnah twice or more)',
    rulingLabelAr: 'واجب مرة واحدة وسنة تكراره مرتين أو ثلاثاً',
    repeatCount: 2,
    repeatNoteEn: 'Repeated 2 times or more with peaceful stillness.',
    repeatNoteAr: 'يكرر مرتين على الأقل بطمأنينة وسكينة.',
    titleEn: 'Sitting Between Prostrations: My Lord, Forgive Me',
    titleAr: 'دعاء الجلوس بين السجدتين: رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي',
    arabicText: 'رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي.',
    transliteration: 'Rabbi-ghfir lī, Rabbi-ghfir lī.',
    translationEn: 'My Lord forgive me! My Lord forgive me!',
    translationAm: 'ጌታዬ ሆይ ማረኝ! ጌታዬ ሆይ ማረኝ!',
    explanationEn: 'Hudhaifah reported that the Prophet ﷺ would sit between the two prostrations and repeat: \'Rabbi-ghfir li, Rabbi-ghfir li\', and his sitting was almost as long as his prostration [Abu Dawud, An-Nasa\'i, Ibn Majah]. Hurrying through this sitting without tranquility invalidates the prayer.',
    explanationAr: 'عن حذيفة رضي الله عنه أن النبي ﷺ كان يقعد بين السجدتين نحواً من سجوده ويقول: «رَبِّ اغْفِرْ لِي رَبِّ اغْفِرْ لِي». والاطمئنان في هذا الركن ركن بإجماع الفقهاء.',
    hadithReference: 'Sunan Abi Dawud 874, Sunan an-Nasa\'i 1145, Sunan Ibn Majah 897',
    authenticityGrade: 'Sahih (Authentic)',
    isEssential: true
  },

  // 19. SITTING BETWEEN PROSTRATIONS - Comprehensive 7 Blessings
  {
    id: 'sitting_allahumma_ghfir_li',
    positionNumber: 19,
    positionCategory: 'sitting_between',
    positionNameEn: 'Sitting Between Prostrations • Comprehensive 7-Gift Invocation',
    positionNameAr: 'الجلوس بين السجدتين • الدعاء النبوي الجامع للسبع خصال',
    positionNameAm: 'በሁለቱ ሱጁዶች መካከል • ሰባቱን ጸጋዎች ያካተተ ታላቅ ዱዓእ',
    postureDescriptionEn: 'Sitting in serene stillness, seeking mercy, guidance, wellness, and sustenance.',
    postureDescriptionAr: 'يقال في الجلسة بين السجدتين لتحصيل خيري الدنيا والآخرة.',
    ruling: 'sunnah',
    rulingLabelEn: 'Sunnah (Sunan Abi Dawud & At-Tirmidhi)',
    rulingLabelAr: 'سنة نبوية مأثورة في السنن',
    repeatCount: 1,
    titleEn: 'The 7 Gifts: Forgiveness, Mercy, Guidance, Wellness & Provision',
    titleAr: 'دعاء السبع خصال: اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي',
    arabicText: 'اللَّهُمَّ اغْفِرْ لِي، وَارْحَمْنِي، وَاهْدِنِي، وَعَافِنِي، وَارْزُقْنِي، وَاجْبُرْنِي، وَارْفَعْنِي.',
    transliteration: 'Allāhumma-ghfir lī, warḥamnī, wahdinī, wa ‘āfinī, warzuqnī, wajburnī, warfa‘nī.',
    translationEn: 'O Allah, forgive me, have mercy on me, guide me, grant me health and well-being, provide for me, mend all my brokenness, and elevate my rank.',
    translationAm: 'አላህ ሆይ! ማረኝ፤ እዘንልኝ፤ ምራኝ፤ ጤንነትን ለግሰኝ፤ ሲሳይን ስጠኝ፤ ጉድለቴን ሙላልኝ፤ ማዕረጌንም ከፍ አድርግልኝ።',
    explanationEn: 'Ibn Abbas (may Allah be pleased with him) reported that the Messenger of Allah ﷺ used to say between the two prostrations: "Allahumma-ghfir li, warhamni, wahdini, wa \'afini, warzuqni..." [Abu Dawud, Tirmidhi]. This supplication encompasses every spiritual and worldly necessity.',
    explanationAr: 'حديث رواه ابن عباس في سنن أبي داود والترمذي. جمع فيه النبي ﷺ جوامع الخير: المغفرة للذنوب، والرحمة، والهداية، والعافية من الأمراض، والرزق الحلال، وجبر النقص، والرفعة في الدارين.',
    hadithReference: 'Sunan Abi Dawud 850, Jami\' at-Tirmidhi 284',
    authenticityGrade: 'Sahih (Authentic)',
    isEssential: false
  },

  // 20. SECOND SUJUD & RISING
  {
    id: 'second_sujud',
    positionNumber: 20,
    positionCategory: 'sujud',
    positionNameEn: 'The Second Prostration • Sujud & Takbir for Rising',
    positionNameAr: 'السجدة الثانية • التسبيح والدعاء والتكبير للنهوض',
    positionNameAm: 'ሁለተኛው ሱጁድ • ተስቢሕና ለመነሳት የሚደረግ ተክቢራ',
    postureDescriptionEn: 'Descend with Takbir into second Sujud, repeat Subhana Rabbiya al-A\'la 3x, then rise to next Rak\'ah or Tashahhud sitting.',
    postureDescriptionAr: 'التكبير والسجود الثاني كالاول تماماً، ثم التكبير للجلوس للتشهد أو القيام للركعة التالية.',
    ruling: 'pillar',
    rulingLabelEn: 'Pillar (Every Rak\'ah requires two Sujuds)',
    rulingLabelAr: 'ركن في كل ركعة (لا تتم ركعة إلا بسجدتين)',
    repeatCount: 3,
    titleEn: 'Second Prostration (Mirror of First)',
    titleAr: 'السجدة الثانية وما يقال فيها',
    arabicText: 'سُبْحَانَ رَبِّيَ الْأَعْلَى.',
    transliteration: 'Subḥāna Rabbiya-l-A‘lā.',
    translationEn: 'Glory be to my Lord, the Most High.',
    translationAm: 'ከሁሉ በላይ የበላይ የሆነው ጌታዬ ጥራት ይገባው።',
    explanationEn: 'Every Rak\'ah contains two prostrations separated by a tranquil sitting. After the second prostration, one either sits for the Tashahhud (after 2nd Rak\'ah) or rises with Takbir to begin the subsequent Rak\'ah.',
    explanationAr: 'تكرار السجود مرتين في كل ركعة لتوكيد التذلل والخضوع والافتفار إلى الله تعالى.',
    hadithReference: 'Sahih al-Bukhari 789, Sahih Muslim 392',
    authenticityGrade: 'Muttafaqun \'Alayh (Highest Authenticity)',
    isEssential: true
  },

  // 21. FIRST TASHAHHUD (AT-TAHIYYAT)
  {
    id: 'first_tashahhud',
    positionNumber: 21,
    positionCategory: 'tashahhud',
    positionNameEn: 'The Tashahhud (Attahiyyat) • First & Final Sitting',
    positionNameAr: 'التشهد (التحيات لله) • تشهد ابن مسعود المتفق عليه',
    positionNameAm: 'ተሸሁድ (አተሒያቱ) • የመጀመሪያና የመጨረሻ ተሸሁድ',
    postureDescriptionEn: 'Sitting (Iftirash in 1st Tashahhud, Tawarruk in final), left hand open on left knee, right hand clenched in a fist with thumb touching middle finger while the index finger points forward towards Qibla, raising or vibrating it slightly during supplication.',
    postureDescriptionAr: 'الجلوس مفترشاً في الأول ومتوركاً في الأخير، وبسط اليد اليسرى على الركبة وقبض أصابع اليمنى وتحليق الإبهام مع الوسطى والإشارة بالسبابة.',
    ruling: 'obligatory',
    rulingLabelEn: 'Obligatory in 1st Sitting, Pillar in Final Sitting',
    rulingLabelAr: 'واجب في التشهد الأول، وركن في التشهد الأخير',
    repeatCount: 1,
    titleEn: 'The Tashahhud of Abdullah ibn Mas\'ud',
    titleAr: 'التشهد المبارك: التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ',
    arabicText: 'التَّحِيَّاتُ لِلَّهِ، وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ.',
    transliteration: 'At-taḥiyyātu li-llāhi wa-ṣ-ṣalawātu wa-ṭ-ṭayyibāt, as-salāmu ‘alayka ayyuha-n-Nabiyyu wa raḥmatu-llāhi wa barakātuh, as-salāmu ‘alaynā wa ‘alā ‘ibādi-llāhi-ṣ-ṣāliḥīn, ash-hadu allā ilāha illa-llāh, wa ash-hadu anna Muḥammadan ‘abduhū wa rasūluh.',
    translationEn: 'All greetings, compliments, prayers, and pure words belong to Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no deity worthy of worship except Allah, and I bear witness that Muhammad is His servant and Messenger.',
    translationAm: 'ክብር ሁሉ፣ ሶላቶችና መልካም ነገሮች በሙሉ ለአላህ ይገባሉ። አንተ ነቢይ ሆይ! ሰላም፣ የአላህ እዝነትና በረከቶቹ ባንተ ላይ ይሁን። ሰላም በእኛና በመልካሞቹ የአላህ ባሪያዎች ላይ ሁሉ ይሁን። ከአላህ በስተቀር በእውነት የሚመለክ አምላክ እንደሌለ እመሰክራለሁ፤ ሙሐመድም የአላህ ባሪያና መልእክተኛው መሆናቸውን እመሰክራለሁ።',
    explanationEn: 'Abdullah ibn Mas\'ud said: "The Messenger of Allah ﷺ took my hand between his two hands and taught me the Tashahhud just as he taught me a Surah of the Quran" [Bukhari & Muslim]. When one says "Peace be upon us and upon the righteous servants of Allah", it reaches every righteous servant in the heavens and the earth.',
    explanationAr: 'أصح تشهد رواه البخاري ومسلم عن ابن مسعود قال: علمني رسول الله ﷺ التشهد وكفي بين كفيه كما يعلمني السورة من القرآن. وقول: «وعلى عباد الله الصالحين» يصيب كل عبد صالح في السماء والأرض.',
    hadithReference: 'Sahih al-Bukhari 831, Sahih Muslim 402',
    authenticityGrade: 'Muttafaqun \'Alayh (Highest Authenticity)',
    isEssential: true
  },

  // 22. AS-SALAT AL-IBRAHIMIYYAH (DUROOD)
  {
    id: 'salat_ibrahimiyyah',
    positionNumber: 22,
    positionCategory: 'ibrahimiyyah',
    positionNameEn: 'Final Sitting • As-Salat Al-Ibrahimiyyah (Blessings upon the Prophet)',
    positionNameAr: 'التشهد الأخير • الصلاة الإبراهيمية على النبي وآله',
    positionNameAm: 'የመጨረሻ ተሸሁድ • ኢብራሂሚያ ሰለዋት በነቢዩ ﷺ ላይ',
    postureDescriptionEn: 'Seated in Tawarruk position in the final Rak\'ah, continuing the pointer finger gesture, reciting blessings upon the Prophet ﷺ.',
    postureDescriptionAr: 'الجلوس متوركاً في التشهد الأخير وإخراج الرجل اليسرى من جهة اليمين ونصب اليمنى أو إفراشها، وقراءة الصلاة الإبراهيمية.',
    ruling: 'pillar',
    rulingLabelEn: 'Pillar (Rukun in the Final Sitting before Salam)',
    rulingLabelAr: 'ركن في التشهد الأخير عند الشافعية والحنابلة',
    repeatCount: 1,
    titleEn: 'The Abrahamic Prayer: Blessings upon Muhammad & Ibrahim',
    titleAr: 'الصلاة الإبراهيمية: اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
    arabicText: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ.',
    transliteration: 'Allāhumma ṣalli ‘alā Muḥammadin wa ‘alā āli Muḥammad, kamā ṣallayta ‘alā Ibrāhīma wa ‘alā āli Ibrāhīm, innaka Ḥamīdun Majīd. Allāhumma bārik ‘alā Muḥammadin wa ‘alā āli Muḥammad, kamā bārakta ‘alā Ibrāhīma wa ‘alā āli Ibrāhīm, innaka Ḥamīdun Majīd.',
    translationEn: 'O Allah, bestow Your grace, honor, and blessings upon Muhammad and upon the family of Muhammad, as You bestowed grace upon Ibrahim and upon the family of Ibrahim; indeed, You are Praiseworthy and Glorious. O Allah, bless Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim; indeed, You are Praiseworthy and Glorious.',
    translationAm: 'አላህ ሆይ! በኢብራሂምና በኢብራሂም ቤተሰቦች ላይ እዝነት እንዳወረድክ ሁሉ በሙሐመድና በሙሐመድ ቤተሰቦች ላይ እዝነትህን አውርድ፤ አንተ ምስጉንና የላቅክ ነህና። አላህ ሆይ! በኢብራሂምና በኢብራሂም ቤተሰቦች ላይ በረከትን እንዳወረድክ ሁሉ በሙሐመድና በሙሐመድ ቤተሰቦች ላይ በረከትህን አውርድ፤ አንተ ምስጉንና የላቅክ ነህና።',
    explanationEn: 'When the companions asked the Prophet ﷺ: "O Messenger of Allah, we know how to send salam upon you, but how should we send Salah upon you?" He taught them this exact wording [Sahih al-Bukhari & Muslim]. Reciting it connects the believer to the prophetic lineage of Ibrahim and Muhammad (peace be upon them).',
    explanationAr: 'أصح صيغ الصلاة على النبي ﷺ لحديث كعب بن عجرة المتفق عليه حين سأل الصحابة: كيف نصلي عليك؟ فعلمهم إياها. جمعت بين الصلاة والبركة لنبينا وآله وإبراهيم وآله عليهم الصلاة والسلام.',
    hadithReference: 'Sahih al-Bukhari 3370, Sahih Muslim 406',
    authenticityGrade: 'Muttafaqun \'Alayh (Highest Authenticity)',
    isEssential: true
  },

  // 23. SUPPLICATION BEFORE SALAM - The 4 Fitnahs Protection
  {
    id: 'dua_four_trials',
    positionNumber: 23,
    positionCategory: 'pre_salam',
    positionNameEn: 'Before Salam • Seeking Refuge from the 4 Trials (Must-Recite)',
    positionNameAr: 'قبل التسليم • الاستعاذة من أربع فتن (سنة مؤكدة أمر بها النبي ﷺ)',
    positionNameAm: 'ከማሰላመት በፊት • ከአራቱ ፈተናዎች መጠበቂያ ዱዓእ (ታላቅ ሱናህ)',
    postureDescriptionEn: 'Seated just before turning head for Salam, supplicating with urgency for divine protection.',
    postureDescriptionAr: 'يقال بعد الصلاة الإبراهيمية وقبل التسليم مباشرة، وكان بعض السلف يأمر بإعادة الصلاة لمن نسيه لعظم شأنه.',
    ruling: 'sunnah',
    rulingLabelEn: 'Sunnah Mu\'akkadah (Commanded by the Prophet ﷺ)',
    rulingLabelAr: 'سنة مؤكدة أمر النبي ﷺ بها في الصحيحين',
    repeatCount: 1,
    titleEn: 'Protection from the 4 Destructive Trials',
    titleAr: 'الاستعاذة من عذاب جهنم والقبر وفتنة المحيا والممات والمسيح الدجال',
    arabicText: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ.',
    transliteration: 'Allāhumma innī a‘ūdhu bika min ‘adhābi jahannam, wa min ‘adhābi-l-qabr, wa min fitnati-l-maḥyā wa-l-mamāt, wa min sharri fitnati-l-Masīḥi-d-Dajjāl.',
    translationEn: 'O Allah, I seek refuge in You from the punishment of Hellfire, from the punishment of the grave, from the trials of life and death, and from the evil of the trial of the False Messiah (Al-Masih ad-Dajjal).',
    translationAm: 'አላህ ሆይ! ከጀሀነም ቅጣት፣ ከመቃብር ቅጣት፣ ከህይወትና ከሞት ፈተናዎች፣ እንዲሁም ከውሸታሙ መሲሕ (ደጃል) ፈተና ክፋት ባንተ እጠበቃለሁ።',
    explanationEn: 'Abu Hurairah reported: The Messenger of Allah ﷺ said: "When any of you finishes the last Tashahhud, he should seek refuge with Allah from four things: from the torment of Hell, from the torment of the grave, from the trials of life and death, and from the evil of the False Messiah" [Sahih Muslim 588]. Tawus (one of the great early scholars) used to ask his son: "Did you recite this before Salam?" If he said no, he ordered him to repeat the prayer!',
    explanationAr: 'أمر النبي ﷺ به فقال: «إِذَا فَرَغَ أَحَدُكُمْ مِنَ التَّشَهُّدِ الْآخِرِ فَلْيَسْتَعِذْ بِاللَّهِ مِنْ أَرْبَعٍ...». كان طاوس بن كيسان يأمر ابنه بإعادة الصلاة إذا تركه لعظم أهميته.',
    hadithReference: 'Sahih Muslim 588, Sahih al-Bukhari 1377',
    authenticityGrade: 'Muttafaqun \'Alayh (Highest Authenticity)',
    isEssential: true
  },

  // 24. SUPPLICATION BEFORE SALAM - Abu Bakr's Du'a (I have wronged myself)
  {
    id: 'dua_abu_bakr',
    positionNumber: 24,
    positionCategory: 'pre_salam',
    positionNameEn: 'Before Salam • Abu Bakr\'s Supplication (Taught by the Prophet)',
    positionNameAr: 'قبل التسليم • دعاء الصديق رضي الله عنه (علمه إياه رسول الله ﷺ)',
    positionNameAm: 'ከማሰላመት በፊት • አቡበክር ሲዲቅ የተማሩት ዱዓእ',
    postureDescriptionEn: 'Seated before the concluding Salam, pleading with absolute humility for divine forgiveness.',
    postureDescriptionAr: 'يقال قبل التسليم تذللاً واعترافاً بالتقصير واستجلاباً لرحمة الغفور الرحيم.',
    ruling: 'sunnah',
    rulingLabelEn: 'Sunnah (Bukhari & Muslim)',
    rulingLabelAr: 'سنة مأثورة في الصحيحين',
    repeatCount: 1,
    titleEn: 'Abu Bakr\'s Du\'a: I Have Wronged Myself Immensely',
    titleAr: 'دعاء الصديق: اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا',
    arabicText: 'اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا، وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ وَارْحَمْنِي، إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ.',
    transliteration: 'Allāhumma innī ẓalamtu nafsī ẓulman kathīrā, wa lā yaghfiru-dh-dhunūba illā Ant, fa-ghfir lī maghfiratan min ‘indika warḥamnī, innaka Anta-l-Ghafūru-r-Raḥīm.',
    translationEn: 'O Allah, I have wronged myself with immense wrongdoing, and none can forgive sins except You. So grant me forgiveness directly from You and have mercy upon me; indeed You are the Ever-Forgiving, the Most Merciful.',
    translationAm: 'አላህ ሆይ! እኔ ነፍሴን ብዙ በደል በድያለሁ፤ ከአንተ በስተቀር ሀጢአቶችን የሚምር ማንም የለምና ከአንተ ዘንድ የሆነን ምህረት ማረኝ፤ እዘንልኝም፤ አንተ እጅግ መሀሪ በጣም አዛኝ ነህና።',
    explanationEn: 'Abu Bakr as-Siddiq said to the Prophet ﷺ: "Teach me a supplication with which I may pray in my Salat." The Prophet ﷺ taught him this humble, touching prayer [Sahih al-Bukhari & Muslim]. If Abu Bakr—the greatest man after the prophets—prayed this, how much more do we need it!',
    explanationAr: 'سأل أبو بكر الصديق رضي الله عنه النبي ﷺ: علمني دعاء أدعو به في صلاتي، فعلمه هذا الدعاء النوراني المتفق عليه. جمع بين الاعتراف بالذنب، وتوحيد الله بالمغفرة، وسؤال الرحمة الخالصة.',
    hadithReference: 'Sahih al-Bukhari 834, Sahih Muslim 2705',
    authenticityGrade: 'Muttafaqun \'Alayh (Agreed Upon)',
    isEssential: false
  },

  // 25. SUPPLICATION BEFORE SALAM - Mu'adh's Supplication (Help me remember You)
  {
    id: 'dua_muadh_dhikr',
    positionNumber: 25,
    positionCategory: 'pre_salam',
    positionNameEn: 'Before Salam • Mu\'adh\'s Beloved Supplication',
    positionNameAr: 'قبل التسليم أو بعده • وصية النبي ﷺ لمعاذ (أَعِنِّي عَلَى ذِكْرِكَ)',
    positionNameAm: 'ከማሰላመት በፊት ወይም በኋላ • የነቢዩ ﷺ ለሙዓዝ ያደረጉት ውድ ምክር',
    postureDescriptionEn: 'Seated before or immediately following the Tasleem.',
    postureDescriptionAr: 'يقال دبر الصلاة (قبل السلام أو بعده مباشرة) عملاً بوصية المصطفى ﷺ.',
    ruling: 'sunnah',
    rulingLabelEn: 'Sunnah (Sunan Abi Dawud & An-Nasa\'i)',
    rulingLabelAr: 'سنة عظيمة في سنن أبي داود والنسائي',
    repeatCount: 1,
    titleEn: 'Help Me Remember You, Thank You & Worship You Excellently',
    titleAr: 'دعاء: اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    arabicText: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ، وَشُكْرِكَ، وَحُسْنِ عِبَادَتِكَ.',
    transliteration: 'Allāhumma a‘innī ‘alā dhikrika, wa shukrika, wa ḥusni ‘ibādatik.',
    translationEn: 'O Allah, assist me in remembering You, expressing gratitude to You, and worshipping You in the best manner.',
    translationAm: 'አላህ ሆይ! አንተን በማስታወስ፣ አንተን በማመስገን እና አምልኮትህን በሚያምር መልኩ በመፈጸም ላይ አግዘኝ።',
    explanationEn: 'The Prophet ﷺ took Mu\'adh ibn Jabal by the hand and said: "O Mu\'adh, by Allah I love you! I advise you, O Mu\'adh: never leave saying at the end of every prayer: Allahumma a\'inni \'ala dhikrika wa shukrika wa husni \'ibadatik" [Abu Dawud, An-Nasa\'i].',
    explanationAr: 'أخذ النبي ﷺ بيد معاذ وقال: «يَا مُعَاذُ، وَاللَّهِ إِنِّي لَأُحِبُّكَ، أُوصِيكَ يَا مُعَاذُ لَا تَدَعَنَّ فِي دُبُرِ كُلِّ صَلَاةٍ تَقُولُ: اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ».',
    hadithReference: 'Sunan Abi Dawud 1522, Sunan an-Nasa\'i 1303',
    authenticityGrade: 'Sahih (Authentic)',
    isEssential: false
  },

  // 26. THE CONCLUDING SALAM (TASLEEM)
  {
    id: 'tasleem_right_left',
    positionNumber: 26,
    positionCategory: 'tasleem',
    positionNameEn: 'Concluding Salam (Tasleem) • Turning to Right and Left',
    positionNameAr: 'التسليم • الالتفات يميناً ويساراً ختام الصلاة',
    positionNameAm: 'ተስሊም • ወደ ቀኝና ወደ ግራ ዞሮ ሰላምታ ማውረድ',
    postureDescriptionEn: 'Turn head slowly to the right until the white of the right cheek is visible from behind saying the Salam, then turn head to the left repeating the Salam.',
    postureDescriptionAr: 'الالتفات يميناً مع قوله: «السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ»، ثم الالتفات يساراً مع قوله: «السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ».',
    ruling: 'pillar',
    rulingLabelEn: 'Pillar (The 1st Salam is a Pillar; 2nd is Sunnah)',
    rulingLabelAr: 'ركن التسليمة الأولى، وسنة التسليمة الثانية',
    repeatCount: 2,
    repeatNoteEn: 'Once to the right, once to the left.',
    repeatNoteAr: 'تسليمة عن اليمين وتسليمة عن الشمال.',
    titleEn: 'The Concluding Tasleem: Peace and Mercy of Allah',
    titleAr: 'التسليم: السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
    arabicText: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ.',
    transliteration: 'As-salāmu ‘alaykum wa raḥmatu-llāh.',
    translationEn: 'May the peace and mercy of Allah be upon you.',
    translationAm: 'የአላህ ሰላምና እዝነት በእናንተ ላይ ይሁን።',
    explanationEn: 'The Prophet ﷺ said: "...and its conclusion is the Taslim" [Abu Dawud]. Ibn Mas\'ud reported that the Prophet ﷺ used to make Salam to his right until the whiteness of his cheek was seen, and to his left until the whiteness of his left cheek was seen [Sahih Muslim].',
    explanationAr: 'قال النبي ﷺ: «وَتَحْلِيلُهَا التَّسْلِيمُ». بالتسليم يخرج المصلي من الصلاة مسلماً على إخوانه والملائكة الكرام الكاتبين عن يمينه وشماله.',
    hadithReference: 'Sahih Muslim 582, Sunan Abi Dawud 996',
    authenticityGrade: 'Muttafaqun \'Alayh (Highest Authenticity)',
    isEssential: true
  },

  // 27. POST-SALAT ADHKAR - Astaghfirullah (3 times)
  {
    id: 'post_salat_astaghfirullah',
    positionNumber: 27,
    positionCategory: 'post_salat',
    positionNameEn: 'Immediately Post-Salam • Astaghfirullah (3 Times)',
    positionNameAr: 'عقب السلام مباشرة • الاستغفار ثلاثاً',
    positionNameAm: 'ከሶላት በኋላ ወዲያውኑ • አስተግፊሩላህ (3 ጊዜ)',
    postureDescriptionEn: 'Remaining seated in place facing Qibla or turning towards the congregation.',
    postureDescriptionAr: 'البقاء في مكان الصلاة والبدء بالاستغفار استدراكاً لما قد يقع في الصلاة من سهو أو نقص.',
    ruling: 'sunnah',
    rulingLabelEn: 'Sunnah Mu\'akkadah (Sahih Muslim)',
    rulingLabelAr: 'سنة مؤكدة في صحيح مسلم',
    repeatCount: 3,
    repeatNoteEn: 'Recite three times immediately upon completing the final Tasleem.',
    repeatNoteAr: 'يقال ثلاث مرات عقب انتهاء التسليمتين مباشرة.',
    titleEn: 'Seeking Forgiveness Immediately After Prayer',
    titleAr: 'الاستغفار ثلاثاً: أَسْتَغْفِرُ اللَّهَ',
    arabicText: 'أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ.',
    transliteration: 'Astaghfiru-llāh, Astaghfiru-llāh, Astaghfiru-llāh.',
    translationEn: 'I seek the forgiveness of Allah. I seek the forgiveness of Allah. I seek the forgiveness of Allah.',
    translationAm: 'ከአላህ ምህረትን እለምናለሁ፤ ከአላህ ምህረትን እለምናለሁ፤ ከአላህ ምህረትን እለምናለሁ።',
    explanationEn: 'Thawban reported: "When the Messenger of Allah ﷺ finished his prayer, he would ask for forgiveness three times..." [Sahih Muslim]. Asking forgiveness immediately after performing the greatest act of worship reminds the believer that no matter how hard we try, our worship remains deficient before the majestic perfection of Allah.',
    explanationAr: 'عن ثوبان قال: كَانَ رَسُولُ اللَّهِ ﷺ إِذَا انْصَرَفَ مِنْ صَلَاتِهِ اسْتَغْفَرَ ثَلَاثًا. والاستغفار بعد الطاعة يجبر الخلل والنقص ويمنع العجب والغرور.',
    hadithReference: 'Sahih Muslim 591',
    authenticityGrade: 'Sahih Muslim (Authentic)',
    isEssential: true
  },

  // 28. POST-SALAT ADHKAR - Allahumma Antas Salam
  {
    id: 'post_salat_allahumma_antas_salam',
    positionNumber: 28,
    positionCategory: 'post_salat',
    positionNameEn: 'Post-Salam • Allahumma Antas-Salam',
    positionNameAr: 'عقب السلام • دعاء السلام (اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ)',
    positionNameAm: 'ከሶላት በኋላ • አላሁመ አንተስ-ሰላም',
    postureDescriptionEn: 'Recited immediately following the 3x Astaghfirullah.',
    postureDescriptionAr: 'يقال موصولاً بالاستغفار الثلاث.',
    ruling: 'sunnah',
    rulingLabelEn: 'Sunnah (Sahih Muslim)',
    rulingLabelAr: 'سنة نبوية في صحيح مسلم',
    repeatCount: 1,
    titleEn: 'You are Peace and from You Comes Peace',
    titleAr: 'دعاء: اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ',
    arabicText: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ.',
    transliteration: 'Allāhumma Anta-s-Salāmu wa minka-s-salām, tabārakta yā Dha-l-Jalāli wa-l-Ikrām.',
    translationEn: 'O Allah, You are Peace, and from You comes all peace. Blessed are You, O Owner of Majesty and Honor.',
    translationAm: 'አላህ ሆይ! አንተ ሰላም ነህ፤ ሰላምም ከአንተ ብቻ ነው የሚመጣው፤ አንተ የክብርና የልዕልና ባለቤት ሆይ በረከትህ በዛ።',
    explanationEn: 'Continuing Thawban\'s hadith in Sahih Muslim: The Prophet ﷺ would recite this right after Astaghfirullah (3x). As-Salam is one of the 99 Beautiful Names of Allah, meaning the One Free from all defects and the Source of peace in this world and the Hereafter.',
    explanationAr: 'تمام حديث ثوبان في صحيح مسلم. السلام اسم من أسماء الله الحسنى، ومعناه السالم من كل عيب والواهب للسلام في الدنيا والآخرة.',
    hadithReference: 'Sahih Muslim 591',
    authenticityGrade: 'Sahih Muslim (Authentic)',
    isEssential: true
  },

  // 29. POST-SALAT ADHKAR - Great Tahlil
  {
    id: 'post_salat_tahlil',
    positionNumber: 29,
    positionCategory: 'post_salat',
    positionNameEn: 'Post-Salam • The Grand Monotheistic Tahlil',
    positionNameAr: 'عقب السلام • التهليل الأكبر ونفي الشريك وإثبات القدرة',
    positionNameAm: 'ከሶላት በኋላ • ታላቁ የተውሂድ ተህሊል',
    postureDescriptionEn: 'Seated in remembrance, glorifying the oneness of Allah.',
    postureDescriptionAr: 'يقال عقب كل صلاة مكتوبة إعلاناً للتوحيد وشكر النعمة.',
    ruling: 'sunnah',
    rulingLabelEn: 'Sunnah (Bukhari & Muslim)',
    rulingLabelAr: 'سنة مؤكدة في الصحيحين',
    repeatCount: 1,
    titleEn: 'The Great Tahlil of Divine Sovereignty',
    titleAr: 'التهليل: لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    arabicText: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ. لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ.',
    transliteration: 'Lā ilāha illa-llāhu waḥdahū lā sharīka lah, lahu-l-mulku wa lahu-l-ḥamd, wa Huwa ‘alā kulli shay’in qadīr. Allāhumma lā māni‘a limā a‘ṭayt, wa lā mu‘ṭiya limā mana‘t, wa lā yanfa‘u dha-l-jaddi minka-l-jadd. Lā ḥawla wa lā quwwata illā bi-llāh.',
    translationEn: 'There is no god worthy of worship except Allah alone, with no partner. His is the sovereignty, and His is all praise, and He has power over all things. O Allah, none can withhold what You grant, none can grant what You withhold, and no fortune can benefit the fortunate against You. There is no might nor power except by Allah.',
    translationAm: 'ከአላህ በስተቀር በእውነት የሚመለክ አምላክ የለም፤ እርሱ አንድ ነው፤ አጋርም የለውም፤ ንግስና የርሱ ነው፤ ምስጋናም የርሱ ነው፤ እርሱ በሁሉም ነገር ላይ ቻይ ነው። አላህ ሆይ! የሰጠኸውን ከልካይ የለም፤ የከለከልከውንም ሰጪ የለም፤ ባለጸጋንም ሀብቱ ከአንተ ዘንድ ምንም አይጠቅመውም። ኃይልም ብልሃትም በአላህ እንጂ በማንም የለም።',
    explanationEn: 'Narrated by Al-Mughirah ibn Shu\'bah: The Messenger of Allah ﷺ used to say this at the conclusion of every prescribed prayer [Sahih al-Bukhari & Muslim]. Abdullah ibn az-Zubayr also recited it following every prayer.',
    explanationAr: 'روى البخاري ومسلم عن المغيرة بن شعبة أن رسول الله ﷺ كان يقول في دبر كل صلاة مكتوبة هذا الذكر الجامع لأصول التوحيد ونفي الشريك والتوكل التام.',
    hadithReference: 'Sahih al-Bukhari 844, Sahih Muslim 593',
    authenticityGrade: 'Muttafaqun \'Alayh (Highest Authenticity)',
    isEssential: true
  },

  // 30. POST-SALAT ADHKAR - Ayat al-Kursi (2:255)
  {
    id: 'post_salat_ayat_kursi',
    positionNumber: 30,
    positionCategory: 'post_salat',
    positionNameEn: 'Post-Salam • Ayat al-Kursi (The Verse of the Throne)',
    positionNameAr: 'عقب السلام • آية الكرسي (ضمان دخول الجنة)',
    positionNameAm: 'ከሶላት በኋላ • አያተል ኩርሲይ (የጀነት ቁልፍ)',
    postureDescriptionEn: 'Reciting the greatest verse of the Holy Quran after concluding prayer.',
    postureDescriptionAr: 'قراءة آية الكرسي بعد كل صلاة مفروضة قبل مغادرة المصلى.',
    ruling: 'sunnah',
    rulingLabelEn: 'Sunnah (Sunan an-Nasa\'i al-Kubra - Authentic)',
    rulingLabelAr: 'سنة مؤكدة رتب عليها أجر دخول الجنة',
    repeatCount: 1,
    titleEn: 'Ayat al-Kursi: The Greatest Verse in the Quran',
    titleAr: 'آية الكرسي: اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    arabicText: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ.',
    transliteration: 'Allāhu lā ilāha illā Huwa-l-Ḥayyu-l-Qayyūm, lā ta’khudhuhū sinatun wa lā nawm, lahū mā fi-s-samāwāti wa mā fi-l-arḍ, man dha-lladhī yashfa‘u ‘indahū illā bi-idhnih, ya‘lamu mā bayna aydīhim wa mā khalfahum, wa lā yuḥīṭūna bi-shay’in min ‘ilmihī illā bi-mā shā’, wasi‘a kursiyyuhu-s-samāwāti wa-l-arḍ, wa lā ya’ūduhū ḥifẓuhumā, wa Huwa-l-‘Aliyyu-l-‘Aẓīm.',
    translationEn: 'Allah — there is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what is behind them, and they encompass not a thing of His knowledge except for what He wills. His Kursi (Throne) extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
    translationAm: 'አላህ ከእርሱ በስተቀር በእውነት የሚመለክ አምላክ የለም፤ ህያው የሁሉ ነገር አስተናባሪ ነው። እንቅልፍም ሆነ ማንቀላፋት አትይዘውም፤ በሰማያትና በምድር ያለው ሁሉ የርሱ ብቻ ነው። እርሱ ዘንድ በፈቃዱ ቢሆን እንጂ የሚያማልድ ማነው? በፊታቸው ያለውንና ከኋላቸው ያለውን ሁሉ ያውቃል፤ እርሱ ከሻው በስተቀር ከእውቀቱ በምንም ነገር ላይ አያካብቡም። ኩርሲዩ ሰማያትንና ምድርን ሰፋ፤ መጠበቃቸውም አያደክመውም፤ እርሱም የላቀ ታላቅ ነው።',
    explanationEn: 'The Messenger of Allah ﷺ said: "Whoever recites Ayat al-Kursi immediately after each prescribed prayer, nothing stands between him and entering Paradise except death" [Sunan an-Nasa\'i al-Kubra, graded Sahih by Ibn Hibban and Al-Albani].',
    explanationAr: 'قال رسول الله ﷺ: «مَنْ قَرَأَ آيَةَ الْكُرْسِيِّ فِي دُبُرِ كُلِّ صَلَاةٍ مَكْتُوبَةٍ لَمْ يَمْنَعْهُ مِنْ دُخُولِ الْجَنَّةِ إِلَّا أَنْ يَمُوتَ». رواه النسائي في السنن الكبرى وابن حبان وصححه الألباني.',
    hadithReference: 'Sunan an-Nasa\'i al-Kubra 9848, Sahih Ibn Hibban 3/273',
    authenticityGrade: 'Sahih (Authentic)',
    isEssential: true
  },

  // 31. POST-SALAT ADHKAR - 33-33-33 Tasbeeh
  {
    id: 'post_salat_tasbeeh',
    positionNumber: 31,
    positionCategory: 'post_salat',
    positionNameEn: 'Post-Salam • The 33-33-33 Tasbeeh with 100th Seal',
    positionNameAr: 'عقب السلام • التسبيح الثلاثيني وتمامه المئة',
    positionNameAm: 'ከሶላት በኋላ • የ33-33-33 ተስቢሕና የመቶው ማሟያ',
    postureDescriptionEn: 'Count on the joints of the right hand fingers (preferred Sunnah) or use the interactive digital counter.',
    postureDescriptionAr: 'عقد التسبيح بالأنامل وأصابع اليد اليمنى سنة عن النبي ﷺ.',
    ruling: 'sunnah',
    rulingLabelEn: 'Sunnah Mu\'akkadah (Sahih Muslim - Sins forgiven even if like sea foam)',
    rulingLabelAr: 'سنة مؤكدة تكفر الخطايا وإن كانت مثل زبد البحر',
    repeatCount: 100,
    repeatNoteEn: '33x SubhanAllah + 33x Alhamdulillah + 33x Allahu Akbar + 1x Seal = 100 total.',
    repeatNoteAr: '٣٣ سبحان الله + ٣٣ الحمد لله + ٣٣ الله أكبر + ١ تمام المئة بالتهليل = ١٠٠.',
    titleEn: 'The Prophetic Tasbeeh Formula: 33x + 33x + 33x + Seal',
    titleAr: 'التسبيح والتحميد والتكبير دبر كل صلاة',
    arabicText: 'سُبْحَانَ اللَّهِ (٣٣) • الْحَمْدُ لِلَّهِ (٣٣) • اللهُ أَكْبَرُ (٣٣) • لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ (١).',
    transliteration: 'Subḥāna-llāh (33x) • Al-ḥamdu li-llāh (33x) • Allāhu Akbar (33x) • Lā ilāha illa-llāhu waḥdahū lā sharīka lah, lahu-l-mulku wa lahu-l-ḥamd, wa Huwa ‘alā kulli shay’in qadīr (1x).',
    translationEn: 'SubhanAllah (Glory be to Allah, 33 times) • Alhamdulillah (All praise is due to Allah, 33 times) • Allahu Akbar (Allah is the Greatest, 33 times) • Completed to 100 with: "There is no god worthy of worship except Allah alone, without partner. His is the kingdom, His is the praise, and He has power over all things."',
    translationAm: 'ሱብሓነላህ (33 ጊዜ) • አልሐምዱሊላህ (33 ጊዜ) • አላሁ አክበር (33 ጊዜ) • የመቶው ማሟያ (1 ጊዜ)፡ ከአላህ በስተቀር በእውነት የሚመለክ አምላክ የለም፤ እርሱ አንድ ነው፤ አጋርም የለውም፤ ንግስና የርሱ ነው፤ ምስጋናም የርሱ ነው፤ እርሱ በሁሉም ነገር ላይ ቻይ ነው።',
    explanationEn: 'Abu Hurairah reported that the Messenger of Allah ﷺ said: "Whoever glorifies Allah (SubhanAllah) 33 times, praises Allah (Alhamdulillah) 33 times, and magnifies Allah (Allahu Akbar) 33 times after every prayer, making 99, and then seals the 100th saying: \'La ilaha illa-llahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamdu wa Huwa \'ala kulli shay\'in qadeer\' — all his sins will be forgiven, even if they are like the foam of the sea!" [Sahih Muslim 597].',
    explanationAr: 'قال رسول الله ﷺ: «مَنْ سَبَّحَ اللَّهَ فِي دُبُرِ كُلِّ صَلَاةٍ ثَلَاثًا وَثَلَاثِينَ، وَحَمِدَ اللَّهَ ثَلَاثًا وَثَلَاثِينَ، وَكَبَّرَ اللَّهَ ثَلَاثًا وَثَلَاثِينَ، فَتِلْكَ تِسْعَةٌ وَتِسْعُونَ، وَقَالَ تَمَامَ الْمِائَةِ: لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، غُفِرَتْ خَطَايَاهُ وَإِنْ كَانَتْ مِثْلَ زَبَدِ الْبَحْرِ».',
    hadithReference: 'Sahih Muslim 597',
    authenticityGrade: 'Sahih Muslim (Authentic)',
    isEssential: true
  }
];

// Helper to get recitations by category
export const getRecitationsByCategory = (category: PositionCategory): SalatRecitation[] => {
  return SALAT_RECITATIONS.filter(r => r.positionCategory === category);
};

// Summary metrics
export const SALAT_SUMMARY_STATS = {
  totalRecitations: SALAT_RECITATIONS.length,
  totalPositions: SALAT_POSITION_CATEGORIES.length,
  essentialCount: SALAT_RECITATIONS.filter(r => r.isEssential).length,
  hadithSources: ['Sahih al-Bukhari', 'Sahih Muslim', 'Sunan Abi Dawud', 'Jami\' at-Tirmidhi', 'Sunan an-Nasa\'i']
};
