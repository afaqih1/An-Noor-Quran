const fs = require('fs');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

async function createRequirementsPDF() {
  const pdfDoc = await PDFDocument.create();
  
  // Embed standard fonts
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  const fontCode = await pdfDoc.embedFont(StandardFonts.Courier);

  // Palette
  const primaryColor = rgb(0.04, 0.40, 0.28);     // Emerald dark
  const secondaryColor = rgb(0.12, 0.16, 0.22);   // Slate 900
  const accentColor = rgb(0.72, 0.55, 0.33);      // Warm Gold / Earthy
  const grayColor = rgb(0.35, 0.40, 0.48);        // Slate 500
  const lightGrayColor = rgb(0.95, 0.96, 0.98);   // Code block BG
  const borderColor = rgb(0.85, 0.88, 0.92);

  const pages = [];
  let currentPage = pdfDoc.addPage([595.28, 841.89]); // A4
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
    checkSpace(40);
    cursorY -= 15;
    currentPage.drawText(text, {
      x: margin,
      y: cursorY,
      size: 16,
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
      size: 12,
      font: fontBold,
      color: secondaryColor,
    });
    cursorY -= 16;
  }

  function drawParagraph(text, font = fontRegular, size = 10, color = secondaryColor, indent = 0) {
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
    const lines = wrapText(fullText, fontRegular, 10, contentWidth - 16);
    checkSpace(lines.length * 15 + 8);
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
        // Draw title bold part
        currentPage.drawText(line, {
          x: margin + 16,
          y: cursorY,
          size: 10,
          font: fontRegular,
          color: secondaryColor,
        });
        isFirst = false;
      } else {
        currentPage.drawText(line, {
          x: margin + 16,
          y: cursorY,
          size: 10,
          font: fontRegular,
          color: secondaryColor,
        });
      }
      cursorY -= 14.5;
    }
    cursorY -= 4;
  }

  function drawCodeBlock(code) {
    const lines = code.split('\n');
    const blockHeight = lines.length * 12 + 16;
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
        size: 8.5,
        font: fontCode,
        color: rgb(0.1, 0.15, 0.25),
      });
      cursorY -= 12;
    }
    cursorY -= 10;
  }

  // --- COVER & TITLE HEADER ---
  currentPage.drawText('ARCHITECTURE & IMPLEMENTATION REQUIREMENTS', {
    x: margin,
    y: cursorY,
    size: 10,
    font: fontBold,
    color: accentColor,
  });
  cursorY -= 18;

  currentPage.drawText('Persistent Storage Layer for Custom Video Files', {
    x: margin,
    y: cursorY,
    size: 20,
    font: fontBold,
    color: primaryColor,
  });
  cursorY -= 22;

  currentPage.drawText('& Active UI Selection States (Offline-First Two-Tier Architecture)', {
    x: margin,
    y: cursorY,
    size: 14,
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
    'Document Version: 1.0.0 | Target Environment: Modern Web (React / TypeScript / HTML5) | Storage Engine: IndexedDB & LocalStorage\n' +
    'This document establishes complete engineering requirements, data schemas, and reusable reference implementations for integrating persistent, client-side custom media (e.g., MP4 videos, audio recordings) and active UI selection states into web applications without external backends.',
    fontItalic,
    9,
    grayColor
  );
  cursorY -= 6;

  // --- 1. EXECUTIVE SUMMARY & ARCHITECTURAL PATTERN ---
  drawHeading1('1. Executive Summary & Two-Tier Storage Architecture');
  drawParagraph(
    'Storing large binary files (such as user-uploaded video or audio files) alongside interactive selection states requires a disciplined Two-Tier Client Storage Architecture. Standard Web Storage APIs like LocalStorage have strict 5MB–10MB string limitations and execute synchronously on the main UI thread. Attempting to serialize binary videos to Base64 data URLs in LocalStorage will immediately exhaust browser quota limits and freeze the UI.'
  );
  drawParagraph(
    'To achieve enterprise-grade reliability and seamless offline persistence, the application MUST partition data across two browser storage mechanisms based on payload size and I/O characteristics:'
  );

  drawBullet('Tier 1: IndexedDB (Heavy Binary Layer)', 'Used exclusively for storing raw File and Blob objects (custom uploaded videos). IndexedDB provides asynchronous, non-blocking disk I/O, supports multi-gigabyte storage quotas, and stores native binary structures without Base64 string encoding overhead.');
  drawBullet('Tier 2: LocalStorage (Lightweight UI State Layer)', 'Used exclusively for storing scalar values, active selection IDs (e.g., activeVideoPart, activeTab, playback speed, or user toggles), and lightweight user preferences. Allows synchronous, zero-latency state restoration during initial React component hydration.');

  // --- 2. FUNCTIONAL & TECHNICAL REQUIREMENTS ---
  drawHeading1('2. Functional & Technical Requirements');

  drawHeading2('REQ-1: IndexedDB Database Schema & Versioning');
  drawParagraph(
    'The application must initialize an IndexedDB database dedicated to binary media assets. The schema must adhere to standard key-value object store patterns where the key represents the unique media slot or chapter identifier.'
  );
  drawBullet('Database Name', 'PoetryVideoDB (or domain-specific name such as MediaAssetsDB).');
  drawBullet('Object Store Name', 'videos (configured without auto-increment if using explicit chapter/part numbering as integer keys).');
  drawBullet('Key Path', 'Numeric integer IDs (e.g., 1, 2, 3...) representing chapter parts or UUID strings for dynamic lists.');
  drawBullet('Value Payload', 'Native HTML5 File or Blob objects directly persisted into the browser database.');

  drawHeading2('REQ-2: Asynchronous Media CRUD Lifecycle');
  drawParagraph(
    'All interactions with Tier 1 (IndexedDB) must be wrapped in asynchronous Promise-based utilities with explicit transaction scopes (readonly vs. readwrite) and error boundaries:'
  );
  drawBullet('Save Operation (saveVideoToDB)', 'Opens a readwrite transaction, inserts or updates the File/Blob payload at the target slot key, and resolves upon completion.');
  drawBullet('Load Operation (loadVideosFromDB)', 'Opens a readonly transaction, traverses object store entries via a cursor, and returns an indexed dictionary mapping slot keys to saved File/Blob assets.');
  drawBullet('Delete Operation (deleteVideoFromDB)', 'Opens a readwrite transaction and removes the stored entry when a user clears or resets a slot.');

  drawHeading2('REQ-3: Ephemeral Object URL Memory Management');
  drawParagraph(
    'When loading File/Blob objects from IndexedDB into HTML5 <video> elements, the application MUST NOT use Base64 data URLs. Instead, it must generate ephemeral Object URLs using URL.createObjectURL(blob).'
  );
  drawBullet('Memory Safety Rule', 'To prevent memory leaks across long user sessions, whenever a video file is replaced or removed, the application MUST call URL.revokeObjectURL(previousUrl) before assigning the new Object URL.');
  drawBullet('Component Cleanup', 'During component unmounting, all active Object URLs stored in memory must be revoked.');

  drawHeading2('REQ-4: Persistent Active Selection States (UI Hydration)');
  drawParagraph(
    'The application MUST preserve the user\'s active navigation state (e.g., which video part is selected, which tab is active) across page refreshes and browser restarts using LocalStorage:'
  );
  drawBullet('Lazy Hydration', 'React useState hooks must utilize lazy initializer functions (() => localStorage.getItem(...)) to read stored selection indexes on initial mount without re-evaluating on subsequent renders.');
  drawBullet('Automatic Synchronization', 'A dedicated useEffect hook must observe changes to the selection state and immediately write updated stringified values to LocalStorage.');

  // --- 3. REFERENCE TYPESCRIPT IMPLEMENTATION ---
  drawHeading1('3. Complete Reference Implementation (TypeScript)');
  drawParagraph(
    'The following production-ready module (videoStorageDB.ts) implements all requirements for IndexedDB binary media persistence:'
  );

  const codeIndexedDB = `// src/utils/videoStorageDB.ts
const DB_NAME = 'MediaAssetsDB';
const STORE_NAME = 'videos';
const DB_VERSION = 1;

export const initVideoDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveVideoToDB = async (partId: number, file: File | Blob): Promise<void> => {
  const db = await initVideoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(file, partId);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const loadVideosFromDB = async (): Promise<Record<number, File | Blob>> => {
  const db = await initVideoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.openCursor();
    const videos: Record<number, File | Blob> = {};

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        videos[Number(cursor.key)] = cursor.value;
        cursor.continue();
      } else {
        resolve(videos);
      }
    };
    request.onerror = () => reject(request.error);
  });
};

export const deleteVideoFromDB = async (partId: number): Promise<void> => {
  const db = await initVideoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(partId);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};`;

  drawCodeBlock(codeIndexedDB);

  drawHeading1('4. Reusable React Hook for Storage & State Sync');
  drawParagraph(
    'The following custom hook (usePersistentVideoState.ts) bridges IndexedDB media loading, memory cleanup, and LocalStorage selection state synchronization:'
  );

  const codeReactHook = `// src/hooks/usePersistentVideoState.ts
import { useState, useEffect, useCallback } from 'react';
import { saveVideoToDB, loadVideosFromDB, deleteVideoFromDB } from '../utils/videoStorageDB';

export interface PersistentVideoState {
  activePart: number;
  setActivePart: (part: number) => void;
  videoUrls: Record<number, string>;
  uploadVideo: (partId: number, file: File) => Promise<void>;
  removeVideo: (partId: number) => Promise<void>;
  isLoading: boolean;
}

export function usePersistentVideoState(defaultPart = 1): PersistentVideoState {
  // 1. Hydrate scalar selection state synchronously from LocalStorage
  const [activePart, setActivePartState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('app_active_video_part');
      return saved ? parseInt(saved, 10) : defaultPart;
    } catch {
      return defaultPart;
    }
  });

  const [videoUrls, setVideoUrls] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 2. Synchronize active selection changes to LocalStorage
  const setActivePart = useCallback((part: number) => {
    setActivePartState(part);
    try {
      localStorage.setItem('app_active_video_part', part.toString());
    } catch (e) {
      console.warn('LocalStorage write failed:', e);
    }
  }, []);

  // 3. Load stored binary videos from IndexedDB & generate Object URLs
  useEffect(() => {
    let isMounted = true;
    loadVideosFromDB()
      .then((storedFiles) => {
        if (!isMounted) return;
        const newUrls: Record<number, string> = {};
        Object.entries(storedFiles).forEach(([key, file]) => {
          newUrls[Number(key)] = URL.createObjectURL(file);
        });
        setVideoUrls(newUrls);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to restore videos from IndexedDB:', err);
        setIsLoading(false);
      });

    // Memory cleanup on unmount
    return () => {
      isMounted = false;
      Object.values(videoUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // 4. Save video file to DB and update memory state
  const uploadVideo = useCallback(async (partId: number, file: File) => {
    if (!file.type.startsWith('video/')) {
      throw new Error('Invalid file format. Must be a video MIME type.');
    }
    await saveVideoToDB(partId, file);
    const url = URL.createObjectURL(file);
    setVideoUrls((prev) => {
      if (prev[partId]) URL.revokeObjectURL(prev[partId]);
      return { ...prev, [partId]: url };
    });
  }, []);

  // 5. Delete video file from DB and revoke Object URL
  const removeVideo = useCallback(async (partId: number) => {
    await deleteVideoFromDB(partId);
    setVideoUrls((prev) => {
      if (prev[partId]) URL.revokeObjectURL(prev[partId]);
      const next = { ...prev };
      delete next[partId];
      return next;
    });
  }, []);

  return { activePart, setActivePart, videoUrls, uploadVideo, removeVideo, isLoading };
}`;

  drawCodeBlock(codeReactHook);

  drawHeading1('5. Performance, Security & Browser Quota Checklist');
  drawBullet('MIME Type Validation', 'Always enforce client-side MIME type filtering (file.type.startsWith("video/")) before writing to IndexedDB to protect against arbitrary binary payload execution.');
  drawBullet('Storage Quota Management', 'Use navigator.storage.estimate() to inspect available disk quota before uploading files exceeding 100MB.');
  drawBullet('Zero-Base64 Rule', 'Never serialize File or Blob objects into Base64 strings. Direct Blob storage in IndexedDB ensures zero memory inflation and immediate streaming playback via Object URLs.');
  drawBullet('Persistent Storage Request', 'For critical production environments, invoke navigator.storage.persist() to prevent automated browser eviction of stored video files under low disk space conditions.');

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
      `Persistent Video Storage & Active Selection Architecture  |  Page ${index + 1} of ${totalPages}`,
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
  fs.writeFileSync('public/Persistent_Video_Storage_Architecture_Requirements.pdf', pdfBytes);
  console.log('PDF successfully created at public/Persistent_Video_Storage_Architecture_Requirements.pdf');
}

createRequirementsPDF().catch(console.error);
