# Guia de Rotas e Autenticação - RG Website

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Estrutura de Rotas](#estrutura-de-rotas)
- [Sistema de Autenticação](#sistema-de-autenticação)
- [Páginas](#páginas)
- [Como Usar](#como-usar)

---

## 🎯 Visão Geral

O site RG utiliza **React Router v6** para navegação e um **sistema de autenticação mock** baseado em `localStorage` para demonstração.

**Paleta de Cores Institucional:**
- Primário: Cornflower Blue (`#6495ED`)
- Neutro: Branco e tons de cinza

---

## 🗺️ Estrutura de Rotas

### Rotas Públicas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | `Home` | Página inicial com hero section e features |
| `/downloads` | `Downloads` | Tabela de recursos disponíveis para download |
| `/login` | `Login` | Formulário de autenticação |
| `/subscribe` | `Subscribe` | Planos de assinatura (Free, Pro, Enterprise) |

### Rotas Protegidas

Requerem autenticação (redirecionam para `/login` se não autenticado):

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/profile` | `Profile` | Edição de perfil do usuário |
| `/payment` | `Payment` | Gerenciamento de cartão de crédito |

**Nota:** A rota `/subscribe` é acessível publicamente mas tem comportamento diferente para usuários autenticados.

---

## 🔐 Sistema de Autenticação

### AuthContext

Provedor de contexto localizado em `src/context/AuthContext.tsx`.

**Funcionalidades:**
- **Login mock**: Aceita qualquer email/senha não-vazios
- **Persistência**: Armazena usuário no `localStorage` (chave: `auth:user`)
- **Logout**: Remove dados do localStorage
- **Atualização de perfil**: Atualiza dados do usuário

**Interface User:**
```typescript
interface User {
    id: string;
    email: string;
    name?: string;
    plan?: string; // 'free' | 'pro' | 'enterprise'
}
```

### Hook useAuth

```tsx
import { useAuth } from './context/AuthContext';

const { user, loading, login, logout, updateProfile } = useAuth();
```

**Métodos:**
- `login(email, password)`: Retorna `Promise<boolean>`
- `logout()`: Remove usuário
- `updateProfile(data)`: Atualiza campos do usuário

### Componente RequireAuth

Wrapper para rotas protegidas:

```tsx
import { RequireAuth } from './context/AuthContext';

<Route path="/profile" element={
    <RequireAuth>
        <Profile />
    </RequireAuth>
} />
```

Redireciona automaticamente para `/login` se não autenticado.

---

## 📄 Páginas

### 1. Home (`/`)

**Componente:** `src/pages/Home.tsx`

**Conteúdo:**
- Hero section com call-to-action
- Seção de features (3 cards)
- Links para Subscribe e Downloads

**SEO:**
- Title: "RG - Home"
- Description: "Bem-vindo à plataforma RG"

---

### 2. Downloads (`/downloads`)

**Componente:** `src/pages/Downloads.tsx`

**Conteúdo:**
- Tabela responsiva com recursos disponíveis
- Colunas: Nome, Versão, Tamanho, Data, Ação
- Botão de download para cada item

**Dados Mock:**
```typescript
{
    id: '1',
    name: 'RG Desktop App',
    version: '2.1.0',
    size: '85 MB',
    date: '2025-11-10',
    url: '#'
}
```

---

### 3. Login (`/login`)

**Componente:** `src/pages/Login.tsx`

**Funcionalidades:**
- Formulário com email e senha
- Validação básica (campos obrigatórios)
- Feedback de erro
- Link para `/subscribe` (criar conta)
- Redireciona para `/profile` após login

**Comportamento:**
- Se usuário já está autenticado, redireciona para `/profile`

---

### 4. Subscribe (`/subscribe`)

**Componente:** `src/pages/Subscribe.tsx`

**Planos:**

| Plano | Preço | Features |
|-------|-------|----------|
| Free | R$ 0/mês | Acesso básico, downloads limitados |
| Pro | R$ 49/mês | Acesso completo, downloads ilimitados, suporte 24/7 |
| Enterprise | R$ 199/mês | Tudo do Pro + suporte dedicado, SLA |

**Comportamento:**
- Usuários não autenticados: redireciona para `/login` ao selecionar plano
- Usuários autenticados: ativa plano e redireciona para `/profile`

---

### 5. Profile (`/profile`) - 🔒 Protegida

**Componente:** `src/pages/Profile.tsx`

**Funcionalidades:**
- Edição de nome e email
- Exibição do plano atual
- Feedback de sucesso ao salvar

**Campos:**
- Nome (opcional)
- Email (obrigatório)
- Plano (somente leitura)

---

### 6. Payment (`/payment`) - 🔒 Protegida

**Componente:** `src/pages/Payment.tsx`

**Funcionalidades:**
- Formulário de cartão de crédito
- Formatação automática:
  - Número: `1234 5678 9012 3456`
  - Validade: `MM/AA`
  - CVV: até 4 dígitos
- Feedback de sucesso
- Ícone de segurança 🔒

**Nota:** Dados **não são salvos** (apenas demonstração visual)

---

## 🚀 Como Usar

### Iniciar Aplicação

```bash
npm run dev
```

Acesse: `http://localhost:5173`

### Fluxo de Navegação

#### Usuário Novo:
1. Acessa `/` (Home)
2. Clica em "Começar Agora" → `/subscribe`
3. Seleciona plano → Redireciona para `/login`
4. Faz login → Retorna para `/profile`

#### Usuário Autenticado:
1. Menu "Minha Conta" aparece no header
2. Opções: Perfil, Cartão, Assinatura
3. Botão "Sair" desloga e limpa dados

### Testar Autenticação

```typescript
// Qualquer email/senha funciona (mock)
Email: teste@rg.com
Senha: 123456

// Usuário criado automaticamente:
{
    id: 'u1',
    email: 'teste@rg.com',
    name: 'Usuário Demo',
    plan: 'free'
}
```

### Limpar Dados

```javascript
// Console do navegador
localStorage.removeItem('auth:user');
```

---

## 🎨 Componentes de Layout

### SiteLayout

**Arquivo:** `src/components/layout/SiteLayout.tsx`

**Responsabilidade:**
- Header persistente com logo e navegação
- Footer com links e copyright
- `<Outlet />` para conteúdo dinâmico

**Navegação Dinâmica:**
- Usuário deslogado: Home, Downloads, Login
- Usuário logado: Home, Downloads, Minha Conta (dropdown)

---

## 📦 Arquivos Principais

```
src/
├── router.tsx                    # Configuração de rotas
├── main.tsx                      # Entry point (Router + Auth providers)
├── context/
│   └── AuthContext.tsx           # Sistema de autenticação
├── components/
│   └── layout/
│       └── SiteLayout.tsx        # Layout principal
└── pages/
    ├── Home.tsx
    ├── Downloads.tsx
    ├── Login.tsx
    ├── Profile.tsx
    ├── Payment.tsx
    └── Subscribe.tsx
```

---

## 🔧 Personalizações Futuras

### Integrar API Real

Substituir em `AuthContext.tsx`:

```typescript
const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) return false;
    
    const user = await response.json();
    setUser(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return true;
};
```

### Adicionar Novas Rotas Protegidas

```tsx
// router.tsx
{
    path: 'dashboard',
    element: (
        <RequireAuth>
            <Dashboard />
        </RequireAuth>
    )
}
```

### Validação de Formulários

Considere usar bibliotecas:
- [React Hook Form](https://react-hook-form.com/)
- [Yup](https://github.com/jquense/yup) (validação de schema)
- [Zod](https://zod.dev/) (TypeScript-first)

---

## 📞 Suporte

Para dúvidas sobre a implementação, consulte:
- `COMPONENTES.md` - Documentação de componentes
- `INSTALACAO.md` - Guia de instalação
- `README.md` - Visão geral do projeto

---

**Última atualização:** Novembro 2025  
**Versão:** 1.0.0
