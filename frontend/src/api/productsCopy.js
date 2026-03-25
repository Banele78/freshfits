// src/data/products.js (or create a new file for API calls)

const API_BASE_URL = "http://localhost:8080/api";

export const getFilteredProducts = async (params = {}) => {
  try {
    // Convert params object to query string
    const queryParams = new URLSearchParams();

    // Add all filter parameters
    if (params.categories?.length > 0) {
      params.categories.forEach((category) =>
        queryParams.append("category", category)
      );
    }

    if (params.brands?.length > 0) {
      params.brands.forEach((brand) => queryParams.append("brand", brand));
    }

    if (params.departments?.length > 0) {
      params.departments.forEach((dept) =>
        queryParams.append("department", dept)
      );
    }

    if (params.minPrice !== undefined) {
      queryParams.set("minPrice", params.minPrice);
    }

    if (params.maxPrice !== undefined) {
      queryParams.set("maxPrice", params.maxPrice);
    }

    if (params.sort) {
      queryParams.set("sort", params.sort);
    }

    if (params.searchQuery) {
      queryParams.set("q", params.searchQuery);
    }

    if (params.page !== undefined) {
      queryParams.set("page", params.page);
    }

    if (params.limit !== undefined) {
      queryParams.set("limit", params.limit);
    }

    const response = await fetch(
      `${API_BASE_URL}/products/filter?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    throw error;
  }
};

export const getFilterOptions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/filters`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching filter options:", error);
    throw error;
  }
};

export const getAllProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw error;
  }
};

// For backward compatibility
export const getProducts = getAllProducts;
