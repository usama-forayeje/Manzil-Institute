"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVoiceTyping } from "@/hooks/useVoiceTyping";

interface BaseVoiceInputProps {
  value?: string;
  onChange?: (e: any) => void;
  language: string;
  className?: string;
  placeholder?: string;
  component?: any;
  isTextarea?: boolean;
  [key: string]: any;
}

/**
 * Internal base component for Voice Inputs (Bn/En/Ar).
 * Handles the logic for voice recognition while allowing style and behavioral overrides.
 */
function BaseVoiceInput({
  value = "",
  onChange,
  language,
  className,
  placeholder,
  component: Component = "input",
  isTextarea = false,
  ...props
}: BaseVoiceInputProps) {
  const [mounted, setMounted] = useState(false);
  const [localVal, setLocalVal] = useState(value ?? "");
  const committedRef = useRef(value ?? "");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (value !== undefined && value !== committedRef.current) {
      setLocalVal(value ?? "");
      committedRef.current = value ?? "";
    }
  }, [value]);

  const handleFinal = useCallback(
    (spoken: string) => {
      const base = committedRef.current ?? "";
      const sep = base && !base.endsWith(" ") ? " " : "";
      const updated = base + sep + spoken;
      setLocalVal(updated);
      committedRef.current = updated;
      if (onChange) {
        const mockEvent = { target: { value: updated } };
        onChange(mockEvent);
      }
    },
    [onChange]
  );

  const { isListening, interimText, error, isSupported, startListening, stopListening } =
    useVoiceTyping({ language, onFinalTranscript: handleFinal });

  const handleChange = useCallback(
    (e: any) => {
      const v = e?.target?.value ?? "";
      setLocalVal(v);
      committedRef.current = v;
      if (typeof onChange === "function") {
        onChange(e);
      }
    },
    [onChange]
  );

  const handleMic = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (isListening) {
      stopListening();
    } else {
      committedRef.current = localVal;
      startListening();
    }
  };

  const handleClear = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (isListening) stopListening();
    setLocalVal("");
    committedRef.current = "";
    if (onChange) {
      const mockEvent = { target: { value: "" } };
      onChange(mockEvent);
    }
  };

  // Use a stable controlled value to prevent React warnings
  const controlledValue = value ?? "";

  if (!mounted) {
    return (
      <Component
        value={controlledValue}
        onChange={(e: any) => onChange?.(e)}
        className={cn("w-full rounded-md border bg-background text-foreground px-3 py-2 text-sm", className)}
        placeholder={placeholder}
        {...props}
      />
    );
  }

  if (!isSupported) {
    return (
      <div className="space-y-1">
        <Component
          value={localVal}
          onChange={handleChange}
          className={cn("w-full rounded-md border bg-background text-foreground px-3 py-2 text-sm", className)}
          placeholder={placeholder}
          {...props}
        />
        <p className="text-[10px] text-destructive font-bold">
          {language === "bn-BD" ? "ভয়েস টাইপিং সাপোর্টেড নয়।" : "Voice typing is not supported."}
        </p>
      </div>
    );
  }

  const displayValue =
    isListening && interimText
      ? localVal + (localVal && !localVal.endsWith(" ") ? " " : "") + interimText
      : localVal;

  return (
    <div className="relative w-full group">
      <Component
        {...props}
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-lg border bg-background text-foreground px-3 py-2 pr-20 text-sm transition-all duration-200 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
          "focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50",
          isListening && "ring-2 ring-green-500/30 border-green-500/50 bg-green-50/10 dark:bg-green-900/5",
          className
        )}
      />

      <div
        className={cn(
          "absolute right-2 flex items-center gap-1.5 z-10",
          isTextarea ? "top-2.5" : "inset-y-0"
        )}
      >
        {localVal.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 hover:scale-110"
            aria-label="Clear"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={handleMic}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200",
            isListening
              ? "bg-[#11a311] text-white shadow-lg shadow-green-500/30 scale-110"
              : "text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 hover:scale-110"
          )}
          aria-label={isListening ? "Stop voice typing" : "Start voice typing"}
        >
          {isListening ? <MicOff className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4" />}
        </button>
      </div>

      {isListening && (
        <div className="absolute -bottom-6 left-0 flex items-center gap-2 px-1 z-20 whitespace-nowrap bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-md py-0.5 border border-green-100 dark:border-green-900/50 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-end gap-[2px] h-3">
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="w-[2px] rounded-full bg-green-500"
                style={{
                  height: "100%",
                  animation: `soundBar 0.8s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
          <span className="text-[10px] font-bold text-green-600 dark:text-green-400 truncate max-w-[150px]">
            {interimText ? `"${interimText}"` : (language === "bn-BD" ? "শুনছি..." : language === "ar-SA" ? "جاري الاستماع..." : "Listening...")}
          </span>
        </div>
      )}

      {error && <p className="absolute -bottom-6 left-0 text-[10px] font-bold text-destructive animate-bounce">{error}</p>}

      <style>{`
        @keyframes soundBar {
          0%, 100% { transform: scaleY(0.4); opacity: 0.6; }
          50%       { transform: scaleY(1);   opacity: 1;   }
        }
      `}</style>
    </div>
  );
}

export function VoiceInputBn(props: any) {
  return <BaseVoiceInput language="bn-BD" placeholder="এখানে টাইপ করুন অথবা মাইক চাপুন..." {...props} />;
}

export function VoiceInputEn(props: any) {
  return <BaseVoiceInput language="en-US" placeholder="Type here or press mic..." {...props} />;
}

export function VoiceInputAr(props: any) {
  return <BaseVoiceInput language="ar-SA" placeholder="এখানে টাইপ করুন অথবা আরবী ভয়েস ব্যবহার করুন..." {...props} />;
}

export function VoiceTextareaBn({ component, ...props }: any) {
  return (
    <BaseVoiceInput
      language="bn-BD"
      isTextarea
      component={component || "textarea"}
      placeholder="গ্রাম / মহল্লা / বাড়ি নং, ডাকঘর ও পোস্ট কোড লিখুন অথবা মাইক চেপে মুখে বলুন..."
      {...props}
    />
  );
}
