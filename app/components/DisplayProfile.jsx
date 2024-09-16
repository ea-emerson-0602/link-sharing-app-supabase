import { useEffect, useState } from "react";
import { supabase } from "../../lib/client";

const DisplayProfile = ({ userId }) => {
  const [profileData, setProfileData] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchAvatarUrl();
  }, []);

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
    }
  };

  const fetchAvatarUrl = async () => {
    try {
      const { data, error } = supabase.storage
        .from("avatar")
        .getPublicUrl(`public/${userId}/avatar.png`);

      if (error && error.status !== 404) {
        throw error;
      }

      if (data.publicUrl) {
        setAvatarUrl(data.publicUrl);
      }
    } catch (error) {
      console.error("Error fetching avatar URL:", error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Your Profile
        </h2>
        {profileData && (
          <div className="space-y-6 text-center">
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt="Profile Avatar"
                className="w-32 h-32 rounded-full mx-auto"
              />
            )}
            <p className="text-lg font-semibold">{profileData.full_name}</p>
            <p className="text-gray-600">{profileData.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayProfile;
