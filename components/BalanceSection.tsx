
import React from 'react';
import { ChevronDownIcon, QrCodeIcon, CopyIcon, EyeIcon, EyeSlashIcon } from './icons';

interface BalanceSectionProps {
  balance: number;
  isLoading: boolean;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

const BalanceSection: React.FC<BalanceSectionProps> = ({ balance, isLoading, isVisible, onToggleVisibility }) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <button className="flex items-center space-x-2 text-gray-600">
          <span className="font-semibold">Coinswap</span>
          <ChevronDownIcon className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-3 text-gray-500">
          <button aria-label="Show QR Code"><QrCodeIcon className="w-6 h-6" /></button>
          <button aria-label="Copy address"><CopyIcon className="w-6 h-6" /></button>
          <button onClick={onToggleVisibility} aria-label={isVisible ? "Hide balance" : "Show balance"}>
            {isVisible ? <EyeIcon className="w-6 h-6" /> : <EyeSlashIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>
      <div className="mt-2 h-10">
        {isLoading ? (
          <div className="animate-pulse bg-gray-200 rounded-md h-10 w-48" />
        ) : (
          <p className="text-4xl font-bold tracking-tight">
            {isVisible ? `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '∗∗∗∗∗∗∗∗'}
          </p>
        )}
      </div>
    </div>
  );
};

export default BalanceSection;
