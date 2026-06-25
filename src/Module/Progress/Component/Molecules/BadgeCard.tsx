import React from "react";
import Icon from "../../../Common/Component/Icon";

interface BadgeCardProps {
  icon: string;
  title: string;
  description: string;
  isUnlocked: boolean;
  bgClass?: string;
  iconColorClass?: string;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({
  icon,
  title,
  description,
  isUnlocked,
  bgClass = "bg-secondary-container",
  iconColorClass = "text-on-secondary-container",
}) => {
  return (
    <div
      className={`bg-surface-container-lowest p-md rounded-xl border border-outline-variant/30 flex flex-col items-center text-center hover:shadow-md transition-shadow group select-none ${
        isUnlocked ? "" : "opacity-40 grayscale"
      }`}
    >
      <div
        className={`w-20 h-20 rounded-full flex items-center justify-center mb-md group-hover:scale-110 transition-transform ${
          isUnlocked ? bgClass : "bg-surface-container-high"
        }`}
      >
        <Icon
          name={icon}
          className={`text-4xl block ${isUnlocked ? iconColorClass : "text-on-surface-variant"}`}
          style={isUnlocked ? { fontVariationSettings: "'FILL' 1" } : undefined}
        />
      </div>
      <h4 className="font-label-md font-bold mb-xs text-on-surface">{title}</h4>
      <p className="text-caption text-on-surface-variant">{description}</p>
    </div>
  );
};

export default BadgeCard;
