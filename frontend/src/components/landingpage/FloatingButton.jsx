import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FloatingButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded buttons */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-3 mb-3"
          >
            <a
              href="https://forms.gle/EGdXhSZ9voevq3MB6"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#FFD600] hover:bg-[#e6c500] text-black font-semibold px-5 py-3 rounded-full shadow-lg transition transform hover:scale-105"
            >
              Join Waitlist
            </a>
            <a
              href="https://forms.gle/w1HC1csxNMhi1kKT6"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-gray-200 text-black font-semibold px-5 py-3 rounded-full shadow-lg transition transform hover:scale-105"
            >
              List Your Brand
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-black hover:bg-gray-800 text-white p-4 rounded-full shadow-lg transition transform hover:scale-110"
      >
        {open ? "×" : "+"}
      </button>
    </div>
  );
};

export default FloatingButton;
