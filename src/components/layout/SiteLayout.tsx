import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Header } from '../sections/Header';
import { Footer } from '../sections/Footer';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

/**
 * SiteLayout - Layout principal do site
 * Contém Header e Footer fixos, com conteúdo dinâmico via Outlet
 */
export const SiteLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Helper to get user initials
    const getUserInitials = (user: { name?: string; email: string }) => {
        if (user.name) {
            const names = user.name.split(' ');
            if (names.length >= 2) {
                return (names[0][0] + names[names.length - 1][0]).toUpperCase();
            }
            return user.name.substring(0, 2).toUpperCase();
        }
        return user.email.substring(0, 2).toUpperCase();
    };

    // Generate consistent color from initials
    const getAvatarColor = (initials: string) => {
        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-purple-500',
            'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
        ];
        const index = initials.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const navigation = [
        { label: 'Home', href: '/' },
        { label: 'Sobre', href: '/about' },
        { label: 'Downloads', href: '/downloads' }
    ];

    const actions = user ? (
        <div className="relative">
            <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                aria-label="Menu do usuário"
                aria-expanded={userMenuOpen}
            >
                <span className="hidden md:inline text-sm text-gray-700 font-medium">
                    {user.name || user.email}
                </span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getAvatarColor(getUserInitials(user))}`}>
                    {getUserInitials(user)}
                </div>
            </button>

            {userMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-20">
                        <div className="px-4 py-3 border-b border-gray-200">
                            <p className="text-sm font-medium text-gray-900">{user.name || 'Usuário'}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Link
                            to="/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                        >
                            Perfil
                        </Link>
                        <Link
                            to="/payment"
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                        >
                            Cartão
                        </Link>
                        <Link
                            to="/subscribe"
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                        >
                            Assinatura
                        </Link>
                        <div className="border-t border-gray-200 mt-2 pt-2">
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    ) : (
        <Link to="/login">
            <Button variant="primary" size="small">Login</Button>
        </Link>
    );

    const logo = (
        <Link to="/" className="no-underline">
            <div className="flex items-center">
                <img
                    src="/images/RG_Bim_full_logo-transparent.png"
                    alt="RG BIM"
                    className="h-10 md:h-12 w-auto"
                />
            </div>
        </Link>
    );

    return (
        <div className="flex flex-col min-h-screen">
            <Header
                logo={logo}
                navigation={navigation}
                actions={actions}
                sticky={true}
            />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer
                logo={
                    <div className="flex items-center">
                        <img
                            src="/images/RG_Bim_full_logo-transparent.png"
                            alt="RG BIM"
                            className="h-8 w-auto"
                            style={{ filter: 'invert(1) grayscale(1) brightness(2)' }}
                        />
                    </div>
                }
                columns={[
                    {
                        title: 'Empresa',
                        links: [
                            { label: 'Sobre', href: '#' },
                            { label: 'Contato', href: '#' }
                        ]
                    },
                    {
                        title: 'Recursos',
                        links: [
                            { label: 'Downloads', href: '/downloads' },
                            { label: 'Documentação', href: '#' }
                        ]
                    }
                ]}
                social={[
                    { platform: 'LinkedIn', href: '#', icon: 'in' },
                    { platform: 'Twitter', href: '#', icon: '𝕏' }
                ]}
                bottomText="© 2025 RG. Todos os direitos reservados."
            />
        </div>
    );
};
