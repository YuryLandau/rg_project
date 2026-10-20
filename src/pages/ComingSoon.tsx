import { Link } from 'react-router';
import { Head } from '../components/layout/Head';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { Button } from '../components/ui/Button';

interface ComingSoonProps {
    title: string;
    message: string;
    description?: string;
}

export const ComingSoon = ({ title, message, description }: ComingSoonProps) => (
    <>
        <Head
            title={`${title} - RG BIM`}
            description={description ?? message}
        />
        <Section>
            <Container>
                <div className="flex min-h-[60vh] items-center justify-center py-16">
                    <div className="w-full max-w-2xl rounded-2xl border border-primary/20 bg-white p-8 text-center shadow-lg md:p-12">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-4xl" aria-hidden="true">
                            🚧
                        </div>
                        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Em breve</p>
                        <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">{title}</h1>
                        <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-gray-600">{message}</p>
                        <Link to="/">
                            <Button variant="primary" size="large">Voltar para o início</Button>
                        </Link>
                    </div>
                </div>
            </Container>
        </Section>
    </>
);
