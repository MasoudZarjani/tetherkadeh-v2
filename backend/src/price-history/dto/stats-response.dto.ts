export class StatsResponseDto {
  symbol: string;
  from: Date;
  to: Date;
  latestPrice: number | null;
  openPrice: number | null;
  absChange: number | null;
  pctChange: number | null; // درصد تغییر
}
