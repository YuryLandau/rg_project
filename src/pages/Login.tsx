import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Head } from '../components/layout/Head';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, user } = useAuth();
    const navigate = useNavigate();

    if (user) {
        navigate('/profile');
        return null;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const success = await login(email, password);
            if (success) navigate('/profile');
            else setError('Email ou senha inválidos');
        } catch (e: any) {
            setError(e?.message || 'Erro ao fazer login. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head
                title="Login - RG"
                description="Faça login na sua conta RG"
            />
            <Section>
                <Container size="small">
                    <div className="py-16 min-h-[60vh] flex items-center justify-center">
                        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                            <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Login</h1>
                            <p className="text-center text-gray-600 mb-6">Acesse sua conta RG</p>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password">Senha</label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm text-center" role="alert">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="large"
                                    disabled={loading}
                                    fullWidth
                                >
                                    {loading ? 'Entrando...' : 'Entrar'}
                                </Button>
                            </form>

                            <div className="mt-6 text-center space-y-2">
                                <p className="text-gray-600 text-sm">
                                    Não tem uma conta?{' '}
                                    <Link to="/register" className="text-primary font-semibold hover:underline transition-all">
                                        Cadastre-se
                                    </Link>
                                </p>
                                <p className="text-gray-600 text-xs">
                                    Já conhece os planos? <Link to="/subscribe" className="text-primary font-semibold hover:underline">Ver planos</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>
        </>
    );
};
