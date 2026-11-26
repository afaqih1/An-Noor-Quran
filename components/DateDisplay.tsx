import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles } from 'lucide-react';
import { useLanguage, Language } from './LanguageContext';
import { toEthiopian } from 'ethiopian-date';

const weekdays: Record<Language, string[]> = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
  am: ["እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "አርብ", "ቅዳሜ"],
  har: ["እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "አርብ", "ቅዳሜ"]
};

const gregMonthNames: Record<Language, string[]> = {
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ],
  ar: [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ],
  am: [
    "ጃንዋሪ", "ፌብሩዋሪ", "ማርች", "ኤፕሪል", "ሜይ", "ጁን",
    "ጁላይ", "ኦገስት", "ሴፕቴምበር", "ኦክቶበር", "ኖቬምበር", "ዲሴምበር"
  ],
  har: [
    "ጃንዋሪ", "ፌብሩዋሪ", "ማርች", "ኤፕሪል", "ሜይ", "ጁን",
    "ጁላይ", "ኦገስት", "ሴፕቴምበር", "ኦክቶበር", "ኖቬምበር", "ዲሴምበር"
  ]
};

const hijriMonths: Record<Language, string[]> = {
  en: [
    "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
    "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
    "Ramadan", "Shawwal", "Dhu al-Qa'dah", "Dhu al-Hijjah"
  ],
  ar: [
    "محرم", "صفر", "ربيع الأول", "ربيع الآخر",
    "جمادى الأولى", "جمادى الآخرة", "رجب", "شعبان",
    "رمضان", "شوال", "ذو القعدة", "ذو الحجة"
  ],
  am: [
    "ሙሀረም", "ሶፈር", "ረቢዕ አል-አወል", "ረቢዕ አ-ሣኒ",
    "ጁማደል አወል", "ጁማደል አኺር", "ረጀብ", "ሻዕባን",
    "ረመዳን", "ሸዋል", "ዙልቂዕዳህ", "ዙልሂጃህ"
  ],
  har: [
    "ሙሀረም", "ሶፈር", "ረቢዕ አል-አወል", "ረቢዕ አ-ሣኒ",
    "ጁማደል አወል", "ጁማደል አኺር", "ረጀብ", "ሻዕባን",
    "ረመዳን", "ሸዋል", "ዙልቂዕዳህ", "ዙልሂጃህ"
  ]
};

const suffixAH: Record<Language, string> = {
  en: "AH",
  ar: "هـ",
  am: "ሂ.አ",
  har: "ሂ.አ"
};

const labelHijri: Record<Language, string> = {
  en: "Hijri Calendar",
  ar: "التقويم الهجري",
  am: "የሂጅሪ አቆጣጠር",
  har: "የሂጅሪ አቆጣጠር"
};

const labelGregorian: Record<Language, string> = {
  en: "Gregorian",
  ar: "الميلادي",
  am: "የጎርጎርዮስ አቆጣጠር",
  har: "የጎርጎርዮስ አቆጣጠር"
};

const suffixEC: Record<Language, string> = {
  en: "E.C.",
  ar: "ب.إ",
  am: "ዓ.ም.",
  har: "ዓ.ም."
};

const labelEthiopian: Record<Language, string> = {
  en: "Ethiopian Calendar",
  ar: "التقويم الإثيوبي",
  am: "የኢትዮጵያ አቆጣጠር",
  har: "የኢትዮጵያ አቆጣጠር"
};

const ethiopianMonths: Record<Language, string[]> = {
  en: [
    "Meskerem", "Tikimt", "Hidar", "Tahsas", "Tir", "Yakatit",
    "Megabit", "Miazia", "Ginbot", "Sene", "Hamle", "Nehase", "Pagume"
  ],
  ar: [
    "مسكيرم", "تكيمت", "هدار", "تاهساس", "تير", "ياكاتيت",
    "ميغابيت", "ميازيا", "غينبوت", "سيني", "هملي", "نيهاسي", "باغومي"
  ],
  am: [
    "መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ", "ጥር", "የካቲት",
    "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"
  ],
  har: [
    "መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ", "ጥር", "የካቲት",
    "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"
  ]
};

const labelTime: Record<Language, string> = {
  en: "Local Time",
  ar: "الوقت المحلي",
  am: "አካባቢያዊ ሰዓት",
  har: "አካባቢያዊ ሰዓት"
};

const nextSalatLabel: Record<Language, string> = {
  en: "Next Salat",
  ar: "الصلاة القادمة",
  am: "የሚቀጥለው ሰላት",
  har: "የሚቀጥለው ሰላት"
};

