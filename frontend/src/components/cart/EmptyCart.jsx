import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Button from "../ui/Button";

export default function EmptyCart() {
  const navigate = useNavigate();
  const { closeCart } = useCart();

  const startShopping = () => {
    closeCart();
    navigate("/products"); // adjust if needed
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center flex-1 px-6 text-center"
    >
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <ShoppingBag className="w-8 h-8 text-gray-500" />
      </div>

      {/* Text */}
      <h3 className="text-lg font-semibold  text-gray-800">
        Your cart is empty
      </h3>

      <p className="text-sm text-gray-500 mt-1 mb-6 tracking-wide ">
        Looks like you haven’t added anything yet.
      </p>

      {/* CTA */}
      <Button onClick={startShopping} size="md">
        Start shopping
      </Button>
    </motion.div>
  );
}
