import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type AnalyticsDataSourceMode = "mock" | "real" | "hybrid";

export interface AnalyticsQueryParams {
  startDate?: string;
  endDate?: string;
  moduleId?: number;
  kanjiId?: number;
  search?: string;
}

export interface StudentRotationItem {
  id: number;
  userName: string;
  userEmail: string;
  userAvatar: string;
  relativeComprehension: number;
  momentum: number;
  quadrant: "Mahir" | "Berkembang" | "Perhatian" | "Review";
  phase: string;
  color: string;
  vsBenchmark: number;
  momentumStatus: "Sangat Aktif" | "Meningkat" | "Stabil" | "Perlu Penguatan";
  moveDelta: { r: number; m: number };
  quizAccuracy: number;
  readingPracticeScore: number;
  writingPracticeScore: number;
  readingAttemptsCount: number;
  writingAttemptsCount: number;
  readingEfficiency: number;
  writingEfficiency: number;
  accessFrequency: number;
  attemptsCount: number;
  trajectory: Array<{ x: number; y: number }>;
  historyRatio?: number[];
  historyMomentum?: number[];
}

export interface IAnalyticsAdapter {
  getRotationAnalytics(params: AnalyticsQueryParams): Promise<StudentRotationItem[]>;
}

// ----------------------------------------------------------------------
// 1. MOCK DATA SOURCE ADAPTER
// ----------------------------------------------------------------------
export class MockAnalyticsAdapter implements IAnalyticsAdapter {
  async getRotationAnalytics(params: AnalyticsQueryParams): Promise<StudentRotationItem[]> {
    const mockStudents: StudentRotationItem[] = [
      {
        id: 9000,
        userName: "Haruki Sato",
        userEmail: "haruki@sato.com",
        userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150",
        relativeComprehension: 86.4,
        momentum: 125.0,
        quadrant: "Berkembang",
        phase: "Rotasi → Mahir",
        color: "#0284c7",
        vsBenchmark: -13.6,
        momentumStatus: "Sangat Aktif",
        moveDelta: { r: 3.2, m: 2.5 },
        quizAccuracy: 78,
        readingPracticeScore: 66,
        writingPracticeScore: 62,
        readingAttemptsCount: 14,
        writingAttemptsCount: 16,
        readingEfficiency: 52,
        writingEfficiency: 48,
        accessFrequency: 95,
        attemptsCount: 8,
        trajectory: [
          { x: 78.0, y: 105.0 },
          { x: 80.5, y: 112.0 },
          { x: 83.0, y: 118.0 },
          { x: 84.5, y: 122.5 },
          { x: 86.4, y: 125.0 },
        ],
        historyRatio: [78.0, 80.5, 83.0, 84.5, 86.4],
        historyMomentum: [105.0, 112.0, 118.0, 122.5, 125.0],
      },
      {
        id: 9001,
        userName: "Aoi Tanaka",
        userEmail: "aoi.tanaka@edunihongo.id",
        userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150",
        relativeComprehension: 112.5,
        momentum: 114.0,
        quadrant: "Mahir",
        phase: "Penguatan Keaktifan",
        color: "#16a34a",
        vsBenchmark: 12.5,
        momentumStatus: "Sangat Aktif",
        moveDelta: { r: 2.1, m: 3.5 },
        quizAccuracy: 92,
        readingPracticeScore: 85,
        writingPracticeScore: 88,
        readingAttemptsCount: 5,
        writingAttemptsCount: 6,
        readingEfficiency: 85,
        writingEfficiency: 87,
        accessFrequency: 88,
        attemptsCount: 6,
        trajectory: [
          { x: 102.0, y: 104.0 },
          { x: 105.0, y: 108.0 },
          { x: 108.0, y: 110.0 },
          { x: 110.4, y: 110.5 },
          { x: 112.5, y: 114.0 },
        ],
        historyRatio: [102.0, 105.0, 108.0, 110.4, 112.5],
        historyMomentum: [104.0, 108.0, 110.0, 110.5, 114.0],
      },
      {
        id: 9002,
        userName: "Kenji Sato",
        userEmail: "kenji.sato@edunihongo.id",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150",
        relativeComprehension: 107.0,
        momentum: 105.5,
        quadrant: "Mahir",
        phase: "Penguatan Keaktifan",
        color: "#0d9488",
        vsBenchmark: 7.0,
        momentumStatus: "Meningkat",
        moveDelta: { r: 1.5, m: 2.0 },
        quizAccuracy: 88,
        readingPracticeScore: 80,
        writingPracticeScore: 84,
        readingAttemptsCount: 8,
        writingAttemptsCount: 9,
        readingEfficiency: 75,
        writingEfficiency: 79,
        accessFrequency: 80,
        attemptsCount: 4,
        trajectory: [
          { x: 99.0, y: 98.0 },
          { x: 102.0, y: 101.0 },
          { x: 104.5, y: 103.0 },
          { x: 105.5, y: 103.5 },
          { x: 107.0, y: 105.5 },
        ],
        historyRatio: [99.0, 102.0, 104.5, 105.5, 107.0],
        historyMomentum: [98.0, 101.0, 103.0, 103.5, 105.5],
      },
      {
        id: 9003,
        userName: "Yuki Sato",
        userEmail: "yuki.sato@edunihongo.id",
        userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150",
        relativeComprehension: 91.0,
        momentum: 108.0,
        quadrant: "Berkembang",
        phase: "Rotasi → Mahir",
        color: "#0284c7",
        vsBenchmark: -9.0,
        momentumStatus: "Sangat Aktif",
        moveDelta: { r: 3.0, m: 4.2 },
        quizAccuracy: 65,
        readingPracticeScore: 60,
        writingPracticeScore: 58,
        readingAttemptsCount: 18,
        writingAttemptsCount: 22,
        readingEfficiency: 45,
        writingEfficiency: 42,
        accessFrequency: 78,
        attemptsCount: 5,
        trajectory: [
          { x: 82.0, y: 92.0 },
          { x: 85.0, y: 98.0 },
          { x: 87.0, y: 102.0 },
          { x: 88.0, y: 103.8 },
          { x: 91.0, y: 108.0 },
        ],
        historyRatio: [82.0, 85.0, 87.0, 88.0, 91.0],
        historyMomentum: [92.0, 98.0, 102.0, 103.8, 108.0],
      },
      {
        id: 9004,
        userName: "Mei Lin",
        userEmail: "mei.lin@edunihongo.id",
        userAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150",
        relativeComprehension: 109.0,
        momentum: 91.5,
        quadrant: "Review",
        phase: "Stabilisasi",
        color: "#d97706",
        vsBenchmark: 9.0,
        momentumStatus: "Stabil",
        moveDelta: { r: -0.5, m: -3.0 },
        quizAccuracy: 89,
        readingPracticeScore: 82,
        writingPracticeScore: 85,
        readingAttemptsCount: 7,
        writingAttemptsCount: 8,
        readingEfficiency: 79,
        writingEfficiency: 81,
        accessFrequency: 45,
        attemptsCount: 2,
        trajectory: [
          { x: 112.0, y: 105.0 },
          { x: 111.0, y: 100.0 },
          { x: 110.0, y: 96.0 },
          { x: 109.5, y: 94.5 },
          { x: 109.0, y: 91.5 },
        ],
        historyRatio: [112.0, 111.0, 110.0, 109.5, 109.0],
        historyMomentum: [105.0, 100.0, 96.0, 94.5, 91.5],
      },
      {
        id: 9005,
        userName: "Riku Takahashi",
        userEmail: "riku.takahashi@edunihongo.id",
        userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150",
        relativeComprehension: 84.0,
        momentum: 86.0,
        quadrant: "Perhatian",
        phase: "Perlu Pendampingan",
        color: "#e11d48",
        vsBenchmark: -16.0,
        momentumStatus: "Perlu Penguatan",
        moveDelta: { r: -1.2, m: -2.0 },
        quizAccuracy: 55,
        readingPracticeScore: 48,
        writingPracticeScore: 44,
        readingAttemptsCount: 15,
        writingAttemptsCount: 19,
        readingEfficiency: 38,
        writingEfficiency: 32,
        accessFrequency: 35,
        attemptsCount: 1,
        trajectory: [
          { x: 92.0, y: 95.0 },
          { x: 89.0, y: 92.0 },
          { x: 87.0, y: 89.0 },
          { x: 85.2, y: 88.0 },
          { x: 84.0, y: 86.0 },
        ],
        historyRatio: [92.0, 89.0, 87.0, 85.2, 84.0],
        historyMomentum: [95.0, 92.0, 89.0, 88.0, 86.0],
      },
    ];

    if (params.search) {
      const q = params.search.trim().toLowerCase();
      return mockStudents.filter(
        (st) => st.userName.toLowerCase().includes(q) || st.userEmail.toLowerCase().includes(q)
      );
    }
    return mockStudents;
  }
}

