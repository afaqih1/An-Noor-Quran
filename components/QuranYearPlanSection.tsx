import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Check, CheckCircle2, Award, Sparkles, BookOpen, 
  Clock, Flame, ChevronRight, ChevronLeft, Volume2, VolumeX, Bookmark, 
  Share2, ArrowRight, Compass, GraduationCap, Search, Filter, Calendar, 
  HelpCircle, MessageSquare, Download, Settings, Heart, AlertCircle, 
  ExternalLink, Sun, Moon, Info, Book, FileText, CheckSquare, Square,
  SkipBack, SkipForward, Repeat, Repeat1, ListMusic, Loader2, Music,
  LayoutList, AlignLeft, Folder
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { 
  DayLesson, 
  WeekOverview, 
  QuarterOverview, 
  QUARTER_ROADMAP, 
  WEEKS_SYLLABUS, 
  ANCHOR_DAY_LESSONS, 
  getDayLesson, 
  UserPlanState, 
  DEFAULT_USER_PLAN_STATE, 
  LearningLevel,
  PlanCategory,
  QURAN_RECITERS,
  getEveryAyahUrl,
  QuranReciterOption,
  AyahDetail
} from './quranYearPlanData';
import {
  getIbnKathirExegesis,
  getSurahIbnKathirOverview,
  TAFSIR_IBN_KATHIR_LOCAL_PDF_URL,
  TAFSIR_IBN_KATHIR_FATIHA_LOCAL_PDF_URL,
  TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL,
  TafsirIbnKathirDetail
} from './tafsirIbnKathirData';

type ViewMode = 'session' | 'roadmap';
type SessionStage = 'recite' | 'understand' | 'reflect';

