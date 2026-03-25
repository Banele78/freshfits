import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import CartDrawer from "../components/cart/CartDrawer";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <div className="pt-15 sm:pt-15 md:pt-15">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
