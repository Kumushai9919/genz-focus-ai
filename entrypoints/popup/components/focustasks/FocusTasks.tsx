import { CheckSquare, Play, Plus, Square, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import useSound from "use-sound";

type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
  createdAt: number;
  duration: number;
};

const FocusTasks = () => {
  // ✅ State setup
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskDuration, setNewTaskDuration] = useState(15); // minutes
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  // ✅ Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("focus_tasks");
    if (saved) setTasks(JSON.parse(saved));

    const activeId = localStorage.getItem("focus_active_task");
    const running = localStorage.getItem("focus_is_running") === "true";
    const left = localStorage.getItem("focus_time_left");
    const start = localStorage.getItem("focus_start_time");

    if (activeId && left && start) {
      const elapsed = Math.floor((Date.now() - parseInt(start)) / 1000);
      const remaining = parseInt(left) - elapsed;
      if (remaining > 0) {
        setSelectedTaskId(activeId);
        setTimeLeft(remaining);
        setIsRunning(running);
      }
    }
  }, []);

  // ✅ Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("focus_tasks", JSON.stringify(tasks));
  }, [tasks]);

  // ✅ Save countdown state
  useEffect(() => {
    localStorage.setItem("focus_time_left", timeLeft.toString());
    localStorage.setItem("focus_is_running", isRunning.toString());
    if (startTime)
      localStorage.setItem("focus_start_time", startTime.toString());
    if (selectedTaskId)
      localStorage.setItem("focus_active_task", selectedTaskId);
  }, [timeLeft, isRunning, startTime, selectedTaskId]);

  // ✅ Countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (isRunning && timeLeft <= 0) {
      setIsRunning(false);
      play();
      alert(
        "🎉 You nailed it! Task complete. Select & Focus is your Gen Z superpower 💪 Ready for the next one?"
      );
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const addTask = () => {
    if (tasks.length >= 3) {
      alert(
        "⚠️ As Gen Z, our superpower is to Select & Focus. Let's crush 3 priorities now — then tackle the next 3 💪✨"
      );
      return;
    }
    if (newTaskText.trim()) {
      const newTask: TaskType = {
        id: uuidv4(),
        title: newTaskText.trim(),
        isDone: false,
        createdAt: Date.now(),
        duration: newTaskDuration * 60,
      };
      setTasks((prev) => [newTask, ...prev]);
      setNewTaskText("");
    }
  };

  // ✅ Enter key adds task
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTask();
  };

  const toggleTaskDone = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isDone: !t.isDone } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const startTaskTimer = (id: string, duration: number) => {
    setSelectedTaskId(id);
    setTimeLeft(duration);
    setStartTime(Date.now());
    setIsRunning(true);
  };

  const stopTaskTimer = () => {
    setSelectedTaskId(null);
    setTimeLeft(0);
    setIsRunning(false);
  };

  const currentTask = tasks.find((t) => t.id === selectedTaskId);
  const percent = currentTask
    ? 100 - (timeLeft / currentTask.duration) * 100
    : 0;

  const [play] = useSound(
    "https://notificationsounds.com/storage/sounds/file-sounds-1151-plucky.mp3",
    { volume: 0.5 }
  );

  // UI Structure (JSX)
  return (
    <div className="text-gray-800 space-y-1">
      {/* 🧠 Header */}
      <h2 className="text-xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)] pb-1.5">
        To-Do List
      </h2>
      {/* 🆕 Input and Add */}
      <div className="flex items-center gap-2 mb-4">
        <input
          className="w-full rounded-lg px-4 py-2 text-sm bg-white border-none focus:outline-none"
          placeholder="New task..."
          value={newTaskText}
          onKeyDown={handleKeyDown}
          onChange={(e) => setNewTaskText(e.target.value)}
        />
        <button
          onClick={addTask}
          className="bg-[#EC7FA9] text-white rounded-lg px-2 py-2 hover:bg-[#D76C82] opacity-70"
        >
          <Plus size={20} />
        </button>
      </div>
      {/* Duration selector */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="range"
          min={5}
          max={60}
          value={newTaskDuration}
          onChange={(e) => setNewTaskDuration(Number(e.target.value))}
          className="w-full rounded-lg"
          style={{
            background: `linear-gradient(to right, #EC7FA9 ${newTaskDuration}%, white ${newTaskDuration}%)`,
          }}
        />
        <span className="text-sm font-semibold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)] flex-shrink-0">
          {newTaskDuration} min
        </span>
      </div>

      {/* ✅ Task List */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex justify-between items-center px-4 py-2 rounded-lg shadow-sm ${
              task.isDone
                ? "bg-green-100 text-green-700 line-through"
                : "bg-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <button
                className="text-[#EC7FA9] hover:text-[#C75B7A]"
                onClick={() => startTaskTimer(task.id, task.duration)}
              >
                <Play size={18} />
              </button>
              <span className="text-sm">{task.title}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleTaskDone(task.id)}>
                {task.isDone ? (
                  <CheckSquare size={18} className="text-[#65C18C]" />
                ) : (
                  <Square size={18} className="text-[#B8B0B0]" />
                )}
              </button>
              <button onClick={() => deleteTask(task.id)}>
                <Trash2 size={18} className="text-[#F98E90]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ⏱️ Active Task Timer */}
      {selectedTaskId && currentTask && (
        <div className="bg-white p-4 mt-4 rounded-xl shadow text-center space-y-3">
          <p className="text-sm mb-2 font-medium">{currentTask.title}</p>
          <h1 className="text-3xl font-bold mb-3">{formatTime(timeLeft)}</h1>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-blue-400"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex justify-center gap-4 mt-3">
            <button
              className="bg-[#EC7FA9] text-white px-4 py-2 rounded-lg"
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? "Pause" : "Resume"}
            </button>
            <button
              className="bg-[#9DBDFF] text-white px-4 py-2 rounded-lg"
              onClick={stopTaskTimer}
            >
              Stop
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusTasks;
