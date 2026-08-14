import React from 'react';

// Componente placeholder para la futura animación de Lottie/Spline
// Utiliza animaciones CSS nativas para simular piezas ensamblando la "T"
export function AnimatedLogoContainer() {
  return (
    <div className="mx-auto h-24 w-24 mb-8 relative">
      <style>
        {`
          @keyframes dropIn {
            0% { transform: translateY(-150px) rotate(-45deg); opacity: 0; }
            60% { transform: translateY(10px) rotate(5deg); opacity: 1; }
            100% { transform: translateY(0) rotate(0); opacity: 1; }
          }
          @keyframes popIn {
            0% { transform: scale(0.8) rotate(-15deg); opacity: 0; }
            100% { transform: scale(1) rotate(-3deg); opacity: 1; }
          }
          .animate-pop-in {
            animation: popIn 0.8s ease-out forwards;
          }
          .animate-drop-1 {
            animation: dropIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s forwards;
            opacity: 0;
          }
          .animate-drop-2 {
            animation: dropIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.5s forwards;
            opacity: 0;
          }
        `}
      </style>
      <div 
        className="w-full h-full bg-white rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden animate-pop-in transition-transform hover:rotate-0"
      >
        <div className="relative w-12 h-14">
          {/* Barra horizontal de la T */}
          <div className="absolute top-0 left-0 w-12 h-4 bg-[#2A5D8F] rounded-sm animate-drop-1" />
          {/* Barra vertical de la T */}
          <div className="absolute top-4 left-4 w-4 h-10 bg-[#2A5D8F] rounded-sm animate-drop-2" />
        </div>
        
        {/* Espacio reservado para integrar el componente Lottie o Spline en el futuro.
            Ejemplo de cómo sería:
            <Lottie animationData={robotBuildingLogo} loop={false} className="absolute inset-0" />
        */}
      </div>
    </div>
  );
}

