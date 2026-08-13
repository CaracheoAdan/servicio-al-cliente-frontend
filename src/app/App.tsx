import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DashboardLayout } from '../shared/layout/DashboardLayout'
import { TicketList } from '../features/tickets'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { CatalogsPage } from '../features/catalogs/pages/CatalogsPage'

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
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rutas Privadas */}
        <Route path="/" element={
          <PrivateRoute>
            <div className="max-w-7xl mx-auto">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Panel de Control</h2>
                  <p className="text-gray-600">Gestión de órdenes de producción</p>
                </div>
              </div>
              
              {/* Aquí montaremos los features reales (Órdenes, Catálogos) */}
              <TicketList />
            </div>
          </PrivateRoute>
        } />
        
        <Route path="/catalogs" element={
          <PrivateRoute>
            <div className="max-w-7xl mx-auto">
              <CatalogsPage />
            </div>
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
