// app/api/auth/register/route.js

import { verifyOtp } from "@/controllers/authController";

export async function POST(request) {
  return verifyOtp(request);
}