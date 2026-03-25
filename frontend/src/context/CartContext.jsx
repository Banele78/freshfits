import { createContext, useContext, useEffect, useState } from "react";
import { modifyCart, clearCartItems, getCartItems } from "../api/cart";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
// adjust path if needed

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState(null);
  const [loadingCart, setLoadingCart] = useState(true);

  const [loadingId, setLoadingId] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      getCartItems()
        .then((fetchedCart) => setCart(fetchedCart))
        .catch((err) => console.error(err))
        .finally(() => setLoadingCart(false));
    }
  }, [isAuthenticated]);

  const updateQty = async (item, action) => {
    const previousCart = structuredClone(cart);
    setLoadingId(item.productSizeId);
    let quantity = 1;

    if (item.quantity > item.availableStock) {
      quantity = item.quantity - item.availableStock;
    }

    setCart((prev) => {
      if (!prev || !Array.isArray(prev.items)) return prev;

      const items = prev.items
        .map((i) => {
          if (i.productSizeId !== item.productSizeId) return i;

          // Calculate new quantity
          let newQty = action === "add" ? i.quantity + 1 : i.quantity - 1;

          // Prevent going below 1 or above available stock
          newQty = Math.max(0, Math.min(newQty, item.availableStock));

          const lowStock = item.availableStock <= 5;

          return {
            ...i,
            quantity: newQty,
            totalPrice: i.unitPrice * newQty,
            // Low stock if quantity is at max stock
            exceedsStock: newQty > item.availableStock,
            // Optional: outOfStock flag if zero stock
            outOfStock: item.availableStock === 0,
            stockMessage: lowStock
              ? "Only " + item.availableStock + " left in stock!"
              : null,
          };
        })
        .filter((i) => i.quantity > 0);

      // Recalculate cart totals
      const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
      const totalPrice = items.reduce((sum, i) => sum + i.totalPrice, 0);

      // If any item has low stock, flag the cart
      const cartHasLowStock = items.some((i) => i.exceedsStock);

      return {
        ...prev,
        items,
        totalItems,
        totalPrice,
        hasLowStockItems: cartHasLowStock,
      };
    });

    try {
      const updatedCart = await modifyCart(
        action,
        item.productSizeId,
        quantity,
      );

      setCart((prev) => ({
        ...prev,
        ...updatedCart,
        items: updatedCart?.items ?? prev?.items ?? [],
      }));

      toast.success("Cart updated successfully");
    } catch (error) {
      // Rollback on failure
      setCart(previousCart);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setLoadingId(null);
    }
  };

  const deleteItem = async (item) => {
    const previousCart = structuredClone(cart);
    setLoadingId(item.productSizeId);

    // ✅ Optimistic remove + recompute totals
    setCart((prev) => {
      const items = prev.items.filter(
        (i) => i.productSizeId !== item.productSizeId,
      );

      const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
      const totalPrice = items.reduce((sum, i) => sum + i.totalPrice, 0);
      const hasLowStockItems = false;

      return {
        ...prev,
        items,
        totalItems,
        totalPrice,
        hasLowStockItems,
      };
    });

    try {
      const updatedCart = await modifyCart(
        "delete",
        item.productSizeId,
        item.quantity,
      );

      // Backend wins (authoritative)
      setCart((prev) => ({
        ...prev,
        ...updatedCart,
        items: updatedCart?.items ?? prev?.items ?? [],
      }));
      toast.success(updatedCart);
    } catch (error) {
      setCart(previousCart);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setLoadingId(null);
    }
  };

  const addToCart = async (product, selectedSizeObj, quantity) => {
    const previousCart = structuredClone(cart);
    setLoadingId(selectedSizeObj.id);

    setCart((prev) => {
      const prevItems = prev?.items ?? [];

      const existingItem = prevItems.find(
        (i) => i.productSizeId === selectedSizeObj.id,
      );

      let items;

      if (existingItem) {
        items = prevItems.map((i) => {
          if (i.productSizeId !== selectedSizeObj.id) return i;

          // 🔒 Prevent exceeding stock
          const newQuantity = Math.min(
            i.quantity + quantity,
            selectedSizeObj.stockQuantity,
          );

          return {
            ...i,
            quantity: newQuantity,
            totalPrice: newQuantity * i.unitPrice,
          };
        });
      } else {
        const lowStock = selectedSizeObj.stockQuantity <= 5;
        items = [
          {
            productSizeId: selectedSizeObj.id,
            productName: product.name,
            imageUrl: product.imageUrls[0],
            size: selectedSizeObj.size,
            unitPrice: product.price,
            quantity,
            slug: product.slug,
            availableStock: selectedSizeObj.stockQuantity,
            totalPrice: product.price * quantity, // ✅ FIXED
            outOfStock: selectedSizeObj.stockQuantity === 0,
            stockMessage: lowStock
              ? "Only " + selectedSizeObj.stockQuantity + " left in stock!"
              : null,
          },
          ...prevItems,
        ];
      }

      const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
      const totalPrice = items.reduce((sum, i) => sum + i.totalPrice, 0);

      return {
        ...prev,
        items,
        totalItems,
        totalPrice,
      };
    });

    try {
      const updatedCart = await modifyCart("add", selectedSizeObj.id, quantity);

      setCart((prev) => ({
        ...prev,
        ...updatedCart,
        items: updatedCart?.items ?? prev?.items ?? [],
      }));
      toast.success(updatedCart);
    } catch (error) {
      setCart(previousCart);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setLoadingId(null);
    }
  };

  const clearCart = async () => {
    if (!cart) return;

    const previousCart = structuredClone(cart);
    setLoadingId("clear"); // optional: special loading ID for clearing whole cart

    // Optimistic: immediately empty the cart
    setCart({
      ...cart,
      items: [],
      totalItems: 0,
      totalPrice: 0,
    });

    try {
      // Call backend to clear cart
      const updatedCart = await clearCartItems();

      // backend should return empty cart object
      setCart({
        ...cart,
        ...updatedCart,
        items: updatedCart?.items ?? [],
        totalItems: updatedCart?.totalItems ?? 0,
        totalPrice: updatedCart?.totalPrice ?? 0,
      });

      toast.success("Cart cleared!");
    } catch (error) {
      // Rollback
      setCart(previousCart);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to clear cart",
      );
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <CartContext.Provider
      value={{
        isCartOpen: isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        cart,
        setCart,
        updateQty,
        deleteItem,
        addToCart,
        clearCart,
        loadingId,
        setLoadingId,
        loadingCart,
        setLoadingCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
