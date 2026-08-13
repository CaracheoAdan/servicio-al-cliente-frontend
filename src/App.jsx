import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans text-gray-900">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-extrabold text-blue-600 mb-4 tracking-tight">
          ¡Hola Mundo!
        </h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Tu proyecto de React con Vite y Tailwind CSS ha sido configurado exitosamente.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200">
          Comenzar
        </button>
      </div>
    </div>
  )
}

export default App
