# Google OAuth Frontend

## Summary
Frontend implementation for Google OAuth login entry and callback handling. Issue: https://github.com/yanqian/ai-helloworld-fe/issues/1

## Goals
- Add a "Continue with Google" entry point on the existing login/register page.
- Initiate OAuth login by redirecting to the backend authorization endpoint.
- Handle the post-auth redirect by persisting the session and navigating to the app.
- Provide clear error messaging and a retry path.
- Gate the feature behind a frontend config flag for safe rollout.

## Non-Goals
- Implementing backend OAuth logic or token storage.
- Account linking beyond what backend provides.
- Replacing email/password auth or changing the current session model.

## Background / Context
The frontend currently supports email/password login with tokens stored in `localStorage` via `AuthProvider`. The backend is adding Google OAuth endpoints and will initiate a redirect-based flow. The frontend must provide a UI entry point, initiate the redirect, and consume the callback to establish a local session.

## Proposed Design
- UI/UX
  - Add a secondary button to `AuthPage` labeled "Continue with Google".
  - Place the button above the email/password form, separated by a divider.
  - Show a loading state while redirecting.
  - If OAuth fails, surface the error near the top of the card with a retry CTA.
- Flow
  - When the user clicks the Google button, store the intended return path in `sessionStorage` (e.g., current pathname or `location.state.from`).
  - Redirect the browser to `${apiBaseUrl}/auth/google/login` (exact path to confirm).
  - Backend completes OAuth and redirects back to a new route like `/oauth/callback`.
  - `OAuthCallbackPage` parses query params:
    - `token`, `refreshToken`, `email`, `nickname` on success.
    - `error` on failure.
  - On success, call `login()` to persist the session and navigate to the saved return path or `/`.
  - On failure, navigate back to `/login` with a user-friendly error message.
- Feature flag
  - Add `VITE_GOOGLE_OAUTH_ENABLED` env and default to off in production until backend is ready.

## Data / API Changes
- New frontend route: `/oauth/callback`.
- New backend contract for callback redirect:
  - Success: tokens and user profile in query params or fragment.
  - Failure: `error` param with a short user-safe message.
- If query parameters are not acceptable for tokens, introduce a one-time `session_code` that the frontend exchanges for tokens using a new API endpoint.

## Security / Privacy
- Prefer a one-time session code or URL fragment to avoid tokens in server logs.
- Ensure the OAuth `state` parameter is validated by backend; frontend stores and verifies `state` if required.
- Avoid logging full query strings in client-side analytics.

## Rollout Plan
- Land the UI behind `VITE_GOOGLE_OAUTH_ENABLED`.
- Enable in staging once the backend callback contract is finalized.
- Gradually enable in production after manual verification.

## Test Plan
- Manual: click Google button and verify redirect to OAuth provider.
- Manual: complete OAuth flow and confirm the app is authenticated and navigates correctly.
- Manual: force a failed callback and ensure the error is surfaced with a retry.
- Optional: component tests for rendering and feature flag behavior.

## Open Questions
- Confirm the exact auth start endpoint path (e.g., `/auth/google/login` vs `/api/v1/auth/google/login`).
- Confirm callback contract: tokens in query vs fragment vs one-time session code exchange.
- Confirm the post-auth landing route and desired UX when `location.state.from` is unavailable.
