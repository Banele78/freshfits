import React from "react";

export default function OrderImageCollage({ items, totalItems }) {
  const images = items.slice(0, 4);
  const remainingCount = totalItems - 4;

  if (!images.length) return null;

  return (
    <div className="w-32 h-32 overflow-hidden rounded group">
      {/* 1 Image */}
      {images.length === 1 && (
        <img
          src={images[0].imageUrl}
          alt={images[0].name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      )}

      {/* 2 Images → Vertical Split */}
      {images.length === 2 && (
        <div className="grid grid-cols-2 w-full h-full gap-1">
          {images.map((item, idx) => (
            <img
              key={idx}
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ))}
        </div>
      )}

      {/* 3 or 4 Images → 2x2 Grid */}
      {images.length > 2 && (
        <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-1 relative">
          {images.map((item, idx) => (
            <div key={idx} className="relative w-full h-full overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* +X Overlay */}
              {idx === 3 && remainingCount > 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-medium">
                  +{remainingCount}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
