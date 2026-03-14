/**
 * Formats an ISO date string or Date object into a readable string:
 * "DD MMM YYYY, HH:mm" (e.g., "12 Mar 2026, 14:30")
 * @param date - The date string or Date object to format
 * @returns Formatted date string or "—" if invalid
 */
export function formatFullDate(date: string | Date | undefined | null): string {
  if (!date) return "—";

  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "—";

    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (e) {
    return "—";
  }
}
