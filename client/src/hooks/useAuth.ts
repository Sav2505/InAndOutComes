const SESSION_KEY = 'outcomes_auth';
const TOKEN_KEY = 'outcomes_token';
const USER_KEY = 'outcomes_user';

const API = import.meta.env.VITE_API_BASE_URL ?? '/api';

export interface AuthUser {
  id: string;
  name: string;
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

export function getAuthToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getAuthUser(): AuthUser | null {
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export async function login(username: string, password: string): Promise<boolean> {
  const response = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) return false;

  const data = (await response.json()) as { token: string; userId: string; name: string };
  sessionStorage.setItem(SESSION_KEY, 'true');
  sessionStorage.setItem(TOKEN_KEY, data.token);
  sessionStorage.setItem(USER_KEY, JSON.stringify({ id: data.userId, name: data.name }));
  return true;
}

export function logout(): void {
  const token = getAuthToken();
  if (token) {
    void fetch(`${API}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}
