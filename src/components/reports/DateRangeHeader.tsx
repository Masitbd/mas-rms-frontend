import { CalendarDays } from "lucide-react";
import { FC } from "react";
import { DatePicker } from "rsuite";

interface DateFieldProps {
  label: string;
  value: Date | null;
  onChange: (value: Date | null) => void;
  placeholder?: string;
}

export const DateField: FC<DateFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
}) => (
  <div className="flex-1">
    <p className="mb-1 text-xs font-medium text-slate-500">{label}</p>
    <div className="relative">
      {/* <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /> */}
      <DatePicker
        value={value ?? undefined}
        onChange={(val) => onChange(val ?? null)}
        oneTap
        cleanable={false}
        format="dd MMM yyyy"
        style={{ width: "100%" }}
        placeholder={placeholder}
        className=""
      />
    </div>
  </div>
);
