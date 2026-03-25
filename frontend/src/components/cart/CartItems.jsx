import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CartSkeleton from "./CartSkeleton";

export default function CartItems({ cart }) {
  const { updateQty, deleteItem, clearCart, loadingId, closeCart } = useCart();

  const navigate = useNavigate();

  if (!cart) return <CartSkeleton />;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Items */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
        {cart.items.length === 0 ? (
          <p className="text-center text-gray-500 py-12">Your cart is empty</p>
        ) : (
          cart.items.map((item) => (
            <div
              key={item.productSizeId}
              className="flex gap-4 items-start  border-b pb-4 last:border-b-0 border-gray-200"
            >
              {/* Image */}
              <Link to={`/products/${item.slug}`} onClick={closeCart}>
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-20 h-20 object-cover rounded-md"
                />
              </Link>

              {/* Info */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium  leading-tight">
                      {item.productName}
                    </p>
                    <p className="text-sm text-neutral-500">Size {item.size}</p>
                  </div>

                  {/* Stock warning */}
                  {item.stockMessage && (
                    <p
                      className={`mt-1 text-xs font-medium ${
                        item.outOfStock
                          ? "text-red-600"
                          : item.exceedsStock
                            ? "text-orange-600"
                            : "text-yellow-600"
                      }`}
                    >
                      {item.stockMessage}
                    </p>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() => deleteItem(item)}
                    disabled={loadingId === item.productSizeId}
                    className="text-gray-400 hover:text-red-500 transition text-sm cursor-pointer"
                    aria-label="Remove item"
                  >
                    ✕
                  </button>
                </div>

                {/* Quantity + Price */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      disabled={
                        loadingId === item.productSizeId || item.quantity <= 1
                      }
                      onClick={() => updateQty(item, "subtract")}
                      className="w-7 h-7 border border-gray-200 rounded flex items-center cursor-pointer justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      −
                    </button>

                    <span className="w-6 text-center text-sm">
                      {item.quantity}
                    </span>

                    <button
                      disabled={
                        loadingId === item.productSizeId ||
                        item.outOfStock ||
                        (item.availableStock != null &&
                          item.quantity >= item.availableStock)
                      }
                      onClick={() => updateQty(item, "add")}
                      className="w-7 h-7 border border-gray-200 rounded flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>

                  <p className="font-semibold text-sm">
                    R {item.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
              {loadingId === item.productSizeId && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-gray-200 p-4 flex justify-between items-center bg-white space-x-3">
        {/* Total */}
        <div className="flex flex-col">
          <span className="font-semibold">Total</span>
          <span className="text-sm">R {cart.totalPrice.toFixed(2)}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 w-full max-w-[250px] ml-auto">
          {/* Clear Cart */}
          <button
            onClick={clearCart}
            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition px-3 py-2 border border-red-600 rounded hover:bg-red-50 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear
          </button>

          {/* Checkout */}
          <button
            disabled={cart.hasLowStockItems}
            onClick={() => {
              if (cart.hasLowStockItems) return;
              closeCart();
              navigate("/checkout/shipping");
            }}
            className="
    flex-1 py-3 px-6 rounded-lg text-sm transition cursor-pointer 
    bg-black text-white hover:bg-gray-800 transition
    disabled:bg-gray-400 disabled:cursor-not-allowed
  "
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
