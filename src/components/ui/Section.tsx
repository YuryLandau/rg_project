import type { ReactNode, CSSProperties } from 'react';

interface SectionProps {
    children: ReactNode;
    id?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    style?: CSSProperties;
}

/**
 * Componente Section - Seção de conteúdo
 * Responsável por: Estruturar seções da página com espaçamento consistente
 */
export const Section: React.FC<SectionProps> = ({
    children,
    id,
    backgroundColor,
    backgroundImage,
    padding = 'lg',
    className = '',
    style
}) => {
    const paddingClasses = {
        none: 'py-0',
        sm: 'py-8',
        md: 'py-12',
        lg: 'py-16',
        xl: 'py-24'
    };

    const classes = `${paddingClasses[padding]} ${className}`.trim();

    const sectionStyle: CSSProperties = {
        ...style,
        backgroundColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined
    };

    return (
        <section id={id} className={classes} style={sectionStyle}>
            {children}
        </section>
    );
};
