import { Home, ShieldBan, Settings } from "lucide-react";

const Header = () => {
  return (
     <div className="flex justify-between items-center px-4 pt-3 pb-2 w-full">
      <button className="text-slate-600 hover:text-black">
        <Home size={20} />
      </button>
      <div className="flex gap-4">
        <button className="text-slate-600 hover:text-black flex items-center gap-1 text-[10px]">
          <ShieldBan size={20} /> Blocked Sites
        </button>
        <button className="text-slate-600 hover:text-black">
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
};

export default Header;
