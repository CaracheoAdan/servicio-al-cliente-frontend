import React, { useState } from 'react'
import { Button } from '../../../shared/ui/Button'

export function TicketList() {
  const [tickets, setTickets] = useState([
    { id: 1, title: 'Problema con acceso a la plataforma', status: 'Abierto' },
    { id: 2, title: 'Error en facturación de este mes', status: 'En Progreso' },
  ])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Tickets Recientes</h2>
        <Button onClick={() => alert('Crear ticket no implementado aún')}>
          Nuevo Ticket
        </Button>
      </div>

      <div className="space-y-4">
        {tickets.map(ticket => (
          <div key={ticket.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow">
            <span className="font-medium text-gray-700">{ticket.title}</span>
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${
              ticket.status === 'Abierto' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {ticket.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
