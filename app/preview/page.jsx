// File: pages/profile-preview.js
"use client";
import React, { useState}from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Display from "../components/Display";
import DisplayLinksComponent from "../components/DisplayLinkComponent";

export default function ProfilePreview() {
  const [userId, setUserId] = useState(null);
  const [userLinks, setUserLinks] = useState([]);
  const [profileUpdated] = useState(false);
  const [, setLoading] = useState(true);
  const [, setShareableLink] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const getUserInfo = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUserInfo();
  }, []);

  useEffect(() => {
    fetchUserLinks();
  }, [userId]);

  const fetchUserLinks = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });
      if (error) {
        console.error("Error fetching links:", error);
      } else {
        setUserLinks(data);
      }
    } catch (error) {
      console.error("Error fetching links:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateShareableLink = () => {
    const link = `${window.location.origin}/profile/${userId}`;
    setShareableLink(link);
    return link;
  };

  const copyLinkToClipboard = () => {
    const link = generateShareableLink();
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setShowToast(true); // Show toast
        setTimeout(() => setShowToast(false), 3000); // Hide after 3 seconds
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
      });
  };

  return (
    <div>
      <div className="relative min-h-screen md:bg-primaryBg">
        <div className="hidden md:block lg:h-[33vh] md:h-[22vh] rounded-b-3xl p-4 bg-primaryPurple">
          <nav className="md:flex hidden justify-between bg-white content-center items-center w-full rounded-lg p-3 ">
            <button className="flex space-x-8">
              <Link
                href="/"
                className="px-5 py-1 text-sm font-medium rounded-md text-primaryPurple border-2 border-primaryPurple hover:bg-secondaryBg hover:text-primaryPurple"
              >
                Back to Editor
              </Link>
            </button>
            <button
              onClick={copyLinkToClipboard}
              className="px-5 py-1 text-sm font-medium rounded-md text-white bg-primaryPurple"
            >
              Share Link
            </button>
          </nav>
        </div>
        <nav className="flex md:hidden justify-between bg-white content-center items-center w-full rounded-lg p-3">
          <Link
            href="/"
            className="px-8 py-2 text-sm font-medium rounded-md text-primaryPurple border-2 border-primaryPurple hover:bg-secondaryBg hover:text-primaryPurple"
          >
            Back to Editor
          </Link>
          <button
            onClick={copyLinkToClipboard}
            className="px-8 py-2 text-sm font-medium rounded-md text-white bg-primaryPurple"
          >
            Share Link
          </button>
        </nav>
        <div className="absolute top-10 left-0 right-0 z-50 flex flex-col items-center mx-auto mt-20 bg-white shadow-lg py-6 rounded-lg md:w-[280px] w-[80vw]">
          <Display className="mx-auto" userId={userId} key={profileUpdated} />
          <DisplayLinksComponent userLinks={userLinks} userId={userId} />
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-5 z-50 left-1/2 transform -translate-x-1/2 py-2 px-4 bg-primaryText text-white rounded-md shadow-lg">
          Link copied to clipboard!
        </div>
      )}
    </div>
  );
}
