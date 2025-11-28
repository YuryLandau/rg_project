import { Link } from 'react-router-dom';
import { Head } from '../components/layout/Head';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';

export const PaymentCanceled = () => {
    return (
        <>
            <Head title="Pagamento Cancelado - RG BIM" description="Transação não finalizada" />
            <Section>
                <Container>
                    <div className="py-20 max-w-3xl mx-auto text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-10 h-10 text-red-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Pagamento Cancelado</h1>
                        <p className="text-lg text-gray-700 mb-8">A transação foi interrompida ou cancelada. Nenhuma cobrança foi efetuada. Você pode tentar novamente ou escolher outro plano.</p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link to="/subscribe">
                                <Button variant="primary" size="large">Escolher Plano</Button>
                            </Link>
                            <Link to="/payment">
                                <Button variant="secondary" size="large">Tentar Novamente</Button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </Section>
        </>
    );
};
