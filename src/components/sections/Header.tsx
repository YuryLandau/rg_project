import type { ReactNode } from 'react';
import { useState } from 'react';

interface NavItem {
    label: string;
    href: string;
    children?: NavItem[];
}

interface HeaderProps {
    logo?: ReactNode;
    navigation?: NavItem[];
    actions?: ReactNode;
    sticky?: boolean;
    transparent?: boolean;
}

/**
 * Componente Header - Cabeçalho do site
 * Seção: Header/Navigation
 * Responsável por: Logo, menu de navegação, ações do usuário
 */
export const Header: React.FC<HeaderProps> = ({
    logo,
    navigation = [],
    actions,
    sticky = false,
    transparent = false
}) => {
    const baseClasses = 'border-b border-gray-200 bg-white';
    const stickyClasses = sticky ? 'sticky top-0 z-50 shadow-sm' : '';
    const transparentClasses = transparent ? 'bg-transparent border-transparent' : '';

    const headerClasses = `${baseClasses} ${stickyClasses} ${transparentClasses}`.trim();

    const [open, setOpen] = useState(false);

    return (
        <header className={headerClasses} role="banner">
            <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
                {/* Logo Section */}
                {logo && (
                    <div className="flex-shrink-0">
                        {logo}
                    </div>
                )}

                {/* Navigation Section */}
                {navigation.length > 0 && (
                    <nav className="hidden md:flex items-center flex-1 justify-center" role="navigation" aria-label="Menu principal">
                        <ul className="flex items-center gap-8">
                            {navigation.map((item, index) => (
                                <li key={index} className="relative group">
                                    <a href={item.href} className="text-gray-700 hover:text-primary font-medium transition-colors duration-200">
                                        {item.label}
                                    </a>
                                    {item.children && item.children.length > 0 && (
                                        <ul className="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                            {item.children.map((child, childIndex) => (
                                                <li key={childIndex}>
                                                    <a href={child.href} className="block px-4 py-2 text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors duration-150">
                                                        {child.label}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}

                {/* Actions Section */}
                {actions && (
                    <div className="flex items-center gap-3">
                        {actions}
                    </div>
                )}

                {/* Mobile toggle */}
                {navigation.length > 0 && (
                    <button
                        type="button"
                        className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-primary/20"
                        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
                        aria-expanded={open}
                        onClick={() => setOpen(v => !v)}
                    >
                        {open ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 11-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                        )}
                    </button>
                )}
            </div>

            {/* Mobile menu */}
            {navigation.length > 0 && (
                <div className={`md:hidden px-6 pb-4 ${open ? 'block' : 'hidden'}`}>
                    <nav role="navigation" aria-label="Menu principal mobile">
                        <ul className="flex flex-col gap-2">
                            {navigation.map((item, index) => (
                                <li key={index} className="">
                                    <a href={item.href} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-primary/5 hover:text-primary font-medium transition-colors">
                                        {item.label}
                                    </a>
                                    {item.children && item.children.length > 0 && (
                                        <ul className="pl-3 mt-1 border-l border-gray-200">
                                            {item.children.map((child, childIndex) => (
                                                <li key={childIndex}>
                                                    <a href={child.href} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors">
                                                        {child.label}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                    {actions && (
                        <div className="mt-4">
                            {actions}
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};
