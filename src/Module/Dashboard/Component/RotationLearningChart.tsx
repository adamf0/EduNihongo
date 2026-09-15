import React, { useState, useMemo } from "react";
import Icon from "../../Common/Component/Icon";

export interface StudentRotationItem {
  id: number;
  userName: string;
  userEmail: string;
  userAvatar: string;
  relativeComprehension: number; // X-axis (RS-Ratio, centered at 100)
  momentum: number;              // Y-axis (RS-Momentum, centered at 100)
  quadrant: "Mahir" | "Berkembang" | "Perhatian" | "Review";
  phase: string;
  color: string;
  vsBenchmark: number;
  momentumStatus: "Sangat Aktif" | "Meningkat" | "Stabil" | "Perlu Penguatan";
  moveDelta: { r: number; m: number };
  quizAccuracy: number;
  readingPracticeScore: number;
  writingPracticeScore?: number;
  readingAttemptsCount?: number;
  writingAttemptsCount?: number;
  readingEfficiency?: number;
  writingEfficiency?: number;
  accessFrequency: number;
  attemptsCount: number;
  trajectory: Array<{ x: number; y: number }>;
  historyRatio?: number[];
  historyMomentum?: number[];
}

interface RotationLearningChartProps {
  items: StudentRotationItem[];
  loading?: boolean;
}

