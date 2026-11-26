import React from 'react';
import { BookOpen } from 'lucide-react';
import { useLanguage } from './LanguageContext';

const Hero: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="relative bg-primary-900/90 backdrop-blur-sm text-white overflow-hidden shadow-lg border-b border-secondary-400/30">
      <div className="absolute inset-0 opacity-10">
         {/* Decorative pattern placeholder */}
         <svg className="h-full w-full" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
           <path d="M0 100 L50 0 L100 100" fill="currentColor" />
         </svg>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-primary-800 rounded-full bg-opacity-50 backdrop-blur-sm ring-1 ring-secondary-400/50 shadow-xl">
            <BookOpen size={48} className="text-secondary-300" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-secondary-50 drop-shadow-sm font-serif">
          {t('hero.title')}
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-primary-100">
          {t('hero.desc')}
        </p>
      </div>
    </div>
  );
};

export default Hero;