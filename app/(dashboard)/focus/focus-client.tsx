"use client";

import React, { useState, useEffect, useRef } from "react";
import { logCompletedSession, resetTodayFocusSessions } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw, Sparkles } from "lucide-react";

interface FocusClientProps {
    initialFocusCount: number;
}

type TimerMode = "focus" | "shortBreak";

export function FocusClient({ initialFocusCount }: FocusClientProps) {
    const [mode, setMode] = useState<TimerMode>("focus");
    const [isRunning, setIsRunning] = useState(false);
    const [focusCount, setFocusCount] = useState(initialFocusCount);
    const [showAchievement, setShowAchievement] = useState(false);

    const [customTimes, setCustomTimes] = useState<Record<TimerMode, number>>({
        focus: 25,
        shortBreak: 5,
    });

    const [secondsLeft, setSecondsLeft] = useState(customTimes.focus * 60);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const switchMode = (newMode: TimerMode) => {
        setIsRunning(false);
        setMode(newMode);
        setSecondsLeft(customTimes[newMode] * 60);
        setShowAchievement(false);
    };

    const handleCustomTimeChange = (type: TimerMode, minutesStr: string) => {
        const minutes = parseInt(minutesStr, 10);
        if (isNaN(minutes) || minutes < 1) return;

        const constrainedMinutes = Math.min(1440, minutes);

        setCustomTimes((prev) => {
            const updated = { ...prev, [type]: constrainedMinutes };
            if (!isRunning && mode === type) {
                setSecondsLeft(constrainedMinutes * 60);
            }
            return updated;
        });
    };

    const handleTimerComplete = async () => {
        if (mode === "focus") {
            if (focusCount >= 2) {
                setIsRunning(false);
                setShowAchievement(true);
                setSecondsLeft(customTimes.focus * 60);
                return;
            }

            await logCompletedSession();
            const updatedCount = focusCount + 1;
            setFocusCount(updatedCount);

            if (updatedCount >= 2) {
                setIsRunning(false);
                setShowAchievement(true);
                setSecondsLeft(customTimes.focus * 60);
                return;
            }

            setMode("shortBreak");
            setSecondsLeft(customTimes.shortBreak * 60);
            setIsRunning(true);
        } else {
            if (focusCount >= 2) {
                setIsRunning(false);
                setMode("focus");
                setSecondsLeft(customTimes.focus * 60);
                setShowAchievement(true);
                return;
            }

            setMode("focus");
            setSecondsLeft(customTimes.focus * 60);
            setIsRunning(true);
        }
    };

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    useEffect(() => {
        if (secondsLeft === 0 && isRunning) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setTimeout(() => {
                handleTimerComplete();
            }, 0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [secondsLeft, isRunning]);

    const toggleTimer = () => {
        if (mode === "focus" && focusCount >= 2) {
            setShowAchievement(true);
            return;
        }
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setSecondsLeft(customTimes[mode] * 60);
    };

    // FIXED: Reset completed focus state on the server instantly
    const handleResetSessions = async () => {
        await resetTodayFocusSessions();
        setFocusCount(0);
        setShowAchievement(false);
        setSecondsLeft(customTimes.focus * 60);
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
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg ${
                                mode === "focus"
                                    ? "bg-white text-stone-950 dark:bg-stone-900 dark:text-stone-50 shadow-sm"
                                    : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                            }`}>
                            Focus ({customTimes.focus}m)
                        </button>
                        <button
                            onClick={() => switchMode("shortBreak")}
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg ${
                                mode === "shortBreak"
                                    ? "bg-white text-stone-950 dark:bg-stone-900 dark:text-stone-50 shadow-sm"
                                    : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                            }`}>
                            Short Break ({customTimes.shortBreak}m)
                        </button>
                    </div>

                    {/* Custom Timing Editor */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
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
                        <div className="absolute text-5xl font-bold tracking-tight tabular-nums text-stone-900 dark:text-stone-50">
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

                    {/* Daily Completion Score */}
                    <div className="text-xs text-stone-500 pt-2 border-t border-stone-100 dark:border-stone-800">
                        Today&apos;s completed focus blocks:{" "}
                        <span className="font-bold text-stone-900 dark:text-stone-100">
                            {Math.min(2, focusCount)}/2 completed
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* 3. FIXED: MINDFUL ACHIEVEMENT CARD (Replaces the Stripe Billing Paywall) */}
            {showAchievement && (
                <Card className="border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-900/40 p-6 text-center rounded-2xl shadow-none">
                    <div className="flex justify-center mb-3 text-amber-500">
                        <Sparkles className="w-8 h-8 fill-current" />
                    </div>
                    <h4 className="text-md font-bold text-stone-800 dark:text-stone-200">
                        Daily Focus Goal Achieved! 🧘
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto mt-1 leading-relaxed">
                        You have successfully completed your targeted focus
                        blocks for today. Take a deep breath and rest. If you
                        want to keep going, reset below to start a new block.
                    </p>
                    <Button
                        onClick={handleResetSessions}
                        className="mt-4 bg-stone-900 hover:bg-stone-800 text-stone-50 dark:bg-stone-50 dark:text-stone-900 dark:hover:bg-stone-200 text-xs flex items-center gap-2 mx-auto">
                        <RotateCcw className="w-3.5 h-3.5" /> Reset Today&apos;s
                        Sessions
                    </Button>
                </Card>
            )}
        </div>
    );
}
