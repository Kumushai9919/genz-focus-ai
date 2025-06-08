import React from "react";

interface ScoreBarProps {
  percentage: number;
  isWorkPhase: boolean;
}

const ScoreBar: React.FC<ScoreBarProps> = ({ percentage, isWorkPhase }) => {
  return (
    <div className="w-full text-sm text-gray-700">
      <div className="flex justify-between items-center mb-1 px-1">
        <span className="font-medium">
          {isWorkPhase ? "Focus Time" : "Break Time"}
        </span>
        <span className="text-xs">{Math.round(percentage)}%</span>
      </div>

      <div className="w-full h-2.5 bg-[#f1e9ed] rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-300 rounded-full"
          style={{
            width: `${percentage}%`,
            background: isWorkPhase
              ? "linear-gradient(to right, #FC589A90, #E355A790, #6C5CE790, #8A2BE290)"
              : "linear-gradient(to right, #FF9ECD90, #D37EEE90, #B8A5FF90)",
          }}
        />
      </div>
    </div>
  );
};

export default ScoreBar;
