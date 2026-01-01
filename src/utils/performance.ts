// Performance monitoring utilities for the killboard application

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  bundleSize: number;
  memoryUsage: number;
}

interface PerformanceReport {
  metrics: PerformanceMetrics;
  timestamp: string;
  userAgent: string;
  url: string;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  private constructor() {
    this.init();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private init(): void {
    // Monitor navigation timing
    this.observeNavigation();
    
    // Monitor paint timing
    this.observePaint();
    
    // Monitor layout shift
    this.observeLayoutShift();
    
    // Monitor largest contentful paint
    this.observeLCP();
    
    // Monitor first input delay
    this.observeFID();
    
    // Monitor memory usage
    this.observeMemory();
  }

  private observeNavigation(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.metrics.pageLoadTime = navEntry.loadEventEnd - navEntry.fetchStart;
          }
        }
      });
      observer.observe({ entryTypes: ['navigation'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('Navigation timing not supported:', error);
    }
  }

  private observePaint(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime;
          }
        }
      });
      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('Paint timing not supported:', error);
    }
  }

  private observeLayoutShift(): void {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.metrics.cumulativeLayoutShift = clsValue;
      });
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('Layout shift not supported:', error);
    }
  }

  private observeLCP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.largestContentfulPaint = lastEntry.startTime;
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('LCP not supported:', error);
    }
  }

  private observeFID(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.firstInputDelay = (entry as any).processingStart - entry.startTime;
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('FID not supported:', error);
    }
  }

  private observeMemory(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
    }
  }

  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  generateReport(): PerformanceReport {
    const report: PerformanceReport = {
      metrics: this.metrics as PerformanceMetrics,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    return report;
  }

  logMetrics(): void {
    const metrics = this.getMetrics();
    console.group('🚀 Performance Metrics');
    console.log('Page Load Time:', metrics.pageLoadTime ? `${metrics.pageLoadTime.toFixed(2)}ms` : 'N/A');
    console.log('First Contentful Paint:', metrics.firstContentfulPaint ? `${metrics.firstContentfulPaint.toFixed(2)}ms` : 'N/A');
    console.log('Largest Contentful Paint:', metrics.largestContentfulPaint ? `${metrics.largestContentfulPaint.toFixed(2)}ms` : 'N/A');
    console.log('Cumulative Layout Shift:', metrics.cumulativeLayoutShift?.toFixed(3) || 'N/A');
    console.log('First Input Delay:', metrics.firstInputDelay ? `${metrics.firstInputDelay.toFixed(2)}ms` : 'N/A');
    console.log('Memory Usage:', metrics.memoryUsage ? `${metrics.memoryUsage.toFixed(2)}MB` : 'N/A');
    console.groupEnd();
  }

  assessPerformance(): 'excellent' | 'good' | 'needs-improvement' | 'poor' {
    const metrics = this.metrics;
    
    if (!metrics.pageLoadTime || !metrics.firstContentfulPaint) {
      return 'needs-improvement';
    }

    let score = 0;
    
    // Page load time scoring
    if (metrics.pageLoadTime < 1000) score += 25;
    else if (metrics.pageLoadTime < 2000) score += 15;
    else if (metrics.pageLoadTime < 3000) score += 5;
    
    // FCP scoring
    if (metrics.firstContentfulPaint < 1000) score += 25;
    else if (metrics.firstContentfulPaint < 2000) score += 15;
    else if (metrics.firstContentfulPaint < 3000) score += 5;
    
    // CLS scoring
    if (metrics.cumulativeLayoutShift !== undefined) {
      if (metrics.cumulativeLayoutShift < 0.1) score += 25;
      else if (metrics.cumulativeLayoutShift < 0.25) score += 15;
      else if (metrics.cumulativeLayoutShift < 0.5) score += 5;
    }
    
    // FID scoring
    if (metrics.firstInputDelay !== undefined) {
      if (metrics.firstInputDelay < 100) score += 25;
      else if (metrics.firstInputDelay < 300) score += 15;
      else if (metrics.firstInputDelay < 500) score += 5;
    }

    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'needs-improvement';
    return 'poor';
  }

  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Utility functions
export const trackPerformance = (): void => {
  performanceMonitor.logMetrics();
};

export const getPerformanceReport = (): PerformanceReport => {
  return performanceMonitor.generateReport();
};

export const assessPerformance = (): string => {
  return performanceMonitor.assessPerformance();
};

// Bundle size monitoring
export const trackBundleSize = (): void => {
  if ('performance' in window && 'memory' in performance) {
    const memory = (performance as any).memory;
    console.log('💾 Bundle Size Metrics:');
    console.log('Used JS Heap Size:', `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
    console.log('Total JS Heap Size:', `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
    console.log('JS Heap Size Limit:', `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`);
  }
};

// Error tracking
export const trackError = (error: Error, context?: string): void => {
  console.error('🚨 Error tracked:', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  });
};

// Initialize performance monitoring
export const initPerformanceMonitoring = (): void => {
  // Log metrics after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      trackPerformance();
      trackBundleSize();
    }, 1000);
  });

  // Track unhandled errors
  window.addEventListener('error', (event) => {
    trackError(new Error(event.message), 'unhandled-error');
  });

  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    trackError(new Error(event.reason), 'unhandled-promise-rejection');
  });
};
