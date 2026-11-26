import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Book, FileText, Trash2, Search, Calendar, 
  Edit, Copy, Check, PlusCircle, X, Info, Sparkles, AlertCircle,
  Bold, Italic, List, Tag, Clock, Mic, Music, Volume2
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { allSurahs } from './surahListData';
import { RecitationRecorderModal, RecitationFragment } from './RecitationRecorderModal';
import { RecitationFragmentItem } from './RecitationFragmentItem';

export interface Reflection {
  id: string;
  surahNumber: number;
  surahNameEnglish: string;
  surahNameArabic: string;
  ayahRange: string;
  text: string;
  date: string; // ISO String or locale date
  timestamp: number;
  lastEdited?: string;
  tags?: string[];
  recitations?: RecitationFragment[];
}

const journalTranslations = {
  en: {
    title: 'Reflection Journal',
    subtitle: 'Save personal notes, deep lessons, spiritual reflections, and audio recitation recordings for specific Surahs.',
    writeNew: 'Write a New Reflection',
    editReflection: 'Edit Reflection',
    selectSurah: 'Select Surah',
    searchSurahPlaceholder: 'Type to filter Surahs...',
    ayahRange: 'Ayah / Verse Range (Optional)',
    ayahRangePlaceholder: 'e.g., 1-10, or All',
    reflectionText: 'My Reflection Notes',
    reflectionTextPlaceholder: 'What lessons, guidance, or spiritual reminders did you take from these verses?',
    saveBtn: 'Save Entry',
    updateBtn: 'Update Entry',
    clearBtn: 'Clear Form',
    cancelBtn: 'Cancel Edit',
    myJournal: 'My Reflections',
    searchReflections: 'Search your reflections...',
    noReflections: 'No reflections saved yet.',
    noReflectionsDesc: 'Select a Surah above to write reflection notes and record your own voice recitations.',
    noSearchResults: 'No matching reflections found.',
    copySuccess: 'Copied to clipboard!',
    deleteConfirm: 'Are you sure you want to delete this reflection?',
    deleteConfirmBtn: 'Yes, Delete',
    deleteCancelBtn: 'Cancel',
    charLimit: 'characters',
    ayahLabel: 'Ayahs:',
    addedSuccess: 'Reflection saved successfully!',
    updatedSuccess: 'Reflection updated successfully!',
    deletedSuccess: 'Reflection deleted.',
    lastEdited: 'Last edited',
    bold: 'Bold',
    italic: 'Italic',
    bullet: 'Bullet List',
    totalEntries: 'Total Reflections',
    lastActive: 'Last Active',
    noActivity: 'No activity yet',
    tagsLabel: 'Tags / Topics',
    addCustomTag: 'Add tag...',
    filterByTag: 'Filter by Tag',
    allTags: 'All',
    recordRecitationBtn: 'Record Recitation',
    recordRecitationHint: 'Attach your own voice recitation for these verses',
    recitationsHeading: 'Recitation Fragments',
    addRecitationToCard: '+ Add Recitation',
    recitationAttachedSuccess: 'Recitation fragment attached!',
    recitationRemovedSuccess: 'Recitation fragment removed.',
  },
  ar: {
    title: 'دفتر التدبر والتلاوة',
    subtitle: 'احفظ ملاحظاتك وتأملاتك وسجّل تلاوتك القرآنية بصوتك لمراجعة التجويد والتدبر.',
    writeNew: 'تدبر جديد',
    editReflection: 'تعديل التدبر',
    selectSurah: 'اختر السورة',
    searchSurahPlaceholder: 'اكتب لتصفية السور...',
    ayahRange: 'الآيات (اختياري)',
    ayahRangePlaceholder: 'مثال: 1-10، أو السورة كاملة',
    reflectionText: 'ملاحظاتي وتدبراتي',
    reflectionTextPlaceholder: 'ما هي الدروس والعبر أو الهدايات الإيمانية التي استخلصتها من هذه الآيات؟',
    saveBtn: 'حفظ التدبر',
    updateBtn: 'تحديث التدبر',
    clearBtn: 'مسح النموذج',
    cancelBtn: 'إلغاء التعديل',
    myJournal: 'تدبراتي المحفوظة',
    searchReflections: 'ابحث في تدبراتك...',
    noReflections: 'لا توجد تدبرات محفوظة بعد.',
    noReflectionsDesc: 'اختر سورة أعلاه لكتابة خواطرك وتسجيل تلاوتك القرآنية بصوتك.',
    noSearchResults: 'لم يتم العثور على تدبرات مطابقة.',
    copySuccess: 'تم النسخ إلى الحافظة!',
    deleteConfirm: 'هل أنت متأكد من رغبتك في حذف هذا التدبر؟',
    deleteConfirmBtn: 'نعم، احذف',
    deleteCancelBtn: 'إلغاء',
    charLimit: 'حرفاً',
    ayahLabel: 'الآيات:',
    addedSuccess: 'تم حفظ التدبر بنجاح!',
    updatedSuccess: 'تم تحديث التدبر بنجاح!',
    deletedSuccess: 'تم حذف التدبر.',
    lastEdited: 'آخر تعديل',
    bold: 'خط عريض',
    italic: 'خط مائل',
    bullet: 'قائمة نقطية',
    totalEntries: 'إجمالي التدبرات',
    lastActive: 'آخر نشاط',
    noActivity: 'لا يوجد نشاط بعد',
    tagsLabel: 'الوسوم / المواضيع',
    addCustomTag: 'إضافة وسم...',
    filterByTag: 'تصفية حسب الوسوم',
    allTags: 'الكل',
    recordRecitationBtn: 'تسجيل تلاوة للآيات',
    recordRecitationHint: 'سجّل بصوتك تلاوة لهذه الآيات وأرفقها بالتدبر',
    recitationsHeading: 'التلاوات المسجلة',
    addRecitationToCard: '+ تسجيل تلاوة',
    recitationAttachedSuccess: 'تم إرفاق التلاوة بنجاح!',
    recitationRemovedSuccess: 'تم حذف التلاوة.',
  },
  am: {
    title: 'የማስተንተኛ እና የንባብ ማስታወሻ',
    subtitle: 'የሚያነቡትን ሱራዎች በሚመለከት የግል ማስታወሻዎችን እና የድምጽ ንባብዎን ያስቀምጡ።',
    writeNew: 'አዲስ አስተንትኖ ጻፍ',
    editReflection: 'አስተንትኖውን አሻሽል',
    selectSurah: 'ሱራ ይምረጡ',
    searchSurahPlaceholder: 'ሱራ ለመፈለግ እዚህ ይጻፉ...',
    ayahRange: 'የአንቀጽ ክልል (አማራጭ)',
    ayahRangePlaceholder: 'ምሳሌ: 1-10, ወይም ሙሉ',
    reflectionText: 'የእኔ አስተንትኖ',
    reflectionTextPlaceholder: 'ከእነዚህ አንቀጾች ምን ዓይነት ትምህርት ወይም መንፈሳዊ ማሳሰቢያ ወስደዋል?',
    saveBtn: 'አስቀምጥ',
    updateBtn: 'አሻሽል',
    clearBtn: 'አጽዳ',
    cancelBtn: 'ሰርዝ',
    myJournal: 'የእኔ ማስተንተኛዎች',
    searchReflections: 'ማስተንተኛዎችን ፈልግ...',
    noReflections: 'ምንም ማስታወሻ አልተቀመጠም።',
    noReflectionsDesc: 'ከላይ ሱራ በመምረጥ ማስታወሻዎን ይጻፉ እና የራስዎን ንባብ ይቅረጹ።',
    noSearchResults: 'የሚዛመድ ማስታወሻ አልተገኘም።',
    copySuccess: 'ኮፒ ተደርጓል!',
    deleteConfirm: 'ይህን ማስታወሻ መሰረዝ እርግጠኛ ነዎት?',
    deleteConfirmBtn: 'አዎ፣ ሰርዝ',
    deleteCancelBtn: 'ተመለስ',
    charLimit: 'ፊደላት',
    ayahLabel: 'አንቀጾች:',
    addedSuccess: 'ማስተንተኛው ተቀምጧል!',
    updatedSuccess: 'ማስተንተኛው ተስተካክሏል!',
    deletedSuccess: 'ማስተንተኛው ተሰርዟል።',
    lastEdited: 'ለመጨረሻ ጊዜ የተስተካከለው',
    bold: 'ደማቅ',
    italic: 'ሰያፍ',
    bullet: 'ነጥብ ዝርዝር',
    totalEntries: 'አጠቃላይ ማስተንተኛዎች',
    lastActive: 'የመጨረሻው እንቅስቃሴ',
    noActivity: 'ምንም እንቅስቃሴ የለም',
    tagsLabel: 'መለያዎች / ርዕሶች',
    addCustomTag: 'መለያ አክል...',
    filterByTag: 'በመለያ ያጣሩ',
    allTags: 'ሁሉም',
    recordRecitationBtn: 'ንባብ ይቅረጹ',
    recordRecitationHint: 'የራስዎን የድምጽ ንባብ ከዚህ ማስታወሻ ጋር ያያይዙ',
    recitationsHeading: 'የተቀረጹ ንባቦች',
    addRecitationToCard: '+ ንባብ ቅረጽ',
    recitationAttachedSuccess: 'ንባቡ በተሳካ ሁኔታ ተያይዟል!',
    recitationRemovedSuccess: 'ንባቡ ተሰርዟል።',
  },
  har: {
    title: 'የማስተንተኛ ደፍተር',
    subtitle: 'ቁርአን ተቅራእባህቲ ግል ማስታወሻና የድምጽ ንባብህን በዚህ ደፍተር አሕፍዝ።',
    writeNew: 'አዲስ አስተንትኖ ጻፍ',
    editReflection: 'አስተንትኖ መትቃናት',
    selectSurah: 'ሱራ መርጭ',
    searchSurahPlaceholder: 'ሱራ ለመፈለግ እዚህ ጻፍ...',
    ayahRange: 'የአያህ ክልል (አማራጭ)',
    ayahRangePlaceholder: 'ምሳሌ: 1-10, ወይም በሕቲ',
    reflectionText: 'ማስታወሻቼ',
    reflectionTextPlaceholder: 'ከዚህ አያህ ምን ዓይነት ትምህርት أو መንፈሳዊ ማሳሰቢያ ወስደሃል?',
    saveBtn: 'አሕፍዝ',
    updateBtn: 'አሻሽል',
    clearBtn: 'አጽዳ',
    cancelBtn: 'ሰርዝ',
    myJournal: 'የእኔ አስተንትኖአች',
    searchReflections: 'አስተንትኖ መፈለግ...',
    noReflections: 'ምንም ማስታወሻ አልተቀመጠም።',
    noReflectionsDesc: 'ከላዕ ሱራ መርጨት መጀመርያ ማስታወሻህን ጻፍና ድምጽህን ቅዳ።',
    noSearchResults: 'የሚዛመድ ማስታወሻ አልተገኘም።',
    copySuccess: 'ኮፒ ተደርጓል!',
    deleteConfirm: 'ይህን ማስታወሻ መሰረዝ እርግጠኛ ነህ?',
    deleteConfirmBtn: 'አዎ፣ ሰርዝ',
    deleteCancelBtn: 'ተመለስ',
    charLimit: 'ፊደላት',
    ayahLabel: 'አያህአች:',
    addedSuccess: 'ማስታወሻው ተቀምጧል!',
    updatedSuccess: 'ማስታወሻው ተስተካክሏል!',
    deletedSuccess: 'ማስታወሻው ተሰርዟል።',
    lastEdited: 'ለመጨረሻ ጊዜ የተስተካከለው',
    bold: 'ደማቅ',
    italic: 'ሰያፍ',
    bullet: 'ነጥብ ዝርዝር',
    totalEntries: 'አጠቃላይ ማስታወሻአች',
    lastActive: 'መጨረሻ ማስታወሻ',
    noActivity: 'ምንም እንቅስቃሴ የለም',
    tagsLabel: 'ታጎች / ርዕሶች',
    addCustomTag: 'ታግ መጨመር...',
    filterByTag: 'በታግ መለየት',
    allTags: 'ሁሉም',
    recordRecitationBtn: 'ንባብ መቅዳት',
    recordRecitationHint: 'የራስህን የቁርአን ንባብ ከዚህ ማስታወሻ ጋር ማያያዝ',
    recitationsHeading: 'የተቀዱ ንባብአች',
    addRecitationToCard: '+ ንባብ መቅዳት',
    recitationAttachedSuccess: 'የተቀዳው ንባብ ተያይዟል!',
    recitationRemovedSuccess: 'የተቀዳው ንባብ ተሰርዟል።',
  }
};

