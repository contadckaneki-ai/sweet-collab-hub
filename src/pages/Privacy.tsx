import { motion } from "framer-motion";
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  {
    content:
      "Prezado(a) usuário(a),\n\nBem-vindo(a) a Kally BOT! Esta política de privacidade tem como objetivo fornecer informações detalhadas sobre como coletamos, utilizamos, armazenamos e protegemos os dados pessoais dos nossos usuários. A privacidade dos nossos usuários é de extrema importância para nós e estamos comprometidos em proteger as informações fornecidas enquanto você utiliza o nosso bot no Discord.",
  },
  {
    title: "Coleta de Dados",
    intro: "A Kally BOT poderá coletar e armazenar os seguintes tipos de dados:",
    list: [
      "Informações de perfil do Discord, como nome de usuário e ID, necessárias para fornecer funcionalidades personalizadas;",
      "Mensagens enviadas ao Kally BOT, a fim de processar comandos e fornecer as respostas adequadas.",
      "Informações de perfil do Usuário, como nome de usuário/ID & e-mail/número de telefone, necessários para fornecer funcionalidades personalizadas e mais assertivas, como pagamentos, proteção legal para empresa & contratante e por fim para relação de consumo & utilização do serviço;",
    ],
  },
  {
    title: "Uso dos Dados",
    intro: "Os dados coletados são utilizados exclusivamente para as seguintes finalidades:",
    list: [
      "Responder adequadamente aos comandos e solicitações enviadas pelo usuário;",
      "Melhorar e otimizar continuamente a experiência do Kally BOT;",
      "Monitorar o desempenho e solucionar problemas técnicos.",
    ],
  },
  {
    title: "Compartilhamento de Dados",
    content:
      "O Kally BOT não compartilha os dados pessoais dos usuários com terceiros, a menos que seja estritamente necessário para o correto funcionamento do bot ou quando exigido por lei.",
  },
  {
    title: "Armazenamento de Dados",
    content:
      "Os dados coletados são armazenados em servidores seguros e acessados somente por pessoal autorizado, garantindo a proteção e confidencialidade das informações dos usuários.",
  },
  {
    title: "Segurança dos Dados",
    content:
      "Empregamos medidas de segurança adequadas para proteger os dados dos usuários contra acesso não autorizado, alteração, divulgação ou destruição não autorizada.",
  },
  {
    title: "Uso de Cookies",
    content: "O Kally BOT não utiliza cookies para coletar informações pessoais dos usuários.",
  },
  {
    title: "Menores de Idade",
    content:
      "O Kally BOT não é destinado a menores de 13 anos. Não coletamos intencionalmente informações de identificação pessoal de crianças menores dessa idade.",
  },
  {
    title: "Alterações na Política de Privacidade",
    content:
      "Reservamos o direito de alterar esta política de privacidade de tempos em tempos. Caso ocorram mudanças significativas, notificaremos os usuários através de uma mensagem no servidor do Discord.",
  },
  {
    title: "Contato",
    content:
      "Se tiver alguma dúvida ou preocupação sobre a política de privacidade do Kally BOT, por favor, entre em contato conosco através do Discord.",
  },
];

const Privacy = () => {
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
            Política de Privacidade da Kally BOT para Discord
          </motion.h1>

          <div className="mx-auto mt-12 max-w-3xl space-y-10">
            {sections.map((section, i) => (
              <motion.div
                key={section.title || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
              >
                {section.title && (
                  <h2 className="font-display text-xl font-bold md:text-2xl">{section.title}</h2>
                )}

                {section.content && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                    {section.content}
                  </p>
                )}

                {section.intro && (
                  <p className="mt-3 text-sm text-muted-foreground">{section.intro}</p>
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="space-y-4 text-sm leading-relaxed text-muted-foreground"
            >
              <p>
                Ao utilizar o Kally BOT, você concorda com os termos desta política de privacidade.
                Lembre-se de revisar esta política periodicamente para se manter informado sobre como
                seus dados estão sendo tratados.
              </p>
              <p>
                Agradecemos pela confiança em nossa plataforma e nos colocamos à disposição para
                esclarecer qualquer questão relacionada à privacidade dos seus dados.
              </p>
              <p className="font-medium text-foreground">
                Atenciosamente,
                <br />
                Equipe do Kally BOT
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
