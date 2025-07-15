// src/components/GTMPageViewTracker.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const GTMPageViewTracker = () => {
  const location = useLocation();
  const { i18n } = useTranslation();

  // Helper to create a readable event name from the path
  const getEventNameFromPath = (path) => {
    if (path === '/' || path === '/home') return 'HomePageView';
    const cleanPath = path.replace(/^\/+|\/+$/g, ''); // remove leading/trailing slashes
    const capitalized = cleanPath
      .split('/')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
    return `${capitalized}PageView`;
  };

  useEffect(() => {
    const dynamicEventName = getEventNameFromPath(location.pathname);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: dynamicEventName,
      pagePath: location.pathname,
      pageLocation: window.location.href,
      pageTitle: document.title,
      language: i18n.language,
      timestamp: new Date().toISOString()
    });
  }, [location, i18n.language]);

  return null; // No UI
};

export default GTMPageViewTracker;
