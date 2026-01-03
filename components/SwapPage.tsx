
import React, { useState, useEffect, useMemo } from 'react';
import type { Asset } from '../types';
import { ChevronLeftIcon, ChevronDownIcon, SwitchVerticalIcon } from './icons';

interface SwapPageProps {
  fromAssets: Asset[];
  toAssets: Asset[];
  onBack: () => void;
  onSwap: (fromAsset: Asset, toAsset: Asset, fromAmount: number, toAmount: number) => Promise<void>;
}

interface SwapInputProps {
    label: string;
    selectedAsset: Asset | null;
    onSelectAsset: (asset: Asset) => void;
    amount: string;
    onAmountChange: (amount: string) => void;
    assets: Asset[];
    showMaxButton?: boolean;
    onMaxClick?: () => void;
    readOnly?: boolean;
}

const SwapInput: React.FC<SwapInputProps> = ({ 
    label, 
    selectedAsset, 
    onSelectAsset, 
    amount, 
    onAmountChange, 
    assets, 
    showMaxButton, 
    onMaxClick,
    readOnly = false
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSelect = (asset: Asset) => {
        onSelectAsset(asset);
        setIsDropdownOpen(false);
    }
    
    return (
        <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-gray-500">{label}</p>
                {selectedAsset && (
                    <div className="text-sm text-gray-500 flex items-center">
                        <span>Balance: {selectedAsset.amount}</span>
                        {showMaxButton && (
                            <button onClick={onMaxClick} className="text-blue-500 font-semibold text-xs ml-2 hover:underline">
                                MAX
                            </button>
                        )}
                    </div>
                )}
            </div>
            <div className="flex items-center justify-between">
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => onAmountChange(e.target.value)}
                    placeholder="0.0"
                    className="bg-transparent text-2xl font-bold w-full focus:outline-none"
                    readOnly={readOnly}
                />
                <div className="relative">
                     <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow">
                        {selectedAsset ? (
                            React.cloneElement(selectedAsset.icon, { className: "w-6 h-6" })
                        ) : null}
                        <span className="font-semibold">{selectedAsset?.symbol || 'Select'}</span>
                        <ChevronDownIcon className="w-5 h-5" />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                            {assets.map(asset => (
                                <button key={asset.symbol} onClick={() => handleSelect(asset)} className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 text-left">
                                     {React.cloneElement(asset.icon, { className: "w-6 h-6" })}
                                     <span className="font-semibold">{asset.symbol}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


const SwapPage: React.FC<SwapPageProps> = ({ fromAssets, toAssets, onBack, onSwap }) => {
    const [fromAsset, setFromAsset] = useState<Asset | null>(fromAssets[0] || null);
    const [toAsset, setToAsset] = useState<Asset | null>(() => {
        const initialFromSymbol = fromAssets[0]?.symbol;
        if (!initialFromSymbol) return toAssets[0] || null;
        return toAssets.find(a => a.symbol !== initialFromSymbol) || toAssets[0] || null;
    });
    const [fromAmount, setFromAmount] = useState('');
    const [toAmount, setToAmount] = useState('');
    const [isSwapping, setIsSwapping] = useState(false);
    const [isRateLoading, setIsRateLoading] = useState(false);
    const [livePrices, setLivePrices] = useState<{ [symbol: string]: number }>({});

    useEffect(() => {
        if (!fromAsset || !toAsset) return;

        const fetchRates = async () => {
            if (!fromAsset?.coingeckoId || !toAsset?.coingeckoId) {
                console.warn("Missing coingeckoId for swap assets.");
                return;
            }

            setIsRateLoading(true);
            const ids = `${fromAsset.coingeckoId},${toAsset.coingeckoId}`;
            const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
            
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    const newPrices: { [symbol: string]: number } = {};
                    
                    const fromData = data[fromAsset.coingeckoId];
                    if (fromData?.usd) {
                        newPrices[fromAsset.symbol] = fromData.usd;
                    }

                    const toData = data[toAsset.coingeckoId];
                    if (toData?.usd) {
                        newPrices[toAsset.symbol] = toData.usd;
                    }

                    setLivePrices(prevPrices => ({ ...prevPrices, ...newPrices }));
                }
            } catch (error) {
                console.error("Error fetching live rates:", error);
            } finally {
                setIsRateLoading(false);
            }
        };

        fetchRates();
        const intervalId = setInterval(fetchRates, 15000);

        return () => clearInterval(intervalId);
    }, [fromAsset, toAsset]);

    const exchangeRate = useMemo(() => {
        if (!fromAsset || !toAsset) return 0;
        
        const fromPrice = livePrices[fromAsset.symbol] || fromAsset.price_raw;
        const toPrice = livePrices[toAsset.symbol] || toAsset.price_raw;

        if (toPrice === 0) return 0;
        return fromPrice / toPrice;
    }, [fromAsset, toAsset, livePrices]);

    useEffect(() => {
        if (fromAmount && exchangeRate > 0) {
            const amount = parseFloat(fromAmount);
            setToAmount((amount * exchangeRate).toFixed(6));
        } else {
            setToAmount('');
        }
    }, [fromAmount, exchangeRate]);

    const handleSwitchAssets = () => {
        const tempFrom = fromAsset;
        setFromAsset(toAsset);
        setToAsset(tempFrom);
    };

    const handleFromAmountChange = (amount: string) => {
        setFromAmount(amount);
    };

    const handleSetMax = () => {
        if (fromAsset) {
            setFromAmount(fromAsset.balance.toString());
        }
    };

    const handleSwap = async () => {
        if (!fromAsset || !toAsset) return;
        const fromAmountNum = parseFloat(fromAmount);
        const toAmountNum = parseFloat(toAmount);
        if (!fromAmountNum || !toAmountNum || fromAmountNum <= 0) {
            alert("Please enter a valid amount to swap.");
            return;
        }
        if (fromAmountNum > fromAsset.balance) {
            alert("Insufficient balance.");
            return;
        }
        setIsSwapping(true);
        
        const liveFromPrice = livePrices[fromAsset.symbol] || fromAsset.price_raw;
        const liveToPrice = livePrices[toAsset.symbol] || toAsset.price_raw;

        const updatedFromAsset = { ...fromAsset, price_raw: liveFromPrice };
        const updatedToAsset = { ...toAsset, price_raw: liveToPrice };

        await onSwap(updatedFromAsset, updatedToAsset, fromAmountNum, toAmountNum);
        setIsSwapping(false);
    };

    const availableToAssets = toAssets.filter(a => a.symbol !== fromAsset?.symbol);

    return (
        <div className="p-4 flex flex-col h-full bg-white">
            <header className="flex items-center mb-6">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold ml-4">Swap</h2>
            </header>
            
            <div className="flex-1 space-y-2 relative">
                <SwapInput
                    label="You pay"
                    selectedAsset={fromAsset}
                    onSelectAsset={setFromAsset}
                    amount={fromAmount}
                    onAmountChange={handleFromAmountChange}
                    assets={fromAssets}
                    showMaxButton={true}
                    onMaxClick={handleSetMax}
                />

                <div className="flex justify-center py-2">
                    <button onClick={handleSwitchAssets} className="p-2 rounded-full border-2 border-gray-200 bg-white hover:bg-gray-100">
                        <SwitchVerticalIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                
                <SwapInput
                    label="You receive"
                    selectedAsset={toAsset}
                    onSelectAsset={setToAsset}
                    amount={toAmount}
                    onAmountChange={() => {}} 
                    assets={availableToAssets}
                    readOnly={true}
                />

                {fromAsset && toAsset && (
                    <div className="flex items-center justify-center text-sm text-gray-500 py-4 h-5">
                        {isRateLoading ? (
                           <div className="flex items-center space-x-2">
                                <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>Updating rate...</span>
                           </div>
                        ) : (
                            exchangeRate > 0 && <span>1 {fromAsset.symbol} ≈ {exchangeRate.toFixed(4)} {toAsset.symbol}</span>
                        )}
                    </div>
                )}
            </div>

            <button
                onClick={handleSwap}
                disabled={!fromAsset || !toAsset || !fromAmount || isSwapping || parseFloat(fromAmount) <= 0 || parseFloat(fromAmount) > (fromAsset?.balance || 0)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
                {isSwapping ? 'Swapping...' : 'Swap'}
            </button>
        </div>
    );
};

export default SwapPage;
