import transformersTTS, { type TTSState } from "./transformersTTS";

/**
 * Unified Japanese Speech Service (EduNihongo)
 * Integrates client-side Transformers.js Neural TTS as primary engine
 * with calibrated fallback to Enhanced Web Speech API.
 */
class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  private isSpeakingWebSpeech = false;
  private currentWebSpeechText: string | null = null;
  private onEndCallback: (() => void) | null = null;

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
      (v) =>
        v.lang === "ja-JP" ||
        v.lang === "ja_JP" ||
        v.lang.toLowerCase().startsWith("ja")
    );

    if (jaVoices.length === 0) return;

    // Prioritize natural native system voices (Kyoko, Otoya, Siri, Nanami)
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

  /**
   * Speak Japanese text using Transformers.js AI Voice or calibrated fallback.
   *
   * @param text Japanese sentence or word
   * @param romaji Optional romaji reading from database for pronunciation alignment
   * @param onEnd Optional callback when audio finishes playing
   */
  public async speak(
    text: string,
    romaji?: string,
    onEnd?: () => void
  ): Promise<void> {
    this.stop();

    // 1. Attempt high-fidelity native synthesis using Transformers.js in React JS
    try {
      const success = await transformersTTS.speak(text, romaji, onEnd);
      if (success) {
        return;
      }
    } catch (e) {
      console.warn("Transformers.js synthesis failed, using calibrated fallback:", e);
    }

    // 2. Calibrated Fallback using Enhanced Web Speech API
    this.speakWebSpeech(text, romaji, onEnd);
  }

  private speakWebSpeech(text: string, romaji?: string, onEnd?: () => void) {
    if (!this.synth) {
      console.warn("Speech synthesis not supported in this browser.");
      if (onEnd) onEnd();
      return;
    }

    try {
      this.synth.cancel();

      // Normalize text with natural breath groupings (Tokyo phrasing)
      const speechText = transformersTTS.normalizeJapaneseText(text, romaji);

      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = "ja-JP";

      // Calibrated parameters to match native reference audio (tempo ~5.3 morae/sec, pitch ~220Hz)
      utterance.rate = 1.02; // Natural conversational tempo (matching WhatsApp audio reference)
      utterance.pitch = 1.05; // Natural clear female pitch

      if (!this.voice) {
        this.initVoice();
      }
      if (this.voice) {
        utterance.voice = this.voice;
      }

      this.isSpeakingWebSpeech = true;
      this.currentWebSpeechText = text;
      this.onEndCallback = onEnd || null;

      utterance.onend = () => {
        this.isSpeakingWebSpeech = false;
        this.currentWebSpeechText = null;
        if (this.onEndCallback) {
          this.onEndCallback();
          this.onEndCallback = null;
        }
      };

      utterance.onerror = (e) => {
        console.error("Speech synthesis error:", e);
        this.isSpeakingWebSpeech = false;
        this.currentWebSpeechText = null;
        if (this.onEndCallback) {
          this.onEndCallback();
          this.onEndCallback = null;
        }
      };

      this.synth.speak(utterance);
    } catch (error) {
      console.error("Speech synthesis failed:", error);
      this.isSpeakingWebSpeech = false;
      this.currentWebSpeechText = null;
      if (onEnd) onEnd();
    }
  }

  /**
   * Stop any playing audio immediately
   */
  public stop() {
    transformersTTS.stop();
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        console.error(e);
      }
    }
    this.isSpeakingWebSpeech = false;
    this.currentWebSpeechText = null;
  }

  /**
   * Check if speech is currently playing for the given text (or any text)
   */
  public isPlaying(targetText?: string): boolean {
    const tState = transformersTTS.getState();
    if (targetText) {
      return (
        (tState.isPlaying && tState.currentText === targetText) ||
        (this.isSpeakingWebSpeech && this.currentWebSpeechText === targetText)
      );
    }
    return tState.isPlaying || this.isSpeakingWebSpeech;
  }

  /**
   * Subscribe to Transformers.js state updates
   */
  public subscribeState(listener: (state: TTSState) => void): () => void {
    return transformersTTS.subscribe(listener);
  }
}

export const tts = new SpeechService();
export default tts;
