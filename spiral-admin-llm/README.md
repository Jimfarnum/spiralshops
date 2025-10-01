# SPIRAL Admin LLM

A standalone AI-powered admin system for the SPIRAL platform that provides intelligent insights for shoppers, retailers, and malls.

## 🚀 Quick Start

1. **Create new Replit project** → Select Node.js
2. **Copy this project structure** into your Replit workspace
3. **Set up environment secrets** in Replit Secrets:
   ```
   CLOUDANT_URL=your-cloudant-url
   CLOUDANT_APIKEY=your-cloudant-apikey
   OPENAI_API_KEY=sk-your-key
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Run in development:**
   ```bash
   npm run dev
   ```

## 📡 API Endpoints

- `GET /health` - Health check
- `GET /about` - About SPIRAL narrative content
- `POST /event` - Ingest shopping events
- `GET /admin/insights/:storeId` - Get AI insights for a store

## 🤖 Weekly Insights

Run automated AI insights generation:
```bash
npm run cron:insights
```

## 🌐 Integration

The `/about` endpoint provides the narrative content that can be integrated into the main SPIRAL platform.

## 📊 Supported LLM Providers

- OpenAI GPT-4
- IBM WatsonX
- Local LLM endpoints

## 🔧 Environment Variables

See `.env.example` for all required configuration options.