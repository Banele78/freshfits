import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SjambokLogo from "../../assets/logos/sjambokLogo.png";
import ChinaLogo from "../../assets/logos/chinaLogo.png";
import PiecexpieceLogo from "../../assets/logos/piecexpiecelogo.png";
import { Link } from "react-router-dom";

const BrandsSection = () => {
  const brands = [
    {
      src: SjambokLogo,
      alt: "Sjambok",
      link: "https://www.instagram.com/came_with_a_sjambok_ngashaya",
    },
    {
      src: ChinaLogo,
      alt: "China",
      link: "https://www.instagram.com/chinaclothingbrand",
    },
    {
      src: PiecexpieceLogo,
      alt: "Piecexpiece",
      link: "https://www.instagram.com/piecexpiece_",
    },
  ];

  // Show 6 slots total with placeholders for empty ones
  const displayBrands = [
    ...brands,
    ...Array(6 - brands.length).fill({ placeholder: true }),
  ];

  const sliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0); // Track active slide index

  const checkScroll = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    // Update arrow visibility
    setShowLeftArrow(slider.scrollLeft > 0);
    setShowRightArrow(
      slider.scrollLeft < slider.scrollWidth - slider.clientWidth - 10,
    );

    // Calculate active index based on scroll position
    const scrollPosition = slider.scrollLeft;
    const cardWidth = slider.children[0]?.offsetWidth || 0;
    const gap = 24; // gap-6 = 1.5rem = 24px
    const totalCardWidth = cardWidth + gap;

    if (totalCardWidth > 0) {
      const newActiveIndex = Math.round(scrollPosition / totalCardWidth);
      setActiveIndex(Math.min(newActiveIndex, displayBrands.length - 1));
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", checkScroll);
      checkScroll(); // Initial check
      return () => slider.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction) => {
    const slider = sliderRef.current;
    if (slider) {
      const cardWidth = slider.children[0]?.offsetWidth || 200;
      const gap = 24;
      const totalCardWidth = cardWidth + gap;
      const scrollDistance =
        direction === "left" ? -totalCardWidth : totalCardWidth;
      slider.scrollBy({ left: scrollDistance, behavior: "smooth" });
    }
  };

  const scrollToIndex = (index) => {
    const slider = sliderRef.current;
    if (slider && slider.children[0]) {
      const cardWidth = slider.children[0].offsetWidth;
      const gap = 24;
      const totalCardWidth = cardWidth + gap;
      slider.scrollTo({
        left: index * totalCardWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full bg-white " id="brands">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Heading */}
        <div className="mb-2 text-left">
          <h2 className="text-2xl md:text-2xl font-bold text-gray-900 text-left">
            Featured Brands
          </h2>
        </div>

        {/* Slider container */}
        <div className="relative">
          {/* Left Arrow - Conditionally shown and hidden on mobile */}
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 md:-left-4 z-20 bg-white border border-gray-200 hover:bg-gray-50 text-black p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform -translate-y-1/2 top-1/2 cursor-pointer hidden md:flex"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Logos Slider */}
          <div
            ref={sliderRef}
            className="flex overflow-x-auto scrollbar-hide gap-6 md:gap-8 scroll-smooth px-1 py-2"
          >
            {displayBrands.map((brand, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-52 h-52 md:w-48 md:h-48 flex flex-col items-center justify-center bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:scale-[1.02] group"
              >
                {brand.placeholder ? (
                  <div className="text-center p-4 flex flex-col items-center justify-center h-full">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-50 flex items-center justify-center mb-4 border-2 border-dashed border-gray-200">
                      <span className="text-3xl text-gray-300">+</span>
                    </div>
                    <span className="text-gray-500 font-medium text-sm">
                      Coming Soon
                    </span>
                    <p className="text-gray-400 text-xs mt-1 max-w-[120px]">
                      More brands launching soon
                    </p>
                  </div>
                ) : (
                  <Link
                    to={brand.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-full flex flex-col items-center justify-center p-4 group-hover:opacity-90 transition-opacity"
                  >
                    <div className="w-full h-32 flex items-center justify-center mb-2">
                      <img
                        src={brand.src}
                        alt={brand.alt}
                        className="max-w-full max-h-full object-contain p-2"
                      />
                    </div>
                    <span className="text-gray-800 font-medium text-center text-sm mt-2">
                      {brand.alt}
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right Arrow - Conditionally shown and hidden on mobile */}
          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 md:-right-4 z-20 bg-white border border-gray-200 hover:bg-gray-50 text-black p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform -translate-y-1/2 top-1/2 cursor-pointer hidden md:flex"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* Dots indicator - Now behaves like CategoryScroll */}
        <div className="flex justify-center gap-3 mt-6 md:hidden">
          {displayBrands.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${
                activeIndex === index ? "bg-black" : "bg-gray-300"
              }`}
              aria-label={`Go to brand ${index + 1}`}
            />
          ))}
        </div>

        {/* View all brands link */}
        {/* <div className="text-center mt-8">
          <a
            href="/brands"
            className="inline-flex items-center text-sm md:text-base font-medium text-gray-700 hover:text-black transition-colors"
          >
            View all brands
            <svg
              className="ml-2 w-4 h-4"
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
          </a>
        </div> */}
      </div>
    </section>
  );
};

export default BrandsSection;
