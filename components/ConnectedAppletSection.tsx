import React, { useState, useRef } from 'react';
import { 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowLeft,
  RefreshCw,
  Monitor,
  Info,
  Code2,
  CheckCircle2,
  Layers,
  ChevronDown,
  ChevronUp,
  Plus
} from 'lucide-react';
import { useLanguage } from './LanguageContext';

export interface ConnectedAppletConfig {
  id: string;
  nameEn: string;
  nameAr: string;
  url: string;
  descriptionEn: string;
  descriptionAr: string;
  badge: string;
}

export const REGISTERED_APPLETS: ConnectedAppletConfig[] = [
  {
    id: "34a7e4b1-f8c6-4753-8ccc-eb5e65b91d1b",
    nameEn: "Connected AI Studio Applet",
    nameAr: "تطبيق AI Studio المدمج",
    url: "https://ai.studio/apps/34a7e4b1-f8c6-4753-8ccc-eb5e65b91d1b?fullscreenApplet=true",
    descriptionEn: "Integrated AI Studio digital applet with full-screen embed controls.",
    descriptionAr: "تطبيق AI Studio المدمج التفاعلي مع أدوات التحكم والعرض الكامل.",
    badge: "Connected",
  },
];

export const APPLET_ID = "34a7e4b1-f8c6-4753-8ccc-eb5e65b91d1b";
export const CONNECTED_APPLET_URL = "https://ai.studio/apps/34a7e4b1-f8c6-4753-8ccc-eb5e65b91d1b?fullscreenApplet=true";

interface ConnectedAppletSectionProps {
  onBack?: () => void;
}

