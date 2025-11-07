export const useDigitNumber = (price: number, decimal: number) => {
  return Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimal,
  }).format(Number(Math.floor(price * 10 ** decimal) / 10 ** decimal));
};
