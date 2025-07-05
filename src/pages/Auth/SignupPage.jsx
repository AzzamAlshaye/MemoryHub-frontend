import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate, Link } from "react-router";
import { useTitle } from "../../hooks/useTitle";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authService } from "../../service/authService";
import { userService } from "../../service/userService";

export default function SignupPage() {
  const navigate = useNavigate();
  useTitle("Register | Map Memory");

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validate = (values) => {
    const errors = {};
    const nameLetters = values.name.replace(/\s/g, "");
    if (!nameLetters) {
      errors.name = "Required";
    } else if (nameLetters.length < 3) {
      errors.name = "Must be at least 3 letters";
    }

    if (!values.email) {
      errors.email = "Required";
    } else if (/\s/.test(values.email)) {
      errors.email = "Email cannot contain spaces";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }

    if (!values.password) {
      errors.password = "Required";
    } else if (/\s/.test(values.password)) {
      errors.password = "Password cannot contain spaces";
    } else if (values.password.length < 8) {
      errors.password = "Must be at least 8 characters";
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = "Required";
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "Passwords must match";
    }

    return errors;
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // 1) call signup
      const { token } = await authService.signup({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        role: "user",
      });

      // 2) persist only the raw JWT (primaryAPI interceptor will add "Bearer ")
      localStorage.setItem("token", token);

      // 3) fetch the current user (with role)
      const me = await userService.getCurrentUser();

      // 4) success toast + redirect based on role
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-200  p-6">
      <ToastContainer position="top-center" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl px-8 py-10 sm:p-12">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/new-logo.png" alt="Map Memory" className="w-30 h-20 hover:scale-110 delay-300 duration-400" />
        </div>

        {/* Title */}
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
            <Form className="space-y-6">
            
{/* Name Field */}
<div className="relative">
  <Field
    id="name"
    name="name"
    type="text"
    placeholder=" "
    className="peer w-full px-4 pt-6 pb-3 border border-gray-300 rounded-md placeholder-transparent text-gray-900 focus:outline-none focus:border-[#fb8951] focus:ring-1 focus:ring-[#fb8951]"
  />
  <label
    htmlFor="name"
    className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-[#fb8951]"
  >
    Name
  </label>
  <ErrorMessage
    name="name"
    component="div"
    className="text-red-500 text-sm mt-1"
  />
</div>

{/* Email Field */}
<div className="relative">
  <Field
    id="email"
    name="email"
    type="email"
    placeholder=" "
    className="peer w-full px-4 pt-6 pb-3 border border-gray-300 rounded-md placeholder-transparent text-gray-900 focus:outline-none focus:border-[#fb8951] focus:ring-1 focus:ring-[#fb8951]"
  />
  <label
    htmlFor="email"
    className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-[#fb8951]"
  >
    Email
  </label>
  <ErrorMessage
    name="email"
    component="div"
    className="text-red-500 text-sm mt-1"
  />
</div>

{/* Password Field */}
<div className="relative">
  <Field
    id="password"
    name="password"
    type="password"
    placeholder=" "
    className="peer w-full px-4 pt-6 pb-3 border border-gray-300 rounded-md placeholder-transparent text-gray-900 focus:outline-none focus:border-[#fb8951] focus:ring-1 focus:ring-[#fb8951]"
  />
  <label
    htmlFor="password"
    className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-[#fb8951]"
  >
    Password
  </label>
  <ErrorMessage
    name="password"
    component="div"
    className="text-red-500 text-sm mt-1"
  />
</div>

{/* Confirm Password Field */}
<div className="relative">
  <Field
    id="confirmPassword"
    name="confirmPassword"
    type="password"
    placeholder=" "
    className="peer w-full px-4 pt-6 pb-3 border border-gray-300 rounded-md placeholder-transparent text-gray-900 focus:outline-none focus:border-[#fb8951] focus:ring-1 focus:ring-[#fb8951]"
  />
  <label
    htmlFor="confirmPassword"
    className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-[#fb8951]"
  >
    Confirm Password
  </label>
  <ErrorMessage
    name="confirmPassword"
    component="div"
    className="text-red-500 text-sm mt-1"
  />
</div>
{/* Submit */}
<button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2  bg-[#fb8951] text-white font-semibold rounded-full hover:opacity-90 transition"
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>

              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <Link
                  to="/SignInPage"
                  className="text-amber-600  hover:underline font-medium"
                >
                  Log in
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