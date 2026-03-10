/**
 * Generate a meeting link for a booking.
 * Uses Jitsi Meet (free, no OAuth) for MVP.
 * For production with Google Meet, integrate Google Calendar API + OAuth.
 */
export function generateMeetingLink(bookingId: string): string {
  const shortId = bookingId.replace(/-/g, "").slice(0, 12);
  return `https://meet.jit.si/IELTSFlow-${shortId}`;
}

export const MEET_PROVIDER = "JITSI" as const;
