import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser, fetchGuilds } from "@/lib/dashboard-api";
import type { DiscordGuild, DiscordUser } from "@/types/api";
import { api, ensureCsrfToken } from "@/lib/api";

interface AuthContextValue {
  user: DiscordUser | null;
  guilds: DiscordGuild[];
  selectedGuildId: string | null;
  setSelectedGuildId: (guildId: string) => void;
  isLoading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const SELECTED_GUILD_KEY = "dashboard_selected_guild";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userQuery = useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      await ensureCsrfToken();
      return fetchCurrentUser();
    },
    retry: false,
  });

  const guildsQuery = useQuery({
    queryKey: ["guilds"],
    queryFn: fetchGuilds,
    enabled: Boolean(userQuery.data),
    retry: false,
  });

  const [selectedGuildId, setSelectedGuildIdState] = useState<string | null>(() => {
    return localStorage.getItem(SELECTED_GUILD_KEY);
  });

  useEffect(() => {
    if (!guildsQuery.data || guildsQuery.data.length === 0) {
      return;
    }

    if (selectedGuildId && guildsQuery.data.some((guild) => guild.id === selectedGuildId)) {
      return;
    }

    const firstGuild = guildsQuery.data[0];
    if (firstGuild) {
      setSelectedGuildIdState(firstGuild.id);
      localStorage.setItem(SELECTED_GUILD_KEY, firstGuild.id);
    }
  }, [guildsQuery.data, selectedGuildId]);

  const setSelectedGuildId = (guildId: string) => {
    setSelectedGuildIdState(guildId);
    localStorage.setItem(SELECTED_GUILD_KEY, guildId);
  };

  const logout = async () => {
    await ensureCsrfToken();
    await api.get("/auth/logout");
    setSelectedGuildIdState(null);
    localStorage.removeItem(SELECTED_GUILD_KEY);
    await userQuery.refetch();
    await guildsQuery.refetch();
  };

  const refresh = async () => {
    await Promise.all([userQuery.refetch(), guildsQuery.refetch()]);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user: userQuery.data ?? null,
      guilds: guildsQuery.data ?? [],
      selectedGuildId,
      setSelectedGuildId,
      isLoading: userQuery.isLoading || guildsQuery.isLoading,
      logout,
      refresh,
    }),
    [userQuery.data, userQuery.isLoading, guildsQuery.data, guildsQuery.isLoading, selectedGuildId]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
