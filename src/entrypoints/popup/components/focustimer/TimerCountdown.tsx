interface TimerCountdownProps {
  timeLeft: number;
}

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const TimerCountdown: React.FC<TimerCountdownProps> = ({ timeLeft }) => {
  return (
    <div className="text-white text-5xl font-bold tracking-widest py-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
      {formatTime(timeLeft)}
    </div>
  );
};

export default TimerCountdown;
