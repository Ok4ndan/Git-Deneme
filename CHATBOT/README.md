# 🤖 AI Chatbot (Fullstack)

Bu proje, modern web teknolojileri kullanılarak geliştirilmiş bir **yapay zeka destekli chatbot uygulamasıdır**.
Kullanıcılar gerçek zamanlı (streaming) olarak yapay zeka ile sohbet edebilir.

---

## Özellikler

* 💬 Gerçek zamanlı mesajlaşma (Streaming Response)
* ⚡ Hızlı cevap için cache sistemi
* 🧠 Konuşma geçmişi (memory)
* 🎨 Modern UI (React + shadcn/ui + Tailwind)
* 🌐 REST API backend (Node.js + Express)
* 🔑 Gemini AI (LangChain entegrasyonu)
* ⌨️ Enter ile mesaj gönderme
* ✨ Typing efekti (yazıyor animasyonu)
* 🛑 Rate limit (429) hatası yönetimi

---

## Proje Yapısı

```
chatbot-project/
│
├── chatbot-backend/   # Node.js backend (API + AI)
│
└── chatbot-frontend/  # React frontend (UI)
```

---

## Kullanılan Teknolojiler

### Backend

* Node.js
* Express.js
* LangChain
* Google Gemini API

### Frontend

* React (Vite)
* Tailwind CSS
* shadcn/ui

---

## Kurulum

### Backend

```bash
cd chatbot-backend
npm install
```

#### .env dosyası oluştur:

```
GEMINI_API_KEY=your_api_key_here
```

#### Server başlat:

```bash
npx ts-node-dev src/index.ts
```

---

### Frontend

```bash
cd chatbot-frontend
npm install
npm run dev
```

---

## API Endpoint

### POST `/chat`

#### Request:

```json
{
  "message": "Merhaba",
  "userId": "1"
}
```

#### Response (Streaming):

```json
{
  "type": "chunk",
  "content": "Mer"
}
```

---

## Sistem Mimarisi

1. Kullanıcı mesajı frontend'den backend'e gönderilir
2. Backend mesajı cache'de kontrol eder
3. Eğer yoksa Gemini AI'ya iletilir
4. AI cevabı **streaming olarak parça parça gönderilir**
5. Frontend bu parçaları anlık olarak ekrana yazar

---

## UI Özellikleri

* Mesaj balonları (user / AI ayrımı)
* Otomatik scroll
* Typing efekti
* Responsive tasarım

---

## Bilinen Sınırlamalar

* Gemini API free tier limitleri (günlük istek sınırı)
* Cache sadece RAM üzerinde tutulur
* Veritabanı entegrasyonu yok

---

## Geliştirici

(Yiğit Ata Okandan)
Bu proje, yazılım öğrenme ve kendini geliştirme amacıyla geliştirilmiştir.

