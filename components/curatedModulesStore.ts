import { QURAN_STUDY_MODULES, QuranModule } from './quranStudyModulesData';

const LOCAL_STORAGE_KEY = 'quran_curated_modules_custom_v1';

type Listener = (modules: QuranModule[]) => void;
const listeners: Set<Listener> = new Set();

export function getCustomModulesFromStorage(): QuranModule[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to parse custom modules from localStorage', err);
    return [];
  }
}

export function getCuratedModules(): QuranModule[] {
  const custom = getCustomModulesFromStorage();
  if (custom.length === 0) {
    return QURAN_STUDY_MODULES;
  }

  // Merge default modules with custom overrides
  const map = new Map<string, QuranModule>();
  for (const m of QURAN_STUDY_MODULES) {
    map.set(m.id, m);
  }
  for (const c of custom) {
    map.set(c.id, c);
  }

  return Array.from(map.values()).sort((a, b) => (a.orderIndex || 99) - (b.orderIndex || 99));
}

function notifyListeners() {
  const current = getCuratedModules();
  listeners.forEach((listener) => listener(current));
}

export function saveCuratedModule(module: QuranModule): void {
  const existingCustom = getCustomModulesFromStorage();
  const index = existingCustom.findIndex((m) => m.id === module.id);

  if (index >= 0) {
    existingCustom[index] = module;
  } else {
    existingCustom.push(module);
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existingCustom));
  notifyListeners();
}

export function importCuratedModulesBatch(newModules: QuranModule[]): { added: number; updated: number } {
  const existingCustom = getCustomModulesFromStorage();
  const customMap = new Map<string, QuranModule>();

  for (const m of existingCustom) {
    customMap.set(m.id, m);
  }

  let added = 0;
  let updated = 0;

  for (const mod of newModules) {
    if (!mod.id) {
      mod.id = `mod-drive-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    }
    const isExisting = customMap.has(mod.id) || QURAN_STUDY_MODULES.some((m) => m.id === mod.id);
    if (isExisting) {
      updated++;
    } else {
      added++;
    }
    customMap.set(mod.id, mod);
  }

  const updatedArray = Array.from(customMap.values());
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedArray));
  notifyListeners();

  return { added, updated };
}

export function resetCuratedModulesToDefault(): void {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  notifyListeners();
}

export function subscribeToModulesChange(callback: Listener): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}
