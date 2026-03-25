import { ShoppingCart } from "lucide-react";
import useRequireAuth from "../../hooks/useRequireAuth";
import Button from "../ui/Button";

export default function CartNotLoggedIn({ onClose = () => {} }) {
  const requireAuth = useRequireAuth();

  const goToAuth = (redirectTo) => {
    //onClose(); // close cart / drawer first

    requireAuth({
      redirectTo,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 text-center">
      <ShoppingCart className="w-12 h-12 text-gray-400 mb-4" />

      <h3 className="text-lg font-semibold mb-2">Sign in to view your cart</h3>

      <p className="text-sm text-gray-500 mb-6">
        You need to be logged in to add items and manage your cart.
      </p>

      <Button
        onClick={() => goToAuth("/login")}
        fullWidth
        variant="primary"
        size="md"
      >
        Login
      </Button>

      <button
        onClick={() => goToAuth("/register")}
        className="mt-3 text-sm text-gray-600 hover:underline cursor-pointer"
      >
        Create an account
      </button>
    </div>
  );
}
