import type { ReactNode, CSSProperties } from 'react';

interface ContainerProps {
    children: ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    size?: 'small' | 'medium' | 'large';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    className?: string;
    style?: CSSProperties;
}

/**
 * Componente Container - Wrapper para conteúdo
 * Responsável por: Centralizar conteúdo, definir largura máxima, padding
 */
export const Container: React.FC<ContainerProps> = ({
    children,
    maxWidth = 'lg',
    size,
    padding = 'md',
    className = '',
    style
}) => {
    // Map size to maxWidth for backward compatibility
    const actualMaxWidth = size === 'small' ? 'sm' : size === 'medium' ? 'md' : size === 'large' ? 'lg' : maxWidth;

    const maxWidthClasses = {
        sm: 'max-w-3xl',
        md: 'max-w-5xl',
        lg: 'max-w-7xl',
        xl: 'max-w-[1400px]',
        full: 'max-w-full'
    };

    const paddingClasses = {
        none: 'px-0',
        sm: 'px-4',
        md: 'px-6',
        lg: 'px-8'
    };

    const classes = `w-full mx-auto ${maxWidthClasses[actualMaxWidth]} ${paddingClasses[padding]} ${className}`.trim();

    return (
        <div className={classes} style={style}>
            {children}
        </div>
    );
};
