import { useState } from "react";
import { forgotPassword } from "../../api/authApi";
import toast from "react-hot-toast";
import FreshFitsLoader from "../../components/FreshFitsLoader";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../components/ui/Button";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Enter a valid email address")
      .required("Email is required"),
  });

  const handleSubmit = async (values) => {
    if (loading) return;

    try {
      setLoading(true);
      await forgotPassword(values.email);
      setSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset link");
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
            Forgot password
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter your email to receive a reset link
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-green-600">
              If an account exists for this email, a reset link has been sent.
            </p>

            <Link
              to="/login"
              className="inline-block bg-black text-white py-2 px-4 rounded-lg
                         hover:bg-gray-900 transition text-sm"
            >
              Back to login
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
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                               focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <ErrorMessage
                    name="email"
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
                  loadingText="Sending reset link..."
                  disabled={loading || isSubmitting}
                >
                  Send reset link
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
