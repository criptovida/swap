import React, { useState, useMemo } from 'react';
import type { Asset, Transaction, DbTransaction, DbWithdrawalRequest } from '../types';
import { ChevronLeftIcon, ArrowUpIcon, ArrowDownIcon } from './icons';

interface AssetDetailProps {
  asset: Asset;
  onBack: () => void;
  transactions: DbTransaction[];
  withdrawalRequests: DbWithdrawalRequest[];
  onSendAsset: () => void;
  onReceiveAsset: () => void;
  isBalanceVisible: boolean;
}

const ActionButton: React.FC<{icon: React.ReactNode; label: string; onClick?: () => void}> = ({ icon, label, onClick }) => (
    <div className="flex flex-col items-center space-y-2">
      <button onClick={onClick} className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-200 transition-colors">
        {icon}
      </button>
      <span className="text-sm font-medium">{label}</span>
    </div>
);

const TransactionItem: React.FC<{transaction: Transaction}> = ({ transaction }) => {
    const isReceived = transaction.type === 'Received';
    
    let statusColor = 'text-gray-500';
    let statusText: string | null | undefined = transaction.status;

    if (transaction.status === 'pending') {
        statusColor = 'text-yellow-500';
        statusText = 'Pending Approval';
    } else if (transaction.status === 'Failed' || transaction.status === 'rejected') {
        statusColor = 'text-red-500';
    } else if (transaction.status === 'approved') {
        statusColor = 'text-green-500';
    }

    return (
        <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <div>
                <p className="font-semibold capitalize">{transaction.type} {transaction.network ? `(${transaction.network})` : ''}</p>
                <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                    {statusText && statusText !== 'Completed' && (
                        <>
                            <span className="text-gray-300">•</span>
                            <p className={`text-sm font-medium capitalize ${statusColor}`}>{statusText}</p>
                        </>
                    )}
                </div>
            </div>
            <div className="text-right">
                <p className={`font-semibold ${isReceived ? 'text-green-600' : 'text-gray-900'}`}>{transaction.amount}</p>
                <p className="text-sm text-gray-500">{transaction.usdValue}</p>
            </div>
        </div>
    )
}

const formatTransactionForDisplay = (tx: DbTransaction): Transaction & { rawDate: string } => {
    const isSent = tx.type === 'Sent';
    const prefix = isSent ? '-' : '+';
    const usdPrefix = isSent ? '-$' : '+$';
    return {
        id: tx.id,
        type: tx.type,
        date: new Date(tx.created_at).toLocaleDateString(),
        amount: `${prefix}${tx.amount} ${tx.coins.symbol}`,
        usdValue: `${usdPrefix}${tx.usd_value_at_time?.toFixed(2) ?? tx.amount.toFixed(2)}`,
        status: tx.status,
        network: tx.network,
        rawDate: tx.created_at,
    }
}

const formatWithdrawalForDisplay = (wr: DbWithdrawalRequest): Transaction & { rawDate: string } => {
    return {
        id: wr.id,
        type: 'Withdrawal Request',
        date: new Date(wr.created_at).toLocaleDateString(),
        amount: `-${wr.amount} ${wr.coins.symbol}`,
        usdValue: `-$${wr.amount.toFixed(2)}`,
        status: wr.status,
        network: wr.network,
        rawDate: wr.created_at,
    }
}

const AssetDetail: React.FC<AssetDetailProps> = ({ asset, onBack, transactions, withdrawalRequests, onSendAsset, onReceiveAsset, isBalanceVisible }) => {
    
  const displayHistory = useMemo(() => {
    const formattedTxs = transactions.map(formatTransactionForDisplay);
    const formattedWrs = withdrawalRequests.map(formatWithdrawalForDisplay);
    
    return [...formattedTxs, ...formattedWrs]
        .sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());
  }, [transactions, withdrawalRequests]);

  return (
    <div className="p-4 flex flex-col h-full bg-white">
      {/* Header */}
      <header className="flex items-center mb-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-3 ml-4">
          {React.cloneElement(asset.icon, { className: "w-8 h-8" })}
          <h2 className="text-2xl font-bold">{asset.name}</h2>
        </div>
      </header>

      {/* Balance */}
      <section className="text-center my-4">
        <p className="text-4xl font-bold tracking-tight">
          {asset.amount} {asset.symbol}
        </p>
        <p className="text-gray-500 text-lg mt-1">{isBalanceVisible ? asset.usdValue : '∗∗∗∗∗∗'}</p>
      </section>

      {/* Actions */}
      <section className="grid grid-cols-2 gap-4 my-6 px-8">
        <ActionButton icon={<ArrowUpIcon className="w-7 h-7" />} label="Send" onClick={onSendAsset} />
        <ActionButton icon={<ArrowDownIcon className="w-7 h-7" />} label="Receive" onClick={onReceiveAsset} />
      </section>

      {/* Transaction History */}
      <section className="flex-1 overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 px-1">Transactions</h3>
        {displayHistory.length > 0 ? (
          <div className="space-y-1">
            {displayHistory.map(tx => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>You have no {asset.symbol} transactions.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default AssetDetail;