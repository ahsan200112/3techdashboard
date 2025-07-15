// src/routes/router.js
import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Signup from '../pages/Signup/Signup';
import Dashboard from '../components/layout/Dashboard';
import ErrorBoundary from '../components/ErrorBoundary';
import ProtectedDashboardRoute from './ProtectedDashboardRoute';
import { dashboardChildrenRoutes } from './DashboardRoutes';
import VerifyEmail from '../components/VerifyEmail';
import ChangeEmail from '../components/ChangeEmail';
import StoreCreation from "../pages/creationStore/index";
import PublicRoute from './PublicRoute';
import ThemePreview from '../pages/stores/ThemePreview';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
    errorElement: <ErrorBoundary />
  },
  {
    path: '/signup',
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
    errorElement: <ErrorBoundary />
  },
  {
    path: '/verify-email',
    element: <VerifyEmail />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/enter-email',
    element: <ChangeEmail />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/theme-preview/:themeId/:page?',
    element: <ThemePreview />,
    errorElement: <ErrorBoundary />
  },
  {
    path: 'store-creation',
    element: (
      <ProtectedDashboardRoute>
        <StoreCreation />
      </ProtectedDashboardRoute>
    ),
    errorElement: <ErrorBoundary />
  },
  {
    path: '/',
    element: (
      <ProtectedDashboardRoute>
        <Dashboard />
      </ProtectedDashboardRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: dashboardChildrenRoutes
  }
]);
