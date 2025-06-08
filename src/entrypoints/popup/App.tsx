import { useState, useEffect } from "react";
import "./style.css";
import useSound from "use-sound";
import { RefreshCw } from "lucide-react";
import {
  Header,
  BlockSites,
  TabBar,
  FocusAI,
  FocusTasks,
  StartButton,
  TimerCountdown,
  DurationDisplay,
  QuoteSection,
  ScoreBar,
} from "./components";

const gradients = [
  // Pink to Lavender — softened
  "radial-gradient(circle, rgba(255,180,245,0.9) 0%, rgba(165,190,255,0.9) 100%)",

  // Blush to Soft Blue — less harsh
  "radial-gradient( circle at center,  rgba(255, 233, 133, 0.7) 0%, rgba(252, 155, 155, 0.6) 35%,  rgba(240, 180, 200, 0.5) 55%,   rgba(190, 130, 170, 0.4) 75%,   rgba(170, 100, 160, 0.4) 100% ) ",

  // Rose to Lemon Glow — softened punch
  "radial-gradient(circle farthest-corner at 10% 20%, rgba(227,106,148,0.85) 0%, rgba(245,255,170,0.75) 80%, rgba(180,80,120,0.7) 100%)",

  // Gentle Coral Cream
  "radial-gradient(circle farthest-corner at 50.2% 50.7%, rgba(241,168,179,0.88) 0%, rgba(254,246,233,0.78) 90%, rgba(180,80,120,0.68) 100%)",

  // Focus Bubble Glow
  "radial-gradient(circle at 51% 51.5%, rgba(242,250,124,0.85) 3.4%, rgba(252,128,132,0.85) 26.5%, rgba(243,121,180,0.8) 47.2%, rgba(240,193,248,0.8) 61.7%, rgba(180,80,120,0.7) 100%)",

  // Vivid Fire & Ice — made smooth
  "linear-gradient(111.6deg, rgba(114,167,232,0.88) 9.4%, rgba(253,129,82,0.85) 43.9%, rgba(253,129,82,0.78) 54.8%, rgba(249,202,86,0.85) 86.3%, rgba(80,80,120,0.75) 100%)",
];
 

