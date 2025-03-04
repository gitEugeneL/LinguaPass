import { createBrowserRouter, Navigate } from 'react-router';
import AuthLayout from './app/auth/layout/AuthLayout.tsx';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import LoginPage from './app/auth/pages/LoginPage/LoginPage.tsx';
import './assets/styles/index.pcss';
import RegistrationPage from './app/auth/pages/RegistrationPage/RegistrationPage.tsx';

const router = createBrowserRouter([
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
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);
