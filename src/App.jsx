import React, { useState, useMemo } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { 
  LayoutDashboard, 
  ReceiptText, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  Plus, 
  Search, 
  Filter, 
  User, 
  LogOut, 
  MoreHorizontal, 
  ArrowUpRight, 
  ArrowDownLeft,
  Trash2,
  Calendar,
  AlertCircle,
  Download,
  Sun,
  Moon
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// --- Reusable Components ---

const StatCard = ({ title, value, type, trend }) => {
  const isIncome = type === 'income';
  const isBalance = type === 'balance';
  
  return (
    <motion.div 
      className="card fade-in"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="card-title">{title}</div>
      <div className={`card-value ${isIncome ? 'trend-up' : !isBalance ? 'trend-down' : ''}`}>
        ${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </div>
      <div className="card-trend">
        {trend && (
          <span className={trend > 0 ? 'trend-up' : 'trend-down'}>
            {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
            {Math.abs(trend)}% since last month
          </span>
        )}
      </div>
    </motion.div>
  );
};

const TransactionTable = () => {
  const { filteredTransactions, role, deleteTransaction, filters, setFilters } = useFinance();
  
  const handleSort = (e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value }));
  const handleSearch = (e) => setFilters(prev => ({ ...prev, search: e.target.value }));
  const handleTypeFitler = (e) => setFilters(prev => ({ ...prev, type: e.target.value }));

  return (
    <div className="data-card fade-in">
      <div className="table-header">
        <h2>Recent Transactions</h2>
        <div className="table-filters">
          <button 
             className="btn btn-ghost" 
             style={{ gap: '0.5rem', fontSize: '0.875rem' }}
             onClick={() => {
               const headers = ['Date', 'Category', 'Description', 'Type', 'Amount'];
               const rows = filteredTransactions.map(t => [
                 new Date(t.date).toLocaleDateString(),
                 t.category,
                 t.description,
                 t.type,
                 t.amount
               ]);
               const csvContent = "data:text/csv;charset=utf-8," 
                 + headers.join(",") + "\n"
                 + rows.map(e => e.map(field => `"${field}"`).join(",")).join("\n");
               const encodedUri = encodeURI(csvContent);
               const link = document.createElement("a");
               link.setAttribute("href", encodedUri);
               link.setAttribute("download", "transactions.csv");
               document.body.appendChild(link);
               link.click();
               document.body.removeChild(link);
             }}
           >
             <Download size={16} /> Export CSV
           </button>
          <div className="search-group" style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search descriptions..." 
              style={{ paddingLeft: '2.5rem' }}
              value={filters.search}
              onChange={handleSearch}
            />
          </div>
          <select className="filter-select" value={filters.type} onChange={handleTypeFitler}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select className="filter-select" value={filters.sortOrder} onChange={handleSort}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="empty-state" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          <AlertCircle size={48} style={{ marginBottom: '1rem' }} />
          <p>No transactions found matching your filters.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
                {role === 'admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredTransactions.map((t) => (
                  <motion.tr 
                    key={t.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <td>{new Date(t.date).toLocaleDateString()}</td>
                    <td>{t.category}</td>
                    <td>{t.description}</td>
                    <td>
                      <span className={`type-badge badge-${t.type}`}>{t.type}</span>
                    </td>
                    <td style={{ fontWeight: 600, color: t.type === 'income' ? 'var(--income)' : 'var(--expense)' }}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                    </td>
                    {role === 'admin' && (
                      <td>
                        <button 
                          className="btn-ghost" 
                          onClick={() => deleteTransaction(t.id)}
                          style={{ padding: '0.25rem', color: 'var(--expense)' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const InsightsSection = () => {
  const { insights, categoryData } = useFinance();
  
  return (
    <div className="summary-grid">
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))' }}>
        <div className="card-title">Top Expense Category</div>
        <div className="card-value" style={{ color: 'var(--primary)' }}>{insights.highestCategory}</div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          You've spent <strong>${insights.topSpending.toLocaleString()}</strong> in this category.
        </p>
      </div>
      <div className="card">
        <div className="card-title">Monthly Efficiency</div>
        <div className="card-value" style={{ color: insights.efficiency === 'Higher' ? 'var(--income)' : 'var(--expense)' }}>
          {insights.efficiency}
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Expenses are {insights.efficiency === 'Higher' ? 'down' : 'up'} by {insights.diff}% compared to last month.
        </p>
      </div>
      <div className="card">
        <div className="card-title">Avg. Transaction</div>
        <div className="card-value">${Math.round(insights.averageExpense).toLocaleString()}</div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Average amount across {insights.totalCount} transactions.
        </p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { stats, categoryData, transactions, role, setRole, theme, setTheme, activeView, setActiveView, addTransaction } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Prepare data for line chart (Trend)
  const chartData = useMemo(() => {
    // Basic aggregation by date
    const daily = {};
    [...transactions].sort((a,b) => new Date(a.date) - new Date(b.date)).forEach(t => {
      daily[t.date] = (daily[t.date] || 0) + (t.type === 'income' ? t.amount : -t.amount);
    });
    
    let runningBalance = stats.balance - transactions.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
    return Object.entries(daily).map(([date, val]) => {
      runningBalance += val;
      return { date: date.split('-').slice(1).join('/'), balance: runningBalance };
    });
  }, [transactions, stats.balance]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="main-content">
      <div className="header">
        <div>
          <h1>Overview</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back! Here's what's happening with your money.</p>
        </div>
        <div className="user-controls">
          <button 
            className="btn-ghost" 
            style={{ padding: '0.5rem', borderRadius: '50%' }} 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="role-switcher">
             <User size={18} />
             <select onChange={(e) => setRole(e.target.value)} value={role}>
               <option value="admin">Admin (Full Access)</option>
               <option value="viewer">Viewer (Read Only)</option>
             </select>
          </div>
          {role === 'admin' && (
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={20} /> Add Transaction
            </button>
          )}
        </div>
      </div>

      {activeView === 'Dashboard' && (
        <>
          <div className="summary-grid">
            <StatCard title="Total Balance" value={stats.balance} type="balance" trend={+2.4} />
            <StatCard title="Total Income" value={stats.income} type="income" trend={+5.1} />
            <StatCard title="Total Expenses" value={stats.expenses} type="expense" trend={-1.2} />
          </div>

          <InsightsSection />

          <div className="charts-grid">
            <div className="chart-card">
              <h3 style={{ marginBottom: '1.5rem' }}>Balance Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(v) => `$${v}`} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--text-main)' }}
                  />
                  <Area type="monotone" dataKey="balance" stroke="var(--primary)" fillOpacity={1} fill="url(#colorBalance)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3 style={{ marginBottom: '1.5rem' }}>Spending Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {activeView === 'Transactions' && <TransactionTable />}

      {activeView === 'Analysis' && (
        <div className="fade-in">
          <div className="chart-card" style={{ marginBottom: '2rem' }}>
             <h3 style={{ marginBottom: '1.5rem' }}>Category Analysis</h3>
             <ResponsiveContainer width="100%" height={400}>
               <PieChart>
                 <Pie
                   data={categoryData}
                   cx="50%"
                   cy="50%"
                   label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                   outerRadius={150}
                   fill="#8884d8"
                   dataKey="value"
                 >
                   {categoryData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
          </div>
          <InsightsSection />
        </div>
      )}

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h2 style={{ marginBottom: '1.5rem' }}>Add Transaction</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                addTransaction({
                  date: formData.get('date'),
                  amount: parseFloat(formData.get('amount')),
                  category: formData.get('category'),
                  type: formData.get('type'),
                  description: formData.get('description'),
                });
                setIsModalOpen(false);
              }}>
                <div className="form-group">
                  <label>Description</label>
                  <input name="description" className="form-input" required placeholder="Rent, Coffee, Bonus..." />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Amount</label>
                    <input type="number" name="amount" className="form-input" required step="0.01" />
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input type="date" name="date" className="form-input" required defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Type</label>
                    <select name="type" className="form-input">
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select name="category" className="form-input">
                      <option value="Food">Food</option>
                      <option value="Rent">Rent</option>
                      <option value="Salary">Salary</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Investment">Investment</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Transaction</button>
                  <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Sidebar = () => {
  const { activeView, setActiveView } = useFinance();
  
  return (
    <div className="sidebar">
      <div className="logo">
        <div style={{ padding: '8px', background: 'var(--primary)', borderRadius: '10px' }}>
          <TrendingUp size={24} color="white" />
        </div>
        Vantage
      </div>
      <ul className="nav-links">
        <li 
          className={`nav-item ${activeView === 'Dashboard' ? 'active' : ''}`}
          onClick={() => setActiveView('Dashboard')}
        >
          <LayoutDashboard size={20} /> Dashboard
        </li>
        <li 
          className={`nav-item ${activeView === 'Transactions' ? 'active' : ''}`}
          onClick={() => setActiveView('Transactions')}
        >
          <ReceiptText size={20} /> Transactions
        </li>
        <li 
          className={`nav-item ${activeView === 'Analysis' ? 'active' : ''}`}
          onClick={() => setActiveView('Analysis')}
        >
          <PieChartIcon size={20} /> Analysis
        </li>
      </ul>
      <div className="nav-item" style={{ marginTop: 'auto' }}>
        <LogOut size={20} /> Sign Out
      </div>
    </div>
  );
};

function App() {
  return (
    <FinanceProvider>
      <div className="app-container">
        <Sidebar />
        <Dashboard />
      </div>
    </FinanceProvider>
  );
}

export default App;
