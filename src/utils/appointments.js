// Small helpers for appointment status. Kept separate from the Redux slice
// so they are plain functions that are easy to read and test.
import { parseTime } from "./slots";

export const STATUS = {
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled"
};

// Appointment date ("2026-10-21") + time label ("2:00 PM") -> a real Date.
export function appointmentDateTime(appointment) {
  const [year, month, day] = String(appointment.date).split("-").map(Number);
  const minutes = parseTime(appointment.time) ?? 0;
  return new Date(year, month - 1, day, Math.floor(minutes / 60), minutes % 60);
}

export const isCancelled = (appointment) => appointment.status === STATUS.CANCELLED;

// A confirmed appointment whose time has passed.
export const isPast = (appointment, now = new Date()) =>
  !isCancelled(appointment) && appointmentDateTime(appointment) < now;

export const isUpcoming = (appointment, now = new Date()) =>
  !isCancelled(appointment) && appointmentDateTime(appointment) >= now;

// What the patient sees on the badge. "Past" is worked out from the date,
// because nobody confirms that a visit really happened.
export function displayStatus(appointment, now = new Date()) {
  if (isCancelled(appointment)) return "Cancelled";
  return isPast(appointment, now) ? "Past" : "Confirmed";
}

// Soonest first.
export const byDateAsc = (a, b) => appointmentDateTime(a) - appointmentDateTime(b);

// "2026-10-21" -> "Wed, 21 Oct 2026"
export function formatDate(iso) {
  const [year, month, day] = String(iso).split("-").map(Number);
  if (!year) return iso;
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
