import { useAddress } from "../../context/AddressContext";
import { useCart } from "../../context/CartContext";
import Button from "../ui/Button";
export default function OrderSummary({
  actionLabel = "Continue",
  onAction,
  loading = false,
}) {
  const { cart } = useCart();
  const { deliveryMethod, selectedAddressId } = useAddress();
  const DELIVERY_FEE = deliveryMethod?.price || 0;
  const TOTAL = cart.totalPrice + DELIVERY_FEE;
  return (
    <aside className="bg-card border border-border rounded-lg p-4 sm:p-6 h-fit sm:sticky sm:top-6 shadow-md">
      <h2 className="text-lg sm:text-xl font-light tracking-wide mb-4 sm:mb-6 text-card-foreground">
        Order Summary
      </h2>
      {/* Items */}
      <div className="space-y-3 sm:space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.productSizeId}
            className="flex items-center justify-between gap-2 sm:gap-3"
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded flex-shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="font-medium text-sm sm:text-base text-foreground truncate">
                  {item.productName}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Qty: {item.quantity}
                </p>
              </div>
            </div>
            <div className="flex items-baseline gap-0.5 font-medium text-sm sm:text-base text-foreground flex-shrink-0">
              <span>R</span>
              <span>{item.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Summary */}
      <div className="border-t border-border mt-4 sm:mt-6 pt-3 sm:pt-4 space-y-2 sm:space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">
            R {cart.totalPrice.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery</span>
          <span
            className={`font-medium ${DELIVERY_FEE === 0 ? "text-step-completed" : "text-foreground"}`}
          >
            {DELIVERY_FEE === 0 ? "FREE" : `R ${DELIVERY_FEE.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between font-semibold text-base sm:text-lg mt-1 sm:mt-2 text-foreground">
          <span>Total</span>
          <span>R {TOTAL.toFixed(2)}</span>
        </div>
      </div>
      <Button
        onClick={onAction}
        loading={loading}
        disabled={!selectedAddressId || !deliveryMethod}
        fullWidth
        size="md"
        loadingText="Processing..."
        className="mt-4 sm:mt-6"
      >
        {actionLabel}
      </Button>
    </aside>
  );
}
