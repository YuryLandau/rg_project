import { createBrowserRouter, Navigate } from 'react-router-dom';
import { SiteLayout } from './components/layout/SiteLayout';
import { RequireAuth } from './context/AuthContext';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Downloads } from './pages/Downloads';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Payment } from './pages/Payment';
import { Subscribe } from './pages/Subscribe';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { PaymentCanceled } from './pages/PaymentCanceled';
import { VerifyEmail } from './pages/VerifyEmail';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { ResetPasswordCode } from './pages/ResetPasswordCode';
import { ChangePassword } from './pages/ChangePassword';
import { RequestPasswordResetLogged } from './pages/RequestPasswordResetLogged';
import { TutoriaisPlugin } from './pages/TutoriaisPlugin';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <SiteLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'about',
                element: <About />
            },
            {
                path: 'downloads',
                element: <Downloads />
            },
            {
                path: 'tutoriais-plugins',
                element: <TutoriaisPlugin />
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'register',
                element: <Register />
            },
            { path: 'verify-email', element: <VerifyEmail /> },
            { path: 'forgot-password', element: <ForgotPassword /> },
            { path: 'reset-password', element: <ResetPassword /> },
            { path: 'reset-password-code', element: <ResetPasswordCode /> },
            {
                path: 'subscribe',
                element: <Subscribe />
            },
            {
                path: 'profile',
                element: (
                    <RequireAuth>
                        <Profile />
                    </RequireAuth>
                )
            },
            {
                path: 'payment',
                element: (
                    <RequireAuth>
                        <Payment />
                    </RequireAuth>
                )
            },
            {
                path: 'change-password',
                element: (
                    <RequireAuth>
                        <ChangePassword />
                    </RequireAuth>
                )
            },
            {
                path: 'request-password-reset-logged',
                element: (
                    <RequireAuth>
                        <RequestPasswordResetLogged />
                    </RequireAuth>
                )
            },
            // Rotas de retorno de gateway (case-sensitive conforme backend)
            {
                path: 'Payment/sucesso',
                element: <PaymentSuccess />
            },
            {
                path: 'Payment/cancelado',
                element: <PaymentCanceled />
            },
            {
                path: '*',
                element: <Navigate to="/" replace />
            }
        ]
    }
]);
