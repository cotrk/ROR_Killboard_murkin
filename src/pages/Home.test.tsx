import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Home } from '@/pages/Home';
import { TestWrapper } from '@/test/TestWrapper';

describe('Home Component', () => {
  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <Home tab="players" />
      </TestWrapper>
    );
    expect(screen.getByText('pages:home.showPlayerLeaderboard')).toBeInTheDocument();
  });

  it('displays correct tab content', () => {
    render(
      <TestWrapper>
        <Home tab="guilds" />
      </TestWrapper>
    );
    expect(screen.getByText('pages:home.showGuildLeaderboard')).toBeInTheDocument();
  });

  it('shows search box for players tab', () => {
    render(
      <TestWrapper>
        <Home tab="players" />
      </TestWrapper>
    );
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });
});
