// // src/services/api.js
// const API_BASE_URL = "http://127.0.0.1:8000";

// async function request(endpoint, method = 'GET', body = null) {
//     const options = {
//         method,
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     };
//     if (body) {
//         options.body = JSON.stringify(body);
//     }
//     try {
//         const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.detail || 'Something went wrong');
//         }
//         return response.json();
//     } catch (error) {
//         console.error(`API call to ${endpoint} failed:`, error);
//         throw error;
//     }
// }

// export const getGameState = () => request('/api/game/state');
// export const joinLobby = (playerName) => request('/api/lobby/join', 'POST', { player_name: playerName });
// export const getMyTask = (playerName) => request(`/api/player/my-task?player_name=${playerName}`);
// export const submitAnswer = (playerName, answer) => request('/api/player/submit-answer', 'POST', { player_name: playerName, answer });
// export const createTeams = (numTeams) => request('/api/admin/create-teams', 'POST', { num_teams: numTeams });
// export const startRound = () => request('/api/admin/start-round', 'POST');
// export const endRound = (numToEliminate) => request('/api/admin/end-round', 'POST', { num_to_eliminate: numToEliminate });
// export const resetGame = () => request('/api/game/reset', 'POST');

// updated
// src/services/api.js  "http://127.0.0.1:8000" || process.env.REACT_APP_API_URL ||
const API_BASE_URL = "https://z0h9838b-8000.inc1.devtunnels.ms";

async function request(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            cache: 'no-cache',
        },
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Something went wrong');
        }
        return response.json();
    } catch (error) {
        console.error(`API call to ${endpoint} failed:`, error);
        throw error;
    }
}

// Player & Game State API Calls
export const getGameState = () => request('/api/game/state');
export const joinLobby = (playerName) => request('/api/lobby/join', 'POST', { player_name: playerName });
export const getMyTask = (playerName) => request(`/api/player/my-task?player_name=${playerName}`);
export const submitAnswer = (playerName, answer) => request('/api/player/submit-answer', 'POST', { player_name: playerName, answer });
export const getHint = (playerName) => request('/api/player/get-hint', 'POST', { player_name: playerName });
export const getPlayerReport = (playerId) => request(`/api/player/report/${playerId}`);

// Admin API Calls
export const createTeams = (numTeams) => request('/api/admin/create-teams', 'POST', { num_teams: numTeams });
export const startRound = () => request('/api/admin/start-round', 'POST');
export const resetGame = () => request('/api/game/reset', 'POST');