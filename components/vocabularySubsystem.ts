import { QURAN_STUDY_MODULES, VerseKeyword, QuranSegment } from './quranStudyModulesData';

// Tashkeel Stripping Regex as mandated by Section 8.3
export const TASHKEEL_REGEX = /[\u0617-\u061A\u064B-\u0652]/g;

export function stripTashkeel(text: string): string {
  if (!text) return '';
  return text.replace(TASHKEEL_REGEX, '').replace(/[\u0670\u0671\u0653\u0654\u0655]/g, '');
}

export function normalizeRoot(root: string): string {
  if (!root) return '';
  const clean = stripTashkeel(root).replace(/[^a-zA-Z\u0621-\u064A]/g, '').trim();
  if (clean.length === 3 || clean.length === 4) {
    return clean.split('').join('-');
  }
  return root.trim();
}

export interface WordTokenTimestamp {
  wordIndex: number;
  wordArabic: string;
  cleanArabic: string;
  startMs: number;
  endMs: number;
  audioDurationMs: number;
}

export interface RootAggregation {
  root: string;
  transliteration: string;
  count: number;
  keywordsCount: number;
  keywords: Array<{
    id: string;
    word: string;
    arabic: string;
    meaning: { en: string; ar: string; am: string };
    surahNumber: number;
    verseNumber: number;
    segmentId: string;
  }>;
}

export function getAllSegments(): QuranSegment[] {
  const segments: QuranSegment[] = [];
  for (const mod of QURAN_STUDY_MODULES) {
    segments.push(...mod.segments);
  }
  return segments;
}

export function getDistinctRoots(): RootAggregation[] {
  const rootMap = new Map<string, RootAggregation>();

  for (const seg of getAllSegments()) {
    if (!seg.keywords) continue;
    for (const kw of seg.keywords) {
      if (!kw.root) continue;
      const stdRoot = normalizeRoot(kw.root);
      const existing = rootMap.get(stdRoot);

      const kwData = {
        id: kw.id,
        word: kw.word,
        arabic: kw.arabic,
        meaning: kw.meaning,
        surahNumber: seg.surahNumber,
        verseNumber: seg.verseNumber,
        segmentId: seg.id
      };

      if (existing) {
        existing.count += 1;
        if (!existing.keywords.some((k) => k.id === kw.id)) {
          existing.keywords.push(kwData);
          existing.keywordsCount += 1;
        }
      } else {
        rootMap.set(stdRoot, {
          root: stdRoot,
          transliteration: kw.rootTransliteration || stdRoot,
          count: 1,
          keywordsCount: 1,
          keywords: [kwData]
        });
      }
    }
  }

  return Array.from(rootMap.values()).sort((a, b) => b.count - a.count);
}

export function getVocabularyByRoot(rootQuery: string) {
  const targetRoot = normalizeRoot(rootQuery);
  const matchedKeywords: Array<{
    keyword: VerseKeyword;
    segment: QuranSegment;
  }> = [];

  for (const seg of getAllSegments()) {
    if (!seg.keywords) continue;
    for (const kw of seg.keywords) {
      if (!kw.root) continue;
      if (normalizeRoot(kw.root) === targetRoot || stripTashkeel(kw.root) === stripTashkeel(rootQuery)) {
        matchedKeywords.push({ keyword: kw, segment: seg });
      }
    }
  }

  return {
    root: targetRoot,
    totalOccurrences: matchedKeywords.length,
    matches: matchedKeywords
  };
}

export function searchVocabulary(query: string) {
  if (!query || !query.trim()) return [];
  const qClean = stripTashkeel(query.toLowerCase().trim());

  const results: Array<{
    keyword: VerseKeyword;
    segment: QuranSegment;
    matchScore: number;
    matchType: 'exact_root' | 'arabic_word' | 'english_meaning' | 'amharic_meaning';
  }> = [];

  for (const seg of getAllSegments()) {
    if (!seg.keywords) continue;
    for (const kw of seg.keywords) {
      const kwRoot = stripTashkeel(kw.root || '').toLowerCase();
      const kwArabic = stripTashkeel(kw.arabic || '').toLowerCase();
      const kwWord = (kw.word || '').toLowerCase();
      const meaningEn = (kw.meaning?.en || '').toLowerCase();
      const meaningAr = stripTashkeel(kw.meaning?.ar || '').toLowerCase();
      const meaningAm = (kw.meaning?.am || '').toLowerCase();

      let matchScore = 0;
      let matchType: 'exact_root' | 'arabic_word' | 'english_meaning' | 'amharic_meaning' = 'english_meaning';

      if (kwRoot === qClean || normalizeRoot(kw.root) === normalizeRoot(query)) {
        matchScore = 100;
        matchType = 'exact_root';
      } else if (kwArabic.includes(qClean)) {
        matchScore = 80;
        matchType = 'arabic_word';
      } else if (kwWord.includes(qClean) || meaningEn.includes(qClean)) {
        matchScore = 60;
        matchType = 'english_meaning';
      } else if (meaningAr.includes(qClean) || meaningAm.includes(qClean)) {
        matchScore = 50;
        matchType = 'amharic_meaning';
      }

      if (matchScore > 0) {
        results.push({ keyword: kw, segment: seg, matchScore, matchType });
      }
    }
  }

  return results.sort((a, b) => b.matchScore - a.matchScore);
}

export function generateWordTokenTimestamps(arabicText: string, audioDurationMs: number = 5000): WordTokenTimestamp[] {
  const words = arabicText.split(/\s+/).filter(Boolean);
  const totalChars = arabicText.length || 1;
  let currentMs = 0;

  return words.map((word, index) => {
    const wordRatio = word.length / totalChars;
    const duration = Math.max(350, Math.round(audioDurationMs * wordRatio));
    const startMs = currentMs;
    const endMs = startMs + duration;
    currentMs = endMs;

    return {
      wordIndex: index,
      wordArabic: word,
      cleanArabic: stripTashkeel(word),
      startMs,
      endMs,
      audioDurationMs
    };
  });
}

export function pronounceArabicWord(word: string) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const cleanText = word.replace(/[^\u0621-\u064A\u0617-\u061A\u064B-\u0652]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText || word);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis failed:', e);
    }
  }
}
