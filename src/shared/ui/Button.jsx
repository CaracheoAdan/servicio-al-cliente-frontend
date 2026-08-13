import React from 'react'

export function Button({ children, onClick, variant = 'primary', className = '' }) {
  const baseStyle = "font-medium py-2 px-6 rounded-lg transition-colors duration-200"
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800"
  }

  return (
    <button 
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
