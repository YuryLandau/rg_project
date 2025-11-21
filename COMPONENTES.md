# RG Website - Estrutura de Componentes

## 📋 Visão Geral

Este projeto foi reorganizado seguindo o **Composition Pattern** (Padrão de Composição), uma abordagem moderna e escalável para desenvolvimento de aplicações React.

## 🏗️ Arquitetura

### Padrão de Composição (Composition Pattern)

O Composition Pattern é um padrão de design que permite construir componentes complexos através da combinação de componentes menores e mais simples. Vantagens:

- **Reutilização**: Componentes podem ser usados em diferentes contextos
- **Manutenibilidade**: Código organizado e fácil de manter
- **Escalabilidade**: Fácil adicionar novos componentes sem afetar existentes
- **Testabilidade**: Componentes isolados são mais fáceis de testar

## 📁 Estrutura de Pastas

```
src/
├── components/
│   ├── layout/                 # Componentes de layout estrutural
│   │   └── Head.tsx           # Gerenciamento de metadados (<head>)
│   │
│   ├── sections/              # Seções principais da página
│   │   ├── Header.tsx         # Cabeçalho/Navegação
│   │   ├── Header.css
│   │   ├── HeroSection.tsx    # Seção Hero/Banner principal
│   │   ├── HeroSection.css
│   │   ├── Footer.tsx         # Rodapé
│   │   └── Footer.css
│   │
│   ├── ui/                    # Componentes de UI reutilizáveis
│   │   ├── Button.tsx         # Botão
│   │   ├── Button.css
│   │   ├── Image.tsx          # Imagem otimizada
│   │   ├── Image.css
│   │   ├── Container.tsx      # Container de conteúdo
│   │   ├── Container.css
│   │   ├── Section.tsx        # Seção de página
│   │   └── Section.css
│   │
│   └── index.ts              # Exportações centralizadas
│
├── App.tsx                   # Componente principal (composição)
└── App.css
```

## 🧩 Componentes

### 1. Layout Components

#### `<Head />`
Gerencia metadados do documento HTML.

**Props:**
- `title`: Título da página
- `description`: Descrição meta
- `favicon`: URL do favicon
- `language`: Idioma da página

**Uso:**
```tsx
<Head 
  title="Minha Página" 
  description="Descrição da página"
  language="pt"
/>
```

---

### 2. Section Components

#### `<Header />`
Cabeçalho com navegação e ações.

**Props:**
- `logo`: Elemento do logo (ReactNode)
- `navigation`: Array de itens de navegação
- `actions`: Elementos de ação (ReactNode)
- `sticky`: Header fixo ao scroll
- `transparent`: Header transparente

**Uso:**
```tsx
<Header
  logo={<img src="logo.png" alt="Logo" />}
  navigation={[
    { label: 'Início', href: '/' },
    { label: 'Sobre', href: '/sobre' }
  ]}
  actions={<Button>Login</Button>}
  sticky
/>
```

#### `<HeroSection />`
Seção principal/destaque da página.

**Props:**
- `title`: Título principal
- `subtitle`: Subtítulo
- `description`: Descrição
- `backgroundImage`: Imagem de fundo
- `backgroundVideo`: Vídeo de fundo
- `overlay`: Mostrar overlay escuro
- `overlayOpacity`: Opacidade do overlay (0-1)
- `actions`: Botões de ação (ReactNode)
- `alignment`: Alinhamento do conteúdo
- `minHeight`: Altura mínima

**Uso:**
```tsx
<HeroSection
  title="Bem-vindo"
  subtitle="Ao Futuro"
  description="Nossa missão..."
  backgroundImage="/hero.jpg"
  overlay
  overlayOpacity={0.5}
  actions={<Button>Saiba Mais</Button>}
  alignment="center"
/>
```

#### `<Footer />`
Rodapé do site.

**Props:**
- `logo`: Logo do rodapé (ReactNode)
- `columns`: Colunas de links
- `socialLinks`: Links de redes sociais
- `copyright`: Texto de copyright
- `bottomLinks`: Links inferiores

