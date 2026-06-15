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

## Upload Ask Current Answer Persistence

### Goal

Fix the Upload & Ask question flow so a successful `/api/v1/upload-ask/qa/query` response remains visible in the current Answer panel after the app refreshes session history.

### Scope Included

- Preserve the current `answer`, `sources`, `latencyMs`, and selected `sessionId` immediately after a successful ask response.
- Continue refreshing the session list and selected session history after a successful ask.
- Keep manual session selection behavior intact: selecting a different session may clear the current answer preview and load that session's history.
- Add regression coverage for the successful ask flow where the backend returns an answer and history refresh also succeeds.

### Scope Excluded

- Backend API changes, Upload & Ask retrieval quality changes, or LLM prompt changes.
- Redesigning the Upload & Ask layout or session history UI.
- Browser-level end-to-end smoke tests; mocked React/Jest coverage is sufficient for this bugfix.
- Changing auth, document upload, or citation rendering contracts beyond preserving the existing returned fields.

### Core Flows

- A signed-in user asks a question scoped to one or more processed documents.
- The backend returns `sessionId`, `answer`, `sources`, `latencyMs`, and optional history-token metadata.
- The Answer panel displays the returned answer and citations immediately.
- The frontend refreshes sessions and session logs without clearing the just-returned answer.
- The session history panel shows the persisted query log for the same session.

### Constraints

- The frontend must not depend on a live backend for default verification.
- Existing `selectSession` semantics for explicit user-driven session changes should remain unchanged.
- Existing ask error behavior must still avoid corrupting previously visible answers and logs.
- The implementation must stay within Upload & Ask frontend state/hook/test paths.

### Ambiguities Or Assumptions

- The observed bug is caused by treating post-ask history refresh like an explicit user session selection, which clears the current answer state.
- The desired UX is that automatic post-ask session/log refresh is non-destructive to the current answer card.
- Manual session selection can continue to clear the current answer because it represents navigating to a historical session rather than showing the freshly returned response.

### Required Capabilities

- Jest and React Testing Library for mocked hook/component verification.
- Existing Upload & Ask API mocks; no live backend, credentials, or browser automation required.
- Orchestrator/provider configuration is required for real unattended `make work`; if unavailable, it must be recorded as a capability gap before any manual fallback.

### Implementation Paths

- Upload & Ask hook: `src/features/uploadAsk/hooks/useUploadAsk.ts`.
- Upload & Ask store and API contract tests: `src/features/uploadAsk/__tests__/`.
- Harness state and run evidence: `.agent-harness/feature_list.json`, `.agent-harness/progress.md`, and `.agent-harness/runs/`.

### Verification Surface

- A focused Jest regression test proving `askQuestion` leaves `answer` visible after refreshing sessions and logs.
- Existing Upload & Ask store/API/component tests.
- `npm run typecheck`, `npm run test`, and root `./init.sh`.

### Decomposition Decision

This remains one feature because it is a single UI state regression with one implementation boundary (`Upload & Ask` frontend hook/state) and one verification surface (mocked frontend tests plus recovery checks). Splitting would create entries without independent user value.

## CI Deployment Trigger Control

### Goal

Keep frontend CI useful for local-project verification while preventing pushes to `main` from automatically building and deploying the frontend to Google Cloud.

### Scope Included

- Preserve CI build verification for pushes, pull requests, and manual workflow dispatch.
- Preserve the existing Google Cloud authentication, Cloud Build image push, and Cloud Run deployment steps as an explicit manual capability.
- Require a `workflow_dispatch` input before the deploy job can push an image or deploy to Cloud Run.
- Record the observed failed GitHub Actions deployment run and the new deployment policy in harness evidence.

### Scope Excluded

- Creating or repairing the missing Artifact Registry repository `fe-repo`.
- Removing Google Cloud deployment support, secrets, variables, Dockerfile, or Cloud Run configuration.
- Changing frontend application behavior, backend contracts, or runtime environment values.

### Core Flows

