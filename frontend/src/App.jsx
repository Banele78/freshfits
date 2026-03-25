import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Landingpage from "./pages/Landingpage";
import CartPage from "./pages/CartPage";
import Login from "./pages/auth/Login";
import AccountPage from "./pages/AccountPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import UploadProduct from "./pages/Admin/UploadProduct";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";
import MainLayout from "./layouts/MainLayout";
import "./App.css";
import Register from "./pages/auth/Register";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import LoginRedirect from "./components/auth/LoginRedirect";
import Checkout from "./pages/CheckoutPage";
import CheckoutPayment from "./pages/CheckoutPayment";
import CheckoutLayout from "./layouts/CheckOutLayout";
import AccountProfile from "./components/account/AccountProfile";
import AccountOrders from "./components/account/orders/AccountOrders";
import AccountAddresses from "./components/account/AccountAddresses";
import OrderDetails from "./components/account/orders/OrderDetails";

function App() {
  return (
    <>
      <ScrollToTop />

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2500,
          style: { fontSize: "14px" },
        }}
      />

      <Routes>
        {/* ROUTES WITH NAVBAR */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/landing" element={<Landingpage />} />
          <Route path="/cart" element={<CartPage />} />

          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/admin/upload-product" element={<UploadProduct />} />

          <Route path="/account" element={<AccountPage />}>
            <Route index element={<AccountProfile />} />
            <Route path="orders" element={<AccountOrders />} />
            <Route path="addresses" element={<AccountAddresses />} />
            <Route path="order/:orderNumber" element={<OrderDetails />} />
          </Route>
        </Route>

        {/* CHECKOUT ROUTES WITHOUT NAVBAR */}
        <Route element={<CheckoutLayout />}>
          <Route path="/checkout/shipping" element={<Checkout />} />
          <Route path="/checkout/payment" element={<CheckoutPayment />} />
        </Route>

        {/*AUTH ROUTES WITHOUT NAVBAR */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/login-redirect" element={<LoginRedirect />} />
      </Routes>
    </>
  );
}

export default App;
