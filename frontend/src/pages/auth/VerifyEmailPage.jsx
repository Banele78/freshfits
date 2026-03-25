import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import FreshFitsLoader from "../../components/FreshFitsLoader";
import { verifyEmail } from "../../api/authApi";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const hasVerifiedRef = useRef(false);

  useEffect(() => {
    if (hasVerifiedRef.current) return;
    hasVerifiedRef.current = true;

    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    (async () => {
      try {
        const res = await verifyEmail(token);
        setStatus("success");
        setMessage(
          res.data?.message || "Your email has been verified successfully!",
        );
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            err.message ||
            "Email verification failed.",
        );
      }
    })();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 sm:p-8 text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center space-y-4">
            <FreshFitsLoader size={48} />
            <p className="text-gray-600">Verifying your email...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-green-600">
              Email Verified!
            </h2>
            <p className="text-gray-700">{message}</p>
            <Link
              to="/login"
              className="inline-block mt-2 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition"
            >
              Login
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-red-600">
              Verification Failed
            </h2>
            <p className="text-gray-700">{message}</p>
            <Link
              to="/register"
              className="inline-block mt-2 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition"
            >
              Go to Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
