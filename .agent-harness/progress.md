# Progress

## Current System Status

AI Agent Harness 0.3.3 is installed in hidden layout for the frontend repository. The harness self-check passes after adding the embedded skill template assets required by contract tests.

The frontend minspec has been added to `.agent-harness/SPEC.md`. Feature state tracks recovery and contract work instead of treating historical product code as already evaluator-gated harness work.

F001 is complete: root `./init.sh` now runs harness verification, verifies Node.js and npm, installs dependencies with `npm ci` when `node_modules` is absent, verifies installed top-level dependencies, and runs typecheck, Jest, and production build checks.

F002 is complete: auth session contract tests now verify unauthenticated protected-route redirects, bearer-token attachment plus refresh retry in the HTTP client, refresh failure clearing stored auth state, and Google OAuth callback parsing for `token`, `refreshToken`, `email`, and `nickname` with return-path navigation.

F003 is complete: Upload & Ask UI contract coverage now verifies multipart uploads send Authorization with FormData and no forced JSON content header, response types include backend document/session/history fields, store resolution preserves answer/session/latency/history-token/citation fields, and ask/history errors are surfaced without corrupting existing answer or logs.

F004 is complete: frontend contract notes record the sibling backend path `/Users/armstrong/Project/ai-helloworld`, shared API surfaces, contract-sensitive fields, and drift guards. Backend matching notes and JSON tag drift verification are committed in sibling backend commit `e6d6528`.

F005 is complete: the Upload & Ask ask flow now preserves the freshly returned answer, sources, latency, and session id while refreshing sessions and session history through a non-destructive post-ask history load. Orchestrated Coding Agent and Evaluator evidence is recorded in `.agent-harness/runs/20260615T032907Z-F005-preserve-upload-ask-current-answer.md`.

## Last Completed Feature

F005 Preserve Upload Ask current answer after history refresh.

## Next Feature

None.

## Known Issues

- `npm audit` currently reports 18 dependency vulnerabilities from the existing dependency graph; dependency remediation is out of scope for F001.
- Browser-level smoke tests are not yet part of the default recovery path.
- `agent-provider.json` is configured locally for Codex-driven orchestrator work, but it remains untracked local environment configuration.
- The sibling backend repository is `/Users/armstrong/Project/ai-helloworld`; matching contract awareness is complete in backend commit `e6d6528`.
