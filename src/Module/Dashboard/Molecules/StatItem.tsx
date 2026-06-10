import React from "react";
import Icon from "../Atoms/Icon";

interface StatItemProps {
  variant?: "row" | "card";
  icon: string;
  title: string;
  value: string;
  iconBgClass?: string;
  iconTextClass?: string;
}

export const StatItem: React.FC<StatItemProps> = ({
  variant = "row",
  icon,
  title,
  value,
  iconBgClass = "bg-secondary-fixed/30",
  iconTextClass = "text-secondary",
}) => {
  if (variant === "card") {
    return (
      <div className="bg-surface-container-lowest rounded-xl p-6 zen-shadow border border-outline-variant flex items-center gap-4">
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center flex-shrink-0 ${iconBgClass}`}>
          <Icon name={icon} className={`text-xl md:text-2xl block ${iconTextClass}`} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider truncate">
            {title}
          </p>
          <h3 className="text-xl md:text-2xl font-bold text-primary truncate">
            {value}
          </h3>
        </div>
      </div>
    );
  }

  // Row variant
  return (
    <div className="p-4 bg-surface-container-low rounded-xl flex justify-between items-center border border-outline-variant/30">
      <div className="flex items-center gap-3">
        <Icon name={icon} className="text-primary text-xl flex-shrink-0 block" />
        <span className="text-sm font-medium text-on-surface">{title}</span>
      </div>
      <span className="font-bold whitespace-nowrap ml-4 text-on-surface">{value}</span>
    </div>
  );
};

export default StatItem;
