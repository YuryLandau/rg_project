import { Head } from '../components/layout/Head';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import { legalDocuments } from '../config/legalDocuments';

export const PrivacyPolicy = () => (
    <>
        <Head title="Política de Privacidade - RG BIM" description="Informações sobre política de privacidade da RG BIM." />
        <Section>
            <Container>
                <article className="mx-auto max-w-3xl py-16 text-gray-700 leading-relaxed">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Política de Privacidade</h1>
                    <p className="mb-6">Versão prevista: {legalDocuments.privacy.version}. Vigência: a definir após revisão jurídica.</p>
                    <section aria-labelledby="document-status">
                        <h2 id="document-status" className="text-xl font-semibold text-gray-900 mb-3">Documento em preparação</h2>
                        <p>Este documento está em revisão jurídica. O texto definitivo e sua data de vigência serão disponibilizados nesta página antes da abertura do cadastro.</p>
                        <p className="mt-4">Para entrar em contato, escreva para <a className="text-primary underline" href="mailto:contato@rgprojeto.com.br">contato@rgprojeto.com.br</a>.</p>
                    </section>
                </article>
            </Container>
        </Section>
    </>
);
