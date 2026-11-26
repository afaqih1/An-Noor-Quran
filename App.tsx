import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import ClassicMushafModal from './components/ClassicMushafModal';
import SurahTable from './components/SurahTable';
import AlKahfSection from './components/AlKahfSection';
import OtherRecommendations from './components/OtherRecommendations';
import DuaSection from './components/DuaSection';
import AzkarSection from './components/AzkarSection';
import BookmarksSection from './components/BookmarksSection';
import TajweedSection from './components/TajweedSection';
import QuranJuzSection from './components/QuranJuzSection';
import QiblaSection from './components/QiblaSection';
import DateDisplay from './components/DateDisplay';
import CalendarModal from './components/CalendarModal';
import WorldClockModal from './components/WorldClockModal';
import FeaturesSection from './components/FeaturesSection';
import KhatamSection from './components/KhatamSection';
import LandingDashboard from './components/LandingDashboard';
import DuaDeceasedSection from './components/DuaDeceasedSection';
import { MyDuasSection } from './components/MyDuasSection';
import PoetrySection from './components/PoetrySection';
import { ReflectionJournal } from './components/ReflectionJournal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { Heart, ArrowUp, Eye, EyeOff, Maximize2, Minimize2, Moon, Sun, Sparkles, Bell, BellOff, VolumeX, Volume2, Play, Square, X, Share2, Check, Pause, RotateCcw, Search } from 'lucide-react';
import { AudioProvider } from './components/AudioContext';
import ScrollProgressBar from './components/ScrollProgressBar';
import { useLanguage } from './components/LanguageContext';
import ConfigMenu, { ColorPalette } from './components/ConfigMenu';
import { TTSProvider } from './components/TTSContext';
import { TTSActivePlayer } from './components/TTSActivePlayer';
import { QuranStudyModal } from './components/QuranStudyModal';
import { OfflineModal } from './components/OfflineModal';
import QuranYearPlanSection from './components/QuranYearPlanSection';
import { ConnectedAppletSection } from './components/ConnectedAppletSection';
import { ConnectedAppletModal } from './components/ConnectedAppletModal';
import { SalatRecitationsSection } from './components/SalatRecitationsSection';

