import { searchAuctions } from "@/controllers/auctionController";

export async function GET(request) {
  return searchAuctions(request);
}
