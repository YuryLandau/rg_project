import { createContext } from 'react';
import type { StoredUser } from '../services/authSession';

export type User = StoredUser;

export interface AuthContextValue {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    updateProfileLocal: (data: Partial<User>) => void;
    accessToken: string | null;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
