import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import TopsImg from "../../assets/categorieSection/top.png";
import HoodieImg from "../../assets/categorieSection/hoodie.png";
import AccessoriesImg from "../../assets/categorieSection/accessories.png";
import SweatersImg from "../../assets/categorieSection/sweater.png";
import BottomsImg from "../../assets/categorieSection/bottom.png";

const categories = [
  {
    name: "All",
    image:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Tops",
    image:
      "https://freshfits-images.s3.eu-north-1.amazonaws.com/email/top.webp",
  },
  {
    name: "Hoodies",
    image:
      "https://freshfits-images.s3.eu-north-1.amazonaws.com/email/hoodie.webp",
  },
  {
    name: "Bottoms",
    image:
      "https://freshfits-images.s3.eu-north-1.amazonaws.com/email/bottom.webp",
  },

  {
    name: "Sweaters",
    image:
      "https://freshfits-images.s3.eu-north-1.amazonaws.com/email/sweater.webp",
  },
  {
    name: "Accessories",
    image:
      "https://freshfits-images.s3.eu-north-1.amazonaws.com/email/accessories.webp",
  },
];

const CategoryScroll = ({ onSelect, initialCategory = "All" }) => {
  const scrollRef = useRef(null);
  const [active, setActive] = useState(initialCategory);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const navigate = useNavigate();

  const checkScroll = () => {
    const scroll = scrollRef.current;
    if (!scroll) return;

    setShowLeftArrow(scroll.scrollLeft > 10);
    setShowRightArrow(
      scroll.scrollLeft < scroll.scrollWidth - scroll.clientWidth - 10,
    );
  };

  useEffect(() => {
    const scroll = scrollRef.current;
    if (scroll) {
      scroll.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => scroll.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardWidth = container.offsetWidth;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  const handleSelect = (category) => {
    setActive(category.name);

    // Pass the selected category to parent
    onSelect?.(category.name);

    // Navigate to products page with category as URL parameter
    if (category.name === "All") {
      navigate("/products");
    } else {
      navigate(`/products?category=${category.name.toLowerCase()}`);
    }
  };

  const handleDotClick = (index) => {
    const category = categories[index];
    setActive(category.name);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.offsetWidth * index,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-2 text-left">
          <h2 className="text-2xl md:text-2xl font-bold text-gray-900 text-left">
            Shop by Category
          </h2>
        </div>

        {/* Scroll Container */}
        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-200 hover:bg-gray-50 text-black p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hidden md:flex"
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Scroll Area */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide py-2 scroll-smooth snap-x snap-mandatory -mx-4 md:mx-0"
          >
            {categories.map((category) => (
              <div
                key={category.name}
                className="flex-shrink-0 w-[calc(100%-2rem)] md:w-[31.5%] mx-4 md:mx-3"
              >
                <div className="relative w-full h-[26rem] sm:h-[28rem] md:h-[26rem] lg:h-[30rem]">
                  <button
                    onClick={() => handleSelect(category)}
                    className={`relative w-full h-full rounded-xl md:rounded-2xl overflow-hidden transition-all duration-500 group cursor-pointer
                      ${
                        active === category.name
                          ? "scale-[1.02] shadow-xl"
                          : "hover:scale-[1.02] hover:shadow-lg"
                      }`}
                    aria-label={`Browse ${category.name} category`}
                  >
                    {/* Image */}
                    <div className="absolute inset-0">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        decoding="async"
                        width="800"
                        height="1000"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    </div>

                    {/* Label */}
                    <div className="absolute bottom-8 left-8 z-10 text-white">
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        {category.name}
                      </h3>
                      <span className="inline-flex items-center text-base md:text-lg font-semibold border-b-2 border-white/60 pb-1 transition-all duration-300 group-hover:border-white group-hover:translate-x-2">
                        Shop now
                        <svg
                          className="ml-3 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
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
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-200 hover:bg-gray-50 text-black p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hidden md:flex"
              aria-label="Scroll right"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>

        {/* Mobile Dots */}
        <div className="flex justify-center gap-3 mt-6 md:hidden">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${
                active === category.name ? "bg-black" : "bg-gray-300"
              }`}
              aria-label={`Select ${category.name}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryScroll;
