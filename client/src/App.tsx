import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { TransactionFormModal, type TransactionFormValues } from './components/Forms/TransactionFormModal';
import { AppLayout } from './components/Layout/AppLayout';
import { LoadingScreen } from './components/Layout/LoadingScreen';
import { isAuthenticated } from './hooks/useAuth';
import { DashboardPage } from './pages/DashboardPage';
import { FuturePlanningPage } from './pages/FuturePlanningPage';
import { LoginPage } from './pages/LoginPage';
import { MonthlyPage } from './pages/MonthlyPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { WealthPage } from './pages/WealthPage';
import { useFinanceStore } from './store/financeStore';

function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const { addTransaction, categories, initialize, initialized } = useFinanceStore();

  useEffect(() => {
    if (authenticated) {
      void initialize();
    }
  }, [authenticated]);

  const stableCategories = useMemo(() => categories, [categories]);

  const handleGlobalCreate = async (payload: TransactionFormValues) => {
    try {
      await addTransaction(payload);
      setAddModalOpen(false);
    } catch (error) {
      console.error('Failed to add transaction', error);
    }
  };

  if (!authenticated) {
    return <LoginPage onSuccess={() => setAuthenticated(true)} />;
  }

  if (!initialized) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Routes>
        <Route
          element={<AppLayout onOpenAddTransaction={() => setAddModalOpen(true)} />}
        >
          <Route path="/" element={<MonthlyPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/monthly" element={<Navigate to="/" replace />} />
          <Route path="/wealth" element={<WealthPage />} />
          <Route path="/future-planning" element={<FuturePlanningPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>

      <TransactionFormModal
        open={addModalOpen}
        categories={stableCategories}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleGlobalCreate}
      />
    </>
  );
}

export default App;
