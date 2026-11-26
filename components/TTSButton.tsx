import React from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useTTS } from './TTSContext';

interface TTSButtonProps {
  text: string;
  lang: 'ar' | 'en' | 'am';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  tooltipText?: string;
}

export const TTSButton: React.FC<TTSButtonProps> = ({
  text,
  lang,
  size = 'sm',
  className = '',
  tooltipText
}) => {
  const { language } = useLanguage();
  const { isSpeaking, isLoading, activeText, speak } = useTTS();

  const isCurrentSpeaking = isSpeaking && activeText === text;
  const isCurrentLoading = isLoading && activeText === text;

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    speak(text, lang);
  };

  const sizeClasses = {
    sm: 'p-1.5 h-7 w-7 text-xs',
    md: 'p-2.5 h-10 w-10 text-sm',
    lg: 'p-3.5 h-12 w-12 text-base'
  };

  const defaultTooltip = lang === 'ar' 
    ? (language === 'ar' ? 'استمع للنص العربي' : 'Listen to Arabic recitation')
    : lang === 'am'
    ? 'በአማርኛ ድምጽ ያዳምጡ'
    : (language === 'ar' ? 'استمع للشرح بالإنجليزية' : 'Listen to English explanation');

  return (
    <button
      onClick={handleSpeak}
      className={`inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 ${sizeClasses[size]} ${className} ${isCurrentSpeaking ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border-primary-300' : ''}`}
      title={tooltipText || defaultTooltip}
      aria-label={isCurrentSpeaking ? "Stop speaking" : "Listen via TTS"}
      type="button"
    >
      {isCurrentLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
      ) : isCurrentSpeaking ? (
        <VolumeX className="w-4 h-4 text-primary-600 dark:text-primary-400 animate-bounce" />
      ) : (
        <Volume2 className="w-4 h-4 hover:scale-105 transition-transform" />
      )}
    </button>
  );
};

export default TTSButton;
