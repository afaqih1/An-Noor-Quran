import React, { useEffect, useState } from 'react';

export const ScrollProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      
      // 1. If it's a document/window scroll
      if (e.target === document || e.target === window) {
        // If a modal is open, ignore window scroll events to avoid jitter or stale values
        if (document.body.style.overflow === 'hidden') {
          return;
        }
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        setProgress(pct);
        setIsVisible(scrollTop > 10);
        return;
      }

      // 2. If it's an element scroll inside our modals (like QuranModal or AzkarModal)
      if (target && target.classList && target.classList.contains('overflow-y-auto')) {
        const scrollTop = target.scrollTop;
        const scrollHeight = target.scrollHeight - target.clientHeight;
        const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        setProgress(pct);
        setIsVisible(scrollTop > 5);
      }
    };

    // Capture-phase listener to catch scroll events on any element in the DOM tree
    window.addEventListener('scroll', handleScroll, true);

    const handleResize = () => {
      if (document.body.style.overflow !== 'hidden') {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        setProgress(pct);
      }
    };
    window.addEventListener('resize', handleResize);

    // Sync scroll when user clicks (e.g., switches tabs, clicks buttons)
    const handleClick = () => {
      setTimeout(() => {
        const modalOpen = document.body.style.overflow === 'hidden';
        if (modalOpen) {
          const modalScroll = document.querySelector('.overflow-y-auto');
          if (modalScroll) {
            const scrollTop = modalScroll.scrollTop;
            const scrollHeight = modalScroll.scrollHeight - modalScroll.clientHeight;
            const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            setProgress(pct);
            setIsVisible(scrollTop > 5);
          }
        }
      }, 50);
    };
    window.addEventListener('click', handleClick, true);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick, true);
    };
  }, []);

  // Sync scroll progress immediately when a modal opens/closes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const modalOpen = document.body.style.overflow === 'hidden';
      if (modalOpen) {
        // Find the open modal scroll container
        const modalScroll = document.querySelector('.overflow-y-auto');
        if (modalScroll) {
          const scrollTop = modalScroll.scrollTop;
          const scrollHeight = modalScroll.scrollHeight - modalScroll.clientHeight;
          const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
          setProgress(pct);
          setIsVisible(scrollTop > 5);
        } else {
          setProgress(0);
          setIsVisible(false);
        }
      } else {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        setProgress(pct);
        setIsVisible(scrollTop > 10);
      }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-1 bg-slate-100/10 backdrop-blur-[0.5px] z-[9999] transition-all duration-300 pointer-events-none"
      style={{ 
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-2px)'
      }}
    >
      <div 
        className="h-full bg-gradient-to-r from-secondary-400 via-primary-600 to-secondary-500 transition-all duration-150 ease-out shadow-[0_1px_8px_rgba(16,185,129,0.3)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ScrollProgressBar;
