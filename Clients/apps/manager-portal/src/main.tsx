import '@clients/shared/styles/index.pcss';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';

import { AuthLayout, LoginPage } from './app/auth';
import AuthProvider from './app/AuthProvider.tsx';
import { BaseLayout, CountriesPage, CountryDetailPage } from './app/base';

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
        path: 'home',
        element: <div>Home</div>
      },
      {
        path: 'programs',
        children: [
          {
            path: 'countries',
            children: [
              {
                path: '',
                element: <CountriesPage />
              },
              {
                path: 'add-edit',
                element: <CountryDetailPage />
              },
              {
                path: 'add-edit/:countryId',
                element: <CountryDetailPage />
              }
            ]
          },
          {
            path: 'schools',
            element: <div>Schools</div>
          },
          {
            path: 'courses',
            element: <div>Courses</div>
          }
        ]
      },
      {
        path: 'students',
        children: [
          {
            path: 'current',
            element: <div>Current Students</div>
          },
          {
            path: 'archived',
            element: <div>Archived Students</div>
          }
        ]
      }
    ]
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        path: 'login',
        element: <LoginPage />
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
