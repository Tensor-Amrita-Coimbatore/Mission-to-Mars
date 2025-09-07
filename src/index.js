import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css'; // Your main CSS file for Tailwind CSS
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <PlayerProvider>
        <App />
      </PlayerProvider>
    </BrowserRouter>
  </React.StrictMode>
);