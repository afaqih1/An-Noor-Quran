import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  Scale, 
  ArrowRight,
  Info,
  RotateCcw,
  ListOrdered,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useLanguage } from './LanguageContext';

export type RulingTab = 'all' | 'arkan' | 'wajibat' | 'sunan' | 'sahw' | 'comparison';

interface SalatRulingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: RulingTab;
}

export const SalatRulingsModal: React.FC<SalatRulingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'all'
}) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<RulingTab>(initialTab);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleExpand = (id: string) => {
    setExpandedItem(prev => (prev === id ? null : id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-secondary-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary-950 via-primary-900 to-slate-950 text-white p-5 sm:p-6 border-b border-primary-800/60">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-secondary-500/20 text-secondary-300 ring-1 ring-secondary-400/40">
                  <Scale size={18} />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-secondary-300">
                  {language === 'ar' ? 'فقه الصلاة وأحكامها' : 'Islamic Jurisprudence (Fiqh as-Salat)'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
                {language === 'ar' 
                  ? 'مراتب أحكام الصلاة: الأركان والواجبات والسنن' 
                  : (language === 'am' 
                    ? 'የሰላት ህግጋት ደረጃዎች፡ ሩክኖች (አርካን)፣ ዋጂባቶች እና ሱናዎች' 
                    : 'The Rulings of Salat: Pillars (Arkan), Obligations (Wajibat) & Sunnahs')}
              </h2>
              <p className="text-xs sm:text-sm text-primary-200/90 leading-relaxed max-w-2xl">
                {language === 'ar'
                  ? 'بيان شامل للفروق الفقهية الجوهرية بين ركن الصلاة، وواجبها، وسنتها، وحكم النسيان والتعمد، وكيفية جبرها بسجود السهو.'
                  : (language === 'am'
                    ? 'በሩክን፣ ዋጂብ እና ሱና መካከል ያለው የፊቅህ ልዩነት፣ ሆን ብሎ ወይም በመርሳት ሲተዉ የሚከሰተው እና የሱጁድ አስ-ሳህው ህግጋት።'
                    : 'Clear breakdown of the three legal categories of prayer acts, deliberate vs. forgetful omission rules, and Sujud as-Sahw compensation.')}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 mt-5 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-secondary-500 text-slate-950 font-bold shadow-md'
                  : 'bg-primary-900/60 text-primary-200 hover:bg-primary-800'
              }`}
            >
              {language === 'ar' ? 'نظرة شاملة' : 'Overview'}
            </button>
            <button
              onClick={() => setActiveTab('arkan')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'arkan'
                  ? 'bg-rose-500 text-white font-bold shadow-md'
                  : 'bg-primary-900/60 text-rose-200 hover:bg-primary-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>{language === 'ar' ? 'الأركان (١٤)' : 'Pillars / Arkan (14)'}</span>
            </button>
            <button
              onClick={() => setActiveTab('wajibat')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'wajibat'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-primary-900/60 text-amber-200 hover:bg-primary-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>{language === 'ar' ? 'الواجبات (٨)' : 'Obligations / Wajibat (8)'}</span>
            </button>
            <button
              onClick={() => setActiveTab('sunan')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'sunan'
                  ? 'bg-emerald-500 text-white font-bold shadow-md'
                  : 'bg-primary-900/60 text-emerald-200 hover:bg-primary-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{language === 'ar' ? 'السنن (قولية وفعلية)' : 'Sunnahs (Sunan)'}</span>
            </button>
            <button
              onClick={() => setActiveTab('sahw')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'sahw'
                  ? 'bg-sky-500 text-white font-bold shadow-md'
                  : 'bg-primary-900/60 text-sky-200 hover:bg-primary-800'
              }`}
            >
              <RotateCcw size={13} />
              <span>{language === 'ar' ? 'سجود السهو' : 'Sujud as-Sahw'}</span>
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'comparison'
                  ? 'bg-indigo-500 text-white font-bold shadow-md'
                  : 'bg-primary-900/60 text-indigo-200 hover:bg-primary-800'
              }`}
            >
              <Scale size={13} />
              <span>{language === 'ar' ? 'جدول المقارنة' : 'Comparison Table'}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-slate-800 dark:text-slate-200">

          {/* OVERVIEW TAB */}
          {(activeTab === 'all' || activeTab === 'comparison') && (
            <div className="space-y-6">
              {/* Core 3-Column Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Pillars (Arkan) Card */}
                <div className="p-5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200 border border-rose-200 dark:border-rose-800">
                      {language === 'ar' ? 'ركن • ١٤ ركناً' : 'Pillar • 14 Arkan'}
                    </span>
                    <ShieldCheck className="text-rose-600 dark:text-rose-400" size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-rose-950 dark:text-rose-100">
                      {language === 'ar' ? 'الأركان (أركان الصلاة)' : 'Pillars (Arkan as-Salat)'}
                    </h3>
                    <p className="text-xs text-rose-800 dark:text-rose-300 font-medium mt-0.5">
                      {language === 'ar' ? 'لا تسقط عمداً ولا سهواً' : 'Essential foundation of prayer'}
                    </p>
                  </div>
                  <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-1.5">
                      <span className="font-bold text-rose-600">•</span>
                      <span><strong>{language === 'ar' ? 'المعنى:' : 'Meaning:'}</strong> {language === 'ar' ? 'الأجزاء الأساسية التي تتركب منها حقيقة الصلاة.' : 'The foundational acts upon which the prayer’s validity depends.'}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="font-bold text-rose-600">•</span>
                      <span><strong>{language === 'ar' ? 'الترك عمداً:' : 'Deliberate:'}</strong> {language === 'ar' ? 'تبطل الصلاة إجماعاً.' : 'Prayer is immediately invalidated (Batil).'}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="font-bold text-rose-600">•</span>
                      <span><strong>{language === 'ar' ? 'الترك سهواً:' : 'Forgetful:'}</strong> {language === 'ar' ? 'لا يجبره سجود السهو وحده! بل يلزم الإتيان بالركن وتداركه ثم سجود السهو.' : 'Cannot be compensated by Sahw alone. Must bring the missed pillar and then do Sahw.'}</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => setActiveTab('arkan')}
                    className="w-full text-center text-xs font-bold text-rose-700 dark:text-rose-300 hover:underline pt-2 inline-flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>{language === 'ar' ? 'استعراض الأركان الـ ١٤ بالتفصيل' : 'View all 14 Pillars'}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* 2. Obligations (Wajibat) Card */}
                <div className="p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                      {language === 'ar' ? 'واجب • ٨ واجبات' : 'Obligation • 8 Wajibat'}
                    </span>
                    <AlertTriangle className="text-amber-600 dark:text-amber-400" size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-amber-950 dark:text-amber-100">
                      {language === 'ar' ? 'الواجبات (واجبات الصلاة)' : 'Obligations (Wajibat)'}
                    </h3>
                    <p className="text-xs text-amber-800 dark:text-amber-300 font-medium mt-0.5">
                      {language === 'ar' ? 'تجبر بسجود السهو عند النسيان' : 'Mandatory; compensated by Sahw'}
                    </p>
                  </div>
                  <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-1.5">
                      <span className="font-bold text-amber-600">•</span>
                      <span><strong>{language === 'ar' ? 'المعنى:' : 'Meaning:'}</strong> {language === 'ar' ? 'ما أمر به الشارع أمراً جازماً دون أن يكون ركناً.' : 'Mandatory actions and sayings commanded during Salat.'}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="font-bold text-amber-600">•</span>
                      <span><strong>{language === 'ar' ? 'الترك عمداً:' : 'Deliberate:'}</strong> {language === 'ar' ? 'تبطل الصلاة بتعمده.' : 'Prayer is invalidated (Batil).'}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="font-bold text-amber-600">•</span>
                      <span><strong>{language === 'ar' ? 'الترك سهواً:' : 'Forgetful:'}</strong> {language === 'ar' ? 'يسقط ولا يلزم الرجوع إليه، ويجبره سجود السهو قبل السلام.' : 'Does not need to be repeated; fully compensated by Sujud as-Sahw.'}</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => setActiveTab('wajibat')}
                    className="w-full text-center text-xs font-bold text-amber-700 dark:text-amber-300 hover:underline pt-2 inline-flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>{language === 'ar' ? 'استعراض الواجبات الـ ٨ بالتفصيل' : 'View all 8 Obligations'}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* 3. Sunnahs (Sunan) Card */}
                <div className="p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
                      {language === 'ar' ? 'سنة • أقوال وأفعال' : 'Sunnah • Words & Acts'}
                    </span>
                    <Sparkles className="text-emerald-600 dark:text-emerald-400" size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-emerald-950 dark:text-emerald-100">
                      {language === 'ar' ? 'السنن (سنن الصلاة)' : 'Sunnahs (Sunan as-Salat)'}
                    </h3>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium mt-0.5">
                      {language === 'ar' ? 'تزيد الأجر ولا تبطل الصلاة بتركها' : 'Voluntary perfections & Khushū‘'}
                    </p>
                  </div>
                  <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-1.5">
                      <span className="font-bold text-emerald-600">•</span>
                      <span><strong>{language === 'ar' ? 'المعنى:' : 'Meaning:'}</strong> {language === 'ar' ? 'أقوال وأفعال مستحبة تكمّل الصلاة وتزيد الثواب.' : 'Prophetic verbal & physical practices completing prayer.'}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="font-bold text-emerald-600">•</span>
                      <span><strong>{language === 'ar' ? 'الترك عمداً:' : 'Deliberate:'}</strong> {language === 'ar' ? 'الصلاة صحيحة ولا تبطل، ويفوته فضل عظيم.' : 'Prayer is completely valid, though one misses great reward.'}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="font-bold text-emerald-600">•</span>
                      <span><strong>{language === 'ar' ? 'الترك سهواً:' : 'Forgetful:'}</strong> {language === 'ar' ? 'الصلاة صحيحة ولا يشرع لها سجود السهو.' : 'Prayer is valid; no Sujud as-Sahw is required.'}</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => setActiveTab('sunan')}
                    className="w-full text-center text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:underline pt-2 inline-flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>{language === 'ar' ? 'استعراض سنن الصلاة القولية والفعلية' : 'View all Sunnahs'}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* Comparison Matrix Table */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/80 space-y-4">
                <div className="flex items-center gap-2">
                  <Scale className="text-secondary-600 dark:text-secondary-400" size={18} />
                  <h4 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                    {language === 'ar' ? 'جدول المقارنة الفقهية الشامل' : 'Comprehensive Jurisprudential Comparison'}
                  </h4>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-200/60 dark:bg-slate-700/50">
                        <th className="p-3 font-bold">{language === 'ar' ? 'المعيار الفقهي' : 'Criterion'}</th>
                        <th className="p-3 font-bold text-rose-700 dark:text-rose-300">{language === 'ar' ? 'الركن (Arkan)' : 'Pillars (Arkan)'}</th>
                        <th className="p-3 font-bold text-amber-700 dark:text-amber-300">{language === 'ar' ? 'الواجب (Wajibat)' : 'Obligations (Wajibat)'}</th>
                        <th className="p-3 font-bold text-emerald-700 dark:text-emerald-300">{language === 'ar' ? 'السنة (Sunan)' : 'Sunnahs (Sunan)'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60">
                      <tr>
                        <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{language === 'ar' ? 'الحُكم الشرعي' : 'Legal Status'}</td>
                        <td className="p-3">{language === 'ar' ? 'فرض لازم لا تصح الصلاة بدونه' : 'Mandatory foundation of prayer'}</td>
                        <td className="p-3">{language === 'ar' ? 'واجب لازم لكنه دون الركن' : 'Obligatory command within prayer'}</td>
                        <td className="p-3">{language === 'ar' ? 'مستحب يثاب فاعله ولا يعاقب تاركه' : 'Recommended; rewarded, no sin for omission'}</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{language === 'ar' ? 'الترك عمداً' : 'Deliberate Omission'}</td>
                        <td className="p-3 text-rose-600 font-bold">{language === 'ar' ? 'تبطل الصلاة فوراً' : 'Invalidates prayer (Batil)'}</td>
                        <td className="p-3 text-amber-600 font-bold">{language === 'ar' ? 'تبطل الصلاة فوراً' : 'Invalidates prayer (Batil)'}</td>
                        <td className="p-3 text-emerald-600 font-semibold">{language === 'ar' ? 'الصلاة صحيحة ويفوت الأجر' : 'Valid; misses optimal reward'}</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{language === 'ar' ? 'الترك سهواً (نسياناً)' : 'Forgetful Omission'}</td>
                        <td className="p-3 text-rose-700 dark:text-rose-300 font-semibold">{language === 'ar' ? 'لا يسقط، يلزم تداركه والإتيان به + سجود السهو' : 'Must make up the missed pillar + Sujud as-Sahw'}</td>
                        <td className="p-3 text-amber-700 dark:text-amber-300 font-semibold">{language === 'ar' ? 'يسقط ويجبره سجود السهو تماماً' : 'Compensated entirely by Sujud as-Sahw'}</td>
                        <td className="p-3 text-emerald-700 dark:text-emerald-300 font-semibold">{language === 'ar' ? 'الصلاة صحيحة ولا يشرع له سجود سهو' : 'Valid; no Sujud as-Sahw required'}</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{language === 'ar' ? 'العدد والأمثلة' : 'Count & Core Examples'}</td>
                        <td className="p-3">{language === 'ar' ? '١٤ ركناً (الفاتحة، الركوع، السجود، الطمأنينة...)' : '14 (Fatihah, Ruku, Sujud, Tumaninah, Tashahhud...)'}</td>
                        <td className="p-3">{language === 'ar' ? '٨ واجبات (تكبيرات الانتقال، التسميع، التحميد، التشهد الأول...)' : '8 (Transition Takbirs, Tasbih in Ruku/Sujud, 1st Tashahhud...)'}</td>
                        <td className="p-3">{language === 'ar' ? 'عشرات (دعاء الاستفتاح، رفع اليدين، وضع اليمين على الشمال، التورك...)' : 'Many (Istiftah, raising hands, right on left, Tawarruk...)'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 14 ARKAN TAB */}
          {activeTab === 'arkan' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60">
                <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-sm">
                  <ShieldCheck size={18} />
                  <span>{language === 'ar' ? 'أركان الصلاة الأربعة عشر (١٤ ركناً)' : 'The 14 Pillars of Salat (Arkan as-Salat)'}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {language === 'ar'
                    ? 'الركن هو جانب الشيء الأقوى الذي لا تقوم الصلاة إلا به. وإذا نسي المصلي ركناً، فإن تذكره قبل الشروع في قراءة الركعة التالية لزمه الرجوع إليه وأداؤه، وإن تذكره بعد ذلك ألغيت تلك الركعة وقامت الركعة التالية مقامها، ثم يسجد للسهو.'
                    : 'A pillar is a foundational component of prayer without which Salat is invalid. If forgotten, it must be performed along with what follows it, or the entire Rak\'ah must be replaced, followed by Sujud as-Sahw.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  {
                    num: 1,
                    titleAr: 'القيام في الفرض للقادر عليه',
                    titleEn: 'Standing (Qiyam) in obligatory prayer for those able',
                    detailAr: 'لقوله تعالى: {وَقُومُوا لِلَّهِ قَانِتِينَ}، ولحديث عمران بن حصين: «صَلِّ قَائِمًا».',
                    detailEn: 'Obligatory in Fard prayers if physically capable; excused in illness or voluntary prayer.'
                  },
                  {
                    num: 2,
                    titleAr: 'تكبيرة الإحرام (قول: الله أكبر)',
                    titleEn: 'Takbirat al-Ihram ("Allahu Akbar")',
                    detailAr: 'لقول النبي ﷺ: «مِفْتَاحُ الصَّلَاةِ الطُّهُورُ، وَتَحْرِيمُهَا التَّكْبِيرُ».',
                    detailEn: 'The opening utterance that enters one into the sacred state of prayer.'
                  },
                  {
                    num: 3,
                    titleAr: 'قراءة سورة الفاتحة في كل ركعة',
                    titleEn: 'Reciting Surah Al-Fatihah in every Rak\'ah',
                    detailAr: 'لقول النبي ﷺ: «لَا صَلَاةَ لِمَنْ لَمْ يَقْرَأْ بِفَاتِحَةِ الْكِتَابِ».',
                    detailEn: 'Recitation of the Mother of the Quran is mandatory in every single unit of prayer.'
                  },
                  {
                    num: 4,
                    titleAr: 'الركوع',
                    titleEn: 'Ruku\' (Bowing)',
                    detailAr: 'بأن ينحني بحيث تبلغ يداه ركبتيه، وأكمله تسوية ظهره مع رأسه.',
                    detailEn: 'Bowing so the palms comfortably touch the knees, keeping the back straight.'
                  },
                  {
                    num: 5,
                    titleAr: 'الرفع من الركوع',
                    titleEn: 'Rising from Ruku\'',
                    detailAr: 'العودة من وضعية الركوع إلى القيام التام.',
                    detailEn: 'Moving upwards from bowing back into an erect standing position.'
                  },
                  {
                    num: 6,
                    titleAr: 'الاعتدال قائماً بعد الركوع',
                    titleEn: 'Standing upright in complete equilibrium',
                    detailAr: 'أن يعود كل عضو إلى موضعه وهو قائم.',
                    detailEn: 'Every bone and vertebra returning smoothly to its rightful resting place.'
                  },
                  {
                    num: 7,
                    titleAr: 'السجود على الأعضاء السبعة',
                    titleEn: 'Sujud (Prostration) on the 7 limbs',
                    detailAr: 'الجبهة مع الأنف، والكفان، والركبتان، وأطراف أصابع القدمين.',
                    detailEn: 'Forehead with nose, both palms, both knees, and tips of both sets of toes.'
                  },
                  {
                    num: 8,
                    titleAr: 'الرفع من السجود',
                    titleEn: 'Rising from Sujud',
                    detailAr: 'الارتفاع من وضع السجود إلى الجلوس.',
                    detailEn: 'Elevating the torso from the ground into the sitting position.'
                  },
                  {
                    num: 9,
                    titleAr: 'الجلوس بين السجدتين',
                    titleEn: 'Sitting between the two prostrations',
                    detailAr: 'الجلوس مطمئناً بين السجدة الأولى والثانية.',
                    detailEn: 'A tranquil sitting posture between the first and second prostrations.'
                  },
                  {
                    num: 10,
                    titleAr: 'الطمأنينة في جميع الأركان',
                    titleEn: 'Tum\'anīnah (Tranquility & Calmness) in all acts',
                    detailAr: 'السكون والهدوء بقدر الذكر الواجب في كل ركن، لحديث المسيء صلاته.',
                    detailEn: 'Pausing in stillness long enough for all bones to settle and complete the minimum tasbih.'
                  },
                  {
                    num: 11,
                    titleAr: 'التشهد الأخير',
                    titleEn: 'The Final Tashahhud (At-Tahiyyat)',
                    detailAr: 'الصيغة المأثورة: «التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ...».',
                    detailEn: 'Reciting the comprehensive testification of faith in the final sitting.'
                  },
                  {
                    num: 12,
                    titleAr: 'الجلوس للتشهد الأخير والصلاة على النبي ﷺ',
                    titleEn: 'Sitting for Final Tashahhud & Sending Salawat',
                    detailAr: 'الجلوس المخصص للتشهد الأخير والصلاة الإبراهيمية.',
                    detailEn: 'Maintaining the sitting posture during the Tashahhud and blessings on the Prophet ﷺ.'
                  },
                  {
                    num: 13,
                    titleAr: 'التسليمتان (السلام عليكم ورحمة الله)',
                    titleEn: 'Tasleem (Concluding Salutations)',
                    detailAr: 'لقوله ﷺ: «وَتَحْلِيلُهَا التَّسْلِيمُ»، يميناً وشمالاً.',
                    detailEn: 'Greeting right and left to release oneself from the sacred ritual.'
                  },
                  {
                    num: 14,
                    titleAr: 'الترتيب بين الأركان كما شرعها النبي ﷺ',
                    titleEn: 'Observing the correct sequence (Tarteeb)',
                    detailAr: 'القيام فالفاتحة فالركوع فالرفع فالسجود هكذا بالترتيب النبوي.',
                    detailEn: 'Executing each posture in its prescribed Prophetic sequence.'
                  }
                ].map(item => (
                  <div 
                    key={item.num}
                    className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-3 shadow-xs hover:border-rose-300 dark:hover:border-rose-800 transition-all"
                  >
                    <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                      {item.num}
                    </span>
                    <div className="space-y-0.5">
                      <h5 className="font-bold text-slate-900 dark:text-white">
                        {language === 'ar' ? item.titleAr : item.titleEn}
                      </h5>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        {language === 'ar' ? item.detailAr : item.detailEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8 WAJIBAT TAB */}
          {activeTab === 'wajibat' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                  <AlertTriangle size={18} />
                  <span>{language === 'ar' ? 'واجبات الصلاة الثمانية (٨ واجبات)' : 'The 8 Obligations of Salat (Wajibat as-Salat)'}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {language === 'ar'
                    ? 'الواجب هو ما أمر به الشارع أمراً جازماً. إن تركه المصلي عمداً بطلت صلاته، وإن تركه سهواً سقط عنه ولا يلزمه الرجوع إليه إذا فارق محله، وتجبره سجدتا السهو قبل السلام.'
                    : 'Obligations are mandatory verbal and physical acts. If omitted intentionally, prayer is invalid. If omitted forgetfully, they are completely redeemed by Sujud as-Sahw.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  {
                    num: 1,
                    titleAr: 'جميع التكبيرات غير تكبيرة الإحرام (تكبيرات الانتقال)',
                    titleEn: 'All Transition Takbirs (other than Takbirat al-Ihram)',
                    detailAr: 'التكبير عند الركوع، والسجود، والرفع منه، والقيام من التشهد.',
                    detailEn: 'Saying "Allahu Akbar" while transitioning between all postures.'
                  },
                  {
                    num: 2,
                    titleAr: 'قول: «سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ»',
                    titleEn: 'Saying: "Sami\'a Allahu liman hamidah"',
                    detailAr: 'واجب على الإمام والمنفرد عند الرفع من الركوع.',
                    detailEn: 'Mandatory for the Imam and individual worshipper upon rising from Ruku.'
                  },
                  {
                    num: 3,
                    titleAr: 'قول: «رَبَّنَا وَلَكَ الْحَمْدُ»',
                    titleEn: 'Saying: "Rabbana wa lakal hamd"',
                    detailAr: 'واجب على الإمام والمأموم والمنفرد عند الاعتدال.',
                    detailEn: 'Mandatory upon all (Imam, follower, and solitary worshipper) standing straight.'
                  },
                  {
                    num: 4,
                    titleAr: 'قول: «سُبْحَانَ رَبِّيَ الْعَظِيمِ» مرة في الركوع',
                    titleEn: 'Saying: "Subhana Rabbiyal \'Azeem" once in Ruku',
                    detailAr: 'المرة الواحدة واجبة، والزيادة إلى ثلاث أو أكثر سنة.',
                    detailEn: 'Saying it once is mandatory; repeating 3 or more times is Sunnah.'
                  },
                  {
                    num: 5,
                    titleAr: 'قول: «سُبْحَانَ رَبِّيَ الْأَعْلَى» مرة في السجود',
                    titleEn: 'Saying: "Subhana Rabbiyal A\'la" once in Sujud',
                    detailAr: 'المرة الواحدة واجبة، والتكرار إلى ثلاث أو أكثر سنة.',
                    detailEn: 'Saying it once is mandatory; repeating 3 or more times is Sunnah.'
                  },
                  {
                    num: 6,
                    titleAr: 'قول: «رَبِّ اغْفِرْ لِي» بين السجدتين',
                    titleEn: 'Saying: "Rabbi-ghfir li" between the two prostrations',
                    detailAr: 'الواجب مرة واحدة، وسنة أن يقولها مرتين أو ثلاثاً.',
                    detailEn: 'Mandatory once during the sitting between prostrations.'
                  },
                  {
                    num: 7,
                    titleAr: 'التشهد الأول',
                    titleEn: 'The First Tashahhud (in 3 and 4-Rak\'ah prayers)',
                    detailAr: 'قراءة ألفاظ التشهد في الجلوس الأوسط من الصلاة الثلاثية والرباعية.',
                    detailEn: 'Reciting the testification of faith after the second unit of Dhuhr, Asr, Maghrib & Isha.'
                  },
                  {
                    num: 8,
                    titleAr: 'الجلوس للتشهد الأول',
                    titleEn: 'Sitting for the First Tashahhud',
                    detailAr: 'اتخاذ وضعية الجلوس لأداء التشهد الأوسط.',
                    detailEn: 'Sitting in posture to perform the intermediate Tashahhud.'
                  }
                ].map(item => (
                  <div 
                    key={item.num}
                    className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-3 shadow-xs hover:border-amber-300 dark:hover:border-amber-800 transition-all"
                  >
                    <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                      {item.num}
                    </span>
                    <div className="space-y-0.5">
                      <h5 className="font-bold text-slate-900 dark:text-white">
                        {language === 'ar' ? item.titleAr : item.titleEn}
                      </h5>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        {language === 'ar' ? item.detailAr : item.detailEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUNAN TAB */}
          {activeTab === 'sunan' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                  <Sparkles size={18} />
                  <span>{language === 'ar' ? 'سنن الصلاة: القولية والفعلية' : 'Sunnahs of Salat: Verbal & Physical'}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {language === 'ar'
                    ? 'السنن هي كل ما عدا الأركان والواجبات من الأقوال والأفعال. لا تبطل الصلاة بتركها عمداً أو سهواً، ولكن تركها يفوت على المصلي ثواباً جزيلاً وخيراً كثيراً واقتداءً تاماً بالنبي ﷺ.'
                    : 'Sunnahs encompass all authentic verbal and physical practices outside pillars and obligations. Their omission does not invalidate prayer, but practicing them enriches Khushū‘ and maximizes reward.'}
                </p>
              </div>

              {/* Two columns: Verbal and Physical */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                {/* Verbal Sunnahs */}
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                    <BookOpen size={16} />
                    <span>{language === 'ar' ? 'السنن القولية (أقوال الصلاة المستحبة)' : 'Verbal Sunnahs (Sunan al-Aqwal)'}</span>
                  </div>
                  <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                    <li className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <strong>{language === 'ar' ? 'دعاء الاستفتاح:' : 'Opening Supplication (Istiftah):'}</strong> {language === 'ar' ? '«سبحانك اللهم وبحمدك...» أو «اللهم باعد بيني وبين خطاياي...»' : 'Reciting "Subhanaka Allahumma..." or "Allahumma ba\'id bayni..."'}
                    </li>
                    <li className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <strong>{language === 'ar' ? 'الاستعاذة والبسملة سراً:' : 'Seeking refuge & Basmalah:'}</strong> {language === 'ar' ? 'قول «أعوذ بالله من الشيطان الرجيم» و «بسم الله الرحمن الرحيم»' : 'Silently seeking refuge from Satan and saying the Basmalah.'}
                    </li>
                    <li className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <strong>{language === 'ar' ? 'قول «آمين»:' : 'Saying "Ameen":'}</strong> {language === 'ar' ? 'جهراً في الجهرية وسراً في السرية بعد الفاتحة.' : 'Loudly in audible prayers and silently in inaudible ones.'}
                    </li>
                    <li className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <strong>{language === 'ar' ? 'قراءة سورة بعد الفاتحة:' : 'Reciting a Surah after Fatihah:'}</strong> {language === 'ar' ? 'في الركعتين الأوليين من الصلوات المفروضة.' : 'In the first two units of obligatory prayers.'}
                    </li>
                    <li className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <strong>{language === 'ar' ? 'الزيادة على تسبيحة واحدة:' : 'Repeating Tasbih 3 or more times:'}</strong> {language === 'ar' ? 'تكرار «سبحان ربي العظيم» و «سبحان ربي الأعلى» ثلاثاً أو خمساً.' : 'Saying Subhana Rabbiyal Azeem and A\'la 3, 5, or more times.'}
                    </li>
                    <li className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <strong>{language === 'ar' ? 'الدعاء بعد التشهد الأخير وقبل السلام:' : 'Supplications before Tasleem:'}</strong> {language === 'ar' ? 'الاستعاذة من عذاب جهنم، وعذاب القبر، وفتنة المحيا والممات، والمسيح الدجال.' : 'Seeking protection from the 4 trials before ending the prayer.'}
                    </li>
                  </ul>
                </div>

                {/* Physical Sunnahs */}
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                    <Layers size={16} />
                    <span>{language === 'ar' ? 'السنن الفعلية (حركات وهيئات الصلاة)' : 'Physical Sunnahs (Sunan al-Af\'al)'}</span>
                  </div>
                  <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                    <li className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <strong>{language === 'ar' ? 'رفع اليدين في المواضع الأربعة:' : 'Raising hands at 4 transition points:'}</strong> {language === 'ar' ? 'عند تكبيرة الإحرام، وعند الركوع، وعند الرفع منه، وعند القيام من التشهد الأول.' : 'At Takbirat al-Ihram, going into Ruku, rising from Ruku, and after 1st Tashahhud.'}
                    </li>
                    <li className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <strong>{language === 'ar' ? 'وضع اليمين على الشمال:' : 'Placing right hand over left:'}</strong> {language === 'ar' ? 'على الصدر أو النحر أثناء القيام.' : 'Resting the right hand upon the left wrist/forearm over the chest.'}
                    </li>
                    <li className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <strong>{language === 'ar' ? 'النظر إلى موضع السجود:' : 'Gaze fixed on prostration spot:'}</strong> {language === 'ar' ? 'لزيادة الخشوع وتجنب الالتفات.' : 'Focusing the eyes upon the prayer rug / prostration point.'}
                    </li>
                    <li className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <strong>{language === 'ar' ? 'قبض الركبتين وتفريج الأصابع في الركوع:' : 'Grasping knees & leveling back in Ruku:'}</strong> {language === 'ar' ? 'ومد الظهر مستوياً بحيث لو صب عليه ماء لاستقر.' : 'Spreading fingers firmly across knees with back flat.'}
                    </li>
                    <li className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <strong>{language === 'ar' ? 'الإشارة بالسبابة في التشهد:' : 'Pointing the index finger in Tashahhud:'}</strong> {language === 'ar' ? 'وتحريكها أو الإشارة بها عند الدعاء وذكر الله توحيداً.' : 'Pointing and focusing on the right index finger as a sign of Tawhid.'}
                    </li>
                    <li className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <strong>{language === 'ar' ? 'الافتراش والتورك في الجلوس:' : 'Iftirash & Tawarruk sitting:'}</strong> {language === 'ar' ? 'الافتراش بين السجدتين والتشهد الأول، والتورك في التشهد الأخير.' : 'Iftirash between prostrations and 1st Tashahhud; Tawarruk in final Tashahhud.'}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SUJUD AS-SAHW TAB */}
          {activeTab === 'sahw' && (
            <div className="space-y-5 text-xs">
              <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/60 space-y-2">
                <div className="flex items-center gap-2 text-sky-800 dark:text-sky-300 font-bold text-sm">
                  <RotateCcw size={18} />
                  <span>{language === 'ar' ? 'دليل سجود السهو: أحكامه ومواضعه' : 'The Guide to Sujud as-Sahw (Prostration of Forgetfulness)'}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {language === 'ar'
                    ? 'سجود السهو هو سجدتان يسجدهما المصلي لجبر الخلل الحاصل في صلاته بسبب السهو (نسيان واجب، أو زيادة ركوع وسجود، أو الشك في عدد الركعات).'
                    : 'Sujud as-Sahw consists of two prostrations performed to rectify unintentional errors (omitting an obligation, an unintentional addition, or doubt in Rak\'ah count).'}
                </p>
              </div>

              {/* Flowchart Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Before Salam */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                      {language === 'ar' ? 'قبل السلام (Before Salam)' : 'Before Salam (Qabl as-Salam)'}
                    </h5>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
                    {language === 'ar' ? 'يسجد سجدتين بعد إكمال التشهد الأخير والصلاة على النبي ﷺ وقبل أن يسلّم في حالتين:' : 'Performed after the final Tashahhud and blessings, right before Salam in 2 cases:'}
                  </p>
                  <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <span><strong>{language === 'ar' ? '١. عند النقص:' : '1. Omission (Naqs):'}</strong> {language === 'ar' ? 'إذا نسي واجباً من واجبات الصلاة (كالجلوس للتشهد الأول أو تسبيح الركوع/السجود).' : 'If one omitted a mandatory obligation (like the 1st Tashahhud or transition Takbir).'}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <span><strong>{language === 'ar' ? '٢. عند الشك دون ترجيح:' : '2. Indecisive Doubt (Shakk):'}</strong> {language === 'ar' ? 'إذا شك هل صلى ثلاثاً أم أربعاً ولم يترجح عنده شيء، يبني على اليقين (وهو الأقل) ثم يسجد قبل السلام.' : 'If uncertain whether 3 or 4 units were prayed, build on the certainty of the lower number and do Sahw before Salam.'}</span>
                    </li>
                  </ul>
                </div>

                {/* After Salam */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-sky-500" />
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                      {language === 'ar' ? 'بعد السلام (After Salam)' : 'After Salam (Ba\'d as-Salam)'}
                    </h5>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
                    {language === 'ar' ? 'يسلّم من الصلاة أولاً، ثم يسجد سجدتين ويسلّم منهما في حالتين:' : 'Conclude the prayer with Salam first, then perform two prostrations and make Salam in 2 cases:'}
                  </p>
                  <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 size={14} className="text-sky-500 mt-0.5 flex-shrink-0" />
                      <span><strong>{language === 'ar' ? '١. عند الزيادة:' : '1. Addition (Ziyadah):'}</strong> {language === 'ar' ? 'إذا زاد في صلاته ركوعاً أو سجوداً أو قياماً أو قعوداً سهواً ثم انتبه أو ذُكّر.' : 'If one mistakenly added an extra bowing, prostration, standing, or sitting unit.'}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 size={14} className="text-sky-500 mt-0.5 flex-shrink-0" />
                      <span><strong>{language === 'ar' ? '٢. عند الشك مع غلبة الظن:' : '2. Doubt with Preponderance:'}</strong> {language === 'ar' ? 'إذا شك وترجح عنده أحد الأمرين، فيبني على ما ترجح ويسلّم ثم يسجد سجدتي السهو ويسلّم.' : 'If doubt arose but one strongly leans toward a count, complete on that belief, make Salam, then do Sahw.'}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* What to recite in Sujud as-Sahw */}
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h6 className="font-bold text-slate-900 dark:text-white">
                    {language === 'ar' ? 'ما يقال في سجود السهو:' : 'What to recite in Sujud as-Sahw:'}
                  </h6>
                  <p className="text-slate-600 dark:text-slate-300">
                    {language === 'ar' 
                      ? 'يقول كما في سائر السجود: «سُبْحَانَ رَبِّيَ الأَعْلَى» (ثلاثاً)، ويستحب الدعاء والتضرع.'
                      : 'Say the same tasbih as regular prostration: "Subhana Rabbiyal A\'la" (three times) and invoke supplications.'}
                  </p>
                </div>
                <span className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 flex-shrink-0">
                  <Sparkles size={20} />
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">
            {language === 'ar' ? 'مبني على الراجح من هدي السنة النبوية والمذاهب الفقهية المعتمدة' : 'Grounded in authentic Sunnah and classical jurisprudential consensus'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-primary-800 hover:bg-primary-700 text-white font-bold transition-all cursor-pointer ml-auto"
          >
            {language === 'ar' ? 'إغلاق الدليل' : 'Close Guide'}
          </button>
        </div>

      </div>
    </div>
  );
};
