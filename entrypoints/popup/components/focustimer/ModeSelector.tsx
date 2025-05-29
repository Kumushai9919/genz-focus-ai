import React from 'react';

interface ModeSelectorProps {
  isWorkPhase: boolean;
  setIsWorkPhase: (mode: boolean) => void;
  setTimeLeft: (seconds: number) => void;
  workDuration: number;
  breakDuration: number;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({
  isWorkPhase,
  setIsWorkPhase,
  setTimeLeft,
  workDuration,
  breakDuration,
}) => {
  return (
    <div className="flex justify-center gap-4 mb-4">
      <button
        className={`px-4 py-1 rounded-full font-medium ${
          isWorkPhase
            ? 'bg-white text-[#D76C82]'
            : 'text-white border border-white'
        }`}
        onClick={() => {
          setIsWorkPhase(true);
          setTimeLeft(workDuration);
        }}
      >
        Focus
      </button>
      <button
        className={`px-4 py-1 rounded-full font-medium ${
          !isWorkPhase
            ? 'bg-white text-[#D76C82]'
            : 'text-white border border-white'
        }`}
        onClick={() => {
          setIsWorkPhase(false);
          setTimeLeft(breakDuration);
        }}
      >
        Break
      </button>
    </div>
  );
};

export default ModeSelector;
