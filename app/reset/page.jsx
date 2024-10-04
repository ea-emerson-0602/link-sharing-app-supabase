"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/client";
import { FaLock } from "react-icons/fa";
import logo from "../assets/logo.svg";
import Image from "next/image";
import { IoInformationCircleOutline } from "react-icons/io5";

// Main ResetPage component with Suspense boundary
const ResetPage = () => {
  return (
    <div>
      <h1>Reset Password Page</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <PasswordReset />
      </Suspense>
    </div>
  );
};

// PasswordReset component containing the password reset logic
const PasswordReset = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState(null);
  const [, setAccessToken] = useState(null);
  const token = searchParams.get("token");

  // Regex for a valid password (minimum 8 characters, at least one letter and one number)
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  useEffect(() => {
    if (token) {
      setAccessToken(token);
    } else {
      setMessage("Invalid or missing reset token.");
    }
  }, [token]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({ newPassword: "", confirmPassword: "" });

    if (!passwordRegex.test(newPassword)) {
      setErrors((prev) => ({
        ...prev,
        newPassword:
          "Password must be at least 8 characters long and contain both letters and numbers.",
      }));
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
      return;
    }

    if (!token) {
      setMessage("Missing or invalid reset token.");
      return;
    }

    const { error } = await supabase.auth.updateUser(token, {
      password: newPassword,
    });

    if (error) {
      setMessage(error.message);
    } else {
      alert("Password updated successfully");
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col space-y-10 items-center justify-center min-h-screen px-8 bg-white md:bg-primaryBg">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
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
        {message && (
          <div className="mt-4 flex text-sm items-center text-green-500">
            <IoInformationCircleOutline className="mr-2" />
            <p>{message}</p>
          </div>
        )}

        <h2 className="text-2xl lg:text-3xl font-bold mb-3">Reset Password</h2>

        <form className="mt-6" onSubmit={handlePasswordReset}>
          <div className="flex flex-col space-y-4">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium"
              >
                New Password
              </label>
              <div className="mt-1 relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className={`block w-full pl-10 pr-3 py-2 text-xs border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primaryPurple focus:border-primaryPurple sm:text-sm
                ${errors.newPassword ? "border-error text-error" : ""}`}
                  required
                />
              </div>
              {errors.newPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className={`block w-full pl-10 pr-3 py-2 text-xs border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primaryPurple focus:border-primaryPurple sm:text-sm
                ${errors.confirmPassword ? "border-error text-error" : ""}`}
                  required
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primaryPurple hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryPurple"
            >
              Reset Password
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-primaryPurple hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPage;
