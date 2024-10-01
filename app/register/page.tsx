"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/client";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import logo from "../assets/logo.svg";
import Image from "next/image";
import { IoInformationCircleOutline } from "react-icons/io5";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Separate states to toggle password visibility for each field
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const validationErrors = {
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
      <div className="w-full max-w-sm sm:max-w-md md:p-6 md:px-6 bg-white rounded-lg md:shadow-lg">
        {/* Title */}
        <h2 className="text-2xl lg:text-3xl font-bold mb-3">Create account</h2>
        <p className="mb-4 sm:mb-6 text-secondaryText text-sm">
          Let&apos;s get you started sharing your links!
        </p>
        {message && (
          <p className="text-green-500 text-center mt-4">{message}</p>
        )}
       <form onSubmit={handleRegister} className="space-y-5 sm:space-y-8">
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
                className={`block w-full pl-10 pr-3 py-2 text-xs border ${
                  errors.email ? "border-error text-error" : "border-gray-300"
                } rounded-lg shadow-sm focus:outline-none focus:ring-primaryPurple focus:border-primaryPurple sm:text-sm`}
                placeholder="e.g. alex@email.com"
                required
              />
            </div>
            {errors.email && (
              <p className="text-error text-xs mt-1 flex items-center space-x-4"><IoInformationCircleOutline/>{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium ">
              Create password
            </label>
            <div className="relative mt-1 flex items-center">
              <FaLock className="text-gray-400 left-3 absolute" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 text-xs border ${
                  errors.password ? "border-error" : "border-sec"
                } rounded-lg shadow-sm focus:outline-none focus:ring-primaryPurple focus:border-primaryPurple sm:text-sm`}
                placeholder="At least 8 characters"
                required
              />
              <div
                className="absolute right-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-500" />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </div>
            </div>
            {errors.password && (
              <p className="text-error flex items-center space-x-4 text-xs mt-1"><IoInformationCircleOutline/>{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium "
            >
              Confirm password
            </label>
            <div className="relative mt-1 flex items-center">
              <FaLock className="text-gray-400 left-3 absolute" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 text-xs border ${
                  errors.confirmPassword ? "border-error" : "border-gray-300"
                } rounded-lg shadow-sm focus:outline-none focus:ring-primaryPurple focus:border-primaryPurple sm:text-sm`}
                placeholder="At least 8 characters"
                required
              />
              <div
                className="absolute right-3 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="text-gray-500" />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </div>
            </div>
            {errors.confirmPassword && (
              <p className="text-error flex items-center space-x-4 text-xs mt-1"><IoInformationCircleOutline/>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primaryPurple hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryPurple"
          >
            Create new account
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-secondaryText">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primaryPurple hover:underline"
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
