import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Sparkles,
  Volume2,
  ChevronDown,
  ChevronUp,
  Layers,
  Tag,
  Info,
  ExternalLink,
  Code,
  Filter,
  Check,
  Globe,
  Database
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import {
  getDistinctRoots,
  getVocabularyByRoot,
  searchVocabulary,
  stripTashkeel,
  normalizeRoot,
  pronounceArabicWord,
  generateWordTokenTimestamps,
  RootAggregation,
  WordTokenTimestamp
} from './vocabularySubsystem';
import { VerseKeyword, QuranSegment } from './quranStudyModulesData';

interface VocabularySubsystemSectionProps {
  onSelectSegment?: (segment: QuranSegment) => void;
}

export const VocabularySubsystemSection: React.FC<VocabularySubsystemSectionProps> = ({
  onSelectSegment
}) => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  // Subsystem view mode
  const [activeView, setActiveView] = useState<'roots' | 'search' | 'tokens'>('roots');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoot, setSelectedRoot] = useState<string | null>('ر-ح-م');
  const [expandedKeywordId, setExpandedKeywordId] = useState<string | null>(null);

  // Active word timestamp state
  const [activeTokenIndex, setActiveTokenIndex] = useState<number | null>(null);
  const [activeVerseText, setActiveVerseText] = useState<string>('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ');
  const [tokenTimestamps, setTokenTimestamps] = useState<WordTokenTimestamp[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Loaded data states
  const [allRoots, setAllRoots] = useState<RootAggregation[]>([]);
  const [rootDetail, setRootDetail] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Load roots directory
  useEffect(() => {
    const roots = getDistinctRoots();
    setAllRoots(roots);
  }, []);

  // Fetch root details when selectedRoot changes
  useEffect(() => {
    if (selectedRoot) {
      const data = getVocabularyByRoot(selectedRoot);
      setRootDetail(data);
    }
  }, [selectedRoot]);

  // Generate word timestamps when active verse text changes
  useEffect(() => {
    const ts = generateWordTokenTimestamps(activeVerseText, 4500);
    setTokenTimestamps(ts);
  }, [activeVerseText]);

  // Handle Search Input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim()) {
      setActiveView('search');
      const results = searchVocabulary(val);
      setSearchResults(results);
    } else {
      setActiveView('roots');
    }
  };

  // Play audio and sync token highlights
  const handleTokenClick = (token: WordTokenTimestamp) => {
    setActiveTokenIndex(token.wordIndex);
    pronounceArabicWord(token.wordArabic);

    // Simulate word highlight duration
    setTimeout(() => {
      setActiveTokenIndex(null);
    }, token.endMs - token.startMs || 1000);
  };

  // Play full verse audio simulation
  const handlePlayFullVerse = () => {
    setIsPlayingAudio(true);
    let index = 0;

    const interval = setInterval(() => {
      if (index < tokenTimestamps.length) {
        const token = tokenTimestamps[index];
        setActiveTokenIndex(token.wordIndex);
        pronounceArabicWord(token.wordArabic);
        index++;
      } else {
        clearInterval(interval);
        setActiveTokenIndex(null);
        setIsPlayingAudio(false);
      }
    }, 1100);
  };

  return (
    <div className={`space-y-6 ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Subsystem Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 dark:from-slate-900 dark:via-emerald-950 dark:to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold uppercase tracking-wider mb-2">
              <Database className="w-3.5 h-3.5" />
              {language === 'ar' ? 'نظام المعجم والجذور الشامل (8.0)' : language === 'am' ? 'የቃላት እና የስር መዝገብ ስርዓት' : 'Section 8 Vocabulary & Root Subsystem'}
            </div>
            <h2 className="text-2xl font-bold font-serif tracking-tight">
              {language === 'ar' ? 'فهرس الجذور اللغوية والاشتقاقات الشريفة' : language === 'am' ? 'የቁርዓን ቃላት ስሮች እና ማብራሪያ' : 'Trilateral Root Lexicon & Semantic Expansions'}
            </h2>
            <p className="text-sm text-emerald-100/80 mt-1 max-w-2xl">
              {language === 'ar'
                ? 'تحليل المورفولوجيا والجذور الثلاثية (جذر)، ومطابقة المعاني باللغات الثلاث مع مزامنة نطق الحروف والتوقيت.'
                : language === 'am'
                ? 'የሶስት ፊደል ስሮችን፣ ሞርፎሎጂን እና በሶስት ቋንቋዎች የተዘጋጁ ትርጉሞችን ይመርምሩ።'
                : 'Explore trilateral roots (Jizw), multilingual definitions (EN/AR/AM), semantic expansions, and word token audio synchronization.'}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/60 p-1.5 rounded-xl border border-emerald-500/30">
            <button
              onClick={() => setActiveView('roots')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'roots' ? 'bg-emerald-500 text-white shadow' : 'text-emerald-200 hover:bg-emerald-800/40'
              }`}
            >
              {language === 'ar' ? 'فهرس الجذور' : language === 'am' ? 'የስር መውጫ' : 'Roots Directory'}
            </button>
            <button
              onClick={() => setActiveView('tokens')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'tokens' ? 'bg-emerald-500 text-white shadow' : 'text-emerald-200 hover:bg-emerald-800/40'
              }`}
            >
              {language === 'ar' ? 'مزامنة الصوت' : language === 'am' ? 'ድምጽ እና ማብራሪያ' : 'Token Sync'}
            </button>
          </div>
        </div>

        {/* Search Bar with Tashkeel Normalization */}
        <div className="mt-5 relative">
          <Search className={`absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-3.5 w-4 h-4 text-emerald-300`} />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder={
              language === 'ar'
                ? 'بحث بالكلمة، الجذر (ر-ح-م)، أو المعنى (إنجليزي / عربي / أمهري)...'
                : language === 'am'
                ? 'በቃል፣ በስር (ر-ح-م) ወይም በትርጉም ይፈልጉ...'
                : 'Search by Arabic word, Root (e.g. r-h-m / ر-ح-م), or Multilingual Meaning...'
            }
            className={`w-full ${
              isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
            } py-3 bg-white/10 dark:bg-slate-800/50 backdrop-blur-md rounded-xl border border-emerald-400/30 text-white placeholder-emerald-200/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-sans text-sm`}
          />
          {searchQuery && (
            <span className={`absolute ${isRtl ? 'left-3.5' : 'right-3.5'} top-3 text-xs text-emerald-300 bg-emerald-950/80 px-2 py-1 rounded`}>
              {language === 'ar' ? 'تم تجريد التشكيل تلقائياً' : 'Tashkeel Stripped'}
            </span>
          )}
        </div>
      </div>

      {/* SEARCH RESULTS VIEW */}
      {activeView === 'search' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-600" />
              {language === 'ar' ? `نتائج البحث عن: "${searchQuery}"` : `Search Results for "${searchQuery}"`}
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-medium">
              {searchResults.length} {language === 'ar' ? 'نتيجة مطابقة' : 'matches'}
            </span>
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <Info className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p>{language === 'ar' ? 'لم يتم العثور على نتائج مطابقة.' : 'No matching root or vocabulary words found.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((res, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all bg-slate-50/50 dark:bg-slate-800/30"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-amiri text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                        {res.keyword.arabic}
                      </span>
                      <span className="text-xs font-mono ml-2 text-slate-500">({res.keyword.word})</span>
                    </div>
                    {res.keyword.root && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-300 dark:border-emerald-800">
                        جذر: {res.keyword.root}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 text-xs space-y-1 text-slate-600 dark:text-slate-300">
                    <p>
                      <strong className="text-slate-800 dark:text-slate-200">EN:</strong> {res.keyword.meaning?.en}
                    </p>
                    <p>
                      <strong className="text-slate-800 dark:text-slate-200">AR:</strong> {res.keyword.meaning?.ar}
                    </p>
                    <p>
                      <strong className="text-slate-800 dark:text-slate-200">AM:</strong> {res.keyword.meaning?.am}
                    </p>
                  </div>

                  {res.segment && (
                    <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/50 flex items-center justify-between text-xs text-slate-500">
                      <span>
                        Surah {res.segment.surahNumber} : Ayah {res.segment.verseNumber}
                      </span>
                      <button
                        onClick={() => {
                          setActiveVerseText(res.segment.arabicText);
                          setActiveView('tokens');
                          if (onSelectSegment) onSelectSegment(res.segment);
                        }}
                        className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                      >
                        {language === 'ar' ? 'عرض بالآية' : 'View Verse'}
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ROOTS DIRECTORY & ROOT DETAIL VIEW */}
      {activeView === 'roots' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Roots List Sidebar */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-sm">
                <Layers className="w-4 h-4 text-emerald-600" />
                {language === 'ar' ? 'دليل الجذور اللغوية الثلاثية' : language === 'am' ? 'የስሮች ማውጫ' : 'Trilateral Roots Directory'}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {allRoots.length} {language === 'ar' ? 'جذر' : 'roots'}
              </span>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {allRoots.map((rItem) => {
                const isSelected = selectedRoot === rItem.root;
                return (
                  <button
                    key={rItem.root}
                    onClick={() => setSelectedRoot(rItem.root)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all border ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-amiri text-lg font-bold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        {rItem.root}
                      </span>
                      <div>
                        <div className="text-xs font-mono font-bold">{rItem.transliteration}</div>
                        <div className="text-[10px] text-slate-500">
                          {rItem.count} {language === 'ar' ? 'موضع' : 'occurrences'}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                      {rItem.keywordsCount} {language === 'ar' ? 'مفردة' : 'words'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Root Detail Breakdown & Expansions */}
          <div className="lg:col-span-8 space-y-6">
            {rootDetail && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="font-amiri text-3xl font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-4 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      جذر: {rootDetail.root}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">
                        {language === 'ar' ? `المفردات المتفرعة من الجذر (${rootDetail.root})` : `Morphological Derivatives for Root (${rootDetail.root})`}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {rootDetail.totalOccurrences} {language === 'ar' ? 'مفردات ومواضع قرآنية موثقة' : 'total documented occurrences across modules'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => pronounceArabicWord(rootDetail.root)}
                    className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-all flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Volume2 className="w-4 h-4" />
                    {language === 'ar' ? 'نطق الجذر' : 'Pronounce Root'}
                  </button>
                </div>

                {/* Vocabulary Cards for Root */}
                <div className="space-y-4">
                  {rootDetail.matches?.map((mItem: any) => {
                    const kw = mItem.keyword as VerseKeyword;
                    const isExpanded = expandedKeywordId === kw.id;

                    return (
                      <div
                        key={kw.id}
                        className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <span className="font-amiri text-2xl font-bold text-slate-900 dark:text-slate-100">
                              {kw.arabic}
                            </span>
                            <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 font-bold">
                              {kw.word}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => pronounceArabicWord(kw.arabic)}
                              className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-all text-xs flex items-center gap-1"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              {language === 'ar' ? 'استماع' : 'Audio'}
                            </button>

                            {mItem.segment && (
                              <button
                                onClick={() => {
                                  setActiveVerseText(mItem.segment.arabicText);
                                  setActiveView('tokens');
                                  if (onSelectSegment) onSelectSegment(mItem.segment);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-500 hover:text-white transition-all text-xs font-semibold"
                              >
                                Surah {mItem.segment.surahNumber}:{mItem.segment.verseNumber}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Multilingual Meanings (EN / AR / AM) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">English Meaning</span>
                            <p className="font-medium text-slate-800 dark:text-slate-200">{kw.meaning?.en || '—'}</p>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">المعنى بالعربية</span>
                            <p className="font-amiri font-bold text-emerald-700 dark:text-emerald-400">{kw.meaning?.ar || '—'}</p>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">አማርኛ ትርጉም</span>
                            <p className="font-medium text-slate-800 dark:text-slate-200">{kw.meaning?.am || '—'}</p>
                          </div>
                        </div>

                        {/* Collapsible Semantic Expansions (Section 8.5) */}
                        {kw.expansions && kw.expansions.length > 0 && (
                          <div className="pt-2">
                            <button
                              onClick={() => setExpandedKeywordId(isExpanded ? null : kw.id)}
                              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
                            >
                              <Tag className="w-3.5 h-3.5" />
                              {language === 'ar'
                                ? `${kw.expansions.length} إضاءات ودلالات إيمانية وتفرعات جليلة`
                                : `${kw.expansions.length} Semantic Concept Expansions`}
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>

                            {isExpanded && (
                              <div className="mt-3 space-y-2 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50">
                                {kw.expansions.map((exp, idx) => (
                                  <div key={idx} className="flex items-start gap-2 text-xs text-emerald-900 dark:text-emerald-200">
                                    <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>{exp}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOKEN TIMESTAMP & AUDIO SYNCHRONIZATION VIEW (Section 8.4) */}
      {activeView === 'tokens' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-emerald-600" />
                {language === 'ar' ? 'مزامنة نطق الكلمات مع التوقيت الملي-ثاني' : 'Interactive Word Token Timestamp Synchronization'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'ar'
                  ? 'انقر على أي كلمة لتظليلها فوراً واستماع نطقها الدقيق بالصوت'
                  : 'Click any word token to trigger synchronized visual highlighting and phoneme audio pronunciation.'}
              </p>
            </div>

            <button
              onClick={handlePlayFullVerse}
              disabled={isPlayingAudio}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Volume2 className="w-4 h-4" />
              {isPlayingAudio
                ? language === 'ar'
                  ? 'جاري التلاوة التفاعلية...'
                  : 'Playing Sync Audio...'
                : language === 'ar'
                ? 'استماع وتظليل كلي للآية'
                : 'Play Full Verse Sync'}
            </button>
          </div>

          {/* Interactive Synchronized Arabic Verse Display Header */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-50 to-emerald-50/30 dark:from-slate-800/80 dark:to-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60 text-center relative overflow-hidden">
            <div className="text-xs uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider mb-4">
              {language === 'ar' ? 'النص القرآني الكريـم بالرسم العثماني المصحوب بالتزامن' : 'Uthmanic Verse Text with Interactive Token Sync'}
            </div>

            <div dir="rtl" className="font-amiri text-3xl sm:text-4xl md:text-5xl leading-relaxed text-slate-900 dark:text-slate-100 flex flex-wrap justify-center gap-3 md:gap-4 py-2">
              {tokenTimestamps.map((token) => {
                const isHighlighted = activeTokenIndex === token.wordIndex;
                return (
                  <span
                    key={token.wordIndex}
                    onClick={() => handleTokenClick(token)}
                    className={`cursor-pointer px-3 py-1 rounded-xl transition-all duration-200 transform hover:scale-105 select-none ${
                      isHighlighted
                        ? 'bg-amber-400 text-slate-950 shadow-lg scale-110 font-black ring-4 ring-amber-300 dark:ring-amber-500/50'
                        : 'hover:bg-emerald-200/60 dark:hover:bg-emerald-800/60 hover:text-emerald-900 dark:hover:text-emerald-100'
                    }`}
                  >
                    {token.wordArabic}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Token Timestamp Mapping Table */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {language === 'ar' ? 'جدول توقيت الحساب الملي-ثاني (word_token_timestamps)' : 'Word Token Millisecond Timestamp Mapping'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {tokenTimestamps.map((token) => (
                <button
                  key={token.wordIndex}
                  onClick={() => handleTokenClick(token)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    activeTokenIndex === token.wordIndex
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200 shadow'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-amiri text-xl font-bold text-slate-900 dark:text-slate-100">
                      {token.wordArabic}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold">
                      Idx {token.wordIndex}
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>
                      Start: <strong className="text-slate-700 dark:text-slate-300">{token.startMs}ms</strong>
                    </span>
                    <span>
                      End: <strong className="text-slate-700 dark:text-slate-300">{token.endMs}ms</strong>
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
