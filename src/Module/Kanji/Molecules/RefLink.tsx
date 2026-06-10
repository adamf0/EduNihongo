import React from "react";
import Icon from "../Atoms/Icon";

interface RefLinkProps {
  label: string;
  initial: string;
  href: string;
}

export const RefLink: React.FC<RefLinkProps> = ({ label, initial, href }) => {
  return (
    <a
      className="bg-white border border-outline-variant p-4 rounded-xl flex items-center justify-between hover:border-primary hover:shadow-md transition-all group select-none"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-surface-container flex items-center justify-center rounded-lg text-primary font-bold">
          {initial}
        </div>
        <span className="font-semibold text-on-surface">{label}</span>
      </div>
      <Icon
        name="open_in_new"
        className="text-on-surface-variant group-hover:text-primary transition-colors block text-2xl"
      />
    </a>
  );
};

export default RefLink;
