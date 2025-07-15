import { useLocation } from 'react-router-dom';

// Custom hook to track events with page name
const useGTMEventTracker = () => {
  const location = useLocation();  // Get the current page URL

  const trackEvent = (event, eventCategory, eventAction, eventLabel) => {
    const fromPageUrl = location.pathname;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event,
      eventCategory,
      eventAction,
      eventLabel,
      fromPageUrl,  // Adding the page name here
      timestamp: new Date().toISOString()
    });
    // console.log('GTM pushed:', window.dataLayer);
  };

  return trackEvent;
};

export default useGTMEventTracker;