- A push to `main` runs the build job and stops without authenticating to Google Cloud, invoking Cloud Build, pushing an image, or deploying Cloud Run.
- A pull request runs build verification and does not deploy.
- A maintainer can still run the workflow manually and opt in to `deploy_to_gcp` to execute the preserved deployment job.

### Constraints

- The repository is currently treated as a local frontend project, so routine CI must not depend on cloud infrastructure existing.
- The failed run `27531728587` showed `build` passing and `deploy` failing because Artifact Registry repository `fe-repo` was not found during image push.
- Deployment capability should remain recoverable without reintroducing automatic push deployments.

### Ambiguities Or Assumptions

- Manual dispatch with an explicit boolean opt-in is the intended future deployment path if cloud deployment is needed again.
- The `main` branch should keep receiving CI build signal even when no cloud resources are provisioned.

### Required Capabilities

- GitHub Actions workflow syntax that supports boolean `workflow_dispatch` inputs.
- Existing repository secrets and variables remain sufficient for manual deployment if the Google Cloud project is restored.
- Local verification can inspect workflow YAML and run root `./init.sh`; it does not need live GCP access.

### Implementation Paths

- GitHub Actions workflow: `.github/workflows/ci-cd.yml`.
- Harness state and evidence: `.agent-harness/SPEC.md`, `.agent-harness/feature_list.json`, `.agent-harness/progress.md`, and `.agent-harness/runs/`.

### Verification Surface

- Inspect `.github/workflows/ci-cd.yml` to confirm `deploy` runs only for `workflow_dispatch` with `deploy_to_gcp` set to true.
- Parse the workflow YAML locally.
- Run root `./init.sh`.

### Decomposition Decision

This is one feature because it changes one CI operational policy with one implementation surface and one verification surface. It is separate from harness skill documentation because that fix affects agent workflow recovery rather than frontend deployment behavior.

## Embedded Harness Skill Workflow Reference

### Goal

Correct the embedded AI Agent Harness skill documentation so agents can find `references/workflows.md` in hidden-layout repositories.

### Scope Included

- Clarify that `references/workflows.md` is resolved relative to the skill's own `SKILL.md`.
- Name the hidden-layout embedded path `.agent-harness/skills/ai-agent-harness/references/workflows.md`.
- Update both the embedded skill copy and its embedded template copy so future repair or template use carries the same guidance.

### Scope Excluded

- Changing workflow behavior, orchestrator behavior, or harness state schemas.
- Editing the globally installed user skill outside this repository.
- Reinstalling or upgrading the harness package.

### Core Flows

- An agent reads `.agent-harness/skills/ai-agent-harness/SKILL.md` and follows the correct local workflow reference path.
- A future embedded-template consumer receives the same corrected instruction.

### Constraints

- Hidden layout keeps the repository-local skill copy under `.agent-harness/skills/ai-agent-harness/`, not at repository root.
- The correction must not move files or break harness contract checks that expect the reference file to exist.

### Ambiguities Or Assumptions

- The requested "skill upgrade" applies to the repository-embedded skill and template copy because those are project-owned writable paths.
- The globally installed skill may still need the same wording in a separate installation/update step outside this repository.

### Required Capabilities

- Text-only documentation edits inside the repository.
- Root `./init.sh` for harness contract verification.

### Implementation Paths

- Embedded skill: `.agent-harness/skills/ai-agent-harness/SKILL.md`.
- Embedded template skill: `.agent-harness/skills/ai-agent-harness/assets/template/skills/ai-agent-harness/SKILL.md`.
- Harness state and evidence: `.agent-harness/feature_list.json`, `.agent-harness/progress.md`, and `.agent-harness/runs/`.

### Verification Surface

- `rg` inspection for stale ambiguous `references/workflows.md` wording.
- Root `./init.sh` harness and project recovery verification.

### Decomposition Decision

This is separate from CI deployment control because it improves agent workflow guidance, not application CI behavior. It remains a single feature because both edited files are copies of the same skill instruction.

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
