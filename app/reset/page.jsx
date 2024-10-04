"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/client";
import Link from "next/link";
import { FaLock } from "react-icons/fa";

import logo from "../assets/logo.svg"
import {useRouter} from "next/navigation"
import Image from "next/image";
import { IoInformationCircleOutline } from "react-icons/io5";


const ResetPage = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState(null);

  const token = router.query; // Extract token from query parameters

  // Ensure token is available before continuing
  useEffect(() => {
    if (!token) {
      setMessage("Missing or invalid token");
    }
  }, [token]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setErrors({ newPassword: "", confirmPassword: "" });
    setMessage(null);

    // Validation logic
    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    try {
      // Ensure token is present before attempting to reset
      if (!token) {
        setMessage("Missing or invalid token");
        return;
      }

      // Call Supabase API to reset password using the token
      const { error } = await supabase.auth.updateUser({
        access_token: token,// Pass the token to Supabase
        password: newPassword,
      });

      if (error) {
        setMessage("Error resetting password: " + error.message);
      } else {
        setMessage("Password has been reset successfully!");
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
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
