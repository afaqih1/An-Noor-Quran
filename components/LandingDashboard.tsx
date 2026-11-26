import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Calendar, Clock, Sparkles, Compass, BookOpen, Sun, Book, Bookmark, 
  GraduationCap, FileText, ArrowRight, Play, Pause, ChevronRight, X, Volume2, VolumeX, Award,
  RotateCcw, Loader2, Flame, CheckCircle2, Moon, UserCheck, Shield
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import FridayPrayerTimes from './FridayPrayerTimes';
import DailyHadeeth from './DailyHadeeth';
import { GoogleMapExplorer } from './GoogleMapExplorer';

interface LandingDashboardProps {
  setActiveSection: (section: 'home' | 'alkahf' | 'table' | 'other' | 'dua' | 'azkar' | 'bookmarks' | 'tajweed' | 'quran' | 'qibla' | 'features' | 'khatam' | 'dua_deceased' | 'my_duas' | 'journal' | 'poetry' | 'quran_year_plan' | 'connected_applet' | 'salat_recitations') => void;
  onClassicMushafClick?: () => void;
}

const fatihaVerses = [
  {
    number: 1,
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    english: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    transliteration: "Bismillaahir Rahmaanir Raheem"
  },
  {
    number: 2,
    arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    english: "[All] praise is [due] to Allah, Lord of the worlds -",
    transliteration: "Alhamdu lillaahi Rabbil 'aalameen"
  },
  {
    number: 3,
    arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
    english: "The Entirely Merciful, the Especially Merciful,",
    transliteration: "Ar-Rahmaanir-Raheem"
  },
  {
    number: 4,
    arabic: "مَالِكِ يَوْمِ الدِّينِ",
    english: "Sovereign of the Day of Recompense.",
    transliteration: "Maaliki Yawmid-Deen"
  },
  {
    number: 5,
    arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    english: "It is You we worship and You we ask for help.",
    transliteration: "Iyyaaka na'budu wa iyyaaka nasta'een"
  },
  {
    number: 6,
    arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    english: "Guide us to the straight path -",
    transliteration: "Ihdinas-Siraatal-Mustaqeem"
  },
  {
    number: 7,
    arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    english: "The path of those upon whom You have bestowed favor, not of those who have earned [Your] anger or of those who are astray.",
    transliteration: "Siraatal-lazeena an'amta 'alaihim ghayril-maghdoobi 'alaihim wa lad-daalleen"
  }
];

