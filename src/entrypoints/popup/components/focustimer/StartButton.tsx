// import { Pause, Play } from "lucide-react";
// import React from "react";

// interface StartButtonProps {
//   isRunning: boolean;
//   onToggle: () => void;
// }

// const StartButton: React.FC<StartButtonProps> = ({ isRunning, onToggle }) => {
//   return (
//     <button
//       onClick={onToggle}
//       className="bg-white w-full h-full flex items-center justify-between px-4 pt-1 rounded-md transition-transform "
//     >
//       {/* Left: Text (Fixed Width to Avoid Layout Shift) */}
//       <span className="text-lg font-semibold bg-gradient-to-r from-[#FC589A] via-[#6C5CE7] to-[#48A7F4] bg-clip-text text-transparent w-[55px] text-left">
//         {isRunning ? "Pause" : "Play"}
//       </span>

//       {/* Right: Icon */}
//       {isRunning ? (
//         <Pause size={22} className="stroke-[#FC589A]" />
//       ) : (
//         <Play size={22} className="stroke-[#FC589A]" />
//       )}
//     </button>
//   );
// };

// export default StartButton;
import { Pause, Play } from "lucide-react";
import React from "react";

interface StartButtonProps {
  isRunning: boolean;
  hasStarted: boolean;
  onToggle: () => void;
}

const StartButton: React.FC<StartButtonProps> = ({
  isRunning,
  hasStarted,
  onToggle,
}) => {
  const label = isRunning ? "Pause" : hasStarted ? "Resume" : "Play";

  return (
    <button
      onClick={onToggle}
      className="bg-white w-full h-full flex items-center justify-between px-4 pt-1 rounded-md transition-transform "
    >
      <span className="text-lg font-semibold bg-gradient-to-r from-[#FC589A] via-[#6C5CE7] to-[#48A7F4] bg-clip-text text-transparent w-[75px] text-left">
        {label}
      </span>

      {isRunning ? (
        <Pause size={22} className="stroke-[#FC589A]" />
      ) : hasStarted ? (
        <Play size={22} className="stroke-[#FC589A]" /> // could use a "resume" icon if available
      ) : (
        <Play size={22} className="stroke-[#FC589A]" />
      )}
      
    </button>
  );
};

export default StartButton;
