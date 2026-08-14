import {
  getGroupedAuctions,
} from "@/controllers/homeController";

export async function GET() {
  return getGroupedAuctions();
}