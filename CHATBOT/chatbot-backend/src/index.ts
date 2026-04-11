import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY!,
  apiVersion: "v1",
});

//Type güvenliği
type Message = {
  role: "user" | "assistant";
  content: string;
};

//Cache sistemi
const cache: Record<string, string> = {};

//Kullanıcı hafızası
const conversations: Record<string, Message[]> = {};

app.post("/chat", async (req, res) => {
  const { message, userId } = req.body;

  //Validation
  if (!message || !userId) {
    return res.status(400).json({
      error: "message ve userId gerekli",
    });
  }

  //Kullanıcı yoksa oluştur
  if (!conversations[userId]) {
    conversations[userId] = [];
  }

  const history = conversations[userId];

  //User based cache key
  const key = userId + "_" + message;

  //STREAMING HEADERS (Bağlantıyı açık tutar)
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  //Cache kontrol
  if (cache[key]) {
    console.log("CACHE'DEN GELDİ");

    //History'yi de koru
    history.push({ role: "user", content: message });
    history.push({ role: "assistant", content: cache[key] });

    // Cache'deki veriyi stream formatında gönder
    res.write(`data: ${JSON.stringify({ type: "chunk", content: cache[key] })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    return res.end();
  }

  //Kullanıcı mesajını ekle
  history.push({
    role: "user",
    content: message,
  });

  console.log(`[USER ${userId}]:`, message);
  console.log("HISTORY:", history.length);

  //Memory limit
  const MAX_MESSAGES = 38;

  if (history.length > MAX_MESSAGES) {
    conversations[userId] = history.slice(-MAX_MESSAGES);
  }

  try {
    //AI çağrısı
    const stream = await model.stream(history);

    let fullResponse = "";

    for await (const chunk of stream) {
      const chunkContent = String(chunk.content || "");
      fullResponse += chunkContent;
      // Her parçayı anında gönder
      res.write(`data: ${JSON.stringify({ type: "chunk", content: chunkContent })}\n\n`);
      
    }

    //Cache'e kaydet
    cache[key] = fullResponse;

    //AI cevabını ekle
    history.push({
      role: "assistant",
      content: fullResponse,
    });

    // Bittiğini bildir
    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();

  } catch (error: any) {
    console.error("DETAY:", error);

    const errorMsg = error.status === 429 
      ? "Şu an çok fazla istek attın birazdan tekrar dene." 
      : "AI şu an cevap veremiyor";
    
    res.write(`data: ${JSON.stringify({ type: "error", content: errorMsg })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server çalışıyor: http://localhost:${PORT}`);
});