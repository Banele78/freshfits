// src/components/navbar/SearchBar.jsx - Enhanced version
import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Search products, brands, and more...",
  size = "md",
  variant = "default", // default, expanded, full
  className = "",
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      console.log("Searching for:", value);
      onSubmit?.(value);
    }
  };

  const sizeClasses = {
    sm: {
      icon: "h-3.5 w-3.5",
      input: "text-sm",
      padding: "px-3 py-1.5",
    },
    md: {
      icon: "h-4 w-4",
      input: "text-base",
      padding: "px-4 py-2",
    },
    lg: {
      icon: "h-5 w-5",
      input: "text-lg",
      padding: "px-5 py-2.5",
    },
  };

  const variantClasses = {
    default: "w-48 md:w-56 lg:w-64", // Default width
    expanded: "w-64 md:w-72 lg:w-80 xl:w-96", // Expanded width
    full: "w-full", // Full width
    tablet: "w-40 md:w-48", // For tablet view
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;
  const currentVariant = variantClasses[variant] || variantClasses.default;

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative ${className}`}
      role="search"
    >
      <div
        className={`flex items-center bg-gray-200 rounded-full hover:bg-gray-200 transition-all duration-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-grey-100 focus-within:shadow-sm ${currentSize.padding} ${currentVariant}`}
      >
        <Search
          className={`text-gray-500 ${currentSize.icon} flex-shrink-0 ml-1`}
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder={placeholder}
          className={`bg-transparent outline-none ml-3 w-full ${currentSize.input} focus:outline-none placeholder-gray-400 text-gray-800`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Search products"
        />
      </div>
    </form>
  );
};

export default SearchBar;
