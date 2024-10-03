"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/client";
import { FaEnvelope } from "react-icons/fa";
import logo from "../assets/logo.svg";
import Image from "next/image";
import { IoInformationCircleOutline } from "react-icons/io5";

const PasswordRecovery = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ email: "" });
  const [message, setMessage] = useState(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handlePasswordRecovery = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({ email: "" });

    if (!emailRegex.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
      return;
    }

    // Attempt to send password recovery email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://devlinks-supabase.vercel.app/reset'
      });
    const errors = await supabase.auth.resetPasswordForEmail(email);
    console.log(errors);
    
    

    if (error) {
      setMessage("Error sending password reset email. Please try again.");
    } else {
      setMessage(
        "Password reset link has been sent to your email. Note that there might be a slight delay of up to 10 minutes."
      );
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

        <h2 className="text-2xl lg:text-3xl font-bold mb-3">
          Password Recovery
        </h2>

        <form className="mt-6" onSubmit={handlePasswordRecovery}>
          <div className="flex flex-col space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email Address
              </label>
              <div className="mt-1 relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                  className={`block w-full pl-10 pr-3 py-2 text-xs border  border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primaryPurple focus:border-primaryPurple sm:text-sm
                ${errors.email ? "border-error text-error" : ""}`}
                  required
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primaryPurple hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryPurple"
            >
              Send Recovery Email
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

export default PasswordRecovery;
