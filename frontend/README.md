# Frontend - Meal Prep Planner

A modern, responsive Next.js frontend for the Meal Prep Planner application. This frontend helps Indian students abroad plan time-efficient, budget-friendly meals with home-style Indian food. The frontend integrates with the FastAPI backend to provide a seamless chat experience.

## Features

- 🍛 Specialized meal prep planning for Indian students abroad
- 🎨 Modern, clean UI with gradient background
- 💬 Real-time chat interface with message history
- 📱 Responsive design that works on all devices
- ⚡ Fast and efficient with Next.js 14
- 🔄 Automatic scrolling to latest messages
- ⌨️ Keyboard shortcuts (Enter to send, Shift+Enter for new line)
- 🎯 Loading states and error handling
- 🏠 Focus on home-style Indian comfort foods
- ⏰ Time-efficient meal prep for busy student schedules

## Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- Backend API running (see `/api/README.md` for backend setup)

## Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables (optional):**
   
   Create a `.env.local` file in the `frontend` directory if you need to customize the API URL:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
   
   **Note:** By default, the frontend will use Next.js rewrites to proxy API requests to `http://localhost:8000` during development. You only need to set this if your backend runs on a different port or URL.

## Running the Application

### Development Mode

1. **Start the backend server first** (from the project root):
   ```bash
   uv run uvicorn api.index:app --reload
   ```
   The backend should be running on `http://localhost:8000`

2. **Start the frontend development server** (from the `frontend` directory):
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000` to see the application.

   The frontend will automatically proxy API requests to the backend running on port 8000.

### Production Build

1. **Build the application:**
   ```bash
   npm run build
   # or
   yarn build
   # or
   pnpm build
   ```

2. **Start the production server:**
   ```bash
   npm start
   # or
   yarn start
   # or
   pnpm start
   ```

## Project Structure

```
frontend/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Main page component
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ChatInterface.tsx  # Main chat interface component
├── lib/                   # Utility functions
│   └── api.ts             # API client for backend communication
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── next.config.js         # Next.js configuration
```

## API Integration

The frontend communicates with the backend through the `/api/chat` endpoint:

- **Endpoint:** `POST /api/chat`
- **Request Body:**
  ```json
  {
    "message": "Your message here"
  }
  ```
- **Response:**
  ```json
  {
    "reply": "AI response here"
  }
  ```

The API client is located in `lib/api.ts` and handles all communication with the backend.

## Deployment on Vercel

This frontend is configured to work seamlessly with Vercel deployment:

1. **Push your code to GitHub**

2. **Connect your repository to Vercel:**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect Next.js

3. **Configure environment variables** (if needed):
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_API_URL` if your backend is hosted separately

4. **Deploy:**
   - Vercel will automatically build and deploy your frontend
   - The `vercel.json` in the project root handles routing for both frontend and backend

## Troubleshooting

### Frontend can't connect to backend

- **Check backend is running:** Make sure the backend is running on `http://localhost:8000`
- **Check CORS:** The backend should have CORS enabled (already configured in `api/index.py`)
- **Check API URL:** Verify the `NEXT_PUBLIC_API_URL` environment variable if you set one

### Build errors

- **Clear cache:** Try deleting `.next` folder and `node_modules`, then reinstall:
  ```bash
  rm -rf .next node_modules
  npm install
  ```

### Port already in use

- **Change port:** You can run the dev server on a different port:
  ```bash
  npm run dev -- -p 3001
  ```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **React 18** - UI library
- **CSS-in-JS** - Inline styles for component styling

## License

This project is part of The AI Engineer Challenge.
