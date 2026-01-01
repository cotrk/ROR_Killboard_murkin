`version 1.0.0`

# Warhammer Online: Return of Reckoning Killboard

## Technical Assessment & Enhancement Roadmap

---

## 📋 Project Overview

A comprehensive Warhammer Online: Return of Reckoning killboard application built with modern web technologies. The platform tracks player kills, scenarios, guilds, items, and various game statistics with a dark theme that matches the game's aesthetic.

**Tech Stack:**

- ⚛️ React 19
- 📘 TypeScript
- ⚡ Vite
- 🔗 GraphQL with Apollo Client
- 🎨 Bulma CSS Framework

---

## 🏗️ Architecture Assessment

### ✅ Strengths

#### Modern Technology Stack

- **React 19** - Latest React features and performance improvements
- **TypeScript** - Type-safe development experience
- **Vite** - Lightning-fast build tooling
- **GraphQL with Apollo Client** - Efficient data fetching

#### Development Tooling

- **ESLint** - Code quality enforcement
- **Prettier** - Consistent code formatting
- **GraphQL Code Generation** - Automated type generation from schema

#### Robust Feature Set

- **Internationalization** - React-i18next for multi-language support
- **Component Organization** - Well-structured component hierarchy
- **Custom Theming** - Bulma CSS with custom SCSS styling

---

## 🔧 Areas for Improvement

### 1. Code Quality & Technical Debt

#### TypeScript Usage Enhancement

**Issue:** `any[]` usage in App.tsx for Google Analytics

**Solution:** Define proper interface for type safety

```typescript
interface GtagArgs {
  command: string;
  eventName: string;
  options: {
    page_location: string;
  };
}

// Usage
declare global {
  interface Window {
    gtag: (...args: GtagArgs[]) => void;
  }
}
```

---

#### Route Organization

**Issue:** 59 routes defined in single App.tsx file

**Solution:** Split into feature-based route modules

```typescript
// routes/characterRoutes.ts
export const characterRoutes = [
  { path: "/character/:id", element: <Character tab="kills" /> },
  { path: "/character/:id/scenarios", element: <Character tab="scenarios" /> },
  { path: "/character/:id/deathblows", element: <Character tab="deathblows" /> },
  { path: "/character/:id/items", element: <Character tab="items" /> },
];

// routes/guildRoutes.ts
export const guildRoutes = [
  { path: "/guild/:id", element: <Guild tab="kills" /> },
  { path: "/guild/:id/members", element: <Guild tab="members" /> },
];

// App.tsx
import { characterRoutes } from './routes/characterRoutes';
import { guildRoutes } from './routes/guildRoutes';

const routes = [
  ...characterRoutes,
  ...guildRoutes,
  // ... other route groups
];
```

**Recommended Structure:**

```
src/
  routes/
    ├── characterRoutes.ts
    ├── guildRoutes.ts
    ├── scenarioRoutes.ts
    ├── itemRoutes.ts
    └── index.ts (exports combined routes)
```

---

#### GraphQL Query Management

**Issue:** Inline queries scattered throughout components

**Solution:** Centralize queries in dedicated files

```typescript
// src/graphql/queries/kills.ts
import { gql } from '@apollo/client';

export const GET_LATEST_KILLS = gql`
  query GetLatestKills($first: Int!) {
    kills(first: $first, orderBy: TIME_DESC) {
      nodes {
        id
        time
        character {
          name
          career
        }
        victim {
          name
          career
        }
      }
    }
  }
`;

// src/graphql/queries/characters.ts
export const GET_CHARACTER_DETAILS = gql`
  query GetCharacterDetails($id: ID!) {
    character(id: $id) {
      id
      name
      career
      level
      renownRank
      guildMemberships {
        guild {
          name
        }
      }
    }
  }
`;
```

**Recommended Structure:**

```
src/
  graphql/
    ├── queries/
    │   ├── kills.ts
    │   ├── characters.ts
    │   ├── guilds.ts
    │   └── scenarios.ts
    ├── mutations/
    │   └── (future mutations)
    └── fragments/
        └── commonFragments.ts
```

---

### 2. Performance Optimizations

#### Bundle Size Reduction

**Current Issue:** Large bundle size with full FontAwesome library

**Solution:** Implement tree-shaking for icons

