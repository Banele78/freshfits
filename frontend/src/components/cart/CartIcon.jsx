// src/components/cart/CartIcon.jsx
import { ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function CartIcon({ sizeClass = "h-5 w-5" }) {
  const { cart, openCart } = useCart();
  const [pulse, setPulse] = useState(false);

  // Trigger pulse whenever totalItems increases
  useEffect(() => {
    if (cart?.totalItems > 0) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 200); // pulse duration
      return () => clearTimeout(timer);
    }
  }, [cart?.totalItems]);

  return (
    <button
      onClick={openCart}
      aria-label="Open cart"
      className="relative p-1 hover:text-gray-600 transition-colors cursor-pointer"
    >
      <ShoppingBag className={sizeClass} />

      <AnimatePresence>
        {cart?.totalItems > 0 && (
          <motion.span
            key={cart.totalItems}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: pulse ? 1.4 : 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 25,
            }}
            className="absolute -top-2 -right-2 bg-black text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-semibold"
          >
            {cart.totalItems}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
