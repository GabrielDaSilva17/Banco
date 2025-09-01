
import React, { useState, useEffect } from 'react';
import { AccountSummary } from './components/AccountSummary';
import { RecentTransactions } from './components/RecentTransactions';
import { SpendingChart } from './components/SpendingChart';
import { AIAssistant } from './components/AIAssistant';
import { Header } from './components/Header';
import { AddTransactionModal } from './components/AddTransactionModal';
import { Spinner } from './components/ui/Spinner';
import * as dbService from './services/databaseService';
import { Transaction, Account, TransactionType } from './types';
import { BottomNavBar } from './components/BottomNavBar';
import { AllTransactionsView } from './components/AllTransactionsView';

type View = 'dashboard' | 'transactions' | 'ai';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialTransactionType, setInitialTransactionType] = useState<TransactionType>(TransactionType.DEBIT);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>('dashboard');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [fetchedAccounts, fetchedTransactions] = await Promise.all([
          dbService.getAccounts(),
          dbService.getTransactions(),
        ]);
        setAccounts(fetchedAccounts);
        setTransactions(fetchedTransactions);
        setError(null);
      } catch (err) {
        setError('Failed to load financial data. Please try refreshing the page.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    const { newTransaction, updatedAccounts } = await dbService.addTransaction(transactionData);
    setTransactions(prev => [newTransaction, ...prev]);
    setAccounts(updatedAccounts);
    setIsModalOpen(false);
  };

  const handleOpenModal = (type: TransactionType) => {
    setInitialTransactionType(type);
    setIsModalOpen(true);
  };

  const renderMobileView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <AccountSummary 
              accounts={accounts} 
              onAddMoneyClick={() => handleOpenModal(TransactionType.CREDIT)}
            />
            <SpendingChart transactions={transactions} />
            <RecentTransactions
              transactions={transactions}
              onAddExpenseClick={() => handleOpenModal(TransactionType.DEBIT)}
            />
          </div>
        );
      case 'transactions':
        return (
          <AllTransactionsView 
            transactions={transactions} 
            onAddTransactionClick={() => handleOpenModal(TransactionType.DEBIT)} 
          />
        );
      case 'ai':
        return <AIAssistant transactions={transactions} isMobileView={true} />;
      default:
        return null;
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-slate-200">
        <Spinner className="w-10 h-10 text-cyan-400 mb-4" />
        <p className="text-lg">Loading your financial dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-red-400">
         <p className="text-lg">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
        <Header />
        <main className="p-4 sm:p-6 lg:p-8 lg:pb-8 pb-24">
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-2 space-y-8">
              <AccountSummary 
                accounts={accounts} 
                onAddMoneyClick={() => handleOpenModal(TransactionType.CREDIT)}
              />
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <RecentTransactions
                  transactions={transactions}
                  onAddExpenseClick={() => handleOpenModal(TransactionType.DEBIT)}
                />
                <SpendingChart transactions={transactions} />
              </div>
            </div>
            <div className="lg:col-span-1">
              <AIAssistant transactions={transactions} isMobileView={false} />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden">
            {renderMobileView()}
          </div>
        </main>
      </div>
      <div className="lg:hidden">
         <BottomNavBar activeView={activeView} setActiveView={setActiveView} />
      </div>
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTransaction={handleAddTransaction}
        initialType={initialTransactionType}
      />
    </>
  );
};

export default App;