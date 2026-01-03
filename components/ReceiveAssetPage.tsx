
import React, { useState } from 'react';
import type { Asset } from '../types';
import { ChevronLeftIcon, CopyIcon, ShareIcon, UsdtIcon, SettingsIcon } from './icons';

interface ReceiveAssetPageProps {
  asset: Asset;
  onBack: () => void;
}

const allUsdtNetworks = [
    { name: 'TRC20', networkLabel: 'Tron', address: 'TWvMUJMceRogJuHj4joh8VvTGN1uGiTevu', mainIcon: <UsdtIcon className="w-8 h-8" /> },
    { name: 'BEP20', networkLabel: 'BSC', address: '0xd780270A1487d3Cb23821f0FE18dd8Fc064200CA', mainIcon: <UsdtIcon className="w-8 h-8" /> }
];

const getNetworksForAsset = (assetSymbol: string) => {
    if (assetSymbol === 'USDT') {
        return allUsdtNetworks;
    }
    if (assetSymbol === 'USDT.Z') {
        return allUsdtNetworks.filter(n => n.name === 'BEP20');
    }
    return [];
}


const UsdtLikeReceiveContent: React.FC<ReceiveAssetPageProps> = ({ asset, onBack }) => {
    const [copied, setCopied] = useState(false);
    const networks = getNetworksForAsset(asset.symbol);
    const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);
    
    if (!selectedNetwork) {
        // Fallback for safety, though it shouldn't be reached with the current logic.
         return (
            <div className="p-4 flex flex-col h-full bg-white">
              <header className="flex items-center mb-6">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold ml-4">Receive {asset.symbol}</h2>
              </header>
              <div className="flex-1 flex items-center justify-center">
                  <p>No receive networks configured for this asset.</p>
              </div>
            </div>
        );
    }
    
    const walletAddress = selectedNetwork.address;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${walletAddress}`;

    const handleCopy = (address: string) => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const handleShare = (address: string) => {
        if(navigator.share) {
            navigator.share({
                title: `My ${asset.name} Address`,
                text: `Here is my ${asset.name} (${asset.symbol}) wallet address: ${address}`,
            });
        } else {
            alert('Share functionality is not supported on this device.');
        }
    };
    
    return (
        <div className="p-4 flex flex-col h-full bg-white">
            <header className="flex items-center mb-4">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center space-x-2 ml-4">
                    {React.cloneElement(asset.icon, { className: "w-8 h-8" })}
                    <h2 className="text-xl font-bold">Receive {asset.symbol}</h2>
                </div>
            </header>
            
            {networks.length > 1 && (
                <div className="flex justify-center space-x-2 mb-4 border-b">
                    {networks.map(network => (
                        <button 
                            key={network.name}
                            onClick={() => setSelectedNetwork(network)}
                            className={`px-4 py-2 text-sm font-semibold transition-colors ${selectedNetwork.name === network.name ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-600'}`}
                        >
                            {network.name} <span className="text-gray-400">({network.networkLabel})</span>
                        </button>
                    ))}
                </div>
            )}

            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-md">
                    <div className="relative w-48 h-48">
                        <img src={qrCodeUrl} alt={`${asset.symbol} ${selectedNetwork.name} QR Code`} className="w-full h-full rounded-lg" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white p-1.5 rounded-full shadow-md">
                                {selectedNetwork.mainIcon}
                            </div>
                        </div>
                    </div>
                </div>
                <p className="font-mono text-center break-all my-4 px-4 text-gray-800 text-sm">{walletAddress}</p>
                <p className="text-gray-500 mb-6">Only send {asset.symbol} ({selectedNetwork.name}) to this address.</p>

                 <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                    <button onClick={() => handleCopy(walletAddress)} className="flex items-center justify-center space-x-2 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition-colors">
                        <CopyIcon className="w-5 h-5" />
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                     <button onClick={() => handleShare(walletAddress)} className="flex items-center justify-center space-x-2 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition-colors">
                        <ShareIcon className="w-5 h-5" />
                        <span>Share</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

const ReceiveAssetPage: React.FC<ReceiveAssetPageProps> = ({ asset, onBack }) => {
  if (asset.symbol === 'USDT' || asset.symbol === 'USDT.Z') {
    return <UsdtLikeReceiveContent asset={asset} onBack={onBack} />;
  }

  // Generic receive page for all other assets shows maintenance
  return (
    <div className="p-4 flex flex-col h-full bg-white">
      <header className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold ml-4">Receive {asset.symbol}</h2>
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <SettingsIcon className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-bold text-gray-800">Wallet Under Maintenance</h3>
        <p className="text-gray-600 mt-2">
            The deposit address for {asset.symbol} is temporarily unavailable.
        </p>
        <p className="text-gray-600 mt-1">
            Please check back later.
        </p>
      </div>
    </div>
  );
};

export default ReceiveAssetPage;
