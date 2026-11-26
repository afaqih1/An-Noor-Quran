const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

async function createQuranLearningRequirementsPDF() {
  const pdfDoc = await PDFDocument.create();

  // Standard fonts
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  const fontCode = await pdfDoc.embedFont(StandardFonts.Courier);

  // Palette
  const primaryColor = rgb(0.04, 0.40, 0.28);     // Emerald Dark #064e3b
  const secondaryColor = rgb(0.08, 0.12, 0.18);   // Slate 900
  const accentColor = rgb(0.72, 0.55, 0.28);      // Warm Gold
  const grayColor = rgb(0.35, 0.40, 0.48);        // Slate 500
  const lightBgColor = rgb(0.96, 0.98, 0.97);     // Tinted emerald light
  const borderColor = rgb(0.85, 0.88, 0.92);

  const pages = [];
  let currentPage = pdfDoc.addPage([595.28, 841.89]); // A4 Size
  pages.push(currentPage);

  const margin = 45;
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

  function drawText(text, options = {}) {
    const font = options.font || fontRegular;
    const size = options.size || 10;
    const color = options.color || secondaryColor;
    const indent = options.indent || 0;
    const lineSpacing = options.lineSpacing || 1.35;
    const lineHeight = size * lineSpacing;
    const maxWidth = options.maxWidth || (contentWidth - indent);

    const lines = wrapText(text, font, size, maxWidth);
    checkSpace(lines.length * lineHeight + (options.spaceAfter || 0));

    for (const line of lines) {
      if (line !== '') {
        currentPage.drawText(line, {
          x: margin + indent,
          y: cursorY - size,
          size: size,
          font: font,
          color: color
        });
      }
      cursorY -= lineHeight;
    }

    if (options.spaceAfter) {
      cursorY -= options.spaceAfter;
    }
  }

  function drawHeading1(text) {
    checkSpace(55);
    cursorY -= 10;
    // Draw decorative indicator
    currentPage.drawRectangle({
      x: margin,
      y: cursorY - 20,
      width: 4,
      height: 20,
      color: accentColor
    });
    drawText(text, { font: fontBold, size: 16, color: primaryColor, indent: 12, spaceAfter: 8 });
    currentPage.drawLine({
      start: { x: margin, y: cursorY + 4 },
      end: { x: margin + contentWidth, y: cursorY + 4 },
      thickness: 0.75,
      color: borderColor
    });
    cursorY -= 8;
  }

  function drawHeading2(text) {
    checkSpace(40);
    cursorY -= 6;
    drawText(text, { font: fontBold, size: 12, color: primaryColor, spaceAfter: 4 });
  }

  function drawHeading3(text) {
    checkSpace(30);
    cursorY -= 4;
    drawText(text, { font: fontBold, size: 10.5, color: secondaryColor, spaceAfter: 3 });
  }

  function drawBullet(text, boldPrefix = '') {
    checkSpace(20);
    currentPage.drawCircle({
      x: margin + 8,
      y: cursorY - 6.5,
      size: 2.2,
      color: accentColor
    });
    
    if (boldPrefix) {
      const prefixWidth = fontBold.widthOfTextAtSize(boldPrefix + ' ', 9.5);
      currentPage.drawText(boldPrefix + ' ', {
        x: margin + 18,
        y: cursorY - 9.5,
        size: 9.5,
        font: fontBold,
        color: secondaryColor
      });
      
      const restLines = wrapText(text, fontRegular, 9.5, contentWidth - 18 - prefixWidth);
      if (restLines.length > 0) {
        currentPage.drawText(restLines[0], {
          x: margin + 18 + prefixWidth,
          y: cursorY - 9.5,
          size: 9.5,
          font: fontRegular,
          color: secondaryColor
        });
        cursorY -= 13;
        for (let i = 1; i < restLines.length; i++) {
          checkSpace(13);
          currentPage.drawText(restLines[i], {
            x: margin + 18,
            y: cursorY - 9.5,
            size: 9.5,
            font: fontRegular,
            color: secondaryColor
          });
          cursorY -= 13;
        }
      } else {
        cursorY -= 13;
      }
    } else {
      drawText(text, { size: 9.5, indent: 18, spaceAfter: 3 });
    }
  }

  function drawCallout(title, body) {
    const titleLines = wrapText(title, fontBold, 10, contentWidth - 30);
    const bodyLines = wrapText(body, fontRegular, 9, contentWidth - 30);
    const totalLines = titleLines.length + bodyLines.length;
    const boxHeight = totalLines * 13 + 22;

    checkSpace(boxHeight + 10);

    currentPage.drawRectangle({
      x: margin,
      y: cursorY - boxHeight,
      width: contentWidth,
      height: boxHeight,
      color: lightBgColor,
      borderColor: accentColor,
      borderWidth: 1
    });

    currentPage.drawRectangle({
      x: margin,
      y: cursorY - boxHeight,
      width: 4,
      height: boxHeight,
      color: accentColor
    });

    let innerY = cursorY - 14;
    for (const line of titleLines) {
      currentPage.drawText(line, {
        x: margin + 16,
        y: innerY,
        size: 10,
        font: fontBold,
        color: primaryColor
      });
      innerY -= 13;
    }

    innerY -= 2;
    for (const line of bodyLines) {
      currentPage.drawText(line, {
        x: margin + 16,
        y: innerY,
        size: 9,
        font: fontRegular,
        color: secondaryColor
      });
      innerY -= 12.5;
    }

    cursorY -= (boxHeight + 10);
  }

  // ================= DOCUMENT HEADER =================
  currentPage.drawRectangle({
    x: margin,
    y: cursorY - 75,
    width: contentWidth,
    height: 75,
    color: primaryColor
  });

  currentPage.drawText("SYSTEM REQUIREMENTS & ARCHITECTURAL SPECIFICATION", {
    x: margin + 18,
    y: cursorY - 24,
    size: 9,
    font: fontBold,
    color: accentColor
  });

  currentPage.drawText("Quran Learning Feature: 1 Year / 20 Minutes a Day", {
    x: margin + 18,
    y: cursorY - 45,
    size: 16,
    font: fontBold,
    color: rgb(1, 1, 1)
  });

  currentPage.drawText("Comprehensive Daily 5-10-5 Pedagogical Model • 52 Weeks • 365 Days Roadmap", {
    x: margin + 18,
    y: cursorY - 62,
    size: 9,
    font: fontRegular,
    color: rgb(0.85, 0.92, 0.88)
  });

  cursorY -= 95;

  // Metadata Table Block
  drawText("DOCUMENT CONTROL & METADATA", { font: fontBold, size: 8.5, color: grayColor, spaceAfter: 3 });
  const metaItems = [
    "Feature Name: 1-Year Quran Mastery & Tadabbur Engine (20 Minutes/Day)",
    "Document Status: Approved Production Standard v2.4 (October 2026)",
    "Target Audience: Global Learners (English, Arabic, Amharic, Harari)",
    "Pedagogical Formula: 5 Min Recitation & Tajweed • 10 Min Vocabulary & Tafsir • 5 Min Reflection & Dua",
    "Architecture: Offline-First Client SPA with IndexedDB/LocalStorage Persistence and Audio Stream Hub"
  ];
  for (const item of metaItems) {
    drawBullet(item);
  }
  cursorY -= 8;

  // ================= 1. EXECUTIVE SUMMARY & MISSION =================
  drawHeading1("1. Executive Summary & Core Mission");
  drawText("The primary obstacle preventing believers from building an enduring, life-long relationship with the Holy Quran is not lack of desire, but cognitive overload and unstructured pacing. Attempting full Juz recitations without vocabulary comprehension leads to spiritual fatigue and abandonment.", { spaceAfter: 6 });
  drawText("The '1 Year / 20 Minutes a Day' framework operationalizes the Prophetic hadith: 'The most beloved deeds to Allah are those that are most consistent, even if small.' By bounding daily Quranic engagement to precisely 20 minutes, the cognitive friction dissolves while compounding into 7,300 minutes (over 121 hours) of active Quranic mastery in 365 days.", { spaceAfter: 8 });

  drawCallout("Core Design Axiom: The 20-Minute Cognitive Ceiling", 
    "A 20-minute daily commitment fits effortlessly into modern routines (ideally post-Fajr or pre-sleep). The interface guarantees that in every session, the learner touches three distinct spiritual dimensions: oral articulation (Tilawah), intellectual comprehension (Fahm), and emotional/practical implementation (Tadabbur & 'Amal).");

  // ================= 2. THE 5-10-5 PEDAGOGICAL FORMULA =================
  drawHeading1("2. The Daily 5-10-5 Pedagogical System");
  drawText("Every day's lesson is partitioned into three immutable, high-yield temporal blocks:", { spaceAfter: 6 });

  drawHeading2("Block A: 5 Minutes - Recitation & Tajweed Mastery (At-Tilawah wat-Tajweed)");
  drawBullet("Objective: Perfect pronunciation, melodic rhythm, and accurate articulation of the day's selected verses.", "Focus:");
  drawBullet("Integrated Verse Audio: Immediate multi-reciter playback (Mishary Alafasy, AbdulBaset, Al-Husary) with 0.75x, 1.0x, and 1.25x speed control.", "Tooling:");
  drawBullet("Daily Tajweed Spotlight: One specific Tajweed rule is highlighted per day (e.g., Madd Lazim, Qalqalah Kubra, Ikhfa, Ghunnah) with concrete verse examples and physical pronunciation tips.", "Curriculum:");
  drawBullet("Typography Engine: Multi-scale Arabic script with optional phonetic transliteration toggle.", "Display:");
  cursorY -= 6;

  drawHeading2("Block B: 10 Minutes - Vocabulary, Morphology & Tafsir (Al-Fahm wal-Mufradat)");
  drawBullet("Objective: Build active Quranic vocabulary comprehension and understand divine theological context.", "Focus:");
  drawBullet("Word-by-Word Cards: 2 to 4 high-frequency Quranic root words analyzed daily with trilateral roots, morphological classifications, and occurrence frequencies.", "Vocabulary:");
  drawBullet("Bilingual Translation Suite: Simultaneous support for English, Arabic, Amharic, and Harari translations.", "Translation:");
  drawBullet("Distilled Thematic Tafsir: Concise synthesis from classical exegeses (Tafsir As-Sa'di and Ibn Kathir) highlighting why the verse was revealed and its modern life relevance.", "Commentary:");
  cursorY -= 6;

  drawHeading2("Block C: 5 Minutes - Tadabbur, Practical Action & Dua (At-Tadabbur wal-'Amal)");
  drawBullet("Objective: Transform intellectual understanding into heartfelt contemplation and tangible righteous deeds.", "Focus:");
  drawBullet("Tadabbur Introspection Prompt: A guided daily question prompting deep self-examination and conscience alignment.", "Contemplation:");
  drawBullet("Interactive In-Place Journal: Autosaved personal reflection note connected to the user's permanent spiritual archive.", "Journaling:");
  drawBullet("Real-Life Action Commitment: A concrete, realistic behavioral commitment for the day with a toggleable checkbox.", "Action Step:");
  drawBullet("Connected Quranic Dua: Direct supplication derived from the day's verses with instant clipboard copy and audio recitation.", "Supplication:");
  drawBullet("Daily 1-Question Retention Check: Quick multiple-choice verification with instant theological feedback.", "Retention:");

  // ================= 3. 52-WEEK / 4-QUARTER ROADMAP =================
  drawHeading1("3. Annual 52-Week Curriculum Roadmap");
  drawText("The 365 days are architected into 4 pedagogical quarters that guide the learner from foundational short Surahs to comprehensive Quranic mastery:", { spaceAfter: 8 });

  const quarters = [
    {
      q: "Quarter 1 (Weeks 1–13 • Days 1–91): Foundations & The Essential Protections",
      desc: "Surah Al-Fatiha, Juz 30 (An-Nas to An-Naba), Ayatul Kursi, Al-Baqarah 284–286, and Surah Al-Mulk. Establishes daily prayer presence, core monotheism (Tawheed), and nightly protective habits."
    },
    {
      q: "Quarter 2 (Weeks 14–26 • Days 92–182): Prophetic Wisdom & Key Friday Surahs",
      desc: "Surah Al-Kahf (all 4 trials: Faith, Wealth, Knowledge, Power), Yaseen, Ar-Rahman, Al-Waqi'ah, Al-Hadeed, and Al-Hashr. Deepens understanding of Friday Sunnah traditions and divine sovereignty."
    },
    {
      q: "Quarter 3 (Weeks 27–39 • Days 183–273): Spiritual Light & Moral Character",
      desc: "Surah Maryam, Ta-Ha, Al-Anbiya, An-Nur (Verse of Light), Al-Furqan (Qualities of Ibadur-Rahman), Luqman (Parental Wisdom), and Al-Hujurat (Islamic Ethics & Brotherhood)."
    },
    {
      q: "Quarter 4 (Weeks 40–52 • Days 274–365): Comprehensive Mastery & Grand Khatam",
      desc: "Selected major passages from Al-Baqarah, Ali 'Imran, An-Nisa', Al-Ma'idah, and concluding with the Grand Khatam-ul-Quran celebration, completion supplications, and covenant renewal for Year 2."
    }
  ];

  for (const item of quarters) {
    drawHeading2(item.q);
    drawText(item.desc, { size: 9.5, spaceAfter: 6 });
  }

  // ================= 4. UI/UX SYSTEM ARCHITECTURE =================
  drawHeading1("4. UI/UX Architecture & Technical Specifications");
  drawBullet("Dual-View Switcher: Seamless switching between the focused 20-Minute Guided Player and the high-level 52-Week Annual Roadmap.", "Component Views:");
  drawBullet("Live Countdown Timer: Animated 5-10-5 breakdown bar with Play/Pause, Reset, and Stage auto-advance.", "Timer Engine:");
  drawBullet("Personalization Onboarding: Modals allowing users to choose their current level (Beginner, Intermediate, Advanced) and preferred daily reminder slot (Fajr, Dhuhr, Asr, Isha).", "Onboarding:");
  drawBullet("Streak & Milestone Engine: Automatically increments streak upon completing 20-minute sessions and logs total minutes learned to localStorage.", "Gamification:");
  drawBullet("System Integration: Cross-linked in Sidebar.tsx, App.tsx, LandingDashboard.tsx Bento Grid, and GlobalSearchModal.tsx with 'quran_year_plan' section routing.", "Integration:");

  // Footer on all pages
  const totalPages = pages.length;
  for (let i = 0; i < totalPages; i++) {
    const p = pages[i];
    p.drawText(`Page ${i + 1} of ${totalPages} • Friday Surah Guide System Documentation`, {
      x: margin,
      y: 25,
      size: 8,
      font: fontRegular,
      color: grayColor
    });
    p.drawText("Confidential & Proprietary • Dedicated as Sadaqa Jaria", {
      x: pageWidth - margin - 220,
      y: 25,
      size: 8,
      font: fontItalic,
      color: grayColor
    });
  }

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(__dirname, 'public', 'Quran_Learning_Feature_1Year_20Minutes_Requirements.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`Successfully generated requirements PDF at: ${outputPath}`);
}

createQuranLearningRequirementsPDF().catch(err => {
  console.error("Error creating requirements PDF:", err);
  process.exit(1);
});
