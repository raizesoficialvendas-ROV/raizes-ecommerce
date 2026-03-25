import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ShoppingBag,
  Mail,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  ArrowRight,
  Lock,
  Bell,
  HelpCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Rastreamento de Pedidos",
  description:
    "Acompanhe cada etapa do seu pedido Raízes — da confirmação ao entrega. Saiba como funciona nosso processo de envio.",
};

const ORDER_STEPS = [
  {
    icon: ShoppingBag,
    step: "01",
    title: "Pedido confirmado",
    description:
      "Assim que seu pagamento é aprovado, seu pedido entra imediatamente na fila de preparação. Você recebe um e-mail de confirmação com o resumo completo — itens, valor total e endereço de entrega.",
    timing: "Instantâneo após pagamento",
    color: "text-obsidian",
    bg: "bg-stone-100",
  },
  {
    icon: Package,
    step: "02",
    title: "Em preparação",
    description:
      "Nossa equipe separa, confere e embala sua peça com cuidado. Cada pedido passa por inspeção de qualidade antes de ser liberado para envio — garantindo que você receba exatamente o que escolheu.",
    timing: "Até 1 dia útil após confirmação",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Truck,
    step: "03",
    title: "Despachado",
    description:
      "Seu pedido foi postado e está nas mãos da transportadora. Você recebe um e-mail com o código de rastreio e o link direto para acompanhar em tempo real no site dos Correios ou da transportadora responsável.",
    timing: "E-mail com código enviado no mesmo dia",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: MapPin,
    step: "04",
    title: "A caminho",
    description:
      "Seu pedido está em trânsito e se aproximando de você. Utilize o código de rastreio para acompanhar cada movimentação — de cidade em cidade, até a sua porta.",
    timing: "Atualizações em tempo real",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: CheckCircle2,
    step: "05",
    title: "Entregue",
    description:
      "Seu pedido chegou. Você recebe um e-mail de confirmação de entrega. Se tiver qualquer dúvida sobre o produto recebido, nossa equipe está disponível para ajudar dentro do prazo de 30 dias.",
    timing: "Confirmação por e-mail",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

const DELIVERY_TIMES = [
  { region: "Capitais e regiões metropolitanas", prazo: "2 a 5 dias úteis", icon: "🏙️" },
  { region: "Interior — Sul e Sudeste", prazo: "4 a 7 dias úteis", icon: "🌳" },
  { region: "Interior — Centro-Oeste e Nordeste", prazo: "6 a 10 dias úteis", icon: "🌵" },
  { region: "Norte e regiões remotas", prazo: "8 a 15 dias úteis", icon: "🌿" },
];

const EMAIL_NOTIFICATIONS = [
  {
    icon: CheckCircle2,
    title: "Confirmação de pagamento",
    description: "Resumo completo do pedido com itens, tamanhos, valor e endereço de entrega.",
  },
  {
    icon: Package,
    title: "Pedido em preparação",
    description: "Aviso de que seu pedido foi processado e está sendo separado em nosso estoque.",
  },
  {
    icon: Truck,
    title: "Código de rastreio",
    description: "E-mail com o código de rastreio e link direto para acompanhar o envio em tempo real.",
  },
  {
    icon: CheckCircle2,
    title: "Entrega confirmada",
    description: "Notificação de que seu pedido foi entregue com sucesso no endereço informado.",
  },
];

const TRACK_FAQS = [
  {
    q: "Não recebi o e-mail com o código de rastreio. O que faço?",
    a: "Verifique sua pasta de spam ou lixo eletrônico. Se o pedido foi postado há mais de 24h e você ainda não recebeu, acesse Minhas Compras na área logada — o código estará disponível lá. Caso não apareça, entre em contato conosco.",
  },
  {
    q: "O rastreio não está atualizando. Isso é normal?",
    a: "Sim. Após a postagem, o sistema dos Correios ou da transportadora pode levar até 48h para registrar a primeira movimentação. Isso é normal e não significa nenhum problema com seu pedido.",
  },
  {
    q: "Posso alterar o endereço de entrega após o pedido?",
    a: "Somente se o pedido ainda estiver em status 'Em preparação'. Após o despacho, não é possível alterar o endereço. Entre em contato imediatamente via e-mail caso precise fazer a alteração.",
  },
  {
    q: "O que acontece se eu não estiver em casa na hora da entrega?",
    a: "A transportadora tentará a entrega até 3 vezes em dias úteis diferentes. Se não houver ninguém para receber, o pedido ficará disponível para retirada na agência mais próxima por 7 dias corridos antes de ser devolvido ao remetente.",
  },
  {
    q: "Como funciona a devolução se houver problema com o produto?",
    a: "Você tem 30 dias a partir da data de entrega para solicitar troca ou devolução. A peça deve estar sem uso e com a etiqueta original. Acesse nossa página de Trocas e Devoluções ou entre em contato por e-mail.",
  },
];

export default function RastreamentoPage() {
  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero ── */}
        <section className="bg-obsidian">
          <div className="raizes-container py-20 md:py-28">
            <div className="max-w-2xl">
              <p className="label-category text-stone-600 mb-5">Transparência total</p>
              <h1
                className="font-serif text-ivory font-normal tracking-tighter leading-[1.05] mb-6"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
              >
                Acompanhe seu pedido,{" "}
                <em className="not-italic text-stone-500">passo a passo.</em>
              </h1>
              <p className="font-sans text-stone-400 text-base leading-relaxed max-w-lg mb-10">
                Da confirmação até a sua porta — sabemos que expectativa faz parte da experiência.
                Por isso, você nunca fica no escuro sobre onde está o seu pedido.
              </p>
              <Link
                href="/conta/pedidos"
                className="inline-flex items-center gap-3 bg-ivory text-obsidian font-sans text-xs font-semibold tracking-widest uppercase px-7 py-4 hover:bg-stone-100 transition-colors duration-300"
              >
                <Search size={14} strokeWidth={2} />
                Acessar Minhas Compras
                <ArrowRight size={14} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Como acessar o rastreio ── */}
        <section className="bg-ivory border-b border-stone-100">
          <div className="raizes-container py-16 md:py-20">
            <div className="flex flex-col md:flex-row items-start gap-10 md:gap-16">

              {/* Texto */}
              <div className="flex-1">
                <p className="label-category text-stone-400 mb-4">Como funciona</p>
                <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tighter text-obsidian mb-6 leading-tight">
                  Tudo centralizado em<br />um só lugar.
                </h2>
                <p className="font-sans text-sm text-stone-500 leading-relaxed mb-8">
                  Todos os seus pedidos — passados e presentes — ficam disponíveis na área{" "}
                  <strong className="text-obsidian font-medium">Minhas Compras</strong>,
                  acessível pelo menu superior ou pelo rodapé do site.
                  Lá você encontra o status atualizado, o código de rastreio e o histórico completo de cada compra.
                </p>
                <p className="font-sans text-sm text-stone-500 leading-relaxed">
                  Além disso, você recebe notificações automáticas por e-mail em cada etapa —
                  desde a confirmação do pagamento até a confirmação de entrega.
                </p>
              </div>

              {/* Cards de acesso */}
              <div className="w-full md:w-80 space-y-3">
                <div className="flex items-start gap-4 bg-stone-50 border border-stone-200 p-5">
                  <div className="w-9 h-9 bg-obsidian flex items-center justify-center shrink-0">
                    <Lock size={14} strokeWidth={1.5} className="text-ivory" />
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium text-obsidian mb-1">Área logada</p>
                    <p className="font-sans text-xs text-stone-500 leading-relaxed">
                      Acesse com seu e-mail e senha. Todos os pedidos ficam salvos automaticamente.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-stone-50 border border-stone-200 p-5">
                  <div className="w-9 h-9 bg-obsidian flex items-center justify-center shrink-0">
                    <Mail size={14} strokeWidth={1.5} className="text-ivory" />
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium text-obsidian mb-1">Por e-mail</p>
                    <p className="font-sans text-xs text-stone-500 leading-relaxed">
                      Cada atualização é enviada automaticamente para o e-mail cadastrado no pedido.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-stone-50 border border-stone-200 p-5">
                  <div className="w-9 h-9 bg-obsidian flex items-center justify-center shrink-0">
                    <Truck size={14} strokeWidth={1.5} className="text-ivory" />
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium text-obsidian mb-1">Site da transportadora</p>
                    <p className="font-sans text-xs text-stone-500 leading-relaxed">
                      Com o código de rastreio, acompanhe em tempo real diretamente no site dos Correios.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Timeline do pedido ── */}
        <section className="bg-stone-50">
          <div className="raizes-container py-16 md:py-24">
            <div className="mb-12 md:mb-16">
              <p className="label-category text-stone-400 mb-4">Etapas do pedido</p>
              <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tighter text-obsidian leading-tight">
                O que acontece após a compra.
              </h2>
            </div>

            <div className="relative">
              {/* Linha vertical desktop */}
              <div className="hidden md:block absolute left-[1.75rem] top-8 bottom-8 w-px bg-stone-200" />

              <div className="space-y-4 md:space-y-0">
                {ORDER_STEPS.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={i}
                      className="relative flex flex-col md:flex-row md:items-start gap-4 md:gap-8 bg-white border border-stone-100 md:border-0 md:bg-transparent p-5 md:p-0 md:pb-10 last:md:pb-0"
                    >
                      {/* Ícone / nó da timeline */}
                      <div className={`shrink-0 w-14 h-14 ${step.bg} flex items-center justify-center relative z-10`}>
                        <Icon size={22} strokeWidth={1.5} className={step.color} />
                      </div>

                      {/* Conteúdo */}
                      <div className="flex-1 md:pt-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-sans text-[10px] font-semibold tracking-widest uppercase text-stone-400">
                            Etapa {step.step}
                          </span>
                          <span className="w-4 h-px bg-stone-300" />
                          <span className="font-sans text-[10px] text-stone-400 tracking-wide">
                            {step.timing}
                          </span>
                        </div>
                        <h3 className="font-serif text-xl font-normal tracking-tight text-obsidian mb-2">
                          {step.title}
                        </h3>
                        <p className="font-sans text-sm text-stone-500 leading-relaxed max-w-xl">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── Notificações por e-mail ── */}
        <section className="bg-ivory border-t border-stone-100">
          <div className="raizes-container py-16 md:py-24">
            <div className="mb-12">
              <p className="label-category text-stone-400 mb-4">Comunicação</p>
              <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tighter text-obsidian leading-tight mb-4">
                Você recebe e-mail em cada etapa.
              </h2>
              <p className="font-sans text-sm text-stone-500 leading-relaxed max-w-lg">
                Nosso sistema envia notificações automáticas para o e-mail cadastrado no momento da compra.
                Guarde os e-mails — eles contêm informações importantes sobre seu pedido.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {EMAIL_NOTIFICATIONS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="bg-stone-50 border border-stone-200 p-6"
                  >
                    <div className="w-8 h-8 bg-obsidian flex items-center justify-center mb-4">
                      <Icon size={14} strokeWidth={1.5} className="text-ivory" />
                    </div>
                    <p className="font-sans text-sm font-medium text-obsidian mb-2">
                      {item.title}
                    </p>
                    <p className="font-sans text-xs text-stone-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-start gap-3 bg-amber-50 border border-amber-200 p-5">
              <Bell size={16} strokeWidth={1.5} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="font-sans text-xs text-amber-800 leading-relaxed">
                <strong>Verifique sua pasta de spam.</strong> Em alguns provedores de e-mail, nossas mensagens
                automáticas podem ser redirecionadas para lixo eletrônico. Adicione{" "}
                <span className="font-medium">contato@raizes.com.br</span> aos seus contatos para garantir
                que nenhuma notificação fique perdida.
              </p>
            </div>
          </div>
        </section>

        {/* ── Prazos de entrega ── */}
        <section className="bg-stone-50 border-t border-stone-100">
          <div className="raizes-container py-16 md:py-24">
            <div className="mb-12">
              <p className="label-category text-stone-400 mb-4">Prazos</p>
              <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tighter text-obsidian leading-tight mb-4">
                Estimativas de entrega por região.
              </h2>
              <p className="font-sans text-sm text-stone-500 leading-relaxed max-w-lg">
                Os prazos abaixo são contados em <strong className="text-obsidian font-medium">dias úteis</strong>{" "}
                a partir da postagem do pedido (em até 1 dia útil após aprovação do pagamento).
                Feriados regionais e nacionais não são contados.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {DELIVERY_TIMES.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 bg-white border border-stone-200 px-6 py-5"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <p className="font-sans text-sm text-obsidian font-medium">
                      {item.region}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-sans text-sm font-semibold text-obsidian">
                      {item.prazo}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-3 bg-stone-100 border border-stone-200 p-5">
              <Clock size={16} strokeWidth={1.5} className="text-stone-500 shrink-0 mt-0.5" />
              <p className="font-sans text-xs text-stone-500 leading-relaxed">
                Esses prazos são estimativas baseadas no histórico de entregas. Eventualidades como
                greves, desastres naturais ou sobrecarga de transportadoras podem impactar os prazos.
                Em casos de atraso significativo, entraremos em contato por e-mail.
              </p>
            </div>
          </div>
        </section>

        {/* ── Dúvidas frequentes ── */}
        <section className="bg-ivory border-t border-stone-100">
          <div className="raizes-container py-16 md:py-24">
            <div className="mb-12">
              <p className="label-category text-stone-400 mb-4">Dúvidas</p>
              <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tighter text-obsidian leading-tight">
                Perguntas sobre envio e rastreio.
              </h2>
            </div>

            <div className="max-w-3xl divide-y divide-stone-200">
              {TRACK_FAQS.map((faq, i) => (
                <div key={i} className="py-6 flex items-start gap-4">
                  <HelpCircle size={16} strokeWidth={1.5} className="text-stone-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-sans text-sm font-semibold text-obsidian mb-2 leading-snug">
                      {faq.q}
                    </p>
                    <p className="font-sans text-sm text-stone-500 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA final ── */}
        <section className="bg-obsidian">
          <div className="raizes-container py-16 md:py-20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tighter text-ivory mb-3">
                  Pronto para acompanhar seu pedido?
                </h2>
                <p className="font-sans text-stone-500 text-sm leading-relaxed max-w-md">
                  Acesse sua área de compras e acompanhe cada etapa da sua entrega em tempo real.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link
                  href="/conta/pedidos"
                  className="inline-flex items-center justify-center gap-2 bg-ivory text-obsidian font-sans text-xs font-semibold tracking-widest uppercase px-7 py-4 hover:bg-stone-100 transition-colors duration-300"
                >
                  Minhas Compras
                  <ArrowRight size={14} strokeWidth={2} />
                </Link>
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
