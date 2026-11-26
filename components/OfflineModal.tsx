import React, { useState, useEffect } from 'react';
import { 
  Wifi, WifiOff, Download, CheckCircle2, Trash2, RefreshCw, 
  BookOpen, Sparkles, AlertCircle, X, HardDrive, ShieldCheck, ChevronRight, Search
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { offlineStorage, ESSENTIAL_FRIDAY_SURAHS } from './offlineStorageService';
import { allSurahs, SurahInfo } from './surahListData';

interface OfflineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSurah?: (surahNumber: number) => void;
}

export const OfflineModal: React.FC<OfflineModalProps> = ({
  isOpen,
  onClose,
  onOpenSurah
}) => {
  const { language, t } = useLanguage();
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [cachedSurahs, setCachedSurahs] = useState<number[]>([]);
  const [storageStats, setStorageStats] = useState<{
    cachedSurahsCount: number;
    isOfflineReady: boolean;
    estimatedSizeKB: number;
  }>({
    cachedSurahsCount: 0,
    isOfflineReady: false,
    estimatedSizeKB: 0
  });

  const [isDownloadingAll, setIsDownloadingAll] = useState<boolean>(false);
  const [isDownloadingFriday, setIsDownloadingFriday] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<{ current: number; total: number; name: string }>({
    current: 0,
    total: 0,
    name: ''
  });
  const [cancelRequested, setCancelRequested] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'friday' | 'cached'>('friday');

  const refreshCacheStats = async () => {
    const stats = await offlineStorage.getStorageStats();
    setStorageStats({
      cachedSurahsCount: stats.cachedSurahsCount,
      isOfflineReady: stats.isOfflineReady,
      estimatedSizeKB: stats.estimatedSizeKB
    });
    setCachedSurahs(stats.cachedSurahNumbers);
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('offline-cache-updated', refreshCacheStats);

    refreshCacheStats();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('offline-cache-updated', refreshCacheStats);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      refreshCacheStats();
      setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadSingleSurah = async (surahNumber: number) => {
    const translation = localStorage.getItem('quran-translation') || 'en.sahih';
    await offlineStorage.downloadAndCacheSurah(surahNumber, translation);
    await refreshCacheStats();
  };

  const handleDeleteSingleSurah = async (surahNumber: number) => {
    await offlineStorage.deleteCachedSurah(surahNumber);
    await refreshCacheStats();
  };

  const handleDownloadFridaySurahs = async () => {
    if (isDownloadingFriday || isDownloadingAll) return;
    setIsDownloadingFriday(true);
    setCancelRequested(false);
    const translation = localStorage.getItem('quran-translation') || 'en.sahih';

    await offlineStorage.downloadEssentialFridaySurahs(translation, (done, total, name) => {
      setDownloadProgress({ current: done, total, name });
    });

    await refreshCacheStats();
    setIsDownloadingFriday(false);
  };

  const handleDownloadAllSurahs = async () => {
    if (isDownloadingAll || isDownloadingFriday) return;
    setIsDownloadingAll(true);
    setCancelRequested(false);
    const translation = localStorage.getItem('quran-translation') || 'en.sahih';
    const total = 114;

    for (let i = 1; i <= total; i++) {
      if (cancelRequested) break;
      const surahMeta = allSurahs.find(s => s.number === i);
      setDownloadProgress({ current: i - 1, total, name: surahMeta?.englishName || `Surah ${i}` });
      await offlineStorage.downloadAndCacheSurah(i, translation);
    }

    await refreshCacheStats();
    setIsDownloadingAll(false);
    setCancelRequested(false);
  };

  const handleClearAll = async () => {
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من مسح جميع السور المحفوظة للمطالعة بدون إنترنت؟' : 'Are you sure you want to clear all offline cached Surahs and Duas?')) {
      await offlineStorage.clearAllOfflineCache();
      await refreshCacheStats();
    }
  };

  const handleReadSurah = (surahNumber: number) => {
    onClose();
    if (onOpenSurah) {
      onOpenSurah(surahNumber);
    } else {
      window.dispatchEvent(new CustomEvent('open-quran-surah', { detail: { surahNumber } }));
      window.dispatchEvent(new CustomEvent('navigate-to-section', { detail: 'quran' }));
    }
  };

  const filteredSurahs = allSurahs.filter(s => {
    const matchesSearch = 
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.includes(searchQuery) ||
      s.number.toString() === searchQuery.trim();

    if (!matchesSearch) return false;

    if (activeTab === 'friday') {
      return ESSENTIAL_FRIDAY_SURAHS.some(f => f.number === s.number);
    }
    if (activeTab === 'cached') {
      return cachedSurahs.includes(s.number);
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isOnline ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'}`}>
              {isOnline ? <Wifi size={20} /> : <WifiOff size={20} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                  {language === 'ar' ? 'مركز القراءة دون اتصال (Offline)' : 'Offline Quran & Dua Storage'}
                </h3>
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                  isOnline 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' 
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                }`}>
                  {isOnline ? (language === 'ar' ? 'متصل بالإنترنت' : 'Online') : (language === 'ar' ? 'وضع غير متصل' : 'Offline Mode')}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'ar' 
                  ? 'يتم تخزين نصوص القرآن والأدعية تلقائياً في المتصفح لضمان وصول سلس أينما كنت'
                  : 'Surah texts and Duas are stored in browser storage and Service Worker for seamless offline reading'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Storage Summary Bar */}
        <div className="px-4 py-3 bg-primary-50/60 dark:bg-primary-950/20 border-b border-primary-100 dark:border-primary-900/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5 font-medium">
              <HardDrive size={15} className="text-primary-600 dark:text-primary-400" />
              <span>{language === 'ar' ? 'السور المخزنة:' : 'Cached Surahs:'}</span>
              <strong className="text-primary-700 dark:text-primary-300">{storageStats.cachedSurahsCount} / 114</strong>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <span>{language === 'ar' ? 'الحجم التقريبي:' : 'Est. Size:'}</span>
              <strong className="text-slate-700 dark:text-slate-300">
                {storageStats.estimatedSizeKB > 1024 
                  ? `${(storageStats.estimatedSizeKB / 1024).toFixed(1)} MB` 
                  : `${storageStats.estimatedSizeKB} KB`}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {storageStats.isOfflineReady && (
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                <ShieldCheck size={14} />
                <span>{language === 'ar' ? 'جاهز للاستخدام بدون نت' : 'Offline Ready'}</span>
              </span>
            )}
            {storageStats.cachedSurahsCount > 0 && (
              <button
                onClick={handleClearAll}
                type="button"
                className="text-[11px] text-red-600 hover:text-red-700 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                title="Clear cached surahs"
              >
                <Trash2 size={12} />
                <span>{language === 'ar' ? 'مسح المخزن' : 'Clear All'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Progress Bar if downloading */}
        {(isDownloadingFriday || isDownloadingAll) && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/40">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1.5">
              <div className="flex items-center gap-2">
                <RefreshCw size={14} className="animate-spin text-amber-600 dark:text-amber-400" />
                <span>
                  {language === 'ar' 
                    ? `جارِ تحميل وتخزين: ${downloadProgress.name} (${downloadProgress.current + 1}/${downloadProgress.total})...`
                    : `Caching for offline: ${downloadProgress.name} (${downloadProgress.current + 1}/${downloadProgress.total})...`}
                </span>
              </div>
              <button
                onClick={() => setCancelRequested(true)}
                type="button"
                className="text-amber-800 dark:text-amber-300 hover:underline text-[11px]"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
            <div className="w-full bg-amber-200 dark:bg-amber-900/60 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-amber-600 dark:bg-amber-400 h-full transition-all duration-300"
                style={{ width: `${Math.round(((downloadProgress.current + 1) / (downloadProgress.total || 1)) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Quick Action Cards */}
        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40">
          {/* Card 1: Essential Friday Surahs */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-secondary-600 dark:text-secondary-400" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                  {language === 'ar' ? 'سور الجمعة والورد اليومي (16 سورة)' : 'Friday & Daily Surahs (16 Surahs)'}
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                {language === 'ar' 
                  ? 'الكهف، السجدة، يس، الملك، الواقعة، الجمعة، الإنسان، الفاتحة، المعوذات والمزيد'
                  : 'Al-Kahf, As-Sajdah, Yasin, Al-Mulk, Al-Waqi\'ah, Al-Jumu\'ah, Al-Insan, Fatiha & 3 Quls'}
              </p>
            </div>
            <button
              onClick={handleDownloadFridaySurahs}
              disabled={isDownloadingFriday || isDownloadingAll || !isOnline}
              type="button"
              className="w-full py-2 px-3 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Download size={14} />
              <span>{language === 'ar' ? 'تنزيل سور الجمعة للمطالعة دون نت' : 'Cache 16 Friday Surahs'}</span>
            </button>
          </div>

          {/* Card 2: Complete Holy Quran (114 Surahs) */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BookOpen size={16} className="text-primary-600 dark:text-primary-400" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                  {language === 'ar' ? 'القرآن الكريم كاملاً (114 سورة)' : 'Complete Quran (All 114 Surahs)'}
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                {language === 'ar' 
                  ? 'حفظ المصحف الشريف بالكامل بجميع أجزائه مع الترجمة للتصفح والبحث بدون أي اتصال'
                  : 'Download complete Arabic verses and translations for 100% offline access anywhere'}
              </p>
            </div>
            <button
              onClick={handleDownloadAllSurahs}
              disabled={isDownloadingAll || isDownloadingFriday || !isOnline}
              type="button"
              className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Download size={14} />
              <span>{language === 'ar' ? 'تنزيل المصحف كاملاً (114 سورة)' : 'Cache All 114 Surahs'}</span>
            </button>
          </div>
        </div>

        {/* Tab Filters and Search */}
        <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('friday')}
              type="button"
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'friday'
                  ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-primary-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {language === 'ar' ? 'سور الجمعة' : 'Friday Surahs'}
            </button>
            <button
              onClick={() => setActiveTab('cached')}
              type="button"
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                activeTab === 'cached'
                  ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-primary-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span>{language === 'ar' ? 'المخزنة' : 'Cached Only'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-primary-100 dark:bg-primary-900/60 text-[10px] text-primary-800 dark:text-primary-300 font-bold">
                {cachedSurahs.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('all')}
              type="button"
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-primary-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {language === 'ar' ? 'جميع السور (114)' : 'All 114 Surahs'}
            </button>
          </div>

          <div className="relative flex-1 min-w-[160px] max-w-[240px]">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ar' ? 'بحث عن سورة...' : 'Filter surah...'}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Surah List Table / Rows */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 p-2 max-h-[380px]">
          {filteredSurahs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              {language === 'ar' ? 'لا توجد سور مطابقة' : 'No matching surahs found'}
            </div>
          ) : (
            filteredSurahs.map((surah) => {
              const isCached = cachedSurahs.includes(surah.number);
              const fridayInfo = ESSENTIAL_FRIDAY_SURAHS.find(f => f.number === surah.number);

              return (
                <div 
                  key={surah.number}
                  className="p-2.5 sm:p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400 font-mono">
                      {surah.number}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                          {surah.englishName}
                        </span>
                        <span className="font-arabic text-xs font-bold text-primary-700 dark:text-secondary-400">
                          {surah.name}
                        </span>
                        {fridayInfo && (
                          <span className="px-1.5 py-0.2 bg-secondary-100 dark:bg-secondary-900/40 text-secondary-800 dark:text-secondary-300 text-[10px] rounded-sm font-medium">
                            Friday
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {surah.englishNameTranslation} • {surah.numberOfAyahs} {language === 'ar' ? 'آية' : 'Ayahs'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isCached ? (
                      <>
                        <span className="hidden xs:flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-900/40">
                          <CheckCircle2 size={13} />
                          <span>{language === 'ar' ? 'مخزن' : 'Cached'}</span>
                        </span>
                        <button
                          onClick={() => handleReadSurah(surah.number)}
                          type="button"
                          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        >
                          <BookOpen size={13} />
                          <span>{language === 'ar' ? 'قراءة' : 'Read'}</span>
                        </button>
                        <button
                          onClick={() => handleDeleteSingleSurah(surah.number)}
                          type="button"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="Remove from offline cache"
                        >
                          <Trash2 size={13} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleDownloadSingleSurah(surah.number)}
                        disabled={!isOnline}
                        type="button"
                        className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-primary-50 dark:bg-slate-800 dark:hover:bg-primary-950/40 text-slate-700 dark:text-slate-300 hover:text-primary-700 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                        title={isOnline ? "Download for offline use" : "Connect to internet to download"}
                      >
                        <Download size={13} />
                        <span>{language === 'ar' ? 'تنزيل' : 'Cache'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={15} className="text-primary-600 dark:text-primary-400" />
            <span>
              {language === 'ar' 
                ? 'محمية بتقنية Service Worker وتخزين متصفح دائم' 
                : 'Secured via Service Worker & Persistent IndexedDB'}
            </span>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer transition-colors"
          >
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
