import { Helmet } from 'react-helmet-async';

interface HeadProps {
    title?: string;
    description?: string;
    language?: string;
}

/**
 * Componente Head - Gerencia metadados do documento
 * Responsável por: meta tags, title, e configurações do head
 */
export const Head: React.FC<HeadProps> = ({
    title = 'RG BIM - Famílias Paramétricas para Revit',
    description = '',
    language = 'pt'
}) => {
    return (
        <Helmet>
            <html lang={language} />
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <title>{title}</title>
            {description && <meta name="description" content={description} />}

            {/* Favicons - Definidos apenas no index.html para evitar conflitos */}
            <link rel="icon" type="image/x-icon" href="/favicon.ico?v=3" />

            {/* Format detection */}
            <meta name="format-detection" content="telephone=no" />
            <meta name="skype_toolbar" content="skype_toolbar_parser_compatible" />
        </Helmet>
    );
};
