import React, { useState } from 'react';
import { 
  X, Database, Code, ShieldCheck, Layers, FileText, Download, CheckCircle, 
  Copy, Check, Server, Key, Globe, BookOpen, Terminal
} from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface QuranExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuranExplorerModal: React.FC<QuranExplorerModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'sql' | 'nosql' | 'dictionary' | 'api' | 'typography' | 'security'>('overview');
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedMongo, setCopiedMongo] = useState(false);

  if (!isOpen) return null;

  const sqlSchema = `-- ============================================================================
-- QURAN EXPLORER: COMPLETE SQL RELATIONAL DATABASE SCHEMA (PostgreSQL / MySQL)
-- Encoding: UTF8MB4 (Required for full Arabic Tashkeel & Amharic glyph support)
-- ============================================================================

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

CREATE TABLE IF NOT EXISTS keyword_expansions (
   id VARCHAR(64) PRIMARY KEY,
   keyword_id VARCHAR(64) NOT NULL,
   expansion_text TEXT NOT NULL,
   display_order INT NOT NULL DEFAULT 0,
   CONSTRAINT fk_expansions_keyword 
       FOREIGN KEY (keyword_id) REFERENCES verse_keywords(id) ON DELETE CASCADE
);

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
);

CREATE INDEX idx_user_bookmarks_user ON user_bookmarks(user_id);`;

  const mongoSchema = `{
 "$schema": "http://json-schema.org/draft-07/schema#",
 "title": "QuranExplorerModuleDocument",
 "description": "MongoDB / NoSQL Document Schema for Quran Explorer Surah Modules",
 "type": "object",
 "required": ["_id", "title", "orderIndex", "segments"],
 "properties": {
   "_id": { "type": "string", "description": "Module unique identifier (e.g., surah-al-fatiha)" },
   "title": { "type": "string" },
   "subtitle": { "type": "string" },
   "orderIndex": { "type": "integer" },
   "segments": {
     "type": "array",
     "items": {
       "type": "object",
       "required": ["id", "arabicText", "translation", "surahNumber", "verseNumber"],
       "properties": {
         "id": { "type": "string" },
         "label": { "type": "string" },
         "arabicText": { "type": "string", "description": "Full Arabic verse with Uthmanic/Tashkeel harakat" },
         "transliteration": { "type": "string" },
         "translation": {
           "type": "object",
           "properties": {
             "en": { "type": "string" },
             "ar": { "type": "string" },
             "am": { "type": "string" }
           }
         },
         "explanation": {
           "type": "object",
           "properties": {
             "en": { "type": "string" },
             "ar": { "type": "string" },
             "am": { "type": "string" }
           }
         },
         "audioUrl": { "type": "string" },
         "surahNumber": { "type": "integer" },
         "verseNumber": { "type": "integer" },
         "keywords": {
           "type": "array",
           "items": {
             "type": "object",
             "properties": {
               "word": { "type": "string" },
               "arabic": { "type": "string" },
               "root": { "type": "string" },
               "rootTransliteration": { "type": "string" },
               "meaning": {
                 "type": "object",
                 "properties": {
                   "en": { "type": "string" },
                   "ar": { "type": "string" },
                   "am": { "type": "string" }
                 }
               },
               "expansions": {
                 "type": "array",
                 "items": { "type": "string" }
               }
             }
           }
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

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleCopyMongo = () => {
    navigator.clipboard.writeText(mongoSchema);
    setCopiedMongo(true);
    setTimeout(() => setCopiedMongo(false), 2000);
  };

  const tabs = [
    { id: 'overview', labelEn: '1. Overview', labelAr: '1. ملخص المعمارية', icon: Layers },
    { id: 'sql', labelEn: '2. SQL DDL Schema', labelAr: '2. قاعدة بيانات SQL DDL', icon: Database },
    { id: 'nosql', labelEn: '3. NoSQL Schema', labelAr: '3. وثيقة MongoDB NoSQL', icon: Code },
    { id: 'dictionary', labelEn: '4. Data Dictionary', labelAr: '4. قاموس الكيانات', icon: BookOpen },
    { id: 'api', labelEn: '5. REST/GraphQL API', labelAr: '5. واجهات REST API', icon: Server },
    { id: 'typography', labelEn: '6. Typography & Sync', labelAr: '6. الخط ومزامنة الصوت', icon: Globe },
    { id: 'security', labelEn: '7. Security & OAuth', labelAr: '7. الأمان والتكامل', icon: ShieldCheck },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-900 via-primary-850 to-slate-900 text-white p-6 flex items-center justify-between border-b border-primary-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl text-primary-200">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold font-serif">
                  {language === 'ar' ? 'مستكشف القرآن (Quran Explorer)' : 'QURAN EXPLORER'}
                </h2>
                <span className="text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  v2.4.0 (Enterprise LMS & Portal Release)
                </span>
              </div>
              <p className="text-xs text-primary-200/80 mt-1">
                {language === 'ar'
                  ? 'المواصفات الهندسيّة، عقود واجهات برمجة التطبيقات (API) ومعمارية قواعد البيانات للتكامل مع منصات التعليم (LMS)'
                  : 'System Requirements, API Specification & Database Integration Architecture for LMS & Enterprise Portals'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/Quran_Explorer_System_Requirements_and_API_Architecture.pdf"
              download="Quran_Explorer_System_Requirements_and_API_Architecture.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 no-underline border border-white/15"
            >
              <Download size={14} />
              <span className="hidden sm:inline">
                {language === 'ar' ? 'تحميل ملف PDF' : 'Download PDF'}
              </span>
            </a>
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2 flex items-center gap-1.5 overflow-x-auto border-b border-slate-200 dark:border-slate-700/60 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-primary-800 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/60'
                }`}
              >
                <Icon size={14} />
                <span>{language === 'ar' ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-700 dark:text-slate-300">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-primary-50 dark:bg-primary-950/40 p-5 rounded-2xl border border-primary-200/60 dark:border-primary-900/40">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif mb-2">
                  {language === 'ar'
                    ? '1. ملخص تنفيذي ومعمارية النظام (Executive Summary)'
                    : '1. Executive Summary & Architecture Overview'}
                </h3>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {language === 'ar'
                    ? 'توفر هذه المواصفات متطلبات النظام الكاملة، ومخطط قاعدة البيانات، وعقود واجهات برمجة التطبيقات (REST/GraphQL)، ومعايير مزامنة الخط العربي والصوت لدمج وحدة "مستكشف القرآن" داخل أنظمة إدارة التعلم (LMS) ومنصات الدراسات الإسلامية والبوابات المؤسسية.'
                    : 'This specification document provides the complete system requirements, database schema, REST/GraphQL API contracts, and typography/audio synchronization specifications for integrating the Quran Explorer module into third-party Learning Management Systems (LMS), Islamic Studies platforms, and enterprise portals.'}
                </p>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 mt-3">
                  {language === 'ar'
                    ? 'تم تصميم النظام كتطبيق ويب كامل المستويات (Full-stack) بوحدات نمطية مع عقود TypeScript صارمة، وتوطين متعدد اللغات (الإنجليزية، العربية RTL، والأمهرية)، وتأمل سياقي مدعوم بـ Google Gemini SDK، وعرض دقيق للخط العثماني مع مزامنة تفاعلية للنطق كلمة بكلمة.'
                    : 'The system is architected as a modular full-stack web application with strict TypeScript type contracts, multi-lingual localization (English, Arabic RTL, Amharic), AI-powered verse contextualization via Google Gemini SDK, and precision Arabic Uthmanic typography rendering with word-by-word interactive pronunciation synchronization.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400" />
                    <span>{language === 'ar' ? 'قواعد بيانات هجينة' : 'Hybrid SQL / NoSQL Support'}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {language === 'ar'
                      ? 'مخطط علائقي لـ PostgreSQL/MySQL ومخطط مستندات لـ MongoDB/Firestore مع ترميز UTF8MB4.'
                      : 'Relational DDL for PostgreSQL 15+ / MySQL 8+ and JSON Schema for MongoDB / DocumentDB.'}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400" />
                    <span>{language === 'ar' ? 'عقود REST & GraphQL' : 'REST & GraphQL Contracts'}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {language === 'ar'
                      ? 'نقاط اتصال موحدة لجلب المقاطع والكلمات والتفسير وربط تأملات الذكاء الاصطناعي من الجانب الخادم.'
                      : 'Standardized endpoints for modules, segments, keyword morphology, and server-proxied Gemini AI insight.'}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400" />
                    <span>{language === 'ar' ? 'تزامن الصوتي كلمة بكلمة' : 'Word-by-Word Audio Sync'}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {language === 'ar'
                      ? 'تقسيم غير متلف للكلمات وحفظ توقيت الميلي ثانية مع خط Amiri لمنع تداخل التشكيل.'
                      : 'Non-destructive regex tokenization with millisecond timestamp mapping and Amiri font diacritic clearance.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SQL DDL */}
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                    {language === 'ar'
                      ? '2. مخطط قاعدة البيانات العلائقية (SQL DDL - PostgreSQL / MySQL)'
                      : '2. Complete Relational Database Schema (SQL DDL)'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {language === 'ar'
                      ? 'ترميز UTF8MB4 إلزامي لحفظ تشكيل الرسم العثماني والحروف الإثيوبية الأمهرية دون أي تشوه.'
                      : 'UTF8MB4 encoding required for full Arabic Uthmanic Tashkeel and Amharic Ethiopic syllabics.'}
                  </p>
                </div>
                <button
                  onClick={handleCopySql}
                  className="px-3 py-1.5 bg-primary-800 hover:bg-primary-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  {copiedSql ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedSql ? (language === 'ar' ? 'تم النسخ' : 'Copied!') : (language === 'ar' ? 'نسخ SQL' : 'Copy DDL')}</span>
                </button>
              </div>

              <div className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-[420px] border border-slate-800">
                <pre>{sqlSchema}</pre>
              </div>
            </div>
          )}

          {/* TAB 3: NOSQL MONGODB SCHEMA */}
          {activeTab === 'nosql' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                    {language === 'ar'
                      ? '3. مخطط المستندات غير العلائقية (MongoDB / NoSQL Document Schema)'
                      : '3. NoSQL / Document Store Schema (MongoDB JSON Schema)'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {language === 'ar'
                      ? 'مخطط مستند مضمن ومجمع (Embedded aggregate document) لضمان الأداء السريع في استعلام واحد.'
                      : 'Embedded aggregate document schema for MongoDB / Amazon DocumentDB / Firestore single-query read performance.'}
                  </p>
                </div>
                <button
                  onClick={handleCopyMongo}
                  className="px-3 py-1.5 bg-primary-800 hover:bg-primary-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  {copiedMongo ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedMongo ? (language === 'ar' ? 'تم النسخ' : 'Copied!') : (language === 'ar' ? 'نسخ JSON' : 'Copy JSON')}</span>
                </button>
              </div>

              <div className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-[420px] border border-slate-800">
                <pre>{mongoSchema}</pre>
              </div>
            </div>
          )}

          {/* TAB 4: DATA DICTIONARY */}
          {activeTab === 'dictionary' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                {language === 'ar'
                  ? '4. قاموس البيانات وعلاقات الكيانات (Entity Relationships)'
                  : '4. Data Dictionary & Entity Relationships'}
              </h3>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-700">
                      <th className="p-3">Entity / Table</th>
                      <th className="p-3">Primary Key</th>
                      <th className="p-3">Foreign Keys</th>
                      <th className="p-3">Cardinality</th>
                      <th className="p-3">Description & Critical Attributes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-primary-700 dark:text-primary-400">quran_modules</td>
                      <td className="p-3 font-mono">id (VARCHAR-64)</td>
                      <td className="p-3 text-slate-400">None</td>
                      <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">1 : N (to segments)</td>
                      <td className="p-3">Represents a Quranic chapter/surah study module. Contains order index, title, subtitle, and visual theme.</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-primary-700 dark:text-primary-400">quran_segments</td>
                      <td className="p-3 font-mono">id (VARCHAR-64)</td>
                      <td className="p-3 font-mono">module_id</td>
                      <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">N : 1 (from modules)</td>
                      <td className="p-3">Represents a verse or semantic passage. Includes full Uthmanic Arabic text, transliteration, audio URI, and multilingual translations.</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-primary-700 dark:text-primary-400">verse_keywords</td>
                      <td className="p-3 font-mono">id (VARCHAR-64)</td>
                      <td className="p-3 font-mono">segment_id</td>
                      <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">1 : N (to expansions)</td>
                      <td className="p-3">Stores individual vocabulary breakdown, Arabic morphology root (jizw), and multilingual lexicon definitions.</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-primary-700 dark:text-primary-400">word_token_timestamps</td>
                      <td className="p-3 font-mono">id (VARCHAR-64)</td>
                      <td className="p-3 font-mono">segment_id</td>
                      <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">1 : N (per segment)</td>
                      <td className="p-3">Time-sync mapping associating each Arabic token index with audio start/end milliseconds for highlight sync.</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-primary-700 dark:text-primary-400">user_bookmarks</td>
                      <td className="p-3 font-mono">id (VARCHAR-64)</td>
                      <td className="p-3 font-mono">segment_id, user_id</td>
                      <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">N : M (users to verses)</td>
                      <td className="p-3">User state persistence for saved verses, study notes, and bookmarks.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: REST & GRAPHQL API */}
          {activeTab === 'api' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                {language === 'ar'
                  ? '5. عقود واجهات برمجة التطبيقات (RESTful API & GraphQL Contracts)'
                  : '5. RESTful API & GraphQL Integration Contracts'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'ar'
                  ? 'يمكن استضافة مستكشف القرآن كأداة مضمنة (Embedded widget) تتواصل مع الخادم عبر هذه الواجهات أو عبر نقطة اتصال GraphQL الموحدة.'
                  : 'The Quran Explorer can be hosted as an embedded UI widget communicating with the integration backend via REST JSON endpoints or a federated GraphQL endpoint.'}
              </p>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-xs rounded">
                      GET
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                      /api/v1/modules
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 sm:text-right">
                    {language === 'ar'
                      ? 'إرجاع قائمة وحدات دراسة القرآن المتاحة مرتبة حسب order_index.'
                      : 'Returns list of available Quran study modules sorted by order_index.'}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-xs rounded">
                      GET
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                      /api/v1/modules/&#123;id&#125;/segments
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 sm:text-right">
                    {language === 'ar'
                      ? 'إرجاع جميع المقاطع/الآيات للوحدة بما في ذلك الترجمات والروابط الصوتية.'
                      : 'Returns all segments/verses for a module, including multilingual translations and audio URLs.'}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-xs rounded">
                      GET
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                      /api/v1/segments/&#123;id&#125;/keywords
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 sm:text-right">
                    {language === 'ar'
                      ? 'إرجاع الجذر اللغوي والتحليل الصرفي وتوسعات المفردات لآية محددة.'
                      : 'Returns root vocabulary, morphological analysis, and keyword expansions for a specific verse.'}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 font-mono font-bold text-xs rounded">
                      POST
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                      /api/v1/segments/&#123;id&#125;/gemini-insight
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 sm:text-right">
                    {language === 'ar'
                      ? 'تمرير طلب التأمل السياقي عبر Google Gemini من الخادم دون كشف مفتاح API.'
                      : 'Proxies server-side Gemini AI contextual reflection request with zero client-side API key exposure.'}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-mono font-bold text-xs rounded">
                      POST / DELETE
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                      /api/v1/bookmarks
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 sm:text-right">
                    {language === 'ar'
                      ? 'إنشاء أو حذف إشارة مرجعية لمستخدم على مقطع/آية معينة.'
                      : 'Create or delete a user bookmark for a specific segment ID.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: TYPOGRAPHY & SYNC */}
          {activeTab === 'typography' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                {language === 'ar'
                  ? '6. مواصفات الخط العربي ومزامنة الصوت كلمة بكلمة'
                  : '6. Arabic Typography & Word Audio Sync Specification'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {language === 'ar' ? 'حزمة الخطوط الرسمية (Font Stack)' : 'Uthmanic Font Stack'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
                    font-family: &quot;Amiri&quot;, &quot;Traditional Arabic&quot;, &quot;Scheherazade&quot;, serif, system-ui;
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {language === 'ar'
                      ? 'تم اعتماد خط Amiri العثماني لضمان عرض الأربطة الحرفية والتشكيل بدقة متناهية.'
                      : 'Amiri serif font is specified to support complex Arabic ligatures and precise Tashkeel diacritic positioning.'}
                  </p>
                </div>

                <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {language === 'ar' ? 'ارتفاع الأسطر وخلوص الحركات' : 'Line Height & Diacritic Clearance'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
                    line-height: 2.35 !important; /* leading-[2.35] */
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {language === 'ar'
                      ? 'الحد الأدنى لارتفاع السطر هو 2.35 لمنع تداخل الشدة والمد والفتحة مع الكسرة في الأسطر المتجاورة.'
                      : 'A minimum line-height of 2.35 is strictly required so super-script diacritics and subscript Kasrah do not collide.'}
                  </p>
                </div>

                <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {language === 'ar' ? 'التجزئة اللفظية غير المتلفة' : 'Word Tokenization Regex'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
                    const regex = /(\s+)/;
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {language === 'ar'
                      ? 'يتم تقسيم الجملة بحدود المسافات البيضاء لحفظ الحركات على الحرف الأخير ومزامنة النطق بالملي ثانية.'
                      : 'The frontend tokenizes Arabic text using /(\s+)/ to preserve trailing Harakat while accurately mapping token index to audio pronunciation.'}
                  </p>
                </div>

                <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {language === 'ar' ? 'التلاوة التفاعلية والنطق' : 'Interactive Pronunciation & Highlighting'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {language === 'ar'
                      ? 'النقر على أي كلمة عربية يبرزها باللون الأخضر الفاتح (bg-emerald-100) ويشغل نطقها الصوتي الفوري عبر Web Speech API أو مقاطع الصوت المتزامنة.'
                      : 'Clicking any token triggers word highlight and plays localized Arabic phoneme audio via Web Speech API or synced audio snippet.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SECURITY & OAUTH */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                {language === 'ar'
                  ? '7. الأمان وتكامل OAuth 2.0 و SSO للمؤسسات'
                  : '7. Security, OAuth 2.0 & SSO Integration'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'ar'
                  ? 'متطلبات الأمان والتكامل مع أنظمة إدارة التعلم LMS والبوابات المؤسسية عبر الدخول الموحد (SSO).'
                  : 'Enterprise security standards when embedding inside an LMS or institutional portal.'}
              </p>

              <div className="space-y-4">
                <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-xl shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                      {language === 'ar' ? 'المصادقة باستخدام OAuth 2.0 Bearer Token' : 'OAuth 2.0 Authentication'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {language === 'ar'
                        ? 'يجب أن تتضمن جميع الطلبات الصادرة من واجهة مستكشف القرآن ترويسة مصادقة (Authorization: Bearer <JWT>) موقعة من مزود الهوية Institutional IdP.'
                        : 'Requests from the Quran Explorer UI must include an OAuth 2.0 Bearer token (Authorization: Bearer <JWT>) signed by the identity provider.'}
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 rounded-xl shrink-0">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                      {language === 'ar' ? 'سياسة مشاركة الموارد عبر النطاقات (CORS Policy)' : 'CORS & Domain Whitelisting'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {language === 'ar'
                        ? 'يتم ضبط ترويسات CORS للسماح بالطلبات الواردة حصراً من نطاقات أنظمة إدارة التعلم LMS المصرح بها في المؤسسة.'
                        : 'Configure CORS headers to allow requests only from authorized LMS domain origins.'}
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-4">
                  <div className="p-3 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 rounded-xl shrink-0">
                    <Key size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                      {language === 'ar' ? 'حماية مفتاح الذكاء الاصطناعي (Gemini API Key Protection)' : 'Server-Side AI API Key Protection'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {language === 'ar'
                        ? 'يجب أن يظل مفتاح Google Gemini API محميّاً بالكامل على الجانب الخادم (Server-side API Gateway) ولا يتم كشفه أبداً في المتصفح.'
                        : 'The Google Gemini API key must remain strictly server-side inside the API gateway or backend service with zero browser exposure.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'ar'
              ? 'مواصفات مستكشف القرآن الإصدار 2.4.0 • جاهز للدمج المؤسسي LMS & Portal'
              : 'Quran Explorer Specification v2.4.0 • Ready for Enterprise LMS & Portal Integration'}
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/Quran_Explorer_System_Requirements_and_API_Architecture.pdf"
              download="Quran_Explorer_System_Requirements_and_API_Architecture.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary-800 hover:bg-primary-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 no-underline"
            >
              <Download size={14} />
              <span>{language === 'ar' ? 'تحميل المواصفات (PDF)' : 'Download Blueprint PDF'}</span>
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all"
            >
              {language === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
