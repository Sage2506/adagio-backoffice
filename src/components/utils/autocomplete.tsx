import { useState, useRef, useEffect } from 'react';

interface Option {
  id: string | number;
  label: string;
  value: any
}

interface AutocompleteProps {
  fetchOptions: (query: string) => Promise<Option[]>;
  placeholder?: string;
  onSelect: (selectedOption: Option | null) => void;
  debounceDelay?: number;
}

export default function AutocompleteCombobox({
  fetchOptions,
  placeholder = "Search...",
  onSelect,
  debounceDelay = 300,
}: AutocompleteProps) {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null); // Fixed here

  // Debounced API fetch
  useEffect(() => {
    if (inputValue.trim() === "") {
      setFilteredOptions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Clear previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set new timeout
    debounceTimeout.current = setTimeout(async () => {
      try {
        const data = await fetchOptions(inputValue);
        setFilteredOptions(data);
      } catch (err) {
        setError("Failed to fetch options");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, debounceDelay);

    // Cleanup
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [inputValue, fetchOptions, debounceDelay]);
  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          Math.min(prev + 1, filteredOptions.length - 1)
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
        if (highlightedIndex >= 0) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const handleSelect = (option: Option) => {
    setInputValue(option.label);
    setIsOpen(false);
    onSelect(option);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg">
          {isLoading ? (
            <li className="px-4 py-2 text-gray-500 dark:text-gray-400">
              Loading...
            </li>
          ) : error ? (
            <li className="px-4 py-2 text-red-500 dark:text-red-400">{error}</li>
          ) : filteredOptions.length === 0 ? (
            <li className="px-4 py-2 text-gray-500 dark:text-gray-400">
              No results found
            </li>
          ) : (
            filteredOptions.map((option, index) => (
              <li
                key={option.id}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`px-4 py-2 cursor-pointer ${highlightedIndex === index
                  ? "bg-blue-500 dark:bg-blue-600 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                  }`}
              >
                {option.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};