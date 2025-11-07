export interface Transaction {
  createdAt: string
  type: string
  coin: string
  amount: number
  transactionId: string
  note: string
  reason: string
  status: string
}
