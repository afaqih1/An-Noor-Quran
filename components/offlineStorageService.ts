/**
 * Offline Storage Service
 * Provides IndexedDB and localStorage persistent caching for Quran texts, translations,
 * Duas, and Azkar so they remain accessible seamlessly when offline.
 */

const DB_NAME = 'FridayQuranOfflineDB';
const DB_VERSION = 1;
const QURAN_STORE = 'quran_texts';
const DUA_STORE = 'duas_and_azkar';

// Frequently accessed Friday & Sunnah Surahs
export const ESSENTIAL_FRIDAY_SURAHS = [
  { number: 1, name: 'Al-Fatiha', arabic: 'الفاتحة', reason: 'Core prayer opening' },
  { number: 18, name: 'Al-Kahf', arabic: 'الكهف', reason: 'Friday sunnah protection' },
  { number: 32, name: 'As-Sajdah', arabic: 'السجدة', reason: 'Friday Fajr sunnah' },
  { number: 36, name: 'Yasin', arabic: 'يس', reason: 'Heart of the Quran' },
  { number: 44, name: 'Ad-Dukhan', arabic: 'الدخان', reason: 'Thursday night recitation' },
  { number: 55, name: 'Ar-Rahman', arabic: 'الرحمن', reason: 'Beauty of the Quran' },
  { number: 56, name: 'Al-Waqi\'ah', arabic: 'الواقعة', reason: 'Nightly protection' },
  { number: 62, name: 'Al-Jumu\'ah', arabic: 'الجمعة', reason: 'Friday congregation prayer' },
  { number: 63, name: 'Al-Munafiqun', arabic: 'المنافقون', reason: 'Friday prayer sunnah' },
  { number: 67, name: 'Al-Mulk', arabic: 'الملك', reason: 'Nightly grave salvation' },
  { number: 76, name: 'Al-Insan', arabic: 'الإنسان', reason: 'Friday Fajr sunnah' },
  { number: 87, name: 'Al-A\'la', arabic: 'الأعلى', reason: 'Jumu\'ah prayer sunnah' },
  { number: 88, name: 'Al-Ghashiyah', arabic: 'الغاشية', reason: 'Jumu\'ah prayer sunnah' },
  { number: 112, name: 'Al-Ikhlas', arabic: 'الإخلاص', reason: 'One third of Quran' },
  { number: 113, name: 'Al-Falaq', arabic: 'الفلق', reason: 'Morning & evening refuge' },
  { number: 114, name: 'An-Nas', arabic: 'الناس', reason: 'Morning & evening refuge' },
];

class OfflineStorageEngine {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private isIndexedDBAvailable = typeof window !== 'undefined' && 'indexedDB' in window;

  constructor() {
    if (this.isIndexedDBAvailable) {
      this.initDB();
    }
  }

