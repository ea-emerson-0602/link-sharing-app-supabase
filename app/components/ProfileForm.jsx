import { useState, useEffect } from "react";
import { supabase } from "../../lib/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const UserProfile = ({ userId }) => {
  const [profileData, setProfileData] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(""); // Email fetched from the auth session
  
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null); // State to store uploaded image
  const [preview, setPreview] = useState(null); // State to store image preview URL

  useEffect(() => {
    fetchProfile();
    fetchAvatarUrl();
  }, []);

  const fetchProfile = async () => {
    try {
      // Fetch authenticated user's email
      const { data: { session } } = await supabase.auth.getSession();
      const userEmail = session?.user?.email;

      if (!userEmail) {
        console.error("No authenticated user found");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      setProfileData(data);
      setFullName(data?.full_name || "");
      setEmail(userEmail || data?.email || ""); // Set the email from the auth session or the profile
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
        setPreview(data.publicUrl);
      }
    } catch (error) {
      console.error("Error fetching avatar URL:", error.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userEmail = session?.user?.email;

      if (!userEmail) {
        alert("No authenticated user found");
        setLoading(false);
        return;
      }

      // Upsert the profile with the user's email
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          full_name: fullName,
          email: userEmail, // Ensure email is set from the auth session
        });

      if (error) throw error;

      if (profilePicture) {
        const { error: uploadError } = await supabase.storage
          .from("avatar")
          .upload(`public/${userId}/avatar.png`, profilePicture, {
            upsert: true,
          });

        if (uploadError) throw uploadError;
      }

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert("There was an error updating your profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Your Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <Input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              type="email"
              id="email"
              value={email} // Display the fetched email
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.doe@example.com"
              className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              // disabled // Disable the email field if you don't want the user to edit it
              required
            />
          </div>
          <div>
            <label
              htmlFor="uploadImage"
              className="cursor-pointer flex items-center justify-center w-64 h-64 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 focus:outline-none"
              style={{
                backgroundImage: preview ? `url(${preview})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!preview ? (
                <span className="text-gray-700">Upload Image</span>
              ) : (
                <span className="text-white bg-black bg-opacity-50 px-3 py-1 rounded-lg">
                  Change Image
                </span>
              )}
            </label>
            <input
              type="file"
              id="uploadImage"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
