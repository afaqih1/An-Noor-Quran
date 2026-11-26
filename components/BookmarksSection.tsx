import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2, BookOpen, AlertCircle, Sparkles, Search, Calendar, ChevronRight } from 'lucide-react';
import QuranModal from './QuranModal';

interface BookmarkItem {
  id: string; // e.g. "18_10" for Chapter 18 Verse 10
  chapterNumber: number;
  surahName: string;
  verseNumber: number;
  verseText: string;
  timestamp: number;
}

export const BookmarksSection: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readingSurah, setReadingSurah] = useState<{chapter: number, name: string} | null>(null);

  // Load bookmarks on mount
  useEffect(() => {
    const loadBookmarks = () => {
      try {
        const stored = localStorage.getItem('quran-bookmarks');
        if (stored) {
          setBookmarks(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load bookmarks', e);
      }
    };
    
    loadBookmarks();
    
    // Listen for custom storage events to keep bookmarks in sync
    const handleStorageChange = () => {
      loadBookmarks();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('bookmarks-updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bookmarks-updated', handleStorageChange);
    };
  }, []);

  const handleRemoveBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = bookmarks.filter(b => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem('quran-bookmarks', JSON.stringify(updated));
    // Trigger update event for other components (like QuranModal if open)
    window.dispatchEvent(new Event('bookmarks-updated'));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all bookmarks? This action cannot be undone.')) {
      setBookmarks([]);
      localStorage.setItem('quran-bookmarks', JSON.stringify([]));
      window.dispatchEvent(new Event('bookmarks-updated'));
    }
  };

  const filteredBookmarks = bookmarks.filter(b => {
    const query = searchQuery.toLowerCase();
    return (
      b.surahName.toLowerCase().includes(query) ||
      b.verseText.includes(query) ||
      b.verseNumber.toString().includes(query) ||
      b.chapterNumber.toString().includes(query)
    );
  });

  const openReader = (chapter: number, name: string) => {
    setReadingSurah({ chapter, name });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Introduction */}
      <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-secondary-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold font-serif text-slate-800 flex items-center gap-2.5">
              <Bookmark className="text-secondary-500 fill-current w-8 h-8" />
              <span>My Saved Ayats</span>
            </h2>
            <p className="text-slate-600 mt-2 leading-relaxed">
              Your personalized collection of bookmarked verses. Click on any verse card to read it in full context inside the Quranic text container.
            </p>
          </div>
          {bookmarks.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-xl transition-all flex items-center gap-1.5 self-start sm:self-center cursor-pointer select-none"
            >
              <Trash2 size={13} />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Search & Stats Bar */}
        {bookmarks.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Search size={15} />
              </span>
              <input
                type="text"
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 placeholder:text-slate-400 text-slate-700"
              />
            </div>
            <div className="text-xs font-medium text-slate-500 font-mono self-end sm:self-center">
              Showing {filteredBookmarks.length} of {bookmarks.length} saved {bookmarks.length === 1 ? 'ayat' : 'ayats'}
            </div>
          </div>
        )}
      </div>

      {/* Bookmarks Grid / List */}
      {filteredBookmarks.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {filteredBookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              onClick={() => openReader(bookmark.chapterNumber, bookmark.surahName)}
              className="bg-white/95 hover:bg-white border border-secondary-200 hover:border-primary-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 group"
            >
              <div className="space-y-3">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-lg border border-primary-100 font-serif">
                      {bookmark.surahName}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
                      Ch. {bookmark.chapterNumber} : Ayah {bookmark.verseNumber}
                    </span>
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    onClick={(e) => handleRemoveBookmark(bookmark.id, e)}
                    className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-100 transition-colors cursor-pointer select-none"
                    title="Remove Bookmark"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Verse Text (Arabic) */}
                <div className="py-2 text-right font-arabic text-xl sm:text-2xl leading-loose text-slate-900 group-hover:text-primary-950 transition-colors" dir="rtl">
                  {bookmark.verseText}
                  {/* Verse Marker */}
                  <span className="inline-flex items-center justify-center w-7 h-7 mx-1.5 align-middle select-none relative">
                    <svg viewBox="0 0 36 36" className="absolute inset-0 w-full h-full text-secondary-400 fill-transparent stroke-current stroke-1">
                      <circle cx="18" cy="18" r="17" />
                    </svg>
                    <span className="relative text-[9px] font-sans font-bold text-secondary-800 pt-[1px]">
                      {bookmark.verseNumber}
                    </span>
                  </span>
                </div>
              </div>

              {/* Action row */}
              <div className="flex items-center justify-between pt-3.5 border-t border-slate-50 mt-1">
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 font-mono">
                  <Calendar size={11} />
                  <span>Saved {new Date(bookmark.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </span>
                <span className="text-xs font-bold text-slate-500 group-hover:text-primary-700 transition-colors flex items-center gap-0.5 font-sans">
                  <span>Open Reader</span>
                  <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/95 backdrop-blur-sm border-2 border-dashed border-slate-200 rounded-3xl py-12 px-6 text-center shadow-sm">
          <div className="w-16 h-16 bg-secondary-50 text-secondary-500 rounded-2xl flex items-center justify-center border border-secondary-200 shadow-sm mx-auto mb-4">
            <Bookmark className="w-8 h-8 fill-current" />
          </div>
          
          <h3 className="text-lg font-bold text-slate-800 font-serif">
            {searchQuery ? 'No matching bookmarks found' : 'No saved Ayats yet'}
          </h3>
          
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
            {searchQuery 
              ? 'Try modifying your search text, Surah name, or verse number.'
              : 'Add your favorite Quran verses here to track your progress or remember specific reminders for recitation.'}
          </p>

          {!searchQuery && (
            <div className="mt-6 inline-flex flex-col items-center gap-3 bg-primary-50/50 p-4 rounded-2xl border border-primary-100 max-w-sm mx-auto text-left">
              <span className="text-xs font-bold text-primary-800 uppercase tracking-widest flex items-center gap-1">
                <Sparkles size={12} className="text-secondary-500 fill-current" />
                <span>How to Bookmark:</span>
              </span>
              <ol className="text-xs text-slate-600 list-decimal pl-4 space-y-1.5 leading-relaxed">
                <li>Go to <strong className="text-primary-700">Surah Al-Kahf</strong> or <strong className="text-primary-700">All Recommended</strong>.</li>
                <li>Click on the <strong className="text-slate-800">"Read"</strong> button to open the Quran reader.</li>
                <li>Simply <strong className="text-slate-800">click on any verse (Ayah)</strong> to toggle saving it to your bookmarks list!</li>
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Embedded QuranModal to open directly from bookmarks */}
      {readingSurah && (
        <QuranModal
          isOpen={!!readingSurah}
          onClose={() => setReadingSurah(null)}
          chapterNumber={readingSurah.chapter}
          surahName={readingSurah.name}
        />
      )}
    </div>
  );
};

export default BookmarksSection;
