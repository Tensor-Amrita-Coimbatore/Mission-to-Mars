// A place for simple, non-React helper functions

/**
 * Example: A function to format a player's callsign
 * @param {string} id - The raw player ID
 * @returns {string} - The formatted callsign
 */
export const formatCallsign = (id) => {
  return id ? id.toUpperCase().replace(/ /g, '_') : 'UNKNOWN';
};