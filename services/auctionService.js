import pool from "@/config/db";

const auctionFields = `
  id,
  title,
  description,
  category,
  start_price,
  current_price,
  end_time,
  is_active
`;

export async function getLiveAuctionsService() {
  const result = await pool.query(
    `SELECT ${auctionFields}
     FROM auctions
     WHERE is_active = true
       AND end_time > NOW()
     ORDER BY id DESC
     LIMIT 20`
  );
  return result.rows;
}

export async function getGroupedAuctionsService() {
  const result = await pool.query(
    `SELECT
       category,
       JSON_AGG(
         JSON_BUILD_OBJECT(
           'id', id,
           'title', title,
           'description', description,
           'start_price', start_price,
           'current_price', current_price,
           'end_time', end_time,
           'is_active', is_active
         )
         ORDER BY id DESC
       ) AS items
     FROM auctions
     WHERE is_active = true
     GROUP BY category
     ORDER BY category`
  );

  return Object.fromEntries(
    result.rows.map((row) => [row.category, row.items])
  );
}

export async function searchAuctionsService(query = "") {
  const result = await pool.query(
    `SELECT ${auctionFields}
     FROM auctions
     WHERE title ILIKE $1
        OR description ILIKE $1
        OR category ILIKE $1
     ORDER BY id DESC
     LIMIT 20`,
    [`%${query}%`]
  );
  return result.rows;
}

export async function getAuctionService(auctionId) {
  const result = await pool.query(
    `SELECT ${auctionFields}
     FROM auctions
     WHERE id = $1`,
    [auctionId]
  );
  return result.rows[0] || null;
}

export async function joinAuctionService(auctionId) {
  const auction = await getAuctionService(auctionId);
  if (!auction) return null;

  const timeLeft = Math.max(
    0,
    Math.floor(
      (new Date(auction.end_time).getTime() - Date.now()) / 1000
    )
  );

  const historyResult = await pool.query(
    `SELECT amount
     FROM bids
     WHERE auction_id = $1
     ORDER BY id DESC
     LIMIT 10`,
    [auctionId]
  );

  return {
    auction,
    highestBid: Number(auction.current_price),
    timeLeft,
    history: historyResult.rows,
  };
}
