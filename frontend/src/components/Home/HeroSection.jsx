import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroVideo from "../../assets/herosection/freshfits_hero.mp4";

import FreshFitsLoader from "../FreshFitsLoader";
import { useNavigate } from "react-router-dom";

const Herosection = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const navigate = useNavigate();
  const HeroVideoAWS =
    "https://freshfits-images.s3.eu-north-1.amazonaws.com/email/Freshfits_Hero.mp4";

  const handleSelect = (category) => {
    // Navigate to products page with category as URL parameter
    navigate(`/products`);
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background video */}
      <video
        src={HeroVideoAWS}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onCanPlayThrough={() => setVideoLoaded(true)}
        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
          videoLoaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Loader */}
      <AnimatePresence>
        {!videoLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center bg-background z-20"
          >
            <FreshFitsLoader size={100} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-10" />

      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-30 text-white">
        <motion.header
          className="w-full max-w-3xl text-center md:text-left font-poppins"
          initial="hidden"
          animate={videoLoaded ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15, delayChildren: 0.2 },
            },
          }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: "easeOut" },
              },
            }}
          >
            Shop South Africa’s Freshest Fits – All in One Place
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto md:mx-0 text-white/85"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: "easeOut" },
              },
            }}
          >
            Discover and support local brands shaping Mzansi’s street culture.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: "easeOut" },
              },
            }}
          >
            {/* Primary CTA */}
            <motion.a
              onClick={() => handleSelect("all")}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Shop Now
            </motion.a>

            {/* Secondary CTA */}
            <motion.a
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("brands")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className="border-2 border-white/70 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 backdrop-blur-sm hover:border-white hover:bg-white/10 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Brands
            </motion.a>
          </motion.div>
        </motion.header>
      </div>
    </section>
  );
};

export default Herosection;
