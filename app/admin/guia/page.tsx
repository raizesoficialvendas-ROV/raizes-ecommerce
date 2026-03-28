import type { Metadata } from "next";
import {
  BookOpen,
  Package,
  Layers,
  Truck,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Tag,
  Image as ImageIcon,
  FileText,
  ShoppingBag,
  Printer,
  ExternalLink,
  Info,
  ArrowRight,
  Hash,
  BarChart2,
  Star,
  Zap,
} from "lucide-react";

export const metadata: Metadata = { title: "Guia de Uso" };

// ── Helpers visuais ──────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  number,
  title,
  subtitle,
  color = "gold",
}: {
  icon: React.ElementType;
  number: string;
  title: string;
  subtitle: string;
  color?: "gold" | "emerald" | "blue";
}) {
  const colors = {
    gold: "bg-amber-50 border-amber-200 text-amber-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
  };
  const iconColors = {
    gold: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
  };
  return (
    <div className={`flex items-center gap-4 p-5 border rounded-xl ${colors[color]}`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconColors[color]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-[10px] font-semibold tracking-widest uppercase opacity-60 mb-0.5">
          Seção {number}
        </p>
        <h2 className="text-xl font-bold leading-tight">{title}</h2>
        <p className="text-sm opacity-70 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-obsidian text-ivory flex items-center justify-center font-bold text-sm shrink-0">
          {number}
        </div>
        <div className="w-px flex-1 bg-stone-200 mt-2" />
      </div>
      <div className="pb-8 flex-1 min-w-0">
        <h4 className="font-semibold text-obsidian mb-2 leading-tight">{title}</h4>
        <div className="text-sm text-stone-600 leading-relaxed space-y-2">{children}</div>
      </div>
    </div>
  );
}

function Tip({ children, type = "info" }: { children: React.ReactNode; type?: "info" | "warning" | "success" }) {
  const styles = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
  };
  const icons = {
    info: Info,
    warning: AlertCircle,
    success: CheckCircle2,
  };
  const Icon = icons[type];
  return (
    <div className={`flex gap-3 p-4 border rounded-lg text-sm ${styles[type]}`}>
      <Icon size={16} className="mt-0.5 shrink-0" />
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}

function Field({ label, description, required }: { label: string; description: string; required?: boolean }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-stone-100 last:border-b-0">
      <div className="flex items-center gap-1.5 min-w-[160px] shrink-0">
        <span className="font-medium text-obsidian text-sm">{label}</span>
        {required && (
          <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-semibold">
            OBRIGATÓRIO
          </span>
        )}
      </div>
      <p className="text-sm text-stone-500 leading-relaxed">{description}</p>
    </div>
  );
}

function Badge({ label, color }: { label: string; color: "green" | "blue" | "amber" | "red" | "stone" }) {
  const styles = {
    green: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    blue: "bg-blue-100 text-blue-700 border border-blue-200",
    amber: "bg-amber-100 text-amber-700 border border-amber-200",
    red: "bg-red-100 text-red-700 border border-red-200",
    stone: "bg-stone-100 text-stone-600 border border-stone-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${styles[color]}`}>
      {label}
    </span>
  );
}

// ── Página principal ─────────────────────────────────────────────────────────

