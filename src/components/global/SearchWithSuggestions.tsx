import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLazyQuery } from '@apollo/client';
import { Link } from 'react-router';
import { SEARCH } from '@/graphql/queries/killQueries';
import { debounce } from 'lodash';
import { SearchResult } from '@/types';
import { LoadingState } from '@/components/shared/LoadingState';

interface SearchWithSuggestionsProps {
  isPlayer?: boolean;
  placeholder?: string;
  initialQuery?: string;
  onSubmit?: (query: string) => void;
}

export const SearchWithSuggestions: React.FC<SearchWithSuggestionsProps> = ({
  placeholder,
  initialQuery,
  onSubmit,
}) => {
  const { t } = useTranslation('components');
  const [query, setQuery] = useState(initialQuery || '');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [searchAPI] = useLazyQuery(SEARCH);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchQuery: string) => {
        if (searchQuery.length < 2) {
          setSuggestions([]);
          return;
        }

        setIsLoading(true);
        try {
          const result = await searchAPI({
            variables: {
              query: searchQuery,
              first: 10,
            },
          });
          setSuggestions(result.data?.search?.nodes || []);
        } catch (error) {
          console.error('Search error:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300),
    [searchAPI],
  );

  useEffect(() => {
    if (query.length >= 2) {
      debouncedSearch(query);
    } else {
      setSuggestions([]);
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow click events
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSubmit = () => {
    if (onSubmit && query.trim()) {
      onSubmit(query.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'character':
        return 'fas fa-user';
      case 'guild':
        return 'fas fa-users';
      case 'item':
        return 'fas fa-cube';
      default:
        return 'fas fa-question';
    }
  };

  const getSuggestionLink = (result: SearchResult) => {
    switch (result.type) {
      case 'character':
        return `/character/${result.id}`;
      case 'guild':
        return `/guild/${result.id}`;
      case 'item':
        return `/item/${result.id}`;
      default:
        return '#';
    }
  };

  return (
    <div className="form-control" style={{ position: 'relative' }}>
      <div className="input-group">
        <input
          type="text"
          id="search-input"
          name="search"
          className="input input-bordered input-primary flex-1"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyPress={handleKeyPress}
          placeholder={placeholder || t('searchBox.placeholder', 'Search...')}
        />
        <button className="btn btn-primary" onClick={handleSubmit}>
          <i className="fas fa-search"></i>
        </button>
      </div>

      {showSuggestions && query.length >= 2 && (
        <div
          className="card bg-base-100 shadow-xl border border-base-300"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          <div className="card-body p-0">
            {isLoading ? (
              <LoadingState size="md" className="p-4" />
            ) : suggestions.length > 0 ? (
              <ul className="menu">
                {suggestions.map((result) => (
                  <li key={result.id}>
                    <Link
                      to={getSuggestionLink(result)}
                      className="flex items-center gap-3 p-3 hover:bg-base-200 transition-colors"
                      onClick={() => setShowSuggestions(false)}
                    >
                      <i
                        className={`fas ${getSuggestionIcon(result.type)} text-base-content/60`}
                      ></i>
                      <div className="flex-1">
                        <div className="font-medium text-base-content">
                          {result.name}
                        </div>
                        <div className="text-sm text-base-content/60 capitalize">
                          {result.type}
                        </div>
                      </div>
                      <div className="badge badge-ghost badge-sm capitalize">
                        {result.type}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-base-content/60">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
