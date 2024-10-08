"use client";

import { supabase } from "@/lib/client";
import Display from "../../components/Display";
import DisplayLinksComponent from "../../components/DisplayLinkComponent";
import { useState , useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
// Fetch user data based on the dynamic userId parameter
export default function ProfilePreview() {
  const [userId, setUserId] = useState(null);
  const [userLinks, setUserLinks] = useState([]);
  const params = useParams(); // Get dynamic route params

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
    }
  };

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

  
  return (
      <div className="relative min-h-screen md:bg-primaryBg">
        <div className="absolute top-10 left-0 right-0 z-50 flex flex-col items-center mx-auto mt-20 bg-white shadow-lg py-6 rounded-lg md:w-[280px] w-[80vw]">
          <Display className="mx-auto" userId={userId} />
          <DisplayLinksComponent userLinks={userLinks} userId={userId} />
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
}