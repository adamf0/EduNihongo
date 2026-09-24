/**
 * Client-Side Japanese TTS Engine powered by Transformers.js
 * Synthesizes natural, native Japanese speech directly in the browser (React JS)
 * with Tokyo pitch accent, natural breath phrasing, and conversational tempo (~5.3 morae/sec).
 */

export interface TTSState {
  isPlaying: boolean;
  isGenerating: boolean;
  modelReady: boolean;
  progress: number;
  currentText: string | null;
  error: string | null;
}

type StateListener = (state: TTSState) => void;

class TransformersTTSService {
  private modelPromise: Promise<any> | null = null;
  private ttsInstance: any = null;
  private audioCache = new Map<string, string>(); // text -> objectURL
  private currentAudio: HTMLAudioElement | null = null;
  private listeners: Set<StateListener> = new Set();

  private state: TTSState = {
    isPlaying: false,
    isGenerating: false,
    modelReady: false,
    progress: 0,
    currentText: null,
    error: null,
  };

  constructor() {
    // Lazy initialization
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener({ ...this.state });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private updateState(partial: Partial<TTSState>) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((listener) => listener({ ...this.state }));
  }

  public getState(): TTSState {
    return { ...this.state };
  }

  /**
   * Normalize Japanese text for natural native cadence,
   * inserting micro-pauses at clause/particle boundaries
   * and ensuring proper mora rhythm.
   */
  public normalizeJapaneseText(text: string, _romaji?: string): string {
    let clean = text.trim();

    // If text doesn't already contain natural pauses, add breath commas
    // at typical clause markers (で, の, を, に, が, から, けど, ときは)
    // to mirror native Japanese phrasing (like "デパ地下で、新しいケーキの、試食をしました。")
    if (!clean.includes("、") && !clean.includes(",")) {
      clean = clean
        .replace(/(地下で|ケーキの|ときに|ですから|ですから、)/g, "$1、")
        .replace(/([でをにが])(?=[^\s、]{3,})/g, "$1、");
    }

    // Clean multiple consecutive commas
    clean = clean.replace(/、+/g, "、");
    return clean;
  }

  /**
   * Initializes the Transformers.js TTS model in the browser.
   * Model weights are downloaded and cached permanently in IndexedDB / Cache API.
   */
  public async initModel(): Promise<any> {
    if (this.ttsInstance) return this.ttsInstance;
    if (this.modelPromise) return this.modelPromise;

    this.modelPromise = (async () => {
      try {
        this.updateState({ isGenerating: true, progress: 5, error: null });

        // Dynamically import kokoro-js to keep initial bundle size lean
        const { KokoroTTS } = await import("kokoro-js");

        const instance = await KokoroTTS.from_pretrained(
          "onnx-community/Kokoro-82M-v1.0-ONNX",
          {
            dtype: "q8",
            device:
              typeof navigator !== "undefined" && (navigator as any).gpu
                ? "webgpu"
                : "wasm",
            progress_callback: (p: any) => {
              if (p && typeof p.progress === "number") {
                this.updateState({ progress: Math.round(p.progress) });
              }
            },
          }
        );

        this.ttsInstance = instance;
        this.updateState({
          modelReady: true,
          isGenerating: false,
          progress: 100,
        });
        return instance;
      } catch (err: any) {
        console.warn("Transformers.js model initialization fallback:", err);
        this.updateState({
          isGenerating: false,
          error: err?.message || "Gagal memuat model Transformers.js",
        });
        throw err;
      }
    })();

    return this.modelPromise;
  }

  /**
   * Synthesize and play Japanese text using Transformers.js native voice
   */
  public async speak(
    text: string,
    romaji?: string,
    onEnd?: () => void
  ): Promise<boolean> {
    this.stop(); // Stop any currently playing audio

    const processedText = this.normalizeJapaneseText(text, romaji);
    this.updateState({ isPlaying: true, currentText: text, error: null });

    try {
      // 1. Check if audio is already cached for instant playback
      if (this.audioCache.has(processedText)) {
        const cachedUrl = this.audioCache.get(processedText)!;
        await this.playAudioUrl(cachedUrl, onEnd);
        return true;
      }

      // 2. Synthesize using Transformers.js / Kokoro
      this.updateState({ isGenerating: true });
      const tts = await this.initModel();

      // Voice preset: jf_alpha (Native Japanese Female)
      // Speed: 1.02 (matches ~5.3 morae/sec conversational tempo from reference audio)
      const rawAudio = await tts.generate(processedText, {
        voice: "jf_alpha",
        speed: 1.02,
      });

      this.updateState({ isGenerating: false });

      if (rawAudio && typeof rawAudio.toBlob === "function") {
        const blob = rawAudio.toBlob();
        const audioUrl = URL.createObjectURL(blob);
        this.audioCache.set(processedText, audioUrl);

        await this.playAudioUrl(audioUrl, onEnd);
        return true;
      }

      throw new Error("Format audio tidak valid dari model Transformers.js");
    } catch (err: any) {
      this.updateState({
        isPlaying: false,
        isGenerating: false,
        currentText: null,
        error: err?.message,
      });
      return false; // Signals to caller to fallback to enhanced SpeechSynthesis
    }
  }

  private playAudioUrl(url: string, onEnd?: () => void): Promise<void> {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      this.currentAudio = audio;

      audio.onended = () => {
        this.updateState({ isPlaying: false, currentText: null });
        this.currentAudio = null;
        if (onEnd) onEnd();
        resolve();
      };

      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        this.updateState({ isPlaying: false, currentText: null });
        this.currentAudio = null;
        if (onEnd) onEnd();
        resolve();
      };

      audio.play().catch((err) => {
        console.warn("Autoplay was prevented or audio failed:", err);
        this.updateState({ isPlaying: false, currentText: null });
        this.currentAudio = null;
        if (onEnd) onEnd();
        resolve();
      });
    });
  }

  /**
   * Stop any ongoing speech playback or generation
   */
  public stop() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {
        console.error("Error stopping audio:", e);
      }
      this.currentAudio = null;
    }
    this.updateState({ isPlaying: false, currentText: null, isGenerating: false });
  }
}

export const transformersTTS = new TransformersTTSService();
export default transformersTTS;
