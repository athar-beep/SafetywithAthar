export const WELCOME_STORAGE_KEY = 'safetywithathar_atharworld_welcome_seen_v1';
export const WELCOME_AUTO_DISMISS_MS = 2600;

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface WelcomeDecisionInput {
  searchQuery?: string;
  storage?: StorageLike | null;
}

/**
 * Determines whether the AtharWorld welcome experience should appear on load.
 * - Automatically skips after WELCOME_AUTO_DISMISS_MS (2.6s) when shown.
 * - Never blocks access if sessionStorage is unavailable.
 * - Supports `?autostart=1` to bypass welcome screen immediately.
 * - Supports `?welcome=1` to explicitly replay the welcome screen.
 * - Shows once per browsing session (`sessionStorage`).
 */
export function shouldShowWelcome(input: WelcomeDecisionInput = {}): boolean {
  const { searchQuery = '', storage = null } = input;

  try {
    const params = new URLSearchParams(
      searchQuery.startsWith('?') ? searchQuery.slice(1) : searchQuery
    );

    if (params.get('autostart') === '1') {
      return false;
    }

    if (params.get('welcome') === '1') {
      return true;
    }

    if (!storage) {
      return true;
    }

    const seen = storage.getItem(WELCOME_STORAGE_KEY);
    return seen !== '1';
  } catch {
    return false;
  }
}

export function markWelcomeSeen(storage?: StorageLike | null): void {
  if (!storage) return;
  try {
    storage.setItem(WELCOME_STORAGE_KEY, '1');
  } catch {
    // Ignore storage quota / privacy errors so website access is never blocked
  }
}

export function resetWelcomeSeen(storage?: StorageLike | null): void {
  if (!storage) return;
  try {
    storage.removeItem(WELCOME_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}
