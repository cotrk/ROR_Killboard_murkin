import { ReactElement } from 'react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingState = ({ 
  message, 
  size = 'md',
  className = ''
}: LoadingStateProps): ReactElement => {
  const sizeClasses = {
    sm: 'loading-sm',
    md: 'loading-md', 
    lg: 'loading-lg'
  };

  return (
    <div className={`flex justify-center py-4 ${className}`}>
      <span className={`loading loading-spinner ${sizeClasses[size]}`}></span>
      {message && <span className="ml-2 text-base-content/60">{message}</span>}
    </div>
  );
};

export const LoadingStateCentered = ({ 
  message = "Loading...", 
  size = 'md'
}: LoadingStateProps): ReactElement => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <span className={`loading loading-spinner loading-${size}`}></span>
        {message && <p className="mt-2 text-base-content/60">{message}</p>}
      </div>
    </div>
  );
};

export const LoadingStateInline = ({ 
  size = 'sm',
  className = ''
}: Omit<LoadingStateProps, 'message'>): ReactElement => {
  const sizeClasses = {
    sm: 'loading-sm',
    md: 'loading-md', 
    lg: 'loading-lg'
  };

  return (
    <span className={`loading loading-spinner ${sizeClasses[size]} ${className}`}></span>
  );
};
