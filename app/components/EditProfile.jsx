import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaImage } from "react-icons/fa";
import { IoInformationCircle } from "react-icons/io5";
import UserProfileSkeleton from "./UserProfileSkeleton";

const UserProfile = ({ userId, onProfileUpdate }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const [initialProfile, setInitialProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profilePicture: null,
  });

  const [profileUpdated, setProfileUpdated] = useState(false);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (data) {
        const [fName, lName] = data.full_name.split(" ");
        setFirstName(fName);
        setLastName(lName);
        setEmail(data.email);

        const { data: imageData } = supabase.storage
          .from("avatar")
          .getPublicUrl(`public/${userId}/avatar.png`);

        if (imageData.publicUrl) {
          const imageUrl = `${imageData.publicUrl}?t=${Date.now()}`;
          setProfilePicture(imageUrl);
          setPreview(imageUrl);
        }

        setInitialProfile({
          firstName: fName,
          lastName: lName,
          email: data.email,
          profilePicture: imageData.publicUrl ? `${imageData.publicUrl}?t=${Date.now()}` : null,
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  useEffect(() => {
    const hasProfileChanged =
      firstName !== initialProfile.firstName ||
      lastName !== initialProfile.lastName ||
      email !== initialProfile.email ||
      profilePicture !== initialProfile.profilePicture;

    setProfileUpdated(hasProfileChanged);
  }, [firstName, lastName, email, profilePicture, initialProfile]);

  const validateName = (name) => {
    const nameRegex = /^[A-Za-z]{3,}$/;
    return nameRegex.test(name);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = function () {
        const isValid =
          this.width <= 1024 &&
          this.height <= 1024 &&
          (file.type === "image/png" || file.type === "image/jpeg");
        resolve(isValid);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const isValid = await validateImage(file);
      if (isValid) {
        setProfilePicture(file);
        setPreview(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, profilePicture: "" }));
      } else {
        setErrors((prev) => ({
          ...prev,
          profilePicture:
            "Image must be below 1024x1024px and in PNG or JPG format.",
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newErrors = {};
    if (!validateName(firstName))
      newErrors.firstName =
        "First name must be at least 3 letters long and contain only letters.";
    if (!validateName(lastName))
      newErrors.lastName =
        "Last name must be at least 3 letters long and contain only letters.";
    if (!validateEmail(email))
      newErrors.email = "Please enter a valid email address.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: userId, full_name: `${firstName} ${lastName}`, email });

      if (error) throw error;

      let newProfilePicture = profilePicture;
      if (profilePicture && profilePicture instanceof File) {
        const { error: uploadError } = await supabase.storage
          .from("avatar")
          .upload(`public/${userId}/avatar.png`, profilePicture, {
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { data: imageData } = supabase.storage
          .from("avatar")
          .getPublicUrl(`public/${userId}/avatar.png`);

        newProfilePicture = `${imageData.publicUrl}?t=${Date.now()}`;
        setProfilePicture(newProfilePicture);
        setPreview(newProfilePicture);
      }

      setInitialProfile({
        firstName,
        lastName,
        email,
        profilePicture: newProfilePicture,
      });
      setProfileUpdated(false);
      onProfileUpdate(newProfilePicture); // Pass the new profile picture URL to the parent component
      
      // Refetch the profile to ensure all data is up to date
      await fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert("There was an error updating your profile.");
    } finally {
      setLoading(false);
    }
  };

  const ErrorMessage = ({ message }) => (
    <div className="flex items-center mt-1 text-error">
      <IoInformationCircle className="mr-1" />
      <span className="text-sm">{message}</span>
    </div>
  );

  if (loading) {
    return <UserProfileSkeleton />;
  }

  return (
    <div className="flex items-center justify-center bg-primaryBg text-secondaryText">
      <div className="lg:p-8 p-5 bg-white shadow-lg rounded-lg w-full">
        <div className="pb-6">
          <h2 className="text-2xl font-bold mb-2">Profile Details</h2>
          <p className="text-xs mt-4 text-secondaryText leading-relaxed">
            Add your details to create a personal touch to your profile.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-evenly w-full bg-primaryBg rounded-xl md:rounded-2xl lg:rounded-3xl py-6 px-4 md:px-6 lg:px-8">
            <div className="md:flex-1 md:px-6 w-full md:w-0 text-sm pb-4">
              Profile Picture
            </div>

            <label
              htmlFor="uploadImage"
              className="flex-none flex-col w-4/5 md:w-1/3 cursor-pointer text-primaryPurple flex items-center md:justify-center justify-center md:h-64 h-48 bg-secondaryBg rounded-lg md:rounded-xl lg:rounded-2xl"
              style={{
                backgroundImage: preview ? `url(${preview})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!preview ? (
                <>
                  <FaImage className="text-primaryPurple text-[40px]" />
                  <p className="font-bold">+ Upload Image</p>
                </>
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

            <div className="md:flex-1 md:px-6 w-full md:w-0 text-sm pt-4">
              <span className="text-sm">
                Image must be below 1024×1024px.
                <p className="text-sm">Use PNG or JPG formats.</p>
              </span>
            </div>
            {errors.profilePicture && (
              <ErrorMessage message={errors.profilePicture} />
            )}
          </div>

          <div className="space-y-6 bg-primaryBg rounded-xl md:rounded-2xl lg:rounded-3xl py-6 px-4 md:px-6 lg:px-8">
            <div className="flex flex-col">
              <div className="flex flex-col md:flex-row items-center">
                <label
                  htmlFor="firstName"
                  className="md:flex-1 w-full md:w-0 text-sm font-medium"
                >
                  First name*
                </label>
                <div className="flex flex-col w-full mt-1 text-sm md:flex-grow-[2] md:w-0">
                <Input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (validateName(e.target.value)) {
                      setErrors((prev) => ({ ...prev, firstName: "" }));
                    }
                  }}
                  placeholder="e.g. John"
                  className={` bg-white  rounded-md md:rounded-[8px] border-gray-300 shadow-sm focus:ring-primaryPurple focus:border-primaryPurple py-5 ${
                    errors.firstName ? "border-error text-error" : ""
                  }`}
                  required
                />
                 {errors.firstName && <ErrorMessage message={errors.firstName} />}
                </div>
              </div>
             
            </div>

            <div className="flex flex-col">
              <div className="flex flex-col md:flex-row items-center">
                <label
                  htmlFor="lastName"
                  className="md:flex-1 w-full md:w-0 text-sm font-medium"
                >
                  Last name*
                </label>
                <div className="flex flex-col w-full mt-1 text-sm md:flex-grow-[2] md:w-0">
                <Input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (validateName(e.target.value)) {
                      setErrors((prev) => ({ ...prev, lastName: "" }));
                    }
                  }}
                  placeholder="e.g. Doe"
                  className={` bg-white rounded-md md:rounded-[8px] border-gray-300 shadow-sm focus:ring-primaryPurple focus:border-primaryPurple py-5 ${
                    errors.lastName ? "border-error text-error" : ""
                  }`}
                  required
                />
                {errors.lastName && <ErrorMessage message={errors.lastName} />}
                </div>

              </div>
              
            </div>

            <div className="flex flex-col">
              <div className="flex flex-col md:flex-row items-center">
                <label
                  htmlFor="email"
                  className="md:flex-1 w-full md:w-0 text-sm font-medium"
                >
                  Email*
                </label>
                <div className="flex flex-col w-full mt-1 text-sm md:flex-grow-[2] md:w-0">
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validateEmail(e.target.value)) {
                      setErrors((prev) => ({ ...prev, email: "" }));
                    }
                  }}
                  placeholder="e.g. johndoe@example.com"
                  className={` bg-white rounded-md md:rounded-[8px] border-gray-300 shadow-sm focus:ring-primaryPurple focus:border-primaryPurple py-5 ${
                    errors.email ? "border-error" : ""
                  }`}
                  required
                />
                {errors.email && <ErrorMessage message={errors.email} />}
              </div>
              </div>
              
            </div>
          </div>
        </form>
        <div className="flex w-full md:justify-end mt-8">
          <Button
            onClick={handleSubmit}
            type="submit"
            className={`
              py-2 px-6 
              border border-transparent 
              rounded-md 
              shadow-sm 
              w-full
              md:w-fit
              text-white 
              bg-primaryPurple 
              transition-all 
              duration-300 
              ease-in-out
              hover:bg-primaryPurple/90
              hover:shadow-lg
              focus:outline-none 
              focus:ring-2 
              focus:ring-offset-2 
              focus:ring-primaryPurple
              disabled:opacity-50
              disabled:cursor-not-allowed
              disabled:hover:scale-100
              disabled:hover:bg-primaryPurple
              disabled:hover:shadow-sm
            `}
            disabled={loading || !profileUpdated}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;