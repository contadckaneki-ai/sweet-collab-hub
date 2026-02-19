import { Shield, Gavel, Ticket, MessageSquare, Clock, Crown } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Shield, title: "Proteção Anti Raid", description: "Mantenha sua comunidade protegida contra ataques em massa." },
  { icon: Gavel, title: "Moderação", description: "Mantenha sua comunidade limpa com um conjunto versátil de recursos de moderação." },
  { icon: Ticket, title: "Sistema de Tickets", description: "Atenda melhor aos seus usuários com o sistema de tickets!" },
  { icon: MessageSquare, title: "Sistema de Mensagens", description: "Crie embeds, adicione componentes, crie automações e muito mais!" },
  { icon: Clock, title: "Tempo em Call", description: "Conte o tempo que os membros ficam em canais de voz na sua comunidade!" },
  { icon: Crown, title: "Sistema de Vips", description: "Crie vips personalizados, onde os usuários poderão ter benefícios exclusivos!" },
];

const Features = () => {
  return (
    <section className="py-24" id="comandos">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Mais que um bot, uma{" "}
            <span className="gradient-text">plataforma completa</span>
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Da moderação básica a sistemas complexos de automação — tudo em uma
            única plataforma no-code.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group rounded-xl border border-border/50 bg-card p-6 card-hover"
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
