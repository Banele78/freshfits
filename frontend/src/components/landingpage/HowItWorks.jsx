import React from "react";
import {
  FaSearch,
  FaShoppingCart,
  FaHeart,
  FaCreditCard,
  FaHandsHelping,
  FaTruck,
} from "react-icons/fa";

const HowItWorks = () => {
  const steps = [
    {
      icons: [<FaSearch />, <FaShoppingCart />],
      title: "Browse & Shop",
      description:
        "Find South Africa’s freshest brands and shop your favorites.",
    },
    {
      icons: [<FaCreditCard />, <FaTruck />],
      title: "Shop Securely",
      description: "Pay securely while supporting local creators.",
    },
    {
      icons: [<FaHandsHelping />, <FaHeart />],
      title: "Support Local",
      description: "Help grow local brands and boost Mzansi fashion.",
    },
  ];

  return (
    <div className="bg-gray-10 px-6 md:px-24 py-16 flex flex-col items-center">
      <h2 className="text-3xl md:text-5xl font-oswald font-bold mb-12 text-center">
        How It Works
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
          >
            {/* Icons container */}
            <div className="flex gap-4 mb-5">
              {step.icons.map((icon, idx) => (
                <span
                  key={idx}
                  className="p-4 rounded-full border-2 border-black text-black text-4xl md:text-5xl flex items-center justify-center transition transform hover:scale-110"
                >
                  {icon}
                </span>
              ))}
            </div>
            {/* Title */}
            <h3 className="text-xl md:text-2xl font-semibold mb-3">
              {step.title}
            </h3>
            {/* Description */}
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
