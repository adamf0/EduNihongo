import React from "react";
import Icon from "../Atoms/Icon";

interface GoalCardProps {
  icon: string;
  title: string;
  description: string;
  iconBgClass: string;
  iconTextClass: string;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  icon,
  title,
  description,
  iconBgClass,
  iconTextClass,
}) => {
  return (
    <div className="flex gap-8 group">
      <div
        className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 ${iconBgClass} ${iconTextClass}`}
      >
        <Icon name={icon} className="text-3xl block" />
      </div>
      <div>
        <h4 className="font-bold text-xl text-primary mb-2">{title}</h4>
        <p className="text-on-surface-variant leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default GoalCard;
