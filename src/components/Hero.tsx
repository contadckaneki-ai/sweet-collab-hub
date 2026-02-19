import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, getDiscordAuthUrl } from "@/lib/discord";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden pb-20 pt-16 md:pt-24">
      {/* Background glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]"
      />

      <div className="container text-center">
        {/* Savings badge */}
        <motion.div {...fadeUp(0.1)} className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">
            Na Kally você economiza{" "}
            <span className="font-semibold text-foreground">+R$1,380/ano</span>
          </span>
          <span className="text-primary">Saiba mais</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          {...fadeUp(0.2)}
          className="mx-auto max-w-4xl font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl"
        >
          De um simples bot para Discord, para uma{" "}
          <span className="gradient-text">plataforma no-code</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.35)}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          Crie sistemas complexos, automações poderosas e integrações avançadas
          sem escrever uma linha de código. Transforme ideias em realidade com
          nosso builder intuitivo!
        </motion.p>

        {/* CTA */}
        <motion.div {...fadeUp(0.5)} className="mt-10">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-8 text-base glow-border transition-transform hover:scale-105"
            onClick={() => isAuthenticated() ? navigate("/dashboard") : window.location.href = getDiscordAuthUrl()}
          >
            Acessar Painel
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Trust bar */}
        <motion.div {...fadeUp(0.65)} className="mt-16">
          <p className="mb-6 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Utilizado por mais de <span className="text-foreground font-bold">4.000</span> servidores
          </p>
          <div className="flex items-center justify-center gap-6 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.05 }}
                className="h-10 w-28 rounded-lg bg-card border border-border/50"
              />
            ))}
          </div>
        </motion.div>

        {/* Builder preview placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-20 max-w-5xl"
        >
          <div className="overflow-hidden rounded-xl border border-border/50 glow-border">
            <div className="aspect-video w-full bg-card" />
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground">
            Esta funcionalidade está em beta
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
