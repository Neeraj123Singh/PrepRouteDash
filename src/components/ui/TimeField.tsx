import { useMemo } from 'react';
import { Select } from './Select';
import { snapToTimeSlot, TIME_SLOT_OPTIONS } from '../../utils/timeOptions';

interface TimeFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TimeField({
  id,
  label,
  value,
  onChange,
  placeholder = 'Select time',
}: TimeFieldProps) {
  const selectValue = useMemo(() => {
    if (!value) return '';
    const exact = TIME_SLOT_OPTIONS.some((o) => o.value === value);
    return exact ? value : snapToTimeSlot(value);
  }, [value]);

  return (
    <Select
      id={id}
      label={label}
      placeholder={placeholder}
      options={TIME_SLOT_OPTIONS}
      value={selectValue}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
