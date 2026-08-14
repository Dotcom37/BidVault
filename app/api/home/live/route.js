import {
  getLiveAuctions,
} from "@/controllers/homeController";

export async function GET() {
  return getLiveAuctions();
}