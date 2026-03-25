// src/components/navbar/LogoBlock.jsx
import React from "react";
import Logo from "../../assets/logos/logowhitebackground.png";
import { Link } from "react-router-dom";

const LogoBlock = () => {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 rounded cursor-pointer"
      aria-label="FreshFits Home"
    >
      <img
        src={Logo}
        alt="FreshFits"
        className="h-7 sm:h-8 md:h-9 lg:h-10 w-auto"
        loading="eager"
      />
      <span className="text-base sm:text-lg md:text-xl font-bold text-gray-800 whitespace-nowrap">
        FreshFits
      </span>
    </Link>
  );
};

export default LogoBlock;
