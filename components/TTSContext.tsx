import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export interface Token {
  text: string;
  isWord: boolean;
  start: number;
  end: number;
}

// Robust Unicode tokenization supporting combining characters (harakat/diacritics)
export function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  // \p{L} is letter, \p{M} is mark (diacritic), \p{N} is number
  const regex = /(\s+|[^\s\p{L}\p{M}\p{N}]+|[\p{L}\p{M}\p{N}]+)/gu;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    const tokenText = match[0];
    const start = match.index;
    const end = start + tokenText.length;
    const isWord = /[\p{L}\p{N}]/u.test(tokenText);
    
    tokens.push({
      text: tokenText,
      isWord,
      start,
      end
    });
  }
  return tokens;
}

interface TTSContextType {
  isSpeaking: boolean;
  isPaused: boolean;
  isLoading: boolean;
  activeText: string | null;
  activeLang: 'ar' | 'en' | 'am' | null;
  currentCharIndex: number;
  rate: number;
  pitch: number;
  volume: number;
  selectedArVoice: string;
  selectedEnVoice: string;
  highlightEnabled: boolean;
  voices: SpeechSynthesisVoice[];
  arVoices: SpeechSynthesisVoice[];
  enVoices: SpeechSynthesisVoice[];
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
  setVolume: (volume: number) => void;
  setSelectedArVoice: (voice: string) => void;
  setSelectedEnVoice: (voice: string) => void;
  setHighlightEnabled: (enabled: boolean) => void;
  speak: (text: string, lang: 'ar' | 'en' | 'am') => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
}

const TTSContext = createContext<TTSContextType | undefined>(undefined);

