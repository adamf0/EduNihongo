import React, { useState, useEffect } from "react";
import InputField from "../Component/Atoms/InputField";
import ToriiButton from "../Component/Atoms/ToriiButton";
import Icon from "../../Common/Component/Icon";
import { useNavigate } from "react-router-dom";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login and redirect to dashboard
    navigate("/dashboard");
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
              <h2 className="text-xl font-bold text-on-surface">Selamat Datang Kembali</h2>
              <p className="text-caption text-on-surface-variant mt-1">
                Kuasai kembali goresan Kanji Anda hari ini.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-md">
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
              <ToriiButton type="submit" className="mt-base shadow-lg">
                Masuk ke Akun
              </ToriiButton>
            </form>

            {/* Social Dividers */}
            <div className="w-full flex items-center justify-center gap-base my-md text-caption text-on-surface-variant select-none">
              <div className="h-[1px] bg-outline-variant/30 flex-grow" />
              <span>atau masuk dengan</span>
              <div className="h-[1px] bg-outline-variant/30 flex-grow" />
            </div>

            {/* Social Buttons */}
            <div className="w-full grid grid-cols-2 gap-sm">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex items-center justify-center gap-xs py-3 border border-outline-variant/50 rounded-xl hover:bg-surface-container transition-colors cursor-pointer"
              >
                <Icon name="google" className="text-lg" />
                <span className="text-label-md font-semibold">Google</span>
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex items-center justify-center gap-xs py-3 border border-outline-variant/50 rounded-xl hover:bg-surface-container transition-colors cursor-pointer"
              >
                <Icon name="hub" className="text-lg" />
                <span className="text-label-md font-semibold">GitHub</span>
              </button>
            </div>

            {/* Bottom Register Option */}
            <div className="mt-md text-caption text-on-surface-variant select-none">
              Belum punya akun?{" "}
              <span
                onClick={() => navigate("/")}
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
