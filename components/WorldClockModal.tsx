import React, { useState, useEffect } from 'react';
import { X, Clock, Plus, Trash2, Search, Star, Globe, ShieldAlert, Check, Moon, Sun, ArrowUpDown } from 'lucide-react';
import { useLanguage, Language } from './LanguageContext';

interface WorldClockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface CityClock {
  id: string;
  name: Record<Language, string>;
  timezone: string; // IANA timezone (e.g. 'Asia/Riyadh')
  country: Record<Language, string>;
  isPinned?: boolean;
  isCustom?: boolean;
}

// Predefined list of popular cities
const PREDEFINED_CITIES: Omit<CityClock, 'id'>[] = [
  {
    name: { en: "Makkah", ar: "مكة المكرمة", am: "መካ", har: "መካ" },
    country: { en: "Saudi Arabia", ar: "المملكة العربية السعودية", am: "ሳውዲ አረቢያ", har: "ሳውዲ አረቢያ" },
    timezone: "Asia/Riyadh"
  },
  {
    name: { en: "Madinah", ar: "المدينة المنورة", am: "መዲና", har: "መዲና" },
    country: { en: "Saudi Arabia", ar: "المملكة العربية السعودية", am: "ሳውዲ አረቢያ", har: "ሳውዲ አረቢያ" },
    timezone: "Asia/Riyadh"
  },
  {
    name: { en: "Jerusalem", ar: "القدس الشريف", am: "እየሩሳሌም", har: "እየሩሳሌም" },
    country: { en: "Palestine", ar: "فلسطين", am: "ፍልስጤም", har: "ፍልስጤም" },
    timezone: "Asia/Jerusalem"
  },
  {
    name: { en: "Addis Ababa", ar: "أديس أبابا", am: "አዲስ አበባ", har: "አዲስ አበባ" },
    country: { en: "Ethiopia", ar: "إثيوبيا", am: "ኢትዮጵያ", har: "ኢትዮጵያ" },
    timezone: "Africa/Addis_Ababa"
  },
  {
    name: { en: "Harar", ar: "هرر", am: "ሐረር", har: "ሐረር" },
    country: { en: "Ethiopia", ar: "إثيوبيا", am: "ኢትዮጵያ", har: "ኢትዮጵያ" },
    timezone: "Africa/Addis_Ababa"
  },
  {
    name: { en: "Cairo", ar: "القاهرة", am: "ካይሮ", har: "ካይሮ" },
    country: { en: "Egypt", ar: "مصر", am: "ግብፅ", har: "ግብፅ" },
    timezone: "Africa/Cairo"
  },
  {
    name: { en: "Istanbul", ar: "إسطنبول", am: "ኢስታንቡል", har: "ኢስታንቡል" },
    country: { en: "Turkey", ar: "تركيا", am: "ቱርክ", har: "ቱርክ" },
    timezone: "Europe/Istanbul"
  },
  {
    name: { en: "London", ar: "لندن", am: "ለንደን", har: "ለንደን" },
    country: { en: "United Kingdom", ar: "المملكة المتحدة", am: "ዩናይትድ ኪንግደም", har: "ዩናይትድ ኪንግደም" },
    timezone: "Europe/London"
  },
  {
    name: { en: "New York", ar: "نيويورك", am: "ኒው ዮርክ", har: "ኒው ዮርክ" },
    country: { en: "United States", ar: "الولايات المتحدة", am: "አሜሪካ", har: "አሜሪካ" },
    timezone: "America/New_York"
  },
  {
    name: { en: "Tokyo", ar: "طوكيو", am: "ቶኪዮ", har: "ቶኪዮ" },
    country: { en: "Japan", ar: "اليابان", am: "ጃፓን", har: "ጃፓን" },
    timezone: "Asia/Tokyo"
  },
  {
    name: { en: "Dubai", ar: "دبي", am: "ዱባይ", har: "ዱባይ" },
    country: { en: "United Arab Emirates", ar: "الإمارات العربية المتحدة", am: "የተባበሩት አረብ ኤምሬቶች", har: "የተባበሩት አረብ ኤምሬቶች" },
    timezone: "Asia/Dubai"
  },
  {
    name: { en: "Jakarta", ar: "جاكرتا", am: "ጃካርታ", har: "ጃካርታ" },
    country: { en: "Indonesia", ar: "إندونيسيا", am: "ኢንዶኔዥያ", har: "ኢንዶኔዥያ" },
    timezone: "Asia/Jakarta"
  }
];

