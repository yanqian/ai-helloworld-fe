# F007 Clarify Hidden Layout Skill Workflow Reference Path

## Context

The embedded AI Agent Harness skill said to read `references/workflows.md`, which can be mistaken as a repository-root path in hidden layout. The file exists in the skill directory:

- `.agent-harness/skills/ai-agent-harness/references/workflows.md`

The embedded template also includes the same skill copy, so both copies needed the same clarification.

## Implementation

- Updated `.agent-harness/skills/ai-agent-harness/SKILL.md`.
- Updated `.agent-harness/skills/ai-agent-harness/assets/template/skills/ai-agent-harness/SKILL.md`.
- The docs now say to resolve `references/workflows.md` relative to the `SKILL.md` file and explicitly name the hidden-layout embedded path.
- No workflow behavior, orchestrator behavior, schemas, or harness file paths were changed.

## Verification

- `rg -n 'For planning, one-feature work, evaluation, continuation, and final commit rules, read `references/workflows.md`|repository root.*references/workflows|references/workflows\\.md' .agent-harness/skills/ai-agent-harness/SKILL.md .agent-harness/skills/ai-agent-harness/assets/template/skills/ai-agent-harness/SKILL.md`
  - Confirmed only corrected wording remains in the embedded skill copies.
- `./init.sh`
  - Passed.
  - Harness state validated 7 features.
  - Frontend typecheck passed.
  - Jest passed: 13 suites, 24 tests.
  - Production build passed.

## Evaluation

EVAL_PASS: F007
