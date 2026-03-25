// utils/filterUtils.js
export const encodeFilter = (text) => {
  if (!text || typeof text !== "string") return "";
  return encodeURIComponent(text.trim().toLowerCase().replace(/\s+/g, "-"));
};

export const decodeFilter = (slug, list = []) => {
  if (!slug || typeof slug !== "string") return "";
  try {
    const decoded = decodeURIComponent(slug).replace(/-/g, " ");
    const match = list.find((item) => encodeFilter(item) === slug);
    return match || decoded;
  } catch (error) {
    console.error("Error decoding filter:", error);
    return slug;
  }
};

export const validatePriceRange = (range, minLimit, maxLimit) => {
  const [min, max] = range;
  return [
    Math.max(Math.min(min, maxLimit), minLimit),
    Math.min(Math.max(max, minLimit), maxLimit),
  ];
};

export const getActiveFilterCount = ({
  categories = [],
  brands = [],
  departments = [],
  priceRange = [0, 2500],
  defaultMinPrice = 0,
  defaultMaxPrice = 2500,
}) => {
  return (
    categories.length +
    brands.length +
    departments.length +
    (priceRange[0] > defaultMinPrice || priceRange[1] < defaultMaxPrice ? 1 : 0)
  );
};

export const createFiltersHash = (filters, sortOrder) => {
  return JSON.stringify({
    categories: (filters?.categories || []).sort(),
    brands: (filters?.brands || []).sort(),
    departments: (filters?.departments || []).sort(),
    minPrice: filters?.minPrice || 0,
    maxPrice: filters?.maxPrice || 2500,
    sortOrder: sortOrder || "default",
  });
};
