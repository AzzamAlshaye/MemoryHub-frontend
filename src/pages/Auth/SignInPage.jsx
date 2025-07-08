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
  useTitle("Sign in | MemoryHub");

  const initialValues = { email: "", password: "" };
  const validate = (values) => {
    const errors = {};
    if (!values.email) errors.email = "Required";
    if (!values.password) errors.password = "Required";
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
                disabled={isSubmitting}
                className={`
                  w-full h-12 flex items-center justify-center
                  text-white font-semibold rounded-2xl transition
                  ${
                    isSubmitting
                      ? "bg-lighter-theme cursor-not-allowed"
                      : "bg-main-theme hover:bg-dark-theme"
                  }
                `}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>

              {/* Home button */}
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
