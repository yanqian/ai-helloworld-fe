# Shared API Contract

The sibling backend repository is `/Users/armstrong/Project/ai-helloworld`.

This document records frontend expectations for backend JSON fields. Keep it aligned with `/Users/armstrong/Project/ai-helloworld/docs/api-contract.md` when either repository changes shared API shapes.

## Shared Surfaces

- Auth: `/api/v1/auth/register`, `/api/v1/auth/login`, `/api/v1/auth/refresh`, `/api/v1/auth/me`, `/api/v1/auth/logout`, `/api/v1/auth/google/login`, `/api/v1/auth/google/callback`.
- Summarizer: `/api/v1/summaries`, `/api/v1/summaries/stream`.
- UV advisor: `/api/v1/uv-advice`.
- Smart FAQ: `/api/v1/faq/search`, `/api/v1/faq/trending`.
- Upload & Ask: `/api/v1/upload-ask/documents`, `/api/v1/upload-ask/documents/:id`, `/api/v1/upload-ask/qa/query`, `/api/v1/upload-ask/qa/sessions`, `/api/v1/upload-ask/qa/sessions/:id/logs`.

## Contract Fields

- `refreshToken`: returned by login/refresh and sent to `/api/v1/auth/refresh`; stored locally as `authRefreshToken`.
- `durationMs`: optional request duration shown by request stats components.
- `tokenUsage`: optional usage object with `promptTokens`, optional `completionTokens`, and `totalTokens`.
- `sessionId`: Upload & Ask selected QA session identifier used in ask responses and query logs.
- `partial_summary`: backend SSE field for summarizer streaming; `src/features/summarizer/api.ts` normalizes it to `partialSummary`.
- `documentId`, `chunkIndex`, `score`, `preview`: Upload & Ask citation fields.
- `failureReason`: optional Upload & Ask document processing failure detail.

## Drift Guard

- `src/features/summarizer/__tests__/api.test.ts` verifies the frontend accepts backend `partial_summary` SSE frames.
- Upload & Ask component tests exercise mocked document, session, log, answer, latency, and citation fields.
- Backend `TestFrontendContractJSONFields` reflects over Go structs and fails if contract-sensitive JSON tags are renamed.
- Run `./init.sh` in this frontend repository and in the backend repository after shared API contract changes.
