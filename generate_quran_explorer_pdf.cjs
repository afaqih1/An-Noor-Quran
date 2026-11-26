const fs = require('fs');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

async function createQuranExplorerPDF() {
  const pdfDoc = await PDFDocument.create();
  
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  const fontCode = await pdfDoc.embedFont(StandardFonts.Courier);

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
      size: 14,
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
    cursorY -= 16;
  }

  function drawHeading2(text) {
    checkSpace(30);
    cursorY -= 10;
    currentPage.drawText(text, {
      x: margin,
      y: cursorY,
      size: 11,
      font: fontBold,
      color: secondaryColor,
    });
    cursorY -= 15;
  }

  function drawParagraph(text, font = fontRegular, size = 9, color = secondaryColor, indent = 0) {
    const lines = wrapText(text, font, size, contentWidth - indent);
    for (const line of lines) {
      checkSpace(15);
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
    const lines = wrapText(fullText, fontRegular, 9, contentWidth - 16);
    checkSpace(lines.length * 14 + 8);
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
          size: 9,
          font: fontRegular,
          color: secondaryColor,
        });
        isFirst = false;
      } else {
        currentPage.drawText(line, {
          x: margin + 16,
          y: cursorY,
          size: 9,
          font: fontRegular,
          color: secondaryColor,
        });
      }
      cursorY -= 13.5;
    }
    cursorY -= 3;
  }

  function drawCodeBlock(code) {
    const lines = code.split('\n');
    const blockHeight = lines.length * 11 + 16;
    checkSpace(blockHeight + 10);
    
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
        size: 7.5,
        font: fontCode,
        color: rgb(0.1, 0.15, 0.25),
      });
      cursorY -= 11;
    }
    cursorY -= 10;
  }

  // --- COVER & HEADER ---
  currentPage.drawText('QURAN EXPLORER - ENTERPRISE LMS & PORTAL RELEASE', {
    x: margin,
    y: cursorY,
    size: 9.5,
    font: fontBold,
    color: accentColor,
  });
  cursorY -= 18;

  currentPage.drawText('System Requirements, API Specification & Database Architecture', {
    x: margin,
    y: cursorY,
    size: 16,
    font: fontBold,
    color: primaryColor,
  });
  cursorY -= 20;

  currentPage.drawText('Document Version: 2.4.0 | Date: August 3, 2026', {
    x: margin,
    y: cursorY,
    size: 11,
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
  cursorY -= 16;

  drawParagraph(
    'Target Audience: Software Architects, Database Engineers, Integration Developers\n' +
    'This specification document provides the complete system requirements, database schema, REST/GraphQL API contracts, and typography/audio synchronization specifications for integrating the Quran Explorer module into third-party Learning Management Systems (LMS), Islamic Studies platforms, and enterprise portals.',
    fontItalic,
    9,
    grayColor
  );

  // --- 1. EXECUTIVE SUMMARY & ARCHITECTURE OVERVIEW ---
  drawHeading1('1. Executive Summary & Architecture Overview');
  drawParagraph(
    'The system is architected as a modular full-stack web application with strict TypeScript type contracts, multi-lingual localization (English, Arabic RTL, Amharic), AI-powered verse contextualization via Google Gemini SDK, and precision Arabic Uthmanic typography rendering with word-by-word interactive pronunciation synchronization.'
  );

  // --- 2. COMPLETE RELATIONAL DATABASE SCHEMA (SQL DDL) ---
  drawHeading1('2. Complete Relational Database Schema (SQL DDL)');
  drawParagraph(
    'The relational schema is optimized for PostgreSQL 15+ and MySQL 8+. All text columns use UTF8MB4 encoding to ensure zero truncation or corruption of Arabic Uthmanic Tashkeel (diacritics) and Amharic Ethiopic syllabics.'
  );

  const sqlCode = `-- QURAN EXPLORER: COMPLETE SQL RELATIONAL DATABASE SCHEMA (PostgreSQL / MySQL)
-- Encoding: UTF8MB4 (Required for full Arabic Tashkeel & Amharic glyph support)

CREATE TABLE IF NOT EXISTS quran_modules (
   id VARCHAR(64) PRIMARY KEY,
   title VARCHAR(255) NOT NULL,
   subtitle VARCHAR(255),
   order_index INT NOT NULL DEFAULT 0,
   description TEXT,
   theme_color VARCHAR(32) DEFAULT 'emerald',
   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quran_segments (
   id VARCHAR(64) PRIMARY KEY,
   module_id VARCHAR(64) NOT NULL,
   label VARCHAR(128) NOT NULL,
   arabic_text TEXT NOT NULL,
   transliteration TEXT,
   translation_en TEXT NOT NULL,
   translation_ar TEXT,
   translation_am TEXT,
   explanation_en TEXT,
   explanation_ar TEXT,
   explanation_am TEXT,
   audio_url VARCHAR(512),
   surah_number INT NOT NULL,
   verse_number INT NOT NULL,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
   CONSTRAINT fk_quran_segments_module 
       FOREIGN KEY (module_id) REFERENCES quran_modules(id) ON DELETE CASCADE
);

CREATE INDEX idx_segments_module_id ON quran_segments(module_id);
CREATE INDEX idx_segments_surah_verse ON quran_segments(surah_number, verse_number);

CREATE TABLE IF NOT EXISTS verse_keywords (
   id VARCHAR(64) PRIMARY KEY,
   segment_id VARCHAR(64) NOT NULL,
   word VARCHAR(128) NOT NULL,
   arabic VARCHAR(128) NOT NULL,
   root VARCHAR(32),
   root_transliteration VARCHAR(64),
   meaning_en TEXT NOT NULL,
   meaning_ar TEXT,
   meaning_am TEXT,
   description_en TEXT,
   description_ar TEXT,
   description_am TEXT,
   display_order INT NOT NULL DEFAULT 0,
   CONSTRAINT fk_keywords_segment 
       FOREIGN KEY (segment_id) REFERENCES quran_segments(id) ON DELETE CASCADE
);

CREATE INDEX idx_keywords_segment_id ON verse_keywords(segment_id);
CREATE INDEX idx_keywords_root ON verse_keywords(root);

CREATE TABLE IF NOT EXISTS word_token_timestamps (
   id VARCHAR(64) PRIMARY KEY,
   segment_id VARCHAR(64) NOT NULL,
   word_index INT NOT NULL,
   word_arabic VARCHAR(128) NOT NULL,
   start_time_ms INT NOT NULL,
   end_time_ms INT NOT NULL,
   audio_duration_ms INT NOT NULL,
   CONSTRAINT fk_timestamps_segment 
       FOREIGN KEY (segment_id) REFERENCES quran_segments(id) ON DELETE CASCADE,
   CONSTRAINT uq_segment_word_idx UNIQUE (segment_id, word_index)
);

CREATE TABLE IF NOT EXISTS user_bookmarks (
   id VARCHAR(64) PRIMARY KEY,
   user_id VARCHAR(128) NOT NULL,
   segment_id VARCHAR(64) NOT NULL,
   notes TEXT,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
   CONSTRAINT fk_bookmarks_segment 
       FOREIGN KEY (segment_id) REFERENCES quran_segments(id) ON DELETE CASCADE,
   CONSTRAINT uq_user_bookmark UNIQUE (user_id, segment_id)
);`;

  drawCodeBlock(sqlCode);

  // --- 3. NOSQL / DOCUMENT STORE SCHEMA (MONGODB JSON SCHEMA) ---
  drawHeading1('3. NoSQL / Document Store Schema (MongoDB JSON Schema)');
  drawParagraph(
    'For document-oriented storage architectures (MongoDB / Amazon DocumentDB / Firestore), the Surah module is stored as an embedded aggregate document to guarantee single-query read performance:'
  );

  const mongoCode = `{
 "$schema": "http://json-schema.org/draft-07/schema#",
 "title": "QuranExplorerModuleDocument",
 "description": "MongoDB / NoSQL Document Schema for Quran Explorer Surah Modules",
 "type": "object",
 "required": ["_id", "title", "orderIndex", "segments"],
 "properties": {
   "_id": { "type": "string", "description": "Module unique identifier" },
   "title": { "type": "string" },
   "orderIndex": { "type": "integer" },
   "segments": {
     "type": "array",
     "items": {
       "type": "object",
       "required": ["id", "arabicText", "translation", "surahNumber", "verseNumber"],
       "properties": {
         "id": { "type": "string" },
         "arabicText": { "type": "string" },
         "transliteration": { "type": "string" },
         "translation": {
           "type": "object",
           "properties": { "en": { "type": "string" }, "ar": { "type": "string" }, "am": { "type": "string" } }
         },
         "wordTimestamps": {
           "type": "array",
           "items": {
             "type": "object",
             "properties": {
               "wordIndex": { "type": "integer" },
               "wordArabic": { "type": "string" },
               "startMs": { "type": "integer" },
               "endMs": { "type": "integer" }
             }
           }
         }
       }
     }
   }
 }
}`;

  drawCodeBlock(mongoCode);

  // --- 4. DATA DICTIONARY & ENTITY RELATIONSHIPS ---
  drawHeading1('4. Data Dictionary & Entity Relationships');
  drawBullet('quran_modules [PK: id VARCHAR-64]', '1 : N cardinality to segments. Represents a Quranic chapter/surah study module. Contains order index, title, subtitle, and visual theme.');
  drawBullet('quran_segments [PK: id VARCHAR-64, FK: module_id]', 'N : 1 from modules. Represents a verse or semantic passage. Includes full Uthmanic Arabic text, transliteration, audio URI, and multilingual translations.');
  drawBullet('verse_keywords [PK: id VARCHAR-64, FK: segment_id]', '1 : N to expansions. Stores individual vocabulary breakdown, Arabic morphology root (jizw), and multilingual lexicon definitions.');
  drawBullet('word_token_timestamps [PK: id VARCHAR-64, FK: segment_id]', '1 : N per segment. Time-sync mapping associating each Arabic token index with audio start/end milliseconds for highlight sync.');
  drawBullet('user_bookmarks [PK: id VARCHAR-64, FK: segment_id, user_id]', 'N : M users to verses. User state persistence for saved verses, study notes, and bookmarks.');

  // --- 5. RESTFUL API & GRAPHQL INTEGRATION CONTRACTS ---
  drawHeading1('5. RESTful API & GraphQL Integration Contracts');
  drawBullet('GET /api/v1/modules', 'Returns list of available Quran study modules sorted by order_index.');
  drawBullet('GET /api/v1/modules/{id}/segments', 'Returns all segments/verses for a module, including multilingual translations and audio URLs.');
  drawBullet('GET /api/v1/segments/{id}/keywords', 'Returns root vocabulary, morphological analysis, and keyword expansions for a specific verse.');
  drawBullet('POST /api/v1/segments/{id}/gemini-insight', 'Proxies server-side Gemini AI contextual reflection request with zero client-side API key exposure.');
  drawBullet('POST / DELETE /api/v1/bookmarks', 'Create or delete a user bookmark for a specific segment ID.');

  // --- 6. ARABIC TYPOGRAPHY & WORD AUDIO SYNC SPECIFICATION ---
  drawHeading1('6. Arabic Typography & Word Audio Sync Specification');
  drawBullet('Font Stack', '"Amiri", "Traditional Arabic", "Scheherazade", serif, system-ui.');
  drawBullet('Line Height & Diacritics', 'A minimum line-height of 2.35 (e.g. CSS line-height: 2.35 !important;) is strictly required so that super-script diacritics (Shaddah, Maddah, Fatha) and subscript Kasrah do not collide with adjacent lines.');
  drawBullet('Word Tokenization Regex', 'The frontend tokenizes Arabic text using /(\\s+)/ to preserve trailing Harakat on words while accurately mapping token index to audio pronunciation.');
  drawBullet('Interactive Pronunciation', 'Clicking any token triggers word highlight and plays localized Arabic phoneme audio via Web Speech API or synced audio snippet.');

  // --- 7. SECURITY, OAUTH 2.0 & SSO INTEGRATION ---
  drawHeading1('7. Security, OAuth 2.0 & SSO Integration');
  drawBullet('Authentication', 'Requests from the Quran Explorer UI must include an OAuth 2.0 Bearer token (Authorization: Bearer <JWT>) signed by the identity provider.');
  drawBullet('CORS Policy', 'Configure CORS headers to allow requests only from authorized LMS domain origins.');
  drawBullet('AI API Key Protection', 'The Google Gemini API key must remain strictly server-side inside the API gateway or backend service.');

  // --- FOOTER ---
  const totalPages = pages.length;
  pages.forEach((page, index) => {
    page.drawLine({
      start: { x: margin, y: 35 },
      end: { x: pageWidth - margin, y: 35 },
      thickness: 0.5,
      color: borderColor,
    });
    page.drawText(
      `Quran Explorer System Requirements & API Architecture  |  Page ${index + 1} of ${totalPages}`,
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
  fs.writeFileSync('public/Quran_Explorer_System_Requirements_and_API_Architecture.pdf', pdfBytes);
  console.log('PDF successfully created at public/Quran_Explorer_System_Requirements_and_API_Architecture.pdf');
}

createQuranExplorerPDF().catch(console.error);
