import api from "../api";

export const getUserOrders = async (page = 0, size = 10) => {
  try {
    const response = await api.get(`/orders/by-user?page=${page}&size=${size}`);
    return response.data || [];
  } catch (error) {
    console.error(
      "Error fetching user orders:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getUserOrderByOrderNumber = async (orderNumber) => {
  try {
    const response = await api.get(`/orders/${orderNumber}`);
    return response.data || [];
  } catch (error) {
    console.error(
      "Error fetching user order:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
