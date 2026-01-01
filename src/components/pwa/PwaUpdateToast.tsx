import React from 'react';

type UpdateSW = (reloadPage?: boolean) => Promise<void>;

type PwaNeedRefreshEvent = CustomEvent<{ updateSW: UpdateSW }>;

type PwaUpdateToastProps = {
  className?: string;
};

export function PwaUpdateToast({ className }: PwaUpdateToastProps) {
  const [updateSW, setUpdateSW] = React.useState<UpdateSW | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const handleNeedRefresh = (event: Event) => {
      const e = event as PwaNeedRefreshEvent;
      if (e.detail?.updateSW == null) return;
      setUpdateSW(() => e.detail.updateSW);
      setVisible(true);
    };

    window.addEventListener('pwa:need-refresh', handleNeedRefresh);

    return () => {
      window.removeEventListener('pwa:need-refresh', handleNeedRefresh);
    };
  }, []);

  if (!visible || updateSW == null) return null;

  return (
    <div className={className} role="status" aria-live="polite">
      <div className="toast toast-bottom toast-center z-50">
        <div className="alert alert-info shadow-lg">
          <div className="flex flex-col gap-2">
            <div className="font-semibold">Update available</div>
            <div className="text-sm opacity-80">
              Refresh to load the latest version.
            </div>
            <div className="flex gap-2">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => {
                  void updateSW(true);
                }}
                type="button"
              >
                Refresh
              </button>
              <button
                className="btn btn-sm"
                onClick={() => setVisible(false)}
                type="button"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
