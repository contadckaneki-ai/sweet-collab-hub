import { motion } from "framer-motion";
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  {
    title: "Quem Somos",
    content:
      'Somos uma empresa com foco em desenvolvimento de software, sistemas e bot\'s com o intuito principal de fornecer diversos serviços nesses aspectos para nossos clientes, com isso buscamos sempre a inovação, diferenciação e distância de qualquer outro tipo de serviço, para assim buscar uma experiência única a nossos contratantes.',
  },
  {
    title: "Condições de Contratação de Serviços",
    list: [
      "Idade Mínima de 18 Anos;",
      'Seguir e Aceitar os "Termos de Serviços";',
      "Seguir a legislação vigente em sua região, e seguir totalmente as diretrizes do Discord.",
    ],
  },
  {
    title: "Termos de Serviços",
    intro: "Ao aceitar os termos eu concordo com:",
    list: [
      "Coleta de dados para melhora e captação de informação importantes para mantimento do serviços, pagamento e melhora do mesmo. Isso obviamente sem enviar para terceiros;",
      'Afirmo está em transparência com as "Condições de Contratação de Serviços";',
      "Estar de acordo com a recisão do contrato, isso com ou sem aviso prévio;",
      "Estar de Acordo com possíveis atualizações do bots, oque pode gerar quedas repentinas dos bots por curtos período de tempo;",
      'Estar de acordo que você "contratante" terá 7 dias corridos para efetuar um pedido de reembolso, lembrando que do reembolso será descontado os dias já utilizados;',
      "Estar de acordo que a KallyBOT é de propriedade intelectual da KallyTeam, e que você não poderá revender este serviço, e que caso aconteça poderá sofrer punições;",
      "Estar de acordo que não daremos acesso algum a databases, códigos, painel que fazem parte da configuração da KallyBOT;",
      "Estar de acordo que caso mude o servidor, ou perca o bot por qualquer motivo, não terá garantia de transferência de dados de um server para outro, podemos abrir excessão mas não somos obrigados a fazer;",
      "Estar de acordo que caso abuse de algum bug do sistema poderá ser suspenso das funcionalidades da Kally por tempo determinado/indeterminado;",
      "Estar de acordo em não Difamar ou Prejudicar a imagem dos membros contribuintes da KallyTeam;",
      "Estar de acordo que este documento pode ser alterado, atualizado, e/ou modificado sem aviso prévio.",
    ],
  },
  {
    title: "Rescisão",
    content:
      "A rescisão do contrato sempre terá alguma motivação, com isso deixaremos explícito o que poderá reincidir o contrato de ligamento de nossos serviços com nosso contratante.\n\nLembrando também que nem sempre rescindiremos o contrato, poderemos aplicar punições de acordo com a feitoria do contratante em relação com algum caso específico, e aceitando esses termos você fica de acordo com possíveis penalizações.",
    subtitle: "Motivos Passivos de Punições:",
    list: [
      "Difamação da Imagem dos Membros da KallyTeam e/ou do BOT e sistemas Kally;",
      "Não seguir os termos/regras do servidor de suporte;",
      "Ataque a outros servidores de utilização do sistema(Kally) pode gerar penalização;",
      "Ataques aos sistemas Kally pode gerar penalização;",
      "Qualquer tipo atitude de teor criminal ou ataque cívil(ataque a integridade de terceiros) que vá contra a legislação vigente em nosso país Natal(Brasil) e que vá contra a TOS do Discord;",
      "Usufruir de bugs do sistema para benefício próprio;",
      "Colocar Icon & Nickname do BOT que fuja da diretrizes do discord, ou que de alguma forma possa prejudicar a KallyTeam;",
      "Utilizar nossos serviços para cometer atos fraudulentos, ou qualquer coisa que afete a integridade da KallyTeam & KallyBOT.",
    ],
  },
  {
    title: "Direito Autoral",
    content:
      'A KallyBOT pertence intelectualmente a KallyTeam, com isso quaisquer serviços, imagens, atividade ou design é de direito único a nós, então caso contrate nosso serviço com intuito de "cópia" poderá ter seu contrato encerrado sem aviso prévio e com penalizações monetária, sendo passivo a uma resolução formal.',
  },
  {
    title: "Contrato de Disputa",
    content:
      "Ao utilizar algum produto da Kally Team, você concorda que caso esteja tendo problemas com os serviços prestados, e que tenha algum problema não resolvido, mal-resolvido ou qualquer coisa do gênero, primeiro entrará em contrato direto com a Kally Team, para uma solução formal do problema, antes da abertura de qualquer disputa.",
  },
];

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Banner />
      <Navbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center font-display text-3xl font-bold md:text-5xl"
          >
            Termos de Serviços Gerais
          </motion.h1>

          <div className="mx-auto mt-12 max-w-3xl space-y-10">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
              >
                <h2 className="font-display text-xl font-bold md:text-2xl">{section.title}</h2>

                {section.content && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                    {section.content}
                  </p>
                )}

                {section.intro && (
                  <p className="mt-3 text-sm text-muted-foreground">{section.intro}</p>
                )}

                {section.subtitle && (
                  <p className="mt-4 text-sm font-semibold text-foreground">{section.subtitle}</p>
                )}

                {section.list && (
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {section.list.map((item, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
