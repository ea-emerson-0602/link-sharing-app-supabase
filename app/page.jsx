"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../lib/client'
import ProfileForm from './components/EditProfile'
// import SocialMediaForm from './components/SocialMediaForm'
import UserProfile from './components/EditProfile'
import EditProfile from './components/EditProfile'
import DisplayProfile from "./components/DisplayProfile"
import AddLinkComponent from "./components/AddLinkComponent"

import DisplayLinksComponent from "./components/DisplayLinkComponent";
import LogoutButton from './components/LogoutButton'
import { useRouter } from "next/navigation";
const HomePage = () => {
  const [userId, setUserId] = useState(null)
  const [userLinks, setUserLinks] = useState([]);
  const [isEditing, setIsEditing] = useState(true);

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };
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
      {isEditing && (
          <>
            <EditProfile userId={userId} />
            <button
              onClick={handleToggleEdit}
              className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </>
         ) }
  
    </div>
  )
}

export default HomePage
