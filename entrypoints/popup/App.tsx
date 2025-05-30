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
import { RefreshCw } from "lucide-react";

// const gradients = [
//   "radial-gradient(circle, rgba(255,200,245,1) 0%, rgba(185,210,255,1) 100%)",
//   "radial-gradient(circle, rgba(255,210,210,1) 0%, rgba(220,220,250,1) 100%)",
//   "radial-gradient(circle, rgba(245,220,255,1) 0%, rgba(210,235,255,1) 100%)",
//   "radial-gradient(circle, rgba(250,220,255,1) 0%, rgba(240,240,255,1) 100%)",
//   "radial-gradient(circle, rgba(255,235,230,1) 0%, rgba(230,240,255,1) 100%)",
// ];

const gradients = [
  // Your soft pink/purple
  "radial-gradient(circle, rgba(255,200,245,1) 0%, rgba(185,210,255,1) 100%)",
  "radial-gradient(circle, rgba(255,210,210,1) 0%, rgba(220,220,250,1) 100%)",
  "radial-gradient(circle, rgba(245,220,255,1) 0%, rgba(210,235,255,1) 100%)",
  "radial-gradient(circle, rgba(250,220,255,1) 0%, rgba(240,240,255,1) 100%)",
  "radial-gradient(circle, rgba(255,235,230,1) 0%, rgba(230,240,255,1) 100%)",

  // 💡 From the colors you shared:
  "radial-gradient(circle farthest-corner at 10% 20%, rgba(227,106,148,1) 0%, rgba(245,255,170,1) 100.3%)",
  "radial-gradient(circle farthest-corner at 50.2% 50.7%, rgba(241,168,179,1) 0%, rgba(254,246,233,1) 90%)",
  "radial-gradient(circle at 51% 51.5%, rgba(242,250,124,1) 3.4%, rgba(252,128,132,0.96) 26.5%, rgba(243,121,180,1) 47.2%, rgba(240,193,248,1) 61.7%)",
  "linear-gradient(111.6deg, rgba(114,167,232,1) 9.4%, rgba(253,129,82,1) 43.9%, rgba(253,129,82,1) 54.8%, rgba(249,202,86,1) 86.3%)",
];

function App() {
  const [activeTab, setActiveTab] = useState<"timer" | "tasks" | "ai">("timer");

  const [workDuration, setWorkDuration] = useState(25 * 60);
  const [breakDuration, setBreakDuration] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkPhase, setIsWorkPhase] = useState(true);
  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [background, setBackground] = useState("");

  useEffect(() => {
    setBackground(gradients[Math.floor(Math.random() * gradients.length)]);
  }, []);

  const changeGradient = () => {
    setBackground(gradients[Math.floor(Math.random() * gradients.length)]);
  };

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
    <div className="w-full h-full max-w-[480px] min-h-[700px] mx-auto bg-white font-sans rounded-lg overflow-hidden">
      <Header />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "timer" && (
        <div className="p-4 py-2 text-center">
          <div className="bg-gradient-to-b from-[#A53860] to-[#D76C82] px-4 py-6 text-center rounded-xl">
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
        </div>
      )}

      {activeTab === "tasks" && (
        <div className="p-4 py-2 text-center ">
          <div className="relative rounded-xl overflow-hidden shadow-lg">
            {/* 🎨 Background + grain */}
            <div
              className="absolute inset-0  "
              style={{
                backgroundImage: background,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="grainy-overlay absolute inset-0 pointer-events-none" />

            {/* 🔘 Refresh button and FocusTasks content */}
            <div className="relative z-10 p-2 px-6">
              <div className="flex justify-end ">
                <button
                  onClick={() =>
                    setBackground(
                      gradients[Math.floor(Math.random() * gradients.length)]
                    )
                  }
                  className="rounded-full p-1 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 shadow-lg"
                  title="Change background"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
              <FocusTasks />
            </div>
          </div>
        </div>
      )}

      {activeTab === "ai" && (
        <div className="text-center text-gray-400 text-sm p-4">
          🧠 Focus AI Analyzer coming soon!
        </div>
      )}
    </div>
  );
}

export default App;
