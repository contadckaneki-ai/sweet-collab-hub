import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Banner = () => {
  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="gradient-banner py-2 text-center text-sm font-medium text-primary-foreground"
    >
      <div className="container flex items-center justify-center gap-2">
        <motion.span
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="rounded-md bg-background/20 px-2 py-0.5 text-xs font-bold"
        >
          50% OFF!
        </motion.span>
        <span>Em todos os planos durante o mês de fevereiro!</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </div>
    </motion.div>
  );
};

export default Banner;
