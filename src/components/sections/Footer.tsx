import type { ReactNode } from 'react';

interface FooterColumn {
    title: string;
    links: Array<{
        label: string;
        href: string;
    }>;
}

interface FooterProps {
    logo?: ReactNode;
    columns?: FooterColumn[];
    social?: Array<{
        platform: string;
        href: string;
        icon: string;
    }>;
    socialLinks?: Array<{
        icon: ReactNode;
        href: string;
        label: string;
    }>;
    copyright?: string;
    bottomText?: string;
    bottomLinks?: Array<{
        label: string;
        href: string;
    }>;
}

/**
 * Componente Footer - Rodapé do site
 * Seção: Footer
 * Responsável por: Links, informações de contato, copyright
 */
export const Footer: React.FC<FooterProps> = ({
    logo,
    columns = [],
    social = [],
    socialLinks = [],
    copyright,
    bottomText,
    bottomLinks = []
}) => {
    // Merge social and socialLinks for backward compatibility
    const allSocialLinks = [
        ...socialLinks,
        ...social.map(s => ({
            icon: s.icon,
            href: s.href,
            label: s.platform
        }))
    ];
    return (
        <footer className="bg-gray-900 text-gray-300" role="contentinfo">
            {/* Main Footer Content */}
            <div className="py-12 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Logo/Brand Section */}
                    {logo && (
                        <div className="mb-8">
                            {logo}
                        </div>
                    )}

                    {/* Columns Section */}
                    {columns.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                            {columns.map((column, index) => (
                                <div key={index}>
                                    <h3 className="text-white font-bold text-lg mb-4">{column.title}</h3>
                                    <ul className="space-y-2">
                                        {column.links.map((link, linkIndex) => (
                                            <li key={linkIndex}>
                                                <a href={link.href} className="text-gray-400 hover:text-primary transition-colors duration-200">
                                                    {link.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Social Links */}
                    {allSocialLinks.length > 0 && (
                        <div>
                            <h3 className="text-white font-bold text-lg mb-4">Siga-nos</h3>
                            <div className="flex gap-4">
                                {allSocialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200"
                                        aria-label={social.label}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {(copyright || bottomText) && (
                            <p className="text-sm text-gray-400">{copyright || bottomText}</p>
                        )}

                        {bottomLinks.length > 0 && (
                            <ul className="flex gap-6">
                                {bottomLinks.map((link, index) => (
                                    <li key={index}>
                                        <a href={link.href} className="text-sm text-gray-400 hover:text-primary transition-colors duration-200">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
};
