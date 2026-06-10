import React from "react";
import Icon from "../Atoms/Icon";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <div className="flex items-center gap-2 text-on-surface-variant text-sm mb-2 select-none flex-wrap">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && (
            <Icon name="chevron_right" className="text-xs text-on-surface-variant block" />
          )}
          {item.isCurrent ? (
            <span className="text-primary font-medium">{item.label}</span>
          ) : (
            <a className="hover:underline text-on-surface-variant" href={item.href || "#"}>
              {item.label}
            </a>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
