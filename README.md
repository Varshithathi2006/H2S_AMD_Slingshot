# ShopMind — Agentic AI E-commerce

ShopMind is a production-ready, AI-first e-commerce platform built with Next.js 14 and Groq AI (Llama 3). It features an intelligent shopping assistant that can search products, manage your cart, and track orders using natural language.

## 🚀 Key Features
- **🤖 Agentic AI**: Multi-step ReAct loop powered by **Groq AI (Llama 3.3)** for lightning-fast responses.
- **🎤 Voice Shop**: Hands-free shopping using the Web Speech API.
- **📸 Image Search**: Dynamic product visualization with SVG-powered placeholders.
- **📊 Admin Hub**: AI-powered business analytics and real-time KPI tracking.
- **🌍 Internationalization**: Full support for Tamil and English.
- **🔐 Secure Auth**: Role-based access control with NextAuth.js.

## 🛠 Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui (Base UI)
- **Backend**: Next.js API Routes, Prisma ORM, Neon PostgreSQL
- **AI Engine**: Groq SDK (Llama 3.3 70B)
- **Deployment**: Docker, GCP Cloud Run, Artifact Registry

## 🏁 Getting Started

### 1. Prerequisites
- Node.js 20+
- PostgreSQL database (e.g., [Neon.tech](https://neon.tech))
- Groq API Key ([Groq Console](https://console.groq.com/))

### 2. Installation
```bash
git clone <your-repo>
# Now at root level - no need to cd into shopmind
npm install
```

### 3. Environment Setup
Create a `.env` file based on `.env.example`:
```env
DATABASE_URL="postgresql://..."
GROQ_API_KEY="your-groq-key"
NEXTAUTH_SECRET="your-random-secret"
NEXTAUTH_URL="http://localhost:3000"
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

Follow these steps to deploy ShopMind to Google Cloud Run:

1. **Build and Tag the Container**:
   ```bash
   gcloud builds submit --tag asia-south1-docker.pkg.dev/[PROJECT_ID]/shopmind-repo/shopmind:latest .
   ```

2. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy shopmind \
     --image asia-south1-docker.pkg.dev/[PROJECT_ID]/shopmind-repo/shopmind:latest \
     --platform managed \
     --region asia-south1 \
     --allow-unauthenticated \
     --set-env-vars="GROQ_API_KEY=[YOUR_KEY],DATABASE_URL=[YOUR_URL],NEXTAUTH_URL=[YOUR_APP_URL],NEXTAUTH_SECRET=[YOUR_SECRET]"
   ```

## 🧪 Testing
```bash
npm test
```

## 🌏 Internationalization
Toggle languages in the Navbar. Localization files are located in `/messages`.

## 📄 License
MIT
