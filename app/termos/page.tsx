import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import type { Metadata } from "next";
import {
  FileText,
  ShoppingBag,
  CreditCard,
  Truck,
  RefreshCw,
  Shield,
  AlertCircle,
  Scale,
  Globe,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Termos de Uso e Condições Gerais de Compra da Raízes. Leia com atenção antes de realizar sua compra.",
};

const SECTIONS = [
  {
    id: "aceitacao",
    icon: FileText,
    titulo: "1. Aceitação dos termos",
    conteudo: [
      {
        tipo: "texto",
        valor:
          "Estes Termos de Uso e Condições Gerais de Compra regem a relação entre a Raízes Oficial Vendas LTDA (\"Raízes\", \"nós\") e você, usuário ou cliente (\"você\"), no acesso e uso do site raizesoficial.com.br e de qualquer plataforma digital associada à marca.",
      },
      {
        tipo: "texto",
        valor:
          "Ao navegar neste site, criar uma conta, adicionar produtos ao carrinho ou finalizar uma compra, você declara que leu, compreendeu e concorda com todos os termos aqui estabelecidos, bem como com nossa Política de Privacidade.",
      },
      {
        tipo: "texto",
        valor:
          "Caso não concorde com qualquer disposição destes Termos, recomendamos que não utilize os serviços. Para dúvidas, entre em contato pelo e-mail contato@raizesoficial.com.br antes de realizar qualquer transação.",
      },
      {
        tipo: "destaque",
        valor:
          "A Raízes se reserva o direito de atualizar estes Termos a qualquer momento. Mudanças relevantes serão comunicadas por e-mail e por aviso no site. O uso continuado após a publicação das alterações implica aceite tácito.",
      },
    ],
  },
  {
    id: "cadastro",
    icon: ShoppingBag,
    titulo: "2. Cadastro e conta do usuário",
    conteudo: [
      {
        tipo: "texto",
        valor:
          "Para realizar compras no site da Raízes, é necessário criar uma conta fornecendo informações verdadeiras, completas e atualizadas. Você é o único responsável pela veracidade dos dados fornecidos e pelas atividades realizadas com suas credenciais.",
      },
      {
        tipo: "lista",
        itens: [
          "Você deve ter capacidade civil para realizar contratos, nos termos do Código Civil Brasileiro. Menores de 18 anos devem estar assistidos ou representados por seus responsáveis legais.",
          "É vedado criar mais de uma conta por CPF. Contas duplicadas podem ser encerradas sem aviso prévio.",
          "Você é responsável por manter sua senha de acesso em sigilo. Em caso de suspeita de uso não autorizado, altere sua senha imediatamente e nos comunique.",
          "Dados desatualizados que causem falha na entrega são de responsabilidade do cliente. A Raízes não se responsabiliza por pedidos entregues em endereços desatualizados fornecidos pelo usuário.",
          "A Raízes se reserva o direito de suspender ou encerrar contas que violem estes Termos, pratiquem fraude ou comportamento abusivo.",
        ],
      },
    ],
  },
  {
    id: "pedidos",
    icon: ShoppingBag,
    titulo: "3. Pedidos e disponibilidade de produtos",
    conteudo: [
      {
        tipo: "texto",
        valor:
          "A realização de um pedido constitui uma proposta de compra sujeita à confirmação pela Raízes. Um pedido é considerado aceito somente após a confirmação de pagamento e o envio do e-mail de confirmação ao cliente.",
      },
      {
        tipo: "lista",
        itens: [
          "Os produtos estão sujeitos à disponibilidade de estoque no momento da confirmação do pagamento. Em caso de indisponibilidade após a compra, o cliente será informado e receberá reembolso integral ou poderá optar por outro produto de mesmo valor.",
          "Imagens e descrições dos produtos têm caráter ilustrativo e podem apresentar pequenas variações de cor em função das configurações de tela do dispositivo. As especificações técnicas (composição, gramatura, dimensões) são as informações vinculantes.",
          "Eventuais erros de precificação no site (ex.: produto com valor claramente incoerente com o mercado) não obrigam a Raízes a honrar o preço incorreto. O cliente será informado do erro e poderá cancelar o pedido com reembolso integral.",
          "A Raízes se reserva o direito de cancelar pedidos que identifique como suspeitos de fraude, em desacordo com estas condições ou que apresentem indícios de revenda não autorizada.",
          "O número do pedido gerado no sistema é o documento de referência para todas as comunicações sobre aquela transação.",
        ],
      },
    ],
  },
  {
    id: "pagamento",
    icon: CreditCard,
    titulo: "4. Pagamento e segurança financeira",
    conteudo: [
      {
        tipo: "texto",
        valor:
          "Aceitamos as seguintes formas de pagamento, processadas com segurança pela plataforma Asaas:",
      },
      {
        tipo: "lista-cards",
        itens: [
          {
            titulo: "Cartão de crédito",
            desc: "Parcelamento disponível conforme condições exibidas no checkout. As parcelas são calculadas com ou sem juros conforme a política vigente no momento da compra.",
          },
          {
            titulo: "PIX",
            desc: "Aprovação imediata após confirmação do pagamento pelo Banco Central. O pedido entra em processamento em até 30 minutos após a confirmação.",
          },
          {
            titulo: "Boleto bancário",
            desc: "O pedido é reservado por até 3 dias úteis. Após o vencimento sem pagamento, o pedido é cancelado automaticamente e os itens voltam ao estoque.",
          },
        ],
      },
      {
        tipo: "texto",
        valor:
          "Todos os dados financeiros são processados em ambiente criptografado (TLS 1.3). A Raízes não armazena dados completos de cartão de crédito em nenhuma hipótese. Em caso de suspeita de fraude, reservamo-nos o direito de solicitar documentos adicionais de verificação antes de processar o pedido.",
      },
      {
        tipo: "destaque",
        valor:
          "Os preços exibidos incluem os tributos federais aplicáveis na data de exibição, exceto frete. O valor do frete é calculado no checkout com base no CEP de destino e no peso/dimensão do pedido.",
      },
    ],
  },
  {
    id: "entrega",
    icon: Truck,
    titulo: "5. Entrega e responsabilidades logísticas",
    conteudo: [
      {
        tipo: "texto",
        valor:
          "A Raízes realiza entregas para todo o território nacional por meio de parceiros logísticos (Correios, JadLog e outras transportadoras integradas via Melhor Envio). O prazo estimado começa a contar a partir da confirmação do pagamento.",
      },
      {
        tipo: "lista",
        itens: [
          "Os prazos de entrega são estimativas baseadas em dados históricos e na localização do CEP de destino. Podem variar em função de greves, feriados, condições climáticas ou sobrecargas operacionais das transportadoras.",
          "O frete é calculado no checkout. A Raízes não é responsável por taxas adicionais cobradas por transportadoras em situações excepcionais após o despacho.",
          "A Raízes realiza o despacho do pedido em até 3 dias úteis após a confirmação do pagamento. Pedidos realizados após as 14h de sexta-feira entram em processamento na segunda-feira seguinte.",
          "O cliente é responsável por verificar o recebimento e comunicar eventuais danos na embalagem em até 48 horas, com fotos, antes de abrir completamente o pacote.",
          "Em caso de produto não entregue após o prazo estimado + 5 dias úteis de tolerância, o cliente deve abrir chamado em nossa central de atendimento.",
          "Pedidos não entregues por ausência do destinatário ficam disponíveis para retirada na agência por 7 dias corridos antes de serem devolvidos ao remetente. A reentrega está sujeita a nova cobrança de frete.",
        ],
      },
    ],
  },
  {
    id: "trocas",
    icon: RefreshCw,
    titulo: "6. Trocas, devoluções e garantia",
    conteudo: [
      {
        tipo: "texto",
        valor:
          "Nossa política de trocas e devoluções é regida pelos princípios do Código de Defesa do Consumidor (Lei nº 8.078/1990) e pelas condições descritas na nossa página dedicada a este tema.",
      },
      {
        tipo: "lista",
        itens: [
          "Direito de arrependimento: compras pela internet têm direito de desistência em até 7 dias corridos após o recebimento, conforme o CDC (art. 49), com reembolso integral incluindo frete.",
          "Prazo para troca por preferência: 30 dias a contar da data de recebimento, para peças sem uso, com etiqueta original e embalagem.",
          "Garantia contra desbotamento: 2 anos para falhas causadas por uso e lavagem normais.",
          "Defeito de fabricação: tratado como garantia legal (90 dias para produtos duráveis, conforme CDC art. 26, além da nossa garantia estendida de 2 anos contra desbotamento).",
          "O processo completo de trocas está descrito na página Trocas e Devoluções, que é parte integrante destes Termos.",
        ],
      },
      {
        tipo: "texto",
        valor:
          "Para iniciar qualquer processo de troca ou devolução, entre em contato pelo e-mail contato@raizesoficial.com.br com o número do pedido e descrição da situação.",
      },
    ],
  },
  {
    id: "propriedade",
    icon: Shield,
    titulo: "7. Propriedade intelectual e uso da marca",
    conteudo: [
      {
        tipo: "texto",
        valor:
          "Todo o conteúdo disponível neste site, incluindo mas não se limitando a: nome e logotipo da Raízes, fotografias de produtos, textos descritivos, layouts, interfaces, design, tipografia, paletas de cores, código-fonte e materiais editoriais, é de titularidade exclusiva da Raízes ou de seus licenciantes, protegido pela Lei nº 9.610/1998 (Lei de Direitos Autorais) e pela Lei nº 9.279/1996 (Lei de Propriedade Industrial).",
      },
      {
        tipo: "lista",
        itens: [
          "É expressamente proibida a reprodução, cópia, distribuição, venda ou uso comercial de qualquer conteúdo deste site sem autorização prévia e por escrito da Raízes.",
          "O uso da marca Raízes, de suas variações ou de nomes confusamente similares para fins comerciais é proibido sem licença expressa.",
          "Imagens dos produtos não podem ser utilizadas em anúncios, revenda ou qualquer contexto comercial sem autorização.",
          "A compra de produtos da Raízes não transfere qualquer direito de propriedade intelectual sobre o design, a marca ou o conteúdo associados.",
          "Usuários que identificarem uso indevido da marca ou conteúdo são encorajados a reportar pelo e-mail contato@raizesoficial.com.br.",
        ],
      },
    ],
  },
  {
    id: "proibicoes",
    icon: AlertCircle,
    titulo: "8. Condutas proibidas",
    conteudo: [
      {
        tipo: "texto",
        valor: "Ao utilizar este site, você se compromete a não:",
      },
      {
        tipo: "lista",
        itens: [
          "Fornecer informações falsas, enganosas ou de terceiros sem autorização.",
          "Tentar acessar áreas restritas do sistema ou contas de outros usuários.",
          "Utilizar robôs, scrapers ou qualquer automação para coletar dados do site.",
          "Realizar compras com dados de pagamento de terceiros sem autorização.",
          "Adquirir produtos para revenda sem autorização expressa da Raízes.",
          "Publicar avaliações falsas, difamatórias ou que violem direitos de terceiros.",
          "Tentar comprometer a integridade, desempenho ou segurança da plataforma.",
          "Usar o site para qualquer atividade ilegal, fraudulenta ou que viole direitos de terceiros.",
        ],
      },
      {
        tipo: "texto",
        valor:
          "Violações destas condutas podem resultar em suspensão imediata de conta, cancelamento de pedidos, bloqueio de futuros acessos e, conforme a gravidade, em responsabilização civil e criminal nos termos da lei brasileira.",
      },
    ],
  },
  {
    id: "responsabilidade",
    icon: Scale,
    titulo: "9. Limitação de responsabilidade",
    conteudo: [
      {
        tipo: "texto",
        valor:
          "A Raízes empenha todos os esforços razoáveis para manter o site disponível e funcional 24 horas por dia, 7 dias por semana. No entanto, não garante disponibilidade ininterrupta e não se responsabiliza por:",
      },
      {
        tipo: "lista",
        itens: [
          "Falhas temporárias de acesso decorrentes de manutenção, atualização de sistemas ou fatores técnicos fora de nosso controle.",
          "Danos causados por uso inadequado do site, tentativas de invasão ou vírus introduzidos por terceiros no dispositivo do usuário.",
          "Atrasos nas entregas causados por transportadoras, condições climáticas, greves, desastres naturais ou outros eventos de força maior.",
          "Prejuízos decorrentes de informações incorretas fornecidas pelo próprio cliente no cadastro ou no endereço de entrega.",
          "Indisponibilidade de produtos após confirmação de pedido por esgotamento de estoque não identificado em tempo real, garantindo-se neste caso o reembolso integral.",
        ],
      },
      {
        tipo: "texto",
        valor:
          "Em nenhuma hipótese a responsabilidade total da Raízes por danos decorrentes de uso deste site excederá o valor pago pelo cliente na transação que originou o dano.",
      },
    ],
  },
  {
    id: "lgpd",
    icon: Shield,
    titulo: "10. Proteção de dados pessoais",
    conteudo: [
      {
        tipo: "texto",
        valor:
          "O tratamento de dados pessoais realizado pela Raízes está inteiramente descrito na nossa Política de Privacidade, que é parte integrante destes Termos de Uso. Ao aceitar estes Termos, você também reconhece ter lido e compreendido a Política de Privacidade.",
      },
      {
        tipo: "texto",
        valor:
          "Em resumo: coletamos apenas os dados necessários para as finalidades declaradas, tratamos com base em fundamentos legais válidos, protegemos com medidas técnicas adequadas e respeitamos todos os seus direitos como titular, nos termos da LGPD (Lei nº 13.709/2018).",
      },
    ],
  },
  {
    id: "foro",
    icon: Globe,
    titulo: "11. Lei aplicável e foro",
    conteudo: [
      {
        tipo: "texto",
        valor:
          "Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Eventuais conflitos decorrentes da interpretação ou execução deste instrumento serão submetidos ao foro da comarca do domicílio do consumidor, conforme prevê o Código de Defesa do Consumidor (art. 101, inciso I), sem prejuízo do direito de eleição de foro de comum acordo entre as partes.",
      },
      {
        tipo: "texto",
        valor:
          "Antes de qualquer medida judicial, encorajamos a tentativa de resolução amigável pelo e-mail contato@raizesoficial.com.br. A Raízes se compromete a responder dentro de 5 dias úteis e a buscar solução justa para ambas as partes.",
      },
      {
        tipo: "texto",
        valor:
          "Os consumidores também podem registrar reclamações no portal consumidor.gov.br, plataforma oficial do Governo Federal para resolução de conflitos entre empresas e consumidores.",
      },
    ],
  },
];

