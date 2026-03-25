import { Link } from "react-router-dom";
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";

// Memoize ProductCard to prevent unnecessary re-renders
const ProductCard = React.memo(({ product }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const firstImage = product.imageUrls?.[0];

  return (
    <Link
      to={`/products/${product.slug}`}
      className="block"
      aria-label={`View ${product.name} - R${product.price}`}
    >
      <div className="group relative rounded-md overflow-hidden transition-transform duration-300 hover:-translate-y-1">
        <div className="relative w-full h-60 overflow-hidden rounded-md">
          {firstImage && (
            <img
              src={firstImage}
              alt={product.name}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 ${
                !isImageLoaded ? "scale-95 opacity-0" : "scale-100 opacity-100"
              }`}
              loading="eager"
              onLoad={() => setIsImageLoaded(true)}
            />
          )}

          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
          )}

          <div className="absolute top-3 left-3">
            <span className="bg-black/70 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {product.brand}
            </span>
          </div>
        </div>

        <div className="mt-1">
          <p className="text-sm tracking-wide text-neutral-900 line-clamp-1">
            {product.name}
          </p>

          <p className="text-sm text-neutral-500">R{product.price}</p>
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = "ProductCard";

// Main Product Grid Component with smoother loading
const ProductGrid = ({
  filteredProducts = [],
  loading = false,
  onClearFilters,
  hasMore = false,
  onLoadMore,
}) => {
  const observerRef = useRef(null);
  const observerInstance = useRef(null);
  const lastLoadTimeRef = useRef(0);

  // Memoize product list to prevent unnecessary re-renders
  const memoizedProducts = useMemo(
    () =>
      filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      )),
    [filteredProducts],
  );

  // Throttle loadMore to prevent rapid consecutive calls
  const throttledLoadMore = useCallback(() => {
    if (loading || !hasMore) return;

    const now = Date.now();
    if (now - lastLoadTimeRef.current < 500) return;

    lastLoadTimeRef.current = now;
    onLoadMore();
  }, [loading, hasMore]);

  // Use Intersection Observer with better settings
  const isInitialLoadRef = useRef(true);
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => {
    loadingRef.current = loading;
    hasMoreRef.current = hasMore;
  }, [loading, hasMore]);

  useEffect(() => {
    if (!observerRef.current) return;

    observerInstance.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loadingRef.current && hasMoreRef.current) {
          throttledLoadMore();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      },
    );

    observerInstance.current.observe(observerRef.current);

    return () => observerInstance.current?.disconnect();
  }, [throttledLoadMore]);

  // Initial loading skeleton with better keys
  if (loading && filteredProducts.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={`skeleton-initial-${i}`}
            className="animate-pulse space-y-3 rounded-md overflow-hidden"
          >
            <div className="relative w-full h-60 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md" />
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {memoizedProducts}
      </div>

      {/* Sentinel with better positioning */}
      {hasMore && (
        <div
          ref={observerRef}
          className="h-20 w-full mt-8 pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Improved bottom skeleton loader */}
      {loading && filteredProducts.length > 0 && (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 animate-fadeIn"
          key={`skeleton-bottom-${Date.now()}`}
        >
          {[...Array(4)].map((_, i) => (
            <div
              key={`skeleton-bottom-${i}-${Date.now()}`}
              className="animate-pulse space-y-3 rounded-md overflow-hidden"
            >
              <div className="relative w-full h-60 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md" />
              <div className="space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(ProductGrid);
