import { ReactElement } from "react";

type CancellationStatus = "pending" | "approved" | "rejected";

interface StatusConfig {
  icon: ReactElement;
  bgColor: string;
  textColor: string;
  label: string;
  message: string;
}

interface CancellationStatusProps {
  status: CancellationStatus;
}

const CancellationStatus = ({ status }: CancellationStatusProps) => {
  const statusConfig: Record<CancellationStatus, StatusConfig> = {
    pending: {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-500",
      label: "Pending",
      message: "Request pending review",
    },
    approved: {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-500",
      label: "Approved",
      message: "Cancellation approved",
    },
    rejected: {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bgColor: "bg-rose-500/10",
      textColor: "text-rose-500",
      label: "Rejected",
      message: "Cancellation rejected",
    },
  };

  const { icon, bgColor, textColor, label, message } = statusConfig[status];

  return (
    <div className={`${bgColor} rounded-xl p-4 animate-fade-in-up`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${textColor}`}>{icon}</div>
        <div className="space-y-1">
          <h3 className={`text-sm font-medium ${textColor}`}>{label}</h3>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default CancellationStatus;
