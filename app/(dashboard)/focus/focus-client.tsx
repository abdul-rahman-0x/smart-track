"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { logCompletedSession, resetTodayFocusSessions } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Play,
    Pause,
    RotateCcw,
    Sparkles,
    Flame,
    Timer,
    Coffee,
    Settings2,
    CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FocusClientProps {
    initialFocusCount: number;
}

type TimerMode = "focus" | "shortBreak";

export function FocusClient({ initialFocusCount }: FocusClientProps) {
    const [mode, setMode] = useState<TimerMode>("focus");
    const [isRunning, setIsRunning] = useState(false);
    const [focusCount, setFocusCount] = useState(initialFocusCount);
    const [showCustomConfig, setShowCustomConfig] = useState(false);

    const [customTimes, setCustomTimes] = useState<Record<TimerMode, number>>({
        focus: 25,
        shortBreak: 5,
    });

    const [secondsLeft, setSecondsLeft] = useState(customTimes.focus * 60);

    // References for drift-free timestamp calculation and audio safety
    const endTimeRef = useRef<number | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);

    // Initialize AudioContext on user gesture to bypass browser autoplay blocks
    const unlockAudioContext = useCallback(() => {
        try {
            if (!audioCtxRef.current && typeof window !== "undefined") {
                const AudioCtx =
                    window.AudioContext ||
                    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
                if (AudioCtx) audioCtxRef.current = new AudioCtx();
            }
            if (audioCtxRef.current?.state === "suspended") {
                audioCtxRef.current.resume();
            }
        } catch {
            // Audio context unavailable
        }
    }, []);

    const playChime = useCallback(() => {
        try {
            if (!audioCtxRef.current) return;
            const ctx = audioCtxRef.current;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(587.33, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25);

            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.8);
        } catch {
            // Audio block fallback
        }
    }, []);

    // Synchronize browser tab title
    useEffect(() => {
        if (isRunning) {
            const mins = Math.floor(secondsLeft / 60);
            const secs = secondsLeft % 60;
            const formatted = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
            document.title = `(${formatted}) ${mode === "focus" ? "Focus" : "Break"} | SmartTrack`;
        } else {
            document.title = "Deep Work Session | SmartTrack";
        }

        return () => {
            document.title = "SmartTrack";
        };
    }, [secondsLeft, isRunning, mode]);

    const switchMode = useCallback(
        (newMode: TimerMode, durationMinutes?: number) => {
            setIsRunning(false);
            endTimeRef.current = null;
            setMode(newMode);
            const mins = durationMinutes ?? customTimes[newMode];
            setSecondsLeft(mins * 60);
        },
        [customTimes]
    );

    const applyPreset = (focusMins: number, breakMins: number) => {
        setIsRunning(false);
        endTimeRef.current = null;
        setCustomTimes({ focus: focusMins, shortBreak: breakMins });
        setSecondsLeft(mode === "focus" ? focusMins * 60 : breakMins * 60);
    };

    const handleCustomTimeChange = (type: TimerMode, minutesStr: string) => {
        const minutes = parseInt(minutesStr, 10);
        if (isNaN(minutes) || minutes < 1) return;
        const constrained = Math.min(180, minutes);

        setCustomTimes((prev) => {
            const updated = { ...prev, [type]: constrained };
            if (!isRunning && mode === type) {
                setSecondsLeft(constrained * 60);
            }
            return updated;
        });
    };

    const handleTimerComplete = useCallback(async () => {
        playChime();
        setIsRunning(false);
        endTimeRef.current = null;

        if (mode === "focus") {
            try {
                await logCompletedSession();
                setFocusCount((prev) => prev + 1);
                toast.success("Focus block completed. Transitioning to recharge interval.");
            } catch {
                toast.error("Could not record session completion.");
            }
            switchMode("shortBreak");
        } else {
            toast.info("Recharge complete. Ready for next sprint.");
            switchMode("focus");
        }
    }, [mode, playChime, switchMode]);

    const handleTimerCompleteRef = useRef(handleTimerComplete);
    useEffect(() => {
        handleTimerCompleteRef.current = handleTimerComplete;
    }, [handleTimerComplete]);

    // Drift-proof delta interval
    useEffect(() => {
        if (!isRunning) {
            endTimeRef.current = null;
            return;
        }

        if (!endTimeRef.current) {
            endTimeRef.current = Date.now() + secondsLeft * 1000;
        }

        const intervalId = setInterval(() => {
            if (!endTimeRef.current) return;
            const remainingMs = endTimeRef.current - Date.now();
            const remainingSecs = Math.max(0, Math.ceil(remainingMs / 1000));

            setSecondsLeft(remainingSecs);

            if (remainingSecs <= 0) {
                clearInterval(intervalId);
                handleTimerCompleteRef.current();
            }
        }, 250);

        return () => clearInterval(intervalId);
    }, [isRunning, secondsLeft]);

    const toggleTimer = () => {
        unlockAudioContext();
        if (!isRunning) {
            endTimeRef.current = Date.now() + secondsLeft * 1000;
        } else {
            endTimeRef.current = null;
        }
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        endTimeRef.current = null;
        setSecondsLeft(customTimes[mode] * 60);
    };

    const handleResetSessions = async () => {
        try {
            await resetTodayFocusSessions();
            setFocusCount(0);
            resetTimer();
            toast.success("Daily session counters cleared.");
        } catch {
            toast.error("Failed to reset session ledger.");
        }
    };

    const formatTime = (secs: number) => {
        const mins = Math.floor(secs / 60);
        const remaining = secs % 60;
        return `${String(mins).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
    };

    // SVG Progress calculation (r = 44, circumference ≈ 276.46)
    const maxTime = customTimes[mode] * 60;
    const progressPercentage = ((maxTime - secondsLeft) / maxTime) * 100;
    const circumference = 276.46;
    const strokeDashoffset = circumference - (circumference * progressPercentage) / 100;

    return (
        <div className="space-y-8 pb-16 max-w-xl mx-auto selection:bg-[#F9F8F6]/20">
            {/* Header */}
            <header className="space-y-1.5 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[#161616] border border-[#F9F8F6]/[0.08] text-xs font-mono text-[#F9F8F6]/80 mb-1">
                    <Timer className="size-3.5 text-[#66CC63]" />
                    <span>DEEP WORK PROTOCOL</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-[-0.028em] text-[#F9F8F6]">
                    Execution Focus Engine
                </h1>
                <p className="text-sm font-sans text-[#F9F8F6]/60 max-w-sm mx-auto">
                    Single-task isolation timer calibrated for uninterrupted focus sprints.
                </p>
            </header>

            {/* Main Focus Console */}
            <div className="rounded-[16px] border border-[#F9F8F6]/[0.08] bg-[#161616] p-6 sm:p-8 space-y-7">
                {/* Mode Selector */}
                <div className="flex justify-center gap-1.5 bg-[#0E0D0C] p-1 rounded-[8px] border border-[#F9F8F6]/[0.08] max-w-xs mx-auto">
                    <button
                        type="button"
                        onClick={() => switchMode("focus")}
                        className={cn(
                            "flex-1 py-1.5 px-3 text-xs font-mono rounded-[6px] transition-colors flex items-center justify-center gap-1.5",
                            mode === "focus"
                                ? "bg-[#20201F] text-[#F9F8F6] border border-[#F9F8F6]/[0.1] font-medium"
                                : "text-[#F9F8F6]/40 hover:text-[#F9F8F6]"
                        )}
                    >
                        <Flame className={cn("size-3.5", mode === "focus" ? "text-[#FBBF24] fill-current" : "")} />
                        Focus ({customTimes.focus}m)
                    </button>
                    <button
                        type="button"
                        onClick={() => switchMode("shortBreak")}
                        className={cn(
                            "flex-1 py-1.5 px-3 text-xs font-mono rounded-[6px] transition-colors flex items-center justify-center gap-1.5",
                            mode === "shortBreak"
                                ? "bg-[#20201F] text-[#F9F8F6] border border-[#F9F8F6]/[0.1] font-medium"
                                : "text-[#F9F8F6]/40 hover:text-[#F9F8F6]"
                        )}
                    >
                        <Coffee className={cn("size-3.5", mode === "shortBreak" ? "text-[#F9F8F6]" : "")} />
                        Break ({customTimes.shortBreak}m)
                    </button>
                </div>

                {/* Preset Selector */}
                <div className="flex items-center justify-center gap-2">
                    <button
                        type="button"
                        onClick={() => applyPreset(25, 5)}
                        className={cn(
                            "text-xs font-mono px-3 py-1 rounded-[6px] border transition-colors",
                            customTimes.focus === 25 && customTimes.shortBreak === 5
                                ? "bg-[#20201F] text-[#F9F8F6] border-[#F9F8F6]/20 font-medium"
                                : "bg-transparent text-[#F9F8F6]/50 border-[#F9F8F6]/[0.08] hover:text-[#F9F8F6] hover:bg-[#20201F]/40"
                        )}
                    >
                        25/5 Standard
                    </button>
                    <button
                        type="button"
                        onClick={() => applyPreset(50, 10)}
                        className={cn(
                            "text-xs font-mono px-3 py-1 rounded-[6px] border transition-colors",
                            customTimes.focus === 50 && customTimes.shortBreak === 10
                                ? "bg-[#20201F] text-[#F9F8F6] border-[#F9F8F6]/20 font-medium"
                                : "bg-transparent text-[#F9F8F6]/50 border-[#F9F8F6]/[0.08] hover:text-[#F9F8F6] hover:bg-[#20201F]/40"
                        )}
                    >
                        50/10 Extended
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowCustomConfig(!showCustomConfig)}
                        className={cn(
                            "text-xs font-mono px-2.5 py-1 rounded-[6px] border transition-colors flex items-center gap-1",
                            showCustomConfig
                                ? "bg-[#20201F] text-[#F9F8F6] border-[#F9F8F6]/20"
                                : "bg-transparent text-[#F9F8F6]/50 border-[#F9F8F6]/[0.08] hover:text-[#F9F8F6]"
                        )}
                    >
                        <Settings2 className="size-3" />
                        Config
                    </button>
                </div>

                {/* Custom Duration Panel */}
                {showCustomConfig && (
                    <div className="grid grid-cols-2 gap-3 p-3.5 rounded-[8px] bg-[#0E0D0C] border border-[#F9F8F6]/[0.08] max-w-sm mx-auto">
                        <div className="space-y-1">
                            <span className="block text-[10px] font-mono uppercase text-[#F9F8F6]/60 tracking-wider">
                                Focus (Minutes)
                            </span>
                            <Input
                                type="number"
                                min="1"
                                max="180"
                                value={customTimes.focus}
                                disabled={isRunning}
                                onChange={(e) => handleCustomTimeChange("focus", e.target.value)}
                                className="h-8 text-center text-xs font-mono bg-[#161616] border-[#F9F8F6]/[0.1] text-[#F9F8F6] rounded-[6px]"
                            />
                        </div>
                        <div className="space-y-1">
                            <span className="block text-[10px] font-mono uppercase text-[#F9F8F6]/60 tracking-wider">
                                Break (Minutes)
                            </span>
                            <Input
                                type="number"
                                min="1"
                                max="60"
                                value={customTimes.shortBreak}
                                disabled={isRunning}
                                onChange={(e) => handleCustomTimeChange("shortBreak", e.target.value)}
                                className="h-8 text-center text-xs font-mono bg-[#161616] border-[#F9F8F6]/[0.1] text-[#F9F8F6] rounded-[6px]"
                            />
                        </div>
                    </div>
                )}

                {/* Minimalist Countdown Ring */}
                <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background Track */}
                        <circle
                            cx="50"
                            cy="50"
                            r="44"
                            className="stroke-[#20201F]"
                            strokeWidth="2.5"
                            fill="transparent"
                        />
                        {/* Active Progress Arc */}
                        <circle
                            cx="50"
                            cy="50"
                            r="44"
                            className={cn(
                                "transition-all duration-300",
                                mode === "focus" ? "stroke-[#F9F8F6]" : "stroke-[#66CC63]"
                            )}
                            strokeWidth="2.5"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                        />
                    </svg>

                    {/* Centered Digital Readout */}
                    <div className="absolute flex flex-col items-center">
                        <span className="text-5xl sm:text-6xl font-mono font-medium tracking-tight text-[#F9F8F6] tabular-nums">
                            {formatTime(secondsLeft)}
                        </span>
                        <span className="text-[11px] font-mono text-[#F9F8F6]/40 mt-1 uppercase tracking-wider">
                            {mode === "focus" ? (isRunning ? "RUNNING" : "STANDBY") : "RECHARGING"}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-3">
                    <Button
                        onClick={toggleTimer}
                        size="lg"
                        className={cn(
                            "h-11 px-8 text-xs font-sans font-medium rounded-[8px] flex items-center gap-2 transition-colors",
                            isRunning
                                ? "bg-[#20201F] text-[#F9F8F6] hover:bg-[#2A2A29] border border-[#F9F8F6]/[0.1]"
                                : "bg-[#F9F8F6] text-[#0E0D0C] hover:bg-[#E5E5E5]"
                        )}
                    >
                        {isRunning ? <Pause className="size-4" /> : <Play className="size-4 fill-current" />}
                        {isRunning ? "Pause Interval" : "Engage Interval"}
                    </Button>

                    <Button
                        onClick={resetTimer}
                        size="lg"
                        variant="outline"
                        aria-label="Reset Timer"
                        className="size-11 p-0 border-[#F9F8F6]/[0.12] bg-transparent hover:bg-[#20201F] text-[#F9F8F6]/60 hover:text-[#F9F8F6] rounded-[8px]"
                    >
                        <RotateCcw className="size-4" />
                    </Button>
                </div>

                {/* Daily Ledger Strip */}
                <div className="pt-5 border-t border-[#F9F8F6]/[0.06] flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2.5">
                        <span className="text-[#F9F8F6]/60">TODAY:</span>
                        <div className="flex items-center gap-1.5">
                            {Array.from({ length: Math.max(4, focusCount) }).map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "size-2 rounded-full transition-colors",
                                        i < focusCount
                                            ? "bg-[#66CC63]"
                                            : "bg-[#20201F] border border-[#F9F8F6]/[0.1]"
                                    )}
                                    title={`Block ${i + 1}`}
                                />
                            ))}
                        </div>
                        <span className="text-[#F9F8F6] font-medium ml-1 tabular-nums">
                            {focusCount} {focusCount === 1 ? "sprint" : "sprints"}
                        </span>
                    </div>

                    {focusCount > 0 && (
                        <button
                            type="button"
                            onClick={handleResetSessions}
                            className="text-[11px] font-mono text-[#F9F8F6]/40 hover:text-[#F87171] transition-colors"
                        >
                            Reset Tally
                        </button>
                    )}
                </div>
            </div>

            {/* Daily Milestone Banner */}
            {focusCount >= 4 && (
                <div className="rounded-[16px] border border-[#F9F8F6]/[0.08] bg-[#161616] p-4 flex items-center gap-3.5">
                    <div className="size-9 rounded-[8px] bg-[#20201F] text-[#66CC63] flex items-center justify-center shrink-0 border border-[#F9F8F6]/[0.08]">
                        <CheckCircle2 className="size-5" />
                    </div>
                    <div className="text-left space-y-0.5">
                        <h4 className="text-xs font-mono uppercase tracking-wider text-[#F9F8F6]">
                            Target Volume Satisfied (100m+ Logged)
                        </h4>
                        <p className="text-xs font-sans text-[#F9F8F6]/60">
                            High-intensity deep work quota logged to database for today.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
