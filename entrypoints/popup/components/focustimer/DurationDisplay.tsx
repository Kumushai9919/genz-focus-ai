// Updated DurationDisplay.tsx
import React, { useState } from "react";

interface Props {
  workMinutes: number;
  breakMinutes: number;
  onUpdate: (work: number, breakTime: number) => void;
  isRunning: boolean;
}

const DurationDisplay: React.FC<Props> = ({
  workMinutes,
  breakMinutes,
  onUpdate,
  isRunning,
}) => {
  const [editing, setEditing] = useState<"work" | "break" | null>(null);
  const [tempWorkText, setTempWorkText] = useState(String(workMinutes).padStart(2, "0") + ":00");
  const [tempBreakText, setTempBreakText] = useState(String(breakMinutes).padStart(2, "0") + ":00");

  const handleBlur = () => {
    setEditing(null);
    const workVal = parseInt(tempWorkText.split(":")[0]);
    const breakVal = parseInt(tempBreakText.split(":")[0]);
    if (!isNaN(workVal) && !isNaN(breakVal)) {
      onUpdate(workVal, breakVal);
    }
  };

  return (
    <div className="flex justify-center items-center gap-10 text-white font-medium text-md">
      <div className="flex flex-col items-center">
        {/* <span className="text-sm opacity-70">WORK</span> */}
        {editing === "work" && !isRunning ? (
          <input
            type="text"
            inputMode="numeric"
            value={tempWorkText}
            onChange={(e) => setTempWorkText(e.target.value)}
            onBlur={handleBlur}
            className="text-center text-xl font-bold text-white rounded px-2 py-0.5 w-20 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        ) : (
          <span
            className="text-xl font-bold cursor-pointer"
            onClick={() => !isRunning && setEditing("work")}
          >
            {String(workMinutes).padStart(2, "0")}:00
          </span>
        )}
      </div>
      <div className="flex flex-col items-center">
        {/* <span className="text-sm opacity-70">BREAK</span> */}
        {editing === "break" && !isRunning ? (
          <input
            type="text"
            inputMode="numeric"
            value={tempBreakText}
            onChange={(e) => setTempBreakText(e.target.value)}
            onBlur={handleBlur}
            className="text-center text-xl font-bold text-white rounded px-2 py-0.5 w-20 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        ) : (
          <span
            className="text-xl font-bold cursor-pointer"
            onClick={() => !isRunning && setEditing("break")}
          >
            {String(breakMinutes).padStart(2, "0")}:00
          </span>
        )}
      </div>
    </div>
  );
};

export default DurationDisplay;
