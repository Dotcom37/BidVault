const API_URL = "/api/auth";

export async function registerUser({ name, email, password }) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Registration failed");
  }

  return data;
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
}

export async function verifyOtp({ email, otp }) {
  const res = await fetch(`${API_URL}/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      otp,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "OTP verification failed");
  }

  return data;
}

export async function resendOtp(email) {
  const res = await fetch(`${API_URL}/resend-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to resend OTP");
  }

  return data;
}

export async function forgotPassword(email) {
  const res = await fetch(`${API_URL}/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to send reset link");
  }

  return data;
}

export async function resetPassword({ token, newPassword }) {
  const res = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      newPassword,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Password reset failed");
  }

  return data;
}

export async function getMe() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch user");
  }

  return data;
}