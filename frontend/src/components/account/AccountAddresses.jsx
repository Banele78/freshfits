import { useEffect, useState } from "react";
import { useAddress } from "../../context/AddressContext";
import AddressModal from "../Checkout/AddressModal";

export default function AccountAddresses() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const {
    addresses,
    selectedAddressId,
    setAddresses,
    setSelectedAddressId,
    fetchAddresses,
    loading,
    handleDelete,
  } = useAddress();

  useEffect(() => {
    if (addresses.length > 0) return;
    fetchAddresses();
  }, []);

  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
  };

  const handleAddressCreated = async (newAddress) => {
    // Clone current addresses in case fetch fails
    const previousAddresses = structuredClone(addresses);
    try {
      // Temporarily clear addresses to show loader
      setAddresses([]);
      // Fetch updated addresses
      await fetchAddresses();
      // Select the new address
      setSelectedAddressId(newAddress.id);
    } catch (err) {
      // Restore previous addresses if fetch fails
      setAddresses(previousAddresses);
      console.error("Failed to refresh addresses:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg uppercase tracking-widest font-medium">
          Saved Addresses
        </h2>

        <button
          onClick={() => setModalOpen(true)}
          className="text-sm uppercase tracking-wide border border-black px-4 py-2 transition hover:bg-black hover:text-white"
        >
          Add Address
        </button>
      </div>

      {/* Loading */}
      {loading && addresses.length === 0 && (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border border-neutral-300 border-t-black rounded-full animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!loading && addresses.length === 0 && (
        <p className="text-sm text-neutral-400">You have no saved addresses.</p>
      )}

      {/* Address List */}
      <div className="divide-y divide-neutral-200">
        {addresses.map((a) => (
          <div key={a.id} className="py-6 flex justify-between items-start">
            {/* Address Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <p className="font-medium">
                  {a.name} {a.surname} ({a.addressType})
                </p>

                {a.isDefault && (
                  <span className="text-xs uppercase tracking-widest text-neutral-400">
                    Default
                  </span>
                )}
              </div>

              <p className="text-neutral-500">
                {a.addressLine1}
                {a.addressLine2 && `, ${a.addressLine2}`}
              </p>
              <p className="text-neutral-500">
                {a.city}, {a.province}
              </p>
              <p className="text-neutral-500">
                {a.country} {a.postalCode}
              </p>
              <p className="text-neutral-500">{a.phoneNo}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-6 text-sm uppercase tracking-wide">
              <button
                onClick={() => {
                  setEditingAddress(a);
                  setModalOpen(true);
                }}
                className="text-neutral-400 hover:text-black transition"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(a)}
                className="text-neutral-400 hover:text-black transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <AddressModal
        isOpen={modalOpen}
        address={editingAddress}
        onClose={() => {
          setModalOpen(false);
          setEditingAddress(null);
        }}
        onSuccess={handleAddressCreated}
      />
    </div>
  );
}
