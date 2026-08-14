import React from 'react';
import { motion } from 'framer-motion';

// Componente placeholder para la futura animación de Lottie/Spline
// Actualmente utiliza Framer Motion para simular piezas (cajas) cayendo y ensamblando la "T"
export function AnimatedLogoContainer() {
  // Configuración de la animación
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const boxVariants = {
    hidden: { y: -150, opacity: 0, rotate: -45 },
    visible: { 
      y: 0, 
      opacity: 1, 
      rotate: 0,
      transition: { 
        type: 'spring', 
        damping: 12, 
        stiffness: 100 
      }
    },
  };

  return (
    <div className="mx-auto h-24 w-24 mb-8 relative">
      <motion.div 
        className="w-full h-full bg-white rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden"
        initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
        animate={{ rotate: -3, scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ rotate: 0 }}
      >
        {/* Este contenedor de motion simulará las piezas de la "T" armándose */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative w-12 h-14"
        >
          {/* Barra horizontal de la T */}
          <motion.div 
            variants={boxVariants}
            className="absolute top-0 left-0 w-12 h-4 bg-[#2A5D8F] rounded-sm"
          />
          {/* Barra vertical de la T */}
          <motion.div 
            variants={boxVariants}
            className="absolute top-4 left-4 w-4 h-10 bg-[#2A5D8F] rounded-sm"
          />
        </motion.div>
        
        {/* Espacio reservado para integrar el componente Lottie o Spline en el futuro.
            Ejemplo de cómo sería:
            <Lottie animationData={robotBuildingLogo} loop={false} className="absolute inset-0" />
        */}
      </motion.div>
    </div>
  );
}
