import React from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

export default function GoogleAuth({ loading, setLoading, loginWithGoogle }) {
  const location = useLocation();

  const handleGoogleLogin = () => {
    // Get the original path the user was trying to access
    const from = location.state?.from?.pathname || "/";

    // Encode the parameter
    const encodedFrom = encodeURIComponent(from);

    // Redirect to OAuth2 with from parameter
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google?from=${encodedFrom}`;
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full border border-gray-300 py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition text-sm sm:text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 533.5 544.3"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M533.5 278.4c0-18.5-1.5-37.2-4.7-55.4H272v104.9h146.9c-6.3 34-25.5 62.8-54.5 82.1v68.3h87.8c51.3-47.2 81.3-116.8 81.3-199.9z"
            fill="#4285F4"
          />
          <path
            d="M272 544.3c73.9 0 135.9-24.5 181.2-66.7l-87.8-68.3c-24.3 16.3-55.5 25.9-93.4 25.9-71.7 0-132.6-48.4-154.3-113.5H28.7v71.2C74.6 485.5 167.4 544.3 272 544.3z"
            fill="#34A853"
          />
          <path
            d="M117.7 328.9c-5.4-16-8.5-33.1-8.5-50.9s3.1-34.9 8.5-50.9V155.9H28.7C10.3 193.8 0 235.3 0 272s10.3 78.2 28.7 116.1l89-59.2z"
            fill="#FBBC05"
          />
          <path
            d="M272 107.7c39.7 0 75.2 13.7 103.3 40.7l77.4-77.4C407.8 24.1 345.8 0 272 0 167.4 0 74.6 58.8 28.7 155.9l89 71.2C139.4 156.1 200.3 107.7 272 107.7z"
            fill="#EA4335"
          />
        </svg>
        Sign in with Google
      </button>
    </div>
  );
}
