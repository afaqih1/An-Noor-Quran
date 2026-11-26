import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  BookOpen,
  Volume2,
  VolumeX,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Info,
  BookMarked,
  Feather,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Grid,
  List,
  Eye,
  RotateCcw,
  Bookmark,
  BookmarkCheck,
  Maximize2,
  Minimize2,
  Tag,
  Activity,
  Library,
  Sliders,
  Brain,
  Folder,
  ExternalLink,
  FileText
} from 'lucide-react';
import { QURAN_STUDY_MODULES, QuranModule, QuranSegment, VerseKeyword } from './quranStudyModulesData';
import { useLanguage } from './LanguageContext';
import {
  fetchGeminiTafsirInsight,
  GeminiTafsirResult,
  fetchAyahVocabularyBreakdown,
  AyahWordDetail
} from './geminiTafsirService';
import { allSurahs, SurahInfo } from './surahListData';
import { VocabularySubsystemSection } from './VocabularySubsystemSection';
import {
  getIbnKathirExegesis,
  TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL,
  TAFSIR_IBN_KATHIR_LOCAL_PDF_URL,
  TAFSIR_IBN_KATHIR_FATIHA_LOCAL_PDF_URL,
  TafsirIbnKathirDetail,
  getSurahIbnKathirOverview,
  getSurahTafsirDriveUrl,
  getSurahTafsirPdfFilename,
  SurahIbnKathirOverview
} from './tafsirIbnKathirData';
import { useTTS } from './TTSContext';
import { TTSButton } from './TTSButton';

interface QuranStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialModuleId?: string;
}

interface SavedBookmark {
  id: string;
  moduleId: string;
  segmentId: string;
  surahNumber: number;
  verseNumber: number;
  arabicText: string;
  translation: string;
  savedAt: number;
}

