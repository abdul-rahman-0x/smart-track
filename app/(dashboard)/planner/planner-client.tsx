"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { createPlannerTask, toggleTask, deleteTask, clearDayTasks, clearWeekTasks } from "./actions";
import { ChevronLeft, ChevronRight, Plus, Trash, RefreshCw } from "lucide-react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: Date | null;
  priority: string;
}

interface PlannerClientProps {
  selectedDateStr: string;
  initialTasks: Task[];
}

const HOURS_LIST = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

export function PlannerClient({ selectedDateStr, initialTasks }: PlannerClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"weekly" | "daily">("weekly");

  // Isolated state inputs to prevent cross-card joint typing bugs
  const [taskInputs, setTaskInputs] = useState<Record<string, string>>({});
  const [hourlyInputs, setHourlyInputs] = useState<Record<string, string>>({});
  const [weeklyPriorityInput, setWeeklyPriorityInput] = useState("");
  const [dailyMustDoInput, setDailyMustDoInput] = useState("");
  const [dailyOtherInput, setDailyOtherInput] = useState("");

  const selectedDate = new Date(selectedDateStr);

  // Calculate weekly boundaries (Monday to Sunday)
  const currentDayOfWeek = selectedDate.getDay();
  const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const monday = new Date(selectedDate);
  monday.setDate(selectedDate.getDate() + distanceToMonday);

  const WEEK_DAYS = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return day;
  });

  const getWeekRangeLabel = () => {
    const start = WEEK_DAYS[0].toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const end = WEEK_DAYS[6].toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `Week of ${start} - ${end}`;
  };

  const handleNavigate = (direction: "prev" | "next") => {
    const offset = activeTab === "weekly" ? 7 : 1;
    const nextDate = new Date(selectedDate);
    nextDate.setDate(selectedDate.getDate() + (direction === "next" ? offset : -offset));
    router.push(`/planner?date=${nextDate.toISOString().split("T")[0]}`);
  };

  const getTasksForDate = (date: Date) => {
    return initialTasks.filter((t) => {
      if (!t.dueDate) return false;
      const taskDate = new Date(t.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const handleAddTask = async (
    title: string,
    priority: "low" | "medium" | "high",
    targetDateStr: string,
    clearInputFn: () => void
  ) => {
    if (!title.trim()) return;
    clearInputFn(); // Snappy optimistic UI clear
    await createPlannerTask({
      title,
      dueDateStr: targetDateStr,
      priority,
    });
  };

  // --- BULK ACTION RECOVERY ---
  const handleClearWeek = async () => {
    const confirm = window.confirm("Are you sure you want to clear all tasks for this week?");
    if (confirm) {
      await clearWeekTasks(monday.toISOString().split("T")[0]);
    }
  };

  const handleClearDay = async () => {
    const confirm = window.confirm("Are you sure you want to clear all tasks for today?");
    if (confirm) {
      await clearDayTasks(selectedDateStr);
    }
  };

  // --- DYNAMIC FOCUS SCORE CALCULATOR ---
  const dailyTasks = getTasksForDate(selectedDate);
  const totalDailyTasks = dailyTasks.length;
  const completedDailyTasks = dailyTasks.filter((t) => t.completed).length;
  const dailyFocusPercentage = totalDailyTasks > 0 ? Math.round((completedDailyTasks / totalDailyTasks) * 100) : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stone-100 dark:border-stone-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planner</h1>
        </div>

        {/* Dynamic Selector Toggle */}
        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("weekly")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg ${activeTab === "weekly"
              ? "bg-white text-stone-950 dark:bg-stone-900 dark:text-stone-50 shadow-sm"
              : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
              }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setActiveTab("daily")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg ${activeTab === "daily"
              ? "bg-white text-stone-950 dark:bg-stone-900 dark:text-stone-50 shadow-sm"
              : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
              }`}
          >
            Daily
          </button>
        </div>
      </div>

      {/* ==================== WEEKLY VIEW ==================== */}
      {activeTab === "weekly" && (
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-stone-700 dark:text-stone-300">
                {getWeekRangeLabel()}
              </h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => handleNavigate("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleNavigate("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                {/* Clear Week Button */}
                <Button variant="outline" size="icon" onClick={handleClearWeek} className="hover:text-red-500" title="Clear entire week">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {WEEK_DAYS.map((day) => {
                const dateKey = day.toISOString().split("T")[0];
                const dayTasks = getTasksForDate(day).filter((t) => !t.title.startsWith("[")); // Filter out hourly items from weekly checklists

                return (
                  <Card key={dateKey} className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-none min-h-[160px]">
                    <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center">
                      <span className="font-bold text-xs uppercase tracking-wider text-stone-500">
                        {day.toLocaleDateString("en-US", { weekday: "long" })}
                      </span>
                      <span className="text-xs text-stone-400">
                        {day.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <CardContent className="p-4 space-y-2">
                      {dayTasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between gap-2 group">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={async (checked) => {
                                await toggleTask(task.id, !!checked);
                              }}
                            />
                            <span className={`text-xs ${task.completed ? "line-through text-stone-400" : ""}`}>
                              {task.title}
                            </span>
                          </div>
                          <button onClick={async () => await deleteTask(task.id)} className="text-stone-400 hover:text-red-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer">
                            <Trash className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleAddTask(
                            taskInputs[dateKey] || "",
                            "medium",
                            dateKey,
                            () => setTaskInputs((prev) => ({ ...prev, [dateKey]: "" }))
                          );
                        }}
                        className="flex gap-2 pt-2 border-t border-dashed border-stone-100 dark:border-stone-800 mt-2"
                      >
                        <Input
                          placeholder="Add task..."
                          value={taskInputs[dateKey] || ""}
                          onChange={(e) => setTaskInputs((prev) => ({ ...prev, [dateKey]: e.target.value }))}
                          className="h-7 text-xs bg-stone-50 dark:bg-stone-950 px-2 py-0 border-none shadow-none focus-visible:ring-1 focus-visible:ring-stone-300 dark:focus-visible:ring-stone-800"
                        />
                        <Button type="submit" size="icon" className="h-7 w-7">
                          <Plus className="w-3 h-3" />
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none bg-stone-100 dark:bg-stone-900 p-6 space-y-6 rounded-2xl shadow-none">
              <div>
                <h4 className="font-bold text-stone-700 dark:text-stone-300 border-b border-stone-200 dark:border-stone-800 pb-2">
                  Top Priorities This Week
                </h4>
                <div className="space-y-4 pt-4">
                  {initialTasks
                    .filter((t) => t.priority === "high")
                    .slice(0, 3)
                    .map((task, idx) => (
                      <div key={task.id} className="flex gap-3 items-center justify-between group">
                        <div className="flex gap-3 items-center">
                          <span className="font-bold text-stone-400">{idx + 1}.</span>
                          <span className="text-xs font-semibold">{task.title}</span>
                        </div>
                        <button onClick={async () => await deleteTask(task.id)} className="text-stone-400 hover:text-red-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer">
                          <Trash className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  {initialTasks.filter((t) => t.priority === "high").length === 0 && (
                    <p className="text-xs text-stone-400">No high priority items scheduled.</p>
                  )}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddTask(weeklyPriorityInput, "high", selectedDateStr, () => setWeeklyPriorityInput(""));
                  }}
                  className="flex gap-2 mt-4 pt-4 border-t border-stone-200 dark:border-stone-800"
                >
                  <Input
                    placeholder="New high priority..."
                    value={weeklyPriorityInput}
                    onChange={(e) => setWeeklyPriorityInput(e.target.value)}
                    className="h-8 text-xs bg-stone-50 dark:bg-stone-950 px-2 shadow-none border-none focus-visible:ring-1 focus-visible:ring-stone-300 dark:focus-visible:ring-stone-800"
                  />
                  <Button type="submit" size="icon" className="h-8 w-8">
                    <Plus className="w-3 h-3" />
                  </Button>
                </form>
              </div>

              <div>
                <h4 className="font-bold text-stone-700 dark:text-stone-300 border-b border-stone-200 dark:border-stone-800 pb-2">
                  General Checklist
                </h4>
                <div className="space-y-3 pt-4">
                  {initialTasks.filter((t) => !t.title.startsWith("[")).map((task) => (
                    <div key={task.id} className="flex items-center justify-between gap-2 group">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={async (checked) => {
                            await toggleTask(task.id, !!checked);
                          }}
                        />
                        <span className={`text-xs ${task.completed ? "line-through text-stone-400" : ""}`}>
                          {task.title}
                        </span>
                      </div>
                      <button onClick={async () => await deleteTask(task.id)} className="text-stone-400 hover:text-red-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer">
                        <Trash className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ==================== DAILY VIEW ==================== */}
      {activeTab === "daily" && (
        <div className="space-y-6">
          {/* Progress Gamification Panel */}
          <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 p-6 shadow-none">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-stone-700 dark:text-stone-300">Daily Focus Goal Progress</span>
              <span className="text-xs font-semibold text-orange-500">{dailyFocusPercentage}% Focus Score</span>
            </div>
            <Progress value={dailyFocusPercentage} className="h-2 bg-stone-100 dark:bg-stone-800" />
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Panel: Hourly Schedule */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-stone-700 dark:text-stone-300">
                  {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleNavigate("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleNavigate("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleClearDay} className="hover:text-red-500" title="Clear entire day">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Dynamic Hourly Time Blocks (Completely Interactive) */}
              <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-none">
                <CardContent className="p-6 divide-y divide-stone-100 dark:divide-stone-800">
                  {HOURS_LIST.map((hour) => {
                    const prefix = `[${hour}]`;
                    const matchingTask = dailyTasks.find((t) => t.title.startsWith(prefix));

                    return (
                      <div key={hour} className="flex items-center py-4 gap-4 justify-between group">
                        <div className="flex items-center gap-4 flex-1">
                          <span className="text-sm font-semibold text-stone-400 min-w-14">
                            {hour}
                          </span>

                          {matchingTask ? (
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={matchingTask.completed}
                                onCheckedChange={async (checked) => {
                                  await toggleTask(matchingTask.id, !!checked);
                                }}
                              />
                              <span className={`text-sm font-medium ${matchingTask.completed ? "line-through text-stone-400" : "text-stone-800 dark:text-stone-100"}`}>
                                {matchingTask.title.replace(prefix, "").trim()}
                              </span>
                            </div>
                          ) : (
                            /* Hourly input block */
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                const textVal = hourlyInputs[hour];
                                if (!textVal || !textVal.trim()) return;
                                handleAddTask(
                                  `[${hour}] ${textVal}`,
                                  "medium",
                                  selectedDateStr,
                                  () => setHourlyInputs((prev) => ({ ...prev, [hour]: "" }))
                                );
                              }}
                              className="flex-1 max-w-full flex gap-2"
                            >
                              <Input
                                placeholder="Schedule task..."
                                value={hourlyInputs[hour] || ""}
                                onChange={(e) => setHourlyInputs((prev) => ({ ...prev, [hour]: e.target.value }))}
                                className="h-7 text-xs bg-stone-50 dark:bg-stone-950 px-2 py-0 border-none shadow-none focus-visible:ring-1 focus-visible:ring-stone-300 dark:focus-visible:ring-stone-800"
                              />
                              <Button type="submit" size="icon" className="h-7 w-7">
                                <Plus className="w-3 h-3" />
                              </Button>
                            </form>
                          )}
                        </div>

                        {matchingTask && (
                          <button onClick={async () => await deleteTask(matchingTask.id)} className="text-stone-400 hover:text-red-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer">
                            <Trash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Right Panel: Must Do Today & Other Tasks */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 p-6 shadow-none">
                <h4 className="font-bold text-sm mb-4 border-b border-stone-100 dark:border-stone-800 pb-2">
                  Must Do Today
                </h4>
                <div className="space-y-3 min-h-[80px]">
                  {dailyTasks
                    .filter((t) => t.priority === "high")
                    .map((task) => (
                      <div key={task.id} className="flex items-center justify-between gap-2 group">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={async (checked) => {
                              await toggleTask(task.id, !!checked);
                            }}
                          />
                          <span className={`text-xs font-semibold ${task.completed ? "line-through text-stone-400" : ""}`}>
                            {task.title.startsWith("[") ? task.title.split("]")[1].trim() : task.title}
                          </span>
                        </div>
                        <button onClick={async () => await deleteTask(task.id)} className="text-stone-400 hover:text-red-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer">
                          <Trash className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  {dailyTasks.filter((t) => t.priority === "high").length === 0 && (
                    <p className="text-xs text-stone-400 py-2">No items scheduled for today.</p>
                  )}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddTask(dailyMustDoInput, "high", selectedDateStr, () => setDailyMustDoInput(""));
                  }}
                  className="flex gap-2 mt-4 pt-4 border-t border-stone-100 dark:border-stone-800"
                >
                  <Input
                    placeholder="Add high priority task..."
                    value={dailyMustDoInput}
                    onChange={(e) => setDailyMustDoInput(e.target.value)}
                    className="h-8 text-xs bg-stone-50 dark:bg-stone-950 px-2 shadow-none border-none focus-visible:ring-1 focus-visible:ring-stone-300 dark:focus-visible:ring-stone-800"
                  />
                  <Button type="submit" size="icon" className="h-8 w-8">
                    <Plus className="w-3 h-3" />
                  </Button>
                </form>
              </Card>

              <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 p-6 shadow-none">
                <h4 className="font-bold text-sm mb-4 border-b border-stone-100 dark:border-stone-800 pb-2">
                  Other Tasks
                </h4>
                <div className="space-y-3 min-h-[80px]">
                  {dailyTasks
                    .filter((t) => t.priority !== "high")
                    .map((task) => (
                      <div key={task.id} className="flex items-center justify-between gap-2 group">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={async (checked) => {
                              await toggleTask(task.id, !!checked);
                            }}
                          />
                          <span className={`text-xs ${task.completed ? "line-through text-stone-400" : ""}`}>
                            {task.title.startsWith("[") ? task.title.split("]")[1].trim() : task.title}
                          </span>
                        </div>
                        <button onClick={async () => await deleteTask(task.id)} className="text-stone-400 hover:text-red-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer">
                          <Trash className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  {dailyTasks.filter((t) => t.priority !== "high").length === 0 && (
                    <p className="text-xs text-stone-400 py-2">No other tasks scheduled.</p>
                  )}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddTask(dailyOtherInput, "medium", selectedDateStr, () => setDailyOtherInput(""));
                  }}
                  className="flex gap-2 mt-4 pt-4 border-t border-stone-100 dark:border-stone-800"
                >
                  <Input
                    placeholder="Add standard task..."
                    value={dailyOtherInput}
                    onChange={(e) => setDailyOtherInput(e.target.value)}
                    className="h-8 text-xs bg-stone-50 dark:bg-stone-950 px-2 shadow-none border-none focus-visible:ring-1 focus-visible:ring-stone-300 dark:focus-visible:ring-stone-800"
                  />
                  <Button type="submit" size="icon" className="h-8 w-8">
                    <Plus className="w-3 h-3" />
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}