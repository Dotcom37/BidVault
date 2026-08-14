import { placeBidService } from "@/services/bidService";

export async function GET(_request, { params }) {
  const { id } = await params;

  try {
    const result = await import("@/config/db");
    const pool = result.default;
    const history = await pool.query(
      `SELECT amount
       FROM bids
       WHERE auction_id = $1
       ORDER BY id DESC
       LIMIT 10`,
      [id]
    );
    return Response.json(history.rows);
  } catch (error) {
    console.error("GET BID HISTORY ERROR:", error);
    return Response.json({ error: "Failed to fetch bid history" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const { id } = await params;

  try {
    const { amount } = await request.json();
    const bid = Number(amount);

    if (!Number.isFinite(bid) || bid <= 0) {
      return Response.json({ error: "Invalid bid amount" }, { status: 400 });
    }

    const result = await placeBidService({
      auctionId: id,
      newBid: bid,
    });

    if (result.ended) {
      return Response.json(
        { error: "Auction has ended", highestBid: result.highestBid },
        { status: 409 }
      );
    }

    if (result.reject) {
      return Response.json(
        { error: `Bid must be higher than ₹${result.highestBid.toLocaleString()}` },
        { status: 409 }
      );
    }

    return Response.json(result);
  } catch (error) {
    console.error("PLACE BID ERROR:", error);
    return Response.json({ error: "Failed to place bid" }, { status: 500 });
  }
}
