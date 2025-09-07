import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { motion } from 'framer-motion';

function QuestionCard({ task, answer, setAnswer, onSubmit }) {
  // Animated text for the incoming transmission effect
  const sentence = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        staggerChildren: 0.02,
      },
    },
  };
  const letter = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Card>
      <h2 className="text-xl mb-4 animate-pulse-slow text-accent-orange">// INCOMING TRANSMISSION //</h2>
      
      <motion.p 
        className="text-lg text-light-gray mb-6"
        variants={sentence}
        initial="hidden"
        animate="visible"
      >
        {task.scenario_desc.split("").map((char, index) => (
          <motion.span key={char + "-" + index} variants={letter}>
            {char}
          </motion.span>
        ))}
      </motion.p>
      
      <div className="mt-4">
        <h3 className="text-lg mb-2 text-light-gray/80">YOUR TASK:</h3>
        <p className="text-base text-white mb-4">{task.task_desc}</p>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your response here..."
          className="w-full h-24 bg-gray-800 border border-primary-cyan/50 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary-cyan"
        />
        <Button onClick={onSubmit} className="mt-4 w-full">
          [ TRANSMIT RESPONSE ]
        </Button>
      </div>
    </Card>
  );
}

export default QuestionCard;