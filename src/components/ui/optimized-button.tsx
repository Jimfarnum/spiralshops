// Optimized Button Component - Fixes UI/UX performance bottlenecks
import React from 'react';
import { cn } from '@/lib/utils';

// Basic button props interface
interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

interface OptimizedButtonProps extends BaseButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  debounceMs?: number;
}

const OptimizedButton = React.forwardRef<HTMLButtonElement, OptimizedButtonProps>(
  ({ 
    children, 
    isLoading = false, 
    loadingText = "Loading...", 
    debounceMs = 300,
    onClick,
    className,
    disabled,
    ...props 
  }, ref) => {
    const [isDebounced, setIsDebounced] = React.useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout>();

    const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      if (isDebounced || isLoading || disabled) return;

      setIsDebounced(true);
      
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Execute click handler
      if (onClick) {
        onClick(event);
      }

      // Reset debounce after specified time
      timeoutRef.current = setTimeout(() => {
        setIsDebounced(false);
      }, debounceMs);
    }, [onClick, isDebounced, isLoading, disabled, debounceMs]);

    // Cleanup timeout on unmount
    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    const isButtonDisabled = disabled || isLoading || isDebounced;

    return (
      <button
        ref={ref}
        onClick={handleClick}
        disabled={isButtonDisabled}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
          "bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4",
          "transition-all duration-200",
          isButtonDisabled && "opacity-60 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            <span>{loadingText}</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

OptimizedButton.displayName = "OptimizedButton";

export { OptimizedButton };
export type { OptimizedButtonProps };