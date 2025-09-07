

// import React from 'react';
// import { Link } from 'react-router-dom';
// import { usePlayer } from '../../context/PlayerContext';

// const DevNav = () => {
//   const { playerName, isLoggedIn } = usePlayer();

//   const navStyle = {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     width: '100%',
//     zIndex: 50,
//     padding: '1rem',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     fontFamily: 'monospace',
//     textAlign: 'center',
//     fontSize: '1rem'
//   };

//   const linkStyle = {
//     color: '#00FFFF', // cyan
//     margin: '0 1rem',
//     textDecoration: 'none'
//   };
  
//   const disabledLinkStyle = {
//     color: '#555',
//     margin: '0 1rem',
//     cursor: 'not-allowed'
//   };

//   return (
//     <nav style={navStyle}>
//       <span style={{ color: '#FF6347' }}>DEV MENU:</span>
//       <Link to="/" style={linkStyle}>Lobby</Link>
      
//       {isLoggedIn ? (
//         <Link to={`/player/${playerName}`} style={linkStyle}>Player View</Link>
//       ) : (
//         <span style={disabledLinkStyle}>Player View</span>
//       )}

//       <Link to="/main" style={linkStyle}>Main Screen</Link>
      
//       {/* ✅ FIX: Only show the Admin link if the player's name is "ADMIN" */}
//       {isLoggedIn && playerName.toUpperCase() === 'ADMIN' && (
//         <Link to="/admin" style={linkStyle}>Admin</Link>
//       )}
//     </nav>
//   );
// };

// export default DevNav;

import React from 'react';
import { Link } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';

const DevNav = () => {
  const { playerName, isLoggedIn, isAdmin } = usePlayer();

  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 50,
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    fontFamily: 'monospace',
    textAlign: 'center'
  };
  const linkStyle = { color: '#00FFFF', margin: '0 1rem', textDecoration: 'none' };
  const disabledLinkStyle = { color: '#555', margin: '0 1rem', cursor: 'not-allowed' };

  return (
    <nav style={navStyle}>
      <span style={{ color: '#FF6347' }}>DEV MENU:</span>
      {isLoggedIn ? ( <span style={disabledLinkStyle}>Lobby</span> ) : ( <Link to="/" style={linkStyle}>Lobby</Link> )}
      {isLoggedIn && !isAdmin ? ( <Link to={`/player/${playerName}`} style={linkStyle}>Player View</Link> ) : ( <span style={disabledLinkStyle}>Player View</span> )}
      {isLoggedIn ? ( <Link to="/main" style={linkStyle}>Main Screen</Link> ) : ( <span style={disabledLinkStyle}>Main Screen</span> )}
      {/* {isLoggedIn && isAdmin ? ( <Link to="/admin" style={linkStyle}>Admin</Link> ) : ( <span style={disabledLinkStyle}>Admin</span> )} */}

      {isLoggedIn && isAdmin && (
         <Link to="/admin" style={linkStyle}>Admin</Link>
      )}
    </nav>
  );
};
export default DevNav;