import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { DashboardLayout } from '../shared/layout/DashboardLayout';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';
import { AuthProvider } from '../shared/context/AuthContext';
import { PermissionGuard } from '../shared/components/PermissionGuard';

// Lazy loading at route level (Code Splitting)
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const CatalogsPage = lazy(() => import('../features/catalogs/pages/CatalogsPage').then(m => ({ default: m.CatalogsPage })));
const OrderListPage = lazy(() => import('../features/orders/pages/OrderListPage').then(m => ({ default: m.OrderListPage })));
const OrderFormPage = lazy(() => import('../features/orders/pages/OrderFormPage').then(m => ({ default: m.OrderFormPage })));
const ReportsPage = lazy(() => import('../features/reports/pages/ReportsPage').then(m => ({ default: m.ReportsPage })));
const MasterTablePage = lazy(() => import('../features/reports/pages/MasterTablePage').then(m => ({ default: m.MasterTablePage })));
const UsersPage = lazy(() => import('../features/users/pages/UsersPage').then(m => ({ default: m.UsersPage })));
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const NotFoundPage = lazy(() => import('../shared/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

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

/**
 * Private route wrapper that enforces authentication + permission checks
 * and wraps content in the dashboard layout.
 */
function PrivateRoute({ children, permission }: { children: React.ReactNode; permission?: string }) {
  return (
    <PermissionGuard permission={permission}>
      <DashboardLayout>{children}</DashboardLayout>
    </PermissionGuard>
  );
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
      <AuthProvider>
        <BrowserRouter>
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              style: {
                background: 'var(--surface-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 4px 24px -4px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: { primary: '#10B981', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#EF4444', secondary: '#fff' },
              },
            }} 
          />
          <ErrorBoundary>
            <Suspense fallback={<GlobalLoader />}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Rutas Privadas con RBAC */}
                <Route path="/" element={<Navigate to="/orders" replace />} />
                
                <Route path="/orders" element={
                  <PrivateRoute permission="orders">
                    <OrderListPage />
                  </PrivateRoute>
                } />

                <Route path="/orders/new" element={
                  <PrivateRoute permission="orders_new">
                    <OrderFormPage />
                  </PrivateRoute>
                } />

                <Route path="/orders/:id" element={
                  <PrivateRoute permission="orders">
                    <OrderFormPage />
                  </PrivateRoute>
                } />

                <Route path="/catalogs" element={
                  <PrivateRoute permission="catalogs">
                    <CatalogsPage />
                  </PrivateRoute>
                } />

                <Route path="/reports" element={
                  <PrivateRoute permission="reports">
                    <ErrorBoundary>
                      <ReportsPage />
                    </ErrorBoundary>
                  </PrivateRoute>
                } />

                <Route path="/master-table" element={
                  <PrivateRoute permission="master_table">
                    <MasterTablePage />
                  </PrivateRoute>
                } />

                <Route path="/users" element={
                  <PrivateRoute permission="users">
                    <UsersPage />
                  </PrivateRoute>
                } />

                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
