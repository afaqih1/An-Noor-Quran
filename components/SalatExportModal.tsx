import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  FileText, 
  Download, 
  Check, 
  Copy, 
  Sparkles, 
  Eye, 
  FileCheck, 
  Settings2, 
  Loader2, 
  BookOpen, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { 
  downloadSalatRecitationsDocx, 
  printSalatRecitationsHTML, 
  SalatExportOptions 
} from './salatDocxExport';
import { 
  SALAT_RECITATIONS, 
  SALAT_POSITION_CATEGORIES 
} from './salatRecitationsData';

interface SalatExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultOptions?: SalatExportOptions;
}

export const SalatExportModal: React.FC<SalatExportModalProps> = ({
  isOpen,
  onClose,
  defaultOptions
}) => {
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'both' | 'pdf' | 'docx'>('both');
  const [includeTransliteration, setIncludeTransliteration] = useState<boolean>(defaultOptions?.includeTransliteration ?? true);
  const [includeEnglish, setIncludeEnglish] = useState<boolean>(defaultOptions?.includeEnglish ?? true);
  const [includeAmharic, setIncludeAmharic] = useState<boolean>(defaultOptions?.includeAmharic ?? (language === 'am' || language === 'har'));
  const [includeNotes, setIncludeNotes] = useState<boolean>(defaultOptions?.includeNotes ?? true);
  const [includeImages, setIncludeImages] = useState<boolean>(defaultOptions?.includeImages ?? true);
  const [filterRuling, setFilterRuling] = useState<'all' | 'essential'>(defaultOptions?.filterRuling ?? 'all');

  const [isGeneratingDocx, setIsGeneratingDocx] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentOptions: SalatExportOptions = {
    includeTransliteration,
    includeEnglish,
    includeAmharic,
    includeNotes,
    includeImages,
    filterRuling
  };

  const handleDownloadDocx = async () => {
    setIsGeneratingDocx(true);
    try {
      await downloadSalatRecitationsDocx(
        currentOptions,
        filterRuling === 'essential'
          ? 'What_to_Recite_During_Salat_Essential_Pillars.docx'
          : 'What_to_Recite_During_Salat_Complete_Guide.docx'
      );
    } catch (e) {
      console.error('Failed to generate docx:', e);
      alert('Error generating Word document. Please try again.');
    } finally {
      setIsGeneratingDocx(false);
    }
  };

  const handlePrintPDF = async () => {
    setIsPrinting(true);
    try {
      await printSalatRecitationsHTML(currentOptions);
    } catch (e) {
      console.error('Failed to print:', e);
    } finally {
      setIsPrinting(false);
    }
  };

  const handleCopyAll = () => {
    let items = SALAT_RECITATIONS;
    if (filterRuling === 'essential') {
      items = items.filter(r => r.isEssential);
    }

    let compiled = `WHAT TO RECITE DURING SALAT IN EVERY POSITION\nأذكار وأدعية الصلاة في كل ركن وموضع من هدي النبي ﷺ\nAn-Noor Quran Companion • Complete Prophetic Guide\n\n`;

    SALAT_POSITION_CATEGORIES.forEach(cat => {
      const catItems = items.filter(r => r.positionCategory === cat.category);
      if (catItems.length === 0) return;

      compiled += `=====================================================\n`;
      compiled += `${cat.order}. ${cat.nameEn.toUpperCase()} (${cat.nameAr})\n`;
      compiled += `Posture: ${cat.briefPostureEn}\n`;
      compiled += `=====================================================\n\n`;

      catItems.forEach((item, idx) => {
        compiled += `[${cat.order}.${idx + 1}] ${item.titleEn} (${item.rulingLabelEn.split('(')[0].trim()})\n`;
        compiled += `Arabic:\n${item.arabicText}\n`;
        if (includeTransliteration && item.transliteration) {
          compiled += `Transliteration: ${item.transliteration}\n`;
        }
        if (includeEnglish && item.translationEn) {
          compiled += `English Translation: "${item.translationEn}"\n`;
        }
        if (includeAmharic && item.translationAm) {
          compiled += `Amharic Translation: ${item.translationAm}\n`;
        }
        compiled += `Reference: ${item.hadithReference} (${item.authenticityGrade})\n`;
        if (includeNotes && item.explanationEn) {
          compiled += `Note: ${item.explanationEn}\n`;
        }
        compiled += `\n`;
      });
    });

    navigator.clipboard.writeText(compiled).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    });
  };

  const previewItemsCount = filterRuling === 'essential' 
    ? SALAT_RECITATIONS.filter(r => r.isEssential).length 
    : SALAT_RECITATIONS.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-secondary-200 dark:border-slate-800 shadow-2xl flex flex-col w-full max-w-4xl max-h-[92vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-primary-900 via-primary-950 to-slate-950 text-white flex items-center justify-between gap-4 border-b border-primary-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-800/60 border border-primary-700/60 flex items-center justify-center text-primary-200 shrink-0">
              <Printer size={20} className="text-secondary-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                  {language === 'ar' ? 'طباعة وتصدير أذكار وأدعية الصلاة' : 'Print & Export Salat Recitations'}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  PDF & Word (.docx)
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                {language === 'ar'
                  ? 'تصدير وثيقة منسقة باللغة العربية المشكولة والترجمات مع ضبط الهوامش والخطوط للطباعة المباشرة'
                  : 'Export or print a beautifully formatted document with full Arabic tashkeel, transliteration & translations'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow text-xs sm:text-sm">
          
          {/* Action Choice Highlights Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* 1. PDF / Print Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-red-500/10 via-amber-500/5 to-slate-50 dark:from-red-950/20 dark:to-slate-900/60 border border-red-200/80 dark:border-red-900/40 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 font-bold text-red-700 dark:text-red-400">
                    <Printer size={16} />
                    <span>{language === 'ar' ? 'طباعة / حفظ كملف PDF' : 'Print / Save as PDF'}</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-bold">
                    A4 Print Ready
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {language === 'ar'
                    ? 'يفتح نافذة طباعة مخصصة بأبعاد صفحة A4 وخط عربي عالي الوضوح، جاهزة للطباعة الورقية أو الحفظ بتنسيق PDF.'
                    : 'Opens a print-optimized window formatted for A4 pages with crisp Arabic typography. Perfect for physical printing or saving as PDF.'}
                </p>
              </div>

              <button
                onClick={handlePrintPDF}
                disabled={isPrinting}
                className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-60"
              >
                {isPrinting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>{language === 'ar' ? 'جاري تجهيز صفحات الطباعة...' : 'Preparing Print View...'}</span>
                  </>
                ) : (
                  <>
                    <Printer size={15} />
                    <span>{language === 'ar' ? 'طباعة الآن / حفظ كـ PDF' : 'Print Now / Save as PDF'}</span>
                  </>
                )}
              </button>
            </div>

            {/* 2. Microsoft Word Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-primary-500/5 to-slate-50 dark:from-blue-950/20 dark:to-slate-900/60 border border-blue-200/80 dark:border-blue-900/40 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-400">
                    <FileText size={16} />
                    <span>{language === 'ar' ? 'مستند Microsoft Word (.docx)' : 'Microsoft Word (.docx)'}</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                    Editable DOCX
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {language === 'ar'
                    ? 'ملف Word منسق بالكامل يدعم النصوص العربية من اليمين لليسار، والجداول، والعناوين. متوافق مع MS Word وGoogle Docs.'
                    : 'Fully formatted Word document with native Arabic RTL support, tables, headings, and translations. Compatible with MS Word, Google Docs, Apple Pages.'}
                </p>
              </div>

              <button
                onClick={handleDownloadDocx}
                disabled={isGeneratingDocx}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-60"
              >
                {isGeneratingDocx ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>{language === 'ar' ? 'جاري تجهيز الملف...' : 'Generating DOCX...'}</span>
                  </>
                ) : (
                  <>
                    <Download size={15} />
                    <span>{language === 'ar' ? 'تحميل ملف Word (.docx)' : 'Download Word Document (.docx)'}</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Configuration Options Section */}
          <div className="p-5 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Settings2 size={15} className="text-primary-600" />
              <span>{language === 'ar' ? 'تخصيص محتويات الوثيقة قبل التصدير' : 'Customize Document Contents Before Exporting'}</span>
            </div>

            {/* Scope selection: All vs Essential */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'ar' ? 'نطاق الأذكار المشمولة في الوثيقة:' : 'Scope of Invocations to Include:'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setFilterRuling('all')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    filterRuling === 'all'
                      ? 'border-primary-500 bg-primary-50/60 dark:bg-primary-950/40 text-primary-900 dark:text-primary-200 font-bold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{language === 'ar' ? 'الدليل الكامل (٣١ ذكراً ودعاءً)' : 'Complete Guide (All 31 Invocations)'}</span>
                    {filterRuling === 'all' && <CheckCircle2 size={14} className="text-primary-600" />}
                  </div>
                  <span className="text-[11px] font-normal text-slate-500 block mt-0.5">
                    {language === 'ar' ? 'يشمل جميع الأركان والواجبات وسنن الركوع والسجود' : 'Includes all pillars, obligations & recommended sunnahs'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFilterRuling('essential')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    filterRuling === 'essential'
                      ? 'border-primary-500 bg-primary-50/60 dark:bg-primary-950/40 text-primary-900 dark:text-primary-200 font-bold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{language === 'ar' ? 'ملخص الأركان والواجبات فقط' : 'Essential Minimum (Pillars & Wajibat)'}</span>
                    {filterRuling === 'essential' && <CheckCircle2 size={14} className="text-primary-600" />}
                  </div>
                  <span className="text-[11px] font-normal text-slate-500 block mt-0.5">
                    {language === 'ar' ? 'موجز للأذكار الإلزامية لصحة الصلاة، ممتاز للمبتدئين' : 'Concise cheat-sheet of mandatory invocations, great for beginners'}
                  </span>
                </button>
              </div>
            </div>

            {/* Checkbox Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <label className="flex items-center gap-2.5 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeTransliteration}
                  onChange={(e) => setIncludeTransliteration(e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'تضمين النطق اللاتيني (Transliteration)' : 'Include Phonetic Transliteration'}
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeEnglish}
                  onChange={(e) => setIncludeEnglish(e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'تضمين الترجمة الإنجليزية (English Translation)' : 'Include English Translation'}
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeAmharic}
                  onChange={(e) => setIncludeAmharic(e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'تضمين الترجمة الأمهرية (አማርኛ)' : 'Include Amharic Translation (አማርኛ)'}
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeNotes}
                  onChange={(e) => setIncludeNotes(e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'تضمين شرح الأحاديث والفوائد الإيمانية' : 'Include Hadith Explanations & Benefits'}
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-300 dark:border-emerald-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeImages}
                  onChange={(e) => setIncludeImages(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-emerald-600" />
                  <span>{language === 'ar' ? 'إضافة صور ثلاثية الأبعاد لوضعيات الصلاة (3D Images)' : 'Include 3D Salat Position Images'}</span>
                </span>
              </label>
            </div>

            {/* 3D Posture Models Preview Gallery */}
            {includeImages && (
              <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200/80 dark:border-emerald-900/40 space-y-2.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={13} className="text-emerald-600" />
                    <span>{language === 'ar' ? 'النماذج ثلاثية الأبعاد المرفقة في ملفات الطباعة والـ Word:' : '3D Models Included Beside Each Prayer Posture:'}</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950">
                    5 3D Postures
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2 pt-1 text-center">
                  <div className="space-y-1">
                    <img 
                      src="/src/assets/images/salat_3d_qiyam_1793534882759.jpg" 
                      alt="Qiyam 3D" 
                      referrerPolicy="no-referrer"
                      className="w-full aspect-square object-cover rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs hover:scale-105 transition-transform" 
                    />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block truncate">1. Qiyam (القيام)</span>
                  </div>
                  <div className="space-y-1">
                    <img 
                      src="/src/assets/images/salat_3d_ruku_1793534883379.jpg" 
                      alt="Ruku 3D" 
                      referrerPolicy="no-referrer"
                      className="w-full aspect-square object-cover rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs hover:scale-105 transition-transform" 
                    />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block truncate">2. Ruku' (الركوع)</span>
                  </div>
                  <div className="space-y-1">
                    <img 
                      src="/src/assets/images/salat_3d_sujud_1793534882752.jpg" 
                      alt="Sujud 3D" 
                      referrerPolicy="no-referrer"
                      className="w-full aspect-square object-cover rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs hover:scale-105 transition-transform" 
                    />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block truncate">3. Sujud (السجود)</span>
                  </div>
                  <div className="space-y-1">
                    <img 
                      src="/src/assets/images/salat_3d_sitting_1793534884265.jpg" 
                      alt="Tashahhud 3D" 
                      referrerPolicy="no-referrer"
                      className="w-full aspect-square object-cover rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs hover:scale-105 transition-transform" 
                    />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block truncate">4. Jalsah (الجلوس)</span>
                  </div>
                  <div className="space-y-1">
                    <img 
                      src="/src/assets/images/salat_3d_tasleem_1793534884917.jpg" 
                      alt="Tasleem 3D" 
                      referrerPolicy="no-referrer"
                      className="w-full aspect-square object-cover rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs hover:scale-105 transition-transform" 
                    />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block truncate">5. Salam (التسليم)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Copy to Clipboard Alternative */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-xs">
            <span className="text-slate-600 dark:text-slate-400">
              {language === 'ar' 
                ? 'أو انسخ النص الكامل بضغطة زر للصقه في أي تطبيق أو محادثة:' 
                : 'Or copy all text with references formatted to clipboard:'}
            </span>

            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-700 hover:bg-slate-50 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-lg font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              {copiedText ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span>{copiedText ? (language === 'ar' ? 'تم نسخ النص بالكامل!' : 'All Text Copied!') : (language === 'ar' ? 'نسخ النص كاملاً' : 'Copy Full Text')}</span>
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            {language === 'ar' 
              ? `سيتم تضمين ${previewItemsCount} ذكراً عبر ١١ موضعاً` 
              : `Exporting ${previewItemsCount} authentic recitations across 11 postures`}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              {language === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
