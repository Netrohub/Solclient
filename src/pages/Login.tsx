import { Bot } from 'lucide-react';
import { API_URL } from '../App';

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-discord-black via-discord-dark to-discord-black flex items-center justify-center">
      <div className="bg-discord-dark p-12 rounded-2xl shadow-2xl max-w-md w-full">
        <div className="flex justify-center mb-8">
          <Bot className="w-20 h-20 text-discord-blurple" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-4">Welcome Back</h1>
        <p className="text-discord-gray text-center mb-8">
          Login with Discord to access your dashboard
        </p>
        <a
          href={`${API_URL}/auth/discord`}
          className="block w-full py-4 bg-discord-blurple hover:bg-discord-blurple/80 rounded-lg text-center font-semibold transition-colors"
        >
          Login with Discord
        </a>
      </div>
    </div>
  );
}

