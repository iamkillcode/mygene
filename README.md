# MyGene Online App

Preserving legacies, one profile at a time. MyGene helps you create, share, and remember the stories of your loved ones.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Firebase project
- Google AI API key

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` with your actual values:

   **Firebase Configuration:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing one
   - Go to Project Settings > General > Your apps
   - Copy the configuration values

   **Google AI API Key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to `GOOGLE_GENAI_API_KEY`

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start Genkit development server
- `npm run genkit:watch` - Start Genkit in watch mode

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable UI components
├── contexts/           # React contexts (auth, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
└── ai/                 # AI/Genkit flows and configurations
```

## Features

- 🔐 Firebase Authentication
- 👥 Profile Management for deceased family members
- 🤖 AI-powered ancestor Q&A using Google Genkit
- 🌍 Geolocation-based country sections
- 📱 Responsive design with Tailwind CSS
- 🎨 Modern UI with Radix UI components

To get started with development, take a look at `src/app/page.tsx`.
