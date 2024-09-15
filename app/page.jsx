"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../lib/client'
import ProfileForm from './components/ProfileForm'
// import SocialMediaForm from './components/SocialMediaForm'
import UserProfile from './components/ProfileForm'
import AddLinkComponent from "./components/AddLinkComponent"

import DisplayLinksComponent from "./components/DisplayLinkComponent";
import LogoutButton from './components/LogoutButton'
import { useRouter } from "next/navigation";
const HomePage = () => {
  const [userId, setUserId] = useState(null)
  const [userLinks, setUserLinks] = useState([]);

  const router = useRouter(); 
  useEffect(() => {
    const getUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log(user)
      if (user) {
        setUserId(user.id); // Set the user's email
      }
    };
    getUserInfo();
  }, [])
  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        fetchUserLinks(session.user.id);
      }
    };

    fetchUserId();
  }, []);

  const fetchUserLinks = async (userId) => {
    const { data, error } = await supabase
      .from("links")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching links:", error);
    } else if (data) {
      setUserLinks(data);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Welcome to Your Dashboard</h1>

      {userId ? (
        <>
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Update Your Profile</h2>
            {/* <ProfileForm userId={userId} /> */}
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Add Social Media Accounts</h2>
            {/* <AddLinkComponent userId={userId} /> */}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Your Profile Information</h2>
            {/* <UserProfile userId={userId} /> */}
            {/* <DisplaySocialMedia userId={userId} /> */}
          </section>
          <div>
      <AddLinkComponent userId={userId} fetchUserLinks={fetchUserLinks} />
      <DisplayLinksComponent userLinks={userLinks} />
    </div>
        </>
      ) : (
        <p>Please sign in to access your dashboard.</p>
      )}

      {/* Add a logout button */}
      {userId && (
        <LogoutButton>Sign Out</LogoutButton>
      )}
    </div>
  )
}

export default HomePage
