// // // // frontend/src/pages/PlayerPage.js

// // // import React, { useState } from 'react';
// // // import { useParams } from 'react-router-dom';
// // // import { useWebSocket } from '../hooks/useWebSocket'; // Import the hook
// // // import Header from '../components/layout/Header';
// // // import QuestionCard from '../components/game/QuestionCard';
// // // import Spinner from '../components/common/Spinner';

// // // function PlayerPage() {
// // //   const { playerId } = useParams();
// // //   // Use the hook to connect and get live data
// // //   const { gameState, isConnected, sendMessage } = useWebSocket(playerId);
// // //   const [answer, setAnswer] = useState('');

// // //   const handleSubmit = () => {
// // //     if (answer.trim()) {
// // //       // Use the sendMessage function from the hook
// // //       sendMessage('submit_answer', { answer: answer.trim() });
// // //       setAnswer('');
// // //     }
// // //   };

// // //   // Show a loading spinner while connecting
// // //   if (!isConnected) {
// // //     return <Spinner message="Connecting to Mission Control..." />;
// // //   }

// // //   // Show a waiting message if the game hasn't started
// // //   if (!gameState || gameState.game_status === 'lobby') {
// // //     return <Spinner message="Awaiting Mission Start..." />;
// // //   }
  
// // //   // Find the player's team and task from the live game state
// // //   const myTeam = gameState.teams.find(team => team.members.includes(playerId));
// // //   const myTask = myTeam?.tasks.find(task => task.assigned_to === playerId);

// // //   return (
// // //     <div className="min-h-screen p-4 font-mono text-primary-cyan">
// // //       <Header playerId={playerId} team={myTeam} isConnected={isConnected} />

// // //       <main>
// // //         {gameState.game_status === 'in_progress' && myTask ? (
// // //           // Pass the live data and submit function to the QuestionCard
// // //           <QuestionCard task={myTask} answer={answer} setAnswer={setAnswer} onSubmit={handleSubmit} />
// // //         ) : (
// // //           <div className="text-center text-2xl mt-20">
// // //             <p>// MISSION CONCLUDED //</p>
// // //             <p className="text-lg text-light-gray mt-4">Thank you for your service, Commander.</p>
// // //           </div>
// // //         )}
// // //       </main>
// // //     </div>
// // //   );
// // // }

// // // export default PlayerPage;

// // //demo
// // import React, { useState } from 'react';
// // import { useParams } from 'react-router-dom';
// // // import { useWebSocket } from '../hooks/useWebSocket'; // We comment this out for now
// // import { mockGameState } from '../utils/mockGameState'; // Import our mock data
// // import Header from '../components/layout/Header';
// // import QuestionCard from '../components/game/QuestionCard';
// // import Spinner from '../components/common/Spinner';

// // function PlayerPage() {
// //   const { playerId } = useParams();
  
// //   // --- MOCK DATA SETUP ---
// //   const isConnected = true; // Simulate a successful connection
// //   const gameState = mockGameState; // Use our fake game state
// //   const sendMessage = (type, data) => { // Create a fake sendMessage function
// //     console.log('Message sent:', { type, data });
// //   };
// //   // const { gameState, isConnected, sendMessage } = useWebSocket(playerId); // The real hook is disabled
// //   // --- END MOCK DATA ---

// //   const [answer, setAnswer] = useState('');

// //   const handleSubmit = () => {
// //     if (answer.trim()) {
// //       sendMessage('submit_answer', { answer: answer.trim() });
// //       setAnswer('');
// //     }
// //   };

// //   if (!isConnected) {
// //     return <Spinner message="Connecting to Mission Control..." />;
// //   }

// //   if (!gameState || gameState.game_status === 'lobby') {
// //     return <Spinner message="Awaiting Mission Start..." />;
// //   }
  
// //   // Find the player's team and task from the live game state
// //   // We use the player's ID from the URL or a default for testing
// //   const currentPlayerId = playerId || 'PHOENIX_1';
// //   const myTeam = gameState.teams.find(team => team.members.includes(currentPlayerId));
// //   const myTask = myTeam?.tasks.find(task => task.assigned_to === currentPlayerId);

// //   return (
// //     <div className="min-h-screen p-4 font-mono text-primary-cyan">
// //       <Header playerId={currentPlayerId} team={myTeam} isConnected={isConnected} />

