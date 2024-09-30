"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/client";
import EditProfile from "./components/EditProfile";
import AddLinkComponent from "./components/AddLinkComponent";
import Display from "./components/Display";
import Image from "next/image";
import DisplayLinksComponent from "./components/DisplayLinkComponent";
import LogoutButton from "./components/LogoutButton";
import Link from "next/link";
import logo from "./assets/logo.svg";
import { useRouter } from "next/navigation";
import { FaLink, FaUser, FaEye } from "react-icons/fa";

const HomePage = () => {
  const [userId, setUserId] = useState(null);
  const [userLinks, setUserLinks] = useState([]);
  const [activePage, setActivePage] = useState("profile");
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [linkUpdated, setLinkUpdated] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const handleProfileUpdate = () => {
    setProfileUpdated((prev) => !prev);
  };
  const handleLinkUpdate = () => {
    setLinkUpdated((prev) => !prev);
  };

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
    <div className="bg-primaryBg min-h-screen flex flex-col">
      <div className="bg-primaryBg fixed top-0 left-0 right-0 z-50 p-4 mb-2">
        <nav className="flex justify-between bg-white content-center items-center rounded-md p-3">
          {/* Logo Section */}
          <div className="flex space-x-2 items-center">
            <Image src={logo} alt="Logo" width={28} height={28} />
            <span className="font-bold text-xl hidden md:inline">devlinks</span>
          </div>

          {/* Nav Buttons */}
          <div className="flex space-x-8">
            <button
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md ${
                activePage === "links"
                  ? "bg-secondaryBg text-primaryPurple"
                  : "text-secondaryText"
              }`}
              onClick={() => setActivePage("links")}
            >
              <FaLink />
              <span className="hidden md:inline">Links</span>{" "}
              {/* Hide text on small screens */}
            </button>
            <button
              className={`flex items-center space-x-2 px-4 text-sm font-medium rounded-md ${
                activePage === "profile"
                  ? "bg-secondaryBg text-primaryPurple"
                  : "text-secondaryText"
              }`}
              onClick={() => setActivePage("profile")}
            >
              <FaUser />
              <span className="hidden md:inline">Profile</span>{" "}
              {/* Hide text on small screens */}
            </button>
          </div>

          {/* Preview Button */}
          <button className="flex items-center space-x-2 px-4 py-1 text-sm font-medium rounded-md text-primaryPurple border-2 border-primaryPurple hover:bg-secondaryBg hover:text-primaryPurple">
            <FaEye />
            <Link href="/preview" className="hidden md:inline">
              Preview
            </Link>{" "}
            {/* Hide text on small screens */}
          </button>
        </nav>
      </div>
      <div className="flex h-full mt-24 mx-4 lg:space-x-4">
        <div className="bg-white hidden h-fit py-32 r-2  w-2/5 lg:flex flex-col justify-center rounded-xl items-center">
          <div
            className="px-16 py-8  bg-no-repeat bg-center bg-[url('./assets/preview-section.svg')]"
            style={{ height: "500px", backgroundSize: "contain" }}
          >
            <div className="w-fit">
              <Display userId={userId} key={profileUpdated} />
              <DisplayLinksComponent userLinks={userLinks} userId={userId} />
            </div>
          </div>
          <div className="flex justify-end mt-8">
            {userId && <LogoutButton>Sign Out</LogoutButton>}
          </div>
        </div>
        <div className="flex-1 rounded-lg w-3/5 ">
          {activePage === "profile" ? (
            <EditProfile
              userId={userId}
              onProfileUpdate={handleProfileUpdate}
            />
          ) : (
            <AddLinkComponent
              userId={userId}
              onLinkUpdate={handleLinkUpdate}
              setUserLinks={setUserLinks}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
