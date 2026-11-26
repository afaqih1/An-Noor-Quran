import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Clock, Heart, Users, BookOpen, ExternalLink, 
  ArrowRight, Shield, Moon, Compass, Sun 
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { DuaAudioPlayer } from './DuaAudioPlayer';
import { StressOverwhelmDuas } from './StressOverwhelmDuas';
import { TahajjudGuideSection } from './TahajjudGuideSection';

interface DuaSectionProps {
  onNavigateToKhatam?: () => void;
  initialTab?: 'general' | 'stress' | 'tahajjud';
}

const DuaSection: React.FC<DuaSectionProps> = ({ onNavigateToKhatam, initialTab }) => {
  const { t, language } = useLanguage();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'general' | 'stress' | 'tahajjud'>(() => {
    if (initialTab) return initialTab;
    try {
      const stored = localStorage.getItem('dua-section-active-tab');
      if (stored === 'stress' || stored === 'tahajjud' || stored === 'general') {
        return stored;
      }
    } catch {}
    return 'general';
  });

  const handleOpenKhatam = () => {
    if (onNavigateToKhatam) {
      onNavigateToKhatam();
    } else {
      window.dispatchEvent(new CustomEvent('navigate-to-section', { detail: 'khatam' }));
    }
  };

  const handleTabChange = (tab: 'general' | 'stress' | 'tahajjud') => {
    setActiveTab(tab);
    try {
      localStorage.setItem('dua-section-active-tab', tab);
    } catch (e) {
      console.warn(e);
    }
  };

  // Sync with global open-dua-tab events
  useEffect(() => {
    const handleGlobalTab = (e: Event) => {
      const customEvent = e as CustomEvent;
      const targetTab = customEvent.detail?.tab;
      if (targetTab === 'stress' || targetTab === 'tahajjud' || targetTab === 'general') {
        setActiveTab(targetTab);
        try {
          localStorage.setItem('dua-section-active-tab', targetTab);
        } catch (err) {}
      }
    };
    window.addEventListener('open-dua-tab', handleGlobalTab);
    return () => window.removeEventListener('open-dua-tab', handleGlobalTab);
  }, []);

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

  return (
    <section className="bg-white dark:bg-slate-900 border border-secondary-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden animate-in fade-in duration-300" id="dua-adhkar-section">
      {/* Header Banner */}
      <div id="dua-header-banner" className="bg-gradient-to-r from-primary-950 via-primary-900 to-indigo-950 px-6 sm:px-10 py-8 sm:py-12 text-white relative overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-5 mix-blend-overlay">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 0 L100 100 M100 0 L0 100" stroke="currentColor" strokeWidth="4" />
          </svg>
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-block bg-accent-500/20 text-accent-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-accent-400/20">
              {language === 'ar' ? 'الأدعية والأذكار النبوية' : (language === 'am' ? 'ዱዓዎችና የነቢዩ ﷺ ዝክሮች' : (language === 'har' ? 'ዱዓዎችና ዝክራች' : 'Prophetic Duas & Supplications'))}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-white">
            {t('dua.title')}
          </h2>
          <p className="text-primary-100/90 text-sm sm:text-base max-w-3xl leading-relaxed">
            {t('dua.desc')}
          </p>
        </div>
      </div>

      {/* Main Tab Switcher Bar - 3 Distinct Sub-Sections */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/80 p-2 sm:p-3 sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Sub-Section 1: Friday Adhkar & Supplications */}
          <button
            onClick={() => handleTabChange('general')}
            className={`p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center gap-3 border ${
              activeTab === 'general'
                ? 'bg-white dark:bg-slate-800 border-primary-500/40 dark:border-primary-500/50 text-primary-800 dark:text-primary-200 shadow-md shadow-primary-900/5 ring-1 ring-primary-500/20'
                : 'bg-transparent border-transparent hover:bg-white/60 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className={`p-2 rounded-xl transition-colors shrink-0 ${
              activeTab === 'general' 
                ? 'bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-secondary-400' 
                : 'bg-slate-200/60 dark:bg-slate-700/60 text-slate-500'
            }`}>
              <Sparkles size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className={`w-4 h-4 rounded-full text-[10px] font-extrabold flex items-center justify-center shrink-0 ${
                  activeTab === 'general'
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  1
                </span>
                <span className="text-xs sm:text-sm font-bold block truncate">
                  {t('dua.tab.general')}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                {language === 'ar' ? 'ساعة الاستجابة، الصلاة على النبي، والختم' : (language === 'am' ? 'የተቀባይነት ሰዓት፣ ሰለዋት እና ኻታም' : (language === 'har' ? 'የተቀባይነት ወቅቲ፣ ሰለዋትና ኻታም' : 'Golden Hour, Salawat & Khatm'))}
              </span>
            </div>
          </button>

          {/* Sub-Section 2: Stress & Overwhelm Duas */}
          <button
            onClick={() => handleTabChange('stress')}
            className={`p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center gap-3 border ${
              activeTab === 'stress'
                ? 'bg-white dark:bg-slate-800 border-emerald-500/50 text-emerald-800 dark:text-emerald-200 shadow-md shadow-emerald-900/5 ring-1 ring-emerald-500/20'
                : 'bg-transparent border-transparent hover:bg-white/60 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className={`p-2 rounded-xl transition-colors shrink-0 ${
              activeTab === 'stress' 
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400' 
                : 'bg-slate-200/60 dark:bg-slate-700/60 text-slate-500'
            }`}>
              <Shield size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className={`w-4 h-4 rounded-full text-[10px] font-extrabold flex items-center justify-center shrink-0 ${
                  activeTab === 'stress'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  2
                </span>
                <span className="text-xs sm:text-sm font-bold block truncate">
                  {t('dua.tab.stress')}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                {language === 'ar' ? 'الحصن النبوي من الهم والحزن والديون' : (language === 'am' ? 'ከጭንቀትና ከዕዳ መጠበቂያ የነቢዩ ﷺ ዱዓእ' : (language === 'har' ? 'ከጭንቀትና ከዕዳ መሸሸጊያ ዱዓእ' : "Prophet's refuge from anxiety & debt"))}
              </span>
            </div>
          </button>

          {/* Sub-Section 3: Tahajjud & Night Prayer */}
          <button
            onClick={() => handleTabChange('tahajjud')}
            className={`p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center gap-3 border ${
              activeTab === 'tahajjud'
                ? 'bg-white dark:bg-slate-800 border-indigo-500/50 text-indigo-800 dark:text-indigo-200 shadow-md shadow-indigo-900/5 ring-1 ring-indigo-500/20'
                : 'bg-transparent border-transparent hover:bg-white/60 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className={`p-2 rounded-xl transition-colors shrink-0 ${
              activeTab === 'tahajjud' 
                ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400' 
                : 'bg-slate-200/60 dark:bg-slate-700/60 text-slate-500'
            }`}>
              <Moon size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className={`w-4 h-4 rounded-full text-[10px] font-extrabold flex items-center justify-center shrink-0 ${
                  activeTab === 'tahajjud'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  3
                </span>
                <span className="text-xs sm:text-sm font-bold block truncate">
                  {t('dua.tab.tahajjud')}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                {language === 'ar' ? 'كيفية الصلاة وحاسبة ثلث الليل' : (language === 'am' ? 'የአሰጋገድ መመሪያ እና የሌሊቱ ሲሶ ማስያ' : (language === 'har' ? 'የአሰጋገድ መመሪያና የሌሊት ሲሶ' : 'How to pray & Last Third timing'))}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Tab Content Container */}
      <div className="p-6 sm:p-10">
        
        {/* TAB 1: Friday & General Duas */}
        {activeTab === 'general' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Intro / Hour of Response */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-3">
                  <Clock className="text-accent-500 w-5 h-5" />
                  {t('dua.goldenHour')}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                  {t('dua.goldenHourDesc')}
                </p>
              </div>
              <div className="bg-primary-50 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900/40 rounded-xl p-4 md:w-1/3 text-center">
                <p className="text-xs sm:text-sm text-primary-800 dark:text-secondary-300 font-medium italic leading-relaxed">
                  {t('dua.goldenHourHadith')}
                </p>
                <p className="text-[10px] sm:text-xs text-primary-600 dark:text-primary-400 mt-2 font-medium">{t('dua.goldenHourHadithRef')}</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
              {/* Salawat Card */}
              <div className="bg-white dark:bg-slate-900 border border-secondary-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-50 dark:bg-secondary-950/20 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 pointer-events-none"></div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center gap-2 relative z-10">
                    <h4 className="text-primary-700 dark:text-primary-400 font-bold mb-1 text-sm sm:text-base">
                      <span className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-primary-500" />
                        {t('dua.salawat')}
                      </span>
                    </h4>
                    <button
                      onClick={() => toggleFavorite({
                        id: 'general_salawat',
                        category: 'general',
                        title: 'Salawat on Prophet Muhammad (ﷺ)',
                        arabicText: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
                        transliterationText: "Allahumma salli 'ala Muhammadin wa 'ala aali Muhammad",
                        translationText: "O Allah, send blessings upon Muhammad and upon the family of Muhammad.",
                        reference: 'Sahih al-Bukhari',
                        tags: ['Salawat', 'Friday', 'Prophet']
                      })}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        savedIds.includes('general_salawat')
                          ? 'bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/40 dark:border-rose-900/40'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500'
                      }`}
                      title={savedIds.includes('general_salawat') ? 'Remove from favorites' : 'Save to My Duas'}
                    >
                      <Heart size={14} className={savedIds.includes('general_salawat') ? 'fill-current text-rose-500' : ''} />
                    </button>
                  </div>
                  
                  <DuaAudioPlayer
                    arabicText="اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ"
                    transliterationText="Allahumma salli 'ala Muhammadin wa 'ala aali Muhammad"
                    translationText="O Allah, send blessings upon Muhammad and upon the family of Muhammad."
                    title="Salawat"
                  />
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed">
                  {t('dua.salawatRef')}
                </div>
              </div>

              {/* General Dua Card */}
              <div className="bg-white dark:bg-slate-900 border border-secondary-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 dark:bg-primary-950/20 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 pointer-events-none"></div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center gap-2 relative z-10">
                    <h4 className="text-primary-700 dark:text-primary-400 font-bold mb-1 text-sm sm:text-base">
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-accent-500" />
                        {t('dua.generalDua')}
                      </span>
                    </h4>
                    <button
                      onClick={() => toggleFavorite({
                        id: 'general_rabbana',
                        category: 'general',
                        title: 'Rabbana (Best of Dunya & Akhirah)',
                        arabicText: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
                        transliterationText: "Rabbana atina fid-dunya hasanatan wa fil 'akhirati hasanatan waqina 'adhaban-nar",
                        translationText: 'Our Lord, give us in this world good and in the Hereafter good and protect us from the punishment of the Fire.',
                        reference: 'Surah Al-Baqarah [2:201]',
                        tags: ['Quranic', 'General', 'Success']
                      })}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        savedIds.includes('general_rabbana')
                          ? 'bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/40 dark:border-rose-900/40'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500'
                      }`}
                      title={savedIds.includes('general_rabbana') ? 'Remove from favorites' : 'Save to My Duas'}
                    >
                      <Heart size={14} className={savedIds.includes('general_rabbana') ? 'fill-current text-rose-500' : ''} />
                    </button>
                  </div>
                  
                  <DuaAudioPlayer
                    arabicText="رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ"
                    transliterationText="Rabbana atina fid-dunya hasanatan wa fil 'akhirati hasanatan waqina 'adhaban-nar"
                    translationText="Our Lord, give us in this world good and in the Hereafter good and protect us from the punishment of the Fire."
                    title="General Dua"
                  />
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed">
                  Surah Al-Baqarah [2:201]
                </div>
              </div>

              {/* Family & Children Dua Card */}
              <div className="bg-white dark:bg-slate-900 border border-secondary-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 dark:bg-amber-950/20 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 pointer-events-none"></div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center gap-2 relative z-10">
                    <h4 className="text-primary-700 dark:text-primary-400 font-bold mb-1 text-sm sm:text-base">
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-600" />
                        {t('dua.familyDua')}
                      </span>
                    </h4>
                    <button
                      onClick={() => toggleFavorite({
                        id: 'general_family',
                        category: 'general',
                        title: 'Dua for Spouses & Children',
                        arabicText: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا. رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ',
                        transliterationText: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lil-muttaqina imama. Rabbi-j'alni muqimas-salati wa min dhurriyyati, Rabbana wa taqabbal du'a.",
                        translationText: t('dua.familyDuaRef'),
                        reference: 'Surah Al-Furqan [25:74] & Surah Ibrahim [14:40]',
                        tags: ['Quranic', 'Family', 'Children']
                      })}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        savedIds.includes('general_family')
                          ? 'bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/40 dark:border-rose-900/40'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500'
                      }`}
                      title={savedIds.includes('general_family') ? 'Remove from favorites' : 'Save to My Duas'}
                    >
                      <Heart size={14} className={savedIds.includes('general_family') ? 'fill-current text-rose-500' : ''} />
                    </button>
                  </div>
                  
                  <DuaAudioPlayer
                    arabicText="رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا. رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ"
                    transliterationText="Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lil-muttaqina imama. Rabbi-j'alni muqimas-salati wa min dhurriyyati, Rabbana wa taqabbal du'a."
                    translationText={t('dua.familyDuaRef')}
                    title="Family Dua"
                  />
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed">
                  Surah Al-Furqan [25:74] & Surah Ibrahim [14:40]
                </div>
              </div>

              {/* Dua for Khatmul Quran Card */}
              <div className="bg-white dark:bg-slate-900 border border-primary-200/80 dark:border-primary-900/50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col justify-between md:col-span-2 lg:col-span-3 bg-gradient-to-br from-white via-primary-50/20 to-secondary-50/30 dark:from-slate-900 dark:via-primary-950/20 dark:to-slate-900">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/40 dark:bg-primary-900/20 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 pointer-events-none"></div>
                <div className="space-y-4">
                  <div className="flex flex-wrap justify-between items-center gap-2 relative z-10">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="p-1.5 rounded-lg bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300">
                          <BookOpen className="w-4 h-4" />
                        </span>
                        <h4 className="text-primary-800 dark:text-primary-300 font-bold text-base sm:text-lg">
                          {t('dua.khatamTitle')}
                        </h4>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/60 text-primary-800 dark:text-primary-300 font-semibold border border-primary-200 dark:border-primary-800">
                          دعاء ختم القرآن الكريم
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {t('dua.khatamDesc')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleOpenKhatam}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary-600 hover:bg-primary-700 active:scale-95 text-white transition-all shadow-sm cursor-pointer"
                        title="Open full interactive Khatmul Quran reader"
                      >
                        <span>{t('nav.khatam')}</span>
                        <ArrowRight size={13} />
                      </button>

                      <button
                        onClick={() => toggleFavorite({
                          id: 'khatmul_quran_main',
                          category: 'general',
                          title: 'Dua for Khatmul Quran (Completion of Holy Quran)',
                          arabicText: 'اللَّهُمَّ ارْحَمْنِي بِالقُرْآنِ وَاجْعَلْهُ لِي إِمَاماً وَنُوراً وَهُدًى وَرَحْمَةً، اللَّهُمَّ ذَكِّرْنِي مِنْهُ مَا نَسِيتُ وَعَلِّمْنِي مِنْهُ مَا جَهِلْتُ وَارْزُقْنِي تِلاَوَتَهُ آنَاءَ اللَّيْلِ وَأَطْرَافَ النَّهَارِ وَاجْعَلْهُ لِي حُجَّةً يَا رَبَّ العَالَمِينَ.',
                          transliterationText: "Allahumma-rhamni bil-Qur'ani waj'alhu li imaman wa nuran wa hudan wa rahmah. Allahumma dhakkirni minhu ma nasitu wa 'allimni minhu ma jahiltu warzuqni tilawatahu ana'al-layli wa atrafan-nahar waj'alhu li hujjatan ya Rabbal-'alamin.",
                          translationText: "O Allah, have mercy on me with the Quran, and make it for me a guide, a light, a direction, and a mercy. O Allah, remind me of whatever I have forgotten of it, teach me of what I am ignorant of, grant me its recitation during the hours of night and the ends of the day, and make it a proof for me, O Lord of the Worlds.",
                          reference: 'Traditional Khatm Supplication',
                          tags: ['Khatm', 'Quranic', 'Completion', 'Mercy']
                        })}
                        className={`p-2 rounded-lg border transition-all cursor-pointer ${
                          savedIds.includes('khatmul_quran_main')
                            ? 'bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/40 dark:border-rose-900/40'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500'
                        }`}
                        title={savedIds.includes('khatmul_quran_main') ? 'Remove from favorites' : 'Save to My Duas'}
                      >
                        <Heart size={15} className={savedIds.includes('khatmul_quran_main') ? 'fill-current text-rose-500' : ''} />
                      </button>
                    </div>
                  </div>
                  
                  <DuaAudioPlayer
                    arabicText="اللَّهُمَّ ارْحَمْنِي بِالقُرْآنِ وَاجْعَلْهُ لِي إِمَاماً وَنُوراً وَهُدًى وَرَحْمَةً، اللَّهُمَّ ذَكِّرْنِي مِنْهُ مَا نَسِيتُ وَعَلِّمْنِي مِنْهُ مَا جَهِلْتُ وَارْزُقْنِي تِلاَوَتَهُ آنَاءَ اللَّيْلِ وَأَطْرَافَ النَّهَارِ وَاجْعَلْهُ لِي حُجَّةً يَا رَبَّ العَالَمِينَ."
                    transliterationText="Allahumma-rhamni bil-Qur'ani waj'alhu li imaman wa nuran wa hudan wa rahmah. Allahumma dhakkirni minhu ma nasitu wa 'allimni minhu ma jahiltu warzuqni tilawatahu ana'al-layli wa atrafan-nahar waj'alhu li hujjatan ya Rabbal-'alamin."
                    translationText="O Allah, have mercy on me with the Quran, and make it for me a guide, a light, a direction, and a mercy. O Allah, remind me of whatever I have forgotten of it, teach me of what I am ignorant of, grant me its recitation during the hours of night and the ends of the day, and make it a proof for me, O Lord of the Worlds."
                    title="Dua Khatmul Quran"
                  />
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>{t('dua.khatamRef')}</span>
                  <button
                    onClick={handleOpenKhatam}
                    className="text-primary-600 dark:text-primary-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {t('dua.openFullKhatam')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Stress, Anxiety & Family Overwhelm */}
        {activeTab === 'stress' && (
          <StressOverwhelmDuas />
        )}

        {/* TAB 3: Tahajjud & Night Prayer Master Guide */}
        {activeTab === 'tahajjud' && (
          <TahajjudGuideSection />
        )}

      </div>
    </section>
  );
};

export default DuaSection;
