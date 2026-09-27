export const STORE_CURRENCY = "BDT";

export function formatMoney(
  value: number,
  options: Pick<Intl.NumberFormatOptions, "minimumFractionDigits" | "maximumFractionDigits"> = {}
) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: STORE_CURRENCY,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(Number.isFinite(value) ? value : 0);
}
