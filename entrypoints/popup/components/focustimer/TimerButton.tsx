interface DurationDisplayProps {
  workDuration?: number; // in seconds
  breakDuration?: number; // in seconds
}

const formatTime = (s: number) =>
  `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60)
    .toString()
    .padStart(2, '0')}`;

const TimerButton: React.FC<DurationDisplayProps> = ({
  workDuration = 25 * 60,
  breakDuration = 5 * 60,
}) => {
  return (
    <div className="flex justify-center items-center gap-10 text-white font-medium text-md">
      <div className="flex flex-col items-center">
        <span className="text-sm opacity-70">WORK</span>
        <span className="text-xl font-bold">{formatTime(workDuration)}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-sm opacity-70">BREAK</span>
        <span className="text-xl font-bold">{formatTime(breakDuration)}</span>
      </div>
    </div>
  );
};

export default TimerButton;
