// app/api/auth/register/route.js

import { resetPassword } from "@/controllers/authController";

export async function POST(request) {
  return resetPassword(request);
}