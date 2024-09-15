"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "@/utils/auth";
// import { supabase } from "@/lib/client";

// Regex Patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setErrors({ email: "", password: "" }); // Reset errors
    setError(null); // Reset general error message

    let validationErrors = {
      email: "",
      password: "",
    };

    if (!emailRegex.test(email)) {
      validationErrors.email = "Invalid email format.";
    }

    if (!passwordRegex.test(password)) {
      validationErrors.password = "Password must contain at least 8 characters, including letters and numbers.";
    }

    if (validationErrors.email || validationErrors.password) {
      setErrors(validationErrors);
      return; // Stop form submission if validation fails
    }

    try {
      await signIn(email, password);
      window.location.href = "/"; // Redirect after successful login
    } catch (error) {
      console.error("Login Error:", error);
      setError("Login failed. Please check your credentials and try again.");
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
          Login
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Add your details below to get back into the app
        </p>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="relative mt-1">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`block w-full px-3 py-2 text-xs border ${
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
              Password
            </label>
            <div className="relative mt-1">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full px-3 py-2 text-xs border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="Enter your password"
                required
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#7A3FED] hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link href="/register" className="font-medium text-[#7A3FED] hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
