// import React, { createContext, useState, useContext } from 'react';

// const PlayerContext = createContext(null);

// export const usePlayer = () => useContext(PlayerContext);

// export const PlayerProvider = ({ children }) => {
//     const [playerName, setPlayerName] = useState(sessionStorage.getItem('playerName') || '');

//     const login = (name) => {
//         sessionStorage.setItem('playerName', name);
//         setPlayerName(name);
//     };

//     const logout = () => {
//         sessionStorage.removeItem('playerName');
//         setPlayerName('');
//     };

//     const value = {
//         playerName,
//         isLoggedIn: !!playerName,
//         login,
//         logout,
//     };

//     return (
//         <PlayerContext.Provider value={value}>
//             {children}
//         </PlayerContext.Provider>
//     );
// };

//latest
import React, { createContext, useState, useContext } from 'react';

const PlayerContext = createContext(null);

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
    const [playerName, setPlayerName] = useState(sessionStorage.getItem('playerName') || '');

    const login = (name) => {
        sessionStorage.setItem('playerName', name);
        setPlayerName(name);
    };

    const logout = () => {
        sessionStorage.removeItem('playerName');
        setPlayerName('');
    };

    const value = {
        playerName,
        isLoggedIn: !!playerName,
        isAdmin: playerName.toUpperCase() === 'ADMIN',
        login,
        logout,
    };

    return (
        <PlayerContext.Provider value={value}>
            {children}
        </PlayerContext.Provider>
    );
};