// ----------------------------------------------------------------------
// 2. REAL ENDPOINT / DATABASE ADAPTER
// ----------------------------------------------------------------------
export class RealAnalyticsAdapter implements IAnalyticsAdapter {
  async getRotationAnalytics(params: AnalyticsQueryParams): Promise<StudentRotationItem[]> {
    const { startDate, endDate, moduleId, kanjiId, search } = params;

    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) {
      const eDate = new Date(endDate);
      eDate.setHours(23, 59, 59, 999);
      dateFilter.lte = eDate;
    }

    const attemptWhere: any = {};
    if (startDate || endDate) attemptWhere.createdAt = dateFilter;
    if (kanjiId) attemptWhere.kanjiId = Number(kanjiId);
    else if (moduleId) attemptWhere.kanji = { moduleId: Number(moduleId) };

    const searchQuery = typeof search === "string" ? search.trim().toLowerCase() : "";

    const users = await prisma.user.findMany({
      where: {
        role: { not: "ADMIN" },
        ...(searchQuery
          ? {
              OR: [
                { name: { contains: searchQuery } },
                { email: { contains: searchQuery } },
              ],
            }
          : {}),
      },
      include: {
        kanjiProgress: true,
        activities: startDate || endDate ? { where: { date: dateFilter } } : true,
        quizAttempts: startDate || endDate || kanjiId || moduleId ? { where: attemptWhere } : true,
      },
      orderBy: { id: "asc" },
    });

