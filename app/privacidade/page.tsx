import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";
import { ShieldCheck, Lock, Eye, Database, Share2, UserCheck, Bell, Mail } from "lucide-react";

type BlocoTexto      = { tipo: "texto";          valor: string };
type BlocoSubtitulo  = { tipo: "subtitulo";       valor: string };
type BlocoLista      = { tipo: "lista";           itens: string[] };
type BlocoNumerada   = { tipo: "lista-numerada";  itens: string[] };
type BlocoListaIcon  = { tipo: "lista-icon";      itens: { titulo: string; desc: string }[] };
type BlocoTabela     = { tipo: "tabela";          linhas: { finalidade: string; base: string; dados: string }[] };
type Bloco = BlocoTexto | BlocoSubtitulo | BlocoLista | BlocoNumerada | BlocoListaIcon | BlocoTabela;

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Política de Privacidade da Raízes. Saiba como coletamos, usamos e protegemos seus dados pessoais em conformidade com a LGPD.",
};

const SECTIONS: { id: string; icon: React.ElementType; titulo: string; conteudo: Bloco[] }[] = [
  {
    id: "introducao",
    icon: ShieldCheck,
    titulo: "1. Introdução e identificação do controlador",
    conteudo: [
      {
        tipo: "texto",
        valor:
          "A Raízes Oficial Vendas LTDA, inscrita no CNPJ sob o nº [em registro], com sede em [endereço a confirmar], doravante denominada simplesmente \"Raízes\", é a controladora dos dados pessoais coletados neste site e nas plataformas digitais associadas à marca.",
      },
      {
        tipo: "texto",
        valor:
          "Esta Política de Privacidade descreve como a Raízes coleta, utiliza, armazena, compartilha e protege seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018, \"LGPD\"), o Código de Defesa do Consumidor (Lei nº 8.078/1990) e demais normativas aplicáveis.",
      },
      {
        tipo: "texto",
        valor:
          "Ao realizar uma compra, criar uma conta, assinar nossa newsletter ou simplesmente navegar neste site, você reconhece que leu e compreendeu esta política. Caso não concorde com algum de seus termos, recomendamos que não utilize nossos serviços e entre em contato pelo e-mail contato@raizesoficial.com.br para esclarecimentos.",
      },
    ],
  },
  {
    id: "dados",
    icon: Database,
    titulo: "2. Dados pessoais que coletamos",
    conteudo: [
      {
        tipo: "subtitulo",
        valor: "2.1 Dados fornecidos diretamente por você",
      },
      {
        tipo: "lista",
        itens: [
          "Nome completo e CPF, necessários para emissão de nota fiscal e conformidade fiscal.",
          "Endereço completo de entrega, incluindo CEP, logradouro, número, complemento, bairro, cidade e estado.",
          "Endereço de e-mail, utilizado para comunicações transacionais (confirmação de pedido, rastreio) e, com seu consentimento, comunicações de marketing.",
          "Número de telefone celular, para contato em casos de dificuldade de entrega ou urgências relacionadas ao pedido.",
          "Dados de pagamento: não armazenamos dados de cartão de crédito diretamente. Essas informações são processadas exclusivamente por nossa plataforma de pagamento parceira (Asaas), em ambiente criptografado e certificado PCI DSS.",
          "Senha de acesso à conta (armazenada em formato de hash criptográfico irreversível).",
          "Preferências de tamanho e histórico de compras, para melhorar sua experiência de navegação.",
        ],
      },
      {
        tipo: "subtitulo",
        valor: "2.2 Dados coletados automaticamente",
      },
      {
        tipo: "lista",
        itens: [
          "Endereço IP e dados de geolocalização aproximada.",
          "Tipo e versão do navegador, sistema operacional e dispositivo utilizado.",
          "Páginas visitadas, tempo de permanência, sequência de navegação e itens visualizados.",
          "Origem do acesso (busca orgânica, tráfego direto, redes sociais, e-mail marketing).",
          "Dados de cookies e tecnologias similares (ver seção 7 desta política).",
          "Identificadores de dispositivo (device ID) em acessos por aplicativos móveis.",
        ],
      },
      {
        tipo: "subtitulo",
        valor: "2.3 Dados de terceiros",
      },
      {
        tipo: "texto",
        valor:
          "Eventualmente podemos receber dados de parceiros comerciais, como plataformas de redes sociais (ao realizar login social), processadores de pagamento e empresas de logística, sempre limitados ao estritamente necessário para a finalidade declarada.",
      },
    ],
  },
  {
    id: "finalidades",
    icon: Eye,
    titulo: "3. Para que usamos seus dados",
    conteudo: [
      {
        tipo: "texto",
        valor:
          "Utilizamos seus dados pessoais com base em diferentes fundamentos legais previstos na LGPD:",
      },
      {
        tipo: "tabela",
        linhas: [
          {
            finalidade: "Processar e entregar seu pedido",
            base: "Execução de contrato",
            dados: "Nome, CPF, endereço, e-mail, telefone",
          },
          {
            finalidade: "Emitir nota fiscal",
            base: "Obrigação legal",
            dados: "Nome, CPF, endereço",
          },
          {
            finalidade: "Comunicações sobre o pedido (confirmação, envio, rastreio)",
            base: "Execução de contrato",
            dados: "E-mail, telefone",
          },
          {
            finalidade: "Prevenção a fraudes e segurança",
            base: "Legítimo interesse",
            dados: "IP, dados de dispositivo, histórico de compras",
          },
          {
            finalidade: "Melhoria do site e personalização de experiência",
            base: "Legítimo interesse",
            dados: "Dados de navegação, cookies analíticos",
          },
          {
            finalidade: "Envio de newsletters e promoções",
            base: "Consentimento",
            dados: "E-mail, preferências de produto",
          },
          {
            finalidade: "Atendimento de solicitações de trocas e suporte",
            base: "Execução de contrato / Legítimo interesse",
            dados: "Nome, e-mail, histórico de pedidos",
          },
          {
            finalidade: "Cumprimento de obrigações legais e regulatórias",
            base: "Obrigação legal",
            dados: "Todos os dados necessários",
          },
        ],
      },
    ],
  },
  {
    id: "compartilhamento",
    icon: Share2,
    titulo: "4. Compartilhamento de dados",
    conteudo: [
      {
        tipo: "texto",
        valor:
          "A Raízes não vende, aluga nem comercializa seus dados pessoais com terceiros para fins publicitários próprios de terceiros. O compartilhamento ocorre apenas nas situações abaixo, com parceiros que assumem contratualmente o compromisso de proteger seus dados:",
      },
      {
        tipo: "lista-icon",
        itens: [
          {
            titulo: "Transportadoras e Correios",
            desc: "Nome, endereço de entrega e telefone são compartilhados exclusivamente para viabilizar a entrega do pedido. Operamos com Correios, JadLog, Melhor Envio e outras transportadoras integradas.",
          },
          {
            titulo: "Processadora de pagamentos (Asaas)",
            desc: "Dados de identificação e valor da transação são transmitidos em canal criptografado para processamento seguro. A Raízes jamais armazena dados completos de cartão.",
          },
          {
            titulo: "Plataforma de infraestrutura (Supabase / Vercel)",
            desc: "Nosso banco de dados e hospedagem são gerenciados em servidores certificados, com controles de acesso, criptografia em repouso e em trânsito.",
          },
          {
            titulo: "Ferramentas de análise (Google Analytics)",
            desc: "Dados de navegação anonimizados são utilizados para entender o comportamento de uso e melhorar o site. Nenhum dado identificável é compartilhado neste contexto.",
          },
          {
            titulo: "Autoridades públicas e órgãos reguladores",
            desc: "Quando exigido por lei, ordem judicial ou solicitação legítima de autoridade competente, podemos divulgar dados pessoais na medida estritamente necessária.",
          },
        ],
      },
    ],
  },
  {
    id: "retencao",
    icon: Lock,
    titulo: "5. Retenção e exclusão dos dados",
    conteudo: [
      {
        tipo: "texto",
        valor:
          "Mantemos seus dados pelo tempo necessário para cumprir as finalidades declaradas nesta política ou conforme exigido por lei:",
      },
      {
        tipo: "lista",
        itens: [
          "Dados de pedidos e nota fiscal: mínimo de 5 anos, conforme exigência fiscal e tributária brasileira (Código Civil, art. 206).",
          "Dados de conta ativa: enquanto a conta existir e por até 12 meses após seu último acesso ou solicitação de exclusão.",
          "Dados de newsletter: enquanto o consentimento estiver ativo. Você pode cancelar a qualquer momento pelo link de descadastro presente em cada e-mail.",
          "Dados de navegação e cookies: conforme os períodos definidos em cada cookie (ver seção 7).",
          "Logs de acesso: 6 meses, conforme determina o Marco Civil da Internet (Lei nº 12.965/2014, art. 15).",
        ],
      },
      {
        tipo: "texto",
        valor:
          "Após o período de retenção aplicável, seus dados são eliminados de forma segura ou anonimizados de maneira irreversível, de modo que não seja mais possível identificá-lo.",
      },
    ],
  },
  {
    id: "direitos",
    icon: UserCheck,
    titulo: "6. Seus direitos como titular",
    conteudo: [
      {
        tipo: "texto",
        valor:
          "A LGPD garante a você, como titular dos dados, os seguintes direitos. Para exercê-los, entre em contato pelo e-mail contato@raizesoficial.com.br com o assunto \"Direitos LGPD\". Respondemos em até 15 dias úteis:",
      },
      {
        tipo: "lista-numerada",
        itens: [
          "Confirmação e acesso: saber se tratamos seus dados e ter acesso a uma cópia deles.",
          "Correção: solicitar a atualização ou retificação de dados incompletos, inexatos ou desatualizados.",
          "Anonimização, bloqueio ou eliminação: quando aplicável, requerer que dados desnecessários ou excessivos sejam anonimizados, bloqueados ou excluídos.",
          "Portabilidade: receber seus dados em formato estruturado e interoperável.",
          "Eliminação com consentimento: solicitar a exclusão dos dados tratados com base no seu consentimento.",
          "Informação sobre compartilhamento: saber com quais entidades públicas ou privadas compartilhamos seus dados.",
          "Revogação do consentimento: retirar o consentimento a qualquer momento, sem prejuízo da licitude dos tratamentos realizados antes da revogação.",
          "Oposição: opor-se a tratamentos que considere em desconformidade com a lei.",
          "Revisão de decisões automatizadas: solicitar revisão humana de decisões tomadas exclusivamente com base em tratamento automatizado.",
        ],
      },
    ],
  },
  {
    id: "cookies",
    icon: Eye,
    titulo: "7. Cookies e tecnologias de rastreamento",
    conteudo: [
      {
        tipo: "texto",
        valor:
          "Utilizamos cookies e tecnologias similares para garantir o funcionamento do site, personalizar sua experiência e analisar o desempenho das nossas páginas. Os cookies são classificados em:",
      },
      {
        tipo: "lista-icon",
        itens: [
          {
            titulo: "Cookies estritamente necessários",
            desc: "Essenciais para o funcionamento do site: autenticação de sessão, manutenção do carrinho de compras e preferências básicas. Não podem ser desativados sem comprometer a navegação.",
          },
          {
            titulo: "Cookies de desempenho e análise",
            desc: "Utilizados via Google Analytics para coletar dados anônimos sobre como os visitantes interagem com o site. Nos ajudam a identificar páginas com problemas e melhorar a experiência geral.",
          },
          {
            titulo: "Cookies de funcionalidade",
            desc: "Memorizam suas preferências (tamanho, idioma, histórico de visualização) para personalizar sua próxima visita.",
          },
          {
            titulo: "Cookies de marketing",
            desc: "Utilizados para veiculação de anúncios relevantes e medição de campanhas. Você pode recusar estes cookies sem impacto no funcionamento do site.",
          },
        ],
      },
      {
        tipo: "texto",
        valor:
          "Você pode gerenciar suas preferências de cookies a qualquer momento pelas configurações do seu navegador. Saiba que desativar determinados cookies pode afetar funcionalidades do site.",
      },
    ],
  },
  {
    id: "seguranca",
    icon: Lock,
    titulo: "8. Segurança dos dados",
    conteudo: [
      {
        tipo: "texto",
        valor:
          "Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso não autorizado, perda, alteração ou destruição:",
      },
      {
        tipo: "lista",
        itens: [
          "Criptografia TLS/SSL em todas as comunicações entre o navegador e nossos servidores.",
          "Criptografia em repouso para dados sensíveis armazenados no banco de dados.",
          "Senhas armazenadas exclusivamente em formato de hash bcrypt, nunca em texto plano.",
          "Controle de acesso por princípio do privilégio mínimo: cada sistema e colaborador acessa apenas o que é necessário para sua função.",
          "Monitoramento contínuo de acessos e alertas automáticos para comportamentos suspeitos.",
          "Plano de resposta a incidentes, com notificação à ANPD e aos titulares afetados em caso de vazamento, nos prazos legais.",
        ],
      },
      {
        tipo: "texto",
        valor:
          "Nenhum sistema é 100% inviolável. Caso identifique qualquer atividade suspeita em sua conta, entre em contato imediatamente com nossa equipe.",
      },
    ],
  },
  {
    id: "notificacoes",
    icon: Bell,
    titulo: "9. Comunicações de marketing",
    conteudo: [
      {
        tipo: "texto",
        valor:
          "O envio de newsletters, promoções e comunicações de marketing é sempre baseado no seu consentimento explícito, obtido no momento do cadastro ou de uma compra.",
      },
      {
        tipo: "lista",
        itens: [
          "Você pode cancelar o recebimento a qualquer momento clicando no link \"cancelar inscrição\" presente em todos os nossos e-mails de marketing.",
          "O cancelamento da newsletter não afeta as comunicações transacionais (confirmação de pedido, nota fiscal, rastreio), que são necessárias para o cumprimento do contrato.",
          "Não realizamos envios de SMS ou ligações telefônicas para fins de marketing sem consentimento prévio.",
          "Não compartilhamos sua lista de e-mail com terceiros para campanhas de terceiros.",
        ],
      },
    ],
  },
  {
    id: "atualizacoes",
    icon: Bell,
    titulo: "10. Atualizações desta política",
    conteudo: [
      {
        tipo: "texto",
        valor:
          "Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças nas nossas práticas, na legislação aplicável ou em nossos serviços. Todas as alterações relevantes serão comunicadas por e-mail e por aviso destacado no site.",
      },
      {
        tipo: "texto",
        valor:
          "A data da última revisão está indicada no rodapé desta página. Recomendamos que você a consulte periodicamente. O uso continuado do site após a publicação de alterações implica aceite das condições atualizadas.",
      },
    ],
  },
];

