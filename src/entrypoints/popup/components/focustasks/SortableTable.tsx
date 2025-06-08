import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CheckSquare, Square, Trash2, Play, Pause, GripVertical } from "lucide-react";
import React from "react";

export interface Task {
  id: string;
  title: string;
  duration: number;
  isDone: boolean;
}

interface SortableTaskProps {
  task: Task;
  isSelected: boolean;
  isRunning: boolean;
  onPause: () => void;
  onResume: () => void;
  onStart: () => void;
  onDelete: () => void;
  onToggleDone: () => void;
}

export function SortableTask({
  task,
  isSelected,
  isRunning,
  onPause,
  onResume,
  onStart,
  onDelete,
  onToggleDone,
}: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex justify-between items-center px-2 py-2 rounded-lg shadow-sm group ${
        task.isDone
          ? "bg-green-100 text-green-700 line-through"
          : "bg-white"
      }`}
    >
      {/* 👇 Drag handle (just the icon) */}
      <div ref={setActivatorNodeRef} {...listeners} {...attributes} className="cursor-grab pr-1">
        <GripVertical size={16} />
      </div>

      {/* Task Info */}
      <div className="flex items-center gap-2 flex-grow">
        <button
          className="text-[#EC7FA9] hover:text-[#C75B7A]"
          onClick={() => {
            if (isSelected) {
              isRunning ? onPause() : onResume();
            } else {
              onStart();
            }
          }}
        >
          {isSelected && isRunning ? (
            <Pause size={18} className="text-[#EC7FA9]" />
          ) : (
            <Play size={18} />
          )}
        </button>
        <span className="text-sm">{task.title}</span>
      </div>

      {/* Right Actions */}
      <div className="flex gap-2 items-center">
        <button onClick={onToggleDone}>
          {task.isDone ? (
            <CheckSquare size={18} className="text-[#65C18C]" />
          ) : (
            <Square size={18} className="text-[#B8B0B0]" />
          )}
        </button>
        <button
          onClick={onDelete}
          className="relative w-6 h-5 flex items-center justify-end"
        >
          <span className="text-xs group-hover:hidden transition-transform duration-300">
            {Math.floor(task.duration / 60)}m
          </span>
          <Trash2
            size={18}
            className="absolute text-[#F98E90] hidden group-hover:block transition-transform duration-300"
          />
        </button>
      </div>
    </div>
  );
}
