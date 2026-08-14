"use client";

import { useEffect } from "react";
import { getMe } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";

export default function AuthProvider({ children }) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        clearUser();
        return;
      }

      try {
        const data = await getMe();

        // Your backend returns { user: {...} }
        setUser(data.user);
      } catch (error) {
        console.error("AUTH ERROR:", error);

        localStorage.removeItem("token");
        clearUser();
      }
    };

    loadUser();
  }, [setUser, clearUser]);

  return children;
}