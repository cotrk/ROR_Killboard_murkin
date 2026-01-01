import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { SearchWithSuggestions } from '@/components/global/SearchWithSuggestions';
import { SEARCH_ENTITIES } from '@/graphql/queries/killQueries';
import { TestWrapper } from '@/test/TestWrapper';
import { vi } from 'vitest';

// Mock search data
const mockSearchData = {
  search: [
    {
      id: '1',
      name: 'TestCharacter',
      type: 'character',
      description: 'Level 40 Bright Wizard',
    },
    {
      id: '2',
      name: 'TestGuild',
      type: 'guild',
      description: 'Test Guild Description',
    },
  ],
};

const mockSearchRequest = {
  request: {
    query: SEARCH_ENTITIES,
    variables: {
      query: 'test',
      type: 'CHARACTER',
    },
  },
  result: { data: mockSearchData },
};

describe('SearchWithSuggestions Component', () => {
  const defaultProps = {
    isPlayer: true,
    placeholder: 'Search players...',
  };

  it('renders search input correctly', () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={[mockSearchRequest]} addTypename={false}>
          <SearchWithSuggestions {...defaultProps} />
        </MockedProvider>
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText('Search players...')).toBeInTheDocument();
  });

  it('shows suggestions when typing', async () => {
    const mocks = [mockSearchRequest];

    render(
      <TestWrapper>
        <MockedProvider mocks={mocks} addTypename={false}>
          <SearchWithSuggestions {...defaultProps} />
        </MockedProvider>
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('Search players...') as HTMLInputElement;
    
    // Type in the search input
    input.value = 'test';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    // Wait for suggestions to appear
    await waitFor(() => {
      expect(screen.getByText('TestCharacter')).toBeInTheDocument();
    });
  });

  it('renders with custom placeholder', () => {
    const propsWithPlaceholder = {
      ...defaultProps,
      placeholder: 'Custom placeholder',
    };

    render(
      <TestWrapper>
        <MockedProvider mocks={[mockSearchRequest]} addTypename={false}>
          <SearchWithSuggestions {...propsWithPlaceholder} />
        </MockedProvider>
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('renders for guild search', () => {
    const guildProps = {
      isPlayer: false,
      placeholder: 'Search guilds...',
    };

    render(
      <TestWrapper>
        <MockedProvider mocks={[mockSearchRequest]} addTypename={false}>
          <SearchWithSuggestions {...guildProps} />
        </MockedProvider>
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText('Search guilds...')).toBeInTheDocument();
  });

  it('handles initial query correctly', () => {
    const propsWithInitialQuery = {
      ...defaultProps,
      initialQuery: 'initial search',
    };

    render(
      <TestWrapper>
        <MockedProvider mocks={[mockSearchRequest]} addTypename={false}>
          <SearchWithSuggestions {...propsWithInitialQuery} />
        </MockedProvider>
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('Custom placeholder') as HTMLInputElement;
    expect(input.value).toBe('initial search');
  });

  it('calls onSubmit when provided', () => {
    const mockOnSubmit = vi.fn();

    const propsWithOnSubmit = {
      ...defaultProps,
      onSubmit: mockOnSubmit,
    };

    render(
      <TestWrapper>
        <MockedProvider mocks={[mockSearchRequest]} addTypename={false}>
          <SearchWithSuggestions {...propsWithOnSubmit} />
        </MockedProvider>
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('Search players...') as HTMLInputElement;
    const searchButton = screen.getByRole('button');

    // Type in search and click button
    (input as HTMLInputElement).value = 'test query';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    
    searchButton.click();

    expect(mockOnSubmit).toHaveBeenCalledWith('test query');
  });

  it('handles Enter key press', () => {
    const mockOnSubmit = vi.fn();

    const propsWithOnSubmit = {
      ...defaultProps,
      onSubmit: mockOnSubmit,
    };

    render(
      <TestWrapper>
        <MockedProvider mocks={[mockSearchRequest]} addTypename={false}>
          <SearchWithSuggestions {...propsWithOnSubmit} />
        </MockedProvider>
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('Search players...') as HTMLInputElement;

    // Type in search and press Enter
    (input as HTMLInputElement).value = 'test query';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    
    input.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
    }));

    expect(mockOnSubmit).toHaveBeenCalledWith('test query');
  });

  it('shows loading state while searching', async () => {
    const slowMock = {
      request: {
        query: SEARCH_ENTITIES,
        variables: {
          query: 'test',
          type: 'CHARACTER',
        },
      },
      result: { data: mockSearchData },
      delay: 100, // Simulate slow response
    };

    render(
      <TestWrapper>
        <MockedProvider mocks={[slowMock]} addTypename={false}>
          <SearchWithSuggestions {...defaultProps} />
        </MockedProvider>
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('Search players...') as HTMLInputElement;
    
    // Type to trigger search
    (input as HTMLInputElement).value = 'test';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    // Should show loading state
    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });

  it('shows no results message when search returns empty', async () => {
    const emptyMock = {
      request: {
        query: SEARCH_ENTITIES,
        variables: {
          query: 'noresults',
          type: 'CHARACTER',
        },
      },
      result: { data: { search: [] } },
    };

    render(
      <TestWrapper>
        <MockedProvider mocks={[emptyMock]} addTypename={false}>
          <SearchWithSuggestions {...defaultProps} />
        </MockedProvider>
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('Search players...') as HTMLInputElement;
    
    // Type to trigger search
    (input as HTMLInputElement).value = 'noresults';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });
});
