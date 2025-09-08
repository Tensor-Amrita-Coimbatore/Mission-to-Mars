import React from 'react';

function Header({ playerId, team, isConnected }) {
  return (
    <header className="flex justify-between items-center border-b border-primary-cyan/30 pb-2 mb-4">
      <div>
        <h1 className="text-2xl font-bold text-light-gray">// PLAYER HUD</h1>
        <p className="text-sm text-light-gray/70">CALLSIGN: {playerId}</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-accent-orange">TEAM: {team?.name || 'Unassigned'}</p>
        <p>STATUS: {isConnected ? <span className="text-green-400">CONNECTED</span> : <span className="text-red-400">DISCONNECTED</span>}</p>
      </div>
    </header>
  );
}

export default Header;