import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Check, 
  Copy, 
  Volume2, 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  Printer, 
  Info, 
  Share2, 
  Heart, 
  Compass, 
  Flame, 
  Award,
  Layers,
  ArrowRight,
  ListFilter,
  Eye,
  EyeOff,
  SlidersHorizontal,
  GraduationCap,
  Download,
  FileText,
  Settings2,
  Loader2,
  Scale
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { TTSButton } from './TTSButton';
import { 
  SALAT_RECITATIONS, 
  SALAT_POSITION_CATEGORIES, 
  SalatRecitation, 
  PositionCategory,
  RulingLevel,
  getSalat3DImage,
  SALAT_3D_POSTURE_IMAGES
} from './salatRecitationsData';
import { SalatExportModal } from './SalatExportModal';
import { downloadSalatRecitationsDocx, printSalatRecitationsHTML } from './salatDocxExport';
import { SalatRulingsModal, RulingTab } from './SalatRulingsModal';

interface SalatRecitationsSectionProps {
  onNavigateToQibla?: () => void;
  onNavigateToAzkar?: () => void;
}

export const SalatRecitationsSection: React.FC<SalatRecitationsSectionProps> = ({
  onNavigateToQibla,
  onNavigateToAzkar
}) => {
  const { language, t } = useLanguage();

  // Mode: 'guide' (All positions list/cards), 'stepper' (interactive step-by-step prayer walkthrough), 'essential' (cheat sheet)
  const [viewMode, setViewMode] = useState<'guide' | 'stepper' | 'essential'>('guide');

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<PositionCategory | 'all'>('all');
  const [selectedRuling, setSelectedRuling] = useState<RulingLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Display preferences
  const [showTransliteration, setShowTransliteration] = useState<boolean>(true);
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const [showAmharic, setShowAmharic] = useState<boolean>(language === 'am' || language === 'har');
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Stepper state
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [stepperCounter, setStepperCounter] = useState<number>(0);

  // Repetition counters per recitation id
  const [itemCounters, setItemCounters] = useState<Record<string, number>>({});

  // Bookmarked IDs (saved to My Duas / local storage)
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('my-favorite-duas');
      if (stored) {
        const list = JSON.parse(stored);
        return list.map((d: any) => d.id);
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Copied feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filtered recitations for guide mode
  const filteredRecitations = useMemo(() => {
    return SALAT_RECITATIONS.filter(item => {
      // Category filter
      if (selectedCategory !== 'all' && item.positionCategory !== selectedCategory) {
        return false;
      }
      // Ruling filter
      if (selectedRuling !== 'all' && item.ruling !== selectedRuling) {
        return false;
      }
      // Essential view filter
      if (viewMode === 'essential' && !item.isEssential) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.titleEn.toLowerCase().includes(q) || item.titleAr.includes(q);
        const matchArabic = item.arabicText.includes(q);
        const matchTranslit = item.transliteration.toLowerCase().includes(q);
        const matchTransEn = item.translationEn.toLowerCase().includes(q);
        const matchTransAm = item.translationAm?.toLowerCase().includes(q) || false;
        const matchPos = item.positionNameEn.toLowerCase().includes(q) || item.positionNameAr.includes(q);
        return matchTitle || matchArabic || matchTranslit || matchTransEn || matchTransAm || matchPos;
      }
      return true;
    });
  }, [selectedCategory, selectedRuling, viewMode, searchQuery]);

  // Handle counter click
  const handleIncrementCounter = (id: string, maxCount: number) => {
    setItemCounters(prev => {
      const current = prev[id] || 0;
      const next = current >= maxCount ? 0 : current + 1;
      return { ...prev, [id]: next };
    });
  };

  const handleResetCounter = (id: string) => {
    setItemCounters(prev => ({ ...prev, [id]: 0 }));
  };

  // Copy recitation to clipboard
  const handleCopyRecitation = (item: SalatRecitation) => {
    const textToCopy = `[${item.positionNameEn} - ${item.titleEn}]\n\nArabic:\n${item.arabicText}\n\nTransliteration:\n${item.transliteration}\n\nTranslation:\n${item.translationEn}${item.translationAm ? `\n\nAmharic Translation:\n${item.translationAm}` : ''}\n\nReference: ${item.hadithReference} (${item.authenticityGrade})`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  // Toggle favorite / My Duas
  const handleToggleFavorite = (item: SalatRecitation) => {
    let current: any[] = [];
    try {
      const stored = localStorage.getItem('my-favorite-duas');
      if (stored) current = JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }

    const exists = current.some(d => d.id === `salat-${item.id}`);
    let updated;
    if (exists) {
      updated = current.filter(d => d.id !== `salat-${item.id}`);
      setSavedIds(prev => prev.filter(id => id !== `salat-${item.id}`));
    } else {
      const newDua = {
        id: `salat-${item.id}`,
        category: 'general',
        title: `${item.positionNameEn}: ${item.titleEn}`,
        arabicText: item.arabicText,
        transliterationText: item.transliteration,
        translationText: item.translationEn,
        reference: item.hadithReference,
        tags: ['salat', 'prayer', item.positionCategory, item.ruling],
        timestamp: Date.now()
      };
      updated = [...current, newDua];
      setSavedIds(prev => [...prev, `salat-${item.id}`]);
    }

    try {
      localStorage.setItem('my-favorite-duas', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('my-duas-updated'));
    } catch (e) {
      console.error(e);
    }
  };

  // Stepper current item
  const stepperItem = SALAT_RECITATIONS[currentStepIndex];

  const handleNextStep = () => {
    if (currentStepIndex < SALAT_RECITATIONS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setStepperCounter(0);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setStepperCounter(0);
    }
  };

  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isDownloadingDocx, setIsDownloadingDocx] = useState<boolean>(false);
  const [isPrintingPDF, setIsPrintingPDF] = useState<boolean>(false);
  const [isRulingsModalOpen, setIsRulingsModalOpen] = useState<boolean>(false);
  const [rulingsModalTab, setRulingsModalTab] = useState<RulingTab>('all');
  const [isRulingsBannerCollapsed, setIsRulingsBannerCollapsed] = useState<boolean>(false);

  const handleOpenRulingsModal = (tab: RulingTab = 'all') => {
    setRulingsModalTab(tab);
    setIsRulingsModalOpen(true);
  };

  const handleQuickDownloadDocx = async () => {
    setIsDownloadingDocx(true);
    try {
      await downloadSalatRecitationsDocx(
        {
          includeTransliteration: showTransliteration,
          includeEnglish: showTranslation,
          includeAmharic: showAmharic,
          includeNotes: showExplanation,
          includeImages: true,
          filterRuling: viewMode === 'essential' ? 'essential' : 'all'
        },
        viewMode === 'essential'
          ? 'What_to_Recite_During_Salat_Essential_Pillars.docx'
          : 'What_to_Recite_During_Salat_Complete_Guide.docx'
      );
    } catch (e) {
      console.error('Failed to generate docx:', e);
      alert('Error generating Word document. Please try again.');
    } finally {
      setIsDownloadingDocx(false);
    }
  };

  const handleQuickPrintPDF = async () => {
    setIsPrintingPDF(true);
    try {
      await printSalatRecitationsHTML({
        includeTransliteration: showTransliteration,
        includeEnglish: showTranslation,
        includeAmharic: showAmharic,
        includeNotes: showExplanation,
        includeImages: true,
        filterRuling: viewMode === 'essential' ? 'essential' : 'all'
      });
    } catch (e) {
      console.error('Failed to print PDF:', e);
    } finally {
      setIsPrintingPDF(false);
    }
  };

  const handlePrint = () => {
    handleQuickPrintPDF();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 via-primary-950 to-slate-950 text-white p-6 sm:p-8 md:p-10 shadow-xl border border-primary-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-primary-500/20 text-primary-200 border border-primary-400/30">
              <Sparkles size={13} className="text-secondary-400" />
              <span>{language === 'ar' ? 'فقه الصلاة والأذكار المأثورة' : 'Authentic Prophetic Sunnah'}</span>
            </span>

            <span className="text-xs text-secondary-300 font-semibold px-2 py-0.5 rounded-md bg-secondary-950/60 border border-secondary-800/60">
              {language === 'ar' ? '١١ موضعاً • ٣١ ذكراً ودعاءً' : '11 Positions • 31 Adhkar & Duas'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
            {language === 'ar' 
              ? 'أذكار وأدعية الصلاة في كل ركن وموضع'
              : (language === 'am' 
                ? 'በእያንዳንዱ የሰላት አቋም ውስጥ የሚባሉ ዚክሮችና ዱዓዎች' 
                : 'What to Recite in Every Position of Salat')}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {language === 'ar'
              ? 'الدليل الجامع والشامل لما يقال في كل حركة وركن من أركان الصلاة من تكبيرة الإحرام إلى التسليم وما بعدها، بالنص العربي المشكول، والترجمة، ودرجة الأثر، والفوائد الإيمانية من هدي خير الأنام ﷺ.'
              : (language === 'am'
                ? 'ከመክፈቻ ተክቢራ እስከ ተስሊምና ከሶላት በኋላ ድረስ በሁሉም የሰላት አቋሞች የሚባሉ ትክክለኛ ዚክሮች ከአረብኛ ንባብና ትርጉም ጋር።'
                : 'A comprehensive, authentic guide to every invocation, glorification, and prayer uttered across all postures of Salat from Takbirat al-Ihram to the final Tasleem and post-prayer adhkar, with full diacritic Arabic, transliteration, English, and Amharic translation.')}
          </p>

          {/* Quick Metrics Bar & Document Action Buttons */}
          <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-primary-800/60">
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{language === 'ar' ? 'أركان وواجبات وسنن مؤكدة' : 'Pillars, Obligations & Sunnahs'}</span>
              </div>
              <span className="text-slate-600">·</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>{language === 'ar' ? 'صحيح البخاري ومسلم والسنن' : 'Bukhari, Muslim & Sunan Sources'}</span>
              </div>
              <span className="text-slate-600">·</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary-400" />
                <span>{language === 'ar' ? 'تلاوة صوتية تفاعلية لكل موضع' : 'Interactive Audio Playback (TTS)'}</span>
              </div>
            </div>

            {/* Document Export Buttons & Fiqh Rulings Guide */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleOpenRulingsModal('all')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95 ring-1 ring-amber-400/40"
                title="Fiqh of Salat: What each ruling means (Pillars, Obligations & Sunnahs)"
              >
                <Scale size={14} className="text-amber-200" />
                <span>{language === 'ar' ? 'بيان أحكام الصلاة (الأركان والواجبات والسنن)' : 'Salat Rulings Guide (Arkan, Wajibat, Sunnahs)'}</span>
              </button>

              <button
                onClick={handleQuickPrintPDF}
                disabled={isPrintingPDF}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                title="Print or Save as PDF Document with 3D Posture Models"
              >
                {isPrintingPDF ? <Loader2 size={14} className="animate-spin" /> : <Printer size={14} />}
                <span>{language === 'ar' ? 'طباعة / حفظ كـ PDF (مع 3D)' : 'Print / Save PDF (with 3D)'}</span>
              </button>

              <button
                onClick={handleQuickDownloadDocx}
                disabled={isDownloadingDocx}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                title="Download formatted Microsoft Word Document"
              >
                {isDownloadingDocx ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                <span>{language === 'ar' ? 'تحميل مستند Word' : 'Download Word (.docx)'}</span>
              </button>

              <button
                onClick={() => setIsExportModalOpen(true)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-all cursor-pointer"
                title="Export Options & Customization"
              >
                <Settings2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Mode Selector & Utility Toolbar */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-secondary-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Mode Selector Tabs */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60 overflow-x-auto">
          <button
            onClick={() => setViewMode('guide')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              viewMode === 'guide'
                ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-primary-300 shadow-xs ring-1 ring-slate-200 dark:ring-slate-600'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen size={14} />
            <span>{language === 'ar' ? 'الدليل الشامل لكل المواضع' : 'All Positions Master Guide'}</span>
          </button>

          <button
            onClick={() => setViewMode('stepper')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              viewMode === 'stepper'
                ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-primary-300 shadow-xs ring-1 ring-slate-200 dark:ring-slate-600'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <GraduationCap size={14} />
            <span>{language === 'ar' ? 'التطبيق التفاعلي خطوة بخطوة' : 'Interactive Prayer Stepper'}</span>
          </button>

          <button
            onClick={() => setViewMode('essential')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              viewMode === 'essential'
                ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-primary-300 shadow-xs ring-1 ring-slate-200 dark:ring-slate-600'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Award size={14} />
            <span>{language === 'ar' ? 'ملخص الأركان والواجبات' : 'Essential Cheat-Sheet'}</span>
          </button>
        </div>

        {/* Display Toggles & Print Button */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Toggle Transliteration */}
          <button
            onClick={() => setShowTransliteration(!showTransliteration)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold border transition-all cursor-pointer ${
              showTransliteration
                ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
            }`}
            title="Toggle Transliteration"
          >
            {showTransliteration ? <Eye size={13} /> : <EyeOff size={13} />}
            <span>{language === 'ar' ? 'النطق اللاتيني' : 'Transliteration'}</span>
          </button>

          {/* Toggle Translation */}
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold border transition-all cursor-pointer ${
              showTranslation
                ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
            }`}
            title="Toggle English Translation"
          >
            {showTranslation ? <Eye size={13} /> : <EyeOff size={13} />}
            <span>{language === 'ar' ? 'الترجمة الإنجليزية' : 'English Translation'}</span>
          </button>

          {/* Toggle Amharic Translation */}
          <button
            onClick={() => setShowAmharic(!showAmharic)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold border transition-all cursor-pointer ${
              showAmharic
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
            }`}
            title="Toggle Amharic Translation"
          >
            <span>{language === 'ar' ? 'الترجمة الأمهرية' : 'አማርኛ ትርጉም'}</span>
          </button>

          {/* Toggle In-depth Explanations */}
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold border transition-all cursor-pointer ${
              showExplanation
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
            }`}
            title="Toggle Detailed Hadith Insights"
          >
            <Info size={13} />
            <span>{language === 'ar' ? 'الشرح والفوائد' : 'Explanations'}</span>
          </button>

          {/* Export & Print Action Buttons */}
          <div className="flex items-center gap-1 pl-1 border-l border-slate-200 dark:border-slate-700">
            {/* Quick Word Download */}
            <button
              onClick={handleQuickDownloadDocx}
              disabled={isDownloadingDocx}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl font-semibold transition-all cursor-pointer disabled:opacity-50"
              title="Download Microsoft Word Document (.docx)"
            >
              {isDownloadingDocx ? <Loader2 size={13} className="animate-spin" /> : <FileText size={13} />}
              <span className="hidden sm:inline">Word</span>
            </button>

            {/* Quick Print / Save as PDF */}
            <button
              onClick={handleQuickPrintPDF}
              disabled={isPrintingPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 hover:bg-primary-100 dark:bg-primary-950/60 dark:hover:bg-primary-900/60 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 rounded-xl font-semibold transition-all cursor-pointer disabled:opacity-50"
              title="Print or Save as PDF with 3D Postures"
            >
              {isPrintingPDF ? <Loader2 size={13} className="animate-spin" /> : <Printer size={13} />}
              <span className="hidden sm:inline">{language === 'ar' ? 'طباعة / PDF' : 'PDF / Print'}</span>
            </button>

            {/* Export Settings Modal */}
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-all cursor-pointer"
              title="Export Settings & Formats"
            >
              <Settings2 size={14} />
            </button>
          </div>
        </div>

      </div>

      {/* 2.5 Educational Fiqh Card: Understanding Pillars, Obligations & Sunnahs */}
      <div className="bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 rounded-2xl border border-secondary-400/30 p-4 sm:p-5 text-white shadow-lg space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-secondary-400/20 text-secondary-300 ring-1 ring-secondary-400/40">
              <Scale size={20} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-secondary-400">
                  {language === 'ar' ? 'فقه الصلاة المعتمد' : 'Islamic Fiqh Jurisprudence'}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] bg-secondary-900/80 text-secondary-300 border border-secondary-700/50">
                  {language === 'ar' ? 'الفرق بين الركن والواجب والسنة' : 'Arkan vs Wajibat vs Sunnahs'}
                </span>
              </div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                {language === 'ar' 
                  ? 'ما معنى الركن والواجب والسنة في الصلاة؟ وما حكم النسيان؟' 
                  : 'What Do the Rulings Mean? (Pillars, Obligations & Sunnahs Explained)'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenRulingsModal('comparison')}
              className="px-3 py-1.5 rounded-xl bg-secondary-500 hover:bg-secondary-400 text-slate-950 font-bold text-xs transition-all cursor-pointer whitespace-nowrap shadow-sm"
            >
              {language === 'ar' ? 'جدول المقارنة الكامل' : 'Open Full Fiqh Guide'}
            </button>
            <button
              onClick={() => setIsRulingsBannerCollapsed(!isRulingsBannerCollapsed)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={isRulingsBannerCollapsed ? 'Expand explanation' : 'Collapse explanation'}
            >
              {isRulingsBannerCollapsed ? <ChevronRight size={16} /> : <Info size={16} />}
            </button>
          </div>
        </div>

        {!isRulingsBannerCollapsed && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800 text-xs">
            
            {/* 1. Pillars */}
            <div 
              onClick={() => handleOpenRulingsModal('arkan')}
              className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/50 hover:border-rose-600 transition-all cursor-pointer space-y-1.5 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span>{language === 'ar' ? 'الأركان (١٤ ركناً)' : 'Pillars / Arkan (14)'}</span>
                </span>
                <span className="text-[10px] text-rose-400 group-hover:underline">
                  {language === 'ar' ? 'التفاصيل ←' : 'Details →'}
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                <strong>{language === 'ar' ? 'المعنى:' : 'Core Rule:'}</strong> {language === 'ar' 
                  ? 'أساس الصلاة الذي لا تقوم إلا به (كالفاتحة والركوع والسجود والطمأنينة). تركه عمداً يبطل الصلاة، وتركه سهواً يلزم الإتيان به ثم سجود السهو؛ لا يسقط بمجرد السجود!' 
                  : 'Foundational parts (e.g. Fatihah, Ruku, Sujud, Tumaninah). Deliberate omission invalidates prayer. Forgetful omission MUST be made up + Sujud as-Sahw.'}
              </p>
            </div>

            {/* 2. Obligations */}
            <div 
              onClick={() => handleOpenRulingsModal('wajibat')}
              className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/50 hover:border-amber-600 transition-all cursor-pointer space-y-1.5 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>{language === 'ar' ? 'الواجبات (٨ واجبات)' : 'Obligations / Wajibat (8)'}</span>
                </span>
                <span className="text-[10px] text-amber-400 group-hover:underline">
                  {language === 'ar' ? 'التفاصيل ←' : 'Details →'}
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                <strong>{language === 'ar' ? 'المعنى:' : 'Core Rule:'}</strong> {language === 'ar' 
                  ? 'أوامر لازمة (كتكبيرات الانتقال، وتسبيح الركوع والسجود، والتشهد الأول). تركه عمداً يبطل الصلاة، وتركه سهواً يجبره سجود السهو تماماً قبل السلام.' 
                  : 'Mandatory commands (e.g. Transition Takbirs, Tasbih in Ruku/Sujud, 1st Tashahhud). Forgetful omission is fully compensated by Sujud as-Sahw.'}
              </p>
            </div>

            {/* 3. Sunnahs */}
            <div 
              onClick={() => handleOpenRulingsModal('sunan')}
              className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 hover:border-emerald-600 transition-all cursor-pointer space-y-1.5 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{language === 'ar' ? 'السنن (قولية وفعلية)' : 'Sunnahs / Sunan'}</span>
                </span>
                <span className="text-[10px] text-emerald-400 group-hover:underline">
                  {language === 'ar' ? 'التفاصيل ←' : 'Details →'}
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                <strong>{language === 'ar' ? 'المعنى:' : 'Core Rule:'}</strong> {language === 'ar' 
                  ? 'أقوال وأفعال مستحبة تزيد الثواب والخشوع (كدعاء الاستفتاح، ورفع اليدين، والتورك). تركها عمداً أو سهواً لا يبطل الصلاة ولا يوجب سجود السهو.' 
                  : 'Voluntary verbal & physical acts completing prayer (e.g. Istiftah, raising hands, Tawarruk). Omission does not invalidate prayer, no Sahw required.'}
              </p>
            </div>

          </div>
        )}
      </div>

      {/* 3. STEPPER VIEW MODE: Interactive step-by-step prayer movement walkthrough */}
      {viewMode === 'stepper' && (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl border border-secondary-200 dark:border-slate-800 p-6 sm:p-8 shadow-lg space-y-6 animate-in slide-in-from-top-3 duration-300">
          
          {/* Stepper Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-mono">
                  {currentStepIndex + 1} / {SALAT_RECITATIONS.length}
                </span>
                <span>{stepperItem.positionNameEn}</span>
              </span>

              <span className="font-mono text-emerald-600 dark:text-emerald-400">
                {Math.round(((currentStepIndex + 1) / SALAT_RECITATIONS.length) * 100)}%
              </span>
            </div>

            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-600 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentStepIndex + 1) / SALAT_RECITATIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Stepper Active Card Content */}
          <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-6">
            
            {/* Movement Title & Posture Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleOpenRulingsModal(stepperItem.ruling === 'pillar' ? 'arkan' : stepperItem.ruling === 'obligatory' ? 'wajibat' : 'sunan')}
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 cursor-pointer hover:opacity-85 transition-opacity ${
                      stepperItem.ruling === 'pillar'
                        ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                        : stepperItem.ruling === 'obligatory'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    }`}
                    title={language === 'ar' ? 'انقر لمعرفة شرح هذا الحكم الفقهي' : 'Click to view ruling details'}
                  >
                    <span>{language === 'ar' ? stepperItem.rulingLabelAr : stepperItem.rulingLabelEn}</span>
                    <Info size={11} className="opacity-70" />
                  </button>

                  {stepperItem.repeatCount > 1 && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-bold">
                      {stepperItem.repeatCount}x {language === 'ar' ? 'مرات' : 'Repeats'}
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-850 dark:text-slate-100">
                  {language === 'ar' ? stepperItem.titleAr : stepperItem.titleEn}
                </h2>
                
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'ar' ? stepperItem.postureDescriptionAr : stepperItem.postureDescriptionEn}
                </p>
              </div>

              {/* Action Toolbar for Stepper Card */}
              <div className="flex items-center gap-2 shrink-0">
                <TTSButton text={stepperItem.arabicText} lang="ar" size="md" />
                {stepperItem.translationEn && (
                  <TTSButton text={stepperItem.translationEn} lang="en" size="md" />
                )}
                <button
                  onClick={() => handleCopyRecitation(stepperItem)}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-all cursor-pointer"
                  title="Copy Recitation"
                >
                  {copiedId === stepperItem.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                </button>
                <button
                  onClick={() => handleToggleFavorite(stepperItem)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    savedIds.includes(`salat-${stepperItem.id}`)
                      ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500'
                  }`}
                  title="Save to My Duas"
                >
                  {savedIds.includes(`salat-${stepperItem.id}`) ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                </button>
              </div>
            </div>

            {/* 3D Posture Model & Motion Guide */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-secondary-200/80 dark:border-slate-800 shadow-xs">
              <div className="relative group shrink-0">
                <img 
                  src={getSalat3DImage(stepperItem.positionCategory)} 
                  alt={stepperItem.positionNameEn}
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-2xl border-2 border-emerald-500/30 dark:border-emerald-500/50 shadow-md group-hover:scale-105 transition-all duration-300"
                />
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-xs text-[9px] font-bold text-white tracking-wide uppercase">
                  3D Posture
                </span>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-emerald-600" />
                    <span>{language === 'ar' ? 'هيئة الموضع والحركة الشرعية' : 'Prophetic Posture Guidance'}</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono font-medium">
                    {stepperItem.positionNameEn}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {language === 'ar' ? stepperItem.postureDescriptionAr : stepperItem.postureDescriptionEn}
                </p>

                {language !== 'ar' && (
                  <p dir="rtl" className="text-xs font-arabic text-emerald-800 dark:text-emerald-400 font-medium">
                    {stepperItem.postureDescriptionAr}
                  </p>
                )}
              </div>
            </div>

            {/* Main Arabic Recitation Typography */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs text-center space-y-4">
              <p 
                dir="rtl"
                className="font-arabic text-2xl sm:text-3xl md:text-4xl leading-loose font-bold text-slate-900 dark:text-white select-all"
              >
                {stepperItem.arabicText}
              </p>

              {/* Transliteration */}
              {showTransliteration && (
                <p className="text-sm sm:text-base font-serif italic text-primary-800 dark:text-primary-300 select-all border-t border-slate-100 dark:border-slate-800/80 pt-3">
                  {stepperItem.transliteration}
                </p>
              )}

              {/* English Translation */}
              {showTranslation && (
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium select-all">
                  "{stepperItem.translationEn}"
                </p>
              )}

              {/* Amharic Translation */}
              {showAmharic && stepperItem.translationAm && (
                <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-2 select-all">
                  {stepperItem.translationAm}
                </p>
              )}
            </div>

            {/* Interactive Repetition Counter (If > 1 repeat) */}
            {stepperItem.repeatCount > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200/70 dark:border-emerald-800/70">
                <div className="text-left space-y-0.5">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    {language === 'ar' ? 'عدّاد التكرار المأثور' : 'Sunnah Repetition Counter'}
                  </span>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                    {stepperItem.repeatNoteEn || `Recite ${stepperItem.repeatCount} times with tranquility.`}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setStepperCounter(prev => prev >= stepperItem.repeatCount ? 0 : prev + 1)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    <span>{stepperCounter} / {stepperItem.repeatCount}</span>
                    <CheckCircle2 size={16} />
                  </button>

                  <button
                    onClick={() => setStepperCounter(0)}
                    className="p-2 text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 rounded-lg transition-colors cursor-pointer"
                    title="Reset Counter"
                  >
                    <RotateCcw size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Hadith Citation & Deep Insights */}
            <div className="space-y-2 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'المصدر الحديثي:' : 'Hadith Reference:'} {stepperItem.hadithReference}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono font-bold text-slate-700 dark:text-slate-300">
                  {stepperItem.authenticityGrade}
                </span>
              </div>

              <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                {language === 'ar' ? stepperItem.explanationAr : stepperItem.explanationEn}
              </p>
            </div>

          </div>

          {/* Stepper Navigation Buttons (Previous / Next) */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                currentStepIndex === 0
                  ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400'
                  : 'bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer'
              }`}
            >
              <ChevronLeft size={16} />
              <span>{language === 'ar' ? 'الحركة السابقة' : 'Previous Posture'}</span>
            </button>

            {/* Jump Selector */}
            <select
              value={currentStepIndex}
              onChange={(e) => {
                setCurrentStepIndex(parseInt(e.target.value));
                setStepperCounter(0);
              }}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
            >
              {SALAT_RECITATIONS.map((r, idx) => (
                <option key={r.id} value={idx}>
                  {idx + 1}. {r.positionNameEn} - {r.titleEn.slice(0, 30)}...
                </option>
              ))}
            </select>

            <button
              onClick={handleNextStep}
              disabled={currentStepIndex === SALAT_RECITATIONS.length - 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                currentStepIndex === SALAT_RECITATIONS.length - 1
                  ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400'
                  : 'bg-primary-600 hover:bg-primary-700 text-white shadow-md active:scale-95 cursor-pointer'
              }`}
            >
              <span>{language === 'ar' ? 'الحركة التالية' : 'Next Posture'}</span>
              <ChevronRight size={16} />
            </button>
          </div>

        </div>
      )}

      {/* 4. GUIDE & ESSENTIAL VIEW: Category Filters & Search Bar */}
      {viewMode !== 'stepper' && (
        <div className="space-y-4">
          
          {/* Search & Ruling Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'ar' ? 'ابحث عن دعاء، ركوع، سجود، استغفار...' : 'Search prayer recitations (e.g., Subhana, Rabbana, Tashahhud, Dajjal)...'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Ruling Filter (All / Pillar / Obligatory / Sunnah) */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs shrink-0 overflow-x-auto">
              <button
                onClick={() => setSelectedRuling('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedRuling === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {language === 'ar' ? 'كل الأحكام' : 'All Rulings'}
              </button>
              <button
                onClick={() => setSelectedRuling('pillar')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedRuling === 'pillar'
                    ? 'bg-red-500 text-white shadow-xs'
                    : 'text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40'
                }`}
              >
                {language === 'ar' ? 'أركان الصلاة' : 'Pillars (Arkan)'}
              </button>
              <button
                onClick={() => setSelectedRuling('obligatory')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedRuling === 'obligatory'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                }`}
              >
                {language === 'ar' ? 'الواجبات' : 'Obligations (Wajibat)'}
              </button>
              <button
                onClick={() => setSelectedRuling('sunnah')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedRuling === 'sunnah'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                }`}
              >
                {language === 'ar' ? 'السنن المأثورة' : 'Sunnahs'}
              </button>

              {/* Fiqh Explainer Button */}
              <button
                onClick={() => handleOpenRulingsModal(selectedRuling === 'pillar' ? 'arkan' : selectedRuling === 'obligatory' ? 'wajibat' : selectedRuling === 'sunnah' ? 'sunan' : 'all')}
                className="p-1.5 rounded-lg text-secondary-600 hover:text-secondary-700 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-950/50 transition-colors cursor-pointer flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-2 ml-0.5"
                title={language === 'ar' ? 'شرح أحكام الصلاة وفروقها' : 'What each ruling means in Fiqh'}
              >
                <Scale size={13} />
                <span className="text-[11px] font-bold">{language === 'ar' ? 'شرح الأحكام' : 'Fiqh Guide'}</span>
              </button>
            </div>
          </div>

          {/* Category Horizontal Filter Carousel */}
          <div className="flex items-center gap-1.5 p-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-secondary-200 dark:border-slate-800 shadow-2xs overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {language === 'ar' ? 'جميع الحركات (٣١)' : `All Postures (${SALAT_RECITATIONS.length})`}
            </button>

            {SALAT_POSITION_CATEGORIES.map(cat => {
              const count = SALAT_RECITATIONS.filter(r => r.positionCategory === cat.category).length;
              return (
                <button
                  key={cat.category}
                  onClick={() => setSelectedCategory(cat.category)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    selectedCategory === cat.category
                      ? 'bg-primary-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{language === 'ar' ? cat.nameAr.split('(')[0] : cat.nameEn.split('(')[0]}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedCategory === cat.category ? 'bg-primary-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Results Count Banner */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              {language === 'ar' 
                ? `عرض ${filteredRecitations.length} من أصل ${SALAT_RECITATIONS.length} ذكراً ودعاءً`
                : `Showing ${filteredRecitations.length} of ${SALAT_RECITATIONS.length} verified recitations`}
            </span>
            {(selectedCategory !== 'all' || selectedRuling !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedRuling('all');
                  setSearchQuery('');
                }}
                className="text-primary-600 hover:text-primary-700 font-bold underline cursor-pointer"
              >
                {language === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
              </button>
            )}
          </div>

          {/* 5. Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredRecitations.map((item) => {
              const currentCounter = itemCounters[item.id] || 0;
              const isSaved = savedIds.includes(`salat-${item.id}`);

              return (
                <div
                  key={item.id}
                  className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-secondary-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  {/* Top Metadata Header with 3D Posture Thumbnail */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-mono text-xs font-bold">
                          {item.positionNumber}
                        </span>
                        
                        <button
                          onClick={() => handleOpenRulingsModal(item.ruling === 'pillar' ? 'arkan' : item.ruling === 'obligatory' ? 'wajibat' : 'sunan')}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer hover:opacity-85 transition-opacity ${
                            item.ruling === 'pillar'
                              ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                              : item.ruling === 'obligatory'
                                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          }`}
                          title={language === 'ar' ? 'انقر لمعرفة شرح هذا الحكم الفقهي' : 'Click to learn what this Fiqh ruling means'}
                        >
                          <span>{language === 'ar' ? item.rulingLabelAr : item.rulingLabelEn}</span>
                          <Info size={10} className="opacity-70" />
                        </button>

                        {item.repeatCount > 1 && (
                          <span className="text-[10px] font-mono font-bold text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-950/60 border border-primary-200/60 dark:border-primary-800/60 px-2 py-0.5 rounded-full">
                            {item.repeatCount}x {language === 'ar' ? 'مرات' : 'Repeats'}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-serif font-bold text-slate-850 dark:text-slate-100 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                        {language === 'ar' ? item.titleAr : item.titleEn}
                      </h3>

                      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        {language === 'ar' ? item.positionNameAr : item.positionNameEn}
                      </p>
                    </div>

                    {/* 3D Posture Model Thumbnail */}
                    <div className="relative shrink-0 group/thumb">
                      <img 
                        src={getSalat3DImage(item.positionCategory)} 
                        alt={item.positionNameEn}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs group-hover/thumb:scale-105 transition-transform"
                        title={`3D View: ${item.positionNameEn}`}
                      />
                      <span className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-emerald-600 text-[8px] font-bold text-white rounded shadow-2xs">
                        3D
                      </span>
                    </div>
                  </div>

                  {/* Arabic Recitation Box */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/70 rounded-xl border border-slate-200/70 dark:border-slate-800 space-y-3">
                    <p 
                      dir="rtl"
                      className="font-arabic text-xl sm:text-2xl leading-relaxed text-right font-bold text-slate-900 dark:text-white select-all"
                    >
                      {item.arabicText}
                    </p>

                    {/* Transliteration */}
                    {showTransliteration && (
                      <p className="text-xs sm:text-sm font-serif italic text-primary-800 dark:text-primary-300 border-t border-slate-200/50 dark:border-slate-800/60 pt-2 select-all">
                        {item.transliteration}
                      </p>
                    )}

                    {/* Translation */}
                    {showTranslation && (
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium select-all">
                        "{item.translationEn}"
                      </p>
                    )}

                    {/* Amharic Translation */}
                    {showAmharic && item.translationAm && (
                      <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed border-t border-slate-200/50 dark:border-slate-800/60 pt-1.5 select-all">
                        {item.translationAm}
                      </p>
                    )}
                  </div>

                  {/* Optional Deep Explanation Box */}
                  {showExplanation && (
                    <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-800/40 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      <p>{language === 'ar' ? item.explanationAr : item.explanationEn}</p>
                    </div>
                  )}

                  {/* Card Bottom Controls Toolbar */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                    
                    {/* Hadith Citation Tag */}
                    <div className="text-[10px] text-slate-400 font-mono truncate max-w-[180px] xs:max-w-[220px]" title={item.hadithReference}>
                      {item.hadithReference}
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-1.5 ml-auto">
                      
                      {/* Repetition Tap Counter (if item has repeatCount > 1) */}
                      {item.repeatCount > 1 && (
                        <button
                          onClick={() => handleIncrementCounter(item.id, item.repeatCount)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentCounter >= item.repeatCount
                              ? 'bg-emerald-600 text-white'
                              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          }`}
                          title="Tap to count repetitions"
                        >
                          <CheckCircle2 size={12} />
                          <span>{currentCounter} / {item.repeatCount}</span>
                        </button>
                      )}

                      {/* Arabic TTS Reciter */}
                      <TTSButton text={item.arabicText} lang="ar" size="sm" />

                      {/* Copy Button */}
                      <button
                        onClick={() => handleCopyRecitation(item)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-white dark:bg-slate-900 transition-colors cursor-pointer"
                        title="Copy to Clipboard"
                      >
                        {copiedId === item.id ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                      </button>

                      {/* Bookmark / My Duas */}
                      <button
                        onClick={() => handleToggleFavorite(item)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isSaved
                            ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                            : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-white dark:bg-slate-900'
                        }`}
                        title="Save to My Duas"
                      >
                        {isSaved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

          {/* Empty state if search finds nothing */}
          {filteredRecitations.length === 0 && (
            <div className="p-12 text-center bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-secondary-200 dark:border-slate-800 space-y-3">
              <Search size={32} className="mx-auto text-slate-400 animate-pulse" />
              <h4 className="font-serif font-bold text-base text-slate-800 dark:text-slate-100">
                {language === 'ar' ? 'لم يتم العثور على أذكار مطابقة للبحث' : 'No prayer recitations match your query'}
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {language === 'ar'
                  ? 'جرب البحث بكلمة أخرى مثل: سبحان، ربنا، الفاتحة، التشهد، الدجال...'
                  : 'Try searching with general keywords like Subhana, Rabbana, Tashahhud, Forgiveness, or Dajjal.'}
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedRuling('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all"
              >
                {language === 'ar' ? 'إعادة ضبط كل الفلاتر' : 'Reset All Filters'}
              </button>
            </div>
          )}

        </div>
      )}

      {/* 6. Comprehensive Print & Export Document Center */}
      <div className="bg-gradient-to-r from-primary-950 via-slate-900 to-secondary-950 rounded-2xl border border-primary-800/40 p-6 sm:p-7 text-white shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-primary-500/20 rounded-lg text-primary-300 border border-primary-500/30">
                <FileText size={16} />
              </span>
              <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                {language === 'ar'
                  ? 'طباعة وتحميل دليل أذكار الصلاة (PDF و Word)'
                  : 'Print & Export Complete Salat Recitation Guide (PDF & Word)'}
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'ar'
                ? 'احصل على نسخة ورقية أو رقمية كاملة من أذكار الصلاة مزودة بالصور ثلاثية الأبعاد (3D) لكل موضع وحركة، مع النص العربي المشكول، والنطق اللاتيني، والترجمتين الإنجليزية والأمهرية، وتخريج الأحاديث للطباعة وحلقات العلم والمراجعة.'
                : 'Download or print a comprehensive guidebook equipped with 3D posture models for each position of Salat, complete with diacritic Arabic, transliteration, English & Amharic translations, and authentic Hadith citations.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleQuickPrintPDF}
              disabled={isPrintingPDF}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isPrintingPDF ? <Loader2 size={15} className="animate-spin" /> : <Printer size={15} />}
              <span>{language === 'ar' ? 'طباعة / حفظ كـ PDF' : 'Print / Save PDF'}</span>
            </button>

            <button
              onClick={handleQuickDownloadDocx}
              disabled={isDownloadingDocx}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isDownloadingDocx ? <Loader2 size={15} className="animate-spin" /> : <FileText size={15} />}
              <span>{language === 'ar' ? 'تحميل مستند Word (.docx)' : 'Download Word (.docx)'}</span>
            </button>

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 text-xs font-semibold transition-all cursor-pointer"
            >
              <Settings2 size={14} />
              <span className="hidden sm:inline">{language === 'ar' ? 'خيارات مخصصة' : 'Customize'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7. Quick Educational Summary / Virtues Footer */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-secondary-200 dark:border-slate-800 p-6 space-y-4 text-xs shadow-sm">
        <div className="flex items-center gap-2 text-primary-700 dark:text-primary-300 font-bold text-sm">
          <BookOpen size={16} />
          <span>{language === 'ar' ? 'القواعد الذهبية للخشوع في أذكار الصلاة' : 'Golden Rules for Khushū‘ in Salat Recitations'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-slate-600 dark:text-slate-400">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              {language === 'ar' ? '١. الطمأنينة ركن أساسي' : '1. Tranquility (Tum\'anīnah)'}
            </span>
            <p className="leading-relaxed">
              {language === 'ar' 
                ? 'الهدوء في كل حركة حتى يرجع كل عظم ومفصل إلى موضعه، والتريث في التلاوة.' 
                : 'Pause in each posture until every bone and joint settles calmly into place without rushing.'}
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              {language === 'ar' ? '٢. تدبر معاني التسبيح' : '2. Contemplating the Meanings'}
            </span>
            <p className="leading-relaxed">
              {language === 'ar'
                ? 'استشعار عظمة الرب في الركوع، وعلوه المطلق في السجود، وفقر العبد في كل موضع.'
                : 'Reflect upon the Almighty in Ruku\', the Most High in Sujud, and our utter dependence before Him.'}
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              {language === 'ar' ? '٣. التنويع بين الأدعية المأثورة' : '3. Alternating Prophetic Duas'}
            </span>
            <p className="leading-relaxed">
              {language === 'ar'
                ? 'التنويع بين أدعية الاستفتاح والركوع والسجود يجدد الخشوع ويطرد السهو والاعتياد.'
                : 'Varying between authenticated prophetic opening and bowing supplications revitalizes presence of heart.'}
            </p>
          </div>
        </div>
      </div>

      {/* 8. Export Configuration Modal */}
      <SalatExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* 9. Islamic Jurisprudence Rulings Explainer Modal */}
      <SalatRulingsModal
        isOpen={isRulingsModalOpen}
        onClose={() => setIsRulingsModalOpen(false)}
        initialTab={rulingsModalTab}
      />

    </div>
  );
};

export default SalatRecitationsSection;
