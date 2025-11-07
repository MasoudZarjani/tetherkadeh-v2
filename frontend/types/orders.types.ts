export interface Order {
  createdAt: string
  side: string
  price: number
  amount: number
  trackId: string
  symbol: any
  pairSymbol: any
  status: string
}
