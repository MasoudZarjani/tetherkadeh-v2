export function useCurrencyValue(value: any) {
  if (value.indexOf(".") >= 0) {
    const intNumber = value.substr(0, value.indexOf("."));
    const decNumber = value.substr(value.indexOf("."), 4);
    const result = intNumber
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return result + decNumber;
  } else {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
