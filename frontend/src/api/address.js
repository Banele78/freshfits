import api from "../api";

export const getAddresses = async () => {
  try {
    const response = await api.get(`/addresses`);
    return response.data; // ✅ parsed JSON
  } catch (error) {
    console.error(
      "Error fetching addresses",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const addAddress = async (address) => {
  try {
    const response = await api.post("/addresses/create", address);
    return response.data; // ✅ Created address
  } catch (error) {
    console.error(
      "Error adding address",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const deleteAddress = async (addressId) => {
  try {
    const response = await api.delete(`/addresses/delete/${addressId}`);
    return response.data; // ✅ parsed JSON
  } catch (error) {
    console.error(
      "Error deleting address:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const updateAddress = async (addressId, addressData) => {
  try {
    const response = await api.put(
      `/addresses/update/${addressId}`,
      addressData,
    );
    return response.data; // ✅ parsed JSON of updated address
  } catch (error) {
    console.error(
      "Error updating address:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
