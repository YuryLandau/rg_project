import { API_BASE_URL } from './api';

export type LegalDocumentKind = 'terms-of-use' | 'privacy-policy';

export async function fetchLegalDocument(
    kind: LegalDocumentKind,
    signal?: AbortSignal,
): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/api/legal-documents/${kind}`, {
        method: 'GET',
        headers: { Accept: 'application/pdf' },
        signal,
    });

    if (!response.ok) {
        throw new Error(response.status === 404
            ? 'O documento ainda não está disponível.'
            : 'Não foi possível carregar o documento.');
    }

    const contentType = response.headers.get('Content-Type')?.toLowerCase() ?? '';
    if (!contentType.startsWith('application/pdf'))
        throw new Error('A resposta recebida não é um documento PDF válido.');

    return response.blob();
}
