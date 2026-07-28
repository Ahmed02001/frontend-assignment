export function formatCurrency(value) {
  if (value === 0) return "FREE";
  return `$${Number(value).toFixed(2)}`;
}
