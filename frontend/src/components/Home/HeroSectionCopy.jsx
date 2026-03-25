import { useState } from "react";
import HeroVideo from "../../assets/herosection/freshfits_hero.mp4";
import FreshFitsLoader from "../FreshFitsLoader";

const Herosection = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background video */}
      <video
        src={HeroVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onCanPlayThrough={() => setVideoLoaded(true)}
        className="
          absolute top-0 left-0 w-full h-full object-cover
          transition-opacity duration-700
          ${videoLoaded ? 'opacity-100' : 'opacity-0'}
        "
      />

      {/* Loader (only while video loads) */}
      {!videoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center  z-20">
          <FreshFitsLoader size={120} />
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 z-10" />

      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 z-30">
        <header className="w-full max-w-3xl text-center md:text-left font-poppins">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Shop South Africa’s Freshest Fits – All in One Place
          </h1>
          <p className="text-lg md:text-2xl mb-6 max-w-[90%] md:max-w-full">
            Discover and support local brands shaping Mzansi’s street culture.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-2">
            <a
              href="https://forms.gle/w1HC1csxNMhi1kKT6"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-gray-200 text-black font-semibold px-6 py-3 rounded-lg transition transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Shop now
            </a>
          </div>
        </header>
      </div>
    </section>
  );
};

export default Herosection;
