import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Men from "../../assets/categorieSection/men.png";
import Women from "../../assets/categorieSection/women.png";

const categories = [
  {
    name: "Men",
    href: "/men",
    image:
      "https://freshfits-images.s3.eu-north-1.amazonaws.com/email/men.webp",
    description: "Streetwear • Casual • Essentials",
    ariaLabel: "Shop Men's Collection",
  },
  {
    name: "Women",
    href: "/women",
    image:
      "https://freshfits-images.s3.eu-north-1.amazonaws.com/email/women.webp",
    description: "Trendy • Bold • Local Brands",
    ariaLabel: "Shop Women's Collection",
  },
];

const CategoriesSection = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(null);

  const handleSelect = (category) => {
    setActive(category.name);

    // Navigate to products page with category as URL parameter
    navigate(`/products?department=${category.name.toLowerCase()}`);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="w-full py-8 md:py-10 bg-white"
      aria-labelledby="categories-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="categories-heading" className="sr-only">
          Shop by Category
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {categories.map((category, index) => (
            <motion.button
              key={category.name}
              type="button"
              onClick={() => handleSelect(category)}
              aria-label={category.ariaLabel}
              className={`relative h-[32rem] md:h-[45rem] rounded-xl overflow-hidden group block bg-gray-50 shadow-sm hover:shadow-2xl transition-shadow duration-500 text-left
                focus:outline-none focus:ring-2 focus:ring-black/30 cursor-pointer
                ${active === category.name ? "ring-2 ring-black/20" : ""}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                type: "spring",
                stiffness: 100,
              }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 z-0" />
              <img
                src={category.image}
                alt={`${category.name} fashion collection`}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-80"
                loading="lazy"
              />

              <div className="absolute bottom-8 left-8 right-8 z-10 text-white">
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 tracking-tight">
                  {category.name}
                </h3>
                <p className="text-base md:text-lg opacity-90 mb-4 max-w-xs">
                  {category.description}
                </p>

                <span className="inline-flex items-center text-sm md:text-base font-semibold border-b-2 border-white/50 pb-1 transition-all duration-300 group-hover:border-white group-hover:translate-x-2">
                  Shop {category.name}
                  <svg
                    className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default CategoriesSection;
