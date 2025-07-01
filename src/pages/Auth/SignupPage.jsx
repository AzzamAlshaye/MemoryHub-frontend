import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate, Link } from "react-router";
// import { primaryAPI } from "../../api/axiosConfig";
import { useTitle } from "../../hooks/useTitle";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignupPage() {
  const navigate = useNavigate();
  useTitle("Register | Map Memory");

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

// Name: count only non-space characters
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
    const emailTrimmed = values.email.trim();
    const payload = {
      name: values.name.trim(),
      email: emailTrimmed,
      password: values.password,
    };

    try {
      const { data: allUsers } = await primaryAPI.get("/auth");
      const exists = allUsers.some(
        (u) => u.email.toLowerCase() === emailTrimmed.toLowerCase()
      );

      if (exists) {
        toast.error("This email is already registered");
        setSubmitting(false);
        return;
      }

      await primaryAPI.post("/auth", payload);
      toast.success("Sign-up successful! Redirecting to login…");
      resetForm();
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
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
          Join Map Memory
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Start saving your memories today!
        </p>

        <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {/* Name */}
              <div className="relative">
                <Field
                  id="name"
                  name="name"
                  type="text"
                  placeholder=" "
                  className="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-md placeholder-transparent text-gray-900 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
                <label
                  htmlFor="name"
                  className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-sky-600"
                >
                  Name
                </label>
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Email */}
              <div className="relative">
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder=" "
                  className="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-md placeholder-transparent text-gray-900 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
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
                  className="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-md placeholder-transparent text-gray-900 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
                <label
                  htmlFor="password"
                  className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-sky-600"
                >
                  Password
                </label>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder=" "
                  className="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-md placeholder-transparent text-gray-900 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
                <label
                  htmlFor="confirmPassword"
                  className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-sky-600"
                >
                  Confirm Password
                </label>
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-gradient-to-r from-sky-400 to-sky-500 text-white font-semibold rounded-full hover:opacity-90 transition"
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>

              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <Link to="/signin" className="text-blue-500 hover:underline font-medium">
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
