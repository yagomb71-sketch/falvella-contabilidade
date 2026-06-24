import React, { useState, useEffect, useRef } from "react";
import { 
  Briefcase, 
  Calculator, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  MessageSquare, 
  HelpCircle, 
  Send, 
  ArrowRight, 
  ChevronRight, 
  Menu, 
  X, 
  FileText, 
  Users, 
  Award, 
  ShieldCheck, 
  Scale, 
  DollarSign, 
  Building, 
  PhoneCall, 
  ArrowUpRight, 
  Zap,
  Info,
  ChevronDown,
  User,
  Mail,
  Phone,
  BarChart3,
  Calendar,
  ThumbsUp,
  MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types
interface Message {
  role: "user" | "assistant";
  text: string;
}

interface ProfessionProfile {
  id: string;
  title: string;
  icon: string;
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
    icon: "hub",
    cnae: "7319-0/02 (Promoção de Vendas)",
    description: "Profissionais que vendem produtos de terceiros através de links comissionados em plataformas como Hotmart, Kiwify e Monetizze.",
    challenges: "Gerenciar comissões fragmentadas, lidar com altos impostos de pessoa física (até 27.5% no carnê-leão) e emitir centenas de notas fiscais de forma legal.",
    solution: "Constituição de CNPJ no Simples Nacional com enquadramento no CNAE correto de Promoção de Vendas. Automatização da emissão de notas fiscais de serviço (NFS-e) integradas às plataformas.",
    typicalBilling: 12000,
    highlight: "Imposto inicial de apenas 6% no Simples Nacional!"
  },
  {
    id: "infoprodutor",
    title: "Infoprodutores",
    icon: "school",
    cnae: "8599-6/04 (Treinamento e Desenvolvimento) & 5811-5/00 (Edição de Livros)",
    description: "Criadores de cursos online, mentorias, e-books e áreas de membros exclusivas.",
    challenges: "Classificar corretamente as vendas (e-book tem imunidade de ICMS/PIS/COFINS, enquanto curso online é serviço). Alta carga tributária em lançamentos de grande volume.",
    solution: "Planejamento tributário híbrido, separando o infoproduto em e-book (livro digital com isenção fiscal) e serviço de mentoria/treinamento, reduzindo drasticamente o imposto consolidado.",
    typicalBilling: 45000,
    highlight: "Redução de até 60% dos impostos aplicando imunidade de e-books!"
  },
  {
    id: "coprodutor",
    title: "Coprodutores",
    icon: "groups",
    cnae: "7311-9/00 (Agência de Publicidade) & 8211-3/00 (Serviços de Escritório)",
    description: "Parceiros estratégicos de bastidores que cuidam de tráfego, design, copy ou estratégia de lançamentos.",
    challenges: "Divisão segura do faturamento diretamente na plataforma (split de notas fiscais) sem bitributação e com contratos que resguardem a responsabilidade jurídica.",
    solution: "Criação de CNPJ com contratos de coprodução estruturados. Configuração do split de notas fiscais automático para evitar que um parceiro pague imposto sobre a parte do outro.",
    typicalBilling: 25000,
    highlight: "Evite bitributação estruturando o split de notas fiscales legalmente!"
  },
  {
    id: "gestor_trafego",
    title: "Gestores de Tráfego",
    icon: "ads_click",
    cnae: "7319-0/04 (Assessoria em Mídia / Portais de Conteúdo)",
    description: "Profissionais dedicados a otimizar anúncios pagos no Facebook Ads, Google Ads e TikTok Ads.",
    challenges: "O MEI não é permitido para esta atividade por ser classificada como publicidade. Risco de faturar no CPF e cair na malha fina por depósitos de clientes para verba de anúncios.",
    solution: "Abertura de uma Sociedade Limitada Unipessoal (SLU) no Simples Nacional. Assessoria para segregação correta entre o serviço de gestão e a verba de anúncios enviada pelos clientes.",
    typicalBilling: 15000,
    highlight: "Atividade impedida ao MEI. Evite multas atuando como CNPJ ME desde o início!"
  },
  {
    id: "social_media",
    title: "Social Media",
    icon: "share",
    cnae: "7311-9/00 (Agências de Publicidade)",
    description: "Criadores de conteúdo e estrategistas de posicionamento e engajamento para marcas nas redes sociais.",
    challenges: "Formalização para fechar contratos com grandes marcas e empresas que exigem nota fiscal de publicidade.",
    solution: "CNPJ ágil e enquadramento tributário para pagar a menor alíquota. Emissão rápida de notas fiscais e suporte para formalização de contratos de prestação de serviços recorrentes (fee mensal).",
    typicalBilling: 8000,
    highlight: "Feche grandes contratos com marcas nacionais emitindo nota fiscal corporativa!"
  },
  {
    id: "desenvolvedor",
    title: "Desenvolvedores & TI",
    icon: "code",
    cnae: "6202-3/00 (Desenvolvimento de Software Sob Encomenda)",
    description: "Programadores, engenheiros de software e especialistas de tecnologia que prestam serviço para o Brasil ou exterior.",
    challenges: "Fator-R do Simples Nacional que pode elevar o imposto de 6% para 15.5% se não houver um planejamento de folha/pró-labore de 28% do faturamento.",
    solution: "Gestão inteligente do Fator-R mensalmente, garantindo a tributação mínima de 6%. Isenção de PIS, COFINS e ISS para quem exporta software e recebe do exterior.",
    typicalBilling: 30000,
    highlight: "Economize recebendo do exterior com isenção total de impostos federais!"
  }
];

