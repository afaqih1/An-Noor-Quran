import React, { useMemo, useEffect, useState } from 'react';
import { Play, Pause, Square, Gauge, Volume2, VolumeX, Info, Check } from 'lucide-react';
import { useTTS } from './TTSContext';
import { HighlightableText } from './HighlightableText';
import { useLanguage } from './LanguageContext';

interface DuaAudioPlayerProps {
  arabicText: string;
  translationText?: string;
  transliterationText?: string;
  title?: string;
  className?: string;
  showTransliteration?: boolean;
  showTranslation?: boolean;
}

export const DuaAudioPlayer: React.FC<DuaAudioPlayerProps> = ({
  arabicText,
  translationText,
  transliterationText,
  title,
  className = '',
  showTransliteration: propShowTransliteration,
  showTranslation: propShowTranslation,
}) => {
  const { 
    language, 
    showDuaTransliteration, 
    setShowDuaTransliteration, 
    showDuaTranslation, 
    setShowDuaTranslation 
  } = useLanguage();
  const {
    isSpeaking,
    isPaused,
    isLoading,
    activeText,
    currentCharIndex,
    rate,
    setRate,
    speak,
    stop,
    pause,
    resume
  } = useTTS();

  const effectiveShowTransliteration = propShowTransliteration !== undefined ? propShowTransliteration : showDuaTransliteration;
  const effectiveShowTranslation = propShowTranslation !== undefined ? propShowTranslation : showDuaTranslation;

  const isCurrentActive = isSpeaking && activeText === arabicText;
  const isCurrentLoading = isLoading && activeText === arabicText;

  // Calculate approximate word count
  const wordsCount = useMemo(() => {
    return arabicText.trim().split(/\s+/).length;
  }, [arabicText]);

  // Estimate progress based on character index
  const progressPercent = useMemo(() => {
    if (!isCurrentActive || currentCharIndex < 0) return 0;
    return Math.min(100, Math.round((currentCharIndex / arabicText.length) * 100));
  }, [isCurrentActive, currentCharIndex, arabicText]);

  // Current word tracking
  const currentWordIndex = useMemo(() => {
    if (!isCurrentActive || currentCharIndex < 0) return 0;
    const prefix = arabicText.substring(0, currentCharIndex);
    return prefix.trim().split(/\s+/).length;
  }, [isCurrentActive, currentCharIndex, arabicText]);

  const handlePlayPause = () => {
    if (isCurrentActive) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      speak(arabicText, 'ar');
    }
  };

  const handleStop = () => {
    if (isCurrentActive) {
      stop();
    }
  };

  const speeds = [0.6, 0.8, 1.0, 1.2, 1.5];

  // Localized texts
  const tPlayer = {
    play: language === 'ar' ? 'تشغيل التلاوة' : language === 'am' ? 'ማጫወቻ' : 'Play Recitation',
    pause: language === 'ar' ? 'إيقاف مؤقت' : language === 'am' ? 'ለጊዜው ማቆሚያ' : 'Pause',
    stop: language === 'ar' ? 'إيقاف' : language === 'am' ? 'ማቆሚያ' : 'Stop',
    speed: language === 'ar' ? 'السرعة' : language === 'am' ? 'ፍጥነት' : 'Speed',
    translation: language === 'ar' ? 'الترجمة' : language === 'am' ? 'ትርጉም' : 'Translation',
    transliteration: language === 'ar' ? 'اللفظ' : language === 'am' ? 'አነባብ' : 'Transliteration',
    ready: language === 'ar' ? 'جاهز للاستماع' : language === 'am' ? 'ለመደመጥ ዝግጁ' : 'Ready to listen',
    playing: language === 'ar' ? 'جاري الاستماع...' : language === 'am' ? 'በመጫወት ላይ...' : 'Reciting...',
    paused: language === 'ar' ? 'موقوف مؤقتاً' : language === 'am' ? 'ለጊዜው የቆመ' : 'Paused',
    loading: language === 'ar' ? 'جاري التحميل...' : language === 'am' ? 'በመጫን ላይ...' : 'Loading audio...',
    wordProgress: language === 'ar' ? 'الكلمة' : 'Word',
    of: language === 'ar' ? 'من' : 'of',
  };

  return (
    <div className={`bg-slate-50/70 dark:bg-slate-900/40 rounded-xl p-4 border border-secondary-200/60 dark:border-slate-800/60 space-y-4 ${className}`} id={`dua-player-${title?.toLowerCase().replace(/\s+/g, '-')}`}>
      {/* Header bar of the player */}
      <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-primary-700 dark:text-primary-400 flex items-center gap-1.5 font-mono">
          <span className="relative flex h-2 w-2">
            {isCurrentActive && !isPaused && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isCurrentActive && !isPaused ? 'bg-emerald-500' : isCurrentLoading ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'}`}></span>
          </span>
          {isCurrentLoading ? tPlayer.loading : isCurrentActive ? (isPaused ? tPlayer.paused : tPlayer.playing) : tPlayer.ready}
        </span>
        
        {/* Simple Audio Waveform Animation */}
        {isCurrentActive && !isPaused && (
          <div className="flex items-end gap-[2px] h-3">
            <span className="w-[3px] bg-primary-600 rounded-full animate-[wave_1s_ease-in-out_infinite_0.1s] h-1.5" />
            <span className="w-[3px] bg-primary-600 rounded-full animate-[wave_1s_ease-in-out_infinite_0.3s] h-3" />
            <span className="w-[3px] bg-primary-600 rounded-full animate-[wave_1s_ease-in-out_infinite_0s] h-2" />
            <span className="w-[3px] bg-primary-600 rounded-full animate-[wave_1s_ease-in-out_infinite_0.5s] h-3.5" />
            <span className="w-[3px] bg-primary-600 rounded-full animate-[wave_1s_ease-in-out_infinite_0.2s] h-1.5" />
          </div>
        )}
      </div>

      {/* Recitation Content View (Enlarged and interactive) */}
      <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-secondary-200/40 dark:border-slate-800/40 text-center space-y-4 shadow-2xs relative">
        <p className="font-arabic text-2xl sm:text-3xl !leading-[2.5] text-slate-800 dark:text-slate-100 select-all" dir="rtl">
          <HighlightableText text={arabicText} lang="ar" />
        </p>

        {/* Transliteration subtitle */}
        {transliterationText && effectiveShowTransliteration && (
          <p className="text-xs sm:text-sm font-serif text-slate-600 dark:text-slate-300 italic max-w-xl mx-auto leading-relaxed">
            {transliterationText}
          </p>
        )}

        {/* Translation subtitle */}
        {translationText && effectiveShowTranslation && (
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed border-t border-slate-100 dark:border-slate-900 pt-2.5">
            "{translationText}"
          </p>
        )}
      </div>

      {/* Timeline progress line */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono text-slate-400 font-semibold">
          <span>{progressPercent}%</span>
          {isCurrentActive && currentCharIndex >= 0 && (
            <span>
              {tPlayer.wordProgress} {currentWordIndex} {tPlayer.of} {wordsCount}
            </span>
          )}
        </div>
        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-700 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Control buttons panel */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          {/* Main Play/Pause */}
          <button
            onClick={handlePlayPause}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm select-none cursor-pointer focus:ring-2 focus:ring-primary-500/40 focus:outline-none min-h-[38px]
              ${isCurrentActive && !isPaused
                ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                : 'bg-primary-700 hover:bg-primary-800 text-white'}`}
            title={isCurrentActive && !isPaused ? tPlayer.pause : tPlayer.play}
            type="button"
          >
            {isCurrentActive && !isPaused ? (
              <>
                <Pause className="w-4 h-4 fill-white text-white" />
                <span>{tPlayer.pause}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white text-white" />
                <span>{tPlayer.play}</span>
              </>
            )}
          </button>

          {/* Stop / Reset */}
          <button
            onClick={handleStop}
            disabled={!isCurrentActive}
            className={`p-2 rounded-xl border transition-all cursor-pointer select-none min-h-[38px] min-w-[38px] flex items-center justify-center
              ${isCurrentActive 
                ? 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800' 
                : 'bg-slate-100 dark:bg-slate-900 text-slate-300 dark:text-slate-700 border-slate-200 dark:border-slate-850 cursor-not-allowed'}`}
            title={tPlayer.stop}
            type="button"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Speed & Toggles Control Group */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {/* Custom Playback Speed Controller */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-950 border border-secondary-200 dark:border-slate-800 rounded-xl px-2 py-1 shadow-2xs">
            <Gauge className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-500 font-mono hidden xs:inline">{tPlayer.speed}:</span>
            <div className="flex items-center gap-0.5">
              {speeds.map((s) => {
                const isSelected = Math.abs(rate - s) < 0.05 || (s === 1.0 && rate === 1);
                return (
                  <button
                    key={s}
                    onClick={() => setRate(s)}
                    className={`px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-extrabold font-mono transition-all cursor-pointer select-none
                    ${isSelected 
                      ? 'bg-primary-100 dark:bg-primary-950 text-primary-800 dark:text-primary-300' 
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}
                  >
                    {s}x
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subtitles Visibility Toggles */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowDuaTransliteration(!effectiveShowTransliteration)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer select-none
                ${effectiveShowTransliteration 
                  ? 'bg-secondary-50 dark:bg-slate-900 border-secondary-200 dark:border-slate-800 text-secondary-800 dark:text-slate-300' 
                  : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-900 text-slate-400'}`}
              title={tPlayer.transliteration}
              type="button"
            >
              Ab
            </button>
            <button
              onClick={() => setShowDuaTranslation(!effectiveShowTranslation)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer select-none
                ${effectiveShowTranslation 
                  ? 'bg-secondary-50 dark:bg-slate-900 border-secondary-200 dark:border-slate-800 text-secondary-800 dark:text-slate-300' 
                  : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-900 text-slate-400'}`}
              title={tPlayer.translation}
              type="button"
            >
              Tr
            </button>
          </div>
        </div>
      </div>
      
      {/* Help Note on Pronunciation */}
      <div className="text-[10px] text-slate-400 flex items-start gap-1.5 leading-relaxed">
        <Info className="w-3.5 h-3.5 text-slate-300 shrink-0 mt-0.5" />
        <span>Use the playback speed controllers above to slow down recitation (e.g., 0.6x or 0.8x) to hear the tajweed rules and vowel movements clearly. Words highlight in real time to guide your eye.</span>
      </div>
    </div>
  );
};
