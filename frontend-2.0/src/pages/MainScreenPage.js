


import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGameState } from '../services/api';
import { usePlayer } from '../context/PlayerContext';

// src/pages/MainScreenPage.js

const Timer = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState('00:00');
    
    useEffect(() => {
        // If no endTime is provided, do nothing.
        if (!endTime) {
            setTimeLeft('00:00');
            return;
        }

        const interval = setInterval(() => {
            // ✅ FIX: Manually append 'Z' to the timestamp string.
            // This forces JavaScript to interpret it as a UTC time.
            const end = new Date(endTime + 'Z');
            
            const now = new Date();
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft('00:00');
                clearInterval(interval);
                return;
            }
            const minutes = Math.floor((diff / 1000) / 60);
            const seconds = Math.floor((diff / 1000) % 60); 
            setTimeLeft(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [endTime]);

    return (
        <div className="text-center bg-black/30 p-4 rounded-md border border-primary-cyan/30 mt-10">
            <h3 className="text-primary-cyan uppercase tracking-widest text-sm">Time Remaining</h3>
            <p className="text-5xl font-mono font-bold text-white">{timeLeft}</p>
        </div>
    );
};

const Leaderboard = ({ teams }) => {
    const sortedTeams = [...teams].filter(team => !team.is_eliminated).sort((a, b) => b.score - a.score);
    return (
        <div className="bg-black/30 p-4 rounded-md border border-primary-cyan/30 h-full mt-10">
            <h3 className="text-primary-cyan uppercase tracking-widest text-center mb-4 text-sm">Leaderboard</h3>
            <ul className="space-y-2">
                {sortedTeams.map((team, index) => (
                    <li key={team.team_name} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-md text-white">
                        <span className="text-lg font-bold">{index + 1}. {team.team_name}</span>
                        <span className="text-lg font-mono font-bold text-primary-cyan">{team.score} PTS</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const MainScreenPage = () => {
    const [gameState, setGameState] = useState(null);
    const [error, setError] = useState('');
    const { playerName, logout, isAdmin } = usePlayer();
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (isAdmin) {
    //         navigate('/admin');
    //     }
    // }, [isAdmin, navigate]);

    const fetchState = useCallback(async () => {
        try {
            const state = await getGameState();
            setGameState(state);
            if (playerName) {
                const playerExists = state.players_in_lobby.includes(playerName) || state.teams.some(t => t.players.some(p => p.player_name === playerName));
                if (!playerExists && !isAdmin) {
                    logout();
                }
            }
            setError('');
        } catch (err) { setError('Could not connect to the game server.'); }
    }, [playerName, logout, isAdmin]);

    useEffect(() => {
        fetchState();
        const interval = setInterval(fetchState, 3000);
        return () => clearInterval(interval);
    }, [fetchState]);

    if (!gameState) {
        return <div className="text-white text-center p-8 mt-10">{error || 'Loading Game Hub...'}</div>;
    }
    if (gameState.status === 'lobby') {
        return <div className="text-white text-center p-8 text-2xl mt-10">Waiting for Admin to start the game...</div>
    }
    if (gameState.status === 'finished') {
        const winnerTeam = gameState.teams.find(t => !t.is_eliminated);
        return <div className="text-white text-center p-8 text-2xl mt-10">
            Mission Complete. Winner: <span className="text-primary-cyan font-bold">{winnerTeam?.team_name || 'N/A'}</span>
        </div>
    }

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto text-light-gray font-mono">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Leaderboard teams={gameState.teams} />
                </div>
                <div className="space-y-8">
                    <Timer endTime={gameState.round_end_time} />
                    <div className="bg-black/30 p-4 rounded-md border border-primary-cyan/30">
                        <h3 className="text-primary-cyan uppercase tracking-widest text-center mb-4 text-sm">Mission Rules</h3>
                        <ul className="text-sm space-y-2 text-slate-300">
                            <li>- Complete your subtask to earn points for your team.</li>
                            <li>- Using hints will reduce your score for that task.</li>
                            <li>- The team with the lowest score is eliminated after each round.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default MainScreenPage;