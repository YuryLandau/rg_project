import { API_BASE_URL } from '../services/api';

export interface PublicPluginItem {
    key: string; // Plugin2026
    year: number; // 2026
    label: string; // Revit 2026
    url: string; // absolute public URL to backend download endpoint
}

// Publicly exposed (no auth) list based on known backend keys.
// Backend will respond 200 if the file exists or 404 if not present.
// Keep the order from newest to oldest.
const SUPPORTED_KEYS = ['Plugin2026', 'Plugin2025', 'Plugin2024', 'Plugin2023', 'Plugin2022'] as const;

function keyToYear(key: string): number {
    const m = /([0-9]{4})$/.exec(key);
    return m ? Number(m[1]) : NaN;
}

export function getPublicPluginList(): PublicPluginItem[] {
    return SUPPORTED_KEYS.map((key) => {
        const year = keyToYear(key);
        const safeYear = Number.isFinite(year) ? year : 0;
        return {
            key,
            year: safeYear,
            label: `Revit ${safeYear || key.replace('Plugin', '')}`,
            url: `${API_BASE_URL}/api/plugin/download/${key}`,
        };
    });
}

export function getLatestPublicPlugin(): PublicPluginItem | undefined {
    const list = getPublicPluginList();
    return list[0];
}
