"use client";

import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const clearUser = useAuthStore((state) => state.clearUser);

  const logout = () => {
    localStorage.removeItem("token");
    clearUser();
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
  };
}