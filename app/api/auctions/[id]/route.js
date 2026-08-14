import { getAuction } from "@/controllers/auctionController";

export async function GET(request, { params }) {
  const { id } = await params;
  return getAuction(request, id);
}
