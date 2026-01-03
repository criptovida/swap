import React, { useState } from 'react';
import type { Asset } from '../types';
import AssetItem from './AssetItem';
import { FundsIcon, XIcon } from './icons';

interface AssetsListProps {
  assets: Asset[];
  onAssetClick: (asset: Asset) => void;
  isLoading: boolean;
  isBalanceVisible: boolean;
}

const AddFundsBanner: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="relative bg-blue-50 rounded-lg p-4 flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
            <FundsIcon className="w-10 h-10" />
        </div>
        <div>
            <h3 className="font-bold">Add funds from exchange</h3>
            <a href="#" className="text-sm text-blue-500 font-semibold">Deposit now →</a>
        </div>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500" aria-label="Close add funds banner">
            <XIcon className="w-5 h-5" />
        </button>
    </div>
);

const AssetSkeleton: React.FC = () => (
    <div className="flex items-center justify-between p-2 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
        <div>
          <div className="h-5 w-12 bg-gray-200 rounded-md animate-pulse mb-1" />
          <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse" />
        </div>
      </div>
      <div className="text-right">
        <div className="h-5 w-16 bg-gray-200 rounded-md animate-pulse mb-1" />
        <div className="h-4 w-12 bg-gray-200 rounded-md animate-pulse" />
      </div>
    </div>
);


const AssetsList: React.FC<AssetsListProps> = ({ assets, onAssetClick, isLoading, isBalanceVisible }) => {
  const [activeTab, setActiveTab] = useState('Crypto');
  const [isBannerVisible, setBannerVisible] = useState(true);

  return (
    <div>
        {isBannerVisible && <AddFundsBanner onClose={() => setBannerVisible(false)} />}
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('Crypto')}
          className={`py-2 px-4 text-sm font-semibold ${activeTab === 'Crypto' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
        >
          Crypto
        </button>
        <button 
          onClick={() => setActiveTab('NFTs')}
          className={`py-2 px-4 text-sm font-semibold ${activeTab === 'NFTs' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
        >
          NFTs
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {activeTab === 'Crypto' ? (
            isLoading ? (
                <>
                    <AssetSkeleton />
                    <AssetSkeleton />
                    <AssetSkeleton />
                    <AssetSkeleton />
                    <AssetSkeleton />
                </>
            ) : (
                assets.length > 0 ? (
                    assets.map((asset) => (
                        <AssetItem key={asset.name} asset={asset} onClick={() => onAssetClick(asset)} isBalanceVisible={isBalanceVisible} />
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        <p>No assets found.</p>
                    </div>
                )
            )
        ) : (
            <div className="text-center py-10 text-gray-500">
                <p>You don't have any NFTs yet.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AssetsList;