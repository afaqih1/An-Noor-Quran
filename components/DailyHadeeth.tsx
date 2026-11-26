import React, { useState, useEffect } from 'react';
import { Sparkles, Share2, Copy, Check, ChevronRight, ChevronLeft, BookOpen, MessageSquare } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface HadeethItem {
  id: string;
  arabic: string;
  english: string;
  amharic: string;
  harari: string;
  sourceEn: string;
  sourceAr: string;
  narratorEn: string;
  narratorAr: string;
}

const hadeethCollection: HadeethItem[] = [
  {
    id: 'learn_quran',
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    english: "The best among you are those who learn the Quran and teach it.",
    amharic: "ከእናንተ መካከል በላጭ ማለት ቁርአንን ተምሮ ያስተማረ ነው።",
    harari: "ከአኽዋችሁ በላጭ ቁርአን ተምሮ ያስተማረ መሪዞትኡን።",
    sourceEn: "Sahih al-Bukhari",
    sourceAr: "صحيح البخاري",
    narratorEn: "Narrated by Uthman bin Affan",
    narratorAr: "عن عثمان بن عفان رضي الله عنه"
  },
  {
    id: 'seek_knowledge',
    arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    english: "Whoever takes a path upon which to obtain knowledge, Allah makes the path to Paradise easy for him.",
    amharic: "እውቀትን ለመፈለግ መንገድን የጀመረ ሰው አላህ ወደ ጀነት የሚወስደውን መንገድ ያቀልለታል።",
    harari: "ሒልሚ ለመፈለግ መንገዲ የጀመረ አላህ ወደ ጀነት ሚወሲደው መንገዲ ያቀልለታል።",
    sourceEn: "Sahih Muslim",
    sourceAr: "صحيح مسلم",
    narratorEn: "Narrated by Abu Hurayrah",
    narratorAr: "عن أبي هريرة رضي الله عنه"
  },
  {
    id: 'beloved_deeds',
    arabic: "أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ",
    english: "The most beloved of deeds to Allah are those that are most consistent, even if they are small.",
    amharic: "አላህ ዘንድ በጣም ተወዳጅ ሥራዎች አነስተኛም ቢሆኑ ዘላቂነት ያላቸው ናቸው።",
    harari: "አላህ ጋር በሀር ተወዳጅ ስራዎች ቢነስም ዘላቂነት ያለባው ኡንታን።",
    sourceEn: "Sahih al-Bukhari & Muslim",
    sourceAr: "متفق عليه",
    narratorEn: "Narrated by Aisha",
    narratorAr: "عن عائشة رضي الله عنها"
  },
  {
    id: 'love_brother',
    arabic: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    english: "None of you truly believes until he loves for his brother what he loves for himself.",
    amharic: "ለራሱ የሚወደውን ለወንድሙ እስከማይወድ ድረስ ከእናንተ ማንም እውነተኛ አማኝ አይሆንም።",
    harari: "ለናፍሱ የሚወደውን ለአኩሁ እስከማይወድ ድረስ አማኝ አይሆንም።",
    sourceEn: "Sahih al-Bukhari & Muslim",
    sourceAr: "متفق عليه",
    narratorEn: "Narrated by Anas bin Malik",
    narratorAr: "عن أنس بن مالك رضي الله عنه"
  },
  {
    id: 'intentions',
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    english: "Actions are but by intentions, and every person shall have only that which he intended.",
    amharic: "ሥራዎች በሀሳብ (በኒያ) ብቻ የሚመዘኑ ናቸው፤ ለእያንዳንዱም ሰው ያሰበው ብቻ አለው።",
    harari: "ስራዎች በኒያ ብቻ ሚመዘኑ ናባው፤ ለኩሉ ሰብም ያሰበው ብቻ አልው።",
    sourceEn: "Sahih al-Bukhari & Muslim",
    sourceAr: "متفق عليه",
    narratorEn: "Narrated by Umar bin Al-Khattab",
    narratorAr: "عن عمر بن الخطاب رضي الله عنه"
  },
  {
    id: 'religion_sincerity',
    arabic: "الدِّينُ النَّصِيحَةُ",
    english: "The religion is sincerity and good counsel.",
    amharic: "ሃይማኖት ማለት ምክርና ታማኝነት ነው።",
    harari: "ዲን መሪዞት ናሲሀ ኡንታን።",
    sourceEn: "Sahih Muslim",
    sourceAr: "صحيح مسلم",
    narratorEn: "Narrated by Tamim ad-Dari",
    narratorAr: "عن تميم الداري رضي الله عنه"
  },
  {
    id: 'friday_hour',
    arabic: "فِي يَوْمِ الْجُمُعَةِ سَاعَةٌ لاَ يُوَافِقُهَا عَبْدٌ مُسْلِمٌ وَهُوَ قَائِمٌ يُصَلِّي يَسْأَلُ اللَّهَ تَعَالَى شَيْئًا إِلاَّ أَعْطَاهُ إِيَّاهُ",
    english: "There is an hour on Friday and if a Muslim servant happens to pray and ask Allah for something at this time, He will grant it to him.",
    amharic: "በጁምዓ ቀን አንዲት እጅግ የተባረከች ሰዓት አለች፤ ሙስሊም ባሪያ ቆሞ እየሰገደ አላህን አንዳች ነገር ሲለምን ከገጠማት አላህ የለመነውን ይሰጠዋል።",
    harari: "በጁምዓ መዓልት በሀር የተባረከች ሰዓት አለች፤ ሙስሊም በሪያ ቆሞ እየሰገደ አላህን አንዳች ሲለምናት አላህ ይሰጠዋል።",
    sourceEn: "Sahih al-Bukhari & Muslim",
    sourceAr: "متفق عليه",
    narratorEn: "Narrated by Abu Hurayrah",
    narratorAr: "عن أبي هريرة رضي الله عنه"
  }
];

