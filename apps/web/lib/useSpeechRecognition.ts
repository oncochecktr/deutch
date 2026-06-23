"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SpeakInputLanguage } from "@/lib/speakTypes";

const UNSUPPORTED_MSG =
  "Tarayıcınız ses tanımayı desteklemiyor. Chrome kullanın.";

const STT_LANG: Record<SpeakInputLanguage, string> = {
  de: "de-DE",
  tr: "tr-TR",
};

function getSpeechRecognitionCtor(): (new () => SpeechRecognition) | null {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function mapSpeechError(code: string): string {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "Mikrofon izni verilmedi. Tarayıcı ayarlarından izin verin.";
    case "no-speech":
      return "Ses algılanmadı. Tekrar deneyin.";
    case "network":
      return "Ağ hatası. İnternet bağlantınızı kontrol edin.";
    case "aborted":
      return "Dinleme iptal edildi.";
    default:
      return "Ses tanıma hatası oluştu.";
  }
}

export function useSpeechRecognition(inputLanguage: SpeakInputLanguage = "de") {
  const Ctor = getSpeechRecognitionCtor();
  const supported = Ctor !== null;

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [listening, setListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [error, setError] = useState<string | null>(
    supported ? null : UNSUPPORTED_MSG
  );

  useEffect(() => {
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.lang = STT_LANG[inputLanguage];
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0]?.transcript ?? "";
        if (result.isFinal) {
          final += text;
        } else {
          interim += text;
        }
      }

      if (interim) setInterimTranscript(interim);
      if (final) {
        setFinalTranscript((prev) => (prev ? `${prev} ${final}` : final).trim());
        setInterimTranscript("");
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(mapSpeechError(event.error));
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [Ctor, inputLanguage]);

  const resetTranscript = useCallback(() => {
    setInterimTranscript("");
    setFinalTranscript("");
    setError(supported ? null : UNSUPPORTED_MSG);
  }, [supported]);

  const startListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition || !supported) {
      setError(UNSUPPORTED_MSG);
      return;
    }

    recognition.lang = STT_LANG[inputLanguage];
    setError(null);
    setInterimTranscript("");
    setFinalTranscript("");

    try {
      recognition.start();
      setListening(true);
    } catch {
      setError("Mikrofon zaten aktif veya başlatılamadı.");
      setListening(false);
    }
  }, [supported, inputLanguage]);

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    try {
      recognition.stop();
    } catch {
      /* already stopped */
    }
    setListening(false);
  }, []);

  return {
    supported,
    listening,
    interimTranscript,
    finalTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}