export default function PrivacidadePage() {
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
                Política de Privacidade.
              </h1>
              <p className="font-sans text-stone-400 text-base leading-relaxed max-w-lg mb-8">
                Seus dados pertencem a você. Esta política explica, com clareza e sem
                juridiquês desnecessário, como coletamos, usamos e protegemos suas
                informações em total conformidade com a LGPD.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 px-4 py-2">
                  <ShieldCheck size={13} strokeWidth={1.5} className="text-emerald-500" />
                  <span className="font-sans text-xs text-stone-400 tracking-wide">Conforme LGPD (Lei 13.709/2018)</span>
                </div>
                <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 px-4 py-2">
                  <Lock size={13} strokeWidth={1.5} className="text-emerald-500" />
                  <span className="font-sans text-xs text-stone-400 tracking-wide">Criptografia TLS em todos os dados</span>
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

                    <div className="pl-13 space-y-5" style={{ paddingLeft: "3.25rem" }}>
                      {sec.conteudo.map((bloco, bi) => {
                        if (bloco.tipo === "texto") {
                          return (
                            <p key={bi} className="font-sans text-sm text-stone-600 leading-relaxed">
                              {bloco.valor}
                            </p>
                          );
                        }
                        if (bloco.tipo === "subtitulo") {
                          return (
                            <p key={bi} className="font-sans text-sm font-semibold text-obsidian tracking-wide mt-6 mb-1">
                              {bloco.valor}
                            </p>
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
                        if (bloco.tipo === "lista-numerada" && bloco.itens) {
                          return (
                            <ol key={bi} className="space-y-3">
                              {bloco.itens.map((item, ii) => (
                                <li key={ii} className="flex items-start gap-3">
                                  <span className="font-sans text-[10px] font-semibold text-stone-400 tracking-widest mt-0.5 shrink-0 w-5">
                                    {String(ii + 1).padStart(2, "0")}
                                  </span>
                                  <p className="font-sans text-sm text-stone-600 leading-relaxed">{item}</p>
                                </li>
                              ))}
                            </ol>
                          );
                        }
                        if (bloco.tipo === "lista-icon" && bloco.itens) {
                          return (
                            <div key={bi} className="space-y-4">
                              {bloco.itens.map((item, ii) => (
                                <div key={ii} className="bg-stone-50 border border-stone-200 p-5">
                                  <p className="font-sans text-xs font-semibold text-obsidian mb-1.5 tracking-wide">
                                    {item.titulo}
                                  </p>
                                  <p className="font-sans text-sm text-stone-500 leading-relaxed">{item.desc}</p>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        if (bloco.tipo === "tabela" && bloco.linhas) {
                          return (
                            <div key={bi} className="overflow-x-auto">
                              <table className="w-full text-sm border-collapse">
                                <thead>
                                  <tr className="bg-obsidian text-ivory">
                                    <th className="font-sans text-[10px] font-semibold tracking-widest uppercase text-left px-4 py-3">
                                      Finalidade
                                    </th>
                                    <th className="font-sans text-[10px] font-semibold tracking-widest uppercase text-left px-4 py-3">
                                      Base legal
                                    </th>
                                    <th className="font-sans text-[10px] font-semibold tracking-widest uppercase text-left px-4 py-3">
                                      Dados utilizados
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {bloco.linhas.map((linha, li) => (
                                    <tr
                                      key={li}
                                      className={`border-b border-stone-200 ${li % 2 === 0 ? "bg-white" : "bg-stone-50"}`}
                                    >
                                      <td className="font-sans text-xs text-stone-700 px-4 py-3 leading-relaxed">
                                        {linha.finalidade}
                                      </td>
                                      <td className="font-sans text-xs text-stone-500 px-4 py-3 leading-relaxed whitespace-nowrap">
                                        {linha.base}
                                      </td>
                                      <td className="font-sans text-xs text-stone-500 px-4 py-3 leading-relaxed">
                                        {linha.dados}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
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

        {/* ── Contato DPO ── */}
        <section className="bg-obsidian">
          <div className="raizes-container py-14 md:py-20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 max-w-4xl">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Mail size={18} strokeWidth={1.5} className="text-stone-500" />
                  <p className="label-category text-stone-600">Encarregado de dados (DPO)</p>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-normal tracking-tighter text-ivory mb-4">
                  Dúvidas sobre privacidade?
                </h2>
                <p className="font-sans text-stone-400 text-sm leading-relaxed max-w-md">
                  Nosso encarregado de proteção de dados está disponível para esclarecer
                  qualquer questão sobre o tratamento das suas informações pessoais.
                  Responderemos em até 15 dias úteis.
                </p>
              </div>
              <div className="bg-stone-900 border border-stone-800 p-7 shrink-0 w-full md:w-72">
                <p className="label-category text-stone-600 mb-5">Contato</p>
                <div className="space-y-3">
                  <div>
                    <p className="font-sans text-[10px] text-stone-600 uppercase tracking-widest mb-1">E-mail</p>
                    <a
                      href="mailto:contato@raizesoficial.com.br"
                      className="font-sans text-sm text-stone-300 hover:text-ivory transition-colors duration-200"
                    >
                      contato@raizesoficial.com.br
                    </a>
                  </div>
                  <div>
                    <p className="font-sans text-[10px] text-stone-600 uppercase tracking-widest mb-1">Assunto recomendado</p>
                    <p className="font-sans text-xs text-stone-500">Direitos LGPD</p>
                  </div>
                  <div>
                    <p className="font-sans text-[10px] text-stone-600 uppercase tracking-widest mb-1">Prazo de resposta</p>
                    <p className="font-sans text-xs text-stone-500">Até 15 dias úteis</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
