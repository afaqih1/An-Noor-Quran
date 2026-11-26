import React from 'react';
import { 
  BookOpen, Table, Moon, Heart, X, Sparkles, Sun, Bookmark, 
  GraduationCap, Book, Compass, FileText, ChevronLeft, ChevronRight, Home,
  HardDrive, UserCheck, Layers, Feather, Shield
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import DateDisplay from './DateDisplay';

interface SidebarProps {
  activeSection: 'home' | 'alkahf' | 'table' | 'other' | 'dua' | 'azkar' | 'bookmarks' | 'tajweed' | 'quran' | 'qibla' | 'features' | 'khatam' | 'dua_deceased' | 'my_duas' | 'journal' | 'poetry' | 'quran_year_plan' | 'connected_applet' | 'salat_recitations';
  setActiveSection: (section: 'home' | 'alkahf' | 'table' | 'other' | 'dua' | 'azkar' | 'bookmarks' | 'tajweed' | 'quran' | 'qibla' | 'features' | 'khatam' | 'dua_deceased' | 'my_duas' | 'journal' | 'poetry' | 'quran_year_plan' | 'connected_applet' | 'salat_recitations') => void;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onClassicMushafClick?: () => void;
}

const categories = {
  en: {
    home: 'Home Portal',
    quran: 'Quran Recitation',
    duas: 'Dua & Supplication',
    utilities: 'Utilities & Guide',
    others: 'Others (Spiritual Poetry, Odes, etc.)',
    collapse: 'Collapse Menu',
    expand: 'Expand Menu'
  },
  ar: {
    home: 'الرئيسية',
    quran: 'تلاوة القرآن الكريم',
    duas: 'الأدعية والأذكار',
    utilities: 'الأدوات والدليل',
    others: 'أخرى (القصائد والمدائح الروحية)',
    collapse: 'تصغير القائمة',
    expand: 'توسيع القائمة'
  },
  am: {
    home: 'ዋና ገጽ',
    quran: 'የቁርአን ንባብ',
    duas: 'ዱዓእ እና አዝካር',
    utilities: 'መገልገያዎችና መመሪያ',
    others: 'ሌሎች (መንፈሳዊ ግጥሞችና ውዳሴዎች)',
    collapse: 'ምናሌን አሳንስ',
    expand: 'ምናሌን አስፋ'
  },
  har: {
    home: 'ዋና ገጽ',
    quran: 'ቁርአን መቅረእ',
    duas: 'ዱዓእና አዝካር',
    utilities: 'መገልገያ ባሕቲ',
    others: 'ሌሎች (መንፈሳዊ ግጥሞች)',
    collapse: 'ባሕቲ አሳንስ',
    expand: 'ባሕቲ አስፋ'
  }
};

const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  setActiveSection, 
  isOpen, 
  onClose,
  isCollapsed = false,
  onToggleCollapse,
  onClassicMushafClick
}) => {
  const { language, t } = useLanguage();

  const localizedCategories = categories[language as keyof typeof categories] || categories.en;

  // The 4 requested categories:
  // 1. Quran Recitation
  // 2. Dua & Supplication
  // 3. Utilities & Guide
  // 4. Others (Spiritual Poetry, Odes, etc.)
  const navigationCategories = [
    {
      categoryId: 'quran',
      categoryName: localizedCategories.quran,
      categoryIcon: BookOpen,
      items: [
        {
          id: 'table' as const,
          name: t('nav.table'),
          description: t('side.tableDesc'),
          icon: Table,
        },
        {
          id: 'alkahf' as const,
          name: t('nav.alkahf'),
          description: t('side.alkahfDesc'),
          icon: BookOpen,
        },
        {
          id: 'classic_mushaf' as any,
          name: language === 'ar' ? 'المصحف المصور الكلاسيكي' : (language === 'am' ? 'ክላሲክ የቁርአን ገጾች' : 'Classic Printed Mushaf'),
          description: language === 'ar' ? 'تصفح صفحات المصحف المصورة الكلاسيكية بدقة عالية' : 'Read classic printed Madinah Mushaf pages',
          icon: Book,
        },
        {
          id: 'quran' as const,
          name: t('nav.quran'),
          description: t('side.quranDesc'),
          icon: BookOpen,
        },
        {
          id: 'quran_year_plan' as const,
          name: language === 'ar' ? 'منهج ختم القرآن السنوي' : (language === 'am' ? 'የ1-አመት የቁርአን ትምህርት' : '1-Year Quran Khatam Plan'),
          description: language === 'ar' ? 'خطة ٥٢ أسبوعاً لإتقان التلاوة والمفردات والتدبر' : 'Daily 5-10-5: Recitation, Tafsir & Reflection',
          icon: GraduationCap,
        },
        {
          id: 'quran_study' as any,
          name: language === 'ar' ? 'وحدات دراسة القرآن والتفسير' : (language === 'am' ? 'የቁርአን ጥናትና ተፍሲር' : 'Quran Study & Tafsir Modules'),
          description: language === 'ar' ? 'تحليل موضوعي ولغوي لسور القرآن العظيمة' : 'Structured thematic & linguistic exploration of essential Surahs',
          icon: GraduationCap,
        },
        {
          id: 'khatam' as const,
          name: t('nav.khatam'),
          description: t('side.khatamDesc'),
          icon: Sparkles,
        },
        {
          id: 'tajweed' as const,
          name: t('nav.tajweed'),
          description: t('side.tajweedDesc'),
          icon: GraduationCap,
        },
        {
          id: 'offline_storage' as any,
          name: language === 'ar' ? 'التخزين والمطالعة دون نت' : (language === 'am' ? 'ከመስመር ውጭ ማከማቻ' : 'Offline Quran & Storage'),
          description: language === 'ar' ? 'إدارة السور المحفوظة والوصول بلا إنترنت' : 'Download and manage Surahs for offline reading',
          icon: HardDrive,
        },
      ]
    },
    {
      categoryId: 'duas',
      categoryName: localizedCategories.duas,
      categoryIcon: Heart,
      items: [
        {
          id: 'salat_recitations' as const,
          name: t('nav.salat_recitations'),
          description: t('side.salatRecitationsDesc'),
          icon: UserCheck,
        },
        {
          id: 'azkar' as const,
          name: t('nav.azkar'),
          description: t('side.azkarDesc'),
          icon: Sun,
        },
        {
          id: 'dua' as const,
          name: t('nav.dua'),
          description: t('side.duaDesc'),
          icon: Heart,
        },
        {
          id: 'dua_stress' as any,
          name: language === 'ar' ? 'أدعية تفريج الهم والضيق الأسري' : (language === 'am' ? 'የጭንቀትና የቤተሰብ ሸክም ማቃለያ' : 'Stress & Overwhelm Duas'),
          description: language === 'ar' ? 'الحصن النبوي من الهم والحزن والديون' : 'Prophet’s ﷺ refuge from anxiety, debt & burnout',
          icon: Shield,
        },
        {
          id: 'tahajjud_guide' as any,
          name: language === 'ar' ? 'قيام الليل والتهجد' : (language === 'am' ? 'ተሃጁድና የሌሊት ሶላት' : 'Tahajjud & Night Prayer'),
          description: language === 'ar' ? 'كيفية الصلاة وحاسبة ثلث الليل' : 'Step-by-step guide & last third calculator',
          icon: Moon,
        },
        {
          id: 'dua_deceased' as const,
          name: language === 'ar' ? 'أدعية المتوفى' : (language === 'am' ? 'ለሟች የሚደረግ ዱዓእ' : (language === 'har' ? 'ለሟች የሚደረግ ዱዓእ' : 'Dua for Deceased')),
          description: language === 'ar' ? 'أدعية مأثورة بالرحمة والمغفرة' : (language === 'am' ? 'ለሟቾች ምሕረት ለመለመን' : 'Supplications of mercy & forgiveness'),
          icon: Heart,
        },
        {
          id: 'my_duas' as const,
          name: language === 'ar' ? 'حصن أدعيتي (تسجيل صوتي)' : (language === 'am' ? 'የእኔ ዱዓዎች (የድምጽ ቅጂ)' : (language === 'har' ? 'የእኔ ዱዓእአች' : 'My Duas & Voice Supplications')),
          description: language === 'ar' ? 'أدعيتك الشخصية مع التسجيل الصوتي المباشر والوسوم' : (language === 'am' ? 'የግል ዱዓዎች በድምጽ እና ጽሑፍ' : 'Personal supplications with audio playback & tags'),
          icon: Heart,
        },
        {
          id: 'bookmarks' as const,
          name: t('nav.bookmarks'),
          description: t('side.bookmarksDesc'),
          icon: Bookmark,
        },
      ]
    },
    {
      categoryId: 'utilities',
      categoryName: localizedCategories.utilities,
      categoryIcon: Compass,
      items: [
        {
          id: 'qibla' as const,
          name: t('nav.qibla'),
          description: t('side.qiblaDesc'),
          icon: Compass,
        },
        {
          id: 'journal' as const,
          name: t('nav.journal'),
          description: t('side.journalDesc'),
          icon: FileText,
        },
        {
          id: 'connected_applet' as const,
          name: language === 'ar' ? 'تطبيق AI Studio المدمج' : (language === 'am' ? 'የተገናኘ AI Studio መተግበሪያ' : (language === 'har' ? 'የተገናኘ መተግበሪያ' : 'Connected Applet')),
          description: language === 'ar' ? 'بوابة التطبيق المدمج التفاعلي بدقة كاملة' : (language === 'am' ? 'የተገናኘ መተግበሪያን በሙሉ ስክሪን ይመልከቱ' : 'Full-screen integrated companion applet'),
          icon: Sparkles,
        },
        {
          id: 'features' as const,
          name: t('nav.features'),
          description: t('side.featuresDesc'),
          icon: FileText,
        },
      ]
    },
    {
      categoryId: 'others',
      categoryName: localizedCategories.others,
      categoryIcon: Feather,
      items: [
        {
          id: 'poetry' as const,
          name: language === 'ar' ? 'القصائد والمدائح الروحية' : (language === 'am' ? 'መንፈሳዊ ግጥሞችና ውዳሴዎች' : (language === 'har' ? 'መንፈሳዊ ግጥሞች' : 'Spiritual Poetry & Odes')),
          description: language === 'ar' ? 'البردة، النونية، ابتهال الليل، وأسرار صلاة الفجر' : (language === 'am' ? 'የበረከት ግጥሞች፣ ኑኒያህ እና የፈጅር ምስጢራት' : 'Burda, Nooniyah, Midnight Munajat & Fajr Secrets'),
          icon: Book,
        },
        {
          id: 'other' as const,
          name: t('nav.other'),
          description: t('side.otherDesc'),
          icon: Moon,
        },
      ]
    }
  ];

  const handleSelect = (id: 'home' | 'alkahf' | 'table' | 'other' | 'dua' | 'azkar' | 'bookmarks' | 'tajweed' | 'quran' | 'qibla' | 'features' | 'khatam' | 'dua_deceased' | 'my_duas' | 'journal' | 'poetry' | 'classic_mushaf' | 'quran_study' | 'offline_storage' | 'quran_year_plan' | 'connected_applet' | 'salat_recitations') => {
    if (id === ('offline_storage' as any)) {
      window.dispatchEvent(new CustomEvent('open-offline-modal'));
      onClose();
      return;
    }
    if (id === ('quran_study' as any)) {
      window.dispatchEvent(new CustomEvent('open-quran-study-modal', { detail: { moduleId: 'mod-fatiha' } }));
      onClose();
      return;
    }
    if (id === ('classic_mushaf' as any)) {
      if (onClassicMushafClick) onClassicMushafClick();
      onClose();
      return;
    }
    if (id === ('dua_stress' as any)) {
      setActiveSection('dua');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('open-dua-tab', { detail: { tab: 'stress' } }));
      }, 50);
      onClose();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (id === ('tahajjud_guide' as any)) {
      setActiveSection('dua');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('open-dua-tab', { detail: { tab: 'tahajjud' } }));
      }, 50);
      onClose();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setActiveSection(id);
    onClose();
    // Scroll to top of content area on click
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-gradient-to-b from-primary-950 via-primary-900 to-primary-950 text-white flex flex-col h-screen border-r border-secondary-500/20 shadow-2xl transition-all duration-300 ease-in-out md:translate-x-0 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isCollapsed ? 'md:w-20 w-72' : 'md:w-72 w-72'}`}
      >
        {/* Sidebar Header */}
        <div className={`h-20 px-4 border-b border-primary-800/60 flex items-center ${isCollapsed ? 'md:justify-center justify-between' : 'justify-between'}`}>
          <button 
            id="sidebar-brand-btn"
            onClick={() => handleSelect('home')}
            className="flex items-center gap-3 overflow-hidden text-left hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer group focus:outline-none"
            title={language === 'en' ? 'Go to Home Page' : (language === 'ar' ? 'الذهاب للرئيسية' : 'ወደ ዋና ገጽ ሂድ')}
          >
            <div className="p-2 bg-primary-800 rounded-lg ring-1 ring-secondary-400/40 flex-shrink-0 group-hover:ring-secondary-300/60 transition-all">
              <BookOpen className="text-secondary-400 w-6 h-6 group-hover:scale-105 transition-transform" />
            </div>
            {/* Show title only if not collapsed or on mobile (which behaves like expanded) */}
            <div className={`transition-all duration-300 ${isCollapsed ? 'md:hidden opacity-0' : 'opacity-100'}`}>
              <h1 className="font-serif font-bold text-sm text-secondary-50 tracking-wide truncate max-w-[160px] group-hover:text-secondary-200 transition-colors">{t('nav.title')}</h1>
              <p className="text-[9px] text-primary-300 tracking-wider font-semibold uppercase truncate max-w-[160px]">{language === 'en' ? 'Surah & Dua Companion' : (language === 'ar' ? 'رفيق السور والأدعية' : (language === 'am' ? 'የሱራ እና ዱዓ ረዳት' : 'ሱራእእና ዱዓእ መሪሕ'))}</p>
            </div>
          </button>
          
          {/* Close button for mobile OR Collapse button for desktop */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button 
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-primary-800 text-primary-200 hover:text-white md:hidden transition-colors cursor-pointer"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
            
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="hidden md:flex p-1.5 rounded-lg bg-primary-800/40 hover:bg-primary-800/80 text-primary-200 hover:text-white transition-all cursor-pointer border border-primary-700/40"
                title={isCollapsed ? localizedCategories.expand : localizedCategories.collapse}
              >
                {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
              </button>
            )}
          </div>
        </div>

        {/* Persistent Date & Hijri Display - hidden on desktop if collapsed */}
        <div className={isCollapsed ? 'md:hidden' : 'block'}>
          <DateDisplay variant="sidebar" />
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-800">
          
          {/* Top Home Portal Shortcut Button */}
          <div className="pb-1 border-b border-primary-800/50">
            <button
              onClick={() => handleSelect('home')}
              title={isCollapsed ? localizedCategories.home : undefined}
              className={`w-full flex items-center rounded-xl transition-all duration-200 text-left group select-none relative
                ${isCollapsed ? 'md:justify-center md:px-0 md:py-3.5 px-4 py-3' : 'px-4 py-3'}
                ${activeSection === 'home' 
                  ? 'bg-gradient-to-r from-primary-800 to-primary-700/80 text-white ring-1 ring-secondary-400/40 font-bold shadow-md' 
                  : 'text-primary-100 hover:bg-primary-800/40 hover:text-white'}`}
            >
              {activeSection === 'home' && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-secondary-400 rounded-r-md" />
              )}
              <div className={`p-2 rounded-lg transition-colors flex-shrink-0
                ${activeSection === 'home' 
                  ? 'bg-primary-900 text-secondary-400' 
                  : 'bg-primary-800/40 text-primary-300 group-hover:bg-primary-800 group-hover:text-secondary-300'}`}
              >
                <Home size={18} />
              </div>
              <div className={`flex-1 min-w-0 ml-3 transition-all duration-300 ${isCollapsed ? 'md:hidden opacity-0' : 'opacity-100'}`}>
                <span className={`block text-xs truncate ${activeSection === 'home' ? 'text-secondary-100 font-bold' : 'text-primary-100'}`}>
                  {localizedCategories.home}
                </span>
                <span className="block text-[10px] truncate text-primary-400 group-hover:text-primary-300 leading-tight">
                  {language === 'ar' ? 'البوابة الرئيسية ومواقيت الصلاة' : 'Main portal & prayer times'}
                </span>
              </div>
            </button>
          </div>

          {/* The 4 Reorganized Navigation Categories */}
          {navigationCategories.map((group) => {
            const CatIcon = group.categoryIcon;
            return (
              <div key={group.categoryId} className="space-y-1">
                {/* Category Header with Icon & Count */}
                <div className={`flex items-center justify-between px-3 transition-all duration-300
                  ${isCollapsed ? 'md:hidden opacity-0' : 'opacity-100 mb-1.5 mt-2.5'}`}
                >
                  <div className="flex items-center gap-1.5">
                    <CatIcon size={12} className="text-secondary-400" />
                    <h2 className="text-[10px] font-bold uppercase tracking-wider text-secondary-400/90 truncate">
                      {group.categoryName}
                    </h2>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-primary-800/70 text-primary-300 font-semibold border border-primary-700/40">
                    {group.items.length}
                  </span>
                </div>

                {/* Items in this category */}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item.id)}
                        title={isCollapsed ? item.name : undefined}
                        className={`w-full flex items-center rounded-xl transition-all duration-200 text-left group select-none relative
                          ${isCollapsed ? 'md:justify-center md:px-0 md:py-3 px-4 py-2.5' : 'px-3.5 py-2.5'}
                          ${isActive 
                            ? 'bg-gradient-to-r from-primary-800 to-primary-700/80 text-white ring-1 ring-secondary-400/30 font-medium' 
                            : 'text-primary-100 hover:bg-primary-800/40 hover:text-white'}`}
                      >
                        {/* Active indicator bar */}
                        {isActive && (
                          <div className="absolute left-0 top-2 bottom-2 w-1 bg-secondary-400 rounded-r-md" />
                        )}

                        <div className={`p-1.5 rounded-lg transition-colors flex-shrink-0
                          ${isActive 
                            ? 'bg-primary-900 text-secondary-400' 
                            : 'bg-primary-800/30 text-primary-300 group-hover:bg-primary-800 group-hover:text-secondary-300'}`}
                        >
                          <Icon size={16} />
                        </div>

                        {/* Item Text: Hidden when collapsed on desktop */}
                        <div className={`flex-1 min-w-0 ml-3 transition-all duration-300 ${isCollapsed ? 'md:hidden opacity-0' : 'opacity-100'}`}>
                          <span className={`block text-xs truncate ${isActive ? 'text-secondary-100 font-bold' : 'text-primary-100'}`}>
                            {item.name}
                          </span>
                          <span className="block text-[10px] truncate text-primary-400 group-hover:text-primary-300 leading-tight">
                            {item.description}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Decorative Wisdom Footer inside Sidebar - hidden on desktop if collapsed */}
        <div className={`p-4 border-t border-primary-800/60 bg-primary-950/40 ${isCollapsed ? 'md:hidden' : 'block'}`}>
          <div className="bg-primary-900/60 p-3 rounded-xl border border-primary-800/40 relative overflow-hidden">
            <Sparkles className="absolute -right-2 -bottom-2 text-primary-800/20 w-12 h-12 pointer-events-none" />
            <p className="text-[10px] text-primary-200 leading-relaxed font-serif italic text-center">
              {language === 'ar' ? '“خَيْرُ يَوْمٍ طَلَعَتْ عَلَيْهِ الشَّمْسُ يَوْمُ الْجُمُعَةِ”' : (language === 'am' ? '“ፀሐይ ከወጣችባቸው ቀናት ሁሉ በላጩ የዓርብ ቀን ነው።”' : (language === 'har' ? '“አያሞችሊ በረከ ዘባሪ ጁምዓ መዓልት ኢንታ።”' : '"The best day on which the sun has risen is Friday."'))}
            </p>
            <p className="text-[9px] text-secondary-400/80 text-center mt-1 font-semibold tracking-wider uppercase">
              {language === 'ar' ? 'النبي محمد ﷺ' : (language === 'am' ? 'ነቢዩ ሙሐመድ ﷺ' : (language === 'har' ? 'ነቢዩ ሙሐመድ ﷺ' : 'Prophet Muhammad ﷺ'))}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
