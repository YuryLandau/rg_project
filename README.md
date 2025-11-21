# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Integração com Backend RGBim

Esta aplicação agora consome a API .NET (porta padrão `http://localhost:5000`).

### Variáveis de Ambiente (opcional)
Defina `VITE_API_BASE_URL` em um arquivo `.env` ou `.env.development` para apontar para outro host.

```
VITE_API_BASE_URL=http://localhost:5000
```

### Fluxos Principais
- Login: `POST /api/user/login` armazena `tokenAcesso` e `refreshToken`.
- Perfil: `GET /api/user/profile` retorna dados e função (`Comum`, `Premium`, `Admin`). Função é mapeada para plano (`free`, `premium`, `admin`).
- Assinatura: `POST /api/user/checkout/subscribe` retorna `urlStripe` e frontend redireciona.
- Cancelamento: `DELETE /api/user/cancel-subscription` remove assinatura.
- Plugins: `GET /api/plugin/download-links` lista endpoints de download dinâmicos.
- Arquivos de produto: `GET /api/produto/file?material=...&name=Opcional` faz download (premium/admin).

### Estrutura de Código
- `src/services/api.ts`: Funções centralizadas para chamadas HTTP.
- `AuthContext`: Gerencia tokens e usuário; substituiu mock anterior.
- Páginas adaptadas: `Login`, `Subscribe`, `Profile`, `Downloads`.

### Ajustes Futuramente Recomendados
- Implementar renovação automática de `refreshToken` quando expirar o acesso.
- Unificar tratamento de erros e toasts.
- Adicionar indicador de carregamento global.
- Adicionar rota de sucesso do Stripe no frontend e ajustar `SuccessUrl` no backend.

### Teste Rápido
1. Inicie backend em Docker (porta 5000).
2. `npm run dev` no frontend.
3. Faça login com usuário válido criado via fluxo de registro.
4. Acesse `Assinaturas` e clique em Premium para ir ao Stripe.
5. Após confirmação e webhook, abra `Perfil` para ver plano atualizado.


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
