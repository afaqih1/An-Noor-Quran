import React, { useEffect, useState, useRef } from 'react';
import { 
  X, Loader2, AlertCircle, Bookmark, Copy, ChevronLeft, ChevronRight, 
  BookOpen, HelpCircle, Sparkles, Check, Info, Eye, EyeOff, Maximize2, Minimize2,
  Play, Pause, RotateCcw, VolumeX, Volume2, FileText
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useAudio } from './AudioContext';

interface QuranModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterNumber: number;
  surahName: string;
  pageNumber?: number;
}

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | any;
  translationText?: string;
  surah?: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
  };
}

interface SurahResponse {
  code: number;
  status: string;
  data: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
    ayahs: Ayah[];
  };
}

const getJuzName = (juzNum: number, lang: string) => {
  const juzNamesAr: Record<number, string> = {
    1: "الجزء ١ (آلم)", 2: "الجزء ٢ (سيقول)", 3: "الجزء ٣ (تلك الرسل)", 4: "الجزء ٤ (لن تنالوا)", 5: "الجزء ٥ (والمحصنات)",
    6: "الجزء ٦ (لا يحب الله)", 7: "الجزء ٧ (لتجدن)", 8: "الجزء ٨ (ولو أننا)", 9: "الجزء ٩ (قال الملأ)", 10: "الجزء ١٠ (واعلموا)",
    11: "الجزء ١١ (يعتذرون)", 12: "الجزء ١٢ (وما من دابة)", 13: "الجزء ١٣ (وما أبرئ)", 14: "الجزء ١٤ (ربما)", 15: "الجزء ١٥ (سبحان)",
    16: "الجزء ١٦ (قال ألم)", 17: "الجزء ١٧ (اقترب)", 18: "الجزء ١٨ (قد أفلح)", 19: "الجزء ١٩ (وقال الذين)", 20: "الجزء ٢٠ (أمن خلق)",
    21: "الجزء ٢١ (اتل ما أوحي)", 22: "الجزء ٢٢ (ومن يقنت)", 23: "الجزء ٢٣ (وما لي لا أعبد)", 24: "الجزء ٢٤ (فمن أظلم)", 25: "الجزء ٢٥ (إليه يرد)",
    26: "الجزء ٢٦ (حم)", 27: "الجزء ٢٧ (قال فما خطبكم)", 28: "الجزء ٢٨ (قد سمع الله)", 29: "الجزء ٢٩ (تبارك)", 30: "الجزء ٣٠ (عم)"
  };
  
  if (lang === 'ar') {
    return juzNamesAr[juzNum] || `الجزء ${juzNum}`;
  }
  return `Juz ${juzNum}`;
};

