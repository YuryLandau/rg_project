import { Head } from '../components/layout/Head';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { getPluginDownloadLinks } from '../services/api';

type TutorialVideo = {
    id: string;
    title: string;
    description: string;
    category: string;
    level: string;
};

const tutorialVideos: TutorialVideo[] = [
    {
        id: 'nr9XQFQcLlM',
        title: 'Como Cortar Tubos no Revit com o plugin da RG BIM',
        description: 'Aprenda o processo completo de cortar tubos.',
        category: 'Cortar Tubos',
        level: 'Iniciante'
    },
    {
        id: 'QX5dQTlDAMc',
        title: 'Como exportar DWGs no Revit com o plugin da RG BIM',
        description: 'Veja como exportar DWGs no Revit com o plugin da RG BIM.',
        category: 'Plotagem DWG',
        level: 'Iniciante'
    },
    {
        id: '75D-x_qI_8k',
        title: 'Como exportar PDFs no Revit com o plugin da RG BIM',
        description: 'Entenda como exportar PDFs no Revit com o plugin da RG BIM de forma rápida.',
        category: 'Plotagem PDF',
        level: 'Iniciante'
    },
    {
        id: 'Nag_w8tTOBY',
        title: 'Como Verificar Tubos no Revit com o plugin da RG BIM',
        description: 'Tutorial completo verificação de tubos no Revit com o plugin da RG BIM.',
        category: 'Verificar Tubos',
        level: 'Iniciante'
    }
];

export const TutoriaisPlugin = () => {
    return (
        <>
            <Head
                title="Tutoriais Plugin - RG BIM"
                description="Tutoriais em vídeo para aprender a usar o plugin RG BIM no Revit."
            />
            <Section>
                <Container>
                    <div className="py-0">
                        <div className="max-w-3xl mx-auto text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                Aprenda a usar o plugin da RG BIM
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Escolha o tutorial que deseja assistir e acompanhe o passo a passo
                                de cada funcionalidade do plugin.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {tutorialVideos.map((video) => (
                                <article
                                    key={video.id}
                                    className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100"
                                >
                                    <div className="aspect-video bg-gray-100">
                                        <iframe
                                            className="w-full h-full"
                                            src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                                            title={video.title}
                                            loading="lazy"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            referrerPolicy="strict-origin-when-cross-origin"
                                            allowFullScreen
                                        />
                                    </div>

                                    <div className="p-6">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                                                {video.category}
                                            </span>
                                            <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                                                {video.level}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                            {video.title}
                                        </h3>

                                        <p className="text-gray-600 leading-relaxed mb-6">
                                            {video.description}
                                        </p>

                                        <a
                                            href={`https://www.youtube.com/watch?v=${video.id}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-block w-full"
                                        >
                                            <Button variant="primary" size="large" fullWidth>
                                                Assistir no YouTube
                                            </Button>
                                        </a>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </Container>
            </Section>

            <Section backgroundColor="#F8FAFC">
                <Container>
                    <div className="py-16">
                        <div className="max-w-5xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-lg border border-primary/10 p-8 md:p-10">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                    <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                                        <h3 className="text-primary text-xl font-bold mb-2">Instalação</h3>
                                        <p className="text-gray-600">
                                            Aprenda a instalar corretamente e começar a usar o plugin.
                                        </p>
                                    </div>

                                    <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                                        <h3 className="text-primary text-xl font-bold mb-2">Fluxos práticos</h3>
                                        <p className="text-gray-600">
                                            Veja exemplos reais de uso das ferramentas no dia a dia.
                                        </p>
                                    </div>

                                    <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                                        <h3 className="text-primary text-xl font-bold mb-2">Produtividade</h3>
                                        <p className="text-gray-600">
                                            Descubra como acelerar a documentação técnica no Revit.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>
        </>
    );
};