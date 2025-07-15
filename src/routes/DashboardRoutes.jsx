// src/routes/dashboardRoutes.js
import DashboardPage from '../pages/Dashboard/DashboardPage';
import ProductPage from '../pages/product/ProductPage';
import AddProductPage from '../pages/product/AddProductPage';
import EditProductPage from '../pages/product/EditProductPage';
import InventoryPage from '../pages/product/InventoryPage';
import CategoriesPage from '../pages/product/CategoriesPage';
import ProductOptionsPage from '../pages/product/ProductOptionsPage';
import OrdersPage from '../pages/orders/OrdersPage';
import CustomersPage from '../pages/customers/CustomersPage';
import AnalyticsPage from '../pages/analytics/AnalyticsPage';
import SettingsPage from '../pages/settings/SettingsPage';
import ErrorBoundary from '../components/ErrorBoundary';
import ThemesPage from '../pages/stores/ThemesPage';

export const dashboardChildrenRoutes = [
  {
    index: true,
    element: <DashboardPage />,
    errorElement: <ErrorBoundary />
  },
  {
    path: 'products/allproducts',
    element: <ProductPage />,
    errorElement: <ErrorBoundary />
  },
  {
    path: 'products/add',
    element: <AddProductPage />,
    errorElement: <ErrorBoundary />
  },
  {
    path: 'products/edit/:id',
    element: <EditProductPage />,
    errorElement: <ErrorBoundary />
  },
  {
    path: 'products/inventory',
    element: <InventoryPage />,
    errorElement: <ErrorBoundary />
  },
  {
    path: 'products/categories',
    element: <CategoriesPage />,
    errorElement: <ErrorBoundary />
  },
  {
    path: 'products/options',
    element: <ProductOptionsPage />,
    errorElement: <ErrorBoundary />
  },
  {
    path: 'orders',
    element: <OrdersPage />,
    errorElement: <ErrorBoundary />
  },
  {
    path: 'customers',
    element: <CustomersPage />,
    errorElement: <ErrorBoundary />
  },
  {
    path: 'analytics',
    element: <AnalyticsPage />,
    errorElement: <ErrorBoundary />
  },
  {
    path: 'settings',
    element: <SettingsPage />,
    errorElement: <ErrorBoundary />
  },
  {
    path: 'stores/themes',
    element: <ThemesPage />,
    errorElement: <ErrorBoundary />
  }
];
