import { Home, ShieldBan, Settings, Moon, Sun } from "lucide-react";

type HeaderProps = {
  setActiveTab: (tab: "timer" | "tasks" | "ai" | "blocksites") => void;
};

const Header = ({ setActiveTab }: HeaderProps) => {
  return ( 
    <div className="flex justify-between items-center  whitespace-nowrap px-6 py-4 w-full border-b border-solid border-b-[#f1e9ed]">
      <button
        onClick={() => setActiveTab("timer")}
        className="flex items-center gap-4 hover:opacity-80 transition-opacity"
        style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
      >
        <img
          src="/icon128.png"
          alt="Focus Logo"
          className="w-[18px] h-[18px]"
        />

        <span
          className="
            text-[16px]
            font-semibold
            bg-gradient-to-r
            from-[#FC589A]
            via-[#6C5CE7]
            to-[#48A7F4]
            bg-clip-text
            text-transparent
        "
        >
          GenZ Focus AI
        </span>
      </button>
      <div className="flex gap-4 text-slate-600 ">
        <button className=" hover:text-black">
          <Home size={20} onClick={() => setActiveTab("timer")} />
        </button>
        <button
          onClick={() => setActiveTab("blocksites")}
          className="inline-flex items-center gap-1.5  hover:text-black"
        >
          <ShieldBan size={20} /> Block Sites
        </button>
      </div>
    </div>
  );
};

export default Header;
