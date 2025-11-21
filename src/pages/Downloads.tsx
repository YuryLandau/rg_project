import { useEffect, useState } from 'react';
import { Head } from '../components/layout/Head';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { getPluginDownloadLinks, downloadProductFile } from '../services/api';

interface PluginLinkMap { [key: string]: string | number | null | undefined; }

export const Downloads = () => {
    const { user, accessToken } = useAuth();
    const [pluginLinks, setPluginLinks] = useState<Record<string, string>>({});
    const [material, setMaterial] = useState('Tubos');
    const [fileName, setFileName] = useState('');
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            if (!accessToken) return;
            try {
                const data = await getPluginDownloadLinks(accessToken);
                // Remove status e filtra apenas URLs
                const links: Record<string, string> = {};
                Object.entries(data).forEach(([k, v]) => {
                    if (k !== 'status' && typeof v === 'string') links[k] = v;
                });
                setPluginLinks(links);
            } catch (e: any) {
                // Silencia se não encontrado
            }
        };
        load();
    }, [accessToken]);

    const handleDownloadProduto = async () => {
        if (!accessToken) {
            setError('É necessário estar logado.');
            return;
        }
        setError('');
        setDownloading(true);
        try {
            const blob = await downloadProductFile(accessToken, material, fileName || undefined);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName || `${material}.bin`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (e: any) {
            setError(e?.message || 'Erro ao baixar arquivo');
        } finally {
            setDownloading(false);
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
                    <div className="py-16">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Downloads</h1>
                        <p className="text-gray-600 mb-8 max-w-3xl">Acesse biblioteca de famílias (Revit) e plugins. Plano Premium necessário para arquivos de produto.</p>

                        <div className="grid gap-10">
                            <div className="bg-white p-6 rounded-xl shadow flex flex-col gap-4">
                                <h2 className="text-xl font-bold">Download de Arquivos de Produto</h2>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="form-group flex flex-col gap-1">
                                        <label className="text-sm font-medium" htmlFor="material">Material</label>
                                        <input id="material" value={material} onChange={e => setMaterial(e.target.value)} placeholder="Ex: Tubos" />
                                    </div>
                                    <div className="form-group flex flex-col gap-1">
                                        <label className="text-sm font-medium" htmlFor="fileName">Nome (opcional)</label>
                                        <input id="fileName" value={fileName} onChange={e => setFileName(e.target.value)} placeholder="Ex: RG_Tubos_2025.rte" />
                                    </div>
                                    <div className="flex items-end">
                                        <Button variant="primary" size="medium" disabled={downloading || !user} onClick={handleDownloadProduto}>
                                            {downloading ? 'Baixando...' : 'Baixar'}
                                        </Button>
                                    </div>
                                </div>
                                {!user && <p className="text-sm text-red-600">Faça login para baixar.</p>}
                                {error && <p className="text-sm text-red-600">{error}</p>}
                                <p className="text-xs text-gray-500">Se não informar nome, tenta baixar template do material.</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow flex flex-col gap-4">
                                <h2 className="text-xl font-bold">Plugins Revit</h2>
                                {!user && <p className="text-sm text-red-600">Faça login para ver links de plugins.</p>}
                                {user && Object.keys(pluginLinks).length === 0 && <p className="text-sm text-gray-600">Nenhum plugin disponível ou não encontrado.</p>}
                                <ul className="divide-y divide-gray-200">
                                    {Object.entries(pluginLinks).map(([key, url]) => (
                                        <li key={key} className="py-3 flex items-center justify-between">
                                            <span className="font-medium">{key}</span>
                                            <a href={url} className="text-sm">
                                                <Button variant="outline" size="small">Baixar</Button>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>
        </>
    );
};
