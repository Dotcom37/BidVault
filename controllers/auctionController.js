import pool from "@/config/db";
import {
  getAuctionService,
  getGroupedAuctionsService,
  getLiveAuctionsService,
  searchAuctionsService,
} from "@/services/auctionService";
import { protect } from "@/middleware/authMiddleware";

export async function createAuction(request) {
  const { user, error } = protect(request);
  if (error) return error;

  try {
    const {
      title,
      description = "",
      category = "other",
      start_price,
      end_time,
    } = await request.json();

    const price = Number(start_price);
    const endDate = new Date(end_time);

    if (!title?.trim() || !Number.isFinite(price) || price <= 0 || !end_time || Number.isNaN(endDate.getTime())) {
      return Response.json(
        { message: "Please provide a title, valid starting price, and valid end time." },
        { status: 400 }
      );
    }

    if (endDate.getTime() <= Date.now()) {
      return Response.json(
        { message: "End time must be in the future." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO auctions
       (title, description, category, start_price, current_price, end_time, is_active, seller_id)
       VALUES ($1, $2, $3, $4, $4, $5, true, $6)
       RETURNING *`,
      [
        title.trim(),
        description.trim(),
        category.trim() || "other",
        price,
        endDate.toISOString(),
        user.id,
      ]
    );

    return Response.json(
      {
        message: "Auction created successfully.",
        auction: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE AUCTION ERROR:", error);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}

export async function getLiveAuctions() {
  try {
    return Response.json(await getLiveAuctionsService());
  } catch (error) {
    console.error("GET LIVE AUCTIONS ERROR:", error);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}

export async function getGroupedAuctions() {
  try {
    return Response.json(await getGroupedAuctionsService());
  } catch (error) {
    console.error("GET GROUPED AUCTIONS ERROR:", error);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}

export async function searchAuctions(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    return Response.json(await searchAuctionsService(q));
  } catch (error) {
    console.error("SEARCH AUCTION ERROR:", error);
    return Response.json({ error: "Search failed" }, { status: 500 });
  }
}

export async function getAuction(request, auctionId) {
  try {
    const auction = await getAuctionService(auctionId);
    if (!auction) {
      return Response.json({ error: "Auction not found" }, { status: 404 });
    }
    return Response.json(auction);
  } catch (error) {
    console.error("GET AUCTION ERROR:", error);
    return Response.json({ error: "Failed to fetch auction" }, { status: 500 });
  }
}
