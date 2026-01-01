import React from 'react';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * SkipLink Component
 * 
 * Accessibility component for keyboard navigation
 * Allows screen reader users to skip to main content
 */
export const SkipLink: React.FC<SkipLinkProps> = ({ 
  href, 
  children, 
  className = '' 
}) => {
  return (
    <a
      href={href}
      className={`
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
        bg-blue-600 text-white px-4 py-2 rounded z-50
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${className}
      `}
    >
      {children}
    </a>
  );
};

interface FocusTrapProps {
  isActive: boolean;
  onEscape?: () => void;
  children: React.ReactNode;
}

/**
 * FocusTrap Component
 * 
 * Keeps focus within a component for accessibility
 * Used for modals, dropdowns, and other overlay components
 */
export const FocusTrap: React.FC<FocusTrapProps> = ({ 
  isActive, 
  onEscape, 
  children 
}) => {
  const trapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isActive || !trapRef.current) return;

    const element = trapRef.current;
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element when trap activates
    firstElement?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onEscape) {
        onEscape();
      }
    };

    element.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      element.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isActive, onEscape]);

  return (
    <div ref={trapRef} className={isActive ? 'focus-trap' : ''}>
      {children}
    </div>
  );
};

interface AnnouncerProps {
  message?: string;
  politeness?: 'polite' | 'assertive';
}

/**
 * Announcer Component
 * 
 * Screen reader only component for announcing dynamic content changes
 */
export const Announcer: React.FC<AnnouncerProps> = ({ 
  message, 
  politeness = 'polite' 
}) => {
  return (
    <div
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  loadingText?: string;
}

/**
 * AccessibleButton Component
 * 
 * Enhanced button with accessibility features
 */
export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  loadingText = 'Loading...',
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${loading ? 'opacity-75 cursor-wait' : ''}
    ${className}
  `.trim();

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={classes}
      aria-busy={loading}
      aria-describedby={loading ? 'loading-announcer' : undefined}
    >
      {loading ? (
        <>
          <span className="sr-only" id="loading-announcer">
            {loadingText}
          </span>
          <span aria-hidden="true">{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
