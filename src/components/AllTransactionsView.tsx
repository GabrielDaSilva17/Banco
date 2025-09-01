
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Transaction, TransactionType } from '../types';
import { Card } from './ui/Card';
import { ArrowUpIcon, ArrowDownIcon } from '../constants/icons';

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const { i18n } = useTranslation();
  const isCredit = transaction.type === TransactionType.CREDIT;
  const amountColor = isCredit ? 'text-green-400' : 'text-red-400';
  const Icon = isCredit ? ArrowDownIcon : ArrowUpIcon;
  const iconBg = isCredit ? 'bg-green-500/10' : 'bg-red-500/10';
  const iconColor = isCredit ? 'text-green-400' : 'text-red-400';

  const formatCurrency = (amount: number) => {
    const locale = i18n.language === 'pt' ? 'pt-BR' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    const locale = i18n.language === 'pt' ? 'pt-BR' : 'en-US';
    const date = new Date(dateString + 'T00:00:00');
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
  }

  return (
    <li className="flex items-center justify-between py-3">
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div>
                <p className="font-medium text-slate-200">{transaction.description}</p>
                <p className="text-sm text-slate-400">{formatDate(transaction.date)}</p>
            </div>
        </div>
        <p className={`font-semibold ${amountColor}`}>
            {isCredit ? '+' : '-'} {formatCurrency(transaction.amount)}
        </p>
    </li>
  );
};

interface AllTransactionsViewProps {
  transactions: Transaction[];
  onAddTransactionClick: () => void;
}

export const AllTransactionsView: React.FC<AllTransactionsViewProps> = ({ transactions, onAddTransactionClick }) => {
  const { t } = useTranslation();
  
  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-100">{t('transactions.recent')}</h2>
        <button
          onClick={onAddTransactionClick}
          className="px-3 py-1.5 text-sm font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/20 transition-colors"
        >
          + {t('transactions.addTransaction')}
        </button>
      </div>
      <ul className="divide-y divide-slate-700">
        {transactions.length > 0 ? (
          transactions.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))
        ) : (
          <div className="flex items-center justify-center h-48 text-slate-400">
            {t('transactions.noTransactions')}
          </div>
        )}
      </ul>
    </Card>
  );
};