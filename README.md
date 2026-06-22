# NEXUS-AI

A modern, multi-model AI chat interface with intelligent intent routing and specialized tool execution.

## ✨ Features

- 🤖 **Multi-Model Support**: OpenAI GPT, Anthropic Claude, Google Gemini
- 🎨 **Image Generation**: DALL-E 3 integration
- 💻 **Code Execution**: Run Python, JavaScript, Java, C++ via Judge0
- 🔍 **Web Search**: Real-time search with Serper API
- 🔊 **Text-to-Speech**: OpenAI TTS voice synthesis
- 🎯 **Intent Classification**: Automatic routing to specialized tools
- 🔐 **Secure**: Supabase Edge Functions keep API keys server-side
- 💾 **Persistent Storage**: Chat history in PostgreSQL database
- 📱 **Responsive Design**: Beautiful UI with animated backgrounds

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works great)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/-NEXUS-AI.git
cd -NEXUS-AI
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Supabase** (Recommended)

Follow the detailed guide in [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) to:
- Create a Supabase project
- Run database migrations
- Deploy Edge Functions
- Configure API keys securely

4. **Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Supabase (recommended)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Legacy mode (if not using Supabase)
VITE_OPENAI_API_KEY=sk-...
VITE_ANTHROPIC_API_KEY=sk-ant-...
# etc.
```

5. **Start development server**

```bash
npm run dev
```

Open http://localhost:5173

## 🏗️ Architecture

```
┌─────────────┐
│   React UI  │
└──────┬──────┘
       │
       ↓
┌──────────────────┐
│ Intent Classifier │ ← Determines user intent (conversation/image/code/search/tts)
└──────┬───────────┘
       │
       ↓
┌────────────────────────────────────────┐
│      Supabase Edge Functions           │
│  ┌─────────────────────────────────┐  │
│  │ chat      → OpenAI/Anthropic/   │  │
│  │              Google APIs         │  │
│  │ image-gen → DALL-E 3             │  │
│  │ code-exec → Judge0               │  │
│  │ web-search → Serper              │  │
│  │ tts       → OpenAI TTS           │  │
│  └─────────────────────────────────┘  │
└────────────────────────────────────────┘
       │
       ↓
┌──────────────────┐
│ PostgreSQL DB    │ ← Stores sessions & messages
└──────────────────┘
```

### Key Components

- **Frontend** (`src/`)
  - `pages/` - Route components (Chat, Settings, Dashboard, etc.)
  - `components/` - UI components (chat, layout, results)
  - `lib/` - Services (API routing, storage, intent classification)
  - `store/` - Zustand state management
  - `hooks/` - Custom React hooks

- **Backend** (`supabase/`)
  - `functions/` - Edge Functions (serverless API proxies)
  - `migrations/` - Database schema

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State**: Zustand + React Query
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **AI APIs**: OpenAI, Anthropic, Google AI
- **Tools**: Judge0, Serper, DALL-E 3

## 📝 Usage

### Basic Chat

Just type a message and NEXUS will route it to the appropriate model.

### Generate Images

```
Create an image of a futuristic city at sunset
```

### Execute Code

```
Write and run Python code to calculate fibonacci numbers
```

### Web Search

```
What are the latest developments in quantum computing?
```

### Text-to-Speech

```
Read this text aloud: "Hello, I am NEXUS AI"
```

## 🔒 Security

- ✅ API keys stored server-side in Supabase Edge Functions
- ✅ Row-level security (RLS) on database tables
- ✅ No API keys exposed to browser
- ✅ CORS handled by Edge Functions
- ⚠️ Legacy mode (direct API calls) available but not recommended for production

## 🚧 Roadmap

- [ ] Error boundaries for better crash handling
- [ ] File upload support
- [ ] "Reasoning" mode implementation
- [ ] "Deep Research" mode implementation
- [ ] User authentication & multi-device sync
- [ ] Message virtualization for performance
- [ ] API key validation UI
- [ ] Unit tests
- [ ] Docker deployment

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- OpenAI for GPT & DALL-E APIs
- Anthropic for Claude API
- Google for Gemini API
- Supabase for backend infrastructure
- Judge0 for code execution
- Serper for search API

---

**Built with ❤️ by the NEXUS-AI team**
