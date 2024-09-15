"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/client";
import { FaEnvelope, FaLock } from "react-icons/fa";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState<string | null>(null);

  // Regex Patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleRegister = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setErrors({ email: "", password: "", confirmPassword: "" }); // Reset errors
    setMessage(null); // Reset message

    let validationErrors = {
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!emailRegex.test(email)) {
      validationErrors.email = "Invalid email format.";
    }

    if (!passwordRegex.test(password)) {
      validationErrors.password =
        "Password must contain at least 8 characters, including letters and numbers.";
    }

    if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }

    if (
      validationErrors.email ||
      validationErrors.password ||
      validationErrors.confirmPassword
    ) {
      setErrors(validationErrors);
      return; // Stop form submission if validation fails
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        setErrors((prev) => ({ ...prev, email: error.message }));
      } else {
        setMessage("Check your email for confirmation.");
        // Clear the input fields after successful registration
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error("Unexpected Error:", err);
      setErrors((prev) => ({
        ...prev,
        email: "An unexpected error occurred. Please try again.",
      }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center mb-8">
          {/* Icon/logo */}
          <img src="/devlinks-logo.svg" alt="Devlinks Logo" className="h-12" />
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Create account
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Let's get you started sharing your links!
        </p>
        {message && (
          <p className="text-green-500 text-center mt-4">{message}</p>
        )}
        <form onSubmit={handleRegister} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 text-xs border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="e.g. alex@email.com"
                required
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Create password
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 text-xs border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="At least 8 characters"
                required
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm password
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 text-xs border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="At least 8 characters"
                required
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#7A3FED] hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create new account
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[#7A3FED] hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
