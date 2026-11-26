import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Copy, 
  Check, 
  Sparkles, 
  Monitor,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { REGISTERED_APPLETS, APPLET_ID, CONNECTED_APPLET_URL } from './ConnectedAppletSection';

interface ConnectedAppletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectedAppletModal: React.FC<ConnectedAppletModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [selectedAppletId, setSelectedAppletId] = useState<string>("34a7e4b1-f8c6-4753-8ccc-eb5e65b91d1b");
  const [iframeKey, setIframeKey] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  if (!isOpen) return null;

  const activeApplet = REGISTERED_APPLETS.find((a) => a.id === selectedAppletId) || REGISTERED_APPLETS[0];
  const currentUrl = activeApplet.url;

  const handleSelectApplet = (id: string) => {
    setSelectedAppletId(id);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`bg-white dark:bg-slate-900 rounded-3xl border border-secondary-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isMaximized 
            ? 'w-full h-full rounded-none sm:rounded-2xl' 
            : 'w-full max-w-6xl h-[88vh] min-h-[580px]'
        }`}
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-950/60 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
              <Sparkles size={16} />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-sm sm:text-base text-slate-850 dark:text-slate-100 truncate">
                  {language === 'ar' ? activeApplet.nameAr : activeApplet.nameEn}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-primary-100 text-primary-800 dark:bg-primary-950 dark:text-primary-300">
                  {activeApplet.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono truncate">
                {activeApplet.id}
              </p>
            </div>
          </div>

          {/* Applet Switcher in Modal Header (if multiple) */}
          {REGISTERED_APPLETS.length > 1 && (
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-xl border border-slate-300/60 dark:border-slate-700/60 order-3 sm:order-2">
              {REGISTERED_APPLETS.map((applet) => (
                <button
                  key={applet.id}
                  onClick={() => handleSelectApplet(applet.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedAppletId === applet.id
                      ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-primary-300 shadow-xs ring-1 ring-slate-300 dark:ring-slate-600'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {applet.id.slice(0, 8)}
                </button>
              ))}
            </div>
          )}

          {/* Modal Header Controls */}
          <div className="flex items-center gap-1.5 shrink-0 order-2 sm:order-3">
            {/* Reload */}
            <button
              onClick={handleReload}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 dark:hover:bg-slate-800 dark:text-slate-400 rounded-xl transition-all cursor-pointer"
              title="Reload Applet"
            >
              <RotateCcw size={14} className={isLoading ? 'animate-spin' : ''} />
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 dark:hover:bg-slate-800 dark:text-slate-400 rounded-xl transition-all cursor-pointer"
              title="Copy URL"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </button>

            {/* Standalone New Tab */}
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-500 hover:text-primary-600 hover:bg-slate-200/60 dark:hover:bg-slate-800 dark:text-slate-400 rounded-xl transition-all cursor-pointer"
              title="Open in Standalone Tab"
            >
              <ExternalLink size={14} />
            </a>

            {/* Maximize */}
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 dark:hover:bg-slate-800 dark:text-slate-400 rounded-xl transition-all cursor-pointer hidden sm:inline-flex"
              title={isMaximized ? "Restore Size" : "Maximize"}
            >
              {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer ml-1"
              title="Close Modal"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Body / Iframe */}
        <div className="relative flex-grow w-full h-full bg-slate-950 overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-xs text-white space-y-2.5">
              <RefreshCw size={26} className="animate-spin text-primary-400" />
              <p className="text-xs font-bold tracking-wider text-slate-300 uppercase">
                {language === 'ar' ? 'جاري التحميل...' : 'Connecting to Applet...'}
              </p>
            </div>
          )}

          <iframe
            key={`${selectedAppletId}-${iframeKey}`}
            src={currentUrl}
            title={`Connected Applet - ${activeApplet.nameEn}`}
            className="w-full h-full border-0 bg-slate-950"
            onLoad={() => setIsLoading(false)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; geolocation; microphone; camera"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals allow-presentation allow-top-navigation"
          />

          {/* Quick Helper overlay */}
          <div className="absolute bottom-3 left-4 right-4 sm:left-auto sm:right-4 z-10 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-md flex items-center justify-between gap-3 text-slate-300 text-[11px] pointer-events-auto">
            <div className="flex items-center gap-1.5 truncate">
              <Monitor size={12} className="text-emerald-400 shrink-0" />
              <span className="truncate">
                {language === 'ar'
                  ? 'إذا لزم تسجيل الدخول، افتح في نافذة جديدة'
                  : 'If sign-in is required by your browser, open standalone.'}
              </span>
            </div>
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 font-bold underline flex items-center gap-1 shrink-0"
            >
              <span>{language === 'ar' ? 'فتح في نافذة جديدة' : 'Open in New Tab'}</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
