import React, { useMemo } from 'react';
import { useTTS, tokenize } from './TTSContext';

interface HighlightableTextProps {
  text: string;
  lang: 'ar' | 'en';
  className?: string;
  dir?: 'rtl' | 'ltr';
}

export const HighlightableText: React.FC<HighlightableTextProps> = ({
  text,
  lang,
  className = '',
  dir
}) => {
  const { isSpeaking, activeText, currentCharIndex, highlightEnabled } = useTTS();

  const isCurrentActive = isSpeaking && activeText === text;

  // Split into tokens using robust unicode tokenizer
  const tokens = useMemo(() => {
    return tokenize(text);
  }, [text]);

  // Determine active token index based on currentCharIndex
  const activeTokenIndex = useMemo(() => {
    if (!isCurrentActive || !highlightEnabled || currentCharIndex < 0) return -1;
    
    // Find the word token that covers the current character index
    let bestIndex = -1;
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.isWord && currentCharIndex >= token.start && currentCharIndex < token.end) {
        return i;
      }
      // If index matches exactly the start of a token, keep it as fallback
      if (token.isWord && currentCharIndex === token.start) {
        bestIndex = i;
      }
    }
    return bestIndex;
  }, [isCurrentActive, highlightEnabled, currentCharIndex, tokens]);

  // If not currently active, or highlighting is disabled, render plain text for performance
  if (!isCurrentActive || !highlightEnabled) {
    return (
      <span className={className} dir={dir}>
        {text}
      </span>
    );
  }

  return (
    <span className={className} dir={dir}>
      {tokens.map((token, index) => {
        const isWordActive = index === activeTokenIndex;
        
        if (token.isWord) {
          return (
            <span
              key={index}
              className={`inline-block transition-all duration-150 rounded-xs px-0.5 font-medium
                ${isWordActive 
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-bold scale-[1.03] shadow-xs border-b-2 border-amber-500' 
                  : 'text-slate-800 dark:text-slate-200'
                }`}
            >
              {token.text}
            </span>
          );
        }

        // Return space/punctuation as-is
        return <span key={index}>{token.text}</span>;
      })}
    </span>
  );
};

export default HighlightableText;
