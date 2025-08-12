import React from "react";

interface LoaderDotsProps {
  message?: string;
  className?: string;
  heightClass?: string; // e.g. h-64
}

export const LoaderDots: React.FC<LoaderDotsProps> = ({
  message,
  className = "",
  heightClass = "h-64",
}) => {
  return (
    <div
      className={`flex ${heightClass} items-center justify-center ${className}`}
    >
      <div className="animate-fade-in text-center">
        {message ? (
          <p className="mb-4 font-medium text-gray-600 dark:text-gray-300">
            {message}
          </p>
        ) : null}
        <div className="flex items-center justify-center space-x-2">
          <span
            className="h-2.5 w-2.5 animate-bounce rounded-full bg-blue-500"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="h-2.5 w-2.5 animate-bounce rounded-full bg-blue-500"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="h-2.5 w-2.5 animate-bounce rounded-full bg-blue-500"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoaderDots;
