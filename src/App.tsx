import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
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
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

let csrfTokenPromise: Promise<void> | null = null;

function ensureCsrfToken(): Promise<void> {
  if (axios.defaults.headers.common['X-CSRF-Token']) {
    return Promise.resolve();
  }

  if (!csrfTokenPromise) {
    csrfTokenPromise = axios
      .get('/auth/csrf', { withCredentials: true })
      .then((res) => {
        axios.defaults.headers.common['X-CSRF-Token'] = res.data.csrfToken;
      })
      .catch((error) => {
        console.error('Failed to fetch CSRF token', error);
      })
      .finally(() => {
        csrfTokenPromise = null;
      });
  }

  return csrfTokenPromise;
}

axios.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase() ?? 'get';
  const nonMutatingMethods = ['get', 'head', 'options', 'trace'];

  if (!nonMutatingMethods.includes(method)) {
    await ensureCsrfToken();
    config.headers = {
      ...(config.headers || {}),
      'X-CSRF-Token': axios.defaults.headers.common['X-CSRF-Token'],
    };
  }

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403 && error.response?.data?.error === 'Invalid CSRF token' && error.config) {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      delete axios.defaults.headers.common['X-CSRF-Token'];
      await ensureCsrfToken();

      originalRequest.headers = {
        ...(originalRequest.headers || {}),
        'X-CSRF-Token': axios.defaults.headers.common['X-CSRF-Token'],
      };

      return axios(originalRequest);
    }

    return Promise.reject(error);
  }
);

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ensureCsrfToken();
  }, []);

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

