import { ChevronRight } from "lucide-react";

export const Select: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}> = ({ value, onChange, options }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none rounded-xl border border-zinc-200  bg-white  px-3 py-2 pr-9 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    <ChevronRight
      className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rotate-90 opacity-50"
      size={18}
    />
  </div>
);
