import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import CartItems from "./CartItems";
import EmptyCart from "./EmptyCart";
import CartNotLoggedIn from "./CartNotLoggedIn";
import { useAuth } from "../../context/AuthContext";
import CartSkeleton from "./CartSkeleton";

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const drawer = {
  hidden: { x: "100%" },
  visible: { x: 0 },
};

export default function CartDrawer() {
  const { isCartOpen, closeCart, cart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && closeCart();
    if (isCartOpen) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isCartOpen, closeCart]);

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isCartOpen]);

  // Intercept back navigation
  useEffect(() => {
    if (!isCartOpen) return;

    // Push fake history entry
    window.history.pushState({ cartOpen: true }, "");

    const onPopState = (e) => {
      if (isCartOpen) {
        closeCart();
        // Re-add the fake history entry so back button still works next time
        window.history.pushState({ cartOpen: true }, "");
      }
    };

    window.addEventListener("popstate", onPopState);

    return () => window.removeEventListener("popstate", onPopState);
  }, [isCartOpen, closeCart]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-xl flex flex-col"
            variants={drawer}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: "tween", duration: 0.3 }}
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-neutral-200 flex justify-between items-center">
              <h2 className="text-xl font-light tracking-wide">
                Bag ({cart?.totalItems || 0})
              </h2>

              <button
                onClick={closeCart}
                className="text-neutral-400 hover:text-black transition text-lg"
              >
                ×
              </button>
            </div>

            {!isAuthenticated ? (
              <CartNotLoggedIn onClose={closeCart} />
            ) : !cart ? (
              <CartSkeleton />
            ) : cart.items.length === 0 ? (
              <EmptyCart />
            ) : (
              <CartItems cart={cart} />
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
