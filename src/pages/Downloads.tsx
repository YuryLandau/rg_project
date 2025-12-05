import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Head } from '../components/layout/Head';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { getPluginDownloadLinks, normalizePluginLinks, type PluginItem } from '../services/api';

export const Downloads = () => {
    const { accessToken, user } = useAuth();
    const [available, setAvailable] = useState<PluginItem[]>([]);
    const [loading, setLoading] = useState(false);
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
            } catch (e: any) {
                if (active) {
                    setError(e?.message || 'Falha ao carregar downloads');
                    setAvailable([]);
                }
            } finally {
                if (active) setLoading(false);
            }
        }
        loadLinks();
        return () => { active = false; };
    }, [accessToken]);

    const handleDownload = async (url: string, filename: string) => {
        try {
            const headers: HeadersInit = {};
            if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
            const res = await fetch(url, { headers });
            if (!res.ok) throw new Error('Arquivo indisponível (HTTP ' + res.status + ')');
            const blob = await res.blob();
            const objectUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = objectUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(objectUrl);
        } catch (e: any) {
            setError(e?.message || 'Falha ao iniciar download');
        }
    };

    return (
        <>
            <Head
                title="Downloads - RG BIM"
                description="Baixe famílias paramétricas e ferramentas para Revit"
            />
            <Section>
                <Container>
                    <div className="pb-16">
                        {/* Logo relação Revit + RGBIM (ilustração discreta) */}
                        <div className="flex justify-center mb-10">
                            <figure className="text-center">
                                <img
                                    src="/images/Revit_Bim.jpeg"
                                    alt="Integração entre Autodesk Revit e RG BIM"
                                    className="w-full max-w-xs md:max-w-sm h-auto rounded-lg shadow-sm"
                                    loading="lazy"
                                />
                                <figcaption className="mt-2 text-xs text-gray-500">Ferramentas RG BIM integradas ao fluxo de trabalho no Revit</figcaption>
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
                                    <p className="text-gray-600 mb-6">Para visualizar e baixar os plugins RG BIM Tools, faça login ou cadastre-se gratuitamente.</p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Link to="/login">
                                            <Button variant="primary" size="large">Fazer Login</Button>
                                        </Link>
                                        <Link to="/register">
                                            <Button variant="secondary" size="large">Criar Conta Grátis</Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-600 mb-4 max-w-3xl">Plugins disponíveis para download com sua conta.</p>
                                {error && <p className="text-red-600 mb-4">{error}</p>}

                                <div className="grid gap-10">
                                    <div className="bg-white p-6 rounded-xl shadow">
                                        <h2 className="text-xl font-bold mb-4">Downloads Disponíveis</h2>
                                        {loading ? (
                                            <p className="text-gray-500">Carregando...</p>
                                        ) : available.length === 0 ? (
                                            <p className="text-gray-500">Nenhum plugin disponível no momento.</p>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full text-left text-sm">
                                                    <thead>
                                                        <tr className="border-b">
                                                            <th className="py-3 px-4 font-semibold text-gray-700">Item</th>
                                                            <th className="py-3 px-4 font-semibold text-gray-700">Versão/Compatibilidade</th>
                                                            <th className="py-3 px-4 font-semibold text-gray-700">Ação</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y">
                                                        {available.map((it) => (
                                                            <tr key={it.key}>
                                                                <td className="py-3 px-4 text-gray-800">Plugin RG BIM Tools</td>
                                                                <td className="py-3 px-4 text-gray-600">Revit {it.year || it.key.replace('Plugin', '')}</td>
                                                                <td className="py-3 px-4">
                                                                    <Button variant="outline" size="small" onClick={() => handleDownload(it.url, `${it.key}.addin`)}>Baixar</Button>
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
