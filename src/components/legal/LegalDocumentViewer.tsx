import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { fetchLegalDocument, type LegalDocumentKind } from '../../services/legalDocumentsApi';

interface LegalDocumentViewerProps {
    kind: LegalDocumentKind;
    title: string;
    version: string;
    fileName: string;
}

export const LegalDocumentViewer = ({
    kind,
    title,
    version,
    fileName,
}: LegalDocumentViewerProps) => {
    const [documentUrl, setDocumentUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        let objectUrl: string | null = null;

        fetchLegalDocument(kind, controller.signal)
            .then((document) => {
                objectUrl = URL.createObjectURL(document);
                setDocumentUrl(objectUrl);
            })
            .catch((reason: unknown) => {
                if (controller.signal.aborted)
                    return;

                setError(reason instanceof Error
                    ? reason.message
                    : 'Não foi possível carregar o documento.');
            });

        return () => {
            controller.abort();
            if (objectUrl)
                URL.revokeObjectURL(objectUrl);
        };
    }, [kind, reloadKey]);

    const retry = () => {
        setDocumentUrl(null);
        setError(null);
        setReloadKey((value) => value + 1);
    };

    return (
        <article className="mx-auto max-w-6xl py-16 text-gray-700 leading-relaxed">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">{title}</h1>
                    <p>Versão {version}</p>
                </div>

                {documentUrl && (
                    <div className="flex flex-wrap gap-3">
                        <a
                            className="rounded-lg border-2 border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                            href={documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Abrir em nova aba
                        </a>
                        <a
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                            href={documentUrl}
                            download={fileName}
                        >
                            Baixar PDF
                        </a>
                    </div>
                )}
            </div>

            {!documentUrl && !error && (
                <div className="flex min-h-64 items-center justify-center rounded-lg border border-gray-200 bg-gray-50" role="status">
                    Carregando documento…
                </div>
            )}

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800" role="alert">
                    <p className="mb-4">{error}</p>
                    <Button type="button" size="small" onClick={retry}>
                        Tentar novamente
                    </Button>
                </div>
            )}

            {documentUrl && (
                <iframe
                    className="h-[75vh] min-h-[600px] w-full rounded-lg border border-gray-200 bg-white"
                    src={documentUrl}
                    title={title}
                />
            )}
        </article>
    );
};
