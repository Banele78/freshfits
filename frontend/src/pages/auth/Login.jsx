import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import FreshFitsLoader from "../../components/FreshFitsLoader";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import GoogleAuth from "../../components/auth/GoogleAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const initialValues = { email: "", password: "" };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values) => {
    if (loading) return;
    try {
      setLoading(true);
      await login(values);
      toast.success("Logged in successfully");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-xl shadow-md p-5 sm:p-6 space-y-4">
        {/* Loader */}
        <div className="flex justify-center mb-4">
          <FreshFitsLoader size={64} />
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Welcome back
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Sign in to your account
          </p>
        </div>

        {/* Formik Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm sm:text-base"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-xs sm:text-sm text-red-500 mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm sm:text-base"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-xs sm:text-sm text-red-500 mt-1"
                />
              </div>

              {/* Forgot password */}
              <div className="text-right -mt-1 mb-2">
                <Link
                  to="/forgot-password"
                  className="text-sm text-black hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                size="md"
                loading={loading || isSubmitting}
                disabled={isSubmitting || loading} // optional, since `loading` already disables
                loadingText="Signing in..."
              >
                Login
              </Button>
            </Form>
          )}
        </Formik>

        {/* Divider */}
        <div className="flex items-center my-2">
          <hr className="flex-1 border-gray-300" />
          <span className="px-2 text-gray-400 text-xs sm:text-sm">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Google login */}
        <GoogleAuth
          loading={loading}
          setLoading={setLoading}
          loginWithGoogle={loginWithGoogle}
        />

        {/* Register link */}
        <p className="text-xs sm:text-sm text-center text-gray-500 mt-2 sm:mt-3">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-black font-medium hover:underline"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
