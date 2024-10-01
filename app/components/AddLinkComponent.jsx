import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/client";
import getStarted from "../assets/getstarted.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  platformColors,
  linkTypes,
  platformIcons,
} from "@/utils/platformUtils";
import { FaLink, FaChevronDown, FaChevronUp } from "react-icons/fa";

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-6">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="px-6 py-3 border rounded-lg bg-primaryBg">
        <div className="flex justify-between items-center py-3">
          <div className="h-5 bg-secondaryBg rounded w-1/4"></div>
          <div className="h-4 bg-secondaryBg rounded w-16"></div>
        </div>
        <div className="space-y-4">
          <div className="h-8 bg-secondaryBg rounded w-full"></div>
          <div className="h-8 bg-secondaryBg rounded w-full"></div>
        </div>
      </div>
    ))}
  </div>
);

const AddLinkComponent = ({ userId, onLinkUpdate, setUserLinks }) => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialLinks, setInitialLinks] = useState([]);
  // const [isDropdownOpen, setIsDropdownOpen] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const fetchUserLinks = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching add links component", error);
      } else {
        setLinks(data);
        setInitialLinks(JSON.parse(JSON.stringify(data)));
      }
    } catch (error) {
      console.error("Error fetching user links:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserLinks();
  }, [userId]);

  const isValidUrl = (url) => {
    const regex = /^(https?:\/\/)?[\w.-]+(\.[a-z]{2,})+([/?#].*)?$/i;
    return regex.test(url);
  };

  useEffect(() => {
    const hasValidLinks = links.every(
      (link) => link.type && isValidUrl(link.url)
    );

    const hasChanged = JSON.stringify(links) !== JSON.stringify(initialLinks);
    setHasChanges(hasChanged && hasValidLinks);
  }, [links, initialLinks]);

  const addNewLink = () => {
    setLinks((prevLinks) => [
      ...prevLinks,
      { type: "", url: "", icon: "", id: null },
    ]);
    setHasChanges(true); // Ensure save button is enabled
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    setLinks((prevLinks) => {
      const newLinks = [...prevLinks];
      newLinks[index][name] = value;
      return newLinks;
    });
    setHasChanges(true); // Detect changes as user inputs new values
  };

  const removeLink = (index, linkId) => {
    if (linkId) {
      supabase
        .from("links")
        .delete()
        .eq("id", linkId)
        .then(() => {
          console.log("Link removed successfully.");
          fetchUserLinks();
        })
        .catch((err) => console.error("Error deleting link:", err));
    }

    setLinks((prevLinks) => {
      const newLinks = prevLinks.filter((_, i) => i !== index);
      setHasChanges(true); // Manually set changes after link removal
      return newLinks;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Log if hasChanges is false
    if (!hasChanges) {
      console.log("No changes detected, skipping save");
      return;
    }

    setLoading(true);

    if (userId) {
      console.log("User ID:", userId);
      try {
        // Fetch existing links
        const { error: fetchError } = await supabase
          .from("links")
          .select("*")
          .eq("user_id", userId);

        if (fetchError) {
          console.error("Error fetching existing links:", fetchError);
          throw fetchError;
        }

        // Filter links to update and insert
        const linksToUpdate = links.filter((link) => link.id);
        const newLinks = links.filter((link) => !link.id);

        // Perform update
        if (linksToUpdate.length > 0) {
          const { error: updateError } = await supabase.from("links").upsert(
            linksToUpdate.map((link) => ({
              id: link.id,
              user_id: userId,
              type: link.type,
              url: link.url,
              color: platformColors[link.type],
              icon: link.type,
            }))
          );
          if (updateError) throw updateError;

          alert("Updated links successfully");
        }

        // Perform insert
        if (newLinks.length > 0) {
          const { error: insertError } = await supabase.from("links").insert(
            newLinks.map((link) => ({
              user_id: userId,
              type: link.type,
              url: link.url,
              color: platformColors[link.type],
              icon: link.type,
              created_at: new Date(),
            }))
          );
          if (insertError) throw insertError;

          console.log("Inserted new links successfully");
        }

        onLinkUpdate();
        await fetchUserLinks();
        setUserLinks(links);
        setHasChanges(false);
      } catch (error) {
        console.error("Error updating/saving links:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("User not authenticated");
      setLoading(false);
    }
  };

  // const toggleDropdown = (index) => {
  //   setIsDropdownOpen((prevState) => ({
  //     ...prevState,
  //     [index]: !prevState[index],
  //   }));
  // };

  return (
    <div className="mx-auto p-5 md:p-8 bg-white rounded-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Customize your links</h2>
        <p className="text-xs my-3 text-secondaryText leading-relaxed">
          Add/edit/remove links below and then share all your profiles to the
          world!
        </p>
      </div>
      <button
        type="button"
        onClick={addNewLink}
        className={`border-2 border-primaryPurple text-primaryPurple px-4 py-2 rounded-md mb-6 hover:bg-secondaryBg transition duration-200 w-full text-sm font-semibold`}
        disabled={loading}
      >
        + Add New Link
      </button>

      {loading ? (
        <SkeletonLoader />
      ) : links.length === 0 ? (
        <div className="text-center flex flex-col px-6 py-12 rounded-lg bg-primaryBg">
          <Image
            src={getStarted}
            alt="Get Started"
            width={300}
            height="auto"
            className="mx-auto"
          />
          <h2 className="text-2xl font-bold mb-2">Let&apos;s get you started</h2>
          <p className="text-xs mt-4 text-secondaryText leading-relaxed">
            Use the &quot;Add Link&quot; button to get started. Once you have more than
            one link, you can reorder and edit them. We&apos;re here to help you
            share your profile with everyone!
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {links.map((link, index) => (
              <div
                className="px-6 py-3 border rounded-lg bg-primaryBg"
                key={index}
              >
                <div className="flex justify-between items-center py-3">
                  <h2 className="text-md font-semibold text-primaryText">
                    Link #{index + 1}
                  </h2>
                  <button
                    type="button"
                    onClick={() => removeLink(index, link.id)}
                    className="font-light text-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-secondaryText mb-2">
                    Platform
                  </label>
                  <div className="relative">
                    {/* Dropdown select */}
                    <select
                      name="type"
                      value={link.type}
                      onChange={(e) => handleInputChange(index, e)}
                      onClick={() => setIsOpen(!isOpen)} // Toggle open/close state on click
                      onBlur={() => setIsOpen(false)} // Close when dropdown loses focus
                      className="w-full pl-9 pr-9 py-2 text-xs border rounded-md bg-white shadow-sm text-primaryText appearance-none"
                      required
                    >
                      <option value="">Select Platform</option>
                      {linkTypes.map((type, idx) => (
                        <option key={idx} value={type.type}>
                          {type.type}
                        </option>
                      ))}
                    </select>

                    {/* Platform icon (if available) */}
                    {link.type && platformIcons[link.type] && (
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {React.createElement(platformIcons[link.type])}
                      </div>
                    )}

                    {/* Dropdown arrow */}
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      {isOpen ? (
                        <FaChevronUp className="text-primaryPurple" /> // Arrow pointing up when open
                      ) : (
                        <FaChevronDown className="text-primaryPurple" /> // Arrow pointing down when closed
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-secondaryText mb-2">
                    Link
                  </label>
                  <div className="relative flex items-center">
                    <FaLink className="absolute text-xs left-3 text-secondaryText" />
                    <input
                      type="text"
                      name="url"
                      value={link.url}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full pl-8 pr-3 py-2 border text-xs rounded-md bg-white shadow-sm text-primaryText"
                      placeholder="https://"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </form>
      )}
      <div className="flex w-full  md:justify-end mt-8">
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
          disabled={!hasChanges || loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default AddLinkComponent;
