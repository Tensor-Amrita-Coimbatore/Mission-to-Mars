import React from 'react';
import { motion } from 'framer-motion';

function Button({ children, onClick, disabled = false, className = '' }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`bg-primary-cyan text-space-dark font-bold py-2 px-4 rounded transition-colors duration-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {children}
    </motion.button>
  );
}

export default Button;