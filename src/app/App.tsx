import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DashboardLayout } from '../shared/layout/DashboardLayout'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { CatalogsPage } from '../features/catalogs/pages/CatalogsPage'
import { OrderListPage } from '../features/orders/pages/OrderListPage'
import { OrderFormPage } from '../features/orders/pages/OrderFormPage'
import { ReportsPage } from '../features/reports/pages/ReportsPage'
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
        
        {/* Rutas Privadas */}
        <Route path="/" element={
          <PrivateRoute>
            <div className="max-w-7xl mx-auto">
              <OrderListPage />
            </div>
          </PrivateRoute>
        } />

        <Route path="/orders/new" element={
          <PrivateRoute>
            <div className="max-w-7xl mx-auto">
              <OrderFormPage />
            </div>
          </PrivateRoute>
        } />

        <Route path="/orders/:id" element={
          <PrivateRoute>
            <div className="max-w-7xl mx-auto">
              <OrderFormPage />
            </div>
          </PrivateRoute>
        } />

        <Route path="/catalogs" element={
          <PrivateRoute>
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Catálogos Maestros</h2>
                <p className="text-gray-600">Administra los datos base del sistema</p>
              </div>
              <CatalogsPage />
            </div>
          </PrivateRoute>
        } />

        <Route path="/reports" element={
          <PrivateRoute>
            <div className="max-w-7xl mx-auto">
              <ReportsPage />
            </div>
          </PrivateRoute>
        } />

        <Route path="/users" element={
          <PrivateRoute>
            <div className="max-w-7xl mx-auto">
              <UsersPage />
            </div>
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
