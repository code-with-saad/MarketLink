import { forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

const SearchInput = forwardRef(
  ({ className, value, onChange, onClear, placeholder = "Search fresh products, stalls, markets...", ...props }, ref) => {
    return (
      <div className={cn("relative flex items-center w-full", className)}>
        <div className="absolute left-3.5 flex items-center pointer-events-none text-earth-500">
          <FontAwesomeIcon icon={faSearch} className="text-sm" />
        </div>
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full h-11 pl-10 pr-10 bg-warm-surface border border-earth-300/80 rounded-xl text-sm text-forest-950 placeholder:text-earth-500 focus:outline-none focus:ring-2 focus:ring-forest-800/30 focus:border-forest-800 transition-all shadow-inner"
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 p-1 text-earth-500 hover:text-forest-900 rounded-md transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xs" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
