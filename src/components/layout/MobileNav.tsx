import { LayoutDashboard, BarChart3, Users, ListChecks } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const navigation = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Queue", href: "/reinforcements", icon: ListChecks },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Team", href: "/team", icon: Users },
];

export const MobileNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-xl lg:hidden">
      <div className="flex items-center justify-around">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === "/"}
            className="flex flex-col items-center gap-1 px-4 py-3 text-xs font-medium text-muted-foreground transition-smooth flex-1"
            activeClassName="text-primary"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
