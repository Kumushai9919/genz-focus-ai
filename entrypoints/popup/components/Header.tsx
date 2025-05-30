import { Home, ShieldBan, Settings } from "lucide-react";

const Header = () => {
  return (
    // border-gray-200
    <div className="flex justify-between items-center  whitespace-nowrap px-6 py-3 w-full border-b border-solid border-b-[#f1e9ed]">
      <button
        className="flex items-center gap-4 hover:opacity-80 transition-opacity"
        style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
      >
        <img
          src="/icon128.png"
          alt="Focus Logo"
          className="w-[18px] h-[18px]"
        />
        <span className="text-[#423f41] text-[16px]">GenZ Focus AI</span>
      </button>
      <div className="flex gap-4 text-slate-600 hover:text-black">
        <button>
          <Home size={20} />
        </button>
        <button>
          <ShieldBan size={20} />
        </button>
        <button>
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
};

export default Header;
 