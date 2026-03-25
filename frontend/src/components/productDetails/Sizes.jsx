import { useEffect } from "react";

const Sizes = ({
  productsSizes,
  selectedSize,
  onSelectSize,
  quantity,
  setQuantity,
}) => {
  const selectedSizeObj = productsSizes.find((ps) => ps.size === selectedSize);

  const isLowStock =
    selectedSizeObj &&
    selectedSizeObj.stockQuantity > 0 &&
    selectedSizeObj.stockQuantity <= 3;

  const hasMultipleSizes = productsSizes.length > 1;

  useEffect(() => {
    if (
      productsSizes.length === 1 &&
      productsSizes[0].stockQuantity > 0 &&
      !selectedSize
    ) {
      onSelectSize(productsSizes[0].size);
    }
  }, [productsSizes, selectedSize, onSelectSize]);

  return (
    <div className="mt-6">
      {hasMultipleSizes && (
        <>
          <p className="text-sm font-medium mb-2">Select size</p>

          <div className="flex flex-wrap gap-3">
            {productsSizes.map((ps) => {
              const disabled = ps.stockQuantity === 0;
              const active = selectedSize === ps.size;

              return (
                <button
                  key={ps.id}
                  disabled={disabled}
                  onClick={() => onSelectSize(ps.size)}
                  className={`px-4 py-2 border rounded-lg text-sm transition 
                ${
                  active
                    ? "border-black bg-black text-white"
                    : "border-gray-300 text-gray-700"
                }
                ${
                  disabled
                    ? "opacity-40 cursor-not-allowed line-through"
                    : "hover:border-black cursor-pointer"
                }`}
                >
                  {ps.size}
                </button>
              );
            })}
          </div>
        </>
      )}

      {isLowStock && (
        <p className="mt-3 text-sm text-red-600">
          ⚠️ Only {selectedSizeObj.stockQuantity} left in stock
        </p>
      )}

      {/* Quantity selector (only after size selected) */}
      {selectedSizeObj && (
        <div className="mt-5 space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Quantity
          </label>

          <div className="inline-flex items-center rounded-lg border border-gray-300 overflow-hidden bg-white shadow-sm">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity === 1}
              className="
                px-4 py-2 text-lg font-semibold cursor-pointer
                transition
                hover:bg-gray-100 active:scale-95
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              −
            </button>

            <span className="px-5 py-2 min-w-[48px] text-center font-semibold text-gray-900">
              {quantity}
            </span>

            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() =>
                setQuantity((q) =>
                  Math.min(selectedSizeObj.stockQuantity, q + 1),
                )
              }
              disabled={quantity === selectedSizeObj.stockQuantity}
              className="
                px-4 py-2 text-lg font-semibold cursor-pointer
                transition
                hover:bg-gray-100 active:scale-95
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              +
            </button>
          </div>

          <p className="text-xs text-gray-500">
            {selectedSizeObj.stockQuantity} item
            {selectedSizeObj.stockQuantity > 1 && "s"} available
          </p>
        </div>
      )}
    </div>
  );
};

export default Sizes;
