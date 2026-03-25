// src/components/navbar/IconButtons.jsx
import React from "react";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CartIcon from "../cart/CartIcon";
import useRequireAuth from "../../hooks/useRequireAuth";
import { useAuth } from "../../context/AuthContext";

// Main IconButtons component - default export
const IconButtons = ({ desktop = false, tablet = false, mobile = false }) => {
  const buttonSize = desktop ? "lg" : tablet ? "md" : "sm";
  const iconSize = {
    sm: "h-5 w-5",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const navigate = useNavigate();
  const requireAuth = useRequireAuth();
  const { isAuthenticated } = useAuth();

  const handleUserClick = () => {
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
      className={`flex items-center ${desktop ? "gap-4 md:gap-6" : "gap-3"}`}
    >
      {/* Cart Button */}
      <CartIcon sizeClass={iconSize[buttonSize]} />

      {/* Account / Login Button */}
      <button
        onClick={handleUserClick}
        className="p-1 hover:text-gray-600 cursor-pointer"
        aria-label="User account"
      >
        <User className={iconSize[buttonSize]} />
      </button>
    </div>
  );
};

// MenuToggle component
const MenuToggle = ({ mobileOpen, setMobileOpen }) => {
  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);
  const Icon = mobileOpen ? X : Menu;

  return (
    <button
      onClick={toggleMobileMenu}
      className="p-1 hover:text-gray-600 cursor-pointer"
      aria-label={mobileOpen ? "Close menu" : "Open menu"}
    >
      <Icon className="h-7.5 w-5.5" />
    </button>
  );
};

// Attach MenuToggle to IconButtons
IconButtons.MenuToggle = MenuToggle;

// Export as default
export default IconButtons;
