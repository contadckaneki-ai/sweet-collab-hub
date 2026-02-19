import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  "Desenvolvido com base na opinião da comunidade",
  "Opções de personalização detalhadas",
  "Gerenciamento de servidor completo",
  "Painel de controle intuitivo",
  "Recursos gratuitos",
  "99.99% uptime",
  "Proteção avançada e muito mais!",
];

const competitors = [
  { name: "Bot A", price: "R$ 55,00" },
  { name: "Bot B", price: "R$ 30,00" },
  { name: "Bot C", price: "R$ 30,00" },
];

const PricingComparison = () => {
  return (
    <section className="py-24" id="planos">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Economize tempo e{" "}
            <span className="gradient-text">dinheiro</span>
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Equipe seu servidor com um arsenal completo de ferramentas, todas
            acessíveis em um único painel.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-xl border border-primary/30 bg-card p-8 glow-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="font-display text-2xl font-bold">
                <span className="gradient-text">K</span>ally Bot
              </span>
            </div>

            <ul className="space-y-3">
              {benefits.map((b, i) => (
                <motion.li
                  key={b}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="flex items-start gap-2.5 text-sm text-muted-foreground"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {b}
                </motion.li>
              ))}
            </ul>

            <div className="mt-8 border-t border-border pt-6">
              <span className="font-display text-3xl font-bold">R$ 0 - R$ 15</span>
              <span className="text-muted-foreground">/mês</span>
              <p className="mt-2 text-sm text-muted-foreground">A melhor ferramenta em um único lugar</p>
            </div>

            <Button className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Ver Preços
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-xl border border-border/50 bg-card p-8"
          >
            <p className="mb-6 text-sm font-medium text-muted-foreground">Alternativa: múltiplas assinaturas</p>

            <div className="space-y-4">
              {competitors.map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted" />
                    <span className="text-sm font-medium">{c.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-destructive">{c.price}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <span className="font-display text-3xl font-bold text-destructive">+R$ 115</span>
              <span className="text-muted-foreground">/mês</span>
              <p className="mt-2 text-sm text-muted-foreground">Você teria que gerenciar várias assinaturas separadas.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PricingComparison;
