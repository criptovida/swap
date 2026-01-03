
import React, { useState, useEffect, useMemo, FC } from 'react';
import { supabase } from '../supabaseClient';
import type { AdminView, AdminUser, AdminAsset, AdminFullWithdrawalRequest, DbCoin, Profile } from '../types';
import { ChartBarIcon, UserGroupIcon, CreditCardSolidIcon, CubeIcon, ArrowRightOnRectangleIcon, XIcon, SearchIcon, BellIcon } from './icons';

const NotificationBanner: FC<{ message: { msg: string, type: 'success' | 'error' | 'info' } | null, onClear: () => void }> = ({ message, onClear }) => {
    if (!message) return null;
    const colors = {
        success: 'bg-green-100 text-green-800 border-green-200',
        error: 'bg-red-100 text-red-800 border-red-200',
        info: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return (
        <div className={`fixed top-4 right-4 z-[100] p-4 rounded-lg border shadow-lg flex items-center space-x-3 animate-in fade-in slide-in-from-top-4 duration-300 ${colors[message.type]}`}>
            <BellIcon className="w-5 h-5" />
            <span className="font-medium">{message.msg}</span>
            <button onClick={onClear} className="p-1 hover:bg-black/5 rounded-full"><XIcon className="w-4 h-4" /></button>
        </div>
    );
};

const StatCard: FC<{ title: string; value: string; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
        <div className="bg-blue-100 text-blue-600 p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

const AdminDashboard: FC<{ users: AdminUser[], withdrawals: AdminFullWithdrawalRequest[] }> = ({ users, withdrawals }) => {
    const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard title="Total Users" value={users.length.toString()} icon={<UserGroupIcon className="w-6 h-6" />} />
                <StatCard title="Pending Withdrawals" value={pendingWithdrawals.toString()} icon={<CreditCardSolidIcon className="w-6 h-6" />} />
            </div>
        </div>
    );
};

const AdminUserManagement: FC<{ 
    users: AdminUser[], 
    onRefetch: () => void, 
    coinPrices: { [key: string]: { usd: number } }, 
    allAssets: AdminAsset[],
    notify: (msg: string, type?: 'success' | 'error' | 'info') => void
}> = ({ users: initialUsers, onRefetch, coinPrices, allAssets, notify }) => {
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [userAssets, setUserAssets] = useState<AdminAsset[]>([]);
    const [isLoadingAssets, setIsLoadingAssets] = useState(false);
    
    useEffect(() => {
        setUsers(initialUsers);
    }, [initialUsers]);

    useEffect(() => {
      const filtered = initialUsers.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setUsers(filtered);
    }, [searchTerm, initialUsers]);

    const userBalances = useMemo(() => {
        const balances: { [walletId: string]: number } = {};
        if (!allAssets.length || !Object.keys(coinPrices).length) {
            return balances;
        }

        for (const asset of allAssets) {
            const priceData = coinPrices[asset.coins.coingecko_id];
            const price = priceData?.usd ?? 0;
            const value = asset.balance * price;
            
            if (!balances[asset.wallet_id]) {
                balances[asset.wallet_id] = 0;
            }
            balances[asset.wallet_id] += value;
        }
        return balances;
    }, [allAssets, coinPrices]);

    const handleSelectUser = async (user: AdminUser) => {
        setSelectedUser(user);
        if (!user.wallet_id) {
            notify("This user does not have a wallet associated with them.", 'info');
            setUserAssets([]);
            return;
        }
        setIsLoadingAssets(true);
        const assetsForUser = allAssets.filter(asset => asset.wallet_id === user.wallet_id);
        setUserAssets(assetsForUser);
        setIsLoadingAssets(false);
    };

    const handleUpdateRole = async (userId: string, newRole: 'user' | 'admin') => {
        const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
        if (error) {
            notify(`Error updating role: ${error.message}`, 'error');
        } else {
            notify('Role updated successfully.', 'success');
            onRefetch();
            setSelectedUser(null);
        }
    };
    
    const handleAdjustBalance = async (asset: AdminAsset, amount: number, reason: string) => {
        if (!selectedUser) return;
        if (!reason) {
            notify('A reason is required for balance adjustments.', 'error');
            return;
        }
        
        const { error } = await supabase.rpc('adjust_user_balance', {
            p_asset_id: asset.id,
            p_amount_change: amount,
            p_reason: reason
        });

        if (error) {
             notify(`Failed to adjust balance: ${error.message}`, 'error');
        } else {
            notify('Balance adjusted successfully!', 'success');
            await onRefetch(); 
            const { data: updatedAssets } = await supabase
                .from('assets')
                .select('*, coins(*)')
                .eq('wallet_id', selectedUser.wallet_id);
            if (updatedAssets) {
                setUserAssets(updatedAssets as AdminAsset[]);
            }
        }
    }

    const handleCreditUsdtZ = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedUser) return;

        const formData = new FormData(e.currentTarget);
        const amount = parseFloat(formData.get('amount') as string);
        const reason = formData.get('reason') as string;
        e.currentTarget.reset();

        if (isNaN(amount) || amount <= 0) {
            notify('Please enter a valid positive amount.', 'error');
            return;
        }
        if (!reason.trim()) {
            notify('Please provide a reason for the credit.', 'error');
            return;
        }

        const { error } = await supabase.rpc('credit_usdt_z', {
            p_user_id: selectedUser.id,
            p_amount: amount,
            p_reason: reason
        });

        if (error) {
            notify(`Failed to credit USDT.Z: ${error.message}`, 'error');
        } else {
            notify('USDT.Z credited successfully!', 'success');
            if(selectedUser.wallet_id) {
                const { data: updatedAssets } = await supabase
                    .from('assets')
                    .select('*, coins(*)')
                    .eq('wallet_id', selectedUser.wallet_id);
                if (updatedAssets) {
                    setUserAssets(updatedAssets as AdminAsset[]);
                }
            }
            onRefetch();
        }
    };


    const totalUsdBalance = useMemo(() => {
        if (!userAssets.length || !Object.keys(coinPrices).length) return 0;
        return userAssets.reduce((total, asset) => {
            const priceData = coinPrices[asset.coins.coingecko_id];
            const price = priceData?.usd ?? 0;
            return total + (asset.balance * price);
        }, 0);
    }, [userAssets, coinPrices]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <div className="relative mb-4">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border rounded-lg py-2 pl-10 pr-4"
                />
            </div>
            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance (USD)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.full_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.wallet_id ? `$${(userBalances[user.wallet_id] || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleSelectUser(user)} className="text-indigo-600 hover:text-indigo-900">Manage</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-bold">Manage User: {selectedUser.full_name}</h3>
                            <button onClick={() => setSelectedUser(null)}><XIcon className="w-6 h-6" /></button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div><strong>Email:</strong> {selectedUser.email || 'N/A'}</div>
                            <div>
                                <strong>Role:</strong>
                                <select
                                    value={selectedUser.role}
                                    onChange={(e) => handleUpdateRole(selectedUser.id, e.target.value as 'user' | 'admin')}
                                    className="ml-2 border rounded p-1"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            
                            <h4 className="font-bold pt-4 border-t">Assets</h4>
                            <div className="p-3 bg-gray-200 rounded-lg text-center">
                                <span className="text-sm font-medium text-gray-600">Total Wallet Value</span>
                                <p className="text-xl font-bold">${totalUsdBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>

                            {isLoadingAssets ? <p>Loading assets...</p> : (
                                <div className="space-y-2">
                                    {userAssets.map(asset => {
                                        const priceData = coinPrices[asset.coins.coingecko_id];
                                        const price = priceData?.usd ?? 0;
                                        const usdValue = asset.balance * price;
                                        return (
                                            <div key={asset.id} className="bg-gray-100 p-3 rounded-lg">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="font-semibold">{asset.coins.name} ({asset.coins.symbol})</p>
                                                        <p className="text-sm text-gray-600">Balance: {asset.balance.toLocaleString(undefined, { maximumFractionDigits: 8 })}</p>
                                                    </div>
                                                    <p className="text-lg font-semibold text-gray-800">${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                                </div>
                                                <form onSubmit={(e) => {
                                                    e.preventDefault();
                                                    const amount = parseFloat(e.currentTarget.amount.value);
                                                    const reason = e.currentTarget.reason.value;
                                                    handleAdjustBalance(asset, amount, reason);
                                                    e.currentTarget.reset();
                                                }} className="flex items-center space-x-2 mt-2 pt-2 border-t">
                                                    <input type="number" name="amount" step="any" placeholder="e.g. 10 or -5" className="border rounded px-2 py-1 w-32 text-sm" required/>
                                                    <input type="text" name="reason" placeholder="Reason for adjustment" className="border rounded px-2 py-1 flex-1 text-sm" required/>
                                                    <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm font-semibold">Adjust</button>
                                                </form>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                             <div className="pt-4 mt-4 border-t">
                                <h4 className="font-bold">Credit USDT.Z</h4>
                                <p className="text-sm text-gray-500 mb-2">Manually credit a user with USDT.Z. This will create a "Received" transaction for them.</p>
                                <form onSubmit={handleCreditUsdtZ} className="flex items-center space-x-2 mt-2">
                                    <input 
                                        type="number" 
                                        name="amount" 
                                        step="any" 
                                        placeholder="Amount to credit" 
                                        className="border rounded px-2 py-1 w-40 text-sm" 
                                        required 
                                    />
                                    <input 
                                        type="text" 
                                        name="reason" 
                                        placeholder="Reason (e.g., bonus, correction)" 
                                        className="border rounded px-2 py-1 flex-1 text-sm" 
                                        required 
                                    />
                                    <button 
                                        type="submit" 
                                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm font-semibold"
                                    >
                                        Credit
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const AdminWithdrawalManagement: FC<{ 
    withdrawals: AdminFullWithdrawalRequest[], 
    onRefetch: () => void,
    notify: (msg: string, type?: 'success' | 'error' | 'info') => void
}> = ({ withdrawals: allWithdrawals, onRefetch, notify }) => {
    const [filter, setFilter] = useState<'pending' | 'all'>('pending');
    const [processingId, setProcessingId] = useState<string | null>(null);
    
    const withdrawals = useMemo(() => {
        return filter === 'pending'
            ? allWithdrawals.filter(w => w.status === 'pending')
            : allWithdrawals;
    }, [filter, allWithdrawals]);

    const handleAction = async (req: AdminFullWithdrawalRequest, action: 'approve' | 'reject') => {
        setProcessingId(req.id);
        try {
            if (action === 'reject') {
                const { error } = await supabase.rpc('reject_withdrawal', {
                    p_request_id: req.id
                });
                if (error) throw error;
                notify('Request successfully rejected.', 'success');
            } else if (action === 'approve') {
                const { error } = await supabase.rpc('approve_withdrawal', {
                    p_request_id: req.id
                });
                if (error) throw error; 
                notify('Withdrawal approved successfully.', 'success');
            }
        } catch (error: any) {
            console.error(`Admin Withdrawal Error (${action}):`, error);
            notify(`Operation failed: ${error.message || 'Unknown error occurred.'}`, 'error');
        } finally {
            setProcessingId(null);
            onRefetch(); 
        }
    };
    
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Withdrawal Requests</h2>
            <div className="mb-4">
                <button onClick={() => setFilter('pending')} className={`px-3 py-1 rounded-lg mr-2 ${filter === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Pending</button>
                <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-lg ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>All</button>
            </div>
            <div className="bg-white shadow rounded-lg overflow-x-auto">
                 <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {withdrawals.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">No withdrawal requests found.</td>
                            </tr>
                        ) : withdrawals.map(req => (
                            <tr key={req.id}>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{req.profiles?.full_name || 'N/A'}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{req.coins.symbol} ({req.network})</td>
                                <td className="px-6 py-4 text-sm font-semibold">{req.amount}</td>
                                <td className="px-6 py-4 text-sm font-mono truncate max-w-xs">{req.to_address}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                                        req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        req.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-sm space-x-2">
                                    {req.status === 'pending' && (
                                        <>
                                            <button 
                                                onClick={() => handleAction(req, 'approve')} 
                                                disabled={processingId === req.id}
                                                className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-3 py-1 rounded text-xs font-bold transition-colors"
                                            >
                                                {processingId === req.id ? '...' : 'Approve'}
                                            </button>
                                            <button 
                                                onClick={() => handleAction(req, 'reject')} 
                                                disabled={processingId === req.id}
                                                className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-1 rounded text-xs font-bold transition-colors"
                                            >
                                                {processingId === req.id ? '...' : 'Reject'}
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AdminCoinManagement: FC<{ 
    coins: DbCoin[], 
    onRefetch: () => void,
    notify: (msg: string, type?: 'success' | 'error' | 'info') => void
}> = ({ coins, onRefetch, notify }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoin, setEditingCoin] = useState<DbCoin | null>(null);

    const openModal = (coin: DbCoin | null = null) => {
        setEditingCoin(coin);
        setIsModalOpen(true);
    }
    
    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const coinData = {
            id: editingCoin?.id,
            name: formData.get('name') as string,
            symbol: formData.get('symbol') as string,
            coingecko_id: formData.get('coingecko_id') as string,
            logo_url: formData.get('logo_url') as string,
        };

        const { error } = await supabase.from('coins').upsert(coinData);
        if (error) {
            notify(`Error saving coin: ${error.message}`, 'error');
        } else {
            notify('Coin saved successfully!', 'success');
            setIsModalOpen(false);
            onRefetch();
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Coin Management</h2>
                <button onClick={() => openModal()} className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">Add New Coin</button>
            </div>
            <div className="bg-white shadow rounded-lg overflow-x-auto">
                 <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CoinGecko ID</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {coins.map(coin => (
                            <tr key={coin.id}>
                                <td className="px-6 py-4"><img src={coin.logo_url} alt={coin.name} className="w-8 h-8"/></td>
                                <td className="px-6 py-4">{coin.name}</td>
                                <td className="px-6 py-4">{coin.symbol}</td>
                                <td className="px-6 py-4">{coin.coingecko_id}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => openModal(coin)} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-bold">{editingCoin ? 'Edit Coin' : 'Add New Coin'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><XIcon className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-4 space-y-4">
                            <input type="text" name="name" defaultValue={editingCoin?.name || ''} placeholder="Name (e.g. Bitcoin)" className="w-full border rounded p-2" required />
                            <input type="text" name="symbol" defaultValue={editingCoin?.symbol || ''} placeholder="Symbol (e.g. BTC)" className="w-full border rounded p-2" required />
                            <input type="text" name="coingecko_id" defaultValue={editingCoin?.coingecko_id || ''} placeholder="coingecko_id (e.g. bitcoin)" className="w-full border rounded p-2" required />
                            <input type="text" name="logo_url" defaultValue={editingCoin?.logo_url || ''} placeholder="Logo URL" className="w-full border rounded p-2" required />
                            <div className="text-right">
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold">Save Coin</button>
                            </div>
                        </form>
                    </div>
                 </div>
            )}
        </div>
    );
};


const AdminSidebar: FC<{ activeView: AdminView, setActiveView: (view: AdminView) => void, onBack: () => void }> = ({ activeView, setActiveView, onBack }) => {
    const navItems: { view: AdminView, label: string, icon: React.ReactNode }[] = [
        { view: 'dashboard', label: 'Dashboard', icon: <ChartBarIcon className="w-6 h-6" /> },
        { view: 'users', label: 'Users', icon: <UserGroupIcon className="w-6 h-6" /> },
        { view: 'withdrawals', label: 'Withdrawals', icon: <CreditCardSolidIcon className="w-6 h-6" /> },
        { view: 'coins', label: 'Coins', icon: <CubeIcon className="w-6 h-6" /> },
    ];
    return (
        <div className="bg-gray-800 text-white w-64 p-4 flex flex-col">
            <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
            <nav className="flex-1 space-y-2">
                {navItems.map(item => (
                    <button
                        key={item.view}
                        onClick={() => setActiveView(item.view)}
                        className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left ${activeView === item.view ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
            <button onClick={onBack} className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 text-left mt-4">
                <ArrowRightOnRectangleIcon className="w-6 h-6" />
                <span>Exit Admin</span>
            </button>
        </div>
    );
};

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
    const [activeView, setActiveView] = useState<AdminView>('dashboard');
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [withdrawals, setWithdrawals] = useState<AdminFullWithdrawalRequest[]>([]);
    const [coins, setCoins] = useState<DbCoin[]>([]);
    const [allAssets, setAllAssets] = useState<AdminAsset[]>([]);
    const [coinPrices, setCoinPrices] = useState<{[key: string]: { usd: number }}>({});
    const [feedback, setFeedback] = useState<{ msg: string, type: 'success' | 'error' | 'info' } | null>(null);

    const notify = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
        setFeedback({ msg, type });
        setTimeout(() => setFeedback(null), 5000);
    };

    const fetchData = async () => {
        setIsLoading(true);

        const [usersRes, withdrawalsRes, coinsRes, assetsRes] = await Promise.all([
            supabase.rpc('get_admin_user_data'),
            supabase.from('withdrawal_requests').select('*, coins(*), profiles!user_id(full_name)').order('created_at', { ascending: false }),
            supabase.from('coins').select('*'),
            supabase.from('assets').select('*, coins(*)') 
        ]);

        if (usersRes.error) {
            console.error("Admin Panel: Error fetching user data:", usersRes.error.message);
        } else if (usersRes.data) {
            setUsers(usersRes.data as AdminUser[]);
        }

        if (withdrawalsRes.error) {
            console.error("Admin Panel: Error fetching withdrawals:", withdrawalsRes.error.message);
        } else if (withdrawalsRes.data) {
            setWithdrawals(withdrawalsRes.data as AdminFullWithdrawalRequest[]);
        }
        
        if (assetsRes.error) {
            console.error("Admin Panel: Error fetching all assets:", assetsRes.error.message);
        } else if (assetsRes.data) {
            setAllAssets(assetsRes.data as AdminAsset[]);
        }

        if (coinsRes.error) {
            console.error("Admin Panel: Error fetching coins:", coinsRes.error.message);
        } else if (coinsRes.data) {
            setCoins(coinsRes.data);
            const ids = coinsRes.data.map(c => c.coingecko_id).filter(Boolean).join(',');
            if (ids) {
                try {
                    const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
                    const priceResponse = await fetch(apiUrl);
                    if (priceResponse.ok) {
                        const priceData = await priceResponse.json();
                        setCoinPrices(priceData);
                    } else {
                        console.error("Failed to fetch coin prices for admin panel:", priceResponse.statusText);
                        setCoinPrices({});
                    }
                } catch (error) {
                    console.error("Error fetching coin prices:", error);
                    setCoinPrices({});
                }
            }
        }
        
        setIsLoading(false);
    };

    useEffect(() => {
        const fetchAdminData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                fetchData();
            } else {
                console.error("Admin Panel: No active session. Cannot fetch admin data.");
                setIsLoading(false);
            }
        };
        fetchAdminData();
    }, []);

    const renderContent = () => {
        if (isLoading) return <div className="p-8 flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

        switch (activeView) {
            case 'dashboard': return <AdminDashboard users={users} withdrawals={withdrawals} />;
            case 'users': return <AdminUserManagement users={users} coinPrices={coinPrices} allAssets={allAssets} onRefetch={fetchData} notify={notify} />;
            case 'withdrawals': return <AdminWithdrawalManagement withdrawals={withdrawals} onRefetch={fetchData} notify={notify} />;
            case 'coins': return <AdminCoinManagement coins={coins} onRefetch={fetchData} notify={notify} />;
            default: return <p>Select a section</p>;
        }
    };

    return (
        <div className="w-full h-full flex bg-gray-100 relative">
            <NotificationBanner message={feedback} onClear={() => setFeedback(null)} />
            <AdminSidebar activeView={activeView} setActiveView={setActiveView} onBack={onBack} />
            <main className="flex-1 p-6 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminPanel;
