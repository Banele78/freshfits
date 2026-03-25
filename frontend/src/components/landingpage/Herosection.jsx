import React from "react";
import HeroVideo from "../../assets/herosection/freshfits_hero.mp4"; // your video file

const Herosection = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background video */}
      <video
        src={HeroVideo}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Dark overlay for better text visibility */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/70 z-10" />

      {/* Overlay content */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-white p-4 z-20">
        <div className="w-full max-w-3xl text-left font-poppins">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Shop South Africa’s Freshest Fits - All in One Place
          </h1>
          <p className="text-lg md:text-2xl mb-6 max-w-90">
            Discover and support local brands shaping Mzansi’s street culture.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-row gap-4 justify-center mt-2">
          <a
            href="https://forms.gle/EGdXhSZ9voevq3MB6"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FFD600] hover:bg-[#e6c500] text-black font-semibold px-6 py-3 rounded-lg transition cursor-pointer inline-block"
          >
            Join Waitlist
          </a>

          <a
            href="https://forms.gle/w1HC1csxNMhi1kKT6"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-gray-200 text-black font-semibold px-6 py-3 rounded-lg transition cursor-pointer inline-block"
          >
            List Your Brand
          </a>
        </div>
      </div>
    </div>
  );
};

export default Herosection;
