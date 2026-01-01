import React from 'react';
import { BrowserRouter } from 'react-router';
import { ApolloProvider } from '@apollo/client';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';

// Initialize i18n for tests
i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      components: {
        'searchBox.placeholder': 'Search...',
        'latestKills.title': 'Latest Kills',
      },
      searchBox: {
        'placeholder': 'Search...',
      },
      pages: {
        'home.showPlayerLeaderboard': 'Players',
        'home.showGuildLeaderboard': 'Guilds',
        'home.showScenarios': 'Scenarios',
        'home.showSkirmishes': 'Skirmishes',
      },
    },
  },
});

const MockApolloProvider = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

interface TestWrapperProps {
  children: React.ReactNode;
}

export const TestWrapper: React.FC<TestWrapperProps> = ({ children }) => {
  return (
    <I18nextProvider i18n={i18n}>
      <MockApolloProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </MockApolloProvider>
    </I18nextProvider>
  );
};
