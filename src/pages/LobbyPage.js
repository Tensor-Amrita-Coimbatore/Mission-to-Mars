import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { joinLobby, getGameState } from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

function LobbyPage() {
    const [playerId, setPlayerId] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [lobbyPlayers, setLobbyPlayers] = useState([]);
    const navigate = useNavigate();
    const { login, isLoggedIn, playerName, isAdmin } = usePlayer();
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef(null);

    useEffect(() => {
        // Redirect already logged-in users
        if (isLoggedIn) {
            navigate(isAdmin ? '/admin' : `/player/${playerName}`);
        }
    }, [isLoggedIn, playerName, isAdmin, navigate]);

    useEffect(() => {
        // Poll for players in the lobby
        const fetchLobbyState = async () => {
            try {
                const state = await getGameState();
                setLobbyPlayers(state.players_in_lobby || []);
            } catch (err) {
                console.error("Failed to fetch lobby state:", err);
            }
        };
        fetchLobbyState();
        const intervalId = setInterval(fetchLobbyState, 3000);
        return () => clearInterval(intervalId);
    }, []);

    const handleJoin = async () => {
        if (!playerId.trim()) return;
        setIsLoading(true);
        setError('');
        const newPlayerName = playerId.trim();

        if (newPlayerName.toUpperCase() === 'ADMIN') {
            login(newPlayerName);
            navigate('/admin');
        } else {
            try {
                await joinLobby(newPlayerName);
                login(newPlayerName);
                navigate(`/player/${newPlayerName}`);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    const titleText = Array.from("// AI ARENA: MISSION BRIEFING //");
    const titleContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const titleChild = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };
    const displayedPlayers = lobbyPlayers.filter(p => p.toUpperCase() !== 'ADMIN');

    if (isLoggedIn) {
        return <div className="text-white text-center p-8">Redirecting...</div>;
    }

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center font-mono p-4 overflow-hidden">
            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                src="/Immersive_Cockpit_Video_Generation.mp4"
                autoPlay
                loop
                muted={isMuted}
                playsInline
            />
            <div className="absolute inset-0 bg-black/60"></div>
            <button
                onClick={toggleMute}
                className="absolute top-20 md:top-4 right-4 z-20 px-4 py-2 bg-black/60 text-primary-cyan border border-primary-cyan rounded-lg text-sm hover:bg-black/80 transition mt-10"
            >
                {isMuted ? '🔇 Sound Off' : '🔊 Sound On'}
            </button>
            <motion.div
                className="w-full max-w-4xl relative z-10"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
            >
                <Card>
                    <motion.h1
                        className="text-primary-cyan mb-4 font-bold text-center whitespace-nowrap"
                        style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}
                        variants={titleContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        {titleText.map((letter, index) => (
                            <motion.span key={index} variants={titleChild}>
                                {letter === ' ' ? '\u00A0' : letter}
                            </motion.span>
                        ))}
                    </motion.h1>
                    <p className="mb-6 text-light-gray/80 text-center">
                        Enter your callsign to connect to the Mars Mission Network.
                    </p>
                    <div className="my-6 text-center">
                        <h3 className="text-primary-cyan uppercase tracking-widest mb-3 text-sm">
                            // Active Connections //
                        </h3>
                        <div className="h-24 max-h-24 overflow-y-auto bg-black/30 p-2 rounded-md border border-primary-cyan/30 scrollbar-thin scrollbar-thumb-primary-cyan/50 scrollbar-track-transparent">
                            {displayedPlayers.length > 0 ? (
                                <ul className="text-light-gray/90">
                                    {displayedPlayers.map((player) => (
                                        <li key={player} className="animate-pulse-fast text-lg">{player}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-light-gray/60 italic mt-6">[ No active callsigns detected... ]</p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="playerId" className="mb-2 text-light-gray/90">CALLSIGN:</label>
                        <input
                            id="playerId"
                            type="text"
                            placeholder="e.g., PHOENIX_1 " //or ADMIN
                            value={playerId}
                            onChange={(e) => setPlayerId(e.target.value)}
                            className="bg-gray-800 border border-primary-cyan/50 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                        />
                        <Button
                            onClick={handleJoin}
                            className="mt-6"
                            disabled={!playerId.trim() || isLoading}
                        >
                            {isLoading ? '[ CONNECTING... ]' : '[ INITIATE CONNECTION ]'}
                        </Button>
                        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
export default LobbyPage;