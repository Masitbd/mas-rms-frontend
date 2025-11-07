"use client";
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Globe,
  Lock,
  Palette,
  ShieldCheck,
  User,
  Trash2,
  ChevronRight,
  Search,
  Save,
  Moon,
  Sun,
  Printer,
} from "lucide-react";
import PrintingCard from "@/components/settings/PrintingCard";
import SettingsHeader from "@/components/settings/Header";
import { Row } from "@/components/settings/SettingRow";
import { Select } from "@/components/settings/SettingSellect";

/**
 * Modern, production-ready Settings panel
 * - Responsive, keyboard accessible
 * - Animated with Framer Motion
 * - Pure React + Tailwind (no external UI kit)
 * - Drop-in: <SettingsPanel onApply={(values) => ...} />
 */

const categories = [
  //   { key: "account", label: "Account", icon: User },
  //   { key: "appearance", label: "Appearance", icon: Palette },
  //   { key: "notifications", label: "Notifications", icon: Bell },
  { key: "language", label: "Language & Region", icon: Globe },
  { key: "privacy", label: "Privacy", icon: Lock },
  { key: "security", label: "Security", icon: ShieldCheck },
  { key: "printing", label: "Printing", icon: Printer },
  { key: "danger", label: "Danger Zone", icon: Trash2 },
];

const SectionCard: React.FC<{
  title: string;
  desc?: string;
  children: React.ReactNode;
}> = ({ title, desc, children }) => (
  <div className="rounded-2xl border border-zinc-200  bg-white/70  backdrop-blur p-5 shadow-sm">
    <div className="mb-4">
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      {desc && <p className="text-sm text-zinc-500 mt-1">{desc}</p>}
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const Toggle: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
  id?: string;
  label?: string;
}> = ({ checked, onChange, id, label }) => (
  <button
    id={id}
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onChange(!checked);
      }
    }}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
      checked ? "bg-indigo-600" : "bg-zinc-300 "
    }`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
        checked ? "translate-x-5" : "translate-x-1"
      }`}
    />
    {label && <span className="sr-only">{label}</span>}
  </button>
);

const ColorDot: React.FC<{
  value: string;
  selected: boolean;
  onClick: () => void;
}> = ({ value, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`h-8 w-8 rounded-full border-2 transition-all ${
      selected
        ? "ring-4 ring-indigo-500/30 border-indigo-600"
        : "border-transparent"
    }`}
    style={{ backgroundColor: value }}
    aria-label={`Select ${value}`}
  />
);

const SearchBox: React.FC<{ value: string; onChange: (v: string) => void }> = ({
  value,
  onChange,
}) => (
  <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white  px-3 py-2 shadow-sm">
    <Search size={18} className="opacity-60" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search settings…"
      className="w-full bg-transparent outline-none text-sm"
    />
  </div>
);

