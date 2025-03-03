import { createBrowserRouter, Navigate } from 'react-router';
import AuthLayout from './app/auth/layout/AuthLayout.tsx';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import LoginPage from './app/auth/pages/LoginPage/LoginPage.tsx';
import './assets/styles/index.pcss';

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
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);