```typescript
// ❌ Bad: Imports entire library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

// ✅ Good: Import only needed icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUser,
  faShield,
  faSword,
} from '@fortawesome/free-solid-svg-icons';

// Register only used icons
library.add(faHome, faUser, faShield, faSword);
```

**Expected Impact:** 40-60% reduction in icon bundle size

---

#### Image Optimization

**Issue:** Static career icons without optimization or lazy loading

**Solution:** Dynamic imports with WebP format

```typescript
// utils/imageLoader.ts
const careerIconCache = new Map<Career, string>();

export const loadCareerIcon = async (career: Career): Promise<string> => {
  if (careerIconCache.has(career)) {
    return careerIconCache.get(career)!;
  }

  const iconMap: Record<Career, () => Promise<{ default: string }>> = {
    [Career.Archmage]: () => import('/images/icons/archmage.webp'),
    [Career.Blackguard]: () => import('/images/icons/blackguard.webp'),
    [Career.BrightWizard]: () => import('/images/icons/brightwizard.webp'),
    // ... all careers
  };

  const module = await iconMap[career]();
  careerIconCache.set(career, module.default);
  return module.default;
};

// Component usage
const CareerIcon: React.FC<{ career: Career }> = ({ career }) => {
  const [iconUrl, setIconUrl] = useState<string>('');

  useEffect(() => {
    loadCareerIcon(career).then(setIconUrl);
  }, [career]);

  return iconUrl ? <img src={iconUrl} alt={career} /> : <Skeleton />;
};
```

**Additional Optimization:**

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'career-icons': [
            '/src/assets/icons/archmage.webp',
            // ... group icons into separate chunk
          ],
        },
      },
    },
  },
});
```

---

#### Data Fetching & Caching

**Solution:** Implement sophisticated caching strategies

```typescript
// apollo/client.ts
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { relayStylePagination } from '@apollo/client/utilities';

const client = new ApolloClient({
  uri: 'https://api.waremu.com/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          kills: relayStylePagination(),
          scenarios: relayStylePagination(),
          characters: {
            // Cache by ID for 5 minutes
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
      Character: {
        keyFields: ['id'],
      },
      Guild: {
        keyFields: ['id'],
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
    },
  },
});

export default client;
```

**Advanced Caching Hook:**

```typescript
// hooks/useCachedQuery.ts
export const useCachedQuery = <TData, TVariables>(
  query: DocumentNode,
  options?: QueryHookOptions<TData, TVariables>,
) => {
  const { data, loading, error } = useQuery(query, {
    ...options,
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network',
  });

  // Prefetch related data
  useEffect(() => {
    if (data) {
      prefetchRelatedData(data);
    }
  }, [data]);

  return { data, loading, error };
};
```

---

### 3. Feature Enhancements

#### Real-time Updates

**Implementation:** WebSocket integration for live kills

```typescript
// hooks/useLiveKills.ts
import { useState, useEffect } from 'react';

interface Kill {
  id: string;
  time: string;
  character: Character;
  victim: Character;
}

export const useLiveKills = (limit: number = 10) => {
  const [kills, setKills] = useState<Kill[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('wss://api.waremu.com/live-kills');

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const newKill: Kill = JSON.parse(event.data);
      setKills(prev => [newKill, ...prev.slice(0, limit - 1)]);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [limit]);

  return { kills, isConnected };
};

// Component usage
const LiveKillFeed: React.FC = () => {
  const { kills, isConnected } = useLiveKills(10);

  return (
    <div className="live-feed">
      <div className="feed-header">
        <h3>Live Kills</h3>
        <span className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '🟢 Live' : '🔴 Offline'}
        </span>
      </div>
      {kills.map(kill => (
        <KillCard key={kill.id} kill={kill} />
      ))}
    </div>
  );
};
```

---

#### Advanced Filtering System

**Implementation:** Comprehensive filter components

```typescript
// components/KillFilter.tsx
interface KillFilterOptions {
  dateRange?: [Date, Date];
  careers?: Career[];
  zones?: Zone[];
  minDamage?: number;
  maxDamage?: number;
  realm?: Realm;
}

