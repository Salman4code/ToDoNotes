// components/Navbar.tsx
import React from "react";

interface NavbarProps {
  searchText: string;
  setSearchText: (value: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ searchText, setSearchText }) => {
  return (
    <div className="w-full bg-white shadow-md p-4 flex items-center justify-between sticky top-0 z-50">
      <h1 className="text-xl font-bold text-gray-800">Google Keep Clone</h1>
      <input
        type="text"
        placeholder="Search notes..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring focus:ring-yellow-300"
      />
    </div>
  );
};

export default Navbar;
