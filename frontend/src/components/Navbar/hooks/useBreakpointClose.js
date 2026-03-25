// src/components/navbar/hooks/useBreakpointClose.js
import { useEffect } from "react";

export const useBreakpointClose = (mobileOpen, setMobileOpen) => {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileOpen, setMobileOpen]);
};
