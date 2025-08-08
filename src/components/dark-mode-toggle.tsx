import { useState, useEffect } from "react";
import { Button } from "./ui/button";

interface DarkModeToggleProps {
  className?: string;
}

export default function DarkModeToggle({ className }: DarkModeToggleProps) {
  const [isDark, setIsDark] = useState(() => {
    // Initialize from localStorage or default to false
    const stored = localStorage.getItem("darkMode");
    return stored ? JSON.parse(stored) : false;
  });

  // Initialize dark mode on component mount
  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    const initialDarkMode = stored ? JSON.parse(stored) : false;

    const rootElement = document.documentElement;
    if (initialDarkMode) {
      rootElement.classList.add("dark");
    } else {
      rootElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    // Apply dark class to the html element for global dark mode
    const rootElement = document.documentElement;

    if (isDark) {
      rootElement.classList.add("dark");
    } else {
      rootElement.classList.remove("dark");
    }

    // Save to localStorage
    localStorage.setItem("darkMode", JSON.stringify(isDark));
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  return (
    <Button
      onClick={toggleDarkMode}
      variant="outline"
      size="sm"
      className={`h-8 space-x-2 text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white md:h-10 md:space-x-3 md:text-sm ${className}`}
      aria-label={isDark ? "Light moda geç" : "Dark moda geç"}
    >
      {isDark ? (
        <svg
          className="h-3.5 w-3.5 md:h-4 md:w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          className="h-3.5 w-3.5 md:h-4 md:w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
      <span className="ml-2">{isDark ? "Light" : "Dark"}</span>
    </Button>
  );
}
