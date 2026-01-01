// Shared type definitions for the killboard application

export interface DateRange {
  start: string;
  end: string;
}

export interface SearchResult {
  id: string;
  name: string;
  type: 'character' | 'guild' | 'item';
  description?: string;
}

export interface FilterState {
  dateRange: DateRange;
  careers: string[];
  zones: string[];
  minLevel: number;
  maxLevel: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  defaultTab: 'players' | 'guilds' | 'scenarios' | 'skirmishes';
  chartType: 'line' | 'area' | 'bar';
  itemsPerPage: number;
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  memoryUsage: number;
}

export interface AnalyticsData {
  playerTrends: {
    playerId: string;
    playerName: string;
    trend: 'rising' | 'falling' | 'stable';
    changePercent: number;
  }[];
  guildMetrics: {
    guildId: string;
    guildName: string;
    dominanceScore: number;
    activityLevel: number;
  }[];
  predictiveStats: {
    entityId: string;
    entityName: string;
    prediction: number;
    confidence: number;
  }[];
}
