import React, { useState, useEffect, useRef } from 'react';
import { useTTS } from './TTSContext';
import { 
  Play, Pause, Square, Volume2, VolumeX, Sparkles, 
  Settings, ChevronUp, ChevronDown, Sliders, Check, 
  Globe, Info, Mic, Eye
} from 'lucide-react';
import { useLanguage } from './LanguageContext';

export const TTSActivePlayer: React.FC = () => {
  const { language, t } = useLanguage();
  const {
    isSpeaking,
    isPaused,
    isLoading,
    activeText,
    activeLang,
    currentCharIndex,
    rate,
    pitch,
    volume,
    selectedArVoice,
    selectedEnVoice,
    highlightEnabled,
    arVoices,
    enVoices,
    setRate,
    setPitch,
    setVolume,
    setSelectedArVoice,
    setSelectedEnVoice,
    setHighlightEnabled,
    stop,
    pause,
    resume,
    speak
  } = useTTS();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showVoiceSelect, setShowVoiceSelect] = useState(false);
  const [showSliders, setShowSliders] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  // Auto-expand on load or if text starts speaking
  useEffect(() => {
    if (isSpeaking) {
      // Keep it compact by default, but ready for controls
    } else {
      setIsExpanded(false);
      setShowVoiceSelect(false);
      setShowSliders(false);
    }
  }, [isSpeaking]);

  if (!isSpeaking && !isLoading) return null;

  // Progress estimation (mathematical fraction based on current character index)
  const estimatedProgress = activeText && currentCharIndex > 0 
    ? Math.min(100, Math.max(0, (currentCharIndex / activeText.length) * 100)) 
    : 0;

  const currentVoiceName = activeLang === 'ar' ? selectedArVoice : selectedEnVoice;
  const currentVoicesList = activeLang === 'ar' ? arVoices : enVoices;

  const handleVoiceChange = (voiceName: string) => {
    if (activeLang === 'ar') {
      setSelectedArVoice(voiceName);
    } else {
      setSelectedEnVoice(voiceName);
    }
    // Re-speak with the new voice if currently active
    if (activeText) {
      speak(activeText, activeLang!);
    }
  };

  const getLanguageLabel = () => {
    if (activeLang === 'ar') {
      return language === 'ar' ? 'العربية' : 'Arabic';
    }
    return language === 'ar' ? 'الإنجليزية' : 'English';
  };

  return (
    <div 
      ref={playerRef}
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg 
        bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl
        border border-primary-150/60 dark:border-slate-800/80
        shadow-2xl rounded-2xl transition-all duration-300 overflow-hidden
        animate-in fade-in slide-in-from-bottom-5 duration-300`}
      dir="ltr"
    >
      {/* Mini Progress Bar on Top */}
      <div className="w-full h-1 bg-slate-100 dark:bg-slate-900 overflow-hidden">
        <div 
          className="h-full bg-secondary-500 transition-all duration-200"
          style={{ width: `${estimatedProgress}%` }}
        />
      </div>

      <div className="p-3.5 space-y-3">
        {/* Upper Dashboard: Title & Active Text Preview */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase bg-primary-100 text-primary-800 dark:bg-primary-950/60 dark:text-primary-400">
                {getLanguageLabel()} TTS
              </span>
              {isLoading && (
                <span className="text-[9px] text-primary-500 dark:text-primary-400 animate-pulse font-medium">
                  {language === 'ar' ? 'جاري التحضير...' : 'Preparing voice...'}
                </span>
              )}
              {!isLoading && currentVoiceName && (
                <span className="text-[10px] text-slate-400 max-w-[120px] truncate" title={currentVoiceName}>
                  🗣️ {currentVoiceName.split(' ')[0]}
                </span>
              )}
            </div>
            
            {/* Scroller Text Preview */}
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate italic" dir={activeLang === 'ar' ? 'rtl' : 'ltr'}>
              "{activeText}"
            </p>
          </div>

          {/* Quick Playback controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            {isPaused ? (
              <button
                onClick={resume}
                title="Resume speech"
                className="w-8 h-8 rounded-full bg-secondary-500 hover:bg-secondary-600 text-primary-950 flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
              >
                <Play size={14} className="fill-current ml-0.5" />
              </button>
            ) : (
              <button
                onClick={pause}
                title="Pause speech"
                className="w-8 h-8 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
              >
                <Pause size={14} className="fill-current" />
              </button>
            )}

            <button
              onClick={stop}
              title="Stop recitation"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
            >
              <Square size={12} className="fill-current text-red-500 dark:text-red-400" />
            </button>

            {/* Toggle Settings expand */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white cursor-pointer"
            >
              {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
          </div>
        </div>

        {/* Collapsible Expanded panel (Voice settings, Speed, Highlighting, Pitch, etc.) */}
        {isExpanded && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-900 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
            
            {/* Speed Controller Grid */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {language === 'ar' ? 'سرعة القراءة:' : 'Speech Speed:'}
              </span>
              <div className="flex items-center gap-1.5">
                {[0.75, 1.0, 1.25, 1.5, 1.75].map((s) => (
                  <button
                    key={s}
                    onClick={() => setRate(s)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold font-mono border transition-all cursor-pointer
                      ${rate === s 
                        ? 'bg-primary-600 text-white border-primary-600 shadow-xs' 
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                      }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Premium Settings Row: Highlight toggle & sliders toggle & voice menu toggle */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              
              {/* Highlight toggle */}
              <button
                onClick={() => setHighlightEnabled(!highlightEnabled)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border
                  ${highlightEnabled 
                    ? 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-900/40 dark:text-amber-400' 
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
              >
                <Eye size={13} className={highlightEnabled ? "text-amber-500" : "opacity-60"} />
                <span>{language === 'ar' ? 'تحديد الكلمات' : 'Word Highlight'}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-white dark:bg-slate-800 shadow-xs border border-slate-200/50">
                  {highlightEnabled ? 'ON' : 'OFF'}
                </span>
              </button>

              <div className="flex items-center gap-2">
                {/* Advanced Sliders Toggle */}
                <button
                  onClick={() => {
                    setShowSliders(!showSliders);
                    setShowVoiceSelect(false);
                  }}
                  className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 cursor-pointer transition-all
                    ${showSliders 
                      ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-slate-900 dark:border-slate-700 dark:text-white' 
                      : 'bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  title="Advanced Tuning"
                >
                  <Sliders size={14} />
                  <span>{language === 'ar' ? 'ضبط الصوت' : 'Vocal Adjustments'}</span>
                </button>

                {/* Voice Selection Toggle */}
                <button
                  onClick={() => {
                    setShowVoiceSelect(!showVoiceSelect);
                    setShowSliders(false);
                  }}
                  className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 cursor-pointer transition-all
                    ${showVoiceSelect 
                      ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-slate-900 dark:border-slate-700 dark:text-white' 
                      : 'bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                >
                  <Globe size={14} />
                  <span>{language === 'ar' ? 'تغيير الصوت' : 'Select Voice'}</span>
                </button>
              </div>
            </div>

            {/* Vocal Adjustments Panels (Volume & Pitch) */}
            {showSliders && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Volume Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                      <span>{language === 'ar' ? 'حجم الصوت' : 'Volume'}</span>
                      <span className="font-mono">{Math.round(volume * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Volume2 size={12} className="text-slate-400" />
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="flex-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-600"
                      />
                    </div>
                  </div>

                  {/* Pitch Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                      <span>{language === 'ar' ? 'طبقة الصوت' : 'Voice Pitch'}</span>
                      <span className="font-mono">{pitch.toFixed(1)}x</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mic size={12} className="text-slate-400" />
                      <input
                        type="range"
                        min={0.5}
                        max={1.5}
                        step={0.1}
                        value={pitch}
                        onChange={(e) => setPitch(parseFloat(e.target.value))}
                        className="flex-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-600"
                      />
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Voice Options Select Dropdown list */}
            {showVoiceSelect && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                  {language === 'ar' ? 'الأصوات المتاحة بجهازك:' : 'Available system voices on this device:'}
                </label>
                
                {currentVoicesList.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    {language === 'ar' ? 'لم يتم العثور على أصوات مخصصة لهذا النص.' : 'No specific system voices found. Using browser default.'}
                  </p>
                ) : (
                  <div className="max-h-36 overflow-y-auto space-y-1 rounded-lg border border-slate-200/50 dark:border-slate-800 p-1 bg-white dark:bg-slate-950">
                    {currentVoicesList.map((voice) => {
                      const isSelected = voice.name === currentVoiceName;
                      return (
                        <button
                          key={voice.name}
                          onClick={() => handleVoiceChange(voice.name)}
                          className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between gap-2 transition-all cursor-pointer
                            ${isSelected 
                              ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400 font-bold' 
                              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900'
                            }`}
                        >
                          <span className="truncate">{voice.name} ({voice.lang})</span>
                          {isSelected && <Check size={12} className="text-primary-600 dark:text-primary-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
                
                <span className="text-[9px] text-slate-400 leading-normal block">
                  ℹ️ {language === 'ar' 
                    ? 'التحسينات تستخدم محركات التخليق الصوتي المثبتة في متصفحك بشكل آمن وخاص.' 
                    : 'Voice options vary depending on your device, operating system, and browser (e.g. Chrome/iOS provides premium high-quality voices).'}
                </span>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default TTSActivePlayer;
