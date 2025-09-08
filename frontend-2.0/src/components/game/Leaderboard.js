import React from 'react';
import Card from '../common/Card';
import { motion, AnimatePresence } from 'framer-motion';

function Leaderboard({ teams }) {
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4 text-accent-orange">// LIVE LEADERBOARD //</h2>
      <ul className="space-y-2">
        <AnimatePresence>
          {sortedTeams.map((team, index) => (
            <motion.li
              key={team.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className={`flex justify-between text-lg p-2 rounded ${index === 0 ? 'bg-primary-cyan/30' : 'bg-primary-cyan/10'}`}
            >
              <span>{index + 1}. {team.name}</span>
              <span className="font-bold">{team.score} PTS</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </Card>
  );
}

export default Leaderboard;