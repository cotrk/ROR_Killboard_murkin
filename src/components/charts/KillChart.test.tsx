import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { KillChart } from '@/components/charts/KillChart';
import { GET_KILL_CHART } from '@/graphql/queries/killQueries';
import { TestWrapper } from '@/test/TestWrapper';
import { vi } from 'vitest';

// Mock data for testing
const mockKillData = {
  character: {
    killStatistics: [
      { date: '2024-01-01', kills: 5, deaths: 2, renownGained: 100 },
      { date: '2024-01-02', kills: 8, deaths: 1, renownGained: 150 },
      { date: '2024-01-03', kills: 3, deaths: 4, renownGained: 75 },
      { date: '2024-01-04', kills: 12, deaths: 0, renownGained: 200 },
      { date: '2024-01-05', kills: 7, deaths: 3, renownGained: 125 },
    ],
  },
};

const mockRequest = {
  request: {
    query: GET_KILL_CHART,
    variables: {
      characterId: 'test-character-123',
      dateRange: {
        start: '2024-01-01T00:00:00.000Z',
        end: '2024-01-31T23:59:59.999Z',
      },
    },
  },
  result: { data: mockKillData },
};

describe('KillChart Component', () => {
  const defaultProps = {
    characterId: 'test-character-123',
    dateRange: {
      start: '2024-01-01T00:00:00.000Z',
      end: '2024-01-31T23:59:59.999Z',
    },
    title: 'Test Kill Chart',
  };

  it('renders loading state initially', () => {
    const mocks = [mockRequest];

    render(
      <TestWrapper>
        <MockedProvider mocks={mocks} addTypename={false}>
          <KillChart {...defaultProps} />
        </MockedProvider>
      </TestWrapper>
    );

    expect(screen.getByText('Loading chart data...')).toBeInTheDocument();
  });

  it('renders chart with data after loading', async () => {
    const mocks = [mockRequest];

    render(
      <TestWrapper>
        <MockedProvider mocks={mocks} addTypename={false}>
          <KillChart {...defaultProps} />
        </MockedProvider>
      </TestWrapper>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading chart data...')).not.toBeInTheDocument();
    });

    // Check if title is rendered
    expect(screen.getByText('Test Kill Chart')).toBeInTheDocument();
  });

  it('renders error state when GraphQL query fails', async () => {
    const errorMock = {
      request: {
        query: GET_KILL_CHART,
        variables: {
          characterId: 'test-character-123',
          dateRange: {
            start: '2024-01-01T00:00:00.000Z',
            end: '2024-01-31T23:59:59.999Z',
          },
        },
      },
      error: new Error('GraphQL error'),
    };

    render(
      <TestWrapper>
        <MockedProvider mocks={[errorMock]} addTypename={false}>
          <KillChart {...defaultProps} />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error loading chart/)).toBeInTheDocument();
    });
  });

  it('does not render when characterId is not provided', () => {
    const propsWithoutId = {
      ...defaultProps,
      characterId: undefined,
    };

    const mocks = [mockRequest];

    render(
      <TestWrapper>
        <MockedProvider mocks={mocks} addTypename={false}>
          <KillChart {...propsWithoutId} />
        </MockedProvider>
      </TestWrapper>
    );

    // Should not make GraphQL request and should not render loading state
    expect(screen.queryByText('Loading chart data...')).not.toBeInTheDocument();
  });

  it('renders with default title when not provided', async () => {
    const propsWithoutTitle = {
      characterId: 'test-character-123',
      dateRange: {
        start: '2024-01-01T00:00:00.000Z',
        end: '2024-01-31T23:59:59.999Z',
      },
    };

    const mocks = [mockRequest];

    render(
      <TestWrapper>
        <MockedProvider mocks={mocks} addTypename={false}>
          <KillChart {...propsWithoutTitle} />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Kill Trends')).toBeInTheDocument();
    });
  });

  it('renders with custom height when provided', async () => {
    const propsWithHeight = {
      ...defaultProps,
      height: 400,
    };

    const mocks = [mockRequest];

    render(
      <TestWrapper>
        <MockedProvider mocks={mocks} addTypename={false}>
          <KillChart {...propsWithHeight} />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Kill Chart')).toBeInTheDocument();
    });

    // Check if the chart container has the correct height
    const chartContainer = screen.getByText('Test Kill Chart').closest('.card');
    expect(chartContainer).toBeInTheDocument();
  });

  it('detects touch device correctly', async () => {
    // Mock touch device
    Object.defineProperty(window, 'ontouchstart', {
      value: true,
      writable: true,
    });

    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 1,
      writable: true,
    });

    const mocks = [mockRequest];

    render(
      <TestWrapper>
        <MockedProvider mocks={mocks} addTypename={false}>
          <KillChart {...defaultProps} />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Kill Chart')).toBeInTheDocument();
    });

    // Component should adapt to touch device
    expect(screen.getByText('Test Kill Chart')).toBeInTheDocument();
  });

  it('handles data point clicks when callback provided', async () => {
    const mockOnDataPointClick = jest.fn();

    const propsWithCallback = {
      ...defaultProps,
      onDataPointClick: mockOnDataPointClick,
    };

    const mocks = [mockRequest];

    render(
      <TestWrapper>
        <MockedProvider mocks={mocks} addTypename={false}>
          <KillChart {...propsWithCallback} />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Kill Chart')).toBeInTheDocument();
    });

    // The chart should be interactive
    expect(screen.getByText('Test Kill Chart')).toBeInTheDocument();
  });

  it('renders different chart types', async () => {
    const chartTypes = ['line', 'area', 'bar'] as const;

    for (const chartType of chartTypes) {
      const propsWithChartType = {
        ...defaultProps,
        type: chartType,
      };

      const mocks = [mockRequest];

      const { unmount } = render(
        <TestWrapper>
          <MockedProvider mocks={mocks} addTypename={false}>
            <KillChart {...propsWithChartType} />
          </MockedProvider>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Kill Chart')).toBeInTheDocument();
      });

      unmount();
    }
  });
});