export default function TermosPage() {
  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero ── */}
        <section className="bg-obsidian">
          <div className="raizes-container py-20 md:py-28">
            <div className="max-w-2xl">
              <p className="label-category text-stone-600 mb-5">Legal</p>
              <h1
                className="font-serif text-ivory font-normal tracking-tighter leading-[1.05] mb-6"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
              >
                Termos de Uso.
              </h1>
              <p className="font-sans text-stone-400 text-base leading-relaxed max-w-lg mb-8">
                Condições gerais de uso do site e de compra na Raízes. Escrito
                para ser lido de verdade: sem jargão jurídico desnecessário,
                sem letras miúdas que escondem o que importa.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 px-4 py-2">
                  <Scale size={13} strokeWidth={1.5} className="text-emerald-500" />
                  <span className="font-sans text-xs text-stone-400 tracking-wide">Conforme CDC e legislação brasileira</span>
                </div>
                <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 px-4 py-2">
                  <Shield size={13} strokeWidth={1.5} className="text-emerald-500" />
                  <span className="font-sans text-xs text-stone-400 tracking-wide">LGPD aplicada integralmente</span>
                </div>
              </div>
              <p className="font-sans text-stone-700 text-xs mt-8 tracking-wide">
                Última atualização: março de 2026
              </p>
            </div>
          </div>
        </section>

        {/* ── Índice rápido ── */}
        <section className="bg-stone-50 border-b border-stone-100">
          <div className="raizes-container py-10">
            <p className="label-category text-stone-400 mb-5">Navegação rápida</p>
            <div className="flex flex-wrap gap-2">
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="font-sans text-xs text-stone-600 border border-stone-200 bg-white px-4 py-2 hover:border-obsidian hover:text-obsidian transition-colors duration-200"
                >
                  {s.titulo.replace(/^\d+\.\s/, "")}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Conteúdo ── */}
        <section className="bg-ivory">
          <div className="raizes-container py-16 md:py-24">
            <div className="max-w-3xl space-y-16">
              {SECTIONS.map((sec) => {
                const Icon = sec.icon;
                return (
                  <div key={sec.id} id={sec.id} className="scroll-mt-24">
                    <div className="flex items-start gap-4 mb-7">
                      <div className="shrink-0 w-9 h-9 bg-obsidian flex items-center justify-center mt-0.5">
                        <Icon size={15} strokeWidth={1.5} className="text-ivory" />
                      </div>
                      <h2 className="font-serif text-2xl md:text-3xl font-normal tracking-tighter text-obsidian leading-tight">
                        {sec.titulo}
                      </h2>
                    </div>

                    <div className="space-y-5" style={{ paddingLeft: "3.25rem" }}>
                      {sec.conteudo.map((bloco, bi) => {
                        if (bloco.tipo === "texto") {
                          return (
                            <p key={bi} className="font-sans text-sm text-stone-600 leading-relaxed">
                              {bloco.valor}
                            </p>
                          );
                        }
                        if (bloco.tipo === "destaque") {
                          return (
                            <div key={bi} className="bg-stone-100 border-l-2 border-obsidian pl-5 py-3 pr-4">
                              <p className="font-sans text-sm text-obsidian leading-relaxed">
                                {bloco.valor}
                              </p>
                            </div>
                          );
                        }
                        if (bloco.tipo === "lista" && bloco.itens) {
                          return (
                            <ul key={bi} className="space-y-3">
                              {bloco.itens.map((item, ii) => (
                                <li key={ii} className="flex items-start gap-3">
                                  <span className="mt-2.5 w-1 h-1 bg-stone-400 shrink-0" />
                                  <p className="font-sans text-sm text-stone-600 leading-relaxed">{item}</p>
                                </li>
                              ))}
                            </ul>
                          );
                        }
                        if (bloco.tipo === "lista-cards" && bloco.itens) {
                          return (
                            <div key={bi} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {bloco.itens.map((item, ii) => (
                                <div key={ii} className="bg-white border border-stone-200 p-5">
                                  <p className="font-sans text-xs font-semibold text-obsidian mb-2 tracking-wide">
                                    {item.titulo}
                                  </p>
                                  <p className="font-sans text-xs text-stone-500 leading-relaxed">{item.desc}</p>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Links relacionados ── */}
        <section className="bg-stone-50 border-t border-stone-200">
          <div className="raizes-container py-14">
            <p className="label-category text-stone-400 mb-7">Documentos relacionados</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
              <Link
                href="/privacidade"
                className="bg-white border border-stone-200 p-6 hover:border-obsidian transition-colors duration-200 group"
              >
                <Shield size={16} strokeWidth={1.5} className="text-stone-400 mb-4 group-hover:text-obsidian transition-colors" />
                <p className="font-sans text-xs font-semibold text-obsidian mb-1.5 tracking-wide">Política de Privacidade</p>
                <p className="font-sans text-xs text-stone-500 leading-relaxed">Como coletamos e protegemos seus dados pessoais.</p>
              </Link>
              <Link
                href="/trocas"
                className="bg-white border border-stone-200 p-6 hover:border-obsidian transition-colors duration-200 group"
              >
                <RefreshCw size={16} strokeWidth={1.5} className="text-stone-400 mb-4 group-hover:text-obsidian transition-colors" />
                <p className="font-sans text-xs font-semibold text-obsidian mb-1.5 tracking-wide">Trocas e Devoluções</p>
                <p className="font-sans text-xs text-stone-500 leading-relaxed">Prazos, condições e passo a passo para trocas.</p>
              </Link>
              <Link
                href="/rastreamento"
                className="bg-white border border-stone-200 p-6 hover:border-obsidian transition-colors duration-200 group"
              >
                <Truck size={16} strokeWidth={1.5} className="text-stone-400 mb-4 group-hover:text-obsidian transition-colors" />
                <p className="font-sans text-xs font-semibold text-obsidian mb-1.5 tracking-wide">Rastreamento</p>
                <p className="font-sans text-xs text-stone-500 leading-relaxed">Como acompanhar sua entrega em tempo real.</p>
              </Link>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-obsidian">
          <div className="raizes-container py-14 md:py-20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 max-w-4xl">
              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-normal tracking-tighter text-ivory mb-3">
                  Ainda tem dúvidas?
                </h2>
                <p className="font-sans text-stone-400 text-sm leading-relaxed max-w-sm">
                  Nossa equipe está pronta para esclarecer qualquer questão sobre
                  os termos, sua compra ou seus direitos como consumidor.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href="mailto:contato@raizesoficial.com.br"
                  className="inline-flex items-center justify-center gap-2 bg-ivory text-obsidian font-sans text-xs font-semibold tracking-widest uppercase px-7 py-4 hover:bg-stone-100 transition-colors duration-300"
                >
                  <Mail size={13} strokeWidth={2} />
                  Falar com a equipe
                </a>
                <Link
                  href="/colecoes"
                  className="inline-flex items-center justify-center gap-2 border border-stone-700 text-stone-400 font-sans text-xs font-semibold tracking-widest uppercase px-7 py-4 hover:border-stone-500 hover:text-stone-300 transition-colors duration-300"
                >
                  Ver coleções
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
