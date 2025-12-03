# AI Helloworld Frontend

Modern React + TypeScript UI for the `ai-helloworld` summarizer + UV advisor backend. It follows the Codex Specification v2 with strict typing, DI-friendly services, and complete CI coverage.

## Features

- Input a paragraph and optional prompt override.
- One-click sync summary with keywords.
- Streaming mode that shows incremental summary text directly in the result panel.
- UV advisor page that fetches Singapore UV data and produces AI-driven outfit/protection guidance.
- Smart FAQ explorer with four search strategies (exact, semantic hash, similarity, hybrid) plus live top-search recommendations backed by the backend cache.
- Upload & Ask: upload documents, run pgvector-powered similarity search, and ask questions with citation-linked answers. Citations are numbered in-line; a collapsible list lets you expand long previews and see the full source.
- Authentication page that lets users register/login with a nickname (≤10 letters), stores JWT + refresh tokens in `localStorage`, and silently refreshes access tokens in the background.
- Central logging + HTTP client abstraction for observability and testability.
- Tailwind-powered responsive layout optimized for desktop + tablet.
- Jest + Testing Library for component and hook coverage.

## Getting Started

```bash
cd ai-helloworld-fe
npm install

# Start the dev server on http://localhost:5173
npm run dev
```

During development you can rely on the built-in Vite proxy (no `.env` required). The UI will call `/api/v1/...` and Vite forwards those requests to `http://localhost:8080`. If your backend lives elsewhere (e.g. a staging domain), create a `.env` file and set:

```
VITE_API_BASE_URL=https://staging.example.com
```

### Production builds

For Cloud Run (or any hosted build), copy `.env.production.example` to `.env.production` and set `VITE_API_BASE_URL` to the deployed backend (for example, your Cloud Run URL). The variable is baked into the bundle during `npm run build`.

## Available Scripts

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `npm run dev`  | Launch Vite dev server               |
| `npm run build`| Type-check + production build        |
| `npm run test` | Run Jest unit/component tests        |
| `npm run lint` | ESLint using Codex rules             |
| `npm run check`| Lint + typecheck + tests             |

## Project Layout

Key directories (see `codex-spec-v2.md` for the full spec):

```
src/
├── components/         # Common + layout components
├── features/
│   ├── summarizer/     # Summarizer UI, hooks, store
│   └── uvAdvisor/      # UV planner UI, hooks, store
├── providers/          # DI context wiring
├── services/           # HTTP + logging abstractions
├── styles/             # Tailwind + theme tokens
└── utils/              # Environment helpers
```

## Testing

The project uses **Jest + Testing Library**. Tests live next to the modules they cover under `__tests__` folders or `*.test.ts(x)` files.

```
npm run test
```

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs lint, tests, and build on every push/PR. The job mirrors the manual `npm run check` routine.

## Backend Integration

Set `VITE_API_BASE_URL` to reference the Go backend (`/api/v1/auth/*`, `/api/v1/summaries`, `/api/v1/summaries/stream`, `/api/v1/uv-advice`, `/api/v1/faq/*`). The auth page registers users (email/password/nickname) and logs in to fetch both an access token and refresh token. The HTTP client automatically attaches `Authorization: Bearer <token>` to every call and, if it receives a 401/403, it exchanges the stored refresh token via `/api/v1/auth/refresh` before retrying. Requests inherit the backend's structured errors and propagate them to the UI with friendly messaging.

### Authentication UX

1. Visit `/login`, choose **Register**, and provide an email, password (≥8 chars), and nickname (letters only, max 10). Successful registration flips the form back to login.
2. On **Login** the app stores `authToken`, `authRefreshToken`, `authEmail`, and `authNickname` in `localStorage`, then redirects to the dashboard.
3. The header shows `nickname` (fallback to email) along with the logout action, which clears stored credentials and navigates back to `/login`.

### Prompt Overrides

The backend requires responses that include `SUMMARY:` and `KEYWORDS:` blocks. The UI always prepends those format instructions, then appends whatever you type into the prompt field as additional guidance. This ensures overrides such as “summarize with a concise statement” keep the contract intact and avoids `chatgpt response malformed` errors.

## Production Checklist

- ✅ Strict TypeScript config
- ✅ Centralized error handling + logging
- ✅ Components <150 LOC organized by feature
- ✅ Streaming + sync flows share the same API contract
- ✅ Tests guard store + UI behavior
- ✅ CI enforces lint, typecheck, and tests before deploy

Happy shipping!
