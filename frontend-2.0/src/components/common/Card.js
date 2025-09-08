import React from 'react';

/**
 * This component is a simple wrapper. 
 * Anything placed between <Card> and </Card> is passed in as "children"
 * and rendered inside the div below.
 */
function Card({ children, className = '' }) {
  return (
    // The "glass-card" class creates the visual border and background.
    // The "children" (like your H1 and p tags) are rendered inside this div.
    <div className={`glass-card p-6 md:p-8 ${className}`}>
      {children}
    </div>
  );
}

export default Card;