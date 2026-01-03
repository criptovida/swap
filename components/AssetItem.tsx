
import React from 'react';
import type { Asset } from '../types';

interface AssetItemProps {
  asset: Asset;
  onClick: () => void;
  isBalanceVisible: boolean;
}

const AssetItem: React.FC<AssetItemProps> = ({ asset, onClick, isBalanceVisible }) => {
    const changeColor = asset.changeType === 'positive' ? 'text-green-500' : 'text-red-500';
  return (
    <div onClick={onClick} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
      <div className="flex items-center space-x-4">
        {asset.icon}
        <div>
          <p className="font-bold">{asset.symbol}</p>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-500">{isBalanceVisible ? asset.price : '∗∗∗∗∗∗'}</p>
            <p className={`text-sm font-semibold ${changeColor}`}>{asset.change}</p>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold">{asset.amount}</p>
        <p className="text-sm text-gray-500">{isBalanceVisible ? asset.usdValue : '∗∗∗∗∗∗'}</p>
      </div>
    </div>
  );
};

export default AssetItem;
