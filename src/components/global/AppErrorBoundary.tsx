import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({
  error,
  resetErrorBoundary,
}) => (
  <div className="container is-fluid mt-5">
    <div className="notification is-danger">
      <h4 className="title is-4">Something went wrong</h4>
      <p className="mb-3">An error occurred while rendering this page.</p>
      <details className="mb-3">
        <summary>Error details</summary>
        <pre className="has-text-danger">{error.message}</pre>
      </details>
      <button className="button is-danger" onClick={resetErrorBoundary}>
        Try again
      </button>
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
