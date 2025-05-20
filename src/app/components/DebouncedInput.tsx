import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export const DebouncedInput = React.memo(function DebouncedInput({
  value,
  onChange,
  debounce = 500,
  showSearchIcon = true,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
  showSearchIcon?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [localValue, setLocalValue] = React.useState(value);

  React.useEffect(() => {
    // Only sync if prop actually changed
    if (value !== localValue) {
      setLocalValue(value);
    }
  }, [localValue, value]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounce);

    return () => clearTimeout(timeout);
  }, [localValue, value, debounce, onChange]);

  return (
    <div className="relative">
      {showSearchIcon && (
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" data-testid="search-icon" />
      )}
      <Input
        {...props}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="h-10 bg-white pl-9 text-sm"
        data-testid="debounced-input"
      />
    </div>
  );
});
