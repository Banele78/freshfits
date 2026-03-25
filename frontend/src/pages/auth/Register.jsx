import { useState } from "react";
import toast from "react-hot-toast";
import FreshFitsLoader from "../../components/FreshFitsLoader";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import GoogleAuth from "../../components/auth/GoogleAuth";
import { register, resendVerification } from "../../api/authApi";
import Button from "../../components/ui/Button";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [verificationPending, setVerificationPending] = useState(null);
  // { email: string, message: string } when backend requires verification

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const COMMON_PASSWORDS = [
    "password",
    "123456",
    "123456789",
    "qwerty",
    "letmein",
    "welcome",
    "admin",
  ];

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters")
      .required("Full name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      // any non letter/digit = special (same logic as backend)
      .matches(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      )
      .test(
        "not-common-password",
        "Password is too common and easily guessable",
        (value) =>
          value ? !COMMON_PASSWORDS.includes(value.toLowerCase()) : true,
      )
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleSubmit = async (values) => {
    if (loading) return;

    try {
      setLoading(true);
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      toast.success(
        "Registered successfully! Please check your email for verification.",
      );
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Registration failed";

      // Check if backend says user exists but verification pending
      // Show resend verification message inside form
      if (
        message.toLowerCase().includes("email already exists") &&
        message.toLowerCase().includes("verification")
      ) {
        setVerificationPending({ email: values.email, message });
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!verificationPending) return;

    try {
      setLoading(true);
      await resendVerification(verificationPending.email);
      toast.success("Verification email resent successfully!");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to resend verification email",
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
            Create Account
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Register to start using your account
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
              {/* Name */}
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <Field
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm sm:text-base"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-xs sm:text-sm text-red-500 mt-1"
                />
              </div>

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

              {/* Confirm Password */}
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm sm:text-base"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-xs sm:text-sm text-red-500 mt-1"
                />
              </div>

              {/* Resend verification */}
              {verificationPending && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-yellow-800 text-sm">
                  {verificationPending.message}{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    className="underline text-blue-600 ml-1 cursor-pointer"
                    disabled={loading}
                  >
                    Resend verification link
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                size="md"
                loading={loading || isSubmitting}
                loadingText="Signing up..."
                disabled={isSubmitting || loading} // optional, since loading already disables
              >
                Register
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

        {/* Google registration */}
        <GoogleAuth loading={loading} setLoading={setLoading} />

        {/* Login link */}
        <p className="text-xs sm:text-sm text-center text-gray-500 mt-2 sm:mt-3">
          Already have an account?{" "}
          <a href="/login" className="text-black font-medium hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