const KillFilter: React.FC<{
  onFilterChange: (filters: KillFilterOptions) => void;
}> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<KillFilterOptions>({});

  const handleFilterUpdate = (key: keyof KillFilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="kill-filter">
      {/* Date Range Picker */}
      <DateRangePicker
        value={filters.dateRange}
        onChange={(range) => handleFilterUpdate('dateRange', range)}
      />

      {/* Career Multi-Select */}
      <MultiSelect
        options={Object.values(Career)}
        value={filters.careers}
        onChange={(careers) => handleFilterUpdate('careers', careers)}
        placeholder="Filter by career..."
      />

      {/* Zone Dropdown */}
      <Select
        options={zones}
        value={filters.zones}
        onChange={(zones) => handleFilterUpdate('zones', zones)}
        placeholder="Select zones..."
      />

      {/* Damage Range */}
      <div className="damage-range">
        <input
          type="number"
          placeholder="Min damage"
          value={filters.minDamage}
          onChange={(e) => handleFilterUpdate('minDamage', Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Max damage"
          value={filters.maxDamage}
          onChange={(e) => handleFilterUpdate('maxDamage', Number(e.target.value))}
        />
      </div>

      {/* Realm Toggle */}
      <ButtonGroup>
        <button onClick={() => handleFilterUpdate('realm', Realm.Order)}>
          Order
        </button>
        <button onClick={() => handleFilterUpdate('realm', Realm.Destruction)}>
          Destruction
        </button>
      </ButtonGroup>
    </div>
  );
};
```

---

#### Data Visualization

**Implementation:** Chart.js integration for statistics

```typescript
// components/KillChart.tsx
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  date: string;
  count: number;
}

export const KillChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Kills Over Time',
        data: data.map(d => d.count),
        borderColor: '#bf4000',
        backgroundColor: 'rgba(191, 64, 0, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Kill Statistics',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

// Career Distribution Pie Chart
export const CareerDistributionChart: React.FC<{ data: Record<Career, number> }> = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  return <Pie data={chartData} />;
};
```

---

#### Export Functionality

**Implementation:** Multi-format data export

```typescript
// utils/exportUtils.ts
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToCSV = (data: any[], filename: string) => {
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => row[header]).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
};

export const exportToPDF = (data: any[], title: string) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(title, 14, 22);

  autoTable(doc, {
    head: [Object.keys(data[0])],
    body: data.map(row => Object.values(row)),
    startY: 30,
    theme: 'grid',
    styles: { fontSize: 10 },
  });

  doc.save(`${title.toLowerCase().replace(/\s/g, '-')}.pdf`);
};

export const exportToJSON = (data: any[], filename: string) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  saveAs(blob, `${filename}.json`);
};

// Component usage
const ExportButton: React.FC<{ data: any[]; filename: string }> = ({ data, filename }) => {
  return (
    <div className="export-buttons">
      <button onClick={() => exportToCSV(data, filename)}>
        📊 Export CSV
      </button>
      <button onClick={() => exportToPDF(data, filename)}>
        📄 Export PDF
      </button>
      <button onClick={() => exportToJSON(data, filename)}>
        📋 Export JSON
      </button>
    </div>
  );
};
```

---

### 4. User Experience Improvements

#### Enhanced Search with Suggestions

**Implementation:** Debounced search with autocomplete

```typescript
// hooks/useDebounce.ts
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// hooks/useSearchSuggestions.ts
interface SearchSuggestion {
  id: string;
  name: string;
  type: 'character' | 'guild' | 'item';
  career?: Career;
}

export const useSearchSuggestions = (query: string) => {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length > 2) {
      setLoading(true);
      fetchSuggestions(debouncedQuery)
        .then(setSuggestions)
        .finally(() => setLoading(false));
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  return { suggestions, loading };
};

