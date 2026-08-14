import { protect } from "@/middleware/authMiddleware";
import { getDashboard } from "@/controllers/authController";

export async function GET(request) {
  const { user, error } = protect(request);
  if (error) return error;
  return getDashboard(request, user);
}
