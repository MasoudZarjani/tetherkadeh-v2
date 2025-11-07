export interface Symbol {
  name: string;
  persianName: string;
  slug: string;
  symbol: string;
  imagePath: string;
  buyingPriceGap: number;
  sellingPriceGap: number;
  buyingPriceGapPercentage: number;
  sellingPriceGapPercentage: number;
  numberOfDecimalPlaces: number;
  status: boolean;
}
