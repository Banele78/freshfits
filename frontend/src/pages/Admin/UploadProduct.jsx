import React, { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../../api";
import ImageUploader from "./ImageUploader";

const UploadProduct = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [fitTypes, setFitTypes] = useState([]);
  const [sizes, setSizes] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true); // <-- loading spinner state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // start spinner
        const [catRes, brandRes, deptRes, sizesRes, fitTypesRes] =
          await Promise.all([
            api.get("/categories/all"),
            api.get("/brands/all"),
            api.get("/departments/all"),
            api.get("/sizes/grouped"),
            api.get("/fit-types/all"),
          ]);
        setCategories(catRes.data);
        setBrands(brandRes.data);
        setDepartments(deptRes.data);
        setSizes(sizesRes.data);
        setFitTypes(fitTypesRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // stop spinner
      }
    };
    fetchData();
  }, []);

  const initialValues = {
    name: "",
    description: "",
    price: "",
    categoryId: "",
    brandId: "",
    departmentId: "",
    fitTypeId: "",
    sizeGroup: "",
    sizes: [{ sizeId: "", stockQuantity: "" }],
    files: [],
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Product name is required")
      .max(250, "Product name cannot exceed 250 characters"),
    description: Yup.string()
      .required("Product description is required")
      .max(500, "Description cannot exceed 500 characters"),
    price: Yup.number()
      .typeError("Price must be a number")
      .positive("Price must be greater than 0")
      .required("Price is required"),
    categoryId: Yup.string().required("Select a category"),
    brandId: Yup.string().required("Select a brand"),
    departmentId: Yup.string().required("Select a department"),
    fitTypeId: Yup.string().required("Select a fit type"),
    sizeGroup: Yup.string().required("Select a size group"),
    sizes: Yup.array()
      .of(
        Yup.object().shape({
          sizeId: Yup.string().required("Select a size"),
          stockQuantity: Yup.number()
            .typeError("Stock must be a number")
            .positive("Stock must be greater than 0")
            .required("Stock quantity is required"),
        }),
      )
      .min(1, "Add at least one size"),
    files: Yup.array()
      .min(1, "Upload at least one product image")
      .required("Upload at least one product image"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // Remove sizeGroup from payload
    const { sizeGroup, ...rest } = values;

    const cleanedProduct = {
      ...rest,
      files: undefined,
      price: Number(values.price),
      sizes: values.sizes.map((s) => ({
        sizeId: Number(s.sizeId),
        stockQuantity: Number(s.stockQuantity),
      })),
    };

    const formData = new FormData();
    formData.append("product", JSON.stringify(cleanedProduct));

    for (let i = 0; i < values.files.length; i++) {
      formData.append("files", values.files[i].file);
    }

    try {
      const response = await api.post("/products/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Product uploaded successfully!");
      resetForm();
      console.log(response.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setMessage("Failed to upload product.");
    }
    setSubmitting(false);
  };

  if (loading) {
    // show spinner while fetching form data
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-black border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-8 text-center">Upload Product</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange
        validateOnBlur
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="">
            {/* --- Product Info --- */}
            <div className="space-y-4 p-4 rounded-lg ">
              <h3 className="text-lg font-semibold mb-2">
                Product Information
              </h3>
              <div className="flex flex-col">
                <Field
                  name="name"
                  placeholder="Product Name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Product Description"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                />
                <ErrorMessage
                  name="description"
                  component="p"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
            </div>

            {/* --- Pricing & Stock --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg ">
              {/* Price */}
              <div className="flex flex-col">
                <Field
                  type="number"
                  name="price"
                  placeholder="Price"
                  step="0.01"
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                />
                <ErrorMessage
                  name="price"
                  component="p"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col">
                <Field
                  as="select"
                  name="categoryId"
                  className="p-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="categoryId"
                  component="p"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              {/* Brand */}
              <div className="flex flex-col">
                <Field
                  as="select"
                  name="brandId"
                  className="p-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Brand</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="brandId"
                  component="p"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              {/* Department */}
              <div className="flex flex-col">
                <Field
                  as="select"
                  name="departmentId"
                  className="p-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="departmentId"
                  component="p"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              {/* Fit Type */}
              <div className="flex flex-col">
                <Field
                  as="select"
                  name="fitTypeId"
                  className="p-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Fit Type</option>
                  {fitTypes.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="fitTypeId"
                  component="p"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
            </div>

            {/* --- Sizes --- */}
            <div className="space-y-6 p-6  rounded-xl border border-gray-200">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-gray-800">
                  Sizes & Stock Management
                </h3>
                <p className="text-sm text-gray-600">
                  Select a size group and add sizes with stock quantities
                </p>
              </div>

              {/* Size Group Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Size Group *
                </label>
                <Field
                  as="select"
                  name="sizeGroup"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  onChange={(e) => {
                    setFieldValue("sizeGroup", e.target.value);
                    setFieldValue("sizes", [{ sizeId: "", stockQuantity: "" }]);
                  }}
                >
                  <option value="">Select a size group</option>
                  {Object.keys(sizes).map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="sizeGroup"
                  component="p"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              {/* Sizes Array */}
              <FieldArray name="sizes">
                {({ push, remove }) => (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Size Details *
                      </label>
                      <span className="text-xs text-gray-500">
                        {values.sizes.length} size(s) added
                      </span>
                    </div>

                    {/* Size Items */}
                    <div className="space-y-3">
                      {values.sizes.map((size, index) => (
                        <div
                          key={index}
                          className="flex flex-col md:flex-row gap-3 p-4 bg-white rounded-lg border border-gray-200"
                        >
                          {/* Size Selection */}
                          <div className="flex-1 space-y-1">
                            <label className="block text-xs font-medium text-gray-600">
                              Size {index + 1}
                            </label>
                            <Field
                              as="select"
                              name={`sizes[${index}].sizeId`}
                              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                !values.sizeGroup
                                  ? "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                                  : "border-gray-300 focus:border-blue-500"
                              }`}
                              disabled={!values.sizeGroup}
                            >
                              <option value="">Select size</option>
                              {values.sizeGroup &&
                                sizes[values.sizeGroup]?.map((s) => (
                                  <option
                                    key={s.id}
                                    value={s.id}
                                    disabled={values.sizes.some(
                                      (item, idx) =>
                                        idx !== index &&
                                        item.sizeId === s.id.toString(),
                                    )}
                                  >
                                    {s.name}
                                  </option>
                                ))}
                            </Field>
                            <ErrorMessage
                              name={`sizes[${index}].sizeId`}
                              component="p"
                              className="text-red-600 text-sm"
                            />
                          </div>

                          {/* Stock Quantity */}
                          <div className="flex-1 space-y-1">
                            <label className="block text-xs font-medium text-gray-600">
                              Stock Quantity
                            </label>
                            <div className="relative">
                              <Field
                                type="number"
                                name={`sizes[${index}].stockQuantity`}
                                placeholder="e.g., 50"
                                min="0"
                                step="1"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                units
                              </div>
                            </div>
                            <ErrorMessage
                              name={`sizes[${index}].stockQuantity`}
                              component="p"
                              className="text-red-600 text-sm"
                            />
                          </div>

                          {/* Remove Button */}
                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 active:bg-red-200 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-50"
                              disabled={values.sizes.length <= 1}
                              title={
                                values.sizes.length <= 1
                                  ? "At least one size is required"
                                  : "Remove this size"
                              }
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Size Button */}
                    <button
                      type="button"
                      onClick={() => push({ sizeId: "", stockQuantity: "" })}
                      className={`w-full py-3 rounded-lg transition font-medium flex items-center justify-center gap-2 ${
                        !values.sizeGroup
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-200"
                      }`}
                      disabled={!values.sizeGroup}
                      title={
                        !values.sizeGroup
                          ? "Select a size group first"
                          : "Add another size"
                      }
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add Another Size
                    </button>

                    {/* Helper Text */}
                    <p className="text-xs text-gray-500">
                      {values.sizeGroup && sizes[values.sizeGroup]?.length ? (
                        <>
                          Available sizes in{" "}
                          <span className="font-medium">
                            {values.sizeGroup}
                          </span>
                          :{" "}
                          {sizes[values.sizeGroup]
                            .map((s) => s.name)
                            .join(", ")}
                        </>
                      ) : (
                        "Select a size group to see available sizes"
                      )}
                    </p>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* --- File Upload --- */}
            {/* --- File Upload --- */}
            <div className="space-y-2 p-4 rounded-lg">
              <ImageUploader
                images={values.files}
                onChange={(images) => setFieldValue("files", images)}
                maxImages={10}
              />

              <ErrorMessage
                name="files"
                component="p"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition text-lg font-medium flex justify-center items-center gap-2"
            >
              {isSubmitting && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isSubmitting ? "Uploading..." : "Upload Product"}
            </button>
          </Form>
        )}
      </Formik>

      {message && (
        <p
          className={`mt-4 text-center font-medium ${
            message.includes("success") ? "text-green-600" : "text-red-600"
          } transition`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default UploadProduct;
