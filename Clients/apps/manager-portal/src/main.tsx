import '@clients/shared/styles/index.pcss';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';

import { AuthLayout, LoginPage } from './app/auth';

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

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
