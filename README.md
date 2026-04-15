# Vantage Finance Dashboard UI

A premium, interactive finance dashboard built with React, Vite, Recharts, and Framer Motion. This project provides a comprehensive UI solution for tracking personal finance with role-based access control (RBAC) simulation.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v16.x or higher)
- npm (v7.x or higher)

### 2. Installation
Clone or download the repository, then navigate to the project directory:
```bash
npm install
```

### 3. Running Locally
Launch the Vite development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173/`.

### 4. Build for Production
Create an optimized production bundle:
```bash
npm run build
```

## ✨ Key Features
- **📊 Real-time Summaries**: Track Balance, Income, and Expenses at a glance.
- **📉 Interactive Charts**: Visualizing trends with Area Charts and breakdowns with Pie Charts.
- **💼 Transaction Management**: Search, filter, and sort your financial history.
- **🔐 RBAC Simulation**: Toggle between 'Admin' (Full Access) and 'Viewer' (Read-Only) roles.
- **🌙 Premium Dark Theme**: Professional, sleek interface with responsive design.
- **💾 Persistence**: Automatically saves your transactions to LocalStorage.

## 🛠️ Tech Stack
- **Frontend**: React, Lucide Icons
- **Visuals**: Recharts (for Dashboard data)
- **State**: React Context API
- **Animations**: Framer Motion
- **Build**: Vite

## 📄 Project Documentation
For a detailed technical explanation of the approach and implementation, please refer to:
[Project_Explanation.md](./Project_Explanation.md)


# Project Execution Summary: Finance Dashboard UI

This document provides a comprehensive overview of the design decisions, technical implementation, and feature highlights of the Vantage Finance Dashboard.

## 1. Project Objective
The goal was to build a premium, interactive finance dashboard that allows users to track their financial activity via summary cards, data visualizations, and transaction management.

## 2. Technical Stack
- **Core Framework**: React 18+ (via Vite)
- **State Management**: React Context API
- **Styling**: Vanilla CSS with modern tokens (custom properties)
- **Visualizations**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Persistence**: Web Storage API (Local Storage)

## 3. Key Features & Implementation Details

### A. Summary Overview & Visualization
- **Trend Analysis**: Dynamic Area Charts showing balance trends over time.
- **Spending Breakdown**: Categorical Pie Charts showing weightage of expenses.
- **Dynamic Stats**: Real-time calculation of Income, Expenses, and Total Balance.

### B. Transaction Management
- **CRUD Operations**: Admins can add new transactions via a sleek modal or delete existing ones.
- **Filtering & Searching**: Instant client-side filtering by type (Income/Expense) and keyword searching.
- **Sorting**: Multi-parameter sorting based on date and amount.

### C. Role-Based UI (RBAC Simulation)
- **Admin Role**: Full access to the Dashboard with ability to "Add" and "Delete" transactions.
- **Viewer Role**: Read-only access where the action buttons and delete controls are hidden or disabled.
- **Simulation**: A role-switcher dropdown in the header allows for instant preview of behavior.

### D. User Experience & Aesthetics
- **Premium Design**: Dark-themed UI with Glassmorphism effects and high-quality typography (Outfit).
- **Responsiveness**: Fully responsive layout using CSS Grid and Flexbox, catering to both desktop and mobile users.
- **Interactive Micro-animations**: Smooth transitions using Framer Motion for modals and list items.

## 4. State Management Approach
The application utilizes a centralized `FinanceProvider` using the Context API. This ensures:
- **Clean Code**: No "prop-drilling" across deeply nested components.
- **Performance**: Use of `useMemo` for derived statistics (charts, insights) to avoid redundant calculations.
- **Persistence**: Application state is automatically synchronized with `localStorage`, ensuring data stays intact upon refresh.

## 5. Architectural Decisions
- **Separation of Concerns**: Data handling and business logic are isolated in the `FinanceContext`, while the UI is kept clean in `App.jsx` and `index.css`.
- **Modular Components**: Reusable UI components for cards and table rows.
- **Scalability**: Designed with extensibility in mind (e.g., adding a backend API integration is straightforward by swapping mock data handlers).

