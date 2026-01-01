import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock React Router
vi.mock('react-router', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
  useSearchParams: () => [new URLSearchParams()],
  Link: ({ children, to, ...props }: any) => React.createElement('a', { href: to, ...props }, children),
  Routes: ({ children }: any) => React.createElement('div', null, children),
  Route: ({ element }: any) => element,
  BrowserRouter: ({ children }: any) => React.createElement('div', null, children),
}));

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
    },
  }),
  initReactI18next: {},
  I18nextProvider: ({ children }: any) => children,
}));

// Mock Apollo Client
vi.mock('@apollo/client', () => ({
  ApolloProvider: ({ children }: any) => children,
  useQuery: () => ({ 
    data: {
      character: {
        killStatistics: [
          { date: '2024-01-01', kills: 5, deaths: 2, renownGained: 100 },
          { date: '2024-01-02', kills: 8, deaths: 3, renownGained: 150 },
          { date: '2024-01-03', kills: 12, deaths: 1, renownGained: 200 },
          { date: '2024-01-04', kills: 7, deaths: 4, renownGained: 120 },
          { date: '2024-01-05', kills: 15, deaths: 2, renownGained: 300 },
        ]
      }
    }, 
    loading: false, 
    error: null 
  }),
  useLazyQuery: () => [vi.fn(), { 
      data: {
        search: [
          { id: '1', name: 'TestPlayer', type: 'CHARACTER', description: 'Level 40 Bright Wizard' },
          { id: '2', name: 'TestGuild', type: 'GUILD', description: '50 members' },
        ]
      }, 
      loading: false, 
      error: null 
    }],
  useSubscription: () => ({ 
      data: {
        liveKills: [
          {
            id: '1',
            victim: {
              name: 'TestVictim',
              level: 40,
              renownRank: 80,
              career: 'BrightWizard',
              character: { id: '1', career: 'BrightWizard', name: 'TestVictim' },
              guild: { id: '1', name: 'TestGuild' }
            },
            attackers: [
              { 
                name: 'TestAttacker', 
                damagePercent: 85,
                character: { id: '2', career: 'Sword Master', name: 'TestAttacker' },
                guild: { id: '2', name: 'AttackerGuild' }
              }
            ],
            time: new Date().toISOString(),
            zone: { id: '1', name: 'Altdorf' }
          }
        ]
      }, 
      error: null 
    }),
  gql: (query: any) => query,
}));
