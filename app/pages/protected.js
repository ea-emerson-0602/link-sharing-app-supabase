"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ProtectedPage({ children }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Immediately redirect unauthenticated users without adding history
        router.replace("/login");
      } else {
        setLoading(false);
      }
    };

    // Check authentication right away
    checkUser();
  }, [router]);

  if (loading) {
    return null; // Render nothing until authentication check is complete
  }

  return <>{children}</>;
}
