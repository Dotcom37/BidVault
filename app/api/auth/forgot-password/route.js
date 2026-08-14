import { forgotPassword } from "@/controllers/authController";

export async function POST(request) {
  return forgotPassword(request);
}
