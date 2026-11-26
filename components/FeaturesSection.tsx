import React, { useState } from 'react';
import { 
  FileText, Download, CheckCircle, HelpCircle, BookOpen, Clock, ShieldCheck, 
  Map, Sparkles, Languages, Settings, Volume2, BookMarked, MessageSquare, Info, Compass,
  FileCode, Database, PlusCircle, Cpu, Layers, Server, ExternalLink
} from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { useLanguage } from './LanguageContext';
import { QuranExplorerModal } from './QuranExplorerModal';

export const FeaturesSection: React.FC = () => {
  const { language, t } = useLanguage();
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isQuranExplorerModalOpen, setIsQuranExplorerModalOpen] = useState(false);

  // Complete detailed inventory of features in the app
  const features = [
    {
      id: 'quran',
      icon: BookOpen,
      title: '30 Juz & 114 Surah Quran Player/Explorer',
      badge: 'Interactive Quran',
      description: 'A complete explorer allowing users to browse, read, and listen to any part (Juz) or chapter (Surah) of the Holy Quran.',
      bullets: [
        'Uthmani Arabic Script: Dynamic, crisp rendering of the sacred Arabic text.',
        'Selected Reciter Streams: Choose among world-class Qaris, including Mishary Rashid Alafasy, Al-Sudais, Maher Al-Muaiqly, and Abu Bakr Al-Shatri.',
        'Continuous Play & Auto-advance: Seamlessly advances to the next verse for an uninterrupted spiritual experience.',
        'Translation Overlays: Instant toggle for detailed translations with multiple translation editions.',
        'Uthmani Font Size Customizer: Immediate size adjustment options (A- / A+) to fit any screen and accessibility need.'
      ]
    },
    {
      id: 'quran_explorer_enterprise',
      icon: Server,
      title: 'Enterprise Quran Explorer (v2.4.0 LMS & Portal Release)',
      badge: 'LMS / Portal Architecture',
      description: 'Complete system requirements, database schema, REST/GraphQL API contracts, and typography/audio sync specifications for embedding into LMS and enterprise portals.',
      bullets: [
        'Relational Database Schema (SQL DDL): Optimized PostgreSQL 15+ & MySQL 8+ tables with UTF8MB4 encoding for Tashkeel & Amharic.',
        'NoSQL Document Schema: Embedded aggregate JSON schema for MongoDB, Amazon DocumentDB, and Firestore single-query reads.',
        'RESTful & GraphQL API Contracts: Endpoints for modules (/api/v1/modules), segments, keyword morphology, and server-proxied Gemini AI insight.',
        'Arabic Typography & Word Audio Sync: Amiri font stack with mandatory 2.35 line-height and regex /(\\s+)/ tokenization for millisecond audio sync.',
        'Enterprise Security & OAuth 2.0: Bearer token JWT authentication, LMS domain CORS whitelisting, and zero browser exposure for Gemini API keys.'
      ]
    },
    {
      id: 'alkahf',
      icon: Sparkles,
      title: 'Surah Al-Kahf Theme Analysis',
      badge: 'Friday Core Sunnah',
      description: 'Dedicated guide on the primary Friday sunnah, facilitating deep study of Surah Al-Kahf\'s profound narratives.',
      bullets: [
        'Four Key Stories: Tabbed deep-dives into the stories of: The People of the Cave (Trial of Faith), The Owner of Two Gardens (Trial of Wealth), Prophet Musa & Al-Khidr (Trial of Knowledge), and Dhul-Qarnayn (Trial of Power).',
        'Prophetic Benefits: Detailed overview of authentic Hadiths highlighting protection from the Dajjal and weekly spiritual illumination.',
        'Practical Lessons: Clear spiritual takeaways and action items derived from each narrative to apply in modern daily life.'
      ]
    },
    {
      id: 'table',
      icon: Clock,
      title: 'Recommended Surahs',
      badge: 'Sunnah Library',
      description: 'Interactive tracker summarizing other recommended surahs for Friday Fajr, night protections, and specialized blessings.',
      bullets: [
        'Night Protections: Convenient access to Surah Al-Mulk, Al-Sajdah, Al-Insan, Ad-Dukhan, and Al-Waqiah.',
        'Built-in Reciter & Reader: Launch full text translations and play streaming recitations immediately with one click.',
        'Sunnah Level Labels: Clear classification of prophetic traditions into Sunnah Mu’akkadah (highly recommended) or general recommended virtues.'
      ]
    },
    {
      id: 'prayer',
      icon: Clock,
      title: 'Friday Prayer Times & Automated Azan Call',
      badge: 'Jumu\'ah Utility',
      description: 'Accurate prayer time calculations coupled with automatic prayer call audio alerts to keep you on schedule.',
      bullets: [
        'Automated Geolocation: Instantly tracks current latitude/longitude or user-specified coordinates to compute local prayer times.',
        'Automated Azan Alerts: Plays the beautiful call to prayer (Azan) automatically on the precise entry of each prayer time.',
        'Qari Selections: Choose between the majestic Azan of Makkah (Masjid al-Haram) or Madinah (Masjid an-Nabawi).',
        'Visual Alert Panel: A clear pop-up notification displays the prayer reminder with options to dismiss or test the call.'
      ]
    },
    {
      id: 'azkar',
      icon: ShieldCheck,
      title: 'Comprehensive Daily Azkar Collection',
      badge: 'Remembrance Shield',
      description: 'A curated daily spiritual defense system featuring morning and evening protections, specific Wirds, and major litanies.',
      bullets: [
        'Daily morning and evening Azkar with interactive repetition counters.',
        'Special 10x/11x Wirds derived from authentic Sunnah sources.',
        'Major litanies, including standard transcriptions of Hizb an-Nasr and Hizb al-Nawawi.',
        'The 99 Beautiful Names of Allah (Asma-ul-Husna): Dynamic list with benefits and translation overlays.'
      ]
    },
    {
      id: 'dua',
      icon: MessageSquare,
      title: 'Friday Duas & Supplications Library',
      badge: 'Divine Dialogue',
      description: 'Categorized collections of supplications to help maximize the legendary Golden Hour of Response on Friday.',
      bullets: [
        'Prophetic & Quranic Duas: Selected authentic prayers with audio streams and copy-to-clipboard options.',
        'Salawat Tracker: Prominent reminder cards to encourage increased send-off of blessings upon the Prophet on Fridays.',
        'Golden Hour Indicator: Highlights the specific time after Asr before Maghrib where prayers are highly accepted.'
      ]
    },
    {
      id: 'tajweed',
      icon: BookMarked,
      title: 'Interactive Tajweed Rules Guide',
      badge: 'Recitation Art',
      description: 'An educational dashboard outlining the foundational principles of Tajweed to perfect your pronunciation.',
      bullets: [
        'Four Primary Rule Groups: Visual explanations for Nunn Sakinah & Tanween, Meem Sakinah, Mudood (prolongations), and Qalqalah (echoing).',
        'Audio Pronunciation Examples: Play high-quality sound files showing exactly how to pronounce each rule.',
        'Interactive Color Coding: Practice verses displaying color-coded highlights of applied rules for immediate recognition.'
      ]
    },
    {
      id: 'qibla',
      icon: Compass,
      title: 'Qibla Finder & Kaaba Compass',
      badge: 'Location Service',
      description: 'Browser-based geolocation compass indicating the exact physical direction of the Kaaba relative to your current location.',
      bullets: [
        'Dynamic Bearing Calculations: Computes precise heading, distance to Mecca, and coordinates.',
        'Browser Sensor Support: Utilizes device orientation sensors on compatible smartphones for live rotation tracking.'
      ]
    },
    {
      id: 'bookmarks',
      icon: BookMarked,
      title: 'Local Bookmark Engine',
      badge: 'User Personalization',
      description: 'An offline-first bookmarking database that saves your favorite verses, surahs, and supplications.',
      bullets: [
        'Instant bookmark toggle across the Quran and recommended sections.',
        'Session Persistence: Safely saves bookmark arrays using local browser storage (localStorage) for access anytime.'
      ]
    },
    {
      id: 'config',
      icon: Settings,
      title: 'Central Workspace Configurator',
      badge: 'Customization Hub',
      description: 'A unified settings dashboard enabling complete control over your reading and listening environment.',
      bullets: [
        'Quad-Lingual Localization: Complete translation supporting English, Arabic, Amharic, and Harari.',
        'Arabic Font Size Scaling: Dynamically adjust the scale of Uthmani script from 85% up to 180%.',
        'Audio Control Center: Centralized master volume slider and reciter selection.',
        'Night Theme Toggle: Immediate switch between a beautiful light theme and an eye-friendly dark slate layout.'
      ]
    }
  ];

  // Generate and download the Word Document
  const handleExportDocx = async () => {
    setDownloading(true);
    try {
      // Create paragraphs array
      const docChildren = [
        new Paragraph({
          text: "AN-NOOR QURAN COMPANION",
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          text: "Official Feature List & Functionality Specification Guide",
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          text: `Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({ text: "" }), // Spacing
        new Paragraph({
          children: [
            new TextRun({
              text: "About An-Noor Quran Companion:",
              bold: true,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          text: "An-Noor Quran Companion is a premium, offline-first digital companion designed to enrich your Friday (Jumu'ah) recitations and daily spiritual practices. Built using React, Tailwind CSS, and TypeScript, it integrates world-class audio reciters, localized prayer time calculations, interactive litanies like Hizb al-Bahr, complete daily Azkar counters, comprehensive Tajweed rules with playbacks, and is fully localized across four languages (English, Arabic, Amharic, and Harari).",
        }),
        new Paragraph({ text: "" }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Core Features & Technical Functionalities Inventory:",
              bold: true,
              size: 24,
            }),
          ],
        }),
        new Paragraph({ text: "" }),
      ];

      // Append each feature details
      features.forEach((feat, index) => {
        // Feature Title
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${index + 1}. ${feat.title} (${feat.badge})`,
                bold: true,
                size: 20,
                color: "1e3a8a", // dark blue
              }),
            ],
            heading: HeadingLevel.HEADING_3,
          })
        );

        // Feature Description
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: feat.description,
                italics: true,
              }),
            ],
          })
        );

        // Bullet points
        feat.bullets.forEach((bullet) => {
          docChildren.push(
            new Paragraph({
              text: bullet,
              bullet: {
                level: 0,
              },
            })
          );
        });

        // Spacing
        docChildren.push(new Paragraph({ text: "" }));
      });

      // App Technical Specifications
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "System Architecture & Engineering Highlights:",
              bold: true,
              size: 22,
            }),
          ],
        })
      );

      const specs = [
        "Framework & Language: React 19, TypeScript, and Tailwind CSS for fully responsive, lightweight client rendering.",
        "Zero-Backend Secret Safety: API calls and text lookups utilize direct JSON datasets and open-source APIs, ensuring 100% user privacy and client-side execution.",
        "Fully Offline-Ready State: Remembrances (Azkar) trackers, custom volume controls, font multipliers, and bookmarks are persistently stored locally using browser localStorage.",
        "Multilingual Layout Engines: Dynamic state handlers automatically adjust UI layouts, padding, and text alignments between English, Arabic, Amharic, and Harari scripts.",
        "Browser Geolocation and Device Orientation: High-precision compass computations are achieved client-side to point instantly to the Kaaba."
      ];

      specs.forEach((spec) => {
        docChildren.push(
          new Paragraph({
            text: spec,
            bullet: {
              level: 0,
            },
          })
        );
      });

      // Assemble the document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: docChildren,
          },
        ],
      });

      // Export as blob and trigger download
      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "An-Noor_Quran_Companion_Features.docx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate DOCX:", error);
      alert("Error generating the Word Document. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const copyToClipboard = () => {
    try {
      const text = features.map((f, i) => `${i+1}. ${f.title}\n   ${f.description}\n${f.bullets.map(b => `   • ${b}`).join('\n')}`).join('\n\n');
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const isHarariOrAmharic = language === 'har' || language === 'am';
  const headerTitle = language === 'en' ? 'Features & Guidebook' : (language === 'ar' ? 'دليل الخصائص والميزات' : 'ባህሪያት እና መመሪያ');
  const headerSubtitle = language === 'en' ? 'Review all functionalities and export a professional Microsoft Word document' : (language === 'ar' ? 'استعرض جميع خصائص مساعد الأنوار وقم بتصديرها إلى ملف Word منسق' : 'የአን-ኑር መተግበሪያ የተሟሉ ባህሪያትን ይመልከቱ እና የዎርድ (Word) ፋይል ያውርዱ');

  return (
    <div className="space-y-6">
      
      {/* Upper header section */}
      <div className="bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 p-6 sm:p-8 rounded-2xl border border-secondary-500/20 shadow-lg text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-500/10 border border-secondary-500/30 text-secondary-300 text-xs font-bold tracking-wider uppercase">
              <FileText size={13} className="animate-pulse" />
              {language === 'en' ? 'Documentation Hub' : (language === 'ar' ? 'مركز التوثيق والدليل' : 'የሰነዶች መቆጣጠሪያ')}
            </span>
            <h2 className="text-3xl font-extrabold font-serif tracking-tight">{headerTitle}</h2>
            <p className="text-primary-200/90 text-sm max-w-2xl leading-relaxed">
              {headerSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportDocx}
              disabled={downloading}
              className="flex items-center gap-2 px-5 py-3 bg-secondary-500 hover:bg-secondary-600 active:scale-95 text-primary-950 font-bold rounded-xl shadow-md cursor-pointer select-none transition-all border border-secondary-400/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloading ? (
                <>
                  <span className="w-4 h-4 border-2 border-primary-950 border-t-transparent rounded-full animate-spin"></span>
                  <span>{language === 'en' ? 'Generating DOCX...' : 'جاري التصدير...'}</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>{language === 'en' ? 'Export Word Document' : (language === 'ar' ? 'تصدير مستند Word' : 'የዎርድ ሰነድ ያውርዱ')}</span>
                </>
              )}
            </button>

            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-3 bg-primary-800/60 hover:bg-primary-700/80 text-white rounded-xl text-sm font-semibold transition-all border border-primary-700 cursor-pointer"
            >
              <Sparkles size={15} />
              <span>{copied ? (language === 'en' ? 'Copied!' : 'تم النسخ!') : (language === 'en' ? 'Copy Text Guide' : 'نسخ دليل النص')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Engineering Architecture & Requirements Specifications (PDF Guides & Blueprints) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300 rounded-xl">
              <Layers size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                {language === 'ar'
                  ? 'مواصفات الهندسة المعمارية ومتطلبات التنفيذ (ملفات PDF مجانية للاستخدام)'
                  : 'Engineering Architecture & Implementation Requirements (PDF Blueprints)'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'ar'
                  ? 'أدلة هندسية مفصلة ومواصفات تقنية لتمكين إعادة استخدام أنظمة التطبيق في مشاريعك الأخرى بسهولة'
                  : 'Comprehensive engineering specifications, schemas, and reference React hooks for reusing these architectures in your other projects.'}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            {language === 'ar' ? 'جاهز للتنزيل والاستخدام' : 'Ready for Re-use & Download'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Arabic Typography & Layout PDF */}
          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/90 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40">
                  <FileCode size={22} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {language === 'ar' ? 'مواصفات الخط والتنسيق' : 'Typography & Layout'}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-white font-serif mb-2">
                {language === 'ar'
                  ? 'هندسة الخط العربي وتنسيق الجمل والكلمات'
                  : 'Arabic Typography, Phrasis & Sentence Layout Architecture'}
              </h4>

              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-4">
                {language === 'ar'
                  ? 'مواصفات اختيار خط النسخ (Amiri)، نسب ارتفاع الأسطر لتجنب تداخل الحركات، العزل الثنائي الاتجاه (RTL)، وتقسيم النص لإبراز الكلمات أثناء التلاوة.'
                  : 'Definitive requirements for Naskh serif font stacks (Amiri), Tashkeel diacritic clearance line-height math, bidirectional RTL isolation, and tokenized word highlighting.'}
              </p>

              <ul className="space-y-1.5 mb-5 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle size={12} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>{language === 'ar' ? 'تنسيق أسطر القرآن والأذكار والقصائد' : 'Quranic, Adhkar & Poetry Line-Height Math'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={12} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>{language === 'ar' ? 'مكون React لتلوين الكلمات تفاعلياً' : 'Tokenized HighlightableText React Component'}</span>
                </li>
              </ul>
            </div>

            <a
              href="/Arabic_Typography_and_Layout_Architecture_Requirements.pdf"
              download="Arabic_Typography_and_Layout_Architecture_Requirements.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-primary-800 hover:bg-primary-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 no-underline cursor-pointer"
            >
              <Download size={15} />
              <span>
                {language === 'ar' ? 'تحميل ملف PDF (المواصفات الهندسيّة)' : 'Download Requirements PDF'}
              </span>
            </a>
          </div>

          {/* Card 2: Persistent Video Storage PDF */}
          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/90 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="p-2.5 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 rounded-xl border border-blue-200/60 dark:border-blue-800/40">
                  <Database size={22} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                  {language === 'ar' ? 'محرك التخزين المستمر' : 'Offline Storage Engine'}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-white font-serif mb-2">
                {language === 'ar'
                  ? 'هندسة التخزين المستمر للفيديو وحالات التحديد'
                  : 'Persistent Video Storage & Active Selection Architecture'}
              </h4>

              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-4">
                {language === 'ar'
                  ? 'دليل بناء طبقة تخزين هجينة (IndexedDB + LocalStorage) للملفات الكبيرة وحالات الواجهة مع إدارة الذاكرة وتجنب تسرب روابط Object URL.'
                  : 'Complete engineering requirements for a Two-Tier client storage architecture using IndexedDB for raw binary media and LocalStorage for zero-latency UI hydration.'}
              </p>

              <ul className="space-y-1.5 mb-5 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle size={12} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span>{language === 'ar' ? 'مخطط قاعدة بيانات IndexedDB للملفات' : 'IndexedDB Binary Store & Schema'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={12} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span>{language === 'ar' ? 'خطاف React مخصص usePersistentVideoState' : 'usePersistentVideoState Custom Hook'}</span>
                </li>
              </ul>
            </div>

            <a
              href="/Persistent_Video_Storage_Architecture_Requirements.pdf"
              download="Persistent_Video_Storage_Architecture_Requirements.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 no-underline cursor-pointer"
            >
              <Download size={15} />
              <span>
                {language === 'ar' ? 'تحميل ملف PDF (التخزين المستمر)' : 'Download Requirements PDF'}
              </span>
            </a>
          </div>

          {/* Card 3: Quran Explorer System Requirements & API Architecture Document */}
          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/90 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="p-2.5 bg-primary-100 dark:bg-primary-950/60 text-primary-800 dark:text-primary-300 rounded-xl border border-primary-200/60 dark:border-primary-800/40">
                  <Server size={22} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-800 dark:text-primary-300 bg-primary-50 dark:bg-primary-950/50 px-2.5 py-1 rounded-full border border-primary-200 dark:border-primary-800">
                  {language === 'ar' ? 'معمارية مستكشف القرآن' : 'LMS & Portal API Spec'}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-white font-serif mb-2">
                {language === 'ar'
                  ? 'مستكشف القرآن: متطلبات النظام ومعمارية التكامل (v2.4.0)'
                  : 'QURAN EXPLORER: System Requirements, API Spec & Database Architecture'}
              </h4>

              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-4">
                {language === 'ar'
                  ? 'مواصفات وتصاميم لدمج وحدة مستكشف القرآن في منصات إدارة التعلم LMS، مع مخططات SQL DDL لـ PostgreSQL، ووثائق MongoDB، وعقود REST/GraphQL.'
                  : 'Complete v2.4.0 Enterprise LMS & Portal release specification including full SQL DDL schema, MongoDB NoSQL schema, REST/GraphQL API contracts, and typography sync.'}
              </p>

              <ul className="space-y-1.5 mb-5 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle size={12} className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
                  <span>{language === 'ar' ? 'مخطط قاعدة بيانات SQL DDL و MongoDB NoSQL' : 'SQL DDL Relational & MongoDB JSON Schemas'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={12} className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
                  <span>{language === 'ar' ? 'مواصفات الأمان OAuth 2.0 وعقود REST/GraphQL' : 'OAuth 2.0 Security & REST/GraphQL Contracts'}</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setIsQuranExplorerModalOpen(true)}
                className="flex-1 py-3 px-3 bg-primary-800 hover:bg-primary-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ExternalLink size={14} />
                <span>
                  {language === 'ar' ? 'استعراض المخطط التفاعلي' : 'Explore Spec & DDL'}
                </span>
              </button>
              <a
                href="/Quran_Explorer_System_Requirements_and_API_Architecture.pdf"
                download="Quran_Explorer_System_Requirements_and_API_Architecture.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-3.5 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 no-underline cursor-pointer"
                title={language === 'ar' ? 'تحميل ملف PDF' : 'Download PDF Blueprint'}
              >
                <Download size={15} />
                <span>PDF</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feat) => {
          const Icon = feat.icon;
          return (
            <div 
              key={feat.id}
              className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-secondary-500/30 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="p-2.5 bg-secondary-100 dark:bg-primary-950/40 text-secondary-700 dark:text-secondary-400 rounded-xl border border-secondary-200/50 dark:border-secondary-900/40">
                    <Icon size={22} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-secondary-400 bg-primary-50 dark:bg-primary-950/40 px-2.5 py-1 rounded-full border border-primary-100 dark:border-primary-900">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif mb-2">
                  {feat.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                  {feat.description}
                </p>

                <div className="space-y-2 border-t border-dashed border-slate-100 dark:border-slate-800/80 pt-4">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-1">Key Functionalities:</p>
                  <ul className="space-y-1.5">
                    {feat.bullets.slice(0, 3).map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle size={12} className="text-secondary-500 mt-0.5 flex-shrink-0" />
                        <span>{bullet.split(':')[0]}</span>
                      </li>
                    ))}
                    {feat.bullets.length > 3 && (
                      <li className="text-[11px] text-primary-600 dark:text-secondary-400 font-semibold italic pl-5">
                        + {feat.bullets.length - 3} more details included in Word Document
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer system alert block */}
      <div className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 flex items-start gap-3">
        <Info size={18} className="text-primary-600 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Dynamic Auto-Update Active</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            This specifications section and its exported Microsoft Word document are dynamically structured. Adding any new spiritual or technical feature to An-Noor automatically maps into the compilation engine to maintain an accurate, developer-ready DOCX blueprint.
          </p>
        </div>
      </div>

      {/* Quran Explorer Interactive Spec & DDL Modal */}
      <QuranExplorerModal 
        isOpen={isQuranExplorerModalOpen} 
        onClose={() => setIsQuranExplorerModalOpen(false)} 
      />
    </div>
  );
};

export default FeaturesSection;
