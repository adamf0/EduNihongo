import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../Common/Component/Icon";

interface BreadcrumbItem {
  label: string;
  path?: string; // Jika tidak ada path, berarti ini adalah halaman aktif saat ini
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const navigate = useNavigate();

  // Data fallback jika props items tidak dikirim (sesuai halaman Detail & Latihan Anda)
  const defaultItems: BreadcrumbItem[] = [
    { label: "Dasbor", path: "/dashboard" },
    { label: "Kanji & Kosakata", path: "/module" },
    { label: "Detail & Latihan: 学 (情報)" },
  ];

  const currentItems = items || defaultItems;

  return (
    <nav className="flex flex-wrap items-center gap-2 text-on-surface-variant font-label-md mb-4 text-sm w-full overflow-x-auto whitespace-nowrap pb-2 select-none scrollbar-none">
      {currentItems.map((item, index) => {
        const isLast = index === currentItems.length - 1;

        return (
          <React.Fragment key={index}>
            {isLast ? (
              // Elemen terakhir (Halaman Aktif Saat Ini)
              <span className="text-on-surface font-bold shrink-0">
                {item.label}
              </span>
            ) : (
              // Elemen tautan navigasi
              <span
                onClick={() => item.path && navigate(item.path)}
                className="hover:text-primary cursor-pointer transition-colors shrink-0"
              >
                {item.label}
              </span>
            )}

            {/* Render Icon chevron hanya jika bukan elemen terakhir */}
            {!isLast && (
              <Icon name="chevron_right" className="text-sm block shrink-0 text-on-surface-variant/50" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;