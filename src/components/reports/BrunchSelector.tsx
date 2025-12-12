import { Building2 } from "lucide-react";
import { FC } from "react";
import { SelectPicker } from "rsuite";

interface BranchSelectProps {
  label: string;
  data: BranchOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
}

export interface BranchOption {
  label: string;
  value: string;
}

export const BranchSelect: FC<BranchSelectProps> = ({
  label,
  data,
  value,
  onChange,
  placeholder,
}) => (
  <div className="w-full md:w-64">
    <p className=" text-xs font-medium text-slate-500">{label}</p>
    <div className="relative">
      {/* <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /> */}
      <SelectPicker
        data={data}
        value={value ?? undefined}
        onChange={(val) => onChange((val as string) ?? null)}
        style={{ width: "100%" }}
        placeholder={placeholder}
        searchable
      />
    </div>
  </div>
);
