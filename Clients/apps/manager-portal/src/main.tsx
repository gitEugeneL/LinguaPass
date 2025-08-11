import '@clients/shared/styles/index.pcss';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';

import { AuthLayout, LoginPage } from './app/auth';
import AuthProvider from './app/AuthProvider.tsx';
import {
  BaseLayout,
  CountriesPage,
  CountryDetailPage,
  CourseDetailPage,
  CoursesPage,
  CurrentStudentsPage,
  SchoolDetailPage,
  SchoolsPage
} from './app/base';

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
            children: [
              {
                path: '',
                element: <SchoolsPage />
              },
              {
                path: ':countryId',
                element: <SchoolsPage />
              },

              {
                path: 'add-edit/:countryId',
                element: <SchoolDetailPage />
              },
              {
                path: 'add-edit/:countryId/:schoolId',
                element: <SchoolDetailPage />
              }
            ]
          },
          {
            path: 'courses',
            children: [
              {
                path: '',
                element: <CoursesPage />
              },
              {
                path: ':schoolId',
                element: <CoursesPage />
              },
              {
                path: 'add-edit/:schoolId',
                element: <CourseDetailPage />
              },
              {
                path: 'add-edit/:schoolId/:courseId',
                element: <CourseDetailPage />
              }
            ]
          }
        ]
      },
      {
        path: 'students',
        children: [
          {
            path: 'current',
            element: <CurrentStudentsPage />
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
