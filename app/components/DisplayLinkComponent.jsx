"use client";
import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { platformIcons } from "@/utils/platformUtils";
import { supabase } from "@/lib/client";

const DisplayLinksComponent = ({ userId, userLinks }) => {
  const [loading, setLoading] = useState(true);
  const [updatedLinks, setUpdatedLinks] = useState([]);

  const openLinkInNewTab = (url) => {
    window.open(url, "_blank");
  };

  const fetchUpdatedLinks = async () => {
    if (userId) {
      setLoading(true);
      const { data, error } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });
      if (error) {
        console.error("Error fetching user links:", error);
      } else {
        setUpdatedLinks(data);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdatedLinks();
  }, [userLinks, userId]);

  // Skeleton Loader (render when loading is true)
  const renderSkeletonLoader = () => {
    return (
      <div className="animate-pulse space-y-4 flex flex-col items-center">
        {Array(3) // Render 3 skeleton items for placeholder
          .fill("")
          .map((_, index) => (
            <div
              key={index}
              className="bg-secondaryBg rounded-lg w-5/6 mx-2 p-2 h-10 
                  lg:w-[15vw]       // Desktop width
        md:w-[30vw]       // Medium screens
        sm:w-[80vw]       // Small screens
        xs:w-[80vw]" // Extra small screens
            ></div>
          ))}
      </div>
    );
  };

  return (
    <div
      className="h-[160px] px-2 w-5/6 mx-auto my-4 overflow-y-auto custom-scrollbar
        lg:w-[16vw]       // Desktop width
        md:w-[30vw]       // Medium screens
        sm:w-[80vw]       // Small screens
        xs:w-[80vw]" // Extra small screens
    >
      {loading ? (
        renderSkeletonLoader() // Show skeleton while loading
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {updatedLinks.map((link, index) => {
            const IconComponent = link ? platformIcons[link.type] : null;

            return (
              <div
                key={index}
                className="p-2 w-full h-10 rounded-lg text-white flex items-center justify-between text-center cursor-pointer"
                style={{ backgroundColor: link.color }}
                onClick={() => openLinkInNewTab(link.url)}
              >
                <div className="flex space-x-3 items-center">
                  {IconComponent &&
                    React.createElement(IconComponent, {
                      className: "text-base",
                    })}
                  <p className="text-xs font-semibold">{link.type}</p>
                </div>
                <FaArrowRight className="justify-end my-auto text-xs" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DisplayLinksComponent;
