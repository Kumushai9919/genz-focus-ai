import {
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import React, { useEffect, useState } from "react";

import { generateInsight } from "../../../utils/geminiProxy";

const FocusAI = () => {
  const logs = JSON.parse(localStorage.getItem("focus_logs") || "[]");
  const [insight, setInsight] = useState("Loading your AI insight...");

  // groups logs by date
  type GroupedLogs = {
    [date: string]: { focus: number; break: number; tasks: number };
  };

  const grouped = logs.reduce((acc: GroupedLogs, log: any) => {
    const { date, focusDuration, breakDuration, taskCompleted } = log;
    if (!acc[date]) {
      acc[date] = { focus: 0, break: 0, tasks: 0 };
    }

    acc[date].focus += focusDuration;
    acc[date].break += breakDuration;
    if (taskCompleted) acc[date].tasks += 1;
    return acc;
  }, {} as GroupedLogs);

  // 📅 Get last 7 days from today
  const getLast7Days = (): string[] => {
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10)); // "YYYY-MM-DD"
    }
    return days;
  };

  const last7Days = getLast7Days();

  const dailyStats = last7Days.map((date) => {
    const stats = grouped[date] || { focus: 0, break: 0, tasks: 0 };
    return {
      date,
      focus: stats.focus, // 🔁 seconds → minutes
      break: stats.break,
      tasks: stats.tasks,
    };
  });

  const totalFocus = logs.reduce(
    (sum: number, log: any) => sum + (log.focusDuration || 0),
    0
  );
  const totalBreak = logs.reduce(
    (sum: number, log: any) => sum + (log.breakDuration || 0),
    0
  );
  const totalTasks = logs.filter((log: any) => log.taskCompleted).length;

  const generatePrompt = ({
    totalFocus,
    totalBreak,
    totalTasks,
  }: {
    totalFocus: number;
    totalBreak: number;
    totalTasks: number;
  }) => {
    return `
  You are a friendly productivity AI assistant for Gen Z.

  Based on these stats:
  - Total focus time: ${Math.floor(totalFocus / 60)} minutes
  - Total break time: ${Math.floor(totalBreak / 60)} minutes
  - Tasks completed: ${totalTasks}

  Write a short 3-sentence encouragement message, with a mix of productivity insight and mental wellness support. Be casual, Gen Z-friendly, and kind.
  `;
  };

  useEffect(() => {
    const cacheKey = `gemini_cache_${totalFocus}_${totalBreak}_${totalTasks}`;
    const today = new Date().toISOString().slice(0, 10);
    const limitKey = `gemini_requests_${today}`;

    const cached = localStorage.getItem(cacheKey);
    const count = Number(localStorage.getItem(limitKey) || 0);

    if (cached) {
      setInsight(cached);
      return;
    }

    if (count >= 5) {
      setInsight("⚠️ You reached today's free AI limit. Try again tomorrow!");
      return;
    }

    const fetchInsight = async () => {
      const prompt = generatePrompt({ totalFocus, totalBreak, totalTasks });
      const msg = await generateInsight(prompt);
      setInsight(msg);

      localStorage.setItem(cacheKey, msg);
      localStorage.setItem(limitKey, String(count + 1));
    };

    fetchInsight();
  }, [totalFocus, totalBreak, totalTasks]);

  // Helper to format seconds into h/m/s
  const formatTimeUnit = (value: number) => {
    if (value >= 3600)
      return `${Math.floor(value / 3600)}h ${Math.floor((value % 3600) / 60)}m`;
    if (value >= 60) return `${Math.floor(value / 60)}m ${value % 60}s`;
    return `${value}s`;
  };

  return (
    <div className="text-gray-800">
      {/* Section 1: Title */}
      <h2
        className="
            text-xl
            font-bold
            mt-1
            text-center  
            bg-gradient-to-r
            from-[#FC589A]
            via-[#6C5CE7]
            to-[#48A7F4]
            bg-clip-text
            text-transparent
          "
      >
        Your Productivity Stats Today!
      </h2>

      {/*   Section 4: Gemini Feedback Placeholder */}
      <div className="bg-white rounded-xl px-5 pb-2 pt-4">
        <h3 className="text-lg mb-2">
          🧠{" "}
          <span
            className="
              text-lg 
              mb-2 
              font-semibold
              bg-gradient-to-r
              from-[#FC589A]
              via-[#6C5CE7]
              to-[#48A7F4]
              bg-clip-text
              text-transparent
            "
          >
            Gemini AI{" "}
          </span>{" "}
          Insight
        </h3>
        <p className="text-sm text-gray-700 whitespace-pre-line px-1">
          {insight}
        </p>
      </div>

      {/*   Section 3: Summary Stats */}
      <div className="grid grid-cols-3 gap-2 text-center px-4 py-3">
        <div className="bg-white rounded-lg p-1 shadow text-sm">
          <p className="font-semibold">Focus Time</p>
          <p className="text-pink-500">{Math.floor(totalFocus / 60)} min</p>
        </div>
        <div className="bg-white rounded-lg py-1 shadow text-sm">
          <p className="font-semibold">Break Time</p>
          <p className="text-blue-500"> {Math.floor(totalBreak / 60)} min</p>
        </div>
        <div className="bg-white rounded-lg py-1 shadow text-sm">
          <p className="font-semibold">Tasks Done</p>
          <p className="text-green-500">{totalTasks}</p>
        </div>
      </div>

      {/* Section 2: Weekly Chart */}
      <div className="overflow-x-auto px-4 py-3">
        <div className="w-full ml-[-25px] ">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyStats}>
              <XAxis
                dataKey="date"
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString("en-US", {
                    weekday: "short",
                  })
                }
              />
              <YAxis
                tickFormatter={(value) => {
                  if (value >= 3600) return `${Math.floor(value / 3600)}h`;
                  if (value >= 60) return `${Math.floor(value / 60)}m`;
                  return `${value}s`;
                }}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatTimeUnit(value),
                  name === "focus" ? "focus 🎯" : "break 😌",
                ]}
              />
              <Legend
                formatter={(value) => (
                  <span>{value === "focus" ? "Focus Time" : "Break Time"}</span>
                )}
              />
              <Bar dataKey="focus" fill="#EC7FA9" />
              <Bar dataKey="break" fill="#9DBDFF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FocusAI;
