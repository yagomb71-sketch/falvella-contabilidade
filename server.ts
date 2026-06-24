import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for AI Consulting using Gemini API
  app.post("/api/chat", async (req: any, res: any) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "O campo 'message' é obrigatório." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "A chave API do Gemini não está configurada no painel de segredos (Secrets) do AI Studio." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = `Você é o Consultor Contábil Inteligente da Falvella Contabilidade, especialista em negócios digitais.
A Falvella Contabilidade é lider em contabilidade digital para:
- Afiliados (CNAE de promoção de vendas)
- Infoprodutores (venda de e-books, cursos online, áreas de membros)
- Coprodutores (parceria em lançamentos, divisão de notas automatizada)
- Gestores de Tráfego (compra de mídia, agenciamento de espaços publicitários)
- Social Media & Criadores de Conteúdo
- Agências de Lançamento / Marketing
- Designers e Copywriters
- Desenvolvedores, Programadores e Profissionais de TI
- Prestadores de Serviços em Geral

Seu papel é responder com extrema clareza, simpatia, prestatividade e rigor técnico, mas de maneira simples de entender para leigos.

Diretrizes de resposta:
1. Explique como funciona a tributação para cada profissão. CPF paga até 27.5% + 20% de INSS (Carnê-Leão). Abrir um CNPJ Simples Nacional reduz o imposto inicial para 6% (ou 15.5% para serviços sujeitos ao Fator-R, mas explicite que com o Fator-R adequado através de pró-labore de 28%, conseguimos reduzir de volta para 6%).
2. Destaque que a Falvella ajuda em todo o processo de forma 100% online, segura, rápida e com atendimento humanizado por WhatsApp.
3. Se perguntarem sobre MEI, explique que várias atividades digitais (como Gestor de Tráfego, Coprodutor, Programador) não podem ser MEI por lei (atividades intelectuais/de publicidade). Eles precisam ser ME (Microempresa) no Simples Nacional para evitar multas, mas a Falvella abre a empresa com planejamento correto.
4. Responda em português. Formate as mensagens usando parágrafos limpos e listas para facilitar a leitura.
5. Sempre sugira que façam uma simulação no Simulador Tributário do site, preencham o Diagnóstico Gratuito na página ou entrem em contato direto pelo botão de WhatsApp para falar com a nossa equipe humana de contadores especialistas.

Mantenha as respostas focadas, amigáveis e evite respostas extremamente longas. Seja direto e atencioso.`;

      // Build contents structure for Gemini
      const contents = [];
      
      // Inject history if provided and valid
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          contents.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.text }]
          });
        }
      }
      
      // Add the final user message
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const responseText = response.text || "Desculpe, não consegui gerar uma resposta adequada agora.";
      res.json({ text: responseText });
    } catch (error: any) {
      console.error("Gemini API server-side error:", error);
      res.status(500).json({ 
        error: "Erro na comunicação com a Inteligência Artificial. Verifique se as credenciais estão corretas." 
      });
    }
  });

  // Serve static assets and bundle React client
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
