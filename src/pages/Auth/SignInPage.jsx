// src/pages/user/SignInPage.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate, Link } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTitle } from "../../hooks/useTitle";
import { authService } from "../../service/authService";
import { userService } from "../../service/userService";

export default function SignInPage() {
  const navigate = useNavigate();
  useTitle("Login | Map Memory");

  const initialValues = { email: "", password: "" };
  const validate = (values) => {
    const errors = {};
    if (!values.email) errors.email = "Email is required";
    if (!values.password) errors.password = "Password is required";
    return errors;
  };
  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const { token } = await authService.signin({
        email: values.email.trim(),
        password: values.password,
      });
      localStorage.setItem("token", token);
      const me = await userService.getCurrentUser();
      toast.success("Signed in! Redirecting…", { autoClose: 1200 });
      navigate(me.role === "admin" ? "/admin/crud" : "/mapPage");
    } catch (err) {
      toast.error(err.response?.data?.message || "Sign-in failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF7F0] p-6">
      <ToastContainer position="top-center" />

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src="/public/Logo-all.png" alt="Map Memory" className="w-28 h-auto" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">Welcome Back!</h2>
        <p className="text-center text-gray-600 mb-6">Sign in to continue to your map memories.</p>

        <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {/* Email */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800
                             focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Password */}
              <div className="space-y-1 relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800
                             focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition"
                />
                <div className="text-right mt-1">
                  <Link to="/forgot-password" className="text-amber-500 text-xs hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-lg text-white font-semibold transition
                  ${isSubmitting
                    ? "bg-amber-300 cursor-not-allowed"
                    : "bg-amber-500 hover:bg-amber-600"}`}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>

              {/* Sign Up */}
              <p className="text-center text-sm text-gray-600">
                Don’t have an account?{" "}
                <Link to="/SignupPage" className="text-amber-500 font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </Form>
          )}
        </Formik>

        <div className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Map Memory
        </div>
      </div>
    </div>
  );
}
