# F006 Make GCP Frontend Deployment Explicitly Manual

## Context

User reported failed GitHub Actions run:

- `https://github.com/yanqian/ai-helloworld-fe/actions/runs/27531728587`
- Workflow: `Frontend CI/CD`
- Event: `push`
- Branch: `main`
- Head SHA: `f5825bbc9e4e28efe8d5d8f36270abbd14033927`

`gh run view 27531728587 --repo yanqian/ai-helloworld-fe --json name,workflowName,conclusion,status,url,event,headBranch,headSha,jobs` showed:

- `build`: success
- `deploy`: failure
- Failed step: `Build and push image via Cloud Build`

`gh run view 27531728587 --repo yanqian/ai-helloworld-fe --job 81371330220 --log` showed the deploy job repeatedly failed while pushing:

```text
name unknown: Repository "fe-repo" not found
ERROR: failed to push because we ran out of retries.
ERROR: error pushing image "asia-southeast1-docker.pkg.dev/ai-helloworld-yan/fe-repo/summarizer-fe:f5825bbc9e4e28efe8d5d8f36270abbd14033927": retry budget exhausted (10 attempts): step exited with non-zero status: 1
```

The requested policy is to keep this repository as a local frontend project, preserve cloud deployment capability, and stop routine CI from actively pushing to GCP.

## Implementation

- Updated `.github/workflows/ci-cd.yml` so `workflow_dispatch` has an explicit boolean `deploy_to_gcp` input.
- Changed the `deploy` job condition from automatic `push` on `main` to manual dispatch with `deploy_to_gcp == true`.
- Preserved the Google Cloud authentication, Cloud Build image push, `.env.production` cleanup, and Cloud Run deployment steps.
- Added normalized SPEC and feature state for the policy change.

## Verification

- `ruby -e 'require "yaml"; YAML.load_file(".github/workflows/ci-cd.yml"); puts "workflow yaml ok"'`
  - Passed.
- `jq type .agent-harness/feature_list.json`
  - Passed.
- `./init.sh`
  - Passed.
  - Harness state validated 7 features.
  - Frontend typecheck passed.
  - Jest passed: 13 suites, 24 tests.
  - Production build passed.

`actionlint` was not installed locally, so workflow validation used YAML parsing and inspection.

## Evaluation

EVAL_PASS: F006
