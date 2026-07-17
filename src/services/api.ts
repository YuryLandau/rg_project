// API client centralizado para integração com backend RGBim
// Usa fetch nativo. Base URL pode ser configurada via Vite: VITE_API_BASE_URL
// Cai para http://localhost:5000 se variável não estiver definida.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export const API_BASE_URL = BASE_URL;

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

export async function manageSubscription(token: string) {
    const res = await fetch(`${BASE_URL}/api/user/manage-subscription`, {
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

export interface PluginDownloadLinksResponse {
    status: number;
    plugins: Array<{ key: string; url: string; year?: number }>;
}

export async function getPluginDownloadLinks(token: string) {
    const res = await fetch(`${BASE_URL}/api/plugin/download-links`, {
        headers: buildHeaders(token)
    });
    return handleResponse<PluginDownloadLinksResponse>(res);
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

// -------- Plugins helpers (frontend-only normalization) --------
export interface PluginItem {
    key: string; // e.g., Plugin2025
    year?: number; // e.g., 2025
    url: string; // absolute URL to download endpoint
}

export function extractYearFromKey(key: string): number | undefined {
    const m = /([0-9]{4})$/.exec(key);
    if (!m) return undefined;
    const y = Number(m[1]);
    return Number.isFinite(y) ? y : undefined;
}

export function normalizePluginLinks(response: PluginDownloadLinksResponse | undefined | null): PluginItem[] {
    if (!response || !Array.isArray(response.plugins)) return [];
    const items: PluginItem[] = response.plugins.map(p => ({
        key: p.key,
        year: p.year ?? extractYearFromKey(p.key),
        url: p.url
    }));
    // Sort by year desc, fallback to name
    items.sort((a, b) => (b.year ?? -Infinity) - (a.year ?? -Infinity) || a.key.localeCompare(b.key));
    return items;
}

export function latestPlugin(items: PluginItem[]): PluginItem | undefined {
    if (!items.length) return undefined;
    return items[0];
}

export type UpdatePasswordResult = {
  status: number;
  mensagemSucesso?: string;
  requiresReauth?: boolean;
  errors?: any;
};

export async function updateUserPassword(
    accessToken: string,
    payload: { senhaAtual: string; novaSenha: string; confirmarNovaSenha: string }
): Promise<UpdatePasswordResult> {
    const res = await fetch(`${BASE_URL}/api/user/profile/update-password`, {
        method: 'PATCH',
        headers: buildHeaders(accessToken),
        body: JSON.stringify(payload)
    });

    const text = await res.text();
    let data: UpdatePasswordResult | null = null;

    try {
        data = text ? JSON.parse(text) as UpdatePasswordResult : null;
    } catch {
        data = null;
    }

    if (!res.ok) {
        throw data ?? { status: res.status, errors: 'Erro ao alterar senha.' };
    }

    return data ?? { status: res.status };
}

// (8) Solicitar reset logado
export async function requestPasswordResetLogged(token: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/user/password-reset/request-logged`, {
        method: 'POST',
        headers: buildHeaders(token)
    });

    await handleResponse<{ status: number; mensagemSucesso?: string }>(res);
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string>;
  constructor(message: string, status: number, errors?: Record<string, string>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

const API_BASE = import.meta.env.VITE_API_URL ?? ""; 
// ✅ Se seu projeto usa outro nome (ex: VITE_API_BASE), troque aqui.

function getAccessToken(): string | null {
  // ✅ Ajuste para a MESMA estratégia de segurança já implementada no seu projeto.
  // Deixe somente a chave correta do seu projeto quando souber.
  const possibleKeys = ["TokenAcesso", "accessToken", "token"];
  for (const k of possibleKeys) {
    const v = localStorage.getItem(k);
    if (v) return v;
  }
  return null;
}

async function requestJson<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    ...init,
  });

  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const data: any = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    const message =
      data?.message ||
      (typeof data === "string" && data) ||
      "Erro na requisição. Tente novamente.";
    const errors = data?.errors;
    throw new ApiError(message, res.status, errors);
  }

  return data as T;
}

// (2) Reenviar código
export async function resendUserCode(email: string): Promise<void> {
  await requestJson<void>("/api/user/resend-code", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// (4) Esqueci minha senha
export async function requestPasswordReset(email: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/user/password-reset/request`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({ email })
    });

    await handleResponse<{ status: number; mensagemSucesso?: string }>(res);
}

// (5) Redefinir senha (token)
export async function confirmPasswordReset(token: string, novaSenha: string, confirmarNovaSenha: string): Promise<void> {
  await requestJson<void>("/api/user/password-reset/confirm", {
    method: "POST",
    body: JSON.stringify({ token, novaSenha, confirmarNovaSenha }),
  });
}

// (6) Redefinir senha (código fallback)
export async function confirmPasswordResetByCode(
  email: string,
  codigo: string,
  novaSenha: string,
  confirmarNovaSenha: string
): Promise<void> {
  await requestJson<void>("/api/user/password-reset/confirm-code", {
    method: "POST",
    body: JSON.stringify({ email, codigo, novaSenha, confirmarNovaSenha }),
  });
}

// (7) Alterar senha (logado)
export async function updatePasswordLogged(
  senhaAtual: string,
  novaSenha: string,
  confirmarNovaSenha: string
): Promise<{ requiresReauth: boolean }> {
  const token = getAccessToken();
  if (!token) throw new ApiError("Sessão expirada. Faça login novamente.", 401);

  return await requestJson<{ requiresReauth: boolean }>("/api/user/profile/update-password", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ senhaAtual, novaSenha, confirmarNovaSenha }),
  });
}

async function handleDetailedResponse<T>(res: Response): Promise<T> {
    const text = await res.text();
    let data: any = null;

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!res.ok) {
        const errors = data?.errors ?? data?.mensagem ?? data ?? res.statusText;
        const message =
            typeof errors === 'string'
                ? errors
                : 'Erro na requisição.';

        throw new ApiError(message, res.status, errors);
    }

    return data as T;
}
