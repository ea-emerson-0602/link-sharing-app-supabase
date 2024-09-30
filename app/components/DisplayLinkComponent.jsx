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

  return (
    <div className="h-[160px] w-[16vw] px-2 max-w-full mx-auto my-4 overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-1 gap-4">
        {updatedLinks.map((link, index) => {
          const IconComponent = link ? platformIcons[link.type] : null;

          return (
            <div
              key={index}
              className="p-2 h-10 rounded-lg text-white flex items-center justify-between text-center cursor-pointer"
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
    </div>
  );
};

export default DisplayLinksComponent;
