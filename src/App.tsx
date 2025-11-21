/**
 * App.tsx - Aplicação Principal
 * 
 * Estrutura baseada no padrão de composição (Composition Pattern)
 * Componentes organizados em:
 * - layout: Head (metadados)
 * - sections: Header, HeroSection, Footer (seções principais)
 * - ui: Button, Image, Container, Section (componentes reutilizáveis)
 */

import {
  Head,
  Header,
  HeroSection,
  Footer,
  Button,
  Image,
  Container,
  Section
} from './components';

function App() {
  // Dados de navegação
  const navigationItems = [
    { label: 'Início', href: '#home' },
    { label: 'Sobre', href: '#about' },
    { label: 'Serviços', href: '#services' },
    { label: 'Contato', href: '#contact' }
  ];

  // Dados do rodapé
  const footerColumns = [
    {
      title: 'Empresa',
      links: [
        { label: 'Sobre nós', href: '#about' },
        { label: 'Nossa equipe', href: '#team' },
        { label: 'Carreiras', href: '#careers' }
      ]
    },
    {
      title: 'Serviços',
      links: [
        { label: 'Consultoria', href: '#consulting' },
        { label: 'Desenvolvimento', href: '#development' },
        { label: 'Suporte', href: '#support' }
      ]
    },
    {
      title: 'Contato',
      links: [
        { label: 'Email', href: 'mailto:contato@example.com' },
        { label: 'Telefone', href: 'tel:+5511999999999' },
        { label: 'Endereço', href: '#location' }
      ]
    }
  ];

  return (
    <>
      {/* Head: Metadados e configurações do documento */}
      <Head
        title="Dar Iva Bim - Página Inicial"
        description="Website desenvolvido com React e padrão de composição"
        language="pt"
      />

      {/* Header: Navegação principal */}
      <Header
        logo={<h2 style={{ margin: 0, color: 'var(--primary-color)' }}>Dar Iva Bim</h2>}
        navigation={navigationItems}
        actions={
          <>
            <Button variant="outline" size="small">Login</Button>
            <Button variant="primary" size="small">Cadastrar</Button>
          </>
        }
        sticky
      />

      {/* Main Content */}
      <main>
        {/* Hero Section: Seção principal/destaque */}
        <HeroSection
          title="Bem-vindo ao Futuro"
          subtitle="Inovação e Tecnologia"
          description="Desenvolvemos soluções digitais que transformam negócios e conectam pessoas."
          backgroundImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop"
          overlay
          overlayOpacity={0.6}
          alignment="center"
          minHeight="600px"
          actions={
            <>
              <Button variant="primary" size="large">Comece Agora</Button>
              <Button variant="secondary" size="large">Saiba Mais</Button>
            </>
          }
        />

        {/* Section: Sobre */}
        <Section id="about" padding="lg">
          <Container maxWidth="lg">
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Sobre Nós</h2>
            <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto', lineHeight: 1.8 }}>
              Somos uma empresa focada em criar experiências digitais únicas e inovadoras.
              Com anos de experiência no mercado, oferecemos soluções personalizadas que
              atendem às necessidades específicas de cada cliente.
            </p>
          </Container>
        </Section>

        {/* Section: Serviços */}
        <Section id="services" backgroundColor="#f8f9fa" padding="lg">
          <Container maxWidth="lg">
            <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Nossos Serviços</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {[1, 2, 3].map((item) => (
                <div key={item} style={{
                  backgroundColor: 'white',
                  padding: '2rem',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <Image
                    src={`https://images.unsplash.com/photo-148748065${item}459-43490279c0fa?w=400&h=300&fit=crop`}
                    alt={`Serviço ${item}`}
                    aspectRatio="4/3"
                    rounded
                    style={{ marginBottom: '1rem' }}
                  />
                  <h3>Serviço {item}</h3>
                  <p>Descrição detalhada do serviço oferecido pela empresa.</p>
                  <Button variant="outline" fullWidth>Saiba Mais</Button>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Section: Contato */}
        <Section id="contact" padding="lg">
          <Container maxWidth="md">
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Entre em Contato</h2>
            <div style={{ textAlign: 'center' }}>
              <p style={{ marginBottom: '2rem' }}>
                Tem alguma dúvida ou quer saber mais sobre nossos serviços?
                Entre em contato conosco!
              </p>
              <Button variant="primary" size="large">Fale Conosco</Button>
            </div>
          </Container>
        </Section>
      </main>

      {/* Footer: Rodapé com informações */}
      <Footer
        logo={<h3 style={{ margin: 0 }}>Dar Iva Bim</h3>}
        columns={footerColumns}
        copyright={`© ${new Date().getFullYear()} Dar Iva Bim. Todos os direitos reservados.`}
        bottomLinks={[
          { label: 'Política de Privacidade', href: '#privacy' },
          { label: 'Termos de Uso', href: '#terms' }
        ]}
      />
    </>
  );
}

export default App;
