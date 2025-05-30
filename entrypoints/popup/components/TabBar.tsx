import React from "react";
interface TabBarProps {
  activeTab: "timer" | "tasks" | "ai";
  onTabChange: (tab: "timer" | "tasks" | "ai") => void;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div
      className="px-6 flex flex-1 justify-center relative"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="pb-3 w-full min-w-[370px]">
        <div className="flex border-b border-gray-200 gap-8 justify-center ">
          <a
            onClick={() => onTabChange("timer")}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-[6px] pt-4 cursor-pointer min-w-[100px] ${
              activeTab === "timer"
                ? "border-b-[#d65b98] text-[#8e5773]"
                : "border-b-transparent text-slate-600"
            }`}
            href="#"
          >
            <p className="text-xs font-bold leading-normal tracking-[0.015em]">
              Focus Timer
            </p>
          </a>
          <a
            onClick={() => onTabChange("tasks")}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-[6px] pt-4 cursor-pointer  min-w-[100px] ${
              activeTab === "tasks"
                ? "border-b-[#d65b98] text-[#8e5773]"
                : "border-b-transparent text-slate-600"
            }`}
            href="#"
          >
            <p className="text-xs font-bold leading-normal tracking-[0.015em]">
              Focus Task
            </p>
          </a>
          <a
            onClick={() => onTabChange("ai")}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-[6px] pt-4 cursor-pointer  min-w-[100px] ${
              activeTab === "ai"
                ? "border-b-[#d65b98] text-[#8e5773]"
                : "border-b-transparent text-slate-600"
            }`}
            href="#"
          >
            <p className="text-xs font-bold leading-normal tracking-[0.015em]">
              Focus AI
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TabBar;
