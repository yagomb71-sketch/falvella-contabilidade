import React, { useState, useEffect, useRef } from "react";
import {
  Calculator,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Send,
  ArrowRight,
  Menu,
  X,
  FileText,
  ShieldCheck,
  PhoneCall,
  ArrowUpRight,
  Info,
  ChevronDown,
  User,
  Mail,
  Phone,
  MessageCircle,
  Network,
  GraduationCap,
  Users,
  MousePointerClick,
  Share2,
  Code2,
  Zap,
  Globe2,
  Smartphone,
  Target,
  Quote,
  Star,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ---------------------------------------------------------------------------
// Configuração
// ---------------------------------------------------------------------------
const WHATSAPP_NUMBER = "5511999999999";
const wa = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
const brl = (n: number) => `R$ ${Math.round(n).toLocaleString("pt-BR")}`;

// ---------------------------------------------------------------------------
// Tipos e dados
// ---------------------------------------------------------------------------
interface Message {
  role: "user" | "assistant";
  text: string;
}

interface ProfessionProfile {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  cnae: string;
  description: string;
  challenges: string;
  solution: string;
  typicalBilling: number;
  highlight: string;
}

const PROFESSIONS: ProfessionProfile[] = [
  {
    id: "afiliado",
    title: "Afiliados",
    icon: Network,
    cnae: "7319-0/02 (Promoção de Vendas)",
    description: "Profissionais que vendem produtos de terceiros através de links comissionados em plataformas como Hotmart, Kiwify e Monetizze.",
    challenges: "Gerenciar comissões fragmentadas, lidar com altos impostos de pessoa física (até 27,5% no carnê-leão) e emitir centenas de notas fiscais de forma legal.",
    solution: "Constituição de CNPJ no Simples Nacional com enquadramento no CNAE correto de Promoção de Vendas. Automatização da emissão de notas fiscais de serviço (NFS-e) integradas às plataformas.",
    typicalBilling: 12000,
    highlight: "Imposto inicial de apenas 6% no Simples Nacional.",
  },
  {
    id: "infoprodutor",
    title: "Infoprodutores",
    icon: GraduationCap,
    cnae: "8599-6/04 (Treinamento e Desenvolvimento) & 5811-5/00 (Edição de Livros)",
    description: "Criadores de cursos online, mentorias, e-books e áreas de membros exclusivas.",
    challenges: "Classificar corretamente as vendas (e-book tem imunidade de ICMS/PIS/COFINS, enquanto curso online é serviço). Alta carga tributária em lançamentos de grande volume.",
    solution: "Planejamento tributário híbrido, separando o infoproduto em e-book (livro digital com isenção fiscal) e serviço de mentoria/treinamento, reduzindo o imposto consolidado.",
    typicalBilling: 45000,
    highlight: "Redução de até 60% dos impostos aplicando a imunidade de e-books.",
  },
  {
    id: "coprodutor",
    title: "Coprodutores",
    icon: Users,
    cnae: "7311-9/00 (Agência de Publicidade) & 8211-3/00 (Serviços de Escritório)",
    description: "Parceiros estratégicos de bastidores que cuidam de tráfego, design, copy ou estratégia de lançamentos.",
    challenges: "Divisão segura do faturamento diretamente na plataforma (split de notas fiscais) sem bitributação e com contratos que resguardem a responsabilidade jurídica.",
    solution: "Criação de CNPJ com contratos de coprodução estruturados. Configuração do split de notas fiscais automático para evitar que um parceiro pague imposto sobre a parte do outro.",
    typicalBilling: 25000,
    highlight: "Evite bitributação estruturando o split de notas fiscais legalmente.",
  },
  {
    id: "gestor_trafego",
    title: "Gestores de Tráfego",
    icon: MousePointerClick,
    cnae: "7319-0/04 (Assessoria em Mídia / Portais de Conteúdo)",
    description: "Profissionais dedicados a otimizar anúncios pagos no Facebook Ads, Google Ads e TikTok Ads.",
    challenges: "O MEI não é permitido para esta atividade por ser classificada como publicidade. Risco de faturar no CPF e cair na malha fina por depósitos de clientes para verba de anúncios.",
    solution: "Abertura de uma Sociedade Limitada Unipessoal (SLU) no Simples Nacional. Assessoria para segregação correta entre o serviço de gestão e a verba de anúncios enviada pelos clientes.",
    typicalBilling: 15000,
    highlight: "Atividade impedida ao MEI. Evite multas atuando como CNPJ ME desde o início.",
  },
  {
    id: "social_media",
    title: "Social Media",
    icon: Share2,
    cnae: "7311-9/00 (Agências de Publicidade)",
    description: "Criadores de conteúdo e estrategistas de posicionamento e engajamento para marcas nas redes sociais.",
    challenges: "Formalização para fechar contratos com grandes marcas e empresas que exigem nota fiscal de publicidade.",
    solution: "CNPJ ágil e enquadramento tributário para pagar a menor alíquota. Emissão rápida de notas fiscais e suporte para contratos de prestação de serviços recorrentes (fee mensal).",
    typicalBilling: 8000,
    highlight: "Feche contratos com grandes marcas emitindo nota fiscal corporativa.",
  },
  {
    id: "desenvolvedor",
    title: "Devs & TI",
    icon: Code2,
    cnae: "6202-3/00 (Desenvolvimento de Software Sob Encomenda)",
    description: "Programadores, engenheiros de software e especialistas de tecnologia que prestam serviço para o Brasil ou exterior.",
    challenges: "Fator-R do Simples Nacional, que pode elevar o imposto de 6% para 15,5% se não houver um planejamento de pró-labore de 28% do faturamento.",
    solution: "Gestão do Fator-R mês a mês, garantindo a tributação mínima de 6%. Isenção de PIS, COFINS e ISS para quem exporta software e recebe do exterior.",
    typicalBilling: 30000,
    highlight: "Recebendo do exterior, você fica isento de PIS, COFINS e ISS.",
  },
];

const PRESTADOR_BILLING = 10000;

const STATUS_OPTIONS = [
  { value: "CPF", label: "CPF (Pessoa Física)" },
  { value: "MEI", label: "MEI" },
  { value: "CNPJ", label: "Outro CNPJ (ME/LTDA)" },
];

const AREA_LABEL: Record<string, string> = {
  afiliado: "Afiliado",
  infoprodutos: "Infoprodutor",
  coprodutor: "Coprodutor",
  gestao_trafego: "Gestor de Tráfego",
  desenvolvedor: "Desenvolvedor / TI",
  prestador: "Prestador de serviços digitais",
};

const PLATFORMS = ["Hotmart", "Kiwify", "Eduzz", "Monetizze", "Stripe", "Mercado Pago", "PayPal"];

// ---------------------------------------------------------------------------
// Componentes pequenos
// ---------------------------------------------------------------------------
function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] ${
        dark ? "text-lime" : "text-brand"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dark ? "bg-lime" : "bg-brand"}`} />
      {children}
    </span>
  );
}

function SectionHead({ eyebrow, title, text, center = true }: { eyebrow: string; title: React.ReactNode; text?: string; center?: boolean }) {
  return (
    <div className={`max-w-3xl mb-12 ${center ? "mx-auto text-center" : ""}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-[1.05] mt-4">
        {title}
      </h2>
      {text && <p className="text-muted text-base sm:text-lg mt-4 leading-relaxed">{text}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [activeProfession, setActiveProfession] = useState<ProfessionProfile>(PROFESSIONS[0]);

  const [simProfession, setSimProfession] = useState<string>("afiliado");
  const [simMonthlyRevenue, setSimMonthlyRevenue] = useState<number>(15000);

  const initialDiag = {
    name: "",
    email: "",
    phone: "",
    area: "infoprodutos",
    billingRange: "R$ 5.000 a R$ 15.000",
    currentStatus: "CPF",
    partners: "nao",
    hasHiredBefore: "nao",
  };
  const [diagStep, setDiagStep] = useState<number>(1);
  const [diagData, setDiagData] = useState(initialDiag);
  const [diagError, setDiagError] = useState<string>("");
  const [diagCompleted, setDiagCompleted] = useState<boolean>(false);

  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Olá! Sou o assistente de inteligência artificial da Falvella Contabilidade. Como posso te ajudar hoje com dúvidas fiscais ou abertura de CNPJ para o seu negócio digital?",
    },
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // trava o scroll do fundo quando o chat está aberto
  useEffect(() => {
    document.body.style.overflow = isChatOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsChatOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isChatOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  const selectProfessionProfile = (prof: ProfessionProfile) => {
    setActiveProfession(prof);
    setSimProfession(prof.id);
    setSimMonthlyRevenue(prof.typicalBilling);
  };

  // -------------------------------------------------------------------------
  // Cálculo de impostos
  // -------------------------------------------------------------------------
  const calculateTax = (rev: number) => {
    const inssCPF = Math.min(rev * 0.2, 1502.74);
    const baseIRPF = Math.max(rev - inssCPF, 0);
    let irpf = 0;
    if (baseIRPF <= 2259.2) irpf = 0;
    else if (baseIRPF <= 2826.65) irpf = baseIRPF * 0.075 - 169.44;
    else if (baseIRPF <= 3751.05) irpf = baseIRPF * 0.15 - 381.44;
    else if (baseIRPF <= 4664.68) irpf = baseIRPF * 0.225 - 662.77;
    else irpf = baseIRPF * 0.275 - 896.0;
    const totalCPF = inssCPF + irpf;
    const rateCPF = rev > 0 ? (totalCPF / rev) * 100 : 0;

    const annualProj = rev * 12;
    let rateSimples = 6.0;
    if (annualProj <= 180000) rateSimples = 6.0;
    else if (annualProj <= 360000) rateSimples = 8.5;
    else if (annualProj <= 720000) rateSimples = 10.5;
    else if (annualProj <= 1800000) rateSimples = 12.0;
    else rateSimples = 14.5;
    const totalSimples = rev * (rateSimples / 100);

    const ratePresumido = 14.33;
    const totalPresumido = rev * (ratePresumido / 100);

    const monthlySavings = totalCPF - totalSimples;
    return {
      cpf: { total: totalCPF, rate: rateCPF },
      simples: { total: totalSimples, rate: rateSimples },
      presumido: { total: totalPresumido, rate: ratePresumido },
      savingsMonthly: Math.max(monthlySavings, 0),
      savingsAnnual: Math.max(monthlySavings * 12, 0),
    };
  };

  const simResult = calculateTax(simMonthlyRevenue);
  const maxBar = Math.max(simResult.cpf.total, simResult.presumido.total, simResult.simples.total, 1);
  const sliderPct = ((simMonthlyRevenue - 3000) / (150000 - 3000)) * 100;
  const heroExample = calculateTax(15000);

  // -------------------------------------------------------------------------
  // Chat
  // -------------------------------------------------------------------------
  const askAssistant = async (question: string) => {
    if (!question.trim() || chatLoading) return;
    const history = chatMessages.slice(-6).map((m) => ({ role: m.role, text: m.text }));
    setChatMessages((prev) => [...prev, { role: "user", text: question }]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, history }),
      });
      const data = await res.json();
      if (!res.ok || !data.text) throw new Error(data.error || "Erro");
      setChatMessages((prev) => [...prev, { role: "assistant", text: data.text }]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Ops! Não consegui responder agora. Se preferir, fale diretamente com nossos contadores pelo WhatsApp — é rapidinho.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    askAssistant(chatInput);
  };

  // -------------------------------------------------------------------------
  // Diagnóstico
  // -------------------------------------------------------------------------
  const validateStep1 = () => {
    if (!diagData.name.trim() || !diagData.email.trim() || !diagData.phone.trim()) {
      return "Preencha nome, e-mail e WhatsApp para continuar.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(diagData.email.trim())) {
      return "Digite um e-mail válido.";
    }
    if (diagData.phone.replace(/\D/g, "").length < 10) {
      return "Digite um WhatsApp com DDD.";
    }
    return "";
  };

  const handleDiagNext = () => {
    if (diagStep === 1) {
      const err = validateStep1();
      setDiagError(err);
      if (err) return;
    }
    setDiagStep((prev) => Math.min(prev + 1, 3));
  };

  const handleDiagPrev = () => {
    setDiagError("");
    setDiagStep((prev) => Math.max(prev - 1, 1));
  };

  // Enter no passo 1 ou 2 avança em vez de pular para o resultado
  const handleDiagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (diagStep < 3) {
      handleDiagNext();
      return;
    }
    setDiagCompleted(true);
  };

  const resetDiagnostic = () => {
    setDiagStep(1);
    setDiagCompleted(false);
    setDiagError("");
    setDiagData(initialDiag);
  };

  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
  };

  const getDiagnosticAnalysis = () => {
    const { area, currentStatus: status } = diagData;
    let idealCnae = "";
    const regime = "Simples Nacional (CNPJ ME)";
    let detailText = "";
    let alertText = "";

    if (area === "afiliado") {
      idealCnae = "7319-0/02 - Promoção de Vendas";
      detailText = "Afiliados devem evitar o MEI, pois a atividade de intermediação e promoção não é contemplada no MEI. O Simples Nacional oferece a melhor tributação inicial (6%) no Anexo III.";
    } else if (area === "infoprodutos") {
      idealCnae = "8599-6/04 - Treinamentos & 5811-5/00 - Edição de Livros (E-books)";
      detailText = "Você pode economizar impostos dividindo seu produto em venda de livros digitais (com imunidade tributária) e mentoria. Excelente potencial de redução fiscal.";
    } else if (area === "gestao_trafego") {
      idealCnae = "7319-0/04 - Assessoria em Mídia";
      detailText = "Atenção: a atividade de Gestão de Tráfego é considerada publicidade e é proibida no MEI. Atuar no CPF pode gerar uma cobrança de até 27,5% de imposto. É urgente abrir um CNPJ ME.";
    } else if (area === "coprodutor") {
      idealCnae = "7311-9/00 - Agências de Publicidade";
      detailText = "O coprodutor precisa de um contrato de parceria robusto e um split fiscal configurado para emitir notas automáticas sem duplicar impostos com o produtor principal.";
    } else if (area === "desenvolvedor") {
      idealCnae = "6202-3/00 - Desenvolvimento de Software Sob Encomenda";
      detailText = "Sua tributação padrão seria de 15,5% (Anexo V). Na Falvella, aplicamos o Fator-R (pró-labore estratégico de 28%), permitindo que você pague a partir de 6%.";
    } else {
      idealCnae = "8211-3/00 - Serviços combinados de escritório e apoio administrativo";
      detailText = "Prestadores de serviços digitais em geral podem atuar no Simples Nacional com impostos otimizados. Cuidamos de todo o faturamento mensal.";
    }

    if (status === "MEI") {
      alertText = "Como você já é MEI, é importante verificar se seu faturamento não ultrapassará o limite anual de R$ 81.000 e se sua atividade não é vedada ao MEI. Nós cuidamos da transição sem dor de cabeça.";
    } else if (status === "CPF") {
      alertText = "Faturar como Pessoa Física (CPF) no mercado digital é o erro tributário mais caro: até 27,5% de Imposto de Renda mais 20% de INSS autônomo. Migrar para CNPJ traz economia imediata.";
    }
    return { idealCnae, regime, detailText, alertText };
  };

  const analysis = getDiagnosticAnalysis();
  const statusLabel = STATUS_OPTIONS.find((s) => s.value === diagData.currentStatus)?.label ?? diagData.currentStatus;

  const getWhatsAppDiagnosticLink = () =>
    wa(`Olá Falvella Contabilidade! Fiz o Diagnóstico Gratuito no site e gostaria de falar com um contador especializado.

*Meus dados:*
- *Nome:* ${diagData.name}
- *Área:* ${AREA_LABEL[diagData.area] ?? diagData.area}
- *Faturamento estimado:* ${diagData.billingRange}
- *Status atual:* ${statusLabel}
- *Sociedade:* ${diagData.partners === "sim" ? "Sim (com sócios)" : "Não (individual)"}
- *Pretende contratar:* ${diagData.hasHiredBefore === "sim" ? "Sim" : "Não"}

*Diagnóstico sugerido:*
- *Regime:* ${analysis.regime}
- *CNAE:* ${analysis.idealCnae}

Gostaria de agendar uma conversa para abrir/migrar minha empresa!`);

  const NAV = [
    { id: "professions", label: "Atuação" },
    { id: "simulator", label: "Simulador" },
    { id: "diagnostic", label: "Diagnóstico" },
    { id: "diferenciais", label: "Diferenciais" },
    { id: "faq", label: "Dúvidas" },
  ];

  const inputCls =
    "w-full bg-canvas border border-line rounded-xl px-4 py-3 text-sm text-ink placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition";

  // =========================================================================
  return (
    <div className="bg-white text-ink font-sans selection:bg-lime selection:text-ink min-h-screen flex flex-col">
      {/* HEADER ------------------------------------------------------------ */}
      <header className="fixed top-0 inset-x-0 z-40 px-3 sm:px-6 pt-3">
        <div
          className={`max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-5 rounded-2xl border transition-all duration-300 ${
            scrolled
              ? "bg-white/85 backdrop-blur-xl border-line shadow-[0_8px_30px_rgba(10,21,48,0.08)]"
              : "bg-white/5 backdrop-blur-md border-white/10"
          }`}
        >
          <button onClick={() => scrollToSection("hero")} className="flex items-center gap-2.5 cursor-pointer" aria-label="Início">
            <span className="h-9 w-9 rounded-xl bg-brand text-white grid place-items-center font-display font-extrabold text-lg">F</span>
            <span className={`font-display text-lg font-bold tracking-tight ${scrolled ? "text-ink" : "text-white"}`}>
              Falvella<span className="text-brand">.</span>
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => scrollToSection(n.id)}
                className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
                  scrolled ? "text-muted hover:text-ink hover:bg-canvas" : "text-white/75 hover:text-white hover:bg-white/10"
                }`}
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => setIsChatOpen(true)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                scrolled ? "text-ink hover:bg-canvas" : "text-white hover:bg-white/10"
              }`}
            >
              <Sparkles className="h-4 w-4 text-brand" />
              Consultor IA
            </button>
            <a
              href={wa("Olá! Gostaria de falar com um contador especialista da Falvella Contabilidade.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-brand text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-brand-600 transition-colors text-sm"
            >
              Falar no WhatsApp
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled ? "text-ink hover:bg-canvas" : "text-white hover:bg-white/10"}`}
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="lg:hidden max-w-7xl mx-auto mt-2 bg-white rounded-2xl border border-line shadow-xl p-3"
            >
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => scrollToSection(n.id)}
                  className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-ink hover:bg-canvas"
                >
                  {n.label}
                </button>
              ))}
              <div className="grid gap-2 pt-3 mt-2 border-t border-line">
                <button
                  onClick={() => {
                    setIsChatOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 text-ink font-semibold bg-canvas py-3 rounded-xl"
                >
                  <Sparkles className="h-4 w-4 text-brand" />
                  Perguntar ao Consultor IA
                </button>
                <a
                  href={wa("Olá! Gostaria de falar com um contador especialista da Falvella Contabilidade.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-brand text-white py-3 rounded-xl font-semibold"
                >
                  Falar no WhatsApp
                  <PhoneCall className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">
        {/* HERO ------------------------------------------------------------- */}
        <section id="hero" className="relative bg-ink text-white overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-28">
          <div className="absolute inset-0 bg-grid pointer-events-none" />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-brand/30 blur-[120px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-14 items-center">
            <div className="lg:col-span-7">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/80">
                  <span className="h-2 w-2 rounded-full bg-lime shadow-[0_0_0_4px_rgba(200,241,105,0.2)]" />
                  Contabilidade 100% digital e humanizada
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="font-display text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-7xl font-bold tracking-tight mt-6"
              >
                Contabilidade para quem fatura no <span className="text-gradient">digital</span>.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="text-lg sm:text-xl text-white/70 mt-6 max-w-xl leading-relaxed"
              >
                Afiliados, infoprodutores, gestores de tráfego e prestadores de serviço: pague menos impostos dentro da lei e esqueça a burocracia.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18 }}
                className="flex flex-col sm:flex-row gap-3 mt-9"
              >
                <button
                  onClick={() => scrollToSection("simulator")}
                  className="inline-flex items-center justify-center gap-2 bg-lime text-ink px-7 py-4 rounded-xl font-semibold hover:brightness-95 transition cursor-pointer"
                >
                  <Calculator className="h-5 w-5" />
                  Simular minha economia
                </button>
                <button
                  onClick={() => scrollToSection("diagnostic")}
                  className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-7 py-4 rounded-xl font-semibold hover:bg-white/10 transition cursor-pointer"
                >
                  <FileText className="h-5 w-5" />
                  Diagnóstico gratuito
                </button>
              </motion.div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/10">
                {[
                  ["100%", "Atendimento online"],
                  ["WhatsApp", "Suporte diário"],
                  ["6%", "Imposto inicial"],
                  ["Zero", "Multas com o Fisco"],
                ].map(([big, small]) => (
                  <div key={small}>
                    <div className="font-display text-2xl font-bold">{big}</div>
                    <div className="text-xs text-white/55 mt-1">{small}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card de economia ao vivo */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="relative animate-float">
                <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand/40 to-lime/20 blur-2xl" />
                <div className="relative rounded-3xl bg-white text-ink p-6 sm:p-7 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-subtle">Exemplo real</span>
                    <span className="text-xs font-medium bg-canvas px-2.5 py-1 rounded-full text-muted">Faturamento R$ 15 mil/mês</span>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-muted">No CPF (autônomo)</span>
                        <span className="font-semibold text-danger">{brl(heroExample.cpf.total)}</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-danger-50 overflow-hidden">
                        <div className="h-full rounded-full bg-danger" style={{ width: "100%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-muted">No CNPJ com a Falvella</span>
                        <span className="font-semibold text-mint">{brl(heroExample.simples.total)}</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-mint-50 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-mint"
                          style={{ width: `${(heroExample.simples.total / heroExample.cpf.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 rounded-2xl bg-ink text-white p-5 flex items-end justify-between gap-4">
                    <div>
                      <div className="text-xs text-white/60">Economia por ano</div>
                      <div className="font-display text-3xl sm:text-4xl font-bold text-lime mt-1">{brl(heroExample.savingsAnnual)}</div>
                    </div>
                    <div className="h-11 w-11 rounded-xl bg-lime/15 grid place-items-center">
                      <TrendingUp className="h-5 w-5 text-lime" />
                    </div>
                  </div>
                  <p className="text-[11px] text-subtle mt-4">Estimativa com base no Simples Nacional (Anexo III) e na tabela do IRPF + INSS autônomo.</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Plataformas */}
          <div className="relative max-w-7xl mx-auto px-5 sm:px-8 mt-20">
            <p className="text-center text-xs uppercase tracking-[0.18em] text-white/40">Entendemos as plataformas onde você vende</p>
            <div className="mt-6 flex flex-wrap justify-center gap-x-10 gap-y-4">
              {PLATFORMS.map((p) => (
                <span key={p} className="font-display text-lg sm:text-xl font-semibold text-white/45">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* NÚMEROS ----------------------------------------------------------- */}
        <section className="py-16 sm:py-20 border-b border-line">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 grid md:grid-cols-3 gap-4">
            {[
              ["R$ 15 mi", "em impostos economizados legalmente pelos nossos clientes"],
              ["+1.200", "empresas digitais abertas e regularizadas em todo o Brasil"],
              ["99,4%", "de satisfação no atendimento humano pelo WhatsApp"],
            ].map(([n, t]) => (
              <div key={n} className="rounded-3xl bg-canvas p-7 sm:p-8">
                <div className="font-display text-5xl lg:text-6xl font-bold tracking-tight text-ink">{n}</div>
                <p className="text-muted mt-3 leading-relaxed">{t}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ATUAÇÃO ----------------------------------------------------------- */}
        <section className="py-20 sm:py-28" id="professions">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <SectionHead
              eyebrow="Segmentos especializados"
              title="Feita sob medida para o mercado digital"
              text="Escolha a sua área para ver os principais desafios, como resolvemos e já carregar o simulador com o seu perfil."
            />

            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center mb-8">
              {PROFESSIONS.map((prof) => {
                const Icon = prof.icon;
                const isSelected = activeProfession.id === prof.id;
                return (
                  <button
                    key={prof.id}
                    onClick={() => selectProfessionProfile(prof)}
                    aria-pressed={isSelected}
                    className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all cursor-pointer ${
                      isSelected ? "bg-ink border-ink text-white" : "bg-white border-line text-muted hover:text-ink hover:border-ink/30"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {prof.title}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeProfession.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="grid lg:grid-cols-12 gap-4"
              >
                <div className="lg:col-span-8 rounded-3xl border border-line p-7 sm:p-9">
                  <div className="inline-flex items-center gap-2 bg-brand-50 text-brand font-mono text-xs px-3 py-1.5 rounded-lg">
                    CNAE: {activeProfession.cnae}
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mt-5">
                    Contabilidade para {activeProfession.title}
                  </h3>
                  <p className="text-muted mt-3 leading-relaxed">{activeProfession.description}</p>

                  <div className="grid md:grid-cols-2 gap-4 mt-7">
                    <div className="rounded-2xl bg-danger-50/60 p-5">
                      <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-danger">O problema</h4>
                      <p className="text-sm text-ink/80 leading-relaxed mt-2">{activeProfession.challenges}</p>
                    </div>
                    <div className="rounded-2xl bg-mint-50 p-5">
                      <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-mint">Como resolvemos</h4>
                      <p className="text-sm text-ink/80 leading-relaxed mt-2">{activeProfession.solution}</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 rounded-3xl bg-ink text-white p-7 sm:p-8 flex flex-col justify-between gap-8">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-lime">Destaque</span>
                    <p className="font-display text-2xl font-semibold leading-snug mt-3">{activeProfession.highlight}</p>
                  </div>
                  <div className="grid gap-2">
                    <button
                      onClick={() => scrollToSection("simulator")}
                      className="inline-flex items-center justify-center gap-2 bg-lime text-ink py-3.5 rounded-xl font-semibold text-sm hover:brightness-95 transition"
                    >
                      <Calculator className="h-4 w-4" />
                      Simular com este perfil
                    </button>
                    <a
                      href={wa(`Olá! Gostaria de saber mais sobre a contabilidade especializada para ${activeProfession.title}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 border border-white/20 py-3.5 rounded-xl font-semibold text-sm hover:bg-white/10 transition"
                    >
                      Conversar no WhatsApp
                    </a>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* SIMULADOR --------------------------------------------------------- */}
        <section className="py-20 sm:py-28 bg-canvas" id="simulator">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <SectionHead
              eyebrow="Simulador"
              title="Quanto você pode economizar em impostos?"
              text="Ajuste seu faturamento mensal e compare, em segundos, faturar no CPF ou com um CNPJ regularizado pela Falvella."
            />

            <div className="grid lg:grid-cols-12 gap-4 items-stretch">
              {/* Controles */}
              <div className="lg:col-span-5 bg-white p-7 sm:p-8 rounded-3xl border border-line space-y-8">
                <div>
                  <label htmlFor="sim-prof" className="block text-sm font-semibold text-ink mb-2.5">
                    Qual é a sua atuação?
                  </label>
                  <div className="relative">
                    <select
                      id="sim-prof"
                      value={simProfession}
                      onChange={(e) => {
                        setSimProfession(e.target.value);
                        const matched = PROFESSIONS.find((p) => p.id === e.target.value);
                        if (matched) {
                          setActiveProfession(matched);
                          setSimMonthlyRevenue(matched.typicalBilling);
                        } else {
                          setSimMonthlyRevenue(PRESTADOR_BILLING);
                        }
                      }}
                      className={`${inputCls} appearance-none pr-10 cursor-pointer`}
                    >
                      {PROFESSIONS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                      <option value="prestador">Prestadores de serviços em geral</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-4">
                    <label htmlFor="sim-rev" className="text-sm font-semibold text-ink">
                      Faturamento mensal
                    </label>
                    <span className="font-display text-2xl font-bold text-ink">{brl(simMonthlyRevenue)}</span>
                  </div>
                  <input
                    id="sim-rev"
                    type="range"
                    min={3000}
                    max={150000}
                    step={1000}
                    value={simMonthlyRevenue}
                    onChange={(e) => setSimMonthlyRevenue(Number(e.target.value))}
                    className="range w-full"
                    style={{ ["--p" as string]: `${sliderPct}%` } as React.CSSProperties}
                  />
                  <div className="flex justify-between text-xs text-subtle mt-3 font-mono">
                    <span>3 mil</span>
                    <span>50 mil</span>
                    <span>100 mil</span>
                    <span>150 mil</span>
                  </div>
                </div>

                {simProfession === "desenvolvedor" || simProfession === "gestor_trafego" ? (
                  <div className="bg-brand-50 p-4 rounded-2xl flex gap-3">
                    <Info className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                    <p className="text-sm text-ink/80 leading-relaxed">
                      <strong className="text-ink">Fator-R aplicado:</strong> essas atividades normalmente pagam 15,5%. Com um pró-labore estratégico de 28%, o imposto cai para a partir de <strong className="text-ink">6%</strong>, já considerado no cálculo.
                    </p>
                  </div>
                ) : (
                  <div className="bg-mint-50 p-4 rounded-2xl flex gap-3">
                    <Info className="h-5 w-5 text-mint shrink-0 mt-0.5" />
                    <p className="text-sm text-ink/80 leading-relaxed">
                      Buscamos o enquadramento no <strong className="text-ink">Simples Nacional Anexo III</strong>, com alíquota inicial de 6% no seu CNPJ.
                    </p>
                  </div>
                )}
              </div>

              {/* Resultado */}
              <div className="lg:col-span-7 bg-white p-7 sm:p-8 rounded-3xl border border-line flex flex-col">
                <h3 className="font-display text-xl font-bold">Imposto por mês</h3>

                <div className="space-y-6 mt-6">
                  {[
                    { label: "Autônomo (CPF, sem CNPJ)", r: simResult.cpf, bar: "bg-danger", track: "bg-danger-50", text: "text-danger", note: "IRPF de até 27,5% + INSS autônomo" },
                    { label: "Simples Nacional com a Falvella", r: simResult.simples, bar: "bg-mint", track: "bg-mint-50", text: "text-mint", note: "Recomendado: guia única (DAS)", best: true },
                    { label: "Lucro Presumido (CNPJ)", r: simResult.presumido, bar: "bg-brand", track: "bg-brand-50", text: "text-brand", note: "" },
                  ].map((row) => (
                    <div key={row.label}>
                      <div className="flex justify-between items-baseline gap-3 text-sm mb-2">
                        <span className="flex items-center gap-2 font-medium text-ink">
                          {row.label}
                          {row.best && <span className="text-[10px] font-semibold uppercase tracking-wider bg-lime text-ink px-2 py-0.5 rounded-full">Melhor</span>}
                        </span>
                        <span className={`font-semibold whitespace-nowrap ${row.text}`}>
                          {brl(row.r.total)} <span className="text-subtle font-normal">· {row.r.rate.toFixed(1).replace(".", ",")}%</span>
                        </span>
                      </div>
                      <div className={`w-full h-3 rounded-full overflow-hidden ${row.track}`}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(row.r.total / maxBar) * 100}%` }}
                          transition={{ duration: 0.5 }}
                          className={`h-full rounded-full ${row.bar}`}
                        />
                      </div>
                      {row.note && <p className="text-xs text-subtle mt-1.5">{row.note}</p>}
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-8">
                  <div className="rounded-2xl bg-ink text-white p-6 grid sm:grid-cols-[1fr_auto] gap-5 items-center">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">Economia anual estimada</span>
                      <span className="block font-display text-4xl font-bold text-lime mt-1">{brl(simResult.savingsAnnual)}</span>
                      <span className="text-xs text-white/55 mt-1 block">Dinheiro que deixa de ir para impostos e fica na sua conta.</span>
                    </div>
                    <a
                      href={wa(
                        `Olá! Simulei no site e vi uma economia anual de ${brl(simResult.savingsAnnual)} com faturamento de ${brl(simMonthlyRevenue)} por mês. Quero abrir/migrar minha empresa!`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-lime text-ink px-6 py-3.5 rounded-xl font-semibold text-sm hover:brightness-95 transition whitespace-nowrap"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Garantir essa economia
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DIAGNÓSTICO ------------------------------------------------------- */}
        <section className="py-20 sm:py-28" id="diagnostic">
          <div className="max-w-3xl mx-auto px-5 sm:px-8">
            <SectionHead
              eyebrow="Diagnóstico gratuito"
              title="Descubra o formato ideal para a sua empresa"
              text="Responda 3 passos rápidos e receba uma recomendação de regime e CNAE, pronta para enviar a um contador pelo WhatsApp."
            />

            <div className="rounded-3xl border border-line shadow-[0_20px_60px_rgba(10,21,48,0.06)] overflow-hidden bg-white">
              {!diagCompleted && (
                <div className="px-6 sm:px-8 pt-6">
                  <div className="flex justify-between text-xs font-medium text-muted mb-3">
                    <span>
                      Passo {diagStep} de 3 · {diagStep === 1 ? "Seus dados" : diagStep === 2 ? "Seu negócio" : "Detalhes finais"}
                    </span>
                    <span>{Math.round((diagStep / 3) * 100)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-canvas overflow-hidden">
                    <motion.div className="h-full bg-brand rounded-full" animate={{ width: `${(diagStep / 3) * 100}%` }} transition={{ duration: 0.35 }} />
                  </div>
                </div>
              )}

              <div className="p-6 sm:p-8">
                {!diagCompleted ? (
                  <form onSubmit={handleDiagSubmit} noValidate className="space-y-6">
                    <AnimatePresence mode="wait">
                      {diagStep === 1 && (
                        <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <label className="block space-y-1.5">
                              <span className="text-sm font-medium text-ink">Nome completo</span>
                              <span className="relative block">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle" />
                                <input
                                  type="text"
                                  autoComplete="name"
                                  placeholder="Seu nome"
                                  value={diagData.name}
                                  onChange={(e) => setDiagData({ ...diagData, name: e.target.value })}
                                  className={`${inputCls} pl-10`}
                                />
                              </span>
                            </label>
                            <label className="block space-y-1.5">
                              <span className="text-sm font-medium text-ink">E-mail</span>
                              <span className="relative block">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle" />
                                <input
                                  type="email"
                                  autoComplete="email"
                                  placeholder="nome@empresa.com"
                                  value={diagData.email}
                                  onChange={(e) => setDiagData({ ...diagData, email: e.target.value })}
                                  className={`${inputCls} pl-10`}
                                />
                              </span>
                            </label>
                          </div>
                          <label className="block space-y-1.5">
                            <span className="text-sm font-medium text-ink">WhatsApp</span>
                            <span className="relative block">
                              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle" />
                              <input
                                type="tel"
                                inputMode="numeric"
                                autoComplete="tel"
                                placeholder="(11) 99999-9999"
                                value={diagData.phone}
                                onChange={(e) => setDiagData({ ...diagData, phone: formatPhone(e.target.value) })}
                                className={`${inputCls} pl-10`}
                              />
                            </span>
                            <span className="text-xs text-subtle block">Usamos só para enviar seu diagnóstico, se você quiser.</span>
                          </label>
                        </motion.div>
                      )}

                      {diagStep === 2 && (
                        <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-5">
                          <div className="grid md:grid-cols-2 gap-4">
                            <label className="block space-y-1.5">
                              <span className="text-sm font-medium text-ink">Área principal</span>
                              <span className="relative block">
                                <select
                                  value={diagData.area}
                                  onChange={(e) => setDiagData({ ...diagData, area: e.target.value })}
                                  className={`${inputCls} appearance-none pr-10 cursor-pointer`}
                                >
                                  {Object.entries(AREA_LABEL).map(([v, l]) => (
                                    <option key={v} value={v}>
                                      {l}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle" />
                              </span>
                            </label>
                            <label className="block space-y-1.5">
                              <span className="text-sm font-medium text-ink">Faturamento mensal médio</span>
                              <span className="relative block">
                                <select
                                  value={diagData.billingRange}
                                  onChange={(e) => setDiagData({ ...diagData, billingRange: e.target.value })}
                                  className={`${inputCls} appearance-none pr-10 cursor-pointer`}
                                >
                                  {["Até R$ 5.000", "R$ 5.000 a R$ 15.000", "R$ 15.000 a R$ 30.000", "R$ 30.000 a R$ 80.000", "Acima de R$ 80.000"].map((o) => (
                                    <option key={o} value={o}>
                                      {o}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle" />
                              </span>
                            </label>
                          </div>

                          <fieldset className="space-y-2">
                            <legend className="text-sm font-medium text-ink mb-1.5">Como você fatura hoje?</legend>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {STATUS_OPTIONS.map((opt) => (
                                <button
                                  type="button"
                                  key={opt.value}
                                  onClick={() => setDiagData({ ...diagData, currentStatus: opt.value })}
                                  aria-pressed={diagData.currentStatus === opt.value}
                                  className={`p-3.5 rounded-xl border text-sm font-medium transition-all ${
                                    diagData.currentStatus === opt.value ? "bg-ink text-white border-ink" : "bg-white text-ink border-line hover:border-ink/30"
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </fieldset>
                        </motion.div>
                      )}

                      {diagStep === 3 && (
                        <motion.div key="s3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-6">
                          {[
                            {
                              key: "partners" as const,
                              q: "Terá sócios no negócio?",
                              opts: [
                                ["sim", "Sim, LTDA com 2 ou mais sócios"],
                                ["nao", "Não, empresa individual (SLU)"],
                              ],
                            },
                            {
                              key: "hasHiredBefore" as const,
                              q: "Pretende contratar funcionários?",
                              opts: [
                                ["sim", "Sim, em breve"],
                                ["nao", "Não, sozinho ou com terceirizados"],
                              ],
                            },
                          ].map((g) => (
                            <fieldset key={g.key} className="space-y-2">
                              <legend className="text-sm font-medium text-ink mb-1.5">{g.q}</legend>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {g.opts.map(([v, l]) => {
                                  const checked = diagData[g.key] === v;
                                  return (
                                    <label
                                      key={v}
                                      className={`flex items-center gap-3 p-3.5 rounded-xl border text-sm cursor-pointer transition-all ${
                                        checked ? "border-brand bg-brand-50 text-ink" : "border-line hover:border-ink/30 text-ink"
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        name={g.key}
                                        value={v}
                                        checked={checked}
                                        onChange={() => setDiagData({ ...diagData, [g.key]: v })}
                                        className="h-4 w-4 accent-[#2F5BFF]"
                                      />
                                      {l}
                                    </label>
                                  );
                                })}
                              </div>
                            </fieldset>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {diagError && (
                      <p role="alert" className="text-sm text-danger bg-danger-50 rounded-xl px-4 py-3">
                        {diagError}
                      </p>
                    )}

                    <div className="flex justify-between items-center pt-6 border-t border-line">
                      {diagStep > 1 ? (
                        <button type="button" onClick={handleDiagPrev} className="text-sm font-semibold text-muted hover:text-ink px-2 py-2">
                          Voltar
                        </button>
                      ) : (
                        <span />
                      )}
                      {diagStep < 3 ? (
                        <button type="submit" className="bg-ink text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-ink-2 transition inline-flex items-center gap-2">
                          Continuar
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <button type="submit" className="bg-brand text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-brand-600 transition inline-flex items-center gap-2">
                          Gerar diagnóstico
                          <Sparkles className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </form>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                    <div className="flex gap-3 items-start">
                      <span className="h-10 w-10 rounded-xl bg-mint-50 grid place-items-center shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-mint" />
                      </span>
                      <div>
                        <h3 className="font-display text-xl font-bold">Seu diagnóstico está pronto</h3>
                        <p className="text-sm text-muted mt-0.5">
                          {diagData.name.split(" ")[0]}, analisamos suas respostas e montamos o seu planejamento inicial.
                        </p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-canvas p-5">
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-subtle">Regime recomendado</span>
                        <span className="block font-display text-lg font-bold mt-1.5">{analysis.regime}</span>
                      </div>
                      <div className="rounded-2xl bg-canvas p-5">
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-subtle">CNAE adequado</span>
                        <span className="block font-mono text-sm mt-1.5 text-ink">{analysis.idealCnae}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">Análise e próximos passos</h4>
                      <p className="text-sm text-ink/80 leading-relaxed mt-2">{analysis.detailText}</p>
                      {analysis.alertText && (
                        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 leading-relaxed">
                          <strong>Atenção:</strong> {analysis.alertText}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <a
                        href={getWhatsAppDiagnosticLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-mint text-white py-4 rounded-xl font-semibold hover:brightness-95 transition text-sm"
                      >
                        <MessageCircle className="h-5 w-5" />
                        Enviar para um contador no WhatsApp
                      </a>
                      <button
                        onClick={resetDiagnostic}
                        className="inline-flex items-center justify-center text-sm font-semibold text-muted hover:text-ink py-4 px-6 rounded-xl border border-line hover:bg-canvas transition"
                      >
                        Refazer
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* DIFERENCIAIS (bento) --------------------------------------------- */}
        <section className="py-20 sm:py-28 bg-canvas" id="diferenciais">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <SectionHead
              eyebrow="Por que a Falvella"
              title="Esqueça o escritório de contabilidade tradicional"
              text="Nada de ir a escritório, assinar papel ou esperar dias por resposta. Tudo online, rápido e com inteligência fiscal focada no digital."
            />

            <div className="grid md:grid-cols-6 gap-4">
              <div className="md:col-span-4 rounded-3xl bg-ink text-white p-8 sm:p-10 relative overflow-hidden">
                <div className="absolute -right-20 -bottom-20 w-72 h-72 rounded-full bg-brand/40 blur-3xl" />
                <Zap className="h-7 w-7 text-lime" />
                <h3 className="font-display text-2xl sm:text-3xl font-bold mt-6 max-w-md">Foco total no mercado digital</h3>
                <p className="text-white/65 mt-3 max-w-lg leading-relaxed">
                  Entendemos split de notas, retenção de plataformas como Kiwify, Hotmart e Eduzz, coprodução e exportação de software.
                </p>
              </div>
              <div className="md:col-span-2 rounded-3xl bg-white border border-line p-8">
                <MessageCircle className="h-7 w-7 text-brand" />
                <h3 className="font-display text-xl font-bold mt-6">Gente de verdade</h3>
                <p className="text-muted mt-2 text-sm leading-relaxed">Você fala com contadores especialistas pelo WhatsApp e recebe respostas em minutos.</p>
              </div>
              <div className="md:col-span-2 rounded-3xl bg-white border border-line p-8">
                <Smartphone className="h-7 w-7 text-brand" />
                <h3 className="font-display text-xl font-bold mt-6">100% online</h3>
                <p className="text-muted mt-2 text-sm leading-relaxed">Relatórios, folha e documentos assinados digitalmente, direto do celular.</p>
              </div>
              <div className="md:col-span-2 rounded-3xl bg-white border border-line p-8">
                <Target className="h-7 w-7 text-brand" />
                <h3 className="font-display text-xl font-bold mt-6">Planejamento preciso</h3>
                <p className="text-muted mt-2 text-sm leading-relaxed">Combinamos CNAEs e controlamos o Fator-R todo mês para a menor tributação legal.</p>
              </div>
              <div className="md:col-span-2 rounded-3xl bg-lime p-8">
                <Globe2 className="h-7 w-7 text-ink" />
                <h3 className="font-display text-xl font-bold mt-6 text-ink">Todo o Brasil</h3>
                <p className="text-ink/70 mt-2 text-sm leading-relaxed">Abrimos e regularizamos empresas em qualquer cidade, com o mesmo padrão.</p>
              </div>
            </div>
          </div>
        </section>

        {/* QUEM SOMOS -------------------------------------------------------- */}
        <section className="py-20 sm:py-28" id="quem-somos">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <Eyebrow>Quem somos</Eyebrow>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] mt-4">
                Contabilidade técnica, na velocidade do digital
              </h2>
              <div className="space-y-4 text-muted leading-relaxed mt-6">
                <p>
                  A Falvella nasceu quando percebemos que produtores de conteúdo, afiliados, programadores e agências cresciam rápido, enquanto a contabilidade tradicional continuava presa ao papel e sem entender conceitos como split de comissão.
                </p>
                <p>
                  Criamos um escritório que domina a contabilidade fiscal, societária e trabalhista, mas opera com ferramentas digitais e atendimento ágil.
                </p>
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-line p-8 sm:p-10 bg-gradient-to-br from-brand-50 to-white">
                <Quote className="h-8 w-8 text-brand" />
                <p className="font-display text-2xl sm:text-3xl font-semibold leading-snug mt-5 text-ink">
                  Nosso trabalho é fazer você pagar só o imposto que deve, e ter tempo para cuidar do que importa: o seu negócio.
                </p>
                <div className="flex items-center gap-3 mt-8 pt-6 border-t border-line">
                  <span className="h-11 w-11 rounded-full bg-ink text-white grid place-items-center font-display font-bold">F</span>
                  <div>
                    <div className="font-semibold text-sm">Equipe Falvella</div>
                    <div className="text-xs text-subtle">Contadores registrados no CRC-SP</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DEPOIMENTOS ------------------------------------------------------- */}
        <section className="py-20 sm:py-28 bg-canvas" id="testimonials">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <SectionHead eyebrow="Depoimentos" title="Quem já confia na Falvella" />
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  t: "A Falvella salvou meu lançamento. A divisão de impostos entre coprodutores era uma confusão na contabilidade anterior. Eles estruturaram o split de notas em poucos dias.",
                  n: "Rodrigo Silva",
                  r: "Infoprodutor",
                },
                {
                  t: "O atendimento pelo WhatsApp é outro nível. Eu mando uma mensagem e meu contador responde com clareza em poucos minutos, sem fila e sem robô.",
                  n: "Camila Mattos",
                  r: "Dona de agência de tráfego",
                },
                {
                  t: "Finalmente contadores que entendem de faturamento internacional. Trabalho com software para o exterior e eles organizaram toda a minha isenção.",
                  n: "Lucas Ferreira",
                  r: "Desenvolvedor",
                },
              ].map((d) => (
                <figure key={d.n} className="bg-white rounded-3xl border border-line p-7 flex flex-col justify-between gap-8">
                  <div>
                    <div className="flex gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-ink/85 leading-relaxed mt-4">“{d.t}”</blockquote>
                  </div>
                  <figcaption className="flex items-center gap-3">
                    <span className="h-11 w-11 rounded-full bg-brand-50 text-brand grid place-items-center font-semibold text-sm">
                      {d.n
                        .split(" ")
                        .map((p) => p[0])
                        .join("")}
                    </span>
                    <div>
                      <div className="font-semibold text-sm">{d.n}</div>
                      <div className="text-xs text-subtle">{d.r}</div>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ --------------------------------------------------------------- */}
        <section className="py-20 sm:py-28" id="faq">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <Eyebrow>Dúvidas</Eyebrow>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] mt-4">Perguntas frequentes</h2>
              <p className="text-muted mt-4">Não achou sua dúvida? Pergunte ao nosso consultor IA ou chame no WhatsApp.</p>
              <button
                onClick={() => setIsChatOpen(true)}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-600"
              >
                <Sparkles className="h-4 w-4" />
                Perguntar ao Consultor IA
              </button>
            </div>
            <div className="lg:col-span-8 divide-y divide-line border-y border-line">
              {[
                ["Vocês atendem clientes de qualquer cidade do Brasil?", "Sim. Como nossos processos são 100% digitais, abrimos CNPJ e regularizamos empresas em qualquer cidade do Brasil, com o mesmo padrão de atendimento."],
                ["Já tenho empresa em outra contabilidade. Como migro?", "A migração é simples. Nós cuidamos de toda a transição: comunicamos a saída do escritório antigo, importamos seus dados e checamos pendências fiscais. Você não precisa fazer nada."],
                ["Atuo no marketing digital. Posso começar como MEI?", "Na maioria dos casos, não. Gestão de tráfego, produção de conteúdo, coprodução e agenciamento são atividades de publicidade, que não podem ser MEI. Começar como ME no Simples Nacional evita multas e autuações."],
                ["O que é o Fator-R e como ele reduz o imposto de 15,5% para 6%?", "É uma regra do Simples Nacional: se pró-labore e salários somarem 28% ou mais do faturamento, atividades como TI e gestão de tráfego passam do Anexo V (15,5%) para o Anexo III (a partir de 6%). Controlamos essa proporção todo mês."],
                ["Como funciona o suporte pelo WhatsApp?", "Você entra em um grupo exclusivo com a nossa equipe e fala direto com o contador responsável pela sua empresa em horário comercial. Sem bots e sem fila."],
              ].map(([q, a]) => (
                <details key={q} className="group py-2">
                  <summary className="flex justify-between items-center gap-6 py-4 cursor-pointer list-none font-display text-lg font-semibold text-ink [&::-webkit-details-marker]:hidden">
                    {q}
                    <span className="h-8 w-8 rounded-full border border-line grid place-items-center shrink-0 transition group-open:rotate-45 group-open:bg-ink group-open:border-ink group-open:text-white">
                      <span className="text-xl leading-none -mt-0.5">+</span>
                    </span>
                  </summary>
                  <p className="text-muted leading-relaxed pb-5 pr-12">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL --------------------------------------------------------- */}
        <section className="px-3 sm:px-6 pb-6">
          <div className="max-w-7xl mx-auto rounded-[2rem] bg-ink text-white relative overflow-hidden px-6 sm:px-12 py-16 sm:py-24 text-center">
            <div className="absolute inset-0 bg-grid pointer-events-none" />
            <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-brand/40 blur-[120px]" />
            <div className="relative max-w-3xl mx-auto">
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.02]">
                Pague menos impostos, <span className="text-gradient">dentro da lei</span>.
              </h2>
              <p className="text-white/65 text-lg mt-5 max-w-xl mx-auto">
                Comece hoje o seu planejamento contábil com quem entende o mercado digital. A primeira conversa é gratuita.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-9">
                <a
                  href={wa("Olá! Gostaria de falar com um contador especialista da Falvella Contabilidade para planejar meus impostos.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-lime text-ink px-8 py-4 rounded-xl font-semibold hover:brightness-95 transition"
                >
                  <MessageCircle className="h-5 w-5" />
                  Conversar no WhatsApp
                </a>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="inline-flex items-center justify-center gap-2 border border-white/20 px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition cursor-pointer"
                >
                  <Sparkles className="h-5 w-5 text-lime" />
                  Falar com o Consultor IA
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER ------------------------------------------------------------ */}
      <footer className="max-w-7xl mx-auto w-full px-5 sm:px-8 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="h-9 w-9 rounded-xl bg-brand text-white grid place-items-center font-display font-extrabold text-lg">F</span>
              <span className="font-display text-lg font-bold">
                Falvella<span className="text-brand">.</span>
              </span>
            </div>
            <p className="text-sm text-muted mt-4 max-w-sm leading-relaxed">
              Contabilidade digital, humanizada e ágil para infoprodutores, afiliados, agências e prestadores de serviço.
            </p>
            <div className="inline-flex items-center gap-2 mt-5 text-xs font-medium text-muted bg-canvas rounded-lg px-3 py-2">
              <ShieldCheck className="h-4 w-4 text-mint" />
              Empresa registrada no CRC-SP
            </div>
          </div>
          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-subtle mb-4">Serviços</h4>
            <ul className="space-y-2.5 text-sm text-muted">
              <li><button onClick={() => scrollToSection("diagnostic")} className="hover:text-ink">Abertura de empresa (CNPJ)</button></li>
              <li><button onClick={() => scrollToSection("simulator")} className="hover:text-ink">Planejamento tributário</button></li>
              <li><button onClick={() => scrollToSection("faq")} className="hover:text-ink">Otimização do Fator-R</button></li>
              <li><button onClick={() => scrollToSection("diagnostic")} className="hover:text-ink">Migração de contabilidade</button></li>
            </ul>
          </div>
          <div className="lg:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-subtle mb-4">Contato</h4>
            <ul className="space-y-2.5 text-sm text-muted">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-subtle" />contato@falvella.com.br</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-subtle" />(11) 99999-9999</li>
              <li className="flex items-center gap-2"><Building2 className="h-4 w-4 text-subtle" />Atendimento nacional 100% online</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-line flex flex-col sm:flex-row justify-between gap-3 text-xs text-subtle">
          <p>© 2026 Falvella Contabilidade Digital. CNPJ 00.000.000/0001-00</p>
          <p>Simulações são estimativas com base na legislação vigente do Simples Nacional e do IRPF.</p>
        </div>
      </footer>

      {/* WHATSAPP FLUTUANTE ------------------------------------------------- */}
      <a
        href={wa("Olá! Gostaria de falar com um contador da Falvella.")}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-30 bg-[#25D366] text-white h-14 w-14 rounded-full shadow-[0_12px_30px_rgba(37,211,102,0.45)] hover:scale-105 transition-transform grid place-items-center"
        aria-label="Falar no WhatsApp"
      >
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.02c-.24.68-1.42 1.3-1.96 1.35-.5.05-.98.24-3.3-.69-2.79-1.1-4.56-3.95-4.7-4.13-.13-.18-1.12-1.49-1.12-2.85 0-1.35.71-2.02.96-2.3.25-.27.55-.34.73-.34h.52c.17 0 .4-.06.62.48.24.56.8 1.93.87 2.07.07.14.11.3.02.48-.1.18-.14.3-.28.46l-.41.48c-.14.14-.28.29-.12.57.16.27.72 1.18 1.54 1.92 1.06.94 1.95 1.24 2.23 1.38.28.14.44.11.6-.07.17-.18.7-.81.88-1.09.18-.28.37-.23.62-.14.25.09 1.6.76 1.88.9.27.13.46.2.52.32.07.12.07.68-.17 1.36Z" />
        </svg>
      </a>

      {/* CHAT IA ------------------------------------------------------------ */}
      <AnimatePresence>
        {isChatOpen && (
          <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Consultor virtual">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col"
            >
              <div className="px-5 py-4 flex items-center justify-between border-b border-line shrink-0">
                <div className="flex items-center gap-3">
                  <span className="h-10 w-10 rounded-xl bg-ink grid place-items-center">
                    <Sparkles className="h-5 w-5 text-lime" />
                  </span>
                  <div>
                    <h3 className="font-display font-bold">Consultor Falvella</h3>
                    <span className="text-xs text-mint flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                      Online · Inteligência artificial
                    </span>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="p-2 text-muted hover:text-ink rounded-lg hover:bg-canvas" aria-label="Fechar chat">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-grow p-5 overflow-y-auto space-y-3 bg-canvas">
                {chatMessages.map((msg, index) => {
                  const isAssistant = msg.role === "assistant";
                  return (
                    <div key={index} className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          isAssistant ? "bg-white text-ink border border-line rounded-tl-md" : "bg-brand text-white rounded-tr-md"
                        }`}
                      >
                        {msg.text.split("\n").map((line, lIdx) => (
                          <p key={lIdx} className={line.trim() === "" ? "h-2" : "mb-1.5 last:mb-0"}>
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {chatMessages.length === 1 && !chatLoading && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {["O que é o Fator-R?", "Coprodutor pode ser MEI?", "Qual CNAE uso para infoprodutor?", "Como funciona o split fiscal?"].map((q) => (
                      <button
                        key={q}
                        onClick={() => askAssistant(q)}
                        className="bg-white border border-line hover:border-brand text-ink px-3 py-1.5 rounded-full text-xs font-medium transition"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-line rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1.5">
                      {[0, 150, 300].map((d) => (
                        <span key={d} className="h-2 w-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-line bg-white flex gap-2 shrink-0">
                <input
                  type="text"
                  placeholder="Pergunte sobre CNAE, impostos, Fator-R..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className={inputCls}
                  disabled={chatLoading}
                  aria-label="Sua pergunta"
                />
                <button
                  type="submit"
                  disabled={chatLoading || !chatInput.trim()}
                  className="bg-ink text-white h-12 w-12 rounded-xl hover:bg-ink-2 transition disabled:opacity-40 grid place-items-center shrink-0"
                  aria-label="Enviar"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
              <p className="px-4 pb-4 text-[11px] text-subtle text-center bg-white">
                Respostas geradas por IA com base no Simples Nacional. Para cálculos oficiais, fale com a nossa equipe.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
