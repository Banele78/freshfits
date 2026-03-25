import React from "react";
import FullCollectionImg from "../../assets/FullCollectionImage(2).png";

const FullCollectionImage = () => {
  return (
    <section className="w-full bg-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
          {/* Image Section - Full width on mobile, half on desktop */}
          <div className="w-full lg:w-1/2">
            <div className="relative overflow-hidden rounded-lg md:rounded-xl shadow-lg">
              <img
                src={FullCollectionImg}
                alt="Full Collection"
                className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover transition-transform duration-700 hover:scale-105"
              />
              {/* Subtle gradient overlay only on desktop */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent lg:from-black/30 lg:via-black/20 lg:to-transparent" />
            </div>
          </div>

          {/* Text Content - Below image on mobile, beside on desktop */}
          <div className="w-full lg:w-1/2">
            <div className="text-center lg:text-left">
              {/* Heading with decorative element */}
              <div className="mb-6 md:mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-gray-900 mb-3 md:mb-4">
                  Our Story
                </h2>
                <div className="flex justify-center lg:justify-start">
                  <div className="w-20 h-0.5 bg-gray-800"></div>
                </div>
              </div>

              {/* Paragraphs with better spacing */}
              <div className="space-y-4 md:space-y-6">
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg font-light">
                  Born from a passion for timeless elegance and contemporary
                  style, our fashion store curates collections that celebrate
                  individuality. Each piece is thoughtfully selected to blend
                  craftsmanship with modern aesthetics.
                </p>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg font-light">
                  We believe fashion should empower, inspire, and evolve with
                  you—every season, every occasion, every story.
                </p>
              </div>

              {/* Optional CTA button */}
              <div className="mt-8 md:mt-10">
                <button className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base font-medium group">
                  Discover Our Collection
                  <svg
                    className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>

              {/* Optional decorative stats */}
              <div className="mt-10 pt-8 border-t border-gray-200 hidden md:block">
                <div className="flex justify-between">
                  <div className="text-center">
                    <div className="text-2xl font-serif text-gray-900">10+</div>
                    <div className="text-sm text-gray-600">
                      Years Experience
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-serif text-gray-900">
                      500+
                    </div>
                    <div className="text-sm text-gray-600">Local Brands</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-serif text-gray-900">
                      50K+
                    </div>
                    <div className="text-sm text-gray-600">Happy Customers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FullCollectionImage;
