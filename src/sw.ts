import { clientsClaim } from 'workbox-core';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<{ url: string; revision?: string }>;
};

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

clientsClaim();
(self as unknown as { skipWaiting: () => void }).skipWaiting();

const GRAPHQL_CACHE_NAME = 'graphql-cache-v1';
const GRAPHQL_MAX_AGE_MS = 5 * 60 * 1000;
const GRAPHQL_NETWORK_TIMEOUT_MS = 3 * 1000;

function parseOperationType(body: unknown): 'query' | 'mutation' | 'unknown' {
  if (body == null || typeof body !== 'object') return 'unknown';
  const anyBody = body as Record<string, unknown>;
  const query = anyBody.query;
  if (typeof query !== 'string') return 'unknown';
  const trimmed = query.trimStart();
  if (trimmed.startsWith('mutation')) return 'mutation';
  if (trimmed.startsWith('query')) return 'query';
  return 'unknown';
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function fetchWithTimeout(
  request: Request,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(request, {
      credentials: 'include',
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

function withCacheTimestamp(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('sw-fetched-at', String(Date.now()));
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function isFreshCachedResponse(response: Response | undefined): boolean {
  if (response == null) return false;
  const ts = response.headers.get('sw-fetched-at');
  if (ts == null) return false;
  const parsed = Number(ts);
  if (!Number.isFinite(parsed)) return false;
  return Date.now() - parsed <= GRAPHQL_MAX_AGE_MS;
}

registerRoute(
  ({ url, request }) =>
    url.pathname === '/graphql' && request.method === 'POST',
  async ({ request }) => {
    const requestClone = request.clone();
    let bodyText = '';
    let parsedBody: unknown = null;
    try {
      bodyText = await requestClone.text();
      parsedBody = JSON.parse(bodyText);
    } catch {
      parsedBody = null;
    }

    const operationType = parseOperationType(parsedBody);
    if (operationType !== 'query') {
      return fetch(request, { credentials: 'include' });
    }

    const cacheKeyHash = await sha256Hex(bodyText);
    const cacheUrl = new URL('/graphql', new URL(request.url).origin);
    cacheUrl.searchParams.set('__pwa_cache', cacheKeyHash);
    const cacheKey = new Request(cacheUrl.toString(), { method: 'GET' });

    const cache = await caches.open(GRAPHQL_CACHE_NAME);

    try {
      const networkResponse = await fetchWithTimeout(
        request,
        GRAPHQL_NETWORK_TIMEOUT_MS,
      );
      if (networkResponse.ok) {
        const stamped = withCacheTimestamp(networkResponse.clone());
        await cache.put(cacheKey, stamped);
      }
      return networkResponse;
    } catch {
      const cached = await cache.match(cacheKey);
      if (cached && isFreshCachedResponse(cached)) {
        return cached;
      }
      if (cached) {
        await cache.delete(cacheKey);
      }
      return new Response(JSON.stringify({ error: 'offline' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
);

registerRoute(
  ({ request }) => request.mode === 'navigate',
  createHandlerBoundToURL('/index.html'),
);

registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  }),
);
