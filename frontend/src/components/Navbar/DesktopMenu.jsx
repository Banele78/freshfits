// src/components/navbar/DesktopMenu.jsx
import React from "react";
import { Link } from "react-router-dom";
import Dropdown from "./dropdown/Dropdown";
import { categories } from "../../api/categories";

const DesktopMenu = () => {
  return (
    <div className="hidden lg:flex items-center gap-4 xl:gap-6 font-medium whitespace-nowrap flex-1 justify-center">
      <Dropdown label={categories.men.label} columns={categories.men.columns} />
      <Dropdown
        label={categories.women.label}
        columns={categories.women.columns}
      />

      <Link
        to="/#brands"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("brands")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }}
        className="text-gray-700 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 rounded px-2 py-1 cursor-pointer"
      >
        Brands
      </Link>
    </div>
  );
};

export default DesktopMenu;
