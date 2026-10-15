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
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // --- Native Web Audio Chime (Zero External Files Needed) ---
    const playSoftChime = useCallback(() => {
        try {
            const AudioCtx =
                window.AudioContext ||
                (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(587.33, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25);

            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.8);
        } catch {
            // Audio blocked by browser policy until user gesture
        }
    }, []);

    // --- Live Browser Tab Title ---
    useEffect(() => {
        if (isRunning) {
            const mins = Math.floor(secondsLeft / 60);
            const secs = secondsLeft % 60;
            const formatted = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
            document.title = `(${formatted}) ${mode === "focus" ? "🎯 Focus" : "☕ Break"} | SmartTrack`;
        } else {
            document.title = "Deep Work | SmartTrack";
        }

        return () => {
            document.title = "SmartTrack";
        };
    }, [secondsLeft, isRunning, mode]);

    // --- Switch Modes ---
    const switchMode = useCallback(
        (newMode: TimerMode, durationMinutes?: number) => {
            setIsRunning(false);
            setMode(newMode);
            const mins = durationMinutes ?? customTimes[newMode];
            setSecondsLeft(mins * 60);
        },
        [customTimes],
    );

    const applyPreset = (focusMins: number, breakMins: number) => {
        setIsRunning(false);
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

    // --- Timer Lifecycle Handler ---
    const handleTimerComplete = useCallback(async () => {
        playSoftChime();

        if (mode === "focus") {
            await logCompletedSession();
            setFocusCount((prev) => prev + 1);
            switchMode("shortBreak");
        } else {
            switchMode("focus");
        }
    }, [mode, playSoftChime, switchMode]);

    // Keep reference updated to avoid stale closures in interval
    const handleTimerCompleteRef = useRef(handleTimerComplete);
    useEffect(() => {
        handleTimerCompleteRef.current = handleTimerComplete;
    }, [handleTimerComplete]);

    // Single interval effect without cascading renders
    useEffect(() => {
        if (!isRunning) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        intervalRef.current = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    setTimeout(() => {
                        handleTimerCompleteRef.current();
                    }, 0);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    const toggleTimer = () => setIsRunning(!isRunning);

    const resetTimer = () => {
        setIsRunning(false);
        setSecondsLeft(customTimes[mode] * 60);
    };

    const handleResetSessions = async () => {
        await resetTodayFocusSessions();
        setFocusCount(0);
        resetTimer();
    };

    const formatTime = (secs: number) => {
        const mins = Math.floor(secs / 60);
        const remaining = secs % 60;
        return `${String(mins).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
    };

    // SVG Progress Calculations (r = 44, circumference ≈ 276.46)
    const maxTime = customTimes[mode] * 60;
    const progressPercentage = ((maxTime - secondsLeft) / maxTime) * 100;
    const circumference = 276.46;
    const strokeDashoffset = circumference - (circumference * progressPercentage) / 100;

    return (
        <div className="relative space-y-10 pb-16 max-w-xl mx-auto text-center">
            {/* Ambient Lighting Glow (using canonical Tailwind /4 opacity) */}
            <div
                className={cn(
                    "absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 blur-3xl pointer-events-none rounded-full transition-colors duration-700",
                    mode === "focus" ? "bg-emerald-500/4" : "bg-indigo-500/4",
                )}
            />

            {/* --- HEADER --- */}
            <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary border border-border/80 text-xs font-semibold text-foreground mb-1">
                    <Timer className="size-3.5 text-emerald-500" />
                    <span>Deep Work Engine</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Focus State
                </h1>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Block digital noise, quiet your mind, and execute distraction-free study sprints.
                </p>
            </div>

            {/* --- MAIN FOCUS CARD --- */}
            <div className="rounded-2xl border border-border/90 bg-card p-6 sm:p-8 card-elevation space-y-7 relative">
                {/* Mode Selector Switch */}
                <div className="flex justify-center gap-1.5 bg-secondary/50 p-1 rounded-xl border border-border/60 max-w-xs mx-auto">
                    <button
                        type="button"
                        onClick={() => switchMode("focus")}
                        className={cn(
                            "flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5",
                            mode === "focus"
                                ? "bg-card text-foreground font-semibold card-elevation"
                                : "text-muted-foreground hover:text-foreground",
                        )}>
                        <Flame className={cn("size-3.5", mode === "focus" ? "text-emerald-500 fill-current" : "")} />
                        Focus ({customTimes.focus}m)
                    </button>
                    <button
                        type="button"
                        onClick={() => switchMode("shortBreak")}
                        className={cn(
                            "flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5",
                            mode === "shortBreak"
                                ? "bg-card text-foreground font-semibold card-elevation"
                                : "text-muted-foreground hover:text-foreground",
                        )}>
                        <Coffee className={cn("size-3.5", mode === "shortBreak" ? "text-indigo-400" : "")} />
                        Break ({customTimes.shortBreak}m)
                    </button>
                </div>

                {/* Quick Presets Row */}
                <div className="flex items-center justify-center gap-2">
                    <button
                        type="button"
                        onClick={() => applyPreset(25, 5)}
                        className={cn(
                            "text-[11px] font-medium px-2.5 py-1 rounded-md border transition-all",
                            customTimes.focus === 25 && customTimes.shortBreak === 5
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                                : "bg-secondary/40 text-muted-foreground border-border/60 hover:text-foreground",
                        )}>
                        25 / 5m Classic
                    </button>
                    <button
                        type="button"
                        onClick={() => applyPreset(50, 10)}
                        className={cn(
                            "text-[11px] font-medium px-2.5 py-1 rounded-md border transition-all",
                            customTimes.focus === 50 && customTimes.shortBreak === 10
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                                : "bg-secondary/40 text-muted-foreground border-border/60 hover:text-foreground",
                        )}>
                        50 / 10m Deep
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowCustomConfig(!showCustomConfig)}
                        className={cn(
                            "text-[11px] font-medium px-2 py-1 rounded-md border transition-all flex items-center gap-1",
                            showCustomConfig
                                ? "bg-secondary text-foreground border-border"
                                : "bg-secondary/20 text-muted-foreground border-border/40 hover:text-foreground",
                        )}>
                        <Settings2 className="size-3" />
                        Custom
                    </button>
                </div>

                {/* Collapsible Custom Minute Configuration */}
                {showCustomConfig && (
                    <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-secondary/30 border border-border/60 max-w-sm mx-auto">
                        <div className="space-y-1">
                            <span className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                                Focus Mins
                            </span>
                            <Input
                                type="number"
                                min="1"
                                max="180"
                                value={customTimes.focus}
                                disabled={isRunning}
                                onChange={(e) => handleCustomTimeChange("focus", e.target.value)}
                                className="h-8 text-center text-xs bg-card border-border/80 shadow-none font-semibold"
                            />
                        </div>
                        <div className="space-y-1">
                            <span className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                                Break Mins
                            </span>
                            <Input
                                type="number"
                                min="1"
                                max="60"
                                value={customTimes.shortBreak}
                                disabled={isRunning}
                                onChange={(e) => handleCustomTimeChange("shortBreak", e.target.value)}
                                className="h-8 text-center text-xs bg-card border-border/80 shadow-none font-semibold"
                            />
                        </div>
                    </div>
                )}

                {/* Circular Animated SVG Countdown Ring */}
                <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background track circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="44"
                            className="stroke-secondary"
                            strokeWidth="3.5"
                            fill="transparent"
                        />
                        {/* Active Progress Circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="44"
                            className={cn(
                                "transition-all duration-500",
                                mode === "focus"
                                    ? "stroke-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                                    : "stroke-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.3)]",
                            )}
                            strokeWidth="3.5"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                        />
                    </svg>

                    {/* Centered Digital Countdown Display */}
                    <div className="absolute flex flex-col items-center">
                        <span className="text-5xl font-bold tracking-tight tabular-nums text-foreground">
                            {formatTime(secondsLeft)}
                        </span>
                        <span className="text-[11px] font-medium text-muted-foreground mt-1 uppercase tracking-widest">
                            {mode === "focus" ? (isRunning ? "Sprinting" : "Ready") : "Recharging"}
                        </span>
                    </div>
                </div>

                {/* Primary Action Controls */}
                <div className="flex items-center justify-center gap-3">
                    <Button
                        onClick={toggleTimer}
                        size="lg"
                        className={cn(
                            "btn-tactile h-11 px-8 text-sm font-semibold flex items-center gap-2",
                            isRunning
                                ? "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                                : "bg-foreground text-background hover:bg-foreground/90",
                        )}>
                        {isRunning ? <Pause className="size-4" /> : <Play className="size-4 fill-current" />}
                        {isRunning ? "Pause Sprint" : "Start Sprint"}
                    </Button>

                    <Button
                        onClick={resetTimer}
                        size="lg"
                        variant="outline"
                        aria-label="Reset Timer"
                        className="size-11 p-0 border-border hover:bg-secondary text-muted-foreground hover:text-foreground">
                        <RotateCcw className="size-4" />
                    </Button>
                </div>

                {/* Session Tally & Daily Momentum */}
                <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                            Today&apos;s Focus Blocks:
                        </span>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.max(4, focusCount) }).map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "size-2 rounded-full transition-all",
                                        i < focusCount
                                            ? "bg-emerald-500 shadow-xs shadow-emerald-500/50"
                                            : "bg-secondary border border-border/80",
                                    )}
                                    title={`Session ${i + 1}`}
                                />
                            ))}
                        </div>
                        <span className="font-semibold text-foreground ml-1 tabular-nums">
                            {focusCount} {focusCount === 1 ? "block" : "blocks"}
                        </span>
                    </div>

                    {focusCount > 0 && (
                        <button
                            type="button"
                            onClick={handleResetSessions}
                            className="text-[11px] text-muted-foreground hover:text-destructive underline decoration-muted-foreground/30 transition-colors">
                            Reset Tally
                        </button>
                    )}
                </div>
            </div>

            {/* Achievement Milestone Banner (using canonical Tailwind /4 opacity) */}
            {focusCount >= 4 && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/4 p-4 text-center card-elevation flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-left">
                        <div className="size-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                            <Sparkles className="size-5 fill-current" />
                        </div>
                        <div>
                            <h4 className="text-xs font-semibold text-foreground">
                                Daily Target Met (100+ Mins Logged) 🎯
                            </h4>
                            <p className="text-[11px] text-muted-foreground">
                                Outstanding mental stamina. You have entered deep flow state today.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
