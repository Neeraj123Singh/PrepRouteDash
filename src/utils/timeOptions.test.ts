import { describe, expect, it } from 'vitest';
import {
  buildTimeSlotOptions,
  formatTime12h,
  snapToTimeSlot,
} from './timeOptions';

describe('timeOptions', () => {
  it('builds 48 half-hour slots', () => {
    const options = buildTimeSlotOptions();
    expect(options).toHaveLength(48);
    expect(options[0]).toEqual({ value: '00:00', label: '12:00 AM' });
    expect(options[1]).toEqual({ value: '00:30', label: '12:30 AM' });
    expect(options[47]).toEqual({ value: '23:30', label: '11:30 PM' });
  });

  it('formats noon and midnight', () => {
    expect(formatTime12h(0, 0)).toBe('12:00 AM');
    expect(formatTime12h(12, 0)).toBe('12:00 PM');
    expect(formatTime12h(12, 30)).toBe('12:30 PM');
  });

  it('snaps to nearest 30-minute slot', () => {
    expect(snapToTimeSlot('14:10')).toBe('14:00');
    expect(snapToTimeSlot('14:44')).toBe('14:30');
    expect(snapToTimeSlot('14:50')).toBe('15:00');
  });
});
