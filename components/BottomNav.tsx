import React from 'react';
import { HomeIcon, SwapIcon, PiggyBankIcon, BrowserIcon } from './icons';

// FIX: Add 'admin' to PageView to match the 'Page' type from App.tsx.
type PageView = 'wallet' | 'staking' | 'settings' | 'swap' | 'selectCoin' | 'sendAsset' | 'receiveAsset' | 'admin';

interface BottomNavProps {
    activeView: PageView;
    onNavigate: (view: 'wallet' | 'swap' | 'staking') => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onNavigate }) => {
  const navItems = [
    { name: 'Home', view: 'wallet', icon: <HomeIcon className="w-7 h-7" /> },
    { name: 'Swap', view: 'swap', icon: <SwapIcon className="w-7 h-7" /> },
    { name: 'Earn', view: 'staking', icon: <PiggyBankIcon className="w-7 h-7" /> },
    { name: 'Browser', view: 'browser', icon: <BrowserIcon className="w-7 h-7" /> },
  ];

  const handleNavigation = (view: string) => {
    if (view === 'wallet' || view === 'swap' || view === 'staking') {
      onNavigate(view as 'wallet' | 'swap' | 'staking');
    }
    // Add logic for other views here if they become active
  };
  
  const homePages: PageView[] = ['wallet', 'selectCoin', 'sendAsset', 'receiveAsset'];

  return (
    <div className="flex justify-around items-center py-2 bg-white/80 backdrop-blur-md border-t border-gray-200">
      {navItems.map((item) => {
        const isHomeActive = homePages.includes(activeView) && item.view === 'wallet';
        const isSwapActive = activeView === 'swap' && item.view === 'swap';
        const isEarnActive = activeView === 'staking' && item.view === 'staking';
        const isActive = isHomeActive || isSwapActive || isEarnActive;
        
        return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.view)}
              className={`flex flex-col items-center justify-center space-y-1 p-2 rounded-lg transition-colors w-20 ${
                isActive ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.name}</span>
            </button>
        )
      })}
    </div>
  );
};

export default BottomNav;