const COUNTRIES_AND_CITIES: {
  name: Record<Language, string>;
  cities: {
    name: Record<Language, string>;
    timezone: string;
  }[];
}[] = [
  {
    name: { en: "Saudi Arabia", ar: "المملكة العربية السعودية", am: "ሳውዲ አረቢያ", har: "ሳውዲ አረቢያ" },
    cities: [
      { name: { en: "Makkah", ar: "مكة المكرمة", am: "መካ", har: "መካ" }, timezone: "Asia/Riyadh" },
      { name: { en: "Madinah", ar: "المدينة المنورة", am: "መዲና", har: "መዲና" }, timezone: "Asia/Riyadh" },
      { name: { en: "Riyadh", ar: "الرياض", am: "ሪያድ", har: "ሪያድ" }, timezone: "Asia/Riyadh" },
      { name: { en: "Jeddah", ar: "جدة", am: "ጅዳ", har: "ጅዳ" }, timezone: "Asia/Riyadh" }
    ]
  },
  {
    name: { en: "Palestine", ar: "فلسطين", am: "ፍልስጤም", har: "ፍልስጤም" },
    cities: [
      { name: { en: "Jerusalem", ar: "القدس الشريف", am: "እየሩሳሌም", har: "እየሩሳሌም" }, timezone: "Asia/Jerusalem" },
      { name: { en: "Gaza", ar: "غزة", am: "ጋዛ", har: "ጋዛ" }, timezone: "Asia/Gaza" }
    ]
  },
  {
    name: { en: "Ethiopia", ar: "إثيوبيا", am: "ኢትዮጵያ", har: "ኢትዮጵያ" },
    cities: [
      { name: { en: "Addis Ababa", ar: "أديس أبابا", am: "አዲስ አበባ", har: "አዲስ አበባ" }, timezone: "Africa/Addis_Ababa" },
      { name: { en: "Harar", ar: "هرر", am: "ሐረር", har: "ሐረር" }, timezone: "Africa/Addis_Ababa" },
      { name: { en: "Dire Dawa", ar: "ديري داوا", am: "ድሬዳዋ", har: "ድሬዳዋ" }, timezone: "Africa/Addis_Ababa" }
    ]
  },
  {
    name: { en: "Egypt", ar: "مصر", am: "ግብፅ", har: "ግብፅ" },
    cities: [
      { name: { en: "Cairo", ar: "القاهرة", am: "ካይሮ", har: "ካይሮ" }, timezone: "Africa/Cairo" },
      { name: { en: "Alexandria", ar: "الإسكندرية", am: "እስክንድርያ", har: "እስክንድርያ" }, timezone: "Africa/Cairo" }
    ]
  },
  {
    name: { en: "Turkey", ar: "تركيا", am: "ቱርክ", har: "ቱርክ" },
    cities: [
      { name: { en: "Istanbul", ar: "إسطنبول", am: "ኢስታንቡል", har: "ኢስታንቡል" }, timezone: "Europe/Istanbul" },
      { name: { en: "Ankara", ar: "أنقرة", am: "አንካራ", har: "አንካራ" }, timezone: "Europe/Istanbul" }
    ]
  },
  {
    name: { en: "United Arab Emirates", ar: "الإمارات العربية المتحدة", am: "የተባበሩት አረብ ኤምሬቶች", har: "የተባበሩት አረብ ኤምሬቶች" },
    cities: [
      { name: { en: "Dubai", ar: "دبي", am: "ዱባይ", har: "ዱባይ" }, timezone: "Asia/Dubai" },
      { name: { en: "Abu Dhabi", ar: "أبوظبي", am: "አቡ ዳቢ", har: "አቡ ዳቢ" }, timezone: "Asia/Dubai" }
    ]
  },
  {
    name: { en: "Syria", ar: "سوريا", am: "ሶሪያ", har: "ሶሪያ" },
    cities: [
      { name: { en: "Damascus", ar: "دمشق", am: "ደማስቆ", har: "ደማስቆ" }, timezone: "Asia/Damascus" },
      { name: { en: "Aleppo", ar: "حلب", am: "አሌፖ", har: "አሌፖ" }, timezone: "Asia/Damascus" }
    ]
  },
  {
    name: { en: "Iraq", ar: "العراق", am: "ኢራቅ", har: "ኢራቅ" },
    cities: [
      { name: { en: "Baghdad", ar: "بغداد", am: "ባግዳድ", har: "ባግዳድ" }, timezone: "Asia/Baghdad" }
    ]
  },
  {
    name: { en: "Yemen", ar: "اليمن", am: "የመን", har: "የመን" },
    cities: [
      { name: { en: "Sanaa", ar: "صنعاء", am: "ሰንዓ", har: "ሰንዓ" }, timezone: "Asia/Aden" },
      { name: { en: "Aden", ar: "عدن", am: "ኤደን", har: "ኤደን" }, timezone: "Asia/Aden" }
    ]
  },
  {
    name: { en: "Jordan", ar: "الأردن", am: "ዮርዳኖስ", har: "ዮርዳኖስ" },
    cities: [
      { name: { en: "Amman", ar: "عمان", am: "አማን", har: "አማን" }, timezone: "Asia/Amman" }
    ]
  },
  {
    name: { en: "Morocco", ar: "المغرب", am: "ሞሮኮ", har: "ሞሮኮ" },
    cities: [
      { name: { en: "Casablanca", ar: "الدار البيضاء", am: "ካዛብላንካ", har: "ካዛብላንካ" }, timezone: "Africa/Casablanca" },
      { name: { en: "Rabat", ar: "الرباط", am: "راባት", har: "ራባት" }, timezone: "Africa/Casablanca" }
    ]
  },
  {
    name: { en: "United Kingdom", ar: "المملكة المتحدة", am: "ዩናይትድ ኪንግደም", har: "ዩናይትድ ኪንግደም" },
    cities: [
      { name: { en: "London", ar: "لندن", am: "ለንደን", har: "ለንደን" }, timezone: "Europe/London" },
      { name: { en: "Birmingham", ar: "برمنغهام", am: "በርሚንግሃም", har: "በርሚንግሃም" }, timezone: "Europe/London" }
    ]
  },
  {
    name: { en: "United States", ar: "الولايات المتحدة", am: "አሜሪካ", har: "አሜሪካ" },
    cities: [
      { name: { en: "New York", ar: "نيويورك", am: "ኒው ዮርክ", har: "ኒው ዮርክ" }, timezone: "America/New_York" },
      { name: { en: "Los Angeles", ar: "لوس أنجلوس", am: "ሎስ አንጀለስ", har: "ሎስ አንጀለስ" }, timezone: "America/Los_Angeles" },
      { name: { en: "Chicago", ar: "شيكاغو", am: "ቺካጎ", har: "ቺካጎ" }, timezone: "America/Chicago" }
    ]
  },
  {
    name: { en: "Japan", ar: "اليابان", am: "ጃፓን", har: "ጃፓን" },
    cities: [
      { name: { en: "Tokyo", ar: "طوكيو", am: "ቶኪዮ", har: "ቶኪዮ" }, timezone: "Asia/Tokyo" }
    ]
  },
  {
    name: { en: "Indonesia", ar: "إندونيسيا", am: "ኢንዶኔዥያ", har: "ኢንዶኔዥያ" },
    cities: [
      { name: { en: "Jakarta", ar: "جاكرتا", am: "ጃካርታ", har: "ጃካርታ" }, timezone: "Asia/Jakarta" }
    ]
  },
  {
    name: { en: "Malaysia", ar: "ماليزيا", am: "ማሌዢያ", har: "ማሌዢያ" },
    cities: [
      { name: { en: "Kuala Lumpur", ar: "كوالالمبور", am: "ኩዋላ ላምፑር", har: "ኩዋላ ላምፑር" }, timezone: "Asia/Kuala_Lumpur" }
    ]
  },
  {
    name: { en: "Australia", ar: "أستراليا", am: "አውስትራሊያ", har: "አውስትራሊያ" },
    cities: [
      { name: { en: "Sydney", ar: "سيدني", am: "ሲድኒ", har: "ሲድኒ" }, timezone: "Australia/Sydney" },
      { name: { en: "Melbourne", ar: "ملبورن", am: "ሜልበርን", har: "ሜልበርን" }, timezone: "Australia/Melbourne" }
    ]
  },
  {
    name: { en: "France", ar: "فرنسا", am: "ፈረንሳይ", har: "ፈረንሳይ" },
    cities: [
      { name: { en: "Paris", ar: "باريس", am: "ፓሪስ", har: "ፓሪስ" }, timezone: "Europe/Paris" }
    ]
  }
];

