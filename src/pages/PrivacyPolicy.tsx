import { Head } from '../components/layout/Head';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import { legalDocuments } from '../config/legalDocuments';
import { LegalDocumentViewer } from '../components/legal/LegalDocumentViewer';

export const PrivacyPolicy = () => (
    <>
        <Head title="Política de Privacidade - RG BIM" description="Informações sobre política de privacidade da RG BIM." />
        <Section>
            <Container>
                <LegalDocumentViewer
                    kind="privacy-policy"
                    title="Política de Privacidade"
                    version={legalDocuments.privacy.version}
                    fileName={legalDocuments.privacy.fileName}
                />
            </Container>
        </Section>
    </>
);
