import React, { useState } from 'react';
import { surahTableData } from '../data';
import { Play, Pause, BookOpen, Book, Sparkles, Home, Moon, Utensils, Building } from 'lucide-react';
import { useAudio } from './AudioContext';
import { useLanguage } from './LanguageContext';
import { DuaAudioPlayer } from './DuaAudioPlayer';
import QuranModal from './QuranModal';

// Start pages for all 114 Surahs in Madinah Mushaf
const SURAH_START_PAGES: Record<number, number> = {
  1:1, 2:2, 3:50, 4:77, 5:106, 6:128, 7:151, 8:177, 9:187, 10:208,
  11:221, 12:235, 13:249, 14:255, 15:262, 16:267, 17:282, 18:293, 19:305, 20:312,
  21:322, 22:332, 23:342, 24:350, 25:359, 26:367, 27:377, 28:385, 29:396, 30:404,
  31:411, 32:415, 33:418, 34:428, 35:434, 36:440, 37:446, 38:453, 39:458, 40:467,
  41:477, 42:483, 43:489, 44:496, 45:499, 46:502, 47:507, 48:511, 49:515, 50:518,
  51:520, 52:523, 53:526, 54:528, 55:531, 56:534, 57:537, 58:542, 59:545, 60:549,
  61:551, 62:553, 63:554, 64:556, 65:558, 66:560, 67:562, 68:564, 69:566, 70:568,
  71:570, 72:572, 73:574, 74:575, 75:577, 76:578, 77:580, 78:582, 79:583, 80:585,
  81:586, 82:587, 83:587, 84:589, 85:590, 86:591, 87:591, 88:592, 89:593, 90:594,
  91:595, 92:595, 93:596, 94:596, 95:597, 96:597, 97:598, 98:598, 99:599, 100:599,
  101:600, 102:600, 103:601, 104:601, 105:601, 106:602, 107:602, 108:602, 109:603, 110:603,
  111:603, 112:604, 113:604, 114:604
};

