import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw,
  BookOpen, Book, ChevronDown, Loader2, Sparkles, HelpCircle
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { allSurahs } from './surahListData';

interface ClassicMushafModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPage?: number;
}

// Exact start pages for all 114 Surahs in Madinah Mushaf
export const SURAH_START_PAGES: Record<number, number> = {
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

// Start pages for all 30 Juzs in Madinah Mushaf
export const JUZ_START_PAGES: Record<number, number> = {
  1:1, 2:22, 3:42, 4:62, 5:82, 6:102, 7:121, 8:142, 9:162, 10:182,
  11:201, 12:222, 13:242, 14:262, 15:282, 16:302, 17:322, 18:342, 19:362, 20:382,
  21:402, 22:422, 23:442, 24:462, 25:482, 26:502, 27:522, 28:542, 29:562, 30:582
};

export default function ClassicMushafModal({ isOpen, onClose, initialPage = 1 }: ClassicMushafModalProps) {
  const { language: lang, t } = useLanguage();
  const [page, setPage] = useState<number>(initialPage);
  const [scale, setScale] = useState<number>(1);
  const [imgLoading, setImgLoading] = useState<boolean>(true);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // View Mode: 'single' or 'double' page spread (persisted in localStorage)
  const [viewMode, setViewMode] = useState<'single' | 'double'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mushafViewMode');
      return saved === 'double' ? 'double' : 'single';
    }
    return 'single';
  });

  const handleSetViewMode = (mode: 'single' | 'double') => {
    setViewMode(mode);
    localStorage.setItem('mushafViewMode', mode);
    if (mode === 'double') {
      // Align page to odd page number representing the right page of the spread
      setPage(prev => (prev % 2 === 0 ? prev - 1 : prev));
    }
  };

  // Swipe gesture refs
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (viewMode === 'double') {
        setPage(initialPage % 2 === 0 ? initialPage - 1 : initialPage);
      } else {
        setPage(initialPage);
      }
      setScale(1);
      setImgLoading(true);
    }
  }, [isOpen, initialPage, viewMode]);

  // Set page loading spinner when page changes
  useEffect(() => {
    setImgLoading(true);
  }, [page, viewMode]);

  // Handle page transitions
  const handleNextPage = () => {
    if (viewMode === 'double') {
      if (page < 603) {
        setPage(prev => {
          const next = prev % 2 === 0 ? prev + 1 : prev + 2;
          return Math.min(603, next);
        });
      }
    } else {
      if (page < 604) {
        setPage(prev => prev + 1);
      }
    }
  };

  const handlePrevPage = () => {
    if (viewMode === 'double') {
      if (page > 1) {
        setPage(prev => {
          const prevPageVal = prev % 2 === 0 ? prev - 3 : prev - 2;
          return Math.max(1, prevPageVal);
        });
      }
    } else {
      if (page > 1) {
        setPage(prev => prev - 1);
      }
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowLeft') {
        // RTL next page is on the left
        handleNextPage();
      } else if (e.key === 'ArrowRight') {
        // RTL prev page is on the right
        handlePrevPage();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, page, viewMode]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNextPage();
    } else if (isRightSwipe) {
      handlePrevPage();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Find the current Surah & Juz of this page
  const getCurrentSurahInfo = () => {
    let currentSurah = allSurahs[0];
    for (const surah of allSurahs) {
      const start = SURAH_START_PAGES[surah.number];
      if (start <= page) {
        currentSurah = surah;
      } else {
        break;
      }
    }
    return currentSurah;
  };

  const getCurrentJuzNumber = () => {
    let currentJuz = 1;
    for (let j = 1; j <= 30; j++) {
      if (JUZ_START_PAGES[j] <= page) {
        currentJuz = j;
      } else {
        break;
      }
    }
    return currentJuz;
  };

  const currentSurah = getCurrentSurahInfo();
  const currentJuz = getCurrentJuzNumber();

  if (!isOpen) return null;

  // Determine pages for double page mode
  const rightPage = page % 2 === 0 ? page - 1 : page;
  const leftPage = rightPage + 1;

  // Image source URL for single page
  const imageUrl = `https://raw.githubusercontent.com/zeyadetman/quran-pages-images/master/quran-images/${page}.jpg`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`relative flex flex-col w-full h-full md:h-[92vh] md:rounded-3xl bg-[#fdfcf7] dark:bg-slate-950 border border-secondary-200/40 dark:border-slate-800 shadow-2xl overflow-hidden transition-all duration-300
        ${viewMode === 'double' ? 'max-w-[96vw]' : 'max-w-6xl'}`}>
        
        {/* TOP BAR / CONTROL PANEL */}
        <div className="flex items-center justify-between border-b border-secondary-200/50 dark:border-slate-800/80 bg-[#fbf9f0] dark:bg-slate-900 px-4 py-3 z-10 select-none gap-2">
          
          {/* Left Title */}
          <div className="flex items-center gap-2 shrink-0">
            <BookOpen className="text-emerald-600 dark:text-emerald-400 w-5 h-5" />
            <div>
              <h3 className="font-sans font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base tracking-tight flex items-center gap-1.5">
                {lang === 'ar' ? 'المصحف العثماني الكلاسيكي' : 'Classic Madinah Mushaf'}
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                  15 Lines • ١٥ سطرًا
                </span>
              </h3>
            </div>
          </div>

          {/* Center Info / Jumpers */}
          <div className="hidden md:flex items-center gap-4">
            {/* Surah Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-400">{lang === 'ar' ? 'السورة' : 'Surah'}:</span>
              <select
                value={currentSurah.number}
                onChange={(e) => {
                  const sNum = parseInt(e.target.value, 10);
                  const sPage = SURAH_START_PAGES[sNum];
                  if (viewMode === 'double') {
                    setPage(sPage % 2 === 0 ? sPage - 1 : sPage);
                  } else {
                    setPage(sPage);
                  }
                }}
                className="text-xs font-bold bg-white dark:bg-slate-800 border border-secondary-200 dark:border-slate-700 rounded-lg py-1 px-2.5 text-slate-800 dark:text-slate-100 cursor-pointer shadow-xs hover:border-emerald-500/50"
              >
                {allSurahs.map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {lang === 'ar' ? s.name : s.englishName} ({SURAH_START_PAGES[s.number]})
                  </option>
                ))}
              </select>
            </div>

            {/* Juz Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-400">{lang === 'ar' ? 'الجزء' : 'Juz'}:</span>
              <select
                value={currentJuz}
                onChange={(e) => {
                  const jNum = parseInt(e.target.value, 10);
                  const jPage = JUZ_START_PAGES[jNum];
                  if (viewMode === 'double') {
                    setPage(jPage % 2 === 0 ? jPage - 1 : jPage);
                  } else {
                    setPage(jPage);
                  }
                }}
                className="text-xs font-bold bg-white dark:bg-slate-800 border border-secondary-200 dark:border-slate-700 rounded-lg py-1 px-2.5 text-slate-800 dark:text-slate-100 cursor-pointer shadow-xs hover:border-emerald-500/50"
              >
                {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => (
                  <option key={j} value={j}>
                    {lang === 'ar' ? `الجزء ${j}` : `Juz ${j}`} ({JUZ_START_PAGES[j]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-200/60 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-300/30">
              <button
                onClick={() => handleSetViewMode('single')}
                className={`p-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 cursor-pointer select-none
                  ${viewMode === 'single'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                title={lang === 'ar' ? 'صفحة واحدة' : 'Single Page'}
              >
                <Book className="w-3.5 h-3.5" />
                <span className="hidden lg:inline text-[11px]">{lang === 'ar' ? 'صفحة' : '1 Page'}</span>
              </button>
              <button
                onClick={() => handleSetViewMode('double')}
                className={`p-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 cursor-pointer select-none
                  ${viewMode === 'double'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                title={lang === 'ar' ? 'صفحتان متقابلتان' : 'Two Pages'}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden lg:inline text-[11px]">{lang === 'ar' ? 'صفحتان' : '2 Pages'}</span>
              </button>
            </div>

            <button
              onClick={() => setShowHelp(prev => !prev)}
              title={lang === 'ar' ? 'مساعدة' : 'Help & Gestures'}
              className={`p-2 rounded-xl text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer ${showHelp ? 'bg-slate-200 dark:bg-slate-800' : ''}`}
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => setScale(prev => Math.min(3, prev + 0.25))}
              title={lang === 'ar' ? 'تكبير' : 'Zoom In'}
              className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={() => setScale(prev => Math.max(0.75, prev - 0.25))}
              title={lang === 'ar' ? 'تصغير' : 'Zoom Out'}
              className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={() => setScale(1)}
              title={lang === 'ar' ? 'إعادة تعيين التكبير' : 'Reset Zoom'}
              className="hidden sm:inline-block p-2 rounded-xl text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-200/60 dark:bg-slate-800 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 dark:hover:text-red-400 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title={lang === 'ar' ? 'إغلاق' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MOBILE SURAH / JUZ NAVIGATION DRAWER (Expands inline on smaller screens) */}
        <div className="flex md:hidden items-center justify-between bg-[#fcfbfa] dark:bg-slate-900 border-b border-secondary-200/30 px-4 py-2 text-xs select-none">
          <div className="flex items-center gap-1 w-1/2">
            <span className="text-slate-400 font-medium">{lang === 'ar' ? 'سورة' : 'Surah'}:</span>
            <select
              value={currentSurid(currentSurah.number)}
              onChange={(e) => {
                const sNum = parseInt(e.target.value, 10);
                const sPage = SURAH_START_PAGES[sNum];
                if (viewMode === 'double') {
                  setPage(sPage % 2 === 0 ? sPage - 1 : sPage);
                } else {
                  setPage(sPage);
                }
              }}
              className="flex-1 font-bold bg-white dark:bg-slate-800 border border-secondary-200 dark:border-slate-750 rounded-md py-0.5 px-1.5 text-slate-850 dark:text-slate-100"
            >
              {allSurahs.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {lang === 'ar' ? s.name : s.englishName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1 w-[45%]">
            <span className="text-slate-400 font-medium">{lang === 'ar' ? 'جزء' : 'Juz'}:</span>
            <select
              value={currentJuz}
              onChange={(e) => {
                const jNum = parseInt(e.target.value, 10);
                const jPage = JUZ_START_PAGES[jNum];
                if (viewMode === 'double') {
                  setPage(jPage % 2 === 0 ? jPage - 1 : jPage);
                } else {
                  setPage(jPage);
                }
              }}
              className="flex-1 font-bold bg-white dark:bg-slate-800 border border-secondary-200 dark:border-slate-750 rounded-md py-0.5 px-1.5 text-slate-850 dark:text-slate-100"
            >
              {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => (
                <option key={j} value={j}>
                  {lang === 'ar' ? `جزء ${j}` : `Juz ${j}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* MAIN VIEWER CONTAINER */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-auto bg-[#efebe4] dark:bg-slate-950 p-2 sm:p-6 md:p-8 flex items-center justify-center relative select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Help Overlay HUD */}
          {showHelp && (
            <div className="absolute top-4 left-4 right-4 bg-slate-900/90 text-white p-4 rounded-xl text-xs z-20 space-y-2 pointer-events-auto backdrop-blur-xs shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between items-center font-bold border-b border-slate-700 pb-1 mb-1">
                <span>{lang === 'ar' ? 'طرق التنقل والملاحة' : 'Navigation & Gestures'}</span>
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-400" onClick={() => setShowHelp(false)} />
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li><strong>{lang === 'ar' ? 'أزرار الصفحات' : 'Side Arrows'}</strong>: {lang === 'ar' ? 'اضغط على السهمين يمين أو يسار الصفحة لتغيير الصفحات.' : 'Click the arrows on the left or right edge.'}</li>
                <li><strong>{lang === 'ar' ? 'مفاتيح الكيبورد' : 'Keyboard'}</strong>: {lang === 'ar' ? 'اضغط على الأسهم يمين (للخلف) ويسار (للأمام) في الكيبورد.' : 'Use Left Arrow (next) and Right Arrow (prev).'}</li>
                <li><strong>{lang === 'ar' ? 'الإيماءات والسحب' : 'Mobile Swipes'}</strong>: {lang === 'ar' ? 'اسحب لليمين أو اليسار على الجوال لتصفح المصحف بسلاسة.' : 'Swipe left or right on mobile screens.'}</li>
                <li><strong>{lang === 'ar' ? 'التكبير' : 'Zoom'}</strong>: {lang === 'ar' ? 'استخدم أزرار التكبير (+) والتصغير (-) لضبط دقة القراءة.' : 'Use (+) and (-) zoom buttons to adjust reading size.'}</li>
                <li><strong>{lang === 'ar' ? 'وضع عرض الصفحتين' : 'Double Page View'}</strong>: {lang === 'ar' ? 'قم بتفعيل عرض صفحتين متقابلتين لمحاكاة قراءة المصحف الحقيقي.' : 'Enable 2-page view mode to simulate reading a real physical Quran.'}</li>
              </ul>
            </div>
          )}

          {/* Loading Indicator */}
          {imgLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#efebe4]/60 dark:bg-slate-950/60 z-10 transition-opacity">
              <Loader2 className="animate-spin text-emerald-600 dark:text-emerald-400 w-10 h-10 mb-2" />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {lang === 'ar' ? 'جاري تحميل الصفحة...' : 'Loading Mushaf page...'}
              </span>
            </div>
          )}

          {/* Scanned Image(s) Container */}
          <div 
            className="transition-transform duration-250 ease-out flex flex-row-reverse items-stretch justify-center gap-2 sm:gap-4 max-h-full max-w-full select-none"
            style={{ transform: `scale(${scale})` }}
          >
            {viewMode === 'double' ? (
              <>
                {/* Right Page (Odd page number, first read in RTL) */}
                <div className="flex-1 flex items-center justify-center bg-white rounded-lg shadow-md border border-secondary-300/30 overflow-hidden max-w-[49%]">
                  <img 
                    src={`https://raw.githubusercontent.com/zeyadetman/quran-pages-images/master/quran-images/${rightPage}.jpg`}
                    alt={`Classic Mushaf Page ${rightPage}`}
                    className="max-h-[65vh] md:max-h-[75vh] object-contain select-none pointer-events-none"
                    onLoad={() => setImgLoading(false)}
                    onError={(e) => {
                      console.error("Failed to load page image: ", rightPage);
                      setImgLoading(false);
                    }}
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Left Page (Even page number, second read in RTL) */}
                {leftPage <= 604 && (
                  <div className="flex-1 flex items-center justify-center bg-white rounded-lg shadow-md border border-secondary-300/30 overflow-hidden max-w-[49%]">
                    <img 
                      src={`https://raw.githubusercontent.com/zeyadetman/quran-pages-images/master/quran-images/${leftPage}.jpg`}
                      alt={`Classic Mushaf Page ${leftPage}`}
                      className="max-h-[65vh] md:max-h-[75vh] object-contain select-none pointer-events-none"
                      onLoad={() => setImgLoading(false)}
                      onError={(e) => {
                        console.error("Failed to load page image: ", leftPage);
                        setImgLoading(false);
                      }}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </>
            ) : (
              /* Single Page Mode */
              <div className="flex items-center justify-center bg-white rounded-lg shadow-xl border border-secondary-300/40 overflow-hidden max-w-full">
                <img 
                  src={imageUrl} 
                  alt={`Classic Mushaf Page ${page}`}
                  className="max-h-[72vh] md:max-h-[75vh] object-contain select-none pointer-events-none rounded-lg"
                  onLoad={() => setImgLoading(false)}
                  onError={(e) => {
                    console.error("Failed to load page image: ", imageUrl);
                    setImgLoading(false);
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>

          {/* RTL Side Click Zones / Buttons */}
          <button
            onClick={handleNextPage}
            disabled={viewMode === 'double' ? page >= 603 : page === 604}
            className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/70 dark:bg-slate-800/70 hover:bg-emerald-500 hover:text-white text-slate-800 dark:text-slate-100 hover:shadow-lg disabled:opacity-20 disabled:hover:bg-white/70 disabled:hover:text-slate-800 transition-all select-none z-10 cursor-pointer disabled:cursor-not-allowed"
            title={lang === 'ar' ? 'الصفحة التالية (يسار)' : 'Next Page (RTL)'}
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/70 dark:bg-slate-800/70 hover:bg-emerald-500 hover:text-white text-slate-800 dark:text-slate-100 hover:shadow-lg disabled:opacity-20 disabled:hover:bg-white/70 disabled:hover:text-slate-800 transition-all select-none z-10 cursor-pointer disabled:cursor-not-allowed"
            title={lang === 'ar' ? 'الصفحة السابقة (يمين)' : 'Previous Page (LTR)'}
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* FOOTER BAR WITH PAGE INDEX DETAILS */}
        <div className="border-t border-secondary-200/50 dark:border-slate-800 bg-[#fbf9f0] dark:bg-slate-900 px-6 py-3.5 z-10 select-none flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {lang === 'ar' ? 'سورة' : 'Surah'}: {lang === 'ar' ? currentSurah.name : currentSurah.englishName}
            </span>
            <span className="text-secondary-300 dark:text-slate-700">|</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {lang === 'ar' ? `الجزء ${currentJuz}` : `Juz ${currentJuz}`}
            </span>
          </div>

          {/* Page Badge */}
          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 px-3.5 py-1 rounded-full text-xs font-extrabold text-emerald-800 dark:text-emerald-400 shadow-xs animate-pulse-slow">
            <span>{lang === 'ar' ? 'الصفحة' : 'Page'}</span>
            <span className="font-mono text-sm">
              {viewMode === 'double' ? `${rightPage} - ${leftPage}` : page}
            </span>
            <span className="text-emerald-300">/</span>
            <span className="font-mono text-sm">604</span>
          </div>

          <div className="hidden sm:block text-slate-400 text-xs italic">
            {lang === 'ar' ? 'استخدم الأسهم يمين/يسار أو اسحب على الشاشة للتنقل' : 'Swipe or use left/right keys to flip'}
          </div>
        </div>

      </div>
    </div>
  );
}

// Helper to prevent TS compilation complaints on nested references
function currentSurid(num: number): number {
  return num;
}
