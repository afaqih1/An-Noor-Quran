import React, { useState } from 'react';
import { BookOpen, Book, Play, Pause, FileText } from 'lucide-react';
import { useAudio } from './AudioContext';
import QuranModal from './QuranModal';
import { useLanguage } from './LanguageContext';

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

const SurahTable: React.FC = () => {
  const { currentSurah, isPlaying, playSurah, togglePlay, playbackRate, setSpeed } = useAudio();
  const [readingSurah, setReadingSurah] = useState<{id: number, chapter: number, name: string, pageNumber?: number} | null>(null);
  const { t, language, getTranslatedSurahs } = useLanguage();

  const surahs = getTranslatedSurahs();

  const handleTogglePlay = (surah: typeof surahs[0]) => {
    if (currentSurah?.id === surah.id) {
      togglePlay();
    } else {
      playSurah(surah);
    }
  };

  const openReader = (surah: typeof surahs[0]) => {
    setReadingSurah({
      id: surah.id,
      chapter: surah.chapter,
      name: surah.name,
      pageNumber: surah.pageNumber
    });
  };

  const closeReader = () => {
    setReadingSurah(null);
  };

  const speeds = [0.75, 1, 1.25, 1.5];

  return (
    <>
      {/* Mobile/Tablet Card Layout */}
      <div className="block md:hidden space-y-3.5" id="surah-cards-mobile">
        {surahs.map((surah) => {
          const isActive = currentSurah?.id === surah.id;
          const isSurahPlaying = isActive && isPlaying;
          
          return (
            <div 
              key={surah.id} 
              className={`bg-white/90 backdrop-blur-sm rounded-xl p-4 border transition-all duration-300 shadow-sm flex flex-col gap-3.5
                ${isActive ? 'border-primary-300 ring-1 ring-primary-100/50 bg-primary-50/20' : 'border-secondary-200/80 hover:border-secondary-300'}`}
            >
              {/* Header: Circle # and Names */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary-100/80 text-secondary-800 border border-secondary-200/30 flex items-center justify-center text-xs font-black shrink-0 font-mono">
                    {surah.chapter}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-serif">
                      {surah.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {surah.time}
                    </p>
                  </div>
                </div>

                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0
                  ${surah.level.includes('Strong Sunnah') || surah.level.includes('مؤكدة') || surah.level.includes('ጠንካራ')
                    ? 'bg-primary-50 text-primary-800 border-primary-100' 
                    : surah.level.includes('Weak') || surah.level.includes('ضعيف') || surah.level.includes('ደካማ')
                      ? 'bg-accent-50 text-accent-800 border-accent-100' 
                      : 'bg-secondary-50 text-secondary-800 border-secondary-100'}`}>
                  {surah.level}
                </span>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100/80">
                {/* Play/Pause Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTogglePlay(surah)}
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer select-none active:scale-95 min-h-[40px]
                      ${isSurahPlaying
                        ? 'bg-rose-50 border-rose-200 text-rose-600 font-black' 
                        : 'bg-primary-50 border-primary-200 text-primary-700 font-black'}`}
                    aria-label={isSurahPlaying ? "Pause" : "Play"}
                  >
                    {isSurahPlaying ? (
                      <>
                        <Pause size={13} className="fill-current" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play size={13} className="fill-current" />
                        <span>Play Audio</span>
                      </>
                    )}
                  </button>

                  {/* Playback Speed for Active Surah on Mobile */}
                  {isActive && (
                    <div className="flex items-center gap-0.5 bg-slate-100 border border-slate-200/60 rounded-lg p-0.5 animate-in fade-in duration-200">
                      {speeds.map((speed) => (
                        <button
                          key={speed}
                          onClick={() => setSpeed(speed)}
                          className={`text-[9px] font-black px-1 py-1 rounded transition-all cursor-pointer ${
                            playbackRate === speed 
                              ? 'bg-white text-primary-700 shadow-xs' 
                              : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Read Options */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => openReader(surah)}
                    className="text-primary-700 hover:text-primary-950 bg-primary-50/80 hover:bg-primary-100 border border-primary-200 px-3 py-1.5 rounded-xl inline-flex items-center gap-1 font-bold text-xs transition-all cursor-pointer min-h-[40px] active:scale-95"
                  >
                    <BookOpen size={13} />
                    <span>{language === 'ar' ? 'نص' : 'Text'}</span>
                  </button>
                  <button 
                    onClick={() => {
                      const startPage = SURAH_START_PAGES[surah.chapter] || 1;
                      window.dispatchEvent(new CustomEvent('open-classic-mushaf-modal', { detail: { page: startPage } }));
                    }}
                    className="text-emerald-700 hover:text-emerald-950 bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl inline-flex items-center gap-1 font-bold text-xs transition-all cursor-pointer min-h-[40px] active:scale-95"
                  >
                    <Book size={13} />
                    <span>{language === 'ar' ? 'مصحف' : 'Mushaf'}</span>
                  </button>
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('open-reflection-journal', { detail: { surahNumber: surah.chapter } }));
                    }}
                    className="text-amber-700 hover:text-amber-950 bg-amber-50/80 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl inline-flex items-center gap-1 font-bold text-xs transition-all cursor-pointer min-h-[40px] active:scale-95"
                    title={language === 'ar' ? 'كتابة تدبر أو ملاحظة شخصية' : 'Write personal reflection or note'}
                  >
                    <FileText size={13} />
                    <span>{language === 'ar' ? 'تدبر' : (language === 'am' ? 'አስተንትኖ' : (language === 'har' ? 'አስተንትኖ' : 'Reflect'))}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table Layout (hidden on mobile/tablet) */}
      <div className="hidden md:block bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-secondary-200 overflow-hidden" id="surah-table-desktop">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-100">
            <thead className="bg-secondary-50/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {language === 'ar' ? 'رقم السورة' : (language === 'am' ? 'ምዕራፍ ቁጥር' : (language === 'har' ? 'ምዕራፍ ቁጥር' : 'Chapter #'))}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {t('table.col.time')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {t('table.col.surah')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {t('table.col.level')}
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {t('table.col.actions')}
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {language === 'ar' ? 'قراءة' : (language === 'am' ? 'ማንበብ' : (language === 'har' ? 'ማንበብ' : 'Read'))}
                </th>
              </tr>
            </thead>
            <tbody className="bg-transparent divide-y divide-secondary-100">
              {surahs.map((surah) => (
                <tr key={surah.id} className="hover:bg-primary-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600 text-center font-medium">
                    {surah.chapter}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {surah.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-700 font-bold font-serif">
                    {surah.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                      ${surah.level.includes('Strong Sunnah') || surah.level.includes('مؤكدة') || surah.level.includes('ጠንካራ')
                        ? 'bg-primary-50 text-primary-800 border-primary-100' 
                        : surah.level.includes('Weak') || surah.level.includes('ضعيف') || surah.level.includes('ደካማ')
                          ? 'bg-accent-50 text-accent-800 border-accent-100' 
                          : 'bg-secondary-50 text-secondary-800 border-secondary-100'}`}>
                      {surah.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => handleTogglePlay(surah)}
                        className={`inline-flex items-center justify-center p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 cursor-pointer select-none
                          ${currentSurah?.id === surah.id && isPlaying 
                            ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-200' 
                            : 'text-slate-400 hover:text-primary-600 hover:bg-slate-100'}`}
                        aria-label={currentSurah?.id === surah.id && isPlaying ? "Pause" : "Play"}
                      >
                        {currentSurah?.id === surah.id && isPlaying ? (
                          <Pause size={18} className="fill-current" />
                        ) : (
                          <Play size={18} className="fill-current" />
                        )}
                      </button>
                      
                      {/* Speed Controls for Active Surah */}
                      {currentSurah?.id === surah.id && (
                        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 animate-in fade-in slide-in-from-top-1 duration-200 border border-slate-200">
                          {speeds.map((speed) => (
                            <button
                              key={speed}
                              onClick={() => setSpeed(speed)}
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                                playbackRate === speed 
                                  ? 'bg-white text-primary-700 shadow-sm' 
                                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                              }`}
                            >
                              {speed}x
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => openReader(surah)}
                        className="text-primary-700 hover:text-primary-950 bg-primary-50 hover:bg-primary-100 border border-primary-200 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 font-medium text-xs transition-all cursor-pointer"
                        title={language === 'ar' ? 'قراءة النص الرقمي' : 'Read Digital Text'}
                      >
                        <BookOpen size={13} />
                        <span>{language === 'ar' ? 'نص' : (language === 'am' ? 'ጽሑፍ' : (language === 'har' ? 'ጽሑፍ' : 'Text'))}</span>
                      </button>
                      <button 
                        onClick={() => {
                          const startPage = SURAH_START_PAGES[surah.chapter] || 1;
                          window.dispatchEvent(new CustomEvent('open-classic-mushaf-modal', { detail: { page: startPage } }));
                        }}
                        className="text-emerald-700 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 font-medium text-xs transition-all cursor-pointer"
                        title={language === 'ar' ? 'تصفح صفحات المصحف المصورة الكلاسيكية' : 'Read Scanned Classic Mushaf Pages'}
                      >
                        <Book size={13} />
                        <span>{language === 'ar' ? 'مصحف' : (language === 'am' ? 'ሙስሐፍ' : (language === 'har' ? 'ሙስሐፍ' : 'Mushaf'))}</span>
                      </button>
                      <button 
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('open-reflection-journal', { detail: { surahNumber: surah.chapter } }));
                        }}
                        className="text-amber-700 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 font-medium text-xs transition-all cursor-pointer"
                        title={language === 'ar' ? 'كتابة تدبر أو ملاحظة شخصية' : 'Write personal reflection or note'}
                      >
                        <FileText size={13} />
                        <span>{language === 'ar' ? 'تدبر' : (language === 'am' ? 'አስተንትኖ' : (language === 'har' ? 'አስተንትኖ' : 'Reflect'))}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <QuranModal 
        isOpen={!!readingSurah}
        onClose={closeReader}
        chapterNumber={readingSurah?.chapter || 0}
        surahName={readingSurah?.name || ''}
        pageNumber={readingSurah?.pageNumber}
      />
    </>
  );
};

export default SurahTable;