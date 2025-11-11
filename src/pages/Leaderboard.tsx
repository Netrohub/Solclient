import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Trophy, ArrowLeft, Medal } from 'lucide-react';

export default function Leaderboard({ user }: { user: any }) {
  const { guildId } = useParams();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [metric, setMetric] = useState('points');

  useEffect(() => {
    if (!guildId) return;
    
    axios
      .get(`/api/guild/${guildId}/leaderboard?metric=${metric}&limit=50`)
      .then((res) => setLeaderboard(res.data));
  }, [guildId, metric]);

  return (
    <div className="min-h-screen bg-discord-black">
      {/* Header */}
      <nav className="bg-discord-dark border-b border-discord-gray/20">
        <div className="container mx-auto px-6 py-4 flex items-center space-x-4">
          <Link
            to={`/dashboard/${guildId}`}
            className="p-2 hover:bg-discord-gray/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Trophy className="w-6 h-6 text-discord-yellow" />
          <h1 className="text-xl font-bold">Leaderboard</h1>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        {/* Metric Selector */}
        <div className="flex space-x-4 mb-8">
          {['points', 'level', 'messages', 'images'].map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                metric === m
                  ? 'bg-discord-blurple'
                  : 'bg-discord-dark hover:bg-discord-gray/20'
              }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="bg-discord-dark rounded-xl p-6">
          <div className="space-y-3">
            {leaderboard.map((entry, index) => {
              const getMedalIcon = () => {
                if (index === 0) return '🥇';
                if (index === 1) return '🥈';
                if (index === 2) return '🥉';
                return null;
              };

              return (
                <div
                  key={entry.userId}
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                    index < 3
                      ? 'bg-gradient-to-r from-discord-blurple/20 to-transparent'
                      : 'bg-discord-black/50 hover:bg-discord-gray/10'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-discord-gray w-12 text-center">
                      {getMedalIcon() || `#${index + 1}`}
                    </span>
                    <div className="flex items-center space-x-3">
                      {entry.user && (
                        <img
                          src={`https://cdn.discordapp.com/avatars/${entry.user.id}/${entry.user.id}.png`}
                          alt={entry.user.username}
                          className="w-10 h-10 rounded-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://cdn.discordapp.com/embed/avatars/0.png';
                          }}
                        />
                      )}
                      <div>
                        <p className="font-semibold">
                          {entry.user?.username || `User ${entry.userId}`}
                        </p>
                        {entry.level && (
                          <p className="text-sm text-discord-gray">Level {entry.level}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-discord-yellow">
                      {(entry.points || entry.level || entry.value)?.toLocaleString() || 0}
                    </p>
                    <p className="text-sm text-discord-gray">{metric}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

