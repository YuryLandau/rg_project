import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Head } from '../components/layout/Head';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { registerUser, validateUserCode } from '../services/api';

export const Register = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<'form' | 'code' | 'done'>('form');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [senhaConfirmacao, setSenhaConfirmacao] = useState('');
    const [codigo, setCodigo] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmitCadastro = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        if (senha !== senhaConfirmacao) {
            setError('Senhas não conferem.');
            return;
        }
        setLoading(true);
        try {
            await registerUser(nome, email, senha, senhaConfirmacao);
            setStep('code');
            setSuccessMsg('Código enviado para seu e-mail. Verifique sua caixa de entrada.');
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao enviar código.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitCodigo = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        if (!codigo) {
            setError('Informe o código.');
            return;
        }
        setLoading(true);
        try {
            await validateUserCode(email, codigo);
            setStep('done');
            setSuccessMsg('Usuário criado com sucesso! Agora faça login.');
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Código inválido ou expirado.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="Cadastro - RG" description="Crie sua conta RG" />
            <Section>
                <Container size="small">
                    <div className="py-16 min-h-[60vh] flex items-center justify-center">
                        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                            <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Cadastro</h1>
                            <p className="text-center text-gray-600 mb-6">
                                {step === 'form' && 'Preencha seus dados para iniciar.'}
                                {step === 'code' && 'Digite o código enviado para seu e-mail.'}
                                {step === 'done' && 'Cadastro concluído.'}
                            </p>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm text-center mb-4" role="alert">
                                    {error}
                                </div>
                            )}
                            {successMsg && (
                                <div className="p-3 bg-green-50 border border-green-300 rounded-lg text-green-700 text-sm text-center mb-4" role="alert">
                                    {successMsg}
                                </div>
                            )}

                            {step === 'form' && (
                                <form onSubmit={handleSubmitCadastro} className="flex flex-col gap-5">
                                    <div className="form-group">
                                        <label htmlFor="nome">Nome</label>
                                        <input id="nome" type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome completo" required disabled={loading} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" required disabled={loading} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="senha">Senha</label>
                                        <input id="senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Senha" required disabled={loading} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="senhaConfirmacao">Confirmar Senha</label>
                                        <input id="senhaConfirmacao" type="password" value={senhaConfirmacao} onChange={e => setSenhaConfirmacao(e.target.value)} placeholder="Repita a senha" required disabled={loading} />
                                    </div>
                                    <Button type="submit" variant="primary" size="large" disabled={loading} fullWidth>
                                        {loading ? 'Enviando...' : 'Enviar Código'}
                                    </Button>
                                    <p className="text-center text-sm text-gray-600">Já tem conta? <Link to="/login" className="text-primary font-semibold">Entrar</Link></p>
                                </form>
                            )}

                            {step === 'code' && (
                                <form onSubmit={handleSubmitCodigo} className="flex flex-col gap-5">
                                    <div className="form-group">
                                        <label htmlFor="codigo">Código de Verificação</label>
                                        <input id="codigo" type="text" value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="Ex: 123456" required disabled={loading} />
                                    </div>
                                    <Button type="submit" variant="primary" size="large" disabled={loading} fullWidth>
                                        {loading ? 'Validando...' : 'Validar Código'}
                                    </Button>
                                    <Button type="button" variant="outline" size="small" disabled={loading} onClick={() => setStep('form')}>Voltar</Button>
                                </form>
                            )}

                            {step === 'done' && (
                                <div className="flex flex-col gap-4">
                                    <Button variant="primary" size="large" fullWidth onClick={() => navigate('/login')}>Ir para Login</Button>
                                    <Button variant="outline" size="small" onClick={() => { setStep('form'); setCodigo(''); setSenha(''); setSenhaConfirmacao(''); }}>Novo Cadastro</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </Container>
            </Section>
        </>
    );
};
