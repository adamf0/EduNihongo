import React from "react";
import Icon from "../../../Common/Component/Icon";

interface StatCardProps {
  icon?: string;
  title?: string;
  label: string;
  value: string;
  borderClass?: string;
  iconColorClass?: string;
  customProgress?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  label,
  value,
  borderClass = "",
  iconColorClass = "text-primary",
  customProgress,
}) => {
  return (
    <div
      className={`bg-surface-container-lowest p-md rounded-xl kanji-card-shadow flex flex-col gap-xs relative select-none border border-outline-variant/10 ${borderClass}`}
    >
      {customProgress ? (
        <div className="flex items-center gap-md">
          {customProgress}
          <div>
            <p className="font-label-md text-on-surface-variant">{label}</p>
            <h3 className="font-headline-md text-on-surface font-semibold">{value}</h3>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            {icon && <Icon name={icon} className={`${iconColorClass} text-2xl`} style={icon === "local_fire_department" ? { fontVariationSettings: "'FILL' 1" } : undefined} />}
            {title && <span className="text-caption font-bold text-on-surface-variant">{title}</span>}
          </div>
          <p className="font-label-md text-on-surface-variant mt-xs">{label}</p>
          <h3 className="font-headline-md text-on-surface font-semibold">{value}</h3>
        </>
      )}
    </div>
  );
};

export default StatCard;
