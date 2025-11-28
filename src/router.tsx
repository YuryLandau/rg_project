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
                path: 'login',
                element: <Login />
            },
            {
                path: 'register',
                element: <Register />
            },
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
