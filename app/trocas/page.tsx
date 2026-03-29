import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import type { Metadata } from "next";
import {
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  Mail,
  Truck,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Trocas e Devoluções",
  description:
    "Política completa de trocas e devoluções da Raízes. Saiba como funciona o processo, prazos e condições para garantir sua satisfação.",
};

const TROCA_STEPS = [
  {
    icon: Mail,
    step: "01",
    titulo: "Entre em contato",
    descricao:
      "Envie um e-mail para contato@raizesoficial.com.br com o número do seu pedido, o motivo da troca ou devolução e fotos da peça caso haja defeito. Nossa equipe responde em até 1 dia útil.",
    detalhe: "Prazo: até 30 dias após o recebimento",
  },
  {
    icon: CheckCircle2,
    step: "02",
    titulo: "Aprovação e instruções",
    descricao:
      "Após análise, enviaremos as instruções completas para o envio da peça, incluindo o endereço de devolução e, nos casos elegíveis, a etiqueta de postagem sem custo para você.",
    detalhe: "Resposta em até 1 dia útil",
  },
  {
    icon: Package,
    step: "03",
    titulo: "Envio da peça",
    descricao:
      "Embale a peça na caixa ou envelope original, com a etiqueta e todos os acessórios que acompanhavam o produto. Poste no prazo combinado e nos envie o código de rastreio por e-mail.",
    detalhe: "Peça deve estar sem uso e com etiqueta",
  },
  {
    icon: RefreshCw,
    step: "04",
    titulo: "Processamento",
    descricao:
      "Após recebermos e inspecionarmos a peça, processamos a troca ou o reembolso em até 5 dias úteis. Você recebe uma notificação por e-mail a cada atualização do processo.",
    detalhe: "5 dias úteis após recebimento",
  },
];

const ACEITO = [
  "Peça com defeito de fabricação.",
  "Tamanho incorreto em relação ao pedido realizado.",
  "Produto diferente do que foi comprado.",
  "Troca de tamanho dentro de 30 dias, sem defeito, desde que não usada.",
  "Arrependimento de compra dentro de 7 dias corridos após o recebimento (direito garantido pelo CDC).",
];

const NAO_ACEITO = [
  "Peças que apresentem sinais de uso, lavagem ou odor.",
  "Produtos sem a etiqueta original.",
  "Itens com rasgos, manchas ou danos causados pelo cliente.",
  "Solicitações fora do prazo de 30 dias após o recebimento.",
  "Peças personalizadas ou sob encomenda.",
];

const REEMBOLSO_FORMAS = [
  {
    icon: RefreshCw,
    titulo: "Crédito na loja",
    descricao:
      "Recomendamos esta opção. Você recebe o valor integral como crédito para usar em qualquer compra futura na Raízes, sem prazo de vencimento.",
    prazo: "Disponível em até 2 dias úteis",
    destaque: true,
  },
  {
    icon: ArrowLeft,
    titulo: "Estorno no cartão",
    descricao:
      "Para compras com cartão de crédito ou débito, o estorno é realizado diretamente na fatura. O prazo de visualização depende da administradora do cartão.",
    prazo: "5 a 15 dias úteis (conforme operadora)",
    destaque: false,
  },
  {
    icon: Truck,
    titulo: "PIX",
    descricao:
      "O reembolso via PIX é feito diretamente para a chave cadastrada no momento da compra. Rápido e sem burocracia.",
    prazo: "Até 2 dias úteis após aprovação",
    destaque: false,
  },
];