interface FormattedTextProps {
  text: string;
}

const FormattedText: React.FC<FormattedTextProps> = ({ text }) => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  const parseItalics = (textChunk: string): React.ReactNode[] => {
    const italicParts = textChunk.split(/(\*.*?\*|_.*?_)/g);
    return italicParts.map((part, i) => {
      if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
        const content = part.slice(1, -1);
        return <em key={`em-${i}`} className="italic text-slate-800 dark:text-slate-200">{content}</em>;
      }
      return part;
    });
  };

  const parseInline = (lineText: string): React.ReactNode[] => {
    const boldParts = lineText.split(/(\*\*.*?\*\*)/g);
    return boldParts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const content = part.slice(2, -2);
        return <strong key={`b-${i}`} className="font-bold text-slate-900 dark:text-white">{parseItalics(content)}</strong>;
      }
      return <React.Fragment key={`text-${i}`}>{parseItalics(part)}</React.Fragment>;
    });
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    const bulletMatch = trimmedLine.match(/^[-*•]\s+(.*)/);
    if (bulletMatch) {
      const content = bulletMatch[1];
      currentList.push(
        <li key={`li-${index}`} className="list-disc ml-5 pl-1 my-0.5 text-slate-700 dark:text-slate-300">
          {parseInline(content)}
        </li>
      );
    } else {
      if (currentList.length > 0) {
        elements.push(<ul key={`ul-${index}`} className="space-y-1 my-2">{currentList}</ul>);
        currentList = [];
      }
      if (trimmedLine === '') {
        elements.push(<div key={`br-${index}`} className="h-2" />);
      } else {
        elements.push(
          <p key={`p-${index}`} className="text-slate-700 dark:text-slate-300 my-1">
            {parseInline(line)}
          </p>
        );
      }
    }
  });

  if (currentList.length > 0) {
    elements.push(<ul key="ul-final" className="space-y-1 my-2">{currentList}</ul>);
  }

  return <div className="space-y-1 text-left">{elements}</div>;
};