export const QuranYearPlanSection: React.FC = () => {
  const { language, t } = useLanguage();

  // Load user plan state from localStorage
  const [userState, setUserState] = useState<UserPlanState>(() => {
    try {
      const saved = localStorage.getItem('quran-year-plan-state');
      if (saved) {
        return { ...DEFAULT_USER_PLAN_STATE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error("Error reading quran-year-plan-state", e);
    }
    return DEFAULT_USER_PLAN_STATE;
  });

  // Active view mode
  const [viewMode, setViewMode] = useState<ViewMode>('session');
  
  // Selected day for session player
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(userState.currentDay || 1);
  const currentLesson: DayLesson = getDayLesson(selectedDayNumber);

  // 20-minute guided session state (5 - 10 - 5)
  // Stage 1: 5 min = 300s
  // Stage 2: 10 min = 600s
  // Stage 3: 5 min = 300s
  const [activeStage, setActiveStage] = useState<SessionStage>('recite');
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(300);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  
  // Audio state & continuous multi-ayah recitation engine
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [currentAyahIndex, setCurrentAyahIndex] = useState<number>(0);
  const [selectedReciter, setSelectedReciter] = useState<string>(() => {
    try {
      return localStorage.getItem('quran-companion-reciter') || 'Alafasy_128kbps';
    } catch {
      return 'Alafasy_128kbps';
    }
  });
  const [playbackMode, setPlaybackMode] = useState<'continuous' | 'repeat_ayah' | 'repeat_all'>('continuous');
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [isAudioBuffering, setIsAudioBuffering] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Synchronized refs to avoid stale closures in HTMLAudioElement event handlers
  const currentAyahIndexRef = useRef(currentAyahIndex);
  currentAyahIndexRef.current = currentAyahIndex;

  const playbackModeRef = useRef(playbackMode);
  playbackModeRef.current = playbackMode;

  const audioSpeedRef = useRef(audioSpeed);
  audioSpeedRef.current = audioSpeed;

  const selectedReciterRef = useRef(selectedReciter);
  selectedReciterRef.current = selectedReciter;

  const currentLessonRef = useRef(currentLesson);
  currentLessonRef.current = currentLesson;

  const isPlayingAudioRef = useRef(isPlayingAudio);
  isPlayingAudioRef.current = isPlayingAudio;

  // Settings & Display options
  const [showTransliteration, setShowTransliteration] = useState<boolean>(true);
  const [arabicTextScale, setArabicTextScale] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [verseDisplayMode, setVerseDisplayMode] = useState<'passage' | 'verse_by_verse'>('passage');
  const [selectedTranslationLang, setSelectedTranslationLang] = useState<'en' | 'ar' | 'am' | 'har'>(
    language as 'en' | 'ar' | 'am' | 'har' || 'en'
  );

  // Interactive tasks in current day
  const [actionDone, setActionDone] = useState<boolean>(false);
  const [userJournalNote, setUserJournalNote] = useState<string>('');
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [copiedDua, setCopiedDua] = useState<boolean>(false);

  // Modals
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(!userState.hasCompletedOnboarding);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState<boolean>(false);

  // Roadmap filters
  const [roadmapQuarterFilter, setRoadmapQuarterFilter] = useState<number>(0); // 0 = all
  const [roadmapSearchQuery, setRoadmapSearchQuery] = useState<string>('');
  const [roadmapCategoryFilter, setRoadmapCategoryFilter] = useState<string>('all');

  // Save state helper
  const persistState = (updater: (prev: UserPlanState) => UserPlanState) => {
    setUserState(prev => {
      const next = updater(prev);
      try {
        localStorage.setItem('quran-year-plan-state', JSON.stringify(next));
      } catch (e) {
        console.error("Error writing quran-year-plan-state", e);
      }
      return next;
    });
  };

  // Sync journal note & bookmarks on day change + full audio reset
  useEffect(() => {
    setUserJournalNote(userState.notesByDay[selectedDayNumber] || '');
    setIsBookmarked(userState.bookmarks.includes(selectedDayNumber));
    setActionDone(false);
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
    setActiveStage('recite');
    setTimerSecondsLeft(300);
    setIsTimerRunning(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.ontimeupdate = null;
      audioRef.current.onloadedmetadata = null;
      audioRef.current.onerror = null;
      audioRef.current.onwaiting = null;
      audioRef.current.onplaying = null;
      audioRef.current = null;
    }
    setIsPlayingAudio(false);
    setCurrentAyahIndex(0);
    setAudioCurrentTime(0);
    setAudioDuration(0);
    setIsAudioBuffering(false);
  }, [selectedDayNumber]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Stage timer change logic
  const handleStageSelect = (stage: SessionStage) => {
    setActiveStage(stage);
    setIsTimerRunning(false);
    if (stage === 'recite') setTimerSecondsLeft(300);
    else if (stage === 'understand') setTimerSecondsLeft(600);
    else if (stage === 'reflect') setTimerSecondsLeft(300);
  };

  // Timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSecondsLeft]);

  // Format time mm:ss
  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Format audio seconds m:ss
  const formatAudioTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Stage progress percent
  const getStageTotalSeconds = (stage: SessionStage) => (stage === 'understand' ? 600 : 300);
  const stageElapsedSeconds = getStageTotalSeconds(activeStage) - timerSecondsLeft;
  const stageProgressPct = Math.min(100, Math.max(0, (stageElapsedSeconds / getStageTotalSeconds(activeStage)) * 100));

  // Core Play Ayah function with automatic sequential progression
  const playAyahAtIndex = (index: number, autoPlay: boolean = true) => {
    const lesson = currentLessonRef.current;
    const verses = (lesson.verseNumbers && lesson.verseNumbers.length > 0) 
      ? lesson.verseNumbers 
      : [1];
    const safeIndex = Math.max(0, Math.min(verses.length - 1, index));
    const targetVerseNum = verses[safeIndex];
    const reciter = selectedReciterRef.current;
    const url = getEveryAyahUrl(lesson.surahNumber || 1, targetVerseNum, reciter);

    // Stop and unbind old audio instance
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.ontimeupdate = null;
      audioRef.current.onloadedmetadata = null;
      audioRef.current.onerror = null;
      audioRef.current.onwaiting = null;
      audioRef.current.onplaying = null;
    }

    const audio = new Audio(url);
    audioRef.current = audio;
    audio.playbackRate = audioSpeedRef.current;
    setCurrentAyahIndex(safeIndex);
    setAudioCurrentTime(0);
    setAudioDuration(0);

    audio.onwaiting = () => setIsAudioBuffering(true);
    audio.onplaying = () => {
      setIsAudioBuffering(false);
      setIsPlayingAudio(true);
    };

    audio.onloadedmetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setAudioDuration(audio.duration);
      }
    };

    audio.ontimeupdate = () => {
      setAudioCurrentTime(audio.currentTime);
    };

    audio.onerror = (e) => {
      console.warn("Audio error on Ayah", targetVerseNum, e);
      setIsAudioBuffering(false);
      // If error occurs in continuous mode, try continuing to next Ayah
      const nextIdx = currentAyahIndexRef.current + 1;
      const total = (currentLessonRef.current.verseNumbers || []).length;
      if (playbackModeRef.current === 'continuous' && nextIdx < total) {
        setTimeout(() => playAyahAtIndex(nextIdx, true), 400);
      } else {
        setIsPlayingAudio(false);
      }
    };

    // Continuous recitation progression handler
    audio.onended = () => {
      const mode = playbackModeRef.current;
      const cIndex = currentAyahIndexRef.current;
      const allVerses = (currentLessonRef.current.verseNumbers && currentLessonRef.current.verseNumbers.length > 0)
        ? currentLessonRef.current.verseNumbers
        : [1];

      if (mode === 'repeat_ayah') {
        // Loop current Ayah
        audio.currentTime = 0;
        audio.play().catch(err => console.error("Repeat ayah error:", err));
      } else if (cIndex < allVerses.length - 1) {
        // Continuous auto-advance: Recite next Ayah!
        const nextIdx = cIndex + 1;
        playAyahAtIndex(nextIdx, true);
      } else {
        // Reached end of lesson portion
        if (mode === 'repeat_all') {
          // Loop entire lesson from start
          playAyahAtIndex(0, true);
        } else {
          // Completed portion
          setIsPlayingAudio(false);
          setCurrentAyahIndex(0);
          setAudioCurrentTime(0);
        }
      }
    };

    if (autoPlay) {
      setIsAudioBuffering(true);
      audio.play()
        .then(() => {
          setIsPlayingAudio(true);
          setIsAudioBuffering(false);
        })
        .catch(err => {
          console.error("Audio playback error:", err);
          setIsPlayingAudio(false);
          setIsAudioBuffering(false);
        });
    } else {
      setIsPlayingAudio(false);
    }
  };

  // Toggle Audio Play / Pause
  const toggleAudio = () => {
    if (isPlayingAudio) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlayingAudio(false);
    } else {
      if (audioRef.current && audioRef.current.src && audioRef.current.currentTime > 0 && !audioRef.current.ended) {
        audioRef.current.playbackRate = audioSpeed;
        audioRef.current.play()
          .then(() => setIsPlayingAudio(true))
          .catch(err => {
            console.error("Resume audio error:", err);
            playAyahAtIndex(currentAyahIndex, true);
          });
      } else {
        playAyahAtIndex(currentAyahIndex, true);
      }
    }
  };

  // Jump to specific Ayah
  const jumpToAyah = (index: number) => {
    playAyahAtIndex(index, true);
  };

  // Advance to next Ayah
  const goToNextAyah = () => {
    const verses = currentLesson.verseNumbers || [1];
    if (currentAyahIndex < verses.length - 1) {
      const nextIdx = currentAyahIndex + 1;
      playAyahAtIndex(nextIdx, isPlayingAudio);
    }
  };

  // Go to previous Ayah or rewind
  const goToPrevAyah = () => {
    if (audioRef.current && audioRef.current.currentTime > 2) {
      audioRef.current.currentTime = 0;
      setAudioCurrentTime(0);
    } else if (currentAyahIndex > 0) {
      const prevIdx = currentAyahIndex - 1;
      playAyahAtIndex(prevIdx, isPlayingAudio);
    }
  };

  // Restart from Ayah 1
  const restartRecitation = () => {
    playAyahAtIndex(0, true);
  };

  // Change reciter
  const handleReciterChange = (newReciterId: string) => {
    setSelectedReciter(newReciterId);
    try {
      localStorage.setItem('quran-companion-reciter', newReciterId);
    } catch (e) {
      console.error(e);
    }
    if (isPlayingAudio) {
      setTimeout(() => {
        playAyahAtIndex(currentAyahIndexRef.current, true);
      }, 50);
    } else if (audioRef.current) {
      playAyahAtIndex(currentAyahIndexRef.current, false);
    }
  };

  // Change playback speed
  const changeSpeed = (speed: number) => {
    setAudioSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  // Seek bar handler
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !audioDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * audioDuration;
    audioRef.current.currentTime = newTime;
    setAudioCurrentTime(newTime);
  };

  // Complete day handler
  const handleCompleteDay = () => {
    const todayStr = new Date().toDateString();
    persistState(prev => {
      const isAlreadyCompleted = prev.completedDays.includes(selectedDayNumber);
      const newCompletedDays = isAlreadyCompleted 
        ? prev.completedDays 
        : [...prev.completedDays, selectedDayNumber];

      let newStreak = prev.streak;
      if (!isAlreadyCompleted) {
        if (prev.lastCompletedDate === todayStr) {
          // already incremented streak today
        } else {
          newStreak = prev.streak + 1;
        }
      }

      const nextDay = Math.min(365, selectedDayNumber + 1);

      return {
        ...prev,
        completedDays: newCompletedDays,
        streak: newStreak,
        lastCompletedDate: todayStr,
        totalMinutesLearned: prev.totalMinutesLearned + (isAlreadyCompleted ? 0 : 20),
        currentDay: nextDay
      };
    });

    setIsCompletionModalOpen(true);
  };

  // Save journal note
  const handleSaveNote = () => {
    persistState(prev => ({
      ...prev,
      notesByDay: {
        ...prev.notesByDay,
        [selectedDayNumber]: userJournalNote
      }
    }));
  };

  // Toggle bookmark
  const toggleBookmark = () => {
    const nextBookmarked = !isBookmarked;
    setIsBookmarked(nextBookmarked);
    persistState(prev => {
      const currentList = prev.bookmarks;
      const newList = nextBookmarked 
        ? [...currentList, selectedDayNumber]
        : currentList.filter(d => d !== selectedDayNumber);
      return {
        ...prev,
        bookmarks: newList
      };
    });
  };

  // Copy dua
  const handleCopyDua = () => {
    const text = `${currentLesson.reflection.quranicDua.arabic}\n\n${currentLesson.reflection.quranicDua.transliteration}\n\n"${currentLesson.reflection.quranicDua.translation.en}" (${currentLesson.reflection.quranicDua.reference})\n\n— 1-Year Quran Learning Companion`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedDua(true);
      setTimeout(() => setCopiedDua(false), 2500);
    });
  };

  // Font scale class with anti-overlapping line spacing
  const getArabicScaleClass = () => {
    if (arabicTextScale === 'large') return 'text-3xl sm:text-4xl !leading-[2.7]';
    if (arabicTextScale === 'xlarge') return 'text-4xl sm:text-5xl !leading-[2.9]';
    return 'text-2xl sm:text-3xl !leading-[2.6]';
  };

  // Arabic numeral converter for verse markers
  const toArabicDigits = (n: number | string): string => {
    const eastern = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(n).split('').map(d => eastern[parseInt(d, 10)] ?? d).join('');
  };

  // Filtered weeks for roadmap
  const filteredWeeks = WEEKS_SYLLABUS.filter(w => {
    if (roadmapQuarterFilter !== 0 && w.quarter !== roadmapQuarterFilter) return false;
    if (roadmapCategoryFilter !== 'all' && w.category !== roadmapCategoryFilter) return false;
    if (roadmapSearchQuery.trim()) {
      const q = roadmapSearchQuery.toLowerCase();
      const matchTitle = w.title.en.toLowerCase().includes(q) || w.title.ar.includes(q);
      const matchSurah = w.surahFocus.toLowerCase().includes(q);
      const matchDays = w.days.some(d => d.toString() === q || `day ${d}`.includes(q));
      return matchTitle || matchSurah || matchDays;
    }
    return true;
  });

  const completionPercent = Math.round((userState.completedDays.length / 365) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Explicit Quran Typography Stylesheet Prioritizing 'Amiri Quran' */}
      <style>{`
        .quran-uthmani-text,
        .font-arabic,
        .font-quran {
          font-family: 'Amiri Quran', 'Amiri', 'Scheherazade New', 'Noto Naskh Arabic', 'Traditional Arabic', serif !important;
          font-feature-settings: "cv01" on, "cv02" on, "cv03" on, "ss01" on, "anum" on;
          font-variant-numeric: tabular-nums;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
        }
        .quran-ayah-marker {
          font-family: 'Amiri Quran', 'Amiri', 'Scheherazade New', 'Noto Naskh Arabic', serif !important;
          font-feature-settings: "cv01" on, "ss01" on, "anum" on;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          user-select: none;
          vertical-align: middle;
        }
      `}</style>
      
      {/* 1. Header & Metric Summary Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-primary-950 to-emerald-950 border border-primary-500/20 text-white shadow-xl p-6 sm:p-8">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/20 border border-primary-400/30 text-emerald-300 text-xs font-bold tracking-wide uppercase">
                <GraduationCap size={13} className="text-secondary-400" />
                <span>1-Year Quran Mastery • 20 Min / Day</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 text-xs font-semibold">
                <Sparkles size={11} />
                <span>52 Structured Weeks • 365 Days</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">
              {language === 'ar' ? 'منهج تدبر وإتقان القرآن في عام كامل' : 'The 1-Year Quran Mastery Companion'}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {language === 'ar'
                ? 'نظام الـ ٢٠ دقيقة اليومي: ٥ دقائق تلاوة وتجويد، ١٠ دقائق فهم ومفردات وتفسير، و٥ دقائق تدبر وعمل ودعاء.'
                : 'A transformative daily 20-minute pedagogical system: 5 minutes Recitation & Tajweed, 10 minutes Vocabulary & Tafsir, and 5 minutes Tadabbur reflection & Quranic Dua.'}
            </p>
          </div>

          {/* Quick Metrics Badge Hub */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Streak Card */}
            <div className="flex-1 sm:flex-none flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Flame size={20} className="fill-amber-400 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {language === 'ar' ? 'التتابع اليومي' : 'Active Streak'}
                </span>
                <span className="text-lg font-bold text-white leading-none">
                  {userState.streak} {language === 'ar' ? 'أيام' : 'Days'}
                </span>
              </div>
            </div>

            {/* Completed Days */}
            <div className="flex-1 sm:flex-none flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {language === 'ar' ? 'الأيام المنجزة' : 'Progress'}
                </span>
                <span className="text-lg font-bold text-white leading-none">
                  {userState.completedDays.length} / 365
                </span>
              </div>
            </div>

            {/* Total Minutes */}
            <div className="flex-1 sm:flex-none flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                <Clock size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {language === 'ar' ? 'الوقت المستثمر' : 'Total Time'}
                </span>
                <span className="text-lg font-bold text-white leading-none">
                  {Math.floor(userState.totalMinutesLearned / 60)}h {userState.totalMinutesLearned % 60}m
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar Across the 365 Days */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <span>{language === 'ar' ? 'إجمالي التقدم في الخطة السنوية' : 'Annual Curriculum Progress'}</span>
              <span className="text-emerald-400 font-bold">({completionPercent}%)</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="flex items-center gap-1 text-[11px] text-secondary-300 hover:text-white transition-colors cursor-pointer"
                title="Personalize learning level & reminders"
              >
                <Settings size={12} />
                <span>{language === 'ar' ? 'إعدادات الخطة' : 'Preferences'}</span>
              </button>
            </div>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-800/80 overflow-hidden relative border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-700 rounded-full"
              style={{ width: `${Math.max(2, completionPercent)}%` }}
            />
          </div>

          {/* Quarter Indicators */}
          <div className="grid grid-cols-4 text-center text-[10px] text-slate-400 pt-1">
            <span className={userState.completedDays.length >= 1 ? 'text-emerald-400 font-bold' : ''}>Q1: Foundations</span>
            <span className={userState.completedDays.length >= 92 ? 'text-amber-400 font-bold' : ''}>Q2: Wisdom</span>
            <span className={userState.completedDays.length >= 183 ? 'text-sky-400 font-bold' : ''}>Q3: Light</span>
            <span className={userState.completedDays.length >= 274 ? 'text-purple-400 font-bold' : ''}>Q4: Khatam</span>
          </div>
        </div>
      </div>

      {/* 2. Dual-View Mode Switcher Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-secondary-200 dark:border-slate-800 shadow-sm">
        
        {/* View Mode Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setViewMode('session')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer select-none
              ${viewMode === 'session'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <Clock size={14} />
            <span>{language === 'ar' ? 'جلسة الـ ٢٠ دقيقة التفاعلية' : '20-Min Guided Session'}</span>
          </button>

          <button
            onClick={() => setViewMode('roadmap')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer select-none
              ${viewMode === 'roadmap'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <Calendar size={14} />
            <span>{language === 'ar' ? 'خريطة الـ ٥٢ أسبوعاً السنوية' : '52-Week Curriculum Roadmap'}</span>
          </button>
        </div>

        {/* Day Quick Navigation Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setSelectedDayNumber(prev => Math.max(1, prev - 1))}
            disabled={selectedDayNumber <= 1}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer select-none"
            title="Previous Day"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500 font-semibold">{language === 'ar' ? 'اليوم' : 'Day'}</span>
            <select
              value={selectedDayNumber}
              onChange={(e) => setSelectedDayNumber(Number(e.target.value))}
              className="bg-transparent font-bold text-xs text-primary-700 dark:text-emerald-400 focus:outline-hidden cursor-pointer"
            >
              {Array.from({ length: 365 }, (_, i) => i + 1).map(d => (
                <option key={d} value={d} className="dark:bg-slate-900">
                  {d} {userState.completedDays.includes(d) ? '✓' : ''}
                </option>
              ))}
            </select>
            <span className="text-xs text-slate-400">/ 365</span>
          </div>

          <button
            onClick={() => setSelectedDayNumber(prev => Math.min(365, prev + 1))}
            disabled={selectedDayNumber >= 365}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer select-none"
            title="Next Day"
          >
            <ChevronRight size={16} />
          </button>

          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-xl border transition-colors cursor-pointer select-none
              ${isBookmarked 
                ? 'bg-amber-500/10 border-amber-400 text-amber-500' 
                : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600'}`}
            title="Bookmark Day Lesson"
          >
            <Bookmark size={16} className={isBookmarked ? 'fill-current' : ''} />
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW MODE 1: 20-MINUTE GUIDED SESSION PLAYER
          ========================================================================= */}
      {viewMode === 'session' && (
        <div className="space-y-6">
          
          {/* Today's Mission Card & Stage Flow Bar */}
          <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-secondary-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-emerald-400 text-xs font-bold">
                    Week {currentLesson.weekNumber} • Day {currentLesson.dayNumber}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {currentLesson.surahName.en} ({currentLesson.verseRange})
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-850 dark:text-slate-100 mt-1">
                  {currentLesson.title[language as keyof typeof currentLesson.title] || currentLesson.title.en}
                </h2>
              </div>

              {/* 5-10-5 Live Countdown Timer Widget */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 w-full md:w-auto justify-between md:justify-start">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <Clock size={11} className={isTimerRunning ? 'text-emerald-500 animate-spin' : ''} />
                    <span>Stage Timer</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-slate-800 dark:text-white tracking-tight">
                    {formatTimer(timerSecondsLeft)}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white transition-all shadow-xs cursor-pointer select-none
                      ${isTimerRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-primary-600 hover:bg-primary-700'}`}
                    title={isTimerRunning ? "Pause Countdown" : "Start Countdown"}
                  >
                    {isTimerRunning ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
                  </button>

                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerSecondsLeft(getStageTotalSeconds(activeStage));
                    }}
                    className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200/60 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition-colors cursor-pointer select-none"
                    title="Reset Stage Timer"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* 3 Pedagogical Stage Tabs (5m Recite | 10m Understand | 5m Reflect) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Stage 1 Tab */}
              <button
                onClick={() => handleStageSelect('recite')}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer select-none
                  ${activeStage === 'recite'
                    ? 'bg-emerald-500/10 border-emerald-400/80 text-emerald-900 dark:text-emerald-300 shadow-sm ring-2 ring-emerald-500/20'
                    : 'bg-slate-50/70 dark:bg-slate-850 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                    5 Minutes
                  </span>
                  <BookOpen size={15} className="text-emerald-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100 mt-2">
                  1. Recitation & Tajweed
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  تلاوة الآيات وأحكام التجويد
                </p>
                {activeStage === 'recite' && (
                  <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-300" style={{ width: `${stageProgressPct}%` }} />
                )}
              </button>

              {/* Stage 2 Tab */}
              <button
                onClick={() => handleStageSelect('understand')}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer select-none
                  ${activeStage === 'understand'
                    ? 'bg-amber-500/10 border-amber-400/80 text-amber-900 dark:text-amber-300 shadow-sm ring-2 ring-amber-500/20'
                    : 'bg-slate-50/70 dark:bg-slate-850 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300">
                    10 Minutes
                  </span>
                  <GraduationCap size={15} className="text-amber-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100 mt-2">
                  2. Vocabulary & Tafsir
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  المفردات القرآنية والمعنى البياني
                </p>
                {activeStage === 'understand' && (
                  <div className="absolute bottom-0 left-0 h-1 bg-amber-500 transition-all duration-300" style={{ width: `${stageProgressPct}%` }} />
                )}
              </button>

              {/* Stage 3 Tab */}
              <button
                onClick={() => handleStageSelect('reflect')}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer select-none
                  ${activeStage === 'reflect'
                    ? 'bg-sky-500/10 border-sky-400/80 text-sky-900 dark:text-sky-300 shadow-sm ring-2 ring-sky-500/20'
                    : 'bg-slate-50/70 dark:bg-slate-850 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-700 dark:text-sky-300">
                    5 Minutes
                  </span>
                  <Heart size={15} className="text-sky-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100 mt-2">
                  3. Reflection & Dua
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  التدبر القلبي والعمل والدعاء
                </p>
                {activeStage === 'reflect' && (
                  <div className="absolute bottom-0 left-0 h-1 bg-sky-500 transition-all duration-300" style={{ width: `${stageProgressPct}%` }} />
                )}
              </button>
            </div>

            {/* Stage Body Content */}
            <div className="pt-2">
              
              {/* ---------------- STAGE 1: RECITATION & TAJWEED ---------------- */}
              {activeStage === 'recite' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Multi-Ayah Continuous Recitation Control Center */}
                  {(() => {
                    const currentVerses = (currentLesson.verseNumbers && currentLesson.verseNumbers.length > 0)
                      ? currentLesson.verseNumbers
                      : [1];
                    const currentAyahNumber = currentVerses[currentAyahIndex] || currentVerses[0];
                    const selectedReciterData = QURAN_RECITERS.find(r => r.id === selectedReciter) || QURAN_RECITERS[0];
                    const progressPercent = audioDuration > 0 ? (audioCurrentTime / audioDuration) * 100 : 0;

                    return (
                      <div className="space-y-4">
                        {/* Main Audio Player Card */}
                        <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-850 dark:via-slate-900 dark:to-emerald-950/20 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
                          
                          {/* Top Bar: Reciting Status & Reciter / Controls */}
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
                            <div className="flex items-center gap-2.5">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all
                                ${isPlayingAudio 
                                  ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700' 
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                              >
                                {isPlayingAudio ? (
                                  <>
                                    <span className="flex items-end gap-0.5 h-3">
                                      <span className="w-0.5 h-3 bg-emerald-600 dark:bg-emerald-400 animate-pulse rounded-full" />
                                      <span className="w-0.5 h-2 bg-emerald-600 dark:bg-emerald-400 animate-pulse delay-75 rounded-full" />
                                      <span className="w-0.5 h-3.5 bg-emerald-600 dark:bg-emerald-400 animate-pulse delay-150 rounded-full" />
                                    </span>
                                    <span>Reciting Ayah {currentAyahNumber} ({currentAyahIndex + 1} of {currentVerses.length})</span>
                                  </>
                                ) : (
                                  <>
                                    <Volume2 size={13} className="text-slate-500" />
                                    <span>Ayah {currentAyahNumber} ({currentAyahIndex + 1} of {currentVerses.length})</span>
                                  </>
                                )}
                              </span>

                              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 hidden sm:inline">
                                Surah {currentLesson.surahName.en} ({currentLesson.surahNumber}:{currentAyahNumber})
                              </span>
                            </div>

                            {/* Settings & Display Options */}
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Reciter Selector */}
                              <div className="relative">
                                <select
                                  value={selectedReciter}
                                  onChange={(e) => handleReciterChange(e.target.value)}
                                  className="text-xs font-bold pl-2.5 pr-7 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer appearance-none shadow-2xs"
                                  title="Select Quran Reciter"
                                >
                                  {QURAN_RECITERS.map(rec => (
                                    <option key={rec.id} value={rec.id}>
                                      🎙️ {rec.name} ({rec.style})
                                    </option>
                                  ))}
                                </select>
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
                                  ▼
                                </span>
                              </div>

                              {/* Playback Mode (Continuous / Repeat Ayah / Repeat All) */}
                              <button
                                onClick={() => {
                                  if (playbackMode === 'continuous') setPlaybackMode('repeat_ayah');
                                  else if (playbackMode === 'repeat_ayah') setPlaybackMode('repeat_all');
                                  else setPlaybackMode('continuous');
                                }}
                                className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer select-none
                                  ${playbackMode === 'continuous'
                                    ? 'bg-primary-50 dark:bg-primary-950/60 border-primary-300 dark:border-primary-800 text-primary-700 dark:text-emerald-300'
                                    : playbackMode === 'repeat_ayah'
                                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
                                    : 'bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300'}`}
                                title={`Mode: ${
                                  playbackMode === 'continuous'
                                    ? 'Continuous Auto-Advance (Plays all Ayahs sequentially)'
                                    : playbackMode === 'repeat_ayah'
                                    ? 'Repeat Current Ayah (Loop selected Ayah)'
                                    : 'Repeat All (Loop entire lesson portion)'
                                }`}
                              >
                                {playbackMode === 'continuous' && <ListMusic size={13} />}
                                {playbackMode === 'repeat_ayah' && <Repeat1 size={13} />}
                                {playbackMode === 'repeat_all' && <Repeat size={13} />}
                                <span className="hidden md:inline">
                                  {playbackMode === 'continuous' && 'Auto-Advance'}
                                  {playbackMode === 'repeat_ayah' && 'Loop Ayah'}
                                  {playbackMode === 'repeat_all' && 'Loop Portion'}
                                </span>
                              </button>

                              {/* Playback Speed */}
                              <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                                {[0.75, 1.0, 1.25, 1.5].map(s => (
                                  <button
                                    key={s}
                                    onClick={() => changeSpeed(s)}
                                    className={`px-1.5 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer select-none
                                      ${audioSpeed === s ? 'bg-primary-600 text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                                    title={`Playback speed ${s}x`}
                                  >
                                    {s}x
                                  </button>
                                ))}
                              </div>

                              {/* Transliteration toggle */}
                              <button
                                onClick={() => setShowTransliteration(!showTransliteration)}
                                className={`text-xs font-semibold px-2 py-1 rounded-lg border transition-colors cursor-pointer select-none
                                  ${showTransliteration 
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-700 dark:text-emerald-400' 
                                    : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}
                                title="Toggle Phonetic Transliteration"
                              >
                                Ph {showTransliteration ? 'ON' : 'OFF'}
                              </button>

                              {/* Font size */}
                              <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                                {(['normal', 'large', 'xlarge'] as const).map(scale => (
                                  <button
                                    key={scale}
                                    onClick={() => setArabicTextScale(scale)}
                                    className={`w-6 h-6 flex items-center justify-center rounded-md text-[10px] font-bold transition-colors cursor-pointer select-none
                                      ${arabicTextScale === scale 
                                        ? 'bg-primary-600 text-white' 
                                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                                    title={`Font scale: ${scale}`}
                                  >
                                    {scale === 'normal' ? 'A' : scale === 'large' ? 'A+' : 'A++'}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Controls Row: Previous, Play/Pause, Next, Restart + Progress Bar */}
                          <div className="flex flex-col sm:flex-row items-center gap-4">
                            {/* Buttons */}
                            <div className="flex items-center gap-2">
                              {/* Previous Ayah */}
                              <button
                                onClick={goToPrevAyah}
                                disabled={currentAyahIndex === 0 && (!audioRef.current || audioRef.current.currentTime <= 2)}
                                className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
                                title="Previous Ayah"
                              >
                                <SkipBack size={15} />
                              </button>

                              {/* Main Play / Pause Button */}
                              <button
                                onClick={toggleAudio}
                                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer select-none
                                  ${isPlayingAudio
                                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white ring-2 ring-amber-400/30'
                                    : 'bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-700 hover:to-emerald-700 text-white shadow-emerald-600/20'}`}
                                title={isPlayingAudio ? "Pause Audio Recitation" : "Listen to Recitation (All Verses)"}
                              >
                                {isAudioBuffering ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : isPlayingAudio ? (
                                  <Pause size={16} />
                                ) : (
                                  <Play size={16} className="fill-current" />
                                )}
                                <span>{isPlayingAudio ? "Pause Recitation" : "Recite All Verses"}</span>
                              </button>

                              {/* Next Ayah */}
                              <button
                                onClick={goToNextAyah}
                                disabled={currentAyahIndex >= currentVerses.length - 1}
                                className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
                                title="Next Ayah"
                              >
                                <SkipForward size={15} />
                              </button>

                              {/* Restart Recitation from Ayah 1 */}
                              <button
                                onClick={restartRecitation}
                                className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 transition-all cursor-pointer shadow-2xs"
                                title="Restart from Ayah 1"
                              >
                                <RotateCcw size={14} />
                              </button>
                            </div>

                            {/* Seek Scrubber & Time */}
                            <div className="flex-1 w-full space-y-1">
                              <div
                                onClick={handleSeek}
                                className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden cursor-pointer relative group"
                                title="Click to seek within Ayah"
                              >
                                <div 
                                  className="h-full bg-gradient-to-r from-primary-500 to-emerald-400 rounded-full transition-all duration-100 relative"
                                  style={{ width: `${progressPercent}%` }}
                                >
                                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-primary-600 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400">
                                <span>{formatAudioTime(audioCurrentTime)}</span>
                                <span className="font-sans text-[11px] text-slate-600 dark:text-slate-300 font-semibold">
                                  {selectedReciterData.name} ({selectedReciterData.style})
                                </span>
                                <span>{formatAudioTime(audioDuration)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Interactive Ayah Navigation Strip (1-click jump to any Ayah in today's lesson) */}
                          <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-1">
                                Daily Ayahs:
                              </span>
                              {currentVerses.map((verseNum, idx) => {
                                const isActive = currentAyahIndex === idx;
                                return (
                                  <button
                                    key={verseNum}
                                    onClick={() => jumpToAyah(idx)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none
                                      ${isActive
                                        ? 'bg-gradient-to-r from-emerald-600 to-primary-600 text-white shadow-xs ring-2 ring-emerald-500/30'
                                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'}`}
                                    title={`Play Ayah ${verseNum}`}
                                  >
                                    {isActive && isPlayingAudio ? (
                                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                                    ) : (
                                      <Play size={10} className={isActive ? "fill-white" : "fill-slate-400"} />
                                    )}
                                    <span>Ayah {verseNum}</span>
                                    <span className={`text-[10px] font-normal ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                                      ({currentLesson.surahNumber}:{verseNum})
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Sacred Text Display Container */}
                        <div className="space-y-4">
                          
                          {/* Top Action Bar: Active Ayah Banner & View Mode Toggle */}
                          <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs font-bold text-amber-900 dark:text-amber-300 shadow-2xs">
                              <Sparkles size={13} className="text-amber-600 dark:text-amber-400" />
                              <span>
                                {isPlayingAudio 
                                  ? `Currently Reciting: Ayah ${currentAyahNumber} • Surah ${currentLesson.surahName.en} (${currentLesson.surahNumber}:${currentAyahNumber})`
                                  : `Selected: Ayah ${currentAyahNumber} • Surah ${currentLesson.surahName.en} (${currentLesson.surahNumber}:${currentAyahNumber})`}
                              </span>
                            </div>

                            {/* View Switcher: Continuous Passage vs Individual Ayahs */}
                            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                              <button
                                onClick={() => setVerseDisplayMode('passage')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
                                  verseDisplayMode === 'passage'
                                    ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-primary-300 shadow-xs'
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                }`}
                                title="Continuous Passage (المصحف الشريف)"
                              >
                                <AlignLeft size={13} />
                                <span>Passage Flow</span>
                              </button>
                              <button
                                onClick={() => setVerseDisplayMode('verse_by_verse')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
                                  verseDisplayMode === 'verse_by_verse'
                                    ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-primary-300 shadow-xs'
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                }`}
                                title="Verse by Verse Cards (آية آية)"
                              >
                                <LayoutList size={13} />
                                <span>Individual Ayahs</span>
                              </button>
                            </div>
                          </div>

                          {/* Mode 1: Continuous Passage Flow */}
                          {verseDisplayMode === 'passage' ? (
                            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-amber-50/50 via-white to-amber-50/20 dark:from-slate-850 dark:via-slate-900 dark:to-slate-850 border border-amber-200/60 dark:border-slate-800 text-center shadow-xs space-y-5">
                              
                              {/* Opening Noble Basmalah when reciting from beginning of a Surah (Except Surah 1 & Surah 9) */}
                              {currentLesson.verseNumbers[0] === 1 && currentLesson.surahNumber !== 1 && currentLesson.surahNumber !== 9 && (
                                <div className="text-center pb-4 mb-2 border-b border-amber-200/50 dark:border-slate-800">
                                  <div
                                    dir="rtl"
                                    className="font-arabic font-quran quran-uthmani-text text-2xl sm:text-3xl text-emerald-850 dark:text-emerald-300 !leading-[2.6] select-all tracking-wide"
                                    style={{ lineHeight: '2.6' }}
                                  >
                                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                                  </div>
                                </div>
                              )}

                              {/* Passage Text with Interactive Highlightable Ayahs */}
                              {currentLesson.recitation.ayahs && currentLesson.recitation.ayahs.length > 0 ? (
                                <div className={`font-arabic font-quran quran-uthmani-text text-slate-900 dark:text-white ${getArabicScaleClass()} select-text leading-relaxed tracking-wide text-right sm:text-center`} dir="rtl">
                                  {currentLesson.recitation.ayahs.map((ayah, aIdx) => {
                                    const isCurrent = currentAyahIndex === aIdx;
                                    return (
                                      <span
                                        key={ayah.ayahNumber}
                                        onClick={() => jumpToAyah(aIdx)}
                                        className={`inline cursor-pointer transition-all duration-200 rounded-xl px-2 py-1 mx-0.5 ${
                                          isCurrent 
                                            ? 'bg-amber-200/70 dark:bg-amber-900/40 text-amber-950 dark:text-amber-100 ring-2 ring-amber-400/60 shadow-xs' 
                                            : 'hover:bg-amber-100/50 dark:hover:bg-slate-800'
                                        }`}
                                        title={`Ayah ${ayah.ayahNumber} (${currentLesson.surahNumber}:${ayah.ayahNumber}) — Click to recite`}
                                      >
                                        {ayah.arabic}{' '}
                                        <span className="quran-ayah-marker text-[0.85em] text-amber-700 dark:text-amber-400 px-1 font-bold align-middle" dir="rtl" title={`Ayah ${ayah.ayahNumber}`}>
                                          {`\u06DD${toArabicDigits(ayah.ayahNumber)}`}
                                        </span>{' '}
                                      </span>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className={`font-arabic font-quran quran-uthmani-text text-slate-900 dark:text-white ${getArabicScaleClass()} select-text leading-relaxed tracking-wide`} dir="rtl">
                                  {currentLesson.recitation.arabicText}
                                </p>
                              )}

                              {/* Active Ayah Focus Box (Shows selected Ayah's authentic translation & phonetics) */}
                              {currentLesson.recitation.ayahs && currentLesson.recitation.ayahs[currentAyahIndex] && (
                                <div className="p-4 rounded-xl bg-amber-50/90 dark:bg-slate-800/90 border border-amber-200 dark:border-slate-700 text-left space-y-2">
                                  <div className="flex items-center justify-between text-xs font-bold text-amber-800 dark:text-amber-300">
                                    <div className="flex items-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                      <span>Ayah {currentLesson.recitation.ayahs[currentAyahIndex].ayahNumber} Meaning</span>
                                    </div>
                                    <span className="text-[11px] text-slate-500 font-normal">
                                      Surah {currentLesson.surahName.en} ({currentLesson.surahNumber}:{currentLesson.recitation.ayahs[currentAyahIndex].ayahNumber})
                                    </span>
                                  </div>
                                  <p className="text-sm font-sans text-slate-800 dark:text-slate-100 leading-relaxed font-medium">
                                    "{currentLesson.recitation.ayahs[currentAyahIndex].translation}"
                                  </p>
                                  {showTransliteration && (
                                    <p className="text-xs font-sans text-slate-600 dark:text-slate-400 italic pt-1 border-t border-amber-200/60 dark:border-slate-700/60">
                                      {currentLesson.recitation.ayahs[currentAyahIndex].transliteration}
                                    </p>
                                  )}
                                </div>
                              )}

                              {/* Fallback transliteration when ayahs array is unavailable */}
                              {showTransliteration && (!currentLesson.recitation.ayahs || currentLesson.recitation.ayahs.length === 0) && (
                                <p className="text-xs sm:text-sm font-sans text-slate-600 dark:text-slate-300 italic tracking-wide max-w-3xl mx-auto leading-relaxed border-t border-amber-100 dark:border-slate-800 pt-4">
                                  {currentLesson.recitation.transliteration}
                                </p>
                              )}
                            </div>
                          ) : (
                            /* Mode 2: Verse-by-Verse Individual Ayah Cards */
                            <div className="space-y-3.5">
                              {currentLesson.recitation.ayahs && currentLesson.recitation.ayahs.length > 0 ? (
                                currentLesson.recitation.ayahs.map((ayah, aIdx) => {
                                  const isCurrent = currentAyahIndex === aIdx;
                                  return (
                                    <div
                                      key={ayah.ayahNumber}
                                      className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 ${
                                        isCurrent
                                          ? 'bg-gradient-to-r from-emerald-50/90 via-white to-amber-50/60 dark:from-emerald-950/40 dark:via-slate-850 dark:to-amber-950/20 border-emerald-400 dark:border-emerald-600 ring-2 ring-emerald-500/30 shadow-md'
                                          : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs'
                                      }`}
                                    >
                                      {/* Individual Ayah Header */}
                                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2">
                                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                                            isCurrent 
                                              ? 'bg-emerald-600 text-white shadow-2xs' 
                                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                          }`}>
                                            Ayah {ayah.ayahNumber}
                                          </span>
                                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                            Surah {currentLesson.surahName.en} ({currentLesson.surahNumber}:{ayah.ayahNumber})
                                          </span>
                                          {isCurrent && isPlayingAudio && (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
                                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                              Reciting Now
                                            </span>
                                          )}
                                        </div>

                                        <button
                                          onClick={() => {
                                            if (isCurrent && isPlayingAudio) {
                                              toggleAudio();
                                            } else {
                                              playAyahAtIndex(aIdx);
                                            }
                                          }}
                                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                            isCurrent && isPlayingAudio
                                              ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                                              : 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                                          }`}
                                          title={isCurrent && isPlayingAudio ? "Pause Ayah" : `Recite Ayah ${ayah.ayahNumber}`}
                                        >
                                          {isCurrent && isPlayingAudio ? (
                                            <>
                                              <Pause size={12} />
                                              <span>Pause</span>
                                            </>
                                          ) : (
                                            <>
                                              <Play size={12} className="fill-current" />
                                              <span>Play Ayah</span>
                                            </>
                                          )}
                                        </button>
                                      </div>

                                      {/* Individual Ayah Arabic Script */}
                                      <div className="text-right my-3" dir="rtl">
                                        <p className={`font-arabic font-quran quran-uthmani-text text-slate-900 dark:text-white ${getArabicScaleClass()} select-text leading-relaxed tracking-wide`} dir="rtl">
                                          {ayah.arabic}{' '}
                                          <span className="quran-ayah-marker text-[0.85em] text-amber-700 dark:text-amber-400 px-1 font-bold align-middle" dir="rtl" title={`Ayah ${ayah.ayahNumber}`}>
                                            {`\u06DD${toArabicDigits(ayah.ayahNumber)}`}
                                          </span>
                                        </p>
                                      </div>

                                      {/* Individual Ayah Transliteration */}
                                      {showTransliteration && (
                                        <p className="text-xs sm:text-sm font-sans text-slate-600 dark:text-slate-400 italic mt-2 border-t border-slate-100 dark:border-slate-800/60 pt-2.5">
                                          {ayah.transliteration}
                                        </p>
                                      )}

                                      {/* Individual Ayah Translation */}
                                      <p className="text-sm font-sans text-slate-800 dark:text-slate-100 mt-2 font-medium leading-relaxed">
                                        {ayah.translation}
                                      </p>
                                    </div>
                                  );
                                })
                              ) : (
                                <div className="p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center">
                                  <p className={`font-arabic font-quran quran-uthmani-text text-slate-900 dark:text-white ${getArabicScaleClass()}`} dir="rtl">
                                    {currentLesson.recitation.arabicText}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Tajweed Rule Spotlight Box */}
                  <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider">
                        <Award size={14} />
                        <span>Daily Tajweed Rule Spotlight: {currentLesson.recitation.tajweedFocus.ruleName.en}</span>
                      </div>
                      <span className="font-arabic font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                        {currentLesson.recitation.tajweedFocus.ruleName.ar}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {currentLesson.recitation.tajweedFocus.description.en}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40 text-xs">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <strong className="text-slate-800 dark:text-white">Example in Today's Ayah:</strong>
                        <span className="font-arabic font-bold text-primary-700 dark:text-emerald-400 px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800">
                          {currentLesson.recitation.tajweedFocus.exampleVerseKey}
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                        💡 Tip: {currentLesson.recitation.tajweedFocus.practicalTip.en}
                      </div>
                    </div>
                  </div>

                  {/* Stage Advance Action */}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => handleStageSelect('understand')}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer select-none"
                    >
                      <span>Continue to Stage 2: Understanding (10 Min)</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* ---------------- STAGE 2: UNDERSTANDING, VOCABULARY & TAFSIR ---------------- */}
              {activeStage === 'understand' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  
                  {/* Language Selector for Translation */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      Meaning & Translation:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {[
                        { code: 'en', label: 'English' },
                        { code: 'ar', label: 'العربية' },
                        { code: 'am', label: 'አማርኛ' },
                        { code: 'har', label: 'ሐረሪ' }
                      ].map(l => (
                        <button
                          key={l.code}
                          onClick={() => setSelectedTranslationLang(l.code as any)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer select-none
                            ${selectedTranslationLang === l.code
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Translated Text Box */}
                  <div className="p-5 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-2">
                      Translation of Today's Verses ({selectedTranslationLang.toUpperCase()})
                    </h4>
                    <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-serif">
                      {currentLesson.understanding.translation[selectedTranslationLang] || currentLesson.understanding.translation.en}
                    </p>
                  </div>

                  {/* Interactive Word-by-Word Vocabulary Cards */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Sparkles size={13} className="text-amber-500" />
                        <span>Core Quranic Vocabulary & Linguistic Roots</span>
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        {currentLesson.understanding.vocabulary.length} Key Words
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentLesson.understanding.vocabulary.map((vocab, idx) => (
                        <div 
                          key={idx}
                          className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-400 transition-all shadow-xs space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-arabic font-quran text-xl font-bold text-slate-900 dark:text-white" dir="rtl">
                              {vocab.arabic}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                              Root: {vocab.root}
                            </span>
                          </div>

                          <div className="text-xs font-semibold text-primary-700 dark:text-emerald-400">
                            {vocab.word} • <span className="italic font-normal">{vocab.transliteration}</span>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                            {vocab.meaning[selectedTranslationLang] || vocab.meaning.en}
                          </p>

                          <div className="pt-1 text-[10px] text-slate-400">
                            Occurs ~{vocab.occurrencesInQuran} times in the Quran
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comprehensive Classical Tafsir Ibn Kathir Section */}
                  {(() => {
                    const surahOverview = getSurahIbnKathirOverview(currentLesson.surahNumber);
                    const firstVerseNum = currentLesson.verseNumbers[0] || 1;
                    const primaryVerseIbnKathir = getIbnKathirExegesis(
                      currentLesson.surahNumber,
                      firstVerseNum,
                      currentLesson.surahName.en,
                      currentLesson.recitation.arabicText,
                      currentLesson.understanding.translation.en
                    );

                    const isMuawwidhatayn = currentLesson.surahNumber === 113 || currentLesson.surahNumber === 114;
                    const hadiths = language === 'ar' ? surahOverview.keyHadithsAr : surahOverview.keyHadithsEn;
                    const virtues = language === 'ar' ? surahOverview.virtuesAr : surahOverview.virtuesEn;
                    const sabab = language === 'ar' ? surahOverview.sababAnNuzulAr : surahOverview.sababAnNuzulEn;
                    const theologicalPoints = language === 'ar' ? primaryVerseIbnKathir.theologicalPointsAr : primaryVerseIbnKathir.theologicalPointsEn;

                    return (
                      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-50/50 via-white to-amber-50/30 dark:from-slate-850 dark:via-slate-900 dark:to-emerald-950/20 border border-emerald-200/80 dark:border-slate-800 space-y-4 shadow-xs">
                        
                        {/* Header Bar & Resource Links */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-100 dark:border-slate-800">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                              <BookOpen size={16} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                  {language === 'ar' ? 'تفسير ابن كثير • هدايات الآيات' : 'Tafsir Ibn Kathir • Classical Exegesis'}
                                </h4>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/40">
                                  {language === 'ar' ? 'تفسير القرآن العظيم' : 'Ibn Kathir'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {language === 'ar'
                                  ? 'تحقيق وشرح الإمام الحافظ عماد الدين إسماعيل بن كثير رحمه الله'
                                  : 'Commentary & Hadith Analysis by Imam Al-Hafiz Ibn Kathir (rahimahullah)'}
                              </p>
                            </div>
                          </div>

                          {/* Quick Action Buttons: Local PDF Asset & Google Drive Archive */}
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Local PDF Document Link for Surah 1, 113, 114 */}
                            {(surahOverview.localPdfUrl || isMuawwidhatayn || currentLesson.surahNumber === 1) && (
                              <a
                                href={surahOverview.localPdfUrl || (currentLesson.surahNumber === 1 ? TAFSIR_IBN_KATHIR_FATIHA_LOCAL_PDF_URL : TAFSIR_IBN_KATHIR_LOCAL_PDF_URL)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/60 hover:bg-amber-500/20 transition-all shadow-2xs group cursor-pointer"
                                title={currentLesson.surahNumber === 1 ? "Open authentic Tafsir Ibn Kathir Surah Al-Fatiha classical document (PDF)" : "Open authentic Tafsir Ibn Kathir Al-Mu'awwidhatayn classical document (PDF)"}
                              >
                                <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                                <span>{language === 'ar' ? 'وثيقة التفسير (PDF)' : language === 'am' ? 'የተፍሲር ሰነድ (PDF)' : 'Tafsir Document (PDF)'}</span>
                                <ExternalLink className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                              </a>
                            )}

                            {/* Google Drive Complete Archive */}
                            <a
                              href={TAFSIR_IBN_KATHIR_DRIVE_FOLDER_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-700/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/70 transition-all shadow-2xs group cursor-pointer"
                              title="Open complete Tafsir Ibn Kathir volumes on Google Drive"
                            >
                              <Folder className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
                              <span>{language === 'ar' ? 'مكتبة التفسير (Drive)' : 'Tafsir Archive (Drive)'}</span>
                              <ExternalLink className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            </a>
                          </div>
                        </div>

                        {/* Virtues & Exegetical Commentary */}
                        <div className="space-y-3">
                          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-serif whitespace-pre-line">
                            {virtues}
                          </p>

                          {/* Revelation Context (Sabab an-Nuzul) */}
                          <div className="p-3.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1 shadow-2xs">
                            <span className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                              <Sparkles size={13} className="text-amber-500" />
                              {language === 'ar' ? 'سبب النزول والسياق التاريخي في تفسير ابن كثير:' : 'Occasion of Revelation (Sabab an-Nuzul):'}
                            </span>
                            <p className="leading-relaxed">{sabab}</p>
                          </div>

                          {/* Key Prophetic Narrations recorded by Ibn Kathir */}
                          {hadiths.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                                <Book size={12} className="text-emerald-600 dark:text-emerald-400" />
                                {language === 'ar' ? 'الآثار والأحاديث النبوية المسندة:' : 'Prophetic Hadiths & Classical Citations:'}
                              </span>
                              <div className="space-y-1.5">
                                {hadiths.map((h, hIdx) => (
                                  <div
                                    key={hIdx}
                                    className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                    <span className="leading-relaxed">{h}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Theological & Spiritual Insights (Fawa'id) */}
                          {theologicalPoints.length > 0 && (
                            <div className="pt-2 border-t border-dashed border-slate-200 dark:border-slate-800">
                              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                                {language === 'ar' ? 'الفوائد العقدية والأحكام المستنبطة:' : 'Theological Insights & Spiritual Lessons:'}
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {theologicalPoints.map((pt, pIdx) => (
                                  <span
                                    key={pIdx}
                                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                                  >
                                    ✦ {pt}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Stage Advance Action */}
                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => handleStageSelect('recite')}
                      className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                    >
                      ← Back to Recitation
                    </button>
                    <button
                      onClick={() => handleStageSelect('reflect')}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer select-none"
                    >
                      <span>Continue to Stage 3: Reflection & Dua (5 Min)</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* ---------------- STAGE 3: REFLECTION, ACTION & DUA ---------------- */}
              {activeStage === 'reflect' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  
                  {/* Tadabbur Prompt */}
                  <div className="p-5 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/80 dark:border-sky-800/40 space-y-3">
                    <div className="flex items-center gap-2 text-sky-800 dark:text-sky-300 font-bold text-xs uppercase tracking-wider">
                      <HelpCircle size={14} />
                      <span>Tadabbur Question of the Day (التدبر العملي)</span>
                    </div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                      {currentLesson.reflection.reflectionPrompt[language as keyof typeof currentLesson.reflection.reflectionPrompt] || currentLesson.reflection.reflectionPrompt.en}
                    </p>

                    {/* Interactive Note Taking Area */}
                    <div className="space-y-2 pt-2">
                      <textarea
                        value={userJournalNote}
                        onChange={(e) => setUserJournalNote(e.target.value)}
                        placeholder="Write your personal reflections or commitments for today..."
                        rows={3}
                        className="w-full p-3 rounded-xl border border-sky-200 dark:border-sky-900 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-400 resize-none"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={handleSaveNote}
                          className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          Save Reflection Note
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Real-life Action Commitment Checkbox */}
                  <div 
                    onClick={() => setActionDone(!actionDone)}
                    className={`p-4 rounded-2xl border transition-all flex items-center gap-3.5 cursor-pointer select-none
                      ${actionDone 
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800' 
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}
                  >
                    <div className="shrink-0 text-emerald-600">
                      {actionDone ? <CheckSquare size={20} className="fill-emerald-100" /> : <Square size={20} />}
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Today's Real-Life Action Commitment
                      </span>
                      <p className={`text-xs font-semibold ${actionDone ? 'line-through text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                        {language === 'ar' ? currentLesson.reflection.dailyActionCommitment.ar : currentLesson.reflection.dailyActionCommitment.en}
                      </p>
                    </div>
                  </div>

                  {/* Quranic Dua Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-primary-500/10 to-teal-500/10 border border-primary-300/60 dark:border-primary-800/60 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-primary-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider">
                        <Heart size={14} className="fill-current" />
                        <span>Connected Quranic Dua ({currentLesson.reflection.quranicDua.reference})</span>
                      </div>
                      <button
                        onClick={handleCopyDua}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-white transition-colors cursor-pointer"
                      >
                        {copiedDua ? <Check size={12} className="text-emerald-500" /> : <Share2 size={12} />}
                        <span>{copiedDua ? "Copied" : "Copy Dua"}</span>
                      </button>
                    </div>

                    <p className="font-arabic font-quran quran-uthmani-text text-xl sm:text-2xl text-slate-900 dark:text-white leading-loose text-center py-2" dir="rtl">
                      {currentLesson.reflection.quranicDua.arabic}
                    </p>

                    <p className="text-xs text-slate-600 dark:text-slate-300 text-center italic">
                      "{currentLesson.reflection.quranicDua.translation.en}"
                    </p>
                  </div>

                  {/* Quick Retention Quiz */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <HelpCircle size={14} className="text-amber-500" />
                        <span>Daily 1-Question Check</span>
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {currentLesson.reflection.retentionQuiz.question.en}
                    </p>

                    <div className="space-y-2 pt-1">
                      {currentLesson.reflection.retentionQuiz.options.map((opt, idx) => {
                        const isSelected = selectedQuizAnswer === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedQuizAnswer(idx);
                              setQuizSubmitted(true);
                            }}
                            className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer select-none
                              ${quizSubmitted && opt.isCorrect
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-200'
                                : quizSubmitted && isSelected && !opt.isCorrect
                                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-900 dark:text-rose-200'
                                : isSelected
                                ? 'bg-primary-50 dark:bg-slate-800 border-primary-400'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-50'}`}
                          >
                            <span>{opt.text.en}</span>
                            {quizSubmitted && opt.isCorrect && (
                              <CheckCircle2 size={15} className="text-emerald-600 shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && selectedQuizAnswer !== null && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
                        💡 {currentLesson.reflection.retentionQuiz.options[selectedQuizAnswer]?.explanation.en}
                      </p>
                    )}
                  </div>

                  {/* Grand Completion Button */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button
                      onClick={() => handleStageSelect('understand')}
                      className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                    >
                      ← Back to Vocabulary & Tafsir
                    </button>

                    <button
                      onClick={handleCompleteDay}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer select-none"
                    >
                      <CheckCircle2 size={18} />
                      <span>
                        {userState.completedDays.includes(selectedDayNumber)
                          ? `Day ${selectedDayNumber} Completed (Re-Mark)`
                          : `Complete Day ${selectedDayNumber} (Mark 20 Min Finished)`}
                      </span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 2: 52-WEEK / 365-DAY ANNUAL ROADMAP
          ========================================================================= */}
      {viewMode === 'roadmap' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Quarter Cards Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {QUARTER_ROADMAP.map(q => {
              const isSelected = roadmapQuarterFilter === q.quarter;
              return (
                <button
                  key={q.quarter}
                  onClick={() => setRoadmapQuarterFilter(isSelected ? 0 : q.quarter)}
                  className={`p-5 rounded-3xl border text-left transition-all relative overflow-hidden flex flex-col justify-between h-48 shadow-xs cursor-pointer select-none
                    ${isSelected 
                      ? 'bg-slate-900 text-white border-primary-500 ring-2 ring-primary-500/30' 
                      : 'bg-white dark:bg-slate-900 border-secondary-200 dark:border-slate-800 text-slate-800 dark:text-white hover:border-primary-400'}`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/20 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400">
                        {q.dateRangeDesc}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        {q.weekRange}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold mt-2">
                      {q.title.en}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
                    {q.coreSurahs.slice(0, 3).join(', ')}...
                  </div>
                </button>
              );
            })}
          </div>

          {/* Roadmap Filters & Search Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-secondary-200 dark:border-slate-800 shadow-sm">
            
            <div className="relative w-full md:w-80">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={roadmapSearchQuery}
                onChange={(e) => setRoadmapSearchQuery(e.target.value)}
                placeholder="Search week, Surah, or theme..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <Filter size={12} />
                <span>Category:</span>
              </span>
              {[
                { id: 'all', label: 'All Categories' },
                { id: 'foundations', label: 'Q1 Foundations' },
                { id: 'stories_wisdom', label: 'Q2 Prophetic' },
                { id: 'spiritual_light', label: 'Q3 Light' },
                { id: 'mastery_khatam', label: 'Q4 Khatam' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setRoadmapCategoryFilter(cat.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer select-none
                    ${roadmapCategoryFilter === cat.id 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 52-Week Syllabus Grid */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Showing {filteredWeeks.length} of 52 Weeks Curriculum
              </h3>
              <span className="text-xs text-slate-400">Click any day to jump to its 20-min lesson</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWeeks.map(week => {
                const completedInWeek = week.days.filter(d => userState.completedDays.includes(d)).length;
                const isCurrentWeek = week.days.includes(selectedDayNumber);

                return (
                  <div
                    key={week.weekNumber}
                    className={`p-5 rounded-3xl border transition-all space-y-4 flex flex-col justify-between shadow-xs
                      ${isCurrentWeek
                        ? 'bg-white dark:bg-slate-850 border-primary-500 ring-2 ring-primary-500/20'
                        : 'bg-white dark:bg-slate-900 border-secondary-200 dark:border-slate-800'}`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-primary-700 dark:text-emerald-400">
                          Week {week.weekNumber} • Q{week.quarter}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">
                          {completedInWeek} / 7 Days Done
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-850 dark:text-slate-100 line-clamp-1">
                        {week.title.en}
                      </h4>

                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Focus: {week.surahFocus}
                      </p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {week.keyThemes.slice(0, 2).map((t, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Day selector pills inside week card */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="grid grid-cols-7 gap-1">
                        {week.days.map(dayNum => {
                          const isDone = userState.completedDays.includes(dayNum);
                          const isSelected = selectedDayNumber === dayNum;

                          return (
                            <button
                              key={dayNum}
                              onClick={() => {
                                setSelectedDayNumber(dayNum);
                                setViewMode('session');
                              }}
                              className={`h-8 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold transition-all cursor-pointer select-none
                                ${isSelected
                                  ? 'bg-primary-600 text-white shadow-xs'
                                  : isDone
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                  : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
                              title={`Jump to Day ${dayNum} ${isDone ? '(Completed)' : ''}`}
                            >
                              <span>D{dayNum}</span>
                              {isDone && <span className="text-[8px] leading-none">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          COMPLETION CELEBRATION MODAL
          ========================================================================= */}
      {isCompletionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-emerald-400/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4">
            
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center">
              <Award size={36} className="animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Mabrook! Day Completed
              </span>
              <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                Day {selectedDayNumber} Finished • +20 Minutes Added!
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              "The most beloved of deeds to Allah are those that are most consistent, even if they are small." — Sahih Al-Bukhari
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-left space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Current Active Streak:</span>
                <strong className="text-amber-500 font-bold">{userState.streak} Days 🔥</strong>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Total Days Completed:</span>
                <strong className="text-emerald-500 font-bold">{userState.completedDays.length} / 365 Days</strong>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => {
                  setIsCompletionModalOpen(false);
                  if (selectedDayNumber < 365) {
                    setSelectedDayNumber(selectedDayNumber + 1);
                  }
                }}
                className="flex-1 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Proceed to Day {Math.min(365, selectedDayNumber + 1)}
              </button>
              <button
                onClick={() => setIsCompletionModalOpen(false)}
                className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ONBOARDING & PERSONALIZATION MODAL
          ========================================================================= */}
      {isOnboardingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-secondary-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 text-left max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center gap-2 text-primary-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles size={14} />
              <span>Personalize Your 1-Year Journey</span>
            </div>

            <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
              Setup Your Daily 20-Minute Quran Plan
            </h3>

            {/* Level Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                1. Your Quranic Experience Level:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'beginner', title: 'Beginner', desc: 'Emphasis on phonetics & basic rules' },
                  { id: 'intermediate', title: 'Intermediate', desc: 'Balanced vocabulary & Tafsir' },
                  { id: 'advanced', title: 'Advanced', desc: 'Linguistic nuances & deep roots' }
                ].map(lvl => (
                  <button
                    key={lvl.id}
                    onClick={() => persistState(p => ({ ...p, level: lvl.id as LearningLevel }))}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer select-none
                      ${userState.level === lvl.id
                        ? 'bg-primary-50 dark:bg-primary-950/50 border-primary-500 text-primary-800 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50'}`}
                  >
                    <strong className="text-xs block font-bold">{lvl.title}</strong>
                    <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">{lvl.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Goal Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                2. Primary Learning Goal:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'vocabulary_tafsir', title: 'Vocabulary & Tafsir Understanding' },
                  { id: 'fluency_tajweed', title: 'Tajweed Rules & Recitation Fluency' },
                  { id: 'spiritual_habit', title: 'Daily Spiritual Reflection Habit' },
                  { id: 'memorization', title: 'Ayah-by-Ayah Retention' }
                ].map(g => (
                  <button
                    key={g.id}
                    onClick={() => persistState(p => ({ ...p, primaryGoal: g.id as any }))}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer select-none
                      ${userState.primaryGoal === g.id
                        ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-900 dark:text-amber-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {g.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Routine Slot */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                3. Preferred Daily 20-Minute Study Slot:
              </label>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {[
                  { id: 'fajr', label: 'Dawn / Fajr' },
                  { id: 'dhuhr', label: 'Midday' },
                  { id: 'asr_maghrib', label: 'Afternoon' },
                  { id: 'isha', label: 'Night / Isha' }
                ].map(time => (
                  <button
                    key={time.id}
                    onClick={() => persistState(p => ({ ...p, dailyReminderTime: time.id as any }))}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer select-none
                      ${userState.dailyReminderTime === time.id
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {time.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  persistState(p => ({ ...p, hasCompletedOnboarding: true }));
                  setIsOnboardingOpen(false);
                }}
                className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Save Preferences & Begin Journey
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default QuranYearPlanSection;
