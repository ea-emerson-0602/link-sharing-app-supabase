// components/LogoutButton.js
"use client";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

const LogoutButton = () => {
  const router = useRouter(); // Initialize the Next.js router

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(user);
    if (error) {
      console.error("Error logging out:", error);
    } else {
      // Redirect to the login page after successful logout
      router.push("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
