// src/data/products.js
import api from "../api";

// Get filtered products
export const getFilteredProducts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    params.categories?.forEach((c) => queryParams.append("category", c));
    params.brands?.forEach((b) => queryParams.append("brand", b));
    params.departments?.forEach((d) => queryParams.append("department", d));

    if (Number.isFinite(params.minPrice)) {
      queryParams.set("minPrice", params.minPrice);
    } else {
      queryParams.delete("minPrice");
    }

    if (Number.isFinite(params.maxPrice)) {
      queryParams.set("maxPrice", params.maxPrice);
    } else {
      queryParams.delete("maxPrice");
    }

    if (params.sort) queryParams.set("sort", params.sort);
    if (typeof params.searchQuery === "string" && params.searchQuery.trim()) {
      queryParams.set("q", params.searchQuery.trim());
    }
    if (params.page !== undefined) queryParams.set("page", params.page);
    if (params.limit !== undefined) queryParams.set("limit", params.limit);
    if (params.includeFilters !== undefined)
      queryParams.set("includeFilters", params.includeFilters);

    const response = await api.get(
      `/products/filter?${queryParams.toString()}`,
    );
    return response.data; // ✅ axios already parses JSON
  } catch (error) {
    console.error(
      "Error fetching filtered products:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Get filter options
export const getFilterOptions = async (searchQuery) => {
  try {
    const params = searchQuery ? { q: searchQuery } : {};

    const response = await api.get("/products/filters", { params });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching filter options:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Get product by slug
export const getProductBySlug = async (slug) => {
  try {
    const params = slug ? { slug: slug } : {};
    const response = await api.get(`/products`, { params });
    return response.data; // ✅ parsed JSON
  } catch (error) {
    console.error(
      "Error fetching  product by slug:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getReviewByProduct = async (id) => {
  try {
    const response = await api.get(`/reviews/product/${id}`);
    return response.data; // ✅ parsed JSON
  } catch (error) {
    console.error(
      "Error fetching reviews:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const createReview = async ({ productId, rating, comment }) => {
  try {
    const response = await api.post("/reviews/create", {
      productId,
      rating,
      comment,
    });
    console.log("sent");

    return response.data;
  } catch (error) {
    console.error(
      "Error creating review:",
      error.response?.data || error.message,
    );
    throw error; // important so UI can react
  }
};
