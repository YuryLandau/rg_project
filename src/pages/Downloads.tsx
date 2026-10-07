import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Head } from '../components/layout/Head';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/useAuth';
import { getPluginDownloadLinks, getPluginSignedUrl, normalizePluginLinks, type PluginItem } from '../services/api';

export const Downloads = () => {
    const { accessToken, user } = useAuth();
    const [available, setAvailable] = useState<PluginItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [downloadingKey, setDownloadingKey] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        async function loadLinks() {
            if (!accessToken) {
                setAvailable([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const raw = await getPluginDownloadLinks(accessToken);
                if (!active) return;

                const items = normalizePluginLinks(raw);
                setAvailable(items);
            } catch (e: unknown) {
                if (!active) return;

                const message = e instanceof Error ? e.message : 'Falha ao carregar downloads';
                setError(message);
                setAvailable([]);
            } finally {
                if (active) setLoading(false);
            }
        }

        loadLinks();

        return () => {
            active = false;
        };
    }, [accessToken]);

    const getCompatibilityText = (item: PluginItem) => {
        const targets: string[] = [];

        if (item.revit?.length) {
            targets.push(`Revit ${item.revit.join(', ')}`);
        } else if (item.year) {
            targets.push(`Revit ${item.year}`);
        }

        if (item.autoCad) {
            targets.push('AutoCAD');
        }

        return targets.length ? targets.join(' | ') : 'Compatibilidade nao informada';
    };

    const getFileName = (item: PluginItem) => item.arquivo || 'RGBimPluginSetup.exe';

    const handleDownload = async (item: PluginItem) => {
        if (!accessToken) {
            setError('E necessario estar logado para baixar o plugin.');
            return;
        }

        setDownloadingKey(item.key);
        setError(null);

        try {
            const response = await getPluginSignedUrl(accessToken, item.key);
            const signedUrl = response.plugin.url;

            if (!signedUrl) {
                throw new Error('Link de download indisponivel.');
            }

            const a = document.createElement('a');
            a.href = signedUrl;
            a.download = response.plugin.arquivo || getFileName(item);
            a.rel = 'noopener';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Falha ao iniciar download';
            setError(message);
        } finally {
            setDownloadingKey(null);
        }
    };

    return (
        <>
            <Head
                title="Downloads - RG BIM"
                description="Baixe familias parametricas e ferramentas para Revit"
            />
            <Section>
                <Container>
                    <div className="pb-16">
                        <div className="flex justify-center mb-10">
                            <figure className="text-center">
                                <img
                                    src="/images/Revit_Bim.jpeg"
                                    alt="Integracao entre Autodesk Revit e RG BIM"
                                    className="w-full max-w-xs md:max-w-sm h-auto rounded-lg shadow-sm"
                                    loading="lazy"
                                />
                                <figcaption className="mt-2 text-xs text-gray-500">
                                    Ferramentas RG BIM integradas ao fluxo de trabalho no Revit
                                </figcaption>
                            </figure>
                        </div>

                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Downloads</h1>

                        {!user ? (
                            <div className="max-w-2xl mx-auto text-center py-12">
                                <div className="bg-white p-8 rounded-xl shadow-lg">
                                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-primary">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Acesso Restrito</h2>
                                    <p className="text-gray-600 mb-6">
                                        Para visualizar e baixar os plugins RG BIM Tools, faca login ou cadastre-se gratuitamente.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Link to="/login">
                                            <Button variant="primary" size="large">Fazer Login</Button>
                                        </Link>
                                        <Link to="/register">
                                            <Button variant="secondary" size="large">Criar Conta Gratis</Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-600 mb-4 max-w-3xl">Plugins disponiveis para download com sua conta.</p>
                                {error && <p className="text-red-600 mb-4">{error}</p>}

                                <div className="grid gap-10">
                                    <div className="bg-white p-6 rounded-xl shadow">
                                        <h2 className="text-xl font-bold mb-4">Downloads Disponiveis</h2>
                                        {loading ? (
                                            <p className="text-gray-500">Carregando...</p>
                                        ) : available.length === 0 ? (
                                            <p className="text-gray-500">Nenhum plugin disponivel no momento.</p>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full text-left text-sm">
                                                    <thead>
                                                        <tr className="border-b">
                                                            <th className="py-3 px-4 font-semibold text-gray-700">Item</th>
                                                            <th className="py-3 px-4 font-semibold text-gray-700">Versao/Compatibilidade</th>
                                                            <th className="py-3 px-4 font-semibold text-gray-700">Acao</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y">
                                                        {available.map((it) => (
                                                            <tr key={it.key}>
                                                                <td className="py-3 px-4 text-gray-800">
                                                                    <div className="font-medium">{it.nome || 'Plugin RG BIM Tools'}</div>
                                                                    <div className="text-xs text-gray-500">{getFileName(it)}</div>
                                                                </td>
                                                                <td className="py-3 px-4 text-gray-600">
                                                                    <div>{it.versao ? `Versao ${it.versao}` : 'Versao nao informada'}</div>
                                                                    <div className="text-xs text-gray-500">{getCompatibilityText(it)}</div>
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="small"
                                                                        disabled={downloadingKey === it.key}
                                                                        onClick={() => handleDownload(it)}
                                                                    >
                                                                        {downloadingKey === it.key ? 'Gerando...' : 'Baixar'}
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </Container>
            </Section>
        </>
    );
};
