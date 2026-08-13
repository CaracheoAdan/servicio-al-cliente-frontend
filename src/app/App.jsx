import React from 'react'
import { TicketList } from '../features/tickets'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-8 font-sans text-gray-900">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">
          Servicio al Cliente
        </h1>
        <p className="text-gray-600">Gestión de Tickets (Arquitectura Vertical Slices)</p>
      </header>
      
      <main className="max-w-4xl mx-auto w-full">
        <TicketList />
      </main>
    </div>
  )
}

export default App
