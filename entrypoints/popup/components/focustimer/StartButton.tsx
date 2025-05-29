import { Pause, Play } from 'lucide-react';
import React from 'react';

interface StartButtonProps {
  isRunning: boolean;
  onToggle: () => void;
}

const StartButton: React.FC<StartButtonProps> = ({ isRunning, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="bg-white text-pink-600 rounded-full shadow-lg w-16 h-16 flex items-center justify-center transition-transform hover:scale-105"
    >
      {isRunning ? <Pause size={28} /> : <Play size={28} />}
    </button>
  );
};

export default StartButton;