export default function GuiaPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16">

      {/* ── Cabeçalho ── */}
      <div className="flex items-start gap-5 pt-2">
        <div className="w-14 h-14 rounded-2xl bg-obsidian flex items-center justify-center shrink-0">
          <BookOpen size={26} className="text-ivory" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-obsidian tracking-tight">Guia de Uso do Admin</h1>
          <p className="text-stone-500 mt-1.5 leading-relaxed max-w-xl">
            Tudo o que você precisa saber para operar a loja Raízes com segurança e eficiência.
            Leia com atenção antes de começar.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge label="Cadastro de Produtos" color="amber" />
            <Badge label="Coleções" color="blue" />
            <Badge label="Frete & Envio" color="green" />
            <Badge label="Pedidos" color="stone" />
          </div>
        </div>
      </div>

      {/* ── Índice ── */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-4">
          Índice de conteúdo
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {[
            { num: "01", label: "Cadastrar um Produto", icon: Package, color: "text-amber-600" },
            { num: "02", label: "Cadastrar uma Coleção", icon: Layers, color: "text-blue-600" },
            { num: "03", label: "Frete & Geração de Envio", icon: Truck, color: "text-emerald-600" },
          ].map(({ num, label, icon: Icon, color }) => (
            <a
              key={num}
              href={`#secao-${num}`}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white border border-transparent hover:border-stone-200 transition-all group"
            >
              <Icon size={18} className={color} />
              <div>
                <p className="text-[10px] text-stone-400 font-medium">Seção {num}</p>
                <p className="text-sm font-semibold text-obsidian group-hover:underline">{label}</p>
              </div>
              <ChevronRight size={14} className="ml-auto text-stone-300 group-hover:text-stone-500" />
            </a>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SEÇÃO 01 — CADASTRAR UM PRODUTO
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="secao-01" className="space-y-6">
        <SectionHeader
          icon={Package}
          number="01"
          title="Como Cadastrar um Produto"
          subtitle="Do zero até o produto publicado e visível para os clientes."
          color="gold"
        />

        {/* Passo a passo */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-0">
          <h3 className="font-semibold text-obsidian mb-6 flex items-center gap-2">
            <ArrowRight size={16} className="text-amber-500" />
            Passo a passo completo
          </h3>

          <Step number={1} title="Acesse a seção de Produtos">
            <p>
              No menu lateral esquerdo, clique em <strong>Produtos</strong>. Você verá a lista de
              todos os produtos cadastrados. Para criar um novo, clique no botão{" "}
              <strong className="text-obsidian">+ Novo Produto</strong> no canto superior direito.
            </p>
          </Step>

          <Step number={2} title="Preencha as informações básicas">
            <p>O formulário de cadastro possui os seguintes campos:</p>
            <div className="bg-stone-50 rounded-xl p-4 mt-3 border border-stone-100">
              <Field label="Nome do produto" description="Ex: Minha Rocha e Fortaleza &quot;Salmos 18:2&quot; — seja descritivo e inclua a referência bíblica se aplicável." required />
              <Field label="Preço" description="Digite o valor em reais. Use ponto como separador decimal (ex: 59.90). Não inclua R$." required />
              <Field label="Estoque" description="Quantidade de peças disponíveis. Quando chegar a zero, o produto aparece como esgotado automaticamente." required />
              <Field label="Descrição" description="Texto que aparece na página do produto. Descreva a mensagem bíblica, o significado da peça e o que a torna especial." />
              <Field label="Coleção" description="Selecione a coleção à qual este produto pertence (ex: Fundamentos, Promessas). A coleção precisa existir antes." />
              <Field label="Destaque" description="Marque esta opção para que o produto apareça na seção de Mais Vendidos / Destaques na página inicial." />
              <Field label="Frete Grátis" description="Ative para exibir o badge de &quot;Frete Grátis&quot; e isentar o cliente do frete neste produto específico." />
            </div>
          </Step>

          <Step number={3} title="Adicione as fotos do produto">
            <p>
              Na seção <strong>Imagens</strong>, clique na área tracejada ou arraste os arquivos
              diretamente. Você pode enviar <strong>várias imagens</strong> de uma vez.
            </p>
            <Tip type="info">
              <strong>Dica de qualidade:</strong> Use fotos com fundo neutro (branco ou cinza claro),
              boa iluminação e resolução mínima de 800×800px. A primeira imagem enviada será a foto
              principal do produto nos cards da loja.
            </Tip>
            <Tip type="warning">
              Aguarde todas as imagens terminarem de carregar antes de salvar. Uma barra de progresso
              indica quando o upload foi concluído.
            </Tip>
          </Step>

          <Step number={4} title="Configure os metadados (tecnologia e material)">
            <p>
              Na seção <strong>Metadados</strong>, você pode adicionar informações técnicas como
              tecnologia do tecido (ex: <em>Biotecnologia, 2X Mais Macia</em>) e material (ex:{" "}
              <em>100% Algodão, Fiação Penteada</em>). Esses dados aparecem como badges na página
              do produto.
            </p>
            <div className="bg-stone-50 rounded-xl p-4 mt-2 border border-stone-100 space-y-1.5">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">
                Chaves mais utilizadas
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2"><Hash size={12} className="text-stone-400" /><code className="bg-stone-200 px-1.5 py-0.5 rounded text-xs">tech</code> → Tecnologia do tecido</div>
                <div className="flex items-center gap-2"><Hash size={12} className="text-stone-400" /><code className="bg-stone-200 px-1.5 py-0.5 rounded text-xs">material</code> → Composição do material</div>
                <div className="flex items-center gap-2"><Hash size={12} className="text-stone-400" /><code className="bg-stone-200 px-1.5 py-0.5 rounded text-xs">free_shipping</code> → true = frete grátis</div>
                <div className="flex items-center gap-2"><Hash size={12} className="text-stone-400" /><code className="bg-stone-200 px-1.5 py-0.5 rounded text-xs">slug</code> → URL amigável do produto</div>
              </div>
            </div>
          </Step>

          <Step number={5} title="Publique o produto">
            <p>
              Ao final do formulário, você encontrará o campo <strong>Status</strong>. Mantenha como{" "}
              <Badge label="Publicado" color="green" /> para que o produto apareça na loja. Se quiser
              salvar como rascunho sem publicar, selecione{" "}
              <Badge label="Rascunho" color="stone" />.
            </p>
            <p>
              Clique em <strong>Salvar produto</strong>. Uma notificação verde confirmará que o produto
              foi cadastrado com sucesso.
            </p>
            <Tip type="success">
              Após salvar, acesse <strong>Ver Site</strong> (menu inferior da sidebar) e busque o
              produto para conferir como ficou na loja.
            </Tip>
          </Step>
        </div>

        {/* Tabela de campos rápida */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <h3 className="font-semibold text-amber-900 mb-4 flex items-center gap-2">
            <Star size={16} className="text-amber-500" />
            Checklist antes de publicar
          </h3>
          <ul className="space-y-2">
            {[
              "Nome do produto preenchido com referência bíblica",
              "Preço correto (verificar se não faltou zero)",
              "Estoque preenchido (mínimo 1)",
              "Pelo menos 2 fotos enviadas (frente e costas)",
              "Coleção selecionada corretamente",
              "Descrição com a mensagem da peça",
              "Material e tecnologia nos metadados",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-amber-800">
                <CheckCircle2 size={15} className="text-amber-500 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SEÇÃO 02 — CADASTRAR UMA COLEÇÃO
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="secao-02" className="space-y-6">
        <SectionHeader
          icon={Layers}
          number="02"
          title="Como Cadastrar uma Coleção"
          subtitle="Coleções organizam os produtos em grupos temáticos e aparecem no menu da loja."
          color="blue"
        />

        <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-0">
          <h3 className="font-semibold text-obsidian mb-6 flex items-center gap-2">
            <ArrowRight size={16} className="text-blue-500" />
            Passo a passo completo
          </h3>

          <Step number={1} title="Acesse a seção de Coleções">
            <p>
              No menu lateral, clique em <strong>Coleções</strong>. Você verá todas as coleções
              existentes. Para criar uma nova, clique em <strong>+ Nova Coleção</strong>.
            </p>
            <Tip type="info">
              <strong>Importante:</strong> Crie sempre a coleção <em>antes</em> de cadastrar os
              produtos que pertencem a ela. Não é possível vincular um produto a uma coleção que
              ainda não existe.
            </Tip>
          </Step>

          <Step number={2} title="Preencha os dados da coleção">
            <div className="bg-stone-50 rounded-xl p-4 mt-2 border border-stone-100">
              <Field label="Nome" description="Nome da coleção exibido na loja e no menu. Ex: Fundamentos, Promessas, Guerreiros da Fé." required />
              <Field label="Slug" description="Identificador na URL. Use apenas letras minúsculas e hífens. Ex: fundamentos, promessas. Gerado automaticamente ao digitar o nome." required />
              <Field label="Descrição" description="Texto curto que aparece na página da coleção. Descreva o tema e a mensagem espiritual do grupo." />
              <Field label="Imagem de capa" description="Foto que representa a coleção no menu e na página de listagem. Prefira imagens horizontais (proporção 16:9) com boa qualidade." />
              <Field label="Ordem de exibição" description="Número que define a posição da coleção no menu. 1 aparece primeiro, 2 aparece segundo, e assim por diante." />
              <Field label="Ativa" description="Marque para que a coleção apareça no menu e na loja. Coleções inativas ficam ocultas para os clientes." />
            </div>
          </Step>

          <Step number={3} title="Salve a coleção">
            <p>
              Clique em <strong>Salvar coleção</strong>. Ela estará disponível imediatamente para
              ser selecionada ao cadastrar produtos.
            </p>
          </Step>

          <Step number={4} title="Vincule produtos à coleção">
            <p>
              Agora vá para a seção <strong>Produtos</strong>, abra cada produto que pertence a
              esta coleção e selecione-a no campo <strong>Coleção</strong>. Salve o produto.
            </p>
            <Tip type="success">
              A coleção só aparecerá no menu da loja após ter <strong>pelo menos 1 produto
              publicado</strong> vinculado a ela.
            </Tip>
          </Step>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Info size={16} className="text-blue-500" />
            Como as coleções aparecem na loja
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2"><ChevronRight size={14} className="mt-0.5 shrink-0 text-blue-400" />No <strong>menu principal</strong> da loja sob o item "Coleções"</li>
            <li className="flex items-start gap-2"><ChevronRight size={14} className="mt-0.5 shrink-0 text-blue-400" />Na <strong>página inicial</strong> na seção de coleções em destaque</li>
            <li className="flex items-start gap-2"><ChevronRight size={14} className="mt-0.5 shrink-0 text-blue-400" />Na <strong>página do produto</strong> como categoria acima do nome</li>
          </ul>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SEÇÃO 03 — FRETE & GERAÇÃO DE ENVIO
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="secao-03" className="space-y-6">
        <SectionHeader
          icon={Truck}
          number="03"
          title="Frete & Geração de Envio"
          subtitle="Entenda o fluxo completo: do pedido ao cliente receber em casa."
          color="emerald"
        />

        {/* Visão geral do fluxo */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6">
          <h3 className="font-semibold text-obsidian mb-5 flex items-center gap-2">
            <BarChart2 size={16} className="text-emerald-500" />
            Visão geral do fluxo de envio
          </h3>
          <div className="flex flex-col md:flex-row items-stretch gap-0">
            {[
              { step: "1", label: "Cliente paga", icon: ShoppingBag, color: "bg-stone-100 text-stone-600" },
              { step: "2", label: "Envio criado no ME automaticamente", icon: Zap, color: "bg-emerald-100 text-emerald-700" },
              { step: "3", label: "Você paga etiqueta no ME", icon: Printer, color: "bg-blue-100 text-blue-700" },
              { step: "4", label: "Posta nos Correios", icon: Truck, color: "bg-amber-100 text-amber-700" },
              { step: "5", label: "Insere código no Admin → Enviado", icon: CheckCircle2, color: "bg-emerald-100 text-emerald-700" },
            ].map(({ step, label, icon: Icon, color }, idx, arr) => (
              <div key={step} className="flex md:flex-col items-center gap-3 md:gap-2 flex-1">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon size={19} />
                </div>
                <div className="text-center flex-1 md:flex-none">
                  <p className="text-[10px] text-stone-400 font-medium mb-0.5">Etapa {step}</p>
                  <p className="text-xs font-semibold text-obsidian leading-tight">{label}</p>
                </div>
                {idx < arr.length - 1 && (
                  <ChevronRight size={16} className="text-stone-300 shrink-0 md:rotate-90 md:my-1" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Banner de destaque — automação */}
        <div className="bg-emerald-900 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center shrink-0">
            <Zap size={18} className="text-emerald-200" />
          </div>
          <div>
            <p className="font-bold text-emerald-100 mb-1">O envio no Melhor Envio é criado automaticamente!</p>
            <p className="text-sm text-emerald-300 leading-relaxed">
              Assim que o cliente paga, nosso sistema envia todos os dados para o Melhor Envio
              automaticamente — sem nenhum preenchimento manual. Você só precisa <strong className="text-emerald-100">pagar a etiqueta,
              imprimir e postar</strong>.
            </p>
          </div>
        </div>

        {/* Passo a passo detalhado */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-0">
          <h3 className="font-semibold text-obsidian mb-6 flex items-center gap-2">
            <ArrowRight size={16} className="text-emerald-500" />
            Passo a passo detalhado
          </h3>

          <Step number={1} title="Pagamento confirmado — envio criado automaticamente">
            <p>
              Quando o cliente finaliza o pagamento, a <strong>InfinitePay</strong> notifica nossa
              loja em tempo real via webhook. Neste momento, o sistema automaticamente:
            </p>
            <div className="bg-stone-50 rounded-xl p-4 mt-2 border border-stone-100 space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                <span>Atualiza o status do pedido para <Badge label="Pago" color="green" /></span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                <span>Envia os dados do cliente, endereço, serviço (PAC/SEDEX) e dimensões para o Melhor Envio</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                <span>O envio aparece no carrinho do Melhor Envio pronto para ser pago</span>
              </div>
            </div>
            <Tip type="success">
              No painel Admin em <strong>Pedidos</strong>, o pedido pago exibirá o badge{" "}
              <code className="bg-stone-100 px-1.5 py-0.5 rounded text-xs font-mono text-emerald-700">ME ✓</code>{" "}
              em verde ao lado do pedido, confirmando que o envio foi criado no Melhor Envio com sucesso.
            </Tip>
          </Step>

          <Step number={2} title="E se o envio não foi criado automaticamente?">
            <p>
              Em raras situações (instabilidade de rede, token expirado), o envio pode não ter
              sido criado automaticamente. Nesse caso, o pedido pago exibirá o botão laranja{" "}
              <strong>Criar Envio ME</strong> no lugar do badge verde.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-2 space-y-2">
              <p className="text-sm font-semibold text-amber-800">Como resolver em 1 clique:</p>
              <div className="flex items-start gap-2 text-sm text-amber-700">
                <ChevronRight size={13} className="mt-0.5 shrink-0" />
                <span>No painel Admin &gt; Pedidos, localize o pedido com status <Badge label="Pago" color="green" /></span>
              </div>
              <div className="flex items-start gap-2 text-sm text-amber-700">
                <ChevronRight size={13} className="mt-0.5 shrink-0" />
                <span>Clique no botão laranja <strong>Criar Envio ME</strong> — o sistema preenche tudo automaticamente e envia para o Melhor Envio</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-amber-700">
                <ChevronRight size={13} className="mt-0.5 shrink-0" />
                <span>Aguarde a confirmação — o badge <code className="bg-amber-100 px-1 py-0.5 rounded text-xs font-mono">ME ✓</code> aparecerá quando concluído</span>
              </div>
            </div>
            <Tip type="warning">
              Nunca crie o envio manualmente no painel do Melhor Envio se for usar este botão.
              O sistema já preenche todos os dados automaticamente.
            </Tip>
          </Step>

          <Step number={3} title="Separe e embale o produto">
            <p>
              Enquanto o sistema cria o envio, você pode separar o pedido. Expanda o pedido
              clicando nele para ver: nome do cliente, endereço completo, tamanho solicitado
              e método de frete.
            </p>
            <p>
              Separe a peça no estoque, confira o tamanho e embale com cuidado em uma embalagem
              resistente.
            </p>
            <Tip type="warning">
              Confira o <strong>tamanho</strong> exibido no pedido antes de embalar. Este dado
              é informado pelo cliente.
            </Tip>
          </Step>

          <Step number={4} title="Acesse o Melhor Envio e pague a etiqueta">
            <p>
              Abra o painel do Melhor Envio em{" "}
              <a
                href="https://melhorenvio.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 underline font-medium hover:text-blue-800"
              >
                melhorenvio.com.br <ExternalLink size={12} />
              </a>{" "}
              e faça login com a conta da loja.
            </p>
            <p className="mt-2">
              Vá ao <strong>Carrinho</strong> — o envio já estará lá com todos os dados preenchidos.
              Confira o destinatário e o serviço (PAC ou SEDEX), depois clique em{" "}
              <strong>Finalizar compra</strong>. O valor será debitado do saldo da conta no ME.
            </p>
            <Tip type="info">
              Mantenha saldo disponível na conta do Melhor Envio. Você pode recarregar via PIX
              diretamente no painel deles em <strong>Saldo &gt; Adicionar créditos</strong>.
            </Tip>
          </Step>

          <Step number={5} title="Gere e imprima a etiqueta">
            <p>
              Após o pagamento, acesse <strong>Envios &gt; Meus envios</strong>. O pedido estará
              com o status <Badge label="Pago" color="green" />. Clique em{" "}
              <strong>Gerar etiqueta</strong> e depois em <strong>Imprimir</strong>.
            </p>
            <p>
              Cole a etiqueta na embalagem de forma visível e sem dobras que prejudiquem a
              leitura do código de barras.
            </p>
          </Step>

          <Step number={6} title="Poste nos Correios">
            <p>
              Leve o pacote a uma agência dos Correios. <strong>Não é necessário preencher
              nenhum formulário</strong> — a etiqueta já contém todas as informações. Basta
              entregar na fila de postagem.
            </p>
            <Tip type="success">
              Guarde o comprovante de postagem até a entrega ser confirmada. Em caso de extravio,
              ele será necessário para abrir uma reclamação nos Correios.
            </Tip>
          </Step>

          <Step number={7} title="Registre o envio no painel Admin">
            <p>
              Volte ao painel Admin em <strong>Pedidos</strong>. No pedido correspondente (que
              já estará visível na lista), você verá:
            </p>
            <div className="bg-stone-50 rounded-xl p-4 mt-2 border border-stone-100 space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <ChevronRight size={13} className="text-stone-400 mt-0.5 shrink-0" />
                <span>Um campo de texto <strong>Cód. rastreio</strong> — cole aqui o código dos Correios (ex: <code className="bg-stone-100 px-1.5 py-0.5 rounded text-xs">AA123456789BR</code>)</span>
              </div>
              <div className="flex items-start gap-2">
                <ChevronRight size={13} className="text-stone-400 mt-0.5 shrink-0" />
                <span>Clique no botão <strong>Enviar</strong> ao lado do campo</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                <span>O status muda automaticamente para <Badge label="Enviado" color="blue" /> e o cliente pode rastrear pelo site</span>
              </div>
            </div>
            <Tip type="info">
              O código de rastreio está impresso na etiqueta gerada e também disponível no
              painel do Melhor Envio em <strong>Meus envios</strong>.
            </Tip>
          </Step>

          {/* Último step sem linha */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                ✓
              </div>
            </div>
            <div className="pb-2 flex-1">
              <h4 className="font-semibold text-emerald-700 mb-1">Pedido concluído!</h4>
              <p className="text-sm text-stone-600">
                Após a entrega, o status pode ser atualizado para{" "}
                <Badge label="Entregue" color="green" /> manualmente. O cliente pode rastrear
                o envio a qualquer momento em <strong>raizesoficial.com.br/rastreamento</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Tabela de status */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6">
          <h3 className="font-semibold text-obsidian mb-5 flex items-center gap-2">
            <Tag size={16} className="text-emerald-500" />
            Significado de cada status de pedido
          </h3>
          <div className="space-y-3">
            {[
              {
                badge: <Badge label="Aguardando Pagamento" color="amber" />,
                desc: "Pedido criado pelo cliente mas pagamento ainda não confirmado. Não processar o envio.",
              },
              {
                badge: <Badge label="Pago" color="green" />,
                desc: "Pagamento confirmado automaticamente. Pode começar a separar e embalar o produto.",
              },
              {
                badge: <Badge label="Preparando" color="blue" />,
                desc: "Você já separou o produto e está preparando para postagem. Marque manualmente.",
              },
              {
                badge: <Badge label="Enviado" color="blue" />,
                desc: "Produto postado nos Correios. Insira o código de rastreio para o cliente acompanhar.",
              },
              {
                badge: <Badge label="Entregue" color="green" />,
                desc: "Produto entregue ao cliente. Ciclo de venda concluído.",
              },
              {
                badge: <Badge label="Cancelado" color="red" />,
                desc: "Pedido cancelado. Não processar. Em caso de estorno, contate a InfinitePay.",
              },
            ].map(({ badge, desc }) => (
              <div
                key={desc}
                className="flex items-start gap-4 p-3 rounded-xl bg-stone-50 border border-stone-100"
              >
                <div className="min-w-[180px] pt-0.5">{badge}</div>
                <p className="text-sm text-stone-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dúvidas frequentes */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
          <h3 className="font-semibold text-emerald-900 mb-4 flex items-center gap-2">
            <AlertCircle size={16} className="text-emerald-500" />
            Dúvidas frequentes sobre frete
          </h3>
          <div className="space-y-4">
            {[
              {
                q: "O cliente escolheu PAC mas quero enviar SEDEX. Posso?",
                a: "Sim, desde que você absorva a diferença de custo. Nunca cobre valor diferente do que foi pago pelo cliente.",
              },
              {
                q: "O cliente informou o CEP errado. O que fazer?",
                a: "Entre em contato com o cliente por e-mail ou telefone antes de gerar a etiqueta. Os dados de endereço estão visíveis no painel de pedidos.",
              },
              {
                q: "Não consigo gerar a etiqueta no Melhor Envio.",
                a: "Verifique se há saldo suficiente na conta do Melhor Envio. Caso o saldo esteja OK, tente recarregar a página ou contate o suporte deles.",
              },
              {
                q: "O produto tem frete grátis. Preciso gerar etiqueta?",
                a: "Sim! Frete grátis significa que o cliente não pagou pelo frete, mas você ainda precisa gerar e pagar a etiqueta normalmente no Melhor Envio.",
              },
              {
                q: "Posso ter mais de um pedido na mesma caixa?",
                a: "Apenas se for o mesmo destinatário. Cada pedido deve ter sua própria etiqueta e destinatário correto.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-emerald-100 pb-4 last:border-0 last:pb-0">
                <p className="font-semibold text-emerald-900 text-sm mb-1.5">❓ {q}</p>
                <p className="text-sm text-emerald-800 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Rodapé ── */}
      <div className="bg-obsidian rounded-2xl p-6 flex items-center gap-5">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <BookOpen size={18} className="text-ivory" />
        </div>
        <div>
          <p className="text-ivory font-semibold">Este guia será atualizado conforme a loja evolui.</p>
          <p className="text-stone-400 text-sm mt-0.5">
            Em caso de dúvidas não cobertas aqui, entre em contato com o desenvolvedor.
          </p>
        </div>
      </div>

    </div>
  );
}
