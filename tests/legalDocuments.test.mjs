import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

let sequence = 0;

async function loadLegalDocumentsApi() {
    const apiModule = `data:text/javascript,${encodeURIComponent("export const API_BASE_URL = 'https://api.rgbim.test';")}`;
    let source = await readFile(new URL('../src/services/legalDocumentsApi.ts', import.meta.url), 'utf8');
    source = source.replace("'./api'", JSON.stringify(apiModule));
    const { outputText } = ts.transpileModule(source, {
        compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
    });
    const url = `data:text/javascript;base64,${Buffer.from(`${outputText}\n// instance ${sequence++}`).toString('base64')}`;
    return import(url);
}

test('busca somente a rota fixa do documento e exige resposta PDF', async () => {
    const api = await loadLegalDocumentsApi();
    globalThis.fetch = async (url, init) => {
        assert.equal(url, 'https://api.rgbim.test/api/legal-documents/terms-of-use');
        assert.equal(init.method, 'GET');
        assert.equal(new Headers(init.headers).get('Accept'), 'application/pdf');
        return new Response(new Blob(['%PDF-1.7'], { type: 'application/pdf' }), {
            headers: { 'Content-Type': 'application/pdf' },
        });
    };

    const document = await api.fetchLegalDocument('terms-of-use');

    assert.equal(document.type, 'application/pdf');
    assert.equal(await document.text(), '%PDF-1.7');
});

test('rejeita resposta que não seja PDF', async () => {
    const api = await loadLegalDocumentsApi();
    globalThis.fetch = async () => new Response('<html></html>', {
        headers: { 'Content-Type': 'text/html' },
    });

    await assert.rejects(
        api.fetchLegalDocument('privacy-policy'),
        /não é um documento PDF válido/,
    );
});

test('informa quando o documento ainda não está disponível', async () => {
    const api = await loadLegalDocumentsApi();
    globalThis.fetch = async () => new Response(null, { status: 404 });

    await assert.rejects(
        api.fetchLegalDocument('privacy-policy'),
        /ainda não está disponível/,
    );
});
