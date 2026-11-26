import React, { useState, useEffect } from 'react';
import { Heart, ArrowLeft, RefreshCw, Sparkles, Award, Star, BookOpen, Volume2 } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface DeceasedDuaItem {
  id: string;
  titleEn: string;
  titleAr: string;
  titleAm: string;
  titleHar: string;
  arabic: string;
  transliteration: string;
  translationEn: string;
  translationAm: string;
  translationHar: string;
  targetCount: number;
  source: string;
}

const deceasedDuas: DeceasedDuaItem[] = [
  {
    id: 'prophetic_mercy',
    titleEn: 'Prophetic Supplication for Vast Forgiveness',
    titleAr: 'الدعاء النبوي الجامع للميت بالرحمة والمغفرة',
    titleAm: 'ሰፊ ምሕረትን ለመለመን የሚደረግ የነብዩ ዱዓእ',
    titleHar: 'ፊጥረት ባይ ዱዓእ',
    arabic: 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ، وَعَافِهِ وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ، وَوَسِّعْ مُدْخَلَهُ، وَاغْسِلْهُ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَنَقِّهِ مِنَ الْخَطَايَا كَمَا نَقَّيْتَ الثَّوْبَ الأَبْيَضَ مِنَ الدَّنَسِ، وَأَبْدِلْهُ دَارًا خَيْرًا مِنْ دَارِهِ، وَأَهْلاً خَيْرًا مِنْ أَهْلِهِ، وَزَوْجًا خَيْرًا مِنْ زَوْجِهِ، وَأَدْخِلْهُ الْجَنَّةَ، وَأَعِذْهُ مِنْ عَذَابِ الْقَبْرِ، وَمِنْ عَذَابِ النَّارِ.',
    transliteration: "Allaahum-maghfir lahu warhamhu, wa 'aafihi wa'fu 'anhu, wa akrim nuzulahu, wa wassi' mudkhalahu, waghsilhu bil-ma'i wath-thalji wal-barad, wa naqqihi minal-khataaya kama naqqaytath-thawbal-abyada minad-danas, wa abdilhu daaran khayran min daarihi, wa ahlan khayran min ahlihi, wa zawjan khayran min zawjihi, wa adkhilhul-Jannata, wa a'idh-hu min 'adhaabil-qabri wa min 'adhaabin-naar.",
    translationEn: "O Allah, forgive him and have mercy on him, keep him safe and sound and pardon him, honor his reception, widen his entry, wash him with water, snow, and hail, and cleanse him of sin as a white garment is cleansed of dirt. Exchange his home for a better home, his family for a better family, and his spouse for a better spouse. Admit him to Paradise, and protect him from the punishment of the grave and the punishment of the Fire.",
    translationAm: "አላህ ሆይ! ማረው፣ እዘንለትም፤ ጤና ስጠው፣ ይቅርም በለው፤ መስተንግዶውን አክብርለት፤ መግቢያውንም አስፋለት፤ በውሃ፣ በበረዶና በዝናብ እጠበው፤ ነጭ ልብስ ከቆሻሻ እንደሚጠራ ከሃጢአት አንጻው፤ ከቤቱ የተሻለ ቤት፣ ከቤተሰቡ የተሻለ ቤተሰብ፣ ከትዳሩ የተሻለ ትዳር ቀይርለት፤ ጀነት አስገባው፤ ከቀብር ቅጣትና ከእሳት ቅጣትም ጠብቀው።",
    translationHar: "አላህ ሆይ! መሃረው፣ ራሕማትም ባይለት፤ ዐፊያ ስጠው፣ ይቅርም በለው፤ መስተንግዶውን አክብርለት፤ መግቢያውንም አሰፊለት፤ በውሃ፣ በበረዶና በቅዝቃዜ እጠበው፤ ነጭ ልብስ ከቆሻሻ እንደሚጠራ ከወንጀል አንጻው፤ ከቤቱ የተሻለ ቤት፣ ከቤተሰቡ የተሻለ ቤተሰብ ቀይርለት፤ ጀነት አስገባው፤ ከቀብሪ አዛብና ከእሳት አዛብም ጠብቀው።",
    targetCount: 3,
    source: "Sahih Muslim"
  },
  {
    id: 'quranic_parents',
    titleEn: 'Quranic Prayer for Parents and Believers',
    titleAr: 'دعاء قرآني للوالدين والمؤمنين',
    titleAm: 'የቁርአን ዱዓእ ለወላጆችና ለምእመናን',
    titleHar: 'የቁርአን ዱዓእ',
    arabic: 'رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ',
    transliteration: "Rabbanagh-fir lee wa li-waalidayya wa lil-mu'mineena yawma yaqoomul-hisaab.",
    translationEn: "Our Lord, forgive me and my parents and the believers the Day the account is established.",
    translationAm: "ጌታችን ሆይ! ምርመراው በሚቆምበት (በትንሣኤ) ቀን ለእኔም፣ ለወላጆቼም፣ ለምእመናንም ምሕረት አድርግልን።",
    translationHar: "ጌታችን ሆይ! ሂሳብ በሚቆምበት ቀን ለእኔም፣ ለወላጆቼም፣ ለምእመናንም ፊጥረት ባይ።",
    targetCount: 7,
    source: "Surah Ibrahim 14:41"
  },
  {
    id: 'elevation_rank',
    titleEn: 'Supplication for Elevating Ranks & Illuminating the Grave',
    titleAr: 'دعاء لرفع الدرجات وتنوير القبر',
    titleAm: 'ደረጃን ከፍ ለማድረግና ቀብርን ለማብራት የሚደረግ ዱዓእ',
    titleHar: 'ደረጃ ከፍ ባይ ዱዓእ',
    arabic: 'اللَّهُمَّ اغْفِرْ لَهُ وَارْفَعْ دَرَجَتَهُ فِي الْمَهْدِيِّينَ، وَاخْلُفْهُ فِي عَقِبِهِ فِي الْغَابِرِينَ، وَاغْفِرْ لَنَا وَلَهُ يَا رَبَّ الْعَالَمِينَ، وَافْسَحْ لَهُ فِي قَبْرِهِ وَنُوِّرْ لَهُ فِيهِ.',
    transliteration: "Allaahum-maghfir lahu warfa' darajatahu fil-mahdiyeen, wakhlufhu fee 'aqibihi fil-ghaabireen, waghfir lana wa lahu ya Rabbal-'aalameen, wafsah lahu fee qabrihi wa nawwir lahu feeh.",
    translationEn: "O Allah, forgive him and elevate his station among those who are guided. Send him along the path of those who came before, and forgive us and him, O Lord of the worlds. Enlarge for him his grave and shed light upon him in it.",
    translationAm: "አላህ ሆይ! ማረው፣ በቅኑ ጎዳና በተመሩት ዘንድ ደረጃውን ከፍ አድርግለት፤ በኋለኞቹ ዘሮችም ውስጥ ተተኪ ሁንለት፤ የዓለማት ጌታ ሆይ! ለእኛም ለእርሱም ምሕረት አድርግልን፤ ቀብሩን አስፋለት፤ በውስጡም ብርሃን አብራለት።",
    translationHar: "አላህ ሆይ! መሃረው፣ በቅኑ መንገድ ከተመሩት ጋር ደረጃውን ከፍ አድርግለት፤ የዓለማት ጌታ ሆይ! ለእኛም ለእርሱም ፊጥረት ባይ፤ ቀብሩን አሰፊለት፤ በውስጡም ኑር አብራለት።",
    targetCount: 3,
    source: "Sahih Muslim"
  },
  {
    id: 'garden_of_paradise',
    titleEn: 'Dua for Peace, Preservation, and Paradise (Light of the Grave)',
    titleAr: 'دعاء لجعل القبر روضة من رياض الجنة',
    titleAm: 'ቀብርን ከጀነት አትክልት ስፍራዎች አንዱ ለማድረግ የሚደረግ ዱዓእ',
    titleHar: 'ቀብሪ ኑር ባይ ዱዓእ',
    arabic: 'اللَّهُمَّ اجْعَلْ قَبْرَهُ رَوْضَةً مِنْ رِيَاضِ الْجَنَّةِ، وَلَا تَجْعَلْهُ حُفْرَةً مِنْ حُفَرِ النِّيرَانِ. اللَّهُمَّ يَمِّنْ كِتَابَهُ، وَيَسِّرْ حِسَابَهُ، وَثَقِّلْ بِالْحَسَنَاتِ مِيزَانَهُ، وَثَبِّتْ عَلَى الصِّرَاطِ أَقْدَامَهُ، وَأَسْكِنْهُ فِي أَعْلَى الْجَنَّاتِ بِجِوَارِ حَبِيبِكَ وَمُصْطَفَاكَ ﷺ.',
    transliteration: "Allaahum-maj'al qabrahu rawdatan min riyaadil-jannah, wa la taj'alhu hufratan min hufarin-neeraan. Allaahumma yammin kitaabahu, wa yassir hisaabahu, wa thaqqil bil-hasanaati meezaanahu, wa thabbit 'alas-siraati aqdaamahu, wa askinhu fee a'lal-jannaati bijiwaari habeebika wa mustafaak.",
    translationEn: "O Allah, make his grave a garden from the gardens of Paradise, and do not make it a pit from the pits of Hellfire. O Allah, make his record easy, lighten his accountability, weigh down his scale with good deeds, make his feet firm upon the Sirat bridge, and settle him in the highest Paradise alongside Your Beloved and Chosen One ﷺ.",
    translationAm: "አላህ ሆይ! ቀብሩን ከጀነት የአትክልት ስፍራዎች አንዱ አድርግለት እንጂ ከእሳት ጉድጓዶች አንዱ አታድርገው። አላህ ሆይ! መጽሐፉን በቀኝ በኩል ስጠው፤ ምርመራውን አግራልለት፤ በሚዛን ላይ በበጎ ሥራዎች ሚዛኑን አክብድለት፤ በሲራት ድልድይ ላይ እግሮቹን አጽናለት፤ በተወዳጁ መልዕክተኛህ ﷺ አጠገብ በላቀው ጀነት ውስጥ አስፍረው።",
    translationHar: "አላህ ሆይ! ቀብሩን ከጀነት ፊርዶስ አንዱ አድርግለት፤ ከእሳት ጉድጓድ አታድርገው። አላህ ሆይ! ኪታቡን በቀኝ በኩል ስጠው፤ ሂሳቡን አቅልለት፤ በሚዛን ላይ በጥሩ ስራዎቹ ሚዛኑን አክብድለት፤ በሲራት ድልድይ ላይ እግሩን አጽናለት፤ በተወዳጁ ረሱል ﷺ አጠገብ በጀነት ውስጥ አኑረው።",
    targetCount: 5,
    source: "Authentic Supplications"
  },
  {
    id: 'general_living_dead',
    titleEn: 'Dua for the Living and the Dead',
    titleAr: 'دعاء عام لجميع الأحياء والأموات',
    titleAm: 'ለሕያዋንም ለሞቱትም የሚደረግ አጠቃላይ ዱዓእ',
    titleHar: 'አጠቃላይ ዱዓእ',
    arabic: 'اللَّهُمَّ اغْفِرْ لِحَيِّنَا وَمَيِّتِنَا، وَشَاهِدِنَا وَغَائِبِنَا، وَصَغِيرِنَا وَكَبِيرِنَا، وَذَكَرِنَا وَأُنْثَانَا. اللَّهُمَّ مَنْ أَحْيَيْتَهُ مِنَّا فَأَحْيِهِ عَلَى الإِسْلاَمِ، وَمَنْ تَوَفَّيْتَهُ مِنَّا فَتَوَفَّهُ عَلَى الإِيمَانِ. اللَّهُمَّ لاَ تَحْرِمْنَا أَجْرَهُ وَلاَ تُضِلَّنَا بَعْدَهُ.',
    transliteration: "Allaahum-maghfir lihayyina wa mayyitina, wa shaahidina wa ghaa'ibina, wa sagheerina wa kabeerina, wa dhakarina wa unthaana. Allaahumma man ahyaytahu minna fa-ahyahi 'alal-Islaam, wa man tawaffaytahu minna fatawaffahu 'alal-Eemaan. Allaahumma la tahrimna ajrahu wa la tudillana ba'dahu.",
    translationEn: "O Allah, forgive our living and our dead, those present and those absent, our young and our old, our males and our females. O Allah, whomsoever among us You keep alive, keep him alive upon Islam, and whomsoever among us You cause to die, cause him to die upon faith. O Allah, do not deprive us of his reward and do not let us go astray after him.",
    translationAm: "አላህ ሆይ! በሕይወት ያሉትንም የሞቱትንም፣ እዚህ ያሉትንም የሌሉትንም፣ ታናናሾቻችንንም ታላላቆቻችንንም፣ ወንዶቻችንንም ሴቶቻችንንም ማር። አላህ ሆይ! ከእኛ መካከል በሕይወት የምታቆየውን በእስልምና ላይ አቆየው፤ የምትገድለውንም በእምነት (በኢማን) ላይ ግደለው። አላህ ሆይ! ምንዳውን አታሳጣን፤ ከእርሱ በኋላም አታጠምመን።",
    translationHar: "አላህ ሆይ! በሕይወት ያሉትንም የሞቱትንም፣ እዚህ ያሉትንም የሌሉትንም፣ ታናናሾቻችንንም ታላላቆቻችንንም، ወንዶቻችንንም ሴቶቻችንንም መሃር። አላህ ሆይ! ከእኛ መካከል በሕይወት የምታቆየውን በእስልምና ላይ አቁየው፤ የምትገድለውንም በእምነት ላይ ግደለው። አላህ ሆይ! ምንዳውን አታሳጣን፤ ከእርሱ በኋላም አታጠምመን።",
    targetCount: 3,
    source: "Sunan At-Tirmidhi"
  }
];

