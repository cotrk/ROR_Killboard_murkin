import { useQuery, QueryHookOptions, DocumentNode, TypedDocumentNode } from '@apollo/client';
import { ApolloError } from '@apollo/client';
import { LoadingState } from './LoadingState';
import { ErrorMessage } from '@/components/global/ErrorMessage';

interface UseDataQueryOptions<V> extends QueryHookOptions<V> {
  variables?: V;
  errorPolicy?: 'none' | 'ignore' | 'all';
  skip?: boolean;
  onCompleted?: (data: any) => void;
  onError?: (error: ApolloError) => void;
}

interface UseDataQueryResult<T> {
  loading: boolean;
  error: ApolloError | undefined;
  data: T | undefined;
  refetch: (variables?: Partial<V>) => Promise<any>;
}

interface UseDataQueryConfig {
  showLoading?: boolean;
  showError?: boolean;
  loadingMessage?: string;
  errorMessage?: string;
  notFoundMessage?: string;
}

// Generic hook for standardized data fetching
export function useDataQuery<T, V = Record<string, any>>(
  query: DocumentNode | TypedDocumentNode<T, V>,
  options?: UseDataQueryOptions<V>,
  config?: UseDataQueryConfig
): UseDataQueryResult<T> {
  const {
    showLoading = true,
    showError = true,
    loadingMessage,
    errorMessage,
    notFoundMessage
  } = config || {};

  const { loading, error, data, refetch } = useQuery<T, V>(query, options);

  // Handle loading state
  if (loading && showLoading) {
    return {
      loading: true,
      error: undefined,
      data: undefined,
      refetch
    };
  }

  // Handle error state
  if (error && showError) {
    console.error('Data query error:', error);
    return {
      loading: false,
      error,
      data: undefined,
      refetch
    };
  }

  return {
    loading: false,
    error: undefined,
    data,
    refetch
  };
}

// Hook for paginated data
export function usePaginatedQuery<T, V = Record<string, any>>(
  query: DocumentNode | TypedDocumentNode<T, V>,
  options?: UseDataQueryOptions<V>,
  config?: UseDataQueryConfig
): UseDataQueryResult<T> & {
  handlePageChange: (variables: Partial<V>) => void;
} {
  const result = useDataQuery<T, V>(query, options, config);
  
  const handlePageChange = (variables: Partial<V>) => {
    result.refetch(variables);
  };

  return {
    ...result,
    handlePageChange
  };
}

// Hook for data with search/filtering
export function useSearchableQuery<T, V = Record<string, any>>(
  query: DocumentNode | TypedDocumentNode<T, V>,
  searchParams: URLSearchParams,
  getVariables: (search: URLSearchParams) => V,
  options?: UseDataQueryOptions<V>,
  config?: UseDataQueryConfig
): UseDataQueryResult<T> & {
  handleSearch: (variables: Partial<V>) => void;
} {
  const variables = getVariables(searchParams);
  const result = useDataQuery<T, V>(query, { ...options, variables }, config);
  
  const handleSearch = (newVariables: Partial<V>) => {
    result.refetch(newVariables);
  };

  return {
    ...result,
    handleSearch
  };
}

// Hook for single entity queries
export function useEntityQuery<T, V = Record<string, any>>(
  query: DocumentNode | TypedDocumentNode<T, V>,
  variables: V,
  options?: Omit<UseDataQueryOptions<V>, 'variables'>,
  config?: UseDataQueryConfig
): UseDataQueryResult<T> {
  return useDataQuery<T, V>(query, { ...options, variables }, config);
}

// Hook for data with error tolerance
export function useTolerantQuery<T, V = Record<string, any>>(
  query: DocumentNode | TypedDocumentNode<T, V>,
  options?: UseDataQueryOptions<V>,
  config?: UseDataQueryConfig
): UseDataQueryResult<T> {
  return useDataQuery<T, V>(query, { ...options, errorPolicy: 'all' }, config);
}

// Hook for conditional queries
export function useConditionalQuery<T, V = Record<string, any>>(
  query: DocumentNode | TypedDocumentNode<T, V>,
  shouldSkip: boolean,
  variables?: V,
  options?: Omit<UseDataQueryOptions<V>, 'skip'>,
  config?: UseDataQueryConfig
): UseDataQueryResult<T> {
  return useDataQuery<T, V>(query, { ...options, variables, skip: shouldSkip }, config);
}
