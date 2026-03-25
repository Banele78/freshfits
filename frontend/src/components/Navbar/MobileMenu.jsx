// src/components/navbar/MobileMenu.jsx
import React from "react";
import Dropdown from "./dropdown/Dropdown";
import IconButtons from "./IconButtons";
import { categories } from "../../api/categories";
import CartIcon from "../cart/CartIcon";
// Import User and ShoppingBag if needed or use IconButtons
import { User, ShoppingBag, X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import useRequireAuth from "../../hooks/useRequireAuth";
import { useAuth } from "../../context/AuthContext";

const IconButton = ({ icon: Icon, onClick, ariaLabel, size, className }) => (
  <button
    onClick={onClick}
    className={`p-1 hover:text-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 rounded ${className}`}
    aria-label={ariaLabel}
  >
    <Icon className={className} />
  </button>
);

const MobileMenu = ({ isOpen, onClose }) => {
  const { openCart } = useCart();

  const handleCartClick = () => {
    openCart(); // open cart drawer
    onClose(); // close mobile menu
  };

  const navigate = useNavigate();
  const requireAuth = useRequireAuth();
  const { isAuthenticated } = useAuth();

  const handleUserClick = () => {
    onClose();
    // If logged in → go to account
    if (isAuthenticated) {
      navigate("/account");
      return;
    }

    // If not logged in → require auth
    requireAuth({
      redirectTo: "/login",
    });
  };

  return (
    <div
      className={`fixed inset-0 top-0 bg-white transition-transform duration-300 ease-out transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } md:hidden z-50`}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile menu"
    >
      {/* Mobile Header */}
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between border-b border-gray-100 bg-white">
        <div className="text-lg font-bold text-gray-800">Menu</div>
        <IconButton
          icon={X}
          onClick={onClose}
          ariaLabel="Close menu"
          size="md"
          className="h-6 w-6"
        />
      </div>

      {/* Mobile Menu Content */}
      <div className="bg-white flex flex-col px-4 py-3 gap-1 overflow-y-auto h-[calc(100vh-64px)]">
        <Dropdown
          label={categories.men.label}
          columns={categories.men.columns}
          mobile
        />
        <Dropdown
          label={categories.women.label}
          columns={categories.women.columns}
          mobile
        />

        <Link
          to="/#brands"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("brands")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
            onClose();
          }}
          className="text-gray-700 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 rounded px-2 py-1 cursor-pointer"
        >
          Brands
        </Link>

        <div className="pt-4 mt-2 border-t border-gray-100">
          <button
            onClick={handleUserClick}
            className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 cursor-pointer"
            aria-label="User account"
          >
            <User className="h-5 w-5" />
            <span>My Account</span>
          </button>

          <div
            className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            onClick={handleCartClick}
          >
            <CartIcon sizeClass="h-5 w-5" />
            <span>Shopping Bag</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
