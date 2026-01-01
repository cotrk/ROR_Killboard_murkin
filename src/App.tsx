import { useLocation } from 'react-router';

import './i18n/config';
import React from 'react';
import { AppRoutes } from '@/routes/AppRoutes';
import { OfflineIndicator } from '@/components/pwa/OfflineIndicator';
import { PwaUpdateToast } from '@/components/pwa/PwaUpdateToast';

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      options: { page_location: string },
    ) => void;
  }
}

// Send page views to google analytics
function usePageViews() {
  const location = useLocation();
  React.useEffect(() => {
    if (window.gtag == null) return;
    window.gtag('event', 'pageview', {
      page_location: location.pathname,
    });
  }, [location]);
}

function App() {
  usePageViews();

  return (
    <>
      <OfflineIndicator />
      <PwaUpdateToast />
      <AppRoutes />
    </>
  );
}

export default App;
