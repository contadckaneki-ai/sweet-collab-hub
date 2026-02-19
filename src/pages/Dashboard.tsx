import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getToken, fetchUserGuilds, getGuildIconUrl, isAuthenticated, type DiscordGuild } from "@/lib/discord";

const Dashboard = () => {
  const navigate = useNavigate();
  const [guilds, setGuilds] = useState<DiscordGuild[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/", { replace: true });
      return;
    }
    const token = getToken()!;
    fetchUserGuilds(token)
      .then(setGuilds)
      .catch(() => navigate("/", { replace: true }))
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Banner />
      <Navbar showUserMenu />

      <main className="flex-1 py-16">
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center font-display text-3xl font-bold md:text-4xl"
          >
            Meus Servidores
          </motion.h1>

          {loading ? (
            <div className="flex justify-center mt-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="mx-auto mt-10 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[...guilds].sort((a, b) => (a.owner === b.owner ? 0 : a.owner ? -1 : 1)).map((guild, i) => {
                const iconUrl = getGuildIconUrl(guild);
                return (
                  <motion.button
                    key={guild.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.03 }}
                    whileHover={guild.owner ? { scale: 1.02, transition: { duration: 0.15 } } : undefined}
                    whileTap={guild.owner ? { scale: 0.98 } : undefined}
                    onClick={() => guild.owner && navigate(`/server/${guild.id}/settings`)}
                    disabled={!guild.owner}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left group ${guild.owner ? "border-primary/40 bg-card glow-border card-hover cursor-pointer" : "border border-border/50 bg-card opacity-50 cursor-not-allowed"}`}
                  >
                    {iconUrl ? (
                      <img src={iconUrl} alt={guild.name} className="h-10 w-10 shrink-0 rounded-full" />
                    ) : (
                      <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-sm font-bold ${guild.owner ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {guild.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{guild.name}</p>
                      <p className={`text-xs ${guild.owner ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                        {guild.owner ? "Dono" : "Membro"}
                      </p>
                    </div>
                    {guild.owner && <ChevronRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />}
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
