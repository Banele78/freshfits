import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../../api/authApi";
import toast from "react-hot-toast";
import FreshFitsLoader from "../../components/FreshFitsLoader";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../components/ui/Button";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const t = searchParams.get("token");
    if (!t) {
      toast.error("Invalid or missing reset token");
    } else {
      setToken(t);
    }
  }, [searchParams]);

  const initialValues = {
    newPassword: "",
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
    newPassword: Yup.string()
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
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleSubmit = async (values) => {
    if (!token || loading) return;

    try {
      setLoading(true);
      await resetPassword({
        token,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Reset link is invalid or expired",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6 space-y-5">
        {/* Loader */}
        <div className="flex justify-center h-6">
          {loading && <FreshFitsLoader size={24} />}
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Reset password
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter your new password below
          </p>
        </div>

        {!token ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-red-600">
              Invalid or missing reset token.
            </p>
            <Link
              to="/forgot-password"
              className="inline-block bg-black text-white py-2 px-4 rounded-lg
                         hover:bg-gray-900 transition text-sm"
            >
              Request new link
            </Link>
          </div>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4" noValidate>
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New password
                  </label>
                  <Field
                    type="password"
                    name="newPassword"
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                               focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className="text-xs text-red-500 mt-1"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm password
                  </label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                               focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-xs text-red-500 mt-1"
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  fullWidth
                  size="md"
                  loading={loading || isSubmitting}
                  loadingText="Resetting password..."
                  disabled={loading || isSubmitting}
                >
                  Reset password
                </Button>

                {/* Back to login */}
                <p className="text-center text-sm text-gray-500">
                  Remembered your password?{" "}
                  <Link to="/login" className="text-black hover:underline">
                    Login
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
}
