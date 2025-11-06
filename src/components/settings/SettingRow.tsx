export const Row: React.FC<{
  label: string;
  hint?: string;
  control: React.ReactNode;
}> = ({ label, hint, control }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
    <div className="sm:w-64">
      <div className="font-medium">{label}</div>
      {hint && <div className="text-sm text-zinc-500 mt-0.5">{hint}</div>}
    </div>
    <div className="flex-1">{control}</div>
  </div>
);
