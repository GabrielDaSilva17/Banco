import React from 'react';
import { useTranslation } from 'react-i18next';
import { Account, AccountType } from '../types';
import { Card } from './ui/Card';
import { CreditCardIcon, SavingsIcon, PlusIcon } from '../constants/icons';

interface AccountSummaryProps {
  accounts: Account[];
  onAddMoneyClick: () => void;
}

const getAccountIcon = (type: AccountType) => {
  switch (type) {
    case AccountType.CHECKING:
      return <CreditCardIcon className="w-6 h-6" />;
    case AccountType.SAVINGS:
      return <SavingsIcon className="w-6 h-6" />;
    default:
      return null;
  }
};

export const AccountSummary: React.FC<AccountSummaryProps> = ({ accounts, onAddMoneyClick }) => {
  const { t, i18n } = useTranslation();

  const formatCurrency = (amount: number) => {
    const locale = i18n.language === 'pt' ? 'pt-BR' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-100">{t('accounts.title')}</h2>
        <button
            onClick={onAddMoneyClick}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/20 transition-colors"
        >
            <PlusIcon className="w-4 h-4" />
            {t('accounts.addMoney')}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.map((account) => (
          <Card key={account.id} className="flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-300">{t(`accounts.types.${account.type}`)}</span>
                <div className="text-cyan-400">{getAccountIcon(account.type)}</div>
              </div>
              <p className="text-3xl font-bold tracking-tight text-white">
                {formatCurrency(account.balance)}
              </p>
            </div>
            <p className="text-sm text-slate-400 mt-4">{account.accountNumber}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};