import React, { useState, useEffect } from "react";
import { getFilteredProducts, getFilterOptions } from "../api/products";
import FilterPanel from "../components/products/FilterPanel";
import ProductGrid from "../components/products/ProductGrid";
import ActiveFilters from "../components/products/ActiveFilters";
import ProductHeader from "../components/products/ProductHeader";
import NoResults from "../components/products/NoResults";
import useInfiniteProducts from "../components/products/hooks/useInfiniteProducts";
import { useFilters } from "../context/FilterContext";
import useFilterUrlSync from "../components/products/hooks/useFilterUrlSync";

const DEBOUNCE_DELAY = 300; // ms
const ITEMS_PER_PAGE = 50;

const ProductPage = () => {
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({});

  /* ==============================
     Global filter context
  ============================== */
  const {
    selectedCategories,
    selectedBrands,
    selectedDepartments,
    priceRange,
    searchQuery,
    sortOrder,
    userChangedPriceRef,
    filtersReady,
  } = useFilters();

  /* ==============================
      filter options
  ============================== */
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const data = await getFilterOptions(searchQuery);

        setFilterOptions({
          categories: data.categories ?? [],
          brands: data.brands ?? [],
          departments: data.departments ?? [],
          minPrice: data.minPrice ?? 0,
          maxPrice: data.maxPrice ?? 0,
        });
      } catch (err) {
        console.error("Failed to load filter options", err);
      }
    };

    fetchFilters();
  }, [searchQuery]);

  /* ==============================
     Infinite Products Hook
  ============================== */
  const {
    products: filteredProducts,
    loading,
    hasMore,
    loadMore,
    totalItems,
    error: productsError,
    reset,
  } = useInfiniteProducts({
    fetchFn: getFilteredProducts,
    filters: {
      categories: selectedCategories,
      brands: selectedBrands,
      departments: selectedDepartments,
      ...(userChangedPriceRef.current && {
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
      }),
      searchQuery,
    },
    filtersReady,
    sortOrder,
    itemsPerPage: ITEMS_PER_PAGE,
    debounceDelay: DEBOUNCE_DELAY,
    restoreScrollOnMount: true, // Enable scroll restoration
  });

  /* ==============================
     Filter Hook
  ============================== */
  const {
    handleToggleFilter,
    handlePriceRangeChange,
    handleSortOrderChange,
    handleRemoveCategory,
    handleRemoveBrand,
    handleRemoveDepartment,
    handleRemovePriceFilter,
    clearFilters,
    activeFilterCount,
  } = useFilterUrlSync({ filterOptions, reset });

  // 4️⃣ Handle errors from the hook
  useEffect(() => {
    if (productsError) {
      setError("Failed to load products. Please try again.");
    }
  }, [productsError]);

  // Body scroll lock for mobile filters
  useEffect(() => {
    document.body.style.overflow = showFilters ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showFilters]);

  // Close mobile filters on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setShowFilters(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (error)
    return (
      <section className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Error Loading Products
          </h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </section>
    );

  return (
    <section className="w-full min-h-screen bg-gray-50 relative pb-20">
      {/* Overlay */}

      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          showFilters ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowFilters(false)}
      />
      {/* Mobile Filter Panel */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-full md:w-100 bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${
          showFilters ? "translate-x-0 overflow-y-hidden" : "-translate-x-full"
        } overflow-y-auto p-6`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl">Filters</h3>
          <button
            aria-label="Close filters"
            onClick={() => setShowFilters(false)}
            className="text-gray-600 hover:text-gray-900 transition cursor-pointer"
          >
            ✕
          </button>
        </div>
        <FilterPanel
          categories={filterOptions.categories}
          brands={filterOptions.brands}
          departments={filterOptions.departments}
          selectedCategories={selectedCategories}
          selectedBrands={selectedBrands}
          selectedDepartments={selectedDepartments}
          priceRange={priceRange}
          minPrice={filterOptions.minPrice}
          maxPrice={filterOptions.maxPrice}
          activeFilterCount={activeFilterCount}
          onToggleFilter={handleToggleFilter}
          onClearFilters={clearFilters}
          onPriceRangeChange={handlePriceRangeChange}
        />
      </div>

      <ProductHeader
        selectedCategories={selectedCategories}
        activeFilterCount={activeFilterCount}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        sortOrder={sortOrder}
        setSortOrder={handleSortOrderChange}
        totalProducts={totalItems}
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col lg:flex-row gap-8 mt-4">
        <aside className="hidden lg:block sticky top-35 h-[calc(100vh-7rem)] overflow-y-auto">
          <FilterPanel
            categories={filterOptions.categories}
            brands={filterOptions.brands}
            departments={filterOptions.departments}
            selectedCategories={selectedCategories}
            selectedBrands={selectedBrands}
            selectedDepartments={selectedDepartments}
            priceRange={priceRange}
            minPrice={filterOptions.minPrice}
            maxPrice={filterOptions.maxPrice}
            activeFilterCount={activeFilterCount}
            onToggleFilter={handleToggleFilter}
            onClearFilters={clearFilters}
            onPriceRangeChange={handlePriceRangeChange}
          />
        </aside>

        <main className="flex-1">
          <ActiveFilters
            selectedCategories={selectedCategories}
            selectedBrands={selectedBrands}
            priceRange={priceRange}
            minPrice={filterOptions.minPrice}
            maxPrice={filterOptions.maxPrice}
            selectedDepartments={selectedDepartments}
            onRemoveCategory={handleRemoveCategory}
            onRemoveBrand={handleRemoveBrand}
            onRemoveDepartment={handleRemoveDepartment}
            onRemovePriceFilter={handleRemovePriceFilter}
          />

          {filteredProducts.length === 0 && !loading ? (
            <NoResults clearFilters={clearFilters} />
          ) : (
            <ProductGrid
              filteredProducts={filteredProducts}
              loading={loading}
              hasMore={hasMore}
              onClearFilters={clearFilters}
              onLoadMore={loadMore}
            />
          )}
        </main>
      </div>
    </section>
  );
};

export default ProductPage;
