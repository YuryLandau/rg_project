import {
    clearStoredSession,
    getJwtExpirationMs,
    readStoredTokens,
    readStoredUser,
    saveStoredTokens,
} from './authSession';

// API client centralizado para integração com backend RGBim
// Usa fetch nativo. Base URL pode ser configurada via Vite: VITE_API_BASE_URL
// Cai para http://localhost:5000 se variável não estiver definida.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export const API_BASE_URL = BASE_URL;

interface LoginResponse {
    tokenAcesso: string;
    refreshToken: string;
}

interface RefreshTokenResponse {
    status: number;
    resultado: LoginResponse;
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
        funcao?: string;
        tipoConta?: string;
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

let refreshRequest: Promise<string> | null = null;

async function performTokenRefresh(): Promise<string> {
    const user = readStoredUser();
    const tokens = readStoredTokens();

    if (!user || !tokens) {
        clearStoredSession();
        throw new ApiError('Sessão expirada. Faça login novamente.', 401);
    }

    const refreshTokenUsed = tokens.refreshToken;
    const response = await fetch(`${BASE_URL}/api/user/refresh-token`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({
            idUsuario: user.id,
            refreshToken: refreshTokenUsed,
        }),
    });

    if (!response.ok) {
        const currentTokens = readStoredTokens();

        // Outra aba pode ter rotacionado o token enquanto esta chamada estava em andamento.
        if (currentTokens && currentTokens.refreshToken !== refreshTokenUsed) {
            return currentTokens.accessToken;
        }

        if ([400, 401, 403].includes(response.status)) {
            clearStoredSession();
            throw new ApiError('Sessão expirada. Faça login novamente.', response.status);
        }

        throw new ApiError('Não foi possível renovar a sessão. Tente novamente.', response.status);
    }

    const data = await handleResponse<RefreshTokenResponse>(response);
    const refreshed = data.resultado;

    if (!refreshed?.tokenAcesso || !refreshed.refreshToken) {
        clearStoredSession();
        throw new ApiError('Resposta inválida ao renovar a sessão.', 500);
    }

    // Não restaura uma sessão que tenha sido encerrada durante a renovação.
    const currentTokens = readStoredTokens();
    if (!currentTokens) {
        throw new ApiError('Sessão encerrada.', 401);
    }

    if (currentTokens.refreshToken !== refreshTokenUsed) {
        return currentTokens.accessToken;
    }

    saveStoredTokens({
        accessToken: refreshed.tokenAcesso,
        refreshToken: refreshed.refreshToken,
    });

    return refreshed.tokenAcesso;
}

export function refreshAccessToken(): Promise<string> {
    if (!refreshRequest) {
        refreshRequest = performTokenRefresh().finally(() => {
            refreshRequest = null;
        });
    }

    return refreshRequest;
}

export async function getFreshAccessToken(minimumValiditySeconds = 60): Promise<string> {
    const tokens = readStoredTokens();
    if (!tokens) {
        throw new ApiError('Sessão expirada. Faça login novamente.', 401);
    }

    const expirationMs = getJwtExpirationMs(tokens.accessToken);
    const minimumExpirationMs = Date.now() + minimumValiditySeconds * 1000;

    if (expirationMs === null || expirationMs > minimumExpirationMs) {
        return tokens.accessToken;
    }

    return refreshAccessToken();
}

async function authenticatedFetch(
    path: string,
    init: RequestInit = {},
    fallbackAccessToken?: string,
): Promise<Response> {
    const storedAccessToken = readStoredTokens()?.accessToken;
    let accessToken = fallbackAccessToken ?? storedAccessToken;

    const execute = (token: string | undefined) => {
        const headers = new Headers(init.headers);
        if (token) headers.set('Authorization', `Bearer ${token}`);

        return fetch(`${BASE_URL}${path}`, { ...init, headers });
    };

    const response = await execute(accessToken);
    if (response.status !== 401) return response;

    const newestAccessToken = readStoredTokens()?.accessToken;
    if (newestAccessToken && newestAccessToken !== accessToken) {
        accessToken = newestAccessToken;
    } else {
        accessToken = await refreshAccessToken();
    }

    return execute(accessToken);
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
    const res = await authenticatedFetch('/api/user/logout', {
        method: 'POST',
        headers: buildHeaders(token)
    }, token);
    if (!res.ok) throw new Error('Falha ao deslogar');
}

export async function getProfile(token: string) {
    const res = await authenticatedFetch('/api/user/profile', {
        headers: buildHeaders(token)
    }, token);
    const data = await handleResponse<ProfileResponseWrapper>(res);
    return data.mensagemSucesso;
}

export async function startSubscription(token: string) {
    const res = await authenticatedFetch('/api/user/checkout/subscribe', {
        method: 'POST',
        headers: buildHeaders(token)
    }, token);
    const data = await handleResponse<{ status: number; urlStripe: string }>(res);
    return data.urlStripe;
}

export async function manageSubscription(token: string) {
    const res = await authenticatedFetch('/api/user/manage-subscription', {
        method: 'POST',
        headers: buildHeaders(token)
    }, token);
    const data = await handleResponse<{ status: number; urlStripe: string }>(res);
    return data.urlStripe;
}

export interface PluginDownloadDto {
    key: string;
    nome?: string;
    versao?: string;
    canal?: string;
    arquivo?: string;
    sha256?: string | null;
    tamanhoBytes?: number | null;
    atualizacaoObrigatoria?: boolean;
    notasVersao?: string | null;
    revit?: string[];
    autoCad?: boolean;
    url: string;
    year?: number;
}

