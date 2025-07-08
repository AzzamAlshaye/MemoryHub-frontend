// src/pages/user/SignupPage.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate, useLocation, Link } from "react-router";
import { useTitle } from "../../hooks/useTitle";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, user, isLoading } = useAuth();
  useTitle("Sign up | Map Memory");

  // If they came here via a protected route, send them right back;
  // otherwise default to mapPage (or admin/crud if they're admin).
  const from =
    location.state?.from?.pathname ||
    (user?.role === "admin" ? "/admin/crud" : "/mapPage");

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validate = (values) => {
    const errors = {};
    const nameLetters = values.name.replace(/\s/g, "");
    if (!nameLetters) errors.name = "Required";
    else if (nameLetters.length < 3) errors.name = "Must be at least 3 letters";

    if (!values.email) errors.email = "Required";
    else if (/\s/.test(values.email))
      errors.email = "Email cannot contain spaces";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email))
      errors.email = "Invalid email address";

    if (!values.password) errors.password = "Required";
    else if (/\s/.test(values.password))
      errors.password = "Password cannot contain spaces";
    else if (values.password.length < 8)
      errors.password = "Must be at least 8 characters";

    if (!values.confirmPassword) errors.confirmPassword = "Required";
    else if (values.confirmPassword !== values.password)
      errors.confirmPassword = "Passwords must match";

    return errors;
  };

const onSubmit = async (values, { setSubmitting, resetForm }) => {
  try {
    const { token } = await authService.signup({
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
      role: "user",
    });
    localStorage.setItem("token", token);
    const me = await userService.getCurrentUser();
    localStorage.setItem("currentUserName", me.name); 
    toast.success("Sign-up successful! Redirecting…");
    resetForm();
    if (me.role === "admin") {
      navigate("/admin/crud");
    } else {
      navigate("/mapPage");
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Registration failed");
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-white-theme p-6">
      <ToastContainer position="top-center" />

      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl px-8 py-8">
        <div className="flex justify-center mb-6">
          <img src="/m-logo.webp" alt="Map Memory" className="w-24" />
        </div>

        <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-2">
          Join Map Memory
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Start saving your memories today!
        </p>

        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {[
                { id: "name", label: "Name", type: "text" },
                { id: "email", label: "Email", type: "email" },
                { id: "password", label: "Password", type: "password" },
                {
                  id: "confirmPassword",
                  label: "Confirm Password",
                  type: "password",
                },
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
                      placeholder-transparent text-gray-900
                      focus:outline-none focus:ring-1 focus:ring-main-theme
                      focus:border-main-theme transition
                    "
                  />
                  <label
                    htmlFor={id}
                    className="
                      absolute left-3
                      -top-2 bg-white
                      px-1 
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
                {isSubmitting ? "Signing up..." : "Sign up"}
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

              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <Link
                  to="/SignInPage"
                  className="text-main-theme hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </Form>
          )}
        </Formik>

        <div className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} MemoryHub
        </div>
      </div>
    </div>
  );
}
