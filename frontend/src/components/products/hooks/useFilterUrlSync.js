/* ==============================
   URL Sync + Filter Management
============================== */
import { useEffect, useRef, useCallback, useMemo } from "react";
import { useFilters } from "../../../context/FilterContext";
import { useLocation, useSearchParams } from "react-router-dom";

export default function useFilterUrlSync({ filterOptions, reset }) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const debounceRef = useRef(null);

  const GLOBAL_MIN_PRICE = 0;
  const GLOBAL_MAX_PRICE = 2500;

  const {
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
    setSearchQueryLocal,
    sortOrder,
    setSortOrder,
    setFiltersReady,
    userChangedPriceRef,
  } = useFilters();

  const skipNextResetRef = useRef(true);
  const isHydratedRef = useRef(false); // Tracks URL → state hydration
  const prevSearchRef = useRef(""); // Tracks last search query to detect changes

  const priceTimeoutRef = useRef(null);

  // Helpers: encode/decode for URL
  const encode = useCallback(
    (text) =>
      encodeURIComponent(text.trim().toLowerCase().replace(/\s+/g, "-")),
    [],
  );

  const decode = useCallback(
    (slug, list) => {
      const decoded = decodeURIComponent(slug).replace(/-/g, " ");
      const match = list.find((item) => encode(item) === slug);
      return match || decoded;
    },
    [encode],
  );

  // 1️⃣ Initialize filters from URL on first load
  useEffect(() => {
    if (!filterOptions || Object.keys(filterOptions).length === 0) return;
    if (isHydratedRef.current) return;

    const urlCategories = searchParams
      .getAll("category")
      .map((slug) => decode(slug, filterOptions.categories));
    const urlBrands = searchParams
      .getAll("brand")
      .map((slug) => decode(slug, filterOptions.brands));
    const urlDepartments = searchParams
      .getAll("department")
      .map((slug) => decode(slug, filterOptions.departments));

    const minPrice = Number(
      searchParams.get("minPrice") || filterOptions.minPrice,
    );
    const maxPrice = Number(
      searchParams.get("maxPrice") || filterOptions.maxPrice,
    );

    const sort = searchParams.get("sort") || "default";
    const q = searchParams.get("q") || "";

    // 🔹 Step 1: Set prevSearchRef BEFORE updating context to prevent first-load reset
    prevSearchRef.current = q.trim();

    setSelectedCategories(urlCategories);
    setSelectedBrands(urlBrands);
    setSelectedDepartments(urlDepartments);
    setPriceRange([minPrice, maxPrice]);
    setSortOrder(sort);
    setSearchQuery(q);
    setSearchQueryLocal(q);
    // 🔹 Step 3: Mark hydration done
    isHydratedRef.current = true;
    setFiltersReady(true);
  }, [filterOptions]);

  //reset everything when using SearchQuery
  useEffect(() => {
    if (!isHydratedRef.current) return; // skip before hydration
    if (skipNextResetRef.current) {
      skipNextResetRef.current = false; // skip first run after hydration
      return;
    }

    const prev = prevSearchRef.current;
    const current = searchQuery.trim();

    if (prev !== current) {
      // 🔥 Reset ALL non-search filters
      setSelectedCategories([]);
      setSelectedBrands([]);
      setSelectedDepartments([]);
      userChangedPriceRef.current = false;
      if (filterOptions.minPrice === 0 && filterOptions.maxPrice === 0) {
        setPriceRange([GLOBAL_MIN_PRICE, GLOBAL_MAX_PRICE]);
      } else {
        setPriceRange([filterOptions.minPrice, filterOptions.maxPrice]);
      }

      setSortOrder("default");
      reset(true);

      prevSearchRef.current = current;
    }
  }, [searchQuery, filterOptions]);

  // 2️⃣ Sync filters → URL whenever state changes (debounced for search/price)
  useEffect(() => {
    if (!filterOptions || Object.keys(filterOptions).length === 0) return;
    if (!isHydratedRef.current) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams();

      selectedCategories.forEach((c) => params.append("category", encode(c)));
      selectedBrands.forEach((b) => params.append("brand", encode(b)));
      selectedDepartments.forEach((d) =>
        params.append("department", encode(d)),
      );

      if (
        userChangedPriceRef.current &&
        (priceRange[0] !== filterOptions.minPrice ||
          priceRange[1] !== filterOptions.maxPrice)
      ) {
        params.set("minPrice", priceRange[0]);
        params.set("maxPrice", priceRange[1]);
      }

      if (sortOrder !== "default") params.set("sort", sortOrder);
      if (searchQuery.trim()) params.set("q", searchQuery.trim());

      const newSearch = params.toString() ? `?${params.toString()}` : "";
      if (location.search !== newSearch) {
        setSearchParams(params);
      }
    }, 200); // small debounce to avoid rapid URL updates

    return () => clearTimeout(debounceRef.current);
  }, [
    selectedCategories,
    selectedBrands,
    selectedDepartments,
    priceRange,
    sortOrder,
    searchQuery,
    filterOptions,
    encode,
    setSearchParams,
    location.search,
  ]);

  // Handlers with proper scroll reset
  const handleToggleFilter = useCallback(
    (value, type) => {
      const setterMap = {
        category: setSelectedCategories,
        brand: setSelectedBrands,
        department: setSelectedDepartments,
      };

      setterMap[type]((prev) => {
        const newValues = prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value];
        return newValues;
      });

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }

      // Reset with scroll to top
      reset(true);
    },
    [reset],
  );

  const handlePriceRangeChange = useCallback(
    (newRange) => {
      userChangedPriceRef.current = true;
      setPriceRange(newRange);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }

      // Reset with scroll to top
      reset(true);
    },
    [reset],
  );

  const handleSortOrderChange = useCallback(
    (value) => {
      setSortOrder(value);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      // Reset with scroll to top
      reset(true);
    },
    [reset],
  );

  const handleRemoveCategory = useCallback(
    (category) => handleToggleFilter(category, "category"),
    [handleToggleFilter],
  );

  const handleRemoveBrand = useCallback(
    (brand) => handleToggleFilter(brand, "brand"),
    [handleToggleFilter],
  );

  const handleRemoveDepartment = useCallback(
    (department) => handleToggleFilter(department, "department"),
    [handleToggleFilter],
  );

  const handleRemovePriceFilter = useCallback(
    () =>
      handlePriceRangeChange([filterOptions.minPrice, filterOptions.maxPrice]),
    [handlePriceRangeChange, filterOptions.minPrice, filterOptions.maxPrice],
  );

  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedDepartments([]);
    if (filterOptions.minPrice === 0 && filterOptions.maxPrice === 0) {
      setPriceRange([GLOBAL_MIN_PRICE, GLOBAL_MAX_PRICE]);
    } else {
      setPriceRange([filterOptions.minPrice, filterOptions.maxPrice]);
    }
    userChangedPriceRef.current = false;

    setSortOrder("default");
    setSearchQuery("");
    setSearchQueryLocal("");

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    // Reset with scroll to top
    reset(true);
  }, [filterOptions, reset]);

  const activeFilterCount = useMemo(
    () =>
      selectedCategories.length +
      selectedBrands.length +
      selectedDepartments.length +
      (priceRange[0] > filterOptions.minPrice ||
      priceRange[1] < filterOptions.maxPrice
        ? 1
        : 0),
    [
      selectedCategories,
      selectedBrands,
      selectedDepartments,
      priceRange,
      filterOptions.minPrice,
      filterOptions.maxPrice,
    ],
  );

  return {
    handleToggleFilter,
    handlePriceRangeChange,
    handleSortOrderChange,
    handleRemoveCategory,
    handleRemoveBrand,
    handleRemoveDepartment,
    handleRemovePriceFilter,
    clearFilters,
    activeFilterCount,
    userChangedPriceRef,
  };
}
