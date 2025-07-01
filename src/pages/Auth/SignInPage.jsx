import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link } from "react-router";
// import { useAuth } from "../../contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import { useTitle } from "../../hooks/useTitle";
import "react-toastify/dist/ReactToastify.css";

export default function SignInPage() {
  // const { login } = useAuth();
  useTitle("Login | Map Memory");

  const initialValues = { email: "", password: "" };

  const validate = (values) => {
    const errors = {};
    if (!values.email) errors.email = "Email is required";
    if (!values.password) errors.password = "Password is required";
    return errors;
  };

  const onSubmit = async (values, { setSubmitting }) => {
    await login(values.email, values.password);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-100 p-6">
      <ToastContainer position="top-center" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl px-8 py-10 sm:p-12">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/logo1.png" alt="Map Memory" className="w-20 h-20" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-2">
          Welcome Back!
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Let’s get you back to your memories
        </p>

        <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {/* Email */}
              <div className="relative">
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder=" "
                  className="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-md text-gray-900 placeholder-transparent focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
                <label
                  htmlFor="email"
                  className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-sky-600"
                >
                  Email
                </label>
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Password */}
              <div className="relative">
                <Field
                  id="password"
                  name="password"
                  type="password"
                  placeholder=" "
                  className="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-md text-gray-900 placeholder-transparent focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
                <label
                  htmlFor="password"
                  className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-sky-600"
                >
                  Password
                </label>
                <div className="text-right text-sm mt-1">
                  <Link to="/forgot-password" className="text-blue-400 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-gradient-to-r from-sky-400 to-sky-500 text-white font-semibold rounded-full hover:opacity-90 transition"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>

              {/* Sign up link */}
              <p className="text-center text-sm text-gray-600 mt-4">
                Don’t have an account?{" "}
                <Link to="/signup" className="text-blue-500 hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </Form>
          )}
        </Formik>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Map Memory
        </div>
      </div>
    </div>
  );
}