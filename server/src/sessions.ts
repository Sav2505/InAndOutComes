export interface SessionData {
  id: string;
  name: string;
}

// In-memory session store: token → user data
export const sessions = new Map<string, SessionData>();
