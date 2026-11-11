import confetti from "canvas-confetti";

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!sharedAudioCtx || sharedAudioCtx.state === "closed") {
      sharedAudioCtx = new AudioContextClass();
    }
    if (sharedAudioCtx.state === "suspended") {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch (e) {
    console.warn("AudioContext not supported or blocked:", e);
    return null;
  }
}

/**
 * Memainkan suara fanfare ceria "tet tetetet" / "tu tututut"
 * menggunakan Web Audio API (tanpa dependensi audio eksternal).
 */
export function playFanfareSound(volume = 0.3) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Master Gain Node
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, now);
    masterGain.connect(ctx.destination);

    // Dynamic Compressor untuk suara brass/fanfare yang padat & tidak pecah
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-18, now);
    compressor.knee.setValueAtTime(10, now);
    compressor.ratio.setValueAtTime(8, now);
    compressor.attack.setValueAtTime(0.003, now);
    compressor.release.setValueAtTime(0.2, now);
    compressor.connect(masterGain);

    // Melodi Fanfare "tet... te-te-tet / tu tututut":
    // 1. C5 ("tu")
    // 2. C5 ("tu")
    // 3. C5 ("tu")
    // 4. E5 ("tu")
    // 5. G5 ("tu")
    // 6. C6 ("TU-U-U-T! 🎉")
    const notes = [
      { freq: 523.25, time: 0.00, dur: 0.11, type: "triangle" as OscillatorType },
      { freq: 523.25, time: 0.12, dur: 0.09, type: "triangle" as OscillatorType },
      { freq: 523.25, time: 0.22, dur: 0.09, type: "triangle" as OscillatorType },
      { freq: 659.25, time: 0.32, dur: 0.13, type: "triangle" as OscillatorType },
      { freq: 783.99, time: 0.46, dur: 0.15, type: "triangle" as OscillatorType },
      { freq: 1046.50, time: 0.63, dur: 0.55, type: "triangle" as OscillatorType },
    ];

    // Mainkan masing-masing nada
    notes.forEach(({ freq, time, dur, type }) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + time);

      // Sedikit harmonic brass overtone pada nada puncak
      if (freq >= 1000) {
        osc.frequency.setValueAtTime(freq * 1.002, now + time);
      }

      // Envelope ADSR
      noteGain.gain.setValueAtTime(0.0001, now + time);
      noteGain.gain.exponentialRampToValueAtTime(0.4, now + time + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.25, now + time + dur * 0.7);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

      osc.connect(noteGain);
      noteGain.connect(compressor);

      osc.start(now + time);
      osc.stop(now + time + dur + 0.05);
    });

    // Layer 2: Kilauan Chime Bell pada nada klimaks (C6 chord: E6, G6, C7)
    const chimes = [
      { freq: 1318.51, delay: 0.65, dur: 0.35 }, // E6
      { freq: 1567.98, delay: 0.72, dur: 0.40 }, // G6
      { freq: 2093.00, delay: 0.80, dur: 0.50 }, // C7
    ];

    chimes.forEach(({ freq, delay, dur }) => {
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();

      chimeOsc.type = "sine";
      chimeOsc.frequency.setValueAtTime(freq, now + delay);

      chimeGain.gain.setValueAtTime(0.0001, now + delay);
      chimeGain.gain.exponentialRampToValueAtTime(0.12, now + delay + 0.02);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(compressor);

      chimeOsc.start(now + delay);
      chimeOsc.stop(now + delay + dur + 0.05);
    });
  } catch (err) {
    console.warn("Error playing fanfare sound:", err);
  }
}

/**
 * Menembakkan hujan confetti multi-burst dari kiri, kanan, dan atas
 */
export function triggerConfettiShower() {
  try {
    const festivityColors = ["#8f0020", "#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6"];

    // Ledakan meriam kiri
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.7 },
      colors: festivityColors,
    });

    // Ledakan meriam kanan
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.7 },
      colors: festivityColors,
    });

    // Ledakan bintang & pita di tengah dengan jeda sedikit
    setTimeout(() => {
      confetti({
        particleCount: 75,
        spread: 90,
        origin: { x: 0.5, y: 0.55 },
        colors: festivityColors,
        ticks: 200,
        gravity: 0.8,
      });
    }, 200);
  } catch (err) {
    console.warn("Error triggering confetti:", err);
  }
}

/**
 * Memanggil sound fanfare dan hujan confetti sekaligus
 */
export function triggerCheckpointCelebration() {
  playFanfareSound(0.35);
  triggerConfettiShower();
}

/**
 * Memainkan efek suara "selected" yang renyah dan lembut
 * saat pengguna memilih opsi jawaban atau menyusun potongan kata.
 */
export function playSelectSound(variant: "select" | "unselect" = "select") {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (variant === "select") {
      // Renyah dan responsif: frekuensi meluncur cepat dari 650Hz ke 980Hz
      osc.type = "sine";
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(980, now + 0.04);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);

      // Micro harmonic bell (1480Hz) untuk sensasi tactile "click" modern
      const bell = ctx.createOscillator();
      const bellGain = ctx.createGain();
      bell.type = "sine";
      bell.frequency.setValueAtTime(1480, now);
      bellGain.gain.setValueAtTime(0.0001, now);
      bellGain.gain.exponentialRampToValueAtTime(0.07, now + 0.005);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
      bell.connect(bellGain);
      bellGain.connect(ctx.destination);
      bell.start(now);
      bell.stop(now + 0.05);
    } else {
      // Lembut turun (saat membatalkan/menghapus potongan kata)
      osc.type = "sine";
      osc.frequency.setValueAtTime(720, now);
      osc.frequency.exponentialRampToValueAtTime(460, now + 0.05);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    }
  } catch (err) {
    console.warn("Error playing select sound:", err);
  }
}
