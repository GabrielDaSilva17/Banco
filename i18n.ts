import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const enTranslation = {
  "common": {
    "cancel": "Cancel",
    "close": "Close",
    "loading": "Loading..."
  },
  "language": {
    "english": "English",
    "portuguese": "Português"
  },
  "accounts": {
    "title": "Accounts",
    "addMoney": "Add Money",
    "types": {
      "Checking": "Checking",
      "Savings": "Savings",
      "Credit Card": "Credit Card"
    }
  },
  "transactions": {
    "recent": "Recent Transactions",
    "addExpense": "Add Expense",
    "noTransactions": "No transactions yet.",
    "addModalTitle": "Add Transaction",
    "type": "Transaction Type",
    "expense": "Expense",
    "income": "Income",
    "description": "Description",
    "amount": "Amount",
    "date": "Date",
    "category": "Category",
    "addTransaction": "Add Transaction",
    "categories": {
      "Groceries": "Groceries",
      "Utilities": "Utilities",
      "Transport": "Transport",
      "Dining Out": "Dining Out",
      "Income": "Income",
      "Shopping": "Shopping",
      "Health": "Health",
      "Entertainment": "Entertainment"
    }
  },
  "spendingChart": {
    "title": "Spending by Category",
    "noData": "No spending data available."
  },
  "aiAssistant": {
    "title": "AI Financial Assistant",
    "initialMessage": "Hello! I am your AI financial assistant. Ask me anything about your transactions.",
    "inputPlaceholder": "Ask about your spending...",
    "errorMessage": "Sorry, I am having trouble connecting. Please try again."
  }
};

const ptTranslation = {
  "common": {
    "cancel": "Cancelar",
    "close": "Fechar",
    "loading": "Carregando..."
  },
  "language": {
    "english": "English",
    "portuguese": "Português"
  },
  "accounts": {
    "title": "Contas",
    "addMoney": "Adicionar Dinheiro",
    "types": {
      "Checking": "Conta Corrente",
      "Savings": "Poupança",
      "Credit Card": "Cartão de Crédito"
    }
  },
  "transactions": {
    "recent": "Transações Recentes",
    "addExpense": "Adicionar Despesa",
    "noTransactions": "Nenhuma transação ainda.",
    "addModalTitle": "Adicionar Transação",
    "type": "Tipo de Transação",
    "expense": "Despesa",
    "income": "Receita",
    "description": "Descrição",
    "amount": "Valor",
    "date": "Data",
    "category": "Categoria",
    "addTransaction": "Adicionar Transação",
    "categories": {
      "Groceries": "Supermercado",
      "Utilities": "Contas",
      "Transport": "Transporte",
      "Dining Out": "Restaurantes",
      "Income": "Receita",
      "Shopping": "Compras",
      "Health": "Saúde",
      "Entertainment": "Lazer"
    }
  },
  "spendingChart": {
    "title": "Gastos por Categoria",
    "noData": "Nenhum dado de gastos disponível."
  },
  "aiAssistant": {
    "title": "Assistente Financeiro IA",
    "initialMessage": "Olá! Eu sou seu assistente financeiro de IA. Pergunte-me qualquer coisa sobre suas transações.",
    "inputPlaceholder": "Pergunte sobre seus gastos...",
    "errorMessage": "Desculpe, estou com problemas para me conectar. Por favor, tente novamente."
  }
};


i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    debug: false,
    resources: {
      en: {
        translation: enTranslation,
      },
      pt: {
        translation: ptTranslation,
      },
    },
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

export default i18next;