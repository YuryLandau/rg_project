import { Head } from '../components/layout/Head';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';

export const Downloads = () => {

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
                        <p className="text-gray-600 mb-8 max-w-3xl">Lista mockada de artefatos para download (exemplo demonstrativo).</p>

                        <div className="grid gap-10">

                            {/* Tabela de downloads mockada */}
                            <div className="bg-white p-6 rounded-xl shadow">
                                <h2 className="text-xl font-bold mb-4">Downloads Disponíveis (Mock)</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="py-3 px-4 font-semibold text-gray-700">Item</th>
                                                <th className="py-3 px-4 font-semibold text-gray-700">Versão</th>
                                                <th className="py-3 px-4 font-semibold text-gray-700">Tamanho</th>
                                                <th className="py-3 px-4 font-semibold text-gray-700">Atualizado</th>
                                                <th className="py-3 px-4 font-semibold text-gray-700">Ação</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {[
                                                { nome: 'Biblioteca de Famílias – Tubulações', versao: '1.5.3', tamanho: '24 MB', data: '10/11/2025' },
                                                { nome: 'Biblioteca de Famílias – Válvulas', versao: '1.4.0', tamanho: '18 MB', data: '02/10/2025' },
                                                { nome: 'Plugin RG BIM Tools', versao: '1.5.3', tamanho: '12 MB', data: '10/11/2025' },
                                                { nome: 'Inserts e Suportes Paramétricos', versao: '1.2.1', tamanho: '9 MB', data: '15/09/2025' },
                                                { nome: 'Documentação e Templates', versao: '1.0.8', tamanho: '5 MB', data: '01/08/2025' },
                                                { nome: 'Tabelas RG BIM (Filtros Prontos)', versao: '1.3.2', tamanho: '3 MB', data: '20/10/2025' }
                                            ].map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="py-3 px-4 text-gray-800">{item.nome}</td>
                                                    <td className="py-3 px-4 text-gray-600">{item.versao}</td>
                                                    <td className="py-3 px-4 text-gray-600">{item.tamanho}</td>
                                                    <td className="py-3 px-4 text-gray-600">{item.data}</td>
                                                    <td className="py-3 px-4">
                                                        <Button variant="outline" size="small">Baixar</Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>
        </>
    );
};
