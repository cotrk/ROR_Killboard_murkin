# Killboard Component Architecture Documentation

## 📁 **Component Structure Overview**

This document outlines the current component architecture after the refactoring completion.

### **🏗️ Core Architecture Principles**

1. **Single Responsibility** - Each component has one clear purpose
2. **Shared Types** - All interfaces centralized in `src/types/index.ts`
3. **Unified Components** - No duplicate functionality
4. **Adaptive Design** - Components work on both desktop and mobile

---

## 📊 **Chart Components**

### **KillChart** (`src/components/charts/KillChart.tsx`)

**Purpose**: Unified, adaptive chart component for displaying kill statistics

**Features**:

- Touch/pointer device detection
- Multiple chart types (line, area, bar)
- Responsive layout handling
- Mobile-friendly interactions
- Data point click handling

**Props**:

```typescript
interface KillChartProps {
  characterId?: string;
  dateRange?: DateRange;
  title?: string;
  type?: 'line' | 'area' | 'bar';
  height?: number;
  onDataPointClick?: (data: any) => void;
  isMobile?: boolean;
}
```

**Usage**:

```tsx
<KillChart
  characterId="123"
  dateRange={{ start: '2024-01-01', end: '2024-01-31' }}
  type="line"
  height={300}
  onDataPointClick={(data) => console.log(data)}
/>
```

---

### **DateRangeSelector** (`src/components/charts/DateRangeSelector.tsx`)

**Purpose**: Date range selection with presets and custom dates

**Props**:

```typescript
interface DateRangeSelectorProps {
  onRangeChange: (range: DateRange) => void;
  initialRange?: DateRange;
}
```

---

## 🔍 **Search Components**

### **SearchWithSuggestions** (`src/components/global/SearchWithSuggestions.tsx`)

**Purpose**: Modern search component with live API integration and suggestions

**Features**:

- Live search suggestions
- Debounced API calls
- Touch-friendly interface
- Keyboard navigation support

**Props**:

```typescript
interface SearchWithSuggestionsProps {
  isPlayer?: boolean;
  placeholder?: string;
  initialQuery?: string;
  onSubmit?: (query: string) => void;
}
```

**Usage**:

```tsx
<SearchWithSuggestions
  isPlayer={true}
  placeholder="Search players..."
  initialQuery="initial query"
  onSubmit={(query) => handleSubmit(query)}
/>
```

---

## 🎛️ **Filter Components**

### **AdvancedFilters** (`src/components/filters/AdvancedFilters.tsx`)

**Purpose**: Master filter component combining all filter options

**Features**:

- Date range filtering
- Career selection
- Zone filtering
- Level range filtering

---

## 📤 **Export Components**

### **DataExport** (`src/components/export/DataExport.tsx`)

**Purpose**: Export functionality supporting multiple formats

**Features**:

- CSV export
- JSON export
- PDF export
- Clipboard copy

---

## 👤 **User Preferences**

### **UserPreferences** (`src/components/preferences/UserPreferences.tsx`)

**Purpose**: UI component for managing user preferences

**Features**:

- Theme selection
- Default tab settings
- Chart type preferences
- Items per page configuration

---

## 🔧 **Hooks**

### **useUserPreferences** (`src/hooks/useUserPreferences.ts`)

**Purpose**: Hook for managing user preferences with local storage persistence

**Returns**:

```typescript
{
  preferences: UserPreferences;
  updatePreference: (key: K, value: UserPreferences[K]) => void;
  resetPreferences: () => void;
  exportPreferences: () => string;
  importPreferences: (json: string) => boolean;
}
```

---

## 📋 **Shared Types**

All shared interfaces are centralized in `src/types/index.ts`:

```typescript
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
```

---

## 🔄 **Component Relationships**

```
App
├── pages/
│   ├── Home.tsx
│   ├── Character.tsx
│   └── ...
├── components/
│   ├── charts/
│   │   ├── KillChart.tsx (unified)
│   │   └── DateRangeSelector.tsx
│   ├── global/
│   │   ├── SearchWithSuggestions.tsx (unified)
│   │   └── ...
│   ├── filters/
│   │   └── AdvancedFilters.tsx
│   ├── export/
│   │   └── DataExport.tsx
│   └── preferences/
│       └── UserPreferences.tsx
├── hooks/
│   └── useUserPreferences.ts
└── types/
    └── index.ts (centralized)
```

---

## 🎯 **Key Architectural Decisions**

### **1. Component Consolidation**

- **Before**: `SearchBox` + `SearchWithSuggestions` + `TouchFriendlyChart` + `KillChart`
- **After**: `SearchWithSuggestions` + unified `KillChart`
- **Result**: Reduced maintenance, consistent UX

### **2. Type Centralization**

- **Before**: Duplicate interfaces in multiple files
- **After**: All interfaces in `src/types/index.ts`
- **Result**: Single source of truth, easier refactoring

### **3. Adaptive Design**

- **Approach**: Touch detection + responsive layouts
- **Implementation**: Device capabilities detection
- **Result**: Works seamlessly on desktop and mobile

---

## 📚 **Migration Guide**

### **For New Developers**

1. **Use Shared Types**: Always import from `@/types`
2. **Unified Components**: Use `SearchWithSuggestions` and `KillChart`
3. **Responsive Design**: Components adapt automatically
4. **User Preferences**: Use `useUserPreferences` hook

### **For Existing Code Migration**

1. **Replace SearchBox**:

   ```tsx
   // Old
   import { SearchBox } from '@/components/global/SearchBox';

   // New
   import { SearchWithSuggestions } from '@/components/global/SearchWithSuggestions';
   ```

2. **Replace TouchFriendlyChart**:

   ```tsx
   // Old
   import { TouchFriendlyChart } from '@/components/charts/TouchFriendlyChart';

   // New
   import { KillChart } from '@/components/charts/KillChart';
   ```

3. **Use Centralized Types**:

   ```tsx
   // Old
   interface DateRange {
     start: string;
     end: string;
   }

   // New
   import { DateRange } from '@/types';
   ```

---

## 🚀 **Future Enhancements**

### **Potential Improvements**

1. **Component Library**: Extract reusable UI patterns
2. **State Management**: Consider Redux/Zustand for complex state
3. **Performance**: Implement virtualization for large lists
4. **Accessibility**: Enhanced ARIA support

### **Guidelines**

1. **Maintain Single Responsibility**: Keep components focused
2. **Use Shared Types**: Always import from `@/types`
3. **Test Coverage**: Add tests for new components
4. **Documentation**: Keep JSDoc comments updated

---

## 📞 **Support**

For questions about component architecture:

- Check this documentation first
- Review existing component implementations
- Consult the shared types in `src/types/index.ts`
- Refer to test files for usage examples
