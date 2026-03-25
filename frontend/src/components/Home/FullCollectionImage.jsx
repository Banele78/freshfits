import React from "react";

// Desktop (wide 16:9)
import DesktopHeroImg from "../../assets/heritage-desktop.png";

// Mobile (portrait)
import MobileHeroImg from "../../assets/heritage-mobile.png";

const FullCollectionImage = () => {
  return (
    <section className="w-full bg-white  py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-lg shadow-lg">
          {/* Mobile image */}
          <img
            src="https://freshfits-images.s3.eu-north-1.amazonaws.com/email/heritage-mobile.webp"
            alt="Heritage Collection Mobile"
            className="block lg:hidden w-full h-auto object-contain"
            loading="lazy"
          />

          {/* Desktop image */}
          <img
            src="https://freshfits-images.s3.eu-north-1.amazonaws.com/email/heritage-desktop.webp"
            alt="Heritage Collection Desktop"
            className="hidden lg:block w-full aspect-[16/9] object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default FullCollectionImage;
