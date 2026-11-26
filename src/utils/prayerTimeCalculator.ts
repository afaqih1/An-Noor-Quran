/**
 * Comprehensive Islamic Prayer Time & Daylight Saving Time (DST) Calculator
 * Supports:
 * - Real astronomical solar position formulas (declination, equation of time, solar noon)
 * - Standard Islamic calculation authorities (ISNA, MWL, Umm Al-Qura, Egyptian, Karachi, etc.)
 * - Automatic and manual Daylight Saving Time (DST / Day-Time Saving) adjustments
 * - Timezone-aware DST detection (Northern and Southern hemispheres)
 */

export type DstMode = 'auto' | '1' | '0';

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset?: string;
  Maghrib: string;
  Isha: string;
  Imsak?: string;
  Midnight?: string;
}

export interface DstInfo {
  isDst: boolean;
  dstOffsetMinutes: number;
  standardOffsetMinutes: number;
  currentOffsetMinutes: number;
  timezone: string;
  summary: string;
}

export interface CalcMethodConfig {
  id: string;
  name: string;
  fajrAngle: number;
  ishaAngle?: number;
  ishaMinutes?: number; // Some methods (e.g. Umm Al-Qura) use fixed minutes after Maghrib
  maghribMinutes?: number;
}

export const METHOD_CONFIGS: Record<string, CalcMethodConfig> = {
  '1': { id: '1', name: 'University of Islamic Sciences, Karachi', fajrAngle: 18, ishaAngle: 18 },
  '2': { id: '2', name: 'Islamic Society of North America (ISNA)', fajrAngle: 15, ishaAngle: 15 },
  '3': { id: '3', name: 'Muslim World League (MWL)', fajrAngle: 18, ishaAngle: 17 },
  '4': { id: '4', name: 'Umm Al-Qura University, Makkah', fajrAngle: 18.5, ishaMinutes: 90 },
  '5': { id: '5', name: 'Egyptian General Authority of Survey', fajrAngle: 19.5, ishaAngle: 17.5 },
  '7': { id: '7', name: 'Institute of Geophysics, University of Tehran', fajrAngle: 17.7, ishaAngle: 14 },
  '8': { id: '8', name: 'Gulf Region', fajrAngle: 19.5, ishaMinutes: 90 },
  '9': { id: '9', name: 'Kuwait', fajrAngle: 18, ishaAngle: 17.5 },
  '10': { id: '10', name: 'Qatar', fajrAngle: 18, ishaMinutes: 90 },
  '11': { id: '11', name: 'Majlis Ugama Islam Singapura, Singapore', fajrAngle: 20, ishaAngle: 18 },
  '12': { id: '12', name: 'Union Organisation Islamique de France', fajrAngle: 12, ishaAngle: 12 },
  '13': { id: '13', name: 'Diyanet İşleri Başkanlığı, Turkey', fajrAngle: 18, ishaAngle: 17 },
  '14': { id: '14', name: 'Spiritual Administration of Muslims of Russia', fajrAngle: 16, ishaAngle: 15 },
};

/**
 * Determine whether a given timezone (or local browser) is currently observing Daylight Saving Time
 */
export function getDstInfo(timezone?: string, date = new Date()): DstInfo {
  const resolvedTz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: resolvedTz,
      timeZoneName: 'shortOffset'
    });

    const getOffset = (d: Date): number => {
      const parts = formatter.formatToParts(d);
      const tzStr = parts.find(p => p.type === 'timeZoneName')?.value || 'GMT+0';
      const match = tzStr.match(/GMT([+-])(\d+)(?::(\d+))?/);
      if (!match) return 0;
      const sign = match[1] === '+' ? 1 : -1;
      const hours = parseInt(match[2], 10);
      const mins = match[3] ? parseInt(match[3], 10) : 0;
      return sign * (hours * 60 + mins);
    };

    const currentOffset = getOffset(date);
    const janOffset = getOffset(new Date(date.getFullYear(), 0, 15));
    const julOffset = getOffset(new Date(date.getFullYear(), 6, 15));

    // Standard offset is winter time, which is Math.min(janOffset, julOffset) in both hemispheres
    const standardOffset = Math.min(janOffset, julOffset);
    const isDst = currentOffset > standardOffset;
    const dstOffsetMinutes = isDst ? currentOffset - standardOffset : 0;

    return {
      isDst,
      dstOffsetMinutes,
      standardOffsetMinutes: standardOffset,
      currentOffsetMinutes: currentOffset,
      timezone: resolvedTz,
      summary: isDst 
        ? `Daylight Saving Time (+${Math.round(dstOffsetMinutes / 60)}h)` 
        : 'Standard Time (No DST)'
    };
  } catch (err) {
    // Fallback to browser offset
    const jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
    const jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
    const standardOffset = Math.max(jan, jul);
    const isDst = date.getTimezoneOffset() < standardOffset;
    const dstOffsetMinutes = isDst ? standardOffset - date.getTimezoneOffset() : 0;

    return {
      isDst,
      dstOffsetMinutes,
      standardOffsetMinutes: -standardOffset,
      currentOffsetMinutes: -date.getTimezoneOffset(),
      timezone: resolvedTz,
      summary: isDst ? 'Daylight Saving Time (+1h)' : 'Standard Time (No DST)'
    };
  }
}

