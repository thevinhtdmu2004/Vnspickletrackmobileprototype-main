import { Clock3 } from 'lucide-react';
import { MobileSelectSheet } from './MobileSelectSheet';

interface MobileTimePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minTime?: string;
  maxTime?: string;
  stepMinutes?: number;
}

function toMinutes(value: string) {
  const [hour, minute] = value.split(':').map(Number);
  return hour * 60 + minute;
}

function toTime(value: number) {
  return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
}

export function MobileTimePicker({
  label,
  value,
  onChange,
  minTime = '05:00',
  maxTime = '23:00',
  stepMinutes = 30,
}: MobileTimePickerProps) {
  const options = [];
  for (let current = toMinutes(minTime); current <= toMinutes(maxTime); current += stepMinutes) {
    const option = toTime(current);
    options.push({ value: option, label: option });
  }
  return (
    <MobileSelectSheet
      title={label}
      value={value}
      onChange={onChange}
      icon={Clock3}
      options={options}
    />
  );
}
