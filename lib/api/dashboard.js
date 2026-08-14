const API_URL = "/api/auth/dashboard";

export async function getDashboard() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.error || data.message || "Failed to fetch dashboard"
    );
  }

  return data;
}