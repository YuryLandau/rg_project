import { useEffect, useState } from 'react';
import { getErrorMessage, subscriptionRefund, type SubscriptionRefund as Refund } from '../../services/api';
import { Button } from '../ui/Button';

const statusMessage = {
    processing: 'Solicitação recebida. Estamos verificando sua contratação.',
    pending: 'A Stripe recebeu o estorno. A devolução no cartão está em processamento.',
    refunded: 'A Stripe concluiu o estorno. A data em que o crédito aparece depende do emissor do cartão.',
    review: 'Solicitação recebida para análise pelo atendimento.',
};

export const SubscriptionRefund = ({ accessToken, refreshProfile }: {
    accessToken: string;
    refreshProfile: () => Promise<void>;
}) => {
    const [refund, setRefund] = useState<Refund>();
    const [confirming, setConfirming] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const status = refund?.status;

    useEffect(() => {
        if (status === 'pending' || status === 'refunded' || status === 'review') {
            void refreshProfile();
        }
    }, [status, refreshProfile]);

    useEffect(() => {
        const controller = new AbortController();
        const load = () => subscriptionRefund(accessToken, 'GET', controller.signal)
            .then(result => {
                if (!controller.signal.aborted) setRefund(result);
            })
            .catch(() => {
                if (!controller.signal.aborted && !status) {
                    setRefund({ status: 'eligibility_unavailable' });
                }
            });

        if (!status) void load();
        const interval = status === 'processing' || status === 'pending'
            ? window.setInterval(load, status === 'processing' ? 5000 : 30000)
            : undefined;

        return () => {
            controller.abort();
            window.clearInterval(interval);
        };
    }, [accessToken, status]);

    const submit = async () => {
        setSubmitting(true);
        setError('');
        try {
            setRefund(await subscriptionRefund(accessToken, 'POST'));
            setConfirming(false);
        } catch (error) {
            setConfirming(false);
            setRefund(undefined);
            setError(getErrorMessage(error, 'Não foi possível confirmar o recebimento. Tente novamente ou fale com o atendimento.'));
        } finally {
            setSubmitting(false);
        }
    };

    const supportLink = (
        <a className="text-primary underline" href="mailto:contato@rgprojeto.com.br">Falar com o atendimento</a>
    );
    const requestStatus = status === 'processing' || status === 'pending' || status === 'refunded' || status === 'review'
        ? status
        : undefined;
    const needsSupport = status === 'ineligible' || status === 'eligibility_unavailable' || status === 'review';

    if (status !== 'available' && !requestStatus && !refund?.earlierProtocol) {
        if (!needsSupport && !error) return null;

        return (
            <div className="space-y-2 text-sm">
                {error && <p role="alert">{error}</p>}
                {supportLink}
            </div>
        );
    }

    return (
        <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-gray-700">
            <h2 className="font-semibold text-gray-900">Cancelamento por arrependimento</h2>
            {refund?.earlierProtocol && <p className="break-all">Solicitação anterior para análise. Protocolo {refund.earlierProtocol}</p>}
            {status === 'available' && (
                <>
                    <p>Você pode solicitar a devolução dos valores da contratação, conforme o direito de arrependimento.</p>
                    {confirming ? (
                        <>
                            <p>Se o pedido for elegível, sua assinatura e seu acesso Premium serão encerrados.</p>
                            <div className="flex flex-wrap gap-2">
                                <Button type="button" size="small" disabled={submitting} onClick={submit}>
                                    {submitting ? 'Enviando...' : 'Confirmar solicitação'}
                                </Button>
                                <Button type="button" variant="outline" size="small" disabled={submitting} onClick={() => setConfirming(false)}>
                                    Voltar
                                </Button>
                            </div>
                        </>
                    ) : (
                        <Button type="button" variant="outline" size="small" onClick={() => setConfirming(true)}>
                            Solicitar reembolso
                        </Button>
                    )}
                </>
            )}
            {requestStatus && (
                <div role="status">
                    <p>{statusMessage[requestStatus]}</p>
                    {refund?.protocol && <p className="break-all">Protocolo {refund.protocol}</p>}
                </div>
            )}
            {error && <p role="alert">{error}</p>}
            {(error || needsSupport) && supportLink}
        </div>
    );
};
