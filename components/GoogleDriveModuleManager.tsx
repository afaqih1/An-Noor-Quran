import React, { useState, useEffect } from 'react';
import {
  Folder,
  FileText,
  Download,
  Upload,
  RefreshCw,
  Check,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  Edit3,
  Layers,
  Sparkles,
  Database,
  Lock,
  Globe,
  Code,
  Copy,
  BookOpen
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { QuranModule, QURAN_STUDY_MODULES } from './quranStudyModulesData';
import {
  getCuratedModules,
  saveCuratedModule,
  importCuratedModulesBatch,
  resetCuratedModulesToDefault,
  subscribeToModulesChange
} from './curatedModulesStore';
import {
  extractFolderIdFromUrl,
  fetchDriveFolderFiles,
  fetchDriveFileContent,
  parseRawContentToModules,
  normalizeParsedModule,
  DriveFileItem
} from './googleDriveService';

export const DEFAULT_TAFSIR_IBN_KATHIR_FOLDER_URL =
  'https://drive.google.com/drive/folders/0B8VQnqhorb2iZ3JOcWxlZUgzVm8?resourcekey=0-g3c0TB5vTT63q8XrWUO8Rg&usp=drive_link';

const DEFAULT_FOLDER_URL = DEFAULT_TAFSIR_IBN_KATHIR_FOLDER_URL;

export const GoogleDriveModuleManager: React.FC = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  // Active Curated Modules list
  const [curatedModules, setCuratedModules] = useState<QuranModule[]>([]);

  // Drive integration state
  const [folderUrl, setFolderUrl] = useState<string>(DEFAULT_FOLDER_URL);
  const [accessToken, setAccessToken] = useState<string>('');
  const [isFetchingFolder, setIsFetchingFolder] = useState<boolean>(false);
  const [folderFiles, setFolderFiles] = useState<DriveFileItem[]>([]);
  const [driveError, setDriveError] = useState<string | null>(null);
  const [driveSuccessMsg, setDriveSuccessMsg] = useState<string | null>(null);

  // File download and parsing state
  const [selectedFile, setSelectedFile] = useState<DriveFileItem | null>(null);
  const [isDownloadingFile, setIsDownloadingFile] = useState<boolean>(false);
  const [rawTextPayload, setRawTextPayload] = useState<string>('');
  const [parsedPreviewModules, setParsedPreviewModules] = useState<QuranModule[]>([]);

  // Manual Editor/Paste Modal State
  const [showJsonEditor, setShowJsonEditor] = useState<boolean>(false);
  const [jsonInputText, setJsonInputText] = useState<string>('');
  const [jsonCopyCopied, setJsonCopyCopied] = useState<boolean>(false);

  // Load curated modules on mount and subscribe to changes
  useEffect(() => {
    setCuratedModules(getCuratedModules());
    const unsubscribe = subscribeToModulesChange((updated) => {
      setCuratedModules(updated);
    });
    return unsubscribe;
  }, []);

  // Fetch files from Google Drive Folder
  const handleFetchDriveFolder = async () => {
    const folderId = extractFolderIdFromUrl(folderUrl);
    if (!folderId) {
      setDriveError(language === 'ar' ? 'رابط مجلد Google Drive غير صالح' : 'Invalid Google Drive folder link or ID');
      return;
    }

    setIsFetchingFolder(true);
    setDriveError(null);
    setDriveSuccessMsg(null);

    const res = await fetchDriveFolderFiles(folderId, accessToken);
    setIsFetchingFolder(false);

    if (res.success) {
      setFolderFiles(res.files);
      if (res.files.length === 0) {
        setDriveError(
          language === 'ar'
            ? 'المجلد فارغ أو يحتاج إلى إذن وصول عبر OAuth'
            : 'Folder is empty or requires OAuth permissions to view private files.'
        );
      } else {
        setDriveSuccessMsg(
          language === 'ar'
            ? `تم العثور على ${res.files.length} ملفات في مجلد Google Drive`
            : `Successfully fetched ${res.files.length} files from Google Drive folder.`
        );
      }
    } else {
      setDriveError(res.error || 'Failed to list Google Drive folder files.');
    }
  };

  // Import file content from Google Drive
  const handleSelectAndImportFile = async (file: DriveFileItem) => {
    setSelectedFile(file);
    setIsDownloadingFile(true);
    setDriveError(null);
    setDriveSuccessMsg(null);

    const res = await fetchDriveFileContent(file.id, file.mimeType, accessToken);
    setIsDownloadingFile(false);

    if (res.success) {
      setRawTextPayload(res.content);
      const parsed = parseRawContentToModules(res.content);
      if (parsed.length > 0) {
        setParsedPreviewModules(parsed);
        setDriveSuccessMsg(
          language === 'ar'
            ? `تم تحليل ${parsed.length} وحدة دراسية جديدة بنجاح من الملف (${file.name})`
            : `Successfully parsed ${parsed.length} module(s) from (${file.name}).`
        );
      } else {
        setDriveError(
          language === 'ar'
            ? 'تنسيق الملف غير صالح. يرجى التأكد من استخدامه لهيكل JSON للوحدات الدراسية'
            : 'Could not parse QuranStudyModule JSON structure from file content.'
        );
      }
    } else {
      setDriveError(res.error || 'Failed to fetch file content from Google Drive.');
    }
  };

  // Confirm Batch Import into Local Curated Store
  const handleConfirmImport = () => {
    if (parsedPreviewModules.length === 0) return;
    const { added, updated } = importCuratedModulesBatch(parsedPreviewModules);

    setDriveSuccessMsg(
      language === 'ar'
        ? `تم تحديث وإضافة ${added + updated} وحدة دراسية بنجاح في المنهج المنسق!`
        : `Successfully updated ${updated} and added ${added} new module(s) to Curated Quran Modules!`
    );

    setParsedPreviewModules([]);
    setSelectedFile(null);
  };

  // Parse Manual JSON Input
  const handleParseManualJson = () => {
    try {
      const parsed = parseRawContentToModules(jsonInputText);
      if (parsed.length > 0) {
        const { added, updated } = importCuratedModulesBatch(parsed);
        setDriveSuccessMsg(
          language === 'ar'
            ? `تم حفظ ${added + updated} وحدة دراسية من النص البرمجي`
            : `Successfully saved ${added + updated} module(s) from JSON text.`
        );
        setShowJsonEditor(false);
        setJsonInputText('');
      } else {
        setDriveError('Invalid JSON structure. Ensure it follows the QuranModule schema.');
      }
    } catch (e: any) {
      setDriveError(e.message || 'JSON parsing error');
    }
  };

  // Copy Sample Module JSON Template
  const handleCopySampleTemplate = () => {
    const sample: QuranModule = {
      id: 'mod-custom-kahf-part1',
      title: 'Surah Al-Kahf (The Cave) - Part 1',
      titleAr: 'سورة الكهف - الجزء الأول',
      titleAm: 'ሱረቱል ካህፍ - ክፍል 1',
      subtitle: 'The Four Trials & The Light of Friday',
      subtitleAr: 'الفتن الأربع ونور الجمعة الشريفة',
      subtitleAm: 'አራቱ ፈተናዎች እና የጁምአ ብርሃን',
      orderIndex: 2,
      surahNumber: 18,
      revelationType: 'Meccan',
      totalVerses: 110,
      themeColor: 'amber',
      description: 'Custom curated Tafsir and thematic module for Surah Al-Kahf imported via Google Drive.',
      descriptionAr: 'منهج تفسيري موضوعي منسق لسورة الكهف.',
      descriptionAm: 'ለሱረቱል ካህፍ የተዘጋጀ የትምህርት መዝገብ።',
      thematicPillars: [
        {
          id: 'p-kahf-1',
          titleEn: 'Trial of Faith (People of the Cave)',
          titleAr: 'فتنة الدين (أصحاب الكهف)',
          titleAm: 'የእምነት ፈተና (የካህፍ ባልደረቦች)',
          descriptionEn: 'Preserving faith amidst oppressive disbelief.',
          descriptionAr: 'الحفاظ على الإيمان والدين في زمن الفتن.',
          descriptionAm: 'በፈተና ወቅት እምነትን መጠበቅ'
        }
      ],
      studyObjectives: [
        {
          en: 'Understand the protection of Surah Al-Kahf on Fridays',
          ar: 'فهم فضل سورة الكهف يوم الجمعة المبارك',
          am: 'የሱረቱል ካህፍን የጁምአ ታላቅነት መረዳት'
        }
      ],
      curatedAiAnalysis: {
        overviewEn: 'Deep scholarly analysis on the protective light of Al-Kahf.',
        overviewAr: 'تحليل علمي دقيق لأنوار سورة الكهف المباركة.',
        overviewAm: 'ስለ ሱረቱል ካህፍ ጥልቅ ትንተና',
        linguisticEloquenceEn: 'Rhetorical precision in the opening praise (Al-Hamdulillah).',
        linguisticEloquenceAr: 'البلاغة القرآنية في افتتاحيـة الحمد.',
        linguisticEloquenceAm: 'የአልሃምዱሊላህ የቋንቋ ውበት',
        practicalApplicationEn: 'Recite weekly on Fridays and ponder trial safeguards.',
        practicalApplicationAr: 'المواظبة على تلاوتها كل جمعة والتدبر في معانيها.',
        practicalApplicationAm: 'በየጁምአው በማንበብ መተግበር'
      },
      segments: [
        {
          id: 'seg-kahf-1',
          moduleId: 'mod-custom-kahf-part1',
          label: 'Verses 1-4: Perfect Praise & Divine Guidance',
          labelAr: 'الآيات ١-٤: الحمد لله الذي أنزل الكتاب',
          surahNumber: 18,
          verseNumber: 1,
          arabicText: 'ٱلْحَمْدُ لِلَّهِ ٱلَّذِىٓ أَنزَلَ عَلَىٰ عَبْدِهِ ٱلْكِتَٰبَ وَلَمْ يَجْعَل لَّهُۥ عِوَجَا ۜ',
          transliteration: 'Alhamdu lillahillathee anzala ala abdihil kitaba walam yaj\'al lahu \'iwaja',
          translation: {
            en: 'Praise be to Allah, who has sent down upon His Servant the Book and has not made therein any deviance.',
            ar: 'الحَمْدُ لِلَّهِ الَّذِي أَنْزَلَ عَلَى عَبْدِهِ الكِتَابَ وَلَمْ يَجْعَلْ لَهُ عِوَجَا',
            am: 'ምስጋና ለአላህ ይሁን ያ በእሪያው ላይ መጽሐፉን ላወረደው በውስጡም ምንም መዛባትን ላላደረገው።'
          },
          explanation: {
            en: 'Allah establishes complete perfection for the Quran, free from any flaw or deviance.',
            ar: 'إثبات الكمال المطلق للقرآن الكريم وتنزيهه عن كل عوج.',
            am: 'አላህ ለቁርአን ፍጹምነትን እና ጥራትን ያረጋገጠበት አንቀጽ።'
          },
          audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2141.mp3',
          keywords: [
            {
              id: 'kw-kahf-1',
              word: 'Al-Hamd',
              arabic: 'ٱلْحَمْدُ',
              root: 'ح-م-د',
              rootTransliteration: 'h-m-d',
              morphology: { en: 'Noun (Praise)', ar: 'اسم مجرور بالحمد' },
              meaning: { en: 'All Praise & Gratitude', ar: 'الحمد والثناء والشكر المطلق', am: 'ምስጋና ሁሉ' },
              expansions: ['Infinite praise reserved exclusively for Allah the Creator.']
            }
          ]
        }
      ]
    };

    const formatted = JSON.stringify([sample], null, 2);
    navigator.clipboard.writeText(formatted);
    setJsonCopyCopied(true);
    setTimeout(() => setJsonCopyCopied(false), 2000);
  };

  return (
    <div className={`space-y-6 ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-6 rounded-2xl border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold uppercase tracking-wider mb-2">
              <Database className="w-3.5 h-3.5" />
              {language === 'ar' ? 'تكامل Google Drive والمنهج المنسق' : 'Google Drive Curated Modules Integration'}
            </div>
            <h2 className="text-2xl font-bold font-serif">
              {language === 'ar' ? 'إدارة واستيراد المناهج والموديولات الدراسية' : 'Quran Study & Tafsir Modules Drive Manager'}
            </h2>
            <p className="text-sm text-emerald-100/80 mt-1 max-w-2xl">
              {language === 'ar'
                ? 'استورد وحيّن المناهج التفسيرية مباشرة من مجلد Google Drive أو قم بفرز وحدات الدراسة.'
                : 'Update, customize, or import new Curated Modules for Quranic Study & Tafsir directly from your Google Drive folder.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowJsonEditor(true)}
              className="px-3 py-2 rounded-xl bg-emerald-800/60 hover:bg-emerald-700 text-emerald-100 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Code className="w-4 h-4" />
              {language === 'ar' ? 'محرر JSON مباشر' : 'Raw JSON Import'}
            </button>
            <button
              onClick={() => resetCuratedModulesToDefault()}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              {language === 'ar' ? 'استعادة الافتراضي' : 'Reset Modules'}
            </button>
          </div>
        </div>
      </div>

      {/* Drive Error / Success Messages */}
      {driveError && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block mb-0.5">Integration Notice:</strong>
            {driveError}
          </div>
        </div>
      )}

      {driveSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-start gap-3">
          <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block mb-0.5">Success:</strong>
            {driveSuccessMsg}
          </div>
        </div>
      )}

      {/* Google Drive Folder Sync Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
              <Folder className="w-4 h-4 text-emerald-600" />
              {language === 'ar' ? 'ربط مجلد Google Drive للمناهج' : 'Connected Google Drive Input Folder'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'ar'
                ? 'استخدام الرابط المعتمد للمجلد لجلب وقراءة الملفات المنسقة'
                : 'Folder ID: 1yBYV_N_4leL8qzCDRDmeeTEHx4wLz6fq (Configured via OAuth Scope)'}
            </p>
          </div>

          <a
            href={folderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
          >
            {language === 'ar' ? 'فتح المجلد في Drive' : 'Open Folder in Google Drive'}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8">
            <label className="text-[11px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">
              {language === 'ar' ? 'رابط المجلد أو Folder ID' : 'Google Drive Folder URL / ID'}
            </label>
            <input
              type="text"
              value={folderUrl}
              onChange={(e) => setFolderUrl(e.target.value)}
              placeholder="https://drive.google.com/drive/folders/..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="md:col-span-4 flex items-end">
            <button
              onClick={handleFetchDriveFolder}
              disabled={isFetchingFolder}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isFetchingFolder ? 'animate-spin' : ''}`} />
              {isFetchingFolder
                ? language === 'ar'
                  ? 'جاري جلب الملفات...'
                  : 'Fetching Folder...'
                : language === 'ar'
                ? 'فحص واستيراد محتوى المجلد'
                : 'Fetch Drive Folder Files'}
            </button>
          </div>
        </div>

        {/* Access Token Option if folder is restricted */}
        <div className="pt-2">
          <details className="text-xs text-slate-500">
            <summary className="cursor-pointer font-medium text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              {language === 'ar' ? 'إدخال رمز وصول OAuth اختياري للمجلدات الخاصة' : 'Provide optional OAuth Access Token for private Drive folders'}
            </summary>
            <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <input
                type="text"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="Bearer OAuth Access Token (ya29...)"
                className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {language === 'ar'
                  ? 'ملاحظة: النطاق المعتمد للربط هو drive.readonly'
                  : 'Authorized OAuth scope: https://www.googleapis.com/auth/drive.readonly'}
              </span>
            </div>
          </details>
        </div>

        {/* Fetched Folder Files Listing */}
        {folderFiles.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-600" />
              {language === 'ar' ? 'الملفات المكتشفة في مجلد Drive:' : 'Files Discovered in Drive Folder:'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {folderFiles.map((file) => (
                <div
                  key={file.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-3"
                >
                  <div className="overflow-hidden">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate block">
                      {file.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {file.mimeType} {file.size ? `• ${Math.round(Number(file.size) / 1024)} KB` : ''}
                    </span>
                  </div>

                  <button
                    onClick={() => handleSelectAndImportFile(file)}
                    disabled={isDownloadingFile && selectedFile?.id === file.id}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shrink-0 transition-all flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {language === 'ar' ? 'قراءة واستيراد' : 'Import Module'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PARSED PREVIEW MODULES REVIEW BEFORE SAVING */}
      {parsedPreviewModules.length > 0 && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl p-6 border border-emerald-300 dark:border-emerald-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-200 dark:border-emerald-900">
            <div>
              <h3 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                {language === 'ar' ? 'معاينة الوحدات المجهزة للاستيراد:' : 'Preview Module(s) Ready for Import:'}
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                {language === 'ar'
                  ? 'يرجى مراجعة تفاصيل الوحدات قبل دمجها مع المنهج الدراسي الرئيسي'
                  : 'Review module structure and verses before applying changes.'}
              </p>
            </div>

            <button
              onClick={handleConfirmImport}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {language === 'ar' ? 'تأكيد الحفظ بالمنهج' : 'Confirm & Apply Modules'}
            </button>
          </div>

          <div className="space-y-3">
            {parsedPreviewModules.map((pMod) => (
              <div
                key={pMod.id}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                    {pMod.title}
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                    Surah {pMod.surahNumber} • {pMod.segments?.length || 0} Verses
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">{pMod.subtitle}</p>
                <div className="text-[11px] text-slate-500 italic">{pMod.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVE CURATED MODULES GRID */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              {language === 'ar' ? 'المناهج المعتمدة والنشطة حالياً' : 'Currently Active Curated Modules'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'ar'
                ? `إجمالي الوحدات المتاحة بالمنهج: ${curatedModules.length}`
                : `Total active modules available for study: ${curatedModules.length}`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {curatedModules.map((mod) => (
            <div
              key={mod.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    Surah #{mod.surahNumber}
                  </span>
                  {mod.id.startsWith('mod-drive') || mod.id.startsWith('mod-custom') ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      Drive Imported
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      Built-in
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {mod.title}
                </h4>
                <p className="font-amiri text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5" dir="rtl">
                  {mod.titleAr}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                  {mod.subtitle}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
                <span>{mod.segments?.length || 0} Verses</span>
                <span className="capitalize">{mod.revelationType}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RAW JSON MANUAL EDITOR MODAL */}
      {showJsonEditor && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-600" />
                {language === 'ar' ? 'محرر ومستورد JSON المباشر' : 'Manual JSON Module Editor & Direct Importer'}
              </h3>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySampleTemplate}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {jsonCopyCopied
                    ? language === 'ar'
                      ? 'تم النسخ!'
                      : 'Copied Sample!'
                    : language === 'ar'
                    ? 'نسخ القالب التجريبي'
                    : 'Copy Sample Template JSON'}
                </button>
                <button
                  onClick={() => setShowJsonEditor(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-sm px-2"
                >
                  ✕
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              {language === 'ar'
                ? 'الصق كود JSON الخاص بالمناهج التفسيرية بصيغة QuranModule المعتمدة'
                : 'Paste custom QuranModule JSON array below or modify file contents from Google Drive.'}
            </p>

            <textarea
              rows={12}
              value={jsonInputText}
              onChange={(e) => setJsonInputText(e.target.value)}
              placeholder={'[\n  {\n    "id": "mod-custom-1",\n    "title": "Surah Title"\n  }\n]'}
              className="w-full p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowJsonEditor(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleParseManualJson}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow"
              >
                {language === 'ar' ? 'حفظ واستيراد' : 'Parse & Save Modules'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
