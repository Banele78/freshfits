import { Navigate, useNavigate } from "react-router-dom";
import ShippingForm from "../components/Checkout/ShippingForm";
import DeliveryMethod from "../components/Checkout/DeliveryMethod";
import OrderSummary from "../components/Checkout/OrderSummary";
import { useCart } from "../context/CartContext";
import FreshFitsLoader from "../components/FreshFitsLoader";

export default function Checkout() {
  const { cart, loadingCart } = useCart();
  const navigate = useNavigate();

  const handleProceed = () => {
    navigate("/checkout/payment");
  };

  return (
    <div className="">
      {loadingCart ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-20">
          <FreshFitsLoader size={100} />
        </div>
      ) : !cart || cart.items.length === 0 ? (
        <Navigate to="/" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <ShippingForm />
            <DeliveryMethod />
          </div>

          {/* RIGHT */}
          <OrderSummary
            actionLabel="Continue to Payment"
            onAction={handleProceed}
          />
        </div>
      )}
    </div>
  );
}