// //       <main>
// //         {gameState.game_status === 'in_progress' && myTask ? (
// //           <QuestionCard task={myTask} answer={answer} setAnswer={setAnswer} onSubmit={handleSubmit} />
// //         ) : (
// //           <div className="text-center text-2xl mt-20">
// //             <p>// MISSION CONCLUDED //</p>
// //             <p className="text-lg text-light-gray mt-4">Thank you for your service, Commander.</p>
// //           </div>
// //         )}
// //       </main>
// //     </div>
// //   );
// // }

// // export default PlayerPage;


// //updated backend
// // src/pages/PlayerPage.js

// // import React, { useState, useEffect } from 'react';
// // import { useParams } from 'react-router-dom';
// // import { getMyTask, submitAnswer, getGameState } from '../services/api';
// // import { usePlayer } from '../context/PlayerContext';

// // const PlayerPage = () => {
// //     // Get the player's ID from the URL (e.g., /player/PHOENIX_1)
// //     const { playerId } = useParams();
    
// //     // Get the globally logged-in player's name for comparison (optional but good)
// //     const { playerName } = usePlayer();

// //     const [gameState, setGameState] = useState(null);
// //     const [taskData, setTaskData] = useState(null);
// //     const [answer, setAnswer] = useState('');
// //     const [feedback, setFeedback] = useState({ message: '', isCorrect: null });
// //     const [error, setError] = useState('');

// //     useEffect(() => {
// //         const fetchAllData = async () => {
// //             try {
// //                 const state = await getGameState();
// //                 setGameState(state);

// //                 // Only fetch task if the game is in a round
// //                 if (state.status.startsWith('round')) {
// //                     const task = await getMyTask(playerId);
// //                     setTaskData(task);
// //                      if (task.completed) {
// //                         setFeedback({ message: 'Task complete. Waiting for teammates...', isCorrect: true });
// //                     }
// //                 }
// //             } catch (err) {
// //                 setError('Could not fetch game data.');
// //             }
// //         };
// //         fetchAllData();
// //         const interval = setInterval(fetchAllData, 3000); // Poll for updates
// //         return () => clearInterval(interval);
// //     }, [playerId]);

// //     const handleSubmit = async () => {
// //         try {
// //             const result = await submitAnswer(playerId, answer);
// //             setFeedback({ message: result.message, isCorrect: result.correct });
// //         } catch (err) {
// //             setFeedback({ message: err.message, isCorrect: false });
// //         }
// //     };

// //     // --- GUARD CLAUSES ---
// //     if (!gameState) {
// //         return <div style={{ color: 'white', textAlign: 'center', paddingTop: '20%' }}>Loading Player Data...</div>
// //     }
    
// //     // Optional: Check if the viewer is the correct player
// //     if (playerName && playerId !== playerName) {
// //         return <div style={{ color: 'red', textAlign: 'center', paddingTop: '20%' }}>Access Denied: You are viewing another player's page.</div>
// //     }

// //     // Handle different game states
// //     if (gameState.status === 'finished') {
// //         const winnerTeam = gameState.teams.find(t => !t.is_eliminated);
// //         return <div style={{ color: 'white', textAlign: 'center', paddingTop: '20%', fontSize: '2rem' }}>
// //             Game Over! The winner is {winnerTeam?.team_name || 'N/A'}.
// //         </div>;
// //     }

// //     if (gameState.status === 'lobby') {
// //         return <div style={{ color: 'white', textAlign: 'center', paddingTop: '20%', fontSize: '1.5rem' }}>
// //             Waiting for Admin to start the game...
// //         </div>;
// //     }

// //     // --- DATA DERIVATION ---
// //     // ✅ FIX: Use `playerId` from the URL to find the team, not `playerName` from context.
// //     const myTeam = gameState.teams.find(team =>
// //         team.players.some(p => p.player_name === playerId)
// //     );
    
// //     const currentScenario = myTeam ? gameState.scenarios.find(s => s.id === myTeam.current_scenario_id) : null;

// //     // --- RENDER ---
// //     return (
// //         <div style={{ color: 'white', padding: '2rem', maxWidth: '900px', margin: '6rem auto' }}>
// //             <h1>Round {gameState.round_number}</h1>
// //             <h2>{myTeam?.team_name || 'Finding Team...'}</h2>
// //             <hr style={{borderColor: '#00ffff55'}} />
// //             <h3>Main Scenario:</h3>
            
