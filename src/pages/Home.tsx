import { Link } from 'react-router-dom';
import { Bot, BarChart3, Trophy, Zap, Shield, Users } from 'lucide-react';

export default function Home({ user }: { user: any }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-discord-black via-discord-dark to-discord-black">
      {/* Header */}
      <nav className="border-b border-discord-gray/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bot className="w-8 h-8 text-discord-blurple" />
            <span className="text-2xl font-bold text-white">Server Manager Bot</span>
          </div>
          <div>
            {user ? (
              <Link
                to="/dashboard"
                className="px-6 py-2 bg-discord-blurple hover:bg-discord-blurple/80 rounded-lg font-semibold transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <a
                href={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/auth/discord`}
                className="px-6 py-2 bg-discord-blurple hover:bg-discord-blurple/80 rounded-lg font-semibold transition-colors"
              >
                Login with Discord
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-discord-blurple to-discord-fuchsia bg-clip-text text-transparent">
          The Ultimate Discord Bot
        </h1>
        <p className="text-xl text-discord-gray mb-12 max-w-2xl mx-auto">
          Advanced tracking, analytics, gamification, and management tools for your Discord server
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/auth/discord`}
            className="px-8 py-4 bg-discord-blurple hover:bg-discord-blurple/80 rounded-lg text-lg font-semibold transition-colors"
          >
            Get Started
          </a>
          <a
            href="#features"
            className="px-8 py-4 bg-discord-dark hover:bg-discord-gray/20 rounded-lg text-lg font-semibold transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Powerful Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<BarChart3 className="w-12 h-12 text-discord-blurple" />}
            title="Advanced Analytics"
            description="Track messages, presence, activity patterns, and more with beautiful visualizations"
          />
          <FeatureCard
            icon={<Trophy className="w-12 h-12 text-discord-yellow" />}
            title="Gamification"
            description="30+ achievements, daily rewards, points system, and custom shop items"
          />
          <FeatureCard
            icon={<Zap className="w-12 h-12 text-discord-green" />}
            title="Mini-Games"
            description="Trivia, coinflip, slots, rock-paper-scissors, and more to keep users engaged"
          />
          <FeatureCard
            icon={<Shield className="w-12 h-12 text-discord-red" />}
            title="Moderation"
            description="Advanced moderation tools with warnings, mutes, and detailed audit logs"
          />
          <FeatureCard
            icon={<Users className="w-12 h-12 text-discord-fuchsia" />}
            title="Community"
            description="Custom commands, polls, events, and social features for your server"
          />
          <FeatureCard
            icon={<Bot className="w-12 h-12 text-discord-blurple" />}
            title="Easy to Use"
            description="Simple slash commands and beautiful embeds make everything intuitive"
          />
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-r from-discord-blurple to-discord-fuchsia p-1 rounded-2xl max-w-4xl mx-auto">
          <div className="bg-discord-dark rounded-xl p-12">
            <h2 className="text-4xl font-bold mb-6">Ready to Level Up Your Server?</h2>
            <p className="text-xl text-discord-gray mb-8">
              Join thousands of servers using Server Manager Bot
            </p>
            <a
              href={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/auth/discord`}
              className="inline-block px-10 py-4 bg-discord-blurple hover:bg-discord-blurple/80 rounded-lg text-lg font-semibold transition-colors"
            >
              Add to Discord
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-discord-gray/20 py-8">
        <div className="container mx-auto px-6 text-center text-discord-gray">
          <p>&copy; 2024 Server Manager Bot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-discord-dark p-8 rounded-xl hover:bg-discord-gray/10 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-discord-gray">{description}</p>
    </div>
  );
}

