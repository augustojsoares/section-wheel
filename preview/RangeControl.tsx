interface RangeControlProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

export default function RangeControl({
  id,
  label,
  value,
  onChange,
  ...range
}: RangeControlProps) {
  return (
    <div className="range-control">
      <label htmlFor={id}>
        {label} · {value}
      </label>
      <input
        id={id}
        type="range"
        value={value}
        {...range}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
