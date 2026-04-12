import { useState, useCallback, useRef, useEffect } from "react";

interface UseVoiceTypingProps {
  language: string;
  onFinalTranscript: (text: string) => void;
}

/**
 * Custom hook to handle Web Speech API (SpeechRecognition).
 * Manages listening state, interim results, and final transcriptions.
 */
export function useVoiceTyping({ language, onFinalTranscript }: UseVoiceTypingProps) {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  // Use 'any' because SpeechRecognition is not part of standard TypeScript types yet
  const recognitionRef = useRef<any>(null);

  // Check support for browser (Chrome, Edge, Safari supported)
  const isSupported = typeof window !== "undefined" && 
    (!!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition);

  useEffect(() => {
    if (!isSupported) return;

    // Cleanup previous instance if language changes
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = language;
    recognition.continuous = false; // We use manual start/stop for better control
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          onFinalTranscript(transcript);
        } else {
          interim += transcript;
        }
      }
      setInterimText(interim);
    };

    recognition.onerror = (event: any) => {
      // 'no-speech' is common and not really an error to show to user
      if (event.error === 'no-speech') {
        setIsListening(false);
        return;
      }
      console.error("Speech Recognition Error:", event.error);
      setError(`ত্রুটি: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText("");
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, onFinalTranscript, isSupported]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to start recognition:", err);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  return {
    isListening,
    interimText,
    error,
    isSupported,
    startListening,
    stopListening,
  };
}
