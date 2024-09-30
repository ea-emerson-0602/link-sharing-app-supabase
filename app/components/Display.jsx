import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/client";
import { User } from "lucide-react";

const DisplayProfile = ({ userId }) => {
  const [profileData, setProfileData] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageValid, setImageValid] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchAvatarUrl();
  }, [userId]);

  useEffect(() => {
    if (avatarUrl) {
      const img = new Image();
      img.onload = () => setImageValid(true);
      img.onerror = () => setImageValid(false);
      img.src = avatarUrl;
    }
  }, [avatarUrl]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) throw error;
      setProfileData(data);
    } catch (error) {
      console.error("Error fetching profile:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvatarUrl = async () => {
    try {
      const { data, error } = supabase.storage
        .from("avatar")
        .getPublicUrl(`public/${userId}/avatar.png`);
      if (error && error.status !== 404) throw error;

      // Append a timestamp to ensure the browser fetches the latest image, not the cached one
      const avatarUrlWithTimestamp = data?.publicUrl
        ? `${data.publicUrl}?t=${Date.now()}`
        : null;
      setAvatarUrl(avatarUrlWithTimestamp);
    } catch (error) {
      console.error("Error fetching avatar URL:", error.message);
    }
  };

  const ProfilePicture = () =>
    avatarUrl && imageValid ? (
      <div
        className="w-28 h-28 rounded-full border-4 border-purple-600 mx-auto bg-cover bg-center"
        style={{ backgroundImage: `url(${avatarUrl})` }}
        aria-label="Profile Picture"
      />
    ) : (
      <div className="w-28 h-28 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
        <User size={48} className="text-gray-400" />
      </div>
    );

  const ProfileDetail = ({ value, placeholder, className }) =>
    value ? (
      <div className={`${className}`}>{value}</div>
    ) : (
      <div className="w-40 h-5 bg-gray-200 rounded mx-auto">
        <span className="sr-only">{placeholder}</span>
      </div>
    );

  const ProfileSkeleton = () => (
    <div className="space-y-4 text-center animate-pulse">
      <div className="w-28 h-28 bg-secondaryBg rounded-full mx-auto" />
      <div className="w-48 h-6 bg-secondaryBg rounded mx-auto" />
      <div className="w-40 h-5 bg-secondaryBg rounded mx-auto" />
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center  p-4">
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-lg px-4 py-4 sm:px-28">
        <div className="space-y-4 text-center">
          <ProfilePicture />
          <ProfileDetail
            className="text-2xl font-bold"
            value={profileData?.full_name}
            placeholder="Full name not set"
          />
          <ProfileDetail
            value={profileData?.email}
            className="text-sm"
            placeholder="Email not set"
          />
        </div>
      </div>
    </div>
  );
};

export default DisplayProfile;
