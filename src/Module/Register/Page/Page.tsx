import React, { useState, useEffect } from "react";
import InputField from "../../Login/Component/Atoms/InputField";
import ToriiButton from "../../Login/Component/Atoms/ToriiButton";
import Icon from "../../Common/Component/Icon";
import { useNavigate } from "react-router-dom";
import { api } from "../../Common/Utility/api";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sakuraPetals, setSakuraPetals] = useState<Array<{ id: number; left: string; delay: string; duration: string }>>([]);

  // Generate floating sakura petals
  useEffect(() => {
    const petals = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${15 + Math.random() * 10}s`,
    }));
    setSakuraPetals(petals);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    if (password.length < 6) {
      setError("Kata sandi minimal terdiri dari 6 karakter.");
      return;
    }

    setLoading(true);
    try {
      await api.auth.register(email, password, name);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Gagal melakukan pendaftaran.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-body-md overflow-x-hidden relative">
      {/* Decorative Traditional Japanese Background Patterns */}
      <div className="japanese-bg-overlay fixed inset-0 z-0"></div>
      <div className="seigaiha-pattern-login fixed inset-0 z-0 pointer-events-none"></div>

      {/* Floating Sakura Petals */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
        {sakuraPetals.map((petal) => (
          <div
            key={petal.id}
            className="sakura-float w-3 h-3 bg-secondary-container/40 rounded-full"
            style={{
              left: petal.left,
              animationDelay: petal.delay,
              animationDuration: petal.duration,
            }}
          />
        ))}
      </div>

      <main className="flex-grow flex items-center justify-center p-margin-mobile md:p-md relative z-20">
        <div className="w-full max-w-[440px]">
          {/* Register Card Container */}
          <div className="bg-surface-container-lowest rounded-[32px] p-8 flex flex-col items-center shadow-xl border border-outline-variant/30 relative overflow-hidden">
            {/* Logo & Brand Identity */}
            <div className="mb-md flex flex-col items-center">
              <div 
                onClick={() => navigate("/")}
                className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-105"
              >
                <Icon name="star_shine" className="text-white block text-4xl" />
              </div>
              <h1 className="font-headline-lg text-primary mt-sm tracking-tight leading-tight">
                KANJIGRAPH
              </h1>
              <p className="text-[10px] text-on-surface-variant tracking-[0.2em] uppercase font-semibold">
                Master the Stroke
              </p>
            </div>

            {/* Welcome messages */}
            <div className="text-center mb-md">
              <h2 className="text-xl font-bold text-on-surface">Daftar Akun Baru</h2>
              <p className="text-caption text-on-surface-variant mt-1">
                Mulai kuasai goresan menulis Kanji hari ini.
              </p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-md">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <Icon name="error" className="text-red-500 text-base" />
                  {error}
                </div>
              )}

              <InputField
                type="text"
                placeholder="Masukkan nama lengkap"
                label="Nama Lengkap"
                icon="person"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <InputField
                type="email"
                placeholder="Masukkan alamat email"
                label="Email"
                icon="mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <InputField
                type="password"
                placeholder="Buat kata sandi minimal 6 karakter"
                label="Kata Sandi"
                icon="lock"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <InputField
                type="password"
                placeholder="Ulangi kata sandi Anda"
                label="Konfirmasi Kata Sandi"
                icon="lock"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <ToriiButton type="submit" className="mt-base shadow-lg" disabled={loading}>
                {loading ? "Mendaftar..." : "Buat Akun Baru"}
              </ToriiButton>
            </form>

            {/* Bottom Login Option */}
            <div className="mt-md text-caption text-on-surface-variant select-none">
              Sudah punya akun?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-primary hover:underline font-bold cursor-pointer"
              >
                Masuk Sekarang
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
