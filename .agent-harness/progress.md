# Progress

## Current System Status

AI Agent Harness 0.3.3 is installed in hidden layout for the frontend repository. The harness self-check passes after adding the embedded skill template assets required by contract tests.

The frontend minspec has been added to `.agent-harness/SPEC.md`. Feature state tracks recovery and contract work instead of treating historical product code as already evaluator-gated harness work.

F001 is complete: root `./init.sh` now runs harness verification, verifies Node.js and npm, installs dependencies with `npm ci` when `node_modules` is absent, verifies installed top-level dependencies, and runs typecheck, Jest, and production build checks.

F002 is complete: auth session contract tests now verify unauthenticated protected-route redirects, bearer-token attachment plus refresh retry in the HTTP client, refresh failure clearing stored auth state, and Google OAuth callback parsing for `token`, `refreshToken`, `email`, and `nickname` with return-path navigation.

## Last Completed Feature

F002 Auth session contract coverage.

## Next Feature

F003 Upload Ask UI contract coverage.

## Known Issues

- `npm audit` currently reports 18 dependency vulnerabilities from the existing dependency graph; dependency remediation is out of scope for F001.
- Browser-level smoke tests are not yet part of the default recovery path.
- `agent-provider.json` is not configured, so orchestrated `make work` should fail closed until a provider is selected.
- The sibling backend repository is `/Users/armstrong/Project/ai-helloworld` and needs matching contract awareness.
