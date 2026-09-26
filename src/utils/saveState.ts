import { PlayerStats, StolenLoot, Upgrade } from '../types/game';

export interface GameSavePayload {
  version: number;
  timestamp: number;
  stats: PlayerStats;
  lootHistory: StolenLoot[];
  upgrades: Upgrade[];
}

export function exportSaveCode(
  stats: PlayerStats,
  lootHistory: StolenLoot[],
  upgrades: Upgrade[]
): string {
  const payload: GameSavePayload = {
    version: 1,
    timestamp: Date.now(),
    stats,
    lootHistory,
    upgrades,
  };

  try {
    const json = JSON.stringify(payload);
    // Base64 encode with prefix
    const b64 = btoa(unescape(encodeURIComponent(json)));
    return `CCT-SAVE-${b64}`;
  } catch (err) {
    console.error('Failed to create save code', err);
    return '';
  }
}

export function importSaveCode(code: string): GameSavePayload | null {
  try {
    const trimmed = code.trim();
    if (!trimmed.startsWith('CCT-SAVE-')) {
      return null;
    }
    const b64 = trimmed.replace('CCT-SAVE-', '');
    const json = decodeURIComponent(escape(atob(b64)));
    const payload = JSON.parse(json) as GameSavePayload;

    if (!payload.stats || typeof payload.stats.balance !== 'number') {
      return null;
    }
    return payload;
  } catch (err) {
    console.error('Failed to parse save code', err);
    return null;
  }
}
