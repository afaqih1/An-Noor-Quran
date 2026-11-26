import React, { useEffect, useState, useRef } from 'react';
import { 
  BookOpen, Book, Play, Pause, ChevronRight, ChevronLeft, Loader2, AlertCircle, 
  Bookmark, Copy, Volume2, VolumeX, Settings, Globe, RefreshCw, Sparkles, Check, List, HelpCircle,
  SkipForward, SkipBack, Music, Info, Search, ChevronDown, ChevronUp, Sliders, X, Flag,
  HardDrive, Wifi, WifiOff, CheckCircle2, Download, Mic
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { allSurahs, SurahInfo } from './surahListData';
import { SURAH_START_PAGES, JUZ_START_PAGES } from './ClassicMushafModal';
import { offlineStorage, ESSENTIAL_FRIDAY_SURAHS } from './offlineStorageService';
import { OfflineModal } from './OfflineModal';

// Cache to store loaded Juz and Surah text data to make browsing instant and offline-friendly
const quranDataCache: Record<string, any[]> = {};


// Available translations list
const translationsList = [
  { id: 'en.sahih', name: 'English (Sahih International)', lang: 'en' },
  { id: 'ur.ahmadrida', name: 'Urdu (احمد رضا خان)', lang: 'ur' },
  { id: 'fr.hamidullah', name: 'French (Muhammad Hamidullah)', lang: 'fr' },
  { id: 'tr.diyanet', name: 'Turkish (Diyanet İşleri)', lang: 'tr' },
  { id: 'es.cortes', name: 'Spanish (Julio Cortes)', lang: 'es' },
  { id: 'bn.bengali', name: 'Bengali (Zohurul Hoque)', lang: 'bn' },
  { id: 'de.bubenheim', name: 'German (Bubenheim & Elyas)', lang: 'de' },
  { id: 'ru.abuadel', name: 'Russian (Abu Adel)', lang: 'ru' },
];

// Available reciters list
const recitersList = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy', desc: 'Beautiful & clear' },
  { id: 'ar.abdurrahmaansudais', name: 'Abdurrahman As-Sudais', desc: 'Makkah Imam' },
  { id: 'ar.mahermuaiqly', name: 'Maher Al-Muaiqly', desc: 'Emotional & smooth' },
  { id: 'ar.minshawi', name: 'Mohamed Siddiq Al-Minshawi', desc: 'Classic Tajweed' },
  { id: 'ar.hudhaify', name: 'Ali Al-Huthaify', desc: 'Slow & meditative' },
];

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
  audio: string;
  audioSecondary: string[];
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
  };
  translationText?: string;
}

interface QuranJuzSectionProps {
  selectedReciter?: string;
  onReciterChange?: (reciter: string) => void;
  selectedTranslation?: string;
  onTranslationChange?: (translation: string) => void;
  autoAdvance?: boolean;
  onAutoAdvanceChange?: (enabled: boolean) => void;
  fontSize?: number;
  onFontSizeChange?: (size: number) => void;
}

