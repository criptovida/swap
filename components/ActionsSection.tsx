import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, SwapIcon, PiggyBankIcon } from './icons';

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onClick }) => (
  <div className="flex flex-col items-center space-y-2">
    <button onClick={onClick} className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-200 transition-colors">
      {icon}
    </button>
    <span className="text-sm font-medium">{label}</span>
  </div>
);

interface ActionsSectionProps {
    onEarnClick: () => void;
    onSendClick: () => void;
    onReceiveClick: () => void;
    onSwapClick: () => void;
}

const ActionsSection: React.FC<ActionsSectionProps> = ({ onEarnClick, onSendClick, onReceiveClick, onSwapClick }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <ActionButton icon={<ArrowUpIcon className="w-6 h-6" />} label="Send" onClick={onSendClick} />
      <ActionButton icon={<ArrowDownIcon className="w-6 h-6" />} label="Receive" onClick={onReceiveClick} />
      <ActionButton icon={<SwapIcon className="w-6 h-6" />} label="Swap" onClick={onSwapClick} />
      <ActionButton icon={<PiggyBankIcon className="w-6 h-6" />} label="Earn" onClick={onEarnClick} />
    </div>
  );
};

export default ActionsSection;