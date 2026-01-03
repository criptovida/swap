
import React, { useState, useEffect } from 'react';
import type { Asset } from '../types';
import { ChevronLeftIcon } from './icons';

interface SendAssetProps {
  asset: Asset;
  onBack: () => void;
  onSend: (details: { address: string, amount: number, network: string, fee: number }) => void;
}

const networkConfig: { [key: string]: { name: string; fee: number }[] } = {
    'USDT': [
        { name: 'TRC20', fee: 1 },
        { name: 'BEP20', fee: 0.29 },
        { name: 'ERC20', fee: 5.5 },
    ],
    'USDT.Z': [
        { name: 'BEP20', fee: 0.29 },
    ],
    'USDC': [
        { name: 'TRC20', fee: 1 },
        { name: 'BEP20', fee: 0.3 },
        { name: 'ERC20', fee: 5.2 },
    ],
    'ETH': [{ name: 'ERC20', fee: 0.001 }],
    'BNB': [{ name: 'BEP20', fee: 0.0005 }],
    'BTC': [{ name: 'Bitcoin', fee: 0.00005 }],
    'BTCBR': [{ name: 'BEP20', fee: 0.3 }],
    'BNBTIGER': [{ name: 'BEP20', fee: 0.3 }],
    'default': [{ name: 'Mainnet', fee: 0 }]
};


const SendAsset: React.FC<SendAssetProps> = ({ asset, onBack, onSend }) => {
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [networks, setNetworks] = useState(networkConfig[asset.symbol] || networkConfig.default);
    const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);

    useEffect(() => {
        const availableNetworks = networkConfig[asset.symbol] || networkConfig.default;
        setNetworks(availableNetworks);
        setSelectedNetwork(availableNetworks[0]);
    }, [asset.symbol]);

    const handleSend = () => {
        const numericAmount = parseFloat(amount);
        if (!address || !amount || numericAmount <= 0) {
            alert('Please fill in all fields correctly.');
            return;
        }
        if (numericAmount > asset.balance) {
            alert('Insufficient balance.');
            return;
        }
        
        onSend({
            address,
            amount: numericAmount,
            network: selectedNetwork.name,
            fee: selectedNetwork.fee,
        });
    };
    
    const handleSetMax = () => {
        setAmount(asset.balance.toString());
    }

    const amountNumber = parseFloat(amount) || 0;
    const finalAmount = amountNumber - selectedNetwork.fee;

    return (
        <div className="p-4 flex flex-col h-full bg-white">
            <header className="flex items-center mb-6">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold ml-4">Send {asset.symbol}</h2>
            </header>

            <div className="flex-1">
                <div className="mb-4">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Recipient's address"
                        className="w-full bg-gray-100 border-none rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <div className="relative">
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.0"
                            className="w-full bg-gray-100 border-none rounded-lg py-3 pl-4 pr-16 text-lg focus:ring-2 focus:ring-blue-500"
                        />
                         <button onClick={handleSetMax} className="absolute right-3 top-1/2 -translate-y-1-2 text-blue-500 font-semibold text-sm">MAX</button>
                    </div>
                     <p className="text-sm text-gray-500 mt-1">Balance: {asset.amount} {asset.symbol}</p>
                </div>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Network</label>
                    <div className="flex space-x-2 flex-wrap gap-y-2">
                        {networks.map(network => (
                            <button
                                key={network.name}
                                onClick={() => setSelectedNetwork(network)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${selectedNetwork.name === network.name ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                {network.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Network Fee</span>
                        <span className="font-medium">{selectedNetwork.fee} {asset.symbol}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                        <span>Recipient gets</span>
                        <span>{finalAmount > 0 ? finalAmount.toFixed(6) : '0.00'} {asset.symbol}</span>
                    </div>
                </div>
            </div>

            <button
                onClick={handleSend}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-blue-300"
                disabled={!address || !amount || parseFloat(amount) <= selectedNetwork.fee || parseFloat(amount) > asset.balance}
            >
                Send
            </button>
        </div>
    );
};

export default SendAsset;
