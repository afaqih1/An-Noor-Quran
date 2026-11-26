import React from 'react';
import { Menu, BookOpen, Heart, Search } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import ConfigMenu, { ColorPalette } from './ConfigMenu';

interface NavbarProps {
  onMenuClick: () => void;
  onOpenSearch?: () => void;
  activeSection: 'home' | 'alkahf' | 'table' | 'other' | 'dua' | 'azkar' | 'bookmarks' | 'tajweed' | 'quran' | 'qibla' | 'features' | 'khatam' | 'dua_deceased' | 'journal' | 'my_duas' | 'poetry' | 'quran_year_plan' | 'connected_applet' | 'salat_recitations';
  arabicSize: number;
  onArabicSizeChange: (size: number) => void;
  isFocusMode: boolean;
  onFocusModeChange: (enabled: boolean) => void;
  isNightMode: boolean;
  onNightModeChange: (enabled: boolean) => void;
  colorPalette?: ColorPalette;
  onColorPaletteChange?: (palette: ColorPalette) => void;
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

const Navbar: React.FC<NavbarProps> = ({ 
  onMenuClick, 
  onOpenSearch,
  activeSection, 
  arabicSize, 
  onArabicSizeChange,
  isFocusMode,
  onFocusModeChange,
  isNightMode,
  onNightModeChange,
  colorPalette,
  onColorPaletteChange,
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
  const { t, language } = useLanguage();

  const handleSearchClick = () => {
    if (onOpenSearch) {
      onOpenSearch();
    } else {
      window.dispatchEvent(new CustomEvent('open-global-search'));
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'home':
        return language === 'ar' ? 'الرئيسية' : 'Home Portal';
      case 'quran':
        return t('nav.quran');
      case 'alkahf':
        return t('nav.alkahf');
      case 'table':
        return t('nav.table');
      case 'other':
        return t('nav.other');
      case 'dua':
        return t('nav.dua');
      case 'my_duas':
        return language === 'ar' ? 'أدعيتي المختارة' : 'My Duas';
      case 'azkar':
        return t('nav.azkar');
      case 'bookmarks':
        return t('nav.bookmarks');
      case 'journal':
        return t('nav.journal');
      case 'tajweed':
        return t('nav.tajweed');
      case 'qibla':
        return t('nav.qibla');
      case 'features':
        return t('nav.features');
      case 'khatam':
        return t('nav.khatam');
      case 'poetry':
        return language === 'ar' ? 'القصائد' : 'Poetry';
      case 'quran_year_plan':
        return language === 'ar' ? 'منهج القرآن السنوي' : '1-Year Quran';
      case 'connected_applet':
        return language === 'ar' ? 'التطبيق المدمج' : 'Connected Applet';
      case 'salat_recitations':
        return language === 'ar' ? 'أذكار وأدعية الصلاة' : (language === 'am' ? 'የሰላት ዚክሮች' : 'Salat Recitations');
      case 'dua_deceased':
        return language === 'ar' ? 'أدعية المتوفى' : (language === 'am' ? 'ለሟች የሚደረግ ዱዓእ' : 'Dua for the Deceased');
      default:
        return t('nav.title');
    }
  };

  return (
    <nav className="fixed md:sticky top-0 left-0 right-0 z-30 bg-primary-900/95 backdrop-blur-md border-b border-primary-800/50 shadow-md h-16 flex items-center md:hidden">
      <div className="w-full px-3 sm:px-6 flex items-center justify-between gap-2">
        {/* Menu Toggle Button for mobile */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onMenuClick}
            type="button"
            className="p-2 rounded-lg bg-primary-800/50 text-primary-100 hover:text-white hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-secondary-400 transition-colors"
            aria-label="Open side menu"
          >
            <Menu size={22} />
          </button>

          {/* Section Title */}
          <div className="flex items-center gap-1.5">
            <BookOpen size={18} className="text-secondary-400 shrink-0" />
            <span className="font-serif font-bold text-sm sm:text-base text-secondary-50 truncate max-w-[100px] xs:max-w-[140px]">
              {getSectionTitle()}
            </span>
          </div>
        </div>

        {/* Global Search Bar Button in Navbar */}
        <button
          onClick={handleSearchClick}
          type="button"
          className="flex-1 max-w-[180px] xs:max-w-[220px] flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-primary-800/60 hover:bg-primary-800 text-primary-200 hover:text-white border border-primary-700/50 text-xs transition-all cursor-pointer shadow-xs"
          title="Search Surahs, Duas, Azkar (Ctrl+K)"
        >
          <Search size={14} className="text-secondary-400 shrink-0" />
          <span className="truncate text-[11px] font-medium text-primary-200">
            {language === 'ar' ? 'بحث شامل...' : (language === 'am' ? 'ይፈልጉ...' : 'Search...')}
          </span>
        </button>

        {/* Controls container on the right */}
        <div className="flex items-center gap-1.5 shrink-0">
          <ConfigMenu
            arabicSize={arabicSize}
            onArabicSizeChange={onArabicSizeChange}
            isFocusMode={isFocusMode}
            onFocusModeChange={onFocusModeChange}
            isNightMode={isNightMode}
            onNightModeChange={onNightModeChange}
            colorPalette={colorPalette}
            onColorPaletteChange={onColorPaletteChange}
            align="right"
            quranReciter={quranReciter}
            onQuranReciterChange={onQuranReciterChange}
            quranTranslation={quranTranslation}
            onQuranTranslationChange={onQuranTranslationChange}
            quranAutoAdvance={quranAutoAdvance}
            onQuranAutoAdvanceChange={onQuranAutoAdvanceChange}
            quranFontSize={quranFontSize}
            onQuranFontSizeChange={onQuranFontSizeChange}
            quranReadingMode={quranReadingMode}
            onQuranReadingModeChange={onQuranReadingModeChange}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