const dailyOccasionDuas = [
  {
    id: 'entering_home',
    title: {
      en: 'Entering the Home',
      ar: 'عند دخول المنزل',
      am: 'ወደ ቤት ሲገቡ'
    },
    arabic: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
    transliteration: "Bismillahi walajna, wa bismillahi kharajna, wa 'ala Allahi Rabbina tawakkalna.",
    translation: {
      en: "In the name of Allah we enter, and in the name of Allah we go out, and upon Allah our Lord we depend.",
      ar: "بسم الله ولجنا، وبسم الله خرجنا، وعلى الله ربنا توكلنا.",
      am: "በአላህ ስም ገባን፣ በአላህም ስም ወጣን፣ በጌታችን በአላህ ላይም ተጠጋን።"
    },
    reference: 'Sunan Abi Dawud [5096]',
    category: 'home'
  },
  {
    id: 'exiting_home',
    title: {
      en: 'Exiting the Home',
      ar: 'عند الخروج من المنزل',
      am: 'ከቤት ሲወጡ'
    },
    arabic: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: "Bismillahi, tawakkaltu 'ala Allahi, wa la hawla wa la quwwata illa billah.",
    translation: {
      en: "In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.",
      ar: "بسم الله، توكلت على الله، ولا حول ولا قوة إلا بالله.",
      am: "በአላህ ስም၊ በአላህ ላይ ተጠጋሁ፤ ከአላህ በስተቀር ምንም ኃይልና ጥንካሬ የለም።"
    },
    reference: 'Sunan Abi Dawud [5095]',
    category: 'home'
  },
  {
    id: 'going_to_sleep',
    title: {
      en: 'Before Sleeping',
      ar: 'عند النوم',
      am: 'ከመተኛት በፊት'
    },
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: "Bismika Allahumma amutu wa ahya.",
    translation: {
      en: "In Your name, O Allah, I die and I live.",
      ar: "باسمك اللهم أموت وأحيا.",
      am: "አላህ ሆይ! በአንተ ስም እሞታለሁ (እተኛለሁ)፣ ሕያውም እሆናለሁ (እነቃለሁ)።"
    },
    reference: 'Sahih al-Bukhari [6324]',
    category: 'sleep'
  },
  {
    id: 'waking_up',
    title: {
      en: 'Upon Waking Up',
      ar: 'عند الاستيقاظ',
      am: 'ከእንቅልፍ ሲነቁ'
    },
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur.",
    translation: {
      en: "Praise is to Allah Who gave us life after He had caused us to die, and to Him is the resurrection.",
      ar: "الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور.",
      am: "ለሞት ካደረሰን በኋላ ሕያው ላደረገን አላህ ምስጋና ይገባው፣ መመለሻም ወደ እርሱ ብቻ ነው።"
    },
    reference: 'Sahih al-Bukhari [6312]',
    category: 'sleep'
  },
  {
    id: 'before_eating',
    title: {
      en: 'Before Eating',
      ar: 'قبل الطعام',
      am: 'ምግብ ከመብላት በፊት'
    },
    arabic: 'بِسْمِ اللَّهِ',
    transliteration: "Bismillahi.",
    translation: {
      en: "In the name of Allah.",
      ar: "بسم الله.",
      am: "በአላህ ስም"
    },
    reference: 'Sunan Abi Dawud [3767]',
    category: 'food'
  },
  {
    id: 'after_eating',
    title: {
      en: 'After Eating',
      ar: 'بعد الطعام',
      am: 'ከምግብ በኋላ'
    },
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    transliteration: "Alhamdu lillahil-ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwatin.",
    translation: {
      en: "Praise is to Allah Who has fed me this and provided it for me without any might or power from myself.",
      ar: "الحمد لله الذي أطعمني هذا ورزقنيه من غير حول مني ولا قوة.",
      am: "ምንም ዓይነት ኃይልና ጥንካሬ ከእኔ ሳይሆን ይህንን ላበላኝና ለሰጠኝ አላህ ምስጋና ይገባው።"
    },
    reference: 'Jami` at-Tirmidhi [3458]',
    category: 'food'
  },
  {
    id: 'entering_mosque',
    title: {
      en: 'Entering the Mosque',
      ar: 'عند دخول المسجد',
      am: 'ወደ መስጂድ ሲገቡ'
    },
    arabic: 'بِسْمِ اللَّهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ. اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    transliteration: "Bismillahi, was-salatu was-salamu 'ala Rasulillah. Allahummaftah li abwaba rahmatik.",
    translation: {
      en: "In the name of Allah, and blessings and peace be upon the Messenger of Allah. O Allah, open for me the gates of Your mercy.",
      ar: "بسم الله، والصلاة والسلام على رسول الله، اللهم افتح لي أبواب رحمتك.",
      am: "በአላህ ስም፣ ሶላትና ሰላም በነቢዩ ላይ ይውረድ፤ አላህ ሆይ! የእዝነትህን በሮች ክፈትልኝ።"
    },
    reference: 'Sahih Muslim [713]',
    category: 'mosque'
  },
  {
    id: 'leaving_mosque',
    title: {
      en: 'Leaving the Mosque',
      ar: 'عند الخروج من المسجد',
      am: 'ከመስጂድ ሲወጡ'
    },
    arabic: 'بِسْمِ اللَّهِ وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    transliteration: "Bismillahi was-salatu was-salamu 'ala Rasulillah, Allahumma inni as'aluka min fadlik.",
    translation: {
      en: "In the name of Allah, and peace and blessings be upon the Messenger of Allah. O Allah, I ask You from Your favor.",
      ar: "بسم الله والصلاة والسلام على رسول الله، اللهم إني أسألك من فضلك.",
      am: "በአላህ ስም፣ ሶላትና ሰላም በነቢዩ ላይ ይውረድ፤ አላህ ሆይ! ከትሩፋትህ እለምንሃለሁ።"
    },
    reference: 'Sahih Muslim [713]',
    category: 'mosque'
  }
];

