"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Import useRouter to extract query parameters
import { supabase } from "@/lib/client";
import Link from "next/link";
import { FaLock } from "react-icons/fa";

const ResetPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const { token } = router.query; // Extract token from query parameters

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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
        </div>
        <form onSubmit={handlePasswordReset}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* New Password Input */}
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

            {/* Confirm Password Input */}
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primaryPurple hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryPurple"
            >
              Reset Password
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-primaryPurple hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPage;
