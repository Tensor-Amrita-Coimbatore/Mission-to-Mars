
import React, { useState, useEffect, useCallback } from 'react';
import { createTeams, startRound, resetGame, getGameState } from '../services/api';

const AdminPage = () => {
    const [gameState, setGameState] = useState(null);
    const [numTeams, setNumTeams] = useState(2);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const fetchState = useCallback(async () => {
        try {
            const state = await getGameState();
            setGameState(state);
            setError('');
        } catch (err) {
            setError('Could not connect to the game server. Is it running?');
        }
    }, []);

    useEffect(() => {
        fetchState();
        const interval = setInterval(fetchState, 3000);
        return () => clearInterval(interval);
    }, [fetchState]);


    const handleAction = async (action, ...args) => {
        try {
            setError('');
            setMessage('');
            const response = await action(...args);
            setMessage(`Success: ${JSON.stringify(response)}`);
            await fetchState();
        } catch (err) {
            setError(err.message || 'An error occurred.');
        }
    };
    
    if (!gameState) {
        return <div className="text-white text-center p-8 mt-10">Loading Admin Panel...</div>;
    }

    const buttonClasses = "py-2 px-4 bg-primary-cyan text-gray-900 font-bold rounded-lg border-2 border-primary-cyan uppercase tracking-widest hover:bg-primary-cyan/80 transition-all duration-300 w-full sm:w-auto";
    const inputClasses = "bg-gray-800 border border-primary-cyan/50 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary-cyan w-full sm:w-auto";

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto text-light-gray font-mono mt-10">
            <div className="bg-slate-900/70 backdrop-blur-sm border border-primary-cyan/30 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-white">Admin Control Panel</h2>
                {error && <p className="text-red-500 font-bold">Error: {error}</p>}
                {message && <p className="text-green-500 font-bold">{message}</p>}

                {gameState.status === 'lobby' && (
                    <div className="my-4 flex flex-col sm:flex-row items-center gap-4 p-4 border border-slate-700 rounded-md">
                        <label className="flex-shrink-0 font-bold">Number of Teams:</label>
                        <input
                            type="number"
                            className={inputClasses}
                            value={numTeams}
                            onChange={(e) => setNumTeams(parseInt(e.target.value, 10) || 1)}
                            min="1"
                        />
                        <button className={buttonClasses} onClick={() => handleAction(createTeams, numTeams)}>
                            Create Teams
                        </button>
                    </div>
                )}
                
                {gameState.teams.length > 0 && gameState.status !== 'finished' && (
                    <div className="my-4">
                        <button className={buttonClasses} onClick={() => handleAction(startRound)}>
                            {gameState.round_number > 0 ? `Eliminate Lowest & Start Round ${gameState.round_number + 1}` : `Start Round 1`}
                        </button>
                    </div>
                )}

                <div className="my-4">
                    <button 
                        className={`${buttonClasses} bg-red-700/80 border-red-500 hover:bg-red-700 text-white`} 
                        onClick={() => handleAction(resetGame)}
                    >
                        RESET GAME
                    </button>
                </div>
                
                <h3 className="text-lg font-bold mt-6 text-white">Current State:</h3>
                <pre className="bg-gray-900 text-light-gray p-4 mt-2 border border-primary-cyan/50 rounded-md whitespace-pre-wrap max-h-96 overflow-y-auto text-sm">
                    {JSON.stringify(gameState, null, 2)}
                </pre>
            </div>
        </div>
    );
};
export default AdminPage;