export const LandingDashboard: React.FC<LandingDashboardProps> = ({ 
  setActiveSection,
  onClassicMushafClick
}) => {
  const { language, t } = useLanguage();
  const [time, setTime] = useState<Date>(new Date());
  const [hijriString, setHijriString] = useState<string>('...');
  const [gregString, setGregString] = useState<string>('...');
  const [isFatihaOpen, setIsFatihaOpen] = useState(false);
  const [isFatihaPlaying, setIsFatihaPlaying] = useState(false);
  const [fatihaCurrentTime, setFatihaCurrentTime] = useState<number>(0);
  const [fatihaDuration, setFatihaDuration] = useState<number>(0);
  const [fatihaVolume, setFatihaVolume] = useState<number>(0.85);
  const [fatihaIsMuted, setFatihaIsMuted] = useState<boolean>(false);
  const [fatihaSpeed, setFatihaSpeed] = useState<number>(1);
  const [isFatihaLoading, setIsFatihaLoading] = useState<boolean>(false);
  
  const fatihaAudioRef = useRef<HTMLAudioElement | null>(null);

  // States for user progress indicators
  const [lastReadJuz, setLastReadJuz] = useState<number | null>(null);
  const [bookmarkCount, setBookmarkCount] = useState<number>(0);
  const [khatamCount, setKhatamCount] = useState<number>(0);

  // Daily Quranic Habit Tracker states
  const [habits, setHabits] = useState<Record<string, boolean>>({
    readJuz: false,
    morningAzkar: false,
    eveningAzkar: false
  });
  const [habitStreak, setHabitStreak] = useState<number>(0);
  const [habitLastCompleted, setHabitLastCompleted] = useState<string>('');

  const trackerTranslations = {
    en: {
      title: "Daily Quranic Habit Tracker",
      subtitle: "Form holy habits. Track your essential daily devotions and stay consistent.",
      streak: "Daily Streak",
      streakDays: "Days",
      progress: "Today's Progress",
      reset: "Reset All",
      completed: "All Completed! Alhamdu lillah 🎉",
      keepGoing: "Keep going to build your streak!",
      juzTitle: "Read 1 Juz",
      juzDesc: "Read at least one Juz (part) of the Holy Quran today.",
      juzAction: "Open Quran Reader",
      morningTitle: "Morning Azkar",
      morningDesc: "Recite the morning supplications (Adhkar As-Sabah) for protection.",
      morningAction: "Go to Azkar",
      eveningTitle: "Evening Azkar",
      eveningDesc: "Recite the evening supplications (Adhkar Al-Masaa) for peace.",
      eveningAction: "Go to Azkar"
    },
    ar: {
      title: "متابع العادات القرآنية اليومية",
      subtitle: "ابنِ عاداتك الصالحة وتتبع أذكارك وتلاوتك اليومية للحفاظ على استمراريتك.",
      streak: "الاستمرارية اليومية",
      streakDays: "أيام",
      progress: "تقدم اليوم",
      reset: "إعادة تعيين",
      completed: "اكتملت جميع العادات! الحمد لله 🎉",
      keepGoing: "واصل التقدم لبناء سلسلة استمراريتك!",
      juzTitle: "قراءة جزء واحد",
      juzDesc: "اقرأ جزءاً واحداً على الأقل من القرآن الكريم اليوم.",
      juzAction: "افتح القارئ",
      morningTitle: "أذكار الصباح",
      morningDesc: "احرص على أوراد الصباح لحفظك وتحصينك طوال يومك.",
      morningAction: "اذهب للأذكار",
      eveningTitle: "أذكار المساء",
      eveningDesc: "تلاوة أذكار المساء للطمأنينة والسكينة في ليلتك.",
      eveningAction: "اذهب للأذكار"
    },
    am: {
      title: "የዕለታዊ ቁርአን ልምዶች መከታተያ",
      subtitle: "መልካም ልምዶችን ያዳብሩ። ዕለታዊ ዝክሮችዎን እና የቁርአን ንባብዎን በመከታተል ጥንካሬዎን ይጠብቁ።",
      streak: "ተከታታይ ቀናት",
      streakDays: "ቀናት",
      progress: "የዛሬው እድገት",
      reset: "እድገቱን መልስ",
      completed: "ሁሉም ተጠናቀዋል! አልሐምዱሊላህ 🎉",
      keepGoing: "ልምድዎን ለማዳበር ይቀጥሉ!",
      juzTitle: "1 ጁዝ መቅራት",
      juzDesc: "ዛሬ ቢያንስ አንድ የቁርአን ጁዝ (ክፍል) ያንብቡ/ይቅሩ።",
      juzAction: "ቁርአን አንባቢ ክፈት",
      morningTitle: "የማለዳ አዝካር",
      morningDesc: "ለጥበቃና በረከት የጠዋት ዝክሮችን (አዝካር አስ-ሰባሕ) ያድርጉ።",
      morningAction: "ወደ አዝካር ሂድ",
      eveningTitle: "የምሽት አዝካር",
      eveningDesc: "ለሰላምና መረጋጋት የማታ ዝክሮችን (አዝካር አል-መሳእ) ያድርጉ።",
      eveningAction: "ወደ አዝካር ሂድ"
    },
    har: {
      title: "የዕለታዊ ቁርአን ልምዲ መከታተያ",
      subtitle: "ጥሩ ልምዶችን ያዳብሩ። ዕለታዊ ዝክሮችዎን እና የቁርአን ንባብዎን በመከታተል ጥንካሬዎን ይጠብቁ።",
      streak: "ተከታታይ ቀናት",
      streakDays: "ቀናት",
      progress: "የዛሬው እድገት",
      reset: "እድገቱን መልስ",
      completed: "ሁሉም ተጠናቀዋል! አልሐምዱሊላህ 🎉",
      keepGoing: "ልምድዎን ለማዳበር ይቀጥሉ!",
      juzTitle: "1 ጁዝ መቅራት",
      juzDesc: "ዛሬ ቢያንስ አንድ የቁርአን ጁዝ ያንብቡ/ይቅሩ።",
      juzAction: "ቁርአን አንባቢ ክፈት",
      morningTitle: "የማለዳ አዝካር",
      morningDesc: "ለጥበቃና በረከት የጠዋት ዝክሮችን (አዝካር አስ-ሰባሕ) ያድርጉ።",
      morningAction: "ወደ አዝካር ሂድ",
      eveningTitle: "የምሽት አዝካር",
      eveningDesc: "ለሰላምና መረጋጋት የማታ ዝክሮችን (አዝካር አል-መሳእ) ያድርጉ።",
      eveningAction: "ወደ አዝካር ሂድ"
    }
  };

  const lHabit = trackerTranslations[language as keyof typeof trackerTranslations] || trackerTranslations.en;

  // Load and check habits
  useEffect(() => {
    try {
      const today = new Date().toDateString();
      const savedDate = localStorage.getItem('daily-habits-date');
      const savedStreak = localStorage.getItem('daily-habits-streak');
      const savedLastCompleted = localStorage.getItem('daily-habits-last-completed');

      const loadedStreak = savedStreak ? parseInt(savedStreak, 10) : 0;
      setHabitStreak(loadedStreak);
      setHabitLastCompleted(savedLastCompleted || '');

      if (savedDate === today) {
        setHabits({
          readJuz: localStorage.getItem('daily-habits-readJuz') === 'true',
          morningAzkar: localStorage.getItem('daily-hab-morningAzkar') === 'true',
          eveningAzkar: localStorage.getItem('daily-hab-eveningAzkar') === 'true'
        });
      } else {
        // New day reset
        if (savedLastCompleted) {
          const lastDate = new Date(savedLastCompleted);
          const currentDate = new Date(today);
          const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays > 1) {
            setHabitStreak(0);
            localStorage.setItem('daily-habits-streak', '0');
          }
        } else {
          setHabitStreak(0);
          localStorage.setItem('daily-habits-streak', '0');
        }

        setHabits({
          readJuz: false,
          morningAzkar: false,
          eveningAzkar: false
        });
        localStorage.setItem('daily-habits-date', today);
        localStorage.setItem('daily-habits-readJuz', 'false');
        localStorage.setItem('daily-hab-morningAzkar', 'false');
        localStorage.setItem('daily-hab-eveningAzkar', 'false');
      }
    } catch (e) {
      console.error("Error loading habits:", e);
    }
  }, []);

  const toggleHabit = (key: 'readJuz' | 'morningAzkar' | 'eveningAzkar') => {
    const today = new Date().toDateString();
    const newHabits = {
      ...habits,
      [key]: !habits[key]
    };
    setHabits(newHabits);

    try {
      localStorage.setItem('daily-habits-date', today);
      
      if (key === 'readJuz') {
        localStorage.setItem('daily-habits-readJuz', String(newHabits[key]));
      } else if (key === 'morningAzkar') {
        localStorage.setItem('daily-hab-morningAzkar', String(newHabits[key]));
      } else if (key === 'eveningAzkar') {
        localStorage.setItem('daily-hab-eveningAzkar', String(newHabits[key]));
      }

      const allCompleted = newHabits.readJuz && newHabits.morningAzkar && newHabits.eveningAzkar;
      
      if (allCompleted) {
        if (habitLastCompleted !== today) {
          const newStreak = habitStreak + 1;
          setHabitStreak(newStreak);
          setHabitLastCompleted(today);
          localStorage.setItem('daily-habits-streak', String(newStreak));
          localStorage.setItem('daily-habits-last-completed', today);
        }
      } else {
        if (habitLastCompleted === today) {
          const newStreak = Math.max(0, habitStreak - 1);
          setHabitStreak(newStreak);
          setHabitLastCompleted('');
          localStorage.setItem('daily-habits-streak', String(newStreak));
          localStorage.removeItem('daily-habits-last-completed');
        }
      }
    } catch (e) {
      console.error("Error toggling habit:", e);
    }
  };

  const resetHabits = () => {
    const today = new Date().toDateString();
    setHabits({
      readJuz: false,
      morningAzkar: false,
      eveningAzkar: false
    });
    setHabitStreak(0);
    setHabitLastCompleted('');
    try {
      localStorage.setItem('daily-habits-date', today);
      localStorage.setItem('daily-habits-readJuz', 'false');
      localStorage.setItem('daily-hab-morningAzkar', 'false');
      localStorage.setItem('daily-hab-eveningAzkar', 'false');
      localStorage.setItem('daily-habits-streak', '0');
      localStorage.removeItem('daily-habits-last-completed');
    } catch (e) {
      console.error("Error resetting habits:", e);
    }
  };

  const completedCount = Object.values(habits).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 3) * 100);

  // Load stats
  useEffect(() => {
    const loadStats = () => {
      try {
        const savedJuzRead = localStorage.getItem('quran-juz-last-read');
        if (savedJuzRead) {
          const parsed = JSON.parse(savedJuzRead);
          const keys = Object.keys(parsed).map(Number);
          if (keys.length > 0) {
            setLastReadJuz(Math.max(...keys));
          }
        }

        const savedBookmarks = localStorage.getItem('friday-bookmarks');
        if (savedBookmarks) {
          const parsed = JSON.parse(savedBookmarks);
          setBookmarkCount(Array.isArray(parsed) ? parsed.length : 0);
        } else {
          // Alternatively check 'quran-bookmarked-ayahs' if exists
          const savedAyahBookmarks = localStorage.getItem('quran-bookmarked-ayahs');
          if (savedAyahBookmarks) {
            const parsed = JSON.parse(savedAyahBookmarks);
            setBookmarkCount(Array.isArray(parsed) ? parsed.length : 0);
          }
        }

        const savedKhatam = localStorage.getItem('friday-khatam-sessions');
        if (savedKhatam) {
          const parsed = JSON.parse(savedKhatam);
          setKhatamCount(Array.isArray(parsed) ? parsed.length : 0);
        }
      } catch (e) {
        console.error("Error loading landing stats:", e);
      }
    };

    loadStats();
    // Re-run if events happen
    window.addEventListener('bookmarks-updated', loadStats);
    return () => window.removeEventListener('bookmarks-updated', loadStats);
  }, []);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format dates only when the calendar day changes
  useEffect(() => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      setHijriString(formatter.format(time) + " AH");
    } catch {
      setHijriString("1448 AH");
    }

    setGregString(time.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
  }, [time.toDateString()]);

  const getTimeString = (): string => {
    let hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return `${hours}:${pad(minutes)}:${pad(seconds)} ${ampm}`;
  };

  const getGreeting = () => {
    const hr = time.getHours();
    if (language === 'ar') {
      if (hr < 12) return 'صباح الخير والبركة';
      if (hr < 18) return 'مساء الخير والرحمة';
      return 'مساء الخير والسكينة';
    }
    if (hr < 12) return 'Good Morning & Blessings';
    if (hr < 17) return 'Good Afternoon & Mercy';
    return 'Good Evening & Serenity';
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Audio stream for Al-Fatiha
  const handleFatihaAudio = () => {
    if (isFatihaPlaying) {
      if (fatihaAudioRef.current) {
        fatihaAudioRef.current.pause();
      }
      setIsFatihaPlaying(false);
    } else {
      // Pause any other recitation if active
      window.dispatchEvent(new Event('pause-recitation'));
      
      const audioUrl = 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3';
      if (!fatihaAudioRef.current) {
        const audio = new Audio(audioUrl);
        fatihaAudioRef.current = audio;
        
        audio.addEventListener('timeupdate', () => {
          setFatihaCurrentTime(audio.currentTime);
        });
        audio.addEventListener('durationchange', () => {
          setFatihaDuration(audio.duration || 0);
        });
        audio.addEventListener('ended', () => {
          setIsFatihaPlaying(false);
          setFatihaCurrentTime(0);
        });
        audio.addEventListener('waiting', () => {
          setIsFatihaLoading(true);
        });
        audio.addEventListener('playing', () => {
          setIsFatihaLoading(false);
        });
        audio.addEventListener('canplay', () => {
          setIsFatihaLoading(false);
        });
      } else {
        fatihaAudioRef.current.src = audioUrl;
      }
      
      fatihaAudioRef.current.volume = fatihaIsMuted ? 0 : fatihaVolume;
      fatihaAudioRef.current.playbackRate = fatihaSpeed;
      
      setIsFatihaLoading(true);
      fatihaAudioRef.current.play()
        .then(() => setIsFatihaPlaying(true))
        .catch(err => {
          console.warn("Fatiha playback error:", err);
          setIsFatihaLoading(false);
        });
    }
  };

  useEffect(() => {
    if (fatihaAudioRef.current) {
      fatihaAudioRef.current.volume = fatihaIsMuted ? 0 : fatihaVolume;
    }
  }, [fatihaVolume, fatihaIsMuted]);

  useEffect(() => {
    if (fatihaAudioRef.current) {
      fatihaAudioRef.current.playbackRate = fatihaSpeed;
    }
  }, [fatihaSpeed]);

  useEffect(() => {
    const handlePauseEvent = () => {
      if (fatihaAudioRef.current) {
        fatihaAudioRef.current.pause();
      }
      setIsFatihaPlaying(false);
    };

    window.addEventListener('pause-recitation', handlePauseEvent);
    return () => {
      window.removeEventListener('pause-recitation', handlePauseEvent);
      if (fatihaAudioRef.current) {
        fatihaAudioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* 1. Welcoming Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 text-white rounded-3xl p-6 sm:p-10 border border-secondary-500/30 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-500/20 text-secondary-300 text-xs font-bold border border-secondary-400/20 tracking-wider uppercase">
              <Sparkles size={12} className="animate-pulse" />
              Assalamu Alaikum • السلام عليكم
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight leading-tight text-white">
              {getGreeting()}
            </h2>
            <p className="text-sm sm:text-base text-primary-200 leading-relaxed">
              {language === 'ar' 
                ? 'مرحباً بك في نظام النور، رفيقك الشامل لقراءة وتلاوة القرآن الكريم، الأذكار اليومية والأدعية، وحساب مواقيت الصلاة بدقة.' 
                : 'Welcome to An-Noor, your comprehensive companion for Quranic readings, daily remembrance, authentic supplications, and precise local prayer tracking.'}
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveSection('quran')}
                className="px-5 py-2.5 bg-gradient-to-r from-secondary-400 to-secondary-500 hover:from-secondary-500 hover:to-secondary-600 active:scale-95 text-primary-950 font-bold rounded-xl text-xs transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen size={14} />
                <span>{language === 'ar' ? 'ابدأ قراءة القرآن' : 'Open Quran Reader'}</span>
              </button>
              <button
                onClick={() => setActiveSection('alkahf')}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/15 active:scale-95 text-white font-bold rounded-xl text-xs transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Sun size={14} className="text-secondary-400" />
                <span>{language === 'ar' ? 'سورة الكهف' : 'Surah Al-Kahf'}</span>
              </button>
            </div>
          </div>

          {/* Clock & Date Widget on Right Side */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg min-w-[280px] self-stretch lg:self-auto flex flex-col justify-center items-center text-center space-y-3.5">
            <div className="flex items-center gap-1.5 text-secondary-300">
              <Clock size={16} className="animate-spin-slow" />
              <span className="text-[11px] font-bold uppercase tracking-widest">{language === 'ar' ? 'الوقت المحلي' : 'Local Time'}</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white leading-none tracking-tight">
              {getTimeString()}
            </div>
            
            <div className="w-full h-px bg-white/10 my-1" />
            
            <div className="space-y-1">
              <div className="text-xs font-serif font-semibold text-secondary-200" dir="rtl">
                {hijriString}
              </div>
              <div className="text-[11px] text-primary-300">
                {gregString}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Memorial Dedication Plaque (Sadaqa Jaria) */}
      <div className="relative overflow-hidden bg-amber-50/70 dark:bg-slate-900/45 rounded-3xl p-6 sm:p-8 border-2 border-amber-300/40 dark:border-amber-500/20 shadow-md">
        {/* Islamic Ornament Background */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-amber-200/5 dark:bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-amber-200/5 dark:bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          <div className="p-4 bg-amber-500/10 dark:bg-amber-500/15 rounded-full text-amber-600 dark:text-amber-400 border border-amber-300/30 flex-shrink-0 flex items-center justify-center">
            <Award size={36} className="animate-pulse" />
          </div>
          
          <div className="space-y-4 text-center md:text-left flex-grow">
            <div>
              <span className="inline-flex px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-extrabold tracking-widest uppercase">
                {language === 'ar' ? 'إهداء صدقة جارية' : 'Sadaqa Jaria Dedication'}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-850 dark:text-slate-100 mt-2">
                {language === 'ar' ? 'إهداء إلى روح المغفور له بإذن الله الحاج أحمد خليل فقيه' : 'Dedicated to the Memory of Al-Hajj Ahmed Khalil Faqih'}
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-400 font-bold tracking-wider uppercase mt-1">
                {language === 'ar' ? 'بمناسبة الذكرى السنوية العشرين لرحيله (٢٢ يونيو ٢٠٠٦ - ٢٢ يونيو ٢٠٢٦)' : 'On the 20th Anniversary of His Passing (June 22, 2006 – June 22, 2026)'}
              </p>
            </div>
            
            <p className="text-sm text-slate-650 dark:text-slate-300 leading-relaxed max-w-4xl">
              {language === 'ar' 
                ? 'نسأل الله العلي القدير أن يتغمد الفقيد بواسع رحمته، وأن يتقبل هذا النظام كصدقة جارية مستمرة في ميزان حسناته، وأن يسكنه فسيح جناته في الفردوس الأعلى. ندعوكم جميعاً لإهدائه ثواب الفاتحة ومشاركته في صالح أدعيتكم بالرحمة والمغفرة.'
                : 'We humbly dedicate this platform as an ongoing Sadaqa Jaria (continuous charity) in honor of Al-Hajj Ahmed Khalil Faqih. We pray that Allah (SWT) accepts this humble tribute, showers him with infinite mercy, and grants him the loftiest stations in Jannat-ul-Firdaus. We kindly invite you to read Surah Al-Fatiha for his noble soul and remember him in your sincere supplications.'}
            </p>

            <div className="flex justify-center md:justify-start gap-3 pt-1">
              <button
                onClick={() => setIsFatihaOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer border border-amber-400"
              >
                <BookOpen size={13} className="fill-white" />
                <span>{language === 'ar' ? 'اقرأ سورة الفاتحة له' : 'Read Surah Al-Fatiha'}</span>
              </button>
              <button
                onClick={() => setActiveSection('dua_deceased')}
                className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 text-amber-700 dark:text-amber-400 font-bold rounded-xl text-xs transition-all border border-amber-300/40 dark:border-amber-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Heart size={13} className="fill-current text-rose-500" />
                <span>{language === 'ar' ? 'عرض أدعية الرحمة' : 'Prayers for the Deceased'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Beautiful Fatiha Interactive Reader (Inline Expandable block) */}
        {isFatihaOpen && (
          <div className="mt-6 border-t border-amber-200/50 dark:border-amber-500/20 pt-6 animate-in slide-in-from-top-4 duration-300">
            <div className="bg-white/95 dark:bg-slate-950 p-5 sm:p-8 rounded-2xl border border-amber-300/30 shadow-inner space-y-6 relative">
              <button 
                onClick={() => {
                  setIsFatihaOpen(false);
                  if (fatihaAudioRef.current) {
                    fatihaAudioRef.current.pause();
                    setIsFatihaPlaying(false);
                  }
                }}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer transition-all"
                title="Close Fatiha"
              >
                <X size={15} />
              </button>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-amber-100 dark:border-amber-900/40 pb-4">
                <div>
                  <h4 className="text-lg font-bold font-serif text-amber-800 dark:text-amber-400 flex items-center gap-2">
                    <span>{language === 'ar' ? 'سورة الفاتحة' : 'Surah Al-Fatiha (The Opening)'}</span>
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-400 border border-amber-200 px-2 py-0.5 rounded-md font-bold uppercase">
                      Surah 1
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {language === 'ar' ? 'أهدي ثواب قراءتها كصدقة جارية لروح المغفور له' : 'Dedicated to the soul of Al-Hajj Ahmed Khalil Faqih'}
                  </p>
                </div>

                <button
                  onClick={handleFatihaAudio}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm select-none cursor-pointer border
                    ${isFatihaPlaying 
                      ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100' 
                      : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'}`}
                >
                  {isFatihaPlaying ? (
                    <>
                      <Pause size={13} />
                      <span>{language === 'ar' ? 'إيقاف التلاوة' : 'Pause Recitation'}</span>
                    </>
                  ) : (
                    <>
                      <Play size={13} className="fill-current" />
                      <span>{language === 'ar' ? 'استمع إلى السورة' : 'Listen to Recitation'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* BEAUTIFUL COMPACT FATIHA AUDIO PLAYER PANEL */}
              <div className="bg-gradient-to-br from-amber-50/40 to-orange-50/20 dark:from-slate-900/40 dark:to-slate-950/20 border border-amber-200/50 dark:border-amber-900/30 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                  {/* Play & Seek Buttons */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => {
                        if (fatihaAudioRef.current) {
                          fatihaAudioRef.current.currentTime = Math.max(0, fatihaAudioRef.current.currentTime - 5);
                        }
                      }}
                      title="Rewind 5s"
                      className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/60 hover:border-amber-300 text-amber-800 dark:text-amber-400 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs select-none"
                    >
                      <RotateCcw size={14} />
                    </button>

                    <button
                      onClick={handleFatihaAudio}
                      className={`w-11 h-11 flex items-center justify-center rounded-full text-white cursor-pointer select-none shadow-md hover:scale-105 active:scale-95 transition-all
                        ${isFatihaPlaying 
                          ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-100 dark:shadow-none' 
                          : 'bg-amber-600 hover:bg-amber-700 shadow-amber-100 dark:shadow-none'
                        }`}
                    >
                      {isFatihaLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : isFatihaPlaying ? (
                        <Pause size={16} fill="currentColor" />
                      ) : (
                        <Play size={16} className="ml-0.5" fill="currentColor" />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        if (fatihaAudioRef.current && fatihaDuration) {
                          fatihaAudioRef.current.currentTime = Math.min(fatihaDuration, fatihaAudioRef.current.currentTime + 5);
                        }
                      }}
                      title="Forward 5s"
                      className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/60 hover:border-amber-300 text-amber-800 dark:text-amber-400 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs select-none"
                    >
                      <RotateCcw size={14} className="scale-x-[-1]" />
                    </button>
                  </div>

                  {/* Progress Slider */}
                  <div className="flex-1 w-full flex items-center gap-3">
                    <span className="text-xs font-semibold text-amber-950 dark:text-amber-400 font-mono w-10 text-right">
                      {formatTime(fatihaCurrentTime)}
                    </span>
                    
                    <input
                      type="range"
                      min={0}
                      max={fatihaDuration || 100}
                      value={fatihaCurrentTime}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (fatihaAudioRef.current) {
                          fatihaAudioRef.current.currentTime = val;
                          setFatihaCurrentTime(val);
                        }
                      }}
                      className="flex-1 h-1.5 bg-amber-100/60 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-amber-650"
                    />

                    <span className="text-xs font-semibold text-amber-950 dark:text-amber-400 font-mono w-10">
                      {formatTime(fatihaDuration)}
                    </span>
                  </div>
                </div>

                {/* Speed & Volume Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-t border-amber-100/50 dark:border-slate-800/60">
                  {/* Volume Slider */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFatihaIsMuted(!fatihaIsMuted)}
                      className="p-1.5 text-amber-800 dark:text-amber-400 hover:text-amber-955 dark:hover:text-white cursor-pointer select-none transition-colors"
                      title={fatihaIsMuted ? "Unmute" : "Mute"}
                    >
                      {fatihaIsMuted || fatihaVolume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={fatihaIsMuted ? 0 : fatihaVolume}
                      onChange={(e) => {
                        setFatihaVolume(parseFloat(e.target.value));
                        setFatihaIsMuted(false);
                      }}
                      className="w-20 sm:w-24 h-1 bg-amber-150 rounded-lg appearance-none cursor-pointer accent-amber-650"
                    />
                  </div>

                  {/* Playback Speed Multipliers */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-amber-850 dark:text-amber-400 uppercase tracking-wider mr-1">Speed:</span>
                    {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setFatihaSpeed(rate)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-all border
                          ${fatihaSpeed === rate 
                            ? 'bg-amber-600 text-white border-amber-650 shadow-xs' 
                            : 'bg-white dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-slate-800 text-amber-900 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/30'}`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quran Text rendering */}
              <div className="space-y-6 max-w-3xl mx-auto py-2">
                {fatihaVerses.map((verse) => (
                  <div 
                    key={verse.number}
                    className="group border-b border-slate-100 dark:border-slate-800/60 pb-5 last:border-0 flex flex-col items-stretch text-center"
                  >
                    <div className="flex justify-center items-center gap-2 mb-3">
                      <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300/30 text-[10px] font-bold flex items-center justify-center">
                        {verse.number}
                      </span>
                    </div>
                    
                    {/* Arabic Calligraphy Style */}
                    <p className="font-arabic text-slate-900 dark:text-white text-3xl sm:text-4xl text-center leading-[1.8] font-medium tracking-normal" dir="rtl">
                      {verse.arabic}
                    </p>

                    {/* Translation */}
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-3 italic font-serif">
                      "{verse.transliteration}"
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed">
                      {verse.english}
                    </p>
                  </div>
                ))}
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-amber-600 dark:text-amber-400 font-serif italic">
                  {language === 'ar' ? 'تقبل الله منا ومنكم صالح الأعمال والدعوات' : 'May Allah accept this as a source of light and mercy for him.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Daily Quranic Habit Tracker Section */}
      <div className="bg-white/95 dark:bg-slate-900/40 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-secondary-200 dark:border-slate-800/80 shadow-md space-y-6 text-left relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-5">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 text-[10px] font-extrabold tracking-wider uppercase border border-primary-200/40">
              <Sparkles size={11} className="text-secondary-500 animate-pulse" />
              <span>{language === 'ar' ? 'العادات اليومية' : 'Daily Devotion'}</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-850 dark:text-slate-100">
              {lHabit.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lHabit.subtitle}
            </p>
          </div>

          {/* Reset / Streak Block */}
          <div className="flex items-center gap-3 self-start sm:self-center">
            {habitStreak > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30 rounded-xl shadow-2xs">
                <Flame size={16} className="text-amber-500 animate-bounce fill-current" />
                <div className="text-xs font-bold leading-none">
                  <span>{lHabit.streak}: {habitStreak} {lHabit.streakDays}</span>
                </div>
              </div>
            )}
            <button
              onClick={resetHabits}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer select-none"
            >
              <RotateCcw size={12} />
              <span>{lHabit.reset}</span>
            </button>
          </div>
        </div>

        {/* Progress Visualization Ring / Bar Row */}
        <div className="bg-slate-50/50 dark:bg-slate-950/35 p-5 rounded-2xl border border-slate-100 dark:border-slate-900/60 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 w-full space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {lHabit.progress}
              </span>
              <span className="text-sm font-extrabold font-mono text-primary-700 dark:text-primary-400">
                {progressPercent}%
              </span>
            </div>

            {/* Track Bar */}
            <div className="w-full h-3 bg-slate-200/80 dark:bg-slate-850 rounded-full overflow-hidden border border-slate-300/20 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-primary-600 to-emerald-500 transition-all duration-500 ease-out rounded-full" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Motivational message */}
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 italic">
              {progressPercent === 100 ? lHabit.completed : lHabit.keepGoing}
            </p>
          </div>

          {/* Radial progress ring for added professional craft */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth="5"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                className="stroke-primary-600 dark:stroke-primary-400 transition-all duration-500 ease-out"
                strokeWidth="5"
                fill="transparent"
                strokeDasharray={175.9}
                strokeDashoffset={175.9 - (175.9 * progressPercent) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-xs font-bold font-mono text-slate-800 dark:text-slate-100">
              {completedCount}/3
            </span>
          </div>
        </div>

        {/* 3 Habit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Habit 1: Read Juz */}
          <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4
            ${habits.readJuz 
              ? 'bg-primary-500/5 border-primary-500/20 shadow-xs' 
              : 'bg-white dark:bg-slate-900/20 border-slate-200/60 dark:border-slate-850'}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {/* Custom Checkbox Toggle Button */}
                <button
                  onClick={() => toggleHabit('readJuz')}
                  className="mt-0.5 shrink-0 focus:outline-none focus:ring-2 focus:ring-primary-500/30 rounded-lg cursor-pointer animate-in fade-in zoom-in-50 duration-200"
                  title="Check off goal"
                >
                  {habits.readJuz ? (
                    <CheckCircle2 size={20} className="text-primary-600 fill-primary-100 dark:fill-primary-950/80" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-700 hover:border-primary-500 transition-colors" />
                  )}
                </button>
                <div className="space-y-0.5">
                  <h4 className={`text-sm font-bold transition-colors
                    ${habits.readJuz ? 'text-primary-800 dark:text-primary-300 line-through opacity-85' : 'text-slate-850 dark:text-slate-100'}`}
                  >
                    {lHabit.juzTitle}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    {lHabit.juzDesc}
                  </p>
                </div>
              </div>
              <div className={`p-2 rounded-xl shrink-0
                ${habits.readJuz ? 'bg-primary-100 dark:bg-primary-950 text-primary-600' : 'bg-slate-100 dark:bg-slate-850 text-slate-400'}`}
              >
                <BookOpen size={15} />
              </div>
            </div>

            <button
              onClick={() => setActiveSection('quran')}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1 cursor-pointer select-none"
            >
              <span>{lHabit.juzAction}</span>
              <ArrowRight size={11} />
            </button>
          </div>

          {/* Habit 2: Morning Azkar */}
          <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4
            ${habits.morningAzkar 
              ? 'bg-primary-500/5 border-primary-500/20 shadow-xs' 
              : 'bg-white dark:bg-slate-900/20 border-slate-200/60 dark:border-slate-850'}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleHabit('morningAzkar')}
                  className="mt-0.5 shrink-0 focus:outline-none focus:ring-2 focus:ring-primary-500/30 rounded-lg cursor-pointer animate-in fade-in zoom-in-50 duration-200"
                  title="Check off goal"
                >
                  {habits.morningAzkar ? (
                    <CheckCircle2 size={20} className="text-primary-600 fill-primary-100 dark:fill-primary-950/80" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-700 hover:border-primary-500 transition-colors" />
                  )}
                </button>
                <div className="space-y-0.5">
                  <h4 className={`text-sm font-bold transition-colors
                    ${habits.morningAzkar ? 'text-primary-800 dark:text-primary-300 line-through opacity-85' : 'text-slate-850 dark:text-slate-100'}`}
                  >
                    {lHabit.morningTitle}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    {lHabit.morningDesc}
                  </p>
                </div>
              </div>
              <div className={`p-2 rounded-xl shrink-0
                ${habits.morningAzkar ? 'bg-amber-100 dark:bg-amber-950 text-amber-600' : 'bg-slate-100 dark:bg-slate-850 text-slate-400'}`}
              >
                <Sun size={15} />
              </div>
            </div>

            <button
              onClick={() => setActiveSection('azkar')}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1 cursor-pointer select-none"
            >
              <span>{lHabit.morningAction}</span>
              <ArrowRight size={11} />
            </button>
          </div>

          {/* Habit 3: Evening Azkar */}
          <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4
            ${habits.eveningAzkar 
              ? 'bg-primary-500/5 border-primary-500/20 shadow-xs' 
              : 'bg-white dark:bg-slate-900/20 border-slate-200/60 dark:border-slate-850'}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleHabit('eveningAzkar')}
                  className="mt-0.5 shrink-0 focus:outline-none focus:ring-2 focus:ring-primary-500/30 rounded-lg cursor-pointer animate-in fade-in zoom-in-50 duration-200"
                  title="Check off goal"
                >
                  {habits.eveningAzkar ? (
                    <CheckCircle2 size={20} className="text-primary-600 fill-primary-100 dark:fill-primary-950/80" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-700 hover:border-primary-500 transition-colors" />
                  )}
                </button>
                <div className="space-y-0.5">
                  <h4 className={`text-sm font-bold transition-colors
                    ${habits.eveningAzkar ? 'text-primary-800 dark:text-primary-300 line-through opacity-85' : 'text-slate-850 dark:text-slate-100'}`}
                  >
                    {lHabit.eveningTitle}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    {lHabit.eveningDesc}
                  </p>
                </div>
              </div>
              <div className={`p-2 rounded-xl shrink-0
                ${habits.eveningAzkar ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600' : 'bg-slate-100 dark:bg-slate-850 text-slate-400'}`}
              >
                <Moon size={15} />
              </div>
            </div>

            <button
              onClick={() => setActiveSection('azkar')}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1 cursor-pointer select-none"
            >
              <span>{lHabit.eveningAction}</span>
              <ArrowRight size={11} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Core Grid: Prayer Times (Left) + Virtues/Informative Content (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Local Prayer Times Module (Takes 7 spans on large screens) */}
        <div className="lg:col-span-7 space-y-4">
          <FridayPrayerTimes />
        </div>

        {/* Right Column: Informative Friday Wisdom & Quick Action Bento (Takes 5 spans) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Daily Hadeeth Section */}
          <DailyHadeeth />
          
          {/* A. Jumu'ah Wisdom / Informative Content */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-secondary-200 p-6 space-y-4 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm uppercase tracking-wider">
              <Sparkles size={14} className="fill-current animate-bounce" />
              <span>{language === 'ar' ? 'بركات وفضائل يوم الجمعة' : 'Blessings of Jumu\'ah'}</span>
            </div>
            <h4 className="text-lg font-bold font-serif text-slate-800 dark:text-white">
              {language === 'ar' ? 'سنن وآداب يوم الجمعة المبارك' : 'Sunnahs of the Blessed Friday'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {language === 'ar'
                ? 'يوم الجمعة هو خير يوم طلعت عليه الشمس، وله طقوس روحانية حث عليها نبينا الكريم ﷺ لينال المسلم الأجر العظيم.'
                : 'Friday is the master of all days and holds a unique place in Islam. The Prophet ﷺ encouraged several deeds to maximize spiritual benefits:'}
            </p>

            <ul className="space-y-3 pt-1">
              {[
                {
                  title: language === 'ar' ? 'قراءة سورة الكهف' : 'Reciting Surah Al-Kahf',
                  desc: language === 'ar' ? 'تضيء للمؤمن نوراً بين الجمعتين وتحميه من الفتن.' : 'Acts as a spiritual light shining for you from one Friday to the next.'
                },
                {
                  title: language === 'ar' ? 'كثرة الصلاة على النبي' : 'Increasing Salawat',
                  desc: language === 'ar' ? 'تُعرض صلاتكم على النبي ﷺ وتزيد من منزلتكم وشفاعته.' : 'Supplications and blessings are presented directly to the Prophet ﷺ.'
                },
                {
                  title: language === 'ar' ? 'تحري ساعة الاستجابة' : 'The Hour of Response',
                  desc: language === 'ar' ? 'ساعة مباركة لا يسأل فيها مسلم الله شيئاً إلا أعطاه إياه، غالباً بعد العصر.' : 'A critical window on Friday where supplications are answered (typically the last hour of Asr).'
                },
                {
                  title: language === 'ar' ? 'الغسل والتطيب والتبكير' : 'Purification & Early Attendance',
                  desc: language === 'ar' ? 'من سنن حضور صلاة الجمعة الاستحمام، التطيب، والتبكير للمسجد.' : 'Taking a bath, wearing your best clothes, applying perfume, and arriving early to the masjid.'
                }
              ].map((item, idx) => (
                <li key={idx} className="flex gap-2.5 items-start text-xs text-slate-650 dark:text-slate-350 leading-relaxed">
                  <span className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px]">
                    {idx + 1}
                  </span>
                  <div>
                    <strong className="text-slate-800 dark:text-white block font-semibold">{item.title}</strong>
                    <span className="text-slate-500 dark:text-slate-400">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* B. Informative Platform Stats & Quick Progress */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-secondary-200 p-6 space-y-4 text-left">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              {language === 'ar' ? 'مؤشرات القراءة والتقدم' : 'My Spiritual Progress'}
            </h4>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 text-center flex flex-col justify-center h-20">
                <span className="text-[9px] font-bold text-slate-400 uppercase block leading-tight">{language === 'ar' ? 'آخر جزء' : 'Last Juz'}</span>
                <span className="text-lg font-bold text-slate-800 dark:text-white block mt-1">
                  {lastReadJuz !== null ? `${lastReadJuz}` : '—'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 text-center flex flex-col justify-center h-20">
                <span className="text-[9px] font-bold text-slate-400 uppercase block leading-tight">{language === 'ar' ? 'الإشارات' : 'Bookmarks'}</span>
                <span className="text-lg font-bold text-slate-800 dark:text-white block mt-1">
                  {bookmarkCount}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 text-center flex flex-col justify-center h-20">
                <span className="text-[9px] font-bold text-slate-400 uppercase block leading-tight">{language === 'ar' ? 'ختمات' : 'Khatams'}</span>
                <span className="text-lg font-bold text-slate-800 dark:text-white block mt-1">
                  {khatamCount}
                </span>
              </div>
            </div>

            {lastReadJuz !== null && (
              <button
                onClick={() => setActiveSection('quran')}
                className="w-full py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>{language === 'ar' ? 'تابع القراءة من جزء ' : 'Continue Reading Juz '}{lastReadJuz}</span>
                <ArrowRight size={12} />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Featured Google Maps Platform: Sacred Sanctuaries & Qibla Trajectory */}
      <GoogleMapExplorer onOpenFullQibla={() => setActiveSection('qibla')} />

      {/* 4. Bento Grid: Quick Navigation Hub */}
      <div className="space-y-4 text-left">
        <h3 className="text-xl font-bold font-serif text-slate-850 dark:text-slate-100">
          {language === 'ar' ? 'استكشف أقسام النظام' : 'Explore System Sections'}
        </h3>
        <p className="text-xs text-slate-500 max-w-2xl">
          {language === 'ar' 
            ? 'تنقل بسهولة بين كافة الميزات المتقدمة المصممة لتسهيل العبادة والقراءة والاستماع.' 
            : 'Access the custom tools built for your Quranic research, daily dhikr routines, and Islamic learning.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          
          {/* Card 1: 30 Juz Quran */}
          <button
            onClick={() => setActiveSection('quran')}
            className="p-5 bg-white/95 hover:bg-slate-50 dark:bg-slate-900/40 dark:hover:bg-slate-800/60 text-left rounded-2xl border border-secondary-200 hover:border-primary-300 transition-all flex flex-col justify-between h-44 shadow-xs group cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="p-2.5 bg-primary-100 text-primary-700 rounded-xl group-hover:scale-110 transition-transform">
                <Book className="w-5 h-5 text-primary-600" />
              </div>
              <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">{t('nav.quran')}</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">{t('side.quranDesc')}</p>
            </div>
          </button>

          {/* Card: Quran Study & Tafsir Modules */}
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('open-quran-study-modal', { detail: { moduleId: 'mod-fatiha' } }));
            }}
            className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 dark:from-emerald-950/40 dark:to-teal-950/40 text-left rounded-2xl border border-emerald-300/60 dark:border-emerald-800/60 hover:border-emerald-400 transition-all flex flex-col justify-between h-44 shadow-xs group cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl group-hover:scale-110 transition-transform shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <ChevronRight size={14} className="text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                {language === 'ar' ? 'وحدة متقدمة' : 'Interactive Study'}
              </span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">
                {language === 'ar' ? 'وحدات دراسة القرآن والتفسير' : 'Quran Study & Tafsir Modules'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {language === 'ar' ? 'تحليل موضوعي ولغوي لسور القرآن العظيمة (الفاتحة، الكهف، يس، الملك)' : 'Thematic pillars, verse segment breakdowns, and root vocabulary for core Surahs.'}
              </p>
            </div>
          </button>

          {/* Card 2: Classic Scanned Mushaf */}
          <button
            onClick={() => {
              if (onClassicMushafClick) onClassicMushafClick();
            }}
            className="p-5 bg-white/95 hover:bg-slate-50 dark:bg-slate-900/40 dark:hover:bg-slate-800/60 text-left rounded-2xl border border-secondary-200 hover:border-primary-300 transition-all flex flex-col justify-between h-44 shadow-xs group cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5 text-emerald-600" />
              </div>
              <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                {language === 'ar' ? 'المصحف المصور الكلاسيكي' : 'Classic Scanned Mushaf'}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                {language === 'ar' ? 'تصفح صفحات المصحف المصورة الكلاسيكية الجميلة.' : 'Browse high-quality scanned pages of the printed Madinah Mushaf.'}
              </p>
            </div>
          </button>

          {/* Card 3: Surah Al-Kahf */}
          <button
            onClick={() => setActiveSection('alkahf')}
            className="p-5 bg-white/95 hover:bg-slate-50 dark:bg-slate-900/40 dark:hover:bg-slate-800/60 text-left rounded-2xl border border-secondary-200 hover:border-primary-300 transition-all flex flex-col justify-between h-44 shadow-xs group cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5 text-amber-600" />
              </div>
              <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">{t('nav.alkahf')}</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">{t('side.alkahfDesc')}</p>
            </div>
          </button>

          {/* Card 4: Daily Azkar */}
          <button
            onClick={() => setActiveSection('azkar')}
            className="p-5 bg-white/95 hover:bg-slate-50 dark:bg-slate-900/40 dark:hover:bg-slate-800/60 text-left rounded-2xl border border-secondary-200 hover:border-primary-300 transition-all flex flex-col justify-between h-44 shadow-xs group cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="p-2.5 bg-rose-100 text-rose-700 rounded-xl group-hover:scale-110 transition-transform">
                <Sun className="w-5 h-5 text-rose-600" />
              </div>
              <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">{t('nav.azkar')}</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">{t('side.azkarDesc')}</p>
            </div>
          </button>

          {/* Card 5: Friday Dua */}
          <button
            onClick={() => setActiveSection('dua')}
            className="p-5 bg-white/95 hover:bg-slate-50 dark:bg-slate-900/40 dark:hover:bg-slate-800/60 text-left rounded-2xl border border-secondary-200 hover:border-primary-300 transition-all flex flex-col justify-between h-44 shadow-xs group cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="p-2.5 bg-sky-100 text-sky-700 rounded-xl group-hover:scale-110 transition-transform">
                <Heart className="w-5 h-5 text-sky-600" />
              </div>
              <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">{t('nav.dua')}</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">{t('side.duaDesc')}</p>
            </div>
          </button>

          {/* Card 5b: Stress & Family Overwhelm Duas */}
          <button
            onClick={() => {
              setActiveSection('dua');
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('open-dua-tab', { detail: { tab: 'stress' } }));
              }, 50);
            }}
            className="p-5 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-emerald-500/5 hover:from-emerald-500/20 hover:via-teal-500/20 text-left rounded-2xl border border-emerald-300/60 dark:border-emerald-800/60 hover:border-emerald-400 transition-all flex flex-col justify-between h-44 shadow-xs group cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl group-hover:scale-110 transition-transform shadow-xs">
                <Shield className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[9px] font-extrabold text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
                {language === 'ar' ? 'حصن نبوي' : 'Prophetic Shield'}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                {language === 'ar' ? 'تفريج الهم والضيق الأسري' : (language === 'am' ? 'የጭንቀትና የቤተሰብ ሸክም ማቃለያ' : 'Stress & Overwhelm Duas')}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {language === 'ar'
                  ? 'الاستعاذة النبوية العظمى من الهم والحزن والعجز والكسل والديون وغلبة الناس.'
                  : 'The Prophet’s ﷺ refuge from worry, grief, laziness, debt, and feeling overpowered.'}
              </p>
            </div>
          </button>

          {/* Card 5c: Tahajjud & Night Prayer Master Guide */}
          <button
            onClick={() => {
              setActiveSection('dua');
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('open-dua-tab', { detail: { tab: 'tahajjud' } }));
              }, 50);
            }}
            className="p-5 bg-gradient-to-br from-indigo-500/10 via-primary-500/10 to-indigo-500/5 hover:from-indigo-500/20 hover:via-primary-500/20 text-left rounded-2xl border border-indigo-300/60 dark:border-indigo-800/60 hover:border-indigo-400 transition-all flex flex-col justify-between h-44 shadow-xs group cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="p-2.5 bg-indigo-600 text-white rounded-xl group-hover:scale-110 transition-transform shadow-xs">
                <Moon className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-[9px] font-extrabold text-indigo-800 dark:text-indigo-300 border border-indigo-300/40">
                {language === 'ar' ? 'قيام الليل' : 'Night Vigil'}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                {language === 'ar' ? 'كيفية صلاة قيام الليل والتهجد' : (language === 'am' ? 'ተሃጁድና የሌሊት ሶላት መመሪያ' : 'Tahajjud & Night Prayer')}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {language === 'ar'
                  ? 'دليل عملي خطوة بخطوة، ركعات الوتر، وحاسبة ثلث الليل الأخير الفلكية.'
                  : 'Step-by-step how to pray, rak\'ah guide, Witr, and Last Third of the Night calculator.'}
              </p>
            </div>
          </button>

          {/* Card 6: Google Maps Qibla Finder */}
          <button
            onClick={() => setActiveSection('qibla')}
            className="p-5 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-primary-500/10 hover:from-emerald-500/20 hover:via-teal-500/20 dark:from-emerald-950/40 dark:to-teal-950/40 text-left rounded-2xl border border-emerald-300/60 dark:border-emerald-800/60 hover:border-emerald-400 transition-all flex flex-col justify-between h-44 shadow-xs group cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl group-hover:scale-110 transition-transform shadow-sm">
                <Compass className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-[9px] font-bold text-emerald-800 dark:text-emerald-300">
                  Google Maps
                </span>
                <ChevronRight size={14} className="text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                {language === 'ar' ? 'خرائط جوجل التفاعلية' : 'Google Maps Platform'}
              </span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">
                {language === 'ar' ? 'خريطة القبلة والبوصلة' : 'Google Maps Qibla & Compass'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {language === 'ar' 
                  ? 'خريطة تفاعلية ومسار القبلة الكروي الجيوديسي المباشر إلى مكة المكرمة.' 
                  : 'Interactive Google Maps with Geodesic Great Circle flight line to Mecca.'}
              </p>
            </div>
          </button>

          {/* Card 7: Dua for Khatmul Quran */}
          <button
            onClick={() => setActiveSection('khatam')}
            className="p-5 bg-gradient-to-br from-primary-500/10 via-amber-500/10 to-primary-500/5 hover:from-primary-500/20 hover:via-amber-500/20 text-left rounded-2xl border border-primary-300/60 dark:border-primary-800/60 hover:border-primary-400 transition-all flex flex-col justify-between h-44 shadow-xs group cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="p-2.5 bg-primary-600 text-white rounded-xl group-hover:scale-110 transition-transform shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <ChevronRight size={14} className="text-primary-600 dark:text-primary-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700 dark:text-primary-300 block">
                دعاء ختم القرآن
              </span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">{t('dua.khatamTitle')}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">{t('side.khatamDesc')}</p>
            </div>
          </button>

          {/* Card 8: The Secret Time of Fajr Salah & Sahar */}
          <button
            onClick={() => {
              localStorage.setItem('selectedPoemId', 'fajr-secrets');
              localStorage.setItem('poetryActiveTab', 'video');
              setActiveSection('poetry');
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('open-poetry-work', { detail: { poemId: 'fajr-secrets', tab: 'video', startTime: 0 } }));
              }, 50);
            }}
            className="p-5 bg-gradient-to-br from-amber-500/10 via-primary-500/10 to-indigo-500/10 hover:from-amber-500/20 hover:via-primary-500/20 text-left rounded-2xl border border-amber-300/60 dark:border-amber-800/60 hover:border-amber-400 transition-all flex flex-col justify-between h-44 shadow-xs group cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="p-2.5 bg-amber-600 text-white rounded-xl group-hover:scale-110 transition-transform shadow-sm">
                <Sun className="w-5 h-5" />
              </div>
              <ChevronRight size={14} className="text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                {language === 'ar' ? 'وثائقي ودليل روحي • ١٤ فصلاً' : '14-Chapter Documentary'}
              </span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">
                {language === 'ar' ? 'أسرار وقت صلاة الفجر والسحر' : 'Secrets of Fajr Salah & Sahar'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {language === 'ar'
                  ? 'التهجد، قرآن الفجر المشهود، بركة البكور، وعقد الشيطان الثلاث.'
                  : 'Tahajjud, angelic dawn gathering, Rizq & Barakah, and 7 post-Fajr Sunnahs.'}
              </p>
            </div>
          </button>

          {/* Card 9: 1-Year Quran Mastery • 20 Min / Day */}
          <button
            onClick={() => setActiveSection('quran_year_plan')}
            className="p-5 bg-gradient-to-br from-teal-500/15 via-emerald-500/10 to-primary-600/15 hover:from-teal-500/25 hover:via-emerald-500/20 text-left rounded-2xl border border-teal-300/70 dark:border-teal-800/70 hover:border-teal-400 transition-all flex flex-col justify-between h-44 shadow-xs group cursor-pointer sm:col-span-2 md:col-span-1"
          >
            <div className="flex items-center justify-between w-full">
              <div className="p-2.5 bg-teal-600 text-white rounded-xl group-hover:scale-110 transition-transform shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <ChevronRight size={14} className="text-teal-600 dark:text-teal-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 block">
                {language === 'ar' ? 'منهج سنوي • ٥٢ أسبوعاً' : '1-Year Curriculum • 52 Weeks'}
              </span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">
                {language === 'ar' ? 'ختم وتدبر القرآن (٢٠ دقيقة يومياً)' : 'Quran Learning (20 Min/Day)'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {language === 'ar'
                  ? 'نظام ٥-١٠-٥ اليومي: تلاوة، مفردات وتفسير، وتدبر وعمل ودعاء.'
                  : 'Daily 5-10-5 formula: Recite with Tajweed, Understand vocabulary & Tafsir, Reflect & Dua.'}
              </p>
            </div>
          </button>

          {/* Card 10: Connected AI Studio Applet */}
          <button
            onClick={() => setActiveSection('connected_applet')}
            className="p-5 bg-gradient-to-br from-indigo-500/15 via-primary-500/10 to-purple-500/15 hover:from-indigo-500/25 hover:via-primary-500/20 text-left rounded-2xl border border-indigo-300/70 dark:border-indigo-800/70 hover:border-indigo-400 transition-all flex flex-col justify-between h-44 shadow-xs group cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="p-2.5 bg-indigo-600 text-white rounded-xl group-hover:scale-110 transition-transform shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1">
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-[9px] font-bold text-indigo-700 dark:text-indigo-300">
                  AI Studio
                </span>
                <ChevronRight size={14} className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block">
                {language === 'ar' ? 'بوابة خارجية مدمجة' : 'Integrated Portal'}
              </span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">
                {language === 'ar' ? 'تطبيق AI Studio المدمج' : 'Connected AI Studio Applet'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {language === 'ar'
                  ? 'الوصول المباشر إلى تطبيق 34a7e4b1 المدمج بكامل شاشته وميزاته التفاعلية.'
                  : 'Live direct access to connected applet 34a7e4b1 in full embedded view.'}
              </p>
            </div>
          </button>

          {/* Card 11: Salat Recitations in Every Position */}
          <button
            onClick={() => setActiveSection('salat_recitations')}
            className="p-5 bg-gradient-to-br from-emerald-500/15 via-primary-500/10 to-teal-500/15 hover:from-emerald-500/25 hover:via-primary-500/20 text-left rounded-2xl border border-emerald-300/70 dark:border-emerald-800/70 hover:border-emerald-400 transition-all flex flex-col justify-between h-44 shadow-xs group cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl group-hover:scale-110 transition-transform shadow-sm">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[9px] font-bold text-emerald-800 dark:text-emerald-300">
                  {language === 'ar' ? 'فقه الصلاة' : 'Prophetic Sunnah'}
                </span>
                <ChevronRight size={14} className="text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block">
                {language === 'ar' ? '١١ موضعاً • أركان وسنن' : '11 Positions • Audio & Translation'}
              </span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">
                {language === 'ar' ? 'أذكار وأدعية الصلاة في كل موضع' : 'What to Recite During Salat'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {language === 'ar'
                  ? 'من تكبيرة الإحرام والركوع والسجود إلى التشهد والتسليم مع التكرار والترجمة.'
                  : 'Complete authentic Arabic adhkar, transliteration, English, and Amharic translation for every prayer movement.'}
              </p>
            </div>
          </button>

        </div>
      </div>

    </div>
  );
};

export default LandingDashboard;
