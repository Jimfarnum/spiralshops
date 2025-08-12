// Optimized Input Component - Enhanced UI/UX performance
import React from 'react';
import { cn } from '@/lib/utils';

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

interface OptimizedInputProps extends Omit<BaseInputProps, 'onChange'> {
  onChange?: (value: string) => void;
  debounceMs?: number;
  validateOnChange?: boolean;
  errorMessage?: string;
}

const OptimizedInput = React.forwardRef<HTMLInputElement, OptimizedInputProps>(
  ({ 
    onChange,
    debounceMs = 300,
    validateOnChange = false,
    errorMessage,
    className,
    ...props 
  }, ref) => {
    const [value, setValue] = React.useState(props.defaultValue || '');
    const [error, setError] = React.useState<string | null>(null);
    const timeoutRef = React.useRef<NodeJS.Timeout>();

    const debouncedOnChange = React.useCallback((newValue: string) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        if (onChange) {
          onChange(newValue);
        }
      }, debounceMs);
    }, [onChange, debounceMs]);

    const handleChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setValue(newValue);

      // Immediate validation if enabled
      if (validateOnChange) {
        // Basic validation - can be extended
        if (props.required && !newValue.trim()) {
          setError('This field is required');
        } else if (props.type === 'email' && newValue && !/\S+@\S+\.\S+/.test(newValue)) {
          setError('Please enter a valid email address');
        } else {
          setError(null);
        }
      }

      // Debounced onChange
      debouncedOnChange(newValue);
    }, [validateOnChange, props.required, props.type, debouncedOnChange]);

    // Cleanup timeout on unmount
    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    const displayError = error || errorMessage;

    return (
      <div className="w-full">
        <input
          ref={ref}
          value={value}
          onChange={handleChange}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-200",
            displayError && "border-red-500 focus:border-red-500",
            className
          )}
          {...props}
        />
        {displayError && (
          <p className="text-sm text-red-500 mt-1">{displayError}</p>
        )}
      </div>
    );
  }
);

OptimizedInput.displayName = "OptimizedInput";

export { OptimizedInput };
export type { OptimizedInputProps };