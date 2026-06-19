import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-BD").format(value);
}

export function toCsv<T extends Record<string, unknown>>(rows: T[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const body = rows.map((row) =>
    headers.map((header) => JSON.stringify(row[header] ?? "")).join(",")
  );
  return [headers.join(","), ...body].join("\n");
}
