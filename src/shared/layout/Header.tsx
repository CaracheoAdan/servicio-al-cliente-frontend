import React from 'react'

export function Header() {
  return (
    <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-6 shadow-sm shrink-0">
      <h1 className="text-xl font-semibold text-gray-800">Panel de Control</h1>
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-600">Usuario Administrador</span>
        <div className="h-8 w-8 rounded-full bg-totebin-600 text-white flex items-center justify-center font-bold shadow">
          A
        </div>
      </div>
    </header>
  )
}