const SettingsPanel = () => {
  const [active, setActive] = useState<string>("account");
  const [query, setQuery] = useState("");

  // STATE (example values you can wire to your store)
  const [profileName, setProfileName] = useState("BPS");
  const [email, setEmail] = useState("user@example.com");

  const [theme, setTheme] = useState<"system" | "light" | "dark">("system");
  const [brandColor, setBrandColor] = useState("#6366f1"); // indigo-500
  const [compact, setCompact] = useState(false);

  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);

  const [locale, setLocale] = useState("en-US");
  const [tz, setTz] = useState("Asia/Dhaka");

  const [twoFA, setTwoFA] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState("team");

  // NEW: Printing mode ("pos" or "printer")
  const [printMode, setPrintMode] = useState<"pos" | "printer">("pos");

  const values = useMemo(
    () => ({
      profileName,
      email,
      appearance: { theme, brandColor, compact },
      notifications: { email: notifEmail, push: notifPush, sms: notifSMS },
      i18n: { locale, timezone: tz },
      privacy: { profileVisibility },
      security: { twoFA },
      printing: { mode: printMode },
    }),
    [
      profileName,
      email,
      theme,
      brandColor,
      compact,
      notifEmail,
      notifPush,
      notifSMS,
      locale,
      tz,
      profileVisibility,
      twoFA,
      printMode,
    ]
  );

  const filteredCategories = useMemo(() => {
    if (!query.trim()) return categories;
    const q = query.toLowerCase();
    return categories.filter((c) => c.label.toLowerCase().includes(q));
  }, [query]);

  return (
    <>
      <SettingsHeader title="Setting" />
      <div className="w-full min-h-[640px] grid grid-cols-1 xl:grid-cols-[300px,1fr] gap-4 xl:gap-6 p-4 sm:p-6 text-zinc-900">
        {/* Sidebar */}
        <aside className="rounded-2xl border border-zinc-200 bg-white/70  backdrop-blur p-4 shadow-sm h-fit ">
          <div className="mb-3">
            <SearchBox value={query} onChange={setQuery} />
          </div>
          <nav className="space-y-1" aria-label="Settings categories">
            {filteredCategories.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  active === key
                    ? "bg-indigo-50  text-indigo-700 border border-indigo-100/70"
                    : "hover:bg-zinc-100/70 "
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="space-y-6">
          <AnimatePresence mode="wait">
            {/* {active === "account" && (
            <motion.div
              key="account"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <SectionCard
                title="Account"
                desc="Manage profile and identity settings"
              >
                <Row
                  label="Display name"
                  hint="Shown to teammates and in shared links"
                  control={
                    <input
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white  px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  }
                />
                <Row
                  label="Email"
                  hint="Used for login and account recovery"
                  control={
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200  bg-white  px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  }
                />
                <div className="mt-4">
                  <button
                    onClick={handleApply}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Save size={16} /> Apply Changes
                  </button>
                </div>
              </SectionCard>
            </motion.div>
          )}

          {active === "appearance" && (
            <motion.div
              key="appearance"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <SectionCard title="Appearance" desc="Theme, color and density">
                <Row
                  label="Theme"
                  hint="Automatically switch with your OS or force a mode"
                  control={
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {
                          id: "system",
                          label: "System",
                          icon: <Sun className="mr-1" size={16} />,
                        },
                        {
                          id: "light",
                          label: "Light",
                          icon: <Sun className="mr-1" size={16} />,
                        },
                        {
                          id: "dark",
                          label: "Dark",
                          icon: <Moon className="mr-1" size={16} />,
                        },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setTheme(t.id as any)}
                          className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors ${
                            theme === t.id
                              ? "border-indigo-500 bg-indigo-50  text-indigo-700 "
                              : "border-zinc-200  hover:bg-zinc-100/70 "
                          }`}
                          aria-pressed={theme === t.id}
                        >
                          {t.icon}
                          {t.label}
                        </button>
                      ))}
                    </div>
                  }
                />

                <Row
                  label="Brand color"
                  hint="Used for highlights and primary actions"
                  control={
                    <div className="flex items-center gap-3 flex-wrap">
                      {[
                        "#6366f1", // indigo
                        "#22c55e", // green
                        "#ef4444", // red
                        "#06b6d4", // cyan
                        "#a855f7", // purple
                        "#f59e0b", // amber
                      ].map((c) => (
                        <ColorDot
                          key={c}
                          value={c}
                          selected={brandColor === c}
                          onClick={() => setBrandColor(c)}
                        />
                      ))}
                      <input
                        type="color"
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        className="h-8 w-12 rounded-xl border border-zinc-200  bg-white  p-1"
                        aria-label="Custom brand color"
                      />
                    </div>
                  }
                />

                <Row
                  label="Compact mode"
                  hint="Reduce padding for dense data tables"
                  control={<Toggle checked={compact} onChange={setCompact} />}
                />
              </SectionCard>
            </motion.div>
          )}

          {active === "notifications" && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <SectionCard
                title="Notifications"
                desc="How you stay in the loop"
              >
                <Row
                  label="Email alerts"
                  hint="Task updates and weekly summaries"
                  control={
                    <Toggle checked={notifEmail} onChange={setNotifEmail} />
                  }
                />
                <Row
                  label="Push notifications"
                  hint="Mentions and direct messages"
                  control={
                    <Toggle checked={notifPush} onChange={setNotifPush} />
                  }
                />
                <Row
                  label="SMS"
                  hint="Critical incidents only"
                  control={<Toggle checked={notifSMS} onChange={setNotifSMS} />}
                />
              </SectionCard>
            </motion.div>
          )} */}

            {active === "language" && (
              <motion.div
                key="language"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <SectionCard
                  title="Language & Region"
                  desc="Locale formatting and time zone"
                >
                  <Row
                    label="Language"
                    hint="Affects UI text and date formatting"
                    control={
                      <Select
                        value={locale}
                        onChange={setLocale}
                        options={[
                          { label: "English (US)", value: "en-US" },
                          { label: "English (UK)", value: "en-GB" },
                          { label: "বাংলা (Bangla)", value: "bn-BD" },
                          { label: "हिन्दी (Hindi)", value: "hi-IN" },
                        ]}
                      />
                    }
                  />
                  <Row
                    label="Time zone"
                    hint="Used for reminders and reports"
                    control={
                      <Select
                        value={tz}
                        onChange={setTz}
                        options={[
                          { label: "Asia/Dhaka (GMT+6)", value: "Asia/Dhaka" },
                          { label: "UTC", value: "UTC" },
                          {
                            label: "Asia/Kolkata (GMT+5:30)",
                            value: "Asia/Kolkata",
                          },
                          {
                            label: "America/New_York (GMT-5)",
                            value: "America/New_York",
                          },
                        ]}
                      />
                    }
                  />
                </SectionCard>
              </motion.div>
            )}

            {active === "privacy" && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <SectionCard
                  title="Privacy"
                  desc="Control who can see your info"
                >
                  <Row
                    label="Profile visibility"
                    hint="Who can discover your profile"
                    control={
                      <Select
                        value={profileVisibility}
                        onChange={setProfileVisibility}
                        options={[
                          { label: "Only me", value: "private" },
                          { label: "My team", value: "team" },
                          { label: "Public", value: "public" },
                        ]}
                      />
                    }
                  />
                </SectionCard>
              </motion.div>
            )}

            {active === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <SectionCard title="Security" desc="Protect your account">
                  <Row
                    label="Two‑factor authentication"
                    hint="Recommended for all accounts"
                    control={<Toggle checked={twoFA} onChange={setTwoFA} />}
                  />
                  <div className="rounded-xl bg-amber-50  border border-amber-200  p-4 text-amber-700  text-sm">
                    Tip: Use an authenticator app (TOTP) rather than SMS for
                    better security.
                  </div>
                </SectionCard>
              </motion.div>
            )}

            {active === "printing" && (
              <motion.div
                key="printing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <SectionCard
                  title="Printing"
                  desc="Configure how receipts and documents are printed"
                >
                  <PrintingCard />
                </SectionCard>
              </motion.div>
            )}

            {active === "danger" && (
              <motion.div
                key="danger"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <SectionCard
                  title="Danger Zone"
                  desc="Irreversible actions – be careful!"
                >
                  <div className="flex items-center justify-between rounded-xl border border-red-200  p-4 bg-red-50 ">
                    <div>
                      <div className="font-semibold text-red-700 ">
                        Delete account
                      </div>
                      <div className="text-sm text-red-600/80 ">
                        This action permanently removes your account and data.
                      </div>
                    </div>
                    <button className="rounded-xl border border-red-300 text-red-700 px-4 py-2 text-sm hover:bg-red-100/60  focus:outline-none focus:ring-2 focus:ring-red-500">
                      Delete…
                    </button>
                  </div>
                </SectionCard>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
};

export default SettingsPanel;
