class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private voice: SpeechSynthesisVoice | null = null;

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
    // Look for any Japanese voice
    const jaVoice = voices.find(
      (v) => v.lang === "ja-JP" || v.lang === "ja_JP" || v.lang.toLowerCase().startsWith("ja")
    );
    if (jaVoice) {
      this.voice = jaVoice;
    }
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.synth) {
      console.warn("Speech synthesis not supported in this browser.");
      return;
    }

    try {
      this.synth.cancel(); // stop any ongoing speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.85; // slightly slower rate for language learners
      utterance.pitch = 1.0;

      // Re-initialize voice if not set
      if (!this.voice) {
        this.initVoice();
      }

      if (this.voice) {
        utterance.voice = this.voice;
      }

      if (onEnd) {
        utterance.onend = onEnd;
      }

      this.synth.speak(utterance);
    } catch (error) {
      console.error("Speech synthesis failed:", error);
    }
  }
}

export const tts = new SpeechService();
export default tts;
