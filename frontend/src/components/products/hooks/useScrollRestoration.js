import { useEffect, useRef, useCallback, useState } from "react";

export function useScrollRestoration({
  enabled = false,
  filters,
  sortOrder,
  page,
  loading,
  initialLoadRef,
  products,
  itemsPerPage = 20,
  storageKey = "infinite-scroll:product-page",
  getFiltersHash,
  setPage,
  onRestoreStart,
  onRestoreComplete,
}) {
  // Track if we're in the initial load phase

  const isFirstMountRef = useRef(true);

  // Track scroll restoration
  const scrollStateRef = useRef({
    isRestoring: false,
    savedPage: -1,
    savedScrollY: 0,
    savedFiltersHash: "",
    hasAttemptedRestoration: false,
    restorationCompleted: false,
  });

  // Helper to get current filters hash
  const getCurrentFiltersHash = useCallback(() => {
    return (
      getFiltersHash?.(filters, sortOrder) ||
      JSON.stringify({ filters, sortOrder })
    );
  }, [filters, sortOrder, getFiltersHash]);

  const [loadingFilters, setLoadingFilters] = useState(true);

  // 1. SAVE SCROLL POSITION
  // useEffect(() => {
  //   if (!enabled) return;

  //   const saveScrollPosition = () => {
  //     // Don't save during restoration
  //     if (scrollStateRef.current.isRestoring) return;
  //     if (scrollStateRef.current.restorationCompleted) return;

  //     // Only save if we've scrolled down a bit
  //     if (window.scrollY < 100) return;

  //     const filtersHash = getCurrentFiltersHash();

  //     sessionStorage.setItem(
  //       storageKey,
  //       JSON.stringify({
  //         page,
  //         scrollY: window.scrollY,
  //         timestamp: Date.now(),
  //         filtersHash,
  //       })
  //     );
  //   };

  //   let timeoutId;
  //   const handleScroll = () => {
  //     if (timeoutId) clearTimeout(timeoutId);
  //     timeoutId = setTimeout(saveScrollPosition, 200);
  //   };

  //   console.log("Attaching scroll listener for saving position");

  //   window.addEventListener("scroll", handleScroll, { passive: true });
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //     if (timeoutId) clearTimeout(timeoutId);
  //   };
  // }, [enabled, page, filters, sortOrder, storageKey, getCurrentFiltersHash]);

  // 2. LOAD SAVED SCROLL STATE - Wait for filters to stabilize
  // useEffect(() => {
  //   if (!enabled) return;
  //   if (scrollStateRef.current.hasAttemptedRestoration) return;
  //   if (!isFirstMountRef.current) return;

  //   // Wait until we have stable filters (not the initial defaults)
  //   const savedData = sessionStorage.getItem(storageKey);
  //   if (!savedData) {
  //     scrollStateRef.current.hasAttemptedRestoration = true;
  //     return;
  //   }

  //   try {
  //     const {
  //       page: savedPage,
  //       scrollY,
  //       filtersHash: savedFiltersHash,
  //     } = JSON.parse(savedData);

  //     const currentFiltersHash = getCurrentFiltersHash();

  //     console.log("Checking scroll restoration:", {
  //       savedFiltersHash,
  //       currentFiltersHash,
  //       initialLoad: initialLoadRef.current,
  //     });

  //     // If filters don't match yet, wait for them to update
  //     if (savedFiltersHash !== currentFiltersHash) {
  //       console.log("Filters don't match yet, waiting...");

  //       // If this is the initial load and we're still waiting for filters to update,
  //       // don't abort yet - we'll check again when filters update
  //       if (initialLoadRef.current) {
  //         return;
  //       }

  //       // If not initial load and filters still don't match, clear and abort
  //       console.log("Filters permanently don't match, clearing saved data");
  //       sessionStorage.removeItem(storageKey);
  //       scrollStateRef.current.hasAttemptedRestoration = true;
  //       return;
  //     }

  //     // Filters match! Start restoration
  //     console.log("Filters match! Starting restoration for page:", savedPage);

  //     if (onRestoreStart) onRestoreStart();

  //     scrollStateRef.current = {
  //       isRestoring: true,
  //       savedPage: Math.max(0, savedPage),
  //       savedScrollY: Math.max(0, scrollY),
  //       savedFiltersHash,
  //       hasAttemptedRestoration: true,
  //       restorationCompleted: false,
  //     };

  //     // Set the page if different from current
  //     if (savedPage > 0 && savedPage !== page) {
  //       console.log("Setting page to:", savedPage);
  //       setPage(savedPage);
  //     } else {
  //       // If page is 0 or same as current, just restore scroll position
  //       scrollStateRef.current.isRestoring = false;
  //       requestAnimationFrame(() => {
  //         window.scrollTo({ top: scrollY, behavior: "auto" });
  //         console.log("Scroll restored to position:", scrollY);
  //         scrollStateRef.current.restorationCompleted = true;
  //         sessionStorage.removeItem(storageKey);
  //         if (onRestoreComplete) onRestoreComplete();
  //       });
  //     }
  //   } catch (err) {
  //     console.error("Error loading scroll state:", err);
  //     sessionStorage.removeItem(storageKey);
  //     scrollStateRef.current.hasAttemptedRestoration = true;
  //   }
  // }, [
  //   enabled,
  //   filters,
  //   sortOrder,
  //   storageKey,
  //   getCurrentFiltersHash,
  //   page,
  //   setPage,
  //   onRestoreStart,
  //   onRestoreComplete,
  //   loadingFilters,
  // ]);

  // 3. RESTORE SCROLL AFTER PRODUCTS ARE LOADED (for multi-page restoration)
  // useEffect(() => {
  //   const { isRestoring, savedPage, savedScrollY, savedFiltersHash } =
  //     scrollStateRef.current;

  //   if (!isRestoring) return;
  //   if (loading) return;
  //   if (products.length === 0) return;

  //   const currentFiltersHash = getCurrentFiltersHash();

  //   // Final check: filters must still match
  //   if (savedFiltersHash !== currentFiltersHash) {
  //     console.log("Filters changed during restoration, aborting");
  //     scrollStateRef.current.isRestoring = false;
  //     sessionStorage.removeItem(storageKey);
  //     return;
  //   }

  //   // Check if we're on the right page
  //   if (page !== savedPage) {
  //     console.log("Not on saved page yet, current:", page, "saved:", savedPage);
  //     return;
  //   }

  //   // Check if we have enough products
  //   const expectedProductCount = (savedPage + 1) * itemsPerPage;
  //   const minimumRequired = Math.min(expectedProductCount, itemsPerPage * 2);

  //   if (products.length < minimumRequired) {
  //     console.log(
  //       "Not enough products yet:",
  //       products.length,
  //       "expected at least:",
  //       minimumRequired
  //     );
  //     return;
  //   }

  //   console.log("Restoring scroll to:", savedScrollY);

  //   // All conditions met, restore scroll
  //   scrollStateRef.current.isRestoring = false;
  //   scrollStateRef.current.restorationCompleted = true;

  //   requestAnimationFrame(() => {
  //     window.scrollTo({ top: savedScrollY, behavior: "auto" });
  //     console.log("Scroll restored successfully");

  //     // Clear the saved data after successful restoration
  //     sessionStorage.removeItem(storageKey);
  //     if (onRestoreComplete) onRestoreComplete();
  //   });
  // }, [
  //   products.length,
  //   loading,
  //   page,
  //   itemsPerPage,
  //   getCurrentFiltersHash,
  //   onRestoreComplete,
  // ]);

  // Reset first mount flag after initial render
  useEffect(() => {
    const timeout = setTimeout(() => {
      isFirstMountRef.current = false;
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  // Clear saved position
  const clearSavedPosition = useCallback(() => {
    sessionStorage.removeItem(storageKey);
    scrollStateRef.current = {
      isRestoring: false,
      savedPage: -1,
      savedScrollY: 0,
      savedFiltersHash: "",
      hasAttemptedRestoration: true,
      restorationCompleted: false,
    };
  }, [storageKey]);

  // Manually save scroll position
  const saveScrollPosition = useCallback(() => {
    const filtersHash = getCurrentFiltersHash();
    sessionStorage.setItem(
      storageKey,
      JSON.stringify({
        page,
        scrollY: window.scrollY,
        timestamp: Date.now(),
        filtersHash,
      })
    );
  }, [storageKey, page, getCurrentFiltersHash]);

  return {
    isRestoring: scrollStateRef.current.isRestoring,
    targetPage: scrollStateRef.current.savedPage,
    clearSavedPosition,
    saveScrollPosition,
  };
}
