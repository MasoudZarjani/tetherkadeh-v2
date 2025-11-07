export default function (number: number, decimal: number) {
  return Number(Math.floor(number * 10 ** decimal) / 10 ** decimal);
}