const QuranModal: React.FC<QuranModalProps> = ({ isOpen, onClose, chapterNumber, surahName, pageNumber: initialPageNumber }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayedVerses, setDisplayedVerses] = useState<Ayah[]>([]);
  const [surahInfo, setSurahInfo] = useState<SurahResponse['data'] | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const { language: lang } = useLanguage();

  // Interactive Reading View Mode
  const [viewMode, setViewMode] = useState<'classic' | 'continuous'>(() => {
    try {
      const saved = localStorage.getItem('quran-reading-mode');
      return (saved === 'continuous' ? 'continuous' : 'classic');
    } catch {
      return 'classic';
    }
  });

  const handleSetViewMode = (mode: 'classic' | 'continuous') => {
    setViewMode(mode);
    try {
      localStorage.setItem('quran-reading-mode', mode);
      window.dispatchEvent(new Event('quran-reading-mode-changed'));
    } catch (e) {
      console.error(e);
    }
  };

  // Sync viewMode from external changes (e.g. Config page)
  useEffect(() => {
    const handleModeChange = () => {
      try {
        const saved = localStorage.getItem('quran-reading-mode');
        if (saved === 'classic' || saved === 'continuous') {
          setViewMode(saved);
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('quran-reading-mode-changed', handleModeChange);
    return () => {
      window.removeEventListener('quran-reading-mode-changed', handleModeChange);
    };
  }, []);

  const [activePageNumber, setActivePageNumber] = useState<number>(293);
  const [surahPages, setSurahPages] = useState<number[]>([]);
  const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null);
  const [copiedAyahId, setCopiedAyahId] = useState<number | null>(null);

  // Settings Toggles for Classic View
  const [showClassicTranslation, setShowClassicTranslation] = useState<boolean>(true);
  const [classicFontSize, setClassicFontSize] = useState<number>(26); // in px

  // Redesigned Focused Verse Reader Mode states
  const { pause: pauseGlobalRecitation, isPlaying: isGlobalPlaying } = useAudio();
  const [activeVerseIndex, setActiveVerseIndex] = useState<number>(0);
  const [readerTheme, setReaderTheme] = useState<'sepia' | 'mint' | 'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('quran-reader-theme');
      return (saved as any) || 'sepia';
    } catch {
      return 'sepia';
    }
  });
  const [playingVerseNum, setPlayingVerseNum] = useState<number | null>(null);
  const [audioLoading, setAudioLoading] = useState<boolean>(false);
  const [autoPlayNext, setAutoPlayNext] = useState<boolean>(true);
  const [verseCurrentTime, setVerseCurrentTime] = useState<number>(0);
  const [verseDuration, setVerseDuration] = useState<number>(0);
  const [verseVolume, setVerseVolume] = useState<number>(0.85);
  const [verseIsMuted, setVerseIsMuted] = useState<boolean>(false);
  const [verseSpeed, setVerseSpeed] = useState<number>(1);
  const verseAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleSetReaderTheme = (theme: 'sepia' | 'mint' | 'dark' | 'light') => {
    setReaderTheme(theme);
    try {
      localStorage.setItem('quran-reader-theme', theme);
    } catch (e) {
      console.error(e);
    }
  };

  // State to fetch page dynamically
  const [currentChapter, setCurrentChapter] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number | null>(null);

  // Refs for infinite scrolling and data storage
  const allVersesRef = useRef<Ayah[]>([]);
  const [allVerses, setAllVerses] = useState<Ayah[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(1);
  const VERSES_PER_PAGE = 20;

  // Touch swipe refs
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Sync initial inputs
  useEffect(() => {
    if (isOpen) {
      setCurrentChapter(chapterNumber || null);
      setCurrentPage(initialPageNumber || null);
    }
  }, [isOpen, chapterNumber, initialPageNumber]);

  // Load bookmarked IDs
  useEffect(() => {
    const loadBookmarks = () => {
      try {
        const stored = localStorage.getItem('quran-bookmarks');
        if (stored) {
          const parsed = JSON.parse(stored) as { id: string }[];
          setBookmarkedIds(parsed.map(b => b.id));
        } else {
          setBookmarkedIds([]);
        }
      } catch (e) {
        console.error(e);
      }
    };
    if (isOpen) {
      loadBookmarks();
    }

    window.addEventListener('bookmarks-updated', loadBookmarks);
    return () => window.removeEventListener('bookmarks-updated', loadBookmarks);
  }, [isOpen]);

  // Fetch Holy Arabic Text + English Translation in parallel
  useEffect(() => {
    if (isOpen && (currentChapter || currentPage)) {
      setLoading(true);
      setError(null);
      setDisplayedVerses([]);
      setSelectedAyah(null);
      allVersesRef.current = [];
      setAllVerses([]);
      pageRef.current = 1;
      
      const arabicUrl = currentPage 
        ? `https://api.alquran.cloud/v1/page/${currentPage}/quran-uthmani`
        : `https://api.alquran.cloud/v1/surah/${currentChapter}/quran-uthmani`;

      const translationUrl = currentPage 
        ? `https://api.alquran.cloud/v1/page/${currentPage}/en.sahih`
        : `https://api.alquran.cloud/v1/surah/${currentChapter}/en.sahih`;

      Promise.all([
        fetch(arabicUrl).then(res => {
          if (!res.ok) throw new Error('Arabic text could not be loaded.');
          return res.json();
        }),
        fetch(translationUrl).then(res => {
          if (!res.ok) throw new Error('Translation text could not be loaded.');
          return res.json();
        })
      ])
      .then(([arabicRes, translationRes]) => {
        let fetchedVerses = arabicRes.data.ayahs;
        const translationVerses = translationRes.data.ayahs || [];

        // Map translation text to each arabic verse, ensuring page property exists and is a number
        fetchedVerses = fetchedVerses.map((v: any, idx: number) => {
          const pageVal = v.page || translationVerses[idx]?.page || currentPage || initialPageNumber || activePageNumber || 1;
          return {
            ...v,
            page: Number(pageVal),
            translationText: translationVerses[idx]?.text || ''
          };
        });

        // Clean Bismillah from start of any surahs (it is displayed as a header card instead)
        fetchedVerses = fetchedVerses.map((ayah: any) => {
          const isFirstInSurah = ayah.numberInSurah === 1;
          const surahNum = ayah.surah?.number || currentChapter;
          if (isFirstInSurah && surahNum !== 1 && surahNum !== 9) {
            const text = ayah.text;
            const splitKeys = ["بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"];
            for (const splitKey of splitKeys) {
              if (text.startsWith(splitKey)) {
                return {
                  ...ayah,
                  text: text.substring(splitKey.length).trim()
                };
              }
            }
          }
          return ayah;
        });

        if (currentPage) {
          // Loaded by page - find surah info from the first ayah
          const firstAyah = fetchedVerses[0];
          setSurahInfo({
            number: firstAyah?.surah?.number || 1,
            name: firstAyah?.surah?.name || 'سورة',
            englishName: firstAyah?.surah?.englishName || 'Surah',
            englishNameTranslation: firstAyah?.surah?.englishNameTranslation || '',
            revelationType: firstAyah?.surah?.revelationType || '',
            numberOfAyahs: firstAyah?.surah?.numberOfAyahs || 7,
            ayahs: fetchedVerses
          });
          setSurahPages([Number(currentPage)]);
          setActivePageNumber(Number(currentPage));
        } else {
          // Loaded by Surah
          setSurahInfo(arabicRes.data);
          
          // Identify unique pages inside this Surah
          const uniquePages = Array.from(new Set(fetchedVerses.map((a: any) => Number(a.page)))).sort((a: any, b: any) => a - b) as number[];
          if (uniquePages.length > 0) {
            setSurahPages(uniquePages);
            setActivePageNumber(uniquePages[0]);
          }
        }
        
        // Initialize continuous scroll
        allVersesRef.current = fetchedVerses;
        setAllVerses(fetchedVerses);
        setDisplayedVerses(fetchedVerses.slice(0, VERSES_PER_PAGE));
        
        // Determine starting verse index
        let startIndex = 0;
        if (initialPageNumber) {
          const pageIdx = fetchedVerses.findIndex((v: any) => Number(v.page) === Number(initialPageNumber));
          if (pageIdx !== -1) startIndex = pageIdx;
        }
        
        setActiveVerseIndex(startIndex);
        
        // Set starting verse as selected ayah
        if (fetchedVerses.length > 0) {
          setSelectedAyah(fetchedVerses[startIndex]);
        }
        
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Unable to load Quran text. Please check your internet connection.');
        setLoading(false);
      });
    }
  }, [isOpen, currentChapter, currentPage]);

  // Bidirectional Synchronization of selectedAyah and activeVerseIndex in Focused Mode
  useEffect(() => {
    if (viewMode === 'classic' && selectedAyah && allVerses.length > 0) {
      const idx = allVerses.findIndex(v => v.number === selectedAyah.number);
      if (idx !== -1 && idx !== activeVerseIndex) {
        setActiveVerseIndex(idx);
      }
    }
  }, [selectedAyah, viewMode, allVerses]);

  useEffect(() => {
    if (viewMode === 'classic' && allVerses.length > 0 && activeVerseIndex >= 0 && activeVerseIndex < allVerses.length) {
      const activeAyah = allVerses[activeVerseIndex];
      if (!selectedAyah || selectedAyah.number !== activeAyah.number) {
        setSelectedAyah(activeAyah);
      }
    }
  }, [activeVerseIndex, viewMode, allVerses]);

  // Single-Verse Audio Player Engine
  const playVerseAudio = (ayah: Ayah) => {
    // Pause global Surah recitation if it's playing
    if (isGlobalPlaying) {
      pauseGlobalRecitation();
    }

    const isAbortError = (err: any) => {
      return err && (
        err.name === 'AbortError' || 
        err.message?.includes('interrupted') || 
        err.message?.includes('pause') ||
        err.message?.includes('The play() request was interrupted')
      );
    };

    if (!verseAudioRef.current) {
      const audio = new Audio();
      verseAudioRef.current = audio;
      
      audio.addEventListener('timeupdate', () => {
        setVerseCurrentTime(audio.currentTime);
      });
      audio.addEventListener('durationchange', () => {
        setVerseDuration(audio.duration || 0);
      });
      audio.addEventListener('waiting', () => {
        setAudioLoading(true);
      });
      audio.addEventListener('playing', () => {
        setAudioLoading(false);
      });
      audio.addEventListener('canplay', () => {
        setAudioLoading(false);
      });
    }

    const audio = verseAudioRef.current;
    audio.volume = verseIsMuted ? 0 : verseVolume;
    audio.playbackRate = verseSpeed;

    if (playingVerseNum === ayah.number) {
      // Toggle pause/play
      if (audio.paused) {
        audio.play().catch(e => {
          if (!isAbortError(e)) console.error("Audio play failed:", e);
        });
        setPlayingVerseNum(ayah.number);
      } else {
        audio.pause();
        setPlayingVerseNum(null);
      }
      return;
    }

    // Stop previous verse if any
    audio.pause();
    setAudioLoading(true);
    setPlayingVerseNum(ayah.number);
    setVerseCurrentTime(0);

    // Stream word-by-word precise Alafasy recitation
    audio.src = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`;
    audio.load();
    
    audio.play()
      .then(() => {
        setAudioLoading(false);
      })
      .catch(err => {
        if (!isAbortError(err)) {
          console.error("Audio error:", err);
        }
        setAudioLoading(false);
        setPlayingVerseNum(null);
      });

    // Handle end of playback
    audio.onended = () => {
      setPlayingVerseNum(null);
      setVerseCurrentTime(0);
      if (autoPlayNext) {
        // Automatically play next verse if available
        setActiveVerseIndex(prev => {
          if (prev < allVersesRef.current.length - 1) {
            const nextIdx = prev + 1;
            // Delay slightly for natural pause between verses
            setTimeout(() => {
              if (allVersesRef.current[nextIdx]) {
                playVerseAudio(allVersesRef.current[nextIdx]);
              }
            }, 800);
            return nextIdx;
          }
          return prev;
        });
      }
    };
  };

  useEffect(() => {
    if (verseAudioRef.current) {
      verseAudioRef.current.volume = verseIsMuted ? 0 : verseVolume;
    }
  }, [verseVolume, verseIsMuted]);

  useEffect(() => {
    if (verseAudioRef.current) {
      verseAudioRef.current.playbackRate = verseSpeed;
    }
  }, [verseSpeed]);

  // Stop single-verse audio when modal closes or unmounts
  useEffect(() => {
    if (!isOpen && verseAudioRef.current) {
      verseAudioRef.current.pause();
      setPlayingVerseNum(null);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (verseAudioRef.current) {
        verseAudioRef.current.pause();
        verseAudioRef.current = null;
      }
    };
  }, []);

  // Keyboard navigation for Focused Verse mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'classic' || !isOpen || allVerses.length === 0) return;
      if (e.key === 'ArrowLeft') {
        setActiveVerseIndex(prev => Math.min(allVerses.length - 1, prev + 1));
        setPlayingVerseNum(null);
      } else if (e.key === 'ArrowRight') {
        setActiveVerseIndex(prev => Math.max(0, prev - 1));
        setPlayingVerseNum(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, isOpen, allVerses]);

  // Touch Swiping Handlers for Swipe Navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current || allVerses.length === 0) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setActiveVerseIndex(prev => Math.min(allVerses.length - 1, prev + 1));
      setPlayingVerseNum(null);
    } else if (isRightSwipe) {
      setActiveVerseIndex(prev => Math.max(0, prev - 1));
      setPlayingVerseNum(null);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Bookmark Toggle
  const toggleBookmark = (ayah: Ayah) => {
    const resolvedChapter = currentChapter || ayah.surah?.number || 1;
    const id = `${resolvedChapter}_${ayah.numberInSurah}`;
    
    let updated: any[] = [];
    try {
      const stored = localStorage.getItem('quran-bookmarks');
      const existing = stored ? JSON.parse(stored) : [];
      
      const isBookmarked = existing.some((b: any) => b.id === id);
      if (isBookmarked) {
        updated = existing.filter((b: any) => b.id !== id);
      } else {
        const newItem = {
          id,
          chapterNumber: resolvedChapter,
          surahName: surahName || ayah.surah?.englishName || 'Surah',
          verseNumber: ayah.numberInSurah,
          verseText: ayah.text,
          timestamp: Date.now()
        };
        updated = [...existing, newItem];
      }
      localStorage.setItem('quran-bookmarks', JSON.stringify(updated));
      setBookmarkedIds(updated.map(b => b.id));
      window.dispatchEvent(new Event('bookmarks-updated'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopy = (ayah: Ayah) => {
    const copyText = `${ayah.text} [Quran ${ayah.surah?.englishName || surahName} ${ayah.numberInSurah}]\n\nTranslation: ${ayah.translationText}`;
    navigator.clipboard.writeText(copyText)
      .then(() => {
        setCopiedAyahId(ayah.number);
        setTimeout(() => setCopiedAyahId(null), 2000);
      })
      .catch(err => console.error(err));
  };

  // Continuous View scroll pagination
  const loadMoreVerses = () => {
    const currentLength = displayedVerses.length;
    const totalVerses = allVersesRef.current.length;
    
    if (currentLength < totalVerses) {
      const nextBatch = allVersesRef.current.slice(currentLength, currentLength + VERSES_PER_PAGE);
      setDisplayedVerses(prev => [...prev, ...nextBatch]);
      pageRef.current += 1;
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 200) {
        loadMoreVerses();
      }
    }
  };

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter verses for the active page in Classic View with robust fallback/types
  let pageVerses = currentPage 
    ? allVerses 
    : allVerses.filter((a: any) => Number(a.page || 1) === Number(activePageNumber));

  // Fallback in case filter resulted in no verses to prevent a completely blank page
  if (pageVerses.length === 0 && allVerses.length > 0) {
    pageVerses = allVerses;
  }

  // Group by Surah to draw headers when starting a new Surah on the page
  const renderedSurahsOnPage = Array.from(new Set(pageVerses.map(a => a.surah?.number || currentChapter || 1)));

  // Labels
  const labels = {
    en: {
      modeClassic: "Focused Verse Reader",
      modeClassicShort: "Focused Card",
      modeContinuous: "Continuous Flow",
      modeContinuousShort: "Continuous",
      page: "Page",
      juz: "Juz",
      clickTip: "Click any verse to read translation & copy/bookmark.",
      close: "Close Reader",
      fontSize: "Text Size",
      showTranslation: "Show Translation inline",
      next: "Next",
      prev: "Prev",
      helpTip: "Keyboard tip: Use Left and Right arrow keys to turn pages.",
      surahMeta: "Revelation: {type} • {verses} Verses"
    },
    ar: {
      modeClassic: "القارئ المركز",
      modeClassicShort: "عرض الآية",
      modeContinuous: "السرد المتواصل",
      modeContinuousShort: "متواصل",
      page: "صفحة",
      juz: "الجزء",
      clickTip: "انقر فوق أي آية لعرض ترجمتها أو لنسخها وحفظها.",
      close: "إغلاق القارئ",
      fontSize: "حجم الخط",
      showTranslation: "عرض الترجمة الفورية",
      next: "التالي",
      prev: "السابق",
      helpTip: "تلميح: استخدم مفاتيح الأسهم الأيمن والأيسر لقلب الصفحات.",
      surahMeta: "التنزيل: {type} • عدد الآيات: {verses}"
    },
    am: {
      modeClassic: "ተኮር አንቀጽ አንባቢ",
      modeClassicShort: "ተኮር ካርድ",
      modeContinuous: "ቀጣይ ፍሰት",
      modeContinuousShort: "ቀጣይ",
      page: "ገጽ",
      juz: "ጁዝ",
      clickTip: "ማንኛውንም አንቀጽ በመጫን ትርጉሙን ማንበብ፣ መቅዳት ወይም ዕልባት ማድረግ ይችላሉ።",
      close: "ዝጋ",
      fontSize: "የፊደል መጠን",
      showTranslation: "ትርጉሙን በየመስመሩ አሳይ",
      next: "ቀጣይ",
      prev: "ቀዳሚ",
      helpTip: "የቁلፍ ሰሌዳ ጠቃሚ ምክር፡ ገጾችን ለመቀየር የግራ እና የቀኝ ቀስት ቁልፎችን ይጠቀሙ።",
      surahMeta: "ወረደበት፡ {type} • {verses} አንቀጾች"
    },
    har: {
      modeClassic: "ተኮር አንቀጽ አንባቢ",
      modeClassicShort: "ተኮር ካርድ",
      modeContinuous: "ቀጣይ ፍሰት",
      modeContinuousShort: "ቀጣይ",
      page: "ገጽ",
      juz: "ጁዝ",
      clickTip: "ማንኛውንም አንቀጽ በመጫን ትርጉሙን ማንበብ፣ መቅዳት ወይም ዕልባት ማድረግ ይችላሉ።",
      close: "ዝጋ",
      fontSize: "የፊደል መጠን",
      showTranslation: "ትርጉሙን በየመስመሩ አሳይ",
      next: "ቀጣይ",
      prev: "ቀዳሚ",
      helpTip: "የቁልፍ ሰሌዳ ጠቃሚ ምክር፡ ገጾችን ለመቀየር የግራ እና የቀኝ ቀስት ቁልፎችን ይጠቀሙ።",
      surahMeta: "ወረደበት፡ {type} • {verses} አንቀጾች"
    }
  };

  const curLabels = (labels[lang as keyof typeof labels] || labels.en) as any;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-[#fbf9f4] dark:bg-slate-950 w-full sm:max-w-6xl h-full sm:h-[94vh] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-secondary-300/30">
        
        {/* TOP STATUS BAR: Title, View-Switcher & Close */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 border-b border-secondary-200/50 bg-[#fdfdfc] dark:bg-slate-900">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-primary-100 dark:bg-emerald-950 rounded-lg text-primary-700 dark:text-emerald-400">
                <BookOpen size={18} />
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-serif text-slate-900 dark:text-slate-100">
                {surahName}
              </h3>
            </div>
            {surahInfo && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 ml-8">
                {surahInfo.englishName} • {surahInfo.revelationType} • {surahInfo.numberOfAyahs} Verses
              </p>
            )}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex border border-secondary-200/40 flex-1 sm:flex-initial justify-between sm:justify-start">
              <button
                onClick={() => handleSetViewMode('classic')}
                className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none
                  ${viewMode === 'classic' 
                    ? 'bg-[#ffffff] dark:bg-slate-700 text-primary-900 dark:text-white shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                  }`}
              >
                <Sparkles size={13} className="text-amber-500 flex-shrink-0" />
                <span className="hidden sm:inline">{curLabels.modeClassic}</span>
                <span className="sm:hidden">{curLabels.modeClassicShort}</span>
              </button>
              <button
                onClick={() => handleSetViewMode('continuous')}
                className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none
                  ${viewMode === 'continuous' 
                    ? 'bg-[#ffffff] dark:bg-slate-700 text-primary-900 dark:text-white shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                  }`}
              >
                <Maximize2 size={13} className="flex-shrink-0" />
                <span className="hidden sm:inline">{curLabels.modeContinuous}</span>
                <span className="sm:hidden">{curLabels.modeContinuousShort}</span>
              </button>
            </div>

            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-classic-mushaf-modal', { detail: { page: activePageNumber } }));
              }}
              className="p-2 sm:px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] sm:text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:shadow cursor-pointer select-none flex-shrink-0"
              title={lang === 'ar' ? 'عرض صفحات المصحف المصورة الكلاسيكية' : 'View Scanned Classic Mushaf Pages'}
            >
              <BookOpen size={14} className="text-emerald-100 flex-shrink-0" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'المصحف المصور' : 'Scanned Pages'}</span>
              <span className="sm:hidden">{lang === 'ar' ? 'مصور' : 'Scanned'}</span>
            </button>

            <button
              onClick={() => {
                const sNum = surahInfo?.number || chapterNumber;
                window.dispatchEvent(new CustomEvent('open-reflection-journal', { detail: { surahNumber: sNum } }));
                onClose();
              }}
              className="p-2 sm:px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[10px] sm:text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:shadow cursor-pointer select-none flex-shrink-0"
              title={lang === 'ar' ? 'كتابة تأملات وتدبرات شخصية' : 'Write reflection / journal notes'}
            >
              <FileText size={14} className="text-amber-100 flex-shrink-0" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'تدبر السورة' : 'Reflect on Surah'}</span>
              <span className="sm:hidden">{lang === 'ar' ? 'تدبر' : 'Reflect'}</span>
            </button>

            <button 
              onClick={onClose}
              title={curLabels.close}
              className="p-2 bg-[#ffffff] dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 transition-colors border border-secondary-200/50 shadow-sm cursor-pointer flex-shrink-0"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* MAIN BODY AREA */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#f8f6f0] dark:bg-slate-900/40">
          
          {/* LEFT: The Quranic Reading Canvas */}
          <div className="flex-1 flex flex-col justify-between overflow-y-auto relative p-4 sm:p-6 md:p-8">
            
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3 min-h-[300px]">
                <Loader2 size={44} className="animate-spin text-primary-600" />
                <p className="font-serif italic text-secondary-600 animate-pulse text-sm">Opening Holy Page...</p>
              </div>
            ) : error ? (
              <div className="flex-1 flex flex-col items-center justify-center text-rose-500 gap-3 min-h-[300px]">
                <AlertCircle size={44} />
                <p className="font-medium text-sm">{error}</p>
                <button 
                  onClick={onClose}
                  className="mt-2 px-4 py-2 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer text-xs font-bold"
                >
                  {curLabels.close}
                </button>
              </div>
            ) : viewMode === 'continuous' ? (
              
              /* CONTINUOUS SCROLL VIEW */
              <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto bg-white dark:bg-slate-950 rounded-2xl border border-secondary-200/40 shadow-sm p-5 sm:p-10"
              >
                <div className="max-w-3xl mx-auto space-y-10">
                  {/* Decorative Frame */}
                  <div className="relative border-2 border-secondary-200/50 rounded-xl p-6 sm:p-10 bg-[#fdfdfb] dark:bg-slate-900/10">
                    
                    <div className="font-arabic text-justify leading-[2.5] text-slate-900 dark:text-slate-100" dir="rtl" style={{ fontSize: `${classicFontSize}px` }}>
                      {displayedVerses.map((ayah) => {
                        const resolvedChapter = currentChapter || ayah.surah?.number || 1;
                        const isBookmarked = bookmarkedIds.includes(`${resolvedChapter}_${ayah.numberInSurah}`);
                        const isSelected = selectedAyah?.number === ayah.number;
                        
                        return (
                          <span 
                            key={ayah.number}
                            onClick={() => setSelectedAyah(ayah)}
                            className={`inline transition-all duration-150 rounded px-1.5 py-1.5 cursor-pointer
                              ${isSelected 
                                ? 'bg-primary-50 dark:bg-emerald-950/40 ring-1 ring-primary-300 text-slate-950 dark:text-white font-semibold' 
                                : isBookmarked
                                ? 'bg-amber-50 dark:bg-amber-950/20 border-b-2 border-amber-400 text-slate-950'
                                : 'hover:bg-slate-100/60 dark:hover:bg-slate-800'}`}
                          >
                            {/* Render Surah Header Box & Bismillah if this is start of a Surah */}
                            {ayah.numberInSurah === 1 && (
                              <div className="block text-center my-8 select-none" dir="rtl">
                                <div className="bg-[#fcfaf4] dark:bg-slate-800 border-2 border-double border-secondary-300 rounded-xl py-4 px-6 inline-block max-w-sm w-full shadow-sm">
                                  <h4 className="font-arabic text-2xl font-bold text-slate-900 dark:text-slate-100">
                                    {ayah.surah?.name || surahName}
                                  </h4>
                                  <span className="block text-xs font-sans text-slate-500 dark:text-slate-400 mt-1">
                                    {ayah.surah?.revelationType === 'Meccan' ? 'Meccan • مكية' : 'Medinan • مدنية'} • {ayah.surah?.numberOfAyahs || surahInfo?.numberOfAyahs} Verses
                                  </span>
                                </div>
                                <div className="my-6 text-center font-arabic text-3xl text-slate-800 dark:text-slate-100 leading-loose">
                                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                                </div>
                              </div>
                            )}

                            {ayah.text}

                            {/* Verse Stop circle */}
                            <span className="inline-flex items-center justify-center w-[30px] h-[30px] sm:w-[36px] sm:h-[36px] mx-1.5 align-middle select-none relative" aria-label={`Verse ${ayah.numberInSurah}`}>
                              <svg viewBox="0 0 36 36" className={`absolute inset-0 w-full h-full stroke-current stroke-1.5 transition-colors
                                ${isBookmarked ? 'text-amber-500 fill-amber-50 dark:fill-amber-950/30' : 'text-secondary-400 dark:text-slate-500 fill-transparent'}`}>
                                 <circle cx="18" cy="18" r="16" />
                              </svg>
                              <span className="relative text-[10px] sm:text-[12px] font-sans font-bold text-secondary-800 dark:text-slate-300 pt-[2px]">
                                {ayah.numberInSurah}
                              </span>
                            </span>
                          </span>
                        );
                      })}
                      
                      {displayedVerses.length < allVerses.length && (
                        <div className="flex justify-center py-6 mt-4">
                           <Loader2 className="animate-spin text-primary-500 w-6 h-6" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              
              /* FOCUSED VERSE READER MODE */
              (() => {
                const activeAyah = allVerses[activeVerseIndex];
                if (!activeAyah) {
                  return (
                    <div className="flex-1 flex items-center justify-center text-slate-400">
                      <p className="italic">No verses available.</p>
                    </div>
                  );
                }
                
                const resolvedChapter = currentChapter || activeAyah.surah?.number || 1;
                const isBookmarked = bookmarkedIds.includes(`${resolvedChapter}_${activeAyah.numberInSurah}`);
                const isPlayingThisVerse = playingVerseNum === activeAyah.number;
                
                // Active Theme Classes
                const themeClasses = {
                  sepia: 'bg-[#faf6eb] dark:bg-amber-950/15 border-amber-200/50 text-[#2c1d11] dark:text-amber-100/90',
                  mint: 'bg-[#f0f8f5] dark:bg-emerald-950/15 border-emerald-200/60 text-[#0f2d24] dark:text-emerald-100/90',
                  dark: 'bg-slate-950/80 border-slate-800 text-slate-100',
                  light: 'bg-white border-slate-200 text-slate-900 shadow-sm'
                };
                
                const progressPercent = allVerses.length > 0 
                  ? ((activeVerseIndex + 1) / allVerses.length) * 100 
                  : 0;

                return (
                  <div 
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className="flex-1 flex flex-col justify-between"
                  >
                    {/* Theme Customizer & Audio Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 max-w-4xl w-full mx-auto bg-white/40 dark:bg-slate-900/40 p-2 rounded-xl border border-secondary-200/40">
                      {/* Theme selection buttons */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">Theme:</span>
                        {(['sepia', 'mint', 'dark', 'light'] as const).map((tName) => (
                          <button
                            key={tName}
                            onClick={() => handleSetReaderTheme(tName)}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold capitalize transition-all cursor-pointer border select-none
                              ${readerTheme === tName
                                ? 'bg-[#1e293b] text-white border-slate-700 shadow-xs'
                                : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-300 border-slate-200 hover:bg-slate-50'
                              }`}
                          >
                            {tName}
                          </button>
                        ))}
                      </div>

                      {/* Auto play option */}
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={autoPlayNext}
                            onChange={(e) => setAutoPlayNext(e.target.checked)}
                            className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500 w-3.5 h-3.5"
                          />
                          <span className="font-semibold text-[11px] sm:text-xs">Auto-Play Next</span>
                        </label>
                      </div>
                    </div>

                    {/* FOCUSED DECORATIVE CARD */}
                    <div className={`flex-1 max-w-4xl w-full mx-auto border-2 rounded-2xl p-6 sm:p-10 relative flex flex-col justify-between transition-all duration-300 overflow-hidden ${themeClasses[readerTheme]}`}>
                      
                      {/* Slim visual progress bar at top of card */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-300" 
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>

                      {/* Corner Accents for visual premium feel */}
                      <div className="absolute top-4 left-4 w-5 h-5 border-t border-l border-current opacity-30 pointer-events-none rounded-tl-sm" />
                      <div className="absolute top-4 right-4 w-5 h-5 border-t border-r border-current opacity-30 pointer-events-none rounded-tr-sm" />
                      <div className="absolute bottom-4 left-4 w-5 h-5 border-b border-l border-current opacity-30 pointer-events-none rounded-bl-sm" />
                      <div className="absolute bottom-4 right-4 w-5 h-5 border-b border-r border-current opacity-30 pointer-events-none rounded-br-sm" />

                      {/* CARD HEADER: Location info & Index */}
                      <div className="flex items-center justify-between border-b border-current/10 pb-3 mb-6 relative z-10 text-xs font-semibold tracking-wider uppercase opacity-80">
                        <span className="font-serif">
                          {curLabels.juz} {activeAyah.juz} • Page {activeAyah.page}
                        </span>
                        <span className="font-mono text-[11px]">
                          Verse {activeAyah.numberInSurah} of {allVerses.length}
                        </span>
                      </div>

                      {/* CARD CORE: Beautiful Centered Quran Text & Translation */}
                      <div className="flex-1 flex flex-col justify-center relative z-10 py-6">
                        
                        {/* Optional Bismillah Header */}
                        {activeAyah.numberInSurah === 1 && resolvedChapter !== 1 && resolvedChapter !== 9 && (
                          <div className="text-center mb-8 select-none">
                            <div className="my-4 text-center font-arabic text-2xl sm:text-3xl opacity-90 leading-loose">
                              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                            </div>
                          </div>
                        )}

                        {/* Arabic text display with custom sizing */}
                        <p 
                          className="font-arabic text-center leading-[2.2] select-all tracking-wide select-text transition-all duration-200"
                          style={{ fontSize: `${classicFontSize}px` }}
                          dir="rtl"
                        >
                          {activeAyah.text}
                        </p>

                        {/* Elegant Translation section */}
                        {showClassicTranslation && (
                          <div className="mt-8 pt-6 border-t border-current/10 max-w-2xl mx-auto text-center">
                            <p className="font-sans text-sm sm:text-base leading-relaxed tracking-wide opacity-90 select-text">
                              {activeAyah.translationText}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* INTEGRATED PREMIUM VERSE AUDIO PLAYER (Displays when playing this verse or loaded) */}
                      {playingVerseNum === activeAyah.number && (
                        <div className="mt-2 mb-4 p-3 rounded-xl border border-current/10 bg-current/[0.03] space-y-3 animate-in fade-in zoom-in-95 duration-200">
                          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                            {/* Seek controls */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => {
                                  if (verseAudioRef.current) {
                                    verseAudioRef.current.currentTime = Math.max(0, verseAudioRef.current.currentTime - 3);
                                  }
                                }}
                                title="Rewind 3s"
                                className="p-1.5 rounded-lg border border-current/15 hover:bg-current/10 transition-colors cursor-pointer select-none"
                              >
                                <RotateCcw size={12} />
                              </button>
                              <button
                                onClick={() => playVerseAudio(activeAyah)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer select-none"
                              >
                                {audioLoading ? (
                                  <Loader2 size={13} className="animate-spin" />
                                ) : playingVerseNum === activeAyah.number ? (
                                  <Pause size={13} className="fill-current" />
                                ) : (
                                  <Play size={13} className="fill-current ml-0.5" />
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  if (verseAudioRef.current && verseDuration) {
                                    verseAudioRef.current.currentTime = Math.min(verseDuration, verseAudioRef.current.currentTime + 3);
                                  }
                                }}
                                title="Forward 3s"
                                className="p-1.5 rounded-lg border border-current/15 hover:bg-current/10 transition-colors cursor-pointer select-none"
                              >
                                <RotateCcw size={12} className="scale-x-[-1]" />
                              </button>
                            </div>

                            {/* Timeline Slider */}
                            <div className="flex-1 w-full flex items-center gap-2">
                              <span className="text-[10px] font-bold font-mono w-8 text-right opacity-80">
                                {Math.floor(verseCurrentTime / 60)}:{(Math.floor(verseCurrentTime % 60) < 10 ? '0' : '')}{Math.floor(verseCurrentTime % 60)}
                              </span>
                              <input
                                type="range"
                                min={0}
                                max={verseDuration || 100}
                                value={verseCurrentTime}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (verseAudioRef.current) {
                                    verseAudioRef.current.currentTime = val;
                                    setVerseCurrentTime(val);
                                  }
                                }}
                                className="flex-1 h-1 bg-current/15 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:accent-emerald-400"
                              />
                              <span className="text-[10px] font-bold font-mono w-8 opacity-80">
                                {Math.floor(verseDuration / 60)}:{(Math.floor(verseDuration % 60) < 10 ? '0' : '')}{Math.floor(verseDuration % 60)}
                              </span>
                            </div>
                          </div>

                          {/* Speed & Volume Row */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-current/10">
                            {/* Volume controls */}
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setVerseIsMuted(!verseIsMuted)}
                                className="p-1 opacity-70 hover:opacity-100 transition-opacity cursor-pointer select-none"
                              >
                                {verseIsMuted || verseVolume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
                              </button>
                              <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.05}
                                value={verseIsMuted ? 0 : verseVolume}
                                onChange={(e) => {
                                  setVerseVolume(parseFloat(e.target.value));
                                  setVerseIsMuted(false);
                                }}
                                className="w-16 h-0.5 bg-current/15 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:accent-emerald-400"
                              />
                            </div>

                            {/* Playback rate multiplier */}
                            <div className="flex items-center gap-1">
                              <span className="text-[9px] font-bold opacity-60 uppercase tracking-wider mr-1">Rate:</span>
                              {[0.75, 1, 1.25, 1.5].map((rate) => (
                                <button
                                  key={rate}
                                  onClick={() => setVerseSpeed(rate)}
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono border transition-all cursor-pointer select-none
                                    ${verseSpeed === rate 
                                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                                      : 'bg-transparent border-current/15 hover:bg-current/5'
                                    }`}
                                >
                                  {rate}x
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* CARD ACTIONS: Integrated direct utilities */}
                      <div className="flex items-center justify-between pt-4 mt-6 border-t border-current/10 relative z-10">
                        {/* Quick action group */}
                        <div className="flex items-center gap-1.5">
                          {/* Play Verse Button */}
                          <button
                            onClick={() => playVerseAudio(activeAyah)}
                            disabled={audioLoading && playingVerseNum === activeAyah.number}
                            className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all cursor-pointer disabled:opacity-50
                              ${isPlayingThisVerse
                                ? 'bg-amber-500 text-white shadow-md scale-105'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                              }`}
                            title={isPlayingThisVerse ? "Pause verse recitation" : "Listen to this verse"}
                          >
                            {audioLoading && playingVerseNum === activeAyah.number ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : isPlayingThisVerse ? (
                              <Pause size={15} className="fill-current" />
                            ) : (
                              <Play size={15} className="fill-current ml-0.5" />
                            )}
                          </button>

                          {/* Inline Translation Visibility Button */}
                          <button
                            onClick={() => setShowClassicTranslation(!showClassicTranslation)}
                            className="h-9 px-3 rounded-xl border border-current/20 hover:bg-current/5 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                            title={showClassicTranslation ? "Hide Translation" : "Show Translation"}
                          >
                            {showClassicTranslation ? <EyeOff size={14} /> : <Eye size={14} />}
                            <span className="hidden sm:inline">{showClassicTranslation ? "Hide Translation" : "Show Translation"}</span>
                          </button>
                        </div>

                        {/* Right aligned actions: bookmark and copy */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleBookmark(activeAyah)}
                            className="p-2 border border-current/20 hover:bg-current/5 rounded-xl transition-all cursor-pointer"
                            title="Bookmark this verse"
                          >
                            <Bookmark 
                              size={15} 
                              fill={isBookmarked ? "currentColor" : "none"}
                              className={isBookmarked ? "text-amber-500" : ""}
                            />
                          </button>
                          <button
                            onClick={() => handleCopy(activeAyah)}
                            className="p-2 border border-current/20 hover:bg-current/5 rounded-xl transition-all cursor-pointer"
                            title="Copy Arabic and translation"
                          >
                            {copiedAyahId === activeAyah.number ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                          </button>
                          <button
                            onClick={() => {
                              const sNum = surahInfo?.number || chapterNumber;
                              window.dispatchEvent(new CustomEvent('open-reflection-journal', { 
                                detail: { 
                                  surahNumber: sNum,
                                  ayahRange: activeAyah.numberInSurah.toString()
                                } 
                              }));
                              onClose();
                            }}
                            className="p-2 border border-amber-500/30 hover:bg-amber-50/10 text-amber-600 hover:text-amber-800 rounded-xl transition-all cursor-pointer"
                            title="Reflect on this verse"
                          >
                            <FileText size={15} />
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* TOUCH FRIENDLY ACCESSIBLE NAVIGATION CONTROLS */}
                    <div className="flex items-center justify-between gap-3 mt-4 max-w-4xl w-full mx-auto">
                      <button
                        onClick={() => {
                          setActiveVerseIndex(prev => Math.max(0, prev - 1));
                          setPlayingVerseNum(null);
                        }}
                        disabled={activeVerseIndex === 0}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-white text-xs font-extrabold text-slate-700 dark:text-slate-200 rounded-xl border border-secondary-200 shadow-sm cursor-pointer select-none transition-all disabled:cursor-not-allowed h-11"
                      >
                        <ChevronLeft size={16} />
                        <span>PREV VERSE</span>
                      </button>

                      {/* Center verse index slider dropdown */}
                      <div className="flex items-center gap-1.5 bg-white dark:bg-slate-850 border border-secondary-200/60 px-3 py-1.5 rounded-xl shadow-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase hidden sm:inline">Jump:</span>
                        <select
                          value={activeVerseIndex}
                          onChange={(e) => {
                            setActiveVerseIndex(parseInt(e.target.value, 10));
                            setPlayingVerseNum(null);
                          }}
                          className="text-xs font-bold bg-transparent border-none focus:ring-0 text-slate-700 dark:text-slate-200 cursor-pointer py-0.5"
                        >
                          {allVerses.map((av, index) => (
                            <option key={av.number} value={index} className="dark:bg-slate-900">
                              Verse {av.numberInSurah}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={() => {
                          setActiveVerseIndex(prev => Math.min(allVerses.length - 1, prev + 1));
                          setPlayingVerseNum(null);
                        }}
                        disabled={activeVerseIndex === allVerses.length - 1}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-white text-xs font-extrabold text-slate-700 dark:text-slate-200 rounded-xl border border-secondary-200 shadow-sm cursor-pointer select-none transition-all disabled:cursor-not-allowed h-11"
                      >
                        <span>NEXT VERSE</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>

                  </div>
                );
              })()
            )}
          </div>

          {/* RIGHT: Selected/Hovered Ayah Translation Control Center & Details HUD */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-secondary-200/50 bg-[#faf9f6] dark:bg-slate-900 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto">
            
            <div className="space-y-6">
              
              {/* Settings Controls Box */}
              <div className="bg-white dark:bg-slate-950 border border-secondary-200/50 p-4 rounded-xl shadow-xs space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  Reader Settings
                </span>
                
                {/* Font size control */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span>{curLabels.fontSize}</span>
                    <span className="font-mono">{classicFontSize}px</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setClassicFontSize(prev => Math.max(18, prev - 2))}
                      className="flex-1 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm cursor-pointer"
                    >
                      A-
                    </button>
                    <button
                      onClick={() => setClassicFontSize(prev => Math.min(36, prev + 2))}
                      className="flex-1 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm cursor-pointer"
                    >
                      A+
                    </button>
                  </div>
                </div>

                {/* Inline translation toggle */}
                {viewMode === 'classic' && (
                  <button
                    onClick={() => setShowClassicTranslation(!showClassicTranslation)}
                    className={`w-full inline-flex items-center justify-between px-3 py-2 rounded-lg border transition-all text-xs font-semibold cursor-pointer select-none
                      ${showClassicTranslation 
                        ? 'bg-primary-50 border-primary-300 text-primary-800 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300' 
                        : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100'
                      }`}
                  >
                    <span>{curLabels.showTranslation}</span>
                    {showClassicTranslation ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                )}
              </div>

              {/* Dynamic Page Dropdown selector */}
              {viewMode === 'continuous' && !currentPage && surahPages.length > 1 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Jump to Page
                  </span>
                  <select
                    value={activePageNumber}
                    onChange={(e) => {
                      setActivePageNumber(parseInt(e.target.value, 10));
                      setSelectedAyah(null);
                    }}
                    className="w-full text-xs font-bold bg-white dark:bg-slate-950 border border-secondary-200 rounded-lg py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-800 dark:text-slate-100 cursor-pointer shadow-sm"
                  >
                    {surahPages.map(p => (
                      <option key={p} value={p}>Page {p}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Selected Ayah translation panel */}
              <div className="space-y-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  Selected Verse Details
                </span>

                {selectedAyah ? (
                  <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="flex items-center justify-between">
                      <span className="inline-block px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 border border-amber-200/50 text-[10px] font-bold text-amber-800 dark:text-amber-400">
                        Verse {selectedAyah.numberInSurah}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleBookmark(selectedAyah)}
                          title="Bookmark verse"
                          className="p-1.5 bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-700 border border-secondary-200/40 rounded-lg text-slate-400 hover:text-amber-500 transition-colors shadow-xs cursor-pointer"
                        >
                          <Bookmark 
                            size={13} 
                            fill={bookmarkedIds.includes(`${currentChapter || selectedAyah.surah?.number || 1}_${selectedAyah.numberInSurah}`) ? "currentColor" : "none"}
                            className={bookmarkedIds.includes(`${currentChapter || selectedAyah.surah?.number || 1}_${selectedAyah.numberInSurah}`) ? "text-amber-500" : ""}
                          />
                        </button>
                        <button
                          onClick={() => handleCopy(selectedAyah)}
                          title="Copy verse details"
                          className="p-1.5 bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-700 border border-secondary-200/40 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors shadow-xs cursor-pointer"
                        >
                          {copiedAyahId === selectedAyah.number ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                        </button>
                        <button
                          onClick={() => {
                            const sNum = currentChapter || selectedAyah.surah?.number || 1;
                            window.dispatchEvent(new CustomEvent('open-reflection-journal', { 
                              detail: { 
                                surahNumber: sNum,
                                ayahRange: selectedAyah.numberInSurah.toString()
                              } 
                            }));
                            onClose();
                          }}
                          title="Reflect on this verse"
                          className="p-1.5 bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-700 border border-secondary-200/40 rounded-lg text-amber-600 hover:text-amber-800 transition-colors shadow-xs cursor-pointer"
                        >
                          <FileText size={13} />
                        </button>
                      </div>
                    </div>

                    <p className="font-arabic text-xl text-right text-slate-800 dark:text-slate-200 leading-[1.8] border-r-2 border-secondary-300 pr-2 select-all">
                      {selectedAyah.text}
                    </p>

                    <div className="space-y-1 bg-white dark:bg-slate-950 p-3 rounded-lg border border-secondary-200/40">
                      <span className="block text-[9px] uppercase font-bold text-slate-400">Sahih Translation</span>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans text-justify select-text">
                        {selectedAyah.translationText || 'Loading Translation...'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-400 italic text-xs">
                    {curLabels.clickTip}
                  </div>
                )}
              </div>

            </div>

            {/* Bottom Tip bar */}
            <div className="text-[10px] text-slate-400/80 dark:text-slate-500/80 leading-normal border-t border-secondary-200/40 pt-4 mt-6">
              <Info size={11} className="inline mr-1 -mt-0.5 text-primary-500" />
              <span>{curLabels.clickTip}</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default QuranModal;
