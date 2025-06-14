# YT Transcriber & Assistant

Transcribe the YouTube videos and ask questions about their content.

Paste the link of a YouTube video, automatically fetch its full transcript, and then engage in a conversation with an AI assistant to get insights, summaries, or answers to specific questions about the video.

## Features

- **YouTube Video Transcription**: Extracts captions/subtitles from any public YouTube video.
- **Q&A**: Currently uses OpenAI's `gpt-4o-mini` to answer questions based on the video's transcript.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (version 18.x or later)
- [pnpm](https://pnpm.io/installation)

### 1. Clone the repository

```bash
git clone https://github.com/sarthak-g-git/yt-transcriber.git
cd yt-transcriber
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a file named `.env.local` in the root of the project and add the following variables:

```
OPENAI_API_KEY="your-openai-api-key"
TAVILY_API_KEY="your-tavily-api-key"
```

You need to get your API keys from [OpenAI](https://platform.openai.com/api-keys) and [Tavily AI](https://app.tavily.com/sign-in).

### 4. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can now paste a YouTube video URL to get started.
