# Discord Bot Dashboard

A mobile-first, production-ready dashboard for monitoring and managing Discord moderation bot operations.

## 🚀 Quick Start

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (configure VITE_API_URL if different)
VITE_API_URL=http://localhost:3001 npm run build
```

## 📋 Features

- ✅ **Mobile-First Design** - Responsive from 320px to 4K
- ✅ **Complete Layout System** - Sidebar, top bar, mobile bottom nav
- ✅ **Reinforcement Management** - Queue system with status tracking
- ✅ **Alert Monitoring** - Real-time incident tracking
- ✅ **Team Workload** - Moderator stats and assignment tracking
- ✅ **Analytics Dashboard** - Performance metrics and trends
- ✅ **Dark Mode Support** - Full theme support
- ✅ **Design System** - Semantic tokens, gradients, shadows

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/           # App shell (sidebar, topbar, mobile nav)
│   ├── dashboard/        # Dashboard-specific components
│   └── ui/              # Shadcn UI components (40+ components)
├── pages/               # Route pages (Overview, Reinforcements, Analytics, Team)
├── hooks/               # Custom React hooks
├── lib/                 # Utilities
└── index.css            # Design system tokens
```

## 🎨 Design System

All styling uses semantic tokens defined in `src/index.css`:

**Colors:** `primary`, `accent`, `success`, `warning`, `destructive`  
**Gradients:** `gradient-primary`, `gradient-card`, `gradient-subtle`  
**Shadows:** `shadow-card`, `shadow-hover`, `shadow-sm/md/lg/xl`  
**Animations:** `transition-smooth`, `transition-spring`

**Never use hard-coded colors!** Always use semantic tokens:
```tsx
// ✅ Good
<div className="bg-primary text-primary-foreground">

// ❌ Bad
<div className="bg-blue-500 text-white">
```

## 🔌 Integration Guide

See `DASHBOARD_GUIDE.md` for comprehensive integration documentation including:

- Data contracts (TypeScript interfaces)
- Component API reference
- Backend endpoint requirements
- WebSocket event structure
- Step-by-step integration examples

## 📱 Responsive Breakpoints

- **Mobile:** `< 640px` - Bottom nav, stacked cards
- **Tablet:** `640px - 1024px` - 2-column grids
- **Desktop:** `≥ 1024px` - Persistent sidebar, 4-column grids

## 🧩 Key Components

### Layout
- `DashboardLayout` - Main app shell
- `Sidebar` - Desktop navigation
- `TopBar` - Header with search
- `MobileNav` - Bottom navigation (mobile only)

### Dashboard
- `MetricCard` - KPI display
- `ReinforcementCard` - Individual request
- `ReinforcementQueue` - Tabbed queue view
- `AlertPanel` - Active alerts
- `ModWorkloadCard` - Moderator stats
- `ActivityFeed` - Bot action log

## 🛠️ Tech Stack

- **React 18** + **TypeScript**
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library (40+ components)
- **Lucide React** - Icons
- **React Query** - Data fetching (ready to use)

## 📊 Data Contracts

All components use typed interfaces. Key data structures:

```typescript
// Reinforcement Request
interface ReinforcementRequest {
  id: string;
  user: string;
  request: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "queued" | "in_progress" | "completed";
  assignee?: string;
  tags?: string[];
  timestamp: string;
  hasAttachment?: boolean;
}

// Alert
interface Alert {
  id: string;
  type: "info" | "warning" | "urgent" | "resolved";
  title: string;
  description: string;
  channel: string;
  user?: string;
  timestamp: string;
}

// Moderator
interface Moderator {
  id: string;
  name: string;
  role: string;
  activeAssignments: number;
  completedToday: number;
  avgResponseTime: string;
  status: "online" | "away" | "offline";
  responseScore: number;
}
```

See `DASHBOARD_GUIDE.md` for complete reference.

## 🔄 Environment

- Create `.env.local` (or export `VITE_API_URL`) pointing to your dashboard API
- The client relies on secure cookies & CSRF tokens—deploy behind HTTPS with matching origin or enable credentialed CORS
- React Query refetches automatically, but you can adjust intervals in the page hooks if needed

## 📚 Documentation

- **Integration Guide:** `DASHBOARD_GUIDE.md`
- **Component Props:** See JSDoc comments in source files
- **Design Tokens:** `src/index.css`
- **Shadcn UI:** https://ui.shadcn.com
- **Lucide Icons:** https://lucide.dev

## 🎯 Current Status

✅ **Complete Frontend** - All UI components and pages hooked to live API endpoints  
✅ **Live Data** - Reinforcements, alerts, analytics, and moderator metrics fetched via React Query  
✅ **Charts** - Recharts visualisations for reinforcement flow, response times, workload, sentiment  
⏳ **Actions** - Queue mutation endpoints & socket broadcasts can be extended alongside the bot

## 🐛 Troubleshooting

**Colors not working?**
- Use semantic tokens (`bg-primary` not `bg-blue-500`)
- Check `index.css` is imported

**Layout broken?**
- Verify imports use `@/` alias
- Check `tailwind.config.ts` content paths

**Components not found?**
- Run `npm install` to ensure dependencies
- Check import paths

See `DASHBOARD_GUIDE.md` for more troubleshooting tips.

---

## Deployment

- Production builds are static; run `npm run build` and deploy the `dist/` folder
- Works great with Cloudflare Pages, Netlify, Vercel, S3/CloudFront, or the dashboard backend’s CDN
- Remember to set `VITE_API_URL` to the deployed API origin (`https://api.yourdomain.com`)
