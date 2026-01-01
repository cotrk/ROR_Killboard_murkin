# Return of Reckoning Killboard

A comprehensive killboard and statistics tracker for Warhammer Online: Return of Reckoning, built with React, TypeScript, and GraphQL.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Setup

1. Install dependencies:

```bash
npm install
```

2. Generate GraphQL types:

```bash
npm run codegen
```

3. Start development server:

```bash
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

### `npm run start`

Runs the app in development mode with Vite.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run test`

Runs TypeScript compilation, build, and linting checks.

### `npm run lint`

Runs ESLint on the source code.

### `npm run codegen`

Generates TypeScript types from GraphQL schema.

### `npm run codegen-watch`

Watches for GraphQL changes and regenerates types automatically.

## Project Overview

This killboard tracks:

- Player kills and statistics
- Guild performance and rankings
- Scenario results and leaderboards
- Item databases and vendor information
- Quest and creature data
- Instance run statistics
- Advanced filtering and search capabilities
- Data export functionality
- Mobile-responsive design

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Data Layer**: Apollo Client (GraphQL)
- **Styling**: DaisyUI + Tailwind CSS (Modern UI Framework)
- **Icons**: Font Awesome
- **Internationalization**: react-i18next
- **Performance**: Optimized bundle with lazy loading

## Recent Updates

### ✅ Complete UI Modernization (December 2024)

- **100% Bulma CSS eradication** - All 37 components migrated to DaisyUI/Tailwind
- **Mobile-first responsive design** across all components
- **Enhanced accessibility** with semantic HTML and ARIA labels
- **Modern component architecture** with improved type safety
- **Performance optimizations** with reduced bundle size

### ✅ Enhanced Features

- **Advanced filtering system** with date ranges, careers, and zones
- **Data export capabilities** (CSV, JSON, PDF)
- **User preferences** with local storage persistence
- **Real-time data integration** with GraphQL subscriptions
- **Comprehensive analytics** and performance monitoring

## Development

The project uses GraphQL code generation to maintain type safety. Always run `npm run codegen` after modifying GraphQL queries or when pulling changes that affect the schema.

### Component Architecture

All components have been modernized with:

- **DaisyUI components** for consistent design
- **Tailwind CSS utilities** for styling
- **TypeScript interfaces** for type safety
- **Responsive design patterns** for mobile compatibility
- **Error boundaries** for graceful error handling

### Migration Notes

- Original Bulma components are preserved in `src/_ARCHIVE/` for reference
- All active components use modern DaisyUI/Tailwind CSS
- GraphQL schemas and data structures remain unchanged
- Backward compatibility maintained for all existing functionality

## Learn More

- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [GraphQL Code Generator](https://www.graphql-code-generator.com/)
- [DaisyUI Documentation](https://daisyui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
