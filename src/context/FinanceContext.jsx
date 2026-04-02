import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const FinanceContext = createContext();

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within a FinanceProvider');
  return context;
};

const INITIAL_TRANSACTIONS = [
  { id: 1, date: '2026-03-28', amount: 3500.00, category: 'Salary', type: 'income', description: 'Monthly income from Freelancing' },
  { id: 2, date: '2026-03-29', amount: 120.50, category: 'Food', type: 'expense', description: 'Dinner at Steakhouse' },
  { id: 3, date: '2026-03-30', amount: 45.00, category: 'Transportation', type: 'expense', description: 'Uber to Airport' },
  { id: 4, date: '2026-03-31', amount: 200.00, category: 'Entertainment', type: 'expense', description: 'Concert ticket' },
  { id: 5, date: '2026-04-01', amount: 50.00, category: 'Shopping', type: 'expense', description: 'Pharmacy' },
  { id: 6, date: '2026-04-01', amount: 1500.00, category: 'Investment', type: 'income', description: 'Stock Dividend' },
  { id: 7, date: '2026-04-02', amount: 300.00, category: 'Utilities', type: 'expense', description: 'Electricity Bill' },
  { id: 8, date: '2026-04-02', amount: 85.00, category: 'Food', type: 'expense', description: 'Grocery shopping' },
];

export const FinanceProvider = ({ children }) => {
  const [role, setRole] = useState(() => localStorage.getItem('finance_role') || 'admin');
  const [theme, setTheme] = useState(() => localStorage.getItem('finance_theme') || 'dark');
  const [activeView, setActiveView] = useState('Dashboard');
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finance_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    type: 'all',
    sortOrder: 'newest'
  });

  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('finance_theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  // Derived state: Summary stats
  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;
    
    return { income, expenses, balance };
  }, [transactions]);

  // Derived state: Categorical breakdown for charts
  const categoryData = useMemo(() => {
    const categories = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });
    
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  // Derived state: Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(filters.search.toLowerCase()) || 
                            t.category.toLowerCase().includes(filters.search.toLowerCase());
        const matchesType = filters.type === 'all' || t.type === filters.type;
        const matchesCategory = filters.category === 'all' || t.category === filters.category;
        return matchesSearch && matchesType && matchesCategory;
      })
      .sort((a, b) => {
        if (filters.sortOrder === 'newest') return new Date(b.date) - new Date(a.date);
        if (filters.sortOrder === 'oldest') return new Date(a.date) - new Date(b.date);
        if (filters.sortOrder === 'highest') return b.amount - a.amount;
        return a.amount - b.amount;
      });
  }, [transactions, filters]);

  // Derived state: Insights
  const insights = useMemo(() => {
    if (categoryData.length === 0) return { highestCategory: 'None', topSpending: 0, efficiency: 'N/A', diff: 0 };
    
    const sorted = [...categoryData].sort((a, b) => b.value - a.value);
    
    // Simple monthly comparison logic
    const currentMonth = new Date().getMonth();
    const currentMonthExpenses = transactions
      .filter(t => new Date(t.date).getMonth() === currentMonth && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const prevMonthExpenses = transactions
      .filter(t => new Date(t.date).getMonth() === (currentMonth - 1 + 12) % 12 && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const diff = prevMonthExpenses ? ((prevMonthExpenses - currentMonthExpenses) / prevMonthExpenses * 100).toFixed(1) : 0;
    
    return {
      highestCategory: sorted[0].name,
      topSpending: sorted[0].value,
      totalCount: transactions.length,
      averageExpense: stats.expenses / (transactions.filter(t => t.type === 'expense').length || 1),
      efficiency: diff > 0 ? 'Higher' : 'Lower',
      diff: Math.abs(diff)
    };
  }, [categoryData, transactions, stats]);

  const addTransaction = (t) => {
    if (role !== 'admin') return alert('Only admins can add transactions');
    setTransactions(prev => [{ ...t, id: Date.now() }, ...prev]);
  };

  const deleteTransaction = (id) => {
    if (role !== 'admin') return alert('Only admins can delete transactions');
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <FinanceContext.Provider value={{ 
      role, setRole, 
      theme, setTheme,
      activeView, setActiveView,
      transactions, stats, categoryData, filteredTransactions, insights,
      filters, setFilters,
      addTransaction, deleteTransaction 
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
