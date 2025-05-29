interface ScoreBarProps {
  percentage: number; // 0 to 100
}

const ScoreBar: React.FC<ScoreBarProps> = ({ percentage }) => { 
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-4">
      <div
        className="h-full bg-gradient-to-r  from-pink-500 to-[#D76C82] transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ScoreBar;
