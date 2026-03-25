// src/components/products/ProductHeader.jsx
import React from "react";
import { FunnelIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { useScrollState } from "../Navbar/hooks/useScrollState";
import CustomDropdown from "./CustomDropdown";

const ProductHeader = ({
  selectedCategories = [],
  activeFilterCount = 0,
  showFilters,
  setShowFilters,
  sortOrder,
  setSortOrder,
  totalProducts = 0,
}) => {
  const isScrolled = useScrollState(10);

  return (
    <div
      className={`sticky top-15  lg:top-16 z-40 w-full transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md  shadow-lg" : " "
      }`}
    >
      <div
        className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 
        flex flex-col md:flex-row items-center justify-between 
        gap-3 md:gap-4 py-2 md:py-3"
      >
        {/* Heading */}
        <h1 className="text-2xl md:text-2xl font-bold text-gray-900 ">
          {selectedCategories.length === 1
            ? `${selectedCategories[0]} Products (${totalProducts})`
            : `All Products (${totalProducts})`}
        </h1>

        {/* Right controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            className="h-10 px-4  cursor-pointer bg-black text-white rounded-lg lg:hidden hover:bg-gray-900 transition flex items-center justify-center gap-2 flex-1 md:flex-none"
            onClick={() => setShowFilters(true)}
          >
            <FunnelIcon className="w-5 h-5" />
            Filter {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
          </button>

          <CustomDropdown
            options={[
              { value: "default", label: "Sort by" },
              { value: "price-low", label: "Price: Low to High" },
              { value: "price-high", label: "Price: High to Low" },
              { value: "popular", label: "Popularity" },
            ]}
            value={sortOrder}
            onChange={setSortOrder}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;
