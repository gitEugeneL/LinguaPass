import './assets/styles/index.pcss';
import 'react-datepicker/dist/react-datepicker.css';
import { createBrowserRouter, Navigate } from 'react-router';
import AuthLayout from './app/auth/layout/AuthLayout.tsx';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import LoginPage from './app/auth/pages/LoginPage/LoginPage.tsx';
import RegistrationPage from './app/auth/pages/RegistrationPage/RegistrationPage.tsx';
import AuthProvider from './app/AuthProvider.tsx';
import ForgotPasswordPage from './app/auth/pages/ForgotPasswordPage/ForgotPasswordPage.tsx';
import ResetPasswordPage from './app/auth/pages/ResetPasswprdPage/ResetPasswordPage.tsx';
import BaseLayout from './app/base/layout/BaseLayout.tsx';
import LanguagePage from './app/base/pages/LanguagePage.tsx';
import SchoolPage from './app/base/pages/SchoolPage.tsx';
import CoursePage from './app/base/pages/CoursePage.tsx';
import ContactInfoPage from './app/base/pages/ContactInfoPage.tsx';
import { routes } from './helpers/routeHelpers.ts';
import PersonalInfoPage from './app/base/pages/PerosnalInfoPage.tsx';

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
        element: <div>documents page</div>
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
