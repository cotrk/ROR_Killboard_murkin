import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tailwind.css';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router';
import { AppErrorBoundary } from '@/components/global/AppErrorBoundary';
import { ThemeProvider } from '@/contexts/ThemeContext';
import App from './App';

import { API_CONFIG } from './config/constants';

const client = new ApolloClient({
  uri: API_CONFIG.GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});

const container = document.getElementById('root');
if (container == null) throw new Error('Root element not found');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AppErrorBoundary>
        <ApolloProvider client={client}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ApolloProvider>
      </AppErrorBoundary>
    </ThemeProvider>
  </React.StrictMode>,
);
