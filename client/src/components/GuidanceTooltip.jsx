import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GuidanceTooltip = ({ children, message, position = 'top', show = true }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!show) return children;

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-purple-500',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-purple-500',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-purple-500',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-purple-500'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: position === 'top' ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: position === 'top' ? 10 : -10 }}
            className={`absolute z-50 ${positionClasses[position]}`}
          >
            <div className="bg-purple-500 text-white text-sm px-3 py-2 rounded-lg shadow-lg max-w-xs">
              <div className="flex items-start space-x-2">
                <span className="text-xs">💡</span>
                <p className="leading-relaxed">{message}</p>
              </div>
              <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GuidanceTooltip;
