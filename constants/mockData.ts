
import { Account, AccountType, Transaction } from '../types';

export const accounts: Account[] = [
  {
    id: 'acc1',
    type: AccountType.CHECKING,
    balance: 0,
    accountNumber: '**** **** **** 1234',
  },
  {
    id: 'acc2',
    type: AccountType.SAVINGS,
    balance: 0,
    accountNumber: '**** **** **** 5678',
  },
];

export const transactions: Transaction[] = [];
