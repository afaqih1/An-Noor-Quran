import React, { useState, useEffect } from 'react';
import { 
  MapPin, Clock, Calendar, Loader2, Globe, Sparkles, Compass, 
  Volume2, VolumeX, Play, Square, Bell, BellOff, Sun, SunDim, 
  Sliders, Info, RotateCcw, Check 
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import {
  getDstInfo,
  applyDstAndTune,
  calculateAstronomicalPrayerTimes,
  DstMode,
  DstInfo,
  PrayerTimings
} from '../src/utils/prayerTimeCalculator';

interface HijriDate {
  day: string;
  month: {
    en: string;
    ar: string;
  };
  year: string;
  weekday: {
    en: string;
  };
}

export const CALC_METHODS = [
  { id: '1', name: 'University of Islamic Sciences, Karachi' },
  { id: '2', name: 'Islamic Society of North America (ISNA)' },
  { id: '3', name: 'Muslim World League (MWL)' },
  { id: '4', name: 'Umm Al-Qura University, Makkah' },
  { id: '5', name: 'Egyptian General Authority of Survey' },
  { id: '7', name: 'Institute of Geophysics, University of Tehran' },
  { id: '8', name: 'Gulf Region' },
  { id: '9', name: 'Kuwait' },
  { id: '10', name: 'Qatar' },
  { id: '11', name: 'Majlis Ugama Islam Singapura, Singapore' },
  { id: '12', name: 'Union Organisation Islamique de France' },
  { id: '13', name: 'Diyanet İşleri Başkanlığı, Turkey' },
  { id: '14', name: 'Spiritual Administration of Muslims of Russia' },
];

export const FridayPrayerTimes: React.FC = () => {
  const { language, t } = useLanguage();

  const getPrayerName = (name: string) => {
    const names: Record<string, Record<string, string>> = {
      en: { Fajr: 'Fajr', Sunrise: 'Sunrise', Dhuhr: 'Dhuhr', Asr: 'Asr', Maghrib: 'Maghrib', Isha: 'Isha' },
      ar: { Fajr: 'الفجر', Sunrise: 'الشروق', Dhuhr: 'الظهر / الجمعة', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' },
      am: { Fajr: 'ሱብሒ (ፈጅር)', Sunrise: 'ፀሐይ መውጫ', Dhuhr: 'ዙህር / ጁሙዓ', Asr: 'ዐስር', Maghrib: 'መግሪብ', Isha: 'ዒሻእ' },
      har: { Fajr: 'ሱብሒ', Sunrise: 'ቢሪሕ', Dhuhr: 'ዙህር / ጁምዓ', Asr: 'ዐስር', Maghrib: 'መግሪብ', Isha: 'ዒሻእ' }
    };
    return names[language]?.[name] || name;
  };

  const getPrayerDesc = (name: string) => {
    const descs: Record<string, Record<string, string>> = {
      en: { Fajr: 'Dawn', Sunrise: 'Sunrise', Dhuhr: 'Noon / Jumu\'ah', Asr: 'Afternoon', Maghrib: 'Sunset / Evening', Isha: 'Night' },
      ar: { Fajr: 'الفجر', Sunrise: 'شروق الشمس', Dhuhr: 'الظهر أو صلاة الجمعة', Asr: 'المساء الأول', Maghrib: 'الغسق الأول', Isha: 'الليل الغابر' },
      am: { Fajr: 'ወገግታ', Sunrise: 'ፀሐይ ሲወጣ', Dhuhr: 'እኩለ ቀን / ጁሙዓ', Asr: 'ከሰዓት በኋላ', Maghrib: 'ፀሐይ ስትጠልቅ', Isha: 'ምሽት' },
      har: { Fajr: 'ሱብሒ', Sunrise: 'ቢሪሕ ወቅቲ', Dhuhr: 'እኩለ መዓልት / ጁምዓ', Asr: 'ከሰዓት በኋላ', Maghrib: 'መግሪብ ወቅቲ', Isha: 'ሌይቲ' }
    };
    return descs[language]?.[name] || name;
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Timings: final adjusted timings shown in UI
  const [timings, setTimings] = useState<PrayerTimings | null>(null);
  // Raw timings: pure timings directly from calculation/API before DST mode overrides
  const [rawTimings, setRawTimings] = useState<PrayerTimings | null>(() => {
    try {
      const stored = localStorage.getItem('friday-prayer-raw-timings');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [rawIncludedDst, setRawIncludedDst] = useState<boolean>(() => {
    try {
      return localStorage.getItem('friday-prayer-raw-is-dst') === 'true';
    } catch {
      return false;
    }
  });

  const [hijri, setHijri] = useState<HijriDate | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [locationTimezone, setLocationTimezone] = useState<string>(() => {
    try {
      return localStorage.getItem('friday-prayer-timezone') || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch {
      return 'UTC';
    }
  });

  // Daylight Saving Time (DST) configuration
  const [dstMode, setDstMode] = useState<DstMode>(() => {
    try {
      return (localStorage.getItem('friday-prayer-dst-mode') as DstMode) || 'auto';
    } catch {
      return 'auto';
    }
  });

  const [fineTuneMinutes, setFineTuneMinutes] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('friday-prayer-fine-tune') || '0', 10);
    } catch {
      return 0;
    }
  });

  const [showDstExplainer, setShowDstExplainer] = useState<boolean>(false);

  // Manual search states
  const [city, setCity] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [showManualForm, setShowManualForm] = useState<boolean>(false);

  // Calculation method state
  const [calcMethod, setCalcMethod] = useState<string>(() => {
    try {
      return localStorage.getItem('friday-prayer-method') || '2';
    } catch {
      return '2';
    }
  });

  // Azan states
  const [azanEnabled, setAzanEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('friday-prayer-azan-enabled') === 'true' || localStorage.getItem('friday-azan-enabled') === 'true';
    } catch {
      return false;
    }
  });

  const [azanStyle, setAzanStyle] = useState<'makkah' | 'madinah'>(() => {
    try {
      return (localStorage.getItem('friday-azan-style') === 'madinah' ? 'madinah' : 'makkah');
    } catch {
      return 'makkah';
    }
  });

  const [isTestPlaying, setIsTestPlaying] = useState<boolean>(false);

  // Computed DST status info
  const dstInfo: DstInfo = getDstInfo(locationTimezone, new Date());

  // Monitor custom updates to sync state when triggered globally
  useEffect(() => {
    const handleAzanUpdate = () => {
      try {
        setAzanEnabled(localStorage.getItem('friday-azan-enabled') === 'true');
        setAzanStyle(localStorage.getItem('friday-azan-style') === 'madinah' ? 'madinah' : 'makkah');
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('azan-updated', handleAzanUpdate);
    return () => window.removeEventListener('azan-updated', handleAzanUpdate);
  }, []);

  const handleAzanToggle = (enabled: boolean) => {
    setAzanEnabled(enabled);
    try {
      localStorage.setItem('friday-azan-enabled', enabled ? 'true' : 'false');
      window.dispatchEvent(new Event('azan-updated'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleStyleChange = (style: 'makkah' | 'madinah') => {
    setAzanStyle(style);
    try {
      localStorage.setItem('friday-azan-style', style);
      window.dispatchEvent(new Event('azan-updated'));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTestAzan = () => {
    if (isTestPlaying) {
      window.dispatchEvent(new Event('stop-test-azan'));
      setIsTestPlaying(false);
    } else {
      const event = new CustomEvent('trigger-test-azan', { detail: { style: azanStyle } });
      window.dispatchEvent(event);
      setIsTestPlaying(true);
    }
  };

  // Re-apply DST and fine tune adjustments to raw timings
  const updateAdjustedTimings = (
    baseRaw: PrayerTimings,
    baseRawIsDst: boolean,
    mode: DstMode,
    tuneMins: number
  ) => {
    const { adjustedTimings } = applyDstAndTune(baseRaw, baseRawIsDst, mode, tuneMins);
    setTimings(adjustedTimings);
    try {
      localStorage.setItem('friday-prayer-timings', JSON.stringify(adjustedTimings));
      window.dispatchEvent(new Event('prayer-times-updated'));
    } catch (e) {
      console.error('Error saving adjusted timings:', e);
    }
  };

  // Handle user toggling Daylight Saving Time mode (Auto, On +1h, Off 0h)
  const handleDstModeChange = (newMode: DstMode) => {
    setDstMode(newMode);
    try {
      localStorage.setItem('friday-prayer-dst-mode', newMode);
      if (rawTimings) {
        updateAdjustedTimings(rawTimings, rawIncludedDst, newMode, fineTuneMinutes);
      }
    } catch (e) {
      console.error('Error setting DST mode:', e);
    }
  };

  // Handle fine-tuning minute adjustments
  const handleFineTuneChange = (delta: number) => {
    setFineTuneMinutes(delta);
    try {
      localStorage.setItem('friday-prayer-fine-tune', delta.toString());
      if (rawTimings) {
        updateAdjustedTimings(rawTimings, rawIncludedDst, dstMode, delta);
      }
    } catch (e) {
      console.error('Error setting fine tune:', e);
    }
  };

  const handleCalcMethodChange = async (newMethod: string) => {
    setCalcMethod(newMethod);
    try {
      localStorage.setItem('friday-prayer-method', newMethod);
      
      const savedLat = localStorage.getItem('friday-prayer-lat');
      const savedLng = localStorage.getItem('friday-prayer-lng');
      const savedCity = localStorage.getItem('friday-prayer-search-city');
      const savedCountry = localStorage.getItem('friday-prayer-search-country');
      
      if (savedLat && savedLng) {
        await fetchByCoords(parseFloat(savedLat), parseFloat(savedLng), newMethod);
      } else if (savedCity) {
        await fetchByCityName(savedCity, savedCountry || '', newMethod);
      } else {
        detectLocation();
      }
    } catch (e) {
      console.warn('Error changing calculation method:', e);
    }
  };

  // Turn off test playing if global azan stops
  useEffect(() => {
    const handleStopTest = () => {
      setIsTestPlaying(false);
    };
    window.addEventListener('stop-test-azan', handleStopTest);
    return () => window.removeEventListener('stop-test-azan', handleStopTest);
  }, []);

  // Load from local storage on mount, or request geolocation
  useEffect(() => {
    const savedTimings = localStorage.getItem('friday-prayer-timings');
    const savedHijri = localStorage.getItem('friday-prayer-hijri');
    const savedLoc = localStorage.getItem('friday-prayer-location');
    const savedRaw = localStorage.getItem('friday-prayer-raw-timings');
    const savedTz = localStorage.getItem('friday-prayer-timezone');

    if (savedTimings && savedHijri && savedLoc) {
      try {
        setTimings(JSON.parse(savedTimings));
        setHijri(JSON.parse(savedHijri));
        setLocationName(savedLoc);
        if (savedRaw) setRawTimings(JSON.parse(savedRaw));
        if (savedTz) setLocationTimezone(savedTz);
      } catch (e) {
        // Clear corrupt storage
        localStorage.removeItem('friday-prayer-timings');
        localStorage.removeItem('friday-prayer-hijri');
        localStorage.removeItem('friday-prayer-location');
      }
    } else {
      detectLocation();
    }
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setShowManualForm(true);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await fetchByCoords(latitude, longitude);
      },
      (geoError) => {
        console.warn('Geolocation error:', geoError);
        setLoading(false);
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setError('Location permission denied. Please search for your city below.');
        } else {
          setError('Unable to retrieve location. Please search for your city below.');
        }
        setShowManualForm(true);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 }
    );
  };

  const fetchByCoords = async (lat: number, lng: number, methodId = calcMethod) => {
    try {
      setLoading(true);
      setError(null);

      let fetchedTimings: PrayerTimings | null = null;
      let fetchedHijri: HijriDate | null = null;
      let tz = locationTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      let isDstIncludedInRaw = false;

      try {
        const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=${methodId}`);
        if (response.ok) {
          const resData = await response.json();
          if (resData && resData.data) {
            const data = resData.data;
            fetchedTimings = data.timings;
            fetchedHijri = data.date.hijri;
            if (data.meta && data.meta.timezone) {
              tz = data.meta.timezone;
            }
          }
        }
      } catch (netErr) {
        console.warn('Network call failed, using offline astronomical calculation:', netErr);
      }

      // Offline fallback if network failed
      if (!fetchedTimings) {
        fetchedTimings = calculateAstronomicalPrayerTimes(lat, lng, new Date(), methodId);
        fetchedHijri = {
          day: new Date().getDate().toString(),
          month: { en: 'Shawwal', ar: 'شوال' },
          year: '1447',
          weekday: { en: 'Friday' }
        };
      }

      // Check DST status for this timezone
      const info = getDstInfo(tz, new Date());
      isDstIncludedInRaw = info.isDst;
      setLocationTimezone(tz);

      setRawTimings(fetchedTimings);
      setRawIncludedDst(isDstIncludedInRaw);
      setHijri(fetchedHijri);

      // Cache raw info
      localStorage.setItem('friday-prayer-lat', lat.toString());
      localStorage.setItem('friday-prayer-lng', lng.toString());
      localStorage.setItem('friday-prayer-raw-timings', JSON.stringify(fetchedTimings));
      localStorage.setItem('friday-prayer-raw-is-dst', isDstIncludedInRaw ? 'true' : 'false');
      localStorage.setItem('friday-prayer-timezone', tz);
      localStorage.removeItem('friday-prayer-search-city');
      localStorage.removeItem('friday-prayer-search-country');

      // Reverse geocoding
      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=10`);
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          const cityOrState = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.county || geoData.address.state || 'Local Area';
          const countryName = geoData.address.country || '';
          const fullLoc = countryName ? `${cityOrState}, ${countryName}` : cityOrState;
          setLocationName(fullLoc);
          localStorage.setItem('friday-prayer-location', fullLoc);
        } else {
          const genericLoc = `Coords: ${lat.toFixed(2)}, ${lng.toFixed(2)}`;
          setLocationName(genericLoc);
          localStorage.setItem('friday-prayer-location', genericLoc);
        }
      } catch (err) {
        const genericLoc = `Coords: ${lat.toFixed(2)}, ${lng.toFixed(2)}`;
        setLocationName(genericLoc);
        localStorage.setItem('friday-prayer-location', genericLoc);
      }

      if (fetchedHijri) {
        localStorage.setItem('friday-prayer-hijri', JSON.stringify(fetchedHijri));
      }

      // Apply DST and Fine Tuning
      updateAdjustedTimings(fetchedTimings, isDstIncludedInRaw, dstMode, fineTuneMinutes);
      setShowManualForm(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching prayer times.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) {
      setError('Please enter a city name.');
      return;
    }

    setLoading(true);
    setError(null);
    await fetchByCityName(city, country, calcMethod);
  };

  const fetchByCityName = async (searchCity: string, searchCountry = '', methodId = calcMethod) => {
    setLoading(true);
    setError(null);

    try {
      const queryCountry = searchCountry.trim() ? `&country=${encodeURIComponent(searchCountry.trim())}` : '';
      const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(searchCity.trim())}${queryCountry}&method=${methodId}`);
      
      if (!response.ok) {
        throw new Error('City not found. Please verify the spelling or try another near city.');
      }

      const resData = await response.json();
      if (resData && resData.data) {
        const data = resData.data;
        const fetchedTimings: PrayerTimings = data.timings;
        const fetchedHijri: HijriDate = data.date.hijri;
        const tz = data.meta?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

        const info = getDstInfo(tz, new Date());
        const isDstIncludedInRaw = info.isDst;
        setLocationTimezone(tz);

        setRawTimings(fetchedTimings);
        setRawIncludedDst(isDstIncludedInRaw);
        setHijri(fetchedHijri);

        // Cache search query for dynamic calculation changes
        localStorage.setItem('friday-prayer-search-city', searchCity);
        localStorage.setItem('friday-prayer-search-country', searchCountry);
        localStorage.setItem('friday-prayer-raw-timings', JSON.stringify(fetchedTimings));
        localStorage.setItem('friday-prayer-raw-is-dst', isDstIncludedInRaw ? 'true' : 'false');
        localStorage.setItem('friday-prayer-timezone', tz);
        localStorage.removeItem('friday-prayer-lat');
        localStorage.removeItem('friday-prayer-lng');
        
        const locString = searchCountry.trim() 
          ? `${searchCity.trim().charAt(0).toUpperCase() + searchCity.trim().slice(1)}, ${searchCountry.trim().toUpperCase()}`
          : `${searchCity.trim().charAt(0).toUpperCase() + searchCity.trim().slice(1)}`;
        
        setLocationName(locString);
        localStorage.setItem('friday-prayer-location', locString);
        localStorage.setItem('friday-prayer-hijri', JSON.stringify(fetchedHijri));

        // Apply DST and Fine Tuning
        updateAdjustedTimings(fetchedTimings, isDstIncludedInRaw, dstMode, fineTuneMinutes);

        setError(null);
        setShowManualForm(false);
      } else {
        throw new Error('Invalid response from the prayer times service.');
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred during search.');
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingFridayMessage = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0: Sun, 1: Mon, ... 5: Fri, 6: Sat
    
    if (dayOfWeek === 5) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <Sparkles size={11} className="fill-current animate-bounce" /> {language === 'ar' ? 'اليوم يوم الجمعة' : (language === 'am' ? 'ዛሬ ጁሙዓ (ዓርብ) ነው' : (language === 'har' ? 'ዛሬ ጁምዓ መዓልት ኢንታ' : "Today is Jumu'ah"))}
        </span>
      );
    } else {
      const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
      const targetDate = new Date();
      targetDate.setDate(today.getDate() + daysUntilFriday);
      return (
        <span className="inline-flex items-center gap-1 text-slate-500 text-xs font-medium">
          {language === 'ar' ? 'الجمعة القادمة:' : (language === 'am' ? 'የሚቀጥለው ጁሙዓ:' : (language === 'har' ? 'የሚቀጥለው ጁምዓ:' : "Upcoming Jumu'ah:"))} {targetDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} ({daysUntilFriday} {daysUntilFriday === 1 ? (language === 'en' ? 'day' : (language === 'ar' ? 'يوم' : 'ቀን')) : (language === 'en' ? 'days' : (language === 'ar' ? 'أيام' : 'ቀናት'))} {language === 'ar' ? 'متبقية' : (language === 'am' ? 'ቀረው' : (language === 'har' ? 'ቀረው' : 'left'))})
        </span>
      );
    }
  };

  // Convert "13:15" 24h format to beautiful "1:15 PM" 12h format
  const formatTime12h = (timeStr: string | undefined) => {
    if (!timeStr) return '';
    const cleanTime = timeStr.split(' ')[0]; // Remove timezone indicator if any
    const [hours, minutes] = cleanTime.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return timeStr;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  // Determine effective DST shift for badge display
  const effectiveDstShift = dstMode === '1' ? 60 : (dstMode === '0' ? 0 : (dstInfo.isDst ? 60 : 0));

  return (
    <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl shadow-sm border border-secondary-200 dark:border-slate-800 p-6 sm:p-8 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-secondary-100 dark:bg-secondary-950/40 text-secondary-800 dark:text-secondary-300 rounded-xl border border-secondary-200 dark:border-secondary-800/40 shadow-sm flex-shrink-0">
            <Compass className="w-6 h-6 animate-spin-slow text-primary-700 dark:text-secondary-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-serif">{t('prayer.title')}</h3>
              {getUpcomingFridayMessage()}
              
              {/* Daylight Saving Time Status Pill */}
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                effectiveDstShift > 0
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300/60'
                  : 'bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/50'
              }`}>
                {effectiveDstShift > 0 ? (
                  <>
                    <Sun size={11} className="text-amber-500 animate-spin-slow" />
                    <span>{language === 'ar' ? 'التوقيت الصيفي (+١ س)' : (language === 'am' ? 'DST በርቷል (+1 ሰዓት)' : 'DST (+1 hr)')}</span>
                  </>
                ) : (
                  <>
                    <SunDim size={11} className="text-sky-500" />
                    <span>{language === 'ar' ? 'التوقيت القياسي (+٠ س)' : (language === 'am' ? 'መደበኛ ሰዓት (+0 ሰዓት)' : 'Standard Time')}</span>
                  </>
                )}
              </span>

              {fineTuneMinutes !== 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-secondary-400 border border-primary-200 dark:border-primary-800">
                  {fineTuneMinutes > 0 ? `+${fineTuneMinutes}m` : `${fineTuneMinutes}m`}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 flex-wrap">
              {locationName ? (
                <>
                  <MapPin size={14} className="text-secondary-600 flex-shrink-0" />
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{locationName}</span>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                </>
              ) : null}
              {hijri ? (
                <>
                  <Calendar size={14} className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
                  <span className="font-medium text-slate-600 dark:text-slate-300" dir="rtl">
                    {hijri.day} {hijri.month.ar} ({hijri.month.en}) {hijri.year} AH
                  </span>
                </>
              ) : (
                language === 'ar' ? 'اسمح للوصول لموقعك الجغرافي لحساب مواقيت الصلاة المحلية الفعالة' : (language === 'am' ? 'ትክክለኛውን የአካባቢዎን የሶላት ወቅት ለማስላት እባክዎን መገኛ ቦታዎን ይፍቀዱ' : (language === 'har' ? 'ሃቅ ሰላት ወቅቲ ለማስላት እባክዎን የአሁኑን ቦታ ይፍቀዱ' : 'Access your location to calculate real local prayer start times'))
              )}
            </p>
          </div>
        </div>

        {/* Top controls: refresh geolocation or search manually */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <button
            onClick={detectLocation}
            disabled={loading}
            className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 active:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 hover:text-slate-900 transition-all text-xs font-bold cursor-pointer disabled:opacity-50 select-none border border-slate-200 dark:border-slate-700"
            title="Auto-detect location using your browser"
          >
            {loading ? (
              <Loader2 size={13} className="animate-spin text-slate-500" />
            ) : (
              <MapPin size={13} className="text-secondary-600 dark:text-secondary-400" />
            )}
            <span>{language === 'ar' ? 'تحديد تلقائي' : (language === 'am' ? 'በራስ-አግኝ' : (language === 'har' ? 'በራሱ-አግኝ' : 'Auto-Detect'))}</span>
          </button>

          <button
            onClick={() => setShowManualForm(!showManualForm)}
            className={`flex-grow sm:flex-grow-0 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl transition-all text-xs font-bold cursor-pointer select-none border
              ${showManualForm 
                ? 'bg-primary-50 dark:bg-primary-950/40 border-primary-200 dark:border-primary-800 text-primary-700 dark:text-secondary-400' 
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750'}`}
          >
            <Globe size={13} className="text-primary-600 dark:text-secondary-400" />
            <span>{language === 'ar' ? 'البحث بالمدينة' : (language === 'am' ? 'ከተማ ፈልግ' : (language === 'har' ? 'ከተማ ፍለጋ' : 'Search City'))}</span>
          </button>

          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('navigate-to-section', { detail: { section: 'qibla' } }));
            }}
            className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-all text-xs font-bold cursor-pointer select-none"
            title="Open Google Maps & Qibla Direction"
          >
            <Compass size={13} className="text-emerald-600 dark:text-emerald-400" />
            <span>{language === 'ar' ? 'خريطة القبلة' : 'Google Map'}</span>
          </button>
        </div>
      </div>

      {/* Manual Search Form */}
      {showManualForm && (
        <form onSubmit={handleManualSearch} className="mt-5 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 animate-in slide-in-from-top-2 duration-200">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
            {language === 'ar' ? 'ابحث عن مواقيت الصلاة باسم المدينة' : (language === 'am' ? 'የሶላት ወቅቶችን በከተማ ይፈልጉ' : (language === 'har' ? 'ሰላት ወቅታች በከተማ ፍለጋ' : 'Lookup Prayer Times by City'))}
          </h4>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label htmlFor="cityName" className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                {language === 'ar' ? 'اسم المدينة *' : (language === 'am' ? 'የከተማ ስም *' : (language === 'har' ? 'የከተማ ስም *' : 'City Name *'))}
              </label>
              <input
                id="cityName"
                type="text"
                placeholder="e.g. London, Cairo, New York, Addis Ababa"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>
            <div>
              <label htmlFor="countryName" className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                {language === 'ar' ? 'البلد (اختياري)' : (language === 'am' ? 'ሀገር (አማራጭ)' : (language === 'har' ? 'ሀገር (ከተፈለገ)' : 'Country (Optional)'))}
              </label>
              <input
                id="countryName"
                type="text"
                placeholder="e.g. United Kingdom, USA, Egypt"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>
            <div className="sm:col-span-2 md:col-span-1 flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg text-sm transition-colors cursor-pointer select-none disabled:opacity-50"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : null}
                <span>{language === 'ar' ? 'عرض مواقيت الصلاة' : (language === 'am' ? 'የሶላት ሰዓታት አሳይ' : (language === 'har' ? 'ሰላት ወቅታች አሳይ' : 'Get Prayer Times'))}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-5 p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 text-rose-800 dark:text-rose-300 text-xs font-semibold rounded-xl flex items-start gap-2 animate-shake">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 flex-shrink-0" />
          <p className="leading-relaxed">{error}</p>
        </div>
      )}

      {/* Main Prayer Times Content */}
      {loading && !timings ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-600 dark:text-secondary-400 animate-spin" />
          <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">
            {language === 'ar' ? 'جاري حساب مواقيت الصلاة المحلية مع مراعاة التوقيت الصيفي...' : (language === 'am' ? 'የሶላት ሰዓቶችን ከቀን ብርሃን ቆጣቢ ጋር በማስላት ላይ...' : (language === 'har' ? 'ሰላት ወቅታች ከመዓልት ብርሃን ወቅቲ ጋር በማስላት ላይ...' : 'Calculating Local Prayer Times with Daylight Saving Time...'))}
          </p>
        </div>
      ) : timings ? (
        <div className="mt-6">
          {/* Highlighted Jumu'ah / Friday Prayer Card */}
          <div className="bg-gradient-to-r from-primary-800 via-primary-700 to-primary-850 text-white rounded-2xl p-5 sm:p-6 mb-6 shadow-sm border border-secondary-400/20 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl ring-1 ring-secondary-300/30 backdrop-blur-sm">
                <Clock className="w-6 h-6 text-secondary-300" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] bg-secondary-500/20 text-secondary-300 border border-secondary-400/20 px-2 py-0.5 rounded-md font-bold tracking-widest uppercase">
                    {language === 'ar' ? 'خاص بيوم الجمعة' : (language === 'am' ? 'የጁሙዓ ልዩ' : (language === 'har' ? 'ጁምዓ ልዩ' : 'Friday Special'))}
                  </span>
                  {effectiveDstShift > 0 && (
                    <span className="text-[10px] bg-amber-400/20 text-amber-200 border border-amber-300/30 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                      <Sun size={10} />
                      <span>DST +1h</span>
                    </span>
                  )}
                </div>
                <h4 className="text-lg font-bold font-serif tracking-wide mt-1 text-secondary-50">
                  {language === 'ar' ? 'صلاة الجمعة (الظهر)' : (language === 'am' ? 'የጁሙዓ ሶላት (ዙህር)' : (language === 'har' ? 'የጁምዓ ሰላት (ዙህር)' : "Jumu'ah Prayer (Dhuhr)"))}
                </h4>
                <p className="text-xs text-primary-200 mt-0.5">
                  {language === 'ar' ? 'وقت بدء صلاة الجمعة المباركة جماعة' : (language === 'am' ? 'የተባረከው የጁሙዓ የህብረት ሶላት መጀመሪያ ሰዓት' : (language === 'har' ? 'የጁምዓ ጀመዓ ሰላት መጀመሪያ ወቅቲ' : 'The blessed Friday congregational prayer start time'))}
                </p>
              </div>
            </div>
            
            <div className="text-center sm:text-right">
              <div className="text-3xl sm:text-4xl font-extrabold text-secondary-400 tracking-tight font-sans drop-shadow-md">
                {formatTime12h(timings.Dhuhr)}
              </div>
              <p className="text-[10px] text-primary-300 font-mono mt-1">
                {language === 'ar' ? 'تبدأ عند زوال الشمس الفلكي' : (language === 'am' ? 'ፀሐይ እኩለ ቀን ስትሆን (ዘዋል) ይጀምራል' : (language === 'har' ? 'ዛዋል ወቅት ይጀምራል' : 'Starts at Solar Noon (Zawāl)'))}
              </p>
            </div>
          </div>

          {/* Full Daily Prayer Schedule */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>{language === 'ar' ? 'مواقيت الصلاة لليوم كاملاً' : (language === 'am' ? 'የሙሉ ቀን የሶላት ሰዓታት' : (language === 'har' ? 'የሙሉ መዓልት ሰላት ወቅታች' : 'Full Daily Schedule'))}</span>
              </h4>
              <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Clock size={12} />
                <span>{locationTimezone}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { name: 'Fajr', time: timings.Fajr, desc: getPrayerDesc('Fajr') },
                { name: 'Sunrise', time: timings.Sunrise, desc: getPrayerDesc('Sunrise') },
                { name: 'Dhuhr', time: timings.Dhuhr, desc: getPrayerDesc('Dhuhr'), highlight: true },
                { name: 'Asr', time: timings.Asr, desc: getPrayerDesc('Asr') },
                { name: 'Maghrib', time: timings.Maghrib, desc: getPrayerDesc('Maghrib') },
                { name: 'Isha', time: timings.Isha, desc: getPrayerDesc('Isha') }
              ].map((prayer) => (
                <div 
                  key={prayer.name}
                  className={`p-3.5 rounded-xl border transition-all text-center flex flex-col justify-between h-24
                    ${prayer.highlight
                      ? 'bg-primary-50/70 dark:bg-primary-950/40 border-primary-200 dark:border-primary-800 shadow-sm' 
                      : 'bg-white dark:bg-slate-800/80 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50/50'}`}
                >
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-wide flex items-center justify-center gap-1">
                      <span>{getPrayerName(prayer.name)}</span>
                      {prayer.highlight && <span className="w-1.5 h-1.5 rounded-full bg-secondary-500" />}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-medium">{prayer.desc}</div>
                  </div>
                  <div className={`text-sm sm:text-base font-extrabold tracking-tight mt-1
                    ${prayer.highlight ? 'text-primary-700 dark:text-secondary-300' : 'text-slate-700 dark:text-slate-200'}`}>
                    {formatTime12h(prayer.time)}
                  </div>
                </div>
              ))}
            </div>

            {/* Fajr & Sahar Spiritual Secrets Companion Banner */}
            <div className="mt-5 bg-gradient-to-r from-primary-950 via-primary-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-secondary-400/25 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-1 text-left relative z-10">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-extrabold uppercase tracking-wider">
                    <Sparkles size={10} />
                    <span>{language === 'ar' ? 'وثائقي ودليل روحي • ١٤ فصلاً' : '14-Chapter Documentary & Guide'}</span>
                  </span>
                </div>
                <h5 className="text-sm sm:text-base font-bold font-serif text-white">
                  {language === 'ar' ? 'أسرار وقت صلاة الفجر والسحر في الإسلام' : (language === 'am' ? 'በእስልምና የፈጅር ሶላትና የሰሐር ወቅት ምስጢራት' : 'The Secret Time of Fajr Salah & Sahar in Islam')}
                </h5>
                <p className="text-[11px] text-primary-200 leading-relaxed max-w-xl">
                  {language === 'ar'
                    ? 'اكتشف الأسرار الروحية والعلمية للاستيقاظ قبل الشروق، التهجد، اجتماع ملائكة الفجر، بركة الرزق في البكور، وعقد الشيطان الثلاث.'
                    : 'Discover the hidden spiritual & biological wisdom of Tahajjud, Fajr prayer, angelic shift-changes at dawn, Rizq & Barakah, and the 7 post-Fajr Sunnahs.'}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-center relative z-10">
                <button
                  onClick={() => {
                    localStorage.setItem('selectedPoemId', 'fajr-secrets');
                    localStorage.setItem('poetryActiveTab', 'video');
                    window.dispatchEvent(new CustomEvent('navigate-to-section', { detail: 'poetry' }));
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent('open-poetry-work', { detail: { poemId: 'fajr-secrets', tab: 'video', startTime: 0 } }));
                    }, 50);
                  }}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Play size={12} className="fill-current" />
                  <span>{language === 'ar' ? 'شاهد الوثائقي' : 'Watch Video'}</span>
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem('selectedPoemId', 'fajr-secrets');
                    localStorage.setItem('poetryActiveTab', 'text');
                    window.dispatchEvent(new CustomEvent('navigate-to-section', { detail: 'poetry' }));
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent('open-poetry-work', { detail: { poemId: 'fajr-secrets', tab: 'text' } }));
                    }, 50);
                  }}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>{language === 'ar' ? 'الفصول والأدعية' : '14 Chapters'}</span>
                </button>
              </div>
            </div>

            {/* Prayer Settings Master Panel (DST, Method & Azan) */}
            <div className="mt-8 bg-slate-50/70 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
              
              {/* Daylight Saving Time (DST) Section */}
              <div className="pb-5 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
                      <Sun className="w-5 h-5 animate-spin-slow" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                          {t('prayer.dstSetting')}
                        </h5>
                        <button
                          type="button"
                          onClick={() => setShowDstExplainer(!showDstExplainer)}
                          className="text-slate-400 hover:text-primary-600 transition-colors cursor-pointer"
                          title="Learn about Daylight Saving Time & Islamic prayer times"
                        >
                          <Info size={14} />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {t('prayer.dstSettingDesc')}
                      </p>
                    </div>
                  </div>

                  {/* Segmented DST Mode Selector */}
                  <div className="w-full md:w-auto shrink-0">
                    <div className="inline-flex w-full md:w-auto p-1 bg-slate-200/70 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => handleDstModeChange('auto')}
                        className={`flex-1 md:flex-initial px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          dstMode === 'auto'
                            ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-secondary-300 shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        {dstMode === 'auto' && <Check size={12} className="stroke-[3]" />}
                        <span>{t('prayer.dstAuto')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDstModeChange('1')}
                        className={`flex-1 md:flex-initial px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          dstMode === '1'
                            ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-400 shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        {dstMode === '1' && <Check size={12} className="stroke-[3]" />}
                        <span>{t('prayer.dstOn')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDstModeChange('0')}
                        className={`flex-1 md:flex-initial px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          dstMode === '0'
                            ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        {dstMode === '0' && <Check size={12} className="stroke-[3]" />}
                        <span>{t('prayer.dstOff')}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* DST Details & Fine-Tuning Bar */}
                <div className="mt-4 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">
                      {language === 'ar' ? 'المنطقة الزمنية المكتشفة:' : (language === 'am' ? 'የተገኘው የሰዓት ዞን:' : 'Detected Timezone:')}
                    </span>
                    <span className="font-mono px-2 py-0.5 rounded bg-slate-200/50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-bold">
                      {locationTimezone} ({dstInfo.isDst ? 'DST / Summer' : 'Standard / Winter'})
                    </span>
                  </div>

                  {/* Minute Fine-Tuning Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Sliders size={12} />
                      <span>{t('prayer.fineTune')}:</span>
                    </span>
                    {[-10, -5, 0, 5, 10].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => handleFineTuneChange(mins)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          fineTuneMinutes === mins
                            ? 'bg-primary-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {mins === 0 ? '0' : (mins > 0 ? `+${mins}m` : `${mins}m`)}
                      </button>
                    ))}
                    {fineTuneMinutes !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleFineTuneChange(0)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                        title="Reset fine tuning"
                      >
                        <RotateCcw size={12} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Explainer accordion */}
                {showDstExplainer && (
                  <div className="mt-4 p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 text-xs leading-relaxed space-y-2 animate-in fade-in duration-200">
                    <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                      <Sun size={14} className="text-amber-600" />
                      <span>
                        {language === 'ar' 
                          ? 'كيف يؤثر التوقيت الصيفي على مواقيت الصلاة؟' 
                          : (language === 'am' ? 'የቀን ብርሃን ቆጣቢ ሰዓት (DST) በሶላት ወቅቶች ላይ ያለው ተፅዕኖ፡' : 'How Daylight Saving Time (DST) Affects Islamic Prayer Times:')}
                      </span>
                    </div>
                    <p>
                      {language === 'ar'
                        ? 'تعتمد مواقيت الصلاة الإسلامية على المواقع الفلكية الحقيقية للشمس في السماء (الفجر عند انبثاق الفجر الصادق، والظهر عند زوال الشمس عن كبد السماء، والعصر عند بلوغ ظل الشيء مثله، والمغرب عند غروب كامل قرص الشمس، والعشاء عند غياب الشفق الأحمر). عندما تعتمد الحكومات التوقيت الصيفي بتقديم الساعة 60 دقيقة في الصيف، فإن مواقيت الصلاة على ساعتك المدنية تتقدم أيضاً بمقدار ساعة واحدة (+١ ساعة) لتطابق الموقع الشمسي الحقيقي.'
                        : (language === 'am'
                          ? 'የእስልምና የሶላት ወቅቶች በፀሐይ ትክክለኛ የተፈጥሮ አቀማመጥ ላይ የተመሰረቱ ናቸው (ፈጅር በወገግታ፣ ዙህር ፀሐይ እኩለ ቀን ስትያዘነብል፣ ዐስር የጥላው ርዝመት እኩል ሲሆን፣ መግሪብ ፀሐይ ስትጠልቅ፣ ዒሻእ ቀዩ ብርሃን ሲጠፋ)። ሀገራት በበጋ ወቅት የቀን ብርሃን ቆጣቢ ሰዓት ሲያውጁ ሰዓቱን በ60 ደቂቃ ስለሚያራምዱት፣ ሁሉም የሶላት ወቅቶች ከእጅ ሰዓትዎ ጋር እንዲስማሙ በ+1 ሰዓት ይስተካከላሉ።'
                          : 'Islamic prayer times are dictated by precise astronomical solar events (Fajr at astronomical dawn, Dhuhr at solar zawāl/noon, Asr when shadow equals object length, Maghrib at sunset, and Isha at complete dusk). When civil authorities advance clocks by 1 hour (+60 minutes) for Daylight Saving Time, the astronomical solar events occur 1 hour later on civil clocks. This calculator ensures your prayer schedule remains 100% synchronized with your wall clock and local mosque.'
                        )}
                    </p>
                  </div>
                )}
              </div>

              {/* Azan Call to Prayer Settings Panel */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl transition-colors ${azanEnabled ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    {azanEnabled ? <Bell className="w-5 h-5 animate-bounce" /> : <BellOff className="w-5 h-5" />}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100">{t('prayer.azanSetting')}</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t('prayer.azanSettingDesc')}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleAzanToggle(!azanEnabled)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${azanEnabled ? 'bg-secondary-500' : 'bg-slate-200 dark:bg-slate-800'}`}
                  role="switch"
                  aria-checked={azanEnabled}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${azanEnabled ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </div>

              {azanEnabled && (
                <div className="py-4 border-b border-dashed border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex flex-col gap-1 w-full sm:w-auto">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('prayer.selectStyle')}</span>
                    <div className="flex bg-slate-200/70 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => handleStyleChange('makkah')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${azanStyle === 'makkah' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                      >
                        {t('prayer.makkah')}
                      </button>
                      <button
                        onClick={() => handleStyleChange('madinah')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${azanStyle === 'madinah' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                      >
                        {t('prayer.madinah')}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={toggleTestAzan}
                    className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm select-none cursor-pointer
                      ${isTestPlaying 
                        ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/10' 
                        : 'bg-primary-600 hover:bg-primary-700 text-white'}`}
                  >
                    {isTestPlaying ? (
                      <>
                        <Square size={13} className="fill-white" />
                        <span>{t('prayer.stopTest')}</span>
                      </>
                    ) : (
                      <>
                        <Play size={13} className="fill-white" />
                        <span>{t('prayer.playTest')}</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Calculation Method Selection Segment */}
              <div className="pt-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-primary-100 dark:bg-primary-950/40 text-primary-700 dark:text-secondary-400">
                    <Compass className="w-5 h-5 text-primary-600 dark:text-secondary-400" />
                  </div>
                  <div className="text-left">
                    <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {language === 'ar' ? 'طريقة الحساب الفلكي' : 'Calculation Method'}
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {language === 'ar' ? 'اختر طريقة تحديد مواقيت الفجر والعشاء' : 'Select standard astronomical calculation rules'}
                    </p>
                  </div>
                </div>

                <div className="w-full md:w-auto shrink-0 text-left">
                  <select
                    value={calcMethod}
                    onChange={(e) => handleCalcMethodChange(e.target.value)}
                    className="w-full md:w-64 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-800 dark:text-slate-200 font-bold cursor-pointer"
                  >
                    {CALC_METHODS.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty/prompt state when local storage is cleared and permission isn't granted yet */
        <div className="mt-6 bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl py-8 px-6 text-center">
          <MapPin size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {language === 'ar' ? 'يُوصى بالسماح بالوصول لموقعك' : (language === 'am' ? 'የመገኛ ቦታ ፈቃድ ይመከራል' : (language === 'har' ? 'የመገኛ ቦታ ፈቃድ ይመከራል' : 'Location Access Recommended'))}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
            {language === 'ar' ? 'يرجى النقر فوق "تحديد تلقائي" أو البحث عن مدينتك لحساب وقت بدء صلاة الجمعة المحلي بدقة مع التوقيت الصيفي.' : (language === 'am' ? 'ትክክለኛውን የጁሙዓ ሰላት ሰዓት ከቀን ብርሃን ቆጣቢ ጋር በትክክል ለማስላት እባክዎን "በራስ-አግኝ" የሚለውን ይጫኑ ወይም ከተማዎን ይፈልጉ።' : (language === 'har' ? 'ትክክለኛውን የጁምዓ ሰላት ሰዓት ከመዓልት ብርሃን ወቅቲ ጋር ለማስላት እባክዎን "በራሱ-አግኝ" የሚለውን ይጫኑ ወይም ከተማዎን ይፈልጉ።' : 'Please click "Auto-Detect" or search for your city to accurately compute the precise local Jumu\'ah prayer start time with daylight saving time.'))}
          </p>
        </div>
      )}
    </div>
  );
};

export default FridayPrayerTimes;