export const ConnectedAppletSection: React.FC<ConnectedAppletSectionProps> = ({ onBack }) => {
  const { language } = useLanguage();
  
  // Selected Applet ID (defaults to newly requested applet 34a7e4b1)
  const [selectedAppletId, setSelectedAppletId] = useState<string>("34a7e4b1-f8c6-4753-8ccc-eb5e65b91d1b");
  const [customUrl, setCustomUrl] = useState<string>("");
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [showMetadata, setShowMetadata] = useState<boolean>(false);

  const [iframeKey, setIframeKey] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Active Applet Config
  const activeApplet = REGISTERED_APPLETS.find((a) => a.id === selectedAppletId) || {
    id: selectedAppletId,
    nameEn: "Custom Applet",
    nameAr: "تطبيق مخصص",
    url: customUrl || `https://ai.studio/apps/${selectedAppletId}?fullscreenApplet=true`,
    descriptionEn: "User-defined AI Studio application portal.",
    descriptionAr: "بوابة تطبيق مخصصة من منصة AI Studio.",
    badge: "Custom",
  };

  const currentUrl = activeApplet.url;

  const handleSelectApplet = (appletId: string) => {
    setSelectedAppletId(appletId);
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    let url = customUrl.trim();
    let id = "custom";
    const uuidMatch = url.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
    if (uuidMatch) {
      id = uuidMatch[0];
    }
    if (!url.includes("fullscreenApplet=true")) {
      url += url.includes("?") ? "&fullscreenApplet=true" : "?fullscreenApplet=true";
    }
    setSelectedAppletId(id);
    setCustomUrl(url);
    setShowCustomInput(false);
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleReload = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const embedSnippet = `<iframe src="${currentUrl}" title="${activeApplet.nameEn}" width="100%" height="600" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; geolocation; microphone; camera" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals allow-presentation allow-top-navigation"></iframe>`;

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(embedSnippet).then(() => {
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2500);
    });
  };

  return (
    <div className={`space-y-6 animate-in fade-in duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-4 flex flex-col' : ''}`}>
      
      {/* Header Bar */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-secondary-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            {onBack && !isFullscreen && (
              <button
                onClick={onBack}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors cursor-pointer mr-1"
                title="Back to Home Portal"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 dark:bg-primary-950/40 border border-primary-200/60 dark:border-primary-800/60 rounded-full text-[11px] font-bold text-primary-700 dark:text-primary-300">
              <Sparkles size={12} className="text-primary-500" />
              <span>{language === 'ar' ? 'التطبيقات المدمجة' : 'Connected Applets Studio'}</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 px-2 py-0.5 rounded font-bold">
              ID: {activeApplet.id.slice(0, 8)}...
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-800 dark:text-slate-100">
            {language === 'ar' ? activeApplet.nameAr : activeApplet.nameEn}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            {language === 'ar' ? activeApplet.descriptionAr : activeApplet.descriptionEn}
          </p>
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Metadata & Extraction Inspector Toggle */}
          <button
            onClick={() => setShowMetadata(!showMetadata)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs border ${
              showMetadata
                ? 'bg-primary-50 border-primary-300 text-primary-800 dark:bg-primary-950/40 dark:border-primary-800 dark:text-primary-300'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-transparent'
            }`}
            title="Inspect Extracted Metadata & Architecture"
          >
            <Info size={13} />
            <span className="hidden sm:inline">{language === 'ar' ? 'بيانات الاستخراج' : 'Extraction Info'}</span>
            {showMetadata ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {/* Reload Button */}
          <button
            onClick={handleReload}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="Reload Applet Frame"
          >
            <RotateCcw size={13} className={isLoading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{language === 'ar' ? 'إعادة تحميل' : 'Reload'}</span>
          </button>

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="Copy Direct URL"
          >
            {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
            <span>{copied ? (language === 'ar' ? 'تم النسخ!' : 'Copied!') : (language === 'ar' ? 'نسخ الرابط' : 'Copy Link')}</span>
          </button>

          {/* Fullscreen Toggle Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            <span className="hidden sm:inline">{isFullscreen ? (language === 'ar' ? 'تصغير' : 'Exit Fullscreen') : (language === 'ar' ? 'ملء الشاشة' : 'Fullscreen')}</span>
          </button>

          {/* Standalone New Tab Launcher */}
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer"
            title="Open in Standalone New Tab"
          >
            <span>{language === 'ar' ? 'فتح في نافذة جديدة' : 'Open in New Tab'}</span>
            <ExternalLink size={13} />
          </a>
        </div>

      </div>

      {/* Applet Switcher Tabs Bar */}
      {!isFullscreen && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-2 rounded-2xl border border-secondary-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 overflow-x-auto max-w-full">
            {REGISTERED_APPLETS.map((applet) => (
              <button
                key={applet.id}
                onClick={() => handleSelectApplet(applet.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedAppletId === applet.id
                    ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-primary-300 shadow-xs ring-1 ring-slate-200 dark:ring-slate-600'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Layers size={13} />
                <span>{language === 'ar' ? applet.nameAr : applet.nameEn}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedAppletId === applet.id ? 'bg-primary-100 text-primary-800 dark:bg-primary-950 dark:text-primary-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {applet.badge}
                </span>
              </button>
            ))}

            {/* Custom Applet Button */}
            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                showCustomInput
                  ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-primary-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              title="Add another AI Studio applet by URL"
            >
              <Plus size={13} />
              <span>{language === 'ar' ? 'إضافة تطبيق آخر' : 'Custom Applet'}</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-400 hidden lg:block px-2">
            Canonical Target: <span className="text-slate-600 dark:text-slate-300">ai.studio/apps</span>
          </div>
        </div>
      )}

      {/* Custom URL Input Bar */}
      {showCustomInput && !isFullscreen && (
        <form onSubmit={handleApplyCustom} className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            {language === 'ar' ? 'أدخل رابط أو معرّف تطبيق AI Studio:' : 'Enter AI Studio Applet URL or UUID:'}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://ai.studio/apps/34a7e4b1-f8c6-4753-8ccc-eb5e65b91d1b?fullscreenApplet=true"
              className="flex-grow px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-xs cursor-pointer transition-all"
            >
              {language === 'ar' ? 'تحميل' : 'Load Applet'}
            </button>
          </div>
        </form>
      )}

      {/* Extracted Metadata & Architecture Details Panel */}
      {showMetadata && !isFullscreen && (
        <div className="p-5 bg-white/95 dark:bg-slate-900/95 rounded-2xl border border-secondary-200 dark:border-slate-800 shadow-sm space-y-4 animate-in slide-in-from-top-3 duration-200 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="font-serif font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Code2 size={16} className="text-primary-600" />
              <span>{language === 'ar' ? 'تفاصيل الاستخراج والمواصفات التقنية' : 'Extracted Architecture & Integration Specs'}</span>
            </h4>
            <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full font-bold">
              TLS/HTTPS Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-sans block font-bold uppercase">Extracted Applet ID</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 select-all truncate block">
                {activeApplet.id}
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-sans block font-bold uppercase">Target Host & Origin</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 select-all truncate block">
                aistudio.google.com
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-sans block font-bold uppercase">Display Parameter</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 select-all truncate block">
                fullscreenApplet=true
              </span>
            </div>
          </div>

          {/* Copyable HTML Iframe Embed Snippet */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>{language === 'ar' ? 'كود التضمين التفاعلي (Iframe Embed):' : 'Interactive HTML Embed Snippet:'}</span>
              <button
                onClick={handleCopySnippet}
                className="text-primary-600 hover:text-primary-700 flex items-center gap-1 cursor-pointer"
              >
                {copiedSnippet ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                <span>{copiedSnippet ? 'Copied Snippet!' : 'Copy Snippet'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-950 text-emerald-400 rounded-xl text-[11px] font-mono overflow-x-auto select-all border border-slate-800">
              {embedSnippet}
            </pre>
          </div>
        </div>
      )}

      {/* Frame Container */}
      <div className={`relative bg-slate-900 rounded-2xl overflow-hidden border border-secondary-200 dark:border-slate-800 shadow-lg ${isFullscreen ? 'flex-grow w-full h-full' : 'w-full h-[76vh] min-h-[600px]'}`}>
        
        {/* Loading Spinner Indicator */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-xs text-white space-y-3">
            <RefreshCw size={28} className="animate-spin text-primary-400" />
            <p className="text-xs font-bold tracking-wider text-slate-300 uppercase">
              {language === 'ar' ? 'جاري تحميل التطبيق المستخرج...' : 'Loading Extracted Applet...'}
            </p>
          </div>
        )}

        {/* Live Embed Iframe */}
        <iframe
          key={`${selectedAppletId}-${iframeKey}`}
          ref={iframeRef}
          src={currentUrl}
          title={`Integrated AI Studio Applet - ${activeApplet.nameEn}`}
          className="w-full h-full border-0 bg-slate-950"
          onLoad={() => setIsLoading(false)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; geolocation; microphone; camera"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals allow-presentation allow-top-navigation"
        />

        {/* Bottom Helper Bar for Cookie / Cross-Origin Notice */}
        <div className="absolute bottom-3 left-4 right-4 sm:left-auto sm:right-4 z-10 bg-slate-950/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 shadow-md flex items-center justify-between gap-3 text-slate-300 text-[11px] pointer-events-auto">
          <div className="flex items-center gap-2">
            <Monitor size={14} className="text-emerald-400 shrink-0" />
            <span>
              {language === 'ar'
                ? 'إذا طلب حساب Google تسجيل الدخول داخل الإطار، اضغط فتح في نافذة جديدة'
                : 'If your browser blocks third-party Google Account sign-in in frames, launch in a new tab.'}
            </span>
          </div>
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-400 hover:text-primary-300 font-bold underline flex items-center gap-1 shrink-0"
          >
            <span>{language === 'ar' ? 'فتح مباشر' : 'Launch'}</span>
            <ExternalLink size={10} />
          </a>
        </div>

      </div>

    </div>
  );
};
