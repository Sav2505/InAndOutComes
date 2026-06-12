const SESSION_KEY = 'outcomes_auth';

const VALID_USERNAME = import.meta.env.VITE_AUTH_USERNAME as string;
const VALID_PASSWORD_HASH = import.meta.env.VITE_AUTH_PASSWORD_HASH as string;

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

export async function login(username: string, password: string): Promise<boolean> {
  const passwordHash = await sha256(password);

  const usernameMatch = username === VALID_USERNAME;
  const passwordMatch = passwordHash === VALID_PASSWORD_HASH;

  if (usernameMatch && passwordMatch) {
    sessionStorage.setItem(SESSION_KEY, 'true');
    return true;
  }

  return false;
}

export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
