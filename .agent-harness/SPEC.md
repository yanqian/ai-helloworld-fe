# AI Helloworld Frontend SPEC

## Project Minspec

### Goal

Maintain a recoverable React and TypeScript frontend for the AI Helloworld product. The frontend provides authenticated UI workflows for summarization, UV advice, Smart FAQ, and Upload & Ask, and it is paired with the Go backend in `/Users/armstrong/Project/ai-helloworld`.

### Scope Included

- Vite React application with routes for login, OAuth callback, summarizer, UV advisor, Smart FAQ, and Upload & Ask.
- Email/password auth UI, Google OAuth callback handling, local token persistence, refresh token retry, and logout.
- Shared HTTP client that attaches bearer tokens and refreshes sessions on 401 or 403 responses.
- Feature-specific API wrappers for backend `/api/v1` routes.
- Zustand state stores and UI components for each feature workflow.
- Vite development proxy from `/api` to the backend, with `VITE_API_BASE_URL` for deployed environments.
- Local and CI verification through TypeScript, Jest, linting, build, and the AI Agent Harness recovery protocol.

### Scope Excluded

- Backend business logic, persistence, LLM calls, object storage, OAuth provider exchange, or pgvector retrieval.
- Production hosting and Cloud Run deployment beyond frontend configuration contracts.
- Automatic commits, pushes, or provider-specific unattended agent execution without explicit configuration.

### Core Flows

- A user registers or logs in, the app stores access and refresh tokens, and protected routes become available.
- The app refreshes expired sessions through `/api/v1/auth/refresh` and retries failed authenticated requests.
- The summarizer page sends text and optional prompt guidance, then renders sync or streamed results.
- The UV Advisor page posts a date and renders normalized guidance, readings, timing, and token usage when present.
- The Smart FAQ page searches with a selected mode and shows trending recommendations.
- The Upload & Ask page uploads files with multipart form data, polls/list documents, asks questions, shows citations, and loads session history.
- A future agent resumes work by reading `AGENTS.md`, `.agent-harness/progress.md`, `.agent-harness/feature_list.json`, recent git history, and running `./init.sh`.

### Constraints

- The frontend must treat the Go backend API as the source of truth for business behavior.
- `VITE_API_BASE_URL` may be empty in local development so Vite proxy handles `/api` requests.
- Token values are currently stored in `localStorage`; changes to auth storage are security-sensitive and must preserve refresh behavior.
- Upload uses raw `fetch` with `FormData` rather than the JSON `HttpClient`.
- Verification from a fresh checkout may require `npm ci`, which needs network access unless dependencies are already cached.
- Verification must not rely on chat history or hidden agent memory.

### Ambiguities Or Assumptions

- The sibling backend path is assumed to be `/Users/armstrong/Project/ai-helloworld`.
- Browser-level smoke tests are not yet part of the default recovery path.
- API contract drift should be tracked in both repositories rather than patched ad hoc in one side.

### Required Capabilities

- Node.js and npm compatible with the checked-in package lock.
- Network or package cache for `npm ci` during fresh-checkout recovery.
- Optional local backend service at `http://localhost:8080` for live integration checks.
- Agent provider configuration before `make work` can run real unattended Coding Agent or Evaluator Agent adapters.

### Implementation Paths

- App entry and routes: `src/main.tsx`, `src/App.tsx`, and `src/AppRoutes.tsx`.
- Shared services and providers: `src/services`, `src/providers`, and `src/utils/env.ts`.
- Feature UI and state: `src/features`.
- Common layout and controls: `src/components`.
- Styling: `src/styles`, `tailwind.config.ts`, and `postcss.config.cjs`.
- Tests: `src/**/*.test.ts`, `src/**/*.test.tsx`, and Jest setup.
- Harness state: `.agent-harness/SPEC.md`, `.agent-harness/feature_list.json`, `.agent-harness/progress.md`, `.agent-harness/runs/`, and root `AGENTS.md` / `init.sh`.

### Verification Surface

- `./init.sh` for harness recovery until F001 upgrades it to frontend recovery.
- `npm run typecheck`, `npm run test`, and `npm run build` for deterministic frontend verification.
- `npm run lint` when ESLint configuration is present and dependencies are installed.
- Future browser smoke checks for login gating, route rendering, and one mocked feature flow.

## Feature Decomposition

Feature count is determined by independently verifiable behavior and capability boundaries, not by how much text the user wrote. Planning must split broad requirements into multiple features when there are separate user-visible behaviors, required capabilities, implementation boundaries, risk domains, or verification surfaces.

- F001 covers frontend recovery because it changes the root startup contract and dependency verification path.
- F002 covers auth/session behavior because token refresh is shared infrastructure for all protected workflows.
- F003 covers Upload & Ask because multipart upload, citation rendering, and session history use a separate transport and state path.
- F004 covers cross-repository API drift because backend response fields and frontend types must stay aligned.

## Harness Governance

### Skill Assisted Workflow

The AI Agent Harness skill is a convenience layer for initializing, repairing, planning, implementing, evaluating, and committing approved work while the repository remains the durable source of truth. This project must preserve the template's vendor-neutral boundary: `skills/ai-agent-harness/` is embedded for recovery, but durable state remains in `AGENTS.md`, `.agent-harness/SPEC.md`, `.agent-harness/feature_list.json`, `.agent-harness/progress.md`, `.agent-harness/docs/`, `.agent-harness/runs/`, and git history.

Initialization supports `new`, `adopt`, `repair`, and `check` modes, installation layouts, the default `hidden` layout, root `AGENTS.md` and `init.sh` as thin entry points, `visible` layout for template-maintenance work, version drift handling, and semantically valid state checks. installed skill usage is preferred; Manual `python3 skills/.../init_harness.py` commands are a repository-checkout or vendor-neutral fallback usage path.

### New Project Flow

The New Project Flow provides a visual map from skill invocation through minspec input, SPEC normalization, feature decomposition, runnable skeleton, provider setup, `make work`, evaluator pass, root `./init.sh`, and approved commit. Human inputs include the project location, clarification for ambiguous requirements, provider choice, permission for real agent work, and approved commit boundaries.

### Project Recovery Init

root `./init.sh` is the project recovery entry point. In hidden layout, `.agent-harness/scripts/init.sh` verifies harness health, while root `./init.sh` starts as a thin wrapper before a minspec exists. After a minspec is accepted, a runnable-skeleton feature must make root `./init.sh` install or verify dependencies, run project-owned checks or smoke tests, emit clear logs, and exit non-zero on failure. Harness verification alone must not be treated as project completion.

### Spec Normalization

Spec Normalization is required before planning feature entries. New requirements must capture goal, included scope, excluded scope, core flows, constraints, ambiguities or assumptions, required capabilities, implementation paths, and verification surface. Vague requirements must not become executable features without clarification, recorded assumptions, or a durable capability/blocker/follow-up.

### Evaluator Evidence

Completed features must have durable evaluator evidence. From the evaluator-evidence baseline onward, `status=done` and `passes=true` are valid only when a run record contains `EVAL_PASS: Fxxx` for that feature.

### Feature-Linked Commits

Approved feature commits must start with `Fxxx <Action> <concise summary>` and reference feature IDs that exist in `feature_list.json`. Use `No-feature:` only for explicitly non-feature work.
