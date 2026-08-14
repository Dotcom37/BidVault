export type Auction = {
  id: number;
  title: string;
  description: string | null;
  category: string;
  start_price: number;
  current_price: number;
  end_time: string;
  is_active?: boolean;
};

export type Bid = {
  amount: number;
};

export type AuctionRoomData = {
  highestBid: number;
  timeLeft: number;
  history: Bid[];
};