/**
 * Adjust an HH:mm prayer time string by a given minute delta
 */
export function adjustTimeString(timeStr: string, deltaMinutes: number): string {
  if (!timeStr || deltaMinutes === 0) return timeStr;
  const clean = timeStr.split(' ')[0];
  const [hStr, mStr] = clean.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h) || isNaN(m)) return timeStr;

  let totalMinutes = h * 60 + m + deltaMinutes;
  // Wrap around 24 hours (1440 minutes)
  totalMinutes = ((totalMinutes % 1440) + 1440) % 1440;

  const newH = Math.floor(totalMinutes / 60);
  const newM = totalMinutes % 60;

  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

/**
 * Apply daylight saving mode and custom minute adjustments to a prayer timings object.
 * 
 * - rawTimings: The timings directly received from API or astronomical calculation.
 * - rawIncludedDst: True if the raw timings already incorporated the location's DST (+1h) for that date.
 * - dstMode:
 *    - 'auto': Keep natural DST (if raw was DST, stay DST; if raw was standard, stay standard).
 *    - '1': Force Daylight Saving Time (+1h). If raw was standard, add 60 minutes.
 *    - '0': Force Standard Time (0h / no DST). If raw was DST, subtract 60 minutes.
 * - fineTuneMinutes: Additional fine-tuning in minutes (e.g. +/- minutes for local mosque conformity).
 */
export function applyDstAndTune(
  rawTimings: PrayerTimings,
  rawIncludedDst: boolean,
  dstMode: DstMode,
  fineTuneMinutes = 0
): { adjustedTimings: PrayerTimings; effectiveDstShiftMinutes: number } {
  let dstDelta = 0;

  if (dstMode === '1') {
    // User wants DST (+1h)
    dstDelta = rawIncludedDst ? 0 : 60;
  } else if (dstMode === '0') {
    // User wants Standard Time (No DST)
    dstDelta = rawIncludedDst ? -60 : 0;
  } else {
    // 'auto': raw already matches natural calendar for that location
    dstDelta = 0;
  }

  const totalDelta = dstDelta + fineTuneMinutes;

  const adjusted: PrayerTimings = {
    Fajr: adjustTimeString(rawTimings.Fajr, totalDelta),
    Sunrise: adjustTimeString(rawTimings.Sunrise, totalDelta),
    Dhuhr: adjustTimeString(rawTimings.Dhuhr, totalDelta),
    Asr: adjustTimeString(rawTimings.Asr, totalDelta),
    Maghrib: adjustTimeString(rawTimings.Maghrib, totalDelta),
    Isha: adjustTimeString(rawTimings.Isha, totalDelta),
  };

  if (rawTimings.Sunset) adjusted.Sunset = adjustTimeString(rawTimings.Sunset, totalDelta);
  if (rawTimings.Imsak) adjusted.Imsak = adjustTimeString(rawTimings.Imsak, totalDelta);
  if (rawTimings.Midnight) adjusted.Midnight = adjustTimeString(rawTimings.Midnight, totalDelta);

  const effectiveDstShiftMinutes = (rawIncludedDst ? 60 : 0) + dstDelta;

  return {
    adjustedTimings: adjusted,
    effectiveDstShiftMinutes
  };
}

// -------------------------------------------------------------
// Offline Astronomical Prayer Times Calculator (Solar Equation)
// -------------------------------------------------------------

