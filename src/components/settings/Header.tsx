import React from "react";
import { Settings as SettingsIcon } from "lucide-react";

type SettingsHeaderProps = {
  title?: string;
  subtitle?: string;
};

const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  title = "Settings",
  subtitle,
}) => {
  return (
    <header className="w-full mt-3">
      <div className="mx-auto px-6">
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white/70  backdrop-blur p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-2xl p-2 border border-zinc-200  bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10">
              <SettingsIcon className="h-6 w-6 text-indigo-600 " />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                <span className="text-zinc-800">{title}</span>
              </h2>
              {subtitle && (
                <p className="mt-1 text-sm text-zinc-500 ">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        </div>
      </div>
    </header>
  );
};

export default SettingsHeader;
