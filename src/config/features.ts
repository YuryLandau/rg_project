const isExplicitlyEnabled = (value: string | undefined) => value === 'true';

export const featureFlags = Object.freeze({
    authenticationEnabled: isExplicitlyEnabled(import.meta.env.VITE_AUTHENTICATION_ENABLED),
    subscriptionsEnabled: isExplicitlyEnabled(import.meta.env.VITE_SUBSCRIPTIONS_ENABLED),
    downloadsEnabled: isExplicitlyEnabled(import.meta.env.VITE_DOWNLOADS_ENABLED),
});

export const featureMessages = Object.freeze({
    authentication:
        import.meta.env.VITE_AUTHENTICATION_DISABLED_MESSAGE ||
        'O cadastro e o acesso à conta serão disponibilizados em breve. Estamos finalizando os Termos de Uso e a Política de Privacidade para lançar essa área com segurança e transparência.',
    subscriptions:
        import.meta.env.VITE_SUBSCRIPTIONS_DISABLED_MESSAGE ||
        'Os planos e assinaturas da RG BIM estão em preparação. Em breve você poderá criar sua conta e escolher o plano ideal.',
    downloads:
        import.meta.env.VITE_DOWNLOADS_DISABLED_MESSAGE ||
        'Estamos finalizando os instaladores e a biblioteca de recursos da RG BIM. Os downloads estarão disponíveis em breve.',
});
