
import React, { useState, useEffect, useMemo } from 'react';
import type { Asset, DbAsset, DbTransaction, DbWithdrawalRequest, Profile } from './types';
import Header from './components/Header';
import BalanceSection from './components/BalanceSection';
import ActionsSection from './components/ActionsSection';
import AssetsList from './components/AssetsList';
import BottomNav from './components/BottomNav';
import StakingSection from './components/StakingSection';
import AssetDetail from './components/AssetDetail';
import AuthPage from './components/AuthPage';
import LandingPage from './components/LandingPage';
import SettingsPage from './components/SettingsPage';
import SwapPage from './components/SwapPage';
import CoinSelectionPage from './components/CoinSelectionPage';
import ReceiveAssetPage from './components/ReceiveAssetPage';
import SendAsset from './components/SendUsdt';
import { supabase } from './supabaseClient';
import type { Session } from '@supabase/supabase-js';
import AdminPanel from './components/AdminPanel';
import { BtcIcon, EthIcon, BnbIcon, UsdcIcon, UsdtIcon, BtcBrIcon, BnbtigerIcon } from './components/icons';

type Page = 'wallet' | 'staking' | 'settings' | 'swap' | 'selectCoin' | 'sendAsset' | 'receiveAsset' | 'admin';

const getAssetIcon = (symbol: string, logoUrl: string, name: string) => {
    const props = { className: "w-10 h-10" };
    switch (symbol) {
        case 'BTC': return <BtcIcon {...props} />;
        case 'ETH': return <EthIcon {...props} />;
        case 'BNB': return <BnbIcon {...props} />;
        case 'USDC': return <UsdcIcon {...props} />;
        case 'USDT': return <UsdtIcon {...props} />;
        case 'USDT.Z': return <UsdtIcon {...props} />;
        case 'BTCBR': return <BtcBrIcon {...props} />;
        case 'BNBTIGER': return <BnbtigerIcon {...props} />;
        default: return <img src={logoUrl} alt={name} {...props} />;
    }
};

