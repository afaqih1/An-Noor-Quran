import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, X, BookOpen, Heart, Sun, Moon, Shield, Sparkles, 
  GraduationCap, Compass, Calendar, Clock, Book, FileText, 
  ArrowRight, CornerDownLeft, History, Flame, Tag, Check
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { allSurahs } from './surahListData';

export type SearchCategory = 'all' | 'surah' | 'dua' | 'azkar' | 'tool';

export interface SearchResultItem {
  id: string;
  category: 'surah' | 'dua' | 'azkar' | 'tool';
  title: string;
  arabicTitle?: string;
  subtitle: string;
  tags: string[];
  action: () => void;
  badge?: string;
  meta?: string;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateSection: (section: 'home' | 'alkahf' | 'table' | 'other' | 'dua' | 'azkar' | 'bookmarks' | 'tajweed' | 'quran' | 'qibla' | 'features' | 'khatam' | 'dua_deceased' | 'my_duas' | 'journal' | 'poetry' | 'quran_year_plan' | 'connected_applet' | 'salat_recitations') => void;
  onOpenClassicMushaf?: (page?: number) => void;
  onOpenCalendar?: (tab?: 'gregorian' | 'hijri' | 'ethiopian') => void;
  onOpenWorldClock?: () => void;
  onOpenStudyModule?: (moduleId?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateSection,
  onOpenClassicMushaf,
  onOpenCalendar,
  onOpenWorldClock,
  onOpenStudyModule
}) => {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('annoor-recent-searches');
      return saved ? JSON.parse(saved) : ['Al-Kahf', 'Sayyidul Istighfar', 'Morning Azkar', 'Dua for Parents'];
    } catch {
      return ['Al-Kahf', 'Sayyidul Istighfar', 'Morning Azkar', 'Dua for Parents'];
    }
  });

  const inputRef = useRef<HTMLInputElement | null>(null);
  const resultsContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const saveRecentSearch = (term: string) => {
    if (!term || term.trim().length < 2) return;
    const cleanTerm = term.trim();
    const updated = [cleanTerm, ...recentSearches.filter(s => s.toLowerCase() !== cleanTerm.toLowerCase())].slice(0, 8);
    setRecentSearches(updated);
    try {
      localStorage.setItem('annoor-recent-searches', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const clearRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem('annoor-recent-searches');
    } catch (e) {
      console.error(e);
    }
  };

  // Build Comprehensive Search Index
  const allItems: SearchResultItem[] = useMemo(() => {
    const items: SearchResultItem[] = [];

    // 1. Surahs (All 114 Surahs)
    allSurahs.forEach((s) => {
      const isAlKahf = s.number === 18;
      const isSpecialFriday = [18, 32, 67, 62, 76, 87, 88, 56, 36, 2].includes(s.number);

      items.push({
        id: `surah-${s.number}`,
        category: 'surah',
        title: `${s.number}. Surah ${s.englishName}`,
        arabicTitle: s.name,
        subtitle: `${s.englishNameTranslation} • ${s.revelationType} • ${s.numberOfAyahs} Verses`,
        tags: [
          'surah', 'quran', s.englishName, s.englishNameTranslation, s.name, 
          `${s.number}`, `juz`, s.revelationType,
          isSpecialFriday ? 'friday' : '',
          isAlKahf ? 'alkahf cave jumuah' : ''
        ].filter(Boolean),
        badge: isAlKahf ? 'Friday Main' : (isSpecialFriday ? 'Recommended' : undefined),
        meta: `Surah #${s.number}`,
        action: () => {
          saveRecentSearch(s.englishName);
          try {
            localStorage.setItem('quran-selected-surah', s.number.toString());
            localStorage.setItem('quran-browse-mode', 'surah');
          } catch (e) { console.error(e); }

          onNavigateSection('quran');
          window.dispatchEvent(new CustomEvent('open-quran-surah', { detail: { surahNumber: s.number } }));
          onClose();
        }
      });
    });

    // 2. Specific Duas
    const duaEntries: Omit<SearchResultItem, 'category'>[] = [
      {
        id: 'dua-friday-response',
        title: 'Hour of Response (Sa\'at al-Istijabah)',
        arabicTitle: 'ساعة الاستجابة يوم الجمعة',
        subtitle: 'The blessed Friday afternoon window before Maghrib where all heartfelt supplications are answered.',
        tags: ['dua', 'supplication', 'friday', 'acceptance', 'response', 'istijabah', 'maghrib', 'asr', 'hour'],
        badge: 'Friday Special',
        meta: 'Dua Section',
        action: () => {
          saveRecentSearch('Hour of Response');
          onNavigateSection('dua');
          onClose();
        }
      },
      {
        id: 'dua-stress-overwhelm',
        title: 'Dua for Stress, Anxiety & Family Overwhelm (Prophet’s ﷺ Refuge)',
        arabicTitle: 'دعاء تفريج الهم والحزن والعجز والكسل والدين وغلبة الرجال',
        subtitle: 'The Prophet’s ﷺ master supplication seeking refuge from 8 crushing burdens, panic, and domestic stress.',
        tags: ['dua', 'stress', 'anxiety', 'overwhelm', 'family', 'hamm', 'hazan', 'debt', 'grief', 'worry', 'laziness', 'cowardice', 'panic', 'depression', 'bukhari', 'refuge'],
        badge: 'Prophetic Refuge',
        meta: 'Dua Section',
        action: () => {
          saveRecentSearch('Dua for Stress & Overwhelm');
          onNavigateSection('dua');
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('open-dua-tab', { detail: { tab: 'stress' } }));
          }, 50);
          onClose();
        }
      },
      {
        id: 'guide-tahajjud-night-prayer',
        title: 'How to Perform Tahajjud & Qiyam al-Layl (Night Vigil Guide)',
        arabicTitle: 'دليل صلاة قيام الليل والتهجد وحاسبة ثلث الليل الأخير',
        subtitle: 'Complete step-by-step master guide, rak\'ah structure, Last Third calculator, and pre-dawn Istighfar.',
        tags: ['tahajjud', 'qiyam', 'qiyam al layl', 'night prayer', 'last third', 'sahar', 'witr', 'how to pray', 'divine descent', 'rakah', 'salat'],
        badge: 'Night Prayer',
        meta: 'Dua Section',
        action: () => {
          saveRecentSearch('Tahajjud Guide');
          onNavigateSection('dua');
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('open-dua-tab', { detail: { tab: 'tahajjud' } }));
          }, 50);
          onClose();
        }
      },
      {
        id: 'dua-parents',
        title: 'Dua for Parents & Ancestors',
        arabicTitle: 'دعاء للوالدين والمغفرة لهما',
        subtitle: 'My Lord, have mercy upon them as they brought me up when I was small (Surah Al-Isra 17:24).',
        tags: ['dua', 'parents', 'mother', 'father', 'family', 'mercy', 'isra', 'walidayn'],
        badge: 'Quranic Dua',
        meta: 'Dua Section',
        action: () => {
          saveRecentSearch('Dua for Parents');
          onNavigateSection('dua');
          onClose();
        }
      },
      {
        id: 'dua-family-children',
        title: 'Dua for Spouses & Righteous Offspring',
        arabicTitle: 'دعاء للأبناء والذرية والأزواج',
        subtitle: 'Our Lord, grant us from among our spouses and offspring comfort to our eyes (Surah Al-Furqan 25:74).',
        tags: ['dua', 'family', 'children', 'spouse', 'kids', 'offspring', 'furqan', 'ibrahim'],
        badge: 'Quranic Dua',
        meta: 'Dua Section',
        action: () => {
          saveRecentSearch('Dua for Family');
          onNavigateSection('dua');
          onClose();
        }
      },
      {
        id: 'dua-khatmul-quran',
        title: 'Dua for Khatmul Quran (Completion)',
        arabicTitle: 'دعاء ختم القرآن الكريم',
        subtitle: 'Celebrated prayer recited upon completing recitation of the Holy Quran for light, guidance, and mercy.',
        tags: ['dua', 'khatam', 'khatmul', 'completion', 'quran finish', 'mercy', 'hidayah', 'sudais'],
        badge: 'Khatm Special',
        meta: 'Khatam Section',
        action: () => {
          saveRecentSearch('Khatmul Quran');
          onNavigateSection('khatam');
          onClose();
        }
      },
      {
        id: 'dua-deceased',
        title: 'Dua for the Deceased & Loved Ones',
        arabicTitle: 'أدعية للمتوفى والمغفرة والرحمة',
        subtitle: 'Comprehensive authentic prayers for deceased parents, relatives, and Muslims entering the grave.',
        tags: ['dua', 'deceased', 'dead', 'funeral', 'janazah', 'grave', 'barzakh', 'parents', 'marhoom'],
        badge: 'Memorial',
        meta: 'Dua Deceased Section',
        action: () => {
          saveRecentSearch('Dua for Deceased');
          onNavigateSection('dua_deceased');
          onClose();
        }
      },
      {
        id: 'dua-sayyidul-istighfar',
        title: 'Sayyidul Istighfar (Chief Supplication for Forgiveness)',
        arabicTitle: 'سيد الاستغفار',
        subtitle: 'O Allah, You are my Lord; there is none worthy of worship except You. You created me and I am Your slave.',
        tags: ['dua', 'istighfar', 'forgiveness', 'sayyid', 'repentance', 'tawbah', 'morning', 'evening'],
        badge: 'Authentic Sunnah',
        meta: 'Azkar / Duas',
        action: () => {
          saveRecentSearch('Sayyidul Istighfar');
          onNavigateSection('azkar');
          onClose();
        }
      },
      {
        id: 'dua-yunus',
        title: 'Dua of Prophet Yunus (Ayah Kareemah)',
        arabicTitle: 'دعاء يونس عليه السلام (لا إله إلا أنت سبحانك)',
        subtitle: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers (Distress Relief).',
        tags: ['dua', 'yunus', 'whale', 'distress', 'relief', 'anxiety', 'kareemah', 'anbiya'],
        badge: 'Prophetic Dua',
        meta: 'My Duas',
        action: () => {
          saveRecentSearch('Dua Yunus');
          onNavigateSection('my_duas');
          onClose();
        }
      },
      {
        id: 'dua-best-of-both-worlds',
        title: 'Best of This World & The Hereafter (Rabbana Atina)',
        arabicTitle: 'ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة',
        subtitle: 'Our Lord, give us in this world that which is good and in the Hereafter that which is good (Al-Baqarah 2:201).',
        tags: ['dua', 'rabbana', 'dunya', 'akhirah', 'fire', 'goodness', 'success', 'baqarah'],
        badge: 'Quranic Dua',
        meta: 'Dua Section',
        action: () => {
          saveRecentSearch('Rabbana Atina');
          onNavigateSection('dua');
          onClose();
        }
      },
      {
        id: 'dua-anxiety-relief',
        title: 'Anxiety Relief & Loving the Quran',
        arabicTitle: 'دعاء تفريج الهم والحزن وجلاء الكرب',
        subtitle: 'O Allah, make the Magnificent Quran the spring of my heart, the light of my chest, and the banisher of my sadness.',
        tags: ['dua', 'anxiety', 'sadness', 'worry', 'grief', 'peace', 'quran spring', 'heart'],
        badge: 'Authentic Sunnah',
        meta: 'Azkar / Duas',
        action: () => {
          saveRecentSearch('Anxiety Relief');
          onNavigateSection('azkar');
          onClose();
        }
      }
    ];

    duaEntries.forEach(d => {
      items.push({
        ...d,
        category: 'dua'
      });
    });

    // 3. Azkar Collection Topics & Litanies
    const azkarEntries: Omit<SearchResultItem, 'category'>[] = [
      {
        id: 'azkar-morning-main',
        title: 'Morning Supplications & Adhkar (أذكار الصباح)',
        arabicTitle: 'أذكار الصباح المأثورة',
        subtitle: 'Essential morning protective remembrances, declarations of sovereignty, and praise upon sunrise.',
        tags: ['azkar', 'morning', 'sabah', 'protection', 'dawn', 'fajr', 'sunnah', 'daily'],
        badge: 'Daily Essential',
        meta: 'Azkar Section',
        action: () => {
          saveRecentSearch('Morning Azkar');
          onNavigateSection('azkar');
          onClose();
        }
      },
      {
        id: 'azkar-evening-main',
        title: 'Evening Supplications & Adhkar (أذكار المساء)',
        arabicTitle: 'أذكار المساء والتحصين الليلي',
        subtitle: 'Nightly protections, Ayat al-Kursi, 3 Quls, and defense against harmful creatures before dusk.',
        tags: ['azkar', 'evening', 'masa', 'night', 'protection', 'maghrib', 'evil eye', 'ruqyah'],
        badge: 'Daily Essential',
        meta: 'Azkar Section',
        action: () => {
          saveRecentSearch('Evening Azkar');
          onNavigateSection('azkar');
          onClose();
        }
      },
      {
        id: 'azkar-after-salah',
        title: 'Remembrances After Obligatory Prayer (أذكار بعد الصلاة)',
        arabicTitle: 'أذكار ما بعد الصلوات المكتوبة',
        subtitle: 'Istighfar 3x, Allahumma Antas-Salam, Ayat al-Kursi, SubhanAllah 33x, Alhamdulillah 33x, Allahu Akbar 33x.',
        tags: ['azkar', 'salah', 'namaz', 'prayer', 'post prayer', 'tasbih 33', 'tahmid', 'takbir'],
        badge: 'Sunnah Mu\'akkadah',
        meta: 'Azkar Collection',
        action: () => {
          saveRecentSearch('After Prayer Azkar');
          onNavigateSection('azkar');
          onClose();
        }
      },
      {
        id: 'azkar-bedtime-sleep',
        title: 'Sleeping & Bedtime Adhkar (أذكار النوم)',
        arabicTitle: 'أذكار النوم والاضطجاع',
        subtitle: 'Bismika Rabbi wada\'tu janbi, Surah Al-Mulk recitation, dusting the bed, and seeking refuge before sleep.',
        tags: ['azkar', 'sleep', 'bedtime', 'night', 'dreams', 'bismika', 'mulk', 'protection'],
        badge: 'Night Sunnah',
        meta: 'Azkar Collection',
        action: () => {
          saveRecentSearch('Bedtime Azkar');
          onNavigateSection('azkar');
          onClose();
        }
      },
      {
        id: 'azkar-hizb-al-bahr',
        title: 'Hizb al-Bahr (The Litany of the Sea)',
        arabicTitle: 'حزب البحر للإمام أبي الحسن الشاذلي',
        subtitle: 'The renowned protective and spiritual litany of Imam Abu al-Hasan al-Shadhili for safety and divine opening.',
        tags: ['azkar', 'hizb', 'bahr', 'sea', 'shadhili', 'protection', 'litany', 'spiritual'],
        badge: 'Special Wird',
        meta: 'Azkar Collection',
        action: () => {
          saveRecentSearch('Hizb al-Bahr');
          onNavigateSection('azkar');
          onClose();
        }
      },
      {
        id: 'azkar-asma-ul-husna',
        title: 'The 99 Beautiful Names of Allah (أسماء الله الحسنى)',
        arabicTitle: 'أسماء الله الحسنى ومعانيها',
        subtitle: 'Recite, understand, and supplicate with the 99 attributes of Almighty Allah.',
        tags: ['azkar', 'names', '99 names', 'asma', 'husna', 'allah', 'attributes', 'theology'],
        badge: 'Devotional',
        meta: 'Azkar Collection',
        action: () => {
          saveRecentSearch('99 Names of Allah');
          onNavigateSection('azkar');
          onClose();
        }
      },
      {
        id: 'azkar-istighfar-collection',
        title: 'Istighfar & Repentance Collection',
        arabicTitle: 'أذكار الاستغفار والتوبة النصوح',
        subtitle: 'Authentic formulas for forgiveness: Astaghfirullah al-Azim, Sayyidul Istighfar, and 100x daily sunnah.',
        tags: ['azkar', 'istighfar', 'tawbah', 'repentance', 'forgiveness', 'sins', 'mercy'],
        badge: 'Daily Wird',
        meta: 'Azkar Collection',
        action: () => {
          saveRecentSearch('Istighfar Collection');
          onNavigateSection('azkar');
          onClose();
        }
      },
      {
        id: 'azkar-tasbih-virtues',
        title: 'Virtues of Tasbih, Tahmid & Tahlil',
        arabicTitle: 'فضائل التسبيح والتحميد والتهليل والتكبير',
        subtitle: 'SubhanAllahi wa bihamdihi SubhanAllahil Azim — words light on the tongue, heavy on the scale.',
        tags: ['azkar', 'tasbih', 'tahmid', 'tahlil', 'takbir', 'subhanallah', 'virtues', 'rewards', 'scale'],
        badge: 'Dhikr Guide',
        meta: 'Azkar Collection',
        action: () => {
          saveRecentSearch('Virtues of Tasbih');
          onNavigateSection('azkar');
          onClose();
        }
      }
    ];

    azkarEntries.forEach(a => {
      items.push({
        ...a,
        category: 'azkar'
      });
    });

    // 4. Tools, Guides & Utilities
    const toolEntries: Omit<SearchResultItem, 'category'>[] = [
      {
        id: 'tool-classic-mushaf',
        title: 'Classic Printed Mushaf (604 Pages)',
        arabicTitle: 'المصحف المصور الكلاسيكي (مصحف المدينة)',
        subtitle: 'High-definition digital replica of the standard 15-line Madinah Mushaf with page jumper.',
        tags: ['tool', 'mushaf', 'classic', 'pages', 'printed', 'madinah', 'reading', '604'],
        badge: 'Reader Tool',
        meta: 'Mushaf Modal',
        action: () => {
          saveRecentSearch('Classic Mushaf');
          if (onOpenClassicMushaf) onOpenClassicMushaf(1);
          else window.dispatchEvent(new CustomEvent('open-classic-mushaf-modal', { detail: { page: 1 } }));
          onClose();
        }
      },
      {
        id: 'tool-study-modules',
        title: 'Quran Study & Tafsir Deep-Dives',
        arabicTitle: 'وحدات دراسة القرآن والتفسير البياني',
        subtitle: 'Thematic analysis, linguistic breakdown, word-by-word insights, and Gemini AI Tafsir assistant.',
        tags: ['tool', 'study', 'tafsir', 'modules', 'linguistic', 'fatiha', 'kahf', 'analysis', 'ai'],
        badge: 'Study Module',
        meta: 'Study Suite',
        action: () => {
          saveRecentSearch('Quran Study');
          if (onOpenStudyModule) onOpenStudyModule('mod-fatiha');
          else window.dispatchEvent(new CustomEvent('open-quran-study-modal', { detail: { moduleId: 'mod-fatiha' } }));
          onClose();
        }
      },
      {
        id: 'tool-quran-year-plan',
        title: '1-Year Quran Learning Plan (20 Min / Day)',
        arabicTitle: 'منهج ختم وتدبر القرآن في عام (٢٠ دقيقة يومياً)',
        subtitle: 'Structured 52-week curriculum: 5 min Recitation & Tajweed, 10 min Vocabulary & Tafsir, 5 min Reflection & Dua.',
        tags: ['tool', 'year', 'plan', 'curriculum', 'roadmap', '20 minute', 'tajweed', 'vocabulary', 'tafsir', 'tadabbur', '52 weeks', '365 days', 'habit'],
        badge: 'Curriculum',
        meta: 'Annual Plan',
        action: () => {
          saveRecentSearch('1-Year Quran Plan');
          onNavigateSection('quran_year_plan');
          onClose();
        }
      },
      {
        id: 'tool-connected-applet',
        title: 'Connected AI Studio Applet (34a7e4b1)',
        arabicTitle: 'تطبيق AI Studio المدمج التفاعلي (34a7e4b1)',
        subtitle: 'Launch, extract, and interact with the connected AI Studio digital applet in full embedded view or standalone tab.',
        tags: ['tool', 'applet', 'connected', 'ai studio', 'portal', '34a7e4b1', 'extracted', 'fullscreen', 'تطبيق', 'مدمج'],
        badge: 'Connected App',
        meta: 'Applet View',
        action: () => {
          saveRecentSearch('Connected Applet');
          onNavigateSection('connected_applet');
          onClose();
        }
      },
      {
        id: 'tool-salat-recitations',
        title: 'What to Recite in Every Position of Salat',
        arabicTitle: 'أذكار وأدعية الصلاة في كل ركن وموضع',
        subtitle: 'Authentic invocations for Takbir, Istiftah, Fatiha, Ruku\', I\'tidal, Sujud, Jalsah, Tashahhud, As-Salat Al-Ibrahimiyyah, and Tasleem with Arabic, transliteration, English, and Amharic translation.',
        tags: ['tool', 'salat', 'prayer', 'recitations', 'ruku', 'sujud', 'istiftah', 'tashahhud', 'attahiyyat', 'ibrahimiyyah', 'durood', 'salam', 'tasleem', 'positions', 'صلاة', 'أذكار الصلاة', 'ركوع', 'سجود', 'تشهد', 'التحيات'],
        badge: 'Prayer Guide',
        meta: 'Salat Suite',
        action: () => {
          saveRecentSearch('Salat Recitations');
          onNavigateSection('salat_recitations');
          onClose();
        }
      },
      {
        id: 'tool-voice-dua',
        title: 'Voice-to-Text Personal Supplication Studio (My Duas)',
        arabicTitle: 'استوديو الدعاء الصوتي وتحويل الصوت إلى نص (حصن أدعيتي)',
        subtitle: 'Record personal prayers via microphone with real-time speech-to-text transcription in Arabic & English, audio waveform playback, and permanent storage.',
        tags: ['tool', 'voice', 'microphone', 'record', 'speech', 'speech to text', 'audio', 'dua', 'my duas', 'personal supplication', 'صوت', 'تسجيل', 'دعاء', 'أدعيتي'],
        badge: 'Voice Studio',
        meta: 'My Duas Section',
        action: () => {
          saveRecentSearch('Voice Dua Studio');
          onNavigateSection('my_duas');
          onClose();
        }
      },
      {
        id: 'tool-tajweed-guide',
        title: 'Tajweed Rules & Recitation Guide',
        arabicTitle: 'أحكام التجويد ومخارج الحروف',
        subtitle: 'Master Noon Sakinah, Tanween, Meem Sakinah, Madd rules, Qalqalah, and stopping signs (Waqf).',
        tags: ['tool', 'tajweed', 'rules', 'recitation', 'noon sakinah', 'idgham', 'ikhfa', 'iqlab', 'madd', 'qalqalah'],
        badge: 'Interactive Guide',
        meta: 'Tajweed Section',
        action: () => {
          saveRecentSearch('Tajweed Rules');
          onNavigateSection('tajweed');
          onClose();
        }
      },
      {
        id: 'tool-qibla-compass',
        title: 'Qibla Direction & Kaaba Compass',
        arabicTitle: 'بوصلة اتجاه القبلة والكعبة المشرفة',
        subtitle: 'Live GPS orientation with magnetic sensor support and Kaaba distance calculator.',
        tags: ['tool', 'qibla', 'compass', 'kaaba', 'makkah', 'direction', 'gps', 'prayer direction'],
        badge: 'GPS Utility',
        meta: 'Qibla Section',
        action: () => {
          saveRecentSearch('Qibla Finder');
          onNavigateSection('qibla');
          onClose();
        }
      },
      {
        id: 'tool-calendar-modal',
        title: 'Hijri & Multi-Calendar System',
        arabicTitle: 'التقويم الهجري والميلادي والأثيوبي',
        subtitle: 'Sync Islamic months, Jumu\'ah dates, white fasting days (Ayyam al-Beed), and Ethiopian Ge\'ez calendar.',
        tags: ['tool', 'calendar', 'hijri', 'gregorian', 'ethiopian', 'fasting', 'ayyam beed', 'islamic date'],
        badge: 'Calendar Tool',
        meta: 'Calendar Modal',
        action: () => {
          saveRecentSearch('Hijri Calendar');
          if (onOpenCalendar) onOpenCalendar('hijri');
          else window.dispatchEvent(new CustomEvent('open-hijri-calendar', { detail: { initialTab: 'hijri' } }));
          onClose();
        }
      },
      {
        id: 'tool-world-clock',
        title: 'World Prayer Clock & Holy Sanctuaries',
        arabicTitle: 'ساعة الحرمين والمواقيت العالمية',
        subtitle: 'Real-time clocks for Makkah, Madinah, Jerusalem, Addis Ababa, Istanbul, London, New York.',
        tags: ['tool', 'clock', 'world clock', 'makkah time', 'madinah time', 'sanctuaries', 'prayer times'],
        badge: 'Clock Utility',
        meta: 'World Clock Modal',
        action: () => {
          saveRecentSearch('World Clock');
          if (onOpenWorldClock) onOpenWorldClock();
          else window.dispatchEvent(new CustomEvent('open-world-clock'));
          onClose();
        }
      },
      {
        id: 'tool-reflection-journal',
        title: 'Tadabbur Reflection Journal & Notes',
        arabicTitle: 'دفتر تدبر القرآن والملاحظات الروحية',
        subtitle: 'Save personal contemplations, emotional Ayah bookmarks, and weekly spiritual reflections.',
        tags: ['tool', 'journal', 'reflection', 'tadabbur', 'notes', 'diary', 'thoughts', 'memorization'],
        badge: 'Personal Tool',
        meta: 'Journal Section',
        action: () => {
          saveRecentSearch('Reflection Journal');
          onNavigateSection('journal');
          onClose();
        }
      },
      {
        id: 'tool-spiritual-poetry',
        title: 'Spiritual Poetry & Qasida Burdah',
        arabicTitle: 'القصائد النبوية ونونية القحطاني',
        subtitle: 'Audio streaming and text for Qasida Burdah & Nooniyah of Al-Qahtani recited by Fares Abbad.',
        tags: ['tool', 'poetry', 'burdah', 'nooniyah', 'fares abbad', 'nasheed', 'spiritual odes', 'naat'],
        badge: 'Audio & Poetry',
        meta: 'Poetry Section',
        action: () => {
          saveRecentSearch('Spiritual Poetry');
          onNavigateSection('poetry');
          onClose();
        }
      },
      {
        id: 'tool-fajr-secrets-documentary',
        title: 'The Secret Time of Fajr Salah & Sahar in Islam (14 Chapters)',
        arabicTitle: 'أسرار وقت صلاة الفجر والسحر في الإسلام',
        subtitle: '14-chapter documentary & spiritual companion on Tahajjud, Fajr Salah, angelic activity at dawn, Rizq & Barakah, 7 post-Fajr deeds, Shaitan\'s 3 knots, and the secret of Nur.',
        tags: ['tool', 'fajr', 'sahar', 'tahajjud', 'dawn', 'sunrise', 'rizq', 'barakah', 'angels', 'nur', 'morning routine', 'shaitan knots', 'documentary', 'video', 'rkqNzpAeeFE'],
        badge: 'Documentary & Guide',
        meta: 'Poetry & Video Companion',
        action: () => {
          saveRecentSearch('Secrets of Fajr Salah');
          try {
            localStorage.setItem('selectedPoemId', 'fajr-secrets');
            localStorage.setItem('poetryActiveTab', 'video');
          } catch (e) { console.error(e); }
          onNavigateSection('poetry');
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('open-poetry-work', { detail: { poemId: 'fajr-secrets', tab: 'video', startTime: 0 } }));
          }, 50);
          onClose();
        }
      },
      {
        id: 'tool-friday-table',
        title: 'Recommended Surahs',
        arabicTitle: 'جدول السور الموصى بها',
        subtitle: 'Analytical matrix comparing Surah Al-Kahf, As-Sajdah, Al-Mulk, Al-Jumu\'ah, Al-Insan with recitation times.',
        tags: ['tool', 'table', 'matrix', 'comparison', 'recommended surahs', 'friday surahs', 'sunnah levels', 'recitations'],
        badge: 'Surahs Library',
        meta: 'Recommended Surahs',
        action: () => {
          saveRecentSearch('Recommended Surahs');
          onNavigateSection('table');
          onClose();
        }
      }
    ];

    toolEntries.forEach(t => {
      items.push({
        ...t,
        category: 'tool'
      });
    });

    return items;
  }, [onNavigateSection, onOpenClassicMushaf, onOpenCalendar, onOpenWorldClock, onOpenStudyModule, onClose]);

  // Filter items based on query & selected category
  const filteredResults = useMemo(() => {
    let list = allItems;

    if (activeCategory !== 'all') {
      list = list.filter(item => item.category === activeCategory);
    }

    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      // If empty query, show top recommended & featured items
      return list.slice(0, 10);
    }

    // Split search terms for multi-word search
    const terms = trimmed.split(/\s+/).filter(Boolean);

    return list.filter(item => {
      const matchTitle = terms.every(t => item.title.toLowerCase().includes(t));
      const matchArabic = item.arabicTitle ? terms.every(t => item.arabicTitle!.includes(t)) : false;
      const matchSubtitle = terms.every(t => item.subtitle.toLowerCase().includes(t));
      const matchTags = terms.every(t => item.tags.some(tag => tag.toLowerCase().includes(t)));

      return matchTitle || matchArabic || matchSubtitle || matchTags;
    }).slice(0, 25);
  }, [allItems, activeCategory, query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < filteredResults.length - 1 ? prev + 1 : 0));
        scrollSelectedItemIntoView(selectedIndex + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredResults.length - 1));
        scrollSelectedItemIntoView(selectedIndex - 1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          filteredResults[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, onClose]);

  const scrollSelectedItemIntoView = (index: number) => {
    if (!resultsContainerRef.current) return;
    const items = resultsContainerRef.current.querySelectorAll('[data-search-item]');
    if (items[index]) {
      items[index].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  const getCategoryIcon = (category: SearchCategory) => {
    switch (category) {
      case 'surah':
        return <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'dua':
        return <Heart className="w-4 h-4 text-rose-500 dark:text-rose-400" />;
      case 'azkar':
        return <Sun className="w-4 h-4 text-amber-500 dark:text-amber-400" />;
      case 'tool':
        return <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />;
      default:
        return <Search className="w-4 h-4 text-slate-500" />;
    }
  };

  const getCategoryBadgeClass = (category: SearchCategory) => {
    switch (category) {
      case 'surah':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60';
      case 'dua':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60';
      case 'azkar':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60';
      case 'tool':
        return 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-950/40 dark:text-primary-300 dark:border-primary-800/60';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 sm:pt-16 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Input Header */}
        <div className="p-3 sm:p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90 flex items-center gap-3">
          <Search className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0 ml-1" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={
              language === 'ar' 
                ? 'ابحث عن سورة، دعاء، ذكر، أو موضوع في الأذكار...'
                : (language === 'am' ? 'ሱራዎችን፣ ዱዓዎችን፣ አዝካሮችን እና መመሪያዎችን ይፈልጉ...' : 'Search Surahs, Duas, Azkar topics, guides...')
            }
            className="flex-1 bg-transparent border-0 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm sm:text-base font-medium focus:outline-none focus:ring-0"
          />

          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Clear search input"
            >
              <X size={16} />
            </button>
          )}

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close modal (Esc)"
          >
            <span className="text-xs font-bold px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hidden sm:inline-block mr-1">ESC</span>
            <X size={18} className="sm:hidden" />
          </button>
        </div>

        {/* Filter Category Chips */}
        <div className="px-3 sm:px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-white dark:bg-slate-900">
          {[
            { id: 'all' as const, label: 'All Items', icon: Search },
            { id: 'surah' as const, label: 'Surahs', icon: BookOpen },
            { id: 'dua' as const, label: 'Duas', icon: Heart },
            { id: 'azkar' as const, label: 'Azkar & Dhikr', icon: Sun },
            { id: 'tool' as const, label: 'Tools & Guides', icon: Sparkles },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveCategory(tab.id);
                  setSelectedIndex(0);
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={12} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Recent / Popular Suggestions when query is empty */}
        {!query && recentSearches.length > 0 && (
          <div className="px-4 py-2.5 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <History size={13} className="text-slate-400" />
              <span className="font-semibold">Recent & Suggested:</span>
              <div className="flex flex-wrap gap-1 items-center ml-1">
                {recentSearches.slice(0, 4).map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(item);
                      setSelectedIndex(0);
                    }}
                    className="px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary-100 hover:text-primary-700 dark:hover:bg-primary-950 dark:hover:text-primary-300 transition-colors cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={clearRecentSearches}
              className="text-[11px] text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
            >
              Clear
            </button>
          </div>
        )}

        {/* Results List */}
        <div 
          ref={resultsContainerRef}
          className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60"
        >
          {filteredResults.length === 0 ? (
            <div className="py-12 px-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Search size={22} />
              </div>
              <h4 className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
                {language === 'ar' ? 'لم نتمكن من العثور على نتائج' : 'No matching results found'}
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {language === 'ar' 
                  ? 'جرب البحث بكلمات أخرى مثل "الكهف"، "استغفار"، "الصباح"، "تجويد"، أو رقم السورة.'
                  : 'Try searching by chapter name (e.g. "Al-Kahf"), keyword ("Forgiveness", "Parents"), or Azkar topic.'}
              </p>
            </div>
          ) : (
            filteredResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  data-search-item
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`group p-3 rounded-xl transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-primary-50/80 dark:bg-primary-950/40 border border-primary-200/80 dark:border-primary-800/60 shadow-xs'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-xl border mt-0.5 shrink-0 ${getCategoryBadgeClass(item.category)}`}>
                      {getCategoryIcon(item.category)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-bold truncate ${
                          isSelected ? 'text-primary-900 dark:text-primary-200' : 'text-slate-800 dark:text-slate-100'
                        }`}>
                          {item.title}
                        </span>

                        {item.arabicTitle && (
                          <span className="font-arabic text-sm text-primary-700/80 dark:text-primary-400 font-medium">
                            {item.arabicTitle}
                          </span>
                        )}

                        {item.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-100 dark:bg-secondary-900/60 text-secondary-800 dark:text-secondary-300 border border-secondary-200 dark:border-secondary-800">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.subtitle}
                      </p>

                      {item.meta && (
                        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400 font-medium">
                          <span>{item.meta}</span>
                          <span>•</span>
                          <span className="capitalize">{item.category}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1 self-center text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    <span className="text-xs font-semibold hidden sm:inline-block">Open</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 sm:px-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 font-mono text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 font-mono text-[10px]">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 font-mono text-[10px]">↵</kbd>
              <span>to select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 font-mono text-[10px]">ESC</kbd>
              <span>to close</span>
            </span>
          </div>

          <div className="text-slate-500 font-medium">
            <span>{filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
