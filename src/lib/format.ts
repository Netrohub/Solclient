import { formatDistanceToNow, parseISO } from "date-fns";

export function formatRelativeTimestamp(value: string | Date): string {
  const date = typeof value === "string" ? parseISO(value) : value;
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}

export function formatPercentage(value: number | null | undefined, fractionDigits = 1): string {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "—";
  }
  return `${value.toFixed(fractionDigits)}%`;
}
