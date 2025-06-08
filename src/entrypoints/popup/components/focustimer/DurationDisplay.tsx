import React, { useState } from "react";

interface Props {
  workMinutes: number;
  breakMinutes: number;
  onUpdate: (work: number, breakTime: number) => void;
  isRunning: boolean;
  setIsRunning: (value: boolean) => void;
  isWorkPhase: boolean;
  setIsWorkPhase: (mode: boolean) => void;
  setTimeLeft: (seconds: number) => void;
  workDuration: number;
  breakDuration: number;
}

const DurationDisplay: React.FC<Props> = ({
  workMinutes,
  breakMinutes,
  onUpdate,
  isRunning,
  setIsRunning,
  isWorkPhase,
  setIsWorkPhase,
  setTimeLeft,
  workDuration,
  breakDuration,
}) => {
  const [editing, setEditing] = useState<"work" | "break" | null>(null);
  const [tempWorkText, setTempWorkText] = useState(
    String(workMinutes).padStart(2, "0") + ":00"
  );
  const [tempBreakText, setTempBreakText] = useState(
    String(breakMinutes).padStart(2, "0") + ":00"
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="text-lg  text-[#423f41] mb-10 ">
      {/*   Tabs for Focus / Break Toggle */}
      <div className="flex justify-center gap-8 mb-1.5">
        <button
          onClick={() => {
            if (isRunning) {
              setIsRunning(false);
            }
            setIsWorkPhase(true);
            setTimeLeft(workDuration);
          }}
          className={`pb-1 border-b-2 transition-all ${
            isWorkPhase
              ? "border-[#d76c82] text-[#d76c82] font-bold drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]"
              : "border-transparent text-white"
          }`}
        >
          Focus
        </button>
        <button
          onClick={() => {
            if (isRunning) {
              setIsRunning(false);
            }
            setIsWorkPhase(false);
            setTimeLeft(breakDuration);
          }}
          className={`pb-1 border-b-2 transition-all ${
            !isWorkPhase
              ? "border-[#d76c82] text-[#d76c82] font-bold drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]"
              : "border-transparent text-white"
          }`}
        >
          Break
        </button>
      </div>

      {/*   Editable Inputs */}
      <div className="flex justify-center items-center gap-8 text-sm">
        {/* Focus Time Input */}
        <div className="flex flex-col items-center gap-1">
          <label className="text-xs font-medium text-gray-800"> </label>
          <input
            type="text"
            inputMode="numeric"
            value={
              editing === "work"
                ? tempWorkText
                : String(workMinutes).padStart(2, "0") + ":00"
            }
            onChange={(e) => setTempWorkText(e.target.value)}
            onFocus={() => !isRunning && setEditing("work")}
            onBlur={() => {
              setEditing(null);
              const workVal = parseInt(tempWorkText.split(":")[0]);
              if (!isNaN(workVal)) onUpdate(workVal, breakMinutes);
            }}
            onKeyDown={handleKeyDown}
            className="text-center text-sm font-bold text-white rounded-md px-2 py-1 w-[64px] border border-white bg-transparent focus:outline-none"
            readOnly={editing !== "work" || isRunning}
          />
        </div>

        {/* Break Time Input */}
        <div className="flex flex-col items-center gap-1">
          <label className="text-xs font-medium text-gray-800"> </label>
          <input
            type="text"
            inputMode="numeric"
            value={
              editing === "break"
                ? tempBreakText
                : String(breakMinutes).padStart(2, "0") + ":00"
            }
            onChange={(e) => setTempBreakText(e.target.value)}
            onFocus={() => !isRunning && setEditing("break")}
            onBlur={() => {
              setEditing(null);
              const breakVal = parseInt(tempBreakText.split(":")[0]);
              if (!isNaN(breakVal)) onUpdate(workMinutes, breakVal);
            }}
            onKeyDown={handleKeyDown}
            className="text-center text-sm font-bold text-white rounded-md px-2 py-1 w-[64px] border border-white bg-transparent focus:outline-none"
            readOnly={editing !== "break" || isRunning}
          />
        </div>
      </div>
    </div>
  );
};

export default DurationDisplay;