const FAQS = [
  {
    q: "Quem paga o frete de devolução?",
    a: "Em casos de defeito de fabricação ou erro nosso (produto errado ou tamanho incorreto), a Raízes arca com o frete de devolução. Para trocas por preferência de tamanho ou arrependimento sem defeito, o frete de envio de volta é por conta do cliente.",
  },
  {
    q: "Posso trocar por um produto diferente?",
    a: "Sim, desde que o produto de destino tenha o mesmo valor ou superior (com pagamento da diferença). Não realizamos trocas por produtos de valor inferior com restituição parcial. Neste caso, emitimos crédito na loja.",
  },
  {
    q: "O que faço se o produto chegar danificado pelos Correios?",
    a: "Fotografe o pacote e a peça imediatamente antes de abrir completamente. Guarde a embalagem original. Entre em contato conosco em até 48 horas do recebimento com as fotos. Acionaremos o seguro de transporte e providenciaremos a reposição sem custo.",
  },
  {
    q: "Posso desistir da compra antes de receber?",
    a: "Sim. Se o pedido ainda estiver em status 'Em preparação', você pode solicitar o cancelamento por e-mail e o reembolso integral será processado. Após o despacho, é necessário aguardar o recebimento para iniciar o processo de devolução.",
  },
  {
    q: "A garantia contra desbotamento funciona como devolução?",
    a: "Sim. A garantia de 5 meses é tratada como defeito de produto. Se sua peça apresentar desbotamento com uso e lavagem normais dentro deste período, entre em contato com o comprovante de compra e fotos. Realizamos a troca sem custo, independente do prazo de 30 dias.",
  },
  {
    q: "Posso fazer mais de uma troca por pedido?",
    a: "Cada pedido tem direito a uma troca. Em situações de múltiplos itens com defeito no mesmo pedido, avaliamos cada caso individualmente e garantimos a resolução de todos os problemas identificados.",
  },
];

