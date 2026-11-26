import React, { useState } from 'react';
import { surahTableData } from '../data';
import { useAudio } from './AudioContext';
import { Sun, Shield, Clock, BookOpen, Volume2, VolumeX, ChevronDown, ChevronUp, Play, Pause, RotateCcw } from 'lucide-react';
import { useLanguage } from './LanguageContext';

const AlKahfSection: React.FC = () => {
  const { 
    currentSurah, 
    isPlaying, 
    playSurah, 
    togglePlay, 
    playbackRate, 
    setSpeed,
    currentTime,
    duration,
    seek,
    volume,
    setVolumeState,
    isMuted,
    toggleMute
  } = useAudio();
  const [expandedTheme, setExpandedTheme] = useState<number | null>(null);
  const { t, language, getTranslatedThemes, getTranslatedBenefits } = useLanguage();

  const themes = getTranslatedThemes();
  const benefits = getTranslatedBenefits();

  const alKahfSurah = surahTableData.find(s => s.chapter === 18);
  const isAlKahfActive = currentSurah?.chapter === 18;
  const isAlKahfPlaying = isAlKahfActive && isPlaying;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === null) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePlayClick = () => {
    if (alKahfSurah) {
      if (isAlKahfActive) {
        togglePlay();
      } else {
        playSurah(alKahfSurah);
      }
    }
  };

  const handleSpeedChange = (rate: number) => {
    setSpeed(rate);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isAlKahfActive) {
      seek(parseFloat(e.target.value));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolumeState(parseFloat(e.target.value));
  };

  const handleSkipBackward = () => {
    if (isAlKahfActive) {
      seek(Math.max(0, currentTime - 10));
    }
  };

  const handleSkipForward = () => {
    if (isAlKahfActive) {
      seek(Math.min(duration, currentTime + 10));
    }
  };

  const toggleTheme = (idx: number) => {
    setExpandedTheme(expandedTheme === idx ? null : idx);
  };

  const speeds = [0.75, 1, 1.25, 1.5];

  const getBenefitIcon = (idx: number) => {
      if (idx === 0) return <Sun className="w-5 h-5 text-accent-500" />;
      if (idx === 1) return <Shield className="w-5 h-5 text-primary-500" />;
      return <Clock className="w-5 h-5 text-secondary-500" />;
  };

  return (
    <section className="space-y-12">
      {/* Introduction */}
      <div id="alkahf-header-banner" className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-secondary-200 overflow-hidden">
        <div className="bg-primary-700/95 px-6 py-8 sm:px-10 border-b border-secondary-400">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm ring-1 ring-secondary-400/30">
                <BookOpen className="text-secondary-100 h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white font-serif">{t('kahf.mainRec')}</h2>
                <p className="text-primary-100 mt-1">
                  {language === 'ar' ? 'سورة الكهف • ١٨' : (language === 'am' ? 'ሱረቱል ካህፍ • ምዕራፍ 18' : (language === 'har' ? 'ሱረቱል ካህፍ • ምዕራፍ 18' : 'Chapter 18 • The Cave'))}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open-classic-mushaf-modal', { detail: { page: 293 } }));
                }}
                className="inline-flex items-center justify-center gap-2 bg-secondary-500 hover:bg-secondary-400 text-primary-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 shadow-md hover:scale-105 active:scale-95 cursor-pointer select-none"
              >
                <BookOpen className="w-4 h-4" />
                <span>
                  {language === 'ar' ? 'تصفح الكهف في المصحف المصور' : 'Read in Classic Mushaf'}
                </span>
              </button>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open-quran-study-modal', { detail: { moduleId: 'mod-kahf' } }));
                }}
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 shadow-md hover:scale-105 active:scale-95 cursor-pointer select-none"
              >
                <BookOpen className="w-4 h-4" />
                <span>
                  {language === 'ar' ? 'دراسة السورة وتدبر معانيها' : 'Study & Tafsir Module'}
                </span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-8 sm:px-10">
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            {t('kahf.desc')}
          </p>

          {/* Audio Player Section */}
          <div className="bg-gradient-to-br from-slate-50 to-secondary-50/50 border border-secondary-200 rounded-2xl p-5 sm:p-6 mb-8 shadow-sm flex flex-col gap-5">
            {/* Top Row: Play controls and Speed selection */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-5 w-full">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSkipBackward}
                    disabled={!isAlKahfActive}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-45 disabled:pointer-events-none"
                    title="Backward 10s"
                  >
                    <RotateCcw size={16} className="transform rotate-45" />
                  </button>

                  <button
                    onClick={handlePlayClick}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:ring-offset-2 flex-shrink-0 cursor-pointer shadow-md
                      ${isAlKahfPlaying 
                        ? 'bg-primary-600 text-white hover:bg-primary-700 animate-pulse' 
                        : 'bg-secondary-500 text-primary-950 hover:bg-secondary-400 hover:scale-105 active:scale-95'}`}
                    aria-label={isAlKahfPlaying ? "Pause Surah Al-Kahf" : "Play Surah Al-Kahf"}
                  >
                    {isAlKahfPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
                  </button>

                  <button
                    onClick={handleSkipForward}
                    disabled={!isAlKahfActive}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-45 disabled:pointer-events-none"
                    title="Forward 10s"
                  >
                    <RotateCcw size={16} className="transform -scale-x-100 rotate-45" />
                  </button>
                </div>
                
                <div>
                  <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <span>{t('kahf.listen')}</span>
                    {isAlKahfActive && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{t('kahf.reciter')}</p>
                  {isAlKahfActive && (
                    <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                      {isAlKahfPlaying ? t('kahf.playing') : t('kahf.paused')}
                    </p>
                  )}
                </div>
              </div>

              {/* Speed & Control Info */}
              <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t border-slate-200/60 md:border-t-0 pt-4 md:pt-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-bold">{t('kahf.speed')}</span>
                  <div className="flex bg-slate-200/60 rounded-xl p-1 gap-1">
                    {speeds.map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          playbackRate === speed 
                            ? 'bg-white text-primary-700 shadow-sm' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/40'
                        }`}
                        aria-label={`Set playback speed to ${speed}x`}
                        type="button"
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-200/60 w-full" />

            {/* Bottom Row: Progress Timeline & Volume Control */}
            <div className="flex flex-col md:flex-row items-center gap-4 w-full">
              {/* Progress Slider */}
              <div className="flex-grow w-full flex items-center gap-3">
                <span className="text-xs font-mono text-slate-500 min-w-[35px] text-right">
                  {formatTime(isAlKahfActive ? currentTime : 0)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={isAlKahfActive ? (duration || 952) : 952}
                  value={isAlKahfActive ? currentTime : 0}
                  onChange={handleProgressChange}
                  disabled={!isAlKahfActive}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600 hover:accent-primary-700 focus:outline-none disabled:opacity-50"
                  style={{
                    background: `linear-gradient(to right, #0369a1 ${isAlKahfActive && duration ? (currentTime / duration) * 100 : 0}%, #e2e8f0 ${isAlKahfActive && duration ? (currentTime / duration) * 100 : 0}%)`
                  }}
                />
                <span className="text-xs font-mono text-slate-500 min-w-[35px]">
                  {formatTime(isAlKahfActive ? duration : 952)}
                </span>
              </div>

              {/* Volume & Mute control */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer select-none"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 sm:w-24 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-500 hover:accent-primary-600 focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #64748b ${isMuted ? 0 : volume * 100}%, #e2e8f0 ${isMuted ? 0 : volume * 100}%)`
                  }}
                  title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                />
              </div>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow hover:border-secondary-200">
                <div className="flex items-center gap-3 mb-3">
                    {getBenefitIcon(idx)}
                    <h3 className="font-semibold text-slate-900">{benefit.title}</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{benefit.content}</p>
              </div>
            ))}
          </div>

          {/* Themes Section */}
          <div className="border-t border-slate-100 pt-8">
            <h3 className="text-xl font-bold text-slate-800 mb-6 font-serif">{t('kahf.themes')}</h3>
            <p className="text-sm text-slate-500 mb-4">{t('kahf.clickStory')}</p>
            <div className="grid sm:grid-cols-2 gap-4">
               {themes.map((theme, idx) => (
                 <div 
                    key={idx} 
                    onClick={() => toggleTheme(idx)}
                    className={`cursor-pointer transition-all duration-300 rounded-lg border ${expandedTheme === idx ? 'bg-primary-50 border-primary-200 shadow-md ring-1 ring-primary-200' : 'bg-white border-slate-100 hover:border-secondary-300 hover:shadow-sm'}`}
                 >
                    <div className="flex gap-4 p-4">
                      <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm h-fit mt-1 transition-colors ${expandedTheme === idx ? 'bg-primary-100 text-primary-700' : 'bg-secondary-100 text-secondary-700'}`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                           <h4 className="font-semibold text-slate-900 mb-1">{theme.title}</h4>
                           {expandedTheme === idx ? <ChevronUp size={16} className="text-primary-400 mt-1 flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-400 mt-1 flex-shrink-0" />}
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{theme.description}</p>
                        
                        {/* Expanded Content */}
                        <div className={`grid transition-all duration-300 ease-in-out ${expandedTheme === idx ? 'grid-rows-[1fr] opacity-100 mt-3 pt-3 border-t border-primary-100/50' : 'grid-rows-[0fr] opacity-0 h-0 pointer-events-none'}`}>
                           <div className="overflow-hidden">
                              <p className="text-sm text-slate-700 leading-relaxed italic">
                                 "{theme.fullStory}"
                              </p>
                           </div>
                        </div>
                      </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AlKahfSection;