    const userColors = [
      "#0284c7", "#16a34a", "#e11d48", "#d97706", "#8b5cf6",
      "#06b6d4", "#10b981", "#f43f5e", "#f59e0b", "#a855f7"
    ];

    return users.map((u, idx) => {
      const uAttempts = u.quizAttempts || [];
      const uProgress = u.kanjiProgress || [];
      const uActivities = u.activities || [];

      let compScore = 0;
      if (uAttempts.length > 0) {
        compScore = uAttempts.reduce((acc, a) => acc + a.totalScore, 0) / uAttempts.length;
      } else if (uProgress.length > 0) {
        compScore = uProgress.reduce((acc, p) => acc + p.quizPercent, 0) / uProgress.length;
      }

      let readScore = uProgress.length > 0 ? uProgress.reduce((acc, p) => acc + p.readingPercent, 0) / uProgress.length : 0;
      let writeScore = uProgress.length > 0 ? uProgress.reduce((acc, p) => acc + p.writingPercent, 0) / uProgress.length : 0;

      // Calculate trial & error attempts and trial efficiency factors strictly from DB
      let readingAttemptsCount = uProgress.length > 0 ? uProgress.reduce((acc, p) => acc + Math.max(0, p.mistakeCount), 0) : 0;
      let writingAttemptsCount = uProgress.length > 0 ? uProgress.reduce((acc, p) => acc + Math.max(0, Math.round((100 - p.writingPercent) / 15)), 0) : 0;

      let readingEfficiency = readScore > 0 ? Math.max(0, Math.round(readScore * (1 - Math.min(0.5, readingAttemptsCount * 0.03)))) : 0;
      let writingEfficiency = writeScore > 0 ? Math.max(0, Math.round(writeScore * (1 - Math.min(0.5, writingAttemptsCount * 0.03)))) : 0;

      // 3. Weighted Mastery Score (baseComp: 50% Quiz, 25% Reading Efficiency, 25% Writing Efficiency)
      const baseComp = Math.round(0.50 * compScore + 0.25 * readingEfficiency + 0.25 * writingEfficiency);

      // 4. Relative Pemahaman (X-Axis, centered at 100.0 Benchmark where baseComp = 75%)
      const relativeX = baseComp > 0 ? Math.round(Math.min(125, Math.max(75, 100 + (baseComp - 75) * 0.8)) * 10) / 10 : 75.0;

      // 5. Momentum Keaktifan (Y-Axis, centered at 100.0 Benchmark where activity is normal)
      const accessScore = Math.min(100, uActivities.length * 15 + uProgress.length * 10);
      const activityCount = uActivities.length + uAttempts.length * 2 + uProgress.length;
      const normActivity = Math.min(100, activityCount * 10);
      const relativeY = activityCount > 0 ? Math.round(Math.min(125, Math.max(75, 100 + (normActivity - 50) * 0.5)) * 10) / 10 : 75.0;

      // 6. Educational Quadrant Classification based on 100.0 Benchmark
      let quadrant: "Mahir" | "Berkembang" | "Perhatian" | "Review" = "Mahir";
      if (relativeX >= 100 && relativeY >= 100) quadrant = "Mahir";
      else if (relativeX < 100 && relativeY >= 100) quadrant = "Berkembang";
      else if (relativeX < 100 && relativeY < 100) quadrant = "Perhatian";
      else quadrant = "Review";

      let phase = "Penguatan Keaktifan";
      if (quadrant === "Mahir") phase = relativeY >= 105 ? "Penguatan Keaktifan" : "Rotasi → Review";
      else if (quadrant === "Berkembang") phase = relativeY >= 100 ? "Rotasi → Mahir" : "Stabilisasi";
      else if (quadrant === "Perhatian") phase = relativeY < 100 ? "Perlu Pendampingan" : "Rotasi → Berkembang";
      else phase = relativeY < 100 ? "Rotasi → Perhatian" : "Stabilisasi";

      // Curved rotation trajectory tails
      const deltaX = (relativeX - 100) / 4;
      const deltaY = (relativeY - 100) / 4;
      const clampPt = (v: number) => Math.round(Math.min(125, Math.max(75, v)) * 10) / 10;

      const trajectory = [
        { x: clampPt(100 - deltaY * 1.5), y: clampPt(100 + deltaX * 1.2) },
        { x: clampPt(100 - deltaY * 1.0 + deltaX * 0.5), y: clampPt(100 + deltaX * 1.5) },
        { x: clampPt(relativeX - deltaX * 1.2), y: clampPt(relativeY - deltaY * 1.2) },
        { x: clampPt(relativeX - deltaX * 0.4), y: clampPt(relativeY - deltaY * 0.4) },
        { x: relativeX, y: relativeY },
      ];

      let momentumStatus: "Sangat Aktif" | "Meningkat" | "Stabil" | "Perlu Penguatan" = "Sangat Aktif";
      if (relativeY >= 110) momentumStatus = "Sangat Aktif";
      else if (relativeY >= 100) momentumStatus = "Meningkat";
      else if (relativeY >= 90) momentumStatus = "Stabil";
      else momentumStatus = "Perlu Penguatan";

      const moveDelta = {
        r: Math.round((relativeX - trajectory[3].x) * 10) / 10,
        m: Math.round((relativeY - trajectory[3].y) * 10) / 10,
      };

      return {
        id: u.id,
        userName: u.name || "Mahasiswa",
        userEmail: u.email || "",
        userAvatar: u.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150",
        relativeComprehension: relativeX,
        momentum: relativeY,
        quadrant,
        phase,
        color: userColors[idx % userColors.length],
        vsBenchmark: Math.round((relativeX - 100) * 10) / 10,
        momentumStatus,
        moveDelta,
        quizAccuracy: Math.round(compScore),
        readingPracticeScore: Math.round(readScore),
        writingPracticeScore: Math.round(writeScore),
        readingAttemptsCount,
        writingAttemptsCount,
        readingEfficiency,
        writingEfficiency,
        accessFrequency: Math.round(accessScore),
        attemptsCount: uAttempts.length,
        trajectory,
        historyRatio: trajectory.map((pt) => pt.x),
        historyMomentum: trajectory.map((pt) => pt.y),
      };
    });
  }
}

