/**
 * Localized date/time formatting using date-fns-tz.
 * Use for dashboards, bookings, and any user-facing dates.
 */
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { addDays } from "date-fns";

const DEFAULT_TZ = "UTC";

export function formatInTimezone(
  date: Date,
  fmt: string,
  tz = DEFAULT_TZ
): string {
  return formatInTimeZone(date, tz, fmt);
}

export function formatDateLocal(date: Date, tz = DEFAULT_TZ): string {
  return formatInTimeZone(date, tz, "MMM d, yyyy");
}

export function formatTimeLocal(date: Date, tz = DEFAULT_TZ): string {
  return formatInTimeZone(date, tz, "h:mm a");
}

export function formatDateTimeLocal(date: Date, tz = DEFAULT_TZ): string {
  return formatInTimeZone(date, tz, "MMM d, yyyy 'at' h:mm a");
}

export function toZoned(date: Date, tz = DEFAULT_TZ): Date {
  return toZonedTime(date, tz);
}

export function getDateRange(start: Date, days: number): Date[] {
  return Array.from({ length: days }, (_, i) => addDays(start, i));
}