const tomorrowSuffix: Record<Language, string> = {
  en: " (Tomorrow)",
  ar: " (غداً)",
  am: " (ነገ)",
  har: " (ነገ)"
};

interface NextSalatInfo {
  name: string;
  time: string;
  isTomorrow?: boolean;
}

const getNextSalat = (timings: Record<string, string>, current: Date): NextSalatInfo | null => {
  const prayerKeys = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  
  const todayPrayers = prayerKeys.map(key => {
    const timeStr = timings[key];
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(':').map(Number);
    const prayerDate = new Date(current);
    prayerDate.setHours(hours, minutes, 0, 0);
    return { name: key, timeStr, date: prayerDate };
  }).filter((p): p is { name: string; timeStr: string; date: Date } => p !== null);

  if (todayPrayers.length === 0) return null;

  // Find the first prayer today that is in the future
  const upcoming = todayPrayers.find(p => p.date.getTime() > current.getTime());
  if (upcoming) {
    return { name: upcoming.name, time: upcoming.timeStr };
  }

  // If no upcoming prayer today, the next one is Fajr tomorrow
  const fajrTime = timings['Fajr'];
  if (fajrTime) {
    return { name: 'Fajr', time: fajrTime, isTomorrow: true };
  }

  return null;
};

const formatSalatTime12h = (timeStr: string, lang: Language) => {
  const [hoursStr, minutesStr] = timeStr.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  if (isNaN(hours) || isNaN(minutes)) return timeStr;
  
  const ampm = lang === 'ar' 
    ? (hours >= 12 ? 'م' : 'ص') 
    : (lang === 'am' || lang === 'har' 
        ? (hours >= 12 ? 'ከሰዓት' : 'ጠዋት') 
        : (hours >= 12 ? 'PM' : 'AM'));
        
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
  return `${displayHours}:${displayMinutes} ${ampm}`;
};

