// app/api/auth/register/route.js

import { resendOtp } from "@/controllers/authController";

export async function POST(request) {
  return resendOtp(request);
}