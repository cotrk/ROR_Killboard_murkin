import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { LoadingState } from './LoadingState';
import { ApolloError } from '@apollo/client';

interface ErrorBoundaryProps {
  error?: Error | ApolloError | null;
  customText?: string;
  className?: string;
}

interface DataValidationProps {
  data: any;
  customText?: string;
  className?: string;
}

export const ErrorBoundary = ({ 
  error, 
  customText, 
  className = '' 
}: ErrorBoundaryProps): ReactElement | null => {
  const { t } = useTranslation('common');
  
  if (!error) return null;
  
  return (
    <div className={`alert alert-error shadow-lg ${className}`}>
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2m2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 className="font-bold">Error!</h3>
          <div className="text-xs">{customText || error.message}</div>
        </div>
      </div>
    </div>
  );
};

export const DataValidator = ({ 
  data, 
  customText, 
  className = '' 
}: DataValidationProps): ReactElement | null => {
  const { t } = useTranslation('common');
  
  if (data == null) {
    return (
      <div className={`alert alert-warning shadow-lg ${className}`}>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h3 className="font-bold">Warning!</h3>
            <div className="text-xs">{customText || t('notFound')}</div>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

// Simplified hook for direct return patterns
export const useDataQueryHandler = () => {
  const { t } = useTranslation('common');
  
  const handleLoadingError = (loading: boolean, error: Error | ApolloError | null, data: any, notFoundText?: string) => {
    if (loading) return <LoadingState />;
    if (error) return <ErrorMessage name={error.name} message={error.message} />;
    if (data == null) return <ErrorMessage customText={notFoundText || t('notFound')} />;
    return null;
  };
  
  return { handleLoadingError };
};
