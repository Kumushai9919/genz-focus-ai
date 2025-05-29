import { useState, useEffect } from "react";
import "../style.css";
import Header from "./components/Header";
import TabBar from "./components/TabBar";
import QuoteSection from "./components/focustimer/QuoteSection";
import DurationDisplay from "./components/focustimer/DurationDisplay";
import TimerCountdown from "./components/focustimer/TimerCountdown";
import ModeSelector from "./components/focustimer/ModeSelector";

import StartButton from "./components/focustimer/StartButton";
import ScoreBar from "./components/focustimer/ScoreBar";
import useSound from "use-sound"; // ✅ react sound hook
import FocusTasks from "./components/focustasks/FocusTasks";

function App() {
  const [activeTab, setActiveTab] = useState<"timer" | "tasks">("timer");
  const [workDuration, setWorkDuration] = useState(25 * 60);
  const [breakDuration, setBreakDuration] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkPhase, setIsWorkPhase] = useState(true);
  const [timeLeft, setTimeLeft] = useState(workDuration);

  const [play] = useSound(
    "https://notificationsounds.com/storage/sounds/file-sounds-1151-plucky.mp3"
  );

  const handleDurationUpdate = (workMins: number, breakMins: number) => {
    const newWork = workMins * 60;
    const newBreak = breakMins * 60;
    setWorkDuration(newWork);
    setBreakDuration(newBreak);
    setTimeLeft(newWork);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (isRunning && timeLeft === 0) {
      play();
      const nextPhase = isWorkPhase ? breakDuration : workDuration;
      setTimeLeft(nextPhase);
      setIsWorkPhase((prev) => !prev);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, workDuration, breakDuration, isWorkPhase, play]);

  const totalDuration = isWorkPhase ? workDuration : breakDuration;
  const percentage = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className="w-full h-full max-w-[480px] max-h-[700px] mx-auto bg-white font-sans rounded-lg overflow-hidden">
      <Header />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "timer" && (
        <div className="bg-gradient-to-b from-[#A53860] to-[#D76C82] px-4 py-6 text-center">
          <QuoteSection />
         
          <ModeSelector
            isWorkPhase={isWorkPhase}
            setIsWorkPhase={setIsWorkPhase}
            setTimeLeft={setTimeLeft}
            workDuration={workDuration}
            breakDuration={breakDuration}
          />
           <DurationDisplay
            workMinutes={Math.floor(workDuration / 60)}
            breakMinutes={Math.floor(breakDuration / 60)}
            isRunning={isRunning}
            onUpdate={handleDurationUpdate}
          />

          <TimerCountdown timeLeft={timeLeft} />
          <div className="py-4">
            <StartButton
              isRunning={isRunning}
              onToggle={() => setIsRunning((prev) => !prev)}
            />
          </div>
          <ScoreBar percentage={percentage} />
        </div>
      )}

      {activeTab === "tasks" && (
        <div className="p-4 text-center text-gray-400 text-sm">
          Focus Tasks page coming soon

          <FocusTasks />
        </div>
      )}

    </div>
  );
}

export default App;

// import { useState } from "react";
// import "../style.css";
// import Header from "./components/Header";
// import TabBar from "./components/TabBar";
// import QuoteSection from "./components/QuoteSection";
// import DurationDisplay from "./components/DurationDisplay";
// import TimerCountdown from "./components/TimerCountdown";
// import StartButton from "./components/StartButton";
// import ScoreBar from "./components/ScoreBar";

// function App() {
//   const [activeTab, setActiveTab] = useState<"timer" | "tasks">("timer"); // Default to 'timer' tab

//   const [workDuration, setWorkDuration] = useState(25 * 60); // in seconds
//   const [breakDuration, setBreakDuration] = useState(5 * 60);
//   const [isRunning, setIsRunning] = useState(false); // State to manage timer running status
//   const [timeLeft, setTimeLeft] = useState(workDuration); // State to manage time left in the timer

//   const handleDurationUpdate = (workMins: number, breakMins: number) => {
//     const newWork = workMins * 60;
//     const newBreak = breakMins * 60;
//     setWorkDuration(newWork);
//     setBreakDuration(newBreak);
//     setTimeLeft(newWork); // Reset time left to new work duration
//   };

//   const duration = 25 * 60;

//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (isRunning && timeLeft > 0) {
//       interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
//     }
//     return () => clearInterval(interval);
//   }, [isRunning, timeLeft]);

//   const percentage = ((duration - timeLeft) / duration) * 100;

//   return (
//     <div className="  w-full h-full max-w-[480px] max-h-[700px] mx-auto bg-white font-sans rounded-lg overflow-hidden">
//       <Header />
//       <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

//       {activeTab === "timer" && (
//         <div className="bg-gradient-to-b from-[#A53860] to-[#D76C82] px-4 py-6 text-center">
//           <QuoteSection />
//           <DurationDisplay
//             workMinutes={Math.floor(workDuration / 60)}
//             breakMinutes={Math.floor(breakDuration / 60)}
//             isRunning={isRunning}
//             onUpdate={handleDurationUpdate}
//           />

//           <TimerCountdown timeLeft={timeLeft} />
//           <div className="py-4">
//             <StartButton
//               isRunning={isRunning}
//               onToggle={() => setIsRunning((prev) => !prev)}
//             />
//           </div>
//           <ScoreBar percentage={percentage} />
//         </div>
//       )}

//       {activeTab === "tasks" && (
//         <div className="p-4 text-center text-gray-400 text-sm">
//           Focus Tasks page coming soon
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
