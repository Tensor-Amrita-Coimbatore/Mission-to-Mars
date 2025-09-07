import { useState, useEffect } from 'react';
import { websocketService } from '../services/websocketService';

export const useWebSocket = (playerId) => {
  const [gameState, setGameState] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!playerId) return;

    websocketService.connect(playerId);

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    
    const handleUpdateState = (data) => {
      // The server should send its state under a 'state' key
      if (data.state) {
        setGameState(data.state);
      }
    };

    websocketService.on('connect', handleConnect);
    websocketService.on('disconnect', handleDisconnect);
    websocketService.on('update_state', handleUpdateState);

    // Cleanup on component unmount
    return () => {
      websocketService.off('connect', handleConnect);
      websocketService.off('disconnect', handleDisconnect);
      websocketService.off('update_state', handleUpdateState);
      websocketService.disconnect();
    };
  }, [playerId]);

  const sendMessage = (type, data) => {
    websocketService.sendMessage(type, data);
  };

  return { gameState, isConnected, sendMessage };
};