const App: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [dbAssets, setDbAssets] = useState<DbAsset[]>([]);
  const [transactions, setTransactions] = useState<DbTransaction[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<DbWithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [preLoginView, setPreLoginView] = useState<'landing' | 'auth'>('landing');
  const [initialAuthTab, setInitialAuthTab] = useState<'login' | 'signup'>('signup');
  const [page, setPage] = useState<Page>('wallet');
  const [pageAction, setPageAction] = useState<'send' | 'receive' | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [walletId, setWalletId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
       if (!session) {
        // Reset state on logout
        setAssets([]);
        setDbAssets([]);
        setTransactions([]);
        setWithdrawalRequests([]);
        setSelectedAsset(null);
        setPage('wallet');
        setPreLoginView('landing');
        setWalletId(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const fetchWalletData = async (currentSession: Session) => {
      setIsLoading(true);
      const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();
      
      if (profileData) {
          setProfile(profileData);
      } else {
          console.error('Error fetching profile:', profileError?.message);
      }

      const { data: walletData, error: walletError } = await supabase
          .from('wallets')
          .select('id')
          .eq('user_id', currentSession.user.id)
          .single();

      if (walletError || !walletData) {
          console.error('Error fetching wallet:', walletError?.message);
          setIsLoading(false);
          return;
      }

      const currentWalletId = walletData.id;
      setWalletId(currentWalletId);

      const { error: rpcError } = await supabase.rpc('ensure_usdt_z_asset', {
          p_wallet_id: currentWalletId
      });
      if (rpcError) {
          console.error('Error ensuring USDT.Z asset exists:', rpcError.message);
      }

      const { data: assetsData, error: assetsError } = await supabase
        .from('assets')
        .select('*, coins(*)')
        .eq('wallet_id', currentWalletId);
      
      let currentDbAssets: DbAsset[] = [];
      if (assetsError) {
        console.error('Error fetching user assets:', assetsError.message);
      } else {
        currentDbAssets = (assetsData as DbAsset[]) || [];
      }
      setDbAssets(currentDbAssets);

      const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*, coins(*)')
          .eq('wallet_id', currentWalletId)
          .order('created_at', { ascending: false });
      
      if (transactionsError || !transactionsData) {
          console.error('Error fetching transactions:', transactionsError?.message);
      } else {
          setTransactions(transactionsData as DbTransaction[]);
      }

      const { data: withdrawalsData, error: withdrawalsError } = await supabase
          .from('withdrawal_requests')
          .select('*, coins(*)')
          .eq('wallet_id', currentWalletId)
          .order('created_at', { ascending: false });
      
      if (withdrawalsError || !withdrawalsData) {
          console.error('Error fetching withdrawal requests:', withdrawalsError?.message);
      } else {
          setWithdrawalRequests(withdrawalsData as DbWithdrawalRequest[]);
      }
  };

  useEffect(() => {
    if (!session?.user) {
      setIsLoading(false);
      return;
    };
    fetchWalletData(session);
  }, [session]);

  useEffect(() => {
    if (!walletId) return;

    const channel = supabase
      .channel(`wallet-updates:${walletId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'assets', filter: `wallet_id=eq.${walletId}` },
        (payload) => {
          const updatedRecord = payload.new as { id: string; balance: number; };
          setDbAssets(currentDbAssets =>
            currentDbAssets.map(asset =>
              asset.id === updatedRecord.id
                ? { ...asset, balance: updatedRecord.balance }
                : asset
            )
          );
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'transactions', filter: `wallet_id=eq.${walletId}` },
        async (payload) => {
           const { data: transactionsData } = await supabase
            .from('transactions')
            .select('*, coins(*)')
            .eq('wallet_id', walletId)
            .order('created_at', { ascending: false });
           if(transactionsData) setTransactions(transactionsData as DbTransaction[]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'withdrawal_requests', filter: `wallet_id=eq.${walletId}` },
        (payload) => {
          const updatedRecord = payload.new as DbWithdrawalRequest;
          setWithdrawalRequests(currentRequests =>
            currentRequests.map(req =>
              req.id === updatedRecord.id
                ? { ...req, status: updatedRecord.status }
                : req
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [walletId]);

  useEffect(() => {
    const fetchPrices = async () => {
      if (dbAssets.length === 0) {
        setAssets([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const validDbAssets = dbAssets.filter(asset => asset.coins);
      const priceData: { [symbol: string]: { price: number; change: number } } = {};

      const symbolToCoingeckoIdMap: { [symbol: string]: string } = {
          'BTC': 'bitcoin',
          'ETH': 'ethereum',
          'BNB': 'binancecoin',
          'USDC': 'usd-coin',
          'USDT': 'tether',
          'USDT.Z': 'tether',
          'BTCBR': 'btcbr',
          'BNBTIGER': 'bnb-tiger-inu',
      };

      const coingeckoIdToSymbols: { [id: string]: string[] } = {};
      validDbAssets.forEach(asset => {
          const symbol = asset.coins.symbol;
          const coingeckoId = symbolToCoingeckoIdMap[symbol] || asset.coins.coingecko_id;
          if (coingeckoId) {
              if (!coingeckoIdToSymbols[coingeckoId]) {
                  coingeckoIdToSymbols[coingeckoId] = [];
              }
              if (!coingeckoIdToSymbols[coingeckoId].includes(symbol)) {
                coingeckoIdToSymbols[coingeckoId].push(symbol);
              }
          }
      });
      
      const uniqueCoingeckoIds = Object.keys(coingeckoIdToSymbols).join(',');

      if (uniqueCoingeckoIds) {
          const url = `https://api.coingecko.com/api/v3/simple/price?ids=${uniqueCoingeckoIds}&vs_currencies=usd&include_24hr_change=true`;
          try {
              const response = await fetch(url);
              if (response.ok) {
                  const data = await response.json();
                  for (const id in data) {
                      const symbols = coingeckoIdToSymbols[id];
                      if (symbols && data[id]?.usd !== undefined) {
                          symbols.forEach(symbol => {
                              priceData[symbol] = {
                                  price: data[id].usd,
                                  change: data[id].usd_24h_change || 0
                              };
                          });
                      }
                  }
              }
          } catch (error) {
              console.error("Failed to fetch from CoinGecko:", error);
          }
      }

      const missingSymbols = validDbAssets
          .map(asset => asset.coins.symbol)
          .filter(symbol => !priceData[symbol]);
          
      if (missingSymbols.length > 0) {
          const symbolMap: { [fetchSymbol: string]: string[] } = {};
          missingSymbols.forEach(originalSymbol => {
              const fetchSymbol = (originalSymbol === 'USDT.Z' ? 'USDT' : originalSymbol).toUpperCase();
              if (!symbolMap[fetchSymbol]) {
                  symbolMap[fetchSymbol] = [];
              }
              symbolMap[fetchSymbol].push(originalSymbol);
          });

          const symbolsToFetch = Object.keys(symbolMap).join(',');
          const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbolsToFetch}&tsyms=USD`;
          try {
              const response = await fetch(url);
              if (response.ok) {
                  const cryptoCompareData = await response.json();
                  if (cryptoCompareData.RAW) {
                      for (const fetchSymbol in cryptoCompareData.RAW) {
                          const data = cryptoCompareData.RAW[fetchSymbol]?.USD;
                          if (data && symbolMap[fetchSymbol]) {
                              const originalSymbols = symbolMap[fetchSymbol];
                              originalSymbols.forEach(originalSymbol => {
                                  priceData[originalSymbol] = { price: data.PRICE, change: data.CHANGEPCT24HOUR };
                              });
                          }
                      }
                  }
              }
          } catch (error) {
               console.error("Failed to fetch from CryptoCompare:", error);
          }
      }

      const updatedAssets = validDbAssets.map((asset): Asset => {
          const marketData = priceData[asset.coins.symbol];
          const price = marketData?.price ?? (asset.coins.symbol.startsWith('USDT') || asset.coins.symbol === 'USDC' ? 1.0 : 0);
          const change = marketData?.change ?? 0;
          const coingeckoId = symbolToCoingeckoIdMap[asset.coins.symbol] || asset.coins.coingecko_id;

          return {
              name: asset.coins.name,
              symbol: asset.coins.symbol,
              icon: getAssetIcon(asset.coins.symbol, asset.coins.logo_url, asset.coins.name),
              price: `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: price > 1 ? 2 : 6 })}`,
              price_raw: price,
              change: `${change.toFixed(2)}%`,
              changeType: change >= 0 ? 'positive' : 'negative',
              balance: asset.balance,
              amount: asset.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }),
              usdValue: `$${(price * asset.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              coingeckoId: coingeckoId,
          };
      });
      
      setAssets(updatedAssets);
      setIsLoading(false);
    };

    fetchPrices();
  }, [dbAssets]);
  
  const totalBalance = useMemo(() => {
    return assets.reduce((total, asset) => {
      const value = parseFloat(asset.usdValue.replace(/[$,]/g, ''));
      return total + value;
    }, 0);
  }, [assets]);

  const filteredAssets = useMemo(() => {
    if (!searchQuery) {
      return assets;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return assets.filter(asset => 
      asset.name.toLowerCase().includes(lowercasedQuery) ||
      asset.symbol.toLowerCase().includes(lowercasedQuery)
    );
  }, [assets, searchQuery]);
  
  const handleBackToWallet = () => {
    setSelectedAsset(null);
    setPage('wallet');
    setPageAction(null);
  };

  const handleAssetClick = (asset: Asset) => {
    setSelectedAsset(asset);
  };
  
  const handleSendClick = () => {
    setPageAction('send');
    setPage('selectCoin');
  };
  
  const handleReceiveClick = () => {
    setPageAction('receive');
    setPage('selectCoin');
  };
  
  const handleCoinSelected = (asset: Asset) => {
    setSelectedAsset(asset);
    if (pageAction === 'send') {
      setPage('sendAsset');
    } else if (pageAction === 'receive') {
      setPage('receiveAsset');
    }
  };

  const handleSendAsset = async (assetSymbol: string, details: { address: string, amount: number, network: string, fee: number }) => {
    if (!session?.user || !walletId) return;

    const asset = dbAssets.find(a => a.coins.symbol === assetSymbol);
    if (!asset) {
      alert(`${assetSymbol} asset not found in your wallet.`);
      return;
    }

    const { data: newWithdrawal, error } = await supabase
      .from('withdrawal_requests')
      .insert({
        user_id: session.user.id,
        wallet_id: walletId,
        coin_id: asset.coins.id,
        amount: details.amount,
        to_address: details.address,
        network: details.network,
        status: 'pending',
      })
      .select('*, coins(*)')
      .single();

    if (error || !newWithdrawal) {
      console.error("Error creating withdrawal request:", error);
      alert("Failed to submit withdrawal request. Please try again.");
      return;
    }

    setWithdrawalRequests(prev => [newWithdrawal as DbWithdrawalRequest, ...prev]);
    alert("Withdrawal request submitted successfully. It will be processed after admin approval.");
    handleBackToWallet();
  };

  const handleSwap = async (fromAsset: Asset, toAsset: Asset, fromAmount: number, toAmount: number) => {
      if (!walletId || !session) {
          alert("Wallet not found or user not logged in.");
          return;
      }
      
      const fromCoin = dbAssets.find(a => a.coins.symbol === fromAsset.symbol)?.coins;
      const toCoin = dbAssets.find(a => a.coins.symbol === toAsset.symbol)?.coins;
      
      if (!fromCoin || !toCoin) {
          alert("Could not identify coins for swap.");
          return;
      }

      const { error } = await supabase.rpc('perform_swap', {
          p_wallet_id: walletId,
          p_from_coin_id: fromCoin.id,
          p_to_coin_id: toCoin.id,
          p_from_amount: fromAmount,
          p_to_amount: toAmount,
          p_from_usd_value: fromAmount * fromAsset.price_raw,
          p_to_usd_value: toAmount * toAsset.price_raw
      });

      if (error) {
          console.error("Swap error:", error);
          alert(`Swap failed: ${error.message}`);
      } else {
          alert("Swap successful!");
          await fetchWalletData(session);
          setPage('wallet');
      }
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      const { error } = await supabase.auth.signOut();
      if (error) {
          console.error('Error logging out:', error.message);
          alert('Could not log out. Please try again.');
      } else {
          setSession(null);
          setAssets([]);
          setDbAssets([]);
          setTransactions([]);
          setWithdrawalRequests([]);
          setSelectedAsset(null);
          setPage('wallet');
          setPreLoginView('landing');
          setWalletId(null);
          setProfile(null);
      }
    }
  };

  const handleUpdateName = async (newName: string) => {
    if (!session?.user) return;
    const { data, error } = await supabase
        .from('profiles')
        .update({ full_name: newName })
        .eq('id', session.user.id)
        .select()
        .single();
    
    if (error) {
        alert(`Error: ${error.message}`);
    } else {
        alert('Name updated successfully!');
        setProfile(data as Profile);
    }
  }

  const handleUpdatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
        alert(`Error: ${error.message}`);
    } else {
        alert('Password updated successfully!');
    }
  }
  
  const navigateToAuth = (view: 'login' | 'signup') => {
    setInitialAuthTab(view);
    setPreLoginView('auth');
  }

  const renderContent = () => {
    if (!session) {
      switch (preLoginView) {
        case 'landing':
          return <LandingPage onNavigateToAuth={navigateToAuth} />;
        case 'auth':
          return <AuthPage initialTab={initialAuthTab} onBackToLanding={() => setPreLoginView('landing')} />;
        default:
          return <LandingPage onNavigateToAuth={navigateToAuth} />;
      }
    }

    if (page === 'admin' && profile?.role === 'admin') {
      return <AdminPanel onBack={() => setPage('wallet')} />;
    }

    const assetTransactions = selectedAsset 
      ? transactions.filter(tx => tx.coins.symbol === selectedAsset.symbol)
      : [];
    
    const assetWithdrawals = selectedAsset
      ? withdrawalRequests.filter(wr => wr.coins.symbol === selectedAsset.symbol)
      : [];

    const mainContent = () => {
      if (selectedAsset && page === 'wallet') {
        return <AssetDetail 
          asset={selectedAsset} 
          onBack={handleBackToWallet} 
          transactions={assetTransactions}
          withdrawalRequests={assetWithdrawals}
          onSendAsset={() => { setPage('sendAsset')}}
          onReceiveAsset={() => { setPage('receiveAsset')}}
          isBalanceVisible={isBalanceVisible}
        />
      }
      
      switch (page) {
        case 'settings':
          return <SettingsPage 
            user={session.user}
            profile={profile}
            onBack={() => setPage('wallet')}
            onUpdateName={handleUpdateName}
            onUpdatePassword={handleUpdatePassword}
            onLogout={handleLogout}
            onNavigateToAdmin={() => setPage('admin')}
          />;
        case 'swap':
          return <SwapPage 
            fromAssets={assets.filter(a => a.balance > 0)}
            toAssets={assets}
            onBack={() => setPage('wallet')}
            onSwap={handleSwap}
          />;
        case 'selectCoin':
          return <CoinSelectionPage 
            assets={assets}
            onBack={handleBackToWallet}
            onSelectCoin={handleCoinSelected}
            action={pageAction}
          />;
        case 'sendAsset':
          return <SendAsset
            asset={selectedAsset!}
            onBack={handleBackToWallet}
            onSend={(details) => handleSendAsset(selectedAsset!.symbol, details)}
          />;
        case 'receiveAsset':
          return <ReceiveAssetPage
            asset={selectedAsset!}
            onBack={handleBackToWallet}
          />;
        default:
          return (
            <>
              <Header 
                onSettingsClick={() => setPage('settings')} 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
              <main className="px-4 pb-4 flex flex-col flex-1 min-h-0 space-y-6">
                {page === 'wallet' ? (
                  <>
                    <BalanceSection 
                      balance={totalBalance} 
                      isLoading={isLoading} 
                      isVisible={isBalanceVisible}
                      onToggleVisibility={() => setIsBalanceVisible(!isBalanceVisible)}
                    />
                    <ActionsSection 
                      onEarnClick={() => setPage('staking')} 
                      onSendClick={handleSendClick} 
                      onReceiveClick={handleReceiveClick}
                      onSwapClick={() => setPage('swap')}
                    />
                    <div className="flex-1 overflow-y-auto -mx-4 px-4 min-h-0">
                      <AssetsList 
                        assets={filteredAssets} 
                        onAssetClick={handleAssetClick} 
                        isLoading={isLoading} 
                        isBalanceVisible={isBalanceVisible}
                      />
                    </div>
                  </>
                ) : (
                  <StakingSection assets={assets} onBack={() => setPage('wallet')} />
                )}
              </main>
            </>
          );
      }
    };
    
    const showNav = !selectedAsset && !['settings', 'selectCoin', 'sendAsset', 'receiveAsset', 'admin'].includes(page);

    return (
      <div className="w-full h-screen md:h-[644px] md:max-w-sm bg-white md:rounded-2xl shadow-lg overflow-hidden flex flex-col font-sans">
        <div className="flex-1 flex flex-col min-h-0">
          {mainContent()}
        </div>
        {showNav && <BottomNav activeView={page} onNavigate={(view) => setPage(view)} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center md:p-4">
       {renderContent()}
    </div>
  );
};

export default App;
