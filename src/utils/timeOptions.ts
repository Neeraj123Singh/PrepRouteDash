export interface TimeOption {
  value: string;
  label: string;
}

/** 48 slots per day: every 30 minutes, labels like 12:00 AM, 12:30 AM. Values are 24h HH:mm. */
export function buildTimeSlotOptions(): TimeOption[] {
  const options: TimeOption[] = [];
  for (let hour = 0; hour < 24; hour += 1) {
    for (const minute of [0, 30]) {
      const value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      options.push({ value, label: formatTime12h(hour, minute) });
    }
  }
  return options;
}

export function formatTime12h(hour24: number, minute: number): string {
  const period = hour24 < 12 ? 'AM' : 'PM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${String(minute).padStart(2, '0')} ${period}`;
}

/** Snap arbitrary HH:mm to nearest 30-minute slot (for legacy values). */
export function snapToTimeSlot(value: string): string {
  if (!value.includes(':')) return '';
  const [hRaw, mRaw] = value.split(':');
  const hour = Math.min(23, Math.max(0, Number.parseInt(hRaw, 10) || 0));
  const minute = Math.min(59, Math.max(0, Number.parseInt(mRaw, 10) || 0));
  const snappedMinute = minute < 15 ? 0 : minute < 45 ? 30 : 0;
  const snappedHour = minute >= 45 ? (hour + 1) % 24 : hour;
  return `${String(snappedHour).padStart(2, '0')}:${String(snappedMinute).padStart(2, '0')}`;
}

export const TIME_SLOT_OPTIONS = buildTimeSlotOptions();