**Uso:**
```tsx
<Footer
  logo={<img src="logo.png" />}
  columns={[
    {
      title: 'Empresa',
      links: [
        { label: 'Sobre', href: '/sobre' }
      ]
    }
  ]}
  copyright="© 2024 Empresa"
/>
```

---

### 3. UI Components

#### `<Button />`
Botão reutilizável com variantes.

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline'
- `size`: 'small' | 'medium' | 'large'
- `fullWidth`: Largura total
- Todas as props de `<button>`

**Uso:**
```tsx
<Button variant="primary" size="large" onClick={() => {}}>
  Clique aqui
</Button>
```

#### `<Image />`
Imagem otimizada com lazy loading e fallback.

**Props:**
- `src`: URL da imagem
- `alt`: Texto alternativo (obrigatório)
- `fallbackSrc`: URL alternativa se erro
- `aspectRatio`: Proporção (ex: "16/9")
- `objectFit`: Como ajustar imagem
- `loading`: 'lazy' | 'eager'
- `rounded`: Bordas arredondadas
- `circle`: Formato circular

**Uso:**
```tsx
<Image
  src="/photo.jpg"
  alt="Foto"
  aspectRatio="16/9"
  loading="lazy"
  rounded
/>
```

#### `<Container />`
Wrapper para centralizar e limitar largura do conteúdo.

**Props:**
- `maxWidth`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `padding`: 'none' | 'sm' | 'md' | 'lg'

**Uso:**
```tsx
<Container maxWidth="lg" padding="md">
  <p>Conteúdo...</p>
</Container>
```

#### `<Section />`
Seção de página com espaçamento consistente.

**Props:**
- `id`: ID da seção (para âncoras)
- `backgroundColor`: Cor de fundo
- `backgroundImage`: Imagem de fundo
- `padding`: 'none' | 'sm' | 'md' | 'lg' | 'xl'

**Uso:**
```tsx
<Section id="about" backgroundColor="#f5f5f5" padding="lg">
  <h2>Sobre nós</h2>
</Section>
```

---

## 🎨 Personalização

### Variáveis CSS

O projeto usa CSS Variables para facilitar personalização:

```css
:root {
  --color_11: ...; /* Background */
  --color_15: ...; /* Text */
  --color_17: ...; /* Primary */
  --color_18: ...; /* Secondary */
  --font_1: ...; /* Font family */
  --site-width: 1200px; /* Largura máxima */
}
```

### Temas

Para criar temas, sobrescreva as variáveis CSS:

```css
/* Tema Escuro */
[data-theme="dark"] {
  --color_11: 18, 18, 18;
  --color_15: 255, 255, 255;
}
```

---

## 🚀 Como Usar

### Instalação

```bash
npm install
# ou
yarn install
```

### Desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

### Build

```bash
npm run build
# ou
yarn build
```

---

## 📝 Exemplo de Composição

```tsx
import { 
  Head, 
  Header, 
  HeroSection, 
  Section, 
  Container, 
  Footer,
  Button 
} from './components';

function App() {
  return (
    <>
      <Head title="Minha Página" />
      
      <Header
        logo={<Logo />}
        navigation={navItems}
        actions={<Button>Login</Button>}
        sticky
      />

      <main>
        <HeroSection
          title="Título Principal"
          backgroundImage="/hero.jpg"
          actions={<Button>CTA</Button>}
        />

        <Section padding="lg">
          <Container maxWidth="lg">
            <h2>Conteúdo</h2>
          </Container>
        </Section>
      </main>

      <Footer columns={footerData} />
    </>
  );
}
```

---

## 🔍 Boas Práticas

1. **Componentes Pequenos**: Mantenha componentes focados em uma responsabilidade
2. **Props Tipadas**: Use TypeScript para todas as props
3. **CSS Modules**: Estilos isolados por componente
4. **Acessibilidade**: Use elementos semânticos e ARIA labels
5. **Performance**: Use lazy loading e code splitting quando apropriado

---

## 📚 Recursos Adicionais

- [React Documentation](https://react.dev)
- [Composition Pattern](https://reactjs.org/docs/composition-vs-inheritance.html)
- [TypeScript](https://www.typescriptlang.org)

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT.