function App() {
  const [activeTab, setActiveTab] = useState<
    "timer" | "tasks" | "ai" | "blocksites"
  >("timer");

  const [workDuration, setWorkDuration] = useState(25 * 60);
  const [breakDuration, setBreakDuration] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkPhase, setIsWorkPhase] = useState(true);
  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [background, setBackground] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [longBreakDuration, setLongBreakDuration] = useState(15 * 60);
  const [workSessions, setWorkSessions] = useState(0);

  const [play] = useSound("/sounds/ding-101492.mp3");
  useEffect(() => {
    setBackground(gradients[Math.floor(Math.random() * gradients.length)]);
  }, []);

  useEffect(() => {
    if (isRunning) setHasStarted(true);
  }, [isRunning]);

  useEffect(() => {
    const startTimeStr = localStorage.getItem("focus_start_time");
    const durationStr = localStorage.getItem("focus_duration");
    const phaseStr = localStorage.getItem("focus_phase");
    const isRunningStr = localStorage.getItem("focus_is_running");
    const pausedTimeStr = localStorage.getItem("focus_time_left");

    if (!startTimeStr || !durationStr || !phaseStr || isRunningStr == null)
      return;

    const startTime = parseInt(startTimeStr);
    const duration = parseInt(durationStr);
    const isWork = phaseStr === "work";
    const wasRunning = isRunningStr === "true";

    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remaining = duration - elapsed;

    if (wasRunning && remaining > 0) {
      setIsWorkPhase(isWork);
      setTimeLeft(remaining);
      setIsRunning(true);
    } else if (!wasRunning && pausedTimeStr) {
      setIsWorkPhase(isWork);
      setTimeLeft(parseInt(pausedTimeStr));
      setIsRunning(false);
    } else {
      // expired
      setTimeLeft(0);
      setIsRunning(false);
      localStorage.removeItem("focus_start_time");
      localStorage.removeItem("focus_duration");
      localStorage.removeItem("focus_phase");
      localStorage.removeItem("focus_is_running");
      localStorage.removeItem("focus_time_left");
    }

    if (wasRunning || pausedTimeStr) {
      setHasStarted(true);
    }

    const sessionCount = localStorage.getItem("work_sessions");
    if (sessionCount) {
      setWorkSessions(parseInt(sessionCount));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("focus_time_left", timeLeft.toString());
    localStorage.setItem("focus_is_running", isRunning.toString());
    localStorage.setItem("focus_is_work_phase", isWorkPhase.toString());
  }, [timeLeft, isRunning, isWorkPhase]);

  const handleFocusStart = () => {
    const wasPausedTimeLeft = localStorage.getItem("focus_time_left");
    const duration = wasPausedTimeLeft
      ? parseInt(wasPausedTimeLeft)
      : isWorkPhase
      ? workDuration
      : breakDuration;

    const now = Date.now();

    localStorage.setItem("focus_start_time", now.toString());
    localStorage.setItem("focus_duration", duration.toString());
    localStorage.setItem("focus_phase", isWorkPhase ? "work" : "break");

    setTimeLeft(duration);
    setIsRunning(true);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (isRunning && timeLeft === 0) {
      play();

      const logs = JSON.parse(localStorage.getItem("focus_logs") || "[]");
      const sessionLog = {
        date: new Date().toISOString().slice(0, 10),
        focusDuration: isWorkPhase ? workDuration : 0,
        breakDuration: isWorkPhase ? 0 : breakDuration,
        taskCompleted: false,
      };
      localStorage.setItem("focus_logs", JSON.stringify([...logs, sessionLog]));
 
      if (isWorkPhase) {
        const newWorkSessions = workSessions + 1;
        setWorkSessions(newWorkSessions);

        const useLongBreak = newWorkSessions % 4 === 0;
        const nextBreak = useLongBreak ? longBreakDuration : breakDuration;

        setTimeLeft(nextBreak);
        setIsWorkPhase(false);

        localStorage.setItem("focus_phase", "break");
        localStorage.setItem("focus_duration", nextBreak.toString());
        localStorage.setItem("work_sessions", newWorkSessions.toString());
      } else {
        setTimeLeft(workDuration);
        setIsWorkPhase(true);

        localStorage.setItem("focus_phase", "work");
        localStorage.setItem("focus_duration", workDuration.toString());
      }
      localStorage.setItem("focus_start_time", Date.now().toString());
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, workDuration, breakDuration, isWorkPhase, play]);

  const totalDuration = isWorkPhase ? workDuration : breakDuration;
  const percentage = ((totalDuration - timeLeft) / totalDuration) * 100;

  //  Load from localStorage on mount
  useEffect(() => {
    const savedTab = localStorage.getItem("focus_active_tab");
    if (savedTab === "timer" || savedTab === "tasks" || savedTab === "ai") {
      setActiveTab(savedTab);
    }
  }, []);

  // Save to localStorage whenever it changes
  const handleTabChange = (tab: "timer" | "tasks" | "ai") => {
    setActiveTab(tab);
    localStorage.setItem("focus_active_tab", tab);
  };

  return (
    <div className="w-full h-full mx-auto bg-white font-sans rounded-lg overflow-hidden ">
      <Header setActiveTab={setActiveTab} />
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* TIMER + TASKS Tabs: Shared Gradient Background */}
      {(activeTab === "timer" || activeTab === "tasks") && (
        <div className="p-4 py-2 text-center">
          <div className="relative rounded-xl overflow-hidden shadow-lg min-h-[335px] h-full">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: background,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="grainy-overlay absolute inset-0 pointer-events-none" />

            {/* Refresh Background Button (top-right) */}
            {activeTab === "tasks" && (
              <div className="relative z-10 py-3 px-6">
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
            )}

            {/* TIMER Tab Content */}
            <div className="relative z-10 px-6 pb-6 ">
              {activeTab === "timer" && (
                <>
                  <div className="relative z-10 pt-2 flex justify-end">
                    <button
                      onClick={() =>
                        setBackground(
                          gradients[
                            Math.floor(Math.random() * gradients.length)
                          ]
                        )
                      }
                      className="rounded-full p-1 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 shadow-lg"
                      title="Change background"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
                  <DurationDisplay
                    workMinutes={Math.floor(workDuration / 60)}
                    breakMinutes={Math.floor(breakDuration / 60)}
                    isRunning={isRunning}
                    setIsRunning={setIsRunning}
                    // onUpdate={handleDurationUpdate}
                    onUpdate={(w, b) => {
                      setWorkDuration(w * 60);
                      setBreakDuration(b * 60);
                      setTimeLeft(isWorkPhase ? w * 60 : b * 60);
                    }}
                    isWorkPhase={isWorkPhase}
                    setIsWorkPhase={setIsWorkPhase}
                    setTimeLeft={setTimeLeft}
                    workDuration={workDuration}
                    breakDuration={breakDuration}
                  />

                  <TimerCountdown timeLeft={timeLeft} />
                  <QuoteSection />
                </>
              )}
            </div>
          </div>
          {activeTab === "timer" && (
            <div className="relative flex flex-col items-center justify-between px-3 py-6 gap-1.5 ">
              <div className="flex justify-center">
                {/* Refresh Button */}
                <StartButton
                  isRunning={isRunning}
                  hasStarted={hasStarted}
                  onToggle={() => {
                    if (!isRunning) {
                      handleFocusStart();
                    } else {
                      setIsRunning(false);
                      localStorage.setItem(
                        "focus_time_left",
                        timeLeft.toString()
                      );
                    }
                  }}
                />
              </div>
              <button
                onClick={() => {
                  setIsRunning(false);
                  setIsWorkPhase(true);
                  setWorkDuration(25 * 60);
                  setBreakDuration(5 * 60);
                  setTimeLeft(25 * 60);
                  setHasStarted(false);

                  // Clear localStorage
                  localStorage.removeItem("focus_start_time");
                  localStorage.removeItem("focus_duration");
                  localStorage.removeItem("focus_phase");
                }}
                className="absolute right-0 top-5  text-gray-600 px-2 pt-3 transition-transform"
                title="Reset to 25:00"
              >
                <RefreshCw
                  size={20}
                  className="text-transparent bg-gradient-to-r from-[#FC589A] via-[#6C5CE7] to-[#48A7F4] bg-clip-text [&>path]:stroke-[#FC589A]"
                />
              </button>

              {/* Duration Display */}
              <ScoreBar percentage={percentage} isWorkPhase={isWorkPhase} />
            </div>
          )}
        </div>
      )}

      {activeTab === "ai" && <FocusAI />}

      {activeTab === "blocksites" && <BlockSites />}
    </div>
  );
}

export default App;
