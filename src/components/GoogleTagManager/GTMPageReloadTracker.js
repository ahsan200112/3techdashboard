// src/components/GTMPageReloadTracker.js
import { useEffect } from 'react';

const GTMPageReloadTracker = () => {
  useEffect(() => {
    const handleBeforeUnload = () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'pageReload',
        pagePath: window.location.pathname,
        pageTitle: document.title,
        timestamp: new Date().toISOString(),
      });

     // console.log('GTM pageReload event pushed:', window.location.pathname);
    };

    // Add event listener for page reload (beforeunload event)
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return null; // No UI
};

export default GTMPageReloadTracker;
