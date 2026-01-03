import type React from 'react';

// Type for data used in UI components
export interface Asset {
  name: string;
  symbol: string;
  icon: React.ReactElement<{ className?: string }>;
  price: string;
  price_raw: number; // Raw price for calculations
  change: string;
  changeType: 'positive' | 'negative';
  amount: string;
  balance: number;
  usdValue: string;
  coingeckoId: string;
}

// --- Database Types ---
export interface Profile {
  id: string;
  full_name: string | null;
  created_at: string;
  role: 'user' | 'admin';
}

export interface DbCoin {
  id: string;
  symbol: string;
  name: string;
  coingecko_id: string;
  logo_url: string;
}

export interface DbAsset {
  id: string;
  wallet_id: string;
  coin_id: string;
  balance: number;
  coins: DbCoin; // from the join
}

export interface DbTransaction {
  id: string;
  wallet_id: string;
  coin_id: string;
  type: 'Sent' | 'Received';
  amount: number;
  usd_value_at_time: number | null;
  status: 'Completed' | 'Failed' | null;
  network: string | null;
  to_address: string | null;
  created_at: string;
  coins: DbCoin; // from the join
}

export interface DbWithdrawalRequest {
  id: string;
  user_id: string;
  wallet_id: string;
  coin_id: string;
  amount: number;
  to_address: string;
  network: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  coins: DbCoin; // from the join
}


// A unified type for displaying items in the transaction history list.
export interface Transaction {
  id: string;
  type: 'Sent' | 'Received' | 'Withdrawal Request';
  date: string;
  amount: string;
  usdValue: string;
  status?: 'Completed' | 'Failed' | 'pending' | 'approved' | 'rejected' | null;
  network?: string | null;
}

// --- Admin Panel Types ---
export type AdminView = 'dashboard' | 'users' | 'withdrawals' | 'coins';

export interface AdminUser {
  id: string;
  email: string | undefined;
  full_name: string | null;
  role: 'user' | 'admin';
  created_at: string;
  wallet_id: string | null;
}

export interface AdminAsset extends DbAsset {
  // Inherits from DbAsset and adds nothing new for now,
  // but created for future expansion.
}

export interface AdminFullWithdrawalRequest extends DbWithdrawalRequest {
    profiles: { full_name: string | null } | null;
}