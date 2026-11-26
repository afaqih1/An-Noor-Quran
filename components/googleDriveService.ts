import { QuranModule } from './quranStudyModulesData';

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  webViewLink?: string;
}

export function extractFolderIdFromUrl(urlOrId: string): string {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();
  // Match https://drive.google.com/drive/folders/FOLDER_ID or /u/0/folders/FOLDER_ID
  const match = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return match[1];
  }
  // Match https://drive.google.com/file/d/FILE_ID
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) {
    return fileMatch[1];
  }
  // Assume it's a raw folder ID if alphanumeric with dashes/underscores
  if (/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return trimmed;
  }
  return trimmed;
}

export async function fetchDriveFolderFiles(
  folderIdOrUrl: string,
  accessToken?: string
): Promise<{ success: boolean; folderId: string; files: DriveFileItem[]; error?: string }> {
  const folderId = extractFolderIdFromUrl(folderIdOrUrl);
  if (!folderId) {
    return { success: false, folderId: '', files: [], error: 'Invalid Google Drive folder link or ID' };
  }

  try {
    const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
    const fields = encodeURIComponent('files(id, name, mimeType, modifiedTime, size, webViewLink)');
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&pageSize=100`;

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const resp = await fetch(url, { headers });
    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({}));
      const msg = errData.error?.message || `Google Drive API error (${resp.status})`;
      return { success: false, folderId, files: [], error: msg };
    }

    const data = await resp.json();
    return {
      success: true,
      folderId,
      files: data.files || []
    };
  } catch (err: any) {
    return { success: false, folderId, files: [], error: err.message || 'Failed to fetch files from Google Drive' };
  }
}

export async function fetchDriveFileContent(
  fileId: string,
  mimeType: string,
  accessToken?: string
): Promise<{ success: boolean; content: string; error?: string }> {
  try {
    let url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

    // Handle Google Workspace native docs/sheets export
    if (mimeType === 'application/vnd.google-apps.document') {
      url = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`;
    } else if (mimeType === 'application/vnd.google-apps.spreadsheet') {
      url = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/csv`;
    }

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const resp = await fetch(url, { headers });
    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({}));
      const msg = errData.error?.message || `Failed to download file content (${resp.status})`;
      return { success: false, content: '', error: msg };
    }

    const text = await resp.text();
    return { success: true, content: text };
  } catch (err: any) {
    return { success: false, content: '', error: err.message || 'Error fetching Google Drive file content' };
  }
}

export function parseRawContentToModules(rawText: string): QuranModule[] {
  if (!rawText || !rawText.trim()) return [];

  // 1. Try parsing direct JSON (array of modules or single module)
  try {
    const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    const list = Array.isArray(parsed) ? parsed : [parsed];
    return list.map(normalizeParsedModule).filter(Boolean) as QuranModule[];
  } catch (e) {
    // Not standard JSON, proceed to custom structured text/CSV parser
  }

  // 2. Fallback: Parse structured text/CSV or Markdown
  const modules: QuranModule[] = [];
  const lines = rawText.split('\n');
  let currentModule: Partial<QuranModule> | null = null;

  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith('# ') || t.toLowerCase().startsWith('module:')) {
      if (currentModule && currentModule.title) {
        modules.push(normalizeParsedModule(currentModule)!);
      }
      const title = t.replace(/^#\s*/, '').replace(/^module:\s*/i, '').trim();
      currentModule = {
        id: `mod-imported-${Date.now()}-${modules.length}`,
        title,
        titleAr: '',
        titleAm: '',
        subtitle: 'Curated Study Module from Google Drive',
        subtitleAr: '',
        subtitleAm: '',
        orderIndex: 10 + modules.length,
        surahNumber: 1,
        revelationType: 'Meccan',
        totalVerses: 1,
        themeColor: 'emerald',
        description: 'Imported via Google Drive integration',
        descriptionAr: '',
        descriptionAm: '',
        thematicPillars: [],
        studyObjectives: [],
        curatedAiAnalysis: {
          overviewEn: '',
          overviewAr: '',
          overviewAm: '',
          linguisticEloquenceEn: '',
          linguisticEloquenceAr: '',
          linguisticEloquenceAm: '',
          practicalApplicationEn: '',
          practicalApplicationAr: '',
          practicalApplicationAm: ''
        },
        segments: []
      };
    }
  }

  if (currentModule && currentModule.title) {
    modules.push(normalizeParsedModule(currentModule)!);
  }

  return modules;
}

export function normalizeParsedModule(raw: any): QuranModule | null {
  if (!raw || typeof raw !== 'object') return null;

  const id = raw.id || `mod-drive-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const title = raw.title || raw.name || 'Untitled Curated Quran Module';

  return {
    id,
    title,
    titleAr: raw.titleAr || raw.title_ar || title,
    titleAm: raw.titleAm || raw.title_am || title,
    subtitle: raw.subtitle || 'Google Drive Curated Tafsir Module',
    subtitleAr: raw.subtitleAr || '',
    subtitleAm: raw.subtitleAm || '',
    orderIndex: typeof raw.orderIndex === 'number' ? raw.orderIndex : 50,
    surahNumber: Number(raw.surahNumber || raw.surah_number || 1),
    revelationType: raw.revelationType === 'Medinan' ? 'Medinan' : 'Meccan',
    totalVerses: Number(raw.totalVerses || raw.total_verses || (raw.segments ? raw.segments.length : 1)),
    themeColor: ['emerald', 'amber', 'blue', 'purple', 'rose', 'teal'].includes(raw.themeColor)
      ? raw.themeColor
      : 'emerald',
    description: raw.description || 'Curated module imported from Google Drive.',
    descriptionAr: raw.descriptionAr || '',
    descriptionAm: raw.descriptionAm || '',
    thematicPillars: Array.isArray(raw.thematicPillars) ? raw.thematicPillars : [],
    studyObjectives: Array.isArray(raw.studyObjectives) ? raw.studyObjectives : [],
    curatedAiAnalysis: raw.curatedAiAnalysis || {
      overviewEn: raw.description || 'Overview provided by Google Drive import.',
      overviewAr: '',
      overviewAm: '',
      linguisticEloquenceEn: '',
      linguisticEloquenceAr: '',
      linguisticEloquenceAm: '',
      practicalApplicationEn: '',
      practicalApplicationAr: '',
      practicalApplicationAm: ''
    },
    segments: Array.isArray(raw.segments)
      ? raw.segments.map((seg: any, idx: number) => ({
          id: seg.id || `seg-${id}-${idx + 1}`,
          moduleId: id,
          label: seg.label || `Ayah ${seg.verseNumber || idx + 1}`,
          labelAr: seg.labelAr || `آية ${seg.verseNumber || idx + 1}`,
          surahNumber: Number(seg.surahNumber || raw.surahNumber || 1),
          verseNumber: Number(seg.verseNumber || idx + 1),
          arabicText: seg.arabicText || 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
          transliteration: seg.transliteration || '',
          translation: seg.translation || {
            en: typeof seg.translation === 'string' ? seg.translation : 'In the name of Allah, Most Gracious, Most Merciful.',
            ar: '',
            am: ''
          },
          explanation: seg.explanation || {
            en: 'Scholarly tafsir and reflection imported from Google Drive folder.',
            ar: '',
            am: ''
          },
          audioUrl: seg.audioUrl || 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3',
          keywords: Array.isArray(seg.keywords) ? seg.keywords : []
        }))
      : []
  };
}
