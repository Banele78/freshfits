import { useLocation } from "react-router-dom";

export default function useCheckoutStep() {
  const location = useLocation();

  if (location.pathname.includes("/cart")) return "cart";
  if (location.pathname.includes("/checkout/shipping")) return "shipping";
  if (location.pathname.includes("/checkout/payment")) return "payment";

  return "cart";
}
