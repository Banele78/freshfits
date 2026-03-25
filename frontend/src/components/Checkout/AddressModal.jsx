import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addAddress, updateAddress } from "../../api/address";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Button from "../ui/Button";

/* ---------------- Validation Schema ---------------- */
const AddressSchema = Yup.object({
  name: Yup.string().max(250).required("Name is required"),
  surname: Yup.string().max(250).required("Surname is required"),
  companyName: Yup.string().max(255),
  addressLine1: Yup.string().max(255).required("Address line 1 is required"),
  addressLine2: Yup.string().max(255),
  country: Yup.string().max(100).required("Country is required"),
  city: Yup.string().max(100).required("City is required"),
  province: Yup.string().max(100).required("Province is required"),
  postalCode: Yup.string().max(20).required("Postal code is required"),
  phoneNo: Yup.string()
    .required("Phone number is required")
    .matches(
      /^(\+?\d{1,3}[- ]?)?\d{6,15}$/,
      "Invalid phone number. Include country code if needed",
    ),

  addressType: Yup.string()
    .oneOf(["HOME", "WORK"])
    .required("Address type is required"),
  isDefault: Yup.boolean(),
});

/* ---------------- Reusable Form Inputs ---------------- */
const Input = ({ label, name }) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <Field
      name={name}
      className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 "
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-xs text-red-500"
    />
  </div>
);

const Select = ({ label, name, children }) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <Field
      as="select"
      name={name}
      className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 "
    >
      {children}
    </Field>
    <ErrorMessage
      name={name}
      component="div"
      className="text-xs text-red-500"
    />
  </div>
);

const Checkbox = ({ label, name }) => (
  <label className="flex items-center gap-2 text-sm text-gray-700">
    <Field
      type="checkbox"
      name={name}
      className="h-4 w-4 rounded border-gray-300 "
    />
    {label}
  </label>
);

/* ---------------- Address Modal Component ---------------- */
export default function AddressModal({ isOpen, onClose, onSuccess, address }) {
  const isEdit = Boolean(address);

  // Disable background scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  const initialValues = {
    name: address?.name || "",
    surname: address?.surname || "",
    companyName: address?.companyName || "",
    addressLine1: address?.addressLine1 || "",
    addressLine2: address?.addressLine2 || "",
    country: address?.country || "",
    city: address?.city || "",
    province: address?.province || "",
    postalCode: address?.postalCode || "",
    phoneNo: address?.phoneNo || "",
    addressType: address?.addressType || "HOME",
    isDefault: address?.isDefault || false,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = isEdit
        ? await updateAddress(address.id, values)
        : await addAddress(values);

      onSuccess?.(result);
      onClose?.();
      toast.success(`Address ${isEdit ? "updated" : "added"} successfully!`);
    } catch (error) {
      console.error("Failed to save address:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="flex max-h-[90vh] w-full max-w-xl flex-col  rounded-sm bg-white shadow-2xl"
          >
            {/* ---------- Header ---------- */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-800">
                {isEdit ? "Edit Address" : "Add New Address"}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* ---------- Form ---------- */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <Formik
                initialValues={initialValues}
                enableReinitialize
                validationSchema={AddressSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                      {/* ---------- Personal Details Card ---------- */}
                      <section className=" rounded-sm p-4 shadow-sm space-y-4">
                        <h3 className="text-sm font-semibold text-gray-800">
                          Personal Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input label="First Name" name="name" />
                          <Input label="Last Name" name="surname" />
                        </div>
                        <Input
                          label="Company Name (optional)"
                          name="companyName"
                        />
                      </section>

                      {/* ---------- Address Card ---------- */}
                      <section className=" rounded-sm p-4 shadow-sm space-y-4">
                        <h3 className="text-sm font-semibold text-gray-800">
                          Address
                        </h3>
                        <Input label="Address Line 1" name="addressLine1" />
                        <Input
                          label="Address Line 2 (optional)"
                          name="addressLine2"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input label="City" name="city" />
                          <Input label="Province" name="province" />
                          <Input label="Country" name="country" />
                          <Input label="Postal Code" name="postalCode" />
                        </div>
                      </section>

                      {/* ---------- Address Settings Card ---------- */}
                      <section className=" rounded-sm p-4 shadow-sm space-y-4">
                        <Select label="Address Type" name="addressType">
                          <option value="HOME">Home</option>
                          <option value="WORK">Work</option>
                        </Select>
                        <Checkbox
                          label="Set as default address"
                          name="isDefault"
                        />
                      </section>

                      {/* ---------- Contact Card ---------- */}
                      <section className="rounded-sm p-4 shadow-sm space-y-4">
                        <h3 className="text-sm font-semibold text-gray-800">
                          Contact
                        </h3>
                        <Input label="Phone Number" name="phoneNo" />
                      </section>
                    </div>

                    {/* ---------- Footer ---------- */}
                    <div className="flex-shrink-0 border-t border-gray-200 px-6 py-4 flex gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-sm border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <Button
                        type="submit"
                        loading={isSubmitting}
                        loadingText="Saving..."
                        size="sm"
                        className="flex-1"
                      >
                        {isEdit ? "Update Address" : "Save Address"}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