function d2r(d: number) { return (d * Math.PI) / 180.0; }
function r2d(r: number) { return (r * 180.0) / Math.PI; }
function sinD(d: number) { return Math.sin(d2r(d)); }
function cosD(d: number) { return Math.cos(d2r(d)); }
function tanD(d: number) { return Math.tan(d2r(d)); }
function arccosD(x: number) { return r2d(Math.acos(Math.max(-1, Math.min(1, x)))); }

/**
 * Calculate offline astronomical prayer times when network is unavailable
 */
export function calculateAstronomicalPrayerTimes(
  latitude: number,
  longitude: number,
  date = new Date(),
  methodId = '2',
  timezoneOffsetHours?: number
): PrayerTimings {
  // Day of year
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86400000) + 1;

  // Approximate Solar Declination (degrees)
  // Spencer (1971) / Cooper (1969)
  const b = (2 * Math.PI * (dayOfYear - 81)) / 365;
  const declination = 23.45 * Math.sin(b);

  // Equation of Time in minutes
  // EoT = 9.87 * sin(2B) - 7.53 * cos(B) - 1.5 * sin(B)
  const eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);

  // Local Timezone Offset in hours (standard/current)
  const tzOffset = timezoneOffsetHours !== undefined 
    ? timezoneOffsetHours 
    : -date.getTimezoneOffset() / 60;

  // Solar Noon (Dhuhr) in fractional hours
  // Noon = 12 + tzOffset - (longitude / 15) - (EoT / 60)
  const dhuhrHour = 12 + tzOffset - (longitude / 15) - (eot / 60);

  // Method angles
  const method = METHOD_CONFIGS[methodId] || METHOD_CONFIGS['2'];
  const fajrAngle = method.fajrAngle;
  const ishaAngle = method.ishaAngle ?? 15;

  // Hour angle calculation for a specific solar zenith angle
  const hourAngleForZenith = (zenithAngle: number): number => {
    const cosHA = (cosD(zenithAngle) - sinD(latitude) * sinD(declination)) /
                  (cosD(latitude) * cosD(declination));
    if (cosHA > 1) return 0; // sun never reaches this angle
    if (cosHA < -1) return 180;
    return arccosD(cosHA);
  };

  // Sunrise and Sunset: Sun disk altitude -0.833° (zenith 90.833°)
  const sunRiseSetHA = hourAngleForZenith(90.833);
  const sunriseHour = dhuhrHour - (sunRiseSetHA / 15);
  const sunsetHour = dhuhrHour + (sunRiseSetHA / 15);

  // Fajr: Zenith = 90 + fajrAngle
  const fajrHA = hourAngleForZenith(90 + fajrAngle);
  const fajrHour = dhuhrHour - (fajrHA / 15);

  // Isha: Zenith = 90 + ishaAngle (or fixed minutes after Maghrib)
  let ishaHour = 0;
  if (method.ishaMinutes) {
    ishaHour = sunsetHour + (method.ishaMinutes / 60);
  } else {
    const ishaHA = hourAngleForZenith(90 + ishaAngle);
    ishaHour = dhuhrHour + (ishaHA / 15);
  }

  // Asr: Standard Shafi'i shadow = 1 + tan|lat - dec|
  // Zenith = acot(shadow + tan|lat - dec|)
  const latDecDiff = Math.abs(latitude - declination);
  const asrAltitude = r2d(Math.atan(1 / (1 + tanD(latDecDiff))));
  const asrZenith = 90 - asrAltitude;
  const asrHA = hourAngleForZenith(asrZenith);
  const asrHour = dhuhrHour + (asrHA / 15);

  const formatFractionalHour = (fh: number): string => {
    let normalized = ((fh % 24) + 24) % 24;
    const hours = Math.floor(normalized);
    const minutes = Math.round((normalized - hours) * 60);
    const finalH = minutes === 60 ? (hours + 1) % 24 : hours;
    const finalM = minutes === 60 ? 0 : minutes;
    return `${String(finalH).padStart(2, '0')}:${String(finalM).padStart(2, '0')}`;
  };

  return {
    Fajr: formatFractionalHour(fajrHour),
    Sunrise: formatFractionalHour(sunriseHour),
    Dhuhr: formatFractionalHour(dhuhrHour),
    Asr: formatFractionalHour(asrHour),
    Sunset: formatFractionalHour(sunsetHour),
    Maghrib: formatFractionalHour(sunsetHour),
    Isha: formatFractionalHour(ishaHour),
  };
}
