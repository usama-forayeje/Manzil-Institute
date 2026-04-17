'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useVoiceTyping({
  language = 'bn-BD',
  onFinalTranscript,
  onInterimTranscript,
} = {}) {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const isSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
    setInterimText('');
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('আপনার ব্রাউজার ভয়েস টাইপিং সাপোর্ট করে না।');
      return;
    }
    setError(null);

    const SR =
      (window as any).SpeechRecognition ??
      (window as any).webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang = language;
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onstart = () => setIsListening(true);

    rec.onresult = (e: any) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        if (result.isFinal) {
          onFinalTranscript?.(result[0].transcript);
        } else {
          interim += result[0].transcript;
        }
      }
      setInterimText(interim);
      onInterimTranscript?.(interim);
    };

    rec.onerror = (e: any) => {
      if (e.error !== 'aborted') setError(`ত্রুটি: ${e.error}`);
      setIsListening(false);
      setInterimText('');
    };

    rec.onend = () => {
      setIsListening(false);
      setInterimText('');
    };

    recognitionRef.current = rec;
    rec.start();
  }, [isSupported, language, onFinalTranscript, onInterimTranscript]);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  return {
    isListening,
    interimText,
    error,
    isSupported,
    startListening,
    stopListening,
  };
}
