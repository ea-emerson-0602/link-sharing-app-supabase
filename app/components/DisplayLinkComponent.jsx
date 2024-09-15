"use client";
import React from "react";

// Supabase client
import { supabase } from "@/lib/client";

const DisplayLinksComponent = ({ userLinks }) => {
  const openLinkInNewTab = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Your Links</h2>
      {userLinks.length === 0 ? (
        <div className="p-4 border rounded-md text-center text-gray-500">
          No links available. Add some links above.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {userLinks.map((link, index) => (
            <div
              key={index}
              className="p-4 rounded-md text-center cursor-pointer"
              style={{ backgroundColor: link.color }}
              onClick={() => openLinkInNewTab(link.url)}
            >
              <p className="text-white font-bold">{link.type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayLinksComponent;
