import React, { useState, useEffect } from 'react';
import { 
  Moon, Sun, Clock, Sparkles, BookOpen, Heart, Check, 
  ArrowRight, Shield, Compass, Calendar, ChevronDown, 
  ChevronUp, Play, Flame, HelpCircle, AlertCircle 
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { DuaAudioPlayer } from './DuaAudioPlayer';

interface NightIntervals {
  maghribTime: string;
  fajrTime: string;
  nightHours: number;
  nightMinutes: number;
  firstThirdStart: string;
  firstThirdEnd: string;
  middleThirdStart: string;
  middleThirdEnd: string;
  lastThirdStart: string;
  lastThirdEnd: string;
  saharStart: string;
  isCurrentlyLastThird: boolean;
  isCurrentlyNight: boolean;
}

export const TahajjudGuideSection: React.FC = () => {
  const { language } = useLanguage();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [nightIntervals, setNightIntervals] = useState<NightIntervals | null>(null);
  const [maghribInput, setMaghribInput] = useState<string>('18:00');
  const [fajrInput, setFajrInput] = useState<string>('05:00');
  const [isCustomCalculation, setIsCustomCalculation] = useState<boolean>(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  // Load user's prayer timings to compute exact Last Third of the Night
  useEffect(() => {
    const calculateIntervals = () => {
      let mTime = maghribInput;
      let fTime = fajrInput;

      if (!isCustomCalculation) {
        try {
          const stored = localStorage.getItem('friday-prayer-timings');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.Maghrib && parsed.Fajr) {
              mTime = parsed.Maghrib.split(' ')[0];
              fTime = parsed.Fajr.split(' ')[0];
              setMaghribInput(mTime);
              setFajrInput(fTime);
            }
          }
        } catch (e) {
          console.warn('Error reading stored timings:', e);
        }
      }

      const [mH, mM] = mTime.split(':').map(Number);
      const [fH, fM] = fTime.split(':').map(Number);

      if (isNaN(mH) || isNaN(mM) || isNaN(fH) || isNaN(fM)) return;

      const maghribMins = mH * 60 + mM;
      // Fajr is usually next morning (+24h if after midnight)
      let fajrMins = fH * 60 + fM;
      if (fajrMins <= maghribMins) {
        fajrMins += 24 * 60;
      }

      const totalNightMins = fajrMins - maghribMins;
      const oneThirdMins = Math.round(totalNightMins / 3);

      const firstEnd = maghribMins + oneThirdMins;
      const secondEnd = maghribMins + 2 * oneThirdMins;
      const lastStart = secondEnd;
      // Sahar: last 30-45 minutes before Fajr
      const saharMins = fajrMins - 40;

      const formatMins = (totalM: number) => {
        const norm = ((totalM % 1440) + 1440) % 1440;
        const h = Math.floor(norm / 60);
        const m = norm % 60;
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        const displayM = m < 10 ? `0${m}` : m;
        return `${displayH}:${displayM} ${ampm}`;
      };

      // Check if current time is inside last third
      const now = new Date();
      let currentMins = now.getHours() * 60 + now.getMinutes();
      if (currentMins < maghribMins && currentMins <= fH * 60 + fM) {
        currentMins += 24 * 60;
      }

      const isNight = currentMins >= maghribMins && currentMins < fajrMins;
      const isLastThird = currentMins >= lastStart && currentMins < fajrMins;

      setNightIntervals({
        maghribTime: formatMins(maghribMins),
        fajrTime: formatMins(fajrMins),
        nightHours: Math.floor(totalNightMins / 60),
        nightMinutes: totalNightMins % 60,
        firstThirdStart: formatMins(maghribMins),
        firstThirdEnd: formatMins(firstEnd),
        middleThirdStart: formatMins(firstEnd),
        middleThirdEnd: formatMins(secondEnd),
        lastThirdStart: formatMins(lastStart),
        lastThirdEnd: formatMins(fajrMins),
        saharStart: formatMins(saharMins),
        isCurrentlyLastThird: isLastThird,
        isCurrentlyNight: isNight
      });
    };

    calculateIntervals();
    const interval = setInterval(calculateIntervals, 60000);
    return () => clearInterval(interval);
  }, [maghribInput, fajrInput, isCustomCalculation]);

  const steps = [
    {
      num: 1,
      title: {
        en: "Intention & Pre-Sleep Sunnahs",
        ar: "النية وآداب ما قبل النوم",
        am: "ኒያ እና ከመተኛት በፊት የሚደረጉ ሱናዎች"
      },
      badge: { en: "Preparation", ar: "الاستعداد", am: "ዝግጅት" },
      content: {
        en: "Make a firm, heartfelt intention (Niyyah) in your heart that you intend to wake up for Allah's sake. Perform wudhu before sleeping, sleep on your right side, recite Ayat al-Kursi, the last 3 Surahs (Ikhlas, Falaq, Nas), and place your alarm across the room so you must physically stand up.",
        ar: "انوِ بصدق قيام الليل؛ فالنبي ﷺ قال: «من أتى فراشه وهو ينوي أن يقوم يصلي من الليل، فغلبته عيناه حتى أصبح، كُتِبَ له ما نوى وكان نومه صدقة عليه من ربه». توضأ قبل النوم، ونم على شقك الأيمن، واقرأ أذكار النوم.",
        am: "ለአላህ ብለው ሌሊት ለመቆም በልብዎ ጽኑ ኒያ ያድርጉ። ነቢዩ ﷺ፡ 'ለመስገድ አስቦ እንቅልፍ ያሸነፈው ሰው ያሰበው ይጻፍለታል' ብለዋል። በውዱእ ይተኙ፣ በቀኝ ጎንዎ ይተኙ፣ የቁርአን አያቶችን ያንብቡ።"
      },
      tip: {
        en: "Hadith: 'Whoever goes to bed intending to pray at night, but sleep overcomes him, what he intended is written for him.' (Sunan an-Nasa'i 1784)",
        ar: "حديث صحيح: كُتب لك أجر قيامك كاملاً إذا صدقت النية وغلبك النوم كرماً من رب العالمين.",
        am: "እውነተኛ ኒያ ኖሮት እንቅልፍ ቢያሸንፍዎትም የሙሉ ሌሊት ሶላት ምንዳ ይጻፍልዎታል!"
      }
    },
    {
      num: 2,
      title: {
        en: "Awakening & The First Words",
        ar: "الاستيقاظ والذكر الأول والسواك",
        am: "ከእንቅልፍ መነሳት፣ የመጀመሪያ ቃላትና ውዱእ"
      },
      badge: { en: "Waking Up", ar: "الصحوة", am: "መነሳት" },
      content: {
        en: "Upon waking, wipe the sleep from your face with your right hand. Say: 'Al-hamdu lillahi-lladhi ahyana ba'da ma amatana wa ilayhin-nushur' (Praise be to Allah Who brought us back to life after making us die, and to Him is the resurrection). Cleanse your mouth with a siwak or toothbrush, perform a fresh wudhu with cool water, and gaze towards the sky reciting the final 10 verses of Surah Aal-Imran (3:190-200).",
        ar: "امسح أثر النوم عن وجهك بيدك اليمنى واحمد الله: «الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ». استك بسواكك أو فرشاة الأسنان، وأسبغ وضوءك، واقرأ خواتيم سورة آل عمران (١٩٠-٢٠٠) تأسياً برسول الله ﷺ.",
        am: "ሲነሱ ፊትዎን በእጅዎ ያብሱ፤ 'አልሐምዱ ሊላህ...' የሚለውን ዱዓእ ያድርጉ፤ ጥርስዎን ይፋቁ፤ በሚያረጋጋ ውሃ ውዱእ ያድርጉ፤ የሱረቱል አል-ዒምራን የመጨረሻዎቹን 10 አንቀጾች (3:190-200) ያንብቡ።"
      },
      tip: {
        en: "The Prophet ﷺ would immediately untie the three knots of Shaytan: the 1st by remembering Allah, the 2nd by performing wudhu, the 3rd by standing in prayer! (Bukhari 1142)",
        ar: "حل عُقد الشيطان الثلاث: الأولى بالذكر، الثانية بالوضوء، والثالثة بركعتين فيصبح طيب النفس نشيطاً.",
        am: "የሸይጣን 3 ቋጠሮዎች ይፈታሉ፡ 1ኛ በአላህ ዝክር፣ 2ኛ በውዱእ፣ 3ኛ በሶላት!"
      }
    },
    {
      num: 3,
      title: {
        en: "Two Light Opening Rak'ahs (Iftitah)",
        ar: "افتتاح الصلاة بركعتين خفيفتين",
        am: "በሁለት ቀላል ረከዓዎች መጀመር (ኢፍቲታህ)"
      },
      badge: { en: "Sunnah Starter", ar: "سنة الافتتاح", am: "መጀመሪያ" },
      content: {
        en: "Begin your night vigil with two light, brief rak'ahs. Do not lengthen the first pair excessively; use them to warm up your concentration and dissolve lingering drowsiness. In these two rak'ahs, recite Surah Al-Fatiha and a short surah like Al-Kafirun and Al-Ikhlas.",
        ar: "افتتح قيامك بركعتين خفيفتين؛ لحديث عائشة رضي الله عنها وأبي هريرة: «كَانَ رَسُولُ اللهِ ﷺ إِذَا قَامَ مِنَ اللَّيْلِ لِيُصَلِّيَ افْتَتَحَ صَلَاتَهُ بِرَكْعَتَيْنِ خَفِيفَتَيْنِ». هذا يذهب بقايا النعاس وينشط الروح.",
        am: "የሌሊት ሶላትዎን በሁለት ቀለል ባሉ አጫጭር ረከዓዎች ይጀምሩ። ይህ የእንቅልፍ ስሜትን ለማስወገድና ልብን ለማዘጋጀት የነቢዩ ﷺ ሱና ነው። በነዚህ ረከዓዎች ፋቲሃና አጫጭር ሱራዎችን ያንብቡ።"
      },
      tip: {
        en: "Sahih Muslim 768: 'When any of you gets up to pray at night, let him begin with two light rak'ahs.'",
        ar: "سنة نبوية مؤكدة في صحيح مسلم لبدء التهجد بنشاط وطمأنينة.",
        am: "በሶሂህ ሙስሊም 768 የተረጋገጠ ሱና ነው።"
      }
    },
    {
      num: 4,
      title: {
        en: "The Main Rak'ahs (Mathna Mathna: Two by Two)",
        ar: "الركعات الأساسية مثنى مثنى (ركعتان ركعتان)",
        am: "ዋናዎቹ ረከዓዎች (ሁለት ሁለት ረከዓ)"
      },
      badge: { en: "Core Vigil", ar: "صلب التهجد", am: "ዋናው ሶላት" },
      content: {
        en: "Pray in sets of two rak'ahs with salam at the end of every two: 'Salātul-layli mathnā mathnā' (The night prayer is two by two - Bukhari 990). You may recite whatever you wish from the Holy Quran. Holding the printed Mushaf or scrolling in this app's Classic Mushaf is fully permissible in voluntary prayers! Recite slowly with tartil (measured rhythm). When you pass a verse of mercy, pause and ask Allah for His grace; when you pass a verse of warning, pause and seek refuge.",
        ar: "صلِّ ركعتين ثم سلم، ثم ركعتين ثم سلم: «صَلَاةُ اللَّيْلِ مَثْنَى مَثْنَى». يجوز لك القراءة من المصحف الشريف في صلاة النافلة (كما كانت عائشة يأمها ذكوان من المصحف). رتّل آيات القرآن بتأنٍ، وإذا مررت بآية رحمة فسَل، وإذا مررت بآية عذاب فاستعذ.",
        am: "በየሁለት ረከዓው አሰላምቱ፡ 'የሌሊት ሶላት ሁለት ሁለት ረከዓ ነው' (ቡኻሪ 990)። በናፊላ ሶላት ውስጥ ቁርአንን ይዘው ማንበብ ይፈቀዳል! ቁርአንን በዝግታና በማስተንተን ያንብቡ። የምህረት አንቀጽ ሲያነቡ ምህረትን ይለምኑ፣ የማስጠንቀቂያ አንቀጽ ሲያነቡ በአላህ ይጠበቁ።"
      },
      tip: {
        en: "How many rak'ahs? Minimum is 2 rak'ahs. The Prophet ﷺ most frequently prayed 8 rak'ahs plus 3 Witr (Total: 11 rak'ahs) or 13 rak'ahs. Start at your own capacity!",
        ar: "أقل التهجد ركعتان، وأكمله ٨ ركعات متبوعة بـ ٣ ركعات وتر (المجموع ١١ ركعة كفعل النبي ﷺ). المهم المداومة ولو بركعتين.",
        am: "ዝቅተኛው 2 ረከዓ ነው። ነቢዩ ﷺ አብዛኛውን ጊዜ 8 ረከዓ ሰግደው በ3 ረከዓ ዊትር ያጠናቅቁ ነበር (ድምር 11)።"
      }
    },
    {
      num: 5,
      title: {
        en: "Lengthening Ruku & Sujud (Pouring Your Heart)",
        ar: "إطالة الركوع والسجود والمناجاة الخاشعة",
        am: "ሩኩዕንና ሱጁድን ማርዘም (የልብን ስሜት ለአላህ ማፍሰስ)"
      },
      badge: { en: "Peak Closeness", ar: "ذروة القرب", am: "ቅርበት" },
      content: {
        en: "The hallmark of Tahajjud is unhurried peace. Extend your bowing (Ruku) and prostration (Sujud). The Prophet ﷺ said: 'The closest a servant is to his Lord is while in prostration, so increase supplications therein' (Sahih Muslim 482). In Sujud, open your heart in your own language: ask for your family, relief from burnout, forgiveness, children's guidance, and paradise.",
        ar: "ميزة التهجد طمأنينة السجود ومناجاة الملك سبحانه. قال ﷺ: «أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ، فَأَكْثِرُوا الدُّعَاءَ». أطل سجودك واشْكُ بثك وحزنك وضعفك وأنت على الأرض، واسأل الله تفريج هموم أسرتك وقضاء دينك.",
        am: "የተሃጁድ ዋነኛ መለያ ረጋ ያለ ሱጁድ ነው። ነቢዩ ﷺ፡ 'አንድ ባሪያ ወደ ጌታው በጣም የሚቀርበው በሱጁድ ላይ እያለ ነው፤ ስለዚህ ዱዓእ አብዙ' ብለዋል። በሱጁድ ላይ ሆነው በቋንቋዎ የልብዎን ችግር ለአላህ ይንገሩ።"
      },
      tip: {
        en: "Say in Sujud: 'Subhana Rabbiyal-A'la' (3x or more), then: 'Ya Hayyu Ya Qayyum bi-rahmatika astagheeth, Allahumma inni a'udhu bika minal-hammi wal-hazan...'",
        ar: "سبح بحمد ربك الأعلى، ثم استغث برحمته، وسله من خيري الدنيا والآخرة وأنت متذلل بين يديه.",
        am: "በሱጁድ ላይ ሱብሓነ ረቢየል አዕላ ካሉ በኋላ ያሰቡትን ዱዓእ በሙሉ ያድርጉ።"
      }
    },
    {
      num: 6,
      title: {
        en: "Concluding with Witr (The Odd-Numbered Seal)",
        ar: "ختام الصلاة بالوتر (ركعة أو ثلاث)",
        am: "በዊትር ሶላት ማጠናቀቅ (ነጠላ ወይም 3 ረከዓ)"
      },
      badge: { en: "The Seal", ar: "الختام", am: "ማጠቃለያ" },
      content: {
        en: "The Prophet ﷺ commanded: 'Make the last of your prayer at night Witr (odd-numbered)' (Bukhari 998). You can pray Witr as 1 single rak'ah, or 3 rak'ahs (pray 2 rak'ahs with salam, then 1 separate rak'ah with salam). In the 3 rak'ahs, it is Sunnah to recite: Rak'ah 1: Surah Al-A'la (87); Rak'ah 2: Surah Al-Kafirun (109); Rak'ah 3: Surah Al-Ikhlas, Al-Falaq, and An-Nas. You may also recite Du'a al-Qunut before or after bowing in the final rak'ah.",
        ar: "اجعل آخر صلاتك وتراً: «اجْعَلُوا آخِرَ صَلَاتِكُمْ بِاللَّيْلِ وِتْرًا». الأفضل أن تصلي ركعتين وتسلم، ثم توتر بركعة منفردة. يقرأ في الأولى سورة الأعلى، وفي الثانية الكافرون، وفي الثالثة الإخلاص والمعوذتين، ويقنت في الركعة الأخيرة بدعاء الوتر.",
        am: "ነቢዩ ﷺ፡ 'የሌሊት ሶላታችሁን ማጠቃለያ ዊትር አድርጉ' ብለዋል (ቡኻሪ 998)። ዊትርን በ1 ረከዓ ወይም በ3 ረከዓ (2 ሰግዶ በማሰላመት፣ ከዚያ 1 ለብቻ በመስገድ) ማጠናቀቅ ይቻላል። በዊትር ላይ ቁኑት ማድረግም ሱና ነው።"
      },
      tip: {
        en: "After salam in Witr, say three times: 'Subhanal-Malikil-Quddus' (Glory be to the Sovereign, the Most Holy), raising your voice on the third repetition (Sunan an-Nasa'i 1732).",
        ar: "سنة بعد سلام الوتر: قل ثلاثاً: «سُبْحَانَ الْمَلِكِ الْقُدُّوسِ» وتمد صوتك في الثالثة.",
        am: "ከዊትር ሰላምታ በኋላ 'ሱብሓነል መሊኪል ቁዱስ' የሚለውን 3 ጊዜ ማለት ሱና ነው።"
      }
    },
    {
      num: 7,
      title: {
        en: "The Sahar Window: Seeking Forgiveness Before Dawn",
        ar: "وقت السحر والاستغفار المبارك قبل أذان الفجر",
        am: "የሰሐር ወቅት፡ ከፈጅር በፊት ምህረትን መለመን"
      },
      badge: { en: "Golden Minute", ar: "وقت السحر", am: "ሰሐር" },
      content: {
        en: "Dedicate the final 15 to 20 minutes before the Fajr Adhan to sit quietly and seek forgiveness (Istighfar). Allah praised the believers in the Quran specifically for this: 'And in the hours before dawn (at Sahar) they would ask for forgiveness' (Quran 51:18). Recite Sayyid al-Istighfar, make quiet personal supplications, and eat a small bite or dates if you plan to fast.",
        ar: "اجلس في الدقائق الـ ١٥ الأخيرة قبل أذان الفجر مستغفراً متضرعاً؛ فقد أثنى الله على عباده الصالحين فقال: ﴿وَبِالْأَسْحَارِ هُمْ يَسْتَغْفِرُونَ﴾. قل: «أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ» وسيد الاستغفار.",
        am: "ከፈጅር አዛን በፊት ያሉትን የመጨረሻዎቹን 15-20 ደቂቃዎች በኢስቲግፋር (ምህረት በመጠየቅ) ያሳልፉ። አላህ ቅን ባሮቹን በቁርአን (51:18)፡ 'በሰሐር ሰዓትም ምህረትን ይለምናሉ' ሲል አወድሷቸዋል።"
      },
      tip: {
        en: "Prophetic Hadith: 'Our Lord descends to the lowest heaven in the last third of the night, asking: Is there anyone seeking forgiveness that I may forgive him?' (Bukhari)",
        ar: "الرب سبحانه ينادي في هذا الوقت المبارك: «هَلْ مِنْ مُسْتَغْفِرٍ فَأَغْفِرَ لَهُ؟ هَلْ مِنْ سَائِلٍ فَأُعْطِيَهُ؟».",
        am: "በዚህ ወቅት አላህ፡ 'ምህረት የሚጠይቅ አለ ወይ ምህረት የማደርግለት?' ይላል!"
      }
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Banner: The Calling of the Night */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-primary-950 to-indigo-950 text-white p-6 sm:p-10 border border-secondary-400/20 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <Moon size={13} className="text-amber-400 animate-pulse" />
              <span>{language === 'ar' ? 'دليل قيام الليل والتهجد' : (language === 'am' ? 'የተሃጁድ እና የለይል ሶላት መመሪያ' : "Tahajjud & Night Prayer Master Guide")}</span>
            </span>

            {nightIntervals && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                nightIntervals.isCurrentlyLastThird
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 animate-pulse'
                  : 'bg-white/10 text-slate-300 border-white/15'
              }`}>
                <Clock size={12} />
                <span>
                  {nightIntervals.isCurrentlyLastThird
                    ? (language === 'ar' ? 'أنت الآن في وقت ثلث الليل الأخير المبارك!' : 'Now is the Golden Last Third of the Night!')
                    : (language === 'ar' ? 'الثلث الأخير: ' + nightIntervals.lastThirdStart : 'Last Third: ' + nightIntervals.lastThirdStart)}
                </span>
              </span>
            )}
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-white tracking-tight">
              {language === 'ar' 
                ? 'كيفية صلاة قيام الليل والتهجد: مراتب القرب ومناجاة السحر' 
                : 'How to Perform Tahajjud & Qiyam al-Layl: The Complete Spiritual Guide'}
            </h2>
            <p className="text-xs sm:text-sm text-primary-200 mt-2 max-w-3xl leading-relaxed">
              {language === 'ar'
                ? '«صلاة الليل دأب الصالحين قبلكم، وقربة إلى ربكم، ومكفرة للسيئات، ومنهاة عن الإثم، ومطردة للداء عن الجسد». خطوة بخطوة من النية وحتى الوتر والاستغفار.'
                : 'The night prayer is the hallmark of the righteous, an intimate audience with the Creator, the ultimate cure for anxiety, and the secret source of supernatural Barakah.'}
            </p>
          </div>

          {/* Divine Descent Hadith Callout */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles size={14} />
              <span>{language === 'ar' ? 'حديث النزول الإلهي في الثلث الأخير' : 'The Prophetic Promise of Divine Descent'}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
              &quot;Our Lord, the Blessed and Exalted, descends every night to the lowest heaven when the last third of the night remains, saying: <strong className="text-amber-300 font-serif">Who calls upon Me that I may answer him? Who asks of Me that I may give him? Who seeks My forgiveness that I may forgive him?</strong>&quot;
            </p>
            <div className="text-[11px] text-primary-300 text-right">
              — Sahih al-Bukhari 1145, Sahih Muslim 758
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Last Third of the Night Calculator */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-600 dark:text-secondary-400" />
              <span>{language === 'ar' ? 'حاسبة أثلاث الليل ووقت التنزل الإلهي' : 'Last Third of the Night Calculator'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'ar' 
                ? 'حساب فلكي دقيق يبدأ من غروب الشمس (المغرب) وينتهي عند طلوع الفجر الصادق مقسوماً على ثلاثة' 
                : 'Calculates the exact duration between Sunset (Maghrib) and True Dawn (Fajr) divided into thirds.'}
            </p>
          </div>

          <button
            onClick={() => setIsCustomCalculation(!isCustomCalculation)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            {isCustomCalculation 
              ? (language === 'ar' ? 'استخدام مواقيت التطبيق' : 'Use App Timings') 
              : (language === 'ar' ? 'تعديل التوقيت يدوياً' : 'Edit Times Manually')}
          </button>
        </div>

        {/* Custom manual timing inputs if toggled */}
        {isCustomCalculation && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                {language === 'ar' ? 'وقت صلاة المغرب (غروب الشمس)' : 'Maghrib Time (Sunset)'}
              </label>
              <input
                type="time"
                value={maghribInput}
                onChange={(e) => setMaghribInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                {language === 'ar' ? 'وقت صلاة الفجر (طلوع الفجر)' : 'Fajr Time (Dawn)'}
              </label>
              <input
                type="time"
                value={fajrInput}
                onChange={(e) => setFajrInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-mono font-bold"
              />
            </div>
          </div>
        )}

        {/* 3 Night Intervals Visualizer */}
        {nightIntervals && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{language === 'ar' ? 'بداية الليل (المغرب): ' : 'Sunset: '} <strong className="text-slate-700 dark:text-slate-200">{nightIntervals.maghribTime}</strong></span>
              <span className="font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                {language === 'ar' 
                  ? `طول الليل: ${nightIntervals.nightHours} س و ${nightIntervals.nightMinutes} د` 
                  : `Night Length: ${nightIntervals.nightHours}h ${nightIntervals.nightMinutes}m`}
              </span>
              <span>{language === 'ar' ? 'نهاية الليل (الفجر): ' : 'Dawn: '} <strong className="text-slate-700 dark:text-slate-200">{nightIntervals.fajrTime}</strong></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1st Third */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  {language === 'ar' ? 'الثلث الأول من الليل' : '1st Third of the Night'}
                </span>
                <div className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 font-mono">
                  {nightIntervals.firstThirdStart} — {nightIntervals.firstThirdEnd}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {language === 'ar' ? 'العشاء، الوتر لمن يخشى عدم الاستيقاظ، والاستعداد للنوم المبكر.' : 'Isha prayer, resting, or praying Witr early if you fear not waking up.'}
                </p>
              </div>

              {/* 2nd Third */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  {language === 'ar' ? 'الثلث الثاني (جوف الليل)' : 'Middle Third of the Night'}
                </span>
                <div className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 font-mono">
                  {nightIntervals.middleThirdStart} — {nightIntervals.middleThirdEnd}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {language === 'ar' ? 'النوم العميق الذي يجدد خلايا الجسم، وصلاة داود عليه السلام.' : 'Deep restful sleep and the prayer timing followed by Prophet Dawud (AS).'}
                </p>
              </div>

              {/* 3rd Third (The Golden Hour) */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-emerald-500/10 to-teal-500/15 border-2 border-emerald-500/50 space-y-1.5 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                    {language === 'ar' ? '★ الثلث الأخير (وقت التنزل)' : '★ The Blessed Last Third'}
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold">
                    {language === 'ar' ? 'أفضل الأوقات' : 'Best Time'}
                  </span>
                </div>
                <div className="text-sm sm:text-base font-extrabold text-emerald-950 dark:text-emerald-200 font-mono">
                  {nightIntervals.lastThirdStart} — {nightIntervals.lastThirdEnd}
                </div>
                <p className="text-[11px] text-emerald-900 dark:text-emerald-300 leading-relaxed font-medium">
                  {language === 'ar'
                    ? 'وقت التنزل الإلهي وإجابة الدعوات وقضاء الحوائج، وتخصيص السحر للاستغفار.'
                    : 'The golden hour of Divine descent, answered supplications, and pre-dawn Istighfar.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step-by-Step Interactive Guide */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold text-primary-600 dark:text-secondary-400 uppercase tracking-wider">
            {language === 'ar' ? 'الدليل التطبيقي المتكامل' : 'Step-by-Step Practice'}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-800 dark:text-slate-100 mt-1">
            {language === 'ar' ? 'كيف تصلي التهجد من البداية وحتى الختام' : 'How to Pray Tahajjud from Start to Finish'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'ar' ? 'انقر على كل خطوة لاستعراض تفاصيلها وأدعيتها وسننها النبوية' : 'Click any step below to explore its details, Sunnah practices, and supplications.'}
          </p>
        </div>

        {/* Step Tabs Indicator */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {steps.map((st) => (
            <button
              key={st.num}
              onClick={() => setActiveStep(st.num)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                activeStep === st.num
                  ? 'bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-600/20'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${activeStep === st.num ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                  0{st.num}
                </span>
                <span className="text-[9px] font-bold opacity-80">
                  {st.badge[language as 'en' | 'ar' | 'am'] || st.badge.en}
                </span>
              </div>
              <span className="text-xs font-bold mt-2 truncate">
                {st.title[language as 'en' | 'ar' | 'am'] || st.title.en}
              </span>
            </button>
          ))}
        </div>

        {/* Active Step Showcase */}
        {(() => {
          const current = steps.find(s => s.num === activeStep) || steps[0];
          return (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-primary-600 text-white font-mono font-bold flex items-center justify-center text-sm shadow-xs">
                    {current.num}
                  </span>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                      {current.title[language as 'en' | 'ar' | 'am'] || current.title.en}
                    </h4>
                    <span className="text-xs font-semibold text-primary-600 dark:text-secondary-400">
                      {current.badge[language as 'en' | 'ar' | 'am'] || current.badge.en}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={activeStep <= 1}
                    onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 cursor-pointer"
                  >
                    {language === 'ar' ? 'السابق' : 'Previous'}
                  </button>
                  <button
                    disabled={activeStep >= steps.length}
                    onClick={() => setActiveStep(prev => Math.min(steps.length, prev + 1))}
                    className="px-3 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-bold disabled:opacity-40 cursor-pointer flex items-center gap-1"
                  >
                    <span>{language === 'ar' ? 'التالي' : 'Next'}</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
                {current.content[language as 'en' | 'ar' | 'am'] || current.content.en}
              </p>

              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs leading-relaxed flex items-start gap-2.5">
                <Sparkles size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block mb-0.5">{language === 'ar' ? 'إضاءة نبوية وفقهية:' : 'Prophetic Insight:'}</strong>
                  <span>{current.tip[language as 'en' | 'ar' | 'am'] || current.tip.en}</span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Featured Prophetic Opening Du'a of Tahajjud */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              {language === 'ar' ? 'دعاء الاستفتاح النبوي في التهجد' : "Prophet's ﷺ Opening Tahajjud Prayer"}
            </span>
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {language === 'ar' ? 'دعاء قيام الليل المأثور عن النبي ﷺ' : "Dua al-Istiftah in the Night Vigil"}
            </h4>
          </div>
          <span className="text-xs text-slate-400 font-medium">Sahih al-Bukhari 1120</span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {language === 'ar'
            ? 'كان النبي ﷺ إذا قام يتهجد من الليل افتتح صلاته بعد التكبير بهذا الدعاء العظيم الخاشع الذي يقر بتوحيد الله ونوره وملكه وعظمته:'
            : 'Whenever the Prophet ﷺ stood up for Tahajjud at night, he would begin his prayer with this profound praise of Allah\'s Light, Dominion, and Truth:'}
        </p>

        <div className="bg-slate-50 dark:bg-slate-850/60 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
          <DuaAudioPlayer
            arabicText="اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ نُورُ السَّمَاوَاتِ وَالأَرْضِ وَمَنْ فِيهِنَّ، وَلَكَ الْحَمْدُ أَنْتَ قَيِّمُ السَّمَاوَاتِ وَالأَرْضِ وَمَنْ فِيهِنَّ، وَلَكَ الْحَمْدُ أَنْتَ الْحَقُّ، وَوَعْدُكَ الْحَقُّ، وَلِقَاؤُكَ حَقٌّ، وَالْجَنَّةُ حَقٌّ، وَالنَّارُ حَقٌّ، وَالنَّبِيُّونَ حَقٌّ، وَمُحَمَّدٌ ﷺ حَقٌّ، وَالسَّاعَةُ حَقٌّ، اللَّهُمَّ لَكَ أَسْلَمْتُ، وَبِكَ آمَنْتُ، وَعَلَيْكَ تَوَكَّلْتُ، وَإِلَيْكَ أَنَبْتُ، وَبِكَ خَاصَمْتُ، وَإِلَيْكَ حَاكَمْتُ، فَاغْفِرْ لِي مَا قَدَّمْتُ وَمَا أَخَّرْتُ، وَمَا أَسْرَرْتُ وَمَا أَعْلَنْتُ، أَنْتَ الْمُقَدِّمُ وَأَنْتَ الْمُؤَخِّرُ، لاَ إِلَهَ إِلاَّ أَنْتَ"
            transliterationText="Allahumma laka-l-hamdu Anta nooru-s-samawati wal-ardi wa man feehinn, wa laka-l-hamdu Anta qayyimu-s-samawati wal-ardi wa man feehinn, wa laka-l-hamdu Antal-Haqqu wa wa'dukal-haqq, wa liqa'uka haqq, wal-jannatu haqq, wan-naru haqq, wan-nabiyyuna haqq, wa Muhammadun sallallahu 'alayhi wa sallam haqq, was-sa'atu haqq. Allahumma laka aslamtu, wa bika amantu, wa 'alayka tawakkaltu, wa ilayka anabtu, wa bika khasamu, wa ilayka hakamtu, faghfir li ma qaddamtu wa ma akhkhartu, wa ma asrartu wa ma a'lantu, Antal-Muqaddimu wa Antal-Mu'akhkhiru, la ilaha illa Ant."
            translationText="O Allah! All the praises are for You; You are the Light of the heavens and the earth and whatever is in them. All praises are for You; You are the Sustainer and Caretaker of the heavens and the earth and whatever is in them. You are the Truth; Your promise is the truth, Your meeting is truth, Paradise is truth, Hell is truth, the Prophets are truth, Muhammad ﷺ is truth, and the Hour is truth. O Allah, to You I submit, in You I believe, upon You I rely, to You I repent, for Your sake I dispute, and to You I turn for judgment. Forgive what I have sent before me and what I have held behind, what I have concealed and what I have declared. You are the Advancer and You are the Delayer; there is no deity worthy of worship except You."
            title="Tahajjud Opening Supplication"
          />
        </div>
      </div>

      {/* 6 Essential FAQs on Tahajjud & Night Prayer */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <h4 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 font-serif flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-secondary-500" />
          <span>{language === 'ar' ? 'أسئلة شائعة وأحكام فقهية مهمة في قيام الليل' : 'Frequently Asked Questions on Tahajjud'}</span>
        </h4>

        <div className="space-y-3">
          {[
            {
              id: 'faq1',
              q: {
                en: "What is the difference between Qiyam al-Layl, Tahajjud, and Tarawih?",
                ar: "ما الفرق بين قيام الليل والتهجد والتراويح؟",
                am: "በለይል ሶላት፣ በተሃጁድ እና በተራዊህ መካከል ያለው ልዩነት ምንድን ነው?"
              },
              a: {
                en: "Qiyam al-Layl is the overarching category for any voluntary prayer performed at night between Isha and Fajr. Tahajjud specifically refers to praying after waking up from sleep at night. Tarawih is the special congregational Qiyam prayed specifically during the nights of Ramadan after Isha.",
                ar: "قيام الليل اسم عام يشمل كل صلاة تطوعية بعد العشاء وحتى الفجر سواء نام أو لم ينم. والتهجد هو الصلاة بعد نوم في الليل وهو أفضله وأشقه. والتراويح هي قيام الليل المخصوص في شهر رمضان المبارك جماعة بعد العشاء.",
                am: "የለይል ሶላት ከዒሻእ እስከ ፈጅር ያለ ማንኛውንም የሌሊት ሱና ያካትታል። ተሃጁድ ማለት ደግሞ ተኝቶ ከእንቅልፍ ከተነሳ በኋላ የሚሰገድ የሌሊት ሶላት ነው። ተራዊህ በረመዳን ወር በጀመዓ የሚሰገደው ነው።"
              }
            },
            {
              id: 'faq2',
              q: {
                en: "Can I pray Tahajjud if I already prayed Witr after Isha?",
                ar: "هل يجوز لي صلاة التهجد إذا كنت قد صليت الوتر بعد العشاء؟",
                am: "ከዒሻእ በኋላ ዊትር ሰግጄ ከሆነ ተሃጁድ መስገድ እችላለሁ?"
              },
              a: {
                en: "Yes, absolutely! The Prophet ﷺ said: 'There are not two Witrs in one night' (Tirmidhi 470). Therefore, wake up and pray Tahajjud in pairs of two rak'ahs (2, 4, 6, etc.) as much as you wish, but do not repeat the Witr prayer again.",
                ar: "نعم يجوز بكل تأكيد! النبي ﷺ قال: «لَا وِتْرَانِ فِي لَيْلَةٍ». فإذا استيقظت صلِّ ركعتين ركعتين مثنى مثنى ما تيسر لك، ولا تعد صلاة الوتر ثانية لأنك أوترت أول الليل.",
                am: "አዎ፣ ያለምንም ችግር መስገድ ይችላሉ! ነቢዩ ﷺ፡ 'በአንድ ሌሊት ሁለት ዊትር የለም' ብለዋል። ስለዚህ የፈለጉትን ያህል ሁለት ሁለት ረከዓ ይስገዱ፤ ዊትሩን ግን አይደግሙትም።"
              }
            },
            {
              id: 'faq3',
              q: {
                en: "Can I hold a physical Mushaf or read from my phone while praying Tahajjud?",
                ar: "هل يجوز مسك المصحف أو القراءة من الهاتف أثناء صلاة التهجد؟",
                am: "በተሃጁድ ሶላት ወቅት ቁርአን ወይም ስልክ ይዞ ማንበብ ይፈቀዳል?"
              },
              a: {
                en: "Yes, it is fully permissible in voluntary (Nafl) night prayers according to the majority of scholars. Aisha (رضي الله عنها) had her servant Dhakwan lead her in night prayer while reciting directly from the physical Mushaf (Sahih al-Bukhari). You can also scroll using this app's Classic Mushaf.",
                ar: "نعم، جائز باتفاق جمهور الفقهاء في صلاة النوافل والتهجد؛ لثبوت أن أم المؤمنين عائشة رضي الله عنها كان يؤمها غلامها ذكوان من المصحف الشريف في صلاة الليل.",
                am: "አዎ፣ በሱና (ተሃጁድ) ሶላት ላይ ቁርአንን ይዞ ማንበብ ይፈቀዳል፤ እመት አኢሻህ (ረ.ዐ) አገልጋያቸው ዘክዋን ቁርአን ይዞ እንዲያሰግድ ፈቅደውለት ነበር።"
              }
            },
            {
              id: 'faq4',
              q: {
                en: "What if I can only wake up 10 or 15 minutes before Fajr?",
                ar: "ماذا لو لم أستيقظ إلا قبل الفجر بـ ١٠ أو ١٥ دقيقة؟",
                am: "ከፈጅር በፊት 10 ወይም 15 ደቂቃ ብቻ ሲቀረው ብነሳስ?"
              },
              a: {
                en: "Pray 2 light rak'ahs and 1 rak'ah of Witr, followed by a few minutes of Istighfar! You will catch the final minutes of the divine descent and be written among those who spent the night in prayer. Consistency in small deeds is more beloved to Allah than occasional extremes.",
                ar: "اغتنمها فوراً! صلِّ ركعتين خفيفتين ثم ركعة وتر واحدة، واقضِ الدقائق الأخيرة في الاستغفار وسيكتب لك أجر قيام الليل كاملاً بإذن الله، فأحب الأعمال إلى الله أدومها وإن قل.",
                am: "እጅግ በጣም መልካም ነው! ሁለት ረከዓ እና 1 ረከዓ ዊትር ሰግደው በቀሪዎቹ ደቂቃዎች ምህረት ይጠይቁ፤ የሙሉ ሌሊት ምንዳ ያገኛሉ።"
              }
            }
          ].map((item) => {
            const isOpen = expandedFaq === item.id;
            return (
              <div
                key={item.id}
                className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : item.id)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-850/50 hover:bg-slate-100/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    {item.q[language as 'en' | 'ar' | 'am'] || item.q.en}
                  </span>
                  {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="p-4 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-800 animate-in fade-in duration-150">
                    {item.a[language as 'en' | 'ar' | 'am'] || item.a.en}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TahajjudGuideSection;
