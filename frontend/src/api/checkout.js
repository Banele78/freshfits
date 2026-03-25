import api from "../api";

export const checkOut = async (info) => {
  try {
    const response = await api.post("/checkout", info);
    return response.data; // ✅ Created order
  } catch (error) {
    console.error("Error checking out", error.response?.data || error.message);
    throw error;
  }
};
