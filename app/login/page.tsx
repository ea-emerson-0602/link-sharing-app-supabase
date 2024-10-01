"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "@/utils/auth";
import logo from "../assets/logo.svg";
import Image from "next/image";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setErrors({ email: "", password: "" });
    setError(null);

    const validationErrors = {
      email: "",
      password: "",
    };

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.email = "Invalid email format.";
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      validationErrors.password =
        "Password must contain at least 8 characters, including letters and numbers.";
    }

    if (validationErrors.email || validationErrors.password) {
      setErrors(validationErrors);
      return;
    }

    try {
      await signIn(email, password);
      window.location.href = "/";
    } catch (error) {
      console.error("Login Error:", error);
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="flex flex-col space-y-10 items-center justify-center min-h-screen px-8 bg-white md:bg-primaryBg">
      {/* Logo and Title */}
      <div className="flex w-full items-center md:justify-center space-x-2 mb-6 sm:mb-8">
        <Image
          src={logo}
          alt="logo"
          width={36}
          height={36}
          className="sm:w-10 sm:h-10"
        />
        <span className="font-bold md:text-center text-3xl">devlinks</span>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-sm sm:max-w-md md:p-6 md:px-6 bg-white rounded-lg md:shadow-lg">
        {/* Title */}
        <h2 className="text-2xl lg:text-3xl font-bold mb-3">Login</h2>
        <p className="mb-4 sm:mb-6 text-secondaryText text-sm">
          Add your details below to get back into the app
        </p>
        {error && <p className="text-error text-center mt-4">{error}</p>}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-8">
          {/* Email Input */}
          <div className="relative">
            <label htmlFor="email" className="block font-medium text-xs text-primaryText">
              Email address
            </label>
            <div className="relative mt-1 flex items-center">
              <FaEnvelope className="absolute left-3 text-gray-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`pl-10 block w-full px-3 py-2 text-xs border ${
                  errors.email ? "border-error" : "border-secondaryBg"
                } rounded-lg shadow-sm focus:outline-none focus:ring-primaryPurple focus:border-primaryPurple`}
                placeholder="e.g. alex@email.com"
                required
              />
            </div>
            {errors.email && (
              <p className="text-error text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative">
            <label htmlFor="password" className="block text-xs font-medium">
              Password
            </label>
            <div className="relative mt-1 flex items-center">
              <FaLock className="absolute left-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`pl-10 pr-10 block w-full px-3 py-2 text-xs border ${
                  errors.password ? "border-error" : "border-secondaryBg"
                } rounded-lg shadow-sm focus:outline-none focus:ring-primaryPurple focus:border-primaryPurple`}
                placeholder="Enter your password"
                required
              />
              <div
                className="absolute right-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash className="text-secondaryText" /> : <FaEye className="text-secondaryText" />}
              </div>
            </div>
            {errors.password && (
              <p className="text-error text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primaryPurple hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryPurple active:bg-primaryActive"
          >
            Login
          </button>
        </form>

        {/* Create Account Link */}
        <div className="mt-6 text-center">
          <p className="text-sm">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primaryPurple hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
