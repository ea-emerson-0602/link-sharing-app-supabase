"use client";

import { supabase } from "@/lib/client";
import Display from "../../components/Display";
import DisplayLinksComponent from "../../components/DisplayLinkComponent";
import Link from "next/link";
import { useState , useEffect } from "react";
import { useParams } from "next/navigation";
// Fetch user data based on the dynamic userId parameter
export default function ProfilePreview() {
  const [userId, setUserId] = useState(null);
  const [userLinks, setUserLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams(); // Get dynamic route params

  useEffect(() => {
    const userid = params.userid; // Destructure 'userid' from useParams
    if (userid) {
      setUserId(userid);
    }
  }, [params]);

  useEffect(() => {
    if (userId) {
      fetchUserLinks();
    }
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
        console.error("Error fetching user links:", error);
      } else {
        setUserLinks(data);
      }
    } catch (error) {
      console.error("Error fetching user links:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="relative min-h-screen md:bg-primaryBg">
        <div className="absolute top-10 left-0 right-0 z-50 flex flex-col items-center mx-auto mt-20 bg-white shadow-lg py-6 rounded-lg md:w-[280px] w-[80vw]">
          <Display className="mx-auto" userId={userId} />
          <DisplayLinksComponent userLinks={userLinks} userId={userId} />
        </div>
      </div>
  );
}