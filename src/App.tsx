import { useMemo } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Overview from "@/pages/Overview";
import Analytics from "@/pages/Analytics";
import Team from "@/pages/Team";
import Reinforcements from "@/pages/Reinforcements";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import { useAuth } from "@/contexts/AuthContext";

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-3">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-muted-foreground text-sm">Preparing your dashboard…</p>
    </div>
  </div>
);

const App = () => {
  const { user, isLoading } = useAuth();

  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {isAuthenticated ? (
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="reinforcements" element={<Reinforcements />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="team" element={<Team />} />
            </Route>
          ) : (
            <Route path="/" element={<Navigate to="/login" replace />} />
          )}

          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
