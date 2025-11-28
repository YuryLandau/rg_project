import { Link } from 'react-router-dom';
import { Section } from '../../components/ui/Section';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';

/**
 * Seção destacando a ferramenta DWG Unificado (carro chefe)
 * Texto conforme fornecido pelo usuário preservando grafia original.
 */
export const DwgUnificadoSection: React.FC = () => {
    return (
        <Section backgroundColor="#EEF4FF">
            <Container>
                <div className="py-16">
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div className="order-2 md:order-1">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Quer unificar vários DWGs em um só?</h2>
                            <p className="text-primary text-lg font-semibold mb-3">Agora você pode!</p>
                            <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                                No plugin da RGBIM, temos a ferramenta de Unificação de DWGs, de uma maneira jamais vista antes. Nela, você pode escolher as folhas que deseja unificar para um só DWG. Ao final do processo, você terá um DWG unificado contendo todas as folhas escolhidas, separadas por layout.
                            </p>
                            <div className="mt-6">
                                <Link to="/subscribe">
                                    <Button variant="primary" size="large">Ver Planos</Button>
                                </Link>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <img
                                src="/images/Imagem_unificacao_DWG_transparente.png"
                                alt="Visual da ferramenta DWG Unificado"
                                className="w-full h-auto rounded-xl bg-white shadow-md ring-1 ring-primary/10"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
    );
};
