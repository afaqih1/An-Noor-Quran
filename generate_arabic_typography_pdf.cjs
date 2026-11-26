const fs = require('fs');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

async function createArabicTypographyPDF() {
  const pdfDoc = await PDFDocument.create();
  
  // Embed standard Helvetica fonts
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  const fontCode = await pdfDoc.embedFont(StandardFonts.Courier);

  // Palette
  const primaryColor = rgb(0.04, 0.40, 0.28);     // Emerald dark #064e3b
  const secondaryColor = rgb(0.12, 0.16, 0.22);   // Slate 900
  const accentColor = rgb(0.72, 0.55, 0.33);      // Warm Gold
  const grayColor = rgb(0.35, 0.40, 0.48);        // Slate 500
  const lightGrayColor = rgb(0.95, 0.96, 0.98);   // Code block background
  const borderColor = rgb(0.85, 0.88, 0.92);

  const pages = [];
  let currentPage = pdfDoc.addPage([595.28, 841.89]); // A4 Size
  pages.push(currentPage);

  const margin = 50;
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = pageHeight - 50;

  function addNewPage() {
    currentPage = pdfDoc.addPage([595.28, 841.89]);
    pages.push(currentPage);
    cursorY = pageHeight - 50;
    return currentPage;
  }

  function checkSpace(neededHeight) {
    if (cursorY - neededHeight < 50) {
      addNewPage();
    }
  }

  function wrapText(text, font, size, maxWidth) {
    const lines = [];
    const paragraphs = text.split('\n');
    for (const paragraph of paragraphs) {
      if (paragraph.trim() === '') {
        lines.push('');
        continue;
      }
      const words = paragraph.split(' ');
      let currentLine = '';
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const width = font.widthOfTextAtSize(testLine, size);
        if (width <= maxWidth) {
          currentLine = testLine;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);
    }
    return lines;
  }

  function drawHeading1(text) {
    checkSpace(42);
    cursorY -= 15;
    currentPage.drawText(text, {
      x: margin,
      y: cursorY,
      size: 15,
      font: fontBold,
      color: primaryColor,
    });
    cursorY -= 8;
    currentPage.drawLine({
      start: { x: margin, y: cursorY },
      end: { x: pageWidth - margin, y: cursorY },
      thickness: 1.5,
      color: primaryColor,
    });
    cursorY -= 18;
  }

  function drawHeading2(text) {
    checkSpace(30);
    cursorY -= 10;
    currentPage.drawText(text, {
      x: margin,
      y: cursorY,
      size: 11.5,
      font: fontBold,
      color: secondaryColor,
    });
    cursorY -= 16;
  }

  function drawParagraph(text, font = fontRegular, size = 9.5, color = secondaryColor, indent = 0) {
    const lines = wrapText(text, font, size, contentWidth - indent);
    for (const line of lines) {
      checkSpace(16);
      if (line !== '') {
        currentPage.drawText(line, {
          x: margin + indent,
          y: cursorY,
          size: size,
          font: font,
          color: color,
        });
      }
      cursorY -= (size * 1.45);
    }
    cursorY -= 4;
  }

  function drawBullet(title, text) {
    const fullText = `${title}: ${text}`;
    const lines = wrapText(fullText, fontRegular, 9.5, contentWidth - 16);
    checkSpace(lines.length * 14.5 + 8);
    currentPage.drawText('•', {
      x: margin + 4,
      y: cursorY,
      size: 12,
      font: fontBold,
      color: primaryColor,
    });
    let isFirst = true;
    for (const line of lines) {
      if (isFirst) {
        currentPage.drawText(line, {
          x: margin + 16,
          y: cursorY,
          size: 9.5,
          font: fontRegular,
          color: secondaryColor,
        });
        isFirst = false;
      } else {
        currentPage.drawText(line, {
          x: margin + 16,
          y: cursorY,
          size: 9.5,
          font: fontRegular,
          color: secondaryColor,
        });
      }
      cursorY -= 14;
    }
    cursorY -= 4;
  }

  function drawCodeBlock(code) {
    const lines = code.split('\n');
    const blockHeight = lines.length * 11.5 + 16;
    checkSpace(blockHeight + 10);
    
    // Draw background box
    currentPage.drawRectangle({
      x: margin,
      y: cursorY - blockHeight + 12,
      width: contentWidth,
      height: blockHeight,
      color: lightGrayColor,
      borderColor: borderColor,
      borderWidth: 1,
    });

    cursorY -= 8;
    for (const line of lines) {
      checkSpace(14);
      currentPage.drawText(line, {
        x: margin + 10,
        y: cursorY,
        size: 8,
        font: fontCode,
        color: rgb(0.1, 0.15, 0.25),
      });
      cursorY -= 11.5;
    }
    cursorY -= 10;
  }

  // --- COVER & TITLE HEADER ---
  currentPage.drawText('ENGINEERING & DESIGN REQUIREMENTS SPECIFICATION', {
    x: margin,
    y: cursorY,
    size: 9.5,
    font: fontBold,
    color: accentColor,
  });
  cursorY -= 18;

  currentPage.drawText('Arabic Typography, Phrasis & Sentence Layout Architecture', {
    x: margin,
    y: cursorY,
    size: 18,
    font: fontBold,
    color: primaryColor,
  });
  cursorY -= 22;

  currentPage.drawText('Font Selection, Diacritical Spacing, Bidirectional Alignment & Highlighting', {
    x: margin,
    y: cursorY,
    size: 13,
    font: fontBold,
    color: secondaryColor,
  });
  cursorY -= 14;

  currentPage.drawLine({
    start: { x: margin, y: cursorY },
    end: { x: pageWidth - margin, y: cursorY },
    thickness: 2,
    color: primaryColor,
  });
  cursorY -= 18;

  drawParagraph(
    'Document Version: 1.0.0 | Target Stack: HTML5 / CSS3 / Tailwind CSS / React / TypeScript\n' +
    'This document establishes definitive engineering requirements, mathematical spacing ratios, typographic font stacks, and reusable React implementation patterns for displaying Arabic text, Quranic verses (Ayat), poetic stanzas, and daily supplications with flawless legibility and interactive highlighting.',
    fontItalic,
    9,
    grayColor
  );
  cursorY -= 6;

  // --- 1. EXECUTIVE SUMMARY & TYPOGRAPHIC PHILOSOPHY ---
  drawHeading1('1. Executive Summary & Typographic Philosophy');
  drawParagraph(
    'Arabic script is cursive, highly sensitive to line spacing, and enriched with mandatory diacritical vowel marks (Tashkeel) when presenting classical or Quranic texts. Traditional Latin-centric typography rules—such as standard line heights (1.5) or arbitrary letter-spacing—cause severe visual defects in Arabic, including clipped Harakat (Fatha, Kasra, Damma, Shaddah, Sukun), broken ligatures, and illegible phrase crowding.'
  );
  drawParagraph(
    'To guarantee museum-grade presentation across desktop and mobile devices, applications must implement a dedicated Arabic Typography Architecture based on four core pillars:'
  );

  drawBullet('1. Naskh-Optimized Serif Font Stack', 'Adopting "Amiri" (a classical Naskh font family) for sacred texts and formal literature, paired with system Arabic fallbacks.');
  drawBullet('2. Diacritic-Safe Vertical Rhythm (Leading)', 'Enforcing generous line heights ranging from 1.8x to 2.5x to prevent diacritic overlapping between adjacent lines.');
  drawBullet('3. Bidirectional (RTL) Structural Isolation', 'Enclosing all Arabic sentences and phrases within explicit RTL containers with proper text justification and punctuation alignment.');
  drawBullet('4. Non-Destructive Word Tokenization', 'Enabling synchronized word-by-word audio highlighting without breaking cursive character connectivity or Tashkeel.');

  // --- 2. FONT FAMILY SELECTION & WEBFONT CONFIGURATION ---
  drawHeading1('2. Font Family Selection & WebFont Configuration');
  drawHeading2('REQ-1: Arabic Font Family Stack & Loading Strategy');
  drawParagraph(
    'The application MUST load the "Amiri" Google Font (weights 400 and 700) to render Quranic Arabic, supplications, and classical poetry. Amiri is designed specifically to support complex Arabic ligatures and precise Tashkeel positioning.'
  );
  drawBullet('CSS / Tailwind Class', '.font-arabic mapped to ["Amiri", "serif", "Traditional Arabic", "Scheherazade", "system-ui"].');
  drawBullet('Font Weight Selection', 'Use wght@400 for long-form verses and wght@700 for headings, Surah titles, and emphasis.');
  drawBullet('Letter Spacing Prohibition', 'NEVER apply CSS letter-spacing (tracking-wide or tracking-widest) to cursive Arabic body text, as this disconnects cursive letter joins.');

  // --- 3. LINE HEIGHT, DIACRITIC CLEARANCE & FONT SCALING ---
  drawHeading1('3. Line Height, Diacritic Clearance & Font Scaling Rules');
  drawHeading2('REQ-2: Mathematical Line Height (Leading) Standards');
  drawParagraph(
    'Because Arabic diacritics extend above (e.g., Fatha, Shaddah, Maddah) and below (e.g., Kasra) the baseline, standard line heights will clip marks. Applications must enforce strict vertical line-height rules based on content type:'
  );
  drawBullet('Quranic Verses (Ayat)', 'Line height MUST be between leading-[2.2] and leading-[2.5] (220% to 250% of font size).');
  drawBullet('Classical Poetry & Adhkar', 'Line height MUST be set to leading-[1.8] or leading-[2.0] (180% to 200% of font size).');
  drawBullet('UI Labels & Short Phrases', 'Line height MUST be set to leading-relaxed (162.5% of font size).');

  drawHeading2('REQ-3: Proportional Font Size Scaling (Arabic vs. Latin)');
  drawParagraph(
    'Arabic glyphs have a smaller x-height relative to their bounding box compared to Latin characters. To achieve optical balance when displayed alongside English translations, Arabic text MUST be scaled 1.25x to 1.4x larger than the corresponding English translation:'
  );
  drawBullet('Primary Verse Size', '24px to 36px (text-2xl sm:text-3xl or text-4xl) for Arabic verses, compared to 16px to 18px (text-base sm:text-lg) for English translation text.');
  drawBullet('Dynamic Font Zooming', 'Support user-adjustable font scaling (e.g., classicFontSize from 22px up to 48px) without breaking container layout or line wrapping.');

  // --- 4. BIDIRECTIONAL (RTL) LAYOUT & ALIGNMENT ---
  drawHeading1('4. Bidirectional (RTL) Layout & Alignment');
  drawHeading2('REQ-4: Structural RTL Isolation & Punctuation Integrity');
  drawParagraph(
    'When displaying Arabic sentences or mixed Arabic-English content, every Arabic block MUST be isolated using the dir="rtl" HTML attribute.'
  );
  drawBullet('Container Directionality', 'Always include dir="rtl" on parent wrapper divs and paragraphs to ensure brackets, periods, and verse end-markers (Ayah symbols U+06DD) appear on the correct side.');
  drawBullet('Text Alignment Rules', 'Use text-right for standard supplication cards, text-center for poetic verses and hero quotes, and text-justify for classical Mushaf page modes.');

  // --- 5. PHRASIS, SENTENCE SEGMENTATION & HIGHLIGHTING ---
  drawHeading1('5. Phrasis, Sentence Segmentation & Highlighting');
  drawHeading2('REQ-5: Non-Destructive Word Tokenization Architecture');
  drawParagraph(
    'To implement interactive word-by-word highlighting (such as synchronizing with audio playback), the application MUST tokenize sentences into individual word spans without corrupting cursive letter connections or separating diacritics from their base characters.'
  );
  drawBullet('Tokenization Rule', 'Use standard whitespace boundaries via unicode-aware regex parsing (/(\\s+)/). Each word token includes its base letters, attached prefixes/suffixes, and all Tashkeel marks.');
  drawBullet('Inline Span Wrap', 'Render each word inside an inline <span>. Apply highlighting styles (e.g., bg-primary-100/50, text-primary-800, rounded-md) to active spans without altering inline margin or border width.');

  // --- 6. REFERENCE IMPLEMENTATIONS ---
  drawHeading1('6. Reference Code Implementation (Tailwind & CSS)');
  drawParagraph(
    'The following configuration snippet demonstrates how to set up the Arabic typography stack in Tailwind CSS and HTML5:'
  );

  const cssCode = `// 1. Google WebFont declaration in index.html or CSS
<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet" />

// 2. tailwind.config.js setup
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        arabic: ['Amiri', 'Traditional Arabic', 'serif'],
      },
    },
  },
};

// 3. Reusable Arabic Verse CSS Component Class (Tailwind)
// "font-arabic text-2xl sm:text-3xl text-slate-900 leading-[2.2] text-right select-all"`;

  drawCodeBlock(cssCode);

  drawHeading1('7. Reference React Implementation: HighlightableText Component');
  drawParagraph(
    'The following production-ready React component (HighlightableText.tsx) demonstrates how to safely tokenize and render Arabic sentences with interactive word highlighting:'
  );

  const reactCode = `// src/components/HighlightableText.tsx
import React, { useMemo } from 'react';

export interface Token {
  text: string;
  isWord: boolean;
  start: number;
  end: number;
}

export function tokenizeArabic(text: string): Token[] {
  const tokens: Token[] = [];
  const regex = /(\\s+)/;
  const parts = text.split(regex);
  let currentIndex = 0;

  for (const part of parts) {
    if (!part) continue;
    const isWhitespace = /^\\s+$/.test(part);
    tokens.push({
      text: part,
      isWord: !isWhitespace,
      start: currentIndex,
      end: currentIndex + part.length,
    });
    currentIndex += part.length;
  }
  return tokens;
}

interface Props {
  text: string;
  activeCharIndex?: number;
  isSpeaking?: boolean;
  className?: string;
}

export const HighlightableArabicText: React.FC<Props> = ({
  text,
  activeCharIndex = -1,
  isSpeaking = false,
  className = '',
}) => {
  const tokens = useMemo(() => tokenizeArabic(text), [text]);

  // Find index of the word currently being spoken
  const activeTokenIndex = useMemo(() => {
    if (!isSpeaking || activeCharIndex < 0) return -1;
    return tokens.findIndex(
      (t) => t.isWord && activeCharIndex >= t.start && activeCharIndex < t.end
    );
  }, [isSpeaking, activeCharIndex, tokens]);

  return (
    <p className={\`font-arabic text-3xl leading-[2.2] text-right select-all \${className}\`} dir="rtl">
      {tokens.map((token, idx) => {
        const isActive = idx === activeTokenIndex;
        if (!token.isWord) {
          return <span key={idx}>{token.text}</span>;
        }
        return (
          <span
            key={idx}
            className={\`transition-colors duration-150 rounded-md px-1 py-0.5 \${
              isActive
                ? 'bg-emerald-100 text-emerald-900 font-bold ring-1 ring-emerald-300'
                : 'text-slate-900 hover:text-emerald-800'
            }\`}
          >
            {token.text}
          </span>
        );
      })}
    </p>
  );
};`;

  drawCodeBlock(reactCode);

  drawHeading1('8. Enterprise Copy-Paste Integrity & Accessibility');
  drawBullet('User Text Selection (select-all)', 'Every Quranic verse, Hadith, and supplication card MUST include the Tailwind select-all or select-text utility class. This allows scholars and students to copy Arabic verses in one click without accidental character truncation.');
  drawBullet('WCAG 2.1 AA Contrast Ratios', 'Arabic text with delicate Tashkeel strokes requires a minimum contrast ratio of 7:1 against card backgrounds (e.g., text-slate-900 #0f172a on white #ffffff or text-white on slate-900 in dark mode).');
  drawBullet('Screen Reader Support (lang="ar")', 'Ensure every Arabic container includes lang="ar" and dir="rtl" so screen readers correctly enunciate Arabic phonemes instead of spelling out unicode characters.');

  // --- FOOTER & PAGE NUMBERS ---
  const totalPages = pages.length;
  pages.forEach((page, index) => {
    page.drawLine({
      start: { x: margin, y: 35 },
      end: { x: pageWidth - margin, y: 35 },
      thickness: 0.5,
      color: borderColor,
    });
    page.drawText(
      `Arabic Typography, Phrasis & Sentence Layout Specifications  |  Page ${index + 1} of ${totalPages}`,
      {
        x: margin,
        y: 20,
        size: 8,
        font: fontRegular,
        color: grayColor,
      }
    );
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('public/Arabic_Typography_and_Layout_Architecture_Requirements.pdf', pdfBytes);
  console.log('PDF successfully created at public/Arabic_Typography_and_Layout_Architecture_Requirements.pdf');
}

createArabicTypographyPDF().catch(console.error);
