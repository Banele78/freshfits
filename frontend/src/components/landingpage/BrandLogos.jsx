import React, { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SjambokLogo from "../../assets/logos/sjambokLogo.png";
import ChinaLogo from "../../assets/logos/chinaLogo.jpg";

import Jane4 from "../../assets/logos/jane4.png";
// import ThesisLogo from "../../assets/logos/thesisLogo.jpg";
// import SteezkillaLogo from "../../assets/logos/steezkillaLogo.png";

const BrandLogos = () => {
  const brands = [
    {
      src: SjambokLogo,
      alt: "Sjambok",
      link: "https://www.instagram.com/came_with_a_sjambok_ngashaya?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    },
    {
      src: ChinaLogo,
      alt: "China",
      link: "https://www.instagram.com/chinaclothingbrand?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    },
  ];

  // Always display 4 slots, fill empty slots with placeholders
  const displayBrands = [
    ...brands,
    ...Array(4 - brands.length).fill({ placeholder: true }),
  ];

  // Duplicate list to make loop seamless
  const allBrands = [...brands, ...brands];
  const sliderRef = useRef(null);

  // Auto-scroll effect
  // useEffect(() => { ... });

  const scroll = (direction) => {
    const slider = sliderRef.current;
    if (slider) {
      const scrollDistance = direction === "left" ? -300 : 300;
      slider.scrollBy({ left: scrollDistance, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white text-black px-6 md:px-20 py-10 relative overflow-hidden">
      <h3 className="text-3xl md:text-5xl font-oswald font-bold mb-10 text-center">
        Proudly Featuring Local Legends
      </h3>

      {/* Slider container */}
      <div className="relative flex items-center justify-center">
        {/* Left Arrow */}
        {/* <button
          onClick={() => scroll("left")}
          className="absolute left-2 md:left-4 z-10 bg-black/60 hover:bg-black text-white p-2 md:p-3 rounded-full transition"
        >
          <ChevronLeft size={24} />
        </button> */}

        {/* Logos */}
        <div
          ref={sliderRef}
          className="flex overflow-x-scroll scrollbar-hide gap-10 py-4 scroll-smooth max-w-230"
        >
          {displayBrands.map((brand, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-40 h-40 md:w-48 md:h-48 flex items-center justify-center bg-gray-10 rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-transform"
            >
              {brand.placeholder ? (
                <span className="text-gray-400 font-semibold">Coming Soon</span>
              ) : (
                <a
                  href={brand.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={brand.src}
                    alt={brand.alt}
                    className="w-36 h-36 md:w-44 md:h-44 object-contain"
                  />
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {/* <button
          onClick={() => scroll("right")}
          className="absolute right-2 md:right-4 z-10 bg-black/60 hover:bg-black text-white p-2 md:p-3 rounded-full transition"
        >
          <ChevronRight size={24} />
        </button> */}
      </div>

      {/* CTA */}
      <div className="flex flex-col md:flex-row items-center justify-center mt-6 gap-2 md:gap-4">
        <span className="text-sm md:text-xl text-gray-600">
          Are you a brand? Join our growing family -
        </span>
        <a
          href="https://forms.gle/w1HC1csxNMhi1kKT6"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#FFD600] hover:bg-[#e6c500] text-black font-semibold px-4 py-2 rounded-lg transition cursor-pointer inline-block"
        >
          List Your Brand
        </a>
      </div>
    </div>
  );
};

export default BrandLogos;
