import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/sections/HeroSection';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { DwgUnificadoSection } from '../components/sections/DwgUnificadoSection';
import { Head } from '../components/layout/Head';
import { useAuth } from '../context/AuthContext';
import { getPluginDownloadLinks, latestPlugin, normalizePluginLinks } from '../services/api';

export const Home = () => {
    const { accessToken } = useAuth();
    const [heroVersion, setHeroVersion] = useState<string | undefined>(undefined);

    useEffect(() => {
        let active = true;
        async function loadLatest() {
            if (!accessToken) {
                setHeroVersion(undefined);
                return;
            }
            try {
                const raw = await getPluginDownloadLinks(accessToken);
                if (!active) return;
                const items = normalizePluginLinks(raw);
                const lp = latestPlugin(items);
                setHeroVersion(lp?.year ? String(lp.year) : undefined);
            } catch {
                if (active) setHeroVersion(undefined);
            }
        }
        loadLatest();
        return () => { active = false; };
    }, [accessToken]);
    return (
        <>
            <Head
                title="RG BIM - Famílias Paramétricas para Revit"
                description="Biblioteca completa de famílias paramétricas para projetos industriais no Revit"
            />
            <HeroSection
                title="RG BIM"
                subtitle="Famílias Paramétricas para Projetos Industriais no Revit"
                description="Biblioteca + Automação para acelerar documentação técnica no Revit. Exportações unificadas e verificação inteligente de tubulações."
                backgroundImage="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2072"
                overlay={true}
                version={heroVersion}
                downloadHref="/downloads"
                videoSrc="/images/video_3.mp4"
                alignment="left"
                actions={
                    <>
                        <Link to="/downloads">
                            <Button variant="primary" size="large">
                                Baixar Agora
                            </Button>
                        </Link>
                        <Link to="/subscribe">
                            <Button variant="secondary" size="large">
                                Ver Planos
                            </Button>
                        </Link>
                    </>
                }
            />

            {/* DWG Unificado Section (Carro Chefe) */}
            <DwgUnificadoSection />

            {/* Sobre o Projeto Section */}
            <Section>
                <Container>
                    <div className="pb-16 pt-10">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-4xl font-bold text-gray-900 text-center mb-6">Sobre o RG BIM</h2>
                            <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                                <p className="text-center text-xl">
                                    <strong className="text-primary">RG BIM</strong> é uma ferramenta completa para projetos industriais no Revit,
                                    desenvolvida pela RG Projetos com 10 anos de experiência no mercado de saneamento.
                                </p>
                                <p className="text-center text-gray-600">
                                    Plugin que oferece biblioteca de famílias paramétricas e ferramentas de automação,
                                    otimizando o fluxo de trabalho de engenheiros e projetistas que trabalham com empresas como
                                    <strong>TanksBR</strong>, <strong>E-Água</strong>, <strong>Novaes</strong>, <strong>Bioproj</strong>, <strong>Cruzeiro do Sul</strong> e <strong>Tigre Água e Esgoto</strong>.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                                    <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                                        <h3 className="text-xl font-bold text-primary mb-3">📚 Portfólio Completo</h3>
                                        <p className="text-gray-700">
                                            Tubulações industriais em diversos materiais (Aço Carbono, Inox, FoFo, PVC, CPVC, PEAD, PRFV),
                                            acessórios industriais e suportes paramétricos configuráveis.
                                        </p>
                                    </div>
                                    <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                                        <h3 className="text-xl font-bold text-primary mb-3">⚡ Nosso Diferencial</h3>
                                        <p className="text-gray-700">
                                            Prazo garantido sem histórico de atraso, excelentes preços e qualidade comprovada.
                                            Famílias baseadas em catálogos reais de fabricantes.
                                        </p>
                                    </div>
                                    <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                                        <h3 className="text-xl font-bold text-primary mb-3">🎯 Nossa Missão</h3>
                                        <p className="text-gray-700">
                                            Fornecer excelentes serviços de projetos e design que atendam ao funcional e estético,
                                            com compromisso total com prazos e satisfação do cliente.
                                        </p>
                                    </div>
                                </div>
                                <div className="text-center mt-8">
                                    <Link to="/about">
                                        <Button variant="outline" size="large">
                                            Saiba Mais Sobre Nós
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>

            <Section backgroundColor="#6495ED">
                <Container>
                    <div className="py-16">
                        <h2 className="text-4xl font-bold text-white text-center mb-4">Soluções BIM para Projetos Industriais</h2>
                        <p className="text-center text-white/90 mb-12 max-w-3xl mx-auto">
                            Biblioteca completa de famílias paramétricas desenvolvidas com precisão técnica para otimizar seu fluxo de trabalho no Revit.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                            <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                <h3 className="text-primary text-2xl font-bold mb-4">Famílias Paramétricas</h3>
                                <p className="text-gray-600 leading-relaxed">Tubulações industriais, válvulas, registros, medidores e muito mais baseados em catálogos reais de fabricantes.</p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                <h3 className="text-primary text-2xl font-bold mb-4">Automação e Produtividade</h3>
                                <p className="text-gray-600 leading-relaxed">Plotagem automatizada, tabelas padronizadas e verificação de entidades para acelerar seu trabalho.</p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                <h3 className="text-primary text-2xl font-bold mb-4">Precisão Técnica</h3>
                                <p className="text-gray-600 leading-relaxed">Famílias desenvolvidas com base em catálogos de Val Aço, Tigre, Saint Gobain, Joplas e outros fabricantes.</p>
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>

            {/* Ferramentas Section */}
            <Section>
                <Container>
                    <div className="py-16">
                        <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">Ferramentas RG BIM</h2>
                        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
                            Acelere seu trabalho com nossas ferramentas especializadas para projetos industriais no Revit.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Conexões */}
                            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="flex justify-center mb-4">
                                    <img src="/images/conexoes_icon.png" alt="Conexões" className="w-16 h-16 object-contain" />
                                </div>
                                <h3 className="text-primary text-xl font-bold mb-2 text-center">Conexões</h3>
                                <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">Premium</span>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Acesse uma vasta lista de conexões de tubo (Curva, Cap, Cruzeta) em diversos materiais (Aço Inox, Aço Carbono, Ferro Fundido) para importar em seu projeto.
                                </p>
                            </div>

                            {/* Tubulações */}
                            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="flex justify-center mb-4">
                                    <img src="/images/tubulacoes_icon.png" alt="Tubulações" className="w-16 h-16 object-contain" />
                                </div>
                                <h3 className="text-primary text-xl font-bold mb-2 text-center">Tubulações</h3>
                                <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">Premium</span>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Lista completa de tubos em diversos materiais diferentes (Aço Inox, Aço Carbono, Ferro Fundido). Importe os modelos que precisar para seu projeto.
                                </p>
                            </div>

                            {/* Tabelas */}
                            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="flex justify-center mb-4">
                                    <img src="/images/tabelas_icon.png" alt="Tabelas" className="w-16 h-16 object-contain" />
                                </div>
                                <h3 className="text-primary text-xl font-bold mb-2 text-center">Tabelas</h3>
                                <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">Premium</span>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Tabelas RGBIM prontas para importação. Adicione filtros prontos e importe tabelas já configuradas para seu projeto.
                                </p>
                            </div>

                            {/* DWG */}
                            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="flex justify-center mb-4">
                                    <img src="/images/dwg_icon.png" alt="DWG" className="w-16 h-16 object-contain" />
                                </div>
                                <h3 className="text-primary text-xl font-bold mb-2 text-center">DWG</h3>
                                <span className="inline-block bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">Gratuito</span>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Plote folhas do seu projeto para DWG. Escolha entre DWG unificado (Premium) ou múltiplos DWGs separados.
                                </p>
                            </div>

                            {/* DWG 3D */}
                            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="flex justify-center mb-4">
                                    <img src="/images/dwg_3d_icon.png" alt="DWG 3D" className="w-16 h-16 object-contain" />
                                </div>
                                <h3 className="text-primary text-xl font-bold mb-2 text-center">DWG 3D</h3>
                                <span className="inline-block bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">Gratuito</span>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Plote vistas 3D do seu projeto diretamente para DWG 3D. Selecione a vista desejada e exporte facilmente.
                                </p>
                            </div>

                            {/* PDF */}
                            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="flex justify-center mb-4">
                                    <img src="/images/pdf_icon.png" alt="PDF" className="w-16 h-16 object-contain" />
                                </div>
                                <h3 className="text-primary text-xl font-bold mb-2 text-center">PDF</h3>
                                <span className="inline-block bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">Gratuito</span>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Plote folhas do projeto para PDF. Una todas em um PDF unificado ou gere múltiplos PDFs, um para cada folha.
                                </p>
                            </div>

                            {/* Cortar Tubos */}
                            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="flex justify-center mb-4">
                                    <img src="/images/cortar_tubos_icon.png" alt="Cortar Tubos" className="w-16 h-16 object-contain" />
                                </div>
                                <h3 className="text-primary text-xl font-bold mb-2 text-center">Cortar Tubos</h3>
                                <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">Premium</span>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Corte automaticamente tubulações com medidas padronizadas. Uniões são inseridas automaticamente nos locais dos cortes.
                                </p>
                            </div>

                            {/* Verificar Tubos */}
                            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="flex justify-center mb-4">
                                    <img src="/images/verificar_tubos_icon.png" alt="Verificar Tubos" className="w-16 h-16 object-contain" />
                                </div>
                                <h3 className="text-primary text-xl font-bold mb-2 text-center">Verificar Tubos</h3>
                                <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">Premium</span>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Verifique tubos com extremidades desconectadas. Lista automática com navegação direta para o local do tubo na vista 3D.
                                </p>
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>


            {/* Download Section */}
            <Section backgroundColor="#6495ED">
                <Container>
                    <div className="py-16">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-4xl font-bold text-white mb-4">Baixe a Última Versão</h2>
                            <p className="text-white/90 text-lg mb-8">
                                Acesse agora o plugin RG BIM Tools com todas as funcionalidades mais recentes.
                            </p>
                            <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-2xl mx-auto">
                                <div className="flex items-center justify-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-primary">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                        </svg>
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-2xl font-bold text-gray-900">Plugin RG BIM Tools</h3>
                                        <p className="text-gray-600">Compatível com Revit {heroVersion ?? '2025+'} • veja todas as versões</p>
                                    </div>
                                </div>
                                <div className="space-y-3 text-left mb-6">
                                    <p className="text-sm text-gray-700"><strong>Novidades:</strong></p>
                                    <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                                        <li>Melhoria na performance de importação de famílias</li>
                                        <li>Novo algoritmo de verificação de tubos</li>
                                        <li>Suporte para Revit 2025</li>
                                        <li>Correção de bugs e melhorias gerais</li>
                                    </ul>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link to="/downloads" className="flex-1">
                                        <Button variant="primary" size="large" fullWidth>
                                            Baixar Agora
                                        </Button>
                                    </Link>
                                    <Link to="/downloads" className="flex-1">
                                        <Button variant="outline" size="large" fullWidth>
                                            Ver Todas as Versões
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>

            {/* Planos Section */}
            <Section>
                <Container>
                    <div className="py-16">
                        <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">Plano Gratuito vs Premium</h2>
                        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
                            Compare os recursos disponíveis em cada plano e escolha o ideal para suas necessidades.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {/* Plano Gratuito */}
                            <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
                                <div className="text-center mb-6">
                                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Gratuito</h3>
                                    <p className="text-gray-600">Ferramentas essenciais</p>
                                </div>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary font-bold text-xl shrink-0 mt-0.5">✓</span>
                                        <span className="text-gray-700">Plotagem DWG (múltiplos arquivos)</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary font-bold text-xl shrink-0 mt-0.5">✓</span>
                                        <span className="text-gray-700">Plotagem DWG 3D</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary font-bold text-xl shrink-0 mt-0.5">✓</span>
                                        <span className="text-gray-700">Plotagem PDF (unificado ou múltiplos)</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary font-bold text-xl shrink-0 mt-0.5">✓</span>
                                        <span className="text-gray-700">10 downloads por mês</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary font-bold text-xl shrink-0 mt-0.5">✓</span>
                                        <span className="text-gray-700">Suporte por email</span>
                                    </li>
                                </ul>
                                <div className="mt-8">
                                    <Link to="/subscribe">
                                        <Button variant="outline" size="large" fullWidth>
                                            Começar Grátis
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Plano Premium */}
                            <div className="bg-linear-to-br from-primary/5 to-primary/10 border-2 border-primary rounded-xl p-8 relative">
                                <div className="absolute -top-3 right-6 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                                    Recomendado
                                </div>
                                <div className="text-center mb-6">
                                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Premium</h3>
                                    <p className="text-gray-600">Recursos completos</p>
                                </div>
                                <div className="mb-4 pb-4 border-b border-primary/20">
                                    <p className="text-sm font-semibold text-primary">Tudo do plano gratuito +</p>
                                </div>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary font-bold text-xl shrink-0 mt-0.5">✓</span>
                                        <span className="text-gray-700">Biblioteca completa de Conexões</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary font-bold text-xl shrink-0 mt-0.5">✓</span>
                                        <span className="text-gray-700">Biblioteca completa de Tubulações</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary font-bold text-xl shrink-0 mt-0.5">✓</span>
                                        <span className="text-gray-700">Tabelas RGBIM com filtros prontos</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary font-bold text-xl shrink-0 mt-0.5">✓</span>
                                        <span className="text-gray-700">DWG unificado (via AutoCAD)</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary font-bold text-xl shrink-0 mt-0.5">✓</span>
                                        <span className="text-gray-700">Cortar Tubos automaticamente</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary font-bold text-xl shrink-0 mt-0.5">✓</span>
                                        <span className="text-gray-700">Verificar Tubos desconectados</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary font-bold text-xl shrink-0 mt-0.5">✓</span>
                                        <span className="text-gray-700">Downloads ilimitados</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary font-bold text-xl shrink-0 mt-0.5">✓</span>
                                        <span className="text-gray-700">Suporte prioritário</span>
                                    </li>
                                </ul>
                                <div className="mt-8">
                                    <Link to="/subscribe">
                                        <Button variant="primary" size="large" fullWidth>
                                            Assinar Premium
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>
        </>
    );
};
