import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cancelSubscription } from '../services/api';
import { Head } from '../components/layout/Head';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';

export const Profile = () => {
    const navigate = useNavigate();
    const { user, refreshProfile, accessToken } = useAuth();

    useEffect(() => {
        refreshProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCancelSubscription = async () => {
        if (!accessToken) return;
        try {
            await cancelSubscription(accessToken);
            await refreshProfile();
            alert('Assinatura cancelada.');
        } catch (e: any) {
            alert(e?.message || 'Erro ao cancelar assinatura');
        }
    };

    return (
        <>
            <Head
                title="Meu Perfil - RG"
                description="Gerencie suas informações pessoais"
            />
            <Section>
                <Container size="small">
                    <div className="py-16 min-h-[60vh]">
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
                            <p className="text-gray-600 mb-6">Seus dados estão protegidos. Para alterar sua senha, use o botão abaixo.</p>

                            <div className="flex flex-col gap-5">
                                <div className="form-group">
                                    <label htmlFor="name">Nome</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={user?.name || ''}
                                        disabled
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={user?.email || ''}
                                        disabled
                                    />
                                </div>

                                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-900">Plano Atual:</span>
                                        <span className="text-primary font-semibold uppercase text-sm">{user?.plan || 'Free'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button type="button" className="cursor-pointer" variant="primary" size="small" onClick={() => navigate('/subscribe')} fullWidth>
                                            {user?.plan === 'premium' ? 'Ver Planos' : 'Mudar de Plano'}
                                        </Button>
                                        {user?.plan === 'premium' && (
                                            <Button type="button" variant="outline" size="small" onClick={handleCancelSubscription} fullWidth>
                                                Cancelar Assinatura
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    className="cursor-pointer"
                                    variant="outline"
                                    size="large"
                                    fullWidth
                                    onClick={() => navigate('/change-password')}>
                                    Alterar senha
                                </Button>
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>
        </>
    );
};