function AppContent() {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleShare = async () => {
    const shareData = {
      title: t('share.title'),
      text: t('share.text'),
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      })
      .catch((err) => {
        console.error('Failed to copy link: ', err);
      });
  };

  const [activeSection, setActiveSection] = useState<'home' | 'alkahf' | 'table' | 'other' | 'dua' | 'azkar' | 'bookmarks' | 'tajweed' | 'quran' | 'qibla' | 'features' | 'khatam' | 'dua_deceased' | 'my_duas' | 'journal' | 'poetry' | 'quran_year_plan' | 'connected_applet' | 'salat_recitations'>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClassicMushafOpen, setIsClassicMushafOpen] = useState(false);
  const [classicMushafPage, setClassicMushafPage] = useState<number>(1);
  const [isHijriCalendarOpen, setIsHijriCalendarOpen] = useState(false);
  const [initialCalendarTab, setInitialCalendarTab] = useState<'gregorian' | 'hijri' | 'ethiopian'>('hijri');
  const [isWorldClockOpen, setIsWorldClockOpen] = useState(false);
  const [isQuranStudyModalOpen, setIsQuranStudyModalOpen] = useState(false);
  const [quranStudyModuleId, setQuranStudyModuleId] = useState<string>('mod-fatiha');
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [isConnectedAppletOpen, setIsConnectedAppletOpen] = useState(false);
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState(false);

  // Listen for Google Maps Platform quota exceeded event
  useEffect(() => {
    const handleQuota = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Global keyboard shortcut for search (Cmd+K / Ctrl+K / slash)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(prev => !prev);
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsGlobalSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Sync event listener for open-global-search
  useEffect(() => {
    const handleOpenSearch = () => {
      setIsGlobalSearchOpen(true);
    };
    window.addEventListener('open-global-search', handleOpenSearch);
    return () => {
      window.removeEventListener('open-global-search', handleOpenSearch);
    };
  }, []);

  // Sync event listener for open-quran-study-modal
  useEffect(() => {
    const handleOpenStudyModal = (e: Event) => {
      const customEvent = e as CustomEvent;
      const modId = customEvent.detail?.moduleId || 'mod-fatiha';
      setQuranStudyModuleId(modId);
      setIsQuranStudyModalOpen(true);
    };
    window.addEventListener('open-quran-study-modal', handleOpenStudyModal);
    return () => {
      window.removeEventListener('open-quran-study-modal', handleOpenStudyModal);
    };
  }, []);

  // Sync event listener for open-hijri-calendar
  useEffect(() => {
    const handleOpenCalendar = (e: Event) => {
      const customEvent = e as CustomEvent;
      const tab = customEvent.detail?.initialTab || 'hijri';
      setInitialCalendarTab(tab);
      setIsHijriCalendarOpen(true);
    };
    window.addEventListener('open-hijri-calendar', handleOpenCalendar);
    return () => {
      window.removeEventListener('open-hijri-calendar', handleOpenCalendar);
    };
  }, []);

  // Sync event listener for open-world-clock
  useEffect(() => {
    const handleOpenWorldClock = () => {
      setIsWorldClockOpen(true);
    };
    window.addEventListener('open-world-clock', handleOpenWorldClock);
    return () => {
      window.removeEventListener('open-world-clock', handleOpenWorldClock);
    };
  }, []);

  // Sync event listener for open-reflection-journal
  useEffect(() => {
    const handleOpenJournal = () => {
      setActiveSection('journal');
    };
    window.addEventListener('open-reflection-journal', handleOpenJournal);
    return () => {
      window.removeEventListener('open-reflection-journal', handleOpenJournal);
    };
  }, []);

  // Sync event listener for navigate-to-section
  useEffect(() => {
    const handleNavigate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.section) {
        setActiveSection(customEvent.detail.section);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('navigate-to-section', handleNavigate);
    return () => {
      window.removeEventListener('navigate-to-section', handleNavigate);
    };
  }, []);

  // Sync event listener for open-classic-mushaf-modal
  useEffect(() => {
    const handleOpenMushaf = (e: Event) => {
      const customEvent = e as CustomEvent;
      const page = customEvent.detail?.page || 1;
      setClassicMushafPage(page);
      setIsClassicMushafOpen(true);
    };
    window.addEventListener('open-classic-mushaf-modal', handleOpenMushaf);
    return () => {
      window.removeEventListener('open-classic-mushaf-modal', handleOpenMushaf);
    };
  }, []);

  // Sync event listener for open-offline-modal
  useEffect(() => {
    const handleOpenOffline = () => {
      setIsOfflineModalOpen(true);
    };
    window.addEventListener('open-offline-modal', handleOpenOffline);
    return () => {
      window.removeEventListener('open-offline-modal', handleOpenOffline);
    };
  }, []);

  // Sync event listener for open-quran-year-plan
  useEffect(() => {
    const handleOpenYearPlan = () => {
      setActiveSection('quran_year_plan');
    };
    window.addEventListener('open-quran-year-plan', handleOpenYearPlan);
    return () => {
      window.removeEventListener('open-quran-year-plan', handleOpenYearPlan);
    };
  }, []);

  // Sync event listener for open-connected-applet
  useEffect(() => {
    const handleOpenConnectedApplet = () => {
      setIsConnectedAppletOpen(true);
    };
    window.addEventListener('open-connected-applet', handleOpenConnectedApplet);
    return () => {
      window.removeEventListener('open-connected-applet', handleOpenConnectedApplet);
    };
  }, []);

  // Sync event listener for generic section navigation
  useEffect(() => {
    const handleNavigate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setActiveSection(customEvent.detail);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('navigate-to-section', handleNavigate);
    return () => {
      window.removeEventListener('navigate-to-section', handleNavigate);
    };
  }, []);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('friday-sidebar-collapsed');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleSidebarCollapse = () => {
    setIsSidebarCollapsed(prev => {
      const newValue = !prev;
      try {
        localStorage.setItem('friday-sidebar-collapsed', newValue ? 'true' : 'false');
      } catch (e) {
        console.error(e);
      }
      return newValue;
    });
  };
  const [arabicSize, setArabicSize] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arabic-font-size-multiplier');
      return saved ? parseFloat(saved) : 1.0;
    } catch {
      return 1.0;
    }
  });
  const [isFocusMode, setIsFocusMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('arabic-reading-focus-mode');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [isNightMode, setIsNightMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('friday-night-mode');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [colorPalette, setColorPalette] = useState<ColorPalette>(() => {
    try {
      const saved = localStorage.getItem('friday-theme-palette');
      if (saved === 'earthy' || saved === 'midnight' || saved === 'violet' || saved === 'forest') {
        return saved as ColorPalette;
      }
      return 'forest';
    } catch {
      return 'forest';
    }
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', colorPalette);
      localStorage.setItem('friday-theme-palette', colorPalette);
    } catch (e) {
      console.error(e);
    }
  }, [colorPalette]);

  const [isAzanEnabled, setIsAzanEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('friday-azan-enabled');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [azanStyle, setAzanStyle] = useState<'makkah' | 'madinah'>(() => {
    try {
      const saved = localStorage.getItem('friday-azan-style');
      return (saved === 'madinah' ? 'madinah' : 'makkah');
    } catch {
      return 'makkah';
    }
  });

  const [playingAzanPrayer, setPlayingAzanPrayer] = useState<string | null>(null);
  const [lastTriggeredPrayer, setLastTriggeredPrayer] = useState<string>('');
  const azanAudioRef = useRef<HTMLAudioElement | null>(null);

  const [isAzanAudioPlaying, setIsAzanAudioPlaying] = useState<boolean>(false);
  const [azanAudioVolume, setAzanAudioVolume] = useState<number>(0.85);
  const [azanAudioCurrentTime, setAzanAudioCurrentTime] = useState<number>(0);
  const [azanAudioDuration, setAzanAudioDuration] = useState<number>(1);
  const [isAzanAudioLoading, setIsAzanAudioLoading] = useState<boolean>(false);

  const [quranReciter, setQuranReciter] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('quran-reciter');
      return saved || 'ar.alafasy';
    } catch {
      return 'ar.alafasy';
    }
  });

  const [quranTranslation, setQuranTranslation] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('quran-translation');
      return saved || 'en.sahih';
    } catch {
      return 'en.sahih';
    }
  });

  const [quranAutoAdvance, setQuranAutoAdvance] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('quran-auto-advance');
      return saved !== 'false';
    } catch {
      return true;
    }
  });

  const [quranFontSize, setQuranFontSize] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('quran-font-size');
      return saved ? parseFloat(saved) : 1.15;
    } catch {
      return 1.15;
    }
  });

  const [quranReadingMode, setQuranReadingMode] = useState<'classic' | 'continuous'>(() => {
    try {
      const saved = localStorage.getItem('quran-reading-mode');
      return (saved === 'continuous' ? 'continuous' : 'classic');
    } catch {
      return 'classic';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('quran-reading-mode', quranReadingMode);
      window.dispatchEvent(new Event('quran-reading-mode-changed'));
    } catch (e) {
      console.error(e);
    }
  }, [quranReadingMode]);

  // Sync state if changed externally (e.g., from QuranModal)
  useEffect(() => {
    const handleModeChange = () => {
      try {
        const saved = localStorage.getItem('quran-reading-mode');
        if (saved === 'classic' || saved === 'continuous') {
          setQuranReadingMode(saved);
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

  useEffect(() => {
    try {
      localStorage.setItem('quran-reciter', quranReciter);
    } catch (e) {
      console.error(e);
    }
  }, [quranReciter]);

  useEffect(() => {
    try {
      localStorage.setItem('quran-translation', quranTranslation);
    } catch (e) {
      console.error(e);
    }
  }, [quranTranslation]);

  useEffect(() => {
    try {
      localStorage.setItem('quran-auto-advance', quranAutoAdvance ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  }, [quranAutoAdvance]);

  useEffect(() => {
    try {
      localStorage.setItem('quran-font-size', quranFontSize.toString());
    } catch (e) {
      console.error(e);
    }
  }, [quranFontSize]);

  // Sync Night Mode to HTML document class
  useEffect(() => {
    try {
      const root = document.documentElement;
      if (isNightMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('friday-night-mode', isNightMode ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  }, [isNightMode]);

  // Listen for custom navigation requests
  useEffect(() => {
    const handleNavigate = (e: Event) => {
      const customEvent = e as CustomEvent;
      const section = customEvent.detail?.section;
      if (section) {
        setActiveSection(section);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('navigate-to-section', handleNavigate);
    return () => window.removeEventListener('navigate-to-section', handleNavigate);
  }, []);

  // Sync Azan enabled/style to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('friday-azan-enabled', isAzanEnabled ? 'true' : 'false');
      window.dispatchEvent(new Event('azan-updated'));
    } catch (e) {
      console.error(e);
    }
  }, [isAzanEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem('friday-azan-style', azanStyle);
      window.dispatchEvent(new Event('azan-updated'));
    } catch (e) {
      console.error(e);
    }
  }, [azanStyle]);

  // Synchronize state with actual HTML5 Audio player events
  useEffect(() => {
    const audio = azanAudioRef.current;
    if (!audio || !playingAzanPrayer) {
      setIsAzanAudioPlaying(false);
      return;
    }

    const handlePlay = () => setIsAzanAudioPlaying(true);
    const handlePause = () => setIsAzanAudioPlaying(false);
    const handleEnded = () => {
      setIsAzanAudioPlaying(false);
      setPlayingAzanPrayer(null);
    };
    const handleTimeUpdate = () => {
      setAzanAudioCurrentTime(audio.currentTime);
    };
    const handleDurationChange = () => {
      setAzanAudioDuration(audio.duration || 1);
    };
    const handleWaiting = () => setIsAzanAudioLoading(true);
    const handlePlaying = () => setIsAzanAudioLoading(false);

    // Sync volume
    audio.volume = azanAudioVolume;

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('canplay', handlePlaying);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('canplay', handlePlaying);
    };
  }, [playingAzanPrayer, azanStyle]);

  // Audio helper handlers
  const toggleAzanPlayPause = () => {
    const audio = azanAudioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(err => console.warn('Play failed:', err));
    } else {
      audio.pause();
    }
  };

  const changeAzanVolume = (val: number) => {
    setAzanAudioVolume(val);
    if (azanAudioRef.current) {
      azanAudioRef.current.volume = val;
    }
  };

  const seekAzanAudio = (time: number) => {
    if (azanAudioRef.current) {
      azanAudioRef.current.currentTime = time;
      setAzanAudioCurrentTime(time);
    }
  };

  // Handle custom events from FridayPrayerTimes component
  useEffect(() => {
    const handleTriggerTest = (e: Event) => {
      const customEvent = e as CustomEvent;
      const style = customEvent.detail?.style || azanStyle;
      const testUrl = style === 'madinah' 
        ? 'https://archive.org/download/AdhanMadinah/Adhan%20Madinah.mp3'
        : 'https://archive.org/download/azan-makkah/azan-makkah.mp3';

      window.dispatchEvent(new Event('pause-recitation'));

      if (!azanAudioRef.current) {
        const audio = new Audio();
        audio.src = testUrl;
        azanAudioRef.current = audio;
      } else {
        azanAudioRef.current.pause();
        azanAudioRef.current.src = testUrl;
      }
      azanAudioRef.current.volume = azanAudioVolume;
      setIsAzanAudioLoading(true);
      
      azanAudioRef.current.play()
        .then(() => {
          setPlayingAzanPrayer('Test Call');
        })
        .catch(err => {
          console.warn('Test playback blocked or failed:', err);
          setPlayingAzanPrayer('Test Call');
        });
    };

    const handleStopTest = () => {
      stopAzan();
    };

    window.addEventListener('trigger-test-azan', handleTriggerTest);
    window.addEventListener('stop-test-azan', handleStopTest);
    return () => {
      window.removeEventListener('trigger-test-azan', handleTriggerTest);
      window.removeEventListener('stop-test-azan', handleStopTest);
    };
  }, [azanStyle, azanAudioVolume]);

  // Trigger Azan play
  const triggerAzan = (prayerName: string) => {
    try {
      window.dispatchEvent(new Event('pause-recitation'));

      const audioUrl = azanStyle === 'madinah' 
        ? 'https://archive.org/download/AdhanMadinah/Adhan%20Madinah.mp3'
        : 'https://archive.org/download/azan-makkah/azan-makkah.mp3';

      if (!azanAudioRef.current) {
        const audio = new Audio();
        audio.src = audioUrl;
        azanAudioRef.current = audio;
      } else {
        azanAudioRef.current.pause();
        azanAudioRef.current.src = audioUrl;
      }

      azanAudioRef.current.volume = azanAudioVolume;
      setIsAzanAudioLoading(true);

      azanAudioRef.current.play()
        .then(() => {
          setPlayingAzanPrayer(prayerName);
        })
        .catch(err => {
          console.warn('Azan autoplay blocked or failed:', err);
          setPlayingAzanPrayer(prayerName);
        });
    } catch (err) {
      console.error('Failed to play Azan:', err);
    }
  };

  const stopAzan = () => {
    if (azanAudioRef.current) {
      azanAudioRef.current.pause();
    }
    setPlayingAzanPrayer(null);
  };

  // Run a check of the prayer times every 15 seconds
  useEffect(() => {
    if (!isAzanEnabled) {
      if (azanAudioRef.current) {
        azanAudioRef.current.pause();
      }
      setPlayingAzanPrayer(null);
      return;
    }

    const checkPrayerTime = () => {
      try {
        const storedTimings = localStorage.getItem('friday-prayer-timings');
        if (!storedTimings) return;

        const parsedTimings = JSON.parse(storedTimings);
        const now = new Date();
        const HH = String(now.getHours()).padStart(2, '0');
        const MM = String(now.getMinutes()).padStart(2, '0');
        const currentTimeString = `${HH}:${MM}`;

        const targetPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

        for (const prayer of targetPrayers) {
          let prayerTime = parsedTimings[prayer];
          if (!prayerTime) continue;

          prayerTime = prayerTime.split(' ')[0];

          if (currentTimeString === prayerTime) {
            const uniqueId = `${prayer}-${now.toDateString()}-${currentTimeString}`;
            if (lastTriggeredPrayer !== uniqueId) {
              setLastTriggeredPrayer(uniqueId);

              const isFriday = now.getDay() === 5;
              const prayerName = (prayer === 'Dhuhr' && isFriday) ? 'Jumu\'ah' : prayer;

              triggerAzan(prayerName);
            }
            break;
          }
        }
      } catch (e) {
        console.error('Error checking prayer times:', e);
      }
    };

    checkPrayerTime();
    const interval = setInterval(checkPrayerTime, 15000);
    return () => clearInterval(interval);
  }, [isAzanEnabled, lastTriggeredPrayer, azanStyle]);

  const handleFocusModeChange = (enabled: boolean) => {
    setIsFocusMode(enabled);
    try {
      localStorage.setItem('arabic-reading-focus-mode', enabled ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  };

  const handleArabicSizeChange = (size: number) => {
    setArabicSize(size);
    try {
      localStorage.setItem('arabic-font-size-multiplier', size.toString());
    } catch (e) {
      console.error(e);
    }
  };

  // Using a high-quality Islamic pattern background. 
  const bgImage = "https://images.unsplash.com/photo-1584553153350-087a3cbdfb0e?q=80&w=2487&auto=format&fit=crop";

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'home':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <LandingDashboard 
              setActiveSection={setActiveSection}
              onClassicMushafClick={() => {
                setClassicMushafPage(1);
                setIsClassicMushafOpen(true);
              }}
            />
          </div>
        );
      case 'quran':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <QuranJuzSection 
              selectedReciter={quranReciter}
              onReciterChange={setQuranReciter}
              selectedTranslation={quranTranslation}
              onTranslationChange={setQuranTranslation}
              autoAdvance={quranAutoAdvance}
              onAutoAdvanceChange={setQuranAutoAdvance}
              fontSize={quranFontSize}
              onFontSizeChange={setQuranFontSize}
            />
          </div>
        );
      case 'alkahf':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            {!isFocusMode && <Hero />}
            <AlKahfSection />
          </div>
        );
      case 'table':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            {!isFocusMode && (
              <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-secondary-200 shadow-sm">
                 <h2 className="text-3xl font-bold font-serif text-slate-800 dark:text-slate-100">{t('table.title')}</h2>
                 <p className="text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                   {t('table.desc')}
                 </p>
              </div>
            )}
            <SurahTable />
          </div>
        );
      case 'other':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <OtherRecommendations />
          </div>
        );
      case 'dua':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <DuaSection onNavigateToKhatam={() => setActiveSection('khatam')} />
          </div>
        );
      case 'dua_deceased':
        return (
          <DuaDeceasedSection onBackToHome={() => setActiveSection('home')} />
        );
      case 'my_duas':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <MyDuasSection />
          </div>
        );
      case 'azkar':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <AzkarSection />
          </div>
        );
      case 'bookmarks':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <BookmarksSection />
          </div>
        );
      case 'journal':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <ReflectionJournal />
          </div>
        );
      case 'tajweed':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <TajweedSection />
          </div>
        );
      case 'qibla':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <QiblaSection />
          </div>
        );
      case 'features':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <FeaturesSection />
          </div>
        );
      case 'khatam':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <KhatamSection />
          </div>
        );
      case 'poetry':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <PoetrySection />
          </div>
        );
      case 'quran_year_plan':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <QuranYearPlanSection />
          </div>
        );
      case 'connected_applet':
        return (
          <ConnectedAppletSection onBack={() => setActiveSection('home')} />
        );
      case 'salat_recitations':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <SalatRecitationsSection
              onNavigateToQibla={() => setActiveSection('qibla')}
              onNavigateToAzkar={() => setActiveSection('azkar')}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={`min-h-screen flex flex-col font-sans text-slate-900 relative ${isFocusMode ? 'is-focus-mode' : ''}`}
      style={{ '--arabic-size-multiplier': arabicSize } as React.CSSProperties}
    >
      {gmpQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      <ScrollProgressBar />
      <style>{`
        .font-arabic {
          font-family: 'Amiri Quran', 'Amiri', 'Scheherazade New', 'Noto Naskh Arabic', 'Traditional Arabic', serif !important;
          font-size: calc(1.75rem * var(--arabic-size-multiplier, 1)) !important;
          line-height: 2.0 !important;
          text-rendering: optimizeLegibility;
        }
        .font-arabic.text-2xl {
          font-size: calc(1.5rem * var(--arabic-size-multiplier, 1)) !important;
        }
        .font-arabic.text-3xl {
          font-size: calc(1.875rem * var(--arabic-size-multiplier, 1)) !important;
        }
        .font-arabic.text-4xl {
          font-size: calc(2.25rem * var(--arabic-size-multiplier, 1)) !important;
        }
        .font-arabic.text-\\[22px\\] {
          font-size: calc(22px * var(--arabic-size-multiplier, 1)) !important;
        }
        .font-arabic.text-\\[28px\\] {
          font-size: calc(28px * var(--arabic-size-multiplier, 1)) !important;
        }
        @media (min-width: 640px) {
          .font-arabic.sm\\:text-3xl {
            font-size: calc(1.875rem * var(--arabic-size-multiplier, 1)) !important;
          }
          .font-arabic.sm\\:text-4xl {
            font-size: calc(2.25rem * var(--arabic-size-multiplier, 1)) !important;
          }
          .font-arabic.sm\\:text-\\[28px\\] {
            font-size: calc(28px * var(--arabic-size-multiplier, 1)) !important;
          }
        }
        
        /* Focus Mode specific styles to hide introductory banners */
        .is-focus-mode #other-intro-title,
        .is-focus-mode #other-intro-desc,
        .is-focus-mode #dua-header-banner,
        .is-focus-mode #azkar-header-banner {
          display: none !important;
        }

        /* Night Mode Global Custom Overrides */
        .dark body {
          background-color: #020617 !important;
          color: #f1f5f9 !important;
        }
        .dark .bg-white,
        .dark .bg-white\/95,
        .dark .bg-white\/90,
        .dark .bg-white\/80,
        .dark .bg-white\/98 {
          background-color: rgba(15, 23, 42, 0.95) !important;
          border-color: rgba(51, 65, 85, 0.3) !important;
        }
        .dark .text-slate-900,
        .dark .text-slate-800,
        .dark .text-slate-700 {
          color: #f1f5f9 !important;
        }
        .dark .text-slate-600,
        .dark .text-slate-500,
        .dark .text-slate-400 {
          color: #94a3b8 !important;
        }
        .dark .border-slate-200,
        .dark .border-slate-100,
        .dark .border-secondary-200,
        .dark .border-slate-300 {
          border-color: rgba(51, 65, 85, 0.35) !important;
        }
        .dark .bg-slate-50,
        .dark .bg-slate-100 {
          background-color: rgba(30, 41, 59, 0.6) !important;
        }
        .dark .bg-slate-200 {
          background-color: rgba(51, 65, 85, 0.6) !important;
        }
        .dark .bg-emerald-50 {
          background-color: rgba(15, 23, 42, 0.8) !important;
          color: var(--color-primary-300, #34d399) !important;
          border-color: rgba(51, 65, 85, 0.4) !important;
        }
        .dark .text-emerald-700,
        .dark .text-emerald-800 {
          color: var(--color-primary-300, #34d399) !important;
        }
        .dark .text-primary-700,
        .dark .text-primary-800,
        .dark .text-primary-900 {
          color: var(--color-primary-300, #34d399) !important;
        }
        .dark .hover\:bg-secondary-100\/40:hover {
          background-color: rgba(184, 141, 85, 0.15) !important;
        }
        .dark .text-justify {
          color: #e2e8f0 !important;
        }
        .dark #back-to-top-btn,
        .dark footer {
          background-color: rgba(15, 23, 42, 0.8) !important;
          border-color: rgba(51, 65, 85, 0.3) !important;
        }
        .dark input, .dark select, .dark textarea {
          background-color: rgba(30, 41, 59, 0.8) !important;
          color: #f1f5f9 !important;
          border-color: rgba(51, 65, 85, 0.5) !important;
        }
      `}</style>
      {/* Background Image Layer */}
      <div 
        className={`fixed inset-0 z-[-2] bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${isNightMode ? 'opacity-30' : 'opacity-100'}`}
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      {/* Overlay Layer to ensure readability */}
      <div className={`fixed inset-0 z-[-1] transition-colors duration-500 backdrop-blur-[2px] ${isNightMode ? 'bg-slate-950/85' : 'bg-slate-50/40'}`} />

      {/* Sidebar - fixed on desktop, slide drawer on mobile - hidden in focus mode */}
      {!isFocusMode && (
        <Sidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebarCollapse}
          onClassicMushafClick={() => {
            setClassicMushafPage(1);
            setIsClassicMushafOpen(true);
          }}
        />
      )}

      {/* Floating Focus Mode Control Bar */}
      {isFocusMode && (
        <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-3.5 bg-white/95 backdrop-blur-md px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl border border-secondary-200 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Small Pulse Indicator */}
          <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-700 tracking-wide uppercase hidden sm:inline">Focus Mode</span>
          </div>

          {/* Quick Font Size Controls inside Focus Bar */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase mr-1 hidden xs:inline">Size:</span>
            {[
              { label: 'A-', value: 0.85, desc: 'Small' },
              { label: 'A', value: 1.0, desc: 'Normal' },
              { label: 'A+', value: 1.2, desc: 'Large' },
              { label: 'A++', value: 1.4, desc: 'Extra Large' }
            ].map((opt) => {
              const isSelected = Math.abs(arabicSize - opt.value) < 0.01;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleArabicSizeChange(opt.value)}
                  title={opt.desc}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer select-none
                    ${isSelected 
                      ? 'bg-primary-600 text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="w-px h-5 bg-slate-200" />

          {/* Quick Night Mode Toggle inside Focus Bar */}
          <button
            onClick={() => setIsNightMode(!isNightMode)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors select-none cursor-pointer"
            title={isNightMode ? "Switch to Day Mode" : "Switch to Night Mode"}
          >
            {isNightMode ? (
              <Sun size={15} className="text-amber-500 fill-amber-500" />
            ) : (
              <Moon size={15} className="text-slate-600" />
            )}
          </button>

          <div className="w-px h-5 bg-slate-200" />

          {/* Exit Focus Button */}
          <button
            onClick={() => handleFocusModeChange(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer select-none"
            title="Exit distraction-free Focus Mode"
          >
            <Minimize2 size={13} className="text-secondary-400" />
            <span>Exit Focus</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`flex-grow flex flex-col min-h-screen w-full transition-all duration-300 ${isFocusMode ? 'md:pl-0' : isSidebarCollapsed ? 'md:pl-20' : 'md:pl-72'}`}>
        {/* Mobile Navbar - hidden in focus mode */}
        {!isFocusMode && (
          <Navbar 
            activeSection={activeSection} 
            onMenuClick={() => setIsSidebarOpen(true)} 
            onOpenSearch={() => setIsGlobalSearchOpen(true)}
            arabicSize={arabicSize}
            onArabicSizeChange={handleArabicSizeChange}
            isFocusMode={isFocusMode}
            onFocusModeChange={handleFocusModeChange}
            isNightMode={isNightMode}
            onNightModeChange={setIsNightMode}
            colorPalette={colorPalette}
            onColorPaletteChange={setColorPalette}
            quranReciter={quranReciter}
            onQuranReciterChange={setQuranReciter}
            quranTranslation={quranTranslation}
            onQuranTranslationChange={setQuranTranslation}
            quranAutoAdvance={quranAutoAdvance}
            onQuranAutoAdvanceChange={setQuranAutoAdvance}
            quranFontSize={quranFontSize}
            onQuranFontSizeChange={setQuranFontSize}
            quranReadingMode={quranReadingMode}
            onQuranReadingModeChange={setQuranReadingMode}
          />
        )}

        {/* Content Panel */}
        <main className={`flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full transition-all duration-300 relative ${isFocusMode ? 'pt-8 md:pt-12' : 'pt-20 md:pt-12'}`}>
          
          {/* Top Page Banner: Hijri, Gregorian Date, Quick Search & Clock */}
          {!isFocusMode && (
            <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
              <DateDisplay variant="header" />

              {/* Quick Search Shortcut Banner for Large Screens */}
              <button
                onClick={() => setIsGlobalSearchOpen(true)}
                type="button"
                className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-500 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 shadow-xs hover:shadow-md transition-all text-xs font-medium cursor-pointer"
                title="Search Surahs, Duas, Azkar topics (Ctrl+K)"
              >
                <div className="flex items-center gap-2">
                  <Search size={15} className="text-primary-600 dark:text-secondary-400" />
                  <span>{t('search.globalPlaceholder')}</span>
                </div>
                <div className="flex items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-700">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold">⌘K</kbd>
                </div>
              </button>
            </div>
          )}

          {/* Desktop Config Menu & Global Search */}
          {!isFocusMode && (
            <div className="absolute top-4 right-4 sm:right-6 lg:right-8 z-20 hidden md:flex items-center gap-2.5">
              <button
                onClick={() => setIsGlobalSearchOpen(true)}
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 hover:bg-primary-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 hover:border-primary-300 text-slate-700 dark:text-slate-300 shadow-xs hover:shadow-sm transition-all text-xs font-semibold cursor-pointer"
                title="Search Surahs, Duas, Azkar (Ctrl+K)"
              >
                <Search size={14} className="text-primary-600 dark:text-secondary-400" />
                <span className="hidden xl:inline">{t('search.quickSearch')}</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-400 font-bold">⌘K</kbd>
              </button>

              <button
                onClick={() => setIsConnectedAppletOpen(true)}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 text-slate-700 dark:text-slate-300 shadow-xs hover:shadow-sm transition-all text-xs font-semibold cursor-pointer"
                title="Launch Connected AI Studio Applet"
              >
                <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
                <span className="hidden xl:inline">{language === 'ar' ? 'التطبيق المدمج' : 'Connected Applet'}</span>
              </button>

              <ConfigMenu
                arabicSize={arabicSize}
                onArabicSizeChange={handleArabicSizeChange}
                isFocusMode={isFocusMode}
                onFocusModeChange={handleFocusModeChange}
                isNightMode={isNightMode}
                onNightModeChange={setIsNightMode}
                colorPalette={colorPalette}
                onColorPaletteChange={setColorPalette}
                align="right"
                quranReciter={quranReciter}
                onQuranReciterChange={setQuranReciter}
                quranTranslation={quranTranslation}
                onQuranTranslationChange={setQuranTranslation}
                quranAutoAdvance={quranAutoAdvance}
                onQuranAutoAdvanceChange={setQuranAutoAdvance}
                quranFontSize={quranFontSize}
                onQuranFontSizeChange={setQuranFontSize}
                quranReadingMode={quranReadingMode}
                onQuranReadingModeChange={setQuranReadingMode}
              />
            </div>
          )}

          {renderActiveSection()}

          {/* Go Back To Top Button */}
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 backdrop-blur-sm border border-secondary-200 text-slate-600 hover:text-primary-700 hover:border-primary-300 hover:bg-white shadow-sm hover:shadow-md transition-all text-xs font-bold uppercase tracking-wider cursor-pointer"
              id="back-to-top-btn"
            >
              <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform text-primary-600" />
              <span>Go Back To Top</span>
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 mt-12">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left space-y-1">
              <p className="text-slate-500 text-sm font-semibold">
                © {new Date().getFullYear()} Friday Surah Guide.
              </p>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium leading-relaxed">
                Dedicated to the memory of <strong>Al-Hajj Ahmed Khalil Faqih</strong>, on the 20th anniversary of his passing, as <strong>Sadaqa Jaria</strong>.
              </p>
            </div>
            
            {/* Share Button */}
            <button
              onClick={handleShare}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold shadow-sm transition-all duration-300 cursor-pointer select-none
                ${copied
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-100 dark:shadow-none'
                  : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-primary-700 border-slate-200 hover:border-primary-300 dark:bg-slate-900/40 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
            >
              {copied ? (
                <>
                  <Check size={14} className="animate-bounce" />
                  <span>{t('share.copied')}</span>
                </>
              ) : (
                <>
                  <Share2 size={14} className="text-primary-500 dark:text-secondary-400" />
                  <span>{t('share.button')}</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1 text-sm text-slate-400">
              <span>Made with</span>
              <Heart size={14} className="text-accent-500 fill-current animate-pulse" />
              <span>for the Ummah</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Gorgeous Azan Alert Modal Overlay */}
      {playingAzanPrayer && (
        <div className="fixed bottom-6 right-6 z-[100] w-[calc(100%-3rem)] sm:w-96 bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 text-white p-5 rounded-2xl border border-secondary-400/60 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center gap-4 animate-in slide-in-from-bottom-8 fade-in-50 duration-500">
          <div className="absolute top-3 right-3">
            <button 
              onClick={stopAzan}
              className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Stop & Dismiss"
            >
              <X size={15} />
            </button>
          </div>
          
          <div className="flex items-center gap-3 w-full border-b border-primary-800/60 pb-3">
            <div className="p-2.5 bg-primary-800 rounded-xl border border-secondary-500/20 text-secondary-400 animate-pulse">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div className="text-left">
              <h4 className="text-[10px] font-bold tracking-wider text-secondary-300 uppercase">🕌 Al-Mu'adhin Call</h4>
              <p className="text-sm font-bold text-white leading-tight">Prayer Time Alert</p>
            </div>
          </div>
          
          <div className="text-center py-1">
            <p className="text-sm text-primary-200">It is currently time for</p>
            <p className="text-2xl font-bold font-serif text-secondary-300 mt-1">{playingAzanPrayer} Prayer</p>
            <p className="text-xs text-primary-400/90 italic mt-2">"Verily, prayer is enjoined on the believers at fixed times."</p>
          </div>

          {/* Custom Audio Control Dashboard */}
          <div className="w-full bg-primary-950/60 border border-primary-800/80 rounded-xl p-3.5 flex flex-col gap-3 shadow-inner">
            {/* Status / Track Info & Master Playback Controls */}
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] uppercase font-bold tracking-wider text-secondary-400">
                {isAzanAudioLoading ? 'Loading Audio...' : isAzanAudioPlaying ? 'Now Reciting' : 'Paused'}
              </span>
              
              <div className="flex items-center gap-2">
                {/* Restart Button */}
                <button
                  onClick={() => {
                    if (azanAudioRef.current) {
                      azanAudioRef.current.currentTime = 0;
                      azanAudioRef.current.play().catch(e => console.warn(e));
                    }
                  }}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-primary-200 hover:text-white transition-all cursor-pointer"
                  title="Restart Call"
                >
                  <RotateCcw size={14} />
                </button>

                {/* Play/Pause Button */}
                <button
                  onClick={toggleAzanPlayPause}
                  className="p-2 rounded-full bg-secondary-400 hover:bg-secondary-500 text-primary-950 font-bold hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center cursor-pointer"
                  title={isAzanAudioPlaying ? 'Pause' : 'Play'}
                >
                  {isAzanAudioLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-primary-950 border-t-transparent rounded-full animate-spin" />
                  ) : isAzanAudioPlaying ? (
                    <Pause size={14} className="fill-current" />
                  ) : (
                    <Play size={14} className="fill-current ml-0.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Seek Bar (Timeline) */}
            <div className="flex flex-col gap-1 w-full">
              <div className="flex items-center justify-between text-[10px] text-primary-300 font-mono">
                <span>{formatTime(azanAudioCurrentTime)}</span>
                <span>{formatTime(azanAudioDuration)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={azanAudioDuration || 1}
                step={0.1}
                value={azanAudioCurrentTime}
                onChange={(e) => seekAzanAudio(parseFloat(e.target.value))}
                className="w-full h-1 bg-primary-800 rounded-lg appearance-none cursor-pointer accent-secondary-400 focus:outline-none"
              />
            </div>

            {/* Volume Control Row */}
            <div className="flex items-center gap-2 w-full border-t border-primary-800/40 pt-2.5">
              <button
                onClick={() => changeAzanVolume(azanAudioVolume === 0 ? 0.85 : 0)}
                className="text-primary-300 hover:text-white transition-colors"
                title={azanAudioVolume === 0 ? 'Unmute' : 'Mute'}
              >
                {azanAudioVolume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={azanAudioVolume}
                onChange={(e) => changeAzanVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-primary-800 rounded-lg appearance-none cursor-pointer accent-secondary-400 focus:outline-none"
              />
              <span className="text-[10px] text-primary-300 font-mono w-7 text-right">
                {Math.round(azanAudioVolume * 100)}%
              </span>
            </div>
          </div>
          
          <button
            onClick={stopAzan}
            className="w-full py-2.5 bg-gradient-to-r from-secondary-400 to-secondary-500 hover:from-secondary-500 hover:to-secondary-600 active:scale-[0.98] text-primary-950 font-bold rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer select-none"
          >
            <VolumeX size={14} />
            <span>Dismiss & Stop Azan Call</span>
          </button>
        </div>
      )}

      {/* Classic Mushaf Scanned Page Pop-up Modal */}
      <ClassicMushafModal 
        isOpen={isClassicMushafOpen} 
        onClose={() => setIsClassicMushafOpen(false)} 
        initialPage={classicMushafPage}
      />

      {/* Calendar Modal */}
      <CalendarModal 
        isOpen={isHijriCalendarOpen} 
        onClose={() => setIsHijriCalendarOpen(false)} 
        initialTab={initialCalendarTab}
      />

      {/* World Clock Modal */}
      <WorldClockModal
        isOpen={isWorldClockOpen}
        onClose={() => setIsWorldClockOpen(false)}
      />

      {/* Quran Study & Tafsir Modules Modal */}
      <QuranStudyModal
        isOpen={isQuranStudyModalOpen}
        onClose={() => setIsQuranStudyModalOpen(false)}
        initialModuleId={quranStudyModuleId}
      />

      {/* Global Comprehensive Search Modal */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        onNavigateSection={(sec) => {
          setActiveSection(sec);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenClassicMushaf={(page) => {
          setClassicMushafPage(page || 1);
          setIsClassicMushafOpen(true);
        }}
        onOpenCalendar={(tab) => {
          setInitialCalendarTab(tab || 'hijri');
          setIsHijriCalendarOpen(true);
        }}
        onOpenWorldClock={() => setIsWorldClockOpen(true)}
        onOpenStudyModule={(modId) => {
          setQuranStudyModuleId(modId || 'mod-fatiha');
          setIsQuranStudyModalOpen(true);
        }}
      />

      {/* Offline Storage & Caching Center Modal */}
      <OfflineModal
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
        onOpenSurah={(surahNum) => {
          setActiveSection('quran');
          window.dispatchEvent(new CustomEvent('open-quran-surah', { detail: { surahNumber: surahNum } }));
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Connected AI Studio Companion Applet Modal */}
      <ConnectedAppletModal
        isOpen={isConnectedAppletOpen}
        onClose={() => setIsConnectedAppletOpen(false)}
      />

      {/* Global Enhanced TTS Player Dashboard */}
      <TTSActivePlayer />
    </div>
  );
}

export default function App() {
  return (
    <TTSProvider>
      <AudioProvider>
        <AppContent />
      </AudioProvider>
    </TTSProvider>
  );
}
