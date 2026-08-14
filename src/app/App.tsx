import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DashboardLayout } from '../shared/layout/DashboardLayout'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { CatalogsPage } from '../features/catalogs/pages/CatalogsPage'
import { OrderListPage } from '../features/orders/pages/OrderListPage'
import { OrderFormPage } from '../features/orders/pages/OrderFormPage'
import { ReportsPage } from '../features/reports/pages/ReportsPage'
import { MasterTablePage } from '../features/reports/pages/MasterTablePage'
import { UsersPage } from '../features/users/pages/UsersPage'
import { Toaster } from 'react-hot-toast'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('totebin_token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <DashboardLayout>{children}</DashboardLayout>
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
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
            <ReportsPage />
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
    </BrowserRouter>
  )
}

export default App
