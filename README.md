# 🎵 AI-Powered Music Platform (In-Progess)
A full-stack web application for creating, uploading, listening to, and managing AI-generated music.

This platform allows users to upload their own songs and thumbnails — **or generate them with AI**.  
It includes a music player, AI generation workflows, and a full admin dashboard for content management.

---

## ✨ Features

### 🎧 Music Experience
- Upload your own **audio tracks** and **thumbnails**
- Generate **AI-powered songs** using the **ACE-Step model**
- Generate **AI thumbnails** with **StabilityAI**
- Generate **song lyrics** using **Qwen**
- Built-in music player with playlist support

### 🔧 System & Platform Features
- **Queueing + workflow pipeline** for AI generation tasks
- **Rate limiting** to protect resources
- **Robust authentication** (Auth.js)
- **User onboarding flow**
- **Admin dashboard** for managing songs, metadata, and users
- **Scalable architecture** using serverless compute + managed queues

---

## 🛠️ Tech Stack

### Frontend (T3-Stack)
- **Next.js**
- **TypeScript**
- **Tailwind CSS**

### Backend / Serverless
- **Modal** – AI compute (ACE-Step, StabilityAI, Qwen)
- **AWS** – S3 storage
- **Upstash** – queues, workflows, rate limiting with **Redis**
- **Auth.js** – authentication
- **Python** – AI workers & generation pipelines
- **TypeScript** – API routes, server logic, UI

### AI Models
- **ACE-Step** → AI music generation  
- **StabilityAI** → Thumbnail creation  
- **Qwen** → Lyric generation  
