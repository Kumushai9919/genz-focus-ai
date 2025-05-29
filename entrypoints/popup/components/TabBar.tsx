import React from "react";
interface TabBarProps {
  activeTab: "timer" | "tasks";
  onTabChange: (tab: "timer" | "tasks") => void;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
return (
    <div className="flex justify-center relative border-b border-gray-200">
      <button
        onClick={() => onTabChange('timer')}
        className={`px-4 py-2 text-sm font-semibold transition-all relative ${
          activeTab === 'timer'
            ? 'text-black'
            : 'text-gray-500'
        }`}
      >
        Focus Timer
        {activeTab === 'timer' && (
          <div className="absolute left-0 bottom-0 w-full h-1 bg-pink-400 rounded-t"></div>
        )}
      </button>
      <button
        onClick={() => onTabChange('tasks')}
        className={`px-4 py-2 text-sm font-semibold transition-all relative ${
          activeTab === 'tasks'
            ? 'text-black'
            : 'text-gray-500'
        }`}
      >
        Focus Tasks
        {activeTab === 'tasks' && (
          <div className="absolute left-0 bottom-0 w-full h-1 bg-pink-400 rounded-t"></div>
        )}
      </button>
    </div>
  );
};

export default TabBar;