// ----------------------------------------------------------------------
// 3. HYBRID DATA SOURCE ADAPTER (Real DB enriched with Benchmark Samples)
// ----------------------------------------------------------------------
export class HybridAnalyticsAdapter implements IAnalyticsAdapter {
  private realAdapter = new RealAnalyticsAdapter();
  private mockAdapter = new MockAnalyticsAdapter();

  async getRotationAnalytics(params: AnalyticsQueryParams): Promise<StudentRotationItem[]> {
    const realStudents = await this.realAdapter.getRotationAnalytics(params);
    const mockStudents = await this.mockAdapter.getRotationAnalytics(params);

    if (realStudents.length === 0) {
      return mockStudents;
    }

    // Combine real students with non-conflicting mock benchmark students for full 4-quadrant view
    const realIds = new Set(realStudents.map((s) => s.id));
    const supplementalMocks = mockStudents.filter((ms) => !realIds.has(ms.id));

    return [...realStudents, ...supplementalMocks];
  }
}

// ----------------------------------------------------------------------
// 4. ADAPTER FACTORY (Controlled by process.env.ANALYTICS_DATA_SOURCE)
// ----------------------------------------------------------------------
export class AnalyticsAdapterFactory {
  static getAdapter(): IAnalyticsAdapter {
    const envMode = (process.env.ANALYTICS_DATA_SOURCE || process.env.VITE_ANALYTICS_DATA_SOURCE || "mock").toLowerCase().trim();

    if (envMode === "real" || envMode === "db" || envMode === "endpoint") {
      return new RealAnalyticsAdapter();
    } else if (envMode === "hybrid") {
      return new HybridAnalyticsAdapter();
    }
    // Default mode is "mock"
    return new MockAnalyticsAdapter();
  }
}
