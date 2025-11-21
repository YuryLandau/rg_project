import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { startSubscription } from '../services/api';
import { Head } from '../components/layout/Head';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';

interface Plan {
    id: string;
    name: string;
    price: string;
    period: string;
    features: string[];
    highlighted?: boolean;
}

const plans: Plan[] = [
    {
        id: 'free',
        name: 'Gratuito',
        price: 'R$ 0',
        period: '/mês',
        features: [
            'Plotagem DWG (múltiplos arquivos)',
            'Plotagem DWG 3D',
            'Plotagem PDF (unificado ou múltiplos)',
            '10 downloads por mês',
            'Suporte por email',
            'Documentação básica'
        ]
    },
    {
        id: 'premium',
        name: 'Premium',
        price: 'R$ 99',
        period: '/mês',
        highlighted: true,
        features: [
            'Tudo do plano gratuito',
            'Biblioteca completa de Conexões',
            'Biblioteca completa de Tubulações',
            'Tabelas RGBIM com filtros prontos',
            'DWG unificado (via AutoCAD)',
            'Cortar Tubos automaticamente',
            'Verificar Tubos desconectados',
            'Downloads ilimitados',
            'Suporte prioritário',
            'Atualizações automáticas'
        ]
    }
];

export const Subscribe = () => {
    const { user, accessToken, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    const handleSelectPlan = async (planId: string) => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (planId === 'free') {
            alert('Plano gratuito já está ativo. Para Premium inicie o checkout.');
            return;
        }
        if (!accessToken) {
            alert('Token ausente. Faça login novamente.');
            navigate('/login');
            return;
        }
        setSelectedPlan(planId);
        try {
            const url = await startSubscription(accessToken);
            // Frontend redireciona para Stripe
            window.location.href = url;
        } catch (e: any) {
            setSelectedPlan(null);
            alert(e?.message || 'Erro ao iniciar assinatura');
            await refreshProfile();
        }
    };

    return (
        <>
            <Head
                title="Assinaturas - RG BIM"
                description="Escolha o plano ideal para seu projeto industrial no Revit"
            />
            <Section>
                <Container>
                    <div className="py-16">
                        <div className="text-center mb-16">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">Escolha seu Plano</h1>
                            <p className="text-lg text-gray-600">Acelere seus projetos industriais com acesso à biblioteca completa de famílias RG BIM</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {plans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className={`bg-white border-2 ${plan.highlighted ? 'border-primary shadow-lg scale-105' : 'border-gray-200'} rounded-xl p-8 flex flex-col relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                                >
                                    {plan.highlighted && (
                                        <div className="absolute -top-3 right-6 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">Recomendado</div>
                                    )}

                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h2>

                                    <div className="mb-6">
                                        <span className="text-4xl font-bold text-primary">{plan.price}</span>
                                        <span className="text-gray-600 ml-2">{plan.period}</span>
                                    </div>

                                    <ul className="mb-8 flex-1 space-y-3">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-center gap-3 text-gray-700">
                                                <span className="text-primary font-bold text-lg shrink-0">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        variant={plan.highlighted ? 'primary' : 'outline'}
                                        size="large"
                                        onClick={() => handleSelectPlan(plan.id)}
                                        disabled={selectedPlan === plan.id || (user?.plan === 'premium' && plan.id === 'premium')}
                                        fullWidth
                                    >
                                        {user?.plan === 'premium' && plan.id === 'premium'
                                            ? 'Plano Premium Ativo'
                                            : selectedPlan === plan.id
                                                ? 'Redirecionando...'
                                                : plan.id === 'premium'
                                                    ? 'Assinar'
                                                    : 'Selecionar'}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </Section>
        </>
    );
};
