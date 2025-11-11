# Discord Bot Dashboard - Frontend

Beautiful React dashboard for Discord Server Manager Bot.

## 🚀 Features

- Discord OAuth2 authentication
- Real-time statistics
- Interactive charts
- Server leaderboards
- User profiles
- Mobile responsive
- Dark mode themed

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Socket.IO** - Real-time updates
- **Recharts** - Data visualization
- **Lucide React** - Icons

## 📦 Installation

```bash
npm install
```

## 🔧 Configuration

Create `.env.development`:

```env
VITE_API_URL=http://localhost:3001
```

Create `.env.production`:

```env
VITE_API_URL=https://your-api.up.railway.app
```

## 🚀 Development

```bash
npm run dev
```

Opens at: http://localhost:5173

## 🏗️ Build

```bash
npm run build
```

Output: `dist/` folder

## ☁️ Deploy to Cloudflare Pages

```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Build
npm run build

# Deploy
wrangler pages deploy dist --project-name discord-bot-dashboard
```

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.yourbot.com` |

## 🎨 Customization

### Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  discord: {
    blurple: '#5865F2',
    green: '#57F287',
    yellow: '#FEE75C',
    // ... customize colors
  },
}
```

### Pages

- `src/pages/Home.tsx` - Landing page
- `src/pages/Login.tsx` - Login page
- `src/pages/Dashboard.tsx` - Server selector
- `src/pages/GuildDashboard.tsx` - Server stats
- `src/pages/Leaderboard.tsx` - Rankings

## 📡 API Endpoints

The frontend connects to these backend endpoints:

- `GET /auth/discord` - OAuth login
- `GET /auth/user` - Current user
- `GET /api/guilds` - User's guilds
- `GET /api/guild/:id/stats` - Guild statistics
- `GET /api/guild/:id/leaderboard` - Rankings
- `GET /api/guild/:id/activity` - Activity data

## 🔒 Security

- HTTPS only in production
- CORS configured
- Session cookies
- OAuth2 state parameter
- XSS protection

## 📚 Documentation

- **Main Project**: See `../../README.md`
- **Deployment**: See `../../DEPLOY_NOW.md`
- **API Backend**: See `../server/README.md`

## 🎯 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📄 License

MIT License - See `../../LICENSE`

## 🆘 Support

For issues or questions, open an issue on GitHub.

---

**Part of the Discord Server Manager Bot project** 🤖


