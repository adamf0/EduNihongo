/**
 * Shared AudioContext Singleton Provider
 * 
 * Memastikan hanya 1 instance AudioContext yang aktif di seluruh aplikasi.
 * Mencegah batas maksimal AudioContext di Safari (maks 6 instance) yang menyebabkan audio crash,
 * serta menangani resume otomatis saat autoplay policy menangguhkan audio di Chrome, Edge, Firefox, dan Safari.
 */

let sharedAudioCtx: AudioContext | null = null;

export const getSharedAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;

  try {
    const AudioCtxClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtxClass) return null;

    if (!sharedAudioCtx || sharedAudioCtx.state === "closed") {
      sharedAudioCtx = new AudioCtxClass();
    }

    // Auto-resume jika status suspended (kebijakan autoplay Safari & Chrome)
    if (sharedAudioCtx.state === "suspended") {
      sharedAudioCtx.resume().catch((err) => {
        console.warn("AudioContext resume tertunda menunggu interaksi pengguna:", err);
      });
    }

    return sharedAudioCtx;
  } catch (error) {
    console.warn("Gagal menginisialisasi shared AudioContext:", error);
    return null;
  }
};

export default getSharedAudioContext;