  private initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(QURAN_STORE)) {
            db.createObjectStore(QURAN_STORE, { keyPath: 'key' });
          }
          if (!db.objectStoreNames.contains(DUA_STORE)) {
            db.createObjectStore(DUA_STORE, { keyPath: 'key' });
          }
        };

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = (err) => {
          console.warn('IndexedDB initialization failed, using localStorage fallback:', err);
          this.isIndexedDBAvailable = false;
          reject(err);
        };
      } catch (e) {
        this.isIndexedDBAvailable = false;
        reject(e);
      }
    });

    return this.dbPromise;
  }

  // --- Quran Data Operations ---

  async getQuranData(key: string): Promise<any[] | null> {
    // 1. Try IndexedDB
    if (this.isIndexedDBAvailable) {
      try {
        const db = await this.initDB();
        return new Promise((resolve) => {
          const transaction = db.transaction([QURAN_STORE], 'readonly');
          const store = transaction.objectStore(QURAN_STORE);
          const request = store.get(key);

          request.onsuccess = () => {
            if (request.result && request.result.data) {
              resolve(request.result.data);
            } else {
              // Try localStorage fallback if not found in IDB
              resolve(this.getFromLocalStorage(`quran_cache_${key}`));
            }
          };

          request.onerror = () => {
            resolve(this.getFromLocalStorage(`quran_cache_${key}`));
          };
        });
      } catch {
        return this.getFromLocalStorage(`quran_cache_${key}`);
      }
    }

    // 2. LocalStorage fallback
    return this.getFromLocalStorage(`quran_cache_${key}`);
  }

  async setQuranData(key: string, data: any[], metadata?: { surah?: number; juz?: number; translation?: string }): Promise<void> {
    const payload = {
      key,
      data,
      metadata: metadata || {},
      timestamp: Date.now()
    };

    // 1. Save to IndexedDB
    if (this.isIndexedDBAvailable) {
      try {
        const db = await this.initDB();
        await new Promise<void>((resolve, reject) => {
          const transaction = db.transaction([QURAN_STORE], 'readwrite');
          const store = transaction.objectStore(QURAN_STORE);
          const request = store.put(payload);

          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      } catch (e) {
        console.warn('Failed to save to IndexedDB, attempting localStorage:', e);
      }
    }

    // 2. Also keep in localStorage for immediate sync & redundancy
    this.saveToLocalStorage(`quran_cache_${key}`, data);
    this.recordCachedKey(key, metadata);
  }

  // --- Dua & Azkar Operations ---

  async getDuaData(key: string): Promise<any | null> {
    if (this.isIndexedDBAvailable) {
      try {
        const db = await this.initDB();
        return new Promise((resolve) => {
          const transaction = db.transaction([DUA_STORE], 'readonly');
          const store = transaction.objectStore(DUA_STORE);
          const request = store.get(key);

          request.onsuccess = () => {
            if (request.result && request.result.data) {
              resolve(request.result.data);
            } else {
              resolve(this.getFromLocalStorage(`dua_cache_${key}`));
            }
          };

          request.onerror = () => {
            resolve(this.getFromLocalStorage(`dua_cache_${key}`));
          };
        });
      } catch {
        return this.getFromLocalStorage(`dua_cache_${key}`);
      }
    }
    return this.getFromLocalStorage(`dua_cache_${key}`);
  }

  async setDuaData(key: string, data: any): Promise<void> {
    const payload = {
      key,
      data,
      timestamp: Date.now()
    };

    if (this.isIndexedDBAvailable) {
      try {
        const db = await this.initDB();
        await new Promise<void>((resolve, reject) => {
          const transaction = db.transaction([DUA_STORE], 'readwrite');
          const store = transaction.objectStore(DUA_STORE);
          const request = store.put(payload);

          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      } catch (e) {
        console.warn('Failed to save Dua to IndexedDB:', e);
      }
    }
    this.saveToLocalStorage(`dua_cache_${key}`, data);
  }

  // --- LocalStorage Helpers ---

  private getFromLocalStorage(key: string): any | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  private saveToLocalStorage(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      // If quota exceeded, clean up old non-critical caches
      console.warn('LocalStorage save failed (possible quota limit):', e);
    }
  }

  private recordCachedKey(key: string, metadata?: { surah?: number; juz?: number; translation?: string }): void {
    try {
      const metaKey = 'offline-cached-quran-keys';
      const stored = localStorage.getItem(metaKey);
      const list: Array<{ key: string; surah?: number; juz?: number; translation?: string; timestamp: number }> = stored ? JSON.parse(stored) : [];
      
      const filtered = list.filter(item => item.key !== key);
      filtered.push({
        key,
        surah: metadata?.surah,
        juz: metadata?.juz,
        translation: metadata?.translation,
        timestamp: Date.now()
      });

      localStorage.setItem(metaKey, JSON.stringify(filtered));
      window.dispatchEvent(new CustomEvent('offline-cache-updated'));
    } catch (e) {
      console.error(e);
    }
  }

  // --- Management & Diagnostics ---

  async getCachedSurahsList(): Promise<number[]> {
    try {
      const metaKey = 'offline-cached-quran-keys';
      const stored = localStorage.getItem(metaKey);
      if (!stored) return [];
      const list: Array<{ key: string; surah?: number }> = JSON.parse(stored);
      const surahNums = list.filter(item => item.surah !== undefined).map(item => item.surah as number);
      return Array.from(new Set(surahNums));
    } catch {
      return [];
    }
  }

  async isSurahCached(surahNumber: number, translation: string = 'en.sahih'): Promise<boolean> {
    const key = `surah_${surahNumber}_${translation}`;
    const data = await this.getQuranData(key);
    return data !== null && Array.isArray(data) && data.length > 0;
  }

  async getStorageStats(): Promise<{
    cachedSurahsCount: number;
    cachedJuzsCount: number;
    cachedSurahNumbers: number[];
    isOfflineReady: boolean;
    estimatedSizeKB: number;
  }> {
    const cachedSurahNumbers = await this.getCachedSurahsList();
    let totalChars = 0;

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('quran_cache_') || k.startsWith('dua_cache_'))) {
          const val = localStorage.getItem(k);
          if (val) totalChars += val.length + k.length;
        }
      }
    } catch (e) {
      console.error(e);
    }

    const estimatedSizeKB = Math.round((totalChars * 2) / 1024);

    return {
      cachedSurahsCount: cachedSurahNumbers.length,
      cachedJuzsCount: 0,
      cachedSurahNumbers,
      isOfflineReady: cachedSurahNumbers.length >= 5,
      estimatedSizeKB: estimatedSizeKB > 0 ? estimatedSizeKB : cachedSurahNumbers.length * 15
    };
  }

  async deleteCachedSurah(surahNumber: number): Promise<void> {
    const metaKey = 'offline-cached-quran-keys';
    try {
      const stored = localStorage.getItem(metaKey);
      if (stored) {
        const list: Array<{ key: string; surah?: number }> = JSON.parse(stored);
        const keysToDelete = list.filter(i => i.surah === surahNumber).map(i => i.key);
        const remaining = list.filter(i => i.surah !== surahNumber);
        localStorage.setItem(metaKey, JSON.stringify(remaining));

        for (const k of keysToDelete) {
          localStorage.removeItem(`quran_cache_${k}`);
          if (this.isIndexedDBAvailable) {
            try {
              const db = await this.initDB();
              const transaction = db.transaction([QURAN_STORE], 'readwrite');
              transaction.objectStore(QURAN_STORE).delete(k);
            } catch (e) { console.error(e); }
          }
        }
      }
      window.dispatchEvent(new CustomEvent('offline-cache-updated'));
    } catch (e) {
      console.error(e);
    }
  }

  async clearAllOfflineCache(): Promise<void> {
    try {
      // Clear localStorage items
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('quran_cache_') || k.startsWith('dua_cache_') || k === 'offline-cached-quran-keys')) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));

      // Clear IndexedDB stores
      if (this.isIndexedDBAvailable) {
        const db = await this.initDB();
        const transaction = db.transaction([QURAN_STORE, DUA_STORE], 'readwrite');
        transaction.objectStore(QURAN_STORE).clear();
        transaction.objectStore(DUA_STORE).clear();
      }

      window.dispatchEvent(new CustomEvent('offline-cache-updated'));
    } catch (e) {
      console.error(e);
    }
  }

  // --- Network Caching Download Functions ---

  async downloadAndCacheSurah(surahNumber: number, translation: string = 'en.sahih'): Promise<boolean> {
    try {
      const endpoint = 'surah';
      const cacheKey = `${endpoint}_${surahNumber}_${translation}`;

      const arabicUrl = `https://api.alquran.cloud/v1/${endpoint}/${surahNumber}/ar.alafasy`;
      const translationUrl = `https://api.alquran.cloud/v1/${endpoint}/${surahNumber}/${translation}`;

      const [arabicRes, translationRes] = await Promise.all([
        fetch(arabicUrl),
        fetch(translationUrl)
      ]);

      if (!arabicRes.ok || !translationRes.ok) {
        return false;
      }

      const arabicData = await arabicRes.json();
      const translationData = await translationRes.json();

      const cleanAyahText = (text: string, sNum: number, aNum: number): string => {
        if (aNum === 1 && sNum !== 1 && sNum !== 9) {
          const basmala1 = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
          const basmala2 = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
          if (text.startsWith(basmala1)) return text.substring(basmala1.length).trim();
          if (text.startsWith(basmala2)) return text.substring(basmala2.length).trim();
        }
        return text;
      };

      const rawAyahs = arabicData.data.ayahs;
      const combined = rawAyahs.map((ayah: any, idx: number) => {
        const transAyah = translationData.data.ayahs[idx];
        const surahInfo = {
          number: arabicData.data.number,
          name: arabicData.data.name,
          englishName: arabicData.data.englishName,
          englishNameTranslation: arabicData.data.englishNameTranslation,
          revelationType: arabicData.data.revelationType,
          numberOfAyahs: arabicData.data.numberOfAyahs
        };

        return {
          ...ayah,
          surah: surahInfo,
          text: cleanAyahText(ayah.text, surahInfo.number, ayah.numberInSurah),
          translationText: transAyah ? transAyah.text : ''
        };
      });

      await this.setQuranData(cacheKey, combined, { surah: surahNumber, translation });
      return true;
    } catch (err) {
      console.warn(`Failed to download and cache Surah ${surahNumber}:`, err);
      return false;
    }
  }

  async downloadEssentialFridaySurahs(
    translation: string = 'en.sahih',
    onProgress?: (completed: number, total: number, currentName: string) => void
  ): Promise<void> {
    const total = ESSENTIAL_FRIDAY_SURAHS.length;
    let completed = 0;

    for (const surah of ESSENTIAL_FRIDAY_SURAHS) {
      if (onProgress) {
        onProgress(completed, total, surah.name);
      }
      await this.downloadAndCacheSurah(surah.number, translation);
      completed++;
      if (onProgress) {
        onProgress(completed, total, surah.name);
      }
    }
  }

  // Pre-fetch essential Friday Surahs silently in background on first load
  async autoPrecacheEssentialSurahsSilently(translation: string = 'en.sahih'): Promise<void> {
    // Only run if online
    if (typeof navigator !== 'undefined' && !navigator.onLine) return;

    try {
      const cached = await this.getCachedSurahsList();
      // Target key Friday surahs: Fatiha (1), Kahf (18), Sajdah (32), Mulk (67), Jumu'ah (62), 3 Quls (112, 113, 114)
      const topPriorities = [1, 18, 32, 62, 67, 112, 113, 114];
      for (const surahNum of topPriorities) {
        if (!cached.includes(surahNum)) {
          await this.downloadAndCacheSurah(surahNum, translation);
          // Wait 200ms between background fetches to avoid choking the thread
          await new Promise(r => setTimeout(r, 200));
        }
      }
    } catch (e) {
      console.warn('Silent pre-caching non-fatal notice:', e);
    }
  }
}

export const offlineStorage = new OfflineStorageEngine();
