import React, { useState, useRef, useEffect } from "react";
import { ArrowDownIcon, CheckIcon } from "@heroicons/react/24/outline";

const CustomDropdown = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // relative w-full md:w-60
  return (
    <div className="relative flex-1 md:flex-none md:w-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm flex justify-between items-center
                   hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black-500 focus:border-black-500 transition"
      >
        {value || "Sort by"}
        <ArrowDownIcon
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {isOpen && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className={`cursor-pointer px-4 py-2 hover:bg-gray-100 flex justify-between items-center ${
                value === option.value ? "bg-gray-100 font-semibold" : ""
              }`}
            >
              {option.label}
              {value === option.value && (
                <CheckIcon className="w-4 h-4 text-blue-500" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
