import '@clients/shared/styles/index.pcss';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';

import { AuthLayout, LoginPage } from './app/auth';
import AuthProvider from './app/AuthProvider.tsx';
import { BaseLayout } from './app/base';

const router = createBrowserRouter([
  {
    path: '*',
    element: <Navigate to='/' replace />
  },
  {
    path: '/',
    element: (
      <AuthProvider>
        <BaseLayout />
      </AuthProvider>
    )
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
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
