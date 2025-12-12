"use client";

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
};

const Navbar = ({ search, onSearchChange }: Props) => {
  return (
    <header className="w-full bg-white border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <button className="p-2 rounded hover:bg-gray-100 md:hidden">
          {/* menu icon */}
          <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>

        <div className="flex items-center gap-2">
          <div className="bg-yellow-400 rounded p-1"><svg className="w-5 h-5 text-white" viewBox="0 0 24 24"><path d="M12 2L7 7v7a5 5 0 005 5a5 5 0 005-5V7l-5-5z" fill="currentColor"/></svg></div>
          <div className="text-xl font-semibold">Keep</div>
        </div>

        {/* center - search */}
        <div className="flex-1">
          {/* SearchBar inline to keep layout simple (you already have SearchBar separate if prefer) */}
          <div className="mx-auto max-w-2xl">
            <div className="bg-gray-100 rounded-lg px-3 py-2 flex items-center">
              <span className="text-gray-500 mr-3">🔍</span>
              <input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search"
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>
          </div>
        </div>

        {/* right icons */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded hover:bg-gray-100">⟳</button>
          <button className="p-2 rounded hover:bg-gray-100">⚙️</button>
          <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">U</div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
