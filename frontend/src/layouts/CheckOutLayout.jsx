import { Outlet } from "react-router-dom";
import CheckoutProgress from "../components/Checkout/CheckoutProgress";

export default function CheckoutLayout() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <CheckoutProgress />
      <div>
        <Outlet />
      </div>
    </div>
  );
}
