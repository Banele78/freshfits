// src/data/products.js
import api from "../api";

export const getCartItems = async () => {
  try {
    const response = await api.get(`/cart/view`);
    return response.data; // ✅ parsed JSON
  } catch (error) {
    console.error(
      "Error fetching  cart",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// api/cart.js
// api/cart.js
export const modifyCart = async (action, productSizeId, quantity = 1) => {
  try {
    const response = await api.post("/cart/modify", {
      action,
      productSizeId,
      quantity,
    });

    return response.data; // ✅ updated cart from backend
  } catch (error) {
    console.error(
      "Error modifying cart:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const clearCartItems = async () => {
  try {
    const response = await api.delete(`/cart/clear`);
    return response.data; // ✅ parsed JSON
  } catch (error) {
    console.error(
      "Error clearing cart:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
