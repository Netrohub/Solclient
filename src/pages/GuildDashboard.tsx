import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, MessageSquare, Trophy, TrendingUp, ArrowLeft } from 'lucide-react';

export default function GuildDashboard({ user }: { user: any }) {
  const { guildId } = useParams();
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    if (!guildId) return;

    // Fetch stats
    axios.get(`/api/guild/${guildId}/stats`).then((res) => setStats(res.data));

    // Fetch activity
    axios.get(`/api/guild/${guildId}/activity?days=7`).then((res) => {
      const formatted = res.data.map((d: any) => ({
        date: new Date(d.date).toLocaleDateString(),
        messages: d._sum.messages || 0,
        images: d._sum.images || 0,
      }));
      setActivity(formatted);
    });

    // Fetch leaderboard
    axios.get(`/api/guild/${guildId}/leaderboard?metric=points&limit=5`).then((res) => {
      setLeaderboard(res.data);
    });
  }, [guildId]);

  return (
    <div className="min-h-screen bg-discord-black">
      {/* Header */}
      <nav className="bg-discord-dark border-b border-discord-gray/20">
        <div className="container mx-auto px-6 py-4 flex items-center space-x-4">
          <Link
            to="/dashboard"
            className="p-2 hover:bg-discord-gray/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Server Dashboard</h1>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={<Users className="w-8 h-8 text-discord-green" />}
            title="Total Members"
            value={stats?.totalMembers.toLocaleString() || '0'}
            trend="+12%"
          />
          <StatCard
            icon={<MessageSquare className="w-8 h-8 text-discord-blurple" />}
            title="Total Messages"
            value={stats?.totalMessages.toLocaleString() || '0'}
            trend="+25%"
          />
          <StatCard
            icon={<Trophy className="w-8 h-8 text-discord-yellow" />}
            title="Total Points"
            value={stats?.totalPoints.toLocaleString() || '0'}
            trend="+18%"
          />
        </div>

        {/* Activity Chart */}
        <div className="bg-discord-dark rounded-xl p-6 mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-discord-blurple" />
            Activity (Last 7 Days)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#99AAB5" opacity={0.1} />
              <XAxis dataKey="date" stroke="#99AAB5" />
              <YAxis stroke="#99AAB5" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#2C2F33',
                  border: 'none',
                  borderRadius: '8px',
                }}
              />
              <Line type="monotone" dataKey="messages" stroke="#5865F2" strokeWidth={2} />
              <Line type="monotone" dataKey="images" stroke="#57F287" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Users */}
        <div className="bg-discord-dark rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Trophy className="w-6 h-6 mr-2 text-discord-yellow" />
            Top Users
          </h2>
          <div className="space-y-4">
            {leaderboard.map((entry, index) => (
              <div key={entry.userId} className="flex items-center justify-between p-4 bg-discord-black/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-discord-gray">#{index + 1}</span>
                  <div>
                    <p className="font-semibold">{entry.user?.username || 'Unknown'}</p>
                    <p className="text-sm text-discord-gray">Level {entry.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-discord-yellow">
                    {entry.points?.toLocaleString() || entry.value?.toLocaleString() || 0}
                  </p>
                  <p className="text-sm text-discord-gray">points</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to={`/dashboard/${guildId}/leaderboard`}
            className="block mt-6 text-center py-3 bg-discord-blurple hover:bg-discord-blurple/80 rounded-lg font-semibold transition-colors"
          >
            View Full Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  trend,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="bg-discord-dark p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        {icon}
        <span className="text-discord-green text-sm font-semibold">{trend}</span>
      </div>
      <h3 className="text-discord-gray text-sm mb-2">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

