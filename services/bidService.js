import pool from "@/config/db";


export async function placeBidService({
  auctionId,
  newBid,
}) {
  const db = await pool.connect();

  try {
    await db.query("BEGIN");

    const result = await db.query(
      `SELECT current_price, end_time
       FROM auctions
       WHERE id = $1
       FOR UPDATE`,
      [auctionId]
    );

    if (!result.rows.length) {
      await db.query("ROLLBACK");

      throw new Error("Auction not found");
    }

    const auction = result.rows[0];

    const now = Date.now();

    const timeLeft =
      new Date(auction.end_time).getTime() -
      now;

    // Auction already ended
    if (timeLeft <= 0) {
      await db.query("ROLLBACK");

      return {
        ended: true,
        highestBid: Number(
          auction.current_price
        ),
      };
    }

    // Bid must be higher
    if (
      Number(newBid) <=
      Number(auction.current_price)
    ) {
      await db.query("ROLLBACK");

      return {
        reject: true,
        highestBid: Number(
          auction.current_price
        ),
      };
    }

    let newEndTime = auction.end_time;
    let extended = false;

    // Anti-sniping
    if (timeLeft <= 5000) {
      newEndTime = new Date(now + 10000);
      extended = true;
    }

    await db.query(
      `UPDATE auctions
       SET current_price = $1,
           end_time = $2
       WHERE id = $3`,
      [newBid, newEndTime, auctionId]
    );

    await db.query(
      `INSERT INTO bids
       (auction_id, amount)
       VALUES ($1,$2)`,
      [auctionId, newBid]
    );

    const historyResult = await db.query(
      `SELECT amount
       FROM bids
       WHERE auction_id = $1
       ORDER BY id DESC
       LIMIT 10`,
      [auctionId]
    );

    await db.query("COMMIT");

    return {
      success: true,
      ended: false,
      newBid: Number(newBid),
      history: historyResult.rows,
      extended,
    };
  } catch (error) {
    await db.query("ROLLBACK");

    throw error;
  } finally {
    db.release();
  }
}