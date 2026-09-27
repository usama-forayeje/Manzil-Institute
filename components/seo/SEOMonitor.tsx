import React, { useEffect } from 'react';

const SEOMonitor = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Logic to monitor SEO, e.g., track page views
    console.log('Page monitored for SEO');
  }, []);

  return <>{children}</>;
};

export default SEOMonitor;