export default function TrocasPage() {
  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero ── */}
        <section className="bg-obsidian">
          <div className="raizes-container py-20 md:py-28">
            <div className="max-w-2xl">
              <p className="label-category text-stone-600 mb-5">Política de trocas</p>
              <h1
                className="font-serif text-ivory font-normal tracking-tighter leading-[1.05] mb-6"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
              >
                Trocas e Devoluções.{" "}
                <em className="not-italic text-stone-500">Sem complicação.</em>
              </h1>
              <p className="font-sans text-stone-400 text-base leading-relaxed max-w-lg mb-10">
                Compramos com confiança quando sabemos que a marca está do nosso lado se algo não der certo.
                Nossa política existe para isso: para que você compre sem insegurança e, se precisar,
                seja tratado com respeito e agilidade.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 px-4 py-2">
                  <ShieldCheck size={14} strokeWidth={1.5} className="text-emerald-500" />
                  <span className="font-sans text-xs text-stone-400 tracking-wide">30 dias para troca</span>
                </div>
                <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 px-4 py-2">
                  <ShieldCheck size={14} strokeWidth={1.5} className="text-emerald-500" />
                  <span className="font-sans text-xs text-stone-400 tracking-wide">5 meses de garantia</span>
                </div>
                <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 px-4 py-2">
                  <ShieldCheck size={14} strokeWidth={1.5} className="text-emerald-500" />
                  <span className="font-sans text-xs text-stone-400 tracking-wide">Reembolso em até 5 dias úteis</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Passo a passo ── */}
        <section className="bg-stone-50 border-b border-stone-100">
          <div className="raizes-container py-16 md:py-24">
            <div className="mb-12 md:mb-16">
              <p className="label-category text-stone-400 mb-4">Como funciona</p>
              <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tighter text-obsidian leading-tight">
                Quatro etapas simples.
              </h2>
            </div>

            <div className="relative">
              <div className="hidden md:block absolute left-[1.75rem] top-8 bottom-8 w-px bg-stone-200" />
              <div className="space-y-4 md:space-y-0">
                {TROCA_STEPS.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="relative flex flex-col md:flex-row md:items-start gap-4 md:gap-8 bg-white border border-stone-100 md:border-0 md:bg-transparent p-5 md:p-0 md:pb-10 last:md:pb-0"
                    >
                      <div className="shrink-0 w-14 h-14 bg-obsidian flex items-center justify-center relative z-10">
                        <Icon size={20} strokeWidth={1.5} className="text-ivory" />
                      </div>
                      <div className="flex-1 md:pt-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-sans text-[10px] font-semibold tracking-widest uppercase text-stone-400">
                            Etapa {item.step}
                          </span>
                          <span className="w-4 h-px bg-stone-300" />
                          <span className="font-sans text-[10px] text-stone-400 tracking-wide">
                            {item.detalhe}
                          </span>
                        </div>
                        <h3 className="font-serif text-xl font-normal tracking-tight text-obsidian mb-2">
                          {item.titulo}
                        </h3>
                        <p className="font-sans text-sm text-stone-500 leading-relaxed max-w-xl">
                          {item.descricao}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── O que aceitamos e não aceitamos ── */}
        <section className="bg-ivory">
          <div className="raizes-container py-16 md:py-24">
            <div className="mb-12">
              <p className="label-category text-stone-400 mb-4">Condições</p>
              <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tighter text-obsidian leading-tight">
                O que cobrimos e o que não cobrimos.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Aceito */}
              <div className="bg-emerald-50 border border-emerald-200 p-8">
                <div className="flex items-center gap-3 mb-7">
                  <CheckCircle2 size={18} strokeWidth={1.5} className="text-emerald-600" />
                  <p className="font-sans text-sm font-semibold text-emerald-800 tracking-wide uppercase text-[11px]">
                    Situações cobertas
                  </p>
                </div>
                <ul className="space-y-4">
                  {ACEITO.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-2 w-1.5 h-1.5 bg-emerald-500 shrink-0" />
                      <p className="font-sans text-sm text-emerald-900 leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Não aceito */}
              <div className="bg-stone-50 border border-stone-200 p-8">
                <div className="flex items-center gap-3 mb-7">
                  <XCircle size={18} strokeWidth={1.5} className="text-stone-500" />
                  <p className="font-sans text-sm font-semibold text-stone-600 tracking-wide uppercase text-[11px]">
                    Situações não cobertas
                  </p>
                </div>
                <ul className="space-y-4">
                  {NAO_ACEITO.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-2 w-1.5 h-1.5 bg-stone-400 shrink-0" />
                      <p className="font-sans text-sm text-stone-600 leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Aviso CDC */}
            <div className="mt-6 flex items-start gap-3 bg-stone-100 border border-stone-200 p-5">
              <AlertCircle size={16} strokeWidth={1.5} className="text-stone-500 shrink-0 mt-0.5" />
              <p className="font-sans text-xs text-stone-500 leading-relaxed">
                <strong className="text-obsidian">Direito de arrependimento (CDC, Art. 49).</strong>{" "}
                Compras realizadas pela internet têm direito de desistência em até 7 dias corridos
                após o recebimento, independente do motivo. Neste caso, o reembolso integral é
                garantido, incluindo o frete pago na compra original.
              </p>
            </div>
          </div>
        </section>

        {/* ── Formas de reembolso ── */}
        <section className="bg-stone-50 border-t border-stone-100">
          <div className="raizes-container py-16 md:py-24">
            <div className="mb-12">
              <p className="label-category text-stone-400 mb-4">Reembolso</p>
              <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tighter text-obsidian leading-tight mb-4">
                Você escolhe como receber de volta.
              </h2>
              <p className="font-sans text-sm text-stone-500 leading-relaxed max-w-lg">
                Em caso de devolução aprovada, oferecemos três modalidades de reembolso.
                Você escolhe a que for mais conveniente no momento da solicitação.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {REEMBOLSO_FORMAS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className={`p-8 border flex flex-col gap-5 ${
                      item.destaque
                        ? "bg-obsidian border-obsidian"
                        : "bg-white border-stone-200"
                    }`}
                  >
                    {item.destaque && (
                      <span className="font-sans text-[9px] font-semibold tracking-widest uppercase text-stone-500 border border-stone-700 px-2 py-1 w-fit">
                        Recomendado
                      </span>
                    )}
                    <div className={`w-10 h-10 flex items-center justify-center ${item.destaque ? "bg-stone-800" : "bg-stone-100"}`}>
                      <Icon size={16} strokeWidth={1.5} className={item.destaque ? "text-ivory" : "text-obsidian"} />
                    </div>
                    <div>
                      <h3 className={`font-serif text-xl font-normal tracking-tight mb-3 ${item.destaque ? "text-ivory" : "text-obsidian"}`}>
                        {item.titulo}
                      </h3>
                      <p className={`font-sans text-sm leading-relaxed mb-4 ${item.destaque ? "text-stone-400" : "text-stone-500"}`}>
                        {item.descricao}
                      </p>
                      <div className={`flex items-center gap-2 pt-4 border-t ${item.destaque ? "border-stone-800" : "border-stone-100"}`}>
                        <Clock size={12} strokeWidth={1.5} className={item.destaque ? "text-stone-600" : "text-stone-400"} />
                        <p className={`font-sans text-[11px] tracking-wide ${item.destaque ? "text-stone-600" : "text-stone-400"}`}>
                          {item.prazo}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Garantia especial ── */}
        <section className="bg-obsidian">
          <div className="raizes-container py-14 md:py-20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
              <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-5">
                  <ShieldCheck size={20} strokeWidth={1.5} className="text-emerald-500" />
                  <p className="label-category text-stone-600">Garantia exclusiva</p>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tighter text-ivory leading-tight mb-5">
                  5 meses de garantia.
                </h2>
                <p className="font-sans text-stone-400 text-sm leading-relaxed">
                  Nossa garantia vai além dos 30 dias padrão do mercado.
                  Se sua peça apresentar defeito com uso e lavagem normais nos primeiros 5 meses,
                  cuidamos da troca sem custo e sem burocracia. Basta entrar em contato com o
                  comprovante de compra e fotos da peça.
                </p>
              </div>
              <div className="shrink-0 bg-stone-900 border border-stone-800 p-8 w-full md:w-72">
                <p className="label-category text-stone-600 mb-4">O que está coberto</p>
                <ul className="space-y-3">
                  {[
                    "Desbotamento em lavagens normais",
                    "Desfiamento prematuro do tecido",
                    "Falhas na costura estrutural",
                    "Defeitos na estampa ou bordado",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={13} strokeWidth={1.5} className="text-emerald-600 shrink-0 mt-0.5" />
                      <p className="font-sans text-xs text-stone-500 leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-ivory border-t border-stone-100">
          <div className="raizes-container py-16 md:py-24">
            <div className="mb-12">
              <p className="label-category text-stone-400 mb-4">Dúvidas</p>
              <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tighter text-obsidian leading-tight">
                Perguntas sobre trocas e devoluções.
              </h2>
            </div>
            <div className="max-w-3xl divide-y divide-stone-200">
              {FAQS.map((faq, i) => (
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
        <section className="bg-stone-50 border-t border-stone-200">
          <div className="raizes-container py-16 md:py-20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div>
                <h2 className="font-serif text-3xl font-normal tracking-tighter text-obsidian mb-3">
                  Precisa de ajuda com seu pedido?
                </h2>
                <p className="font-sans text-stone-500 text-sm leading-relaxed max-w-md">
                  Nossa equipe responde em até 1 dia útil. Estamos aqui para garantir que sua
                  experiência com a Raízes seja à altura do que você merece.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href="mailto:contato@raizesoficial.com.br"
                  className="inline-flex items-center justify-center gap-2 bg-obsidian text-ivory font-sans text-xs font-semibold tracking-widest uppercase px-7 py-4 hover:bg-stone-800 transition-colors duration-300"
                >
                  <Mail size={14} strokeWidth={2} />
                  Enviar e-mail
                </a>
                <Link
                  href="/conta/pedidos"
                  className="inline-flex items-center justify-center gap-2 border border-stone-300 text-obsidian font-sans text-xs font-semibold tracking-widest uppercase px-7 py-4 hover:border-obsidian transition-colors duration-300"
                >
                  Minhas Compras
                  <ArrowRight size={14} strokeWidth={2} />
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
