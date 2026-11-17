import { Head } from '../components/layout/Head';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import { legalDocuments } from '../config/legalDocuments';
import { LegalDocumentViewer } from '../components/legal/LegalDocumentViewer';

export const TermsOfUse = () => (
    <>
        <Head title="Termos de Uso - RG BIM" description="Informações sobre termos de uso da RG BIM." />
        <Section>
            <Container>
                <LegalDocumentViewer
                    kind="terms-of-use"
                    title="Termos de Uso"
                    version={legalDocuments.terms.version}
                    fileName={legalDocuments.terms.fileName}
                />
            </Container>
        </Section>
    </>
);