// //             {currentScenario?.image_url && (
// //                 <img 
// //                     src={currentScenario.image_url} 
// //                     alt={currentScenario.title || 'Scenario Image'}
// //                     style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginBottom: '1rem' }} 
// //                 />
// //             )}

// //             <p>{taskData?.main_scenario}</p>

// //             <h3>Your Assigned Task:</h3>
// //             {error ? <p style={{color: 'red'}}>{error}</p> : <p style={{fontWeight: 'bold'}}>{taskData?.your_task}</p>}

// //             {taskData?.completed ? (
// //                 <p style={{ color: '#22c55e', fontWeight: 'bold' }}>{feedback.message}</p>
// //             ) : (
// //                 <div style={{ margin: '1rem 0' }}>
// //                     <input
// //                         type="text"
// //                         value={answer}
// //                         onChange={(e) => setAnswer(e.target.value)}
// //                         placeholder="Enter your answer"
// //                         style={{ padding: '0.5rem', width: '400px', backgroundColor: '#1f2937', border: '1px solid #00ffff', color: 'white' }}
// //                     />
// //                     <button onClick={handleSubmit} style={{ padding: '0.5rem 1rem', marginLeft: '10px', backgroundColor: '#00ffff', color: '#030712', border: 'none', fontWeight: 'bold' }}>
// //                         Submit
// //                     </button>
// //                     {feedback.message && (
// //                         <p style={{ color: feedback.isCorrect ? '#22c55e' : '#ef4444' }}>
// //                             {feedback.message}
// //                         </p>
// //                     )}
// //                 </div>
// //             )}
            
// //             <hr style={{borderColor: '#00ffff55'}} />
// //             <h3>Team Status:</h3>
// //             <ul style={{listStyle: 'none', padding: 0}}>
// //                 {myTeam?.players.map(p => (
// //                     <li key={p.player_name} style={{ color: p.completed ? '#22c55e' : '#f97316' }}>
// //                         {p.player_name} - {p.completed ? 'Completed' : 'In Progress'}
// //                     </li>
// //                 ))}
// //             </ul>
// //         </div>
// //     );
// // };

// // export default PlayerPage;





import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMyTask, submitAnswer, getGameState, getHint, getPlayerReport } from '../services/api';
import { usePlayer } from '../context/PlayerContext';

