import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
}

/**
 * Componente Button - Botão reutilizável
 * Suporta diferentes variantes, tamanhos e estados
 */
export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    className = '',
    disabled = false,
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/30 shadow-sm hover:shadow-md',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-600/30 shadow-sm hover:shadow-md',
        outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/30'
    };

    const sizeClasses = {
        small: 'px-4 py-2 text-sm',
        medium: 'px-6 py-3 text-base',
        large: 'px-8 py-4 text-lg'
    };

    const widthClass = fullWidth ? 'w-full' : '';

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`.trim();

    return (
        <button className={classes} disabled={disabled} {...props}>
            {children}
        </button>
    );
};
