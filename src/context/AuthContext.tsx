import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { login as apiLogin, logout as apiLogout, getProfile, mapFuncaoParaPlano } from '../services/api';

interface User {
    id: string;
    email: string;
    name?: string;
    plan?: string; // free | premium | admin
}

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    updateProfileLocal: (data: Partial<User>) => void;
    accessToken: string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_USER_KEY = 'auth:user';
const STORAGE_TOKEN_KEY = 'auth:tokens';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const rawUser = localStorage.getItem(STORAGE_USER_KEY);
        const rawTokens = localStorage.getItem(STORAGE_TOKEN_KEY);
        if (rawTokens) {
            try {
                const parsed = JSON.parse(rawTokens);
                setAccessToken(parsed.accessToken || null);
                setRefreshToken(parsed.refreshToken || null);
            } catch { /* ignore */ }
        }
        if (rawUser) {
            try {
                const parsed: User = JSON.parse(rawUser);
                Promise.resolve().then(() => setUser(parsed));
            } catch { /* ignore */ }
        }
        Promise.resolve().then(() => setLoading(false));
    }, []);

    const persist = (u: User | null, at?: string | null, rt?: string | null) => {
        if (u) localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(u));
        else localStorage.removeItem(STORAGE_USER_KEY);
        if (at && rt) localStorage.setItem(STORAGE_TOKEN_KEY, JSON.stringify({ accessToken: at, refreshToken: rt }));
        else if (!at) localStorage.removeItem(STORAGE_TOKEN_KEY);
    };

    const login = async (email: string, password: string) => {
        if (!email || !password) return false;
        try {
            const resp = await apiLogin(email, password);
            setAccessToken(resp.tokenAcesso);
            setRefreshToken(resp.refreshToken);
            const perfil = await getProfile(resp.tokenAcesso);
            const mapped: User = {
                id: perfil.id,
                email: perfil.email,
                name: perfil.nome,
                plan: mapFuncaoParaPlano(perfil.funcao)
            };
            setUser(mapped);
            persist(mapped, resp.tokenAcesso, resp.refreshToken);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    const logout = async () => {
        try {
            if (accessToken) await apiLogout(accessToken);
        } catch (e) {
            // ignore network errors
        } finally {
            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
            persist(null, null, null);
        }
    };

    const refreshProfile = useCallback(async () => {
        if (!accessToken) return;
        try {
            const perfil = await getProfile(accessToken);
            const mapped: User = {
                id: perfil.id,
                email: perfil.email,
                name: perfil.nome,
                plan: mapFuncaoParaPlano(perfil.funcao)
            };
            setUser(mapped);
            persist(mapped, accessToken, refreshToken);
        } catch (e) {
            console.error('Erro ao atualizar perfil', e);
        }
    }, [accessToken, refreshToken]);

    const updateProfileLocal = (data: Partial<User>) => {
        setUser(prev => {
            if (!prev) return prev;
            const updated = { ...prev, ...data };
            persist(updated, accessToken, refreshToken);
            return updated;
        });
    };

    const value: AuthContextValue = { user, loading, login, logout, refreshProfile, updateProfileLocal, accessToken };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export const RequireAuth = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuth();

    if (loading) return <div style={{ padding: '2rem' }}>Carregando...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};