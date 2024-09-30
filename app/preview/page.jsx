"use client";
import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Display from "../components/Display";
import DisplayLinksComponent from "../components/DisplayLinkComponent";

export default function ProfilPreview() {
  const [userId, setUserId] = useState(null);
  const [userLinks, setUserLinks] = useState([]);
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [loading, setLoading] = useState(true);

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
        console.error("Error line 27 add comp", error);
      } else {
        setUserLinks(data);
      }
    } catch (error) {
      console.error("Error line 32 add comp:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-primaryBg">
      <div className="h-[33vh] rounded-b-3xl p-4 bg-primaryPurple">
        <nav className="flex justify-between bg-white content-center items-center w-full rounded-lg p-3 ">
          <button className="flex space-x-8">
            <Link
              href="/"
              className=" px-5 py-1 text-sm font-medium rounded-md text-primaryPurple border-2 border-primaryPurple hover:bg-secondaryBg hover:text-primaryPurple"
            >
              Back to Editor
            </Link>
          </button>
          <div className=" px-5 py-1 text-sm font-medium rounded-md text-white bg-primaryPurple cursor-not-allowed">
            Preview
          </div>
        </nav>
      </div>
      <div className=""></div>

      <div className="absolute top-10 left-0 right-0 z-50 flex flex-col items-center mx-auto mt-20  bg-white shadow-lg py-6 rounded-lg w-[280px]">
        <Display className="mx-auto" userId={userId} key={profileUpdated} />
        <DisplayLinksComponent userLinks={userLinks} userId={userId} />
      </div>
    </div>
  );
}
