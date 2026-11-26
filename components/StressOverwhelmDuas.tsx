import React, { useState, useEffect } from 'react';
import { 
  Heart, Shield, Sparkles, Clock, Users, Copy, Check, 
  AlertCircle, BookOpen, HelpCircle, ArrowRight, RefreshCw, 
  Smile, Flame, Compass, Feather 
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { DuaAudioPlayer } from './DuaAudioPlayer';

interface StressDuaItem {
  id: string;
  title: Record<string, string>;
  category: 'anxiety' | 'family' | 'debt' | 'grief' | 'powerless';
  arabicText: string;
  transliterationText: string;
  translationText: Record<string, string>;
  reference: string;
  hadithContext: Record<string, string>;
  benefits: Record<string, string>;
  recommendedRepetition?: string;
  tags: string[];
}

export const STRESS_DUAS: StressDuaItem[] = [
  {
    id: 'master_prophetic_refuge',
    title: {
      en: "The Prophet's ﷺ Master Refuge: 8 Crushing Burdens",
      ar: "دعاء النبي ﷺ الجامع للاستعاذة من ثمانية هموم قاصمة",
      am: "የነቢዩ ﷺ ታላቅ መጠለያ፡ ከ8 ከባባድ ጭንቀቶች መሸሸጊያ",
      har: "የነቢዩ ﷺ ታላቅ መጠለያ፡ ከ8 ከባባድ ጭንቀቶች መሸሸጊያ"
    },
    category: 'anxiety',
    arabicText: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
    transliterationText: "Allāhumma innī aʿūdhu bika mina-l-hammi wal-ḥazan, wa-l-ʿajzi wal-kasal, wa-l-jubni wal-bukhl, wa-ḍalaʿid-dayni wa-ghalabatir-rijāl.",
    translationText: {
      en: "O Allah, I seek refuge in You from worry (anxiety about the future) and grief (sorrow over the past), from incapacity (helplessness) and laziness, from cowardice and stinginess, and from the heavy burden of debt and being overpowered by people.",
      ar: "اللهم إني ألتجئ إليك وأعتصم بك من الهم بالمستقبل والغم والحزن على ما مضى، ومن العجز عن فعل الخير والكسل مع القدرة عليه، ومن الجبن عن الإقدام والبخل بالمال والعطاء، ومن ثقل الديون وقهر الرجال وتسلطهم.",
      am: "አላህ ሆይ! ወደፊት ከሚመጣ ጭንቀትና ባለፈው ነገር ከማዘን፣ ከአቅም ማጣትና ከስንፍና፣ ከፍርሃትና ከስስት፣ ከዕዳ መክበድና ከሰዎች የበላይ መሆን (መጨቆን) በአንተ እጠበቃለሁ።",
      har: "አላህ ሆይ! ወደፊት ከሚመጣ ጭንቀትና ባለፈው ነገር ከማዘን፣ ከአቅም ማጣትና ከስንፍና፣ ከፍርሃትና ከስስት፣ ከዕዳ መክበድና ከሰዎች የበላይ መሆን በአንተ እጠበቃለሁ።"
    },
    reference: "Sahih al-Bukhari 2893, 5425, 6363",
    hadithContext: {
      en: "Anas ibn Malik (رضي الله عنه) narrated: 'I used to serve the Messenger of Allah ﷺ whenever he halted at any journey or stay, and I would constantly hear him reciting this supplication very frequently.' It was also taught to Abu Umamah when he was overwhelmed by worries and debt in the mosque.",
      ar: "عن أنس بن مالك رضي الله عنه قال: كنتُ أخدم رسول الله صلى الله عليه وسلم إذا نزل، فكنتُ أسمعه يكثر أن يقول هذا الدعاء المبارك. وعلمه النبي لأبي أمامة حين رآه مهموماً مكروباً قد لزمته الديون في المسجد فأذهب الله همه وقضى دينه.",
      am: "አነስ ኢብኑ ማሊክ (ረ.ዐ) እንደተረኩት፡ 'የአላህን መልእክተኛ ﷺ ሁልጊዜ አገለግላቸው ነበር፤ ይህችን ዱዓእ በብዛት ሲያደርጉ እሰማቸው ነበር።' እንዲሁም አቡ ኡማማህ በጭንቀትና በዕዳ ተከበው በመስጂድ በተቀመጡበት ወቅት ነቢዩ ﷺ አስተምረዋቸው ጭንቀታቸው ተወግዶ ዕዳቸው ተከፍሎላቸዋል።",
      har: "አነስ ኢብኑ ማሊክ (ረ.ዐ) እንዳወሩት፡ 'የአላህን መልእክተኛ ﷺ ሁልጊዜ አገለግላቸው ነበር፤ ይህችን ዱዓእ በብዛት ሲያደርጉ እሰማቸው ነበር።' ጭንቀትንና ዕዳን ለማስወገድ ታላቅ መፍትሔ ናት።"
    },
    benefits: {
      en: "Pairs 8 interconnected spiritual and psychological diseases that cause burnout and family breakdown: (1) Worry [future] & Grief [past]; (2) Inability & Laziness; (3) Cowardice & Greed; (4) Crushing Debt & Social Domination.",
      ar: "يجمع الدعاء بين أربعة أزواج متقابلة تشمل أصول الكرب النفسي والأسري: الهم والحزن (الزمان)، العجز والكسل (الإرادة والقدرة)، الجبن والبخل (الأخلاق)، والدين وقهر الناس (الاجتماع والمال).",
      am: "የሰው ልጅን የሚያደክሙ 8 ታላላቅ ፈተናዎችን በአራት ጥንዶች ያካተተ ፍቱን ዱዓእ ነው። ጭንቀትን ያቃልላል፣ የአእምሮ ሰላም ይሰጣል፣ ከሰው ጭቆና ይጠብቃል።",
      har: "የሰው ልጅን የሚያደክሙ 8 ታላላቅ ፈተናዎችን ያካተተ ፍቱን ዱዓእ ነው። የአእምሮ ሰላም ይሰጣል።"
    },
    recommendedRepetition: "Every morning & evening (3x), and whenever feeling panic, grief, or family overwhelm",
    tags: ["Prophetic Anchor", "Anxiety", "Family Overwhelm", "Debt", "Burnout"]
  },
  {
    id: 'dua_distress_karb',
    title: {
      en: "Supplication for Great Distress & Overwhelm (Duʿāʾ al-Karb)",
      ar: "دعاء الكرب وتفويض الأمر لله تعالى",
      am: "የጭንቅ እና የመከራ ጊዜ ዱዓእ",
      har: "የጭንቅ እና የመከራ ወቅቲ ዱዓእ"
    },
    category: 'anxiety',
    arabicText: "اللَّهُمَّ رَحْمَتَكَ أَرْجُو، فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ، وَأَصْلِحْ لِي شَأْنِي كُلَّهُ، لَا إِلَهَ إِلَّا أَنْتَ",
    transliterationText: "Allāhumma raḥmataka arjū, falā takilnī ilā nafsī ṭarfata ʿayn, wa-aṣliḥ lī sha'nī kullah, lā ilāha illā ant.",
    translationText: {
      en: "O Allah, it is Your mercy that I hope for, so do not leave me to myself even for the blink of an eye, and set right for me all of my affairs. There is no deity worthy of worship except You.",
      ar: "اللهم إني أرجو وأؤمل سعة رحمتك، فلا تتركني إلى حولي وقوتي وعجزي طرفة عين، وأصلح لي أمري كله في نفسي وأهلي ورزقي، لا إله إلا أنت.",
      am: "አላህ ሆይ! እዝነትህን እከጅላለሁ፤ ለዓይን ጥቅሻ ያህል እንኳን ለነፍሴ አትተወኝ፤ ጉዳዮቼን በሙሉ አብጅልኝ፤ ከአንተ በስተቀር በእውነት የሚመለክ አምላክ የለም።",
      har: "አላህ ሆይ! እዝነትህን እከጅላለሁ፤ ለዓይን ጥቅሻ ያህል እንኳን ለነፍሴ አትተወኝ፤ ጉዳዮቼን በሙሉ አብጅልኝ።"
    },
    reference: "Sunan Abi Dawud 5090, Sahih Ibn Hibban",
    hadithContext: {
      en: "The Messenger of Allah ﷺ said: 'The supplications of the distressed person are: [this du'a].' It teaches total surrender of our fragile capacity to Allah's infinite guardianship.",
      ar: "قال رسول الله ﷺ: «دَعَوَاتُ الْمَكْرُوبِ: اللَّهُمَّ رَحْمَتَكَ أَرْجُو فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ...»",
      am: "የአላህ መልእክተኛ ﷺ እንዲህ ብለዋል፡ 'የተጨነቀ ሰው ዱዓዎች እነዚህ ናቸው...' በአላህ እዝነት ስር ሙሉ በሙሉ መጠለልን ያስተምራል።",
      har: "የአላህ መልእክተኛ ﷺ የተጨነቀ ሰው ይህችን ዱዓእ እንዲያደርግ አስተምረዋል።"
    },
    benefits: {
      en: "Instantly brings humility and psychological surrender, lifting the illusion that you must solve everything by yourself.",
      ar: "تفريج الكرب الشديد ونزع ثقل التفكير والمسؤوليات التي لا يطيقها العبد بمفرده.",
      am: "ሁሉንም ነገር ብቻዬን ማስተካከል አለብኝ የሚለውን ጫና ያስወግዳል፣ ውስጣዊ እረፍት ይሰጣል።",
      har: "ውስጣዊ እረፍት ይሰጣል።"
    },
    recommendedRepetition: "Repeat continuously during moments of acute stress or panic",
    tags: ["Distress", "Mental Peace", "Surrender", "Mercy"]
  },
  {
    id: 'yunus_whale_relief',
    title: {
      en: "The Cry of Prophet Yunus (عليه السلام) in the Darkness",
      ar: "دعوة ذي النون (يونس عليه السلام) في ظلمات الكرب",
      am: "የነቢዩላህ ዩኑስ (ዐ.ሰ) በጭንቅ ውስጥ ያደረጉት ዱዓእ",
      har: "የነቢዩላህ ዩኑስ (ዐ.ሰ) ዱዓእ"
    },
    category: 'grief',
    arabicText: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    transliterationText: "Lā ilāha illā anta subḥānaka innī kuntu mina-ẓ-ẓālimīn.",
    translationText: {
      en: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
      ar: "لا إله إلا أنت تنزيهاً لك عن كل نقص وظلم، إني كنت من الظالمين لنفسي المقصرين في حقك فاغفر لي وفرج كربتي.",
      am: "ከአንተ በስተቀር በእውነት የሚመለክ አምላክ የለም፤ ጥራት ይገባህ፤ እኔ በእርግጥ ከበዳዮቹ ነበርኩ።",
      har: "ከአንተ በስተቀር አምላክ የለም፤ ጥራት ይገባህ፤ እኔ ከበዳዮቹ ነበርኩ።"
    },
    reference: "Quran 21:87; Jami` at-Tirmidhi 3505",
    hadithContext: {
      en: "The Prophet ﷺ declared: 'No Muslim man ever calls upon Allah with this supplication regarding anything at all, except that Allah answers his call.'",
      ar: "قال رسول الله ﷺ: «دَعْوَةُ ذِي النُّونِ إِذْ دَعَا وَهُوَ فِي بَطْنِ الْحُوتِ... لَمْ يَدْعُ بِهَا رَجُلٌ مُسْلِمٌ فِي شَيْءٍ قَطُّ إِلَّا اسْتَجَابَ اللَّهُ لَهُ».",
      am: "ነቢዩ ﷺ እንዲህ ብለዋል፡ 'ማንኛውም ሙስሊም በዚህች ዱዓእ በማንኛውም ነገር አላህን አይጠይቅም አላህ የጠየቀውን የመለሰለት ቢሆን እንጂ።'",
      har: "ነቢዩ ﷺ ይህች ዱዓእ ተቀባይነት እንዳላት አረጋግጠዋል።"
    },
    benefits: {
      en: "Dissolves claustrophobic distress, feeling trapped in family conflicts, or feeling suffocated by life situations.",
      ar: "ينجي من كل ضائقة خانقة وغم أسري مستحکم كما نجى الله يونس من ظلمات بطن الحوت والبحر والليل.",
      am: "በችግር ውስጥ ተዘግተው ለተጨነቁ ሰዎች መውጫና ብርሃን የሚሰጥ ታላቅ ዱዓእ ነው።",
      har: "ችግርንና ጨለማን የሚያስወግድ ታላቅ ዱዓእ ነው።"
    },
    recommendedRepetition: "Repeat 40 times or frequently in prostration (Sujud)",
    tags: ["Quranic", "Instant Relief", "Miraculous", "Tawhid"]
  },
  {
    id: 'family_hearts_harmony',
    title: {
      en: "Dua for Family Harmony, Quenching Anger & Household Peace",
      ar: "دعاء تأليف القلوب الأسري وإصلاح ذات البين والسلام المنزلي",
      am: "የቤተሰብ ፍቅርንና ሰላምን ማጠናከሪያ፣ ቁጣን ማብረጃ ዱዓእ",
      har: "የቤተሰብ ፍቅርንና ሰላምን ማጠናከሪያ ዱዓእ"
    },
    category: 'family',
    arabicText: "اللَّهُمَّ أَلِّفْ بَيْنَ قُلُوبِنَا، وَأَصْلِحْ ذَاتَ بَيْنِنَا، وَاهْدِنَا سُبُلَ السَّلَامِ، وَنَجِّنَا مِنَ الظُّلُمَاتِ إِلَى النُّورِ، وَبَارِكْ لَنَا فِي أَسْمَاعِنَا وَأَبْصَارِنَا وَقُلُوبِنَا وَأَزْوَاجِنَا وَذُرِّيَّاتِنَا",
    transliterationText: "Allāhumma allif bayna qulūbinā, wa-aṣliḥ dhāta bayninā, wahdinā subula-s-salām, wa-najjinā mina-ẓ-ẓulumāti ila-n-nūr, wa-bārik lanā fī asmāʿinā wa-abṣārinā wa-qulūbinā wa-azwājinā wa-dhurriyyātinā.",
    translationText: {
      en: "O Allah, reconcile between our hearts, mend our relationships, guide us to the pathways of peace, save us from darkness into light, and bless us in our hearing, our sight, our hearts, our spouses, and our offspring.",
      ar: "اللهم اجمع قلوب أفراد أسرتنا على المحبة والمودة، وأصلح الخلافات بيننا، واهدنا طرق الطمأنينة والسلام، ونجنا من ظلمات الشقاق والنزاع، وبارك لنا في أزواجنا وأولادنا وصحتنا.",
      am: "አላህ ሆይ! በልቦቻችን መካከል ፍቅርን ጣል፤ በመካከላችን ያለውን ግንኙነት አብጅልን፤ ወደ ሰላም መንገዶች ምራን፤ ከጨለማዎች ወደ ብርሃን አውጣን፤ በጆሯችን፣ በዓይኖቻችን፣ በልቦቻችን፣ በትዳር አጋሮቻችን እና በልጆቻችን ላይ በረከትን ስጠን።",
      har: "አላህ ሆይ! በልቦቻችን መካከል ፍቅርን ጣል፤ በመካከላችን ያለውን ግንኙነት አብጅልን፤ በቤተሰቦቻችን ላይ በረከትን ስጠን።"
    },
    reference: "Sunan Abi Dawud 969, Al-Hakim",
    hadithContext: {
      en: "Narrated by Abdullah ibn Mas'ud (رضي الله عنه), taught as part of comprehensive prayers for communal harmony and domestic tranquility.",
      ar: "من جوامع دعاء ابن مسعود رضي الله عنه التي علمها الصحابة لجمع الشمل ودفع الشقاق العائلي.",
      am: "አብደላህ ኢብኑ መስዑድ (ረ.ዐ) እንዳስተማሩት በቤተሰብና በማህበረሰብ መካከል ስምምነትንና ሰላምን ለማስፈን የሚደረግ ሁለንተናዊ ዱዓእ ነው።",
      har: "በቤተሰብ መካከል ፍቅርንና ሰላምን ለማስፈን የሚደረግ ዱዓእ ነው።"
    },
    benefits: {
      en: "Softens hardened tempers, quenches household quarrels between spouses or parents and children, and invites angelic tranquillity into the home.",
      ar: "يطفئ غضب المشاحنات الزوجية والخلافات العائلية ويبث السكينة والبركة في البيوت.",
      am: "በትዳር አጋሮችና በልጆች መካከል የሚፈጠሩ ግጭቶችንና ቁጣዎችን ያበርዳል፤ በቤት ውስጥ ሰላምን ያሰፍናል።",
      har: "በትዳር አጋሮችና በልጆች መካከል ሰላምን ያሰፍናል።"
    },
    recommendedRepetition: "Recite after prayers and during family tensions",
    tags: ["Family Peace", "Spouses", "Children", "Reconciliation"]
  },
  {
    id: 'chest_expansion_grief_removal',
    title: {
      en: "The Great Prayer for Chest Expansion & Removing Heavy Sorrow",
      ar: "دعاء تفريج الأحزان الثقيلة وانشراح الصدر بالقرآن العظيم",
      am: "ልብን የማስፋትና ጥልቅ ሀዘንን የማስወገጃ ታላቅ ዱዓእ",
      har: "ልብን የማስፋትና ሀዘንን የማስወገጃ ዱዓእ"
    },
    category: 'grief',
    arabicText: "اللَّهُمَّ إِنِّي عَبْدُكَ، ابْنُ عَبْدِكَ، ابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ، أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ سَمَّيْتَ بِهِ نَفْسَكَ، أَوْ أَنْزَلْتَهُ فِي كِتَابِكَ، أَوْ عَلَّمْتَهُ أَحَدًا مِنْ خَلْقِكَ، أَوِ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الْغَيْبِ عِنْدَكَ، أَنْ تَجْعَلَ الْقُرْآنَ رَبِيعَ قَلْبِي، وَنُورَ صَدْرِي، وَجَلَاءَ حُزْنِي، وَذَهَابَ هَمِّي",
    transliterationText: "Allāhumma innī ʿabduk, ibnu ʿabdik, ibnu amatik, nāṣiyatī bi-yadik, māḍin fiyya ḥukmuk, ʿadlun fiyya qaḍā'uk, as'aluka bikulli-smin huwa lak, sammayta bihi nafsak, aw anzaltahu fī kitābik, aw ʿallamtahu aḥadan min khalqik, awi-sta'tharta bihi fī ʿilmi-l-ghaybi ʿindak, an tajʿala-l-Qur'āna rabīʿa qalbī, wa-nūra ṣadrī, wa-jalā'a ḥuznī, wa-dhahāba hammī.",
    translationText: {
      en: "O Allah, I am Your servant, son of Your servant, son of Your maidservant, my forelock is in Your hand, Your command over me is forever executed and Your decree over me is just. I ask You by every name belonging to You... to make the Quran the spring of my heart, the light of my chest, the banisher of my grief, and the reliever of my anxiety.",
      ar: "اللهم إني عبدك الخاضع لك، ناصيتي بيدك تصرفني كيف تشاء، عدل في حكمك وقضاؤك... أسألك بكل أسمائك الحسنى أن تجعل القرآن العظيم ربيعاً لقلبي ونوراً لصدري وذهاباً لحزني وهمي.",
      am: "አላህ ሆይ! እኔ ባሪያህ ነኝ፤ የባሪያህ ልጅ፣ የሴት ባሪያህ ልጅ ነኝ፤ ግንባሬ (ህይወቴ) በእጅህ ነው፤ ውሳኔህ በእኔ ላይ ተፈጻሚ ነው፤ ፍርድህም ትክክለኛ ነው... ቁርአንን የልቤ ጸደይ፣ የደረቴ ብርሃን፣ የሀዘኔ ማስወገጃ እና የጭንቀቴ ማስታገሻ እንድታደርግልኝ እጠይቅሃለሁ።",
      har: "አላህ ሆይ! እኔ ባሪያህ ነኝ፤ ቁርአንን የልቤ ጸደይ፣ የደረቴ ብርሃን፣ የሀዘኔ ማስወገጃ እንድታደርግልኝ እጠይቅሃለሁ።"
    },
    reference: "Musnad Ahmad 3712; Sahih Ibn Hibban",
    hadithContext: {
      en: "The Messenger of Allah ﷺ said: 'No servant is ever afflicted with worry or grief and says this prayer, except that Allah removes his worry and grief and replaces them with joy.' The companions asked: 'O Messenger of Allah, should we learn it?' He said: 'Yes, whoever hears it should learn it.'",
      ar: "قال رسول الله ﷺ: «مَا أَصَابَ أَحَدًا قَطُّ هَمٌّ وَلَا حَزَنٌ فَقَالَ [هَذَا الدُّعَاءَ] إِلَّا أَذْهَبَ اللَّهُ هَمَّهُ وَحَزَنَهُ، وَأَبْدَلَهُ مَكَانَهُ فَرَجًا». قَالُوا: يَا رَسُولَ اللَّهِ، يَنْبَغِي لَنَا أَنْ نَتَعَلَّمَ هَؤُلَاءِ الْكَلِمَاتِ؟ قَالَ: «أَجَلْ، يَنْبَغِي لِمَنْ سَمِعَهُنَّ أَنْ يَتَعَلَّمَهُنَّ».",
      am: "የአላህ መልእክተኛ ﷺ እንዲህ ብለዋል፡ 'ማንኛውንም ሰው ጭንቀት ወይም ሀዘን አግኝቶት ይህን ዱዓእ አይልም አላህ ጭንቀቱንና ሀዘኑን አስወግዶ በደስታና እፎይታ ቢተካለት እንጂ።' ሶሐቦች፡ 'መማር አለብን?' ብለው ሲጠይቁ 'አዎ፣ የሰማ ሁሉ ሊማረው ይገባል' አሉ።",
      har: "የአላህ መልእክተኛ ﷺ ይህ ዱዓእ ሀዘንን ወደ ደስታ እንደሚቀይር አስተምረዋል።"
    },
    benefits: {
      en: "Re-anchors the broken spirit, cleanses inner grief, and restores emotional resilience by filling the heart with the divine light of the Quran.",
      ar: "يبدل الحزن العميق والهم الجاثم على الصدر بانشراح وطمأنينة وفرح باطني.",
      am: "የተሰበረ ልብን ይጠግናል፤ የከበደን ሀዘን አስወግዶ ውስጣዊ ሰላምንና ብርሃንን ይሞላል።",
      har: "የተሰበረ ልብን ይጠግናል፤ ውስጣዊ ሰላምን ይሰጣል።"
    },
    recommendedRepetition: "Recite when feeling overwhelmed, grieving a loss, or mentally depleted",
    tags: ["Sorrow", "Depression", "Heart Light", "Quran Remedy"]
  },
  {
    id: 'burden_beyond_capacity',
    title: {
      en: "Quranic Cry: When Burdens Exceed Human Capacity",
      ar: "الدعاء القرآني لرفع ما لا طاقة للإنسان بحمله",
      am: "ከአቅም በላይ የከበደ ሸክም ሲመጣ የሚደረግ የቁርአን ዱዓእ",
      har: "ከአቅም በላይ የከበደ ሸክም ሲመጣ የሚደረግ ዱዓእ"
    },
    category: 'family',
    arabicText: "رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
    transliterationText: "Rabbanā wa-lā tuḥammilnā mā lā ṭāqata lanā bih, waʿfu ʿannā waghfir lanā warḥamnā, anta mawlānā fanṣurnā ʿala-l-qawmi-l-kāfirīn.",
    translationText: {
      en: "Our Lord, and burden us not with that which we have no ability to bear. And pardon us; and forgive us; and have mercy upon us. You are our protector, so give us victory over the disbelieving people.",
      ar: "ربنا لا تكلفنا من المشاق والمصائب والأعباء ما تضعف طاقاتنا عن احتماله، واعف عن تقصيرنا واغفر زلاتنا وارحمنا برحمتك الواسعة، أنت ناصرنا ومولانا.",
      am: "ጌታችን ሆይ! ለእኛ በሱ ላይ ምንም አቅም የሌለንን ነገር (ከባድ ሸክም) አታሸክመን፤ ይቅርም በለን፤ ምህረትም አድርግልን፤ እዘንልንም፤ አንተ ጠባቂያችን ነህ።",
      har: "ጌታችን ሆይ! አቅም የሌለንን ነገር አታሸክመን፤ ይቅርም በለን፤ እዘንልንም።"
    },
    reference: "Surah Al-Baqarah [2:286]",
    hadithContext: {
      en: "The final two verses of Surah Al-Baqarah were given directly to the Prophet ﷺ during the Miraculous Ascension (Mi'raj). The Prophet ﷺ said: 'Whoever recites the last two verses of Surah Al-Baqarah at night, they will suffice him (from every evil and anxiety).' (Bukhari & Muslim)",
      ar: "من خواتيم سورة البقرة التي أوتيها النبي ﷺ ليلة الإسراء والمعراج. قال ﷺ: «مَنْ قَرَأَ بِالْآيَتَيْنِ مِنْ آخِرِ سُورَةِ الْبَقَرَةِ فِي لَيْلَةٍ كَفَتَاهُ».",
      am: "የሱረቱል በቀራህ የመጨረሻዎቹ ሁለት አንቀጾች በዕርገት (ሚዕራጅ) ምሽት የተሰጡ ልዩ ጸጋዎች ናቸው። ነቢዩ ﷺ፡ 'በሌሊት ያነበባቸው ሰው ከክፉ ነገር ሁሉ ይበቁታል' ብለዋል።",
      har: "የሱረቱል በቀራህ የመጨረሻዎቹ ሁለት አንቀጾች ከክፉ ነገር ሁሉ ይበቃሉ።"
    },
    benefits: {
      en: "Shields against parental burnout, family exhaustion, mental collapse, and chronic feelings of inadequacy.",
      ar: "حماية تامة من الانهيار النفسي والعصبي وتحمل ما يفوق طاقة الإنسان في الأسرة والعمل.",
      am: "ከልጆችና ከቤተሰብ ኃላፊነት ብዛት የተነሳ ከሚመጣ የድካም ስሜትና ከአእምሮ ውጥረት ይጠብቃል።",
      har: "ከቤተሰብ ኃላፊነት ብዛት ከሚመጣ ድካም ይጠብቃል።"
    },
    recommendedRepetition: "Recite every single night before sleep (with verse 2:285)",
    tags: ["Quranic", "Bedtime Shield", "Overwhelm", "Family Burden"]
  },
  {
    id: 'hasbiyallahu_shield',
    title: {
      en: "The 7-Fold Suficiency Shield When Oppressed or Isolated",
      ar: "حسبي الله ونعم الوكيل: كفاية الله لدفع كل ما أهمك",
      am: "ሀስቢየላህ፡ አላህ በቂዬ ነው የሚል ባለ 7 ጊዜ የጧትና የማታ ጋሻ",
      har: "አላህ በቂዬ ነው የሚል ጋሻ"
    },
    category: 'powerless',
    arabicText: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ ۖ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    transliterationText: "Ḥasbiya-llāhu lā ilāha illā huwa ʿalayhi tawakkaltu wa-huwa rabbu-l-ʿarshi-l-ʿaẓīm.",
    translationText: {
      en: "Allah is sufficient for me; there is no deity except Him. Upon Him I have relied, and He is the Lord of the Great Throne.",
      ar: "الله وحده كافيني في كل ما يهمني ويغمّني، لا معبود بحق سواه، فوضت أمري إليه وتوكلت عليه، وهو سبحانه رب العرش العظيم.",
      am: "አላህ በቂዬ ነው፤ ከአንተ በስተቀር በእውነት የሚመለክ አምላክ የለም፤ በሱ ላይ ተመካሁ፤ እርሱም የታላቁ ዐርሽ ጌታ ነው።",
      har: "አላህ በቂዬ ነው፤ በሱ ላይ ተመካሁ።"
    },
    reference: "Surah At-Tawbah [9:129]; Sunan Abi Dawud 5081",
    hadithContext: {
      en: "Prophet Muhammad ﷺ said: 'Whoever says seven times in the morning and seven times in the evening: Hasbiya Allahu..., Allah will suffice him for whatever concerns him of the affairs of this world and the Hereafter.'",
      ar: "قال رسول الله ﷺ: «مَنْ قَالَ حِينَ يُصْبِحُ وَحِينَ يُمْسِي: حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ، سَبْعَ مَرَّاتٍ، كَفَاهُ اللَّهُ مَا أَهَمَّهُ مِنْ أَمْرِ الدُّنْيَا وَالْآخِرَةِ».",
      am: "ነቢዩ ﷺ እንዲህ ብለዋል፡ 'ጧት ሰባት ጊዜ፣ ማታም ሰባት ጊዜ [ይህችን ዱዓእ] ያለ ሰው፣ አላህ ከዱንያም ከአኺራም የሚያሳስበውን ነገር ሁሉ በቂው ይሆናል።'",
      har: "ጧት 7 ጊዜ፣ ማታም 7 ጊዜ ያለ ሰው፣ አላህ የሚያሳስበውን ነገር ሁሉ በቂው ይሆናል።"
    },
    benefits: {
      en: "Eliminates panic attacks, fear of hostile people, toxic family relatives, financial threats, or sudden bad news.",
      ar: "يدفع الخوف من الناس وظلم المتسلطين ويزرع الأمان النفسي التام في ساعات الشدة.",
      am: "ፍርሃትንና ድንጋጤን ያስወግዳል፤ ሰዎች ሊጎዱኝ ይችላሉ ከሚል ስጋት ነጻ ያደርጋል።",
      har: "ፍርሃትን ያስወግዳል፤ የአእምሮ ሰላም ይሰጣል።"
    },
    recommendedRepetition: "Recite 7 times in the morning & 7 times in the evening",
    tags: ["7x Shield", "Panic Attack", "Social Fear", "Tawakkul"]
  },
  {
    id: 'making_hard_easy',
    title: {
      en: "Dua When Facing Hard Tasks & Tangled Situations",
      ar: "دعاء تيسير العسير وتفريج العقد الصعبة",
      am: "ከባድና የተወሳሰበ ነገር ሲያጋጥም የሚደረግ ዱዓእ",
      har: "ከባድ ነገር ሲያጋጥም የሚደረግ ዱዓእ"
    },
    category: 'anxiety',
    arabicText: "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلاً، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلاً",
    transliterationText: "Allāhumma lā sahla illā mā jaʿaltahu sahlā, wa-anta tajʿalu-l-ḥazna idhā shi'ta sahlā.",
    translationText: {
      en: "O Allah, there is nothing easy except that which You make easy, and You can make difficulty (sorrow/hard ground) easy if You wish.",
      ar: "اللهم لا يوجد أمر سهل وميسر إلا ما يسرته بفضلك، وأنت سبحانك تجعل الأمر العسير الصعب سهلاً إذا شئت وقدرت.",
      am: "አላህ ሆይ! አንተ ቀላል ያደረግከው ነገር እንጂ ምንም ቀላል ነገር የለም፤ አንተ ከፈለግክ ከባዱን (ሀዘኑን) ነገር ቀላል ታደርገዋለህ።",
      har: "አላህ ሆይ! አንተ ቀላል ያደረግከው ነገር እንጂ ምንም ቀላል ነገር የለም፤ አንተ ከፈለግክ ከባዱን ነገር ቀላል ታደርገዋለህ።"
    },
    reference: "Sahih Ibn Hibban 974; Ibn as-Sunni 351",
    hadithContext: {
      en: "Narrated by Anas ibn Malik (رضي الله عنه) as the go-to supplication whenever the Prophet ﷺ or his companions encountered a stuck problem, hard decision, or complex dilemma.",
      ar: "كان النبي ﷺ يدعو به إذا استعصى عليه أمر أو واجه صعوبة في عمل أو تدبير.",
      am: "ነቢዩ ﷺ ወይም ሶሐቦች የተወሳሰበ ችግር፣ ከባድ ውሳኔ ወይም የቤተሰብ ፈተና ሲገጥማቸው የሚያደርጉት ዱዓእ ነው።",
      har: "የተወሳሰበ ችግር ሲገጥም የሚደረግ ዱዓእ ነው።"
    },
    benefits: {
      en: "Unlocks closed doors, simplifies overwhelming parental duties, exams, emotional breakdowns, and bureaucratic bottlenecks.",
      ar: "تيسير الأمور المعقدة والامتحانات والقرارات المصيرية الشاقة في الحياة والأسرة.",
      am: "የተዘጋውን መንገድ ይከፍታል፤ የከበደን የትምህርት፣ የሥራ ወይም የቤተሰብ ጉዳይ ያቃልላል።",
      har: "የተወሳሰበውን ነገር ያቃልላል።"
    },
    recommendedRepetition: "Recite when about to tackle a hard conversation, task, or family dilemma",
    tags: ["Ease", "Complicated Matters", "Family Crisis", "Exams"]
  }
];

export const StressOverwhelmDuas: React.FC = () => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [counters, setCounters] = useState<Record<string, number>>({});
  const [expandedBreakdown, setExpandedBreakdown] = useState<boolean>(true);

  useEffect(() => {
    const loadSaved = () => {
      const stored = localStorage.getItem('my-favorite-duas');
      if (stored) {
        try {
          const list = JSON.parse(stored);
          setSavedIds(list.map((d: any) => d.id));
        } catch (e) {
          console.error(e);
        }
      }
    };
    loadSaved();
    window.addEventListener('my-duas-updated', loadSaved);
    return () => window.removeEventListener('my-duas-updated', loadSaved);
  }, []);

  const toggleFavorite = (item: StressDuaItem) => {
    const stored = localStorage.getItem('my-favorite-duas');
    let current: any[] = [];
    if (stored) {
      try {
        current = JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    const exists = current.some(d => d.id === item.id);
    let updated;
    if (exists) {
      updated = current.filter(d => d.id !== item.id);
    } else {
      updated = [
        ...current,
        {
          id: item.id,
          category: 'general',
          title: item.title[language] || item.title.en,
          arabicText: item.arabicText,
          transliterationText: item.transliterationText,
          translationText: item.translationText[language] || item.translationText.en,
          reference: item.reference,
          tags: item.tags,
          timestamp: Date.now()
        }
      ];
    }
    localStorage.setItem('my-favorite-duas', JSON.stringify(updated));
    setSavedIds(updated.map(d => d.id));
    window.dispatchEvent(new Event('my-duas-updated'));
  };

  const copyDua = (item: StressDuaItem) => {
    const text = `${item.title[language] || item.title.en}\n\n${item.arabicText}\n\n${item.transliterationText}\n\n"${item.translationText[language] || item.translationText.en}"\n\n— ${item.reference}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const incrementCounter = (id: string, max = 7) => {
    setCounters(prev => {
      const current = prev[id] || 0;
      const next = current >= max ? 1 : current + 1;
      return { ...prev, [id]: next };
    });
  };

  const filteredDuas = selectedCategory === 'all' 
    ? STRESS_DUAS 
    : STRESS_DUAS.filter(d => d.category === selectedCategory);

  const categories = [
    { id: 'all', label: language === 'ar' ? 'جميع الأدعية (٨)' : (language === 'am' ? 'ሁሉም ዱዓዎች (8)' : 'All Duas (8)') },
    { id: 'anxiety', label: language === 'ar' ? 'الهم والقلق (٣)' : (language === 'am' ? 'ጭንቀትና ፍርሃት (3)' : 'Anxiety & Panic (3)') },
    { id: 'family', label: language === 'ar' ? 'الأسرة والبيت (٢)' : (language === 'am' ? 'የቤተሰብ ሰላም (2)' : 'Family Peace (2)') },
    { id: 'grief', label: language === 'ar' ? 'الحزن والضيق (٢)' : (language === 'am' ? 'ሀዘንና ድካም (2)' : 'Grief & Heart Light (2)') },
    { id: 'powerless', label: language === 'ar' ? 'كفاية الله والغلبة (١)' : (language === 'am' ? 'ከአቅም በላይ (1)' : 'Powerlessness (1)') },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Featured Master Dua Hero Card (The Prophet's Primary Refuge) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white p-6 sm:p-10 border border-emerald-500/30 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Shield size={13} className="text-emerald-400 animate-pulse" />
              <span>{language === 'ar' ? 'الحصن النبوي الأعظم' : (language === 'am' ? 'የነቢዩ ﷺ ታላቁ ጋሻ' : "The Prophet's ﷺ Master Refuge")}</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(STRESS_DUAS[0])}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  savedIds.includes(STRESS_DUAS[0].id)
                    ? 'bg-rose-500/30 border-rose-400/50 text-rose-300'
                    : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
                }`}
                title="Save to My Duas"
              >
                <Heart size={16} className={savedIds.includes(STRESS_DUAS[0].id) ? 'fill-current text-rose-400' : ''} />
              </button>

              <button
                onClick={() => copyDua(STRESS_DUAS[0])}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all cursor-pointer"
                title="Copy Du'a"
              >
                {copiedId === STRESS_DUAS[0].id ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif text-emerald-100">
              {STRESS_DUAS[0].title[language] || STRESS_DUAS[0].title.en}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-2xl leading-relaxed">
              {language === 'ar' 
                ? 'استعاذة جامعة من ثمانية أمراض نفسية وسلوكية ومالية واجتماعية تهدم الطمأنينة وتثقل كاهل الأسرة'
                : 'Seeking divine asylum from the 8 interlocking chains that cause burnout, depression, domestic conflict, and spiritual paralysis.'}
            </p>
          </div>

          {/* Central Audio & Arabic Text */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-7 border border-white/15 shadow-inner">
            <DuaAudioPlayer
              arabicText={STRESS_DUAS[0].arabicText}
              transliterationText={STRESS_DUAS[0].transliterationText}
              translationText={STRESS_DUAS[0].translationText[language] || STRESS_DUAS[0].translationText.en}
              title={STRESS_DUAS[0].title[language] || STRESS_DUAS[0].title.en}
            />
          </div>

          {/* 8-Part Detailed Anatomy Breakdown */}
          <div className="bg-emerald-950/70 border border-emerald-500/20 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                <Sparkles size={14} className="text-amber-400" />
                <span>{language === 'ar' ? 'تحليل الآفات الثماني: ٤ أزواج متقابلة' : 'Anatomy of the 8 Burdens (4 Miraculous Pairs)'}</span>
              </h4>
              <button
                onClick={() => setExpandedBreakdown(!expandedBreakdown)}
                className="text-xs text-emerald-400 hover:text-emerald-200 font-semibold cursor-pointer underline"
              >
                {expandedBreakdown 
                  ? (language === 'ar' ? 'إخفاء التحليل' : 'Hide Analysis') 
                  : (language === 'ar' ? 'عرض التحليل' : 'Show Analysis')}
              </button>
            </div>

            {expandedBreakdown && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-2">
                {/* Pair 1 */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-amber-300 tracking-wider block">
                    {language === 'ar' ? 'الزوج ١: قيد الزمان' : 'Pair 1: Time Distortions'}
                  </span>
                  <div className="font-bold text-sm text-white flex items-center gap-1.5">
                    <span className="text-amber-400">الْهَمّ</span> vs <span className="text-teal-300">الْحَزَن</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    <strong>Al-Hamm:</strong> Anxiety & dread over future unknowns.<br />
                    <strong>Al-Hazan:</strong> Paralyzing sorrow & regret over past losses.
                  </p>
                </div>

                {/* Pair 2 */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-amber-300 tracking-wider block">
                    {language === 'ar' ? 'الزوج ٢: شلل الإرادة' : 'Pair 2: Will & Action'}
                  </span>
                  <div className="font-bold text-sm text-white flex items-center gap-1.5">
                    <span className="text-amber-400">الْعَجْز</span> vs <span className="text-teal-300">الْكَسَل</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    <strong>Al-'Ajz:</strong> Incapacity & helplessness (lacking ability).<br />
                    <strong>Al-Kasal:</strong> Lethargy & apathy (having capacity but no drive).
                  </p>
                </div>

                {/* Pair 3 */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-amber-300 tracking-wider block">
                    {language === 'ar' ? 'الزوج ٣: انكسار النفس' : 'Pair 3: Heart Weakness'}
                  </span>
                  <div className="font-bold text-sm text-white flex items-center gap-1.5">
                    <span className="text-amber-400">الْجُبْن</span> vs <span className="text-teal-300">الْبُخْل</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    <strong>Al-Jubn:</strong> Cowardice, fear of conflict or hard duties.<br />
                    <strong>Al-Bukhl:</strong> Stinginess of money, patience, and warmth.
                  </p>
                </div>

                {/* Pair 4 */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-amber-300 tracking-wider block">
                    {language === 'ar' ? 'الزوج ٤: الاستعباد والقهر' : 'Pair 4: Subjugation'}
                  </span>
                  <div className="font-bold text-sm text-white flex items-center gap-1.5">
                    <span className="text-amber-400">ضَلَع الدَّيْن</span> vs <span className="text-teal-300">غَلَبَة الرِّجَال</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    <strong>Dala' ad-Dayn:</strong> Crushing financial & parental debts.<br />
                    <strong>Ghalabat ar-Rijal:</strong> Oppression, bullying, or domestic subjugation.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Hadith & Practice Note */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-xs text-emerald-200/90 border-t border-emerald-500/20">
            <span className="italic">{STRESS_DUAS[0].reference} • {STRESS_DUAS[0].hadithContext[language] || STRESS_DUAS[0].hadithContext.en}</span>
            <span className="font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold shrink-0">
              {language === 'ar' ? 'يُكرر ٣ مرات صباحاً ومساءً' : 'Recommended: 3x Morning & Evening'}
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none border ${
              selectedCategory === cat.id
                ? 'bg-primary-600 border-primary-600 text-white shadow-sm shadow-primary-600/20'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Duas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDuas.slice(1).map((item) => {
          const isSaved = savedIds.includes(item.id);
          const count = counters[item.id] || 0;

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-md bg-secondary-100 dark:bg-secondary-950/40 text-secondary-800 dark:text-secondary-300 border border-secondary-200 dark:border-secondary-800">
                      {item.tags[0]}
                    </span>
                    <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 pt-1">
                      {item.title[language] || item.title.en}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => toggleFavorite(item)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isSaved
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 text-rose-500'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500'
                      }`}
                      title={isSaved ? 'Remove from My Duas' : 'Save to My Duas'}
                    >
                      <Heart size={15} className={isSaved ? 'fill-current text-rose-500' : ''} />
                    </button>

                    <button
                      onClick={() => copyDua(item)}
                      className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all cursor-pointer"
                      title="Copy Arabic & Translation"
                    >
                      {copiedId === item.id ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                    </button>
                  </div>
                </div>

                {/* Audio & Text Player */}
                <div className="bg-slate-50/70 dark:bg-slate-850/60 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                  <DuaAudioPlayer
                    arabicText={item.arabicText}
                    transliterationText={item.transliterationText}
                    translationText={item.translationText[language] || item.translationText.en}
                    title={item.title[language] || item.title.en}
                  />
                </div>

                {/* Hadith & Psychological Benefit */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-primary-50/40 dark:bg-primary-950/20 border border-primary-100/60 dark:border-primary-900/30 text-primary-900 dark:text-primary-200 leading-relaxed">
                    <p className="font-semibold text-primary-800 dark:text-secondary-300 mb-1">
                      {language === 'ar' ? 'الأثر النفسي والروحي:' : 'Spiritual & Emotional Impact:'}
                    </p>
                    <p>{item.benefits[language] || item.benefits.en}</p>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    <span className="font-bold text-slate-600 dark:text-slate-300">{item.reference}: </span>
                    <span>{item.hadithContext[language] || item.hadithContext.en}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Repetition Counter & Frequency */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  {item.recommendedRepetition}
                </span>

                {item.id === 'hasbiyallahu_shield' || item.id === 'yunus_whale_relief' ? (
                  <button
                    onClick={() => incrementCounter(item.id, item.id === 'hasbiyallahu_shield' ? 7 : 40)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 font-bold transition-all cursor-pointer border border-emerald-200 dark:border-emerald-800 text-[11px]"
                  >
                    <span>{count === 0 ? (language === 'ar' ? 'بدء العد' : 'Tap to Count') : `${count} / ${item.id === 'hasbiyallahu_shield' ? 7 : 40}`}</span>
                    <RefreshCw size={11} className={count > 0 ? 'animate-spin-slow' : ''} />
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Grounding & Mental Wellness Guidance from the Sunnah */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
            <Feather size={18} />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 font-serif">
              {language === 'ar' ? '٤ خطوات نبوية لتفريغ التوتر العصبي وضغط الأسرة' : '4 Sunnah Strategies to Defuse Acute Family & Nervous Overwhelm'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'ar' ? 'هدي النبي ﷺ الشامل عند اشتداد الأزمات واحتدام الخلاف' : 'Holistic emotional regulation taught by the Prophet ﷺ'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pt-2">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <span className="font-extrabold text-amber-600 dark:text-amber-400 block">1. The Cold Wudhu Reset</span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              &quot;Anger and panic are from Shaytan, and he was created from fire; fire is extinguished by water.&quot; Wash your face and hands with cool water to calm the vagus nerve.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <span className="font-extrabold text-amber-600 dark:text-amber-400 block">2. Changing Physical Posture</span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              &quot;If one of you is angry while standing, let him sit down; if the anger does not leave him, let him lie down.&quot; Physically lower your elevation to reset adrenaline.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <span className="font-extrabold text-amber-600 dark:text-amber-400 block">3. Prolonging Deep Sujud</span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              Whenever a situation overwhelmed the Prophet ﷺ, he would immediately rush to pray 2 rak&apos;ahs. Placing your head on the earth discharges mental pressure.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <span className="font-extrabold text-amber-600 dark:text-amber-400 block">4. Istighfar & Salawat</span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              &quot;Whoever persists in seeking forgiveness, Allah will grant him relief from every worry and a way out of every tight spot.&quot; Say Astaghfirullah 100 times.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StressOverwhelmDuas;
