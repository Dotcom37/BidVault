import { protect } from "@/middleware/authMiddleware";
import { getMe } from "@/controllers/authController";

export async function GET(request) {
  const { user, error } = protect(request);

  if (error) {
    return error;
  }

  return getMe(request, user);
} 
