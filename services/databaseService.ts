
import { Account, AccountType, Transaction } from '../types';
import { accounts as initialAccounts, transactions as initialTransactions } from '../constants/mockData';

// Simulate a persistent online database with in-memory data.
// Using structuredClone for deep copies to prevent mutations.
let dbAccounts: Account[] = structuredClone(initialAccounts);
let dbTransactions: Transaction[] = structuredClone(initialTransactions);

const SIMULATED_DELAY = 800; // ms

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getAccounts = async (): Promise<Account[]> => {
  await delay(SIMULATED_DELAY);
  // Return a deep copy to simulate fetching from a remote source
  return structuredClone(dbAccounts);
};

export const getTransactions = async (): Promise<Transaction[]> => {
  await delay(SIMULATED_DELAY);
  // Sort by date descending to show the most recent first
  const sortedTransactions = structuredClone(dbTransactions).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return sortedTransactions;
};

export const addTransaction = async (transactionData: Omit<Transaction, 'id'>): Promise<{ newTransaction: Transaction; updatedAccounts: Account[] }> => {
  await delay(SIMULATED_DELAY + 200); // Adding a transaction might take longer

  const newTransaction: Transaction = {
    id: `txn-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    ...transactionData,
  };

  // Prepend to the start of the array
  dbTransactions.unshift(newTransaction);

  // Update the balance of the checking account
  const updatedAccounts = dbAccounts.map(acc => {
    if (acc.type === AccountType.CHECKING) {
      const newBalance = transactionData.type === 'credit'
        ? acc.balance + transactionData.amount
        : acc.balance - transactionData.amount;
      return { ...acc, balance: newBalance };
    }
    return acc;
  });

  dbAccounts = updatedAccounts;

  return {
    newTransaction: structuredClone(newTransaction),
    updatedAccounts: structuredClone(updatedAccounts),
  };
};
