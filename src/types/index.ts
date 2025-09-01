
export enum AccountType {
  CHECKING = 'Checking',
  SAVINGS = 'Savings',
  CREDIT_CARD = 'Credit Card',
}

export interface Account {
  id: string;
  type: AccountType;
  balance: number;
  accountNumber: string;
}

export enum TransactionType {
  DEBIT = 'debit',
  CREDIT = 'credit',
}

export enum Category {
  GROCERIES = 'Groceries',
  UTILITIES = 'Utilities',
  TRANSPORT = 'Transport',
  DINING = 'Dining Out',
  INCOME = 'Income',
  SHOPPING = 'Shopping',
  HEALTH = 'Health',
  ENTERTAINMENT = 'Entertainment',
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
}

export enum Sender {
  USER = 'user',
  AI = 'ai',
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: Sender;
}