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
      // 1) Sign in and get the raw token
      const { token } = await authService.signin({
        email: values.email.trim(),
        password: values.password,
      });

      // 2) Persist only the raw JWT; primaryAPI interceptor will add "Bearer "
      localStorage.setItem("token", token);

      // 3) Fetch the full user object (with role)
      const me = await userService.getCurrentUser();

      // 4) Redirect based on role
      toast.success("Signed in! Redirecting…");
      if (me.role === "admin") {
        navigate("/admin/crud");
      } else {
        navigate("/mapPage");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Sign-in failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-200 p-6">
      <ToastContainer position="top-center" />

      <div className="w-full max-w-md bg-gray-100 rounded-3xl shadow-xl px-5 py-3 sm:p-12">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/new-logo.png" alt="Map Memory" className="w-30 h-20 hover:scale-110 delay-300 duration-400" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-2">
          Welcome Back!
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Let’s get you back to your memories
        </p>

        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {/* Email */}
          <div className="relative">
  <Field
    id="email"
    name="email"
    type="email"
    placeholder="Enter your email..."
    className="peer w-full px-4 pt-6 pb-3 border border-gray-300 rounded-md placeholder-transparent text-gray-900 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
  />
  <label
    htmlFor="email"
    className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-sky-600"
  >
    Email
  </label>
  <ErrorMessage
    name="email"
    component="div"
    className="text-red-500 text-sm mt-1"
  />
</div>

              {/* Password */}
           <div className="relative">
  <Field
    id="password"
    name="password"
    type="password"
    placeholder="Enter your password... "
    className="peer w-full px-4 pt-6 pb-3 border border-gray-300 rounded-md placeholder-transparent text-gray-900 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
  />
  <label
    htmlFor="password"
    className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-sky-600"
  >
    Password
  </label>
  <div className="text-right text-sm mt-1">
    <Link
      to="/forgot-password"
      className="text-blue-400 hover:underline"
    >
      Forgot password?
    </Link>
  </div>
  <ErrorMessage
    name="password"
    component="div"
    className="text-red-500 text-sm mt-1"
  />
</div>

              {/* Submit */}
            <button
  type="submit"
  disabled={isSubmitting}
  className="w-full py-2 bg-[#fb8951] text-white font-semibold rounded-full hover:opacity-90 transition"
>
  {isSubmitting ? "Signing In..." : "Sign In"}
</button>

              <p className="text-center text-sm text-gray-600 mt-4">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-amber-600 hover:underline font-medium"
                >
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