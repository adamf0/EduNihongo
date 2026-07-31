import React from "react";
import Icon from "../../../Common/Component/Icon";

interface KanjiStatusBadgeProps {
  isIncomplete: boolean;
}

export const KanjiStatusBadge: React.FC<KanjiStatusBadgeProps> = React.memo(({ isIncomplete }) => {
  if (isIncomplete) {
    return (
      <span className="px-3 py-1 bg-amber-100 border border-amber-300 text-amber-900 text-xs rounded-full font-extrabold inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-default">
        <Icon name="warning" className="text-sm text-amber-600 shrink-0" />
        Tidak Lengkap
      </span>
    );
  }

  return (
    <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-full font-extrabold inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-default">
      <Icon name="check_circle" className="text-sm text-emerald-600 shrink-0" />
      Lengkap
    </span>
  );
});
KanjiStatusBadge.displayName = "KanjiStatusBadge";

interface KanjiModuleBadgeProps {
  module?: { id: number; title: string } | null;
  onNavigate?: (id: number) => void;
}

export const KanjiModuleBadge: React.FC<KanjiModuleBadgeProps> = React.memo(({ module, onNavigate }) => {
  if (module && onNavigate) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate(module.id);
        }}
        className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs rounded-full font-bold hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-1"
        title={`Buka detail ${module.title}`}
      >
        <Icon name="menu_book" className="text-xs text-slate-500" />
        {module.title}
      </button>
    );
  }

  return (
    <span
      onClick={(e) => e.stopPropagation()}
      className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-full font-bold whitespace-nowrap shrink-0 cursor-default inline-flex items-center"
    >
      Tidak Terdaftar ke Modul
    </span>
  );
});
KanjiModuleBadge.displayName = "KanjiModuleBadge";
