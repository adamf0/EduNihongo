class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  private currentAudio: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
      this.initVoice();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoice();
      }
    }
  }

  private initVoice() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Filter all Japanese voices
    const jaVoices = voices.filter(
      (v) => v.lang === "ja-JP" || v.lang === "ja_JP" || v.lang.toLowerCase().startsWith("ja")
    );

    if (jaVoices.length === 0) return;

    // Prioritize natural system voices (Kyoko, Otoya, Siri, Nanami) over Google Translate voice for fallback
    const systemVoices = jaVoices.filter((v) => !v.name.includes("Google"));

    systemVoices.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      if (aName.includes("siri") && !bName.includes("siri")) return -1;
      if (!aName.includes("siri") && bName.includes("siri")) return 1;
      if (aName.includes("kyoko") && !bName.includes("kyoko")) return -1;
      if (!aName.includes("kyoko") && bName.includes("kyoko")) return 1;
      if (aName.includes("otoya") && !bName.includes("otoya")) return -1;
      if (!aName.includes("otoya") && bName.includes("otoya")) return 1;
      return 0;
    });

    if (systemVoices.length > 0) {
      this.voice = systemVoices[0];
    } else {
      this.voice = jaVoices[0];
    }
  }

  public stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        // ignore cancel error
      }
    }
  }

  public speak(
    text: string,
    onEnd?: () => void
  ) {
    const trimmedText = (text || "").trim();
    if (!trimmedText) return;

    this.stop();

    const baseUrl =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1")
        ? "http://localhost:5001/api"
        : "/api";

    // Kirimkan teks kanji / kalimat asli langsung ke endpoint Google Translate TTS
    const url = `${baseUrl}/tts?text=${encodeURIComponent(trimmedText)}`;

    let hasHandledEnd = false;
    const finish = () => {
      if (!hasHandledEnd) {
        hasHandledEnd = true;
        this.currentAudio = null;
        if (onEnd) onEnd();
      }
    };

    try {
      const audio = new Audio(url);
      this.currentAudio = audio;

      audio.onended = finish;
      audio.onerror = () => {
        console.warn("TTS audio load failed from server, falling back to local SpeechSynthesis.");
        this.currentAudio = null;
        this.fallbackLocalSpeak(trimmedText, finish);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Audio play prevented or failed, falling back to local SpeechSynthesis:", err);
          this.currentAudio = null;
          this.fallbackLocalSpeak(trimmedText, finish);
        });
      }
    } catch (e) {
      console.warn("Audio creation failed, falling back to local SpeechSynthesis:", e);
      this.currentAudio = null;
      this.fallbackLocalSpeak(trimmedText, finish);
    }
  }

  private fallbackLocalSpeak(text: string, onEnd?: () => void) {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    try {
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.85;
      utterance.pitch = 1.0;

      if (!this.voice) {
        this.initVoice();
      }

      if (this.voice) {
        utterance.voice = this.voice;
      }

      if (onEnd) {
        utterance.onend = onEnd;
        utterance.onerror = onEnd;
      }

      this.synth.speak(utterance);
    } catch (error) {
      console.error("Local speech synthesis fallback failed:", error);
      if (onEnd) onEnd();
    }
  }
}

export const tts = new SpeechService();
export default tts;
