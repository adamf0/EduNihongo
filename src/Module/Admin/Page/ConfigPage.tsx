import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../Common/Component/Organism/Layout";
import { api } from "../../Common/Utility/api";

interface ConfigStats {
  futureScheduledModulesCount: number;
  totalScheduledModulesCount: number;
  activeModulesCount: number;
}

interface SystemConfigData {
  id: number;
  enableMasteryLock: boolean;
  enableScheduleLock: boolean;
  updatedAt?: string;
  stats?: ConfigStats;
}

const formatWibTimestamp = (iso?: string): string => {
  if (!iso) return "Belum pernah diperbarui";
  const parsed = new Date(iso);
  if (isNaN(parsed.getTime())) return "Belum pernah diperbarui";
  return (
    parsed
      .toLocaleDateString("id-ID", {
        timeZone: "Asia/Jakarta",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(".", ":") + " WIB"
  );
};

interface RuleSwitchProps {
  id: string;
  checked: boolean;
  describedBy: string;
  onChange: (nextValue: boolean) => void;
}

const RuleSwitch: React.FC<RuleSwitchProps> = ({
  id,
  checked,
  describedBy,
  onChange,
}) => {
  return (
    <label
      htmlFor={id}
      className="relative inline-flex items-center justify-center min-w-[48px] min-h-[48px] shrink-0 cursor-pointer select-none"
    >
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        aria-checked={checked}
        aria-describedby={describedBy}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={`w-14 h-8 rounded-full transition-colors motion-reduce:transition-none flex items-center px-1 border peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary ${
          checked
            ? "bg-primary border-primary"
            : "bg-[#475569] border-[#334155]"
        }`}
      >
        <span
          className={`w-6 h-6 rounded-full bg-white shadow-xs transition-transform motion-reduce:transition-none ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </span>
    </label>
  );
};

interface StatusIndicatorProps {
  active: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ active }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
        active
          ? "bg-[#ecfdf5] text-[#14532d] border-[#14532d]/40"
          : "bg-[#f1f5f9] text-[#334155] border-[#64748b]"
      }`}
    >
      <span
        aria-hidden="true"
        className="material-symbols-outlined text-sm leading-none select-none"
      >
        {active ? "lock" : "lock_open"}
      </span>
      <span>{active ? "Aktif" : "Nonaktif"}</span>
    </span>
  );
};

export const ConfigPage: React.FC = () => {
  const navigate = useNavigate();

  const [savedConfig, setSavedConfig] = useState<SystemConfigData | null>(null);
  const [enableMasteryLock, setEnableMasteryLock] = useState<boolean>(true);
  const [enableScheduleLock, setEnableScheduleLock] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isForbidden, setIsForbidden] = useState<boolean>(false);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");

  const applyLoadedConfig = useCallback((data: SystemConfigData) => {
    setSavedConfig(data);
    setEnableMasteryLock(Boolean(data.enableMasteryLock));
    setEnableScheduleLock(Boolean(data.enableScheduleLock));
  }, []);

  const handleLoadError = useCallback(
    (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Gagal memuat konfigurasi aturan modul.";
      setError(msg);
      if (/Akses ditolak|administrator/i.test(msg)) {
        setIsForbidden(true);
      } else if (/Token|Unauthorized/i.test(msg)) {
        navigate("/login");
      }
    },
    [navigate]
  );

  const loadConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setIsForbidden(false);
      const data: SystemConfigData = await api.admin.config.get();
      applyLoadedConfig(data);
    } catch (err: unknown) {
      handleLoadError(err);
    } finally {
      setLoading(false);
    }
  }, [applyLoadedConfig, handleLoadError]);

  useEffect(() => {
    if (!api.auth.isAuthenticated()) {
      navigate("/login");
      return;
    }

    let cancelled = false;
    api.admin.config
      .get()
      .then((data: SystemConfigData) => {
        if (!cancelled) {
          applyLoadedConfig(data);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          handleLoadError(err);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [applyLoadedConfig, handleLoadError, navigate]);

  const isDirty =
    savedConfig !== null &&
    (enableMasteryLock !== savedConfig.enableMasteryLock ||
      enableScheduleLock !== savedConfig.enableScheduleLock);

  const handleToggleMastery = (value: boolean) => {
    setEnableMasteryLock(value);
    setSubmitSuccess("");
    setSubmitError("");
  };

  const handleToggleSchedule = (value: boolean) => {
    setEnableScheduleLock(value);
    setSubmitSuccess("");
    setSubmitError("");
  };

  const handleResetChanges = () => {
    if (!savedConfig) return;
    setEnableMasteryLock(savedConfig.enableMasteryLock);
    setEnableScheduleLock(savedConfig.enableScheduleLock);
    setSubmitSuccess("");
    setSubmitError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setSubmitSuccess("");
      setSubmitError("");
      const updated = await api.admin.config.update({
        enableMasteryLock,
        enableScheduleLock,
      });
      setSavedConfig({
        id: updated.id,
        enableMasteryLock: Boolean(updated.enableMasteryLock),
        enableScheduleLock: Boolean(updated.enableScheduleLock),
        updatedAt: updated.updatedAt,
        stats: updated.stats,
      });
      setEnableMasteryLock(Boolean(updated.enableMasteryLock));
      setEnableScheduleLock(Boolean(updated.enableScheduleLock));
      setSubmitSuccess(
        updated.message || "Konfigurasi aturan akses modul berhasil disimpan ke database."
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal menyimpan konfigurasi aturan modul.";
      setSubmitError(msg);
      if (/Token|Unauthorized/i.test(msg)) {
        navigate("/login");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <main className="flex-1 w-full px-4 md:px-6 max-w-[1200px] mx-auto py-8">
          <div
            role="status"
            aria-live="polite"
            className="bg-white border border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center min-h-[280px] gap-3 text-center"
          >
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-4xl text-primary animate-spin motion-reduce:animate-none"
            >
              progress_activity
            </span>
            <p className="text-base font-bold text-[#191c1e]">
              Memuat konfigurasi aturan akses modul...
            </p>
            <p className="text-sm text-[#475569]">
              Mengambil status aturan terbaru dari database server.
            </p>
          </div>
        </main>
      </Layout>
    );
  }

  if (error || !savedConfig) {
    return (
      <Layout>
        <main className="flex-1 w-full px-4 md:px-6 max-w-[1200px] mx-auto py-8">
          <div
            role="alert"
            className="bg-white border border-[#991b1b]/40 rounded-xl p-6 md:p-8 max-w-xl mx-auto space-y-4"
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-2xl text-[#991b1b] shrink-0 mt-0.5"
              >
                {isForbidden ? "gpp_bad" : "error"}
              </span>
              <div className="space-y-1.5">
                <h1 className="text-xl font-bold text-[#191c1e]">
                  {isForbidden
                    ? "Akses Halaman Konfigurasi Dibatasi"
                    : "Gagal Memuat Konfigurasi"}
                </h1>
                <p className="text-sm text-[#5c403f] leading-relaxed">
                  {error || "Terjadi kendala saat mengambil konfigurasi dari server."}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {!isForbidden ? (
                <button
                  type="button"
                  onClick={loadConfig}
                  className="min-h-[44px] px-5 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm cursor-pointer hover:brightness-110 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Muat Ulang Konfigurasi
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate("/module")}
                  className="min-h-[44px] px-5 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm cursor-pointer hover:brightness-110 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Kembali ke Modul Belajar
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate(isForbidden ? "/dashboard" : "/admin")}
                className="min-h-[44px] px-5 py-2.5 rounded-lg border border-[#64748b] bg-white text-[#191c1e] font-semibold text-sm cursor-pointer hover:bg-[#f1f5f9] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {isForbidden ? "Kembali ke Beranda" : "Kembali ke Kelola Modul"}
              </button>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  const stats = savedConfig.stats;
  const bothDisabled = !enableMasteryLock && !enableScheduleLock;

  return (
    <Layout>
      <main className="flex-1 w-full px-4 md:px-6 max-w-[1200px] mx-auto py-5 md:py-8 space-y-6">
        {/* Page Header */}
        <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-300 pb-5">
          <div className="space-y-1.5 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#191c1e] flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-primary text-3xl shrink-0"
              >
                tune
              </span>
              <span>Konfigurasi Aturan Akses Modul</span>
            </h1>
            <p className="text-sm sm:text-base text-[#5c403f] leading-relaxed">
              Aktifkan atau nonaktifkan aturan syarat penguasaan minimal 60% dan pembukaan modul terjadwal untuk mahasiswa.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="min-h-[44px] px-4 py-2.5 rounded-lg border border-[#64748b] bg-white text-[#191c1e] text-sm font-semibold hover:bg-[#f1f5f9] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-lg leading-none"
            >
              arrow_back
            </span>
            <span>Kembali ke Kelola Modul</span>
          </button>
        </section>

        {/* Feedback Banners */}
        {submitSuccess && (
          <div
            role="status"
            aria-live="polite"
            className="p-4 rounded-lg bg-[#ecfdf5] border border-[#14532d]/40 text-[#14532d] flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-2.5">
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-xl shrink-0 mt-0.5"
              >
                check_circle
              </span>
              <div className="text-sm font-semibold leading-relaxed">
                {submitSuccess}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSubmitSuccess("")}
              aria-label="Tutup pemberitahuan"
              className="min-w-[44px] min-h-[44px] -my-2 -mr-2 rounded-lg inline-flex items-center justify-center text-[#14532d] hover:bg-[#14532d]/10 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-lg">
                close
              </span>
            </button>
          </div>
        )}

        {submitError && (
          <div
            role="alert"
            aria-live="assertive"
            className="p-4 rounded-lg bg-[#fef2f2] border border-[#991b1b]/40 text-[#991b1b] flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-2.5">
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-xl shrink-0 mt-0.5"
              >
                error
              </span>
              <div className="text-sm font-semibold leading-relaxed">
                {submitError}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSubmitError("")}
              aria-label="Tutup pesan kesalahan"
              className="min-w-[44px] min-h-[44px] -my-2 -mr-2 rounded-lg inline-flex items-center justify-center text-[#991b1b] hover:bg-[#991b1b]/10 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-lg">
                close
              </span>
            </button>
          </div>
        )}

        {/* Asymmetric 2-Column Layout on Desktop, Stacked on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Primary Editable Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 bg-white border border-slate-300 rounded-xl overflow-hidden"
          >
            <fieldset className="divide-y divide-slate-200">
              <legend className="sr-only">Aturan Akses Modul dan Kanji</legend>

              {/* Rule 1: Mastery >= 60% */}
              <div className="p-5 sm:p-6 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <label
                      htmlFor="toggle-mastery-lock"
                      className="text-base sm:text-lg font-bold text-[#191c1e] cursor-pointer"
                    >
                      Aturan Penguasaan Minimal 60%
                    </label>
                    <StatusIndicator active={enableMasteryLock} />
                  </div>
                  <p
                    id="rule-mastery-desc"
                    className="text-sm text-[#5c403f] leading-relaxed"
                  >
                    {enableMasteryLock
                      ? "Mahasiswa wajib menuntaskan seluruh kanji pada modul sebelumnya minimal 60% untuk membuka modul berikutnya, serta mempelajari kanji berurutan."
                      : "Syarat nilai penguasaan 60% dinonaktifkan. Seluruh modul berurutan dan kanji di dalamnya dapat diakses langsung tanpa prasyarat."}
                  </p>
                </div>

                <RuleSwitch
                  id="toggle-mastery-lock"
                  checked={enableMasteryLock}
                  describedBy="rule-mastery-desc"
                  onChange={handleToggleMastery}
                />
              </div>

              {/* Rule 2: Module Schedule */}
              <div className="p-5 sm:p-6 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <label
                      htmlFor="toggle-schedule-lock"
                      className="text-base sm:text-lg font-bold text-[#191c1e] cursor-pointer"
                    >
                      Aturan Jadwal Buka Modul
                    </label>
                    <StatusIndicator active={enableScheduleLock} />
                  </div>
                  <p
                    id="rule-schedule-desc"
                    className="text-sm text-[#5c403f] leading-relaxed"
                  >
                    {enableScheduleLock
                      ? "Modul yang memiliki tanggal rilis di masa mendatang akan terkunci otomatis hingga tanggal dan jam buka (WIB) tercapai."
                      : "Pembatasan berdasarkan tanggal buka modul dinonaktifkan. Mahasiswa dapat langsung membuka modul meskipun jadwal rilisnya belum tiba."}
                  </p>
                </div>

                <RuleSwitch
                  id="toggle-schedule-lock"
                  checked={enableScheduleLock}
                  describedBy="rule-schedule-desc"
                  onChange={handleToggleSchedule}
                />
              </div>
            </fieldset>

            {/* Form Footer Actions */}
            <div className="bg-[#f8fafc] border-t border-slate-200 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="min-w-0">
                {isDirty ? (
                  <p className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg bg-[#fef3c7] text-[#78350f] border border-[#78350f]/30">
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-base leading-none"
                    >
                      edit_note
                    </span>
                    <span>Ada perubahan yang belum disimpan</span>
                  </p>
                ) : (
                  <p className="text-xs sm:text-sm text-[#475569]">
                    Terakhir disimpan: {formatWibTimestamp(savedConfig.updatedAt)}
                  </p>
                )}
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                {isDirty && (
                  <button
                    type="button"
                    onClick={handleResetChanges}
                    disabled={submitting}
                    className="min-h-[48px] px-4 py-2.5 rounded-lg border border-[#64748b] bg-white text-[#191c1e] text-sm font-semibold hover:bg-[#f1f5f9] disabled:opacity-50 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Batalkan Perubahan
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="min-h-[48px] px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-bold shadow-xs hover:brightness-110 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all inline-flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-lg leading-none"
                  >
                    {submitting ? "hourglass_top" : "save"}
                  </span>
                  <span>
                    {submitting ? "Menyimpan Perubahan..." : "Simpan Konfigurasi"}
                  </span>
                </button>
              </div>
            </div>
          </form>

          {/* Supporting Summary & DB Schedule Status Panel */}
          <aside className="lg:col-span-5 bg-[#f8fafc] border border-slate-300 rounded-xl p-5 sm:p-6 space-y-5">
            <div className="space-y-2 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 text-[#191c1e]">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-xl text-[#c8232a]"
                >
                  rule
                </span>
                <h2 className="text-base font-bold">
                  Dampak Pengaturan Saat Ini
                </h2>
              </div>
              <p className="text-sm text-[#334155] leading-relaxed">
                {bothDisabled
                  ? "Mode akses bebas aktif. Kedua pembatasan dimatikan sehingga seluruh modul dan kanji terbuka untuk mahasiswa."
                  : enableMasteryLock && enableScheduleLock
                  ? "Pembelajaran bertahap penuh aktif. Mahasiswa harus memenuhi syarat ketuntasan 60% sekaligus mengikuti jadwal buka modul."
                  : enableMasteryLock
                  ? "Hanya syarat ketuntasan 60% yang berlaku. Jadwal tanggal rilis diabaikan agar mahasiswa dapat maju sesuai kecepatan masing-masing."
                  : "Hanya jadwal tanggal buka modul yang berlaku. Semua kanji dalam modul yang sudah rilis terbuka bebas tanpa syarat 60%."}
              </p>
            </div>

            {stats && (
              <div className="space-y-3 border-b border-slate-200 pb-4">
                <h2 className="text-sm font-bold text-[#191c1e]">
                  Status Modul di Database
                </h2>
                <dl className="space-y-2.5 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-[#334155]">Modul dengan materi kanji</dt>
                    <dd className="font-bold text-[#191c1e] tabular-nums">
                      {stats.activeModulesCount} modul
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-[#334155]">Memiliki jadwal rilis</dt>
                    <dd className="font-bold text-[#191c1e] tabular-nums">
                      {stats.totalScheduledModulesCount} modul
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-[#334155]">Belum melewati tanggal buka</dt>
                    <dd className="font-bold text-[#191c1e] tabular-nums">
                      {stats.futureScheduledModulesCount} modul
                    </dd>
                  </div>
                </dl>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => navigate("/admin")}
                    className="w-full min-h-[44px] px-4 py-2 rounded-lg border border-[#64748b] bg-white text-[#191c1e] text-sm font-semibold hover:bg-[#f1f5f9] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-lg leading-none"
                    >
                      calendar_month
                    </span>
                    <span>Kelola Jadwal Modul</span>
                  </button>
                </div>
              </div>
            )}

            <div className="text-xs text-[#334155] leading-relaxed space-y-1">
              <p className="font-bold text-[#191c1e]">Catatan Pengecualian</p>
              <p>
                Akun Administrator tetap dapat mengakses seluruh modul dan halaman latihan kapan saja untuk keperluan peninjauan materi.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </Layout>
  );
};

export default ConfigPage;