export const QuranStudyModal: React.FC<QuranStudyModalProps> = ({
  isOpen,
  onClose,
  initialModuleId = 'mod-fatiha'
}) => {
  const { language } = useLanguage();
  const { speak, stop, isSpeaking, activeText } = useTTS();

  // State Management
  const [activeModuleId, setActiveModuleId] = useState<string>(initialModuleId);
  const [activeTab, setActiveTab] = useState<'overview' | 'tafsir' | 'segments' | 'objectives' | 'glossary' | 'bookmarks'>('overview');
  const [studyLayoutMode, setStudyLayoutMode] = useState<'detailed' | 'summary'>('detailed');
  
  // Selection states
  const [selectedSegment, setSelectedSegment] = useState<QuranSegment | null>(null);
  const [selectedTafsirSegment, setSelectedTafsirSegment] = useState<QuranSegment | null>(null);
  const [tafsirAyahSearchQuery, setTafsirAyahSearchQuery] = useState('');
  const [selectedKeyword, setSelectedKeyword] = useState<VerseKeyword | null>(null);
  const [highlightSegmentId, setHighlightSegmentId] = useState<string | null>(null);

  // Search & Navigation Filters
  const [moduleSearchQuery, setModuleSearchQuery] = useState('');
  const [ayahSearchQuery, setAyahSearchQuery] = useState('');
  const [mobileSegmentsView, setMobileSegmentsView] = useState<'list' | 'display'>('display');
  const [glossarySearchQuery, setGlossarySearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // 114 Surahs Selection States
  const [sidebarTab, setSidebarTab] = useState<'all114' | 'curated'>('all114');
  const [selected114SurahNum, setSelected114SurahNum] = useState<number>(1);
  const [selected114VerseNum, setSelected114VerseNum] = useState<number>(1);
  const [isFetching114, setIsFetching114] = useState<boolean>(false);
  const [dynamic114Module, setDynamic114Module] = useState<QuranModule | null>(null);
  const [dynamicVocabulary, setDynamicVocabulary] = useState<AyahWordDetail[]>([]);
  const [isLoadingVocabulary, setIsLoadingVocabulary] = useState<boolean>(false);
  const [selectedDynamicWord, setSelectedDynamicWord] = useState<AyahWordDetail | null>(null);

  // Helper function to load any Surah & Ayah from 114 Surahs
  const handleSelect114SurahAndVerse = async (surahNum: number, verseNum: number = 1) => {
    setSelected114SurahNum(surahNum);
    setSelected114VerseNum(verseNum);
    setIsFetching114(true);
    setSelectedDynamicWord(null);

    const surahMeta = allSurahs.find((s) => s.number === surahNum) || allSurahs[0];

    try {
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/editions/quran-uthmani,en.sahih`);
      const data = await res.json();
      if (data.code === 200 && data.data && data.data.length >= 2) {
        const arabicAyahs = data.data[0].ayahs || [];
        const englishAyahs = data.data[1].ayahs || [];

        const BISMILLAH_PREFIX_REGEX = /^بِسْمِ\s+ٱللَّهِ\s+ٱلرَّحْمَٰنِ\s+ٱلرَّحِيمِ\s*/;
        const segments: QuranSegment[] = arabicAyahs.map((a: any, idx: number) => {
          const engText = englishAyahs[idx]?.text || '';
          // Strip fused Bismillah from Ayah 1 of Surahs 2-114 so Bismillah is strictly on its own line/block
          const cleanText =
            surahNum !== 1 && a.numberInSurah === 1
              ? a.text.replace(BISMILLAH_PREFIX_REGEX, '').trim()
              : a.text;

          const ibnKathir = getIbnKathirExegesis(
            surahNum,
            a.numberInSurah,
            surahMeta.englishName,
            cleanText,
            engText
          );

          return {
            id: `surah114-seg-${surahNum}-${a.numberInSurah}`,
            surahNumber: surahNum,
            verseNumber: a.numberInSurah,
            label: `Ayah ${a.numberInSurah}`,
            labelAr: `الآية ${a.numberInSurah}`,
            arabicText: cleanText,
            transliteration: `Surah ${surahMeta.englishName} • Verse ${a.numberInSurah}`,
            translation: {
              en: engText,
              ar: cleanText,
              am: engText
            },
            explanation: {
              en: ibnKathir.summaryEn,
              ar: ibnKathir.summaryAr,
              am: ibnKathir.summaryAm
            },
            tafsirIbnKathir: ibnKathir,
            audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${a.number}.mp3`,
            keywords: []
          };
        });

        const newModule: QuranModule = {
          id: `surah-114-${surahNum}`,
          orderIndex: 99,
          surahNumber: surahNum,
          title: `Surah ${surahMeta.englishName}`,
          titleAr: surahMeta.name,
          titleAm: `ሱረቱ ${surahMeta.englishName}`,
          subtitle: `${surahMeta.englishNameTranslation} • ${surahMeta.numberOfAyahs} Ayahs`,
          subtitleAr: `${surahMeta.englishNameTranslation} • ${surahMeta.numberOfAyahs} آية`,
          subtitleAm: `${surahMeta.englishNameTranslation} • ${surahMeta.numberOfAyahs} አንቀጾች`,
          revelationType: surahMeta.revelationType === "Meccan" ? "Meccan" : "Medinan",
          totalVerses: surahMeta.numberOfAyahs,
          description: `Comprehensive study module for Surah ${surahMeta.englishName} (${surahMeta.name}). Explore verse breakdown, word-by-word vocabulary, root words, audio, and AI Tafsir.`,
          descriptionAr: `وحدة دراسية وتفسيرية شاملة لـ ${surahMeta.name}. تفكيك المفردات وجذور الكلمات مع الاستماع والتفسير.`,
          descriptionAm: `ለሱረቱ ${surahMeta.englishName} የተዘጋጀ አጠቃላይ የጥናት ሞጁል።`,
          themeColor: "emerald",
          thematicPillars: [
            {
              id: "p1",
              titleEn: "Core Themes & Divine Guidance",
              titleAr: "المحاور الرئيسية والهدايات القرآنية",
              titleAm: "ዋና ዋና መልእክቶች",
              descriptionEn: `Primary divine objectives and messages conveyed in Surah ${surahMeta.englishName}.`,
              descriptionAr: `المقاصد الشرعية والحكم الواردة في ${surahMeta.name}.`,
              descriptionAm: `በሱረቱ ${surahMeta.englishName} ውስጥ የተካተቱ ትምህርቶች።`
            },
            {
              id: "p2",
              titleEn: "Linguistic Structure & Vocabulary",
              titleAr: "البناء اللغوي والمعجم القرآني",
              titleAm: "የቋንቋ አወቃቀር እና ቃላት",
              descriptionEn: "Rhetorical precision, root words, and semantic harmony.",
              descriptionAr: "الفصاحة البلاغية ودقة اختيار المفردات والجذور.",
              descriptionAm: "የቃላት አመራረጥ እና ውበት。"
            }
          ],
          studyObjectives: [
            {
              en: `Recite and internalize verses of Surah ${surahMeta.englishName}`,
              ar: `تلاوة وتدبر آيات ${surahMeta.name}`,
              am: `የሱረቱ ${surahMeta.englishName} አንቀጾችን ማንበብ እና ማስተንተን`
            }
          ],
          curatedAiAnalysis: {
            overviewEn: `Surah ${surahMeta.englishName} provides timeless spiritual guidance and divine principles.`,
            overviewAr: `تقدم سورة ${surahMeta.name} هدايات قرآنية خالدة ومبادئ إيمانية عظيمة.`,
            overviewAm: `ሱረቱ ${surahMeta.englishName} ዘለቄታዊ መንፈሳዊ መመሪያ ይሰጣል።`,
            linguisticEloquenceEn: `Surah ${surahMeta.englishName} contains profound Quranic eloquence, word arrangement, and rhythmic harmony.`,
            linguisticEloquenceAr: `تتميز ${surahMeta.name} بالفصاحة العالية والتناسق اللغوي الفريد.`,
            linguisticEloquenceAm: `ሱረቱ ${surahMeta.englishName} ጥልቅ የቋንቋ ውበት አለው።`,
            practicalApplicationEn: `Incorporate the lessons of Surah ${surahMeta.englishName} into your daily prayers and reflection.`,
            practicalApplicationAr: `تطبيق هدايات ${surahMeta.name} في الصلوات والأذكار والتدبر اليومي.`,
            practicalApplicationAm: `በዕለት ተዕለት ህይወት ውስጥ መተግበር።`
          },
          segments: segments
        };

        setDynamic114Module(newModule);
        setActiveModuleId(newModule.id);

        const targetSeg = segments.find((s) => s.verseNumber === verseNum) || segments[0];
        setSelectedSegment(targetSeg);
        setActiveTab('segments');

        if (targetSeg) {
          fetchVocabForVerse(targetSeg, surahMeta.englishName);
        }
      }
    } catch (err) {
      console.error('Failed to fetch 114 Surah:', err);
    } finally {
      setIsFetching114(false);
    }
  };

  const fetchVocabForVerse = async (seg: QuranSegment, surahEngName: string) => {
    setIsLoadingVocabulary(true);
    setDynamicVocabulary([]);
    try {
      const vocab = await fetchAyahVocabularyBreakdown(
        surahEngName,
        seg.verseNumber,
        seg.arabicText,
        getLocalizedText(seg.translation)
      );
      setDynamicVocabulary(vocab);
    } catch (e) {
      console.error('Failed to load vocabulary:', e);
    } finally {
      setIsLoadingVocabulary(false);
    }
  };

  // Distraction-Free Reading Mode
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [readingFontSize, setReadingFontSize] = useState<number>(28);

  // Audio & Recitation Engine
  const [playingAudioUrl, setPlayingAudioUrl] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [repeatCount, setRepeatCount] = useState<number | 'loop'>(1);
  const [currentRepeatCycle, setCurrentRepeatCycle] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // AI Gemini Insights
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [geminiResult, setGeminiResult] = useState<GeminiTafsirResult | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);

  // Bookmarks Local Storage
  const [bookmarks, setBookmarks] = useState<SavedBookmark[]>(() => {
    try {
      const saved = localStorage.getItem('quran_study_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync initial module
  useEffect(() => {
    if (initialModuleId) {
      setActiveModuleId(initialModuleId);
    }
  }, [initialModuleId]);

  // Persist bookmarks
  useEffect(() => {
    try {
      localStorage.setItem('quran_study_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to save bookmarks:', e);
    }
  }, [bookmarks]);

  // Audio Canvas Waveform Animation
  useEffect(() => {
    if (!playingAudioUrl || !canvasRef.current) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let step = 0;
    const render = () => {
      step += 0.08;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 24;
      const barWidth = canvas.width / bars - 2;

      for (let i = 0; i < bars; i++) {
        const height = Math.abs(Math.sin(step + i * 0.4)) * (canvas.height * 0.8) + 4;
        const x = i * (barWidth + 2);
        const y = (canvas.height - height) / 2;

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(1, '#0d9488');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, height);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [playingAudioUrl]);

  if (!isOpen) return null;

  const currentModule =
    activeModuleId.startsWith('surah-114-') && dynamic114Module
      ? dynamic114Module
      : QURAN_STUDY_MODULES.find((m) => m.id === activeModuleId) || QURAN_STUDY_MODULES[0];

  // Filtered modules for sidebar search
  const filteredModules = QURAN_STUDY_MODULES.filter((m) => {
    const q = moduleSearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      m.title.toLowerCase().includes(q) ||
      m.titleAr.includes(q) ||
      m.titleAm.includes(q) ||
      m.surahNumber.toString().includes(q)
    );
  });

  // Audio Player Control Handler
  const handlePlayAudio = (url: string) => {
    if (audioElement && playingAudioUrl === url) {
      audioElement.pause();
      setPlayingAudioUrl(null);
      return;
    }

    if (audioElement) {
      audioElement.pause();
    }

    const audio = new Audio(url);
    audio.playbackRate = playbackSpeed;
    setCurrentRepeatCycle(1);

    audio.onended = () => {
      if (repeatCount === 'loop') {
        audio.currentTime = 0;
        audio.play();
      } else if (typeof repeatCount === 'number' && currentRepeatCycle < repeatCount) {
        setCurrentRepeatCycle((prev) => prev + 1);
        audio.currentTime = 0;
        audio.play();
      } else {
        setPlayingAudioUrl(null);
      }
    };

    audio.onerror = () => setPlayingAudioUrl(null);
    audio.play();
    setAudioElement(audio);
    setPlayingAudioUrl(url);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioElement) {
      audioElement.playbackRate = speed;
    }
  };

  // Bookmark Toggle
  const isSegmentBookmarked = (segmentId: string) => {
    return bookmarks.some((b) => b.segmentId === segmentId);
  };

  const toggleBookmark = (segment: QuranSegment) => {
    if (isSegmentBookmarked(segment.id)) {
      setBookmarks((prev) => prev.filter((b) => b.segmentId !== segment.id));
    } else {
      const newBm: SavedBookmark = {
        id: `bm-${Date.now()}`,
        moduleId: currentModule.id,
        segmentId: segment.id,
        surahNumber: segment.surahNumber,
        verseNumber: segment.verseNumber,
        arabicText: segment.arabicText,
        translation: getLocalizedText(segment.translation),
        savedAt: Date.now()
      };
      setBookmarks((prev) => [newBm, ...prev]);
    }
  };

  // Jump to Bookmark
  const handleJumpToBookmark = (bm: SavedBookmark) => {
    setActiveModuleId(bm.moduleId);
    setActiveTab('segments');
    const mod = QURAN_STUDY_MODULES.find((m) => m.id === bm.moduleId);
    if (mod) {
      const seg = mod.segments.find((s) => s.id === bm.segmentId);
      if (seg) {
        setSelectedSegment(seg);
        setHighlightSegmentId(seg.id);
        setTimeout(() => setHighlightSegmentId(null), 3000);
      }
    }
  };

  // AI Gemini Insight trigger
  const handleTriggerGeminiInsight = async (segment?: QuranSegment) => {
    const targetSeg = segment || selectedSegment || currentModule.segments[0];
    if (!targetSeg) return;

    setShowAiModal(true);
    setIsGeminiLoading(true);
    setGeminiResult(null);

    const insight = await fetchGeminiTafsirInsight(
      getModuleTitle(currentModule),
      targetSeg.verseNumber,
      targetSeg.arabicText,
      getLocalizedText(targetSeg.translation),
      language
    );

    setGeminiResult(insight);
    setIsGeminiLoading(false);
  };

  // Text Helper Localization
  const getModuleTitle = (mod: QuranModule) => {
    if (language === 'ar') return mod.titleAr;
    if (language === 'am') return mod.titleAm;
    return mod.title;
  };

  const getModuleSubtitle = (mod: QuranModule) => {
    if (language === 'ar') return mod.subtitleAr;
    if (language === 'am') return mod.subtitleAm;
    return mod.subtitle;
  };

  const getModuleDescription = (mod: QuranModule) => {
    if (language === 'ar') return mod.descriptionAr;
    if (language === 'am') return mod.descriptionAm;
    return mod.description;
  };

  const getLocalizedText = (obj: { en: string; ar: string; am: string }) => {
    if (language === 'ar') return obj.ar;
    if (language === 'am') return obj.am;
    return obj.en;
  };

  const getThemeBadgeColor = (color: QuranModule['themeColor']) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800';
      case 'amber':
        return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800';
      case 'blue':
        return 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800';
      case 'purple':
        return 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800';
      case 'rose':
        return 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800';
      case 'teal':
      default:
        return 'bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-800';
    }
  };

  // Aggregate all keywords across all modules for central glossary
  const allGlossaryKeywords: { keyword: VerseKeyword; surah: string; verseNum: number }[] = [];
  QURAN_STUDY_MODULES.forEach((mod) => {
    mod.segments.forEach((seg) => {
      seg.keywords.forEach((kw) => {
        allGlossaryKeywords.push({
          keyword: kw,
          surah: getModuleTitle(mod),
          verseNum: seg.verseNumber
        });
      });
    });
  });

  const filteredAyahs = currentModule.segments.filter((seg) => {
    if (!ayahSearchQuery.trim()) return true;
    const q = ayahSearchQuery.toLowerCase().trim();
    const vNum = seg.verseNumber.toString();
    return (
      vNum === q ||
      seg.arabicText.includes(q) ||
      (seg.transliteration && seg.transliteration.toLowerCase().includes(q)) ||
      (seg.translation?.en && seg.translation.en.toLowerCase().includes(q)) ||
      (seg.translation?.ar && seg.translation.ar.includes(q))
    );
  });

  const filteredGlossary = allGlossaryKeywords.filter(({ keyword }) => {
    const q = glossarySearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      keyword.arabic.includes(q) ||
      keyword.word.toLowerCase().includes(q) ||
      keyword.root.includes(q) ||
      getLocalizedText(keyword.meaning).toLowerCase().includes(q)
    );
  });

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 transition-all"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[94vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 transition-all">
        {/* Scoped Quranic Typography & Anti-Overlap Spacing */}
        <style>{`
          .font-quran,
          .quran-uthmani-text {
            font-family: 'Amiri Quran', 'Amiri', 'Scheherazade New', 'Noto Naskh Arabic', 'Traditional Arabic', serif !important;
            font-feature-settings: "cv01" on, "cv02" on, "cv03" on, "ss01" on, "anum" on;
            font-variant-numeric: tabular-nums;
            line-height: 3.2 !important;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            letter-spacing: 0.02em;
            word-spacing: 0.12em;
          }
          .quran-line-spaced {
            line-height: 3.2 !important;
          }
        `}</style>
        
        {/* Distraction-Free Reading Overlay Mode */}
        {isReadingMode ? (
          <div className="flex-1 flex flex-col bg-amber-50/30 dark:bg-slate-950 overflow-hidden">
            {/* Reading Mode Floating Top Control Bar */}
            <div className="px-6 py-3 border-b border-amber-200/50 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-20 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  📖
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                    {getModuleTitle(currentModule)}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {language === 'ar' ? 'وضع التلاوة والتدبر بدون تشتيت' : 'Distraction-Free Reading Mode'}
                  </span>
                </div>
              </div>

              {/* Font Size & Exit Controls */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl text-xs">
                  <span className="font-bold text-slate-500">A-</span>
                  <input
                    type="range"
                    min={20}
                    max={42}
                    value={readingFontSize}
                    onChange={(e) => setReadingFontSize(Number(e.target.value))}
                    className="w-20 accent-emerald-600 cursor-pointer"
                  />
                  <span className="font-bold text-slate-500">A+</span>
                </div>

                <button
                  onClick={() => setIsReadingMode(false)}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  {language === 'ar' ? 'إنهاء وضع القراءة' : 'Exit Reading Mode'}
                </button>
              </div>
            </div>

            {/* Reading Mode Verse Stream */}
            <div className="flex-1 overflow-y-auto px-6 py-8 max-w-4xl mx-auto w-full space-y-8">
              {currentModule.surahNumber !== 9 && (
                <div className="text-center py-5 border-b border-amber-200/40 dark:border-slate-800">
                  <div
                    dir="rtl"
                    className="font-quran quran-line-spaced text-3xl sm:text-4xl text-emerald-700 dark:text-emerald-400 mb-2 !leading-[3.2] select-all tracking-wide"
                    style={{ lineHeight: '3.2', wordSpacing: '0.12em' }}
                  >
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {getModuleSubtitle(currentModule)}
                  </p>
                </div>
              )}

              {currentModule.segments.map((seg) => {
                const cleanSegText =
                  currentModule.surahNumber !== 1 && seg.verseNumber === 1
                    ? seg.arabicText.replace(/^بِسْمِ\s+ٱللَّهِ\s+ٱلرَّحْمَٰنِ\s+ٱلرَّحِيمِ\s*/, '').trim() || seg.arabicText
                    : seg.arabicText;

                return (
                  <div
                    key={seg.id}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
                        Ayah {seg.verseNumber}
                      </span>
                      <button
                        onClick={() => handlePlayAudio(seg.audioUrl)}
                        className="p-2 rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                      >
                        {playingAudioUrl === seg.audioUrl ? (
                          <VolumeX className="w-4 h-4 animate-pulse" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div
                      dir="rtl"
                      style={{ fontSize: `${readingFontSize}px`, lineHeight: '3.2', wordSpacing: '0.12em' }}
                      className="font-quran quran-line-spaced text-slate-800 dark:text-slate-100 !leading-[3.2] text-right py-4 select-text"
                    >
                      {cleanSegText}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
                      <p className="text-xs italic text-slate-400">{seg.transliteration}</p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        {getLocalizedText(seg.translation)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Standard Full Interactive Portal Layout */
          <>
            {/* Top Navigation Bar Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                  title="Toggle Modules Sidebar"
                >
                  {isSidebarCollapsed ? (
                    <PanelLeftOpen className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <PanelLeftClose className="w-5 h-5" />
                  )}
                </button>

                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
                  <BookOpen className="w-5 h-5" />
                </div>

                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    {language === 'ar'
                      ? 'وحدات دراسة القرآن وعلومه'
                      : language === 'am'
                      ? 'የቁርአን ጥናት እና ማብراሪያ ሞጁል'
                      : 'Quranic Study & Tafsir Modules'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                    {language === 'ar'
                      ? 'منظومة تفاعلية للتحليل اللغوي والموضوعي واستخراج الجذور والتجويد'
                      : 'Interactive linguistic, thematic & vocabulary learning engine'}
                  </p>
                </div>
              </div>

              {/* Action Tools Header Bar */}
              <div className="flex items-center gap-2">
                {/* Reading Mode Toggle */}
                <button
                  onClick={() => setIsReadingMode(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 font-semibold text-xs border border-amber-300/40 dark:border-amber-700/40 transition-colors"
                >
                  <Eye className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>{language === 'ar' ? 'وضع القراءة' : 'Reading Mode'}</span>
                </button>

                {/* Gemini AI Insight Trigger */}
                <button
                  onClick={() => handleTriggerGeminiInsight()}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                  <span>{language === 'ar' ? 'إشراق الذكاء الاصطناعي' : 'Gemini AI Insight'}</span>
                </button>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Interactive Workspace Layout */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              
              {/* Left Sidebar: Surah Modules & 114 Surahs Index */}
              {!isSidebarCollapsed && (
                <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-3 flex flex-col overflow-hidden flex-shrink-0">
                  
                  {/* Sidebar View Mode Toggle */}
                  <div className="flex items-center p-1 bg-slate-200/70 dark:bg-slate-800 rounded-xl mb-3">
                    <button
                      onClick={() => setSidebarTab('all114')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all text-center ${
                        sidebarTab === 'all114'
                          ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
                      }`}
                    >
                      {language === 'ar' ? 'الـ 114 سورة (الكل)' : 'All 114 Surahs'}
                    </button>
                    <button
                      onClick={() => setSidebarTab('curated')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all text-center ${
                        sidebarTab === 'curated'
                          ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
                      }`}
                    >
                      {language === 'ar' ? 'المناهج المركزة' : 'Curated Modules'}
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative mb-3">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder={
                        sidebarTab === 'all114'
                          ? language === 'ar' ? 'ابحث برقم أو اسم السورة (1-114)...' : 'Search Surah (1-114)...'
                          : language === 'ar' ? 'بحث عن منهج...' : 'Search module...'
                      }
                      value={moduleSearchQuery}
                      onChange={(e) => setModuleSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* 114 Surahs Index List */}
                  {sidebarTab === 'all114' ? (
                    <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                      {allSurahs
                        .filter((s) => {
                          const q = moduleSearchQuery.toLowerCase().trim();
                          if (!q) return true;
                          return (
                            s.number.toString() === q ||
                            s.englishName.toLowerCase().includes(q) ||
                            s.englishNameTranslation.toLowerCase().includes(q) ||
                            s.name.includes(q)
                          );
                        })
                        .map((surah) => {
                          const isSelected = activeModuleId === `surah-114-${surah.number}`;
                          return (
                            <button
                              key={surah.number}
                              onClick={() => handleSelect114SurahAndVerse(surah.number, 1)}
                              className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between group ${
                                isSelected
                                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-semibold'
                                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <span
                                  className={`w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center flex-shrink-0 ${
                                    isSelected
                                      ? 'bg-white/20 text-white'
                                      : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                                  }`}
                                >
                                  {surah.number}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs font-bold leading-tight truncate flex items-center justify-between">
                                    <span className="truncate">{surah.englishName}</span>
                                    <span dir="rtl" className="font-quran text-sm font-normal mr-1">
                                      {surah.name}
                                    </span>
                                  </div>
                                  <div
                                    className={`text-[10px] truncate ${
                                      isSelected ? 'text-emerald-100' : 'text-slate-400'
                                    }`}
                                  >
                                    {surah.englishNameTranslation} • {surah.numberOfAyahs} Ayahs
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  ) : (
                    /* Curated Modules List */
                    <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                      {filteredModules.map((module) => {
                        const isSelected = module.id === activeModuleId;
                        return (
                          <button
                            key={module.id}
                            onClick={() => {
                              setActiveModuleId(module.id);
                              setSelectedSegment(null);
                              setSelectedKeyword(null);
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group ${
                              isSelected
                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-semibold'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold leading-tight truncate">
                                {getModuleTitle(module)}
                              </div>
                              <div
                                className={`text-[11px] truncate mt-0.5 ${
                                  isSelected ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'
                                }`}
                              >
                                Surah #{module.surahNumber} • {module.totalVerses}{' '}
                                {language === 'ar' ? 'آيات' : 'Ayahs'}
                              </div>
                            </div>
                            <ChevronRight
                              className={`w-4 h-4 flex-shrink-0 ml-1 transition-transform ${
                                isSelected ? 'text-white' : 'text-slate-400 group-hover:translate-x-0.5'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Right Content Dashboard */}
              <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900">
                
                {/* 114 Surahs & Ayah Fast Jump Bar */}
                <div className="px-4 sm:px-6 py-2.5 bg-emerald-50/80 dark:bg-slate-800/80 border-b border-emerald-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5" />
                      {language === 'ar' ? 'مستكشف الـ 114 سورة والآيات:' : '114 Surahs & Ayah Selector:'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Surah Dropdown */}
                    <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                      <span className="text-slate-400 font-medium">{language === 'ar' ? 'السورة:' : 'Surah:'}</span>
                      <select
                        value={currentModule.surahNumber}
                        onChange={(e) => handleSelect114SurahAndVerse(Number(e.target.value), 1)}
                        className="bg-transparent font-bold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer max-w-[160px] sm:max-w-[200px]"
                      >
                        {allSurahs.map((s) => (
                          <option key={s.number} value={s.number} className="text-slate-900 bg-white dark:bg-slate-900 dark:text-white">
                            #{s.number} {s.englishName} - {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Ayah Dropdown */}
                    <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                      <span className="text-slate-400 font-medium">{language === 'ar' ? 'الآية:' : 'Ayah:'}</span>
                      <select
                        value={selectedSegment?.verseNumber || 1}
                        onChange={(e) => {
                          const verseNum = Number(e.target.value);
                          if (currentModule.id.startsWith('surah-114-')) {
                            handleSelect114SurahAndVerse(currentModule.surahNumber, verseNum);
                          } else {
                            const found = currentModule.segments.find((s) => s.verseNumber === verseNum);
                            if (found) {
                              setSelectedSegment(found);
                              fetchVocabForVerse(found, currentModule.title);
                            }
                          }
                        }}
                        className="bg-transparent font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none cursor-pointer"
                      >
                        {Array.from({ length: currentModule.totalVerses }, (_, i) => i + 1).map((vNum) => (
                          <option key={vNum} value={vNum} className="text-slate-900 bg-white dark:bg-slate-900 dark:text-white">
                            Ayah {vNum}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status Spinner */}
                    {isFetching114 && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold animate-pulse">
                        <Activity className="w-3.5 h-3.5 animate-spin" />
                        {language === 'ar' ? 'جاري التحميل...' : 'Loading Surah...'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Selected Module Banner Meta */}
                
                {/* Selected Module Banner Meta */}
                <div className="px-4 sm:px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-900 flex flex-col gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${getThemeBadgeColor(
                          currentModule.themeColor
                        )}`}
                      >
                        Surah #{currentModule.surahNumber} • {currentModule.revelationType}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {currentModule.totalVerses} {language === 'ar' ? 'آيات' : 'Verses'}
                      </span>
                    </div>

                    {/* Layout Mode Switcher (Detailed vs Summary) */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                      <button
                        onClick={() => setStudyLayoutMode('detailed')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                          studyLayoutMode === 'detailed'
                            ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                      >
                        <List className="w-3.5 h-3.5" />
                        {language === 'ar' ? 'تفصيلي' : 'Detailed'}
                      </button>
                      <button
                        onClick={() => setStudyLayoutMode('summary')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                          studyLayoutMode === 'summary'
                            ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                      >
                        <Grid className="w-3.5 h-3.5" />
                        {language === 'ar' ? 'جدولي' : 'Summary Table'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                      {getModuleTitle(currentModule)}
                    </h3>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      {getModuleSubtitle(currentModule)}
                    </p>
                  </div>

                  {/* Top Navigation Tabs */}
                  <div className="flex items-center gap-1 mt-2 border-b border-slate-200 dark:border-slate-800 -mb-3.5 overflow-x-auto">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                        activeTab === 'overview'
                          ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                          : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {language === 'ar' ? 'المحاور والتحليل' : 'Thematic Pillars'}
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('tafsir');
                        if (currentModule.segments.length > 0 && !selectedTafsirSegment) {
                          setSelectedTafsirSegment(currentModule.segments[0]);
                        }
                      }}
                      className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                        activeTab === 'tafsir'
                          ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                          : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      {language === 'ar' ? 'تفسير ابن كثير (Drive)' : 'Tafsir Ibn Kathir (Drive)'}
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('segments');
                        if (currentModule.segments.length > 0 && !selectedSegment) {
                          setSelectedSegment(currentModule.segments[0]);
                        }
                      }}
                      className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                        activeTab === 'segments'
                          ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                          : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      <BookMarked className="w-3.5 h-3.5" />
                      {language === 'ar' ? 'الآيات والمفردات' : 'Verses & Vocabulary'}
                    </button>

                    <button
                      onClick={() => setActiveTab('objectives')}
                      className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        activeTab === 'objectives'
                          ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                          : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {language === 'ar' ? 'أهداف الدراسة' : 'Objectives'}
                    </button>

                    <button
                      onClick={() => setActiveTab('glossary')}
                      className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        activeTab === 'glossary'
                          ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                          : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      <Library className="w-3.5 h-3.5" />
                      {language === 'ar' ? 'معجم الجذور العامة' : 'Central Glossary'}
                    </button>

                    <button
                      onClick={() => setActiveTab('bookmarks')}
                      className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        activeTab === 'bookmarks'
                          ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                          : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      {language === 'ar' ? `المحفوظات (${bookmarks.length})` : `Bookmarks (${bookmarks.length})`}
                    </button>
                  </div>
                </div>

                {/* Main Body Content based on Tabs */}
                <div className={`flex-1 min-h-0 flex flex-col ${
                  activeTab === 'segments' && studyLayoutMode === 'detailed'
                    ? 'overflow-hidden p-2.5 sm:p-4'
                    : 'overflow-y-auto p-4 sm:p-6 space-y-6'
                }`}>

                  {/* Summary Table View Mode Override */}
                  {studyLayoutMode === 'summary' && activeTab === 'segments' ? (
                    <div className="space-y-4">
                      <div className="text-xs font-bold text-slate-500 flex items-center justify-between">
                        <span>{language === 'ar' ? 'عرض جدولي ملخص لجميع آيات السورة' : 'Summary Table Grid of Chapter Verses'}</span>
                        <span>{currentModule.segments.length} Ayahs</span>
                      </div>

                      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-800">
                            <tr>
                              <th className="p-3 w-16">Ayah</th>
                              <th className="p-3">Arabic Text</th>
                              <th className="p-3">Translation & Root Keywords</th>
                              <th className="p-3 w-20 text-center">Audio</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {currentModule.segments.map((seg) => (
                              <tr key={seg.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                                  #{seg.verseNumber}
                                </td>
                                <td dir="rtl" className="p-3 font-quran text-lg text-slate-800 dark:text-slate-100 !leading-[2.4]" style={{ lineHeight: '2.4' }}>
                                  {seg.arabicText}
                                </td>
                                <td className="p-3 space-y-1">
                                  <div className="text-slate-700 dark:text-slate-200 font-medium">
                                    {getLocalizedText(seg.translation)}
                                  </div>
                                  <div className="flex flex-wrap gap-1 pt-1">
                                    {seg.keywords.map((kw) => (
                                      <span key={kw.id} className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-200/50 dark:border-emerald-800/50 font-mono">
                                        {kw.arabic} ({kw.root})
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="p-3 text-center">
                                  <button
                                    onClick={() => handlePlayAudio(seg.audioUrl)}
                                    className="p-2 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors"
                                  >
                                    {playingAudioUrl === seg.audioUrl ? (
                                      <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                                    ) : (
                                      <Volume2 className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* TAB 1: OVERVIEW & THEMATIC PILLARS */}
                      {activeTab === 'overview' && (
                        <div className="space-y-6">
                          {/* Module Summary */}
                          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                              <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              {language === 'ar'
                                ? 'نبذة عن السورة وفضلها'
                                : 'Surah Overview & Spiritual Significance'}
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                              {getModuleDescription(currentModule)}
                            </p>
                          </div>

                          {/* Classical Tafsir Ibn Kathir Repository Banner for ALL 114 Surahs */}
                          {(() => {
                            const surahOverview = getSurahIbnKathirOverview(currentModule.surahNumber);
                            const hasLocalPdf = currentModule.surahNumber === 1 || currentModule.surahNumber === 113 || currentModule.surahNumber === 114;
                            const pdfTargetName = surahOverview.pdfFilename || getSurahTafsirPdfFilename(currentModule.surahNumber);

                            return (
                              <div className="flex flex-wrap items-center justify-between gap-3.5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-emerald-500/10 dark:from-amber-950/40 dark:via-slate-900/50 dark:to-emerald-950/20 border border-amber-300/80 dark:border-amber-700/60 shadow-2xs">
                                <div className="flex items-center gap-3">
                                  <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 shadow-2xs border border-amber-500/30">
                                    <BookOpen className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h5 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 flex-wrap">
                                      <span>
                                        {language === 'ar'
                                          ? `تفسير ابن كثير المعتمد • ${surahOverview.titleAr}`
                                          : language === 'am'
                                          ? `የተፍሲር ኢብኑ ከሲር ማህደር • ${surahOverview.title}`
                                          : `Tafsir Ibn Kathir Repository • ${surahOverview.title}`}
                                      </span>
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 dark:bg-amber-900/70 text-amber-900 dark:text-amber-200 border border-amber-300/50">
                                        {pdfTargetName}
                                      </span>
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
                                        {surahOverview.revelationType || 'Classical'} • {currentModule.segments.length || surahOverview.numberOfAyahs} Ayahs
                                      </span>
                                    </h5>
                                    <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                                      {language === 'ar'
                                        ? 'تفسير القرآن العظيم للحافظ عماد الدين إسماعيل بن كثير رحمه الله مع أحاديث الفضائل وأسباب النزول'
                                        : 'Authentic classical exegesis with prophetic hadiths, Asbab an-Nuzul, and theological rulings.'}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                  {/* Button to open Tafsir Tab inside Modal */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveTab('tafsir');
                                      if (currentModule.segments.length > 0 && !selectedTafsirSegment) {
                                        setSelectedTafsirSegment(currentModule.segments[0]);
                                      }
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs group cursor-pointer"
                                  >
                                    <BookOpen className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                    <span>{language === 'ar' ? 'تصفح تفسير الآيات' : 'Explore Verses Tafsir'}</span>
                                    <ChevronRight className="w-3 h-3" />
                                  </button>

                                  {/* Local PDF button if available */}
                                  {hasLocalPdf && (
                                    <a
                                      href={currentModule.surahNumber === 1 ? TAFSIR_IBN_KATHIR_FATIHA_LOCAL_PDF_URL : TAFSIR_IBN_KATHIR_LOCAL_PDF_URL}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-xs group cursor-pointer"
                                    >
                                      <FileText className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                      <span>{language === 'ar' ? 'فتح وثيقة التفسير (PDF)' : language === 'am' ? 'የተፍሲር ፒዲኤፍ ክፈት' : 'Open Tafsir PDF'}</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}

                                  {/* Universal Google Drive Tafsir Archive Link */}
                                  <a
                                    href={TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all shadow-2xs group cursor-pointer"
                                    title="Open Tafsir Ibn Kathir repository folder on Google Drive"
                                  >
                                    <Folder className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
                                    <span>{language === 'ar' ? 'مجلد الدرايف (كل السور)' : 'Drive Archive (All Surahs)'}</span>
                                    <ExternalLink className="w-3 h-3 text-slate-400" />
                                  </a>
                                </div>
                              </div>
                            );
                          })()}

                          {/* Thematic Pillars Grid */}
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                              {language === 'ar'
                                ? 'المحاور والمقاصد الرئيسية'
                                : 'Thematic Pillars & Core Doctrines'}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {currentModule.thematicPillars.map((pillar, idx) => (
                                <div
                                  key={pillar.id}
                                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
                                >
                                  <div>
                                    <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center mb-2.5">
                                      0{idx + 1}
                                    </div>
                                    <h5 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1.5">
                                      {language === 'ar'
                                        ? pillar.titleAr
                                        : language === 'am'
                                        ? pillar.titleAm
                                        : pillar.titleEn}
                                    </h5>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                      {language === 'ar'
                                        ? pillar.descriptionAr
                                        : language === 'am'
                                        ? pillar.descriptionAm
                                        : pillar.descriptionEn}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Curated AI Insights */}
                          <div className="bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-teal-50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-teal-950/30 p-5 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/60">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                {language === 'ar'
                                  ? 'تحليل وإشراقات تدبرية'
                                  : 'Linguistic & Reflection Insights'}
                              </div>

                              <button
                                onClick={() => handleTriggerGeminiInsight()}
                                className="text-xs text-emerald-700 dark:text-emerald-300 font-bold hover:underline flex items-center gap-1"
                              >
                                <Brain className="w-3.5 h-3.5" />
                                {language === 'ar' ? 'توليد تفكير عميق' : 'Generate Custom AI Tafsir'}
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                                <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                                  {language === 'ar' ? 'البلاغة القرآنية' : 'Linguistic Eloquence'}
                                </span>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                  {language === 'ar'
                                    ? currentModule.curatedAiAnalysis.linguisticEloquenceAr
                                    : language === 'am'
                                    ? currentModule.curatedAiAnalysis.linguisticEloquenceAm
                                    : currentModule.curatedAiAnalysis.linguisticEloquenceEn}
                                </p>
                              </div>

                              <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                                <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                                  {language === 'ar' ? 'التطبيق العملي' : 'Practical Application'}
                                </span>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                  {language === 'ar'
                                    ? currentModule.curatedAiAnalysis.practicalApplicationAr
                                    : language === 'am'
                                    ? currentModule.curatedAiAnalysis.practicalApplicationAm
                                    : currentModule.curatedAiAnalysis.practicalApplicationEn}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB: TAFSIR IBN KATHIR (GOOGLE DRIVE REPOSITORY & CLASSICAL EXEGESIS) */}
                      {activeTab === 'tafsir' && (() => {
                        const surahOverview = getSurahIbnKathirOverview(currentModule.surahNumber);
                        const hasLocalPdf = currentModule.surahNumber === 1 || currentModule.surahNumber === 113 || currentModule.surahNumber === 114;
                        const pdfTargetName = surahOverview.pdfFilename || getSurahTafsirPdfFilename(currentModule.surahNumber);

                        const currentTafsirSeg =
                          (selectedTafsirSegment && selectedTafsirSegment.surahNumber === currentModule.surahNumber)
                            ? selectedTafsirSegment
                            : (currentModule.segments[0] || null);

                        const virtuesText = language === 'ar' ? surahOverview.virtuesAr : surahOverview.virtuesEn;
                        const sababText = language === 'ar' ? surahOverview.sababAnNuzulAr : surahOverview.sababAnNuzulEn;
                        const hadithsList = language === 'ar' ? surahOverview.keyHadithsAr : surahOverview.keyHadithsEn;

                        const filteredTafsirSegments = currentModule.segments.filter((s) => {
                          if (!tafsirAyahSearchQuery.trim()) return true;
                          const q = tafsirAyahSearchQuery.trim().toLowerCase();
                          return (
                            s.verseNumber.toString() === q ||
                            s.arabicText.includes(q) ||
                            (s.translation?.en && s.translation.en.toLowerCase().includes(q))
                          );
                        });

                        const currentSegIdx = currentTafsirSeg
                          ? currentModule.segments.findIndex((s) => s.id === currentTafsirSeg.id)
                          : -1;

                        const prevSeg = currentSegIdx > 0 ? currentModule.segments[currentSegIdx - 1] : null;
                        const nextSeg =
                          currentSegIdx >= 0 && currentSegIdx < currentModule.segments.length - 1
                            ? currentModule.segments[currentSegIdx + 1]
                            : null;

                        const ibnKathirDetail = currentTafsirSeg
                          ? currentTafsirSeg.tafsirIbnKathir ||
                            getIbnKathirExegesis(
                              currentTafsirSeg.surahNumber,
                              currentTafsirSeg.verseNumber,
                              currentModule.title,
                              currentTafsirSeg.arabicText,
                              currentTafsirSeg.translation?.en
                            )
                          : null;

                        const tafsirSummary = ibnKathirDetail
                          ? language === 'ar'
                            ? ibnKathirDetail.summaryAr || getLocalizedText(currentTafsirSeg!.explanation)
                            : language === 'am'
                            ? ibnKathirDetail.summaryAm || getLocalizedText(currentTafsirSeg!.explanation)
                            : ibnKathirDetail.summaryEn || getLocalizedText(currentTafsirSeg!.explanation)
                          : '';

                        const ayahHadiths = ibnKathirDetail
                          ? language === 'ar'
                            ? ibnKathirDetail.hadithNarrationsAr || []
                            : ibnKathirDetail.hadithNarrationsEn || []
                          : [];

                        const ayahPoints = ibnKathirDetail
                          ? language === 'ar'
                            ? ibnKathirDetail.theologicalPointsAr || []
                            : ibnKathirDetail.theologicalPointsEn || []
                          : [];

                        return (
                          <div className="space-y-6">
                            {/* Hero Card: Connected Google Drive Tafsir Archive */}
                            <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-amber-500/15 via-emerald-500/10 to-teal-500/15 dark:from-amber-950/40 dark:via-slate-900/60 dark:to-emerald-950/40 border border-amber-300/80 dark:border-amber-700/60 shadow-xs">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-2">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-400/40">
                                      <BookOpen className="w-3.5 h-3.5" />
                                      {language === 'ar' ? 'تفسير القرآن العظيم • ابن كثير' : 'Tafsir Al-Qur\'an Al-Azim • Ibn Kathir'}
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
                                      {pdfTargetName}
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                      {surahOverview.revelationType || 'Classical'} • {currentModule.segments.length || surahOverview.numberOfAyahs} Ayahs
                                    </span>
                                  </div>

                                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                                    {language === 'ar' ? surahOverview.titleAr : surahOverview.title}
                                  </h3>
                                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                                    {language === 'ar'
                                      ? 'مستودع متصل مباشرة بأرشيف تفسير ابن كثير الشامل على Google Drive لجميع سور القرآن الكريم الـ 114، مع استعراض الآيات وأسباب النزول والأحاديث النبوية المرفوعة.'
                                      : 'Directly linked to the comprehensive Tafsir Ibn Kathir repository on Google Drive covering all 114 Surahs, featuring classical exegesis, verified prophetic hadiths, Asbab an-Nuzul, and TTS audio narration.'}
                                  </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                                  {/* Google Drive Universal Launcher */}
                                  <a
                                    href={TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-sm hover:shadow group cursor-pointer"
                                  >
                                    <Folder className="w-4 h-4 text-amber-200 group-hover:scale-110 transition-transform" />
                                    <span>
                                      {language === 'ar' ? 'فتح مجلد التفسير على Google Drive' : 'Open Google Drive Tafsir Archive'}
                                    </span>
                                    <ExternalLink className="w-3.5 h-3.5 text-amber-200" />
                                  </a>

                                  {/* Local PDF Manuscript if present */}
                                  {hasLocalPdf && (
                                    <a
                                      href={currentModule.surahNumber === 1 ? TAFSIR_IBN_KATHIR_FATIHA_LOCAL_PDF_URL : TAFSIR_IBN_KATHIR_LOCAL_PDF_URL}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all shadow-2xs group cursor-pointer"
                                    >
                                      <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                                      <span>{language === 'ar' ? 'وثيقة PDF' : 'Local PDF'}</span>
                                      <ExternalLink className="w-3 h-3 text-slate-400" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Section 1: Chapter Virtues & Occasion of Revelation */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Virtues Card */}
                              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 flex flex-col justify-between">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-200/50 dark:border-emerald-800/50">
                                        ✦
                                      </div>
                                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                                        {language === 'ar' ? 'فضائل السورة وأسماؤها الجليلة' : 'Chapter Virtues & Distinctive Names'}
                                      </h4>
                                    </div>

                                    {/* TTS Button */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (isSpeaking && activeText === virtuesText) {
                                          stop();
                                        } else {
                                          speak(virtuesText, language === 'ar' ? 'ar' : 'en');
                                        }
                                      }}
                                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                        isSpeaking && activeText === virtuesText
                                          ? 'bg-amber-600 text-white animate-pulse'
                                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300'
                                      }`}
                                    >
                                      {isSpeaking && activeText === virtuesText ? (
                                        <>
                                          <VolumeX className="w-3.5 h-3.5" />
                                          <span>{language === 'ar' ? 'إيقاف' : 'Stop'}</span>
                                        </>
                                      ) : (
                                        <>
                                          <Volume2 className="w-3.5 h-3.5" />
                                          <span>{language === 'ar' ? 'استماع' : 'Listen'}</span>
                                        </>
                                      )}
                                    </button>
                                  </div>

                                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-serif whitespace-pre-line">
                                    {virtuesText}
                                  </p>
                                </div>
                              </div>

                              {/* Occasion of Revelation / Asbab an-Nuzul Card */}
                              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 flex flex-col justify-between">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-200/50 dark:border-amber-800/50">
                                        📜
                                      </div>
                                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                                        {language === 'ar' ? 'أسباب النزول والمقاصد الكبرى' : 'Occasion of Revelation & Divine Context'}
                                      </h4>
                                    </div>

                                    {/* TTS Button */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (isSpeaking && activeText === sababText) {
                                          stop();
                                        } else {
                                          speak(sababText, language === 'ar' ? 'ar' : 'en');
                                        }
                                      }}
                                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                        isSpeaking && activeText === sababText
                                          ? 'bg-amber-600 text-white animate-pulse'
                                          : 'bg-amber-50 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300'
                                      }`}
                                    >
                                      {isSpeaking && activeText === sababText ? (
                                        <>
                                          <VolumeX className="w-3.5 h-3.5" />
                                          <span>{language === 'ar' ? 'إيقاف' : 'Stop'}</span>
                                        </>
                                      ) : (
                                        <>
                                          <Volume2 className="w-3.5 h-3.5" />
                                          <span>{language === 'ar' ? 'استماع' : 'Listen'}</span>
                                        </>
                                      )}
                                    </button>
                                  </div>

                                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-serif whitespace-pre-line">
                                    {sababText}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Authentic Prophetic Hadiths on the Chapter */}
                            {hadithsList && hadithsList.length > 0 && (
                              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 dark:bg-slate-900 border border-amber-200/70 dark:border-amber-900/50 shadow-2xs space-y-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                                    {language === 'ar' ? 'الأحاديث النبوية المرفوعة في فضل السورة' : 'Authentic Prophetic Hadiths on this Surah'}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                                  {hadithsList.map((h, hIdx) => (
                                    <div
                                      key={hIdx}
                                      className="p-3 rounded-xl bg-white dark:bg-slate-850 border border-amber-200/60 dark:border-amber-800/40 text-xs text-slate-700 dark:text-slate-200 flex flex-col justify-between gap-2"
                                    >
                                      <p className="leading-relaxed font-serif">{h}</p>
                                      <div className="flex justify-end pt-1">
                                        <button
                                          type="button"
                                          onClick={() => speak(h, language === 'ar' ? 'ar' : 'en')}
                                          className="text-[11px] text-amber-700 dark:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
                                        >
                                          <Volume2 className="w-3 h-3" />
                                          <span>{language === 'ar' ? 'قراءة الحديث' : 'Read Hadith'}</span>
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Section 2: Interactive Ayah-by-Ayah Classical Exegesis Navigator */}
                            <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    <span>
                                      {language === 'ar'
                                        ? 'التفسير التفصيلي لكل آية (تفسير ابن كثير)'
                                        : 'Ayah-by-Ayah Classical Exegesis (Tafsir Ibn Kathir)'}
                                    </span>
                                  </h4>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {language === 'ar'
                                      ? 'اختر أي آية لعرض نصها العثماني والاستماع لتلاوتها وشرح الحافظ ابن كثير بالعربية والإنجليزية والأمهرية'
                                      : 'Select any Ayah to inspect its Uthmanic Arabic text, audio recitation, and comprehensive Ibn Kathir exegesis.'}
                                  </p>
                                </div>

                                {/* Filter Ayahs by number */}
                                <div className="relative w-full sm:w-60">
                                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                  <input
                                    type="text"
                                    value={tafsirAyahSearchQuery}
                                    onChange={(e) => setTafsirAyahSearchQuery(e.target.value)}
                                    placeholder={language === 'ar' ? 'ابحث برقم الآية...' : 'Search by Ayah #...'}
                                    className="w-full text-xs pl-8 pr-7 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                  />
                                  {tafsirAyahSearchQuery && (
                                    <button
                                      type="button"
                                      onClick={() => setTafsirAyahSearchQuery('')}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Ayah Chips Selector */}
                              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-emerald-500/20">
                                {filteredTafsirSegments.map((s) => {
                                  const isCurrent = currentTafsirSeg?.id === s.id;
                                  return (
                                    <button
                                      key={s.id}
                                      type="button"
                                      onClick={() => setSelectedTafsirSegment(s)}
                                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                                        isCurrent
                                          ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-400/40'
                                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                                      }`}
                                    >
                                      {language === 'ar' ? `آية ${s.verseNumber}` : `Ayah ${s.verseNumber}`}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Selected Ayah Display & Exegesis Card */}
                              {currentTafsirSeg && (
                                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-5 shadow-xs">
                                  {/* Ayah Header Bar: Prev / Next / Audio Recitation */}
                                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2">
                                      <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                                        {currentModule.title} : {language === 'ar' ? `آية ${currentTafsirSeg.verseNumber}` : `Ayah ${currentTafsirSeg.verseNumber}`}
                                      </span>
                                      <span className="text-xs text-slate-400">
                                        ({currentTafsirSeg.verseNumber} / {currentModule.segments.length})
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      {/* Audio Recitation Play Button */}
                                      <button
                                        type="button"
                                        onClick={() => handlePlayAudio(currentTafsirSeg.audioUrl)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                          playingAudioUrl === currentTafsirSeg.audioUrl
                                            ? 'bg-emerald-600 text-white animate-pulse'
                                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300'
                                        }`}
                                      >
                                        {playingAudioUrl === currentTafsirSeg.audioUrl ? (
                                          <>
                                            <VolumeX className="w-3.5 h-3.5" />
                                            <span>{language === 'ar' ? 'إيقاف التلاوة' : 'Pause Recitation'}</span>
                                          </>
                                        ) : (
                                          <>
                                            <Volume2 className="w-3.5 h-3.5" />
                                            <span>{language === 'ar' ? 'استماع للتلاوة' : 'Play Ayah Recitation'}</span>
                                          </>
                                        )}
                                      </button>

                                      {/* Prev Ayah Button */}
                                      {prevSeg && (
                                        <button
                                          type="button"
                                          onClick={() => setSelectedTafsirSegment(prevSeg)}
                                          className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                          title={language === 'ar' ? 'الآية السابقة' : 'Previous Ayah'}
                                        >
                                          <ChevronRight className="w-4 h-4 rotate-180" />
                                        </button>
                                      )}

                                      {/* Next Ayah Button */}
                                      {nextSeg && (
                                        <button
                                          type="button"
                                          onClick={() => setSelectedTafsirSegment(nextSeg)}
                                          className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                          title={language === 'ar' ? 'الآية التالية' : 'Next Ayah'}
                                        >
                                          <ChevronRight className="w-4 h-4" />
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  {/* Separate Basmalah Block if Ayah 1 of Surahs 2-114 */}
                                  {currentModule.surahNumber !== 1 && currentModule.surahNumber !== 9 && currentTafsirSeg.verseNumber === 1 && (
                                    <div className="py-2.5 px-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/40 text-center">
                                      <div
                                        dir="rtl"
                                        className="font-quran quran-line-spaced text-2xl sm:text-3xl text-emerald-900 dark:text-emerald-200 !leading-[3.2] select-all"
                                        style={{ lineHeight: '3.2', wordSpacing: '0.12em' }}
                                      >
                                        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                                      </div>
                                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-0.5">
                                        "In the name of Allah, the Entirely Merciful, the Especially Merciful"
                                      </p>
                                    </div>
                                  )}

                                  {/* Uthmanic Arabic Verse Text */}
                                  <div
                                    dir="rtl"
                                    className="font-quran quran-line-spaced text-2xl sm:text-3xl text-slate-900 dark:text-slate-100 !leading-[3.2] sm:!leading-[3.4] text-right py-4 border-b border-slate-100 dark:border-slate-800 select-text tracking-wide"
                                    style={{ lineHeight: '3.2', wordSpacing: '0.12em' }}
                                  >
                                    {currentModule.surahNumber !== 1 && currentTafsirSeg.verseNumber === 1
                                      ? currentTafsirSeg.arabicText.replace(/^بِسْمِ\s+ٱللَّهِ\s+ٱلرَّحْمَٰنِ\s+ٱلرَّحِيمِ\s*/, '').trim() || currentTafsirSeg.arabicText
                                      : currentTafsirSeg.arabicText}
                                  </div>

                                  {/* Verse Translation & TTS */}
                                  <div className="flex items-center justify-between gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium bg-slate-50 dark:bg-slate-850 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <p className="flex-1 leading-relaxed">
                                      {getLocalizedText(currentTafsirSeg.translation)}
                                    </p>
                                    <TTSButton
                                      text={getLocalizedText(currentTafsirSeg.translation)}
                                      lang={language === 'ar' ? 'ar' : language === 'am' ? 'am' : 'en'}
                                      size="sm"
                                      tooltipText={language === 'ar' ? 'استماع لترجمة الآية' : 'Listen to translation via TTS'}
                                    />
                                  </div>

                                  {/* Detailed Tafsir Ibn Kathir Exegetical Commentary */}
                                  <div className={`p-5 rounded-2xl border space-y-4 transition-colors ${
                                    isSpeaking && activeText === tafsirSummary
                                      ? 'border-amber-400 dark:border-amber-500/80 ring-2 ring-amber-400/40 bg-amber-50/40 dark:bg-amber-950/20'
                                      : 'border-emerald-100 dark:border-slate-800 bg-gradient-to-br from-emerald-50/40 via-white to-amber-50/20 dark:from-slate-850 dark:via-slate-900 dark:to-emerald-950/20'
                                  }`}>
                                    {/* Exegesis Header with TTS & Drive Action */}
                                    <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-200/70 dark:border-slate-800">
                                      <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/20">
                                          <BookOpen className="w-4 h-4" />
                                        </div>
                                        <div>
                                          <h5 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                                            {language === 'ar' ? 'تحقيق الإمام الحافظ ابن كثير' : 'Exegesis by Imam Al-Hafiz Ibn Kathir'}
                                          </h5>
                                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                            {language === 'ar' ? 'تفسير القرآن بالقرآن وبالسنة النبوية' : 'Quranic exegesis grounded in Quran, authentic Sunnah, and Sahabah consensus'}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        {/* TTS Button for full Tafsir Exegesis */}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (isSpeaking && activeText === tafsirSummary) {
                                              stop();
                                            } else {
                                              speak(tafsirSummary, language === 'ar' ? 'ar' : language === 'am' ? 'am' : 'en');
                                            }
                                          }}
                                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
                                            isSpeaking && activeText === tafsirSummary
                                              ? 'bg-amber-600 text-white ring-2 ring-amber-400 animate-pulse'
                                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                          }`}
                                        >
                                          {isSpeaking && activeText === tafsirSummary ? (
                                            <>
                                              <VolumeX className="w-3.5 h-3.5" />
                                              <span>{language === 'ar' ? 'إيقاف التفسير' : 'Stop Tafsir Audio'}</span>
                                            </>
                                          ) : (
                                            <>
                                              <Volume2 className="w-3.5 h-3.5" />
                                              <span>{language === 'ar' ? 'استماع للشرح والتفسير' : 'Listen to Tafsir (TTS)'}</span>
                                            </>
                                          )}
                                        </button>

                                        {/* Direct Google Drive Folder Link */}
                                        <a
                                          href={TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all shadow-2xs group cursor-pointer"
                                          title="Open Google Drive repository folder"
                                        >
                                          <Folder className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
                                          <span>{language === 'ar' ? 'مجلد الدرايف' : 'Drive Archive'}</span>
                                          <ExternalLink className="w-3 h-3 text-slate-400" />
                                        </a>
                                      </div>
                                    </div>

                                    {/* Active Audio Narration Notice */}
                                    {isSpeaking && activeText === tafsirSummary && (
                                      <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-amber-100/90 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-xs font-bold border border-amber-300/80 dark:border-amber-700/60">
                                        <div className="flex items-center gap-2">
                                          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-spin" />
                                          <span>
                                            {language === 'ar'
                                              ? 'جاري قراءة الشرح والتفسير الصوتي للآية الكريمة...'
                                              : 'Narrating Tafsir Ibn Kathir commentary via TTS...'}
                                          </span>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={stop}
                                          className="text-amber-800 dark:text-amber-300 hover:underline text-[11px] font-bold cursor-pointer"
                                        >
                                          {language === 'ar' ? 'إيقاف' : 'Stop'}
                                        </button>
                                      </div>
                                    )}

                                    {/* Commentary Text */}
                                    <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-serif whitespace-pre-line">
                                      {tafsirSummary}
                                    </div>

                                    {/* Hadith Narrations specifically cited for this Ayah */}
                                    {ayahHadiths.length > 0 && (
                                      <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800 space-y-2">
                                        <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block">
                                          {language === 'ar' ? 'الآثار والأحاديث النبوية المخرجة في الآية:' : 'Prophetic Hadiths & Companions Narrations:'}
                                        </span>
                                        <div className="space-y-1.5">
                                          {ayahHadiths.map((hd, hIndex) => (
                                            <div
                                              key={hIndex}
                                              className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-slate-700 dark:text-slate-200 flex items-start justify-between gap-3"
                                            >
                                              <span className="leading-relaxed font-serif flex-1">{hd}</span>
                                              <TTSButton
                                                text={hd}
                                                lang={language === 'ar' ? 'ar' : 'en'}
                                                size="sm"
                                                className="shrink-0"
                                              />
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Theological Principles & Spiritual Lessons */}
                                    {ayahPoints.length > 0 && (
                                      <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800 space-y-2">
                                        <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">
                                          {language === 'ar' ? 'الفوائد العقدية والتربوية المستنبطة:' : 'Theological Deductions & Practical Lessons:'}
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                          {ayahPoints.map((pt, pIdx) => (
                                            <button
                                              key={pIdx}
                                              type="button"
                                              onClick={() => speak(pt, language === 'ar' ? 'ar' : language === 'am' ? 'am' : 'en')}
                                              className="text-[11px] px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-850 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 font-medium leading-relaxed hover:bg-emerald-100 dark:hover:bg-emerald-900/70 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                                              title={language === 'ar' ? 'اضغط للاستماع' : 'Click to listen'}
                                            >
                                              <span>✦ {pt}</span>
                                              <Volume2 className="w-3 h-3 opacity-60 hover:opacity-100 shrink-0" />
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}

                      {/* TAB 2: VERSES & VOCABULARY BREAKDOWN (DETAILED SECTION - INDEPENDENT SCROLLING PANELS) */}
                      {activeTab === 'segments' && (
                        <div className="flex-1 min-h-0 flex flex-col overflow-hidden space-y-2.5">
                          {/* Surah Basmalah Header */}
                          {currentModule.surahNumber !== 1 && currentModule.surahNumber !== 9 && (
                            <div className="shrink-0 relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-50/90 via-amber-50/60 to-emerald-50/90 dark:from-emerald-950/40 dark:via-slate-850 dark:to-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/50 px-4 py-2 text-center shadow-2xs">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold mb-0.5">
                                <Sparkles size={11} className="text-amber-500" />
                                <span>{language === 'ar' ? 'الافتتاح بالبسملة الشريفة المباركة' : 'Noble Opening Basmalah'}</span>
                              </div>
                              <div
                                dir="rtl"
                                className="font-quran text-lg sm:text-xl md:text-2xl text-emerald-950 dark:text-emerald-200 !leading-[2.4] select-all tracking-wide"
                                style={{ lineHeight: '2.4', wordSpacing: '0.12em' }}
                              >
                                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                              </div>
                            </div>
                          )}

                          {/* Mobile View Toggle (Visible only below md breakpoint) */}
                          <div className="md:hidden flex items-center justify-between p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
                            <button
                              type="button"
                              onClick={() => setMobileSegmentsView('list')}
                              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                mobileSegmentsView === 'list'
                                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                                  : 'text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              <BookMarked className="w-3.5 h-3.5" />
                              <span>{language === 'ar' ? `قائمة الآيات (${filteredAyahs.length})` : `Ayahs List (${filteredAyahs.length})`}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setMobileSegmentsView('display')}
                              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                mobileSegmentsView === 'display'
                                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                                  : 'text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>{language === 'ar' ? 'شاشة العرض والتفسير' : 'Analysis Display'}</span>
                              {selectedSegment && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-mono font-bold">
                                  #{selectedSegment.verseNumber}
                                </span>
                              )}
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4 flex-1 min-h-0 overflow-hidden">
                            {/* Left Column: Selected Ayahs for Analysis (Independent Scroll Container) */}
                            <div className={`md:col-span-5 lg:col-span-4 flex flex-col h-full min-h-0 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 overflow-hidden shadow-2xs ${
                              mobileSegmentsView === 'display' ? 'hidden md:flex' : 'flex'
                            }`}>
                              {/* Pinned Left Header: Title + Quick Search/Filter + Counter */}
                              <div className="p-3 border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs shrink-0 space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <BookMarked className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                                      {language === 'ar' ? 'الآيات المختارة للدراسة' : 'Selected Ayahs for Analysis'}
                                    </h4>
                                  </div>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50">
                                    {filteredAyahs.length} {language === 'ar' ? 'آية' : 'Ayahs'}
                                  </span>
                                </div>

                                {/* Quick filter input for Ayahs */}
                                <div className="relative">
                                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                  <input
                                    type="text"
                                    value={ayahSearchQuery}
                                    onChange={(e) => setAyahSearchQuery(e.target.value)}
                                    placeholder={language === 'ar' ? 'تصفية برقم الآية أو النص...' : 'Filter by Ayah # or text...'}
                                    className="w-full text-xs pl-8 pr-7 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                  />
                                  {ayahSearchQuery && (
                                    <button
                                      type="button"
                                      onClick={() => setAyahSearchQuery('')}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Independent Scrollable Container for Ayahs List */}
                              <div className="flex-1 overflow-y-auto p-2 space-y-2 pr-1.5 scrollbar-thin scrollbar-thumb-emerald-500/20">
                                {filteredAyahs.length === 0 ? (
                                  <div className="p-6 text-center text-xs text-slate-400">
                                    {language === 'ar' ? 'لا توجد آيات مطابقة للبحث' : 'No matching Ayahs found'}
                                  </div>
                                ) : (
                                  filteredAyahs.map((seg) => {
                                    const isSegActive = selectedSegment?.id === seg.id;
                                    const isHighlighted = highlightSegmentId === seg.id;
                                    const cleanSelectorText =
                                      currentModule.surahNumber !== 1 && seg.verseNumber === 1
                                        ? seg.arabicText.replace(/^بِسْمِ\s+ٱللَّهِ\s+ٱلرَّحْمَٰنِ\s+ٱلرَّحِيمِ\s*/, '').trim() || seg.arabicText
                                        : seg.arabicText;

                                    return (
                                      <button
                                        key={seg.id}
                                        type="button"
                                        onClick={() => {
                                          setSelectedSegment(seg);
                                          setSelectedKeyword(null);
                                          setMobileSegmentsView('display');
                                        }}
                                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer group ${
                                          isHighlighted
                                            ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-100/90 dark:bg-emerald-900/60 shadow-xs'
                                            : isSegActive
                                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-500 shadow-xs ring-1 ring-emerald-500/50'
                                            : 'border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-slate-50 dark:hover:bg-slate-850'
                                        }`}
                                      >
                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-center gap-2 mb-0.5">
                                            <span className={`text-xs font-bold ${
                                              isSegActive ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-300'
                                            }`}>
                                              {language === 'ar' ? seg.labelAr : seg.label}
                                            </span>
                                            {isSegmentBookmarked(seg.id) && (
                                              <BookmarkCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                            )}
                                            {isSegActive && (
                                              <span className="text-[9px] uppercase px-1.5 py-0.2 rounded font-bold bg-emerald-600 text-white shrink-0">
                                                Active
                                              </span>
                                            )}
                                          </div>
                                          <div
                                            dir="rtl"
                                            className="font-quran text-base text-slate-800 dark:text-slate-100 truncate mt-0.5 !leading-[2.6]"
                                            style={{ lineHeight: '2.6' }}
                                          >
                                            {cleanSelectorText}
                                          </div>
                                        </div>
                                        <ChevronRight
                                          className={`w-4 h-4 ml-2 transition-transform shrink-0 ${
                                            isSegActive
                                              ? 'text-emerald-600 dark:text-emerald-400 translate-x-0.5'
                                              : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                                          }`}
                                        />
                                      </button>
                                    );
                                  })
                                )}
                              </div>
                            </div>

                            {/* Right Column: Display Section (Independent Scroll Container) */}
                            <div className={`md:col-span-7 lg:col-span-8 flex flex-col h-full min-h-0 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs ${
                              mobileSegmentsView === 'list' ? 'hidden md:flex' : 'flex'
                            }`}>
                              {/* Independent Scrollable Display Content */}
                              <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 md:p-6 space-y-4 pr-2 sm:pr-4 scrollbar-thin scrollbar-thumb-emerald-500/20">
                                {/* Mobile Back-to-List button */}
                                <div className="md:hidden flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                                  <button
                                    type="button"
                                    onClick={() => setMobileSegmentsView('list')}
                                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline cursor-pointer"
                                  >
                                    <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                                    <span>{language === 'ar' ? 'العودة لقائمة الآيات' : 'Back to Ayahs list'}</span>
                                  </button>
                                  {selectedSegment && (
                                    <span className="text-xs font-bold text-slate-500">
                                      Ayah #{selectedSegment.verseNumber} of {currentModule.totalVerses}
                                    </span>
                                  )}
                                </div>

                                {selectedSegment ? (
                                  <div className="space-y-4">
                                
                                {/* Active Ayah Card */}
                                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 relative">
                                  
                                  {/* Top Ayah Tools */}
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                                      {language === 'ar' ? selectedSegment.labelAr : selectedSegment.label}
                                    </span>

                                    <div className="flex items-center gap-2">
                                      {/* Bookmark Action */}
                                      <button
                                        onClick={() => toggleBookmark(selectedSegment)}
                                        className={`p-1.5 rounded-lg border transition-all ${
                                          isSegmentBookmarked(selectedSegment.id)
                                            ? 'bg-amber-500 text-white border-amber-500'
                                            : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:text-amber-500'
                                        }`}
                                        title="Bookmark Ayah"
                                      >
                                        <Bookmark className="w-3.5 h-3.5" />
                                      </button>

                                      {/* TTS Ayah Speech (Arabic) */}
                                      <TTSButton
                                        text={selectedSegment.arabicText}
                                        lang="ar"
                                        size="sm"
                                        className="p-1.5 rounded-lg"
                                        tooltipText={language === 'ar' ? 'استماع للآية بالصوت (TTS)' : 'Listen to Ayah via TTS'}
                                      />

                                      {/* Gemini AI Action */}
                                      <button
                                        onClick={() => handleTriggerGeminiInsight(selectedSegment)}
                                        className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                                        title="Ask Gemini for Tafsir & Linguistic Insights"
                                      >
                                        <Brain className="w-3.5 h-3.5" />
                                      </button>

                                      {/* Audio Recitation Action */}
                                      {selectedSegment.audioUrl && (
                                        <button
                                          onClick={() => handlePlayAudio(selectedSegment.audioUrl)}
                                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
                                        >
                                          {playingAudioUrl === selectedSegment.audioUrl ? (
                                            <>
                                              <VolumeX className="w-4 h-4 animate-pulse" />
                                              {language === 'ar' ? 'إيقاف' : 'Pause'}
                                            </>
                                          ) : (
                                            <>
                                              <Volume2 className="w-4 h-4" />
                                              {language === 'ar' ? 'استماع' : 'Listen'}
                                            </>
                                          )}
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  {/* Waveform visualizer canvas when audio plays */}
                                  {playingAudioUrl === selectedSegment.audioUrl && (
                                    <div className="mb-3 p-2 bg-emerald-950/20 rounded-xl flex items-center justify-between border border-emerald-500/30">
                                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                        Live Recitation Waveform
                                      </span>
                                      <canvas ref={canvasRef} width={140} height={20} className="rounded" />
                                    </div>
                                  )}

                                  {/* Preceding Basmalah on its own line/block for opening Ayah 1 (Except Surah 1 & Surah 9) */}
                                  {selectedSegment.verseNumber === 1 && currentModule.surahNumber !== 1 && currentModule.surahNumber !== 9 && (
                                    <div className="text-center py-4 px-6 mb-4 border border-dashed border-emerald-300/80 dark:border-slate-700/80 bg-gradient-to-r from-emerald-50/70 via-amber-50/50 to-emerald-50/70 dark:from-emerald-950/40 dark:via-slate-900 dark:to-emerald-950/40 rounded-2xl shadow-2xs">
                                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100/90 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold mb-2 uppercase tracking-wider">
                                        <Sparkles size={12} className="text-amber-500" />
                                        <span>{language === 'ar' ? 'الافتتاح بالبسملة الشريفة المستقلة' : 'Opening Basmalah (Independent)'}</span>
                                      </div>
                                      <div
                                        dir="rtl"
                                        className="font-quran quran-line-spaced text-2xl sm:text-3xl text-emerald-900 dark:text-emerald-200 !leading-[3.2] sm:!leading-[3.4] select-all tracking-wide"
                                        style={{ lineHeight: '3.2', wordSpacing: '0.12em' }}
                                      >
                                        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                                      </div>
                                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-1 font-sans">
                                        "In the name of Allah, the Entirely Merciful, the Especially Merciful"
                                      </p>
                                    </div>
                                  )}

                                  {/* Uthmanic Text with Generous Anti-Overlap Line Spacing */}
                                  <div
                                    dir="rtl"
                                    className="font-quran quran-line-spaced text-2xl sm:text-3xl md:text-[32px] text-slate-800 dark:text-slate-100 !leading-[3.2] sm:!leading-[3.4] text-right py-6 my-3 border-b border-slate-200 dark:border-slate-800 select-text tracking-wide"
                                    style={{ lineHeight: '3.2', wordSpacing: '0.12em' }}
                                  >
                                    {currentModule.surahNumber !== 1 && selectedSegment.verseNumber === 1
                                      ? selectedSegment.arabicText.replace(/^بِسْمِ\s+ٱللَّهِ\s+ٱلرَّحْمَٰنِ\s+ٱلرَّحِيمِ\s*/, '').trim() || selectedSegment.arabicText
                                      : selectedSegment.arabicText}
                                  </div>

                                  <div className="mt-3 space-y-2 text-xs">
                                    <div className="text-slate-500 dark:text-slate-400 italic">
                                      {selectedSegment.transliteration}
                                    </div>
                                    <div className="text-slate-700 dark:text-slate-200 font-medium flex items-center justify-between gap-2">
                                      <span className="flex-1">{getLocalizedText(selectedSegment.translation)}</span>
                                      <TTSButton
                                        text={getLocalizedText(selectedSegment.translation)}
                                        lang={language === 'ar' ? 'ar' : language === 'am' ? 'am' : 'en'}
                                        size="sm"
                                        tooltipText={language === 'ar' ? 'استماع لترجمة الآية' : 'Listen to translation via TTS'}
                                      />
                                    </div>

                                    {/* Comprehensive Classical Tafsir Insight Section (Tafsir Ibn Kathir) */}
                                    {(() => {
                                      const ibnKathir: TafsirIbnKathirDetail =
                                        selectedSegment.tafsirIbnKathir ||
                                        getIbnKathirExegesis(
                                          selectedSegment.surahNumber,
                                          selectedSegment.verseNumber,
                                          currentModule.title,
                                          selectedSegment.arabicText,
                                          selectedSegment.translation?.en
                                        );

                                      const summary =
                                        language === 'ar'
                                          ? ibnKathir.summaryAr || getLocalizedText(selectedSegment.explanation)
                                          : language === 'am'
                                          ? ibnKathir.summaryAm || getLocalizedText(selectedSegment.explanation)
                                          : ibnKathir.summaryEn || getLocalizedText(selectedSegment.explanation);

                                      const narrations =
                                        language === 'ar'
                                          ? ibnKathir.hadithNarrationsAr || []
                                          : ibnKathir.hadithNarrationsEn || [];

                                      const points =
                                        language === 'ar'
                                          ? ibnKathir.theologicalPointsAr || []
                                          : ibnKathir.theologicalPointsEn || [];

                                      return (
                                        <div className="pt-4 mt-3 border-t border-slate-200 dark:border-slate-800 space-y-3.5">
                                          {/* Header bar with Drive Link */}
                                          <div className="flex flex-wrap items-center justify-between gap-2.5">
                                            <div className="flex items-center gap-2">
                                              <div className="w-7 h-7 rounded-lg bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/20">
                                                <BookOpen className="w-4 h-4" />
                                              </div>
                                              <div>
                                                <div className="flex items-center gap-2">
                                                  <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                                                    {language === 'ar' ? 'إضاءات التفسير • تفسير ابن كثير' : 'Tafsir Insight • Tafsir Ibn Kathir'}
                                                  </span>
                                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/40">
                                                    {language === 'ar' ? 'تفسير القرآن العظيم' : 'Classical Exegesis'}
                                                  </span>
                                                </div>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                  {language === 'ar'
                                                    ? 'تحقيق وشرح الإمام الحافظ عماد الدين إسماعيل بن كثير رحمه الله'
                                                    : 'Scholarly commentary by Imam Al-Hafiz Ibn Kathir (rahimahullah)'}
                                                </p>
                                              </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                              {/* TTS Play Tafsir Audio Button */}
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  if (isSpeaking && activeText === summary) {
                                                    stop();
                                                  } else {
                                                    speak(summary, language === 'ar' ? 'ar' : language === 'am' ? 'am' : 'en');
                                                  }
                                                }}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
                                                  isSpeaking && activeText === summary
                                                    ? 'bg-amber-600 text-white ring-2 ring-amber-400 animate-pulse'
                                                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                                }`}
                                                title={language === 'ar' ? 'استماع لتفسير وشرح الآية (TTS)' : 'Listen to Tafsir exegesis via TTS'}
                                              >
                                                {isSpeaking && activeText === summary ? (
                                                  <>
                                                    <VolumeX className="w-3.5 h-3.5" />
                                                    <span>{language === 'ar' ? 'إيقاف التفسير' : 'Stop Tafsir Audio'}</span>
                                                  </>
                                                ) : (
                                                  <>
                                                    <Volume2 className="w-3.5 h-3.5" />
                                                    <span>{language === 'ar' ? 'استماع للشرح والتفسير' : 'Listen to Tafsir (TTS)'}</span>
                                                  </>
                                                )}
                                              </button>

                                              {/* Direct link to local Tafsir Ibn Kathir Document (PDF) */}
                                              {(ibnKathir.localPdfUrl || selectedSegment.surahNumber === 1 || selectedSegment.surahNumber === 113 || selectedSegment.surahNumber === 114) && (
                                                <a
                                                  href={ibnKathir.localPdfUrl || (selectedSegment.surahNumber === 1 ? TAFSIR_IBN_KATHIR_FATIHA_LOCAL_PDF_URL : TAFSIR_IBN_KATHIR_LOCAL_PDF_URL)}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/60 hover:bg-amber-500/20 transition-all shadow-2xs group cursor-pointer"
                                                  title={selectedSegment.surahNumber === 1 ? "Open authentic Tafsir Ibn Kathir Surah Al-Fatiha classical document (PDF)" : "Open authentic Tafsir Ibn Kathir Al-Mu'awwidhatayn classical document (PDF)"}
                                                >
                                                  <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                                                  <span>{language === 'ar' ? 'وثيقة التفسير (PDF)' : language === 'am' ? 'የተፍሲር ሰነድ (PDF)' : 'Tafsir Ibn Kathir (PDF)'}</span>
                                                  <ExternalLink className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                                </a>
                                              )}

                                              {/* Direct link to Google Drive Tafsir Ibn Kathir Archive */}
                                              <a
                                                href={ibnKathir.driveFolderUrl || TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-700/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/70 transition-all shadow-2xs group cursor-pointer"
                                                title="Open complete Tafsir Ibn Kathir volumes on Google Drive"
                                              >
                                                <Folder className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
                                                <span>{language === 'ar' ? 'مجلد التفسير (Drive)' : 'Tafsir Ibn Kathir (Drive)'}</span>
                                                <ExternalLink className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                              </a>
                                            </div>
                                          </div>

                                          {/* Main Classical Exegetical Text */}
                                          <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/50 via-white to-amber-50/30 dark:from-slate-850 dark:via-slate-900 dark:to-emerald-950/20 border space-y-3.5 shadow-2xs transition-colors ${
                                            isSpeaking && activeText === summary
                                              ? 'border-amber-400 dark:border-amber-500/80 ring-2 ring-amber-400/40 bg-amber-50/30 dark:bg-amber-950/20'
                                              : 'border-emerald-100/80 dark:border-slate-800'
                                          }`}>
                                            {/* Active TTS Indicator Banner */}
                                            {isSpeaking && activeText === summary && (
                                              <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-amber-100/90 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-xs font-bold border border-amber-300/80 dark:border-amber-700/60">
                                                <div className="flex items-center gap-2">
                                                  <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-spin" />
                                                  <span>
                                                    {language === 'ar'
                                                      ? 'جاري قراءة التفسير وشرح ابن كثير صوتياً...'
                                                      : 'Playing Tafsir Ibn Kathir explanation via TTS...'}
                                                  </span>
                                                </div>
                                                <button
                                                  type="button"
                                                  onClick={stop}
                                                  className="text-amber-800 dark:text-amber-300 hover:underline text-[11px] font-bold cursor-pointer"
                                                >
                                                  {language === 'ar' ? 'إيقاف' : 'Stop'}
                                                </button>
                                              </div>
                                            )}

                                            <div className="flex items-start justify-between gap-3">
                                              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed space-y-2 whitespace-pre-line font-serif flex-1">
                                                {summary}
                                              </div>
                                              <TTSButton
                                                text={summary}
                                                lang={language === 'ar' ? 'ar' : language === 'am' ? 'am' : 'en'}
                                                size="sm"
                                                className="flex-shrink-0"
                                                tooltipText={language === 'ar' ? 'استماع لشرح الآية كاملاً' : 'Listen to complete explanation'}
                                              />
                                            </div>

                                            {/* Supporting Hadith & Prophetic Narrations */}
                                            {narrations.length > 0 && (
                                              <div className="pt-3 border-t border-dashed border-emerald-200/80 dark:border-slate-800 space-y-2">
                                                <div className="text-xs font-bold text-emerald-850 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                                                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                                  <span>{language === 'ar' ? 'الآثار والأحاديث الواردة في التفسير:' : 'Prophetic Narrations & Hadith Citations:'}</span>
                                                </div>
                                                <div className="space-y-1.5">
                                                  {narrations.map((narration, nIdx) => (
                                                    <div
                                                      key={nIdx}
                                                      className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/70 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start justify-between gap-2.5 shadow-2xs group"
                                                    >
                                                      <div className="flex items-start gap-2.5 flex-1">
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                                        <span className="leading-relaxed">{narration}</span>
                                                      </div>
                                                      <TTSButton
                                                        text={narration}
                                                        lang={language === 'ar' ? 'ar' : language === 'am' ? 'am' : 'en'}
                                                        size="sm"
                                                        className="opacity-75 group-hover:opacity-100 flex-shrink-0"
                                                        tooltipText={language === 'ar' ? 'استماع للحديث الشريف' : 'Listen to narration'}
                                                      />
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            )}

                                            {/* Theological & Spiritual Benefits (Fawa'id) */}
                                            {points.length > 0 && (
                                              <div className="pt-2 border-t border-dashed border-slate-200 dark:border-slate-800">
                                                <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                                                  {language === 'ar' ? 'الفوائد الإيمانية والأحكام المستنبطة:' : 'Theological & Spiritual Insights (Fawa\'id):'}
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                  {points.map((pt, pIdx) => (
                                                    <button
                                                      key={pIdx}
                                                      type="button"
                                                      onClick={() => speak(pt, language === 'ar' ? 'ar' : language === 'am' ? 'am' : 'en')}
                                                      className="text-[11px] px-3 py-1 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-850 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 font-medium leading-relaxed hover:bg-emerald-200/80 dark:hover:bg-emerald-900/80 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                                                      title={language === 'ar' ? 'اضغط للاستماع لهذه الفائدة الإيمانية' : 'Click to listen to this insight'}
                                                    >
                                                      <span>✦ {pt}</span>
                                                      <Volume2 className="w-3 h-3 opacity-60 hover:opacity-100 flex-shrink-0" />
                                                    </button>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                </div>

                                {/* Vocabulary & Roots Breakdown (Predefined or Dynamic 114 Engine) */}
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                      {language === 'ar'
                                        ? 'تحليل المفردات وجذور الكلمات'
                                        : 'Root Vocabulary & Morphological Breakdown'}
                                    </h5>
                                    {isLoadingVocabulary && (
                                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold animate-pulse">
                                        <Activity className="w-3 h-3 animate-spin" />
                                        {language === 'ar' ? 'استخراج الجذور...' : 'Analyzing roots...'}
                                      </span>
                                    )}
                                  </div>

                                  {/* Dynamic 114 Vocabulary Engine */}
                                  {dynamicVocabulary.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                                      {dynamicVocabulary.map((w) => {
                                        const isSelectedDyn = selectedDynamicWord?.id === w.id;
                                        return (
                                          <div
                                            key={w.id}
                                            onClick={() => {
                                              setSelectedDynamicWord(w);
                                              setSelectedKeyword(null);
                                            }}
                                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                              isSelectedDyn
                                                ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/40 shadow-xs ring-1 ring-emerald-500'
                                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-300'
                                            }`}
                                          >
                                            <div className="flex items-center justify-between mb-1">
                                              <span
                                                dir="rtl"
                                                className="font-quran text-lg text-emerald-700 dark:text-emerald-400 font-bold"
                                              >
                                                {w.word}
                                              </span>
                                              <div className="flex items-center gap-1">
                                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100/70 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                                                  {w.root}
                                                </span>
                                                <TTSButton
                                                  text={w.word}
                                                  lang="ar"
                                                  size="sm"
                                                  className="h-6 w-6 p-1 border-0 bg-transparent hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                                                  tooltipText={language === 'ar' ? 'نطق الكلمة بالعربية' : 'Pronounce Arabic word'}
                                                />
                                              </div>
                                            </div>
                                            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                                              {w.transliteration}
                                            </div>
                                            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                              {getLocalizedText(w.meaning)}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : selectedSegment.keywords && selectedSegment.keywords.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                      {selectedSegment.keywords.map((kw) => {
                                        const isSelectedKw = selectedKeyword?.id === kw.id;
                                        return (
                                          <div
                                            key={kw.id}
                                            onClick={() => {
                                              setSelectedKeyword(kw);
                                              setSelectedDynamicWord(null);
                                            }}
                                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                              isSelectedKw
                                                ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 shadow-xs ring-1 ring-emerald-500'
                                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-300'
                                            }`}
                                          >
                                            <div className="flex items-center justify-between mb-1">
                                              <div
                                                dir="rtl"
                                                className="font-quran text-lg text-emerald-700 dark:text-emerald-400 font-bold"
                                              >
                                                {kw.arabic}
                                              </div>
                                              <TTSButton
                                                text={kw.arabic}
                                                lang="ar"
                                                size="sm"
                                                className="h-6 w-6 p-1 border-0 bg-transparent hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                                                tooltipText={language === 'ar' ? 'نطق الكلمة بالعربية' : 'Pronounce Arabic word'}
                                              />
                                            </div>
                                            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                                              {kw.word}
                                            </div>
                                            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                              {getLocalizedText(kw.meaning)}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <div className="p-3 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                                      {language === 'ar'
                                        ? 'اضغط على أسباب النزول أو زر الذكاء الاصطناعي لتوليد تحليل المفردات'
                                        : 'Click Gemini AI Insight for full word-by-word morphological analysis'}
                                    </div>
                                  )}
                                </div>

                                {/* Selected Dynamic Word Inspection Card */}
                                {selectedDynamicWord && (
                                  <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2.5">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase">
                                          {language === 'ar' ? 'الجذر الثلاثي:' : 'Arabic Root:'}
                                        </span>
                                        <span className="font-mono text-sm font-bold bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 text-emerald-600">
                                          {selectedDynamicWord.root}
                                        </span>
                                        <TTSButton
                                          text={selectedDynamicWord.root}
                                          lang="ar"
                                          size="sm"
                                          tooltipText={language === 'ar' ? 'استماع لنطق الجذر' : 'Pronounce Arabic root'}
                                        />
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                          {selectedDynamicWord.type}
                                        </span>
                                        <TTSButton
                                          text={selectedDynamicWord.word}
                                          lang="ar"
                                          size="sm"
                                          tooltipText={language === 'ar' ? 'نطق الكلمة' : 'Pronounce word'}
                                        />
                                      </div>
                                    </div>

                                    <div className="flex items-start justify-between gap-2 text-xs text-slate-700 dark:text-slate-200 font-semibold pt-1">
                                      <span className="flex-1">{getLocalizedText(selectedDynamicWord.meaning)}</span>
                                      <TTSButton
                                        text={getLocalizedText(selectedDynamicWord.meaning)}
                                        lang={language === 'ar' ? 'ar' : language === 'am' ? 'am' : 'en'}
                                        size="sm"
                                        tooltipText={language === 'ar' ? 'استماع لمعنى الكلمة' : 'Listen to word meaning'}
                                      />
                                    </div>

                                    {selectedDynamicWord.contextNote && (
                                      <div className="flex items-start justify-between gap-2 text-xs text-slate-600 dark:text-slate-400 italic pt-1 border-t border-emerald-200/60 dark:border-emerald-900/40">
                                        <p className="flex-1">{getLocalizedText(selectedDynamicWord.contextNote)}</p>
                                        <TTSButton
                                          text={getLocalizedText(selectedDynamicWord.contextNote)}
                                          lang={language === 'ar' ? 'ar' : language === 'am' ? 'am' : 'en'}
                                          size="sm"
                                          tooltipText={language === 'ar' ? 'استماع للشرح السياقي للمفردة' : 'Listen to contextual explanation'}
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Selected Predefined Root Keyword Inspection Card */}
                                {selectedKeyword && (
                                  <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2.5">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase">
                                          {language === 'ar' ? 'الجذر الثلاثي:' : 'Arabic Root:'}
                                        </span>
                                        <span className="font-mono text-sm font-bold bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 text-emerald-600">
                                          {selectedKeyword.root} ({selectedKeyword.rootTransliteration})
                                        </span>
                                        <TTSButton
                                          text={selectedKeyword.root}
                                          lang="ar"
                                          size="sm"
                                          tooltipText={language === 'ar' ? 'استماع لنطق الجذر' : 'Pronounce Root'}
                                        />
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                          {language === 'ar'
                                            ? selectedKeyword.morphology.ar
                                            : selectedKeyword.morphology.en}
                                        </span>
                                        <TTSButton
                                          text={selectedKeyword.arabic}
                                          lang="ar"
                                          size="sm"
                                          tooltipText={language === 'ar' ? 'نطق الكلمة' : 'Pronounce Word'}
                                        />
                                      </div>
                                    </div>

                                    <div className="flex items-start justify-between gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                                      <span className="flex-1">{getLocalizedText(selectedKeyword.meaning)}</span>
                                      <TTSButton
                                        text={getLocalizedText(selectedKeyword.meaning)}
                                        lang={language === 'ar' ? 'ar' : language === 'am' ? 'am' : 'en'}
                                        size="sm"
                                        tooltipText={language === 'ar' ? 'استماع لمعنى الكلمة' : 'Listen to word meaning'}
                                      />
                                    </div>

                                    <div className="space-y-1 pt-1 border-t border-emerald-200/60 dark:border-emerald-900/40">
                                      <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                                        {selectedKeyword.expansions.map((exp, idx) => (
                                          <li key={idx} className="flex items-center justify-between gap-2">
                                            <span>{exp}</span>
                                            <button
                                              type="button"
                                              onClick={() => speak(exp, language === 'ar' ? 'ar' : language === 'am' ? 'am' : 'en')}
                                              className="p-1 hover:text-emerald-600 text-slate-400 cursor-pointer"
                                              title="Listen"
                                            >
                                              <Volume2 className="w-3 h-3" />
                                            </button>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                )}
                                     </div>
                                ) : (
                                  <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                                    <Feather className="w-8 h-8 text-slate-400 mb-2" />
                                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                      {language === 'ar'
                                        ? 'اختر آية من القائمة لبدء التحليل اللغوي والتفسيري'
                                        : 'Select an Ayah from the left list to inspect its vocabulary and roots'}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 3: OBJECTIVES & OUTCOMES */}
                      {activeTab === 'objectives' && (
                        <div className="space-y-4">
                          <div className="bg-emerald-50/60 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                              🎯
                            </div>
                            <div>
                              <h5 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                                {language === 'ar' ? 'مخرجات التعلم المستهدفة' : 'Expected Learning Outcomes'}
                              </h5>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {language === 'ar'
                                  ? 'استكمل هذه الأهداف لتعميق الفهم والأداء العملي للتلاوة'
                                  : 'Master these key outcomes for both recitation and daily application'}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {currentModule.studyObjectives.map((obj, idx) => (
                              <div
                                key={idx}
                                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start gap-3"
                              >
                                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                  {idx + 1}
                                </div>
                                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                                  {getLocalizedText(obj)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* TAB 4: CENTRAL GLOSSARY LEDGER & SECTION 8 VOCABULARY SUBSYSTEM */}
                      {activeTab === 'glossary' && (
                        <div className="space-y-6">
                          <VocabularySubsystemSection
                            onSelectSegment={(seg) => {
                              setSelectedSegment(seg);
                              setActiveTab('segments');
                            }}
                          />
                        </div>
                      )}

                      {/* TAB 5: SAVED BOOKMARKS */}
                      {activeTab === 'bookmarks' && (
                        <div className="space-y-4">
                          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                                {language === 'ar' ? 'الآيات المحفوظة والمفضلة' : 'Saved Bookmarked Verses'}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {language === 'ar'
                                  ? 'انقر على الآية للانتقال المباشر إليها وتسليط الضوء عليها'
                                  : 'Click any verse to instantly jump and highlight it in the study module'}
                              </p>
                            </div>

                            {bookmarks.length > 0 && (
                              <button
                                onClick={() => setBookmarks([])}
                                className="text-xs text-rose-600 hover:underline font-semibold"
                              >
                                {language === 'ar' ? 'مسح الكل' : 'Clear All'}
                              </button>
                            )}
                          </div>

                          {bookmarks.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                              <Bookmark className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                              <p className="text-xs text-slate-500">
                                {language === 'ar'
                                  ? 'لا توجد آيات محفوظة حالياً. يمكنك حفظ الآيات أثناء الدراسة.'
                                  : 'No bookmarked verses yet. Click the bookmark icon next to any verse to save it.'}
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {bookmarks.map((bm) => (
                                <div
                                  key={bm.id}
                                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-500/50 transition-all"
                                >
                                  <div>
                                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                      Surah #{bm.surahNumber} • Ayah #{bm.verseNumber}
                                    </span>
                                    <div dir="rtl" className="font-quran text-lg text-slate-800 dark:text-slate-100 my-1">
                                      {bm.arabicText}
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-1">{bm.translation}</p>
                                  </div>

                                  <div className="flex items-center gap-2 self-end sm:self-center">
                                    <button
                                      onClick={() => handleJumpToBookmark(bm)}
                                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
                                    >
                                      {language === 'ar' ? 'انتقال للآية' : 'Go to Verse'}
                                    </button>

                                    <button
                                      onClick={() => setBookmarks((prev) => prev.filter((b) => b.id !== bm.id))}
                                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Audio Toolbar Footer */}
            <div className="px-4 sm:px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
              {/* Audio Controls */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  {language === 'ar' ? 'ضوابط التلاوة والتكرار:' : 'Recitation Tuning:'}
                </span>

                {/* Speed selector */}
                <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-xl text-xs">
                  <span className="text-[10px] text-slate-400">Speed:</span>
                  {[0.75, 1, 1.25, 1.5].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => handleSpeedChange(spd)}
                      className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                        playbackSpeed === spd
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                {/* Repeat selector */}
                <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-xl text-xs">
                  <span className="text-[10px] text-slate-400">Repeat:</span>
                  {[1, 3, 5, 'loop'].map((rpt) => (
                    <button
                      key={rpt.toString()}
                      onClick={() => setRepeatCount(rpt as any)}
                      className={`px-1.5 py-0.5 rounded font-bold capitalize transition-all ${
                        repeatCount === rpt
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {rpt === 'loop' ? '∞' : `${rpt}x`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Close Action */}
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-xs transition-colors"
              >
                {language === 'ar' ? 'إغلاق النافذة' : 'Close Portal'}
              </button>
            </div>
          </>
        )}

      </div>

      {/* Gemini AI Scholarly Insights Modal / Drawer */}
      {showAiModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-emerald-950 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-spin-slow" />
                <h3 className="font-bold text-base">
                  {language === 'ar' ? 'إشراقات وتفسير الذكاء الاصطناعي (Gemini Scholar)' : 'Gemini AI Scholarly Insights'}
                </h3>
              </div>
              <button onClick={() => setShowAiModal(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              {isGeminiLoading ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {language === 'ar'
                      ? 'جاري استخراج أسرار البلاغة والتفسير من كبار المفسرين...'
                      : 'Retrieving classical tafsir reflections & linguistic gems from Gemini AI...'}
                  </p>
                </div>
              ) : geminiResult ? (
                <div className="space-y-5 text-xs sm:text-sm">
                  {/* Scholarly Tafsir */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        {language === 'ar' ? 'التفسير التحليلي المقارن' : 'Scholarly Tafsir Analysis'}
                      </h4>
                      <TTSButton
                        text={geminiResult.scholarlyTafsir}
                        lang={language === 'ar' ? 'ar' : language === 'am' ? 'am' : 'en'}
                        size="sm"
                        tooltipText={language === 'ar' ? 'استماع للتفسير التحليلي' : 'Listen to Scholarly Tafsir'}
                      />
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                      {geminiResult.scholarlyTafsir}
                    </p>
                  </div>

                  {/* Linguistic Gems */}
                  <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <Tag className="w-4 h-4" />
                        {language === 'ar' ? 'الأسرار واللطائف اللغوية' : 'Linguistic Gems & Rhetoric'}
                      </h4>
                      <TTSButton
                        text={geminiResult.linguisticGems}
                        lang={language === 'ar' ? 'ar' : language === 'am' ? 'am' : 'en'}
                        size="sm"
                        tooltipText={language === 'ar' ? 'استماع للفوائد اللغوية' : 'Listen to Linguistic Gems'}
                      />
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                      {geminiResult.linguisticGems}
                    </p>
                  </div>

                  {/* Practical Lessons */}
                  <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        {language === 'ar' ? 'التطبيقات العملية والربط بالواقع' : 'Practical Life Lessons'}
                      </h4>
                      <TTSButton
                        text={geminiResult.practicalApplications}
                        lang={language === 'ar' ? 'ar' : language === 'am' ? 'am' : 'en'}
                        size="sm"
                        tooltipText={language === 'ar' ? 'استماع للتطبيقات العملية' : 'Listen to Practical Lessons'}
                      />
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                      {geminiResult.practicalApplications}
                    </p>
                  </div>

                  {/* Cross References */}
                  {geminiResult.relatedAyahs && geminiResult.relatedAyahs.length > 0 && (
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2">
                        {language === 'ar' ? 'الآيات والشواهد المترابطة في القرآن الكريم' : 'Thematic Quranic Cross-References'}
                      </h4>
                      <div className="space-y-2">
                        {geminiResult.relatedAyahs.map((rel, idx) => (
                          <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                            <div className="flex items-center justify-between text-xs font-bold text-emerald-600">
                              <span>{rel.surah} ({rel.verseRef})</span>
                            </div>
                            {rel.arabic && (
                              <div dir="rtl" className="font-quran text-base my-1 text-slate-800 dark:text-slate-100">
                                {rel.arabic}
                              </div>
                            )}
                            <p className="text-xs text-slate-500">{rel.themeConnection}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-right">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold"
              >
                {language === 'ar' ? 'إغلاق' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