const getLocalizedPrayerName = (prayerKey: string, lang: Language) => {
  const names: Record<string, Record<string, string>> = {
    en: { Fajr: 'Fajr', Dhuhr: 'Dhuhr', Asr: 'Asr', Maghrib: 'Maghrib', Isha: 'Isha' },
    ar: { Fajr: 'الفجر', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' },
    am: { Fajr: 'ፈጅር', Dhuhr: 'ዙህር', Asr: 'ዐስር', Maghrib: 'መግሪብ', Isha: 'ዒሻእ' },
    har: { Fajr: 'ሱብሒ', Dhuhr: 'ዙህር', Asr: 'ዐስር', Maghrib: 'መግሪብ', Isha: 'ዒሻእ' }
  };
  return names[lang]?.[prayerKey] || prayerKey;
};

interface HijriParts {
  day: number;
  monthIndex: number; // 0-based
  year: number;
}

export const DateDisplay: React.FC<{ variant?: 'sidebar' | 'header' }> = ({ variant = 'sidebar' }) => {
  const { language } = useLanguage();
  const [time, setTime] = useState<Date>(new Date());
  const [hijriDate, setHijriDate] = useState<HijriParts | null>(null);
  const [timings, setTimings] = useState<Record<string, string> | null>(null);

  // Load prayer timings on mount and on update
  useEffect(() => {
    const loadTimings = () => {
      try {
        const stored = localStorage.getItem('friday-prayer-timings');
        if (stored) {
          setTimings(JSON.parse(stored));
        } else {
          setTimings(null);
        }
      } catch {
        setTimings(null);
      }
    };

    loadTimings();

    window.addEventListener('prayer-times-updated', loadTimings);
    return () => window.removeEventListener('prayer-times-updated', loadTimings);
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute Hijri Date on mount or whenever time changes (daily/hourly updates)
  useEffect(() => {
    try {
      // Use Intl.DateTimeFormat with ca-islamic-umalqura calendar
      const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      });
      const parts = formatter.formatToParts(time);
      
      let day = time.getDate();
      let monthIndex = 0;
      let year = time.getFullYear();

      parts.forEach(part => {
        if (part.type === 'day') {
          day = parseInt(part.value, 10);
        } else if (part.type === 'month') {
          // Intl calendar months are 1-indexed (1 = Muharram, 12 = Dhu al-Hijjah)
          monthIndex = parseInt(part.value, 10) - 1;
        } else if (part.type === 'year') {
          year = parseInt(part.value, 10);
        }
      });

      // Clamp monthIndex to safe bounds
      if (monthIndex < 0 || monthIndex > 11) {
        monthIndex = 0;
      }

      setHijriDate({ day, monthIndex, year });
    } catch (e) {
      console.warn("Failed to extract Hijri date from Intl. Using standard offline approximation:", e);
      // Absolute simple offline fallback (approximation from Gregorian reference)
      // Reference date: July 19, 2023 CE = 1 Muharram 1445 AH
      const diffMs = time.getTime() - new Date(2023, 6, 19).getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hijriTotalDays = diffDays + 1445 * 354.367;
      const computedYear = Math.floor(hijriTotalDays / 354.367);
      const yearRem = hijriTotalDays % 354.367;
      const computedMonth = Math.floor(yearRem / 29.5) % 12;
      const computedDay = Math.floor(yearRem % 29.5) + 1;
      setHijriDate({
        day: isNaN(computedDay) ? 1 : computedDay,
        monthIndex: isNaN(computedMonth) ? 0 : computedMonth,
        year: isNaN(computedYear) ? 1448 : computedYear
      });
    }
  }, [time]);

  // Helper to get formatted local numbers for Arabic locale
  const formatNumber = (num: number, lang: Language): string => {
    if (lang === 'ar') {
      const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      return num.toString().split('').map(digit => {
        const d = parseInt(digit, 10);
        return isNaN(d) ? digit : arabicDigits[d];
      }).join('');
    }
    return num.toString();
  };

  // Format Gregorian date string
  const getGregorianString = (): string => {
    const dayName = weekdays[language][time.getDay()];
    const monthName = gregMonthNames[language][time.getMonth()];
    const dayNum = formatNumber(time.getDate(), language);
    const yr = formatNumber(time.getFullYear(), language);
    
    if (language === 'ar') {
      return `${dayName}، ${dayNum} ${monthName} ${yr}`;
    }
    return `${dayName}, ${monthName} ${dayNum}, ${yr}`;
  };

  // Format Hijri date string
  const getHijriString = (): string => {
    if (!hijriDate) return '...';
    const dayNum = formatNumber(hijriDate.day, language);
    const monthName = hijriMonths[language][hijriDate.monthIndex];
    const yr = formatNumber(hijriDate.year, language);
    const suffix = suffixAH[language];
    
    if (language === 'ar') {
      return `${dayNum} ${monthName} ${yr} ${suffix}`;
    }
    return `${dayNum} ${monthName} ${yr} ${suffix}`;
  };

  // Format Ethiopian date string
  const getEthiopianString = (): string => {
    const gYear = time.getFullYear();
    const gMonth = time.getMonth() + 1;
    const gDay = time.getDate();
    const [eYear, eMonth, eDay] = toEthiopian(gYear, gMonth, gDay);
    
    const dayNum = formatNumber(eDay, language);
    const monthName = ethiopianMonths[language][eMonth - 1];
    const yr = formatNumber(eYear, language);
    const suffix = suffixEC[language];
    
    return `${dayNum} ${monthName} ${yr} ${suffix}`;
  };

  // Format time string
  const getTimeString = (): string => {
    let hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    
    const ampm = language === 'ar' 
      ? (hours >= 12 ? 'م' : 'ص') 
      : (language === 'am' || language === 'har' 
          ? (hours >= 12 ? 'ከሰዓት' : 'ጠዋት') 
          : (hours >= 12 ? 'PM' : 'AM'));
          
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    const pad = (n: number) => n < 10 ? '0' + n : n;
    
    const hh = formatNumber(hours, language);
    const mm = formatNumber(parseInt(pad(minutes).toString(), 10), language);
    const ss = formatNumber(parseInt(pad(seconds).toString(), 10), language);

    const minStr = minutes < 10 ? (language === 'ar' ? '٠' : '0') + mm : mm;
    const secStr = seconds < 10 ? (language === 'ar' ? '٠' : '0') + ss : ss;
    
    if (language === 'ar') {
      return `${hh}:${minStr}:${secStr} ${ampm}`;
    }
    return `${hh}:${minStr}:${secStr} ${ampm}`;
  };

  const nextSalat = timings ? getNextSalat(timings, time) : null;

  if (variant === 'header') {
    return (
      <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-6 bg-white/80 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2 sm:px-6 sm:py-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-slate-800 dark:text-white select-none w-full lg:w-auto">
        {/* Islamic Date */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-hijri-calendar', { detail: { initialTab: 'hijri' } }))}
          className="flex items-center gap-2.5 text-left cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/40 p-1.5 -m-1.5 rounded-xl transition-all"
          title="Click to view interactive Hijri Calendar"
        >
          <Calendar size={16} className="text-primary-600 dark:text-secondary-400 animate-pulse" />
          <div className="text-left">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 block">
              {labelHijri[language]}
            </span>
            <span className="text-sm font-bold font-serif text-slate-800 dark:text-white block leading-tight">
              {getHijriString()}
            </span>
          </div>
        </button>

        {/* Divider */}
        <div className="hidden lg:block w-px h-8 bg-slate-250 dark:bg-slate-800" />

        {/* Ethiopian Date */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-hijri-calendar', { detail: { initialTab: 'ethiopian' } }))}
          className="flex items-center gap-2.5 text-left cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/40 p-1.5 -m-1.5 rounded-xl transition-all"
          title="Click to view interactive Ethiopian Calendar"
        >
          <Sparkles size={16} className="text-amber-500 animate-pulse" />
          <div className="text-left">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 block">
              {labelEthiopian[language]}
            </span>
            <span className="text-sm font-bold font-serif text-slate-850 dark:text-white block leading-tight">
              {getEthiopianString()}
            </span>
          </div>
        </button>

        {/* Divider */}
        <div className="hidden lg:block w-px h-8 bg-slate-250 dark:bg-slate-800" />

        {/* Gregorian Date */}
        <div className="flex items-center gap-2.5">
          <div className="text-left">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 block">
              {labelGregorian[language]}
            </span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 block leading-tight">
              {getGregorianString()}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px h-8 bg-slate-250 dark:bg-slate-800" />

        {/* Live Clock */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-world-clock'))}
          className="flex items-center gap-2.5 text-left cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/40 p-1.5 -m-1.5 rounded-xl transition-all"
          title="Click to view interactive World Clock & Major Cities"
        >
          <Clock size={16} className="text-primary-600 dark:text-secondary-400" />
          <div className="text-left min-w-[80px]">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 block">
              {labelTime[language]}
            </span>
            <span className="text-xs font-mono font-bold text-slate-800 dark:text-white block leading-tight">
              {getTimeString()}
            </span>
          </div>
        </button>

        {/* Divider */}
        <div className="hidden lg:block w-px h-8 bg-slate-250 dark:bg-slate-800" />

        {/* Next Salat */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-section', { detail: { section: 'qibla' } }))}
          className="flex items-center gap-2.5 hover:bg-slate-100/50 dark:hover:bg-slate-850/50 px-2.5 py-1 rounded-xl transition-all text-left cursor-pointer border border-slate-200/40 dark:border-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30"
          title="Click to view full schedule & Qibla Finder"
        >
          <Clock size={16} className="text-secondary-600 dark:text-secondary-400 animate-pulse" />
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 block">
              {nextSalatLabel[language]}
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-white block leading-tight">
              {nextSalat ? (
                <>
                  <span className="text-primary-700 dark:text-secondary-300 font-bold">{getLocalizedPrayerName(nextSalat.name, language)}</span>
                  <span className="mx-1 font-mono font-bold">{formatSalatTime12h(nextSalat.time, language)}</span>
                  {nextSalat.isTomorrow && <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500">{tomorrowSuffix[language]}</span>}
                </>
              ) : (
                <span className="text-slate-400 dark:text-slate-500 font-semibold">
                  {language === 'ar' ? 'حدد موقعاً لمواقيته' : (language === 'am' ? 'ቦታ ይምረጡ' : (language === 'har' ? 'ቦታ ይምረጡ' : 'Set Location'))}
                </span>
              )}
            </span>
          </div>
        </button>
      </div>
    );
  }

  // Sidebar variant (Default)
  return (
    <div className="px-3.5 py-2.5 bg-primary-950/40 border-y border-primary-800/30 space-y-2 select-none animate-in fade-in duration-300">
      {/* Grid: Live Time & Next Salat Side-by-Side */}
      <div className="grid grid-cols-2 gap-2">
        {/* Live Time */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-world-clock'))}
          className="text-left p-2 bg-gradient-to-br from-primary-900/50 to-primary-950/75 border border-primary-800/40 hover:border-secondary-500/45 rounded-xl relative overflow-hidden group hover:scale-[1.01] active:scale-[0.99] transition-all shadow-inner cursor-pointer flex flex-col justify-between"
          title="Click to view interactive World Clock"
        >
          <span className="text-[8px] font-extrabold uppercase tracking-widest text-primary-300/80 flex items-center gap-1 mb-1">
            <Clock size={8} className="text-secondary-400" />
            <span>{labelTime[language]}</span>
          </span>
          <span className="text-[11px] font-mono font-bold text-secondary-300 bg-primary-950/60 px-1 py-0.5 rounded border border-primary-800/30 inline-block leading-none">
            {getTimeString()}
          </span>
        </button>

        {/* Next Salat */}
        {nextSalat ? (
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-section', { detail: { section: 'qibla' } }))}
            className="text-left p-2 bg-gradient-to-br from-secondary-500/10 to-secondary-500/5 hover:from-secondary-500/15 hover:to-secondary-500/10 border border-secondary-500/20 hover:border-secondary-500/40 rounded-xl relative overflow-hidden group hover:scale-[1.01] active:scale-[0.99] transition-all shadow-inner cursor-pointer flex flex-col justify-between"
            title="Click to view full schedule & Qibla Finder"
          >
            <span className="text-[8px] font-extrabold uppercase tracking-widest text-secondary-400 block mb-1">
              {nextSalatLabel[language]}
            </span>
            <div className="flex items-baseline justify-between leading-none">
              <span className="text-[11px] font-bold text-secondary-100 truncate">
                {getLocalizedPrayerName(nextSalat.name, language)}
              </span>
              <span className="text-[9px] font-bold text-primary-300 font-mono">
                {formatSalatTime12h(nextSalat.time, language).split(' ')[0]}
              </span>
            </div>
          </button>
        ) : (
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-section', { detail: { section: 'qibla' } }))}
            className="text-left p-2 bg-primary-900/30 border border-primary-800/25 rounded-xl hover:bg-primary-900/45 transition-all cursor-pointer flex flex-col justify-between"
          >
            <span className="text-[8px] font-extrabold uppercase tracking-widest text-primary-400 block mb-1">
              {nextSalatLabel[language]}
            </span>
            <span className="text-[10px] font-medium block text-primary-200 leading-none">
              {language === 'ar' ? 'حدد موقعاً' : 'Set Location'}
            </span>
          </button>
        )}
      </div>

      {/* Consolidated Calendars Box (More Compact Row-based Layout) */}
      <div className="w-full bg-gradient-to-b from-primary-900/65 to-primary-950/85 border border-primary-800/40 rounded-xl overflow-hidden shadow-md select-none">
        {/* Calendar Rows */}
        <div className="divide-y divide-primary-800/20">
          {/* Hijri Calendar Row */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-hijri-calendar', { detail: { initialTab: 'hijri' } }))}
            className="w-full px-2.5 py-1.5 hover:bg-primary-900/40 transition-all group flex items-center justify-between cursor-pointer gap-2"
            title="Click to view Hijri Calendar"
          >
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-secondary-400/90 shrink-0">
              {language === 'ar' ? 'هجري' : (language === 'am' || language === 'har' ? 'ሂጅሪ' : 'Hijri')}
            </span>
            <span className="text-[11px] font-bold font-serif text-secondary-50 leading-none truncate text-right">
              {getHijriString()}
            </span>
          </button>

          {/* Ethiopian Calendar Row */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-hijri-calendar', { detail: { initialTab: 'ethiopian' } }))}
            className="w-full px-2.5 py-1.5 hover:bg-primary-900/40 transition-all group flex items-center justify-between cursor-pointer gap-2"
            title="Click to view Ethiopian Calendar"
          >
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-400/90 shrink-0">
              {language === 'ar' ? 'إثيوبي' : (language === 'am' || language === 'har' ? 'ኢትዮ' : 'Ethiopian')}
            </span>
            <span className="text-[11px] font-bold font-serif text-amber-100 leading-none truncate text-right">
              {getEthiopianString()}
            </span>
          </button>

          {/* Gregorian Calendar Row */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-hijri-calendar', { detail: { initialTab: 'gregorian' } }))}
            className="w-full px-2.5 py-1.5 hover:bg-primary-900/40 transition-all group flex items-center justify-between cursor-pointer gap-2"
            title="Click to view Gregorian Calendar"
          >
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-primary-300/95 shrink-0">
              {language === 'ar' ? 'ميلادي' : (language === 'am' || language === 'har' ? 'ጎርጎ' : 'Gregorian')}
            </span>
            <span className="text-[11px] font-bold text-primary-50 leading-none truncate text-right">
              {getGregorianString().replace(/^[^,]+,\s*/, '') /* Remove weekday name to make it ultra compact! */}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateDisplay;
