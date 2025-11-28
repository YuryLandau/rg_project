import { Link } from 'react-router-dom';
import { Head } from '../components/layout/Head';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';

export const PaymentSuccess = () => {
    return (
        <>
            <Head title="Pagamento Concluído - RG BIM" description="Assinatura confirmada" />
            <Section>
                <Container>
                    <div className="py-20 max-w-3xl mx-auto text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-10 h-10 text-green-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Pagamento Confirmado</h1>
                        <p className="text-lg text-gray-700 mb-8">Sua assinatura Premium foi ativada com sucesso. Aproveite acesso completo às bibliotecas e ferramentas avançadas.</p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link to="/profile">
                                <Button variant="primary" size="large">Ir para Perfil</Button>
                            </Link>
                            <Link to="/downloads">
                                <Button variant="secondary" size="large">Explorar Downloads</Button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </Section>
        </>
    );
};
