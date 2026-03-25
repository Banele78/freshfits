// data/categories.js - Complete structure
export const categories = {
  men: {
    label: "Men",
    columns: [
      {
        title: "Clothing",
        items: [
          { name: "All Men's Clothing", slug: "/products?department=men" },
          {
            name: "Tops",
            slug: "/products?department=men&category=tops",
          },
          {
            name: "Accessories",
            slug: "/products?department=men&category=accessories",
          },
          {
            name: "Bottoms",
            slug: "/products?department=men&category=bottoms",
          },
          {
            name: "Hoodies",
            slug: "/products?department=men&category=hoodies",
          },
          {
            name: "Sweaters",
            slug: "/products?department=men&category=sweaters",
          },
        ],
      },
    ],
    // For backward compatibility in tablet view
    flatItems: [
      { name: "All Men's", slug: "/products" },
      { name: "Tops", slug: "/products?department=men&category=tops" },
      {
        name: "Accessories",
        slug: "/products?department=men&category=accessories",
      },
      { name: "Bottoms", slug: "/products?department=men&category=bottoms" },
      { name: "Hoodies", slug: "/products?department=men&category=hoodies" },
      {
        name: "Sweaters",
        slug: "/products?department=men&category=sweaters",
      },
    ],
  },
  women: {
    label: "Women",
    columns: [
      {
        title: "Clothing",
        items: [
          { name: "All Women's Clothing", slug: "/products?department=women" },
          {
            name: "Tops",
            slug: "/products?department=women&category=tops",
          },
          {
            name: "Accessories",
            slug: "/products?department=women&category=accessories",
          },
          {
            name: "Bottoms",
            slug: "/products?department=women&category=bottoms",
          },
          {
            name: "Hoodies",
            slug: "/products?department=women&category=hoodies",
          },
          {
            name: "Sweaters",
            slug: "/products?department=women&category=sweaters",
          },
        ],
      },
    ],
    // For backward compatibility in tablet view
    flatItems: [
      { name: "All Women's", slug: "/products?department=women" },
      { name: "Tops", slug: "/products?department=women&category=tops" },
      {
        name: "Accessories",
        slug: "/products?department=women&category=accessories",
      },
      { name: "Bottoms", slug: "/products?department=women&category=bottoms" },
      { name: "Hoodies", slug: "/products?department=women&category=hoodies" },
      {
        name: "Sweaters",
        slug: "/products?department=women&category=sweaters",
      },
    ],
  },
  kids: {
    label: "Kids",
    columns: [
      {
        items: [
          { name: "All Kids", slug: "/kids" },
          { name: "Boys (4-12)", slug: "/kids/boys" },
          { name: "Girls (4-12)", slug: "/kids/girls" },
          { name: "Baby (0-3)", slug: "/kids/baby" },
        ],
      },
    ],
    flatItems: [
      { name: "All Kids", slug: "/kids" },
      { name: "Boys", slug: "/kids/boys" },
      { name: "Girls", slug: "/kids/girls" },
      { name: "Baby", slug: "/kids/baby" },
    ],
  },
};

// Helper function to transform data if needed
export const getCategoryColumns = (category) => {
  return categories[category]?.columns || [];
};
