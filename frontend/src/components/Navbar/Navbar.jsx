// src/components/navbar/Navbar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useScrollState } from "./hooks/useScrollState";
import { useBreakpointClose } from "./hooks/useBreakpointClose";
import { useScrollLock } from "./hooks/useScrollLock";
import LogoBlock from "./LogoBlock";
import SearchBar from "./SearchBar";
import IconButtons from "./IconButtons";
import DesktopMenu from "./DesktopMenu";
import TabletMenu from "./TabletMenu";
import MobileMenu from "./MobileMenu";
import { useFilters } from "../../context/FilterContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isScrolled = useScrollState(10);
  useBreakpointClose(mobileOpen, setMobileOpen);
  useScrollLock(mobileOpen);

  const closeMobileMenu = () => setMobileOpen(false);
  const navShadow = isScrolled ? "shadow-lg" : "shadow-md";

  const { setSearchQuery, searchQueryLocal, setSearchQueryLocal } =
    useFilters();

  const handleSearchSubmit = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    // Commit search
    setSearchQuery(trimmed);

    navigate(`/products?q=${encodeURIComponent(trimmed)}`);
    setMobileOpen(false);
  };

  // useEffect(() => {
  //   const params = new URLSearchParams(location.search);
  //   const q = params.get("q") || "";
  //   setSearchQuery(q);
  // }, [location.search]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md ${navShadow} z-50 transition-shadow duration-300`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Main Navbar */}
      <div
        className={`transition-all duration-300 ${
          mobileOpen ? "h-0 overflow-hidden" : "h-auto"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 md:py-3 flex items-center justify-between gap-2 md:gap-4">
          <LogoBlock />

          <DesktopMenu />

          <TabletMenu />

          <div className="hidden lg:flex items-center gap-4 xl:gap-6 flex-shrink-0">
            <SearchBar
              value={searchQueryLocal}
              onChange={setSearchQueryLocal}
              onSubmit={handleSearchSubmit}
              size="md"
              placeholder="Search products..."
              variant="expanded" // Use expanded variant
            />
            <IconButtons desktop />
          </div>

          <div className="hidden md:flex lg:hidden items-center gap-3 flex-shrink-0">
            <SearchBar
              value={searchQueryLocal}
              onChange={setSearchQueryLocal}
              onSubmit={handleSearchSubmit}
              size="sm"
              variant="tablet" // Use tablet variant
              placeholder="Search..."
            />
            <IconButtons tablet />
          </div>

          <div className="flex md:hidden items-center gap-3">
            <IconButtons mobile />
            <IconButtons.MenuToggle
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
            />
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-2">
          <SearchBar
            value={searchQueryLocal}
            onChange={setSearchQueryLocal}
            onSubmit={handleSearchSubmit}
            size="md"
            variant="full" // Full width on mobile
            placeholder="Search products..."
          />
        </div>
      </div>

      <MobileMenu isOpen={mobileOpen} onClose={closeMobileMenu} />
    </nav>
  );
};

export default Navbar;