const PlayerPage = () => {
    const { playerId } = useParams();
    const { isAdmin } = usePlayer();
    const navigate = useNavigate();
    const [gameState, setGameState] = useState(null);
    const [taskData, setTaskData] = useState(null);
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState({ message: '', isCorrect: null });
    const [error, setError] = useState('');
    const [hint, setHint] = useState('');
    const [report, setReport] = useState('');
    const [isHintLoading, setIsHintLoading] = useState(false);
    const [isReportLoading, setIsReportLoading] = useState(false);

    useEffect(() => {
        if (isAdmin) {
            navigate('/admin');
        }
    }, [isAdmin, navigate]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const state = await getGameState();
                setGameState(state);
                if (state.status.startsWith('round')) {
                    const task = await getMyTask(playerId);
                    setTaskData(task);
                    if (task.completed) {
                        setFeedback({ message: 'Task complete. Waiting for teammates...', isCorrect: true });
                    }
                }
            } catch (err) {
                setError('Could not fetch game data.');
            }
        };
        fetchAllData();
        const interval = setInterval(fetchAllData, 3000);
        return () => clearInterval(interval);
    }, [playerId]);

    const handleSubmit = async () => {
        try {
            const result = await submitAnswer(playerId, answer);
            setFeedback({ message: result.message, isCorrect: result.correct });
        } catch (err) {
            setFeedback({ message: err.message, isCorrect: false });
        }
    };
    
    const handleGetHint = async () => {
        setIsHintLoading(true);
        try {
            const response = await getHint(playerId);
            setHint(response.hint);
        } catch (err) {
            setHint(`Error from AI oracle: ${err.message}`);
        } finally {
            setIsHintLoading(false);
        }
    };
    
    const handleViewReport = async () => {
        setIsReportLoading(true);
        try {
            const response = await getPlayerReport(playerId);
            setReport(response.report);
        } catch (err) {
            setReport(`Could not generate report: ${err.message}`);
        } finally {
            setIsReportLoading(false);
        }
    };

    if (!gameState) {
        return <div className="text-white text-center p-8">Loading Player Data...</div>
    }

    const myTeam = gameState.teams.find(team => team.players.some(p => p.player_name === playerId));

    if (gameState.status === 'finished') {
        return (
            <div className="text-white p-4 md:p-8 max-w-4xl mx-auto text-center font-mono mt-10">
                <h1 className="text-3xl font-bold mb-6 text-primary-cyan">// MISSION COMPLETE //</h1>
                {myTeam?.is_eliminated && <h2 className="text-2xl text-red-500 mb-4">TEAM ELIMINATED</h2>}
                {report ? (
                    <div className="bg-black/50 border border-primary-cyan/30 p-6 rounded-md text-left whitespace-pre-wrap">
                        <h2 className="text-primary-cyan mb-4 text-xl">After-Action Report: Callsign {playerId}</h2>
                        <p className="text-slate-300">{report}</p>
                    </div>
                ) : (
                    <button onClick={handleViewReport} disabled={isReportLoading} className="py-3 px-6 bg-primary-cyan text-gray-900 font-bold rounded-lg disabled:opacity-50">
                        {isReportLoading ? 'Generating Debrief...' : 'View Mission Debrief'}
                    </button>
                )}
            </div>
        );
    }
    
    if (gameState.status === 'lobby') {
        return <div className="text-white text-center p-8 text-2xl mt-10">Waiting for Admin to start the game...</div>;
    }

    if (myTeam?.is_eliminated) {
         return <div className="text-red-500 text-center p-8 text-2xl font-bold mt-10">Your team has been eliminated.</div>;
    }

    const currentScenario = myTeam ? gameState.scenarios.find(s => s.id === myTeam.current_scenario_id) : null;

    return (
        <div className="text-white p-4 md:p-8 max-w-4xl mx-auto font-mono mt-10">
            <h1 className="text-3xl font-bold">Round {gameState.round_number}</h1>
            <h2 className="text-2xl text-primary-cyan">{myTeam?.team_name || 'Finding Team...'}</h2>
            <hr className="border-primary-cyan/30 my-4" />
            
            <h3 className="text-xl font-bold">Main Scenario:</h3>
            {currentScenario?.image_url && (
                <img src={currentScenario.image_url} alt={currentScenario.title || 'Scenario'} className="w-full h-auto rounded-lg my-4" />
            )}
            <p className="text-slate-300">{taskData?.main_scenario}</p>

            <h3 className="text-xl font-bold mt-6">Your Assigned Task:</h3>
            {error ? <p className="text-red-500">{error}</p> : <p className="font-bold text-lg my-2">{taskData?.your_task}</p>}

            {taskData?.completed ? (
                <p className="text-green-500 font-bold my-4 text-lg">{feedback.message}</p>
            ) : (
                <div className="my-4 space-y-4">
                    <div className="flex flex-col sm:flex-row items-stretch gap-2">
                        <input
                            type="text"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Enter your answer"
                            className="p-2 bg-gray-800 border border-primary-cyan text-white rounded flex-grow font-mono"
                        />
                        <button onClick={handleSubmit} className="p-2 bg-primary-cyan text-gray-900 font-bold rounded">
                            Submit
                        </button>
                    </div>
                    {feedback.message && (
                        <p className={`p-2 rounded text-center ${feedback.isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {feedback.message}
                        </p>
                    )}
                    <div className="text-center">
                        <button onClick={handleGetHint} disabled={isHintLoading} className="text-sm text-primary-cyan/70 hover:text-primary-cyan border border-primary-cyan/50 rounded-full px-4 py-1 disabled:opacity-50">
                            {isHintLoading ? 'Thinking...' : 'Request Hint (-25 Points)'}
                        </button>
                        {hint && <p className="mt-4 p-4 bg-gray-800/50 border border-primary-cyan/30 rounded-md text-slate-300 italic">{hint}</p>}
                    </div>
                </div>
            )}
            
            <hr className="border-primary-cyan/30 my-4" />
            <h3 className="text-xl font-bold">Team Status:</h3>
            <ul className="list-none p-0">
                {myTeam?.players.map(p => (
                    <li key={p.player_name} className={`font-bold ${p.completed ? 'text-green-500' : 'text-orange-500'}`}>
                        {p.player_name} - {p.completed ? 'Completed' : 'In Progress'}
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default PlayerPage;