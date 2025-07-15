// src/components/ScrollDepthTracker.js
import { useEffect } from 'react';

const GTMScrollDepthTracker = () => {
  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollPosition = window.scrollY + window.innerHeight;
    const scrollDepth = (scrollPosition / scrollHeight) * 100; // Calculate scroll depth percentage

    if (scrollDepth >= 25 && scrollDepth < 50) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'scrollDepth',
        scrollDepth: 25,
        pagePath: window.location.pathname,
        timestamp: new Date().toISOString()
      });
     // console.log('GTM scroll depth 25% triggered:', window.location.pathname);
    } else if (scrollDepth >= 50 && scrollDepth < 75) {
      window.dataLayer.push({
        event: 'scrollDepth',
        scrollDepth: 50,
        pagePath: window.location.pathname,
        timestamp: new Date().toISOString()
      });
     // console.log('GTM scroll depth 50% triggered:', window.location.pathname);
    } else if (scrollDepth >= 75) {
      window.dataLayer.push({
        event: 'scrollDepth',
        scrollDepth: 75,
        pagePath: window.location.pathname,
        timestamp: new Date().toISOString()
      });
     // console.log('GTM scroll depth 75% triggered:', window.location.pathname);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return null; // No UI
};

export default GTMScrollDepthTracker;
