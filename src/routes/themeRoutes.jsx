// Theme Routes Configuration
import { createBrowserRouter } from 'react-router-dom';

// Theme 1 Components
import Theme1Home from '../themes/theme1/pages/Home';
import Theme1Products from '../themes/theme1/pages/Products';

// Theme 2 Components  
import Theme2Home from '../themes/theme2/pages/Home';
import Theme2Products from '../themes/theme2/pages/Products';

// Theme route configurations
export const themeRoutes = {
  theme1: {
    home: Theme1Home,
    products: Theme1Products,
  },
  theme2: {
    home: Theme2Home,
    products: Theme2Products,
  }
};

// Create theme-specific routers
export const createThemeRouter = (themeId) => {
  const themeComponents = themeRoutes[themeId];
  
  if (!themeComponents) {
    throw new Error(`Theme ${themeId} not found`);
  }

  return createBrowserRouter([
    {
      path: '/',
      element: <themeComponents.home />,
    },
    {
      path: '/products',
      element: <themeComponents.products />,
    },
    // Add more theme-specific routes as needed
  ]);
};

// Theme preview routes for the preview functionality
export const themePreviewRoutes = createBrowserRouter([
  {
    path: '/theme-preview/theme1',
    element: <Theme1Home />,
  },
  {
    path: '/theme-preview/theme1/products',
    element: <Theme1Products />,
  },
  {
    path: '/theme-preview/theme2',
    element: <Theme2Home />,
  },
  {
    path: '/theme-preview/theme2/products',
    element: <Theme2Products />,
  },
]);