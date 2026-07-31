import React from "react";
import Icon from "../../../Common/Component/Icon";

export interface ModuleRef {
  id: number;
  title: string;
}

interface KanjiFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedModuleFilter: string;
  onModuleFilterChange: (mod: string) => void;
  selectedStatusFilter: string;
  onStatusFilterChange: (st: string) => void;
  modules: ModuleRef[];
  totalCount: number;
  incompleteCount: number;
}

export const KanjiFilterBar: React.FC<KanjiFilterBarProps> = React.memo(
  ({
    searchQuery,
    onSearchChange,
    selectedModuleFilter,
    onModuleFilterChange,
    selectedStatusFilter,
    onStatusFilterChange,
    modules,
    totalCount,
    incompleteCount,
  }) => (
    <div className="bg-white border border-outline-variant/30 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
      {/* Search Bar */}
      <div className="relative w-full md:w-80">
        <Icon
          name="search"
          className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
        />
        <input
          type="text"
          placeholder="Cari karakter, romaji, atau arti..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-slate-50 border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary font-medium"
        />
      </div>

      {/* Select Filters */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        {/* Module Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-bold whitespace-nowrap">
            Modul:
          </span>
          <select
            value={selectedModuleFilter}
            onChange={(e) => onModuleFilterChange(e.target.value)}
            className="bg-slate-50 border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary font-bold cursor-pointer"
          >
            <option value="ALL">Semua Modul</option>
            <option value="NONE">Tidak Terdaftar ke Modul</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title} (ID: {m.id})
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-bold whitespace-nowrap">
            Status:
          </span>
          <select
            value={selectedStatusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="bg-slate-50 border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary font-bold cursor-pointer"
          >
            <option value="ALL">Semua Status ({totalCount})</option>
            <option value="COMPLETE">
              Lengkap ({totalCount - incompleteCount})
            </option>
            <option value="INCOMPLETE">
              Tidak Lengkap ({incompleteCount})
            </option>
          </select>
        </div>
      </div>
    </div>
  )
);
KanjiFilterBar.displayName = "KanjiFilterBar";
