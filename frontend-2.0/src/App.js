import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AnimatedBackground from './components/layout/AnimatedBackground';
import DevNav from './components/layout/DevNav';
import LobbyPage from './pages/LobbyPage';
import PlayerPage from './pages/PlayerPage';
import MainScreenPage from './pages/MainScreenPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <DevNav />
      <main className="relative z-10" >
        <Routes>
          <Route path="/" element={<LobbyPage />} />
          <Route path="/player/:playerId" element={<PlayerPage />} />
          <Route path="/main" element={<MainScreenPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;