export const RotationLearningChart: React.FC<RotationLearningChartProps> = ({ items, loading }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedQuadrant, setSelectedQuadrant] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>("userName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Information Dialog State (Getting the most out of Rotation)
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [activeHelpTab, setActiveHelpTab] = useState<string>("playbook");

  // Handle Student Selection & Tag Synchronization (Decoupled detail inspection from table filter scope)
  const handleSelectStudent = (id: number | null) => {
    if (id === null || selectedStudentId === id) {
      setSelectedStudentId(null);
    } else {
      setSelectedStudentId(id);
    }
  };

  const handleAddTag = (id: number) => {
    const student = items.find((i) => i.id === id);
    if (!selectedTagIds.includes(id)) {
      setSelectedTagIds((prev) => [...prev, id]);
    }
    setSelectedStudentId(id);
    setSearchFilter("");
    if (student && selectedQuadrant && student.quadrant !== selectedQuadrant) {
      setSelectedQuadrant(null);
    }
  };

  const handleSelectQuadrant = (targetQuad: string | null) => {
    if (!targetQuad || selectedQuadrant === targetQuad) {
      setSelectedQuadrant(null);
      setSelectedTagIds([]);
      setSelectedStudentId(null);
    } else {
      setSelectedQuadrant(targetQuad);
      // Find all students in items belonging to targetQuad and insert them into selectedTagIds
      const matchingStudents = items.filter((st) => st.quadrant === targetQuad);
      const matchingStudentIds = matchingStudents.map((st) => st.id);

      setSelectedTagIds(matchingStudentIds);
      // Detail panel opens ONLY if exactly 1 student is in that quadrant; if multiple, keep null until user selects
      setSelectedStudentId(matchingStudentIds.length === 1 ? matchingStudentIds[0] : null);
      setSearchFilter("");
    }
  };

  const handleRemoveTag = (id: number) => {
    const updated = selectedTagIds.filter((item) => item !== id);
    setSelectedTagIds(updated);
    if (selectedStudentId === id) {
      setSelectedStudentId(updated.length === 1 ? updated[0] : null);
    }
  };

  const handleClearAllFilters = () => {
    setSelectedTagIds([]);
    setSearchFilter("");
    setSelectedQuadrant(null);
    setSelectedStudentId(null);
    setSelectedPhase(null);
  };

  // Filter items based on top search bar, quadrant & selected tags (Independent of selectedStudentId sidebar inspection)
  const visibleItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedTagIds.length > 0 && !selectedTagIds.includes(item.id)) return false;
      if (selectedQuadrant && item.quadrant !== selectedQuadrant) return false;
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase().trim();
        const matches =
          item.userName.toLowerCase().includes(q) ||
          item.userEmail.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [items, selectedTagIds, selectedQuadrant, searchFilter]);

  // Items displayed in the table below chart
  const tableItems = useMemo(() => {
    let result = visibleItems.filter((item) => {
      if (selectedPhase && item.phase !== selectedPhase) return false;
      return true;
    });

    result.sort((a: any, b: any) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === "string") {
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return sortDirection === "asc" ? valA - valB : valB - valA;
    });

    return result;
  }, [visibleItems, selectedPhase, sortField, sortDirection]);

  // Selected student for right sidebar detail panel
  const selectedStudent = useMemo(() => {
    if (selectedStudentId !== null) {
      return items.find((item) => item.id === selectedStudentId) || null;
    }
    if (selectedTagIds.length === 1) {
      return items.find((item) => item.id === selectedTagIds[0]) || null;
    }
    return null;
  }, [items, selectedStudentId, selectedTagIds]);

  // Coordinate mapping for SVG canvas [75, 125] -> viewBox bounds [68, 836], [464, 56]
  const mapX = (val: number) => {
    const minX = 75, maxX = 125;
    const minSvgX = 68, maxSvgX = 836;
    const norm = (val - minX) / (maxX - minX);
    const clamped = Math.max(0, Math.min(1, norm));
    return minSvgX + clamped * (maxSvgX - minSvgX);
  };

  const mapY = (val: number) => {
    const minY = 75, maxY = 125;
    const minSvgY = 464, maxSvgY = 56;
    const norm = (val - minY) / (maxY - minY);
    const clamped = Math.max(0, Math.min(1, norm));
    return minSvgY - clamped * (minSvgY - maxSvgY);
  };

  const getQuadrantStyle = (quad: string) => {
    switch (quad) {
      case "Mahir":
      case "Leading":
        return { title: "Mahir (Leading)", color: "#16a34a", bg: "rgba(34, 197, 94, 0.08)", pill: "bg-emerald-100 text-emerald-800 border-emerald-300" };
      case "Berkembang":
      case "Improving":
        return { title: "Berkembang (Improving)", color: "#0284c7", bg: "rgba(14, 165, 233, 0.08)", pill: "bg-sky-100 text-sky-800 border-sky-300" };
      case "Perhatian":
      case "Lagging":
        return { title: "Perhatian (Lagging)", color: "#e11d48", bg: "rgba(244, 63, 94, 0.08)", pill: "bg-rose-100 text-rose-800 border-rose-300" };
      case "Review":
      case "Weakening":
        return { title: "Review (Weakening)", color: "#d97706", bg: "rgba(245, 158, 11, 0.08)", pill: "bg-amber-100 text-amber-800 border-amber-300" };
      default:
        return { title: quad, color: "#475569", bg: "rgba(241, 245, 249, 0.5)", pill: "bg-slate-100 text-slate-800 border-slate-300" };
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Dual Sparkline data for right sidebar
  const ratioSeries = selectedStudent?.historyRatio || selectedStudent?.trajectory.map((t) => t.x) || [95, 97, 100, 103, 105];
  const momentumSeries = selectedStudent?.historyMomentum || selectedStudent?.trajectory.map((t) => t.y) || [90, 93, 98, 101, 104];

  // Candidates for search dropdown suggestion
  const searchSuggestions = useMemo(() => {
    if (!searchFilter.trim()) return [];
    const q = searchFilter.toLowerCase().trim();
    return items.filter(
      (item) =>
        !selectedTagIds.includes(item.id) &&
        (item.userName.toLowerCase().includes(q) || item.userEmail.toLowerCase().includes(q))
    );
  }, [items, searchFilter, selectedTagIds]);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-sm flex flex-col gap-5 select-none font-sans">
      {/* Top Main Section Header with Information Dialog Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Icon name="radar" className="text-[#8f0020] text-xl" />
            <h3 className="font-bold text-on-surface text-lg">Metrik Rotation Learning</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Grafik rotasi pergerakan pemahaman relative & momentum keaktifan belajar pengguna. Klik lintasan atau baris untuk menganalisis.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <Icon name="help_outline" className="text-slate-500 text-base" />
            <span>Panduan Rotasi</span>
          </button>
        </div>
      </div>

      {/* 1. Top Filter Card (Educational Adaptation) */}
      <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Icon name="filter_alt" className="text-[#8f0020] text-base" />
            <span>Filter Mahasiswa</span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-700 text-[11px] font-bold">
              {visibleItems.length} Mahasiswa
            </span>
          </div>
          {(selectedTagIds.length > 0 || searchFilter || selectedQuadrant || selectedStudentId) && (
            <button
              onClick={handleClearAllFilters}
              className="flex items-center gap-1 text-xs font-bold text-[#8f0020] hover:text-[#5b0014] hover:underline border-none bg-transparent cursor-pointer transition-colors"
            >
              <span>✕</span>
              <span>Reset Filter</span>
            </button>
          )}
        </div>

        {/* Input box with Tag Pills inside */}
        <div className="relative">
          <div className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white shadow-xs focus-within:border-[#8f0020] focus-within:ring-2 focus-within:ring-[#8f0020]/15 transition-all flex flex-wrap items-center gap-2">
            <Icon name="search" className="text-slate-400 text-lg shrink-0" />


            {/* Selected Tag Badges inside input */}
            {selectedTagIds.map((tagId) => {
              const student = items.find((i) => i.id === tagId);
              if (!student) return null;
              return (
                <span
                  key={tagId}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold shadow-2xs hover:bg-slate-200/60 transition-colors"
                >
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: student.color }} />
                  <span>{student.userName}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTag(tagId);
                    }}
                    className="hover:text-slate-900 border-none bg-transparent cursor-pointer text-xs font-bold text-[#8f0020] hover:bg-slate-300/60 rounded-full w-4 h-4 flex items-center justify-center transition-all ml-0.5"
                    title="Hapus filter mahasiswa ini"
                  >
                    ✕
                  </button>
                </span>
              );
            })}

            {/* Text Input */}
            <input
              type="text"
              placeholder={selectedTagIds.length === 0 ? "Cari nama atau email mahasiswa..." : "Ketik untuk mencari mahasiswa lain..."}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchSuggestions.length > 0) {
                  e.preventDefault();
                  handleAddTag(searchSuggestions[0].id);
                } else if (e.key === "Backspace" && !searchFilter && selectedTagIds.length > 0) {
                  handleRemoveTag(selectedTagIds[selectedTagIds.length - 1]);
                }
              }}
              className="flex-1 min-w-[140px] text-xs font-semibold bg-transparent outline-none border-none text-slate-800 py-1"
            />

            {/* Clear Input X Icon on far right */}
            {(searchFilter || selectedTagIds.length > 0 || selectedStudentId) && (
              <button
                onClick={handleClearAllFilters}
                className="text-slate-400 hover:text-slate-700 border-none bg-transparent cursor-pointer text-sm font-bold shrink-0 ml-auto p-1 rounded-lg hover:bg-slate-100 transition-all"
                title="Hapus pencarian"
              >
                ✕
              </button>
            )}
          </div>

          {/* Autocomplete Suggestions Dropdown */}
          {searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-40 max-h-56 overflow-y-auto divide-y divide-slate-100 p-1.5">
              {searchSuggestions.map((st) => {
                const qStyle = getQuadrantStyle(st.quadrant);
                return (
                  <div
                    key={st.id}
                    onClick={() => handleAddTag(st.id)}
                    className="p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center justify-between text-xs font-semibold text-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={st.userAvatar}
                        alt={st.userName}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: st.color }} />
                      <div>
                        <span className="font-bold text-slate-900 block">{st.userName}</span>
                        <span className="text-[10px] text-slate-400 block">{st.userEmail}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${qStyle.pill}`}>
                      {qStyle.title}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-[#8f0020] font-bold animate-pulse">
          Memuat analitik pergerakan rotasi belajar pengguna...
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center text-slate-400 italic text-sm">
          Belum ada data rotasi belajar pengguna tercatat untuk filter ini.
        </div>
      ) : (
        /* 2-Column Main Layout: Chart + Side Panel */
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_19rem]">
          {/* Left Column: Canvas + Legend + Table */}
          <div className="space-y-4 min-w-0">
            {/* RRG SVG Canvas Container */}
            <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 shadow-xs bg-[#F8FAFC]">
              <svg viewBox="0 0 860 500" className="mx-auto w-full min-w-0 max-w-[56rem] select-none">
                <rect
                  x="0"
                  y="0"
                  width="860"
                  height="500"
                  rx="18"
                  fill="#F8FAFC"
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedQuadrant(null);
                    setSelectedStudentId(null);
                  }}
                />

                {/* 4 Quadrants Background Regions */}
                {/* Top-Left: Berkembang / Improving */}
                <g
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectQuadrant("Berkembang");
                  }}
                >
                  <rect x="56" y="44" width="396" height="216" rx="10" fill="rgba(14, 165, 233, 0.08)" />
                  <text x="76" y="74" fill="#0284c7" fontSize="13" fontWeight="800">
                    Berkembang (Improving)
                  </text>
                </g>

                {/* Top-Right: Mahir / Leading */}
                <g
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectQuadrant("Mahir");
                  }}
                >
                  <rect x="452" y="44" width="396" height="216" rx="10" fill="rgba(34, 197, 94, 0.08)" />
                  <text x="832" y="74" textAnchor="end" fill="#16a34a" fontSize="13" fontWeight="800">
                    Mahir (Leading)
                  </text>
                </g>

                {/* Bottom-Left: Perhatian / Lagging */}
                <g
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectQuadrant("Perhatian");
                  }}
                >
                  <rect x="56" y="260" width="396" height="216" rx="10" fill="rgba(244, 63, 94, 0.08)" />
                  <text x="76" y="460" fill="#e11d48" fontSize="13" fontWeight="800">
                    Perhatian (Lagging)
                  </text>
                </g>

                {/* Bottom-Right: Review / Weakening */}
                <g
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectQuadrant("Review");
                  }}
                >
                  <rect x="452" y="260" width="396" height="216" rx="10" fill="rgba(245, 158, 11, 0.08)" />
                  <text x="832" y="460" textAnchor="end" fill="#d97706" fontSize="13" fontWeight="800">
                    Review (Weakening)
                  </text>
                </g>

                {/* Dashed Outline Box when a Quadrant is selected */}
                {selectedQuadrant === "Berkembang" && (
                  <rect x="56" y="44" width="396" height="216" rx="10" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="6 6" className="pointer-events-none" />
                )}
                {selectedQuadrant === "Mahir" && (
                  <rect x="452" y="44" width="396" height="216" rx="10" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeDasharray="6 6" className="pointer-events-none" />
                )}
                {selectedQuadrant === "Perhatian" && (
                  <rect x="56" y="260" width="396" height="216" rx="10" fill="none" stroke="#e11d48" strokeWidth="2.5" strokeDasharray="6 6" className="pointer-events-none" />
                )}
                {selectedQuadrant === "Review" && (
                  <rect x="452" y="260" width="396" height="216" rx="10" fill="none" stroke="#d97706" strokeWidth="2.5" strokeDasharray="6 6" className="pointer-events-none" />
                )}

                {/* Dashed Grid Lines */}
                <line x1="56" y1="152" x2="848" y2="152" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="56" y1="368" x2="848" y2="368" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="254" y1="44" x2="254" y2="476" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="650" y1="44" x2="650" y2="476" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />

                {/* Center Axes Lines */}
                <line x1="452" y1="44" x2="452" y2="476" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="56" y1="260" x2="848" y2="260" stroke="#94a3b8" strokeWidth="1.5" />

                {/* Axis Titles */}
                <text x="452" y="32" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="700">
                  Momentum Keaktifan +
                </text>
                <text x="848" y="254" textAnchor="end" fill="#64748b" fontSize="11" fontWeight="700">
                  Relative Pemahaman +
                </text>

                <defs>
                  <clipPath id="rrg-chart-box-clip">
                    <rect x="56" y="44" width="792" height="432" rx="10" />
                  </clipPath>
                </defs>

                {/* Center BENCHMARK Badge */}
                <rect x="392" y="246" width="120" height="28" rx="6" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
                <text x="452" y="264" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="800">
                  BENCHMARK
                </text>

                {/* Student Trajectories & Node Labels (Clipped strictly inside box) */}
                <g clipPath="url(#rrg-chart-box-clip)">
                  {visibleItems.map((item) => {
                    const pointsStr = item.trajectory
                      .map((pt) => `${mapX(pt.x)},${mapY(pt.y)}`)
                      .join(" ");

                    const headX = mapX(item.relativeComprehension);
                    const headY = mapY(item.momentum);
                    const isSelected = selectedStudentId === item.id;

                    // If a single student is selected for detail sidebar, softly dim other items on canvas while keeping them interactive
                    if (selectedStudentId !== null && !isSelected) {
                      return (
                        <g
                          key={item.id}
                          opacity="0.35"
                          className="transition-opacity cursor-pointer hover:opacity-80"
                          onClick={() => handleSelectStudent(item.id)}
                        >
                          <polyline points={pointsStr} fill="none" stroke={item.color} strokeWidth="1.5" strokeOpacity="0.6" />
                          <circle cx={headX} cy={headY} r="4.5" fill={item.color} />
                        </g>
                      );
                    }

                    return (
                      <g
                        key={item.id}
                        className="cursor-pointer transition-all"
                        onClick={() => handleSelectStudent(item.id)}
                      >
                        {/* Trajectory Polyline */}
                        <polyline
                          points={pointsStr}
                          fill="none"
                          stroke={item.color}
                          strokeWidth={isSelected ? "3" : "1.8"}
                          strokeOpacity={isSelected ? "1" : "0.85"}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          vectorEffect="non-scaling-stroke"
                        />

                        {/* Historical Trail Dots */}
                        {item.trajectory.slice(0, -1).map((pt, pIdx) => (
                          <circle
                            key={pIdx}
                            cx={mapX(pt.x)}
                            cy={mapY(pt.y)}
                            r="3"
                            fill={item.color}
                            opacity="0.6"
                          />
                        ))}

                        <title>{item.userName} ({item.quadrant})</title>
                        {/* Head Circle Node */}
                        <circle
                          cx={headX}
                          cy={headY}
                          r={isSelected ? "8" : "6"}
                          fill={item.color}
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>

            {/* 2. Interactive Legend Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200">
              <button
                onClick={handleClearAllFilters}
                className="px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 active:scale-95 transition-all cursor-pointer shadow-xs"
              >
                Tampilkan Semua ({items.length})
              </button>

              {items.map((item) => {
                const isSelected = selectedStudentId === item.id;
                const isHidden = selectedTagIds.length > 0 && !selectedTagIds.includes(item.id);

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (isSelected) {
                        handleSelectStudent(null);
                      } else {
                        handleSelectStudent(item.id);
                      }
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer ${
                      isHidden
                        ? "bg-slate-100 text-slate-400 border-slate-200 opacity-40"
                        : isSelected
                        ? "bg-white text-slate-900 border-slate-900 ring-2 ring-slate-900/20 font-bold shadow-xs"
                        : "bg-white text-slate-800 border-slate-200 hover:border-slate-300 shadow-2xs"
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: isHidden ? "#94a3b8" : item.color }}
                    />
                    <span className="font-bold">{item.userName}</span>
                    <span className="text-[11px] text-slate-500">
                      RS {item.relativeComprehension.toFixed(1)} · Mom {item.momentum.toFixed(1)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 3. Table & Filters Container */}
            <div className="space-y-3 pt-2">
              {/* Filter Tag Pill if active */}
              {selectedPhase && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
                    {selectedPhase}
                    <button
                      onClick={() => setSelectedPhase(null)}
                      className="text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer font-bold text-xs"
                    >
                      ✕
                    </button>
                  </span>
                </div>
              )}

              {/* Data Table */}
              <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[760px]">
                    <thead className="bg-white text-slate-500 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3 pl-4 cursor-pointer whitespace-nowrap" onClick={() => handleSort("userName")}>
                          <span className="flex items-center gap-1">
                            Mahasiswa <span className="text-[10px]">↑↓</span>
                          </span>
                        </th>
                        <th className="p-3 cursor-pointer whitespace-nowrap" onClick={() => handleSort("quadrant")}>
                          <span className="flex items-center gap-1">
                            Kuadran Belajar <span className="text-[10px]">↑↓</span>
                          </span>
                        </th>
                        <th className="p-3 cursor-pointer whitespace-nowrap" onClick={() => handleSort("relativeComprehension")}>
                          <span className="flex items-center gap-1 font-bold text-slate-700">
                            Pemahaman <span className="text-[10px]">↑↓</span>
                          </span>
                        </th>
                        <th className="p-3 cursor-pointer whitespace-nowrap" onClick={() => handleSort("momentum")}>
                          <span className="flex items-center gap-1">
                            Momentum (Keaktifan) <span className="text-[10px]">↑↓</span>
                          </span>
                        </th>
                        <th className="p-3 cursor-pointer whitespace-nowrap" onClick={() => handleSort("momentumStatus")}>
                          <span className="flex items-center gap-1">
                            Kecepatan Rotasi <span className="text-[10px]">↑↓</span>
                          </span>
                        </th>
                        <th className="p-3 cursor-pointer whitespace-nowrap" onClick={() => handleSort("readingPracticeScore")}>
                          <span className="flex items-center gap-1">
                            Latihan Membaca <span className="text-[10px]">↑↓</span>
                          </span>
                        </th>
                        <th className="p-3 cursor-pointer whitespace-nowrap" onClick={() => handleSort("writingPracticeScore")}>
                          <span className="flex items-center gap-1">
                            Latihan Menulis <span className="text-[10px]">↑↓</span>
                          </span>
                        </th>
                        <th className="p-3 pr-4 cursor-pointer whitespace-nowrap" onClick={() => handleSort("phase")}>
                          <span className="flex items-center gap-1">
                            Fase Belajar <span className="text-[10px]">↑↓</span>
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tableItems.map((item) => {
                        const isSelected = selectedStudentId === item.id;
                        const qStyle = getQuadrantStyle(item.quadrant);
                        const writingScore = item.writingPracticeScore ?? Math.max(0, item.readingPracticeScore - 4);

                        return (
                          <tr
                            key={item.id}
                            onClick={() => handleSelectStudent(item.id)}
                            className={`cursor-pointer transition-all ${
                              isSelected ? "bg-sky-50/60 font-semibold" : "hover:bg-slate-50"
                            }`}
                          >
                            {/* Mahasiswa */}
                            <td className="p-3 pl-4 flex items-center gap-2 whitespace-nowrap">
                              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                              <img
                                src={item.userAvatar}
                                alt={item.userName}
                                className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
                              />
                              <div>
                                <span className="font-bold text-slate-900 block truncate">{item.userName}</span>
                                <span className="text-[10px] text-slate-400 block truncate">{item.userEmail}</span>
                              </div>
                            </td>

                            {/* Kuadran Belajar */}
                            <td className="p-3 whitespace-nowrap">
                              <span className={`inline-block whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-bold ${qStyle.pill}`}>
                                {qStyle.title}
                              </span>
                            </td>

                            {/* Pemahaman (RS-Ratio) */}
                            <td className="p-3 whitespace-nowrap">
                              <span className={`font-bold ${item.vsBenchmark >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                                {item.relativeComprehension.toFixed(1)}{" "}
                                <span className="text-[10px] font-bold opacity-85">
                                  ({item.vsBenchmark >= 0 ? `+${item.vsBenchmark}` : item.vsBenchmark})
                                </span>
                              </span>
                            </td>

                            {/* Momentum (Keaktifan) */}
                            <td className="p-3 whitespace-nowrap">
                              <span className={`font-bold ${item.momentum >= 100 ? "text-emerald-700" : "text-amber-700"}`}>
                                {item.momentum.toFixed(1)}{" "}
                                <span className="text-[10px] font-semibold opacity-85">
                                  ({item.momentumStatus})
                                </span>
                              </span>
                            </td>

                            {/* Kecepatan Rotasi */}
                            <td className="p-3 whitespace-nowrap font-semibold text-emerald-700">
                              <span className="inline-flex items-center gap-1">
                                <span>↗</span>
                                <span>{item.moveDelta.m >= 0 ? `+${item.moveDelta.m}` : item.moveDelta.m} pt</span>
                              </span>
                            </td>

                            {/* Latihan Membaca */}
                            <td className="p-3 whitespace-nowrap text-slate-700 font-semibold">
                              {item.readingPracticeScore}% <span className="text-[10px] text-slate-400 font-bold">({item.readingAttemptsCount || 5}x)</span>
                            </td>

                            {/* Latihan Menulis */}
                            <td className="p-3 whitespace-nowrap text-slate-700 font-semibold">
                              {writingScore}% <span className="text-[10px] text-slate-400 font-bold">({item.writingAttemptsCount || 6}x)</span>
                            </td>

                            {/* Fase Belajar */}
                            <td className="p-3 pr-4 whitespace-nowrap">
                              <span className="inline-block whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {item.phase}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Footnote */}
                <div className="p-3 bg-slate-50/80 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <p>
                    <strong>📌 Penjelasan Metrik & Benchmark (100):</strong>{" "}
                    <span className="font-semibold text-slate-800">Pemahaman (Sumbu X)</span> = Nilai penguasaan kuis (50%), latihan membaca pengucapan (25%), dan latihan menulis OCR kanji (25%) (skor &gt;75% menghasilkan RS-Ratio &gt;100).{" "}
                    <span className="font-semibold text-slate-800">Momentum (Sumbu Y)</span> = Frekuensi latihan & konsistensi keaktifan 4 pekan terakhir (&gt;100 = Sangat Aktif).
                  </p>
                  <p className="text-[10.5px] text-slate-500">
                    Rotasi searah jarum jam menandakan dinamika pembelajaran positif. {tableItems.length} dari {items.length} mahasiswa ditampilkan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 19rem Detail Sidebar Panel (Polished Educational Analytics) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col justify-between gap-4 h-full min-h-[480px]">
            {selectedStudent ? (
              <div className="flex flex-col gap-4 text-xs">
                {/* Header: Avatar, Name, Email & Close Button */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={selectedStudent.userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150"}
                      alt={selectedStudent.userName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 shrink-0 shadow-2xs"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug truncate max-w-[170px]">{selectedStudent.userName}</h4>
                      <p className="text-[11px] text-slate-400 truncate max-w-[170px]">{selectedStudent.userEmail}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelectStudent(null)}
                    className="text-slate-400 hover:text-slate-700 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-xs transition-all border-none cursor-pointer"
                    title="Tutup Analisis Detail"
                  >
                    ✕
                  </button>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-2xs ${getQuadrantStyle(selectedStudent.quadrant).pill}`}>
                    {getQuadrantStyle(selectedStudent.quadrant).title}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                    {selectedStudent.phase}
                  </span>
                </div>

                {/* Dual Sparkline Trend Chart Card */}
                <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-[10px] font-bold border-b border-slate-200/60 pb-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200/80">
                      <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" /> Pemahaman
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Keaktifan
                    </span>
                  </div>

                  {/* SVG Sparkline Graph */}
                  <div className="w-full h-16 pt-1">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 45" preserveAspectRatio="none">
                      {/* Grid Lines */}
                      <line x1="0" y1="22.5" x2="100" y2="22.5" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
                      
                      {/* Relative Pemahaman Line (Blue Solid) */}
                      <polyline
                        points={ratioSeries.map((val, i) => `${i * 25},${38 - ((val - 75) / 50) * 30}`).join(" ")}
                        fill="none"
                        stroke="#0284c7"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />
                      {ratioSeries.map((val, i) => (
                        <circle
                          key={`r_${i}`}
                          cx={i * 25}
                          cy={38 - ((val - 75) / 50) * 30}
                          r="2.5"
                          fill="#0284c7"
                          stroke="#ffffff"
                          strokeWidth="0.8"
                          vectorEffect="non-scaling-stroke"
                        />
                      ))}

                      {/* Momentum Keaktifan Line (Green Dashed) */}
                      <polyline
                        points={momentumSeries.map((val, i) => `${i * 25},${38 - ((val - 75) / 50) * 30}`).join(" ")}
                        fill="none"
                        stroke="#16a34a"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />
                      {momentumSeries.map((val, i) => (
                        <circle
                          key={`m_${i}`}
                          cx={i * 25}
                          cy={38 - ((val - 75) / 50) * 30}
                          r="2"
                          fill="#16a34a"
                          stroke="#ffffff"
                          strokeWidth="0.5"
                          vectorEffect="non-scaling-stroke"
                        />
                      ))}
                    </svg>
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-slate-400 font-semibold pt-1 border-t border-slate-200/50">
                    <span>Minggu 1</span>
                    <span>Minggu 2</span>
                    <span>Minggu 3</span>
                    <span>Minggu 4</span>
                    <span>Saat Ini</span>
                  </div>
                </div>

                {/* 1-Column Primary Learning Metrics List */}
                <div className="grid grid-cols-1 gap-2.5">
                  {/* Akurasi Kuis */}
                  <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200/80 flex flex-col justify-between gap-1 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Akurasi Kuis</span>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-200/60 px-2 py-0.5 rounded-md">
                        {selectedStudent.attemptsCount}x Kuis
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between mt-0.5">
                      <span className="text-lg font-black text-slate-900">{selectedStudent.quizAccuracy}%</span>
                      <span className="text-[10px] text-slate-500 font-semibold">Tingkat Kebenaran Kuis</span>
                    </div>
                  </div>

                  {/* Latihan Membaca */}
                  <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200/80 flex flex-col justify-between gap-1 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Latihan Membaca</span>
                      <span className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md">
                        {selectedStudent.readingAttemptsCount || 5}x Membaca
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between mt-0.5">
                      <span className="text-lg font-black text-slate-900">{selectedStudent.readingPracticeScore}%</span>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        Efisiensi: {selectedStudent.readingEfficiency ?? selectedStudent.readingPracticeScore}% ({selectedStudent.readingAttemptsCount || 5}x Trial)
                      </span>
                    </div>
                  </div>

                  {/* Latihan Menulis */}
                  <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200/80 flex flex-col justify-between gap-1 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Latihan Menulis</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        {selectedStudent.writingAttemptsCount || 6}x Menulis
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between mt-0.5">
                      <span className="text-lg font-black text-slate-900">
                        {selectedStudent.writingPracticeScore ?? Math.max(0, selectedStudent.readingPracticeScore - 4)}%
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        Efisiensi: {selectedStudent.writingEfficiency ?? Math.max(0, selectedStudent.readingPracticeScore - 4)}% ({selectedStudent.writingAttemptsCount || 6}x Trial)
                      </span>
                    </div>
                  </div>

                  {/* Pemahaman (X) */}
                  <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-200/80 flex flex-col gap-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-sky-800 uppercase tracking-wider block">Pemahaman Relatif (X)</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        selectedStudent.vsBenchmark >= 0
                          ? "bg-emerald-100/90 text-emerald-800 border border-emerald-200"
                          : "bg-rose-100/90 text-rose-800 border border-rose-200"
                      }`}>
                        {selectedStudent.vsBenchmark >= 0 ? `+${selectedStudent.vsBenchmark}` : selectedStudent.vsBenchmark} pt
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className="text-xl font-black text-sky-900">{selectedStudent.relativeComprehension.toFixed(1)}</span>
                      <span className="text-[10px] text-sky-800 font-bold px-2 py-0.5 bg-sky-100/80 rounded-md">
                        {selectedStudent.vsBenchmark >= 0 ? "Diatas Benchmark (100)" : "Dibawah Benchmark (100)"}
                      </span>
                    </div>

                    {/* Detail Hasil Perhitungan & Data Faktor Pemahaman */}
                    <div className="pt-2 border-t border-sky-200/60 space-y-1 text-[10px] text-sky-900">
                      <div className="flex items-center justify-between font-medium">
                        <span className="text-sky-700">• Akurasi Kuis (Bobot 50%):</span>
                        <span className="font-bold text-sky-900">{selectedStudent.quizAccuracy}%</span>
                      </div>
                      <div className="flex items-center justify-between font-medium">
                        <span className="text-sky-700">• Membaca Efektif (Bobot 25%):</span>
                        <span className="font-bold text-sky-900">
                          {selectedStudent.readingEfficiency ?? selectedStudent.readingPracticeScore}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between font-medium">
                        <span className="text-sky-700">• Menulis Efektif (Bobot 25%):</span>
                        <span className="font-bold text-sky-900">
                          {selectedStudent.writingEfficiency ?? Math.max(0, selectedStudent.readingPracticeScore - 4)}%
                        </span>
                      </div>
                      <div className="p-1.5 mt-1 bg-white/70 rounded-lg border border-sky-200/60 text-[9.5px] text-sky-800 font-semibold leading-relaxed">
                        <strong>🧮 Hasil Hitung: </strong> 
                        ({selectedStudent.quizAccuracy}% × 0.50) + ({selectedStudent.readingEfficiency ?? selectedStudent.readingPracticeScore}% × 0.25) + ({selectedStudent.writingEfficiency ?? Math.max(0, selectedStudent.readingPracticeScore - 4)}% × 0.25) = 
                        <span className="font-bold text-sky-900"> RS-Ratio {selectedStudent.relativeComprehension.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Momentum (Y) */}
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 flex flex-col gap-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">Momentum Keaktifan (Y)</span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-200 px-2 py-0.5 rounded-md">
                        ↗ {selectedStudent.moveDelta.m >= 0 ? `+${selectedStudent.moveDelta.m}` : selectedStudent.moveDelta.m} pt
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className="text-xl font-black text-emerald-900">{selectedStudent.momentum.toFixed(1)}</span>
                      <span className="text-[10px] text-emerald-800 font-bold px-2 py-0.5 bg-emerald-100/80 rounded-md">
                        {selectedStudent.momentum >= 100 ? "Sangat Aktif (>100)" : "Kurang Aktif (<100)"}
                      </span>
                    </div>

                    {/* Detail Hasil Perhitungan & Data Faktor Momentum */}
                    <div className="pt-2 border-t border-emerald-200/60 space-y-1 text-[10px] text-emerald-900">
                      <div className="flex items-center justify-between font-medium">
                        <span className="text-emerald-700">• Frekuensi Akses (4 Pekan):</span>
                        <span className="font-bold text-emerald-900">{selectedStudent.accessFrequency} pt</span>
                      </div>
                      <div className="flex items-center justify-between font-medium">
                        <span className="text-emerald-700">• Total Submit Kuis:</span>
                        <span className="font-bold text-emerald-900">{selectedStudent.attemptsCount}x Percobaan</span>
                      </div>
                      <div className="p-1.5 mt-1 bg-white/70 rounded-lg border border-emerald-200/60 text-[9.5px] text-emerald-800 font-semibold leading-relaxed">
                        <strong>🧮 Hasil Hitung: </strong> 
                        Aktivitas ({selectedStudent.accessFrequency}) + Kuis ({selectedStudent.attemptsCount}x) = 
                        <span className="font-bold text-emerald-900"> Momentum {selectedStudent.momentum.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rotational Movement & Recommendation Box */}
                {(() => {
                  const q = selectedStudent.quadrant;
                  let boxStyle = "bg-emerald-50/80 border-emerald-200/90 text-emerald-900";
                  let borderStyle = "border-emerald-200/50";
                  let iconColor = "text-emerald-600";
                  let textColor = "text-emerald-800";
                  let adviceText = "Mahasiswa menguasai kanji & jukugo di atas benchmark (>75% akurasi & aktif). Siap kuis modul tingkat lanjut.";

                  if (q === "Berkembang") {
                    boxStyle = "bg-sky-50/80 border-sky-200/90 text-sky-900";
                    borderStyle = "border-sky-200/50";
                    iconColor = "text-sky-600";
                    textColor = "text-sky-800";
                    adviceText = "Keaktifan belajar tinggi (Momentum >100), tetapi pemahaman belum mencapai benchmark (<75%). Dorong latihan membaca & kuis.";
                  } else if (q === "Review") {
                    boxStyle = "bg-amber-50/80 border-amber-200/90 text-amber-900";
                    borderStyle = "border-amber-200/50";
                    iconColor = "text-amber-600";
                    textColor = "text-amber-800";
                    adviceText = "Pemahaman kanji tinggi (Pemahaman >100), tetapi keaktifan mengendur (Momentum <100). Kirim pengingat latihan harian via LMS.";
                  } else if (q === "Perhatian") {
                    boxStyle = "bg-rose-50/80 border-rose-200/90 text-rose-900";
                    borderStyle = "border-rose-200/50";
                    iconColor = "text-rose-600";
                    textColor = "text-rose-800";
                    adviceText = "Akurasi kuis dan keaktifan belajar di bawah benchmark (<75%). Memerlukan pendampingan bimbingan khusus pengajar dan remedi kuis dasar.";
                  }

                  return (
                    <div className={`p-3 border rounded-xl space-y-1.5 text-xs ${boxStyle}`}>
                      <div className={`flex items-center justify-between text-[11px] font-bold border-b pb-1 ${borderStyle}`}>
                        <span className="flex items-center gap-1">
                          <Icon name="sync" className={`text-xs ${iconColor}`} /> Arah Rotasi:
                        </span>
                        <span>Searah Jarum Jam 🔄</span>
                      </div>
                      <p className={`text-[11px] leading-snug ${textColor}`}>
                        <strong className="font-bold">💡 Saran Pengajar: </strong>
                        {adviceText}
                      </p>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Icon name="touch_app" className="text-2xl" />
                </div>
                <p className="text-xs font-semibold leading-relaxed">
                  Pilih mahasiswa pada peta RRG atau baris tabel untuk menganalisis lintasan rotasi belajar.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* INFORMATION DIALOG MODAL (Getting the most out of Learning Rotation) */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl flex max-h-[88vh] flex-col overflow-hidden animate-scale-up">
            {/* Dialog Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8f0020]/10 flex items-center justify-center text-[#8f0020]">
                  <Icon name="sync" className="text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    Panduan Analisis Rotasi Belajar (RRG)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Panduan memahami dinamika pergerakan rotasi belajar mahasiswa, fase evolusi pemahaman kanji, dan strategi pendampingan pengajar.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsHelpModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg border-none bg-transparent cursor-pointer p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Dialog Tabs Navigation */}
            <div className="px-6 pt-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2 bg-slate-200/60 p-1 rounded-xl">
                {[
                  { id: "playbook", label: "Playbook Belajar" },
                  { id: "basics", label: "Dasar RRG" },
                  { id: "moves", label: "Power Moves" },
                  { id: "limits", label: "Reality Check" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveHelpTab(tab.id)}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none ${
                      activeHelpTab === tab.id
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dialog Body Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-slate-700 text-xs leading-relaxed">
              {activeHelpTab === "playbook" && (
                <>
                  <p className="text-sm leading-6 text-slate-600 font-normal">
                    Relative Rotation Graph (RRG) memetakan alur pemahaman dan keaktifan mahasiswa. Memahami siklus rotasi membantu dosen dan pengajar memberikan intervensi pembelajaran yang tepat waktu.
                  </p>

                  <div className="space-y-3">
                    <div className="rounded-xl border border-slate-200 p-3.5 bg-white shadow-2xs space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-500/40 bg-emerald-500/10 text-emerald-700">
                          Melintas → Mahir
                        </span>
                        <p className="text-xs font-bold text-slate-900">Transisi Menuju Mahir Adalah Momen Emas</p>
                      </div>
                      <p className="text-xs text-slate-500 leading-5">
                        Mahasiswa yang baru melintas dari kuadran Berkembang ke Mahir menunjukkan peningkatan keaktifan dan akurasi kuis yang pesat. Ini adalah waktu terbaik untuk memberikan pengayaan materi Jukugo yang lebih kompleks.
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-3.5 bg-white shadow-2xs space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-500/40 bg-emerald-500/10 text-emerald-700">
                          Penguasaan Mahir
                        </span>
                        <p className="text-xs font-bold text-slate-900">Kuadran Mahir Menandakan Pemahaman Stabil</p>
                      </div>
                      <p className="text-xs text-slate-500 leading-5">
                        Mahasiswa di kuadran Mahir memiliki tingkat akurasi kuis, skor latihan membaca, & latihan menulis di atas rata-rata benchmark. Pertahankan ritme latihan harian agar penguasaan kanji tetap terasah.
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-3.5 bg-white shadow-2xs space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-amber-500/40 bg-amber-500/10 text-amber-700">
                          Fase Review
                        </span>
                        <p className="text-xs font-bold text-slate-900">Penurunan Momentum Adalah Sinyal Dini Pendampingan</p>
                      </div>
                      <p className="text-xs text-slate-500 leading-5">
                        Pemahaman kanji masih di atas rata-rata, tetapi keaktifan belajar mulai mengendur. Gunakan sinyal ini untuk memberikan pengingat latihan membaca & menulis serta penguatan ingatan sebelum akurasi drop.
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-3.5 bg-white shadow-2xs space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-rose-500/40 bg-rose-500/10 text-rose-700">
                          Fase Pemulihan
                        </span>
                        <p className="text-xs font-bold text-slate-900">Stabilisasi dari Kuadran Perhatian Perlu Dorongan Interaktif</p>
                      </div>
                      <p className="text-xs text-slate-500 leading-5">
                        Mahasiswa yang berbelok ke atas dari kuadran Perhatian sedang berupaya mengejar ketertinggalan. Berikan umpan balik positif pada hasil tugas LMS dan remedi kuis kanji.
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-3.5 bg-white shadow-2xs space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-sky-500/40 bg-sky-500/10 text-sky-700">
                          Regresi Belajar
                        </span>
                        <p className="text-xs font-bold text-slate-900">Lintasan Berlawanan Arah Menandakan Kendala Pemahaman</p>
                      </div>
                      <p className="text-xs text-slate-500 leading-5">
                        Sebagian besar mahasiswa bergerak searah jarum jam. Jika lintasan berputar balik, mengindikasikan mahasiswa mengalami kesulitan pada kanji/modul tertentu atau absensi keaktifan.
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-3.5 bg-white shadow-2xs space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-slate-300 bg-slate-100 text-slate-600">
                          Stagnan
                        </span>
                        <p className="text-xs font-bold text-slate-900">Lintasan Pendek/Stagnan Menandakan Aktivitas Konstan</p>
                      </div>
                      <p className="text-xs text-slate-500 leading-5">
                        Vektor lintasan pendek menunjukkan tidak ada perubahan signifikan pada frekuensi atau skor latihan dalam rentang waktu yang dipilih.
                      </p>
                    </div>
                  </div>

                  <section className="space-y-2 pt-2 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900">Skala Waktu & Evaluasi Rotasi</h3>
                    <p className="text-xs leading-5 text-slate-500">
                      Evaluasi RRG idealnya dipantau dalam skala mingguan. Progres pemahaman kanji yang permanen membutuhkan waktu 2 hingga 4 minggu latihan berulang. Hindari mengambil kesimpulan dari fluktuasi harian yang singkat.
                    </p>
                  </section>

                  <section className="space-y-2 pt-2 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900">Karakteristik Mahasiswa Berkinerja Unggul</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-xs leading-5 text-slate-600">
                        <Icon name="check_circle" className="text-emerald-600 text-base shrink-0 mt-0.5" />
                        <span>Lintasan panjang dan konsisten mengarah ke kuadran kanan atas (Mahir / Leading).</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs leading-5 text-slate-600">
                        <Icon name="check_circle" className="text-emerald-600 text-base shrink-0 mt-0.5" />
                        <span>Kecepatan rotasi menunjukkan status ↗ Cepat atau ↗ Meningkat.</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs leading-5 text-slate-600">
                        <Icon name="check_circle" className="text-emerald-600 text-base shrink-0 mt-0.5" />
                        <span>Akurasi kuis kanji, skor latihan membaca, & latihan menulis berada di atas benchmark (100+).</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs leading-5 text-slate-600">
                        <Icon name="check_circle" className="text-emerald-600 text-base shrink-0 mt-0.5" />
                        <span>Menunjukkan partisipasi aktif baik pada kanji dasar maupun gabungan jukugo.</span>
                      </li>
                    </ul>
                  </section>

                  <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-5 text-amber-900">
                    <Icon name="warning" className="text-amber-600 text-lg shrink-0 mt-0.5" />
                    <div>
                      RRG mengukur posisi relatif terhadap benchmark rata-rata angkatan/kelas. Jika nilai rata-rata angkatan rendah, mahasiswa di kuadran Mahir tetap disarankan meningkatkan jumlah kanji yang dikuasai secara mandiri.
                    </div>
                  </div>
                </>
              )}

              {activeHelpTab === "basics" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Dasar-Dasar Relative Rotation Graph (RRG) Edukasi</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Relative Rotation Graph (RRG) dipetakan ke dalam koordinat dua dimensi: 
                    <strong className="text-sky-800"> Sumbu X (Pemahaman)</strong> dan 
                    <strong className="text-emerald-800"> Sumbu Y (Momentum Keaktifan)</strong>. Benchmark kelas berada pada titik pusat (100, 100).
                  </p>

                  {/* Momentum Explanation Card */}
                  <div className="p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <Icon name="insights" className="text-emerald-600 text-base" />
                      Penjelasan Eksplisit Metrik Momentum Keaktifan (Sumbu Y)
                    </h4>
                    <ul className="space-y-1.5 text-xs text-emerald-800 leading-snug">
                      <li>
                        <strong>1. Cara Hitung:</strong> Kombinasi frekuensi latihan harian, banyaknya pengulangan kuis kanji, dan konsistensi akses dalam 4 pekan terakhir relatif terhadap rata-rata angkatan (100).
                      </li>
                      <li>
                        <strong>2. Kriteria Bagus (&gt;100):</strong> Skor Momentum &gt; 100 menandakan keaktifan tinggi dan akselerasi belajar positif. Skor &lt; 100 menandakan aktivitas mengendur/pasif.
                      </li>
                      <li>
                        <strong>3. Dampak Pembelajaran:</strong> Momentum tinggi memicu peningkatan pemahaman pada rotasi berikutnya. Momentum rendah menjadi peringatan dini sebelum akurasi kuis anjlok.
                      </li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl">
                      <span className="font-bold text-sky-800 block text-xs">Kuadran Berkembang (Improving)</span>
                      <span className="text-[11px] text-sky-700 mt-1 block">
                        Pemahaman &lt; 100, tetapi Momentum Keaktifan &gt; 100. Mahasiswa menunjukkan keaktifan tinggi yang berpotensi mendorong pemahaman ke kuadran Mahir.
                      </span>
                    </div>
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <span className="font-bold text-emerald-800 block text-xs">Kuadran Mahir (Leading)</span>
                      <span className="text-[11px] text-emerald-700 mt-1 block">
                        Pemahaman &gt; 100 dan Momentum Keaktifan &gt; 100. Mahasiswa menguasai materi kanji dengan akurasi kuis tinggi.
                      </span>
                    </div>
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <span className="font-bold text-amber-800 block text-xs">Kuadran Review (Weakening)</span>
                      <span className="text-[11px] text-amber-700 mt-1 block">
                        Pemahaman &gt; 100, tetapi Keaktifan Mulai Menurun &lt; 100. Memerlukan penguatan latihan membaca agar tidak turun ke kuadran Perhatian.
                      </span>
                    </div>
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                      <span className="font-bold text-rose-800 block text-xs">Kuadran Perhatian (Lagging)</span>
                      <span className="text-[11px] text-rose-700 mt-1 block">
                        Pemahaman &lt; 100 dan Keaktifan &lt; 100. Memerlukan pendampingan khusus dan umpan balik dosen.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeHelpTab === "moves" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Indikator Pergerakan Progres (Power Moves)</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Memantau metrik delta kecepatan rotasi (<code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">r</code> delta pemahaman & <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">m</code> delta momentum) untuk mengetahui seberapa cepat peningkatan mahasiswa terjadi.
                  </p>
                  <div className="space-y-3 pt-2">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="font-bold text-slate-900 text-xs block">1. Rotasi Searah Jarum Jam (Clockwise Rotation)</span>
                      <p className="text-xs text-slate-600">
                        Pergerakan ideal mahasiswa: Berkembang → Mahir → Review → Perhatian → Berkembang. Rotasi searah jarum jam menandakan kurva belajar yang sehat dan berkelanjutan.
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="font-bold text-slate-900 text-xs block">2. Akselerasi Lintasan (Vektor Panjang)</span>
                      <p className="text-xs text-slate-600">
                        Semakin panjang lintasan ekor (tail), semakin cepat laju pertumbuhan relatif pemahaman dan momentum keaktifan mahasiswa dibandingkan benchmark angkatan.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeHelpTab === "limits" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Catatan Analisis (Reality Check)</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Peta rotasi memberikan pemetaan posisi relatif mahasiswa terhadap benchmark rata-rata angkatan/kelas. Selalu kombinasikan data RRG dengan skor kuis mutlak dan pengerjaan tugas modul.
                  </p>
                  <div className="space-y-3 pt-2">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="font-bold text-slate-900 text-xs block">Evaluasi Komprehensif</span>
                      <p className="text-xs text-slate-600">
                        Mahasiswa di kuadran Mahir mungkin memiliki skor tinggi secara relatif, namun tetap membutuhkan variasi soal kuis yang lebih menantang untuk mempertahankan retensi ingatan kanji jangka panjang.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dialog Footer */}
            <div className="flex justify-end items-center gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50/50">
              <button
                onClick={() => setIsHelpModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RotationLearningChart;
