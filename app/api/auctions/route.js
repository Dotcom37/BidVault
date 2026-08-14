import { createAuction } from "@/controllers/auctionController";

export async function POST(request) {
  return createAuction(request);
}