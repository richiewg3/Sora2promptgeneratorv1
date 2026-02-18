# SoraPro — Video Prompt Engineering Middleware

A full-stack Next.js (App Router) application that takes a user's reference image and text idea, analyzes visual details, and upscales the idea into a highly detailed, professional prompt for the Sora 2 video generator.

## Features

- **Single Mode** — Upload 1 reference image + 1 text idea to generate 1 master video prompt
- **Batch Mode** — Upload multiple images and/or import a CSV of ideas to generate multiple prompts
- **Professional cinematographic language** — Camera movements, lighting architecture, action beats, audio specs
- **Dark glassmorphism UI** — Premium design with the custom Material 3 color palette
- **Vercel AI Gateway** — Routes through `ai-gateway.vercel.sh` using the `openai/gpt-5.2` model

## Getting Started

### Prerequisites

- Node.js 18+
- An `AI_GATEWAY_API_KEY` environment variable for the Vercel AI Gateway

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create a `.env.local` file:

```
AI_GATEWAY_API_KEY=your-api-key-here
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 with custom dark theme
- **AI**: Vercel AI SDK (`ai` + `@ai-sdk/openai`) via Vercel AI Gateway
- **Model**: `openai/gpt-5.2`
