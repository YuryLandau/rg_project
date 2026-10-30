import { useEffect, useState, useCallback } from 'react';
import { Navigate } from 'react-router';
import type { ReactNode } from 'react';
import {
    getFreshAccessToken,
    getProfile,
    login as apiLogin,
    logout as apiLogout,
    mapFuncaoParaPlano,
    refreshAccessToken,
} from '../services/api';
import {
    clearStoredSession,
    getJwtExpirationMs,
    getSessionGeneration,
    readStoredTokens,
    readStoredUser,
    saveStoredSession,
    saveStoredUser,
    subscribeToStoredSession,
} from '../services/authSession';
import { AuthContext } from './auth-context';
import type { AuthContextValue, User } from './auth-context';
import { useAuth } from './useAuth';
import { featureFlags } from '../config/features';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const syncSessionFromStorage = useCallback(() => {
        const storedUser = readStoredUser();
        const storedTokens = readStoredTokens();

        if (!storedUser || !storedTokens) {
            setUser(null);
            setAccessToken(null);
            return;
        }

        setUser(storedUser);
        setAccessToken(storedTokens.accessToken);
    }, []);

    useEffect(() => {
        if (!featureFlags.authenticationEnabled) {
            clearStoredSession();
            setUser(null);
            setAccessToken(null);
            setLoading(false);
            return;
        }

        let active = true;
        const unsubscribe = subscribeToStoredSession(() => {
            if (active) syncSessionFromStorage();
        });

        const restoreSession = async () => {
            const generation = getSessionGeneration();
            try {
                const token = await getFreshAccessToken();
                const perfil = await getProfile(token);
                if (active && generation === getSessionGeneration()) {
                    saveStoredSession({
                        id: perfil.id,
                        email: perfil.email,
                        name: perfil.nome,
                        plan: mapFuncaoParaPlano(perfil.funcao ?? perfil.tipoConta),
                    }, { accessToken: token });
                    syncSessionFromStorage();
                }
            } catch {
                if (active) syncSessionFromStorage();
            }
            if (active) setLoading(false);
        };

        void restoreSession();

        return () => {
            active = false;
            unsubscribe();
        };
    }, [syncSessionFromStorage]);

    useEffect(() => {
        if (!featureFlags.authenticationEnabled) return;
        if (!user || !accessToken) return;

        const expirationMs = getJwtExpirationMs(accessToken);
        if (expirationMs === null) return;

        const refreshInMs = Math.max(0, expirationMs - Date.now() - 60_000);
        const maximumTimeoutMs = 2_147_000_000;
        const timer = window.setTimeout(() => {
            void refreshAccessToken().catch(() => undefined);
        }, Math.min(refreshInMs, maximumTimeoutMs));

        return () => window.clearTimeout(timer);
    }, [user, accessToken]);

    const persist = useCallback((u: User | null, at?: string | null) => {
        if (u && at) {
            saveStoredSession(u, { accessToken: at });
        } else if (u) {
            saveStoredUser(u);
        } else {
            clearStoredSession();
        }
    }, []);

    const login = async (email: string, password: string) => {
        if (!featureFlags.authenticationEnabled) return false;
        if (!email || !password) return false;
        clearStoredSession();
        try {
            const resp = await apiLogin(email, password);
            setAccessToken(resp.tokenAcesso);
            const perfil = await getProfile(resp.tokenAcesso);
            const mapped: User = {
                id: perfil.id,
                email: perfil.email,
                name: perfil.nome,
                plan: mapFuncaoParaPlano(perfil.funcao ?? perfil.tipoConta)
            };
            setUser(mapped);
            persist(mapped, resp.tokenAcesso);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    const logout = async () => {
        try {
            if (featureFlags.authenticationEnabled && accessToken) await apiLogout(accessToken);
        } catch {
            // ignore network errors
        } finally {
            setUser(null);
            setAccessToken(null);
            clearStoredSession();
        }
    };

    const refreshProfile = useCallback(async () => {
        if (!featureFlags.authenticationEnabled) return;
        if (!accessToken) return;
        try {
            const perfil = await getProfile(accessToken);
            const mapped: User = {
                id: perfil.id,
                email: perfil.email,
                name: perfil.nome,
                plan: mapFuncaoParaPlano(perfil.funcao ?? perfil.tipoConta)
            };
            setUser(mapped);
            persist(mapped, accessToken);
        } catch (e) {
            console.error('Erro ao atualizar perfil', e);
        }
    }, [accessToken, persist]);

    const updateProfileLocal = (data: Partial<User>) => {
        setUser(prev => {
            if (!prev) return prev;
            const updated = { ...prev, ...data };
            persist(updated, accessToken);
            return updated;
        });
    };

    const value: AuthContextValue = { user, loading, login, logout, refreshProfile, updateProfileLocal, accessToken };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const RequireAuth = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuth();

    if (loading) return <div style={{ padding: '2rem' }}>Carregando...</div>;

    if (!featureFlags.authenticationEnabled || !user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};
