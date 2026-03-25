import React from "react";

const ActiveFilters = ({
  selectedCategories = [],
  selectedBrands = [],
  selectedDepartments = [],
  priceRange = [0, 2500],
  minPrice = 0,
  maxPrice = 2500,
  allProducts = [],
  onRemoveCategory,
  onRemoveBrand,
  onRemovePriceFilter,
  onRemoveDepartment,
}) => {
  const hasPriceFilter = priceRange[0] > minPrice || priceRange[1] < maxPrice;

  if (
    !selectedDepartments.length &&
    !selectedCategories.length &&
    !selectedBrands.length &&
    !hasPriceFilter
  )
    return null;

  // Decode for display purposes (matches ProductPage encode/decode)
  // const decode = (text) =>
  //   text
  //     .replace(/-/g, " ")
  //     .replace(/%2766/g, "’")
  //     .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {selectedDepartments.map((department) => (
        <span
          key={department}
          className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 shadow-sm text-gray-800 px-3 py-1.5 rounded-full text-sm transition"
        >
          {department}
          <button
            onClick={() => onRemoveDepartment(department)}
            className="text-gray-500 hover:text-gray-700 text-lg ml-1 cursor-pointer"
          >
            ×
          </button>
        </span>
      ))}

      {selectedCategories.map((cat) => (
        <span
          key={cat}
          className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 shadow-sm text-gray-800 px-3 py-1.5 rounded-full text-sm transition"
        >
          {cat}
          <button
            onClick={() => onRemoveCategory(cat)}
            className="text-gray-500 hover:text-gray-700 text-lg ml-1 cursor-pointer"
          >
            ×
          </button>
        </span>
      ))}

      {selectedBrands.map((brand) => (
        <span
          key={brand}
          className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 shadow-sm text-gray-800 px-3 py-1.5 rounded-full text-sm transition"
        >
          {brand}
          <button
            onClick={() => onRemoveBrand(brand)}
            className="text-gray-500 hover:text-gray-700 text-lg ml-1 cursor-pointer"
          >
            ×
          </button>
        </span>
      ))}

      {hasPriceFilter && (
        <span className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 shadow-sm text-gray-800 px-3 py-1.5 rounded-full text-sm transition">
          R{priceRange[0]} - R{priceRange[1]}
          <button
            onClick={onRemovePriceFilter}
            className="text-gray-500 hover:text-gray-700 text-lg ml-1 cursor-pointer"
          >
            ×
          </button>
        </span>
      )}
    </div>
  );
};

export default ActiveFilters;
