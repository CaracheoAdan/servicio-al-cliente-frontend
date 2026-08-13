import React from 'react'
import { DashboardLayout } from '../shared/layout/DashboardLayout'
import { TicketList } from '../features/tickets'

function App() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Bienvenido a Totebin</h2>
          <p className="text-gray-600">Sistema de gestión de órdenes de producción</p>
        </div>
        
        {/* TODO: Reemplazar con las rutas y el dashboard real de Totebin */}
        <TicketList />
      </div>
    </DashboardLayout>
  )
}

export default App
