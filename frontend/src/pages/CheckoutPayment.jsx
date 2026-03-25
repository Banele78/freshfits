import { useState } from "react";

import { useAddress } from "../context/AddressContext";

import PaymentMethod from "../components/Checkout/PaymentMethod";
import OrderSummary from "../components/Checkout/OrderSummary";
import { checkOut } from "../api/checkout";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { Navigate, useNavigate } from "react-router-dom";
import { getCartItems } from "../api/cart";
import FreshFitsLoader from "../components/FreshFitsLoader";

export default function CheckoutPayment() {
  const [loading, setLoading] = useState(false);
  const { deliveryMethod, selectedAddressId } = useAddress();
  const { setCart, openCart } = useCart();
  const navigate = useNavigate();
  const { cart, loadingCart } = useCart();

  const handlePay = async () => {
    setLoading(true);
    try {
      const payload = {
        addressId: selectedAddressId,
        deliveryMethod: deliveryMethod.id.toUpperCase(),
        deliveryFee: deliveryMethod.price,
      };

      const order = await checkOut(payload);

      sessionStorage.setItem("activeOrderId", order.orderId);
      window.location.href = order.paymentUrl;
    } catch (err) {
      setLoading(false);

      if (err.response.status === 409) {
        getCartItems().then(setCart);
        openCart();
        navigate("/");
      }

      toast.error(err.response.data.orderResponse.message);
    }
  };
  return (
    <div className="">
      {loadingCart ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-20">
          <Navigate to="/checkout/shipping" />
        </div>
      ) : !cart || cart.items.length === 0 ? (
        <Navigate to="/" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <PaymentMethod />
          </div>

          {/* RIGHT */}
          <OrderSummary
            actionLabel="Pay Now"
            loading={loading}
            onAction={handlePay}
          />
        </div>
      )}
    </div>
  );
}
