import React, { useState, useRef, useEffect } from 'react';
import { Settings, Globe, Type, Moon, Sun, Eye, ChevronDown, BookOpen, Sparkles, Palette, Heart, Languages } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export type ColorPalette = 'forest' | 'earthy' | 'midnight' | 'violet';

interface ConfigMenuProps {
  arabicSize: number;
  onArabicSizeChange: (size: number) => void;
  isFocusMode: boolean;
  onFocusModeChange: (enabled: boolean) => void;
  isNightMode: boolean;
  onNightModeChange: (enabled: boolean) => void;
  colorPalette?: ColorPalette;
  onColorPaletteChange?: (palette: ColorPalette) => void;
  align?: 'left' | 'right';
  // Quran specific configurations
  quranReciter?: string;
  onQuranReciterChange?: (reciter: string) => void;
  quranTranslation?: string;
  onQuranTranslationChange?: (translation: string) => void;
  quranAutoAdvance?: boolean;
  onQuranAutoAdvanceChange?: (enabled: boolean) => void;
  quranFontSize?: number;
  onQuranFontSizeChange?: (size: number) => void;
  quranReadingMode?: 'classic' | 'continuous';
  onQuranReadingModeChange?: (mode: 'classic' | 'continuous') => void;
}

const ConfigMenu: React.FC<ConfigMenuProps> = ({
  arabicSize,
  onArabicSizeChange,
  isFocusMode,
  onFocusModeChange,
  isNightMode,
  onNightModeChange,
  colorPalette = 'forest',
  onColorPaletteChange,
  align = 'right',
  quranReciter,
  onQuranReciterChange,
  quranTranslation,
  onQuranTranslationChange,
  quranAutoAdvance,
  onQuranAutoAdvanceChange,
  quranFontSize,
  onQuranFontSizeChange,
  quranReadingMode,
  onQuranReadingModeChange
}) => {
  const { 
    language, 
    setLanguage, 
    t, 
    showDuaTransliteration, 
    setShowDuaTransliteration, 
    showDuaTranslation, 
    setShowDuaTranslation 
  } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const sizes = [
    { label: 'A-', value: 0.85, desc: 'Small' },
    { label: 'A', value: 1.0, desc: 'Normal' },
    { label: 'A+', value: 1.2, desc: 'Large' },
    { label: 'A++', value: 1.4, desc: 'Extra Large' }
  ];

  const languages = [
    { label: 'English', value: 'en' as const },
    { label: 'العربية', value: 'ar' as const },
    { label: 'አማርኛ', value: 'am' as const },
    { label: 'Gey-Sinan', value: 'har' as const }
  ];

  return (
    <div className="relative inline-block text-left" ref={menuRef} id="config-menu">
      <button
        onClick={toggleMenu}
        type="button"
        className={`flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl border text-xs sm:text-sm font-bold shadow-sm transition-all duration-300 cursor-pointer select-none
          ${isOpen
            ? 'bg-primary-50 border-primary-300 text-primary-700 dark:bg-slate-800 dark:border-slate-700 dark:text-white'
            : 'bg-[#ffffff] hover:bg-slate-50 text-slate-700 hover:text-primary-700 border-slate-200 hover:border-primary-300 dark:bg-slate-900/40 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Settings size={16} className={`text-primary-600 dark:text-secondary-400 transition-transform duration-500 ${isOpen ? 'rotate-90' : ''}`} />
        <span>{t('nav.config') || 'Config'}</span>
        <ChevronDown size={14} className={`opacity-60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-2 w-[calc(100vw-2rem)] max-w-[320px] sm:w-80 bg-white/95 backdrop-blur-md dark:bg-slate-900/95 border border-secondary-200/80 dark:border-slate-800/80 shadow-2xl rounded-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200`}
          role="menu"
        >
          {/* Menu Title */}
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800/60">
            <Settings size={14} className="text-secondary-500" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
              {t('nav.config') || 'Preferences & Config'}
            </h3>
          </div>

          <div className="space-y-4">
            {/* 1. App Language */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Globe size={14} className="text-primary-500 dark:text-secondary-400" />
                <span className="text-[11px] font-bold tracking-wider uppercase">
                  {language === 'en' ? 'App Language' : (language === 'ar' ? 'لغة التطبيق' : (language === 'am' ? 'የመተግበሪያ ቋንቋ' : 'የአፕ ቋንቋ'))}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 bg-slate-50 dark:bg-slate-950/40 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                {languages.map((langOpt) => {
                  const isSelected = language === langOpt.value;
                  return (
                    <button
                      key={langOpt.value}
                      onClick={() => {
                        setLanguage(langOpt.value);
                      }}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center select-none
                        ${isSelected
                          ? 'bg-secondary-500 text-primary-950 shadow-md ring-1 ring-secondary-400/30 font-extrabold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/40'}`}
                    >
                      {langOpt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Arabic Font Size */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Type size={14} className="text-primary-500 dark:text-secondary-400" />
                <span className="text-[11px] font-bold tracking-wider uppercase">
                  {t('nav.size')}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 bg-slate-50 dark:bg-slate-950/40 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                {sizes.map((opt) => {
                  const isSelected = Math.abs(arabicSize - opt.value) < 0.01;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => onArabicSizeChange(opt.value)}
                      title={opt.desc}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center select-none
                        ${isSelected
                          ? 'bg-secondary-500 text-primary-950 shadow-md ring-1 ring-secondary-400/30'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/40'}`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Theme Settings (Color Palette) */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Palette size={14} className="text-primary-500 dark:text-secondary-400" />
                <span className="text-[11px] font-bold tracking-wider uppercase">
                  {language === 'ar' ? 'نمط الألوان والسمة' : (language === 'am' ? 'የቀለም ገጽታ (Theme)' : 'Theme Settings')}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 bg-slate-50 dark:bg-slate-950/40 p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                {[
                  {
                    id: 'forest' as const,
                    label: language === 'ar' ? 'الزمردي' : 'Forest Green',
                    primaryColor: '#059669',
                    secondaryColor: '#b88d55',
                  },
                  {
                    id: 'earthy' as const,
                    label: language === 'ar' ? 'ترابي' : 'Earthy Tones',
                    primaryColor: '#8b4528',
                    secondaryColor: '#a27339',
                  },
                  {
                    id: 'midnight' as const,
                    label: language === 'ar' ? 'أزرق ملكي' : 'Midnight Blue',
                    primaryColor: '#1e40af',
                    secondaryColor: '#c18742',
                  },
                  {
                    id: 'violet' as const,
                    label: language === 'ar' ? 'بنفسجي' : 'Royal Violet',
                    primaryColor: '#7e22ce',
                    secondaryColor: '#e11d48',
                  },
                ].map((themeOpt) => {
                  const isSelected = colorPalette === themeOpt.id;
                  return (
                    <button
                      key={themeOpt.id}
                      type="button"
                      onClick={() => onColorPaletteChange && onColorPaletteChange(themeOpt.id)}
                      className={`flex items-center gap-2 p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none text-left
                        ${isSelected
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-secondary-400/60 font-extrabold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/40'}`}
                    >
                      <div className="flex items-center -space-x-1 shrink-0">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white dark:border-slate-900 shadow-sm"
                          style={{ backgroundColor: themeOpt.primaryColor }}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white dark:border-slate-900 shadow-sm"
                          style={{ backgroundColor: themeOpt.secondaryColor }}
                        />
                      </div>
                      <span className="truncate text-[10px] sm:text-[11px]">{themeOpt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Night Mode */}
            <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-800/60">
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Moon size={14} className="text-primary-500 dark:text-secondary-400" />
                  <span className="text-[11px] font-bold tracking-wider uppercase">{t('nav.night')}</span>
                </div>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 max-w-[180px] leading-tight mt-0.5">
                  {t('side.nightDesc')}
                </span>
              </div>
              <button
                onClick={() => onNightModeChange(!isNightMode)}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isNightMode ? 'bg-secondary-500' : 'bg-slate-200 dark:bg-slate-800 border dark:border-slate-700'}`}
                role="switch"
                aria-checked={isNightMode}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isNightMode ? 'translate-x-4 bg-primary-950' : 'translate-x-0 bg-white'}`}
                />
              </button>
            </div>

            {/* 4. Focus Mode */}
            <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-800/60">
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Eye size={14} className="text-primary-500 dark:text-secondary-400" />
                  <span className="text-[11px] font-bold tracking-wider uppercase">{t('nav.focus')}</span>
                </div>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 max-w-[180px] leading-tight mt-0.5">
                  {t('side.focusDesc')}
                </span>
              </div>
              <button
                onClick={() => onFocusModeChange(!isFocusMode)}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isFocusMode ? 'bg-secondary-500' : 'bg-slate-200 dark:bg-slate-800 border dark:border-slate-700'}`}
                role="switch"
                aria-checked={isFocusMode}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isFocusMode ? 'translate-x-4 bg-primary-950' : 'translate-x-0 bg-white'}`}
                />
              </button>
            </div>

            {/* 5. Dua & Supplications Display Toggles */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Heart size={14} className="text-primary-500 dark:text-secondary-400" />
                  <span className="text-[11px] font-bold tracking-wider uppercase">
                    {language === 'ar' ? 'عرض الأدعية والأذكار' : (language === 'am' ? 'የዱዓእ ማሳያ' : (language === 'har' ? 'የዱዓእ ማሳያ' : 'Dua Display Options'))}
                  </span>
                </div>
                <span className="text-[9px] font-mono font-bold text-secondary-600 dark:text-secondary-400 bg-secondary-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-secondary-200/50 dark:border-slate-700">
                  All Duas
                </span>
              </div>

              {/* Transliteration switch */}
              <div className="flex items-center justify-between py-1 bg-slate-50/70 dark:bg-slate-950/40 px-2.5 py-2 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-2 text-left">
                  <span className="w-5 h-5 flex items-center justify-center rounded-md bg-secondary-100 dark:bg-slate-800 text-[10px] font-bold font-mono text-secondary-800 dark:text-secondary-300">
                    Ab
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight">
                      {language === 'ar' ? 'اللفظ الصوتي (Transliteration)' : (language === 'am' ? 'የእንግሊዝኛ አነባብ (Transliteration)' : 'English Transliteration')}
                    </span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500">
                      {language === 'ar' ? 'دليل نطق الحروف' : 'Phonetic reading guide'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDuaTransliteration(!showDuaTransliteration)}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${showDuaTransliteration ? 'bg-secondary-500' : 'bg-slate-200 dark:bg-slate-800 border dark:border-slate-700'}`}
                  role="switch"
                  aria-checked={showDuaTransliteration}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${showDuaTransliteration ? 'translate-x-4 bg-primary-950' : 'translate-x-0 bg-white'}`}
                  />
                </button>
              </div>

              {/* Translation switch */}
              <div className="flex items-center justify-between py-1 bg-slate-50/70 dark:bg-slate-950/40 px-2.5 py-2 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-2 text-left">
                  <span className="w-5 h-5 flex items-center justify-center rounded-md bg-secondary-100 dark:bg-slate-800 text-[10px] font-bold font-mono text-secondary-800 dark:text-secondary-300">
                    Tr
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight">
                      {language === 'ar' ? 'الترجمة الإنجليزية (Translation)' : (language === 'am' ? 'የእንግሊዝኛ ትርጉም (Translation)' : 'English Translation')}
                    </span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500">
                      {language === 'ar' ? 'المعاني والشرح' : 'Meaning & translation'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDuaTranslation(!showDuaTranslation)}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${showDuaTranslation ? 'bg-secondary-500' : 'bg-slate-200 dark:bg-slate-800 border dark:border-slate-700'}`}
                  role="switch"
                  aria-checked={showDuaTranslation}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${showDuaTranslation ? 'translate-x-4 bg-primary-950' : 'translate-x-0 bg-white'}`}
                  />
                </button>
              </div>
            </div>

            {/* 5. Quran Customizations */}
            {quranReciter !== undefined && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-3">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <BookOpen size={14} className="text-primary-500 dark:text-secondary-400" />
                  <span className="text-[11px] font-bold tracking-wider uppercase">
                    {language === 'ar' ? 'إعدادات تلاوة القرآن' : 'Quran Settings'}
                  </span>
                </div>
                
                {/* Quran Reciter Selector */}
                {onQuranReciterChange && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide block">
                      {language === 'ar' ? 'القارئ' : 'Qari / Reciter'}
                    </label>
                    <select
                      value={quranReciter}
                      onChange={(e) => onQuranReciterChange(e.target.value)}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      <option value="ar.alafasy">Mishary Rashid Alafasy</option>
                      <option value="ar.abdurrahmaansudais">Abdurrahman As-Sudais</option>
                      <option value="ar.mahermuaiqly">Maher Al-Muaiqly</option>
                      <option value="ar.minshawi">Classic Tajweed (Minshawi)</option>
                      <option value="ar.hudhaify">Ali Al-Huthaify (Slow)</option>
                    </select>
                  </div>
                )}

                {/* Quran Translation Selector */}
                {quranTranslation !== undefined && onQuranTranslationChange && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide block">
                      {language === 'ar' ? 'الترجمة' : 'Translation'}
                    </label>
                    <select
                      value={quranTranslation}
                      onChange={(e) => onQuranTranslationChange(e.target.value)}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      <option value="en.sahih">English (Sahih International)</option>
                      <option value="ur.ahmadrida">Urdu (احمد رضا خان)</option>
                      <option value="fr.hamidullah">French (Hamidullah)</option>
                      <option value="tr.diyanet">Turkish (Diyanet)</option>
                      <option value="es.cortes">Spanish (Julio Cortes)</option>
                      <option value="bn.bengali">Bengali (Zohurul Hoque)</option>
                      <option value="de.bubenheim">German (Bubenheim & Elyas)</option>
                      <option value="ru.abuadel">Russian (Abu Adel)</option>
                    </select>
                  </div>
                )}

                {/* Quran Specific Arabic Size */}
                {quranFontSize !== undefined && onQuranFontSizeChange && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide block">
                        {language === 'ar' ? 'حجم خط المصحف' : 'Quran Arabic Size'}
                      </label>
                      <span className="text-[10px] font-mono font-bold text-primary-600 dark:text-secondary-400 bg-primary-50 dark:bg-slate-850 px-1.5 py-0.5 rounded">
                        {Math.round(quranFontSize * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950/40 p-1 rounded-lg border border-slate-200/60 dark:border-slate-800/60">
                      {[
                        { label: 'A-', value: 0.85, desc: 'Small' },
                        { label: 'A', value: 1.15, desc: 'Normal' },
                        { label: 'A+', value: 1.45, desc: 'Large' },
                        { label: 'A++', value: 1.75, desc: 'Extra Large' }
                      ].map((opt) => {
                        const isSelected = Math.abs(quranFontSize - opt.value) < 0.01;
                        return (
                          <button
                            type="button"
                            key={opt.value}
                            onClick={() => onQuranFontSizeChange(opt.value)}
                            title={opt.desc}
                            className={`flex-1 py-1 rounded text-[10px] font-bold transition-all cursor-pointer text-center select-none
                              ${isSelected
                                ? 'bg-secondary-500 text-primary-950 shadow-sm font-extrabold'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/40'}`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quran Reading Mode Selector */}
                {quranReadingMode !== undefined && onQuranReadingModeChange && (
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide block">
                      {language === 'ar' ? 'وضع القراءة' : 'Reading Mode'}
                    </label>
                    <div className="grid grid-cols-2 gap-1 bg-slate-50 dark:bg-slate-950/40 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                      <button
                        type="button"
                        onClick={() => onQuranReadingModeChange('classic')}
                        className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center select-none flex items-center justify-center gap-1
                          ${quranReadingMode === 'classic'
                            ? 'bg-secondary-500 text-primary-950 shadow-md ring-1 ring-secondary-400/30 font-extrabold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/40'}`}
                      >
                        <Sparkles size={11} className={quranReadingMode === 'classic' ? 'text-primary-900' : 'text-amber-500'} />
                        <span>{language === 'ar' ? 'القارئ المركز' : (language === 'am' || language === 'har' ? 'ተኮር ካርድ' : 'Focused Card')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onQuranReadingModeChange('continuous')}
                        className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center select-none flex items-center justify-center gap-1
                          ${quranReadingMode === 'continuous'
                            ? 'bg-secondary-500 text-primary-950 shadow-md ring-1 ring-secondary-400/30 font-extrabold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/40'}`}
                      >
                        <BookOpen size={11} />
                        <span>{language === 'ar' ? 'السرد المتواصل' : (language === 'am' || language === 'har' ? 'ቀጣይ ፍሰት' : 'Continuous Flow')}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Quran Auto-Advance continuous play toggle */}
                {quranAutoAdvance !== undefined && onQuranAutoAdvanceChange && (
                  <div className="flex items-center justify-between py-1 pt-2">
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {language === 'ar' ? 'التشغيل المتواصل' : 'Continuous Play'}
                      </span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 max-w-[180px] leading-tight">
                        {language === 'ar' ? 'التقدم التلقائي للآية التالية' : 'Auto-advance to the next verse'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onQuranAutoAdvanceChange(!quranAutoAdvance)}
                      className={`relative inline-flex h-4 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${quranAutoAdvance ? 'bg-secondary-500' : 'bg-slate-200 dark:bg-slate-800'}`}
                      role="switch"
                      aria-checked={quranAutoAdvance}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${quranAutoAdvance ? 'translate-x-4 bg-primary-950' : 'translate-x-0 bg-white'}`}
                      />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigMenu;
