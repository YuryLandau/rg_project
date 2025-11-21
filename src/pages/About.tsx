import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { Head } from '../components/layout/Head';

/**
 * About - Página Sobre
 */
export const About = () => {
    return (
        <>
            <Head
                title="Sobre - RG BIM"
                description="Conheça mais sobre a RG BIM e suas soluções para projetos industriais no Revit"
            />

            <Section padding="lg">
                <Container size="medium">
                    <div className="prose prose-lg max-w-none">
                        <h1 className="text-4xl font-bold text-gray-900 mb-6">Sobre o RG BIM</h1>

                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <p className="text-xl">
                                <strong className="text-primary">RG BIM</strong> é uma ferramenta completa desenvolvida pela RG Projetos,
                                especializada em otimizar o fluxo de trabalho de projetos industriais no Revit.
                            </p>

                            <p>
                                Com 10 anos de experiência no mercado de saneamento, a ferramenta foi criada para atender engenheiros,
                                projetistas e empresas que buscam velocidade, padronização e confiabilidade em seus projetos BIM.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">O que é o RG BIM?</h2>
                            <p>
                                RG BIM é um plugin para Revit que oferece uma biblioteca completa de famílias paramétricas e
                                ferramentas de automação, desenvolvido especificamente para projetos industriais.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Biblioteca de Famílias</h2>
                            <p>
                                A ferramenta oferece uma biblioteca robusta de famílias paramétricas prontas para uso:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Tubulações industriais</strong> em Aço Carbono, Aço Inox, FoFo, PVC, CPVC, PEAD, e PRFV</li>
                                <li><strong>Acessórios industriais</strong> como válvulas, registros, medidores, juntas de desmontagem e suportes</li>
                                <li><strong>Inserts e suportes paramétricos</strong> totalmente configuráveis e adaptáveis a diferentes padrões</li>
                            </ul>

                            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Precisão Técnica</h2>
                            <p>
                                Todas as famílias são desenvolvidas com base em catálogos reais de fabricantes líderes do mercado como
                                <strong>Val Aço</strong>, <strong>Tigre</strong>, <strong>Saint Gobain</strong>, <strong>Joplas</strong>, entre outros,
                                garantindo precisão técnica e conformidade com normas do setor.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Ferramentas de Automação</h2>
                            <p>
                                Além da biblioteca de famílias, o RG BIM inclui ferramentas poderosas de automação:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Plotagem automatizada</strong> de folhas e vistas para DWG, DWG 3D e PDF</li>
                                <li><strong>Criação automática</strong> de tabelas padronizadas com filtros pré-configurados</li>
                                <li><strong>Verificação de tubos</strong> desconectados com navegação direta na vista 3D</li>
                                <li><strong>Corte automático de tubulações</strong> com inserção de uniões</li>
                                <li><strong>Automação de trabalhos manuais</strong> repetitivos</li>
                            </ul>

                            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Sobre a RG Projetos</h2>
                            <p>
                                O RG BIM é desenvolvido pela <strong>RG Projetos</strong>, empresa fundada há 10 anos com experiência
                                e referência no mercado de saneamento. Com foco no cliente, qualidade e compromisso com prazos,
                                a RG Projetos trabalha com grandes empresas como TanksBR, E-Água, Novaes, Bioproj, Cruzeiro do Sul e Tigre Água e Esgoto.
                            </p>

                            <div className="bg-primary/5 border-l-4 border-primary p-6 mt-8 rounded-r-lg">
                                <p className="text-gray-800 font-medium mb-2">
                                    🚀 Por que escolher o RG BIM?
                                </p>
                                <p className="text-gray-700">
                                    Com o RG BIM, você ganha velocidade, padronização e confiabilidade no desenvolvimento
                                    de projetos industriais em BIM, com a garantia de uma empresa consolidada no mercado.
                                </p>
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>
        </>
    );
};
