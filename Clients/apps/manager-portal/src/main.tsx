import '@clients/shared/styles/index.pcss';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';

import { AuthLayout, LoginPage } from './app/auth';
import AuthProvider from './app/AuthProvider.tsx';
import { BaseLayout, CountriesPage } from './app/base';

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
    ),
    children: [
      {
        path: '/home',
        element: <div>home</div>
      },
      {
        path: '/programs/countries',
        element: <CountriesPage />
      },
      {
        path: '/programs/schools',
        element: <div>schools</div>
      },
      {
        path: '/programs/courses',
        element: <div>courses</div>
      },
      {
        path: '/programs/courses',
        element: <div>courses</div>
      },
      {
        path: '/students/current',
        element: <div>current</div>
      },
      {
        path: '/students/archived',
        element: <div>archived</div>
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
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
