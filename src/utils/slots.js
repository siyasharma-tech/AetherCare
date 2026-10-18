// Date / time-slot helpers shared by the booking page and doctor dashboard.

const pad = (n) => String(n).padStart(2, "0");

// Today's date as YYYY-MM-DD in the user's LOCAL timezone
// (toISOString() would use UTC and can show yesterday/tomorrow).
export function todayISO(now = new Date()) {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// "2:30 PM" -> minutes since midnight (870). Returns null if unreadable.
export function parseTime(label) {
  const match = /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i.exec(String(label).trim());
  if (!match) return null;
  let hours = Number(match[1]) % 12;
  const minutes = Number(match[2] || 0);
  if (match[3].toUpperCase() === "PM") hours += 12;
  return hours * 60 + minutes;
}

export const compareTimes = (a, b) => {
  const x = parseTime(a);
  const y = parseTime(b);
  if (x === null && y === null) return String(a).localeCompare(String(b));
  if (x === null) return 1;
  if (y === null) return -1;
  return x - y;
};

export const isPastDate = (date) => Boolean(date) && date < todayISO();

// True when the slot's start time has already passed (only possible for today).
export function isPastSlot(date, time, now = new Date()) {
  if (date !== todayISO(now)) return false;
  const minutes = parseTime(time);
  if (minutes === null) return false;
  return minutes <= now.getHours() * 60 + now.getMinutes();
}

// Slots the doctor has removed for one specific date.
export const getBlockedSlots = (doctor, date) => doctor?.blockedSlots?.[date] || [];

// The doctor's daily slots minus anything they removed for that date.
export const getOpenSlots = (doctor, date) => {
  const blocked = getBlockedSlots(doctor, date);
  return doctor.timings.filter((time) => !blocked.includes(time));
};

// The next `count` days starting today: [{ iso, label }], e.g. "Tue, 20 Oct".
export function nextDays(count = 7, from = new Date()) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    const label = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
    return { iso: todayISO(d), label: i === 0 ? `Today · ${label}` : label };
  });
}