export const ReflectionJournal: React.FC = () => {
  const { language } = useLanguage();
  const tJournal = journalTranslations[language as keyof typeof journalTranslations] || journalTranslations.en;

  const [reflections, setReflections] = useState<Reflection[]>(() => {
    try {
      const stored = localStorage.getItem('an_noor_reflections');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load reflections', e);
      return [];
    }
  });

  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(18); // Default to Al-Kahf
  const [ayahRange, setAyahRange] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState<string>('');
  const [selectedFilterTag, setSelectedFilterTag] = useState<string | null>(null);

  // Audio recitations attached to current form
  const [formRecitations, setFormRecitations] = useState<RecitationFragment[]>([]);

  // Modal Recorder state
  const [isRecorderOpen, setIsRecorderOpen] = useState<boolean>(false);
  const [recorderSurahNumber, setRecorderSurahNumber] = useState<number>(18);
  const [recorderSurahNameEnglish, setRecorderSurahNameEnglish] = useState<string>('Al-Kahf');
  const [recorderSurahNameArabic, setRecorderSurahNameArabic] = useState<string>('الكهف');
  const [recorderDefaultAyah, setRecorderDefaultAyah] = useState<string>('');
  const [activeRecordTarget, setActiveRecordTarget] = useState<'form' | string>('form'); // 'form' or reflectionId

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // UI feedbacks
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFormat = (type: 'bold' | 'italic' | 'bullet') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = text;

    let tagStart = '';
    let tagEnd = '';
    let placeholderText = '';

    if (type === 'bold') {
      tagStart = '**';
      tagEnd = '**';
      placeholderText = 'bold text';
    } else if (type === 'italic') {
      tagStart = '*';
      tagEnd = '*';
      placeholderText = 'italic text';
    } else if (type === 'bullet') {
      const isStartOfLine = start === 0 || currentText.charAt(start - 1) === '\n';
      tagStart = isStartOfLine ? '- ' : '\n- ';
      tagEnd = '';
      placeholderText = 'list item';
    }

    const selectedText = currentText.substring(start, end);
    const replacement = selectedText 
      ? (type === 'bullet' 
          ? (selectedText.split('\n').map(line => line.startsWith('- ') ? line : `- ${line}`).join('\n'))
          : `${tagStart}${selectedText}${tagEnd}`) 
      : `${tagStart}${placeholderText}${tagEnd}`;
      
    const newText = currentText.substring(0, start) + replacement + currentText.substring(end);

    setText(newText);

    setTimeout(() => {
      textarea.focus();
      const selectionStartOffset = start + tagStart.length;
      const selectionEndOffset = selectionStartOffset + (selectedText ? (type === 'bullet' ? replacement.length - tagStart.length : selectedText.length) : placeholderText.length);
      textarea.setSelectionRange(selectionStartOffset, selectionEndOffset);
    }, 0);
  };

  // Search filter surahs for select dropdown
  const [surahSearchText, setSurahSearchText] = useState<string>('');
  const [isSurahDropdownOpen, setIsSurahDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto scroll/fill when receiving open-reflection-journal custom event
  useEffect(() => {
    const handleOpenJournalEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ surahNumber: number; ayahRange?: string; openRecorder?: boolean }>;
      if (customEvent.detail) {
        const { surahNumber, ayahRange: initialRange, openRecorder } = customEvent.detail;
        setSelectedSurahNumber(surahNumber);
        if (initialRange) {
          setAyahRange(initialRange);
        }
        setEditingId(null); // Stop editing any previous
        setText(''); // Clear text
        setFormRecitations([]);
        
        const surahObj = allSurahs.find(s => s.number === surahNumber);

        if (openRecorder && surahObj) {
          setRecorderSurahNumber(surahNumber);
          setRecorderSurahNameEnglish(surahObj.englishName);
          setRecorderSurahNameArabic(surahObj.name);
          setRecorderDefaultAyah(initialRange ? `Ayah ${initialRange}` : '');
          setActiveRecordTarget('form');
          setIsRecorderOpen(true);
        }

        setTimeout(() => {
          editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      }
    };
    window.addEventListener('open-reflection-journal', handleOpenJournalEvent);
    return () => {
      window.removeEventListener('open-reflection-journal', handleOpenJournalEvent);
    };
  }, []);

  // Save to localStorage whenever reflections list changes
  useEffect(() => {
    try {
      localStorage.setItem('an_noor_reflections', JSON.stringify(reflections));
    } catch (e) {
      console.error('Failed to save reflections', e);
    }
  }, [reflections]);

  // Click outside listener for custom dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSurahDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Open Recorder for active form
  const handleOpenFormRecorder = () => {
    const sObj = allSurahs.find(s => s.number === selectedSurahNumber);
    if (!sObj) return;
    setRecorderSurahNumber(selectedSurahNumber);
    setRecorderSurahNameEnglish(sObj.englishName);
    setRecorderSurahNameArabic(sObj.name);
    setRecorderDefaultAyah(ayahRange ? `Ayah ${ayahRange}` : '');
    setActiveRecordTarget('form');
    setIsRecorderOpen(true);
  };

  // Open Recorder directly for an existing saved reflection card
  const handleOpenCardRecorder = (ref: Reflection) => {
    setRecorderSurahNumber(ref.surahNumber);
    setRecorderSurahNameEnglish(ref.surahNameEnglish);
    setRecorderSurahNameArabic(ref.surahNameArabic);
    setRecorderDefaultAyah(ref.ayahRange ? `Ayah ${ref.ayahRange}` : '');
    setActiveRecordTarget(ref.id);
    setIsRecorderOpen(true);
  };

  // Save recitation from modal
  const handleSaveRecitationFragment = (fragment: RecitationFragment) => {
    if (activeRecordTarget === 'form') {
      setFormRecitations(prev => [...prev, fragment]);
      triggerToast(tJournal.recitationAttachedSuccess);
    } else {
      // Attach to existing reflection card
      const targetId = activeRecordTarget;
      setReflections(prev => prev.map(r => {
        if (r.id === targetId) {
          const currentRecs = r.recitations || [];
          return {
            ...r,
            recitations: [...currentRecs, fragment]
          };
        }
        return r;
      }));
      triggerToast(tJournal.recitationAttachedSuccess);
    }
  };

  // Delete recitation fragment from form
  const handleRemoveFormRecitation = (fragmentId: string) => {
    setFormRecitations(prev => prev.filter(f => f.id !== fragmentId));
    triggerToast(tJournal.recitationRemovedSuccess);
  };

  // Delete recitation fragment from saved reflection card
  const handleDeleteCardRecitation = (reflectionId: string, fragmentId: string) => {
    setReflections(prev => prev.map(r => {
      if (r.id === reflectionId) {
        return {
          ...r,
          recitations: (r.recitations || []).filter(f => f.id !== fragmentId)
        };
      }
      return r;
    }));
    triggerToast(tJournal.recitationRemovedSuccess);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && formRecitations.length === 0) return;

    const selectedSurah = allSurahs.find(s => s.number === selectedSurahNumber);
    if (!selectedSurah) return;

    const formattedDateTime = new Date().toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    if (editingId) {
      // Update existing reflection
      const updated = reflections.map(r => {
        if (r.id === editingId) {
          return {
            ...r,
            surahNumber: selectedSurahNumber,
            surahNameEnglish: selectedSurah.englishName,
            surahNameArabic: selectedSurah.name,
            ayahRange: ayahRange.trim(),
            text: text.trim(),
            date: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
            timestamp: Date.now(),
            lastEdited: formattedDateTime,
            tags: selectedTags,
            recitations: formRecitations
          };
        }
        return r;
      });
      setReflections(updated);
      setEditingId(null);
      triggerToast(tJournal.updatedSuccess);
    } else {
      // Add new reflection
      const newEntry: Reflection = {
        id: 'ref_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now(),
        surahNumber: selectedSurahNumber,
        surahNameEnglish: selectedSurah.englishName,
        surahNameArabic: selectedSurah.name,
        ayahRange: ayahRange.trim(),
        text: text.trim(),
        date: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
        timestamp: Date.now(),
        lastEdited: formattedDateTime,
        tags: selectedTags,
        recitations: formRecitations
      };
      setReflections([newEntry, ...reflections]);
      triggerToast(tJournal.addedSuccess);
    }

    // Reset Form
    setAyahRange('');
    setText('');
    setSelectedTags([]);
    setCustomTagInput('');
    setFormRecitations([]);
  };

  const handleEdit = (ref: Reflection) => {
    setEditingId(ref.id);
    setSelectedSurahNumber(ref.surahNumber);
    setAyahRange(ref.ayahRange);
    setText(ref.text);
    setSelectedTags(ref.tags || []);
    setFormRecitations(ref.recitations || []);
    setCustomTagInput('');
    setDeleteConfirmId(null);

    // Scroll smoothly to editor
    editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleDelete = (id: string) => {
    const updated = reflections.filter(r => r.id !== id);
    setReflections(updated);
    setDeleteConfirmId(null);
    if (editingId === id) {
      setEditingId(null);
      setAyahRange('');
      setText('');
      setSelectedTags([]);
      setCustomTagInput('');
      setFormRecitations([]);
    }
    triggerToast(tJournal.deletedSuccess);
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const filteredReflections = reflections.filter(r => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      r.surahNameEnglish.toLowerCase().includes(query) ||
      r.surahNameArabic.toLowerCase().includes(query) ||
      r.text.toLowerCase().includes(query) ||
      r.ayahRange.toLowerCase().includes(query) ||
      (r.recitations && r.recitations.some(rec => rec.title.toLowerCase().includes(query)))
    );
    const matchesTag = !selectedFilterTag || (r.tags && r.tags.includes(selectedFilterTag));
    return matchesSearch && matchesTag;
  });

  const selectedSurahObject = allSurahs.find(s => s.number === selectedSurahNumber);
  
  // Filtered surah list for dropdown search
  const filteredSurahs = allSurahs.filter(s => 
    s.englishName.toLowerCase().includes(surahSearchText.toLowerCase()) ||
    s.name.includes(surahSearchText) ||
    s.number.toString().includes(surahSearchText)
  );

  const getMostRecentActivity = () => {
    if (reflections.length === 0) return tJournal.noActivity;
    const maxTimestamp = Math.max(...reflections.map(r => r.timestamp));
    const latestRef = reflections.find(r => r.timestamp === maxTimestamp);
    if (!latestRef) return tJournal.noActivity;
    return latestRef.lastEdited || latestRef.date;
  };

  const allUniqueTags = Array.from(
    new Set([
      'Gratitude', 'Guidance', 'Tafsir', 'Lessons', 'Spiritual',
      ...reflections.flatMap(r => r.tags || [])
    ])
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Recitation Audio Recorder Modal */}
      <RecitationRecorderModal
        isOpen={isRecorderOpen}
        onClose={() => setIsRecorderOpen(false)}
        surahNumber={recorderSurahNumber}
        surahNameEnglish={recorderSurahNameEnglish}
        surahNameArabic={recorderSurahNameArabic}
        defaultAyahRange={recorderDefaultAyah}
        onSaveRecitation={handleSaveRecitationFragment}
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-xl shadow-xl border border-slate-700/80 flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-300">
          <Sparkles className="w-4 h-4 text-secondary-400" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Hero Header Section */}
      <div className="bg-gradient-to-br from-white to-primary-50/10 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-secondary-200/80 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-primary-100/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-primary-100 text-primary-800 rounded-xl">
                <BookOpen className="w-7 h-7" />
              </div>
              <span>{tJournal.title}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {tJournal.subtitle}
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-white border border-secondary-200/80 rounded-2xl p-4 shadow-xs shrink-0 w-full lg:w-auto divide-x divide-slate-100">
            <div className="text-center px-2 flex-1 lg:flex-initial min-w-[100px]">
              <span className="block text-2xl font-black font-mono text-primary-700">{reflections.length}</span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">{tJournal.totalEntries}</span>
            </div>
            <div className="text-center pl-4 pr-2 flex-1 lg:flex-initial min-w-[140px]">
              <span className="block text-sm sm:text-base font-bold text-slate-700 flex items-center justify-center gap-1.5 min-h-[32px]">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="truncate max-w-[140px] text-xs font-semibold" title={getMostRecentActivity()}>{getMostRecentActivity()}</span>
              </span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block">{tJournal.lastActive}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout for Form & Reflections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Write/Edit Reflection */}
        <div ref={editorRef} className="lg:col-span-5 bg-white border border-secondary-200/80 rounded-2xl shadow-xs overflow-hidden sticky top-24">
          <div className="p-5 border-b border-secondary-100 bg-secondary-50/40 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
              {editingId ? <Edit className="w-4 h-4 text-primary-600" /> : <PlusCircle className="w-4 h-4 text-primary-600" />}
              <span>{editingId ? tJournal.editReflection : tJournal.writeNew}</span>
            </h3>
            {editingId && (
              <button 
                onClick={() => {
                  setEditingId(null);
                  setAyahRange('');
                  setText('');
                  setFormRecitations([]);
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg cursor-pointer"
              >
                {tJournal.cancelBtn}
              </button>
            )}
          </div>
          
          <form onSubmit={handleSave} className="p-5 space-y-5">
            
            {/* Surah Selector with Search */}
            <div className="space-y-1.5" ref={dropdownRef}>
              <label className="block text-xs sm:text-sm font-bold text-slate-700">{tJournal.selectSurah}</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsSurahDropdownOpen(!isSurahDropdownOpen)}
                  className="w-full bg-white text-left px-4 py-3 border border-secondary-300 rounded-xl shadow-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs sm:text-sm font-medium text-slate-800 flex justify-between items-center cursor-pointer min-h-[44px]"
                >
                  <span className="flex items-center gap-2">
                    <Book className="w-4 h-4 text-primary-500" />
                    <span>
                      {selectedSurahObject 
                        ? `${selectedSurahObject.number}. ${selectedSurahObject.englishName} (${selectedSurahObject.name})`
                        : tJournal.selectSurah}
                    </span>
                  </span>
                  <span className="text-slate-400">▼</span>
                </button>

                {isSurahDropdownOpen && (
                  <div className="absolute z-30 mt-1 w-full bg-white border border-secondary-200 rounded-xl shadow-lg max-h-64 overflow-y-auto overflow-x-hidden">
                    <div className="p-2 border-b border-secondary-100 bg-slate-50 sticky top-0 z-10 flex items-center">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-4" />
                      <input
                        type="text"
                        placeholder={tJournal.searchSurahPlaceholder}
                        value={surahSearchText}
                        onChange={(e) => setSurahSearchText(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-white border border-secondary-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                      {surahSearchText && (
                        <button 
                          type="button" 
                          onClick={() => setSurahSearchText('')} 
                          className="absolute right-4 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="py-1">
                      {filteredSurahs.length > 0 ? (
                        filteredSurahs.map((surah) => (
                          <button
                            key={surah.number}
                            type="button"
                            onClick={() => {
                              setSelectedSurahNumber(surah.number);
                              setIsSurahDropdownOpen(false);
                              setSurahSearchText('');
                            }}
                            className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm hover:bg-primary-50/50 transition-colors flex items-center justify-between cursor-pointer
                              ${selectedSurahNumber === surah.number ? 'bg-primary-50 text-primary-900 font-bold' : 'text-slate-700'}`}
                          >
                            <span>{surah.number}. {surah.englishName}</span>
                            <span className="font-arabic text-xs font-semibold text-primary-700">{surah.name}</span>
                          </button>
                        ))
                      ) : (
                        <p className="p-4 text-xs text-center text-slate-500 italic">No matching Surahs</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Ayah Range */}
            <div className="space-y-1.5">
              <label htmlFor="ayah-range-input" className="block text-xs sm:text-sm font-bold text-slate-700">{tJournal.ayahRange}</label>
              <input
                id="ayah-range-input"
                type="text"
                value={ayahRange}
                onChange={(e) => setAyahRange(e.target.value)}
                placeholder={tJournal.ayahRangePlaceholder}
                className="w-full px-4 py-2.5 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs sm:text-sm text-slate-800 shadow-xs"
              />
            </div>

            {/* Recitation Fragment Recorder Button & Attached Audio Preview */}
            <div className="space-y-3 p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-200/70">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{tJournal.recordRecitationBtn}</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  {formRecitations.length} attached
                </span>
              </div>

              <p className="text-[11px] text-emerald-700/90 leading-tight">
                {tJournal.recordRecitationHint}
              </p>

              {/* Record Action Button */}
              <button
                type="button"
                onClick={handleOpenFormRecorder}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>{formRecitations.length > 0 ? '+ Record Another Clip' : tJournal.recordRecitationBtn}</span>
              </button>

              {/* List of currently attached recitations in this form draft */}
              {formRecitations.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-emerald-200/60">
                  {formRecitations.map(fragment => (
                    <RecitationFragmentItem
                      key={fragment.id}
                      fragment={fragment}
                      onDelete={handleRemoveFormRecitation}
                      canDelete={true}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Tag Selection System */}
            <div className="space-y-2.5 bg-slate-50/50 p-3 rounded-xl border border-secondary-200/50">
              <label className="block text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-primary-600" />
                <span>{tJournal.tagsLabel}</span>
              </label>
              
              {/* Preset Tags List */}
              <div className="flex flex-wrap gap-1.5">
                {['Gratitude', 'Guidance', 'Tafsir', 'Lessons', 'Spiritual'].map((preset) => {
                  const isSelected = selectedTags.includes(preset);
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedTags(selectedTags.filter(t => t !== preset));
                        } else {
                          setSelectedTags([...selectedTags, preset]);
                        }
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer select-none border flex items-center gap-1
                        ${isSelected 
                          ? 'bg-primary-100 text-primary-800 border-primary-300 shadow-2xs' 
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100/80'}`}
                    >
                      <span>{preset}</span>
                      {isSelected && <X className="w-2.5 h-2.5 hover:text-primary-900" />}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Tag Form Field */}
              <div className="flex items-center gap-1.5 mt-1">
                <input
                  type="text"
                  placeholder={tJournal.addCustomTag}
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const trimmed = customTagInput.trim();
                      if (trimmed && !selectedTags.includes(trimmed)) {
                        setSelectedTags([...selectedTags, trimmed]);
                        setCustomTagInput('');
                      }
                    }
                  }}
                  className="flex-1 px-3 py-1.5 bg-white border border-secondary-300 rounded-lg text-xs focus:ring-1 focus:ring-primary-500 focus:border-primary-500 focus:outline-none min-h-[32px]"
                />
                <button
                  type="button"
                  onClick={() => {
                    const trimmed = customTagInput.trim();
                    if (trimmed && !selectedTags.includes(trimmed)) {
                      setSelectedTags([...selectedTags, trimmed]);
                      setCustomTagInput('');
                    }
                  }}
                  disabled={!customTagInput.trim()}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer border select-none min-h-[32px]
                    ${customTagInput.trim() 
                      ? 'bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100' 
                      : 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'}`}
                >
                  +
                </button>
              </div>

              {/* Selected custom tags display */}
              {selectedTags.some(tag => !['Gratitude', 'Guidance', 'Tafsir', 'Lessons', 'Spiritual'].includes(tag)) && (
                <div className="flex flex-wrap gap-1 pt-1 border-t border-secondary-100/80 mt-1">
                  {selectedTags.map((tag) => {
                    const isPreset = ['Gratitude', 'Guidance', 'Tafsir', 'Lessons', 'Spiritual'].includes(tag);
                    if (isPreset) return null;
                    return (
                      <span 
                        key={tag} 
                        className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-semibold"
                      >
                        <span>{tag}</span>
                        <button 
                          type="button" 
                          onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
                          className="hover:text-amber-900"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reflection Content */}
            <div className="space-y-1.5">
              <label htmlFor="reflection-textarea" className="block text-xs sm:text-sm font-bold text-slate-700">{tJournal.reflectionText}</label>
              
              {/* Simple Formatting Toolbar */}
              <div className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 border border-secondary-300 rounded-t-xl">
                <button
                  type="button"
                  onClick={() => handleFormat('bold')}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 rounded transition-all cursor-pointer flex items-center justify-center"
                  title={tJournal.bold}
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormat('italic')}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 rounded transition-all cursor-pointer flex items-center justify-center"
                  title={tJournal.italic}
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormat('bullet')}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 rounded transition-all cursor-pointer flex items-center justify-center"
                  title={tJournal.bullet}
                >
                  <List className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-slate-200 mx-1.5" />
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider select-none">Toolbar</span>
              </div>

              <textarea
                id="reflection-textarea"
                ref={textareaRef}
                rows={6}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={tJournal.reflectionTextPlaceholder}
                className="w-full px-4 py-3 border border-t-0 border-secondary-300 rounded-b-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs sm:text-sm text-slate-800 shadow-xs leading-relaxed focus:outline-none"
              />
              <div className="flex justify-between items-center text-[11px] text-slate-400 px-1 pt-0.5 font-medium">
                <span className="flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>Supports markdown notes and recitation audio</span>
                </span>
                <span>{text.length} {tJournal.charLimit}</span>
              </div>
            </div>

            {/* Submit Button Row */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={!text.trim() && formRecitations.length === 0}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all text-center flex items-center justify-center gap-2 select-none active:scale-98 cursor-pointer
                  ${(text.trim() || formRecitations.length > 0)
                    ? 'bg-primary-700 hover:bg-primary-800 text-white border border-primary-800' 
                    : 'bg-slate-100 text-slate-400 border border-slate-200/80 cursor-not-allowed'}`}
              >
                <FileText className="w-4 h-4" />
                <span>{editingId ? tJournal.updateBtn : tJournal.saveBtn}</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setAyahRange('');
                  setText('');
                  setFormRecitations([]);
                }}
                className="p-3 border border-secondary-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-xl transition-all cursor-pointer"
                title={tJournal.clearBtn}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

          </form>
        </div>

        {/* Right Reflections: History List */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={tJournal.searchReflections}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-secondary-200 pl-11 pr-10 py-3 rounded-2xl shadow-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs sm:text-sm font-medium text-slate-800"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Tag Category Filter Row */}
          <div className="flex items-center gap-2 overflow-x-auto py-1.5 scrollbar-thin select-none">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap mr-1 flex items-center gap-1 shrink-0">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>{tJournal.filterByTag}:</span>
            </span>
            
            {/* "All" Tag filter */}
            <button
              onClick={() => setSelectedFilterTag(null)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap border select-none
                ${selectedFilterTag === null 
                  ? 'bg-primary-700 text-white border-primary-800 shadow-2xs font-extrabold' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100/60'}`}
            >
              {tJournal.allTags}
            </button>
            
            {/* Dynamic Tags */}
            {allUniqueTags.map((tag) => {
              const count = reflections.filter(r => r.tags && r.tags.includes(tag)).length;
              const isPreset = ['Gratitude', 'Guidance', 'Tafsir', 'Lessons', 'Spiritual'].includes(tag);
              if (count === 0 && !isPreset) return null;

              const isSelected = selectedFilterTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedFilterTag(isSelected ? null : tag)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap border flex items-center gap-1 select-none
                    ${isSelected 
                      ? 'bg-primary-700 text-white border-primary-800 shadow-2xs font-extrabold' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100/60'}`}
                >
                  <span>{tag}</span>
                  {count > 0 && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black
                      ${isSelected ? 'bg-primary-800 text-primary-200' : 'bg-slate-100 text-slate-500'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* List of Reflections */}
          <div className="space-y-4">
            {filteredReflections.length > 0 ? (
              filteredReflections.map((ref) => {
                const isDeleting = deleteConfirmId === ref.id;
                const isCopied = copiedId === ref.id;
                const isEditingThis = editingId === ref.id;
                const hasRecitations = ref.recitations && ref.recitations.length > 0;

                return (
                  <div 
                    key={ref.id} 
                    className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all duration-300 shadow-xs relative overflow-hidden group
                      ${isEditingThis ? 'border-primary-400 ring-1 ring-primary-100 bg-primary-50/5' : 'border-secondary-200/80 hover:border-secondary-300 hover:shadow-sm'}`}
                  >
                    
                    {/* Corner ribbon for edit state */}
                    {isEditingThis && (
                      <div className="absolute right-0 top-0 bg-primary-700 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl tracking-wider uppercase">
                        Active Edit
                      </div>
                    )}

                    {/* Card Header: Surah & Date Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-50/80 text-primary-800 border border-primary-200/50 flex items-center justify-center font-mono font-black text-xs shrink-0 shadow-2xs">
                          {ref.surahNumber}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-slate-900 text-sm sm:text-base font-serif">
                              {ref.surahNameEnglish}
                            </h4>
                            <span className="text-xs font-arabic text-primary-700 font-medium">
                              ({ref.surahNameArabic})
                            </span>
                          </div>
                          
                          {/* Ayah / Verse range if present */}
                          {ref.ayahRange && (
                            <span className="inline-flex items-center gap-1 mt-1 bg-secondary-100/60 text-secondary-800 px-2.5 py-0.5 rounded-md text-[10px] sm:text-xs font-bold border border-secondary-200/30">
                              <span className="opacity-75">{tJournal.ayahLabel}</span>
                              <span>{ref.ayahRange}</span>
                            </span>
                          )}

                          {/* Entry Tags */}
                          {ref.tags && ref.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {ref.tags.map((tag) => (
                                <span 
                                  key={tag} 
                                  className="inline-flex items-center gap-0.5 bg-primary-50 text-primary-800 border border-primary-200/30 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold"
                                >
                                  <Tag className="w-2.5 h-2.5 opacity-60" />
                                  <span>{tag}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold self-start sm:self-center bg-slate-50 px-2 py-1 rounded-lg">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{ref.date}</span>
                      </div>
                    </div>

                    {/* Card Body: Note Content */}
                    {ref.text && (
                      <div className="py-4 text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-text break-words">
                        <FormattedText text={ref.text} />
                        {ref.lastEdited && (
                          <div className="mt-3.5 text-[11px] text-amber-800 dark:text-amber-300 font-medium italic flex items-center gap-1.5 bg-amber-50/50 dark:bg-amber-950/20 px-2.5 py-1.5 rounded-lg border border-amber-100/50 w-fit">
                            <span className="opacity-75">{tJournal.lastEdited}:</span>
                            <span>{ref.lastEdited}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Attached Audio Recitations Section */}
                    {hasRecitations && (
                      <div className="my-3 pt-3 border-t border-dashed border-emerald-200/60 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                            <Music className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{tJournal.recitationsHeading}</span>
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                            {ref.recitations!.length} {ref.recitations!.length === 1 ? 'recording' : 'recordings'}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {ref.recitations!.map(fragment => (
                            <RecitationFragmentItem
                              key={fragment.id}
                              fragment={fragment}
                              onDelete={(fragId) => handleDeleteCardRecitation(ref.id, fragId)}
                              canDelete={true}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Card Footer: Quick Actions / Confirm deletion */}
                    <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                      
                      {/* Left: + Add Recitation Quick Action Button */}
                      <button
                        onClick={() => handleOpenCardRecorder(ref)}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1.5 rounded-xl border border-emerald-200/60 transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Record a recitation fragment for this reflection"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>{tJournal.addRecitationToCard}</span>
                      </button>

                      {/* Right Actions */}
                      <div className="flex items-center gap-2">
                        {isDeleting ? (
                          <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                            <span className="text-[11px] text-rose-600 font-bold">{tJournal.deleteConfirm}</span>
                            <button
                              onClick={() => handleDelete(ref.id)}
                              className="text-xs font-bold px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-all cursor-pointer"
                            >
                              {tJournal.deleteConfirmBtn}
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="text-xs font-bold px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-all cursor-pointer"
                            >
                              {tJournal.deleteCancelBtn}
                            </button>
                          </div>
                        ) : (
                          <>
                            {/* Copy button */}
                            <button
                              onClick={() => handleCopy(ref.text + (ref.lastEdited ? `\n\n${tJournal.lastEdited}: ${ref.lastEdited}` : ''), ref.id)}
                              className={`p-2 rounded-lg border transition-all flex items-center justify-center gap-1 cursor-pointer min-h-[34px] min-w-[34px]
                                ${isCopied 
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                                  : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-500 hover:text-slate-800'}`}
                              title="Copy Reflection text"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              {isCopied && <span className="text-[10px] font-bold px-0.5">{tJournal.copySuccess}</span>}
                            </button>

                            {/* Edit button */}
                            <button
                              onClick={() => handleEdit(ref)}
                              disabled={isEditingThis}
                              className={`p-2 rounded-lg border transition-all flex items-center justify-center gap-1 cursor-pointer min-h-[34px]
                                ${isEditingThis 
                                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200' 
                                  : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-500 hover:text-primary-700 hover:border-primary-200'}`}
                              title="Edit reflection"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => setDeleteConfirmId(ref.id)}
                              className="p-2 bg-white hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 rounded-lg text-slate-400 hover:text-rose-600 transition-all flex items-center justify-center cursor-pointer min-h-[34px]"
                              title="Delete reflection"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>

                    </div>

                  </div>
                );
              })
            ) : (
              <div className="bg-white/65 backdrop-blur-xs rounded-2xl border border-dashed border-secondary-300/80 p-12 text-center max-w-xl mx-auto space-y-4">
                <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto text-secondary-600">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm sm:text-base">
                    {searchQuery ? tJournal.noSearchResults : tJournal.noReflections}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                    {searchQuery ? 'Try matching another search term or clear the filter.' : tJournal.noReflectionsDesc}
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