export const QuranJuzSection: React.FC<QuranJuzSectionProps> = ({
  selectedReciter: propSelectedReciter,
  onReciterChange,
  selectedTranslation: propSelectedTranslation,
  onTranslationChange,
  autoAdvance: propAutoAdvance,
  onAutoAdvanceChange,
  fontSize: propFontSize,
  onFontSizeChange
}) => {
  const { language, t } = useLanguage();
  const [selectedJuz, setSelectedJuz] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('quran-selected-juz');
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  const [selectedSurah, setSelectedSurah] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('quran-selected-surah');
      return saved ? parseInt(saved, 10) : 18; // Default to Al-Kahf
    } catch {
      return 18;
    }
  });

  const [browseMode, setBrowseMode] = useState<'juz' | 'surah'>(() => {
    try {
      return (localStorage.getItem('quran-browse-mode') as 'juz' | 'surah') || 'juz';
    } catch {
      return 'juz';
    }
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSettingsExpanded, setIsSettingsExpanded] = useState<boolean>(false);

  const [expandedTafsirKeys, setExpandedTafsirKeys] = useState<string[]>([]);
  const [expandedTafsir, setExpandedTafsir] = useState<Record<string, {
    english?: string;
    arabic?: string;
    loading: boolean;
    error?: string;
  }>>({});

  // Sync selections to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('quran-selected-juz', selectedJuz.toString());
    } catch (e) { console.error(e); }
  }, [selectedJuz]);

  useEffect(() => {
    try {
      localStorage.setItem('quran-selected-surah', selectedSurah.toString());
    } catch (e) { console.error(e); }
  }, [selectedSurah]);

  useEffect(() => {
    try {
      localStorage.setItem('quran-browse-mode', browseMode);
    } catch (e) { console.error(e); }
  }, [browseMode]);

  // Listen for open-quran-surah event from global search
  useEffect(() => {
    const handleOpenSurahEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.surahNumber) {
        setSelectedSurah(customEvent.detail.surahNumber);
        setBrowseMode('surah');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('open-quran-surah', handleOpenSurahEvent);
    return () => {
      window.removeEventListener('open-quran-surah', handleOpenSurahEvent);
    };
  }, []);
  
  const [localTranslation, setLocalTranslation] = useState<string>(() => {
    try {
      return localStorage.getItem('quran-translation') || 'en.sahih';
    } catch {
      return 'en.sahih';
    }
  });
  const selectedTranslation = propSelectedTranslation !== undefined ? propSelectedTranslation : localTranslation;
  const setSelectedTranslation = (val: string) => {
    if (onTranslationChange) {
      onTranslationChange(val);
    } else {
      setLocalTranslation(val);
      try {
        localStorage.setItem('quran-translation', val);
      } catch (e) { console.error(e); }
    }
  };

  const [localReciter, setLocalReciter] = useState<string>(() => {
    try {
      return localStorage.getItem('quran-reciter') || 'ar.alafasy';
    } catch {
      return 'ar.alafasy';
    }
  });
  const selectedReciter = propSelectedReciter !== undefined ? propSelectedReciter : localReciter;
  const setSelectedReciter = (val: string) => {
    if (onReciterChange) {
      onReciterChange(val);
    } else {
      setLocalReciter(val);
      try {
        localStorage.setItem('quran-reciter', val);
      } catch (e) { console.error(e); }
    }
  };
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [activeAyahIndex, setActiveAyahIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  const [localAutoAdvance, setLocalAutoAdvance] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quran-auto-advance') !== 'false';
    } catch {
      return true;
    }
  });
  const autoAdvance = propAutoAdvance !== undefined ? propAutoAdvance : localAutoAdvance;
  const setAutoAdvance = (val: boolean) => {
    if (onAutoAdvanceChange) {
      onAutoAdvanceChange(val);
    } else {
      setLocalAutoAdvance(val);
      try {
        localStorage.setItem('quran-auto-advance', val ? 'true' : 'false');
      } catch (e) { console.error(e); }
    }
  };

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState<boolean>(false);
  const [isServedFromOffline, setIsServedFromOffline] = useState<boolean>(false);
  const [cachedSurahsCount, setCachedSurahsCount] = useState<number>(0);
  const [isOnlineState, setIsOnlineState] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Check cached count and network status
  useEffect(() => {
    const updateStats = async () => {
      const stats = await offlineStorage.getStorageStats();
      setCachedSurahsCount(stats.cachedSurahsCount);
      setIsOnlineState(typeof navigator !== 'undefined' ? navigator.onLine : true);
    };
    updateStats();

    const handleOnline = () => setIsOnlineState(true);
    const handleOffline = () => setIsOnlineState(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('offline-cache-updated', updateStats);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('offline-cache-updated', updateStats);
    };
  }, []);

  // Background silent pre-cache of essential Friday Surahs
  useEffect(() => {
    offlineStorage.autoPrecacheEssentialSurahsSilently(selectedTranslation);
  }, [selectedTranslation]);

  // Progress tracking: Last read Ayah per Juz / Surah
  const [juzLastRead, setJuzLastRead] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('quran-juz-last-read');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [surahLastRead, setSurahLastRead] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('quran-surah-last-read');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const markAsLastRead = (ayah: Ayah) => {
    if (browseMode === 'juz') {
      const updated = { ...juzLastRead, [selectedJuz]: ayah.number };
      setJuzLastRead(updated);
      try {
        localStorage.setItem('quran-juz-last-read', JSON.stringify(updated));
      } catch (e) { console.error(e); }
    } else {
      const updated = { ...surahLastRead, [selectedSurah]: ayah.number };
      setSurahLastRead(updated);
      try {
        localStorage.setItem('quran-surah-last-read', JSON.stringify(updated));
      } catch (e) { console.error(e); }
    }
  };
  
  const [localFontSize, setLocalFontSize] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('quran-font-size');
      return saved ? parseFloat(saved) : 1.15;
    } catch {
      return 1.15;
    }
  });
  const fontSize = propFontSize !== undefined ? propFontSize : localFontSize;
  const setFontSize = (val: number | ((prev: number) => number)) => {
    const nextVal = typeof val === 'function' ? val(fontSize) : val;
    if (onFontSizeChange) {
      onFontSizeChange(nextVal);
    } else {
      setLocalFontSize(nextVal);
      try {
        localStorage.setItem('quran-font-size', nextVal.toString());
      } catch (e) { console.error(e); }
    }
  };
  const [playbackMode, setPlaybackMode] = useState<'juz' | 'surah'>('juz');
  const [activeSurahPlaying, setActiveSurahPlaying] = useState<number | null>(null);

  const [readerTheme, setReaderTheme] = useState<'sepia' | 'mint' | 'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('quran-reader-theme');
      return (saved as 'sepia' | 'mint' | 'dark' | 'light') || 'sepia';
    } catch {
      return 'sepia';
    }
  });

  const handleSetReaderTheme = (val: 'sepia' | 'mint' | 'dark' | 'light') => {
    setReaderTheme(val);
    try {
      localStorage.setItem('quran-reader-theme', val);
    } catch (e) {
      console.error(e);
    }
  };

  const getAyahAudioUrl = (ayah: Ayah, reciter: string): string => {
    let audioUrl = ayah.audio;
    if (audioUrl) {
      try {
        const parts = audioUrl.split('/');
        const idx128 = parts.indexOf('128');
        if (idx128 !== -1 && idx128 + 1 < parts.length) {
          parts[idx128 + 1] = reciter;
          return parts.join('/');
        }
      } catch (e) {
        console.error(e);
      }
    }
    return `https://cdn.islamic.network/quran/audio/128/${reciter}/${ayah.number}.mp3`;
  };

  // Advanced audio player states
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextAudioRef = useRef<HTMLAudioElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeAyahRef = useRef<HTMLDivElement | null>(null);

  // Sync state variables to stable refs so the audio listener doesn't need to re-run
  const ayahsRef = useRef<Ayah[]>(ayahs);
  const activeAyahIndexRef = useRef<number | null>(activeAyahIndex);
  const autoAdvanceRef = useRef<boolean>(autoAdvance);
  const playbackModeRef = useRef<'juz' | 'surah'>(playbackMode);
  const activeSurahPlayingRef = useRef<number | null>(activeSurahPlaying);
  const playAyahRef = useRef<((index: number) => void) | null>(null);

  useEffect(() => {
    ayahsRef.current = ayahs;
  }, [ayahs]);

  useEffect(() => {
    activeAyahIndexRef.current = activeAyahIndex;
  }, [activeAyahIndex]);

  useEffect(() => {
    autoAdvanceRef.current = autoAdvance;
  }, [autoAdvance]);

  useEffect(() => {
    playbackModeRef.current = playbackMode;
  }, [playbackMode]);

  useEffect(() => {
    activeSurahPlayingRef.current = activeSurahPlaying;
  }, [activeSurahPlaying]);

  useEffect(() => {
    playAyahRef.current = playAyah;
  });

  const activeAyah = activeAyahIndex !== null && ayahs[activeAyahIndex] ? ayahs[activeAyahIndex] : null;

  // Initialize and load bookmarks
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
    loadBookmarks();
    window.addEventListener('bookmarks-updated', loadBookmarks);
    return () => window.removeEventListener('bookmarks-updated', loadBookmarks);
  }, []);

  // Fetch Quran Data (Juz or Surah)
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setIsPlaying(false);
    setActiveAyahIndex(null);
    setExpandedTafsirKeys([]);

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const fetchData = async () => {
      try {
        const isJuz = browseMode === 'juz';
        const endpoint = isJuz ? 'juz' : 'surah';
        const id = isJuz ? selectedJuz : selectedSurah;
        const cacheKey = `${endpoint}_${id}_${selectedTranslation}`;

        // 1. Check in-memory session cache
        if (quranDataCache[cacheKey]) {
          if (active) {
            setAyahs(quranDataCache[cacheKey] as Ayah[]);
            setIsServedFromOffline(true);
            setLoading(false);
          }
          return;
        }

        // 2. Check persistent IndexedDB / localStorage offline storage
        const offlineData = await offlineStorage.getQuranData(cacheKey);
        if (offlineData && Array.isArray(offlineData) && offlineData.length > 0) {
          quranDataCache[cacheKey] = offlineData;
          if (active) {
            setAyahs(offlineData as Ayah[]);
            setIsServedFromOffline(true);
            setLoading(false);
          }
          return;
        }

        // 3. If online, fetch from Cloud Quran API
        const arabicUrl = `https://api.alquran.cloud/v1/${endpoint}/${id}/ar.alafasy`;
        const translationUrl = `https://api.alquran.cloud/v1/${endpoint}/${id}/${selectedTranslation}`;

        const [arabicRes, translationRes] = await Promise.all([
          fetch(arabicUrl),
          fetch(translationUrl)
        ]);

        if (!arabicRes.ok || !translationRes.ok) {
          throw new Error(`Failed to load Quran ${isJuz ? 'Juz' : 'Surah'} texts from the cloud servers.`);
        }

        const arabicData = await arabicRes.json();
        const translationData = await translationRes.json();

        if (active) {
          const cleanAyahText = (text: string, surahNumber: number, ayahNumber: number): string => {
            if (ayahNumber === 1 && surahNumber !== 1 && surahNumber !== 9) {
              const basmala1 = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
              const basmala2 = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
              
              if (text.startsWith(basmala1)) {
                return text.substring(basmala1.length).trim();
              }
              if (text.startsWith(basmala2)) {
                return text.substring(basmala2.length).trim();
              }
              
              const splitKey = "ٱلرَّحِيمِ";
              const idx1 = text.indexOf(splitKey);
              if (idx1 !== -1 && idx1 < 50) {
                return text.substring(idx1 + splitKey.length).trim();
              }
              
              const splitKey2 = "الرَّحِيمِ";
              const idx2 = text.indexOf(splitKey2);
              if (idx2 !== -1 && idx2 < 50) {
                return text.substring(idx2 + splitKey2.length).trim();
              }
            }
            return text;
          };

          const rawAyahs = isJuz ? arabicData.data.ayahs : arabicData.data.ayahs;
          const combined: Ayah[] = rawAyahs.map((ayah: any, idx: number) => {
            const transAyah = translationData.data.ayahs[idx];
            const surahInfo = isJuz ? ayah.surah : {
              number: arabicData.data.number,
              name: arabicData.data.name,
              englishName: arabicData.data.englishName,
              englishNameTranslation: arabicData.data.englishNameTranslation,
              revelationType: arabicData.data.revelationType,
              numberOfAyahs: arabicData.data.numberOfAyahs
            };

            return {
              ...ayah,
              surah: surahInfo,
              text: cleanAyahText(ayah.text, surahInfo.number, ayah.numberInSurah),
              translationText: transAyah ? transAyah.text : ''
            };
          });

          // Save combined results to session cache & durable offline cache
          quranDataCache[cacheKey] = combined;
          offlineStorage.setQuranData(cacheKey, combined, {
            surah: isJuz ? undefined : selectedSurah,
            juz: isJuz ? selectedJuz : undefined,
            translation: selectedTranslation
          });

          setAyahs(combined);
          setIsServedFromOffline(false);
          setLoading(false);
        }
      } catch (err: any) {
        console.error(err);
        if (active) {
          // Check fallback to any translation cached locally
          const fallbackData = await offlineStorage.getQuranData(`surah_${selectedSurah}_en.sahih`);
          if (fallbackData && fallbackData.length > 0) {
            setAyahs(fallbackData as Ayah[]);
            setIsServedFromOffline(true);
            setLoading(false);
            return;
          }

          setError(err.message || 'Something went wrong while fetching Quran contents. Check your internet connection or use Offline Mode.');
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [browseMode, selectedJuz, selectedSurah, selectedTranslation]);

  // Auto-scroll to last read Ayah when a Juz / Surah first loads
  useEffect(() => {
    if (!loading && ayahs.length > 0) {
      const targetAyahNumber = browseMode === 'juz' ? juzLastRead[selectedJuz] : surahLastRead[selectedSurah];
      if (targetAyahNumber) {
        const timer = setTimeout(() => {
          const element = document.getElementById(`ayah-card-${targetAyahNumber}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, selectedJuz, selectedSurah, browseMode]);

  // Background Pre-fetching for next Juz / Surah
  useEffect(() => {
    if (loading || error) return;

    const prefetchNext = async () => {
      try {
        const isJuz = browseMode === 'juz';
        const endpoint = isJuz ? 'juz' : 'surah';
        const nextId = isJuz 
          ? (selectedJuz < 30 ? selectedJuz + 1 : null)
          : (selectedSurah < 114 ? selectedSurah + 1 : null);

        if (!nextId) return;

        const cacheKey = `${endpoint}_${nextId}_${selectedTranslation}`;
        if (quranDataCache[cacheKey]) return; // Already cached

        const arabicUrl = `https://api.alquran.cloud/v1/${endpoint}/${nextId}/ar.alafasy`;
        const translationUrl = `https://api.alquran.cloud/v1/${endpoint}/${nextId}/${selectedTranslation}`;

        const [arabicRes, translationRes] = await Promise.all([
          fetch(arabicUrl),
          fetch(translationUrl)
        ]);

        if (arabicRes.ok && translationRes.ok) {
          const arabicData = await arabicRes.json();
          const translationData = await translationRes.json();

          const cleanAyahText = (text: string, surahNumber: number, ayahNumber: number): string => {
            if (ayahNumber === 1 && surahNumber !== 1 && surahNumber !== 9) {
              const basmala1 = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
              const basmala2 = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
              if (text.startsWith(basmala1)) return text.substring(basmala1.length).trim();
              if (text.startsWith(basmala2)) return text.substring(basmala2.length).trim();
              const splitKey = "ٱلرَّحِيمِ";
              const idx1 = text.indexOf(splitKey);
              if (idx1 !== -1 && idx1 < 50) return text.substring(idx1 + splitKey.length).trim();
              const splitKey2 = "الرَّحِيمِ";
              const idx2 = text.indexOf(splitKey2);
              if (idx2 !== -1 && idx2 < 50) return text.substring(idx2 + splitKey2.length).trim();
            }
            return text;
          };

          const rawAyahs = isJuz ? arabicData.data.ayahs : arabicData.data.ayahs;
          const combined: Ayah[] = rawAyahs.map((ayah: any, idx: number) => {
            const transAyah = translationData.data.ayahs[idx];
            const surahInfo = isJuz ? ayah.surah : {
              number: arabicData.data.number,
              name: arabicData.data.name,
              englishName: arabicData.data.englishName,
              englishNameTranslation: arabicData.data.englishNameTranslation,
              revelationType: arabicData.data.revelationType,
              numberOfAyahs: arabicData.data.numberOfAyahs
            };

            return {
              ...ayah,
              surah: surahInfo,
              text: cleanAyahText(ayah.text, surahInfo.number, ayah.numberInSurah),
              translationText: transAyah ? transAyah.text : ''
            };
          });

          quranDataCache[cacheKey] = combined;
          console.log(`Prefetched and cached ${endpoint} ${nextId}`);
        }
      } catch (e) {
        console.warn("Background prefetch failed:", e);
      }
    };

    const timer = setTimeout(() => {
      prefetchNext();
    }, 2000);

    return () => clearTimeout(timer);
  }, [loading, error, browseMode, selectedJuz, selectedSurah, selectedTranslation]);

  // Audio setup and event listeners
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleEnded = () => {
      if (autoAdvanceRef.current) {
        if (playbackModeRef.current === 'surah') {
          if (activeAyahIndexRef.current !== null && activeAyahIndexRef.current < ayahsRef.current.length - 1) {
            const nextAyah = ayahsRef.current[activeAyahIndexRef.current + 1];
            if (nextAyah.surah.number === activeSurahPlayingRef.current) {
              playAyahRef.current?.(activeAyahIndexRef.current + 1);
              return;
            }
          }
          setIsPlaying(false);
        } else {
          // next ayah
          if (activeAyahIndexRef.current !== null && activeAyahIndexRef.current < ayahsRef.current.length - 1) {
            playAyahRef.current?.(activeAyahIndexRef.current + 1);
          } else if (activeAyahIndexRef.current === null && ayahsRef.current.length > 0) {
            playAyahRef.current?.(0);
          }
        }
      } else {
        setIsPlaying(false);
      }
    };

    const handlePauseEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.sender === 'quran-juz') {
        return;
      }
      setIsPlaying(false);
      audio.pause();
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(audio.duration || 0);
    };

    const handleWaiting = () => {
      setIsWaiting(true);
    };

    const handlePlaying = () => {
      setIsWaiting(false);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('loadedmetadata', handleDurationChange);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('canplay', handlePlaying);

    window.addEventListener('pause-recitation', handlePauseEvent);

    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('loadedmetadata', handleDurationChange);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('canplay', handlePlaying);
      window.removeEventListener('pause-recitation', handlePauseEvent);
      audioRef.current = null;
    };
  }, []);

  // Sync playback properties
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Audio helper methods
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleSkipBackwardSeconds = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
    }
  };

  const handleSkipForwardSeconds = () => {
    if (audioRef.current && duration) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 5);
    }
  };

  // Hot-swap reciter in real-time mid-playback
  useEffect(() => {
    if (isPlaying && activeAyahIndex !== null && audioRef.current && ayahs[activeAyahIndex]) {
      const activeAyah = ayahs[activeAyahIndex];
      const savedTime = audioRef.current.currentTime;
      audioRef.current.src = getAyahAudioUrl(activeAyah, selectedReciter);
      audioRef.current.currentTime = savedTime;
      audioRef.current.play().catch(err => {
        if (err.name !== 'AbortError') {
          console.error("Qari hot-swap error:", err);
        }
      });
    }
  }, [selectedReciter]);

  // Handle playing a specific Ayah index
  const playAyah = (index: number) => {
    const audio = audioRef.current;
    if (!audio || index < 0 || index >= ayahs.length) return;

    // Disconnect/Pause standard media player, passing quran-juz sender
    window.dispatchEvent(new CustomEvent('pause-recitation', { detail: { sender: 'quran-juz' } }));

    const targetAyah = ayahs[index];
    markAsLastRead(targetAyah);
    const isSame = activeAyahIndex === index;

    const isAbortError = (err: any) => {
      return err && (
        err.name === 'AbortError' || 
        err.message?.includes('interrupted') || 
        err.message?.includes('pause') ||
        err.message?.includes('The play() request was interrupted')
      );
    };

    if (isSame) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(err => {
            if (!isAbortError(err)) {
              console.error("Audio playback error:", err);
              setError("Failed to stream audio file for this verse.");
            }
          });
      }
    } else {
      const audioUrl = getAyahAudioUrl(targetAyah, selectedReciter);
      audio.src = audioUrl;
      audio.playbackRate = playbackSpeed;
      audio.volume = volume;
      audio.muted = isMuted;
      audio.load();
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setActiveAyahIndex(index);
          // Scroll into view gently
          setTimeout(() => {
            activeAyahRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);

          // Pre-buffer the NEXT ayah audio in the background!
          const nextIndex = index + 1;
          if (nextIndex < ayahs.length && nextAudioRef.current) {
            const nextAyah = ayahs[nextIndex];
            nextAudioRef.current.src = getAyahAudioUrl(nextAyah, selectedReciter);
            nextAudioRef.current.preload = "auto";
            nextAudioRef.current.load();
          }
        })
        .catch(err => {
          if (!isAbortError(err)) {
            console.error("Audio playback error:", err);
            setError("Failed to stream audio file for this verse.");
          }
        });
    }
  };

  const handleNextAyah = () => {
    if (activeAyahIndex !== null && activeAyahIndex < ayahs.length - 1) {
      playAyah(activeAyahIndex + 1);
    } else if (activeAyahIndex === null && ayahs.length > 0) {
      playAyah(0);
    }
  };

  const handlePrevAyah = () => {
    if (activeAyahIndex !== null && activeAyahIndex > 0) {
      playAyah(activeAyahIndex - 1);
    }
  };

  const handleReciteSurah = (surahNumber: number, startIndexInJuz: number) => {
    setPlaybackMode('surah');
    setActiveSurahPlaying(surahNumber);
    playAyah(startIndexInJuz);
  };

  const toggleBookmark = (ayah: Ayah) => {
    const id = `${ayah.surah.number}_${ayah.numberInSurah}`;
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
          chapterNumber: ayah.surah.number,
          surahName: ayah.surah.englishName,
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

  const handleCopyText = (text: string, index: number) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const fetchTafsir = async (surahNumber: number, ayahNumber: number) => {
    const key = `${surahNumber}_${ayahNumber}`;
    
    if (expandedTafsir[key] && (expandedTafsir[key].loading || expandedTafsir[key].english || expandedTafsir[key].arabic)) {
      return;
    }

    setExpandedTafsir(prev => ({
      ...prev,
      [key]: { loading: true }
    }));

    try {
      const [enRes, arRes] = await Promise.allSettled([
        fetch(`https://api.quran-tafseer.com/tafseer/10/${surahNumber}/${ayahNumber}`),
        fetch(`https://api.quran-tafseer.com/tafseer/9/${surahNumber}/${ayahNumber}`)
      ]);

      let englishText = '';
      let arabicText = '';

      if (enRes.status === 'fulfilled' && enRes.value.ok) {
        const data = await enRes.value.json();
        englishText = data.text || '';
      }

      if (arRes.status === 'fulfilled' && arRes.value.ok) {
        const data = await arRes.value.json();
        arabicText = data.text || '';
      }

      if (!englishText && !arabicText) {
        throw new Error("Tafsir content not available from the server.");
      }

      setExpandedTafsir(prev => ({
        ...prev,
        [key]: {
          loading: false,
          english: englishText,
          arabic: arabicText
        }
      }));
    } catch (err: any) {
      console.error("Failed to fetch Tafsir:", err);
      setExpandedTafsir(prev => ({
        ...prev,
        [key]: {
          loading: false,
          error: err.message || "Could not retrieve Tafsir."
        }
      }));
    }
  };

  const themeHeaderClasses = {
    sepia: 'bg-[#f4efe2] dark:bg-[#231b13] border-t-2 border-x-2 border-[#ebdcb9] dark:border-[#2d2114] text-[#2c1d11] dark:text-[#f3e3ca]',
    mint: 'bg-[#e5f3ed] dark:bg-[#10211a] border-t-2 border-x-2 border-[#cbebe0] dark:border-[#132c21] text-[#0f2d24] dark:text-[#caebd9]',
    dark: 'bg-slate-900 border-t-2 border-x-2 border-slate-800 text-slate-100',
    light: 'bg-slate-50 border-t-2 border-x-2 border-slate-200 text-slate-900'
  };

  const themeContainerClasses = {
    sepia: 'bg-[#faf6eb] dark:bg-[#1a140e] border-x-2 border-t-2 border-[#ebdcb9] dark:border-[#2d2114] text-[#2c1d11] dark:text-[#f3e3ca]',
    mint: 'bg-[#f0f8f5] dark:bg-[#0c1813] border-x-2 border-t-2 border-[#cbebe0] dark:border-[#132c21] text-[#0f2d24] dark:text-[#caebd9]',
    dark: 'bg-slate-950 border-x-2 border-t-2 border-slate-800 text-slate-100',
    light: 'bg-white border-x-2 border-t-2 border-slate-200 text-slate-900'
  };

  const themeFooterClasses = {
    sepia: 'bg-[#f4efe2] dark:bg-[#231b13] border-2 border-[#ebdcb9] dark:border-[#2d2114] text-[#2c1d11] dark:text-[#f3e3ca]',
    mint: 'bg-[#e5f3ed] dark:bg-[#10211a] border-2 border-[#cbebe0] dark:border-[#132c21] text-[#0f2d24] dark:text-[#caebd9]',
    dark: 'bg-slate-900 border-2 border-slate-800 text-slate-100',
    light: 'bg-slate-50 border-2 border-slate-200 text-slate-900'
  };

  const themeCardClasses = (isActive: boolean) => {
    if (isActive) {
      return {
        sepia: 'bg-[#f1ebd7] dark:bg-[#2d2319] border-[#d7c49b] dark:border-[#43311e] shadow-md ring-1 ring-[#d7c49b]/50 text-[#2c1d11] dark:text-white',
        mint: 'bg-[#e0efe8] dark:bg-[#142d23] border-[#addbc9] dark:border-[#1d4334] shadow-md ring-1 ring-[#addbc9]/50 text-[#0f2d24] dark:text-white',
        dark: 'bg-slate-900 border-slate-700 shadow-md ring-1 ring-slate-700/50 text-white',
        light: 'bg-slate-50 border-slate-300 shadow-md ring-1 ring-slate-300/50 text-slate-900'
      }[readerTheme];
    } else {
      return {
        sepia: 'bg-[#faf6eb]/50 dark:bg-[#1a140e]/50 border-[#ebdcb9]/40 dark:border-[#2d2114]/40 hover:border-[#d7c49b] dark:hover:border-[#43311e] text-[#2c1d11]/90 dark:text-[#f3e3ca]/90',
        mint: 'bg-[#f0f8f5]/50 dark:bg-[#0c1813]/50 border-[#cbebe0]/40 dark:border-[#132c21]/40 hover:border-[#addbc9] dark:hover:border-[#1d4334] text-[#0f2d24]/90 dark:text-[#caebd9]/90',
        dark: 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-350 hover:text-white',
        light: 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-700 hover:text-slate-900'
      }[readerTheme];
    }
  };

  // Safe checks for rendering Uthmani vs Translation side-by-side or stacked
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Upper header section */}
      <div className="bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 p-4 sm:p-5 rounded-xl border border-secondary-500/20 shadow-md text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-500/10 border border-secondary-500/30 text-secondary-300 text-[10px] font-bold tracking-wider uppercase">
              <BookOpen size={11} className="animate-pulse" />
              Holy Quran Explorer
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif tracking-tight">Recitation & Translation</h2>
            <p className="text-primary-200/90 text-xs max-w-xl">
              Listen to majestic audio streams, toggle dynamic translations, adjust Arabic typography, and select by Juz or Surah.
            </p>
          </div>

          {/* Quick config settings for this section */}
          <div className="flex flex-wrap items-center gap-2.5 bg-primary-900/40 px-3 py-2 rounded-lg border border-primary-800/40 self-start md:self-auto">
            {/* Offline Storage Manager Button */}
            <button
              onClick={() => setIsOfflineModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="Manage offline Quran & Duas cache"
            >
              <HardDrive size={13} className="text-emerald-400" />
              <span>{language === 'ar' ? 'وضع بدون نت' : 'Offline Storage'}</span>
              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-200 text-[10px] rounded-full font-bold">
                {cachedSurahsCount}
              </span>
            </button>

            <div className="h-4 w-px bg-primary-800 hidden sm:block" />

            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-primary-300 uppercase tracking-widest mb-1">Arabic Size</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setFontSize(prev => Math.max(0.85, prev - 0.15))}
                  className="px-2 py-0.5 bg-primary-800/60 hover:bg-primary-700/80 rounded text-xs font-bold transition-all cursor-pointer"
                  title="Smaller"
                >
                  A-
                </button>
                <span className="text-xs font-mono font-bold text-secondary-300 min-w-[32px] text-center">
                  {Math.round(fontSize * 100)}%
                </span>
                <button 
                  onClick={() => setFontSize(prev => Math.min(1.8, prev + 0.15))}
                  className="px-2 py-0.5 bg-primary-800/60 hover:bg-primary-700/80 rounded text-xs font-bold transition-all cursor-pointer"
                  title="Larger"
                >
                  A+
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main control board split into: Selector grid, and Content View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Controls and Selection */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Combined Selection & Customization Hub */}
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            
            {/* Mode selection tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
              <button
                onClick={() => {
                  setBrowseMode('juz');
                  setSearchQuery('');
                }}
                className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all cursor-pointer select-none
                  ${browseMode === 'juz'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
              >
                Browse by Juz
              </button>
              <button
                onClick={() => {
                  setBrowseMode('surah');
                }}
                className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all cursor-pointer select-none
                  ${browseMode === 'surah'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
              >
                Browse by Surah
              </button>
            </div>

            {/* Selection Panel Area */}
            <div className="space-y-3">
              {browseMode === 'juz' ? (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-dashed border-slate-100 dark:border-slate-800 pb-1.5">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Select Juz (Para)
                    </span>
                    <span className="text-[10px] font-mono font-bold text-primary-600 dark:text-secondary-400 bg-primary-50 dark:bg-primary-950/40 px-2 py-0.5 rounded-full border border-primary-100 dark:border-primary-900">
                      1 - 30 Parts
                    </span>
                  </div>

                  {/* Scrollable list grid for Juz buttons (highly compact and optimized) */}
                  <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 gap-1.5 max-h-[240px] overflow-y-auto pr-1">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => {
                      const isSelected = selectedJuz === juz;
                      const startPage = JUZ_START_PAGES[juz] || 1;
                      return (
                        <div
                          key={juz}
                          className={`p-1 rounded-xl border transition-all flex items-center justify-between gap-1 group
                            ${isSelected 
                              ? 'bg-primary-600 text-white border-primary-600 shadow-sm scale-[1.01] z-10' 
                              : 'bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'}`}
                        >
                          <button
                            onClick={() => setSelectedJuz(juz)}
                            className="flex-1 text-left flex flex-col justify-center py-1 px-1.5 cursor-pointer select-none min-w-0"
                            title={language === 'ar' ? `اختيار الجزء ${juz}` : `Select Juz ${juz}`}
                          >
                            <span className={`text-[8px] font-bold uppercase tracking-wider leading-none ${isSelected ? 'text-primary-100' : 'text-slate-400 dark:text-slate-500'}`}>
                              {language === 'ar' ? 'الجزء' : 'Juz'}
                            </span>
                            <span className="text-xs font-extrabold font-mono leading-tight mt-0.5 flex items-baseline gap-1">
                              <span>{juz}</span>
                              <span className="text-[8px] font-normal font-sans opacity-70">
                                (p. {startPage})
                              </span>
                            </span>
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.dispatchEvent(new CustomEvent('open-classic-mushaf-modal', { detail: { page: startPage } }));
                            }}
                            className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center shrink-0
                              ${isSelected
                                ? 'bg-primary-700 hover:bg-primary-800 text-secondary-100 hover:text-white border border-primary-500'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 hover:border-emerald-200 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/40'}`}
                            title={language === 'ar' ? `فتح المصحف المصور الجزء ${juz}` : `Read Juz ${juz} in Scanned Mushaf`}
                          >
                            <Book size={12} className="group-hover:scale-110 transition-transform" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-dashed border-slate-100 dark:border-slate-800 pb-1.5">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Select Surah (Chapter)
                    </span>
                    <span className="text-[10px] font-mono font-bold text-primary-600 dark:text-secondary-400 bg-primary-50 dark:bg-primary-950/40 px-2 py-0.5 rounded-full border border-primary-100 dark:border-primary-900">
                      114 Chapters
                    </span>
                  </div>

                  {/* Search box */}
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search Surah name or number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs pl-8 pr-8 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-800 dark:text-slate-200"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  {/* Scrollable vertical list of matching Surahs */}
                  <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1">
                    {(() => {
                      const query = searchQuery.trim().toLowerCase();
                      const filtered = allSurahs.filter(s => 
                        s.number.toString().includes(query) ||
                        s.englishName.toLowerCase().includes(query) ||
                        s.englishNameTranslation.toLowerCase().includes(query) ||
                        s.name.includes(query)
                      );

                      if (filtered.length === 0) {
                        return (
                          <div className="text-center py-6 text-slate-400 text-xs italic">
                            No matching Surahs found
                          </div>
                        );
                      }

                      return filtered.map((surah) => {
                        const isSelected = selectedSurah === surah.number;
                        return (
                          <div
                            key={surah.number}
                            className={`w-full p-1.5 rounded-lg border transition-all flex items-center justify-between gap-1
                              ${isSelected
                                ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                                : 'bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'}`}
                          >
                            <button
                              onClick={() => setSelectedSurah(surah.number)}
                              className="flex-1 text-left flex items-center gap-2 cursor-pointer select-none min-w-0"
                            >
                              <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold font-mono border shrink-0
                                ${isSelected 
                                  ? 'bg-primary-700/50 border-primary-500 text-white' 
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'}`}
                              >
                                {surah.number}
                              </span>
                              <div className="truncate">
                                <p className="text-xs font-bold leading-tight truncate">{surah.englishName}</p>
                                <p className={`text-[10px] leading-none mt-0.5 truncate ${isSelected ? 'text-primary-100' : 'text-slate-500'}`}>
                                  {surah.englishNameTranslation} • {surah.numberOfAyahs} v
                                </p>
                              </div>
                            </button>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => setSelectedSurah(surah.number)}
                                className="text-right cursor-pointer select-none"
                              >
                                <p className="font-arabic font-semibold text-xs sm:text-sm leading-tight">{surah.name}</p>
                                <p className={`text-[8px] leading-none mt-0.5 uppercase tracking-widest ${isSelected ? 'text-primary-200' : 'text-slate-400'}`}>
                                  {surah.revelationType}
                                </p>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const startPage = SURAH_START_PAGES[surah.number] || 1;
                                  window.dispatchEvent(new CustomEvent('open-classic-mushaf-modal', { detail: { page: startPage } }));
                                }}
                                className={`p-1.5 rounded-md transition-all cursor-pointer flex items-center justify-center
                                  ${isSelected
                                    ? 'bg-primary-700 hover:bg-primary-800 text-secondary-100 hover:text-white border border-primary-500'
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 hover:border-emerald-300 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/50'}`}
                                title={language === 'ar' ? 'عرض المصحف المصور لهذه السورة' : 'View Scanned Mushaf for this Surah'}
                              >
                                <Book size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Collapsible Audio & Translation Settings section to optimize vertical space */}
            <div className="border-t border-dashed border-slate-100 dark:border-slate-800 pt-2.5">
              <button
                onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
                className="w-full flex items-center justify-between py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 hover:dark:text-slate-100 cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Sliders size={13} className="text-primary-500" />
                  Configure Audio & Translation
                </span>
                {isSettingsExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {isSettingsExpanded && (
                <div className="space-y-3 pt-3 pb-1 animate-in slide-in-from-top-2 duration-200">
                  {/* Translation Selection */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Globe size={11} className="text-slate-400" />
                      Translation Edition
                    </label>
                    <select
                      value={selectedTranslation}
                      onChange={(e) => setSelectedTranslation(e.target.value)}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-800 dark:text-slate-200"
                    >
                      {translationsList.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Reciter Selection */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Volume2 size={11} className="text-slate-400" />
                      Reciter Qari
                    </label>
                    <select
                      value={selectedReciter}
                      onChange={(e) => setSelectedReciter(e.target.value)}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-800 dark:text-slate-200"
                    >
                      {recitersList.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} ({item.desc})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Auto advance toggle */}
                  <div className="pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 text-xs">
                      <input 
                        type="checkbox"
                        checked={autoAdvance}
                        onChange={(e) => setAutoAdvance(e.target.checked)}
                        className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 w-3.5 h-3.5"
                      />
                      <span className="font-semibold select-none">Auto-advance (Continuous Play)</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Quran Text Reader */}
        <div className="lg:col-span-8 flex flex-col h-[75vh] min-h-[500px]">
          
          {/* Header toolbar for content view */}
          <div className={`transition-colors duration-200 ${themeHeaderClasses[readerTheme]} rounded-t-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm relative z-10`}>
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-950/40 border border-primary-300 dark:border-primary-800 flex items-center justify-center font-bold text-primary-800 dark:text-primary-300 font-mono text-sm shadow-inner">
                {browseMode === 'juz' ? selectedJuz : selectedSurah}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold font-serif leading-tight text-sm sm:text-base">
                    {browseMode === 'juz' ? `Juz ${selectedJuz}` : `Surah ${allSurahs.find(s => s.number === selectedSurah)?.englishName || ''}`}
                  </h3>
                  {isServedFromOffline && (
                    <span 
                      onClick={() => setIsOfflineModalOpen(true)}
                      className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer hover:bg-emerald-200 transition-colors shadow-2xs"
                      title="This Surah is cached in offline storage and accessible without internet"
                    >
                      <CheckCircle2 size={11} className="text-emerald-600 dark:text-emerald-400" />
                      <span>{language === 'ar' ? 'متاح بدون نت' : 'Offline Ready'}</span>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      if (browseMode === 'juz') {
                        const pageNum = JUZ_START_PAGES[selectedJuz] || 1;
                        window.dispatchEvent(new CustomEvent('open-classic-mushaf-modal', { detail: { page: pageNum } }));
                      } else {
                        const pageNum = SURAH_START_PAGES[selectedSurah] || 1;
                        window.dispatchEvent(new CustomEvent('open-classic-mushaf-modal', { detail: { page: pageNum } }));
                      }
                    }}
                    className="px-2 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] inline-flex items-center gap-1 transition-all cursor-pointer shadow-xs border border-emerald-500"
                    title={language === 'ar' ? 'عرض هذا الجزء/السورة في المصحف المصور' : 'Read this Juz/Surah in Classic Scanned Mushaf'}
                  >
                    <Book size={10} />
                    <span>{language === 'ar' ? 'مصحف' : 'Mushaf'}</span>
                  </button>

                  {/* Jump to Last Read button */}
                  {(() => {
                    const lastReadAyahNumber = browseMode === 'juz' ? juzLastRead[selectedJuz] : surahLastRead[selectedSurah];
                    const lastReadAyahIndex = ayahs.findIndex(a => a.number === lastReadAyahNumber);
                    if (lastReadAyahIndex === -1) return null;
                    return (
                      <button
                        onClick={() => {
                          const element = document.getElementById(`ayah-card-${lastReadAyahNumber}`);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        }}
                        className="px-2 py-0.5 rounded-md bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] inline-flex items-center gap-1 transition-all cursor-pointer shadow-xs border border-amber-400"
                        title={language === 'ar' ? 'الانتقال إلى آخر آية قرأتها' : 'Jump to last read verse'}
                      >
                        <Flag size={10} className="fill-white" />
                        <span>{language === 'ar' ? 'آخر قراءة' : 'Last Read'}</span>
                      </button>
                    );
                  })()}
                </div>
                <span className="text-xs opacity-75">
                  {ayahs.length} total verses loaded {browseMode === 'juz' ? 'in this part' : 'in this chapter'}
                </span>
              </div>
            </div>

            {/* Quick adjust toolbar: Font Size & Themes */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Font Size A-/A+ */}
              <div className="flex items-center gap-1.5 bg-white/45 dark:bg-black/30 p-1 rounded-xl border border-secondary-200/20">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 mr-1 hidden sm:inline">Size:</span>
                <button 
                  onClick={() => setFontSize(prev => Math.max(0.85, prev - 0.15))}
                  className="w-7 h-7 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-extrabold flex items-center justify-center transition-all cursor-pointer shadow-xs"
                  title="Smaller font size"
                >
                  A-
                </button>
                <span className="text-xs font-mono font-bold min-w-[32px] text-center">
                  {Math.round(fontSize * 100)}%
                </span>
                <button 
                  onClick={() => setFontSize(prev => Math.min(1.8, prev + 0.15))}
                  className="w-7 h-7 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-extrabold flex items-center justify-center transition-all cursor-pointer shadow-xs"
                  title="Larger font size"
                >
                  A+
                </button>
              </div>

              {/* Theme Selector */}
              <div className="flex items-center gap-1.5 bg-white/45 dark:bg-black/30 p-1 rounded-xl border border-secondary-200/20">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 mr-1 hidden sm:inline">Theme:</span>
                {(['sepia', 'mint', 'dark', 'light'] as const).map((tName) => (
                  <button
                    key={tName}
                    onClick={() => handleSetReaderTheme(tName)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer border select-none
                      ${readerTheme === tName
                        ? 'bg-primary-600 text-white border-primary-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-350 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                  >
                    {tName}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content display container */}
          <div 
            ref={scrollContainerRef}
            className={`flex-1 transition-colors duration-200 ${themeContainerClasses[readerTheme]} rounded-b-none overflow-y-auto shadow-sm p-4 sm:p-6 scroll-smooth`}
          >
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                <Loader2 size={40} className="animate-spin text-primary-600" />
                <p className="font-serif italic text-secondary-600">
                  Retrieving {browseMode === 'juz' ? `Juz ${selectedJuz}` : `Surah ${allSurahs.find(s => s.number === selectedSurah)?.englishName || ''}`} from server...
                </p>
              </div>
            ) : error ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-md mx-auto">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-200 dark:border-amber-900/50">
                  <WifiOff size={36} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                    {language === 'ar' ? 'تعذر جلب بيانات السورة' : 'Unable to Fetch Quran Verses'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {language === 'ar' 
                      ? 'يبدو أنك غير متصل بالإنترنت أو أن هذه السورة لم يتم تحميلها بعد للمطالعة بدون نت.'
                      : 'You appear to be offline or this specific chapter has not been cached yet.'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      if (browseMode === 'juz') {
                        setSelectedJuz(selectedJuz);
                      } else {
                        setSelectedSurah(selectedSurah);
                      }
                    }}
                    className="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw size={13} />
                    <span>{language === 'ar' ? 'إعادة المحاولة' : 'Retry'}</span>
                  </button>
                  <button
                    onClick={() => setIsOfflineModalOpen(true)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <HardDrive size={13} />
                    <span>{language === 'ar' ? 'إدارة السور المحفوظة' : 'Offline Quran Manager'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-3xl mx-auto">
                {ayahs.map((ayah, idx) => {
                  const isActive = activeAyahIndex === idx;
                  const isBookmarked = bookmarkedIds.includes(`${ayah.surah.number}_${ayah.numberInSurah}`);
                  const isLastRead = (browseMode === 'juz' ? juzLastRead[selectedJuz] : surahLastRead[selectedSurah]) === ayah.number;
                  
                  // Detect the transition between surahs inside the Juz
                  const isFirstInSurah = idx === 0 || ayahs[idx - 1].surah.number !== ayah.surah.number;

                  return (
                    <div key={ayah.number} className="space-y-4">
                      
                      {/* Surah Title Banner inside Juz */}
                      {isFirstInSurah && (
                        <div className="my-8 text-center bg-gradient-to-br from-[#f9f5eb] to-[#f4ebe1] border-2 border-secondary-300 rounded-2xl p-6 shadow-inner relative overflow-hidden group">
                          <Sparkles size={40} className="absolute -right-3 -bottom-3 text-secondary-400/5 opacity-[0.03]" />
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10 text-left">
                            <div>
                              <h4 className="text-xl font-bold font-serif text-slate-850 tracking-wide uppercase">
                                {ayah.surah.name}
                              </h4>
                              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                                {ayah.surah.englishName} • {ayah.surah.englishNameTranslation}
                              </p>
                              <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-secondary-100 border border-secondary-200 text-[10px] font-bold text-secondary-800 uppercase tracking-widest">
                                {ayah.surah.revelationType} • {ayah.surah.numberOfAyahs} Verses
                              </span>
                            </div>
                            <div className="shrink-0">
                              <button
                                onClick={() => {
                                  const startPage = SURAH_START_PAGES[ayah.surah.number] || 1;
                                  window.dispatchEvent(new CustomEvent('open-classic-mushaf-modal', { detail: { page: startPage } }));
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
                                title={language === 'ar' ? 'تصفح صفحات المصحف المصورة الكلاسيكية' : 'Read Scanned Classic Mushaf Pages'}
                              >
                                <Book size={14} />
                                <span>{language === 'ar' ? 'قراءة المصحف المصور' : 'Read Scanned Pages'}</span>
                              </button>
                            </div>
                          </div>

                          {/* Basmala on its own centered line (except Surah At-Tawbah) */}
                          {ayah.surah.number !== 9 && (
                            <div className="mt-5 border-t border-dashed border-secondary-300 pt-5 text-center">
                              <p className="font-arabic text-2xl sm:text-3xl text-slate-900 leading-normal select-none">
                                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Individual Ayah Card */}
                      <div 
                        id={`ayah-card-${ayah.number}`}
                        ref={isActive ? activeAyahRef : null}
                        className={`p-4 sm:p-6 rounded-2xl border transition-all duration-300 space-y-4 relative group 
                          ${themeCardClasses(isActive)}
                          ${isLastRead ? 'ring-2 ring-amber-500/60 dark:ring-amber-500/40 border-amber-500/80 dark:border-amber-500/80 shadow-md shadow-amber-500/5' : ''}`}
                      >
                        {/* Bookmark Ribbon */}
                        {isLastRead && (
                          <span className="absolute -top-2 right-4 px-2.5 py-0.5 rounded-full bg-amber-500 dark:bg-amber-600 text-white font-extrabold text-[9px] uppercase tracking-wider shadow-sm flex items-center gap-1 z-10">
                            <Flag size={9} className="fill-white" />
                            <span>{language === 'ar' ? 'آخر قراءة' : 'Last Read'}</span>
                          </span>
                        )}
                        {/* verse toolbar */}
                        <div className="flex items-center justify-between gap-3 border-b border-dashed border-slate-200/40 dark:border-slate-800/40 pb-2.5">
                          <span className="text-[10px] font-mono font-extrabold text-secondary-850 dark:text-secondary-300 bg-secondary-100/60 dark:bg-primary-950/30 border border-secondary-200/50 dark:border-primary-900/50 px-2 py-0.5 rounded-lg">
                            {ayah.surah.englishName} {ayah.surah.number}:{ayah.numberInSurah}
                          </span>

                          <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                            {/* Individual Ayah Play button */}
                            <button
                              onClick={() => playAyah(idx)}
                              className={`p-1.5 rounded-lg border text-xs font-semibold transition-all shadow-sm cursor-pointer
                                ${isActive && isPlaying
                                  ? 'bg-rose-500/15 border-rose-400/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25'
                                  : 'bg-white/60 dark:bg-slate-800/60 hover:bg-white/90 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 border-slate-200/60 dark:border-slate-700/60'}`}
                              title={isActive && isPlaying ? "Pause recitation" : "Play single recitation"}
                            >
                              {isActive && isPlaying ? <Pause size={13} className="fill-rose-100" /> : <Play size={13} className="fill-slate-100" />}
                            </button>

                            {/* Last Read button */}
                            <button
                              onClick={() => markAsLastRead(ayah)}
                              className={`p-1.5 rounded-lg border text-xs font-semibold transition-all shadow-sm cursor-pointer
                                ${isLastRead
                                  ? 'bg-amber-500/15 border-amber-400/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25 ring-1 ring-amber-500/30'
                                  : 'bg-white/60 dark:bg-slate-800/60 hover:bg-white/90 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border-slate-200/60 dark:border-slate-700/60'}`}
                              title={isLastRead ? (language === 'ar' ? 'تم تحديدها كآخر آية مقروءة' : 'Marked as last read') : (language === 'ar' ? 'تحديد كآخر آية مقروءة' : 'Mark as last read')}
                            >
                              <Flag size={13} className={isLastRead ? "fill-amber-500 text-amber-500" : ""} />
                            </button>

                            {/* Bookmark button */}
                            <button
                              onClick={() => toggleBookmark(ayah)}
                              className={`p-1.5 rounded-lg border text-xs font-semibold transition-all shadow-sm cursor-pointer
                                ${isBookmarked
                                  ? 'bg-secondary-500/15 border-secondary-400/40 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-500/25'
                                  : 'bg-white/60 dark:bg-slate-800/60 hover:bg-white/90 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border-slate-200/60 dark:border-slate-700/60'}`}
                              title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                            >
                              <Bookmark size={13} className={isBookmarked ? "fill-secondary-500 text-secondary-500" : ""} />
                            </button>

                            {/* Reflect & Record button */}
                            <button
                              onClick={() => {
                                window.dispatchEvent(new CustomEvent('open-reflection-journal', {
                                  detail: {
                                    surahNumber: ayah.surah.number,
                                    ayahRange: String(ayah.numberInSurah),
                                    openRecorder: true
                                  }
                                }));
                              }}
                              className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/70 transition-all shadow-sm cursor-pointer flex items-center gap-1"
                              title={language === 'ar' ? 'تسجيل تلاوة أو كتابة تدبر لهذه الآية' : 'Record recitation or write reflection for this verse'}
                            >
                              <Mic size={13} />
                              <span className="text-[10px] font-bold hidden sm:inline">{language === 'ar' ? 'تدبر وتسجيل' : 'Reflect & Record'}</span>
                            </button>

                            {/* Copy button */}
                            <button
                              onClick={() => handleCopyText(`${ayah.text}\n\n[Quran ${ayah.surah.number}:${ayah.numberInSurah} - ${ayah.translationText}]`, idx)}
                              className="p-1.5 rounded-lg bg-white/60 dark:bg-slate-800/60 hover:bg-white/90 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border border-slate-200/60 dark:border-slate-700/60 transition-all shadow-sm cursor-pointer"
                              title="Copy text & translation"
                            >
                              {copiedIndex === idx ? <Check size={13} className="text-emerald-500 animate-pulse" /> : <Copy size={13} />}
                            </button>
                          </div>
                        </div>

                        {/* Arabic text with custom scale size */}
                        <p 
                          className="font-arabic text-right leading-[2.2] select-all font-medium py-1 text-current"
                          style={{ fontSize: `${fontSize * 22}px` }}
                          dir="rtl"
                        >
                          {ayah.text}
                        </p>

                        {/* Translation and Tafsir section */}
                        <div className="space-y-3 border-t border-dashed border-slate-200/40 dark:border-slate-800/40 pt-3">
                          {ayah.translationText && (
                            <p className="text-sm opacity-85 leading-relaxed font-sans text-current">
                              {ayah.translationText}
                            </p>
                          )}
                          
                          {/* Tafsir Toggle Button */}
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => {
                                const key = `${ayah.surah.number}_${ayah.numberInSurah}`;
                                const isCurrentlyExpanded = expandedTafsirKeys.includes(key);
                                if (isCurrentlyExpanded) {
                                  setExpandedTafsirKeys(prev => prev.filter(k => k !== key));
                                } else {
                                  setExpandedTafsirKeys(prev => [...prev, key]);
                                  fetchTafsir(ayah.surah.number, ayah.numberInSurah);
                                }
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary-50 hover:bg-secondary-100 dark:bg-slate-950 dark:hover:bg-slate-900 border border-secondary-200/40 text-secondary-800 dark:text-secondary-400 transition-colors cursor-pointer select-none"
                            >
                              <HelpCircle size={13} className="text-secondary-600" />
                              <span>{expandedTafsirKeys.includes(`${ayah.surah.number}_${ayah.numberInSurah}`) ? "Hide Tafsir" : "Show Tafsir"}</span>
                              {expandedTafsirKeys.includes(`${ayah.surah.number}_${ayah.numberInSurah}`) ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </button>
                          </div>

                          {/* Expanded Tafsir content */}
                          {expandedTafsirKeys.includes(`${ayah.surah.number}_${ayah.numberInSurah}`) && (
                            <div className="mt-2 bg-secondary-50/20 dark:bg-slate-950/20 rounded-xl border border-secondary-200/30 p-3 sm:p-4 text-xs space-y-3 animate-in slide-in-from-top-1 duration-200">
                              {/* Loading state */}
                              {expandedTafsir[`${ayah.surah.number}_${ayah.numberInSurah}`]?.loading && (
                                <div className="flex items-center gap-2 text-slate-500 py-1 font-serif italic">
                                  <Loader2 size={13} className="animate-spin text-primary-500" />
                                  <span>Loading Tafsir commentary...</span>
                                </div>
                              )}

                              {/* Error state */}
                              {expandedTafsir[`${ayah.surah.number}_${ayah.numberInSurah}`]?.error && (
                                <div className="text-rose-500 py-1">
                                  {expandedTafsir[`${ayah.surah.number}_${ayah.numberInSurah}`]?.error}
                                </div>
                              )}

                              {/* Tafsir content display */}
                              {!expandedTafsir[`${ayah.surah.number}_${ayah.numberInSurah}`]?.loading && 
                               !expandedTafsir[`${ayah.surah.number}_${ayah.numberInSurah}`]?.error && (
                                <div className="space-y-4">
                                  {/* English Tafsir (Maududi) */}
                                  {expandedTafsir[`${ayah.surah.number}_${ayah.numberInSurah}`]?.english && (
                                    <div className="space-y-1">
                                      <span className="inline-block px-1.5 py-0.5 rounded bg-primary-100 text-[9px] font-bold text-primary-800 uppercase tracking-wider">
                                        Tafsir Maududi (English)
                                      </span>
                                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans text-justify select-text">
                                        {expandedTafsir[`${ayah.surah.number}_${ayah.numberInSurah}`].english}
                                      </p>
                                    </div>
                                  )}

                                  {/* Arabic Tafsir (Al-Muyassar) */}
                                  {expandedTafsir[`${ayah.surah.number}_${ayah.numberInSurah}`]?.arabic && (
                                    <div className="space-y-1.5 border-t border-dashed border-secondary-200/40 pt-3">
                                      <span className="inline-block px-1.5 py-0.5 rounded bg-secondary-100 text-[9px] font-bold text-secondary-800 uppercase tracking-wider">
                                        التفسير الميسر (العربية)
                                      </span>
                                      <p className="text-slate-900 dark:text-slate-100 font-arabic text-base leading-relaxed text-right select-all" dir="rtl">
                                        {expandedTafsir[`${ayah.surah.number}_${ayah.numberInSurah}`].arabic}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Khatmul Quran prompt banner when viewing Surah 114 (An-Nas) or Juz 30 */}
            {(selectedSurah === 114 || (playbackMode === 'juz' && selectedJuz === 30)) && (
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary-500/10 via-secondary-500/10 to-amber-500/10 border border-primary-300/40 dark:border-primary-700/40 text-center space-y-4 shadow-sm animate-in fade-in duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-600 text-white shadow-md">
                  <BookOpen size={22} />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-widest font-bold text-primary-700 dark:text-primary-300">
                    ختم القرآن الكريم • Quran Completion
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-serif mt-1">
                    {t('dua.khatamTitle')}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto mt-1 leading-relaxed">
                    {t('dua.khatamDesc')}
                  </p>
                </div>
                <button
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('navigate-to-section', { detail: 'khatam' }));
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  <span>{t('dua.openFullKhatam')}</span>
                </button>
              </div>
            )}
          </div>

          {/* DEDICATED MODERN AUDIO PLAYER BAR */}
          <div className={`transition-colors duration-200 ${themeFooterClasses[readerTheme]} rounded-b-2xl p-4 sm:p-5 flex flex-col gap-3.5 shadow-md relative z-10`}>
            {/* TOP ROW: Track Info & Secondary utilities */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-dashed border-slate-350/30 dark:border-slate-700/30">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-inner transition-all
                  ${isPlaying ? 'bg-primary-100 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 animate-pulse' : 'bg-slate-150/50 dark:bg-slate-800/50 text-slate-400'}`}>
                  <Music size={18} />
                </div>
                <div>
                  {activeAyah ? (
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm font-serif text-current">
                          Surah {activeAyah.surah.englishName} ({activeAyah.surah.number}:{activeAyah.numberInSurah})
                        </span>
                        <span className="font-arabic font-bold text-sm text-primary-600 dark:text-primary-400">
                          {activeAyah.surah.name}
                        </span>
                        {isWaiting && (
                          <Loader2 size={13} className="animate-spin text-primary-500" />
                        )}
                      </div>
                      <p className="text-[11px] opacity-75 font-semibold mt-0.5">
                        {recitersList.find(r => r.id === selectedReciter)?.name} • {playbackMode === 'surah' ? 'Surah Recitation' : 'Juz Recitation'}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-bold text-sm font-sans opacity-70">No Recitation Active</h4>
                      <p className="text-[11px] opacity-60">Select any verse or click the play button below to begin</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right side: Mode badging and continuous play control */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm
                  ${playbackMode === 'surah' 
                    ? 'bg-rose-500/10 border-rose-400/30 text-rose-600 dark:text-rose-400' 
                    : 'bg-primary-500/10 border-primary-400/30 text-primary-600 dark:text-primary-400'}`}>
                  Mode: {playbackMode === 'surah' ? 'Surah' : 'Juz'}
                </span>

                <button
                  onClick={() => setAutoAdvance(!autoAdvance)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm transition-all flex items-center gap-1.5 cursor-pointer
                    ${autoAdvance 
                      ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-650 dark:text-emerald-400' 
                      : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-450'}`}
                  title="Toggle continuous autoplay"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${autoAdvance ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                  Continuous Play
                </button>
              </div>
            </div>

            {/* TIMELINE SLIDER ROW */}
            <div className="flex items-center gap-3 text-xs font-mono font-bold text-slate-600">
              <span className="w-8 text-left">{formatTime(currentTime)}</span>
              <div className="flex-1 relative group py-1.5">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full accent-primary-600 bg-secondary-200/80 hover:bg-secondary-300 rounded-lg h-1.5 appearance-none cursor-pointer focus:outline-none transition-all"
                />
              </div>
              <span className="w-8 text-right">{formatTime(duration)}</span>
            </div>

            {/* BOTTOM ROW: Playback controls + Settings (Speed/Volume) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
              {/* Speed multipliers */}
              <div className="flex items-center gap-1.5 order-2 sm:order-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Speed:</span>
                {[0.75, 1.0, 1.25, 1.5, 2.0].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-all border
                      ${playbackSpeed === speed 
                        ? 'bg-primary-600 text-white border-primary-600 shadow-sm font-extrabold' 
                        : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'}`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              {/* Main controls */}
              <div className="flex items-center gap-2.5 order-1 sm:order-2">
                <button
                  onClick={handlePrevAyah}
                  disabled={activeAyahIndex === null || activeAyahIndex <= 0}
                  className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all shadow-sm disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
                  title="Previous Verse"
                >
                  <SkipBack size={14} className="fill-current" />
                </button>

                <button
                  onClick={handleSkipBackwardSeconds}
                  disabled={activeAyahIndex === null}
                  className="p-1.5 px-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition-all shadow-sm disabled:opacity-40 disabled:hover:bg-white text-[10px] font-bold cursor-pointer"
                  title="Rewind 5 seconds"
                >
                  -5s
                </button>

                <button
                  onClick={() => {
                    if (activeAyahIndex === null) {
                      playAyah(0);
                    } else {
                      playAyah(activeAyahIndex);
                    }
                  }}
                  className="p-3 bg-primary-600 hover:bg-primary-700 hover:scale-105 active:scale-95 text-white rounded-full shadow-md flex items-center justify-center transition-all cursor-pointer"
                  title={isPlaying ? "Pause Recitation" : "Start Recitation"}
                >
                  {isPlaying ? <Pause size={16} className="fill-white" /> : <Play size={16} className="fill-white translate-x-[1px]" />}
                </button>

                <button
                  onClick={handleSkipForwardSeconds}
                  disabled={activeAyahIndex === null}
                  className="p-1.5 px-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition-all shadow-sm disabled:opacity-40 disabled:hover:bg-white text-[10px] font-bold cursor-pointer"
                  title="Forward 5 seconds"
                >
                  +5s
                </button>

                <button
                  onClick={handleNextAyah}
                  disabled={activeAyahIndex === null || activeAyahIndex >= ayahs.length - 1}
                  className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all shadow-sm disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
                  title="Next Verse"
                >
                  <SkipForward size={14} className="fill-current" />
                </button>
              </div>

              {/* Volume bar */}
              <div className="flex items-center gap-2 order-3">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  className="w-16 sm:w-20 accent-primary-600 h-1 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                  title="Volume Control"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Offline Storage Management Modal */}
      <OfflineModal
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
        onOpenSurah={(surahNum) => {
          setBrowseMode('surah');
          setSelectedSurah(surahNum);
        }}
      />

    </div>
  );
};

export default QuranJuzSection;
