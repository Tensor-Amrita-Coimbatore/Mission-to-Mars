import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function Timer({ duration, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp]);
  
  const percentage = (timeLeft / duration) * 100;
  const timerColor = percentage > 50 ? 'bg-green-500' : percentage > 25 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="w-full bg-gray-700 rounded-full h-4">
      <motion.div
        className={`h-4 rounded-full ${timerColor}`}
        initial={{ width: '100%' }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "linear" }}
      />
    </div>
  );
}

export default Timer;