"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface UseSpeechSynthesisOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  onEnd?: () => void;
}

export function useSpeechSynthesis({
  lang = "en-US",
  rate = 0.95,
  pitch = 1,
  onEnd,
}: UseSpeechSynthesisOptions = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported] = useState(() => {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  });
  const onEndRef = useRef(onEnd);

  useEffect(() => { onEndRef.current = onEnd; }, [onEnd]);

  const speak = useCallback(
    (text: string) => {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = pitch;

      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(
        (v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("female")
      ) ?? voices.find((v) => v.lang.startsWith("en"));
      if (englishVoice) utterance.voice = englishVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        onEndRef.current?.();
      };
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [lang, rate, pitch]
  );

  const cancel = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { isSpeaking, isSupported, speak, cancel };
}
