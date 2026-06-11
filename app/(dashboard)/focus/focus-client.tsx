"use client";

import React, { useState, useEffect, useRef } from "react";
import { logCompletedSession } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw, AlertTriangle } from "lucide-react";

interface FocusClientProps {
    initialFocusCount: number;
}

type TimerMode = "focus" | "shortBreak" | "longBreak";

export function FocusClient({ initialFocusCount }: FocusClientProps) {
    const [mode, setMode] = useState<TimerMode>("focus");
    const [isRunning, setIsRunning] = useState(false);
    const [focusCount, setFocusCount] = useState(initialFocusCount);
    const [showPaywall, setShowPaywall] = useState(false);

    // 1. DYNAMIC STATE: Store custom minutes per mode (Defaults to standard 25, 5, 15)
    const [customTimes, setCustomTimes] = useState<Record<TimerMode, number>>({
        focus: 25,
        shortBreak: 5,
        longBreak: 15,
    });

    // Calculate standard seconds left based on the active custom minutes selection
    const [secondsLeft, setSecondsLeft] = useState(customTimes.focus * 60);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Sync state if mode is switched manually
    const switchMode = (newMode: TimerMode) => {
        setIsRunning(false);
        setMode(newMode);
        setSecondsLeft(customTimes[newMode] * 60); // Uses dynamic custom selection
        setShowPaywall(false);
    };

    // Helper to handle manual custom minutes input edits
    const handleCustomTimeChange = (type: TimerMode, minutesStr: string) => {
        const minutes = parseInt(minutesStr, 10);
        if (isNaN(minutes) || minutes < 1) return;

        // Constrain custom timing between 1 minute and 24 hours (1440 minutes)
        const constrainedMinutes = Math.min(1440, minutes);

        setCustomTimes((prev) => {
            const updated = { ...prev, [type]: constrainedMinutes };
            // If the modified mode is the currently active timer and it is not running, update secondsLeft instantly
            if (!isRunning && mode === type) {
                setSecondsLeft(constrainedMinutes * 60);
            }
            return updated;
        });
    };

    const handleTimerComplete = async () => {
        setIsRunning(false);

        if (mode === "focus") {
            // Gated Free Tier restriction
            if (focusCount >= 2) {
                setShowPaywall(true);
                setSecondsLeft(customTimes.focus * 60);
                return;
            }

            await logCompletedSession();
            setFocusCount((prev) => prev + 1);
            alert(
                "Focus session complete! Great work. Check your planner to see your logged study block.",
            );
        } else {
            alert("Break complete! Ready to lock back in?");
        }

        switchMode("focus");
    };

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setSecondsLeft((prev) => {
                    if (prev <= 1) {
                        handleTimerComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRunning, mode, customTimes]); // Dynamic update hook triggered when customTimes is edited

    const toggleTimer = () => {
        if (mode === "focus" && focusCount >= 2) {
            setShowPaywall(true);
            return;
        }
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setSecondsLeft(customTimes[mode] * 60);
    };

    const formatTime = (secs: number) => {
        const mins = Math.floor(secs / 60);
        const remaining = secs % 60;
        return `${String(mins).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
    };

    const maxTime = customTimes[mode] * 60;
    const progressPercentage = ((maxTime - secondsLeft) / maxTime) * 100;
    const strokeDashoffset = 283 - (283 * progressPercentage) / 100;

    return (
        <div className="space-y-8 max-w-xl mx-auto text-center">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">
                    Focus State
                </h2>
                <p className="text-stone-500 dark:text-stone-400">
                    Quiet your mind. Block out the noise and achieve deep study
                    blocks.
                </p>
            </div>

            {/* Main Focus Card */}
            <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-none p-8 rounded-2xl">
                <CardContent className="space-y-8 pt-6">
                    {/* Mode Selector Tabs */}
                    <div className="flex justify-center gap-2 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                        <button
                            onClick={() => switchMode("focus")}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                                mode === "focus"
                                    ? "bg-white text-stone-950 dark:bg-stone-900 dark:text-stone-50 shadow-sm"
                                    : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                            }`}>
                            Focus ({customTimes.focus}m)
                        </button>
                        <button
                            onClick={() => switchMode("shortBreak")}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                                mode === "shortBreak"
                                    ? "bg-white text-stone-950 dark:bg-stone-900 dark:text-stone-50 shadow-sm"
                                    : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                            }`}>
                            Short Break
                        </button>
                        <button
                            onClick={() => switchMode("longBreak")}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                                mode === "longBreak"
                                    ? "bg-white text-stone-950 dark:bg-stone-900 dark:text-stone-50 shadow-sm"
                                    : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                            }`}>
                            Long Break
                        </button>
                    </div>

                    {/* 2. MINIMALIST CUSTOM TIMING EDITOR */}
                    <div className="grid grid-cols-3 gap-3 pt-2">
                        <div className="space-y-1">
                            <span className="block text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500">
                                Focus Mins
                            </span>
                            <Input
                                type="number"
                                min="1"
                                max="1440"
                                value={customTimes.focus}
                                disabled={isRunning}
                                onChange={(e) =>
                                    handleCustomTimeChange(
                                        "focus",
                                        e.target.value,
                                    )
                                }
                                className="h-8 text-center text-xs bg-stone-50 dark:bg-stone-950 shadow-none border-none focus-visible:ring-1 focus-visible:ring-stone-300 dark:focus-visible:ring-stone-800"
                            />
                        </div>
                        <div className="space-y-1">
                            <span className="block text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500">
                                Short Break
                            </span>
                            <Input
                                type="number"
                                min="1"
                                max="1440"
                                value={customTimes.shortBreak}
                                disabled={isRunning}
                                onChange={(e) =>
                                    handleCustomTimeChange(
                                        "shortBreak",
                                        e.target.value,
                                    )
                                }
                                className="h-8 text-center text-xs bg-stone-50 dark:bg-stone-950 shadow-none border-none focus-visible:ring-1 focus-visible:ring-stone-300 dark:focus-visible:ring-stone-800"
                            />
                        </div>
                        <div className="space-y-1">
                            <span className="block text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500">
                                Long Break
                            </span>
                            <Input
                                type="number"
                                min="1"
                                max="1440"
                                value={customTimes.longBreak}
                                disabled={isRunning}
                                onChange={(e) =>
                                    handleCustomTimeChange(
                                        "longBreak",
                                        e.target.value,
                                    )
                                }
                                className="h-8 text-center text-xs bg-stone-50 dark:bg-stone-950 shadow-none border-none focus-visible:ring-1 focus-visible:ring-stone-300 dark:focus-visible:ring-stone-800"
                            />
                        </div>
                    </div>

                    {/* Circular Countdown Progress Ring */}
                    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
                        <svg
                            className="w-full h-full transform -rotate-90"
                            viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                className="stroke-stone-100 dark:stroke-stone-800"
                                strokeWidth="4"
                                fill="transparent"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                className="stroke-stone-900 dark:stroke-stone-50"
                                strokeWidth="4"
                                fill="transparent"
                                strokeDasharray="283"
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute text-5xl font-bold font-mono tracking-tight">
                            {formatTime(secondsLeft)}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center gap-4">
                        <Button
                            onClick={toggleTimer}
                            size="lg"
                            className="flex gap-2 px-6">
                            {isRunning ? (
                                <Pause className="w-4 h-4" />
                            ) : (
                                <Play className="w-4 h-4" />
                            )}
                            {isRunning ? "Pause" : "Start"}
                        </Button>
                        <Button
                            onClick={resetTimer}
                            size="lg"
                            variant="outline"
                            className="px-6">
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Gated Sessions Limit Info */}
                    <div className="text-xs text-stone-500 pt-2 border-t border-stone-100 dark:border-stone-800">
                        Today&apos;s completed focus blocks:{" "}
                        <span className="font-bold text-stone-900 dark:text-stone-100">
                            {focusCount}/2 completed
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Paywall Banner Gating */}
            {showPaywall && (
                <Card className="border-rose-200 bg-rose-50/50 dark:border-rose-950/40 dark:bg-rose-950/10 p-6 text-center rounded-2xl shadow-none animate-pulse">
                    <div className="flex justify-center mb-3 text-rose-500">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h4 className="text-md font-bold text-rose-800 dark:text-rose-400">
                        Daily Focus Limit Reached
                    </h4>
                    <p className="text-xs text-rose-600 dark:text-rose-300 max-w-sm mx-auto mt-1 leading-relaxed">
                        Free tier users are limited to 2 deep focus study blocks
                        per day. Upgrade to Pro for unlimited focus blocks and
                        third-party integrations.
                    </p>
                    <Button
                        onClick={() => (window.location.href = "/billing")}
                        className="mt-4 bg-rose-600 hover:bg-rose-700 text-white border-none text-xs">
                        Upgrade to Pro for $3
                    </Button>
                </Card>
            )}
        </div>
    );
}
