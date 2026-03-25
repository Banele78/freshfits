export default function ProductDetailLoader() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10 mt-5 sm:mt-0 lg:mt-0 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Skeleton */}
        <div className="bg-gray-200 rounded-lg h-150 w-full"></div>

        {/* Info Skeleton */}
        <div className="flex flex-col gap-4">
          {/* Title */}
          <div className="bg-gray-200 h-8 w-3/4 rounded"></div>
          {/* Brand / Department */}
          <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
          {/* Price */}
          <div className="bg-gray-200 h-6 w-1/4 rounded mt-4"></div>
          {/* Sizes */}
          <div className="flex gap-2 mt-2">
            <div className="bg-gray-200 h-8 w-12 rounded"></div>
            <div className="bg-gray-200 h-8 w-12 rounded"></div>
            <div className="bg-gray-200 h-8 w-12 rounded"></div>
          </div>
          {/* Add to Cart */}
          <div className="bg-gray-200 h-10 w-full rounded mt-4"></div>
          {/* Description */}
          <div className="bg-gray-200 h-4 w-full rounded mt-4"></div>
          <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
          <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
          {/* Accordion / Reviews */}
          <div className="bg-gray-200 h-10 w-full rounded mt-6"></div>
          <div className="bg-gray-200 h-10 w-full rounded mt-2"></div>
        </div>
      </div>
    </section>
  );
}
