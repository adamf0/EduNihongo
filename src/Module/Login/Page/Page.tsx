import React, { useState, useEffect } from "react";
import InputField from "../Component/Atoms/InputField";
import ToriiButton from "../Component/Atoms/ToriiButton";
import Icon from "../../Common/Component/Icon";
import MusubiLogo from "../../Common/Component/MusubiLogo";
import { useNavigate } from "react-router-dom";
import { api } from "../../Common/Utility/api";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
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
    setLoading(true);
    try {
      await api.auth.login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Email atau password salah.");
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
          {/* Login Card Container */}
          <div className="bg-surface-container-lowest rounded-[32px] p-8 flex flex-col items-center shadow-xl border border-outline-variant/30 relative overflow-hidden">
            {/* Logo & Brand Identity */}
            <div className="mb-md flex flex-col items-center">
              <div 
                onClick={() => navigate("/")}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <MusubiLogo mode="standalone" size={72} />
              </div>
              <h1 className="font-headline-lg text-primary mt-sm tracking-tight leading-tight">
                KanGraph
              </h1>
              <p className="text-[10px] text-on-surface-variant tracking-[0.2em] uppercase font-semibold">
                Connect the Dots of Japanese Mastery
              </p>
            </div>

            {/* Welcome messages */}
            <div className="text-center mb-md">
              <h2 className="text-xl font-bold text-on-surface">Selamat Datang Kembali</h2>
              <p className="text-caption text-on-surface-variant mt-1">
                Kuasai kembali goresan Kanji Anda hari ini.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-md">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <Icon name="error" className="text-red-500 text-base" />
                  {error}
                </div>
              )}

              <InputField
                type="email"
                placeholder="Masukkan email Anda"
                label="Email"
                icon="mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <InputField
                type="password"
                placeholder="Masukkan password Anda"
                label="Kata Sandi"
                icon="lock"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* Form Options */}
              <div className="flex justify-between items-center w-full">
                <label className="flex items-center gap-xs text-caption text-on-surface-variant cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-outline-variant/50 text-primary focus:ring-primary/20 cursor-pointer"
                  />
                  Ingat Saya
                </label>
                <span
                  onClick={() => navigate("/")}
                  className="text-caption text-primary hover:underline font-semibold cursor-pointer"
                >
                  Lupa Sandi?
                </span>
              </div>

              {/* Action Button */}
              <ToriiButton type="submit" className="mt-base shadow-lg" disabled={loading}>
                {loading ? "Memproses..." : "Masuk ke Akun"}
              </ToriiButton>
            </form>

            {/* Bottom Register Option */}
            <div className="mt-md text-caption text-on-surface-variant select-none">
              Belum punya akun?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-primary hover:underline font-bold cursor-pointer"
              >
                Daftar Sekarang
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
