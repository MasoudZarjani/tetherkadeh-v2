export interface Network {
  name: string;
  persianName: string;
  slug: string;
  address: string;
  imagePath: string;
  destinationTag: string;
  minDeposit: number;
  minWithdraw: number;
  numberOfDecimal: number;
  withdrawFee: number;
  isWithdraw: boolean;
  isDeposit: boolean;
  messageWithdraw: string;
  messageDeposit: string;
  symbol: any;
  status: boolean;
}
