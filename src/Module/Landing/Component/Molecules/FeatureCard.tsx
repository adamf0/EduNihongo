import React from "react";
import Icon from "../../../Common/Component/Icon";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  iconBgColor?: string;
  iconColor?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary",
}) => {
  return (
    <div className="bg-white/80 dark:bg-surface-dim/80 backdrop-blur-md p-md rounded-xl border border-primary/10 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-md group">
      <div className={`w-12 h-12 ${iconBgColor} flex items-center justify-center rounded-lg mb-sm group-hover:scale-110 transition-transform`}>
        <Icon name={icon} className={`${iconColor} text-3xl block`} />
      </div>
      <h3 className="font-headline-md text-secondary mb-xs">{title}</h3>
      <p className="text-body-md text-on-surface-variant leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
