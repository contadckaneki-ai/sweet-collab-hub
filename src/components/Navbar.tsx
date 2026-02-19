import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { getDiscordAuthUrl, isAuthenticated, getUser, clearToken, getUserAvatarUrl } from "@/lib/discord";

interface NavbarProps {
  showUserMenu?: boolean;
}

const Navbar = ({ showUserMenu = false }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const authed = isAuthenticated();
  const user = getUser();
  const showMenu = showUserMenu || authed;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-display text-2xl font-bold tracking-tight">
          <span className="gradient-text">K</span>ally
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {[
            { label: "Planos", href: "/plans" },
            { label: "Comandos", href: "/#comandos" },
            { label: "Servidor de suporte", href: "/#servidor-de-suporte" },
          ].map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="hidden md:block"
        >
          {showMenu && user ? (
            <div className="relative" ref={avatarRef}>
              <img
                src={getUserAvatarUrl(user)}
                alt="User avatar"
                className="h-9 w-9 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
              />
              <AnimatePresence>
                {avatarMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 z-50 w-56 rounded-md border border-border/50 bg-popover shadow-lg overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-border/50">
                      <p className="text-xs text-muted-foreground">Seja Bem-vindo(a)</p>
                      <p className="text-sm font-semibold text-foreground truncate">{user.global_name || user.username}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <button
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
                        onClick={() => { clearToken(); navigate("/"); }}
                      >
                        <LogOut className="h-4 w-4" />
                        Sair
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="border-primary/30 text-foreground hover:bg-primary/10 hover:border-primary/50"
              onClick={() => isAuthenticated() ? navigate("/dashboard") : window.location.href = getDiscordAuthUrl()}
            >
              Sign in
            </Button>
          )}
        </motion.div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-border/50 bg-background md:hidden"
          >
            <div className="flex flex-col gap-4 p-4">
              <a href="/plans" className="text-sm text-muted-foreground">Planos</a>
              <a href="/#comandos" className="text-sm text-muted-foreground">Comandos</a>
              <a href="/#servidor-de-suporte" className="text-sm text-muted-foreground">Servidor de suporte</a>
              {showMenu && user ? (
                <div className="flex items-center gap-2">
                  <img
                    src={getUserAvatarUrl(user)}
                    alt="User avatar"
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="text-sm text-foreground">{user.global_name || user.username}</span>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-fit border-primary/30"
                  onClick={() => isAuthenticated() ? navigate("/dashboard") : window.location.href = getDiscordAuthUrl()}
                >
                  Sign in
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
