import { useEffect, useState } from "react";
import { getAddresses, deleteAddress } from "../../api/address";
import { Edit, Trash, Plus } from "lucide-react";
import AddressModal from "./AddressModal";
import toast from "react-hot-toast";
import { useAddress } from "../../context/AddressContext";

export default function ShippingForm() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const {
    addresses,
    setAddresses,
    selectedAddressId,
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
    await fetchAddresses();
    setSelectedAddressId(newAddress.id);
  };

  return (
    <section className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 space-y-4 shadow-md relative">
      {/* Loader */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-lg">
          <div className="w-6 h-6 border border-neutral-300 border-t-black rounded-full animate-spin" />
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-light tracking-wide">
          Shipping Address
        </h2>
      </div>

      {/* No addresses message */}
      {!loading && addresses.length === 0 && (
        <p className="text-sm text-neutral-400">You have no saved addresses.</p>
      )}

      {/* Address list */}
      <div className="space-y-3">
        {addresses.map((a) => (
          <label
            key={a.id}
            className={`flex items-start gap-3 p-3 sm:p-4 border rounded cursor-pointer transition-shadow hover:shadow-lg ${
              selectedAddressId === a.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            {/* Radio aligned to first line of content */}
            <input
              type="radio"
              name="shippingAddress"
              checked={selectedAddressId === a.id}
              onChange={() => handleSelectAddress(a.id)}
              className="mt-1 accent-blue-500 flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
              {/* Name row: name left, actions right — always horizontal */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="font-medium text-sm sm:text-base leading-snug break-words">
                  {a.name} {a.surname}{" "}
                  <span className="text-neutral-400 font-normal">
                    ({a.addressType})
                  </span>
                </p>

                {/* Actions always in a row */}
                <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                  {a.isDefault && (
                    <span className="hidden sm:inline text-xs text-neutral-400 uppercase tracking-widest mr-1">
                      Default
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setEditingAddress(a);
                      setModalOpen(true);
                    }}
                    className="p-1.5 rounded hover:bg-gray-100 transition cursor-pointer touch-manipulation"
                    aria-label="Edit address"
                  >
                    <Edit size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(a);
                    }}
                    className="p-1.5 rounded hover:bg-gray-100 transition cursor-pointer touch-manipulation"
                    aria-label="Delete address"
                  >
                    <Trash size={15} />
                  </button>
                </div>
              </div>

              {/* Default badge on mobile only */}
              {a.isDefault && (
                <span className="sm:hidden inline-block mb-1 text-xs text-neutral-400 uppercase tracking-widest">
                  Default
                </span>
              )}

              {/* Address details */}
              <div className="text-xs sm:text-sm text-gray-500 space-y-0.5">
                <p className="break-words">
                  {a.addressLine1}
                  {a.addressLine2 ? `, ${a.addressLine2}` : ""}
                </p>
                <p>
                  {a.city}, {a.province}, {a.country} {a.postalCode}
                </p>
                <p>{a.phoneNo}</p>
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* Add Address Button */}
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium uppercase tracking-wide text-gray-700 hover:bg-black hover:text-white cursor-pointer transition touch-manipulation"
        >
          <Plus size={16} />
          <span>Add address</span>
        </button>
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
    </section>
  );
}
