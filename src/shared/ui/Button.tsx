import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  const baseStyle = "font-medium py-2 px-6 rounded-lg transition-colors duration-200"
  const variants = {
    primary: "bg-[#2A5D8F] hover:bg-[#1E4D73] text-white shadow-sm",
    secondary: "bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569]",
    danger: "bg-red-600 hover:bg-red-700 text-white"
  }

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
