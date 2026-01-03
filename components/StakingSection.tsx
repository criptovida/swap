
import React, { useState, useMemo, useEffect } from 'react';
import type { Asset } from '../types';
import { ChevronLeftIcon } from './icons';

interface StakingSectionProps {
  assets: Asset[];
  onBack: () => void;
}

interface StakedAsset {
    symbol: string;
    amount: number;
}

interface StakingTransaction {
    id: string;
    symbol: string;
    amount: number;
    type: 'Stake' | 'Unstake';
    date: string;
}

const stakeableAssets = ['ETH', 'USDC'];

const getApyForAsset = (symbol: string): number => {
    return 7;
};

// NOTE: This component is now disconnected from a real backend.
// It needs to be wired up to Supabase tables for staking positions and transactions.

const StakingSection: React.FC<StakingSectionProps> = ({ assets, onBack }) => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakedAssets, setStakedAssets] = useState<StakedAsset[]>([]); // Data should be fetched from Supabase
  const [transactions, setTransactions] = useState<StakingTransaction[]>([]); // Data should be fetched from Supabase
  const [successMessage, setSuccessMessage] = useState('');

  const stakeableAssetDetails = useMemo(() => {
    return assets.filter(asset => stakeableAssets.includes(asset.symbol));
  }, [assets]);
  
  useEffect(() => {
    // In a real implementation, fetch stakedAssets and transactions from Supabase here.
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleStake = () => {
    if (!selectedAsset || !stakeAmount) return;
    const amount = parseFloat(stakeAmount);
    if (amount > 0 && amount <= selectedAsset.balance) {
      // In a real implementation, you would call a Supabase function
      // to create a staking_transaction and update the staked_position.
      alert(`Staking functionality is not fully connected to the database yet.\nAttempted to stake ${amount} ${selectedAsset.symbol}.`);
      
      // The below is frontend-only for now:
      const newTransaction: StakingTransaction = {
          id: Date.now().toString(),
          symbol: selectedAsset.symbol,
          amount: amount,
          type: 'Stake',
          date: new Date().toLocaleDateString(),
      };
      setTransactions(prev => [newTransaction, ...prev]);

      setStakedAssets(prev => {
          const existing = prev.find(a => a.symbol === selectedAsset.symbol);
          if (existing) {
              return prev.map(a => a.symbol === selectedAsset.symbol ? {...a, amount: a.amount + amount} : a);
          }
          return [...prev, { symbol: selectedAsset.symbol, amount: amount }];
      });

      setSuccessMessage(`Successfully staked ${amount} ${selectedAsset.symbol}!`);
      setSelectedAsset(null);
      setStakeAmount('');
    } else {
        alert('Invalid amount or insufficient balance.');
    }
  };
  
  const handleSetMax = () => {
    if (selectedAsset) {
        setStakeAmount(selectedAsset.balance.toString());
    }
  }

  return (
    <div className="text-gray-900">
      <div className="flex items-center mb-6">
         <button onClick={onBack} className="mr-4 p-1 rounded-full hover:bg-gray-100">
            <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold">Earn Rewards</h2>
      </div>
      
      {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
              <span className="block sm:inline">{successMessage}</span>
          </div>
      )}

      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <p className="text-gray-600">Total Staked Value</p>
        <p className="text-2xl font-bold mt-1">$0.00</p>
        <p className="text-green-600 font-semibold text-sm mt-1">Up to 25% APY</p>
      </div>
      
      {!selectedAsset ? (
        <div className="mt-6">
            <h3 className="font-semibold text-gray-500 mb-2">Stake Assets</h3>
            <div className="space-y-2">
                {stakeableAssetDetails.length > 0 ? stakeableAssetDetails.map(asset => (
                    <button 
                        key={asset.symbol} 
                        onClick={() => asset.balance > 0 && setSelectedAsset(asset)} 
                        className={`w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg text-left transition-colors ${asset.balance > 0 ? 'hover:bg-gray-200 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                        disabled={asset.balance === 0}
                    >
                        <div className="flex items-center space-x-3">
                            {React.cloneElement(asset.icon, { className: "w-10 h-10" })}
                            <div>
                                <p className="font-bold">{asset.symbol}</p>
                                <p className="text-sm text-gray-500">Balance: {asset.amount}</p>
                            </div>
                        </div>
                        <p className="text-green-600 font-semibold">{getApyForAsset(asset.symbol)}% APY</p>
                    </button>
                )) : (
                     <p className="text-center text-gray-500 py-4">No stakeable assets found.</p>
                )}
            </div>
        </div>
      ) : (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">Stake {selectedAsset.symbol}</h3>
                <button onClick={() => setSelectedAsset(null)} className="text-sm text-blue-500 font-semibold">Change</button>
            </div>
            <div className="relative my-4">
                <input 
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-4 pr-16 text-lg focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={handleSetMax} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 font-semibold text-sm">MAX</button>
            </div>
            <button onClick={handleStake} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                Stake
            </button>
        </div>
      )}

      <div className="mt-6">
        <h3 className="font-semibold text-gray-500 mb-2">My Staked Positions</h3>
        {stakedAssets.length > 0 ? (
            <div className="space-y-2">
                {stakedAssets.map(({symbol, amount}) => {
                    const asset = assets.find(a => a.symbol === symbol);
                    if (!asset) return null;
                    return (
                         <div key={symbol} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                            <div className="flex items-center space-x-3">
                                {React.cloneElement(asset.icon, { className: "w-10 h-10" })}
                                <div>
                                    <p className="font-bold text-left">{asset.symbol}</p>
                                    <p className="text-sm text-gray-500 text-left">Staked: {amount}</p>
                                </div>
                            </div>
                            <button className="text-sm text-blue-500 font-semibold">Unstake</button>
                        </div>
                    )
                })}
            </div>
        ) : (
            <p className="text-center text-gray-500 py-4">You have no active stakes.</p>
        )}
      </div>

       <div className="mt-6">
        <h3 className="font-semibold text-gray-500 mb-2">Transaction History</h3>
        {transactions.length > 0 ? (
            <div className="space-y-2">
                {transactions.map(tx => (
                     <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                         <div>
                             <p className="font-semibold">{tx.type} {tx.symbol}</p>
                             <p className="text-gray-500">{tx.date}</p>
                         </div>
                         <p className="font-semibold">{tx.type === 'Stake' ? '+' : '-'} {tx.amount} {tx.symbol}</p>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-center text-gray-500 py-4">No staking transactions yet.</p>
        )}
      </div>
    </div>
  );
};

export default StakingSection;
