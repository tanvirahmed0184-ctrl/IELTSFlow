/**
 * Text-to-Speech via Web Speech API
 */
export function speakText(
  text: string,
  options?: {
    onEnd?: () => void;
    rate?: number;
    pitch?: number;
  }
): SpeechSynthesisUtterance | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;

  const u = new SpeechSynthesisUtterance(text);
  u.rate = options?.rate ?? 0.95;
  u.pitch = options?.pitch ?? 1;
  u.lang = "en-GB";
  if (options?.onEnd) {
    u.onend = options.onEnd;
  }
  window.speechSynthesis.speak(u);
  return u;
}

export function stopSpeaking(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

export function isSpeaking(): boolean {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  return window.speechSynthesis.speaking;
}
