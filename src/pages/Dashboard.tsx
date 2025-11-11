import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Server, Users, LogOut } from 'lucide-react';

export default function Dashboard({ user }: { user: any }) {
  const [guilds, setGuilds] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/guilds')
      .then((res) => setGuilds(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error('Failed to fetch guilds:', err);
        setGuilds([]);
      });
  }, []);

  return (
    <div className="min-h-screen bg-discord-black">
      {/* Header */}
      <nav className="bg-discord-dark border-b border-discord-gray/20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Server className="w-6 h-6 text-discord-blurple" />
            <span className="text-xl font-bold">Dashboard</span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img
                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                alt={user.username}
                className="w-8 h-8 rounded-full"
              />
              <span>{user.username}</span>
            </div>
            <a
              href={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/auth/logout`}
              className="p-2 hover:bg-discord-gray/20 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Your Servers</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guilds.map((guild) => (
            <Link
              key={guild.id}
              to={`/dashboard/${guild.id}`}
              className="bg-discord-dark p-6 rounded-xl hover:bg-discord-gray/10 transition-colors group"
            >
              <div className="flex items-center space-x-4 mb-4">
                {guild.icon ? (
                  <img
                    src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                    alt={guild.name}
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 bg-discord-blurple rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold group-hover:text-discord-blurple transition-colors">
                    {guild.name}
                  </h3>
                  <p className="text-discord-gray text-sm">Click to manage</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {guilds.length === 0 && (
          <div className="text-center py-20 text-discord-gray">
            <Server className="w-20 h-20 mx-auto mb-4 opacity-50" />
            <p className="text-xl">No servers found</p>
            <p className="mt-2">Add the bot to your server to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

