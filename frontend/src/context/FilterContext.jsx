import { createContext, useContext, useState, useMemo, useRef } from "react";

const FilterContext = createContext(null);

export const FilterProvider = ({ children }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 2500]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryLocal, setSearchQueryLocal] = useState(searchQuery);
  const [filtersReady, setFiltersReady] = useState(false);

  const [sortOrder, setSortOrder] = useState("default");
  const userChangedPriceRef = useRef(false);

  const value = useMemo(
    () => ({
      selectedCategories,
      setSelectedCategories,
      selectedBrands,
      setSelectedBrands,
      selectedDepartments,
      setSelectedDepartments,
      priceRange,
      setPriceRange,
      searchQuery,
      setSearchQuery,
      searchQueryLocal,
      setSearchQueryLocal,
      filtersReady,
      setFiltersReady,
      sortOrder,
      setSortOrder,
      userChangedPriceRef,
    }),
    [
      selectedCategories,
      selectedBrands,
      selectedDepartments,
      priceRange,
      searchQuery,
      searchQueryLocal,
      filtersReady,
      sortOrder,
      userChangedPriceRef,
    ]
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};

export const useFilters = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) {
    throw new Error("useFilters must be used inside FilterProvider");
  }
  return ctx;
};
