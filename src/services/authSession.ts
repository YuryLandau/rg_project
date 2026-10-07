export interface StoredTokens {
    accessToken: string;
    refreshToken: string;
}

export interface StoredUser {
    id: string;
    email: string;
    name?: string;
    plan?: string;
}

export const AUTH_USER_STORAGE_KEY = 'auth:user';
export const AUTH_TOKEN_STORAGE_KEY = 'auth:tokens';

const AUTH_SESSION_CHANGED_EVENT = 'auth:session-changed';

function isStoredTokens(value: unknown): value is StoredTokens {
    if (!value || typeof value !== 'object') return false;

    const candidate = value as Partial<StoredTokens>;
    return typeof candidate.accessToken === 'string'
        && candidate.accessToken.length > 0
        && typeof candidate.refreshToken === 'string'
        && candidate.refreshToken.length > 0;
}

function isStoredUser(value: unknown): value is StoredUser {
    if (!value || typeof value !== 'object') return false;

    const candidate = value as Partial<StoredUser>;
    return typeof candidate.id === 'string'
        && candidate.id.length > 0
        && typeof candidate.email === 'string'
        && candidate.email.length > 0;
}

function notifySessionChanged(): void {
    window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));
}

export function readStoredTokens(): StoredTokens | null {
    const raw = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!raw) return null;

    try {
        const parsed: unknown = JSON.parse(raw);
        return isStoredTokens(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

export function readStoredUser(): StoredUser | null {
    const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (!raw) return null;

    try {
        const parsed: unknown = JSON.parse(raw);
        return isStoredUser(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

export function saveStoredSession(user: StoredUser, tokens: StoredTokens): void {
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, JSON.stringify(tokens));
    notifySessionChanged();
}

export function saveStoredUser(user: StoredUser): void {
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
    notifySessionChanged();
}

export function saveStoredTokens(tokens: StoredTokens): void {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, JSON.stringify(tokens));
    notifySessionChanged();
}

export function clearStoredSession(): void {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    notifySessionChanged();
}

export function subscribeToStoredSession(listener: () => void): () => void {
    const handleStorage = (event: StorageEvent) => {
        if (event.key === AUTH_USER_STORAGE_KEY || event.key === AUTH_TOKEN_STORAGE_KEY) {
            listener();
        }
    };

    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, listener);
    window.addEventListener('storage', handleStorage);

    return () => {
        window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, listener);
        window.removeEventListener('storage', handleStorage);
    };
}

export function getJwtExpirationMs(token: string): number | null {
    try {
        const payloadPart = token.split('.')[1];
        if (!payloadPart) return null;

        const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
        const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
        const payload = JSON.parse(atob(padded)) as { exp?: unknown };

        return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
    } catch {
        return null;
    }
}
