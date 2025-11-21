import { useState } from 'react';
import type { FormEvent } from 'react';
import { Head } from '../components/layout/Head';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';

export const Payment = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [success, setSuccess] = useState(false);

    const formatCardNumber = (value: string) => {
        return value
            .replace(/\s/g, '')
            .replace(/(\d{4})/g, '$1 ')
            .trim()
            .substring(0, 19);
    };

    const formatExpiry = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1/$2')
            .substring(0, 5);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            setCardNumber('');
            setCardName('');
            setExpiry('');
            setCvv('');
        }, 3000);
    };

    return (
        <>
            <Head
                title="Cartão de Crédito - RG"
                description="Gerencie seu método de pagamento"
            />
            <Section>
                <Container size="small">
                    <div className="py-16 min-h-[60vh]">
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cartão de Crédito</h1>
                            <p className="text-gray-600 mb-6">Adicione ou atualize seu método de pagamento</p>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <div className="form-group">
                                    <label htmlFor="cardNumber">Número do Cartão</label>
                                    <input
                                        type="text"
                                        id="cardNumber"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength={19}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="cardName">Nome no Cartão</label>
                                    <input
                                        type="text"
                                        id="cardName"
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                                        placeholder="NOME COMPLETO"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label htmlFor="expiry">Validade</label>
                                        <input
                                            type="text"
                                            id="expiry"
                                            value={expiry}
                                            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                            placeholder="MM/AA"
                                            maxLength={5}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="cvv">CVV</label>
                                        <input
                                            type="text"
                                            id="cvv"
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                                            placeholder="123"
                                            maxLength={4}
                                            required
                                        />
                                    </div>
                                </div>

                                {success && (
                                    <div className="p-3 bg-green-50 border border-green-300 rounded-lg text-green-700 text-sm text-center" role="alert">
                                        Cartão salvo com sucesso!
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="large"
                                    fullWidth
                                >
                                    Salvar Cartão
                                </Button>

                                <p className="text-center text-gray-600 text-sm mt-2">
                                    🔒 Seus dados são criptografados e seguros
                                </p>
                            </form>
                        </div>
                    </div>
                </Container>
            </Section>
        </>
    );
};
