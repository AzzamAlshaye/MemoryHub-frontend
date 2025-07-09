// src/pages/user/SignInPage.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate, useLocation, Link } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTitle } from "../../hooks/useTitle";
import { useAuth } from "../../context/AuthContext";

export default function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth(); // no longer reading `user` here
  useTitle("Sign in | MemoryHub");

  // if redirected by <RequireAuth>, use its `from`; otherwise undefined
  const originalFrom = location.state?.from?.pathname;

  const initialValues = { email: "", password: "" };
  const validate = (values) => {
    const errors = {};
    if (!values.email) errors.email = "Required";
    if (!values.password) errors.password = "Required";
    return errors;
  };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      // login() now returns the fresh user object
      const me = await login({
        email: values.email.trim(),
        password: values.password,
      });

      toast.success("Signed in! Redirecting…", { autoClose: 1200 });

      let destination;
      if (originalFrom) {
        destination = originalFrom;
      } else if (me.role === "admin") {
        destination = "/admin/dashboard";
      } else {
        destination = "/mapPage";
      }

      navigate(destination, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Sign-in failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white-theme p-6">
      <ToastContainer position="top-center" />

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-8">
        <div className="flex justify-center mb-6">
          <img src="/m-logo.webp" alt="Map Memory" className="w-28" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Sign in to continue to your map memories.
        </p>

        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {[
                { id: "email", label: "Email", type: "email" },
                { id: "password", label: "Password", type: "password" },
              ].map(({ id, label, type }) => (
                <div key={id} className="relative">
                  <Field
                    id={id}
                    name={id}
                    type={type}
                    placeholder=" "
                    className="
                      peer w-full h-12
                      px-4 pt-4 pb-2
                      border border-gray-300 rounded-md
                      placeholder-transparent text-gray-800
                      focus:outline-none focus:ring-1 focus:ring-main-theme
                      focus:border-main-theme transition
                    "
                  />
                  <label
                    htmlFor={id}
                    className="
                      absolute left-3
                      -top-2 bg-white
                      px-1  rounded-2xl
                      text-sm text-gray-500 transition-all
                      peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent peer-placeholder-shown:px-0
                      peer-focus:-top-2 peer-focus:text-sm peer-focus:bg-white peer-focus:px-1
                    "
                  >
                    {label}
                  </label>
                  <ErrorMessage
                    name={id}
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className={`
                  w-full h-12 flex items-center justify-center
                  text-white font-semibold rounded-2xl transition
                  ${
                    isSubmitting || isLoading
                      ? "bg-lighter-theme cursor-not-allowed"
                      : "bg-main-theme hover:bg-dark-theme"
                  }
                `}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>

              <div className="text-center">
                <button
                  onClick={() => navigate("/")}
                  className=" w-full h-12 border-2 border-main-theme bg-white-theme text-main-theme font-semibold rounded-2xl transition hover:bg-main-theme hover:text-white"
                >
                  Home
                </button>
              </div>

              <p className="text-center text-sm text-gray-600">
                Don’t have an account?{" "}
                <Link
                  to="/SignupPage"
                  className="text-main-theme hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </Form>
          )}
        </Formik>

        <div className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} MemoryHub
        </div>
      </div>
    </div>
  );
}
