
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from './ui/Card';
import { Spinner } from './ui/Spinner';
import { Transaction, TransactionType, Category } from '../types';
import { XIcon } from '../constants/icons';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  initialType: TransactionType;
}

const expenseCategories = Object.values(Category).filter(c => c !== Category.INCOME);
const incomeCategory = [Category.INCOME];

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onAddTransaction, initialType }) => {
  const { t } = useTranslation();
  const [type, setType] = useState<TransactionType>(initialType);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>(expenseCategories[0]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setType(initialType);
        setDescription('');
        setAmount('');
        setCategory(initialType === TransactionType.DEBIT ? expenseCategories[0] : incomeCategory[0]);
        setDate(new Date().toISOString().slice(0, 10));
        setIsSubmitting(false);
    }
  }, [isOpen, initialType]);

  useEffect(() => {
    if (type === TransactionType.DEBIT) {
      if (!expenseCategories.includes(category)) {
        setCategory(expenseCategories[0]);
      }
    } else { 
        if (category !== Category.INCOME) {
            setCategory(incomeCategory[0]);
        }
    }
  }, [type, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || parseFloat(amount) <= 0 || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddTransaction({
        description,
        amount: parseFloat(amount),
        type,
        category,
        date,
      });
    } catch (error) {
      console.error("Failed to add transaction:", error);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const availableCategories = type === TransactionType.DEBIT ? expenseCategories : incomeCategory;

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-75 z-50 flex justify-center items-center backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <Card className="w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 id="modal-title" className="text-2xl font-bold text-slate-100">{t('transactions.addModalTitle')}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label={t('common.close')} disabled={isSubmitting}>
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <fieldset className="space-y-4" disabled={isSubmitting}>
            <div>
                <legend className="block text-sm font-medium text-slate-300 mb-2">{t('transactions.type')}</legend>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="type" value={TransactionType.DEBIT} checked={type === TransactionType.DEBIT} onChange={() => setType(TransactionType.DEBIT)} className="h-4 w-4 accent-cyan-500 bg-slate-700 border-slate-600 focus:ring-cyan-500 focus:ring-offset-slate-800"/>
                    <span className="text-slate-200">{t('transactions.expense')}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="type" value={TransactionType.CREDIT} checked={type === TransactionType.CREDIT} onChange={() => setType(TransactionType.CREDIT)} className="h-4 w-4 accent-cyan-500 bg-slate-700 border-slate-600 focus:ring-cyan-500 focus:ring-offset-slate-800"/>
                    <span className="text-slate-200">{t('transactions.income')}</span>
                    </label>
                </div>
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">{t('transactions.description')}</label>
                <input id="description" type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-slate-300 mb-2">{t('transactions.amount')}</label>
                    <input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800" required min="0.01" step="0.01" />
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-slate-300 mb-2">{t('transactions.date')}</label>
                    <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800" style={{colorScheme: 'dark'}} required />
                </div>
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-2">{t('transactions.category')}</label>
                <select id="category" value={category} onChange={e => setCategory(e.target.value as Category)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800" required>
                {availableCategories.map(cat => (
                    <option key={cat} value={cat} className="bg-slate-700">{t(`transactions.categories.${cat}` as any)}</option>
                ))}
                </select>
            </div>
          </fieldset>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-800" disabled={isSubmitting}>{t('common.cancel')}</button>
            <button type="submit" className="w-40 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800 flex justify-center items-center" disabled={isSubmitting || !description || !amount}>
              {isSubmitting ? <Spinner className="w-5 h-5" /> : t('transactions.addTransaction')}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};