const COMMON_TIMEZONES = [
  "UTC", "Asia/Riyadh", "Africa/Addis_Ababa", "Africa/Cairo", "Europe/Istanbul", 
  "Asia/Dubai", "Asia/Jerusalem", "Europe/London", "Europe/Paris", "America/New_York", 
  "America/Los_Angeles", "America/Chicago", "Asia/Tokyo", "Asia/Jakarta", 
  "Asia/Kuala_Lumpur", "Asia/Karachi", "Asia/Dhaka", "Australia/Sydney"
];

// Localized words
const uiTexts = {
  title: {
    en: "Global Clock & World Cities",
    ar: "ساعة العالم والمدን العالمية",
    am: "የዓለም ሰዓት እና ታዋቂ ከተሞች",
    har: "የዓለም ሰዓት እና ታዋቂ ከተሞች"
  },
  subtitle: {
    en: "Configure and track major cities and prayer center timetables relative to your local time.",
    ar: "قم بتهيئة ومتابعة أوقات المدن الكبرى والمراكز الإسلامية مقارنة بوقتك المحلي.",
    am: "ከአካባቢዎ ሰዓት አንፃር ዋና ዋና ከተሞችን ሰዓት ያዋቅሩ እና ይከተሉ።",
    har: "ከአካባቢዎ ሰዓት አንፃር ዋና ዋና ከተሞችን ሰዓት ያዋቅሩ እና ይከተሉ።"
  },
  addCity: {
    en: "Add City",
    ar: "إضافة مدينة",
    am: "ከተማ ጨምር",
    har: "ከተማ ጨምር"
  },
  customCity: {
    en: "Custom City",
    ar: "مدينة مخصصة",
    am: "ብጁ ከተማ",
    har: "ብጁ ከተማ"
  },
  cityName: {
    en: "City Name",
    ar: "اسم المدينة",
    am: "የከተማ ስም",
    har: "የከተማ ስም"
  },
  countryName: {
    en: "Country / Description",
    ar: "الدولة / الوصف",
    am: "ሀገር / መግለጫ",
    har: "ሀገር / መግለጫ"
  },
  selectCountry: {
    en: "Select Country",
    ar: "اختر الدولة",
    am: "ሀገር ይምረጡ",
    har: "ሀገር ይምረጡ"
  },
  selectCity: {
    en: "Select City",
    ar: "اختر المدينة",
    am: "ከተማ ይምረጡ",
    har: "ከተማ ይምረጡ"
  },
  selectTimezone: {
    en: "Select Time Zone",
    ar: "اختر المنطقة الزمنية",
    am: "የሰዓት ቀጠና ይምረጡ",
    har: "የሰዓት ቀጠና ይምረጡ"
  },
  localTime: {
    en: "Your Local Time",
    ar: "وقتك المحلي الحالي",
    am: "የአካባቢዎ ሰዓት",
    har: "የአካባቢዎ ሰዓት"
  },
  pinHome: {
    en: "Pin to Top",
    ar: "تثبيت في الأعلى",
    am: "ከላይ ሰካ",
    har: "ከላይ ሰካ"
  },
  format12: {
    en: "12-Hour Format",
    ar: "صيغة ١٢ ساعة",
    am: "የ12 ሰዓት አቆጣጠር",
    har: "የ12 ሰዓት አቆጣጠር"
  },
  format24: {
    en: "24-Hour Format",
    ar: "صيغة ٢٤ ساعة",
    am: "የ24 ሰዓት አቆጣጠር",
    har: "የ24 ሰዓት አቆጣጠር"
  },
  searchPlaceholder: {
    en: "Search predefined world cities...",
    ar: "ابحث في المدن العالمية المحددة...",
    am: "ከተሞችን እዚህ ይፈልጉ...",
    har: "ከተሞችን እዚህ ይፈልጉ..."
  },
  remove: {
    en: "Remove",
    ar: "حذف",
    am: "አስወግድ",
    har: "አስወግድ"
  },
  customSuccess: {
    en: "Custom city added successfully!",
    ar: "تم إضافة المدينة المخصصة بنجاح!",
    am: "ብጁ ከተማ በተሳካ ሁኔታ ተጨምሯል!",
    har: "ብጁ ከተማ በተሳካ ሁኔታ ተጨምሯል!"
  },
  reset: {
    en: "Restore Default Cities",
    ar: "استعادة المدን الافتراضية",
    am: "ነባሪ ከተሞችን መልስ",
    har: "ነባሪ ከተሞችን መልስ"
  }
};

