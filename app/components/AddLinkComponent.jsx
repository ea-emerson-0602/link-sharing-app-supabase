"use client";
import React, { useState, useEffect } from "react";
import { FaGithub, FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";
import { supabase } from "@/lib/client";

const linkTypes = [
  { type: "GitHub", icon: <FaGithub /> },
  { type: "Facebook", icon: <FaFacebook /> },
  { type: "Instagram", icon: <FaInstagram /> },
  { type: "YouTube", icon: <FaYoutube /> },
  { type: "LinkedIn", icon: <FaLinkedin /> },
];

const colorOptions = ["#FF6347", "#1E90FF", "#32CD32", "#FFD700", "#6A5ACD"];

const AddLinkComponent = ({ userId, fetchUserLinks }) => {
  const [links, setLinks] = useState([{ type: "", url: "", color: "" }]);
  const [loading, setLoading] = useState(false);

  const addNewLink = () => {
    setLinks((prevLinks) => [...prevLinks, { type: "", url: "", color: "" }]);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    setLinks((prevLinks) => {
      const newLinks = [...prevLinks];
      newLinks[index][name] = value;
      return newLinks;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (userId) {
      try {
        // Insert links into Supabase for the logged-in user
        const { error } = await supabase.from("links").insert(
          links.map((link) => ({
            user_id: userId,
            type: link.type,
            url: link.url,
            color: link.color,
          }))
        );

        if (error) {
          console.error("Error saving links:", error);
        } else {
          fetchUserLinks(userId); // Refresh the user's links after saving
          console.log("Links saved successfully");
        }
      } catch (error) {
        console.error("Error saving links:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("User not authenticated");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit}>
        <button
          type="button"
          onClick={addNewLink}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-4"
        >
          Add New Link
        </button>
        <div className="space-y-4">
          {links.map((link, index) => (
            <div className="p-4 border rounded-md" key={index}>
              <h2 className="text-lg font-semibold mb-2">Link #{index + 1}</h2>
              <div className="mb-4">
                <label className="block mb-1">Link Type</label>
                <select
                  name="type"
                  value={link.type}
                  onChange={(e) => handleInputChange(index, e)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="" disabled>
                    Select Link Type
                  </option>
                  {linkTypes.map((type, idx) => (
                    <option key={idx} value={type.type}>
                      {type.type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1">Link URL</label>
                <input
                  type="url"
                  name="url"
                  value={link.url}
                  onChange={(e) => handleInputChange(index, e)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter the URL"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Select Color</label>
                <select
                  name="color"
                  value={link.color}
                  onChange={(e) => handleInputChange(index, e)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="" disabled>
                    Select Background Color
                  </option>
                  {colorOptions.map((color, idx) => (
                    <option key={idx} value={color} style={{ backgroundColor: color }}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mt-4 ${
            loading ? "opacity-50" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default AddLinkComponent;