// Component
const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const { suggestions, loading } = useSearchSuggestions(query);

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search characters, guilds, items..."
      />
      {loading && <Spinner size="small" />}
      {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map(suggestion => (
            <SuggestionItem key={suggestion.id} suggestion={suggestion} />
          ))}
        </div>
      )}
    </div>
  );
};
```

---

#### Mobile Responsiveness

**Implementation:** Touch-friendly responsive design

```scss
// styles/mobile.scss
@media (max-width: 768px) {
  .kill-table {
    // Convert table to card layout
    display: block;

    thead {
      display: none;
    }

    tbody {
      tr {
        display: block;
        margin-bottom: 1rem;
        border: 1px solid #333;
        border-radius: 8px;
        padding: 1rem;

        td {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;

          &:before {
            content: attr(data-label);
            font-weight: bold;
            margin-right: 1rem;
          }
        }
      }
    }
  }

  // Touch-friendly buttons
  .btn {
    min-height: 44px; // iOS touch target
    min-width: 44px;
  }

  // Swipe gestures
  .swipeable {
    touch-action: pan-x;
  }
}
```

```typescript
// hooks/useSwipeGesture.ts
export const useSwipeGesture = (
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
) => {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};
```

---

#### Accessibility Enhancements

**Implementation:** WCAG 2.1 AA compliance

```typescript
// components/AccessibleButton.tsx
const AccessibleButton: React.FC<{
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}> = ({ onClick, ariaLabel, children }) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {children}
    </button>
  );
};

// Keyboard navigation
const KillboardNav: React.FC = () => {
  const navItems = ['Kills', 'Characters', 'Guilds', 'Scenarios'];
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
        setFocusedIndex((prev) => Math.min(prev + 1, navItems.length - 1));
        break;
      case 'ArrowLeft':
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Home':
        setFocusedIndex(0);
        break;
      case 'End':
        setFocusedIndex(navItems.length - 1);
        break;
    }
  };

  return (
    <nav role="navigation" aria-label="Main navigation" onKeyDown={handleKeyDown}>
      {navItems.map((item, index) => (
        <a
          key={item}
          href={`/${item.toLowerCase()}`}
          tabIndex={index === focusedIndex ? 0 : -1}
          aria-current={index === focusedIndex ? 'page' : undefined}
        >
          {item}
        </a>
      ))}
    </nav>
  );
};

// High contrast mode
const useHighContrastMode = () => {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  return [highContrast, setHighContrast] as const;
};
```

---

### 5. Security & Reliability

#### Error Boundaries

**Implementation:** Comprehensive error handling

```typescript
// components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);

    // Log to error tracking service
    logErrorToService(error, {
      componentStack: errorInfo.componentStack,
      ...this.getErrorContext(),
    });
  }

  private getErrorContext() {
    return {
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>⚠️ Something went wrong</h2>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.message}</pre>
          </details>
          <button onClick={this.handleReset}>Try again</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage in App.tsx
const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* routes */}
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};
```

---

#### Loading States & Skeleton Screens

**Implementation:** Enhanced loading UX

```typescript
// components/SkeletonLoader.tsx
export const SkeletonLoader: React.FC<{
  type: 'table' | 'card' | 'list';
  count?: number;
}> = ({ type, count = 3 }) => {
  if (type === 'table') {
    return (
      <div className="skeleton-table">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-row">
            <div className="skeleton-cell" />
            <div className="skeleton-cell" />
            <div className="skeleton-cell" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="skeleton-cards">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-header" />
          <div className="skeleton-body" />
          <div className="skeleton-footer" />
        </div>
      ))}
    </div>
  );
};

// Offline mode with cached data
const useOfflineMode = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};
```

---

### 6. Development Workflow

#### Testing Strategy

**Implementation:** Comprehensive test coverage

```typescript
// __tests__/LatestKills.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { LatestKills } from '../components/LatestKills';
import { GET_LATEST_KILLS } from '../graphql/queries/kills';

const mocks = [
  {
    request: {
      query: GET_LATEST_KILLS,
      variables: { first: 10 },
    },
    result: {
      data: {
        kills: {
          nodes: [
            {
              id: '1',
              time: '2025-12-31T10:00:00Z',
              character: {
                name: 'TestHero',
                career: 'IRONBREAKER',
              },
              victim: {
                name: 'TestVillain',
                career: 'BLACKGUARD',
              },
            },
          ],
        },
      },
    },
  },
];

describe('LatestKills', () => {
  test('displays kill list', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LatestKills />
      </MockedProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('TestHero')).toBeInTheDocument();
      expect(screen.getByText('TestVillain')).toBeInTheDocument();
    });
  });

  test('handles error state', async () => {
    const errorMocks = [
      {
        request: {
          query: GET_LATEST_KILLS,
          variables: { first: 10 },
        },
        error: new Error('Network error'),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <LatestKills />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

---

#### CI/CD Pipeline

**Implementation:** GitHub Actions workflow

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm
```
