export interface Order {
  _id: string;
  side: string;
  price: number;
  amount: number;
  createdAt: string;
  trackId: string;
  pairSymbol: any;
}
