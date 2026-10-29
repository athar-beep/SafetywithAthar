// Supabase REST/Auth helpers for the GitHub Pages edition of SafetyWithAthar.
// No SDK dependency: plain fetch against PostgREST + GoTrue endpoints.
// Public config comes from Vite env (repo Actions variables at build time).

export const SUPABASE_URL: string =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? '';
export const SUPABASE_ANON_KEY: string =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? '';

export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

function baseHeaders(token?: string): Record<string, string> {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${token ?? SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };
}

export interface SupabaseSession {
  access_token: string;
  refresh_token: string;
  expires_at: number; // epoch seconds
  email: string;
}

const SESSION_KEY = 'swa_admin_session';

export function loadSession(): SupabaseSession | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as SupabaseSession;
    if (!s.access_token || s.expires_at * 1000 < Date.now() + 30_000) {
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

export function saveSession(s: SupabaseSession | null) {
  try {
    if (s) window.localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // storage unavailable; session simply will not persist
  }
}

export async function signInWithPassword(
  email: string,
  password: string
): Promise<SupabaseSession> {
  const res = await fetch(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
    {
      method: 'POST',
      headers: { apikey: SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) {
    throw new Error(
      data.error_description || data.msg || 'Invalid owner credentials.'
    );
  }
  const session: SupabaseSession = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at:
      Math.floor(Date.now() / 1000) + (Number(data.expires_in) || 3600),
    email: data.user?.email ?? email,
  };
  saveSession(session);
  return session;
}

export async function restSelect<T>(
  table: string,
  query: string,
  token?: string
): Promise<T[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: baseHeaders(token),
  });
  if (!res.ok) throw new Error(`Could not load ${table} (${res.status}).`);
  return (await res.json()) as T[];
}

export async function restInsert<T>(
  table: string,
  row: Record<string, unknown>,
  token: string
): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...baseHeaders(token), Prefer: 'return=representation' },
    body: JSON.stringify(row),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (data as { message?: string }).message || `Insert failed (${res.status}).`
    );
  }
  return (Array.isArray(data) ? data[0] : data) as T;
}

export async function restUpdate(
  table: string,
  id: string,
  patch: Record<string, unknown>,
  token: string
): Promise<void> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      headers: { ...baseHeaders(token), Prefer: 'return=minimal' },
      body: JSON.stringify(patch),
    }
  );
  if (!res.ok) throw new Error(`Update failed (${res.status}).`);
}

export async function restDelete(
  table: string,
  id: string,
  token: string
): Promise<void> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`,
    { method: 'DELETE', headers: baseHeaders(token) }
  );
  if (!res.ok) throw new Error(`Delete failed (${res.status}).`);
}
