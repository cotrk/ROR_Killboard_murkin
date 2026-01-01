import React from 'react';

type OfflineIndicatorProps = {
  className?: string;
};

export function OfflineIndicator({ className }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = React.useState(() => navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className={className} role="status" aria-live="polite">
      <div className="alert alert-warning rounded-none">
        <span className="font-semibold">Offline</span>
        <span className="opacity-80">
          Showing cached content when available.
        </span>
      </div>
    </div>
  );
}