const occasionCategories = [
  { id: 'all', label: { en: 'All Occasions', ar: 'جميع الأحوال', am: 'ሁሉም ሁኔታዎች' } },
  { id: 'home', label: { en: 'Home & Travel', ar: 'المنزل والسفر', am: 'ቤትና ጉዞ' } },
  { id: 'sleep', label: { en: 'Sleep & Waking', ar: 'النوم والاستيقاظ', am: 'እንቅልፍና መነሳት' } },
  { id: 'food', label: { en: 'Food & Drink', ar: 'الطعام والشراب', am: 'ምግብና መጠጥ' } },
  { id: 'mosque', label: { en: 'Mosque & Prayer', ar: 'المسجد والصلاة', am: 'መስጂድና ሶላት' } },
];

const OtherRecommendations: React.FC = () => {
  const { currentSurah, isPlaying, playSurah, togglePlay } = useAudio();
  const { language } = useLanguage();
  const [readingSurah, setReadingSurah] = useState<{id: number, chapter: number, name: string} | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const openReader = (chapter: number) => {
    const surah = surahTableData.find(s => s.chapter === chapter);
    if (surah) {
      setReadingSurah({
        id: surah.id,
        chapter: surah.chapter,
        name: surah.name
      });
    }
  };

  const closeReader = () => {
    setReadingSurah(null);
  };

  const SurahRow = ({ chapter, label }: { chapter: number; label?: string }) => {
    const surah = surahTableData.find((s) => s.chapter === chapter);
    if (!surah) return null;

    const isActive = currentSurah?.id === surah.id;
    const isThisPlaying = isActive && isPlaying;

    const handleTogglePlay = () => {
      if (isActive) {
        togglePlay();
      } else {
        playSurah(surah);
      }
    };

    return (
      <div className="flex items-center justify-between w-full">
        <div>
          {label && <p className="text-xs text-secondary-500 font-medium mb-0.5 uppercase tracking-wide">{label}</p>}
          <p className="font-semibold text-slate-800 text-sm sm:text-base">
            {surah.name} <span className="text-secondary-400 font-normal text-sm">({surah.chapter})</span>
          </p>
        </div>
        <div className="flex items-center gap-2 ml-3">
          <button
            onClick={handleTogglePlay}
            className={`p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 flex-shrink-0 cursor-pointer select-none
              ${isThisPlaying 
                ? 'bg-primary-100 text-primary-700' 
                : 'bg-slate-100 text-slate-500 hover:text-primary-600 hover:bg-primary-50'}`}
            aria-label={isThisPlaying ? "Pause" : "Play"}
          >
            {isThisPlaying ? (
              <Pause size={16} className="fill-current" />
            ) : (
              <Play size={16} className="fill-current" />
            )}
          </button>
          <button
            onClick={() => openReader(surah.chapter)}
            className="p-2 rounded-full bg-slate-100 text-primary-600 hover:bg-primary-50 hover:text-primary-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 flex-shrink-0 cursor-pointer"
            aria-label="Read Surah Text"
            title="Read Digital Text"
          >
            <BookOpen size={16} />
          </button>
          <button
            onClick={() => {
              const startPage = SURAH_START_PAGES[surah.chapter] || 1;
              window.dispatchEvent(new CustomEvent('open-classic-mushaf-modal', { detail: { page: startPage } }));
            }}
            className="p-2 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 flex-shrink-0 cursor-pointer"
            aria-label="Read Surah in Classic Mushaf"
            title="Read in Classic Mushaf"
          >
            <Book size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="space-y-8">
      {/* Surahs card */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-secondary-200 p-6 sm:p-10">
        <h3 id="other-intro-title" className="text-2xl font-bold text-slate-800 mb-6 font-serif">Other Recommended Surahs</h3>
        <p id="other-intro-desc" className="text-slate-600 mb-8">
          While Al-Kahf is the primary voluntary recitation, the Sunnah indicates other Surahs for specific times on Friday.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          
          {/* Fajr Column */}
          <div>
            <h4 className="flex items-center gap-2 text-lg font-semibold text-primary-700 mb-4 border-b border-primary-100 pb-2">
              <span>🌅</span> For Fajr Prayer
            </h4>
            <p className="text-sm text-slate-500 mb-4">
              It was the practice of the Prophet (SAW) to recite these in the Friday Fajr congregation:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 p-3 rounded-lg bg-slate-50/50 hover:bg-secondary-50/50 transition-colors border border-transparent hover:border-secondary-100">
                <div className="font-bold text-secondary-300 text-xl leading-none mt-1">1</div>
                <SurahRow chapter={32} label="First Rakah" />
              </li>
              <li className="flex items-start gap-3 p-3 rounded-lg bg-slate-50/50 hover:bg-secondary-50/50 transition-colors border border-transparent hover:border-secondary-100">
                <div className="font-bold text-secondary-300 text-xl leading-none mt-1">2</div>
                <SurahRow chapter={76} label="Second Rakah" />
              </li>
            </ul>
          </div>

          {/* Jummah Column */}
          <div>
            <h4 className="flex items-center gap-2 text-lg font-semibold text-primary-700 mb-4 border-b border-primary-100 pb-2">
              <span>🕌</span> During Jumu'ah Prayer
            </h4>
            <p className="text-sm text-slate-500 mb-4">
              Imams often recite these Surahs during the congregational prayer, following the Prophet's example:
            </p>
            
            <div className="space-y-4">
              <div className="bg-slate-50/50 p-4 rounded-lg border border-transparent hover:border-secondary-100 transition-colors hover:bg-secondary-50/30">
                 <p className="text-xs font-semibold text-secondary-400 uppercase tracking-wide mb-3">Option Set A</p>
                 <div className="space-y-3 divide-y divide-slate-200/50">
                   <div className="pb-1">
                     <SurahRow chapter={62} />
                   </div>
                   <div className="pt-2">
                     <SurahRow chapter={63} />
                   </div>
                 </div>
              </div>

              <div className="bg-slate-50/50 p-4 rounded-lg border border-transparent hover:border-secondary-100 transition-colors hover:bg-secondary-50/30">
                 <p className="text-xs font-semibold text-secondary-400 uppercase tracking-wide mb-3">Option Set B</p>
                 <div className="space-y-3 divide-y divide-slate-200/50">
                   <div className="pb-1">
                     <SurahRow chapter={87} />
                   </div>
                   <div className="pt-2">
                     <SurahRow chapter={88} />
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* General, Nightly & Protection Section */}
        <div className="mt-10 border-t border-slate-100 pt-8">
          <h4 className="flex items-center gap-2 text-lg font-semibold text-primary-700 mb-4">
            <span>🌙</span> General, Nightly & Protection
          </h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
               <p className="text-sm text-slate-500 font-medium">Recommended for Blessings & Gratitude</p>
               <div className="bg-slate-50/50 p-4 rounded-lg border border-transparent hover:border-secondary-100 transition-colors">
                 <div className="space-y-4 divide-y divide-slate-200/50">
                   <div className="pb-1"><SurahRow chapter={55} /></div> {/* Al-Rahman */}
                   <div className="pt-2 pb-1"><SurahRow chapter={56} /></div> {/* Al-Waqiah */}
                   <div className="pt-2"><SurahRow chapter={67} /></div> {/* Al-Mulk */}
                 </div>
               </div>
            </div>
             <div className="space-y-3">
               <p className="text-sm text-slate-500 font-medium">The 3 Quls (Daily Protection)</p>
               <div className="bg-slate-50/50 p-4 rounded-lg border border-transparent hover:border-secondary-100 transition-colors">
                 <div className="space-y-4 divide-y divide-slate-200/50">
                   <div className="pb-1"><SurahRow chapter={112} /></div>
                   <div className="pt-2 pb-1"><SurahRow chapter={113} /></div>
                   <div className="pt-2"><SurahRow chapter={114} /></div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Occasions & Etiquette Supplications Collection */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-secondary-200 p-6 sm:p-10" id="daily-occasions-section">
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-800 dark:text-white flex items-center gap-2">
              <Sparkles className="text-primary-700 dark:text-primary-400 w-6 h-6" />
              {language === 'ar' ? 'أدعية المناسبات والأحوال اليومية' : (language === 'am' ? 'ዕለታዊ ዱዓዎችና የአጋጣሚዎች ስብስብ' : 'Daily Occasions & Etiquette Duas')}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1.5 text-sm leading-relaxed">
              {language === 'ar' 
                ? 'باقة من الأدعية اليومية والمأثورة لمختلف أحوالك ومناسباتك مع تلاوة صوتية ونطق تفاعلي دقيق لمساعدتك على الحفظ الصحيح.' 
                : (language === 'am' 
                  ? 'ዕለታዊ ዱዓዎችና ዝክሮች ከተለያዩ አጋጣሚዎች ጋር። ትክክለኛውን ድምፅ ለመማርና ለመለማመድ ድምፅ ማጫወቻውን ይጠቀሙ።' 
                  : 'Supplications for daily life occasions with high-quality real-time audio recitation and speed controls to master correct Arabic pronunciation.')}
            </p>
          </div>
        </div>

        {/* Categories Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6" id="occasion-tabs">
          {occasionCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const catLabel = cat.label[language as 'en' | 'ar' | 'am'] || cat.label.en;
            
            // Get Category icon dynamically
            let icon = <Sparkles className="w-3.5 h-3.5" />;
            if (cat.id === 'home') icon = <Home className="w-3.5 h-3.5" />;
            if (cat.id === 'sleep') icon = <Moon className="w-3.5 h-3.5" />;
            if (cat.id === 'food') icon = <Utensils className="w-3.5 h-3.5" />;
            if (cat.id === 'mosque') icon = <Building className="w-3.5 h-3.5" />;

            return (
              <button
                key={cat.id}
                id={`tab-cat-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shadow-2xs select-none cursor-pointer focus:ring-2 focus:ring-primary-500/40 focus:outline-none
                  ${isSelected
                    ? 'bg-primary-800 border-primary-800 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-slate-300'}`}
              >
                {icon}
                <span>{catLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Bento Grid of Occasion Duas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="occasions-grid">
          {dailyOccasionDuas
            .filter((dua) => selectedCategory === 'all' || dua.category === selectedCategory)
            .map((dua) => {
              const titleText = dua.title[language as 'en' | 'ar' | 'am'] || dua.title.en;
              const translationText = dua.translation[language as 'en' | 'ar' | 'am'] || dua.translation.en;
              
              let catIcon = <Sparkles className="w-4 h-4 text-secondary-500 shrink-0" />;
              if (dua.category === 'home') catIcon = <Home className="w-4 h-4 text-emerald-500 shrink-0" />;
              if (dua.category === 'sleep') catIcon = <Moon className="w-4 h-4 text-purple-500 shrink-0" />;
              if (dua.category === 'food') catIcon = <Utensils className="w-4 h-4 text-amber-500 shrink-0" />;
              if (dua.category === 'mosque') catIcon = <Building className="w-4 h-4 text-primary-500 shrink-0" />;

              return (
                <div key={dua.id} id={`card-${dua.id}`} className="bg-white dark:bg-slate-900 border border-secondary-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Card Top Label */}
                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                      <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm">
                        {catIcon}
                        {titleText}
                      </span>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-mono px-2 py-0.5 rounded-md font-semibold">
                        {dua.reference}
                      </span>
                    </div>

                    {/* Dua Audio Player */}
                    <DuaAudioPlayer
                      arabicText={dua.arabic}
                      transliterationText={dua.transliteration}
                      translationText={translationText}
                      title={dua.title.en}
                      className="border-none !p-0 !bg-transparent"
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <QuranModal 
        isOpen={!!readingSurah}
        onClose={closeReader}
        chapterNumber={readingSurah?.chapter || 0}
        surahName={readingSurah?.name || ''}
      />
    </section>
  );
};

export default OtherRecommendations;