export const WorldClockModal: React.FC<WorldClockModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [time, setTime] = useState<Date>(new Date());
  const [is24Hour, setIs24Hour] = useState<boolean>(false);
  const [activeClocks, setActiveClocks] = useState<CityClock[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Custom city form states
  const [showCustomForm, setShowCustomForm] = useState<boolean>(false);
  const [selectedCountryIdx, setSelectedCountryIdx] = useState<number | ''>('');
  const [selectedCityIdx, setSelectedCityIdx] = useState<number | ''>('');

  // Load clocks from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('world_clocks_v1');
    if (saved) {
      try {
        setActiveClocks(JSON.parse(saved));
      } catch (e) {
        initializeDefaultClocks();
      }
    } else {
      initializeDefaultClocks();
    }
  }, []);

  // Save clocks whenever they change
  const saveClocks = (clocks: CityClock[]) => {
    setActiveClocks(clocks);
    localStorage.setItem('world_clocks_v1', JSON.stringify(clocks));
  };

  const initializeDefaultClocks = () => {
    const defaults: CityClock[] = [
      {
        id: 'default-makkah',
        name: { en: "Makkah", ar: "مكة المكرمة", am: "መካ", har: "መካ" },
        country: { en: "Saudi Arabia", ar: "المملكة العربية السعودية", am: "ሳውዲ አረቢያ", har: "ሳውዲ አረቢያ" },
        timezone: "Asia/Riyadh",
        isPinned: true
      },
      {
        id: 'default-madinah',
        name: { en: "Madinah", ar: "المدينة المنورة", am: "መዲና", har: "መዲና" },
        country: { en: "Saudi Arabia", ar: "المملكة العربية السعودية", am: "ሳውዲ አረቢያ", har: "ሳውዲ አረቢያ" },
        timezone: "Asia/Riyadh"
      },
      {
        id: 'default-addis',
        name: { en: "Addis Ababa", ar: "أديس أبابا", am: "አዲስ አበባ", har: "አዲስ አበባ" },
        country: { en: "Ethiopia", ar: "إثيوبيا", am: "ኢትዮጵያ", har: "ኢትዮጵያ" },
        timezone: "Africa/Addis_Ababa"
      },
      {
        id: 'default-harar',
        name: { en: "Harar", ar: "هرر", am: "ሐረር", har: "ሐረር" },
        country: { en: "Ethiopia", ar: "إثيوبيا", am: "ኢትዮጵያ", har: "ኢትዮጵያ" },
        timezone: "Africa/Addis_Ababa"
      },
      {
        id: 'default-london',
        name: { en: "London", ar: "لندن", am: "ለንደን", har: "ለንደን" },
        country: { en: "United Kingdom", ar: "المملكة المتحدة", am: "ዩናይትድ ኪንግደም", har: "ዩናይትድ ኪንግደም" },
        timezone: "Europe/London"
      }
    ];
    saveClocks(defaults);
  };

  // Live ticking second update
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  // Formatting utility for specific timezone
  const formatTimeForZone = (timezone: string): string => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: !is24Hour
      }).format(time);
    } catch (e) {
      return "--:--:--";
    }
  };

  // Get date for specific timezone
  const formatDateForZone = (timezone: string): string => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      };
      return new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', options).format(time);
    } catch (e) {
      return "";
    }
  };

  // Get offset string relative to local time or absolute UTC
  const getTimezoneOffsetString = (timezone: string): string => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'longOffset'
      });
      const parts = formatter.formatToParts(time);
      const zonePart = parts.find(p => p.type === 'timeZoneName');
      return zonePart ? zonePart.value : "GMT";
    } catch (e) {
      return "GMT+0";
    }
  };

  // Pins / unpins a clock
  const togglePin = (id: string) => {
    const updated = activeClocks.map(clock => {
      if (clock.id === id) {
        return { ...clock, isPinned: !clock.isPinned };
      }
      return clock;
    });
    // Sort so pinned are at the top
    const sorted = [...updated].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
    saveClocks(sorted);
  };

  // Removes a clock from table
  const removeClock = (id: string) => {
    const filtered = activeClocks.filter(clock => clock.id !== id);
    saveClocks(filtered);
  };

  // Adds a predefined city from list
  const addPredefinedCity = (pre: Omit<CityClock, 'id'>) => {
    // Check if already active
    if (activeClocks.some(c => c.timezone === pre.timezone && c.name.en === pre.name.en)) {
      return;
    }
    const newClock: CityClock = {
      ...pre,
      id: `pre-${Date.now()}-${Math.random()}`
    };
    saveClocks([...activeClocks, newClock]);
    setSearchQuery('');
  };

  // Adds a custom city
  const addCustomCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCountryIdx === '' || selectedCityIdx === '') return;

    const countryObj = COUNTRIES_AND_CITIES[selectedCountryIdx];
    const cityObj = countryObj.cities[selectedCityIdx];

    const newClock: CityClock = {
      id: `custom-${Date.now()}`,
      name: cityObj.name,
      country: countryObj.name,
      timezone: cityObj.timezone,
      isCustom: true
    };

    saveClocks([...activeClocks, newClock]);
    setSelectedCountryIdx('');
    setSelectedCityIdx('');
    setShowCustomForm(false);
  };

  // Predefined search filtering
  const filteredPredefined = PREDEFINED_CITIES.filter(pre => {
    const searchLower = searchQuery.toLowerCase();
    const matchesEn = pre.name.en.toLowerCase().includes(searchLower) || pre.country.en.toLowerCase().includes(searchLower);
    const matchesAr = pre.name.ar.includes(searchQuery) || pre.country.ar.includes(searchQuery);
    const matchesAm = pre.name.am.includes(searchQuery) || pre.country.am.includes(searchQuery);
    return matchesEn || matchesAr || matchesAm;
  }).filter(pre => {
    // Exclude those already added
    return !activeClocks.some(c => c.timezone === pre.timezone && c.name.en === pre.name.en);
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300 select-none">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Header Section */}
        <div className="p-6 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-secondary-400 rounded-2xl border border-primary-200/30 dark:border-primary-800/20">
              <Globe size={22} className="animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white font-serif flex items-center gap-2">
                <span>{uiTexts.title[language]}</span>
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                {uiTexts.subtitle[language]}
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Top Real-time Displays */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. Local Time card */}
            <div className="p-4 bg-gradient-to-br from-primary-900/10 to-primary-950/5 dark:from-primary-950/40 dark:to-primary-900/10 rounded-2xl border border-primary-100 dark:border-primary-900/30 flex flex-col justify-between relative overflow-hidden group">
              <Clock className="absolute -right-3 -bottom-3 text-primary-500/5 dark:text-secondary-400/5 size-24 pointer-events-none group-hover:scale-105 transition-transform" />
              <div>
                <span className="text-[10px] font-extrabold text-primary-600 dark:text-secondary-400 tracking-wider uppercase block mb-1">
                  {uiTexts.localTime[language]}
                </span>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 block">
                  {new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(time)}
                </span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold font-mono text-slate-800 dark:text-white tracking-tight leading-none">
                  {time.toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { hour12: !is24Hour })}
                </span>
              </div>
            </div>

            {/* 2. Highlighted Makkah clock */}
            <div className="p-4 bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-2xl border border-amber-200/40 dark:border-amber-900/20 flex flex-col justify-between relative overflow-hidden group">
              <Star className="absolute -right-3 -bottom-3 text-amber-500/10 size-24 pointer-events-none group-hover:scale-105 transition-transform" />
              <div>
                <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 tracking-wider uppercase block mb-1">
                  🕌 Makkah Al-Mukarramah
                </span>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 block">
                  {formatDateForZone("Asia/Riyadh")}
                </span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold font-mono text-slate-800 dark:text-white tracking-tight leading-none">
                  {formatTimeForZone("Asia/Riyadh")}
                </span>
              </div>
            </div>

            {/* 3. Global settings toggler */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-slate-200/50 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 tracking-wider uppercase block mb-2">
                  Format Settings
                </span>
                
                <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <button
                    onClick={() => setIs24Hour(false)}
                    className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer
                      ${!is24Hour 
                        ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-secondary-300 shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400'}`}
                  >
                    12H
                  </button>
                  <button
                    onClick={() => setIs24Hour(true)}
                    className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer
                      ${is24Hour 
                        ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-secondary-300 shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400'}`}
                  >
                    24H
                  </button>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setShowCustomForm(!showCustomForm)}
                  className="flex-1 py-1.5 px-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>{uiTexts.customCity[language]}</span>
                </button>
                
                <button
                  onClick={initializeDefaultClocks}
                  className="p-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl transition-all cursor-pointer"
                  title={uiTexts.reset[language]}
                >
                  <ArrowUpDown size={14} />
                </button>
              </div>
            </div>

          </div>

          {/* Custom City Form (Collapsible) */}
          {showCustomForm && (
            <form onSubmit={addCustomCitySubmit} className="p-4 bg-slate-50 dark:bg-slate-950/30 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-4 animate-in slide-in-from-top duration-200">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
                  {uiTexts.customCity[language]}
                </h4>
                <button type="button" onClick={() => setShowCustomForm(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                  <X size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">{uiTexts.selectCountry[language]}</label>
                  <select
                    required
                    value={selectedCountryIdx}
                    onChange={(e) => {
                      const idx = e.target.value === '' ? '' : Number(e.target.value);
                      setSelectedCountryIdx(idx);
                      setSelectedCityIdx(''); // Reset selected city when country changes
                    }}
                    className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
                  >
                    <option value="">-- {uiTexts.selectCountry[language]} --</option>
                    {COUNTRIES_AND_CITIES.map((country, idx) => (
                      <option key={idx} value={idx}>
                        {country.name[language] || country.name.en}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">{uiTexts.cityName[language]}</label>
                  <select
                    required
                    disabled={selectedCountryIdx === ''}
                    value={selectedCityIdx}
                    onChange={(e) => {
                      const idx = e.target.value === '' ? '' : Number(e.target.value);
                      setSelectedCityIdx(idx);
                    }}
                    className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">-- {uiTexts.selectCity[language]} --</option>
                    {selectedCountryIdx !== '' && COUNTRIES_AND_CITIES[selectedCountryIdx].cities.map((city, idx) => (
                      <option key={idx} value={idx}>
                        {city.name[language] || city.name.en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Readonly Timezone Display for Feedback */}
              {selectedCountryIdx !== '' && selectedCityIdx !== '' && (
                <div className="p-2.5 bg-primary-50/50 dark:bg-primary-950/20 rounded-xl flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-900">
                  <span className="font-medium text-[10px] uppercase tracking-wider text-slate-400">{uiTexts.selectTimezone[language]}</span>
                  <span className="font-mono text-xs text-primary-600 dark:text-secondary-400">
                    {COUNTRIES_AND_CITIES[selectedCountryIdx].cities[selectedCityIdx].timezone}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={selectedCountryIdx === '' || selectedCityIdx === ''}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Custom City
              </button>
            </form>
          )}

          {/* Search bar for predefined list */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3.5 flex items-center text-slate-400 pointer-events-none">
              <Search size={15} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={uiTexts.searchPlaceholder[language]}
              className="w-full text-xs pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filtered Predefined Results dropdown list */}
          {searchQuery && filteredPredefined.length > 0 && (
            <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl max-h-48 overflow-y-auto space-y-1.5 shadow-lg">
              {filteredPredefined.map((pre, idx) => (
                <button
                  key={idx}
                  onClick={() => addPredefinedCity(pre)}
                  className="w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl flex items-center justify-between text-xs transition-all cursor-pointer group"
                >
                  <div>
                    <span className="font-bold text-slate-800 dark:text-white">{pre.name[language]}</span>
                    <span className="text-slate-400 dark:text-slate-500 font-medium ml-1.5">• {pre.country[language]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-primary-600 dark:text-secondary-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus size={12} /> Add
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Active Cities timetable list */}
          <div className="border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-950/40 text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest border-b border-slate-150 dark:border-slate-800">
                  <th className="py-3 px-4 w-10">Pin</th>
                  <th className="py-3 px-4">City / Region</th>
                  <th className="py-3 px-4">Current Date</th>
                  <th className="py-3 px-4 text-right">Live Time</th>
                  <th className="py-3 px-4 text-center w-16">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {activeClocks.map((clock) => {
                  const displayTime = formatTimeForZone(clock.timezone);
                  const displayDate = formatDateForZone(clock.timezone);
                  const offsetStr = getTimezoneOffsetString(clock.timezone);

                  return (
                    <tr 
                      key={clock.id} 
                      className={`text-xs hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-colors
                        ${clock.isPinned ? 'bg-primary-50/20 dark:bg-primary-950/10' : ''}`}
                    >
                      {/* Pinned star */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => togglePin(clock.id)}
                          className={`p-1 rounded-lg transition-colors cursor-pointer
                            ${clock.isPinned 
                              ? 'text-amber-500 hover:text-amber-600' 
                              : 'text-slate-300 dark:text-slate-600 hover:text-slate-400 dark:hover:text-slate-500'}`}
                          title={uiTexts.pinHome[language]}
                        >
                          <Star size={15} fill={clock.isPinned ? "currentColor" : "none"} />
                        </button>
                      </td>

                      {/* City Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                            <span>{clock.name[language]}</span>
                            {clock.isPinned && (
                              <span className="text-[8px] bg-amber-500/10 text-amber-600 px-1 py-0.2 rounded font-extrabold tracking-wide uppercase">
                                Pinned
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                            {clock.country[language]} • {clock.timezone}
                          </span>
                        </div>
                      </td>

                      {/* Current Date & Offset */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="text-slate-600 dark:text-slate-300 font-semibold">
                            {displayDate}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                            {offsetStr}
                          </span>
                        </div>
                      </td>

                      {/* Live Clock display */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-mono font-bold text-sm text-slate-850 dark:text-secondary-300 block">
                          {displayTime}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => removeClock(clock.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-all cursor-pointer"
                          title={uiTexts.remove[language]}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {activeClocks.length === 0 && (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500 font-medium">
                No cities configured. Use the button above to add some or restore defaults!
              </div>
            )}
          </div>

        </div>

        {/* Footer info bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border-t border-slate-250 dark:border-slate-800 text-center text-[10px] text-slate-400 dark:text-slate-500 font-bold">
          🌍 Friday Surah Guide Hub • Calculated with real-time browser offsets
        </div>

      </div>
    </div>
  );
};

export default WorldClockModal;
