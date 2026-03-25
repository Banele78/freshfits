// src/components/navbar/TabletMenu.jsx
import React from "react";
import Dropdown from "./dropdown/Dropdown";
import { categories } from "../../api/categories";
import { Link } from "react-router-dom";

const TabletMenu = () => {
  const convertToColumns = (items) => {
    if (!Array.isArray(items)) return [];
    return [
      {
        items: items.map((item) => ({
          name: item.name,
          slug: item.slug,
        })),
      },
    ];
  };

  return (
    <div className="hidden md:flex lg:hidden items-center gap-3 font-medium flex-1 justify-center">
      <Dropdown
        label="Men"
        columns={convertToColumns(categories.men.flatItems || [])}
        compact
      />
      <Dropdown
        label="Women"
        columns={convertToColumns(categories.women.flatItems || [])}
        compact
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
        className="text-gray-700 hover:text-gray-900 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 rounded px-2 py-1 cursor-pointer"
      >
        Brands
      </Link>
    </div>
  );
};

export default TabletMenu;
