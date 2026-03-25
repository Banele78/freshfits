import { useState, useEffect, useRef, useMemo, useCallback } from "react";

export default function useInfiniteProducts({
  fetchFn,
  filters,
  sortOrder,
  itemsPerPage = 20,
  debounceDelay = 300,
  restoreScrollOnMount = true,
}) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState(null);

  const lockRef = useRef(false);
  const fetchIdRef = useRef(0);
  const debounceRef = useRef(null);

  // Track if we're in the initial load phase
  const initialLoadRef = useRef(true);

  // Track scroll restoration
  const scrollStateRef = useRef({
    isRestoring: false,
    savedPage: -1,
    savedScrollY: 0,
    savedFiltersHash: "",
    hasAttemptedRestoration: false,
  });

  // Track the last successful fetch parameters
  const lastFetchRef = useRef({
    cacheKey: "",
    page: -1,
  });

  // Improved cache structure
  const cacheRef = useRef({
    data: new Map(),
    timestamps: new Map(),
    maxAge: 5 * 60 * 1000,
    maxEntries: 20,
  });

  const cacheKey = useMemo(
    () => JSON.stringify({ filters, sortOrder }),
    [filters, sortOrder]
  );

  // Use a SINGLE storage key for the entire page
  const scrollStorageKey = "infinite-scroll:product-page";

  // Helper to create a stable hash of filters
  const getFiltersHash = useCallback((currentFilters, currentSort) => {
    return JSON.stringify({
      categories: (currentFilters?.categories || []).sort(),
      brands: (currentFilters?.brands || []).sort(),
      departments: (currentFilters?.departments || []).sort(),
      minPrice: currentFilters?.minPrice || 0,
      maxPrice: currentFilters?.maxPrice || 2500,
      sortOrder: currentSort || "default",
    });
  }, []);

  // 1. SAVE SCROLL POSITION
  useEffect(() => {
    if (!restoreScrollOnMount) return;

    const saveScrollPosition = () => {
      // Don't save during restoration
      if (scrollStateRef.current.isRestoring) return;

      // Only save if we've scrolled down a bit
      if (window.scrollY < 100) return;

      const filtersHash = getFiltersHash(filters, sortOrder);

      sessionStorage.setItem(
        scrollStorageKey,
        JSON.stringify({
          page,
          scrollY: window.scrollY,
          timestamp: Date.now(),
          filtersHash,
        })
      );
    };

    let timeoutId;
    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(saveScrollPosition, 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [page, filters, sortOrder, restoreScrollOnMount, getFiltersHash]);

  // 2. LOAD SAVED SCROLL STATE - Wait for filters to stabilize
  useEffect(() => {
    if (!restoreScrollOnMount) return;
    if (scrollStateRef.current.hasAttemptedRestoration) return;

    // Wait until we have stable filters (not the initial defaults)
    const savedData = sessionStorage.getItem(scrollStorageKey);
    if (!savedData) return;

    try {
      const {
        page: savedPage,
        scrollY,
        filtersHash: savedFiltersHash,
      } = JSON.parse(savedData);

      const currentFiltersHash = getFiltersHash(filters, sortOrder);

      console.log("Checking scroll restoration:", {
        savedFiltersHash,
        currentFiltersHash,
        initialLoad: initialLoadRef.current,
      });

      // If filters don't match yet, wait for them to update
      if (savedFiltersHash !== currentFiltersHash) {
        console.log("Filters don't match yet, waiting...");

        // If this is the initial load and we're still waiting for filters to update,
        // don't abort yet - we'll check again when filters update
        if (initialLoadRef.current) {
          return;
        }

        // If not initial load and filters still don't match, clear and abort
        console.log("Filters permanently don't match, clearing saved data");
        sessionStorage.removeItem(scrollStorageKey);
        scrollStateRef.current.hasAttemptedRestoration = true;
        return;
      }

      // Filters match! Start restoration
      console.log("Filters match! Starting restoration for page:", savedPage);

      scrollStateRef.current = {
        isRestoring: true,
        savedPage: Math.max(0, savedPage),
        savedScrollY: Math.max(0, scrollY),
        savedFiltersHash,
        hasAttemptedRestoration: true,
      };

      // Set the page
      if (savedPage > 0) {
        setPage(savedPage);
      } else {
        // If page is 0, just restore scroll position
        scrollStateRef.current.isRestoring = false;
        requestAnimationFrame(() => {
          window.scrollTo({ top: scrollY, behavior: "auto" });
          sessionStorage.removeItem(scrollStorageKey);
        });
      }
    } catch (err) {
      console.error("Error loading scroll state:", err);
      sessionStorage.removeItem(scrollStorageKey);
      scrollStateRef.current.hasAttemptedRestoration = true;
    }
  }, [
    filters,
    sortOrder,
    restoreScrollOnMount,
    getFiltersHash,
    scrollStorageKey,
  ]);

  // 3. RESTORE SCROLL AFTER PRODUCTS ARE LOADED
  useEffect(() => {
    const { isRestoring, savedPage, savedScrollY, savedFiltersHash } =
      scrollStateRef.current;

    if (!isRestoring) return;
    if (loading) return;
    if (products.length === 0) return;

    const currentFiltersHash = getFiltersHash(filters, sortOrder);

    // Final check: filters must still match
    if (savedFiltersHash !== currentFiltersHash) {
      console.log("Filters changed during restoration, aborting");
      scrollStateRef.current.isRestoring = false;
      return;
    }

    // Check if we're on the right page
    if (page !== savedPage) {
      console.log("Not on saved page yet, current:", page, "saved:", savedPage);
      return;
    }

    // Check if we have enough products
    const expectedProductCount = (savedPage + 1) * itemsPerPage;
    const minimumRequired = Math.min(expectedProductCount, itemsPerPage * 2);

    if (products.length < minimumRequired) {
      console.log(
        "Not enough products yet:",
        products.length,
        "expected at least:",
        minimumRequired
      );
      return;
    }

    console.log("Restoring scroll to:", savedScrollY);

    // All conditions met, restore scroll
    scrollStateRef.current.isRestoring = false;

    requestAnimationFrame(() => {
      window.scrollTo({ top: savedScrollY, behavior: "auto" });
      console.log("Scroll restored successfully");

      // Clear the saved data after successful restoration
      sessionStorage.removeItem(scrollStorageKey);
    });
  }, [
    products.length,
    loading,
    page,
    itemsPerPage,
    filters,
    sortOrder,
    getFiltersHash,
  ]);

  // Mark when initial load is complete
  useEffect(() => {
    if (initialLoadRef.current && filters && sortOrder) {
      // Give it a moment for filters to stabilize, then mark initial load as complete
      const timeout = setTimeout(() => {
        console.log("Initial load complete, filters stabilized");
        initialLoadRef.current = false;
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [filters, sortOrder]);

  // Clean up old cache entries
  const cleanupCache = useCallback(() => {
    const now = Date.now();
    const { data, timestamps, maxAge } = cacheRef.current;

    for (const [key, timestamp] of timestamps.entries()) {
      if (now - timestamp > maxAge) {
        data.delete(key);
        timestamps.delete(key);
      }
    }
  }, []);

  /* Reset on filter/sort change */
  useEffect(() => {
    // If cacheKey changed, reset everything
    if (lastFetchRef.current.cacheKey !== cacheKey) {
      lockRef.current = false;
      setProducts([]);
      setPage(0);
      setHasMore(true);
      setError(null);
      lastFetchRef.current = { cacheKey, page: -1 };

      // Clear scroll state
      scrollStateRef.current = {
        isRestoring: false,
        savedPage: -1,
        savedScrollY: 0,
        savedFiltersHash: "",
        hasAttemptedRestoration: false,
      };
    }

    // Clean cache periodically
    cleanupCache();
  }, [cacheKey, cleanupCache]);

  /* Fetch logic */
  useEffect(() => {
    if (!hasMore || loading) return;

    // Don't fetch if we already fetched this page with these filters
    if (
      lastFetchRef.current.cacheKey === cacheKey &&
      lastFetchRef.current.page === page
    ) {
      return;
    }

    // Clear any pending timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    const fetchId = ++fetchIdRef.current;

    const fetchData = async () => {
      if (lockRef.current) return;

      lockRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const { data: cacheData, timestamps } = cacheRef.current;

        // Check cache
        const cached = cacheData.get(cacheKey);
        if (cached?.pages?.has(page)) {
          const cacheTimestamp = timestamps.get(cacheKey);
          const now = Date.now();

          if (
            cacheTimestamp &&
            now - cacheTimestamp < cacheRef.current.maxAge
          ) {
            setProducts((p) => {
              if (page === 0) {
                return cached.pages.get(page);
              }
              return [...p, ...cached.pages.get(page)];
            });

            setHasMore(page < cached.totalPages - 1);
            setTotalItems(cached.totalItems);
            lastFetchRef.current = { cacheKey, page };
            return;
          }
        }

        // Fetch new data
        const data = await fetchFn({
          ...filters,
          sort: sortOrder,
          page,
          limit: itemsPerPage,
        });

        if (fetchId !== fetchIdRef.current) return;

        setProducts((p) => {
          if (page === 0) {
            return data.products;
          }
          return [...p, ...data.products];
        });

        setHasMore(page < data.totalPages - 1);
        setTotalItems(data.totalItems);
        lastFetchRef.current = { cacheKey, page };

        // Update cache
        if (!cacheData.has(cacheKey)) {
          cacheData.set(cacheKey, {
            pages: new Map(),
            totalPages: data.totalPages,
            totalItems: data.totalItems,
          });
        }

        cacheData.get(cacheKey).pages.set(page, data.products);
        timestamps.set(cacheKey, Date.now());

        // Limit cache size
        if (cacheData.size > cacheRef.current.maxEntries) {
          const firstKey = cacheData.keys().next().value;
          cacheData.delete(firstKey);
          timestamps.delete(firstKey);
        }
      } catch (err) {
        if (fetchId === fetchIdRef.current) {
          setError(err);
          console.error("Error fetching products:", err);
        }
      } finally {
        if (fetchId === fetchIdRef.current) {
          lockRef.current = false;
          setLoading(false);
        }
      }
    };

    debounceRef.current = setTimeout(fetchData, debounceDelay);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [
    page,
    cacheKey,
    fetchFn,
    filters,
    sortOrder,
    itemsPerPage,
    debounceDelay,
    hasMore,
    loading,
  ]);

  // Reset to first page with scroll to top
  const reset = useCallback(
    (scrollToTop = true) => {
      fetchIdRef.current += 1;
      lockRef.current = false;

      setProducts([]);
      setPage(0);
      setHasMore(true);
      setError(null);

      lastFetchRef.current = { cacheKey: "", page: -1 };

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }

      // Clear scroll state
      scrollStateRef.current = {
        isRestoring: false,
        savedPage: -1,
        savedScrollY: 0,
        savedFiltersHash: "",
        hasAttemptedRestoration: false,
      };

      // Clear storage when user explicitly resets
      sessionStorage.removeItem(scrollStorageKey);

      // Scroll to top if requested
      if (scrollToTop) {
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      }
    },
    [scrollStorageKey]
  );

  const loadMore = useCallback(() => {
    if (
      lockRef.current ||
      !hasMore ||
      loading ||
      scrollStateRef.current.isRestoring
    ) {
      return;
    }

    setPage((p) => p + 1);
  }, [hasMore, loading]);

  // Manual refresh
  const refresh = useCallback(
    (scrollToTop = false) => {
      // Clear cache for current key
      const { data, timestamps } = cacheRef.current;
      data.delete(cacheKey);
      timestamps.delete(cacheKey);

      // Clear scroll state
      scrollStateRef.current = {
        isRestoring: false,
        savedPage: -1,
        savedScrollY: 0,
        savedFiltersHash: "",
        hasAttemptedRestoration: false,
      };

      // Reset and fetch from beginning
      setPage(0);

      // Scroll to top if requested
      if (scrollToTop) {
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      }
    },
    [cacheKey]
  );

  return {
    products,
    loading,
    hasMore,
    loadMore,
    totalItems,
    error,
    reset,
    refresh,
    currentPage: page + 1,
    setPage: (newPage) => {
      if (
        newPage >= 0 &&
        !lockRef.current &&
        !scrollStateRef.current.isRestoring
      ) {
        setPage(newPage);
      }
    },

    isRestoring: scrollStateRef.current.isRestoring,
  };
}
