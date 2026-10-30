import { createBrowserRouter, Navigate } from 'react-router';
import { SiteLayout } from './components/layout/SiteLayout';
import { RequireAuth } from './context/AuthContext';
import { Home } from './pages/Home';
import { TermsOfUse } from './pages/TermsOfUse';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { legalDocuments } from './config/legalDocuments';
import { About } from './pages/About';
import { Downloads } from './pages/Downloads';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
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
import { ComingSoon } from './pages/ComingSoon';
import { featureFlags, featureMessages } from './config/features';

const authenticationUnavailable = (
    <ComingSoon title="Área do cliente" message={featureMessages.authentication} />
);

const subscriptionsUnavailable = (
    <ComingSoon title="Planos e assinaturas" message={featureMessages.subscriptions} />
);

const downloadsUnavailable = (
    <ComingSoon title="Downloads" message={featureMessages.downloads} />
);

export const router = createBrowserRouter([
    {
        path: '/',
        element: <SiteLayout />,
        children: [
            { path: legalDocuments.terms.route, element: <TermsOfUse /> },
            { path: legalDocuments.privacy.route, element: <PrivacyPolicy /> },
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
                element: featureFlags.authenticationEnabled && featureFlags.downloadsEnabled
                    ? <Downloads />
                    : downloadsUnavailable
            },
            {
                path: 'tutoriais-plugins',
                element: <TutoriaisPlugin />
            },
            {
                path: 'login',
                element: featureFlags.authenticationEnabled ? <Login /> : authenticationUnavailable
            },
            {
                path: 'register',
                element: featureFlags.authenticationEnabled ? <Register /> : authenticationUnavailable
            },
            { path: 'verify-email', element: featureFlags.authenticationEnabled ? <VerifyEmail /> : authenticationUnavailable },
            { path: 'forgot-password', element: featureFlags.authenticationEnabled ? <ForgotPassword /> : authenticationUnavailable },
            { path: 'reset-password', element: featureFlags.authenticationEnabled ? <ResetPassword /> : authenticationUnavailable },
            { path: 'reset-password-code', element: featureFlags.authenticationEnabled ? <ResetPasswordCode /> : authenticationUnavailable },
            {
                path: 'subscribe',
                element: featureFlags.authenticationEnabled && featureFlags.subscriptionsEnabled
                    ? <Subscribe />
                    : subscriptionsUnavailable
            },
            {
                path: 'profile',
                element: featureFlags.authenticationEnabled ? (
                    <RequireAuth>
                        <Profile />
                    </RequireAuth>
                ) : authenticationUnavailable
            },
            {
                path: 'payment',
                element: featureFlags.authenticationEnabled && featureFlags.subscriptionsEnabled ? (
                    <RequireAuth>
                        <Navigate to="/subscribe" replace />
                    </RequireAuth>
                ) : subscriptionsUnavailable
            },
            {
                path: 'change-password',
                element: featureFlags.authenticationEnabled ? (
                    <RequireAuth>
                        <ChangePassword />
                    </RequireAuth>
                ) : authenticationUnavailable
            },
            {
                path: 'request-password-reset-logged',
                element: featureFlags.authenticationEnabled ? (
                    <RequireAuth>
                        <RequestPasswordResetLogged />
                    </RequireAuth>
                ) : authenticationUnavailable
            },
            // Rotas de retorno de gateway (case-sensitive conforme backend)
            {
                path: 'Payment/sucesso',
                element: featureFlags.authenticationEnabled && featureFlags.subscriptionsEnabled
                    ? <PaymentSuccess />
                    : subscriptionsUnavailable
            },
            {
                path: 'Payment/cancelado',
                element: featureFlags.authenticationEnabled && featureFlags.subscriptionsEnabled
                    ? <PaymentCanceled />
                    : subscriptionsUnavailable
            },
            {
                path: '*',
                element: <Navigate to="/" replace />
            }
        ]
    }
]);
