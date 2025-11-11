# AI Helloworld Frontend

Modern React + TypeScript UI for the `ai-helloworld` summarizer backend. It follows the Codex Specification v2 with strict typing, DI-friendly services, and complete CI coverage.

## Features

- Input a paragraph and optional prompt override.
- One-click sync summary with keywords.
- Streaming mode that shows incremental summary text directly in the result panel.
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
│   └── summarizer/     # Summarizer UI, hooks, store
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

Set `VITE_API_BASE_URL` to reference the Go backend (`/api/v1/summaries` and `/api/v1/summaries/stream`). Requests inherit the backend's structured errors and propagate them to the UI with friendly messaging.

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