export interface PluginDownloadLinksResponse {
    status: number;
    plugins: PluginDownloadDto[];
}

export interface PluginSignedUrlResponse {
    status: number;
    plugin: {
        key: string;
        nome?: string;
        versao?: string;
        arquivo?: string;
        sha256?: string | null;
        tamanhoBytes?: number | null;
        url: string;
    };
}

export async function getPluginDownloadLinks(token: string) {
    const res = await authenticatedFetch('/api/plugin/download-links', {
        headers: buildHeaders(token)
    }, token);
    return handleResponse<PluginDownloadLinksResponse>(res);
}

export async function getPluginSignedUrl(token: string, key: string) {
    const encodedKey = encodeURIComponent(key);
    const res = await authenticatedFetch(`/api/plugin/download/${encodedKey}/signed-url`, {
        headers: buildHeaders(token)
    }, token);
    return handleResponse<PluginSignedUrlResponse>(res);
}

export async function downloadProductFile(token: string, material: string, name?: string) {
    const search = new URLSearchParams({ material });
    if (name) search.set('name', name);
    const res = await authenticatedFetch(`/api/produto/file?${search.toString()}`, {
        headers: buildHeaders(token, {})
    }, token);
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
    key: string;
    nome?: string;
    versao?: string;
    canal?: string;
    arquivo?: string;
    sha256?: string | null;
    tamanhoBytes?: number | null;
    atualizacaoObrigatoria?: boolean;
    notasVersao?: string | null;
    revit?: string[];
    autoCad?: boolean;
    year?: number;
    url: string;
}

export function extractYearFromKey(key: string): number | undefined {
    const m = /([0-9]{4})$/.exec(key);
    if (!m) return undefined;
    const y = Number(m[1]);
    return Number.isFinite(y) ? y : undefined;
}

function extractLatestSupportedYear(plugin: PluginDownloadDto): number | undefined {
    const years = plugin.revit
        ?.map((version) => Number(version))
        .filter((version) => Number.isFinite(version));

    if (!years?.length) return undefined;

    return Math.max(...years);
}

export function normalizePluginLinks(response: PluginDownloadLinksResponse | undefined | null): PluginItem[] {
    if (!response || !Array.isArray(response.plugins)) return [];
    const items: PluginItem[] = response.plugins.map(p => {
        const year = p.year ?? extractYearFromKey(p.key) ?? extractLatestSupportedYear(p);

        return {
            key: p.key,
            nome: p.nome,
            versao: p.versao,
            canal: p.canal,
            arquivo: p.arquivo,
            sha256: p.sha256,
            tamanhoBytes: p.tamanhoBytes,
            atualizacaoObrigatoria: p.atualizacaoObrigatoria,
            notasVersao: p.notasVersao,
            revit: p.revit,
            autoCad: p.autoCad,
            year,
            url: p.url
        };
    });
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
  errors?: unknown;
};

export async function updateUserPassword(
    accessToken: string,
    payload: { senhaAtual: string; novaSenha: string; confirmarNovaSenha: string }
): Promise<UpdatePasswordResult> {
    const res = await authenticatedFetch('/api/user/profile/update-password', {
        method: 'PATCH',
        headers: buildHeaders(accessToken),
        body: JSON.stringify(payload)
    }, accessToken);

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
    const res = await authenticatedFetch('/api/user/password-reset/request-logged', {
        method: 'POST',
        headers: buildHeaders(token)
    }, token);

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

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object'
    ? value as Record<string, unknown>
    : null;
}

function asFieldErrors(value: unknown): Record<string, string> | undefined {
  const record = asRecord(value);
  if (!record) return undefined;

  return Object.fromEntries(
    Object.entries(record).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
  );
}

export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

async function requestJson<T>(path: string, init: RequestInit, accessToken?: string): Promise<T> {
  const requestInit: RequestInit = {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  };

  const res = accessToken
    ? await authenticatedFetch(path, requestInit, accessToken)
    : await fetch(`${BASE_URL}${path}`, requestInit);

  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const data: unknown = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    const dataRecord = asRecord(data);
    const rawMessage = dataRecord?.message;
    const rawErrors = dataRecord?.errors;
    const message =
      (typeof rawMessage === 'string' && rawMessage) ||
      (typeof rawErrors === 'string' && rawErrors) ||
      (typeof data === "string" && data) ||
      "Erro na requisição. Tente novamente.";
    throw new ApiError(message, res.status, asFieldErrors(rawErrors));
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
  accessToken: string,
  senhaAtual: string,
  novaSenha: string,
  confirmarNovaSenha: string
): Promise<{ requiresReauth: boolean }> {
  if (!accessToken) {
    throw new ApiError("Sessão expirada. Faça login novamente.", 401);
  }

  return await requestJson<{ requiresReauth: boolean }>("/api/user/profile/update-password", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ senhaAtual, novaSenha, confirmarNovaSenha }),
  }, accessToken);
}

export async function handleDetailedResponse<T>(res: Response): Promise<T> {
    const text = await res.text();
    let data: unknown = null;

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!res.ok) {
        const dataRecord = asRecord(data);
        const errors = dataRecord?.errors ?? dataRecord?.mensagem ?? data ?? res.statusText;
        const message =
            typeof errors === 'string'
                ? errors
                : 'Erro na requisição.';

        throw new ApiError(message, res.status, asFieldErrors(errors));
    }

    return data as T;
}
