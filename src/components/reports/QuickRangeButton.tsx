import { FC } from "react";
import { Button } from "rsuite";

interface QuickRangeButtonsProps {
  onToday: () => void;
  onLast7Days: () => void;
  onThisMonth: () => void;
}

export const QuickRangeButtons: FC<QuickRangeButtonsProps> = ({
  onToday,
  onLast7Days,
  onThisMonth,
}) => (
  <div className="mt-3 flex flex-wrap gap-2">
    <Button
      size="sm"
      appearance="ghost"
      className="rounded-full"
      onClick={onToday}
    >
      Today
    </Button>
    <Button
      size="sm"
      appearance="ghost"
      className="rounded-full"
      onClick={onLast7Days}
    >
      Last 7 days
    </Button>
    <Button
      size="sm"
      appearance="ghost"
      className="rounded-full"
      onClick={onThisMonth}
    >
      This month
    </Button>
  </div>
);
