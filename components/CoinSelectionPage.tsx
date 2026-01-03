import React, { useMemo } from 'react';
import type { Asset } from '../types';
import { ChevronLeftIcon } from './icons';

interface CoinSelectionPageProps {
  assets: Asset[];
  onBack: () => void;
  onSelectCoin: (asset: Asset) => void;
  action: 'send' | 'receive' | null;
}

const CoinSelectionPage: React.FC<CoinSelectionPageProps> = ({ assets, onBack, onSelectCoin, action }) => {
  const pageTitle = action === 'send' ? 'Send' : 'Receive';
  
  const filteredAssets = useMemo(() => {
    if (action === 'send') {
      return assets.filter(a => a.balance > 0);
    }
    if (action === 'receive') {
      // Per the request to ensure USDT.Z is selectable and to improve UX,
      // we only show assets with a functional receive page.
      const receivableSymbols = ['USDT', 'USDT.Z'];
      return assets.filter(asset => receivableSymbols.includes(asset.symbol));
    }
    return assets;
  }, [assets, action]);

  return (
    <div className="p-4 flex flex-col h-full bg-white">
      <header className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold ml-4">Select Asset to {pageTitle}</h2>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2">
            {filteredAssets.length > 0 ? (
                filteredAssets.map(asset => (
                    <div key={asset.symbol} onClick={() => onSelectCoin(asset)} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                        <div className="flex items-center space-x-4">
                            {React.cloneElement(asset.icon, { className: "w-10 h-10" })}
                            <div>
                                <p className="font-bold">{asset.name}</p>
                                <p className="text-sm text-gray-500">{asset.symbol}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold">{asset.amount}</p>
                            <p className="text-sm text-gray-500">{asset.usdValue}</p>
                        </div>
                    </div>
                ))
            ) : (
                 <div className="text-center py-10 text-gray-500">
                    <p>You have no assets with a balance to send.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CoinSelectionPage;