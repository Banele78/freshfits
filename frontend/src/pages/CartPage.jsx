// src/pages/CartPage.jsx
import React from "react";

const CartPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Your cart is currently empty.</p>
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
