import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Checkbox = forwardRef(({ className, id, checked, onCheckedChange, ...props }, ref) => (
  <label
    htmlFor={id}
    className={cn(
      'inline-flex items-center gap-2.5 cursor-pointer group',
      className
    )}
  >
    <span className="relative shrink-0">
      <input
        ref={ref}
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className="sr-only"
        {...props}
      />
      <span
        className={cn(
          'block w-5 h-5 rounded-md border-2 transition-all duration-150',
          checked
            ? 'bg-forest-900 border-forest-900'
            : 'bg-white border-gray-300 group-hover:border-forest-700'
        )}
      >
        {checked && (
          <svg
            className="absolute inset-0 w-full h-full p-0.5 text-accent-lime"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 8l3.5 3.5L13 4" />
          </svg>
        )}
      </span>
    </span>
  </label>
));

Checkbox.displayName = 'Checkbox';

export { Checkbox };
