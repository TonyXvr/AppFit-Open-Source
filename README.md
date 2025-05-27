# AppFit - AI-Powered No-Code Development Platform

AppFit is an innovative no-code development platform that is heavily inspired by Bolt.diy! Thank you to the team that built Bolt.diy! In true open source fashion, I have opened it to the public and I hope you can give me a star :)
AppFit is a project that combines AI-powered code generation with educational features to help users build applications while learning programming concepts.

## 🚀 Features

- **AI-Powered Code Generation**: Generate full-stack applications using multiple AI providers
- **Educational Learning System**: Vibe Learning tab with project-specific tutorials and micro-lessons
- **Visual UI Generation**: Create UI previews and wireframes with AI assistance
- **Customer Persona Chat**: Simulate conversations with AI-powered customer personas
- **Multi-Provider AI Support**: Support for OpenAI, Anthropic, Google, and many other AI providers
- **Real-time Collaboration**: Built-in terminal, file editor, and project management
- **Cross-Platform Deployment**: Deploy to various platforms including Cloudflare, Netlify, and more

## 📋 Prerequisites

- Node.js 18+ and pnpm
- A Supabase account (for authentication and data storage)
- At least one AI provider API key (OpenAI recommended)

## 🛠️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/appfit.git
cd appfit
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

Copy the example environment file and configure your API keys:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual API keys and configuration values.

### 4. Required API Keys

#### OpenAI API Key (Recommended)
1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and add it to your `.env.local`:
   ```
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```

#### Supabase Configuration (Required)
1. Create a new project at [Supabase](https://supabase.com/)
2. Go to Project Settings → API
3. Copy your project URL and anon key:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key-here
   ```
4. Set up the database schema by running the SQL in `supabase/schema.sql`

### 5. Optional API Keys

AppFit supports multiple AI providers. Add any of these optional keys to enhance functionality:

- **Anthropic Claude**: Get from [Anthropic Console](https://console.anthropic.com/)
- **Google Gemini**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Groq**: Get from [Groq Console](https://console.groq.com/keys)
- **HuggingFace**: Get from [HuggingFace Tokens](https://huggingface.co/settings/tokens)

### 6. Start Development Server

```bash
pnpm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Configuration Options

### AI Provider Configuration

AppFit supports multiple AI providers. Configure them in your `.env.local`:

```bash
# Primary providers
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
GOOGLE_GENERATIVE_AI_API_KEY=your-google-key

# Additional providers
GROQ_API_KEY=your-groq-key
HuggingFace_API_KEY=your-huggingface-key
TOGETHER_API_KEY=your-together-key
```

### Local AI Providers

For local AI instances:

```bash
# Ollama (local)
OLLAMA_API_BASE_URL=http://localhost:11434

# LM Studio (local)
LMSTUDIO_API_BASE_URL=http://localhost:1234/v1
```

### Analytics Configuration

Optional analytics integration:

```bash
# Google Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Cloudflare Web Analytics
CLOUDFLARE_ANALYTICS_TOKEN=your-token-here
```

## 🚀 Deployment

### Cloudflare Pages

1. Build the project:
   ```bash
   pnpm run build
   ```

2. Deploy to Cloudflare Pages with build command:
   ```bash
   pnpm install --no-frozen-lockfile && pnpm run build
   ```

3. Add environment variables in the Cloudflare dashboard

### Netlify

1. Connect your repository to Netlify
2. Set build command: `pnpm install && pnpm run build`
3. Set publish directory: `build`
4. Add environment variables in Netlify dashboard

### Docker

Build and run with Docker:

```bash
# Development
docker-compose up app-dev

# Production
docker-compose up app-prod
```

## 📚 Usage Guide

### Getting Started

1. **Set up your API keys** in the settings panel
2. **Create a new project** or import an existing one
3. **Use the AI chat** to describe what you want to build
4. **Review and edit** the generated code
5. **Deploy your application** to your preferred platform

### Key Features

#### Vibe Learning
- Access project-specific tutorials and explanations
- Learn programming concepts as you build
- Get AI-powered explanations of generated code

#### Customer Personas
- Create AI-powered customer personas
- Simulate conversations to understand user perspectives
- Get feedback on your product ideas

#### UI Generation
- Generate visual UI previews and wireframes
- Iterate on designs with AI assistance
- Export designs to code

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check our [docs](docs/) folder for detailed guides
- **Issues**: Report bugs or request features via [GitHub Issues](https://github.com/your-username/appfit/issues)
- **Discussions**: Join our [GitHub Discussions](https://github.com/your-username/appfit/discussions)

## 🙏 Acknowledgments

- Built with [Remix](https://remix.run/) and [React](https://reactjs.org/)
- AI integration powered by [Vercel AI SDK](https://sdk.vercel.ai/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styling with [UnoCSS](https://unocss.dev/)

---

**Note**: This is an open-source project. Please ensure you comply with the terms of service of any AI providers you use.