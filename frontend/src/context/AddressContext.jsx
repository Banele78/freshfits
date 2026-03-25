import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAddresses, deleteAddress } from "../api/address";

const AddressContext = createContext(null);

export function AddressProvider({ children }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await getAddresses();
      setAddresses(data);
      const defaultAddress = data.find((a) => a.isDefault);
      const selected = defaultAddress || data[0];

      if (selected) {
        setSelectedAddressId(selected.id);
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (address) => {
    const previousCart = structuredClone(addresses);
    try {
      setLoading(true);
      setAddresses([]);
      await deleteAddress(address.id);
      await fetchAddresses();
      toast.success("Address deleted successfully!");
    } catch (error) {
      setAddresses(previousCart);
      console.error("Error deleting address:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <AddressContext.Provider
      value={{
        addresses,
        setAddresses,
        selectedAddressId,
        setSelectedAddressId,
        fetchAddresses,
        loading,
        setLoading,
        handleDelete,
        deliveryMethod,
        setDeliveryMethod,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export const useAddress = () => useContext(AddressContext);
