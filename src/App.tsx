import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import GuildDashboard from './pages/GuildDashboard';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';

// Normalize API URL to ensure it has protocol
function normalizeApiUrl(url: string): string {
  if (!url) return 'http://localhost:3001';
  // If URL doesn't start with http:// or https://, add https://
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
}

export const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL || '');

axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_URL;

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    axios
      .get('/auth/user')
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-discord-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard/:guildId"
          element={user ? <GuildDashboard user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard/:guildId/leaderboard"
          element={user ? <Leaderboard user={user} /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