export default function App() {
  // Navigation State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Custom Interactive Profession Selection
  const [activeProfession, setActiveProfession] = useState<ProfessionProfile>(PROFESSIONS[0]);

  // Tax Simulator State
  const [simProfession, setSimProfession] = useState<string>("afiliado");
  const [simMonthlyRevenue, setSimMonthlyRevenue] = useState<number>(15000);

  // Diagnostic Wizard State
  const [diagStep, setDiagStep] = useState<number>(1);
  const [diagData, setDiagData] = useState({
    name: "",
    email: "",
    phone: "",
    area: "infoprodutos",
    billingRange: "10k-30k",
    currentStatus: "CPF",
    partners: "nao",
    hasHiredBefore: "nao"
  });
  const [diagCompleted, setDiagCompleted] = useState<boolean>(false);

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Olá! Sou o assistente de inteligência artificial da Falvella Contabilidade. Como posso te ajudar hoje com as dúvidas fiscais ou abertura de CNPJ para o seu negócio digital?"
    }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, chatLoading]);

  // Sync simulator profession when clicking on the profession selector
  const selectProfessionProfile = (prof: ProfessionProfile) => {
    setActiveProfession(prof);
    setSimProfession(prof.id);
    setSimMonthlyRevenue(prof.typicalBilling);
    // Alert or scroll to simulator
  };

  // Tax Calculations
  const calculateTax = () => {
    const rev = simMonthlyRevenue;
    
    // 1. Pessoa Física (CPF - Carnê Leão + INSS)
    // INSS is 20% capped at around R$ 1.500,00 per month
    const inssCPF = Math.min(rev * 0.20, 1502.74);
    
    // IRPF Progressivo (approximation on taxable income after INSS)
    const baseIRPF = Math.max(rev - inssCPF, 0);
    let irpf = 0;
    if (baseIRPF <= 2259.20) {
      irpf = 0;
    } else if (baseIRPF <= 2826.65) {
      irpf = (baseIRPF * 0.075) - 169.44;
    } else if (baseIRPF <= 3751.05) {
      irpf = (baseIRPF * 0.15) - 381.44;
    } else if (baseIRPF <= 4664.68) {
      irpf = (baseIRPF * 0.225) - 662.77;
    } else {
      irpf = (baseIRPF * 0.275) - 896.00;
    }
    const totalCPF = inssCPF + irpf;
    const rateCPF = rev > 0 ? (totalCPF / rev) * 100 : 0;

    // 2. Simples Nacional (CNPJ ME)
    // Generally begins at 6% up to R$ 15.000/month (R$ 180.000/year)
    // After that, progressive brackets apply
    let rateSimples = 6.0;
    const annualProj = rev * 12;
    if (annualProj <= 180000) {
      rateSimples = 6.0;
    } else if (annualProj <= 360000) {
      // Bracket 2: effective tax usually is ~8.2% to 9.2%
      rateSimples = 8.5;
    } else if (annualProj <= 720000) {
      // Bracket 3: effective tax is ~10.2% to 11.2%
      rateSimples = 10.5;
    } else if (annualProj <= 1800000) {
      rateSimples = 12.0;
    } else {
      rateSimples = 14.5;
    }

    // Adjust for Fator-R (software/publicidade) which is automatically handled by Falvella
    // If not optimized, it would be 15.5% (Anexo V). With Falvella, it is kept at Anexo III (starting at 6%).
    // We assume optimal planning is configured, so we show the low Simples rate, but we can display Fator-R info!
    const totalSimples = rev * (rateSimples / 100);

    // 3. Lucro Presumido
    // Federal taxes 11.33% + Municipal ISS 2.0% - 5.0% (Average 3.0%)
    // Total is ~14.33% to 15.33%
    const ratePresumido = 14.33;
    const totalPresumido = rev * (ratePresumido / 100);

    const monthlySavings = totalCPF - totalSimples;
    const annualSavings = monthlySavings * 12;

    return {
      cpf: { total: totalCPF, rate: rateCPF },
      simples: { total: totalSimples, rate: rateSimples },
      presumido: { total: totalPresumido, rate: ratePresumido },
      savingsMonthly: Math.max(monthlySavings, 0),
      savingsAnnual: Math.max(annualSavings, 0)
    };
  };

  const simResult = calculateTax();

  // Send Message to Gemini server-side endpoint
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsgText = chatInput;
    setChatMessages(prev => [...prev, { role: "user", text: userMsgText }]);
    setChatInput("");
    setChatLoading(true);

    try {
      // Create history subset to send as context (limit to last 6 messages for token conservation)
      const formattedHistory = chatMessages.slice(-6).map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsgText,
          history: formattedHistory
        })
      });

      const data = await res.json();
      if (res.ok) {
        setChatMessages(prev => [...prev, { role: "assistant", text: data.text }]);
      } else {
        throw new Error(data.error || "Erro ao consultar a contabilidade virtual.");
      }
    } catch (err: any) {
      console.error(err);
      setChatMessages(prev => [
        ...prev, 
        { 
          role: "assistant", 
          text: "Ops! Tive um pequeno problema para processar a sua resposta agora. Se preferir, você pode falar diretamente com nossos contadores humanos especialistas clicando no botão do WhatsApp!" 
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Quick Chat Suggestion Trigger
  const handleQuickQuestion = (question: string) => {
    setChatInput(question);
    // Auto submit in next tick
    setTimeout(() => {
      // Find the button and click it, or call handleSendMessage directly
      setChatInput(question);
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      // Use state variable directly
      setChatLoading(true);
      setChatMessages(prev => [...prev, { role: "user", text: question }]);
      setChatInput("");
      
      // Fetch request
      const formattedHistory = chatMessages.slice(-6).map(m => ({
        role: m.role,
        text: m.text
      }));

      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          history: formattedHistory
        })
      })
      .then(res => res.json())
      .then(data => {
        setChatMessages(prev => [...prev, { role: "assistant", text: data.text || "Desculpe, tente novamente." }]);
      })
      .catch(() => {
        setChatMessages(prev => [...prev, { role: "assistant", text: "Não consegui responder agora. Que tal falar conosco pelo WhatsApp?" }]);
      })
      .finally(() => {
        setChatLoading(false);
      });
    }, 100);
  };

  // Diagnostic Wizard handlers
  const handleDiagNext = () => {
    if (diagStep === 1) {
      if (!diagData.name || !diagData.email || !diagData.phone) {
        alert("Por favor, preencha todos os campos para prosseguirmos com seu diagnóstico contábil gratuito.");
        return;
      }
    }
    setDiagStep(prev => prev + 1);
  };

  const handleDiagPrev = () => {
    setDiagStep(prev => Math.max(prev - 1, 1));
  };

  const handleDiagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDiagCompleted(true);
  };

  const resetDiagnostic = () => {
    setDiagStep(1);
    setDiagCompleted(false);
    setDiagData({
      name: "",
      email: "",
      phone: "",
      area: "infoprodutos",
      billingRange: "10k-30k",
      currentStatus: "CPF",
      partners: "nao",
      hasHiredBefore: "nao"
    });
  };

  // Generate customized CNAE and Plan based on diagnostic data
  const getDiagnosticAnalysis = () => {
    const area = diagData.area;
    const billing = diagData.billingRange;
    const status = diagData.currentStatus;
    
    let idealCnae = "7319-0/02 (Promoção de Vendas)";
    let regime = "Simples Nacional (CNPJ ME)";
    let detailText = "";
    let alertText = "";

    if (area === "afiliado") {
      idealCnae = "7319-0/02 - Promoção de Vendas";
      detailText = "Afiliados devem evitar o MEI, pois a atividade de intermediação e promoção não é contemplada no MEI. O Simples Nacional oferece a melhor tributação inicial (6%) no Anexo III.";
    } else if (area === "infoprodutos") {
      idealCnae = "8599-6/04 - Treinamentos & 5811-5/00 - Edição de Livros (E-books)";
      detailText = "Você pode economizar impostos dividindo seu produto em venda de livros virtuais (isento de impostos federais de comércio) e mentoria. Excelente potencial de redução fiscal!";
    } else if (area === "gestao_trafego") {
      idealCnae = "7319-0/04 - Assessoria em Mídia";
      detailText = "Atenção: A atividade de Gestão de Tráfego é considerada publicidade e é proibida no MEI. Atuar no CPF pode gerar uma notificação fiscal de até 27,5% de imposto. É urgente abrir um CNPJ ME.";
    } else if (area === "coprodutor") {
      idealCnae = "7311-9/00 - Agências de Publicidade";
      detailText = "O coprodutor necessita de um contrato de parceria robusto e um split fiscal configurado para emitir notas fiscais automáticas sem duplicar impostos com o produtor principal.";
    } else if (area === "desenvolvedor") {
      idealCnae = "6202-3/00 - Desenvolvimento de Software Sob Encomenda";
      detailText = "Sua tributação padrão seria de 15.5% (Anexo V). Na Falvella, implementamos o Fator-R (pró-labore estratégico de 28%), permitindo que você pague apenas 6% de imposto!";
    } else {
      idealCnae = "8211-3/00 - Serviços combinados de escritório e apoio administrativo";
      detailText = "Prestadores de serviços digitais em geral podem atuar no Simples Nacional com impostos otimizados. Cuidamos de todo o faturamento mensal.";
    }

    if (status === "MEI") {
      alertText = "Como você já é MEI, é importante analisar se seu faturamento não ultrapassará o limite anual de R$ 81.000 ou se sua atividade de publicidade/TI não te exclui do MEI por lei. Nós cuidamos da transição sem dor de cabeça!";
    } else if (status === "CPF") {
      alertText = "Atuar como Pessoa Física (CPF) no mercado digital é o maior erro tributário. Você está exposto a alíquotas de até 27.5% de Imposto de Renda mais 20% de INSS autônomo. Mudar para CNPJ trará economia imediata.";
    }

    return { idealCnae, regime, detailText, alertText };
  };

  const analysis = getDiagnosticAnalysis();

  // Create WhatsApp prefilled link from diagnostic data
  const getWhatsAppDiagnosticLink = () => {
    const text = `Olá Falvella Contabilidade! Fiz o Diagnóstico Gratuito no site e gostaria de falar com um contador especializado. 

*Meus dados:*
- *Nome:* ${diagData.name}
- *Área Digital:* ${diagData.area.toUpperCase()}
- *Faturamento Estimado:* ${diagData.billingRange}
- *Status Atual:* ${diagData.currentStatus}
- *Sociedade:* ${diagData.partners === 'sim' ? 'Sim (com sócios)' : 'Não (Individual)'}

*Diagnóstico Sugerido:*
- *Regime Indicado:* ${analysis.regime}
- *CNAE Recomendado:* ${analysis.idealCnae}

Gostaria de agendar uma conversa para abrir/migrar minha empresa!`;

    return `https://wa.me/5511999999999?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-surface-bright text-on-background font-sans selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
      
      {/* Dynamic Header */}
      <header className="fixed top-0 w-full z-40 bg-surface-bright/85 backdrop-blur-md border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20" id="header-nav">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection("hero")}>
            <div className="bg-primary text-white p-2.5 rounded-xl flex items-center justify-center">
              <Building className="h-6 w-6" />
            </div>
            <div>
              <span className="font-display text-lg sm:text-xl font-extrabold text-primary block leading-none">
                Falvella
              </span>
              <span className="text-[10px] font-mono tracking-widest text-slate-gray uppercase block mt-1">
                Contabilidade Digital
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-secondary">
            <button onClick={() => scrollToSection("professions")} className="hover:text-primary transition-colors cursor-pointer">
              Atuação
            </button>
            <button onClick={() => scrollToSection("simulator")} className="hover:text-primary transition-colors cursor-pointer">
              Simulador Tributário
            </button>
            <button onClick={() => scrollToSection("diagnostic")} className="hover:text-primary transition-colors cursor-pointer">
              Diagnóstico Gratuito
            </button>
            <button onClick={() => scrollToSection("diferenciais")} className="hover:text-primary transition-colors cursor-pointer">
              Por que a Falvella?
            </button>
            <button onClick={() => scrollToSection("faq")} className="hover:text-primary transition-colors cursor-pointer">
              Perguntas Frequentes
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-4">
            <button 
              onClick={() => setIsChatOpen(true)}
              className="inline-flex items-center gap-2 text-primary hover:text-primary-light font-semibold text-sm cursor-pointer"
            >
              <Sparkles className="h-4 w-4 animate-pulse text-primary-light" />
              Consultor IA
            </button>
            <a 
              href="https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20falar%20com%20um%20contador%20especialista%20da%20Falvella%20Contabilidade." 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary-light transition-all text-sm shadow-sm"
              id="btn-whatsapp-header"
            >
              Falar no WhatsApp
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="lg:hidden p-2 text-primary rounded-lg hover:bg-ice-blue transition-colors focus:outline-none"
            id="mobile-menu-trigger"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-b border-surface-border"
            >
              <div className="px-4 pt-2 pb-6 space-y-3">
                <button 
                  onClick={() => scrollToSection("professions")} 
                  className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-secondary hover:bg-ice-blue hover:text-primary"
                >
                  Áreas de Atuação
                </button>
                <button 
                  onClick={() => scrollToSection("simulator")} 
                  className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-secondary hover:bg-ice-blue hover:text-primary"
                >
                  Simulador Tributário
                </button>
                <button 
                  onClick={() => scrollToSection("diagnostic")} 
                  className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-secondary hover:bg-ice-blue hover:text-primary"
                >
                  Diagnóstico Gratuito
                </button>
                <button 
                  onClick={() => scrollToSection("diferenciais")} 
                  className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-secondary hover:bg-ice-blue hover:text-primary"
                >
                  Diferenciais
                </button>
                <button 
                  onClick={() => scrollToSection("faq")} 
                  className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-secondary hover:bg-ice-blue hover:text-primary"
                >
                  Perguntas Frequentes
                </button>
                
                <div className="pt-4 border-t border-surface-border flex flex-col gap-3">
                  <button 
                    onClick={() => { setIsChatOpen(true); setIsMobileMenuOpen(false); }}
                    className="flex items-center justify-center gap-2 text-primary font-bold bg-ice-blue py-3 rounded-xl"
                  >
                    <Sparkles className="h-4 w-4 text-primary" />
                    Perguntar ao Consultor IA
                  </button>
                  <a 
                    href="https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20falar%20com%20um%20contador%20especialista%20da%20Falvella%20Contabilidade."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-bold"
                  >
                    Falar no WhatsApp
                    <PhoneCall className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Container */}
      <main className="flex-grow pt-20">

        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden bg-gradient-to-b from-ice-blue/45 to-white" id="hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 z-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-surface-border shadow-xs">
                <span className="flex h-2 w-2 rounded-full bg-success-teal animate-ping"></span>
                <span className="text-xs font-semibold text-primary">Contabilidade 100% Digital e Humanizada</span>
              </div>
              
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tight leading-tight">
                Contabilidade especializada para <span className="text-primary-light underline decoration-success-teal decoration-4">empresas digitais</span> e prestadores de serviços
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-secondary max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
                Descomplique a burocracia fiscal e reduza seus impostos legalmente. Cuidamos de todo o processo contábil para você focar no faturamento do seu negócio.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => scrollToSection("simulator")}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-light transition-all shadow-md hover:-translate-y-0.5 cursor-pointer"
                  id="btn-simulate-hero"
                >
                  <Calculator className="h-5 w-5" />
                  Simular Economia Tributária
                </button>
                <button 
                  onClick={() => scrollToSection("diagnostic")}
                  className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-8 py-4 rounded-xl font-bold hover:bg-ice-blue transition-all cursor-pointer"
                >
                  <FileText className="h-5 w-5" />
                  Diagnóstico Gratuito
                </button>
              </div>

              {/* Dynamic Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-surface-border">
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl font-extrabold text-primary font-display">100%</span>
                  <span className="text-xs text-slate-gray">Atendimento Online</span>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl font-extrabold text-primary font-display">Suporte</span>
                  <span className="text-xs text-slate-gray">via WhatsApp</span>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl font-extrabold text-primary font-display">+90%</span>
                  <span className="text-xs text-slate-gray">Redução Fiscal</span>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl font-extrabold text-primary font-display">Zero</span>
                  <span className="text-xs text-slate-gray">Multas com o Fisco</span>
                </div>
              </div>
            </div>

            {/* Right Graphic Panel */}
            <div className="lg:col-span-5 relative mt-8 lg:mt-0">
              <div className="absolute -top-12 -right-12 w-72 h-72 rounded-full bg-primary-light/10 blur-3xl -z-10" />
              <div className="absolute -bottom-12 -left-12 w-72 h-72 rounded-full bg-success-teal/5 blur-3xl -z-10" />
              
              <div className="relative z-10 glass-card p-2 rounded-2xl shadow-xl overflow-hidden animate-float">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDskS6roZ-mmiVUoVvQmITnMiEcemQDYSjBs9KX4IVqr3CFJiB1iwBvI-1olraVvTploZSkfjFLNBMGSSsM_vFdxCh5DJ38qEWgXiJ7jEMPnA27PYyq9sUV_bJmzONc7tH4mMdJiaWGiznM01-CigG5y-azQVW9q8rNzqK2oaPCy6khLhkK9yyqZXwy_xri8di2w-Zu4qCRw1plCaLbxIYBdYw0i8EfL5BiSdQpBZR0e6MrwusrMdt9BaKf4d5QS-8QldgqwcB0xdP6" 
                  alt="Empreendedora Digital em escritório moderno" 
                  className="w-full h-[400px] object-cover rounded-xl shadow-inner"
                  referrerPolicy="no-referrer"
                />
                
                {/* Float Card Inside Hero */}
                <div className="absolute bottom-6 right-6 bg-white p-4 rounded-xl shadow-lg border border-surface-border flex items-center gap-3">
                  <div className="bg-success-teal text-white p-2.5 rounded-lg">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-secondary block">Economia Tributária</span>
                    <span className="font-display font-extrabold text-primary">Simples Nacional a 6%</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Statistics Bar */}
        <section className="bg-primary text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="py-4 md:py-0">
              <p className="text-4xl lg:text-5xl font-display font-extrabold text-white mb-2">R$ 15 Milhões</p>
              <p className="text-sm text-primary-fixed block opacity-90 font-medium">Em impostos economizados legalmente pelos nossos clientes</p>
            </div>
            <div className="py-4 md:py-0">
              <p className="text-4xl lg:text-5xl font-display font-extrabold text-white mb-2">+1.200</p>
              <p className="text-sm text-primary-fixed block opacity-90 font-medium">Empresas digitais abertas e regularizadas em todo o Brasil</p>
            </div>
            <div className="py-4 md:py-0">
              <p className="text-4xl lg:text-5xl font-display font-extrabold text-white mb-2">99.4%</p>
              <p className="text-sm text-primary-fixed block opacity-90 font-medium">De satisfação no atendimento humano diário pelo WhatsApp</p>
            </div>
          </div>
        </section>

        {/* Para Quem Trabalhamos - Interactive Explorer */}
        <section className="py-20 bg-surface-container-low" id="professions">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-semibold tracking-wider text-primary uppercase bg-ice-blue px-3 py-1.5 rounded-full">
                Segmentos Especializados
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary mt-4 mb-4">
                Atuação Sob Medida no Mercado Digital
              </h2>
              <p className="text-secondary">
                Diferente da contabilidade tradicional de bairro, nós respiramos o mercado digital. Clique em uma das áreas abaixo para entender nossa solução especializada e carregar o simulador.
              </p>
            </div>

            {/* Selection Grid buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
              {PROFESSIONS.map((prof) => {
                const isSelected = activeProfession.id === prof.id;
                return (
                  <button
                    key={prof.id}
                    onClick={() => selectProfessionProfile(prof)}
                    className={`p-4 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                      isSelected 
                        ? "bg-primary border-primary text-white shadow-md" 
                        : "bg-white border-surface-border text-secondary hover:border-primary-light"
                    }`}
                  >
                    <span className="material-symbols-outlined text-3xl block">
                      {prof.icon}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold block">{prof.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Card based on Selected Profession */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeProfession.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-surface-border shadow-xs grid lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-8 space-y-4">
                  <div className="inline-block bg-ice-blue text-primary font-mono text-xs px-3 py-1 rounded-md">
                    CNAE Recomendado: {activeProfession.cnae}
                  </div>
                  
                  <h3 className="font-display text-2xl font-bold text-primary flex items-center gap-2">
                    Contabilidade para {activeProfession.title}
                  </h3>
                  
                  <p className="text-secondary leading-relaxed">
                    {activeProfession.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-surface-border">
                    <div>
                      <h4 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-red-600"></span>
                        Principais Gargalos & Dificuldades:
                      </h4>
                      <p className="text-sm text-secondary leading-relaxed">
                        {activeProfession.challenges}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-success-teal uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-success-teal"></span>
                        Como a Falvella Resolve:
                      </h4>
                      <p className="text-sm text-secondary leading-relaxed">
                        {activeProfession.solution}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-surface-container-low p-6 rounded-xl border border-surface-border flex flex-col justify-between h-full space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs text-slate-gray font-semibold uppercase tracking-wider block">Oportunidade de Destaque</span>
                    <p className="font-display text-lg font-bold text-primary leading-tight">
                      {activeProfession.highlight}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={() => scrollToSection("simulator")}
                      className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-bold text-sm hover:bg-primary-light transition-all"
                    >
                      <Calculator className="h-4 w-4" />
                      Simular com este Perfil
                    </button>
                    <a 
                      href={`https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20contabilidade%20especializada%20para%20${activeProfession.title}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 border border-primary text-primary py-3 rounded-lg font-bold text-sm hover:bg-white transition-all"
                    >
                      Conversar no WhatsApp
                    </a>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Core Interactive Tax Simulator */}
        <section className="py-20 bg-white" id="simulator">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-semibold tracking-wider text-primary uppercase bg-ice-blue px-3 py-1.5 rounded-full">
                Simulador Inteligente
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary mt-4 mb-4">
                Quanto Você Pode Economizar em Impostos?
              </h2>
              <p className="text-secondary">
                Arrume o slider de acordo com o seu faturamento mensal aproximado e descubra a diferença absurda entre faturar no CPF (Pessoa Física) e no CNPJ regularizado pela Falvella.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-12 items-start">
              
              {/* Simulator Input Controls */}
              <div className="lg:col-span-5 bg-surface-container-low p-6 sm:p-8 rounded-2xl border border-surface-border space-y-6">
                <div>
                  <label className="block text-sm font-bold text-primary uppercase tracking-wider mb-2">
                    1. Qual sua Atuação Digital?
                  </label>
                  <select 
                    value={simProfession} 
                    onChange={(e) => {
                      setSimProfession(e.target.value);
                      const matched = PROFESSIONS.find(p => p.id === e.target.value);
                      if (matched) {
                        setActiveProfession(matched);
                        setSimMonthlyRevenue(matched.typicalBilling);
                      }
                    }}
                    className="w-full bg-white border border-surface-border rounded-xl px-4 py-3 text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="afiliado">Afiliados</option>
                    <option value="infoprodutor">Infoprodutores (Cursos/Mentoria)</option>
                    <option value="coprodutor">Coprodutores</option>
                    <option value="gestor_trafego">Gestores de Tráfego</option>
                    <option value="social_media">Social Media</option>
                    <option value="desenvolvedor">Desenvolvedor & TI</option>
                    <option value="prestador">Prestadores de Serviços Gerais</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-primary uppercase tracking-wider block">
                      2. Faturamento Mensal Estimado
                    </label>
                    <span className="text-lg font-extrabold text-primary font-display bg-white px-3 py-1 rounded-md border border-surface-border">
                      R$ {simMonthlyRevenue.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  
                  {/* Revenue Slider */}
                  <input 
                    type="range" 
                    min="3000" 
                    max="150000" 
                    step="1000"
                    value={simMonthlyRevenue} 
                    onChange={(e) => setSimMonthlyRevenue(Number(e.target.value))}
                    className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-slate-gray mt-2 font-mono">
                    <span>R$ 3.000</span>
                    <span>R$ 50.000</span>
                    <span>R$ 100.000</span>
                    <span>R$ 150.000+</span>
                  </div>
                </div>

                {/* Additional Info box on Fator-R dynamic handling */}
                {simProfession === "desenvolvedor" || simProfession === "gestor_trafego" ? (
                  <div className="bg-ice-blue p-4 rounded-xl border border-primary-light/20 flex gap-3">
                    <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="text-xs text-primary-light leading-relaxed">
                      <strong>Fator-R Ativado:</strong> Atividades de software/gestão normalmente pagam 15.5% de imposto. Na Falvella, estruturamos um pró-labore estratégico de 28% para reduzir seu imposto de saída para apenas <strong>6%</strong>! Isso já está contemplado no cálculo.
                    </div>
                  </div>
                ) : (
                  <div className="bg-success-teal/10 p-4 rounded-xl border border-success-teal/20 flex gap-3">
                    <Info className="h-5 w-5 text-success-teal shrink-0 mt-0.5" />
                    <div className="text-xs text-secondary leading-relaxed font-light">
                      Nossos contadores buscam o enquadramento no <strong>Simples Nacional Anexo III</strong> para manter seu imposto consolidado na alíquota de largada de 6% no seu CNPJ.
                    </div>
                  </div>
                )}
              </div>

              {/* Simulation Result Charts */}
              <div className="lg:col-span-7 space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-surface-border">
                
                <h3 className="font-display text-xl font-bold text-primary flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-success-teal" />
                  Comparativo de Gastos com Impostos Mensais:
                </h3>

                {/* Custom Tailwind Bar chart */}
                <div className="space-y-5 pt-2">
                  
                  {/* CPF Bar */}
                  <div>
                    <div className="flex justify-between items-center text-sm font-medium text-secondary mb-1">
                      <span className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded-full bg-red-600 block"></span>
                        Autônomo (CPF - Sem CNPJ)
                      </span>
                      <span className="font-bold text-red-600">
                        R$ {Math.round(simResult.cpf.total).toLocaleString("pt-BR")} ({simResult.cpf.rate.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-low h-8 rounded-lg overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((simResult.cpf.total / Math.max(simResult.cpf.total, simResult.presumido.total, 1)) * 100, 100)}%` }}
                        transition={{ duration: 0.5 }}
                        className="bg-red-600 h-full rounded-lg"
                      />
                    </div>
                    <p className="text-[10px] text-red-600/80 font-mono mt-1">
                      Sujeito a alíquota máxima de 27.5% de IRPF + INSS Autônomo obrigatório.
                    </p>
                  </div>

                  {/* Simples Nacional Bar */}
                  <div>
                    <div className="flex justify-between items-center text-sm font-medium text-secondary mb-1">
                      <span className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded-full bg-success-teal block"></span>
                        Simples Nacional (CNPJ Falvella)
                      </span>
                      <span className="font-bold text-success-teal text-base">
                        R$ {Math.round(simResult.simples.total).toLocaleString("pt-BR")} ({simResult.simples.rate.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-low h-10 rounded-lg overflow-hidden border-2 border-success-teal/30 p-[2px]">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((simResult.simples.total / Math.max(simResult.cpf.total, simResult.presumido.total, 1)) * 100, 100)}%` }}
                        transition={{ duration: 0.5 }}
                        className="bg-success-teal h-full rounded-md"
                      />
                    </div>
                    <p className="text-[10px] text-success-teal font-mono mt-1 font-bold">
                      ★ RECOMENDADO: Tributação unificada na guia DAS. Economia Máxima Legal!
                    </p>
                  </div>

                  {/* Lucro Presumido Bar */}
                  <div>
                    <div className="flex justify-between items-center text-sm font-medium text-secondary mb-1">
                      <span className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded-full bg-primary-light block"></span>
                        Lucro Presumido (CNPJ)
                      </span>
                      <span className="font-bold text-primary-light">
                        R$ {Math.round(simResult.presumido.total).toLocaleString("pt-BR")} ({simResult.presumido.rate.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-low h-8 rounded-lg overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((simResult.presumido.total / Math.max(simResult.cpf.total, simResult.presumido.total, 1)) * 100, 100)}%` }}
                        transition={{ duration: 0.5 }}
                        className="bg-primary-light h-full rounded-lg"
                      />
                    </div>
                  </div>

                </div>

                {/* Savings Callout Display */}
                <div className="mt-8 bg-ice-blue p-6 rounded-2xl border border-primary-light/20 grid sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <span className="text-xs text-primary-light font-bold uppercase tracking-wider block mb-1">Economia Anual Estimada</span>
                    <span className="text-3xl font-extrabold font-display text-primary block">
                      R$ {Math.round(simResult.savingsAnnual).toLocaleString("pt-BR")}
                    </span>
                    <span className="text-xs text-slate-gray font-light mt-1 block">
                      Dinheiro que deixa de ir para impostos e fica na sua conta.
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <a 
                      href={`https://wa.me/5511999999999?text=Olá!%20Simulei%20no%20site%20e%20vi%20uma%20economia%20anual%20de%20R$%20${Math.round(simResult.savingsAnnual).toLocaleString("pt-BR")}%20com%20faturamento%20de%20R$%20${simMonthlyRevenue}.%20Quero%20abrir/migrar%20minha%20empresa!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-bold text-sm hover:bg-primary-light transition-all shadow-md text-center"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Garantir Essa Economia!
                    </a>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* Step-by-Step Diagnostic Form Section */}
        <section className="py-20 bg-surface-container-low" id="diagnostic">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-semibold tracking-wider text-primary uppercase bg-ice-blue px-3 py-1.5 rounded-full">
                Diagnóstico Exclusivo
              </span>
              <h2 className="font-display text-3xl font-extrabold text-primary mt-4 mb-4">
                Solicite Seu Diagnóstico Tributário Gratuito
              </h2>
              <p className="text-secondary font-light">
                Descubra em segundos o formato legal ideal para o seu modelo de faturamento digital e gere um relatório exclusivo para envio direto no WhatsApp de nossos especialistas.
              </p>
            </div>

            {/* Diagnostic Wrapper */}
            <div className="bg-white rounded-2xl border border-surface-border shadow-md overflow-hidden">
              
              {/* Form Step Indicators */}
              {!diagCompleted && (
                <div className="bg-surface-container/40 px-6 py-4 border-b border-surface-border flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-gray">
                    Passo {diagStep} de 3: {diagStep === 1 ? "Identificação" : diagStep === 2 ? "Modelo de Negócios" : "Perspectivas"}
                  </span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map((s) => (
                      <span 
                        key={s} 
                        className={`h-2.5 w-2.5 rounded-full block transition-colors ${
                          diagStep >= s ? "bg-primary" : "bg-surface-container-highest"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Wizard Content */}
              <div className="p-6 sm:p-10">
                {!diagCompleted ? (
                  <form onSubmit={handleDiagSubmit} className="space-y-6">
                    <AnimatePresence mode="wait">
                      
                      {diagStep === 1 && (
                        <motion.div 
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <h3 className="font-display text-lg font-bold text-primary mb-4">
                            Preencha seus dados de contato:
                          </h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-gray uppercase">Seu Nome Completo</label>
                              <div className="relative">
                                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-gray" />
                                <input 
                                  type="text" 
                                  placeholder="Digite seu nome"
                                  value={diagData.name} 
                                  onChange={(e) => setDiagData({...diagData, name: e.target.value})}
                                  className="w-full bg-surface-bright border border-surface-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                  required
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-gray uppercase">Seu E-mail Profissional</label>
                              <div className="relative">
                                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-gray" />
                                <input 
                                  type="email" 
                                  placeholder="nome@empresa.com"
                                  value={diagData.email} 
                                  onChange={(e) => setDiagData({...diagData, email: e.target.value})}
                                  className="w-full bg-surface-bright border border-surface-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-gray uppercase">WhatsApp de Contato</label>
                            <div className="relative">
                              <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-gray" />
                              <input 
                                type="tel" 
                                placeholder="(11) 99999-9999"
                                value={diagData.phone} 
                                onChange={(e) => setDiagData({...diagData, phone: e.target.value})}
                                className="w-full bg-surface-bright border border-surface-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                              />
                            </div>
                            <span className="text-[10px] text-slate-gray block">
                              Enviaremos seu diagnóstico detalhado por aqui caso queira agendar a conversa.
                            </span>
                          </div>
                        </motion.div>
                      )}

                      {diagStep === 2 && (
                        <motion.div 
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <h3 className="font-display text-lg font-bold text-primary mb-4">
                            Fale sobre a sua atuação e faturamento:
                          </h3>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-gray uppercase block">Área Digital Principal</label>
                              <select 
                                value={diagData.area} 
                                onChange={(e) => setDiagData({...diagData, area: e.target.value})}
                                className="w-full bg-surface-bright border border-surface-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                              >
                                <option value="afiliado">Afiliado</option>
                                <option value="infoprodutos">Infoprodutor (Cursos / E-books)</option>
                                <option value="coprodutor">Coprodutor estratégico</option>
                                <option value="gestao_trafego">Gestor de Tráfego</option>
                                <option value="desenvolvedor">Desenvolvedor / TI / Software</option>
                                <option value="prestador">Outra prestação de serviço digital</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-gray uppercase block">Faturamento Mensal Médio</label>
                              <select 
                                value={diagData.billingRange} 
                                onChange={(e) => setDiagData({...diagData, billingRange: e.target.value})}
                                className="w-full bg-surface-bright border border-surface-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                              >
                                <option value="Ate R$ 5.000">Até R$ 5.000</option>
                                <option value="R$ 5.000 a R$ 15.000">R$ 5.000 a R$ 15.000</option>
                                <option value="R$ 15.000 a R$ 30.000">R$ 15.000 a R$ 30.000</option>
                                <option value="R$ 30.000 a R$ 80.000">R$ 30.000 a R$ 80.000</option>
                                <option value="Acima de R$ 80.000">Acima de R$ 80.000</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-gray uppercase block">Como fatura atualmente?</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {["CPF (Pessoa Física)", "MEI", "Outro CNPJ (ME/LTDA)"].map((opt) => (
                                <button
                                  type="button"
                                  key={opt}
                                  onClick={() => setDiagData({...diagData, currentStatus: opt})}
                                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                                    diagData.currentStatus === opt
                                      ? "bg-primary text-white border-primary"
                                      : "bg-surface-bright text-secondary border-surface-border hover:border-primary-light"
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {diagStep === 3 && (
                        <motion.div 
                          key="step3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <h3 className="font-display text-lg font-bold text-primary mb-4">
                            Últimos detalhes tributários:
                          </h3>
                          
                          <div className="space-y-3">
                            <label className="text-xs font-semibold text-slate-gray uppercase block">Terá sócios no negócio digital?</label>
                            <div className="flex gap-4">
                              <label className="flex items-center gap-2 text-sm text-secondary cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="partners" 
                                  value="sim" 
                                  checked={diagData.partners === "sim"}
                                  onChange={() => setDiagData({...diagData, partners: "sim"})}
                                  className="text-primary focus:ring-primary h-4 w-4"
                                />
                                Sim (LTDA com 2 ou mais sócios)
                              </label>
                              <label className="flex items-center gap-2 text-sm text-secondary cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="partners" 
                                  value="nao" 
                                  checked={diagData.partners === "nao"}
                                  onChange={() => setDiagData({...diagData, partners: "nao"})}
                                  className="text-primary focus:ring-primary h-4 w-4"
                                />
                                Não (Sociedade Limitada Unipessoal - SLU ou Individual)
                              </label>
                            </div>
                          </div>

                          <div className="space-y-3 pt-2">
                            <label className="text-xs font-semibold text-slate-gray uppercase block">Pretende contratar funcionários?</label>
                            <div className="flex gap-4">
                              <label className="flex items-center gap-2 text-sm text-secondary cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="hired" 
                                  value="sim" 
                                  checked={diagData.hasHiredBefore === "sim"}
                                  onChange={() => setDiagData({...diagData, hasHiredBefore: "sim"})}
                                  className="text-primary focus:ring-primary h-4 w-4"
                                />
                                Sim, pretendo contratar em breve
                              </label>
                              <label className="flex items-center gap-2 text-sm text-secondary cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="hired" 
                                  value="nao" 
                                  checked={diagData.hasHiredBefore === "nao"}
                                  onChange={() => setDiagData({...diagData, hasHiredBefore: "nao"})}
                                  className="text-primary focus:ring-primary h-4 w-4"
                                />
                                Não, atuarei sozinho ou com prestadores terceirizados
                              </label>
                            </div>
                          </div>
                        </motion.div>
                      )}

                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center pt-6 border-t border-surface-border">
                      {diagStep > 1 ? (
                        <button 
                          type="button" 
                          onClick={handleDiagPrev}
                          className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:text-primary-light"
                        >
                          Voltar
                        </button>
                      ) : <div />}

                      {diagStep < 3 ? (
                        <button 
                          type="button" 
                          onClick={handleDiagNext}
                          className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-primary-light transition-all inline-flex items-center gap-2"
                        >
                          Continuar
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <button 
                          type="submit"
                          className="bg-success-teal text-white font-bold px-8 py-3 rounded-xl text-sm hover:opacity-90 transition-all inline-flex items-center gap-2 shadow-sm"
                        >
                          Gerar Diagnóstico Gratuito!
                          <Sparkles className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </form>
                ) : (
                  // Diagnostic Report Screen
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6 text-left"
                  >
                    <div className="bg-success-teal/10 p-4 rounded-xl border border-success-teal/20 flex gap-3 items-center">
                      <CheckCircle2 className="h-6 w-6 text-success-teal" />
                      <div>
                        <h4 className="font-display font-bold text-primary">Relatório Gerado com Sucesso!</h4>
                        <p className="text-xs text-secondary">
                          Parabéns, {diagData.name}! Analisamos suas respostas e estruturamos o seu planejamento ideal de largada.
                        </p>
                      </div>
                    </div>

                    {/* Report Content Panel */}
                    <div className="bg-surface-container-low p-6 rounded-2xl border border-surface-border space-y-4">
                      
                      <div className="grid sm:grid-cols-2 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-surface-border">
                        <div className="pb-3 sm:pb-0">
                          <span className="text-[10px] text-slate-gray font-semibold uppercase tracking-wider block">Regime Tributário Recomendado</span>
                          <span className="text-lg font-bold text-primary block mt-1">{analysis.regime}</span>
                        </div>
                        <div className="pt-3 sm:pt-0 sm:pl-4">
                          <span className="text-[10px] text-slate-gray font-semibold uppercase tracking-wider block">Código CNAE Adequado</span>
                          <span className="text-sm font-mono font-medium text-primary block mt-1">{analysis.idealCnae}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-surface-border space-y-3">
                        <h5 className="text-xs font-bold text-primary uppercase tracking-wider">Análise Técnica e Próximos Passos:</h5>
                        <p className="text-sm text-secondary leading-relaxed font-light">
                          {analysis.detailText}
                        </p>
                        
                        {analysis.alertText && (
                          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-xs text-amber-800 leading-relaxed font-light">
                            <strong>Aviso Importante:</strong> {analysis.alertText}
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Report actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a 
                        href={getWhatsAppDiagnosticLink()}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2.5 bg-success-teal text-white py-4 rounded-xl font-extrabold shadow-md hover:opacity-95 transition-all text-sm"
                      >
                        <MessageCircle className="h-5 w-5" />
                        Enviar Relatório no WhatsApp de um Contador
                      </a>
                      
                      <button 
                        onClick={resetDiagnostic}
                        className="inline-flex items-center justify-center text-slate-gray font-bold text-sm hover:text-primary py-4 px-6 rounded-xl border border-surface-border hover:bg-surface-container-low transition-all"
                      >
                        Refazer Diagnóstico
                      </button>
                    </div>

                  </motion.div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* Why Choose Us - Diferenciais Section */}
        <section className="py-20 bg-white" id="diferenciais">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Graphics */}
            <div className="lg:col-span-5 relative order-2 lg:order-1">
              <div className="absolute -top-12 -left-12 w-72 h-72 rounded-full bg-primary-light/5 blur-3xl -z-10" />
              <div className="glass-card p-2 rounded-2xl shadow-xl overflow-hidden">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSGplrBpht1Y_lPUs4BudWpd-9srEWHm6dqTFtlCLgsMbLXQFwxE4REfzffiwaTjXXKPcMDIICTlbeimMlQ1iDiws6366leUqDWqowUx24lPuK8BPqmhDY9tEbT9vDtyZUJfDZNS-5wANV3th4nkcW71ro1xBKWxWNDAbraEq-lpx0ErMDt4bxs8tx3L5bkvAV4P6ILIhBydcROf2fL0uAUZHQSflH33_HYJLuW8zGWQGo6l8vpDlceNk8YegsQ44CXmVPO5iuxxEh" 
                  alt="Painel de controle de agência digital" 
                  className="w-full h-[400px] object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Right Copy */}
            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <span className="text-xs font-semibold tracking-wider text-primary uppercase bg-ice-blue px-3 py-1.5 rounded-full">
                Por que Escolher a Falvella?
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                Esqueça Tudo que Você Sabe Sobre Escritório de Contabilidade Tradicional
              </h2>
              <p className="text-secondary leading-relaxed font-light">
                Nossos clientes não precisam ir a escritórios físicos, assinar pilhas de documentos em papel ou esperar dias por respostas automáticas de e-mail. Nós fazemos tudo online, com agilidade e inteligência fiscal focada no mercado digital.
              </p>

              {/* Grid of Diferenciais */}
              <div className="grid sm:grid-cols-2 gap-6 pt-4">
                
                <div className="flex items-start gap-3.5">
                  <div className="bg-ice-blue text-primary p-2 rounded-lg shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-primary mb-1">Foco Total no Digital</h4>
                    <p className="text-xs text-secondary leading-relaxed font-light">
                      Entendemos split de notas, retenção de plataformas (Kiwify, Hotmart, Eduzz), coprodução e exportação de software.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="bg-ice-blue text-primary p-2 rounded-lg shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-primary mb-1">Sem Robôs Complicados</h4>
                    <p className="text-xs text-secondary leading-relaxed font-light">
                      Você conversa com contadores humanos especializados em tempo real diretamente pelo WhatsApp. Respostas rápidas e sem frescura.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="bg-ice-blue text-primary p-2 rounded-lg shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-primary mb-1">Tudo 100% Online</h4>
                    <p className="text-xs text-secondary leading-relaxed font-light">
                      Do envio de relatórios mensais ao fechamento de folhas, assine digitalmente e controle tudo do seu celular ou computador.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="bg-ice-blue text-primary p-2 rounded-lg shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-primary mb-1">Planejamento Perfeito</h4>
                    <p className="text-xs text-secondary leading-relaxed font-light">
                      Buscamos a menor tributação legal possível unindo CNAEs e configurando o Fator-R para blindar seus lucros de impostos exagerados.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* Quem Somos - Brand Story */}
        <section className="py-20 bg-surface-container-low" id="quem-somos">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-semibold tracking-wider text-primary uppercase bg-ice-blue px-3 py-1.5 rounded-full">
                Referência Nacional
              </span>
              <h2 className="font-display text-3xl font-extrabold text-primary tracking-tight">
                Inovando a Relação Entre Contabilidade e Tecnologia
              </h2>
              <p className="text-secondary leading-relaxed font-light">
                A Falvella Contabilidade nasceu quando percebemos que o ecossistema de produtores de conteúdo, afiliados, programadores e agências no Brasil crescia de forma meteórica, enquanto as contabilidades tradicionais continuavam presas ao papel e desconheciam conceitos básicos como split de comissão de afiliados.
              </p>
              <p className="text-secondary leading-relaxed font-light">
                Decidimos criar um escritório de ponta que dominasse a contabilidade fiscal, societária e trabalhista, mas operasse na velocidade do digital. Unimos a excelência técnica contábil ao que há de mais moderno em ferramentas online.
              </p>
              <p className="text-secondary leading-relaxed font-light">
                Hoje, somos o parceiro estratégico de centenas de empreendedores em todo o território nacional, garantindo segurança jurídica absoluta e blindagem tributária para seus negócios crescerem com tranquilidade.
              </p>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -bottom-12 -right-12 w-72 h-72 rounded-full bg-primary-light/5 blur-3xl -z-10" />
              <div className="glass-card p-2 rounded-2xl shadow-xl overflow-hidden">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6b8PzJfGNKpHQ3HiHcGTx64zWJR0EGPgHtlQAxFO1WawQ5_-CuG_OJ5MQqh7eqp0zgXf9CT_8XotYz3PDh9la0Ywm4Ex9qnTUp28o-nF25PkC5dN_N-nsXt8MWttxAejOgCMW4X_7MK12LI-HlVcybIuqfikVCA6ktxRaW0iwpI6KErxX6wBwEgA7ZCuj26Yp2iEylAwjgckVhTxv8TZlpqyjn_dULgijte4H6RBFZSjoGhCIw-hO6hPwP1jeU8dbhHxjPyiOx-1u" 
                  alt="Reunião de negócios de especialistas em contabilidade digital" 
                  className="w-full h-[360px] object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>
        </section>

        {/* Client Testimonials */}
        <section className="py-20 bg-white" id="testimonials">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-semibold tracking-wider text-primary uppercase bg-ice-blue px-3 py-1.5 rounded-full">
                Quem Já Confia
              </span>
              <h2 className="font-display text-3xl font-extrabold text-primary mt-4 mb-4">
                Depoimentos Reais de Quem Escolheu a Falvella
              </h2>
              <p className="text-secondary font-light">
                Empreendedores digitais de múltiplos segmentos compartilham sua experiência com a nossa gestão inteligente de contabilidade.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              
              <div className="bg-surface-container-low p-6 rounded-2xl border border-surface-border flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-secondary font-light italic leading-relaxed">
                    &ldquo;A Falvella salvou meu lançamento de infoprodutos. A divisão de impostos de comissão entre coprodutores era uma verdadeira confusão na contabilidade anterior. Eles resolveram e estruturaram o split de notas em poucos dias.&rdquo;
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <img src="https://i.pravatar.cc/150?u=rod1" alt="Rodrigo Silva" className="h-12 w-12 rounded-full object-cover border-2 border-primary" />
                  <div>
                    <h4 className="font-display font-bold text-primary text-sm">Rodrigo Silva</h4>
                    <span className="text-[10px] text-slate-gray font-mono block">Infoprodutor de Alta Escala</span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low p-6 rounded-2xl border border-surface-border flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-secondary font-light italic leading-relaxed">
                    &ldquo;O atendimento via WhatsApp é fantástico. Diferente das outras contabilidades em que a gente liga e fica horas na fila, com a Falvella eu mando uma mensagem e o meu contador me responde com clareza em poucos minutos.&rdquo;
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <img src="https://i.pravatar.cc/150?u=cam2" alt="Camila Mattos" className="h-12 w-12 rounded-full object-cover border-2 border-primary" />
                  <div>
                    <h4 className="font-display font-bold text-primary text-sm">Camila Mattos</h4>
                    <span className="text-[10px] text-slate-gray font-mono block">Dona de Agência de Tráfego</span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low p-6 rounded-2xl border border-surface-border flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-secondary font-light italic leading-relaxed">
                    &ldquo;Finalmente encontrei contadores que realmente sabem o que é BM, IOF, taxa de conversão e faturamento internacional. Atuo com desenvolvimento de software para o exterior e eles organizaram minha isenção tributária perfeita.&rdquo;
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <img src="https://i.pravatar.cc/150?u=luc3" alt="Lucas Ferreira" className="h-12 w-12 rounded-full object-cover border-2 border-primary" />
                  <div>
                    <h4 className="font-display font-bold text-primary text-sm">Lucas Ferreira</h4>
                    <span className="text-[10px] text-slate-gray font-mono block">Dev Internacional / TI</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Interactive FAQ - Questions accordions */}
        <section className="py-20 bg-surface-container-low" id="faq">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-semibold tracking-wider text-primary uppercase bg-ice-blue px-3 py-1.5 rounded-full">
                Dúvidas Resolvidas
              </span>
              <h2 className="font-display text-3xl font-extrabold text-primary mt-4 mb-4">
                Perguntas Frequentes do Empreendedor
              </h2>
              <p className="text-secondary font-light">
                Compilamos as maiores dúvidas tributárias e societárias sobre negócios digitais. Clique nas perguntas para ler as respostas detalhadas.
              </p>
            </div>

            <div className="space-y-4">
              
              <details className="group bg-white p-5 rounded-xl border border-surface-border transition-all cursor-pointer">
                <summary className="flex justify-between items-center font-display font-bold text-primary text-sm sm:text-base cursor-pointer list-none">
                  Vocês atendem clientes de qualquer cidade ou estado do Brasil?
                  <ChevronDown className="h-5 w-5 text-slate-gray group-open:rotate-180 transition-transform" />
                </summary>
                <div className="mt-4 text-xs sm:text-sm text-secondary leading-relaxed font-light border-t border-surface-border pt-3">
                  Sim! Como nossos processos e plataformas são 100% digitais, conseguimos atender, abrir CNPJ e regularizar empresas em qualquer cidade de todos os estados do Brasil com total segurança jurídica e o mesmo padrão de excelência.
                </div>
              </details>

              <details className="group bg-white p-5 rounded-xl border border-surface-border transition-all cursor-pointer">
                <summary className="flex justify-between items-center font-display font-bold text-primary text-sm sm:text-base cursor-pointer list-none">
                  Eu já tenho uma empresa em outra contabilidade. Como faço para migrar para a Falvella?
                  <ChevronDown className="h-5 w-5 text-slate-gray group-open:rotate-180 transition-transform" />
                </summary>
                <div className="mt-4 text-xs sm:text-sm text-secondary leading-relaxed font-light border-t border-surface-border pt-3">
                  A migração é extremamente simples e sem dor de cabeça. Nós mesmos cuidamos de toda a transição, comunicando a saída do seu antigo escritório, importando seus dados para nossa base e fazendo a checagem fiscal para garantir que não existam pendências antigas. Você não precisa fazer nenhum esforço.
                </div>
              </details>

              <details className="group bg-white p-5 rounded-xl border border-surface-border transition-all cursor-pointer">
                <summary className="flex justify-between items-center font-display font-bold text-primary text-sm sm:text-base cursor-pointer list-none">
                  Atuo no marketing digital. Posso começar como MEI para pagar menos?
                  <ChevronDown className="h-5 w-5 text-slate-gray group-open:rotate-180 transition-transform" />
                </summary>
                <div className="mt-4 text-xs sm:text-sm text-secondary leading-relaxed font-light border-t border-surface-border pt-3">
                  Algumas atividades de suporte administrativo simples até podem, mas as principais áreas do marketing digital como Gestão de Tráfego, Produção de Conteúdo, Coprodução e Agenciamento Publicitário são legalmente classificadas como serviços de Publicidade Intelectual. Por lei, atividades intelectuais e de publicidade não são elegíveis ao MEI. Começar do jeito certo com uma ME Simples Nacional evita multas severas e autuações futuras.
                </div>
              </details>

              <details className="group bg-white p-5 rounded-xl border border-surface-border transition-all cursor-pointer">
                <summary className="flex justify-between items-center font-display font-bold text-primary text-sm sm:text-base cursor-pointer list-none">
                  O que é o Fator-R do Simples Nacional e como ele reduz meu imposto de 15.5% para 6%?
                  <ChevronDown className="h-5 w-5 text-slate-gray group-open:rotate-180 transition-transform" />
                </summary>
                <div className="mt-4 text-xs sm:text-sm text-secondary leading-relaxed font-light border-t border-surface-border pt-3">
                  O Fator-R é uma regra do Simples Nacional que beneficia empresas que geram folha de pagamento. Se o somatório de gastos com pró-labore dos sócios e salários de colaboradores representar 28% ou mais do faturamento da empresa, as atividades de TI, Software ou Gestão de Tráfego passam a ser tributadas no Anexo III (alíquota inicial de 6%) ao invés do Anexo V (tributação padrão de 15.5%). Nós calculamos e controlamos essa proporção mensalmente para você não pagar nada a mais.
                </div>
              </details>

              <details className="group bg-white p-5 rounded-xl border border-surface-border transition-all cursor-pointer">
                <summary className="flex justify-between items-center font-display font-bold text-primary text-sm sm:text-base cursor-pointer list-none">
                  Como funciona o suporte diário por WhatsApp?
                  <ChevronDown className="h-5 w-5 text-slate-gray group-open:rotate-180 transition-transform" />
                </summary>
                <div className="mt-4 text-xs sm:text-sm text-secondary leading-relaxed font-light border-t border-surface-border pt-3">
                  Você recebe acesso a um grupo exclusivo no WhatsApp com nossa equipe de especialistas. Nada de responder para bots intermináveis. Se você tiver qualquer dúvida fiscal, trabalhista ou societária, basta mandar uma mensagem em horário comercial para falar diretamente com o profissional de contabilidade designado para sua empresa.
                </div>
              </details>

            </div>
          </div>
        </section>

        {/* Dynamic CTA Footer Section */}
        <section className="bg-primary text-white py-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary-light/10 blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-success-teal/5 blur-3xl -z-10" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Pronto para regularizar sua empresa e pagar menos impostos dentro da lei?
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-primary-fixed block max-w-2xl mx-auto opacity-90 font-light">
              Clique no botão abaixo e inicie seu planejamento contábil com quem realmente entende o seu mercado digital. Agende sua primeira mentoria fiscal gratuita hoje mesmo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a 
                href="https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20falar%20com%20um%20contador%20especialista%20da%20Falvella%20Contabilidade%20para%20planejar%20meus%20impostos." 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-white text-primary px-10 py-5 rounded-xl font-extrabold text-base hover:bg-ice-blue transition-all shadow-xl hover:-translate-y-0.5"
                id="btn-whatsapp-cta-final"
              >
                <MessageCircle className="h-6 w-6 text-success-teal fill-success-teal" />
                Conversar no WhatsApp Agora
              </a>
              <button 
                onClick={() => setIsChatOpen(true)}
                className="inline-flex items-center justify-center gap-3 border-2 border-white/25 text-white hover:bg-white/10 px-10 py-5 rounded-xl font-bold text-base transition-all cursor-pointer"
              >
                <Sparkles className="h-5 w-5 text-success-teal" />
                Falar com o Consultor IA
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Corporate footer */}
      <footer className="bg-on-background text-surface-container-highest border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid sm:grid-cols-2 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4 space-y-4 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="bg-primary text-white p-2.5 rounded-xl">
                <Building className="h-5 w-5" />
              </div>
              <span className="font-display text-lg font-extrabold text-white">Falvella Contabilidade</span>
            </div>
            <p className="text-sm text-surface-variant font-light leading-relaxed">
              Contabilidade digital inteligente, humanizada e ágil. Especialistas em proteger o faturamento de infoprodutores, afiliados, agências e prestadores de serviços.
            </p>
          </div>

          <div className="lg:col-span-3 text-center sm:text-left">
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">Serviços Contábeis</h4>
            <ul className="space-y-2.5 text-xs text-surface-variant">
              <li><button onClick={() => scrollToSection("simulator")} className="hover:text-white transition-colors cursor-pointer">Abertura de Empresa (CNPJ)</button></li>
              <li><button onClick={() => scrollToSection("simulator")} className="hover:text-white transition-colors cursor-pointer">Planejamento Tributário Digital</button></li>
              <li><button onClick={() => scrollToSection("professions")} className="hover:text-white transition-colors cursor-pointer">Otimização de Pró-labore (Fator-R)</button></li>
              <li><button onClick={() => scrollToSection("diagnostic")} className="hover:text-white transition-colors cursor-pointer">Migração de Contabilidade Antiga</button></li>
            </ul>
          </div>

          <div className="lg:col-span-3 text-center sm:text-left">
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">Fale Conosco</h4>
            <ul className="space-y-2.5 text-xs text-surface-variant">
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <Mail className="h-4 w-4 shrink-0 text-slate-gray" />
                contato@falvella.com.br
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <Phone className="h-4 w-4 shrink-0 text-slate-gray" />
                (11) 99999-9999
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <Building className="h-4 w-4 shrink-0 text-slate-gray" />
                Atendimento Nacional 100% Online
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 text-center sm:text-left space-y-4">
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider block">Certificações</h4>
            <div className="bg-white/5 p-3 rounded-lg border border-white/10 flex items-center justify-center gap-2">
              <ShieldCheck className="h-5 w-5 text-success-teal shrink-0" />
              <span className="text-[10px] text-surface-variant font-medium leading-none block">Empresa Registrada CRC/SP</span>
            </div>
          </div>

        </div>

        {/* Regulatory footer */}
        <div className="border-t border-white/5 bg-on-background py-8 text-center text-xs text-slate-gray space-y-2">
          <p>© 2026 Falvella Contabilidade Digital. Todos os direitos reservados. CNPJ: 00.000.000/0001-00</p>
          <p className="font-light opacity-60">As simulações tributárias são estimativas baseadas na legislação fiscal vigente do Simples Nacional e do Imposto de Renda Pessoa Física.</p>
        </div>
      </footer>

      {/* Floating Action Button (FAB) for WhatsApp */}
      <a 
        href="https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20falar%20com%20um%20contador%20da%20Falvella."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center"
        title="Fale Conosco no WhatsApp"
        id="whatsapp-fab"
      >
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-2.32 0-4.591.899-6.398 2.532-1.808 1.633-2.82 3.864-2.85 6.281-.062 4.962 4.01 9.006 9.083 9.006 1.541-.014 3.039-.4 4.348-1.121l4.291 1.134-1.133-4.188c.78-1.341 1.192-2.87 1.193-4.423-.002-4.945-4.01-8.966-9.043-9.01l-.491-.011zm0 1.298l.418.01c4.321.037 7.755 3.471 7.757 7.714-.001 1.342-.361 2.645-1.042 3.766l.66 2.441-2.493-.659c-1.144.665-2.45 1.018-3.777 1.029-4.329 0-7.818-3.468-7.764-7.734.025-2.073.896-3.992 2.452-5.402 1.556-1.41 3.511-2.185 5.509-2.185l.28.02zm-2.42 2.583c-.158.001-.365.053-.55.232-.204.197-.777.759-.777 1.85 0 1.092.795 2.146.906 2.296.111.15 1.564 2.388 3.788 3.351.53.228.943.364 1.265.466.531.168 1.014.144 1.396.088.427-.062 1.312-.536 1.496-1.053.184-.516.184-.959.129-1.053-.055-.094-.203-.15-.425-.261-.222-.111-1.312-.647-1.515-.72-.203-.073-.351-.111-.499.111-.148.222-.573.72-.702.868-.129.148-.259.166-.481.055-.221-.111-.937-.345-1.785-1.102-.659-.588-1.104-1.314-1.233-1.536-.129-.222-.014-.342.097-.452.1-.099.222-.259.333-.388.111-.129.148-.222.222-.369.074-.148.037-.277-.018-.388-.055-.111-.499-1.201-.684-1.644-.18-.432-.358-.373-.499-.38l-.426-.008z" />
        </svg>
      </a>

      {/* Docked AI Consulting Sidebar Drawer (using motion for professional entry) */}
      <AnimatePresence>
        {isChatOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="absolute inset-0 bg-black/45 backdrop-blur-xs"
              id="chat-backdrop"
            />

            {/* Sidebar Box */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col z-10"
              id="chat-sidebar-container"
            >
              
              {/* Sidebar Header */}
              <div className="bg-primary text-white px-5 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="bg-white/10 p-2 rounded-lg text-white">
                    <Sparkles className="h-5 w-5 text-success-teal" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm">Consultor Virtual Falvella</h3>
                    <span className="text-[10px] text-primary-fixed block opacity-80">Online • Inteligência Artificial</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-1.5 text-white/85 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Sidebar Suggestions & Help Box */}
              <div className="bg-ice-blue/80 px-4 py-3 border-b border-surface-border text-xs shrink-0 space-y-1.5">
                <span className="font-bold text-primary block">Tópicos sugeridos:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button 
                    onClick={() => handleQuickQuestion("O que é o Fator-R?")}
                    className="bg-white border border-surface-border hover:border-primary-light text-primary px-2.5 py-1 rounded-full font-medium cursor-pointer transition-all text-[11px]"
                  >
                    O que é o Fator-R?
                  </button>
                  <button 
                    onClick={() => handleQuickQuestion("Coprodutor pode ser MEI?")}
                    className="bg-white border border-surface-border hover:border-primary-light text-primary px-2.5 py-1 rounded-full font-medium cursor-pointer transition-all text-[11px]"
                  >
                    Coprodutor pode ser MEI?
                  </button>
                  <button 
                    onClick={() => handleQuickQuestion("Qual CNAE uso para Infoprodutor?")}
                    className="bg-white border border-surface-border hover:border-primary-light text-primary px-2.5 py-1 rounded-full font-medium cursor-pointer transition-all text-[11px]"
                  >
                    CNAE Infoprodutor
                  </button>
                  <button 
                    onClick={() => handleQuickQuestion("Como funciona split fiscal?")}
                    className="bg-white border border-surface-border hover:border-primary-light text-primary px-2.5 py-1 rounded-full font-medium cursor-pointer transition-all text-[11px]"
                  >
                    Como funciona split fiscal?
                  </button>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-surface-bright/50">
                {chatMessages.map((msg, index) => {
                  const isAssistant = msg.role === "assistant";
                  return (
                    <div 
                      key={index} 
                      className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                        isAssistant 
                          ? "bg-surface-container-low text-secondary border border-surface-border rounded-tl-xs" 
                          : "bg-primary text-white rounded-tr-xs"
                      }`}>
                        {msg.text.split("\n").map((line, lIdx) => (
                          <p key={lIdx} className={line.trim() === "" ? "h-2" : "mb-1.5 last:mb-0"}>
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-surface-container-low text-secondary border border-surface-border rounded-2xl rounded-tl-xs px-4 py-3 flex items-center gap-2 text-xs">
                      <span className="flex h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="flex h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="flex h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }}></span>
                      <span className="text-[10px] text-slate-gray ml-1 font-light">Analisando legislação...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Message Input form */}
              <form 
                onSubmit={handleSendMessage}
                className="p-4 border-t border-surface-border bg-white flex gap-2 shrink-0"
              >
                <input 
                  type="text" 
                  placeholder="Pergunte sobre CNAE, impostos, Fator-R..." 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-grow bg-surface-container-low border border-surface-border rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={chatLoading}
                />
                <button 
                  type="submit"
                  disabled={chatLoading || !chatInput.trim()}
                  className="bg-primary text-white p-3 rounded-xl hover:bg-primary-light transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>

              {/* Chat disclaimer */}
              <div className="bg-surface-container/30 px-4 py-2 border-t border-surface-border text-[9px] text-slate-gray text-center font-light shrink-0">
                Nosso consultor de Inteligência Artificial usa a base regulatória do Simples Nacional. Para cálculos oficiais, fale diretamente com nossa equipe.
              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
