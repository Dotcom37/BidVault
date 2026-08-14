import {
  getGroupedAuctionsService,
  getLiveAuctionsService,
} from "@/services/auctionService";

export async function getLiveAuctions() {
  try {
    return Response.json(await getLiveAuctionsService());
  } catch (error) {
    console.error("GET LIVE HOME AUCTIONS ERROR:", error);
    return Response.json({ error: "Failed to fetch auctions" }, { status: 500 });
  }
}

export async function getGroupedAuctions() {
  try {
    return Response.json(await getGroupedAuctionsService());
  } catch (error) {
    console.error("GET GROUPED HOME AUCTIONS ERROR:", error);
    return Response.json({ error: "Failed to fetch auctions" }, { status: 500 });
  }
}
