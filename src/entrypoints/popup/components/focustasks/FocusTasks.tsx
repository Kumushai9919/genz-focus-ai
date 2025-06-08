import { CheckSquare, Pause, Play, Plus, Square, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import useSound from "use-sound";
import { SortableTask, Task } from "./SortableTable";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
  createdAt: number;
  duration: number;
};

const FocusTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskDuration, setNewTaskDuration] = useState(15);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [breaks, setBreaks] = useState<number[]>([]);
  const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);
  const [play] = useSound("/sounds/ding-101492.mp3", { volume: 0.5 });

  useEffect(() => {
    const saved = localStorage.getItem("focus_tasks");
    if (saved) setTasks(JSON.parse(saved));

    const activeId = localStorage.getItem("task_active_task");
    const isRunningStr = localStorage.getItem("task_focus_is_running");
    const leftStr = localStorage.getItem("task_focus_time_left");
    const startStr = localStorage.getItem("task_focus_start_time");

    if (activeId && leftStr && isRunningStr !== null) {
      const wasRunning = isRunningStr === "true";
      const timeLeftStored = parseInt(leftStr);

      if (wasRunning && startStr) {
        const elapsed = Math.floor((Date.now() - parseInt(startStr)) / 1000);
        const remaining = timeLeftStored - elapsed;

        if (remaining > 0) {
          setSelectedTaskId(activeId);
          setTimeLeft(remaining);
          setStartTime(parseInt(startStr));
          setIsRunning(true);  
        }
      } else {
        //  Restore paused state (no elapsed time subtracted)
        setSelectedTaskId(activeId);
        setTimeLeft(timeLeftStored);
        setIsRunning(false);

        if (timeLeftStored > 0) {
          setPauseStartTime(Date.now());
        }
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("focus_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("task_focus_time_left", timeLeft.toString());
    localStorage.setItem("task_focus_is_running", isRunning.toString());
    if (startTime && isRunning)
      localStorage.setItem("task_focus_start_time", startTime.toString());
    if (selectedTaskId)
      localStorage.setItem("task_active_task", selectedTaskId);
  }, [timeLeft, isRunning, startTime, selectedTaskId]);

  const currentTask = tasks.find((t) => t.id === selectedTaskId);
  const percent = currentTask
    ? 100 - (timeLeft / currentTask.duration) * 100
    : 0;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && startTime && currentTask) {
      // ⚡ Immediate update to prevent lag on resume
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = currentTask.duration - elapsed;

      if (remaining <= 0) {
        setTimeLeft(0);
        setIsRunning(false);
        play();

        const totalBreakTime = breaks.reduce((a, b) => a + b, 0);
        const logs = JSON.parse(localStorage.getItem("focus_logs") || "[]");
        const sessionLog = {
          date: new Date().toISOString().slice(0, 10),
          focusDuration: currentTask.duration,
          breakDuration: totalBreakTime,
          taskCompleted: true,
        };
        localStorage.setItem(
          "focus_logs",
          JSON.stringify([...logs, sessionLog])
        );
        setPauseStartTime(null);
        setBreaks([]);
        return; //stop here, no need to start interval
      } else {
        setTimeLeft(remaining); // Instant update on resume
      }

      // Continue with interval ticking every 1s
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = currentTask.duration - elapsed;

        if (remaining <= 0) {
          setTimeLeft(0);
          setIsRunning(false);
          play();

          const totalBreakTime = breaks.reduce((a, b) => a + b, 0);
          const logs = JSON.parse(localStorage.getItem("focus_logs") || "[]");
          const sessionLog = {
            date: new Date().toISOString().slice(0, 10),
            focusDuration: currentTask.duration,
            breakDuration: totalBreakTime,
            taskCompleted: true,
          };
          localStorage.setItem(
            "focus_logs",
            JSON.stringify([...logs, sessionLog])
          );
          setPauseStartTime(null);
          setBreaks([]);
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime, currentTask]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const addTask = () => {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTask();
  };

  const toggleTaskDone = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, isDone: !t.isDone };
          if (!t.isDone && updated.isDone) {
            const logs = JSON.parse(localStorage.getItem("focus_logs") || "[]");
            const sessionLog = {
              date: new Date().toISOString().slice(0, 10),
              focusDuration: t.duration,
              breakDuration: 0,
              taskCompleted: true,
            };
            localStorage.setItem(
              "focus_logs",
              JSON.stringify([...logs, sessionLog])
            );
          }
          return updated;
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    if (selectedTaskId === id) stopTaskTimer();
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
    setPauseStartTime(null);
    setBreaks([]);
  };

  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <div className="text-gray-800 space-y-1">
      <h2 className="text-xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)] pb-1.5">
        To-Do List
      </h2>

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

      <div className="flex items-center gap-4 mb-4">
        <input
          type="range"
          min={1}
          max={60}
          value={newTaskDuration}
          onChange={(e) => setNewTaskDuration(Number(e.target.value))}
          className="w-full rounded-lg"
          style={{
            background: `linear-gradient(to right, #FC589A90, #E355A790, #6C5CE790, #8A2BE290 ${
              ((newTaskDuration - 1) / (60 - 1)) * 100
            }%, white ${((newTaskDuration - 1) / (60 - 1)) * 100}%)`,
            appearance: "none",
            cursor: "pointer",
          }}
        />
        <span className="text-sm font-semibold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)] flex-shrink-0">
          {newTaskDuration} min
        </span>
      </div>

      <div
        className={`space-y-2 ${
          tasks.length > 3 ? "overflow-y-auto pr-1" : ""
        }`}
        style={tasks.length > 3 ? { maxHeight: "130px" } : {}}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event) => {
            const { active, over } = event;
            if (active.id !== over?.id) {
              const oldIndex = tasks.findIndex((t) => t.id === active.id);
              const newIndex = tasks.findIndex((t) => t.id === over?.id);
              setTasks((tasks) => arrayMove(tasks, oldIndex, newIndex));
            }
          }}
        >
          <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <SortableTask
                key={task.id}
                task={task}
                isSelected={task.id === selectedTaskId}
                isRunning={isRunning}
                onPause={() => setIsRunning(false)}
                onResume={() => setIsRunning(true)}
                onStart={() => startTaskTimer(task.id, task.duration)}
                onDelete={() => deleteTask(task.id)}
                onToggleDone={() => toggleTaskDone(task.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {selectedTaskId && currentTask && (
        <div className="bg-white p-3 mt-3 rounded-xl shadow text-center space-y-2">
          <p className="text-sm mb-2 font-medium ">{currentTask.title}</p>
          <h1 className="text-2xl font-bold text-slate-600 mb-3">
            {formatTime(timeLeft)}
          </h1>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${percent}%`,
                background:
                  "linear-gradient(to right, #FC589A90, #E355A790, #6C5CE790, #8A2BE290)",
              }}
            />
          </div>

          <div className="flex justify-center gap-4 mt-3">
            <button
              className="bg-[#EC7FA9] text-white px-3 py-2 rounded-lg"
              onClick={() => {
                if (isRunning) {
                  setPauseStartTime(Date.now());
                } else {
                  if (pauseStartTime) {
                    const breakLength = Math.floor(
                      (Date.now() - pauseStartTime) / 1000
                    );
                    setBreaks((prev) => [...prev, breakLength]);
                    setPauseStartTime(null);
                  }
                  setStartTime(
                    Date.now() - (currentTask.duration - timeLeft) * 1000
                  );
                }
                setIsRunning(!isRunning);
              }}
            >
              {/* {isRunning ? "Pause" : "Resume"} */}
              {isRunning ? "Pause" : pauseStartTime ? "Resume" : "Start"}
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
