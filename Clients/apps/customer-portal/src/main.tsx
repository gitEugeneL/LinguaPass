import '@clients/shared/styles/index.pcss';
import 'react-datepicker/dist/react-datepicker.css';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';

import {
  AuthLayout,
  ForgotPasswordPage,
  LoginPage,
  RegistrationPage,
  ResetPasswordPage
} from './app/auth';
import AuthProvider from './app/AuthProvider.tsx';
import {
  BaseLayout,
  ContactInfoPage,
  CoursePage,
  DocumentsPage,
  HomePage,
  LanguagePage,
  PersonalInfoPage,
  SchoolPage
} from './app/base';
import { ProcessingPage } from './app/base/pages/ProcessingPage.tsx';
import { routes } from './helpers';

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
        path: routes.home.to,
        element: <HomePage />
      },
      {
        path: routes.language.to,
        element: <LanguagePage />
      },
      {
        path: routes.school.to,
        element: <SchoolPage />
      },
      {
        path: routes.course.to,
        element: <CoursePage />
      },
      {
        path: routes.contact.to,
        element: <ContactInfoPage />
      },
      {
        path: routes.personal.to,
        element: <PersonalInfoPage />
      },
      {
        path: routes.documents.to,
        element: <DocumentsPage />
      },
      {
        path: 'processing',
        element: <ProcessingPage />
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