export const TTSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeText, setActiveText] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState<'ar' | 'en' | 'am' | null>(null);
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(-1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [arVoices, setArVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [enVoices, setEnVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Settings persistent in localStorage
  const [rate, setRateState] = useState<number>(() => {
    return parseFloat(localStorage.getItem('tts_rate') || '1.0');
  });
  const [pitch, setPitchState] = useState<number>(() => {
    return parseFloat(localStorage.getItem('tts_pitch') || '1.0');
  });
  const [volume, setVolumeState] = useState<number>(() => {
    return parseFloat(localStorage.getItem('tts_volume') || '0.9');
  });
  const [selectedArVoice, setSelectedArVoiceState] = useState<string>(() => {
    return localStorage.getItem('tts_ar_voice') || '';
  });
  const [selectedEnVoice, setSelectedEnVoiceState] = useState<string>(() => {
    return localStorage.getItem('tts_en_voice') || '';
  });
  const [highlightEnabled, setHighlightEnabledState] = useState<boolean>(() => {
    return localStorage.getItem('tts_highlight_enabled') !== 'false';
  });

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const keepAliveIntervalRef = useRef<any>(null);

  // Load voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);

      const arabic = allVoices.filter(v => v.lang.toLowerCase().startsWith('ar'));
      const english = allVoices.filter(v => v.lang.toLowerCase().startsWith('en'));

      setArVoices(arabic);
      setEnVoices(english);

      // Set defaults if not stored
      if (!localStorage.getItem('tts_ar_voice') && arabic.length > 0) {
        // Prefer ar-SA Google or Natural
        const saudiDefault = arabic.find(v => v.lang.toLowerCase() === 'ar-sa' && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium'))) || 
                             arabic.find(v => v.lang.toLowerCase() === 'ar-sa') || 
                             arabic[0];
        setSelectedArVoiceState(saudiDefault.name);
      }
      if (!localStorage.getItem('tts_en_voice') && english.length > 0) {
        // Prefer Google US English or Natural
        const englishDefault = english.find(v => v.lang.toLowerCase() === 'en-us' && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium'))) || 
                               english.find(v => v.lang.toLowerCase() === 'en-us') || 
                               english.find(v => v.lang.toLowerCase().startsWith('en')) || 
                               english[0];
        setSelectedEnVoiceState(englishDefault.name);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Update setters to persist in localStorage
  const setRate = (r: number) => {
    setRateState(r);
    localStorage.setItem('tts_rate', r.toString());
    if (utteranceRef.current) utteranceRef.current.rate = r;
  };

  const setPitch = (p: number) => {
    setPitchState(p);
    localStorage.setItem('tts_pitch', p.toString());
    if (utteranceRef.current) utteranceRef.current.pitch = p;
  };

  const setVolume = (v: number) => {
    setVolumeState(v);
    localStorage.setItem('tts_volume', v.toString());
    if (utteranceRef.current) utteranceRef.current.volume = v;
  };

  const setSelectedArVoice = (v: string) => {
    setSelectedArVoiceState(v);
    localStorage.setItem('tts_ar_voice', v);
  };

  const setSelectedEnVoice = (v: string) => {
    setSelectedEnVoiceState(v);
    localStorage.setItem('tts_en_voice', v);
  };

  const setHighlightEnabled = (h: boolean) => {
    setHighlightEnabledState(h);
    localStorage.setItem('tts_highlight_enabled', h.toString());
  };

  const stop = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (keepAliveIntervalRef.current) {
      clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = null;
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setIsLoading(false);
    setActiveText(null);
    setActiveLang(null);
    setCurrentCharIndex(-1);
    utteranceRef.current = null;
  };

  const pause = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const resume = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  // Slower rate adjustment for Quranic/liturgical Arabic texts to make them clear and elegant
  const getAdjustedRate = (lang: 'ar' | 'en' | 'am') => {
    if (lang === 'ar') {
      return rate * 0.78; // Scale Arabic down naturally for clear pronunciations
    }
    if (lang === 'am') {
      return rate * 0.90;
    }
    return rate * 0.95;
  };

  const cleanArabicText = (txt: string): string => {
    // Strip non-vocalic Qur'anic punctuation/pause symbols (u0615-u061A and u06D6-u06ED)
    return txt
      .replace(/[\u0615-\u061A\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06EC]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const speak = (text: string, lang: 'ar' | 'en' | 'am') => {
    if (!('speechSynthesis' in window)) return;

    // Toggle behavior if clicking same text
    if (activeText === text && isSpeaking) {
      stop();
      return;
    }

    stop(); // Cancel any current speech
    setIsLoading(true);
    setActiveText(text);
    setActiveLang(lang);
    setCurrentCharIndex(-1);

    // Dispatch global event to pause Surah / Juz recitations
    window.dispatchEvent(new Event('pause-recitation'));

    const cleanText = lang === 'ar' ? cleanArabicText(text) : text;
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;

    // Select Voice
    let voice: SpeechSynthesisVoice | null = null;

    if (lang === 'ar') {
      const voiceName = selectedArVoice;
      if (voiceName) {
        voice = voices.find(v => v.name === voiceName) || null;
      }
      if (!voice) {
        voice = arVoices.find(v => v.lang.toLowerCase() === 'ar-sa') || arVoices[0] || null;
      }
      utterance.lang = 'ar-SA';
    } else if (lang === 'am') {
      voice = voices.find(v => v.lang.toLowerCase().startsWith('am')) || null;
      utterance.lang = 'am-ET';
    } else {
      const voiceName = selectedEnVoice;
      if (voiceName) {
        voice = voices.find(v => v.name === voiceName) || null;
      }
      if (!voice) {
        voice = enVoices.find(v => v.lang.toLowerCase() === 'en-us') || enVoices[0] || null;
      }
      utterance.lang = 'en-US';
    }

    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = getAdjustedRate(lang);
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsLoading(false);
      setIsSpeaking(true);
      setIsPaused(false);

      // Chrome 15s keep-alive hack
      if (keepAliveIntervalRef.current) clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = setInterval(() => {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 12000);
    };

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        setCurrentCharIndex(event.charIndex);
      }
    };

    utterance.onend = () => {
      stop();
    };

    utterance.onerror = (e) => {
      console.error("TTS synthesis error:", e);
      stop();
    };

    window.speechSynthesis.speak(utterance);

    // Chrome/iOS fallback if onstart is slow or doesn't fire immediately
    setTimeout(() => {
      if (window.speechSynthesis.speaking && isLoading) {
        setIsLoading(false);
        setIsSpeaking(true);
      }
    }, 200);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return (
    <TTSContext.Provider value={{
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
      voices,
      arVoices,
      enVoices,
      setRate,
      setPitch,
      setVolume,
      setSelectedArVoice,
      setSelectedEnVoice,
      setHighlightEnabled,
      speak,
      stop,
      pause,
      resume
    }}>
      {children}
    </TTSContext.Provider>
  );
};

export const useTTS = () => {
  const context = useContext(TTSContext);
  if (context === undefined) {
    throw new Error('useTTS must be used within a TTSProvider');
  }
  return context;
};
