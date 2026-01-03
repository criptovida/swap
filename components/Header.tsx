import React from 'react';
import { SettingsIcon, BellIcon, SearchIcon } from './icons';

interface HeaderProps {
  onSettingsClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick, searchQuery, onSearchChange }) => {
  return (
    <header className="p-4 sticky top-0 bg-white/80 backdrop-blur-md z-10">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onSettingsClick} className="text-gray-500 hover:text-gray-800" aria-label="Settings">
            <SettingsIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">Home</h1>
        <button className="text-gray-500 hover:text-gray-800" aria-label="Notifications">
            <BellIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-gray-100 border-none rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </header>
  );
};

export default Header;