import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback: React.FC<{
  error: Error;
  resetErrorBoundary: () => void;
}> = ({ error, resetErrorBoundary }) => (
  <div className="min-h-[50vh] flex items-center justify-center p-6">
    <div className="w-full max-w-2xl">
      <div className="alert alert-error shadow-lg">
        <div className="flex flex-col gap-3">
          <h4 className="text-lg font-bold">Something went wrong</h4>
          <p className="text-sm opacity-80">
            An error occurred while rendering this page.
          </p>
          <details className="text-sm">
            <summary className="cursor-pointer">Error details</summary>
            <pre className="mt-2 whitespace-pre-wrap break-words text-error-content/90">
              {error.message}
            </pre>
          </details>
          <div>
            <button className="btn btn-error" onClick={resetErrorBoundary}>
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const AppErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error, errorInfo) => {
      console.error('Error caught by boundary:', error, errorInfo);
      // In production, you might want to send this to an error reporting service
    }}
  >
    {children}
  </ErrorBoundary>
);
