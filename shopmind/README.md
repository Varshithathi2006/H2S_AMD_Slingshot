# ShopMind — Agentic AI E-commerce

ShopMind is a production-ready, AI-first e-commerce platform built with Next.js 14 and Google Gemini. It features an intelligent shopping assistant that can search products, manage your cart, and track orders using natural language.

## 🚀 Key Features
- **🤖 Agentic AI**: Multi-step ReAct loop powered by Gemini 1.5 Flash.
- **🎤 Voice Shop**: Hands-free shopping using Web Speech API.
- **📸 Image Search**: Upload a photo to find matching products via Gemini Vision.
- **📊 Admin Hub**: AI-powered business analytics and real-time KPI tracking.
- **🌍 Internationalization**: Full support for Tamil and English.
- **🔐 Secure Auth**: Role-based access control with NextAuth.js.

## 🛠 Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL
- **AI**: Google Gemini 1.5 Flash
- **Deployment**: Docker, GCP Cloud Run, Secret Manager

## 🏁 Getting Started

### 1. Prerequisites
- Node.js 20+
- PostgreSQL database (or use Docker)
- Gemini API Key ([Google AI Studio](https://aistudio.google.com/))

### 2. Installation
```bash
git clone <your-repo>
cd shopmind
npm install
```

### 3. Environment Setup
Create a `.env` file based on `.env.example`:
```env
DATABASE_URL="postgresql://..."
GEMINI_API_KEY="your-key"
NEXTAUTH_SECRET="random-string"
```

### 4. Database Setup
```bash
npx prisma db push
npx prisma db seed
```

### 5. Run Development Server
```bash
npm run dev
```

## 🚢 Deployment (GCP Cloud Run)

Follow these steps to deploy ShopMind to Google Cloud:

1. **Build and Tag the Container**:
   ```bash
   gcloud builds submit --tag gcr.io/[PROJECT_ID]/shopmind .
   ```

2. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy shopmind \
     --image gcr.io/[PROJECT_ID]/shopmind \
     --platform managed \
     --region [REGION] \
     --allow-unauthenticated \
     --set-env-vars="GEMINI_API_KEY=[YOUR_KEY],DATABASE_URL=[YOUR_URL],NEXTAUTH_URL=[YOUR_APP_URL]"
   ```

3. **Configure Secrets**:
   For production, it is recommended to use **Secret Manager** for `GEMINI_API_KEY` and `DATABASE_URL`.

## 🧪 Testing
```bash
npm test
```

## 🌏 Internationalization
Toggle languages in the Navbar. Messages are located in `/messages`.

## 📄 License
MIT