export const DailyHadeeth: React.FC = () => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  // Determine daily hadeeth index using date seed
  useEffect(() => {
    const today = new Date();
    // Use day of year or date-based key as seed
    const daySeed = today.getFullYear() * 1000 + (today.getMonth() + 1) * 100 + today.getDate();
    const seedIndex = daySeed % hadeethCollection.length;
    setCurrentIndex(seedIndex);
  }, []);

  const currentHadeeth = hadeethCollection[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % hadeethCollection.length);
    setCopied(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + hadeethCollection.length) % hadeethCollection.length);
    setCopied(false);
  };

  const getTranslatedText = (item: HadeethItem) => {
    if (language === 'ar') return '';
    if (language === 'am') return item.amharic;
    if (language === 'har') return item.harari;
    return item.english;
  };

  const getSourceLabel = (item: HadeethItem) => {
    return language === 'ar' ? item.sourceAr : item.sourceEn;
  };

  const getNarratorLabel = (item: HadeethItem) => {
    return language === 'ar' ? item.narratorAr : item.narratorEn;
  };

  const handleCopy = () => {
    const textToCopy = `Hadeeth of the Day
${currentHadeeth.narratorEn}: "${currentHadeeth.english}" - [${currentHadeeth.sourceEn}]

الحديث اليوم
${currentHadeeth.narratorAr}: "${currentHadeeth.arabic}" - [${currentHadeeth.sourceAr}]`;

    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy Hadeeth:", err));
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-secondary-200 p-6 space-y-5 text-left relative overflow-hidden transition-all duration-300">
      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
      
      {/* Header section with sparkling icon and pagination controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
          <Sparkles size={14} className="fill-current text-amber-500 animate-pulse" />
          <span>{language === 'ar' ? 'الحديث الشريف اليومي' : 'Daily Authentic Hadeeth'}</span>
        </div>
        
        {/* Navigation / Browsing controls */}
        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900/60 p-1 rounded-lg border border-slate-100">
          <button
            onClick={handlePrev}
            className="p-1 text-slate-500 hover:text-amber-700 dark:hover:text-amber-400 rounded-md hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Previous Hadeeth"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-[10px] font-mono font-bold text-slate-400 px-1">
            {currentIndex + 1}/{hadeethCollection.length}
          </span>
          <button
            onClick={handleNext}
            className="p-1 text-slate-500 hover:text-amber-700 dark:hover:text-amber-400 rounded-md hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Next Hadeeth"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Main content body */}
      <div className="space-y-4">
        {/* Arabic Narrator details */}
        <p className="text-right text-xs font-serif font-semibold text-amber-850 dark:text-amber-400/80 leading-none" dir="rtl">
          {currentHadeeth.narratorAr}
        </p>

        {/* Beautiful Arabic content with responsive high-contrast layout */}
        <div className="bg-amber-50/20 dark:bg-slate-950/40 p-4 rounded-xl border border-amber-300/10 dark:border-amber-500/5 relative">
          <p className="font-arabic text-slate-900 dark:text-white text-xl sm:text-2xl text-center leading-[1.8] font-medium" dir="rtl">
            {currentHadeeth.arabic}
          </p>
        </div>

        {/* Translation Block */}
        {language !== 'ar' && (
          <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/50 pt-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {getNarratorLabel(currentHadeeth)}
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-medium">
              "{getTranslatedText(currentHadeeth)}"
            </p>
          </div>
        )}

        {/* Footer actions and metadata */}
        <div className="flex items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800/50 pt-3">
          <span className="inline-flex px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-extrabold uppercase tracking-wide border border-amber-200/20">
            {getSourceLabel(currentHadeeth)}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-1.5 text-slate-500 hover:text-amber-700 dark:hover:text-amber-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all active:scale-95 flex items-center gap-1 text-[10px] font-semibold cursor-pointer"
              title="Copy Hadeeth"
            >
              {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
              <span>{copied ? (language === 'ar' ? 'تم النسخ' : 'Copied!') : (language === 'ar' ? 'نسخ' : 'Copy')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyHadeeth;
