import { useState, useEffect, useRef, useCallback, useMemo } from "react";

export default function useInfiniteProducts({
  fetchFn,
  filters = {},
  filtersReady = true, // 👈 add this
  sortOrder = "default",
  itemsPerPage = 20,
  debounceDelay = 300,
}) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState(null);
  const [filterOptions, setFilterOptions] = useState({});
  const [filterOptionsLoaded, setFilterOptionsLoaded] = useState(false);
  const [queryVersion, setQueryVersion] = useState(0);

  const debounceRef = useRef(null);
  const fetchingRef = useRef(false);

  // Memoize filters to prevent infinite loops
  const memoFilters = useMemo(() => filters, [JSON.stringify(filters)]);

  // Fetch products when page changes
  useEffect(() => {
    if (!filtersReady) return;
    if (fetchingRef.current) return;

    debounceRef.current = setTimeout(async () => {
      fetchingRef.current = true;
      setLoading(true);

      try {
        const res = await fetchFn({
          ...memoFilters,
          sort: sortOrder,
          page: page, // API is 1-based
          limit: itemsPerPage,
          // only include filters on first page
        });

        setProducts((prev) =>
          page === 0 ? res.products : [...prev, ...res.products],
        );
        setHasMore(page + 1 < res.totalPages);
        setTotalItems(res.totalItems || 0);
      } catch (e) {
        setError(e);
      } finally {
        fetchingRef.current = false;
        setLoading(false);
      }
    }, debounceDelay);

    return () => clearTimeout(debounceRef.current);
  }, [
    filtersReady,
    page,
    memoFilters,
    queryVersion, // 👈 important
    sortOrder,
    itemsPerPage,
    debounceDelay,
    hasMore,
    fetchFn,
  ]);

  const loadMore = useCallback(() => {
    if (fetchingRef.current || loading || !hasMore) {
      return;
    }

    setPage((p) => p + 1);
  }, [loading, hasMore, page]);

  const reset = useCallback((scrollToTop = true) => {
    fetchingRef.current = false;
    clearTimeout(debounceRef.current);

    setProducts([]);
    setPage(0);
    setHasMore(true);
    setLoading(false);
    setError(null);
    setFilterOptionsLoaded(false);

    // 🔥 FORCE refetch even if page stays 0
    setQueryVersion((v) => v + 1);

    if (scrollToTop) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, []);

  return {
    products,
    filterOptions,
    filterOptionsLoaded,
    loading,
    hasMore,
    loadMore,
    totalItems,
    error,
    reset,
    currentPage: page,
    setPage,
  };
}
