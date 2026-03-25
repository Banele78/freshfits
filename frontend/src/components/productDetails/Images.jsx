import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Images = ({ product }) => {
  const [activeImage, setActiveImage] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  if (!product?.imageUrls || product.imageUrls.length === 0) return null;

  const handlePrev = () =>
    setActiveImage(
      (prev) =>
        (prev - 1 + product.imageUrls.length) % product.imageUrls.length,
    );

  const handleNext = () =>
    setActiveImage((prev) => (prev + 1) % product.imageUrls.length);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const deltaX = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50; // Minimum swipe distance
    if (deltaX > swipeThreshold) handleNext(); // Swipe left → next
    if (deltaX < -swipeThreshold) handlePrev(); // Swipe right → prev
  };

  return (
    <div className="relative ">
      {/* Main Image Container with swipe support */}
      <div
        className="w-full overflow-hidden rounded-xl mb-4 relative  "
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeImage * 100}%)` }}
        >
          {product.imageUrls.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${product.name} image ${idx + 1}`}
              className="w-full flex-shrink-0 object-cover"
            />
          ))}
        </div>
      </div>

      {/* Left Arrow */}
      {product.imageUrls.length > 1 && (
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 stroke-2 text-gray-700" />
        </button>
      )}

      {/* Right Arrow */}
      {product.imageUrls.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition cursor-pointer"
        >
          <ChevronRight className="w-6 h-6 stroke-2 text-gray-700" />
        </button>
      )}

      {/* Thumbnails */}
      <div className="flex gap-3 mt-3">
        {product.imageUrls.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`${product.name} thumbnail ${idx + 1}`}
            onClick={() => setActiveImage(idx)}
            className={`w-20 h-20 object-cover rounded-lg border cursor-pointer transition
              ${activeImage === idx ? "border-black" : "border-gray-200 hover:border-gray-400"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Images;
