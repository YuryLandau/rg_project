import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

let sequence = 0;
let storage;
beforeEach(() => {
    delete navigator.locks;
    storage = new Map([['auth:tokens', JSON.stringify({ accessToken: 'legacy-access', refreshToken: 'legacy-refresh' })]]);
    globalThis.localStorage = {
        getItem: key => storage.get(key) ?? null,
        setItem: (key, value) => storage.set(key, value),
        removeItem: key => storage.delete(key),
    };
    globalThis.window = new EventTarget();
});

async function moduleUrl(path, replacements = []) {
    let source = await readFile(new URL(path, import.meta.url), 'utf8');
    for (const [from, to] of replacements) source = source.replace(from, to);
    const { outputText } = ts.transpileModule(source, {
        compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
    });
    return `data:text/javascript;base64,${Buffer.from(`${outputText}\n// instance ${sequence++}`).toString('base64')}`;
}

async function setup() {
    const sessionUrl = await moduleUrl('../src/services/authSession.ts');
    const session = await import(sessionUrl);
    const apiUrl = await moduleUrl('../src/services/api.ts', [
        ["'./authSession'", JSON.stringify(sessionUrl)],
        ['import.meta.env.VITE_API_BASE_URL', "'https://api.rgbim.test'"],
    ]);
    return { session, api: await import(apiUrl) };
}

test('tokens antigos são removidos e access token só existe na memória da página', async () => {
    const { session } = await setup();
    assert.equal(storage.has('auth:tokens'), false);
    session.saveStoredSession({ id: 'user', email: 'user@test' }, { accessToken: 'new-access' });
    assert.equal(session.readStoredTokens().accessToken, 'new-access');
    assert.equal(JSON.stringify([...storage]).includes('new-access'), false);
    const reloaded = await import(await moduleUrl('../src/services/authSession.ts'));
    assert.equal(reloaded.readStoredTokens(), null);
    session.clearStoredSession();
    assert.equal(session.readStoredTokens(), null);
});

test('recarregar a página renova pelo cookie sem enviar token ou id no corpo', async () => {
    const { session, api } = await setup();
    globalThis.fetch = async (url, init) => {
        assert.equal(url, 'https://api.rgbim.test/api/user/refresh-token');
        assert.equal(init.credentials, 'include');
        assert.equal(init.headers['X-Refresh-Transport'], 'cookie');
        assert.equal(init.body, undefined);
        return Response.json({ status: 200, resultado: { tokenAcesso: 'access-from-cookie' } });
    };
    assert.equal(await api.getFreshAccessToken(), 'access-from-cookie');
    assert.equal(session.readStoredTokens().accessToken, 'access-from-cookie');
    assert.equal(storage.has('auth:tokens'), false);
});

test('requisições concorrentes compartilham uma única renovação', async () => {
    const { api } = await setup();
    let calls = 0;
    globalThis.fetch = async () => {
        calls++;
        return Response.json({ resultado: { tokenAcesso: 'rotated' } });
    };
    assert.deepEqual(await Promise.all([api.refreshAccessToken(), api.refreshAccessToken()]), ['rotated', 'rotated']);
    assert.equal(calls, 1);
});

test('refresh em andamento não restaura sessão após logout', async () => {
    const { api, session } = await setup();
    let resolveResponse;
    globalThis.fetch = () => new Promise(resolve => { resolveResponse = resolve; });
    const pending = api.refreshAccessToken();
    session.clearStoredSession();
    resolveResponse(Response.json({ resultado: { tokenAcesso: 'late-token' } }));
    await assert.rejects(pending, /Sessão encerrada/);
    assert.equal(session.readStoredTokens(), null);
});

test('refresh aguardando outra aba é cancelado se a sessão for encerrada', async () => {
    const { api, session } = await setup();
    let executeLock;
    Object.defineProperty(navigator, 'locks', { configurable: true, value: {
        request: async (name, callback) => {
            assert.equal(name, 'rgbim:refresh');
            await new Promise(resolve => { executeLock = resolve; });
            return callback();
        },
    } });
    let fetchCalled = false;
    globalThis.fetch = async () => { fetchCalled = true; return Response.json({}); };
    const pending = api.refreshAccessToken();
    session.clearStoredSession();
    executeLock();
    await assert.rejects(pending, /Sessão encerrada/);
    assert.equal(fetchCalled, false);
});

test('refresh inválido encerra sessão, erro transitório preserva token em memória', async () => {
    const { api, session } = await setup();
    session.saveStoredTokens({ accessToken: 'current' });
    globalThis.fetch = async () => new Response('', { status: 503 });
    await assert.rejects(api.refreshAccessToken());
    assert.equal(session.readStoredTokens().accessToken, 'current');
    globalThis.fetch = async () => new Response('', { status: 401 });
    await assert.rejects(api.refreshAccessToken());
    assert.equal(session.readStoredTokens(), null);
});

test('login e logout enviam credenciais e o cabeçalho exigido para cookies', async () => {
    const { api } = await setup();
    const calls = [];
    globalThis.fetch = async (url, init) => {
        calls.push({ url, init });
        return Response.json({ tokenAcesso: 'access' });
    };
    await api.login('user@test', 'password');
    await api.logout('access');
    assert.equal(calls.length, 2);
    for (const { init } of calls) {
        assert.equal(init.credentials, 'include');
        assert.equal(new Headers(init.headers).get('X-Refresh-Transport'), 'cookie');
        assert.equal(init.body?.includes('refreshToken') ?? false, false);
    }
});
