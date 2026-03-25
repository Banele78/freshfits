import React from "react";

const FilterPanel = ({
  categories = [],
  brands = [],
  departments = [],
  selectedCategories = [],
  selectedBrands = [],
  selectedDepartments = [],
  priceRange = [0, 2500],
  minPrice = 0,
  maxPrice = 2500,
  allProducts = [],
  activeFilterCount = 0,
  onToggleFilter,
  onClearFilters,
  onPriceRangeChange,
}) => {
  const getCount = (type, value) =>
    allProducts.filter((p) => p[type] === value).length;

  return (
    <aside className="w-full lg:w-80 bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm overflow-y-auto max-h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-xl tracking-widest">Filters</h3>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-red-500 tracking-widest font-medium hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* PRICE RANGE */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-sm">
        <h4 className="font-semibold text-gray-800 mb-4 tracking-widest">
          Price Range
        </h4>
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={priceRange[0]}
          onChange={(e) =>
            onPriceRangeChange([parseInt(e.target.value), priceRange[1]])
          }
          className="w-full mb-2 accent-black cursor-pointer"
        />
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={priceRange[1]}
          onChange={(e) =>
            onPriceRangeChange([priceRange[0], parseInt(e.target.value)])
          }
          className="w-full accent-black cursor-pointer"
        />
        <div className="flex justify-between mt-2 tracking-widest text-sm text-gray-600">
          <span>R{priceRange[0]}</span>
          <span>R{priceRange[1]}</span>
        </div>
      </div>

      {/* CATEGORY */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-sm">
        <h4 className="font-semibold text-gray-800 mb-3 tracking-widest">
          Category
        </h4>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => onToggleFilter(c, "category")}
              className={`w-full cursor-pointer text-left px-3 py-2 rounded-lg font-medium transition-all duration-200 flex justify-between items-center ${
                selectedCategories.includes(c)
                  ? "bg-black text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:pl-4"
              }`}
            >
              <span>{c}</span>
              {/* <span className="text-xs opacity-75">
                ({getCount("category", c)})
              </span> */}
            </button>
          ))}
        </div>
      </div>

      {/* BRAND */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-sm">
        <h4 className="font-semibold text-gray-800 mb-3 tracking-widest">
          Brand
        </h4>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => onToggleFilter(b, "brand")}
              className={`w-full cursor-pointer text-left px-3 py-2 rounded-lg font-medium transition-all duration-200 flex justify-between items-center ${
                selectedBrands.includes(b)
                  ? "bg-black text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:pl-4"
              }`}
            >
              <span>{b}</span>
              {/* <span className="text-xs opacity-75">
                ({getCount("brand", b)})
              </span> */}
            </button>
          ))}
        </div>
      </div>

      {/* DEPARTMENT */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
        <h4 className="font-semibold text-gray-800 mb-3 tracking-widest">
          Department
        </h4>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {departments.map((g) => (
            <button
              key={g}
              onClick={() => onToggleFilter(g, "department")}
              className={`w-full cursor-pointer text-left px-3 py-2 rounded-lg font-medium transition-all duration-200 flex justify-between items-center ${
                selectedDepartments.includes(g)
                  ? "bg-black text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:pl-4"
              }`}
            >
              <span>{g}</span>
              {/* <span className="text-xs opacity-75">
                ({getCount("department", g)})
              </span> */}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterPanel;
