"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/client";
import Link from "next/link";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/logo.svg";
import Image from "next/image";
import { IoInformationCircleOutline } from "react-icons/io5";

const ResetPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState(null);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  // 🔑 Capture recovery session from Supabase after clicking email link
  useEffect(() => {
    const handleRecovery = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        console.warn("No active recovery session found ❌");
      } else {
        console.log("Recovery session established ✅", data.session);
      }
    };

    handleRecovery();
  }, []);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setErrors({ newPassword: "", confirmPassword: "" });
    setMessage(null);

    const validationErrors = {
      newPassword: "",
      confirmPassword: "",
    };

    if (!passwordRegex.test(newPassword)) {
      validationErrors.newPassword =
        "Password must contain at least 8 characters, including letters and numbers.";
      setErrors(validationErrors);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setMessage("Error resetting password: " + error.message);
      } else {
        setMessage("✅ Password has been reset successfully! You can now log in.");
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
            {/* New Password */}
            <div className="relative">
              <label htmlFor="newPassword" className="block text-sm font-medium">
                New password
              </label>
              <div className="relative mt-1 flex items-center">
                <FaLock className="text-gray-400 left-3 absolute" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 text-xs border ${
                    errors.newPassword ? "border-error" : "border-sec"
                  } rounded-lg shadow-sm focus:outline-none focus:ring-primaryPurple focus:border-primaryPurple sm:text-sm`}
                  placeholder="At least 8 characters"
                  required
                />
                <div
                  className="absolute right-3 cursor-pointer"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <FaEyeSlash className="text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-500" />
                  )}
                </div>
              </div>
              {errors.newPassword && (
                <p className="text-error flex items-center space-x-4 text-xs mt-1">
                  <IoInformationCircleOutline />
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium"
              >
                Confirm Password
              </label>
              <div className="relative mt-1 flex items-center">
                <FaLock className="text-gray-400 left-3 absolute" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
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
                <p className="text-error flex items-center space-x-4 text-xs mt-1">
                  <IoInformationCircleOutline />
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

export default ResetPage;                required 
              />
              <div
                className="absolute right-3 cursor-pointer"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <FaEyeSlash className="text-gray-500" />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </div>
            </div>
            {errors.newPassword && (
              <p className="text-error flex items-center space-x-4 text-xs mt-1">
                <IoInformationCircleOutline />
                {errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium "
            >
              Confirm Password
            </label>
            <div className="relative mt-1 flex items-center">
              <FaLock className="text-gray-400 left-3 absolute" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
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
              <p className="text-error flex items-center space-x-4 text-xs mt-1">
                <IoInformationCircleOutline />
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
