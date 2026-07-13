import React, { useState, useEffect } from "react";
import Layout from "../../Common/Component/Organism/Layout";
import Icon from "../../Common/Component/Icon";
import { useNavigate } from "react-router-dom";
import { api } from "../../Common/Utility/api";

const avatarPresets = [
  { name: "Default Persona", url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150" },
  { name: "Samurai Mask", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80" },
  { name: "Sakura Tree", url: "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=150&q=80" },
  { name: "Origami Crane", url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=150&q=80" }
];

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const openEditModal = () => {
    if (!data) return;
    setEditName(data.name);
    setEditAvatar(data.avatar);
    setSelectedFile(null);
    setSaveError("");
    setSaveSuccess("");
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      setSaveError("Nama tidak boleh kosong.");
      return;
    }
    try {
      setIsSaving(true);
      setSaveError("");
      setSaveSuccess("");

      const formData = new FormData();
      formData.append("name", editName);
      if (selectedFile) {
        formData.append("avatarFile", selectedFile);
      } else {
        formData.append("avatar", editAvatar);
      }

      await api.profile.update(formData);
      setSaveSuccess("Profil berhasil diperbarui!");
      // Refresh profile details in UI
      const result = await api.profile.get();
      setData(result);
      setTimeout(() => setIsEditModalOpen(false), 800);
    } catch (err: any) {
      console.error(err);
      setSaveError(err.message || "Gagal memperbarui profil.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const result = await api.profile.get();
        setData(result);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Gagal memuat profil.");
        if (err.message?.includes("Token") || err.message?.includes("Akses ditolak")) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    api.auth.logout();
    navigate("/login");
  };

  const settingsItems = [
    { icon: "person_outline", label: "Detail Akun", disabled: false },
    { icon: "lock_outline", label: "Keamanan & Sandi", disabled: true },
    { icon: "notifications_active", label: "Notifikasi Belajar", disabled: true },
    { icon: "translate", label: "Bahasa Interface", disabled: true },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="text-[#8f0020] font-bold animate-pulse text-lg">Memuat data profil...</div>
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="flex-1 w-full px-4 md:px-6 max-w-[1200px] mx-auto py-6">
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center font-bold">
            {error}
            <button 
              onClick={() => window.location.reload()} 
              className="block mx-auto mt-4 px-6 py-2 bg-[#8f0020] text-white rounded-full text-sm font-semibold hover:brightness-110 active:scale-95 transition-all cursor-pointer border-none"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const { name, level, joinedMonthYear, avatar, stats, masteredKanji, activities, masteryBreakdown } = data;

  return (
    <Layout>
      <main className="flex-1 w-full px-4 md:px-6 max-w-[1200px] mx-auto py-6">
        <div className="relative z-10 flex flex-col gap-md py-md select-none">
          {/* Background Overlay */}
          <div className="absolute inset-0 seigaiha-profile pointer-events-none opacity-20 -z-10"></div>

          {/* Hero Bento Profile Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-4">
            {/* Profile Header Card */}
            <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col md:flex-row items-center md:items-end gap-6 relative overflow-hidden border border-outline-variant/10">
              <div className="absolute top-0 right-0 p-4 opacity-10 select-none">
                <Icon name="person" className="text-[120px] block" />
              </div>
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg z-10">
                <img
                  className="w-full h-full object-cover"
                  alt={`Avatar ${name}`}
                  src={avatar}
                />
              </div>
              <div className="flex-1 text-center md:text-left z-10">
                <div className="inline-block px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-caption mb-2">
                  {level}
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1 font-bold">
                  {name}
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {joinedMonthYear}
                </p>
              </div>
              <div className="z-10 flex gap-2">
                <button
                  onClick={openEditModal}
                  className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-md text-label-md font-bold shadow-md cursor-pointer hover:brightness-110 active:scale-95 transition-all border-none"
                >
                  Edit Profil
                </button>
              </div>
            </div>

            {/* Total XP & Streak Bento cards */}
            <div className="md:col-span-4 grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/10 flex flex-col justify-center items-center text-center">
                <span className="font-headline-md text-headline-md text-primary font-bold">
                  {stats.streak}
                </span>
                <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">
                  Days Streak
                </span>
              </div>
              <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/10 flex flex-col justify-center items-center text-center">
                <span className="font-headline-md text-headline-md text-tertiary font-bold">
                  {stats.xp}
                </span>
                <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">
                  Total XP
                </span>
              </div>
            </div>
          </div>

          {/* Dashboard Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-md">
            {/* Left Column: Kanji Mastery & Recent Activities */}
            <div className="lg:col-span-2 space-y-8">
              {/* Mastered Kanji Collection */}
              <section>
                <div className="flex justify-between items-end mb-4">
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                    Koleksi Kanji Terkuasai
                  </h3>
                  <span
                    onClick={() => navigate("/module")}
                    className="text-primary font-label-md text-label-md hover:underline cursor-pointer font-bold"
                  >
                    Lihat Semua
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {masteredKanji.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      onClick={() => navigate("/latihan")}
                      className="bg-white rounded-xl p-6 shadow-sm border border-outline-variant/10 border-b-2 border-b-primary-fixed text-center group hover:scale-[1.02] transition-transform cursor-pointer"
                    >
                      <div className="font-display-kanji text-[54px] text-on-surface leading-tight mb-2 select-none">
                        {item.character}
                      </div>
                      <div className="font-label-md text-label-md text-on-surface-variant mb-1 font-semibold">
                        {item.romaji}
                      </div>
                      <div className="font-caption text-caption text-primary">
                        {item.meaning}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Recent Activity List */}
              <section>
                <h3 className="font-headline-md text-headline-md mb-4 font-bold text-on-surface">
                  Aktivitas Terbaru
                </h3>
                <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 divide-y divide-surface-variant/30">
                  {activities.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 flex items-center gap-4 hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${item.bgClass}`}
                      >
                        <Icon name={item.icon} className="text-xl block" />
                      </div>
                      <div className="flex-1">
                        <p className="font-body-md text-body-md text-on-surface">
                          <span className="font-bold">{item.title}:</span>{" "}
                          {item.desc}
                        </p>
                        <p className="font-caption text-caption text-on-surface-variant">
                          {item.time} • {item.xp}
                        </p>
                      </div>
                      <Icon
                        name="chevron_right"
                        className="text-on-surface-variant block text-xl"
                      />
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Settings Drawer & Stats charts */}
            <div className="space-y-8">
              {/* Quick account settings */}
              <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
                <h3 className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant mb-4 font-semibold">
                  Pengaturan Akun
                </h3>
                <nav className="space-y-1">
                  {settingsItems.map((item, idx) => (
                    <button
                      key={idx}
                      disabled={item.disabled}
                      onClick={() => {
                        if (item.disabled) return;
                        if (item.label === "Detail Akun") {
                          setIsDetailsModalOpen(true);
                        } else {
                          alert(`Simulasi ${item.label}`);
                        }
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors group border-none bg-transparent ${item.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-surface-container cursor-pointer'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          name={item.icon}
                          className={`text-on-surface-variant text-xl ${!item.disabled ? 'group-hover:text-primary' : ''}`}
                        />
                        <span className={`font-body-md text-body-md ${item.disabled ? 'text-slate-400' : 'text-on-surface'}`}>
                          {item.label}
                        </span>
                      </div>
                      {!item.disabled && (
                        <Icon
                          name="chevron_right"
                          className="text-on-surface-variant text-sm block"
                        />
                      )}
                    </button>
                  ))}
                </nav>
                <div className="mt-6 pt-6 border-t border-surface-variant/30">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 text-error hover:bg-error-container/20 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                  >
                    <Icon name="logout" className="text-xl block" />
                    <span className="font-body-md text-body-md font-bold">
                      Keluar
                    </span>
                  </button>
                </div>
              </section>

              {/* Mastery breakdown percentage chart */}
              <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
                <h3 className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant mb-4 font-semibold">
                  Mastery Breakdown
                </h3>
                <div className="space-y-4">
                  {masteryBreakdown.map((item: any, idx: number) => (
                    <div key={idx}>
                      <div className="flex justify-between font-caption text-caption mb-1">
                        <span>{item.label}</span>
                        <span>{item.percentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.colorClass}`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      {/* Modal Edit Profil */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-outline-variant/30 rounded-2xl p-6 max-w-[480px] w-full shadow-2xl relative flex flex-col gap-4">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container transition-colors cursor-pointer border-none bg-transparent"
            >
              <Icon name="close" className="text-xl block" />
            </button>
            
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
              Edit Profil
            </h3>
            <p className="text-body-md text-on-surface-variant">
              Perbarui nama lengkap dan foto profil Anda.
            </p>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-bold text-on-surface">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl p-3 w-full focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md font-bold text-on-surface">
                  Pilih Foto Profil (Preset)
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {avatarPresets.map((preset, idx) => {
                    const isSelected = editAvatar === preset.url;
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setEditAvatar(preset.url)}
                        className={`aspect-square rounded-xl overflow-hidden p-0.5 border-2 transition-all cursor-pointer bg-transparent ${isSelected ? 'border-primary scale-105 shadow-md' : 'border-outline-variant/30 hover:border-outline'}`}
                        title={preset.name}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover rounded-[10px]"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-bold text-on-surface">
                  Atau Unggah Foto Kustom
                </label>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      if (file.size > 5 * 1024 * 1024) {
                        setSaveError("Ukuran file melebihi batas 5MB.");
                        setSelectedFile(null);
                        return;
                      }
                      setSaveError("");
                      setSelectedFile(file);
                      setEditAvatar(""); // Clear preset selection when file is chosen
                    }
                  }}
                  className="bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl p-3 w-full focus:ring-2 focus:ring-primary outline-none transition-all text-xs"
                />
                {selectedFile && (
                  <span className="text-[10px] text-primary font-bold">
                    File terpilih: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                )}
              </div>

              {saveError && (
                <p className="text-error font-body-md text-body-md font-semibold mt-1">
                  {saveError}
                </p>
              )}
              {saveSuccess && (
                <p className="text-success font-body-md text-body-md font-semibold mt-1">
                  {saveSuccess}
                </p>
              )}

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-surface-variant/30">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg border border-outline hover:bg-surface-container transition-all cursor-pointer font-bold text-on-surface bg-transparent"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-bold shadow-md cursor-pointer hover:brightness-110 active:scale-95 transition-all border-none flex items-center justify-center gap-2"
                >
                  {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Akun */}
      {isDetailsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-outline-variant/30 rounded-2xl p-6 max-w-[420px] w-full shadow-2xl relative flex flex-col gap-4">
            <button
              onClick={() => setIsDetailsModalOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container transition-colors cursor-pointer border-none bg-transparent"
            >
              <Icon name="close" className="text-xl block" />
            </button>
            
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface mb-2">
              Detail Akun
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                <div className="p-2 bg-primary-container text-on-primary-container rounded-lg">
                  <Icon name="person" className="text-xl block" />
                </div>
                <div>
                  <p className="text-caption text-on-surface-variant uppercase tracking-wider font-semibold">Nama Lengkap</p>
                  <p className="font-body-md text-body-md font-bold text-on-surface">{name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                <div className="p-2 bg-secondary-container text-on-secondary-container rounded-lg">
                  <Icon name="mail" className="text-xl block" />
                </div>
                <div>
                  <p className="text-caption text-on-surface-variant uppercase tracking-wider font-semibold">Alamat Email</p>
                  <p className="font-body-md text-body-md font-bold text-on-surface">{data.email || "haruki@sato.com"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                <div className="p-2 bg-tertiary-container text-on-tertiary-container rounded-lg">
                  <Icon name="calendar_today" className="text-xl block" />
                </div>
                <div>
                  <p className="text-caption text-on-surface-variant uppercase tracking-wider font-semibold">Bergabung Sejak</p>
                  <p className="font-body-md text-body-md font-bold text-on-surface">{joinedMonthYear.replace("Mastering the strokes since ", "")}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 p-3 bg-surface-container-low rounded-xl">
                  <Icon name="local_fire_department" className="text-primary text-2xl block" />
                  <div>
                    <p className="text-caption text-on-surface-variant font-semibold">Streak</p>
                    <p className="font-body-md text-body-md font-bold text-on-surface">{stats.streak} Hari</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-3 bg-surface-container-low rounded-xl">
                  <Icon name="military_tech" className="text-tertiary text-2xl block" />
                  <div>
                    <p className="text-caption text-on-surface-variant font-semibold">Total XP</p>
                    <p className="font-body-md text-body-md font-bold text-on-surface">{stats.xp} XP</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-surface-variant/30">
              <button
                type="button"
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-5 py-2 w-full rounded-lg bg-primary text-on-primary font-bold shadow-md cursor-pointer hover:brightness-110 active:scale-95 transition-all border-none"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ProfilePage;
