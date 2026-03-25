// src/components/navbar/Dropdown/Dropdown.jsx
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const Dropdown = ({ label, columns = [], mobile = false, compact = false }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleToggle = () => {
    setOpen(!open);
  };

  const labelClasses = mobile
    ? `flex items-center justify-between w-full px-3 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer ${
        compact ? "text-sm" : ""
      }`
    : `flex items-center gap-1 hover:text-gray-600 transition cursor-pointer ${
        compact ? "text-sm" : ""
      }`;

  const desktopMenuClasses = `absolute top-full left-0 bg-white shadow-xl rounded-lg z-50 border border-gray-100 transition-all duration-200 ${
    open
      ? "opacity-100 visible translate-y-0"
      : "opacity-0 invisible -translate-y-2"
  }`;

  const menuWidthClass =
    columns.length === 1
      ? "w-48"
      : columns.length === 2
        ? "w-85"
        : columns.length === 3
          ? "w-125"
          : columns.length === 4
            ? "w-150"
            : columns.length === 5
              ? "w-170"
              : "w-48";

  const getGridColumnsClass = () => {
    const cols = columns.length;
    if (cols <= 1) return "grid-cols-1";
    if (cols === 2) return "grid-cols-2";
    if (cols === 3) return "grid-cols-3";
    return "grid-cols-4";
  };

  return (
    <div
      ref={dropdownRef}
      className={mobile ? "relative w-full" : "relative group cursor-pointer"}
      onMouseEnter={() => !mobile && setOpen(true)}
      onMouseLeave={() => !mobile && setOpen(false)}
    >
      {/* Label */}
      <div
        className={labelClasses}
        onClick={handleToggle}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && handleToggle()
        }
        role="button"
        tabIndex={0}
        aria-expanded={open}
      >
        <span>{label}</span>
        <ChevronDown
          size={compact ? 14 : 16}
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown Content */}
      {open && (
        <div
          className={
            mobile
              ? "pl-4 pr-2 bg-white py-2 max-h-96 overflow-y-auto"
              : `${desktopMenuClasses} ${menuWidthClass} py-4`
          }
        >
          {mobile ? (
            // Mobile: Flatten all columns into single list
            <div className="space-y-1">
              {columns
                .flatMap((column) => column.items)
                .map((item) => (
                  <a
                    key={item.slug}
                    className={`block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors ${
                      compact ? "text-sm" : ""
                    }`}
                    href={item.slug}
                    onClick={() => setOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
            </div>
          ) : (
            // Desktop: Display as columns
            <div className={`grid ${getGridColumnsClass()} gap-4 px-4`}>
              {columns.map((column, colIndex) => (
                <div key={colIndex} className="space-y-2 min-w-0">
                  {column.title && (
                    <h3 className="font-bold text-gray-900 text-sm mb-2">
                      {column.title}
                    </h3>
                  )}
                  {column.items.map((item) => (
                    <Link
                      key={item.slug}
                      to={item.slug}
                      className="block py-1.5 text-gray-700 hover:text-gray-900 transition-colors whitespace-nowrap text-sm hover:bg-gray-50 rounded px-2"
                      href={item.slug}
                      onClick={() => setOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
