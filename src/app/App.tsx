import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { DashboardLayout } from '../shared/layout/DashboardLayout';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';

// Lazy loading at route level (Code Splitting)
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const CatalogsPage = lazy(() => import('../features/catalogs/pages/CatalogsPage').then(m => ({ default: m.CatalogsPage })));
const OrderListPage = lazy(() => import('../features/orders/pages/OrderListPage').then(m => ({ default: m.OrderListPage })));
const OrderFormPage = lazy(() => import('../features/orders/pages/OrderFormPage').then(m => ({ default: m.OrderFormPage })));
const ReportsPage = lazy(() => import('../features/reports/pages/ReportsPage').then(m => ({ default: m.ReportsPage })));
const MasterTablePage = lazy(() => import('../features/reports/pages/MasterTablePage').then(m => ({ default: m.MasterTablePage })));
const UsersPage = lazy(() => import('../features/users/pages/UsersPage').then(m => ({ default: m.UsersPage })));

// React Query Client setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Do not refetch aggressively on window focus
      retry: 1, // Retry failed requests once before showing error
      staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
    },
  },
});

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('totebin_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <DashboardLayout>{children}</DashboardLayout>;
}

// Fallback loader for Suspense
const GlobalLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-10 h-10 border-4 border-[#2A5D8F] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <ErrorBoundary>
          <Suspense fallback={<GlobalLoader />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Rutas Privadas */}
              <Route path="/" element={<Navigate to="/orders" replace />} />
              
              <Route path="/orders" element={
                <PrivateRoute>
                  <OrderListPage />
                </PrivateRoute>
              } />

              <Route path="/orders/new" element={
                <PrivateRoute>
                  <OrderFormPage />
                </PrivateRoute>
              } />

              <Route path="/orders/:id" element={
                <PrivateRoute>
                  <OrderFormPage />
                </PrivateRoute>
              } />

              <Route path="/catalogs" element={
                <PrivateRoute>
                  <CatalogsPage />
                </PrivateRoute>
              } />

              <Route path="/reports" element={
                <PrivateRoute>
                  <ErrorBoundary>
                    <ReportsPage />
                  </ErrorBoundary>
                </PrivateRoute>
              } />

              <Route path="/master-table" element={
                <PrivateRoute>
                  <MasterTablePage />
                </PrivateRoute>
              } />

              <Route path="/users" element={
                <PrivateRoute>
                  <UsersPage />
                </PrivateRoute>
              } />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
