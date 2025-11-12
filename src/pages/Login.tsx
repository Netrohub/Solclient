import { Button } from "@/components/ui/button";
import { ShieldCheck, Sparkles } from "lucide-react";
import { API_URL } from "@/lib/api";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/40 to-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 bg-card/90 backdrop-blur-lg border border-border/60 shadow-2xl rounded-3xl p-8 md:p-10">
        <div className="flex items-center justify-center gap-3 text-primary">
          <ShieldCheck className="w-10 h-10" />
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Reinforcement Command Center
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Sign in with Discord to manage reinforcements, alerts, and moderator performance in real time.
          </p>
        </div>

        <div className="bg-secondary/50 rounded-2xl p-6 space-y-4 text-left text-sm">
          <div>
            <p className="text-foreground font-semibold mb-1">You&apos;ll be able to:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Monitor active reinforcements and live alerts</li>
              <li>Assign moderators and track response times</li>
              <li>Review audit trails and analytics for your guild</li>
            </ul>
          </div>
          <p className="text-xs text-muted-foreground/80">
            We use secure session-based authentication. Only approved moderators should proceed.
          </p>
        </div>

        <Button
          size="lg"
          className="w-full gradient-primary text-white shadow-lg hover:shadow-primary/40"
          asChild
        >
          <a href={`${API_URL}/auth/discord`}>
            Continue with Discord
          </a>
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Need access? Contact a lead moderator to be added to the reinforcement team.
        </p>
      </div>
    </div>
  );
};

export default Login;
