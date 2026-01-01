import React from 'react';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { Announcer } from '@/components/accessibility/AccessibilityComponents';

/**
 * ErrorReportingService
 * 
 * Centralized error reporting and tracking
 */
class ErrorReportingService {
  private errors: Array<{
    error: Error;
    timestamp: string;
    userAgent: string;
    url: string;
  }> = [];

  report(error: Error, context?: any) {
    const errorReport = {
      error,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      context,
    };

    this.errors.push(errorReport);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error reported:', errorReport);
    }

    // TODO: Send to external error tracking service
    // this.sendToErrorService(errorReport);
  }

  getErrors() {
    return this.errors;
  }

  clearErrors() {
    this.errors = [];
  }

  private async sendToErrorService(errorReport: any) {
    // Integration with error tracking service like Sentry, LogRocket, etc.
    try {
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport),
      // });
    } catch (e) {
      console.error('Failed to report error:', e);
    }
  }
}

export const errorReportingService = new ErrorReportingService();

/**
 * useErrorHandler Hook
 * 
 * React hook for handling errors in functional components
 */
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((error: Error, context?: any) => {
    setError(error);
    errorReportingService.report(error, context);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
  };
};

/**
 * withErrorBoundary HOC
 * 
 * Higher-order component for adding error boundaries
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode,
  errorCallback?: (error: Error, errorInfo: React.ErrorInfo) => void
): React.ComponentType<P> => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback} onError={errorCallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

/**
 * Error Recovery Strategies
 */
export const errorRecoveryStrategies = {
  /**
   * Retry the failed operation
   */
  retry: async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
      }
    }
    
    throw lastError;
  },

  /**
   * Fallback to default value
   */
  fallback: <T>(
    operation: () => T,
    fallbackValue: T
  ): T => {
    try {
      return operation();
    } catch (error) {
      errorReportingService.report(error);
      return fallbackValue;
    }
  },

  /**
   * Graceful degradation
   */
  degrade: async <T>(
    primaryOperation: () => Promise<T>,
    fallbackOperation: () => Promise<T>
  ): Promise<T> => {
    try {
      return await primaryOperation();
    } catch (error) {
      errorReportingService.report(error);
      return await fallbackOperation();
    }
  },
};

/**
 * Error Types
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  PERMISSION = 'PERMISSION',
  UNKNOWN = 'UNKNOWN',
}

export class AppError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
    public context?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Error Utilities
 */
export const errorUtils = {
  /**
   * Check if error is network related
   */
  isNetworkError: (error: Error): boolean => {
    return error.message.includes('fetch') || 
           error.message.includes('network') ||
           error.message.includes('timeout');
  },

  /**
   * Check if error is authentication related
   */
  isAuthError: (error: Error): boolean => {
    return error.message.includes('unauthorized') ||
           error.message.includes('401') ||
           error.message.includes('authentication');
  },

  /**
   * Get user-friendly error message
   */
  getUserMessage: (error: Error): string => {
    if (errorUtils.isNetworkError(error)) {
      return 'Network connection issue. Please check your internet connection and try again.';
    }
    
    if (errorUtils.isAuthError(error)) {
      return 'Authentication required. Please log in and try again.';
    }
    
    return error.message || 'An unexpected error occurred. Please try again.';
  },

  /**
   * Log error with context
   */
  logWithContext: (error: Error, context: Record<string, any>) => {
    console.error('Error with context:', {
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });
  },
};