interface DuaDeceasedSectionProps {
  onBackToHome?: () => void;
}

export const DuaDeceasedSection: React.FC<DuaDeceasedSectionProps> = ({ onBackToHome }) => {
  const { language, showDuaTransliteration, showDuaTranslation } = useLanguage();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [savedIds, setSavedIds] = useState<string[]>([]);

  // Load counts and saved favorite duas on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('deceased-duas-counts');
      if (saved) {
        setCounts(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load deceased duas counts:", e);
    }

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

  const toggleFavorite = (item: {
    id: string;
    category: 'general' | 'deceased' | 'azkar' | 'custom';
    title: string;
    arabicText: string;
    transliterationText?: string;
    translationText: string;
    reference?: string;
    tags: string[];
  }) => {
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
      updated = [...current, { ...item, timestamp: Date.now() }];
    }
    localStorage.setItem('my-favorite-duas', JSON.stringify(updated));
    setSavedIds(updated.map(d => d.id));
    window.dispatchEvent(new Event('my-duas-updated'));
  };

  // Save counts on change
  const updateCount = (id: string, target: number) => {
    setCounts(prev => {
      const current = prev[id] || 0;
      const nextCount = current < target ? current + 1 : 0; // resets after reaching target or stays at target? Let's cycle or increase
      const newCounts = {
        ...prev,
        [id]: nextCount
      };
      try {
        localStorage.setItem('deceased-duas-counts', JSON.stringify(newCounts));
      } catch (e) {
        console.error(e);
      }
      return newCounts;
    });
  };

  const resetAllCounts = () => {
    setCounts({});
    try {
      localStorage.removeItem('deceased-duas-counts');
    } catch (e) {
      console.error(e);
    }
  };

  const getTitle = (item: DeceasedDuaItem) => {
    if (language === 'ar') return item.titleAr;
    if (language === 'am') return item.titleAm;
    if (language === 'har') return item.titleHar;
    return item.titleEn;
  };

  const getTranslation = (item: DeceasedDuaItem) => {
    if (language === 'ar') return ''; // No translation needed for Arabic in Arabic mode
    if (language === 'am') return item.translationAm;
    if (language === 'har') return item.translationHar;
    return item.translationEn;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-all active:scale-95 shadow-sm"
        >
          <ArrowLeft size={14} />
          <span>{language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
        </button>

        <button
          onClick={resetAllCounts}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 cursor-pointer active:scale-95 transition-all"
        >
          <RefreshCw size={12} />
          <span>{language === 'ar' ? 'إعادة ضبط العدادات' : 'Reset Counters'}</span>
        </button>
      </div>

      {/* 2. Top Dedication Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-white rounded-3xl p-6 sm:p-10 border border-amber-500/30 shadow-xl text-left">
        <div className="absolute top-0 right-0 w-84 h-84 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-84 h-84 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-4xl">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/20 tracking-wider uppercase">
            <Award size={12} className="animate-pulse" />
            {language === 'ar' ? 'صدقة جارية مستمرة' : 'Ongoing Sadaqa Jaria'}
          </span>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight leading-tight">
            {language === 'ar' 
              ? 'أدعية الرحمة والمغفرة للمتوفى' 
              : 'Supplications of Mercy & Forgiveness for the Deceased'}
          </h2>
          
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-1.5">
            <p className="text-sm text-amber-200 font-bold tracking-wide">
              {language === 'ar' 
                ? 'إهداء خاص لروح المغفور له بإذن الله الحاج أحمد خليل فقيه' 
                : 'Dedicated to the memory of Al-Hajj Ahmed Khalil Faqih'}
            </p>
            <p className="text-xs text-primary-200">
              {language === 'ar' 
                ? 'بمناسبة الذكرى السنوية العشرين لرحيله (٢٢ يونيو ٢٠٠٦ - ٢٢ يونيو ٢٠٢٦)' 
                : 'On the 20th Anniversary of His Passing (June 22, 2006 – June 22, 2026)'}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-primary-100 leading-relaxed max-w-3xl">
            {language === 'ar'
              ? 'ندعوكم لتلاوة هذه الأدعية المأثورة بنية الرحمة والمغفرة لفقيدنا الحاج أحمد خليل فقيه، ولسائر أموات المسلمين. جعلها الله في ميزان حسناته ونوراً لقبره.'
              : 'We invite you to read these authentic supplications with the intention of mercy and forgiveness for Al-Hajj Ahmed Khalil Faqih and all deceased Muslims. May Allah make it a source of light and comfort in their graves.'}
          </p>
        </div>
      </div>

      {/* 3. Supplications Grid */}
      <div className="space-y-6">
        {deceasedDuas.map((item, idx) => {
          const currentCount = counts[item.id] || 0;
          const isCompleted = currentCount >= item.targetCount;
          
          return (
            <div 
              key={item.id}
              className={`bg-white/95 dark:bg-slate-900 border rounded-2xl p-6 sm:p-8 shadow-sm transition-all flex flex-col md:flex-row items-stretch gap-6 relative overflow-hidden
                ${isCompleted ? 'border-emerald-300 dark:border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/5' : 'border-secondary-200 dark:border-slate-800'}`}
            >
              {/* Left Column: Tally Counter Widget */}
              <div className="flex md:flex-col items-center justify-between md:justify-center gap-4 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-4 md:pb-0 md:pr-6 flex-shrink-0 min-w-[120px]">
                <div className="text-center md:text-left space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    {language === 'ar' ? 'التكرار المطلوب' : 'Target Recitations'}
                  </span>
                  <div className="flex items-center gap-1 justify-center md:justify-start">
                    <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{currentCount}</span>
                    <span className="text-slate-400 font-medium">/</span>
                    <span className="text-sm font-bold text-slate-500">{item.targetCount}</span>
                  </div>
                </div>

                <button
                  onClick={() => updateCount(item.id, item.targetCount)}
                  className={`w-14 h-14 rounded-full border-2 font-bold flex flex-col items-center justify-center transition-all cursor-pointer active:scale-90 select-none
                    ${isCompleted 
                      ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20 shadow-md' 
                      : 'bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-800 dark:bg-slate-800 dark:border-slate-700 dark:text-amber-400'}`}
                >
                  {isCompleted ? (
                    <span className="text-xs uppercase font-extrabold tracking-tight">Done</span>
                  ) : (
                    <>
                      <span className="text-xs font-bold leading-none">Tap</span>
                      <span className="text-[10px] text-slate-400 font-medium mt-0.5">+{item.targetCount - currentCount}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Column: Dua Texts & Content */}
              <div className="flex-grow space-y-5 text-left">
                {/* Header title */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[9px] font-extrabold uppercase tracking-wide border border-amber-200/20">
                      {item.source}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white leading-snug">
                      {getTitle(item)}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                        <Star size={11} className="fill-current" />
                        <span>{language === 'ar' ? 'تمت القراءة' : 'Completed'}</span>
                      </span>
                    )}
                    <button
                      onClick={() => toggleFavorite({
                        id: item.id,
                        category: 'deceased',
                        title: item.titleEn,
                        arabicText: item.arabic,
                        transliterationText: item.transliteration,
                        translationText: item.translationEn,
                        reference: item.source,
                        tags: ['Deceased', 'Sadaqah']
                      })}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        savedIds.includes(item.id)
                          ? 'bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/40 dark:border-rose-900/40'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500'
                      }`}
                      title={savedIds.includes(item.id) ? 'Remove from favorites' : 'Save to My Duas'}
                    >
                      <Heart size={14} className={savedIds.includes(item.id) ? 'fill-current text-rose-500' : ''} />
                    </button>
                  </div>
                </div>

                {/* Arabic Calligraphy text block */}
                <div className="bg-slate-50 dark:bg-slate-950/50 p-5 rounded-2xl border border-slate-100/60 dark:border-slate-800/40 relative">
                  <p className="font-arabic text-2xl sm:text-3xl text-slate-900 dark:text-white !leading-[2.0] tracking-wide text-center" dir="rtl">
                    {item.arabic}
                  </p>
                </div>

                {/* Transliteration */}
                {showDuaTransliteration && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">
                      {language === 'ar' ? 'نطق الحروف' : 'Transliteration'}
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 italic font-serif leading-relaxed">
                      "{item.transliteration}"
                    </p>
                  </div>
                )}

                {/* Translation block if not in Arabic mode */}
                {showDuaTranslation && language !== 'ar' && (
                  <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800/50 pt-4">
                    <span className="text-[10px] font-extrabold tracking-widest text-amber-700 dark:text-amber-400 uppercase">
                      {language === 'am' ? 'ትርጉም' : (language === 'har' ? 'ትርጉም' : 'Translation')}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                      {getTranslation(item)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default DuaDeceasedSection;
