// API client centralizado para integração com backend RGBim
// Usa fetch nativo. Base URL pode ser configurada via Vite: VITE_API_BASE_URL
// Cai para http://localhost:5000 se variável não estiver definida.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface LoginResponse {
    tokenAcesso: string;
    refreshToken: string;
}

interface RegisterResponse {
    status: number;
    mensagemSucesso?: string;
}

interface ValidateResponse {
    status: number;
    mensagemSucesso?: string;
}

interface ProfileResponseWrapper {
    status: number;
    mensagemSucesso: {
        id: string;
        email: string;
        nome?: string;
        funcao?: string; // Premium | Comum | Admin
    };
}

function buildHeaders(token?: string, extra: Record<string, string> = {}) {
    const h: Record<string, string> = { 'Content-Type': 'application/json', ...extra };
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
}

// Generic handler converting JSON response and throwing on error
async function handleResponse<T>(res: Response): Promise<T> {
    const text = await res.text();
    let data: unknown = null;
    try { data = text ? JSON.parse(text) : null; } catch { /* ignore parse errors */ }
    if (!res.ok) {
        const maybeObj = data as Record<string, unknown> | null;
        const msgRaw = maybeObj?.errors || maybeObj?.mensagem || res.statusText;
        const msg = typeof msgRaw === 'string' ? msgRaw : JSON.stringify(msgRaw);
        throw new Error(msg);
    }
    return data as T;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`${BASE_URL}/api/user/login`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({ email, senha: password })
    });
    return handleResponse<LoginResponse>(res);
}

export async function registerUser(nome: string, email: string, senha: string, senhaConfirmacao: string): Promise<RegisterResponse> {
    const res = await fetch(`${BASE_URL}/api/user/register`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({ nome, email, senha, senhaConfirmacao })
    });
    return handleResponse<RegisterResponse>(res);
}

export async function validateUserCode(email: string, codigo: string): Promise<ValidateResponse> {
    const res = await fetch(`${BASE_URL}/api/user/validate`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({ email, codigo })
    });
    return handleResponse<ValidateResponse>(res);
}

export async function logout(token: string): Promise<void> {
    // Endpoint não exige body
    const res = await fetch(`${BASE_URL}/api/user/logout`, {
        method: 'POST',
        headers: buildHeaders(token)
    });
    if (!res.ok) throw new Error('Falha ao deslogar');
}

export async function getProfile(token: string) {
    const res = await fetch(`${BASE_URL}/api/user/profile`, {
        headers: buildHeaders(token)
    });
    const data = await handleResponse<ProfileResponseWrapper>(res);
    return data.mensagemSucesso;
}

export async function startSubscription(token: string) {
    const res = await fetch(`${BASE_URL}/api/user/checkout/subscribe`, {
        method: 'POST',
        headers: buildHeaders(token)
    });
    const data = await handleResponse<{ status: number; urlStripe: string }>(res);
    return data.urlStripe;
}

export async function cancelSubscription(token: string) {
    const res = await fetch(`${BASE_URL}/api/user/cancel-subscription`, {
        method: 'DELETE',
        headers: buildHeaders(token)
    });
    if (!res.ok) throw new Error('Falha ao cancelar assinatura');
}

export async function getPluginDownloadLinks(token: string) {
    const res = await fetch(`${BASE_URL}/api/plugin/download-links`, {
        headers: buildHeaders(token)
    });
    return handleResponse<Record<string, string | number | null | undefined>>(res); // status + chave->URL
}

export async function downloadProductFile(token: string, material: string, name?: string) {
    const url = new URL(`${BASE_URL}/api/produto/file`);
    url.searchParams.set('material', material);
    if (name) url.searchParams.set('name', name);
    const res = await fetch(url.toString(), { headers: buildHeaders(token, {}) });
    if (!res.ok) throw new Error('Arquivo não encontrado ou acesso negado');
    const blob = await res.blob();
    return blob;
}

export function mapFuncaoParaPlano(funcao?: string): string {
    switch (funcao) {
        case 'Premium': return 'premium';
        case 'Admin': return 'admin';
        default: return 'free';
    }
}
