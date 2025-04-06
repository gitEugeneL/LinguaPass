import { createBrowserRouter, Navigate } from 'react-router';
import AuthLayout from './app/auth/layout/AuthLayout.tsx';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import LoginPage from './app/auth/pages/LoginPage/LoginPage.tsx';
import './assets/styles/index.pcss';
import RegistrationPage from './app/auth/pages/RegistrationPage/RegistrationPage.tsx';
import AuthProvider from './app/AuthProvider.tsx';
import ForgotPasswordPage from './app/auth/pages/ForgotPasswordPage/ForgotPasswordPage.tsx';
import ResetPasswordPage from './app/auth/pages/ResetPasswprdPage/ResetPasswordPage.tsx';
import BaseLayout from './app/base/layout/BaseLayout.tsx';
import LanguagePage from './app/base/pages/LanguagePage/LanguagePage.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <BaseLayout />
      </AuthProvider>
    ),
    children: [
      {
        path: 'languages',
        element: <LanguagePage />
      },
      {
        path: 'schools',
        element: <>school page</>
      }
    ]
  },

  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: '',
        element: <Navigate to='login' replace />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'registration',
        element: <RegistrationPage />
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />
      },
      {
        path: 'reset-password',
        element: <ResetPasswordPage />
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
